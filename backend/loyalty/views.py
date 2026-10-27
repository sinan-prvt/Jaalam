import hashlib
import hmac
import math
import time
from datetime import timedelta

from django.conf import settings
from django.db import IntegrityError, transaction
from django.db.models import Count, Q, Sum
from django.shortcuts import get_object_or_404
from django.utils import timezone
from rest_framework import permissions, status
from rest_framework.decorators import api_view, authentication_classes, permission_classes, throttle_classes
from rest_framework.response import Response
from rest_framework.throttling import AnonRateThrottle

from customers.models import Activity, Customer
from customers.views import notify_site_team, site_name
from users.plans import LOYALTY, has_feature, required_plan_for
from websites.models import Website
from .models import LoyaltyCard, LoyaltyProgram, StampEvent, new_counter_key
from .serializers import JoinSerializer, LoyaltyProgramSerializer, SelfStampSerializer, normalize_phone


def can_manage(user, website):
    """The site's owner (or agency), its client login, or an admin."""
    return bool(user and user.is_authenticated and (
        user.is_superuser or website.user_id == user.id or website.client_id == user.id))


def program_enabled(program):
    return program.is_active and has_feature(program.website.user, LOYALTY)


def public_program(program):
    website = program.website
    data = LoyaltyProgramSerializer(program).data
    for private in ('latitude', 'longitude', 'radius_m'):
        data.pop(private)
    return {'business': site_name(website), 'slug': website.slug, **data}


# --- Self-scan: the counter screen's changing code -------------------------------------

TOKEN_SECONDS = 30
TOKEN_GRACE_WINDOWS = 4  # the code shown up to ~2 minutes ago still works (slow scans, slow phones)


def _window(now=None):
    return int((now or time.time()) // TOKEN_SECONDS)


def counter_token(program, window=None):
    """Short code for one 30-second window, signed so only the server can make one."""
    window = _window() if window is None else window
    message = f'loyalty:{program.pk}:{program.counter_key}:{window}'.encode()
    return hmac.new(settings.SECRET_KEY.encode(), message, hashlib.sha256).hexdigest()[:12]


def token_is_current(program, token):
    now = _window()
    return any(hmac.compare_digest(counter_token(program, now - back), token or '') for back in range(TOKEN_GRACE_WINDOWS + 1))


MAX_CODE_TRIES = 5  # wrong codes per card per day before it is locked until tomorrow


def daily_code(program, day=None):
    """Today's 4-digit code: the cashier says it after payment. New every day (and whenever
    the owner taps "New code now", which changes counter_key)."""
    day = day or timezone.localdate()
    message = f'loyalty-code:{program.pk}:{program.counter_key}:{day.isoformat()}'.encode()
    number = int(hmac.new(settings.SECRET_KEY.encode(), message, hashlib.sha256).hexdigest(), 16) % 10000
    return f'{number:04d}'


def check_daily_code(card, pin):
    """Returns an error response for a wrong or locked code, else None. Counts wrong tries."""
    today = timezone.localdate()
    fails = card.code_fails if card.code_fail_date == today else 0
    if fails >= MAX_CODE_TRIES:
        return Response({'detail': 'Too many wrong codes today. Ask the cashier for help.', 'locked': True},
                        status=status.HTTP_400_BAD_REQUEST)
    if hmac.compare_digest(daily_code(card.program), (pin or '').strip()):
        return None
    card.code_fails, card.code_fail_date = fails + 1, today
    card.save(update_fields=['code_fails', 'code_fail_date'])
    left = MAX_CODE_TRIES - card.code_fails
    detail = (f'Wrong code. {left} tr{"ies" if left > 1 else "y"} left today.' if left
              else 'Too many wrong codes today. Ask the cashier for help.')
    return Response({'detail': detail, 'wrong_code': True, 'locked': not left}, status=status.HTTP_400_BAD_REQUEST)


def distance_m(lat1, lng1, lat2, lng2):
    """Metres between two GPS points (haversine)."""
    r = 6371000
    p1, p2 = math.radians(lat1), math.radians(lat2)
    dp, dl = math.radians(lat2 - lat1), math.radians(lng2 - lng1)
    a = math.sin(dp / 2) ** 2 + math.cos(p1) * math.cos(p2) * math.sin(dl / 2) ** 2
    return 2 * r * math.asin(math.sqrt(a))


class LoyaltyThrottle(AnonRateThrottle):
    # Customers on the shop's Wi-Fi share one IP, so this is looser than the lead form
    scope = 'loyalty'


def add_stamp(card, user=None, self_scan=False):
    """Stamp a locked card. Returns an error message, or None when stamped."""
    program = card.program
    if card.reward_ready:
        return ('Your card is full! Ask at the counter for your reward.' if self_scan
                else 'This card is full. Give the reward first.')
    if stamps_today(card) >= program.max_stamps_per_day:
        if self_scan:
            return "You already got today's stamp. See you next time!"
        limit = program.max_stamps_per_day
        return f'Already stamped {limit} time{"s" if limit > 1 else ""} today.'
    card.stamps += 1
    card.last_stamp_at = timezone.now()
    card.save(update_fields=['stamps', 'last_stamp_at'])
    StampEvent.objects.create(card=card, kind='STAMP', by_user=user, self_scan=self_scan)
    if card.reward_ready:
        Activity.objects.create(customer=card.customer, kind='NOTE', text=f'Loyalty card full: {program.reward} is ready')
    return None


def stamps_today(card):
    today = timezone.localdate()
    events = card.events.filter(created_at__date=today)
    return max(0, events.filter(kind='STAMP').count() - events.filter(kind='UNDO').count())


def card_payload(card, user=None):
    program = card.program
    data = {
        'code': card.code,
        'name': card.customer.name,
        'stamps': card.stamps,
        'stamps_required': program.stamps_required,
        'reward_ready': card.reward_ready,
        'rewards_redeemed': card.rewards_redeemed,
        'joined': card.created_at,
        'last_stamp_at': card.last_stamp_at,
        'program': public_program(program),
        'active': program_enabled(program),
        'can_manage': can_manage(user, program.website),
    }
    if data['can_manage']:
        data.update({
            'phone': card.phone,
            'customer_id': card.customer_id,
            'stamps_today': stamps_today(card),
            'events': [
                {'kind': e.kind, 'at': e.created_at,
                 'by': e.by_user.username if e.by_user else ('self-scan' if e.self_scan else None)}
                for e in card.events.select_related('by_user')[:10]
            ],
        })
    return data


# --- Public: join page and the customer's own card -------------------------------------

@api_view(['GET'])
@permission_classes([permissions.AllowAny])
@authentication_classes([])
def public_program_view(request, slug):
    program = get_object_or_404(LoyaltyProgram.objects.select_related('website__content', 'website__user'), website__slug=slug)
    if not program_enabled(program) or program.website.is_blocked:
        return Response({'detail': 'This shop has no rewards card right now.'}, status=status.HTTP_404_NOT_FOUND)
    return Response(public_program(program))


@api_view(['POST'])
@permission_classes([permissions.AllowAny])
@authentication_classes([])  # public form: no session, so no CSRF token needed
@throttle_classes([LoyaltyThrottle])
def join_view(request, slug):
    program = get_object_or_404(LoyaltyProgram.objects.select_related('website__content', 'website__user'), website__slug=slug)
    if not program_enabled(program) or program.website.is_blocked:
        return Response({'detail': 'This shop has no rewards card right now.'}, status=status.HTTP_404_NOT_FOUND)
    serializer = JoinSerializer(data=request.data)
    serializer.is_valid(raise_exception=True)
    name, phone = serializer.validated_data['name'], serializer.validated_data['phone']

    # Same phone again (new phone, cleared browser): give back the card they already have.
    card = program.cards.select_related('customer').filter(phone=phone).first()
    if card:
        return Response({'code': card.code, 'existing': True})

    website = program.website
    try:
        with transaction.atomic():
            customer = Customer.objects.create(
                website=website, name=name, phone=phone, whatsapp=phone,
                source='LOYALTY', status='COMPLETED',
                message=f'Joined the rewards card ({program.reward} after {program.stamps_required} stamps).',
            )
            Activity.objects.create(customer=customer, kind='NOTE', text='Joined the loyalty card')
            card = LoyaltyCard.objects.create(program=program, customer=customer, phone=phone)
    except IntegrityError:
        # Two taps at once: the other request made the card.
        card = program.cards.get(phone=phone)
        return Response({'code': card.code, 'existing': True})

    notify_site_team(
        website, f'{name} joined your rewards card',
        f'{name} ({phone}) joined the {site_name(website)} rewards card.', 'new_lead',
    )
    return Response({'code': card.code, 'existing': False}, status=status.HTTP_201_CREATED)


@api_view(['GET'])
@permission_classes([permissions.AllowAny])
def card_view(request, code):
    """The card page. Anyone with the code sees the stamps; staff also get the controls."""
    card = get_object_or_404(
        LoyaltyCard.objects.select_related('customer', 'program__website__content', 'program__website__user'), code=code)
    return Response(card_payload(card, request.user))


# --- Staff: stamp, give the reward, undo ----------------------------------------------

def _staff_card(request, code):
    """Lock the card for the update; returns (card, error_response)."""
    card = get_object_or_404(
        # Lock only the card row: Postgres can't lock the optional (outer-joined) site content
        LoyaltyCard.objects.select_for_update(of=('self',)).select_related('customer', 'program__website__content', 'program__website__user'),
        code=code)
    if not can_manage(request.user, card.program.website):
        return None, Response({'detail': 'Only this shop can stamp its cards.'}, status=status.HTTP_403_FORBIDDEN)
    if not program_enabled(card.program):
        return None, Response({'detail': 'The rewards card is switched off for this shop.'}, status=status.HTTP_400_BAD_REQUEST)
    return card, None


@api_view(['POST'])
@permission_classes([permissions.IsAuthenticated])
def stamp_view(request, code):
    with transaction.atomic():
        card, error = _staff_card(request, code)
        if error:
            return error
        problem = add_stamp(card, user=request.user)
    if problem:
        return Response({'detail': problem, 'card': card_payload(card, request.user)}, status=status.HTTP_400_BAD_REQUEST)
    return Response(card_payload(card, request.user))


@api_view(['POST'])
@permission_classes([permissions.AllowAny])
@authentication_classes([])
@throttle_classes([LoyaltyThrottle])
def self_stamp_view(request, slug):
    """The customer scanned at the shop: the counter screen's current code, or the printed
    QR from a phone that is at the shop. No staff needed."""
    serializer = SelfStampSerializer(data=request.data)
    serializer.is_valid(raise_exception=True)
    data = serializer.validated_data
    with transaction.atomic():
        card = (LoyaltyCard.objects.select_for_update(of=('self',))
                .select_related('customer', 'program__website__content', 'program__website__user')
                .filter(code=data['code'], program__website__slug=slug).first())
        if not card:
            return Response({'detail': 'Card not found for this shop. Join first.', 'join': True}, status=status.HTTP_404_NOT_FOUND)
        program = card.program
        if not program_enabled(program):
            return Response({'detail': 'This shop has paused its rewards card.'}, status=status.HTTP_400_BAD_REQUEST)

        if program.stamp_mode == 'CODE':
            if not (data.get('pin') or '').strip():
                return Response({'detail': "Enter today's code. The cashier will tell you after you pay.", 'need_code': True},
                                status=status.HTTP_400_BAD_REQUEST)
            wrong = check_daily_code(card, data.get('pin'))
            if wrong:
                return wrong
        elif program.stamp_mode == 'SCREEN':
            if not token_is_current(program, data.get('token')):
                return Response({'detail': 'This QR code has expired. Scan the code on the counter screen again.', 'expired': True},
                                status=status.HTTP_400_BAD_REQUEST)
        elif program.stamp_mode == 'PRINTED':
            lat, lng = data.get('latitude'), data.get('longitude')
            if lat is None or lng is None:
                return Response({'detail': 'Allow location so we can check you are at the shop.', 'need_location': True},
                                status=status.HTTP_400_BAD_REQUEST)
            if distance_m(lat, lng, program.latitude, program.longitude) > program.radius_m:
                return Response({'detail': 'You need to be at the shop to get a stamp.', 'too_far': True},
                                status=status.HTTP_400_BAD_REQUEST)
        else:
            return Response({'detail': 'Show your card at the counter: the staff will add your stamp.'},
                            status=status.HTTP_400_BAD_REQUEST)

        problem = add_stamp(card, self_scan=True)
    payload = card_payload(card)
    if problem:
        return Response({'detail': problem, 'card': payload, 'already': True}, status=status.HTTP_400_BAD_REQUEST)
    return Response({**payload, 'stamped': True})


@api_view(['GET'])
@permission_classes([permissions.AllowAny])
@authentication_classes([])
def counter_view(request, key):
    """The counter screen (an old phone or tablet at the till). Opened with its secret link;
    shows a QR that changes every 30 seconds, so a photo of it is useless at home."""
    program = get_object_or_404(LoyaltyProgram.objects.select_related('website__content', 'website__user'), counter_key=key)
    if not program_enabled(program) or program.website.is_blocked:
        return Response({'detail': 'The rewards card is switched off for this shop.'}, status=status.HTTP_404_NOT_FOUND)
    now = time.time()
    return Response({
        **public_program(program),
        'token': counter_token(program),
        'refresh_in': TOKEN_SECONDS - int(now % TOKEN_SECONDS),
    })


@api_view(['POST'])
@permission_classes([permissions.IsAuthenticated])
def redeem_view(request, code):
    with transaction.atomic():
        card, error = _staff_card(request, code)
        if error:
            return error
        program = card.program
        if not card.reward_ready:
            left = program.stamps_required - card.stamps
            return Response({'detail': f'{left} more stamp{"s" if left > 1 else ""} to go.', 'card': card_payload(card, request.user)},
                            status=status.HTTP_400_BAD_REQUEST)
        card.stamps -= program.stamps_required
        card.rewards_redeemed += 1
        card.save(update_fields=['stamps', 'rewards_redeemed'])
        StampEvent.objects.create(card=card, kind='REDEEM', by_user=request.user)
        Activity.objects.create(customer=card.customer, kind='NOTE', text=f'Loyalty reward given: {program.reward}')
    return Response(card_payload(card, request.user))


@api_view(['POST'])
@permission_classes([permissions.IsAuthenticated])
def undo_view(request, code):
    """Take back a stamp added by mistake."""
    with transaction.atomic():
        card, error = _staff_card(request, code)
        if error:
            return error
        if card.stamps == 0:
            return Response({'detail': 'There is no stamp to remove.', 'card': card_payload(card, request.user)},
                            status=status.HTTP_400_BAD_REQUEST)
        card.stamps -= 1
        card.save(update_fields=['stamps'])
        StampEvent.objects.create(card=card, kind='UNDO', by_user=request.user)
    return Response(card_payload(card, request.user))


# --- Dashboard: settings, stats, members ----------------------------------------------

def _managed_site(request, slug):
    website = get_object_or_404(Website.objects.select_related('user', 'client', 'content'), slug=slug)
    if not can_manage(request.user, website):
        return None, Response({'detail': 'Not your website.'}, status=status.HTTP_404_NOT_FOUND)
    return website, None


def site_stats(program):
    month_start = timezone.localdate().replace(day=1)
    events = StampEvent.objects.filter(card__program=program)
    totals = program.cards.aggregate(members=Count('id'), rewards=Sum('rewards_redeemed'))
    return {
        'members': totals['members'] or 0,
        'rewards_given': totals['rewards'] or 0,
        'ready_now': program.cards.filter(stamps__gte=program.stamps_required).count(),
        'active_30_days': program.cards.filter(last_stamp_at__gte=timezone.now() - timedelta(days=30)).count(),
        'stamps_this_month': (events.filter(kind='STAMP', created_at__date__gte=month_start).count()
                              - events.filter(kind='UNDO', created_at__date__gte=month_start).count()),
        'joined_this_month': program.cards.filter(created_at__date__gte=month_start).count(),
    }


def client_label(website):
    client = website.client
    if not client:
        return None
    return client.get_full_name() or client.username


@api_view(['GET'])
@permission_classes([permissions.IsAuthenticated])
def sites_overview_view(request):
    """Every website this login manages, with its card's status and numbers: the agency's
    "all shops" page (a client login sees just its own shops)."""
    user = request.user
    websites = Website.objects.select_related('user', 'client', 'content', 'loyalty').order_by('-id')
    websites = websites.filter(client=user) if getattr(user, 'role', 'AGENT') == 'CLIENT' else websites.filter(user=user)
    rows = []
    for website in websites:
        program = getattr(website, 'loyalty', None)
        rows.append({
            'slug': website.slug,
            'business': site_name(website),
            'business_type': website.business_type,
            'client': client_label(website),
            'allowed': has_feature(website.user, LOYALTY),
            'program': {
                'reward': program.reward,
                'stamps_required': program.stamps_required,
                'stamp_mode': program.stamp_mode,
                'is_active': program.is_active,
                'icon': program.icon,
                'color': program.color,
            } if program else None,
            'stats': site_stats(program) if program else None,
        })
    return Response(rows)


@api_view(['GET', 'PUT'])
@permission_classes([permissions.IsAuthenticated])
def site_program_view(request, slug):
    website, error = _managed_site(request, slug)
    if error:
        return error
    allowed = has_feature(website.user, LOYALTY)
    program = LoyaltyProgram.objects.filter(website=website).first()

    if request.method == 'PUT':
        if not allowed:
            return Response({'detail': f'Loyalty cards need the {required_plan_for(LOYALTY)} plan.', 'upgrade_required': True},
                            status=status.HTTP_403_FORBIDDEN)
        serializer = LoyaltyProgramSerializer(program, data=request.data, partial=program is not None)
        serializer.is_valid(raise_exception=True)
        program = serializer.save(website=website)

    return Response({
        'business': site_name(website),
        'slug': website.slug,
        'allowed': allowed,
        # A client login can't upgrade the owner's plan, so the page asks them to contact the owner
        'is_owner': request.user.is_superuser or website.user_id == request.user.id,
        'business_type': website.business_type,
        'client': client_label(website),
        'required_plan': required_plan_for(LOYALTY),
        'exists': program is not None,
        'counter_key': program.counter_key if program else None,
        'today_code': daily_code(program) if program else None,
        'program': LoyaltyProgramSerializer(program or LoyaltyProgram()).data,
        'stats': site_stats(program) if program else None,
    })


@api_view(['POST'])
@permission_classes([permissions.IsAuthenticated])
def reset_counter_view(request, slug):
    """New counter-screen link and a new today's code (the old tablet was lost, or the code
    got around); the old link and code stop working."""
    website, error = _managed_site(request, slug)
    if error:
        return error
    program = get_object_or_404(LoyaltyProgram, website=website)
    program.counter_key = new_counter_key()
    program.save(update_fields=['counter_key'])
    return Response({'counter_key': program.counter_key, 'today_code': daily_code(program)})


@api_view(['GET'])
@permission_classes([permissions.IsAuthenticated])
def site_members_view(request, slug):
    website, error = _managed_site(request, slug)
    if error:
        return error
    program = LoyaltyProgram.objects.filter(website=website).first()
    if not program:
        return Response([])
    cards = program.cards.select_related('customer')
    q = (request.query_params.get('q') or '').strip()
    if q:
        digits = normalize_phone(q) or ''.join(ch for ch in q if ch.isdigit())
        match = Q(customer__name__icontains=q) | Q(code=q)
        if digits:
            match |= Q(phone__contains=digits)
        cards = cards.filter(match)
    return Response([
        {
            'code': c.code,
            'name': c.customer.name,
            'phone': c.phone,
            'customer_id': c.customer_id,
            'stamps': c.stamps,
            'reward_ready': c.stamps >= program.stamps_required,
            'rewards_redeemed': c.rewards_redeemed,
            'last_stamp_at': c.last_stamp_at,
            'joined': c.created_at,
        }
        for c in cards[:100]
    ])
