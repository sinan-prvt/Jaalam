import logging

import razorpay
from django.conf import settings
from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
from . import plans
from .models import Subscription, User
from .subscriptions import activate_subscription, switch_to_free
from websites.models import PhysicalOrder

logger = logging.getLogger(__name__)
razorpay_client = razorpay.Client(auth=(settings.RAZORPAY_KEY_ID, settings.RAZORPAY_KEY_SECRET))

class SubscriptionViewSet(viewsets.ViewSet):
    permission_classes = [permissions.IsAuthenticated]

    @action(detail=False, methods=['get'], permission_classes=[permissions.AllowAny], authentication_classes=[])
    def plans(self, request):
        """Public plan catalog (prices, limits, features) used by the Pricing page."""
        return Response({'plans': plans.catalog(), 'grace_days': plans.GRACE_DAYS})

    @action(detail=False, methods=['post'])
    def create_order(self, request):
        plan_type = request.data.get('plan_type')
        period = (request.data.get('billing_period') or 'MONTHLY').upper()
        if plan_type not in plans.PLANS:
            return Response({'error': 'Invalid plan type'}, status=status.HTTP_400_BAD_REQUEST)
        if period not in plans.PERIOD_DAYS:
            return Response({'error': 'Invalid billing period'}, status=status.HTTP_400_BAD_REQUEST)

        if getattr(request.user, 'role', '') == 'CLIENT':
            # A client login uses its agency's plan; paying here would buy nothing
            return Response({'error': "Your plan comes from your agency. Ask them to upgrade."}, status=status.HTTP_403_FORBIDDEN)

        amount = plans.price_paise(plan_type, period)

        if amount == 0:
            # Free plan (also used to finish onboarding)
            switch_to_free(request.user)
            return Response({'status': 'success', 'plan': plan_type})

        if not settings.RAZORPAY_KEY_ID or not settings.RAZORPAY_KEY_SECRET:
            return Response({'error': 'Payments are not configured on the server.'}, status=status.HTTP_503_SERVICE_UNAVAILABLE)

        try:
            razorpay_order = razorpay_client.order.create({
                "amount": amount,
                "currency": "INR",
                "payment_capture": "1",
                "notes": {"user_id": str(request.user.id), "plan": plan_type, "period": period},
            })
            Subscription.objects.create(
                user=request.user,
                plan_type=plan_type,
                billing_period=period,
                razorpay_order_id=razorpay_order['id'],
                amount=amount / 100
            )
            return Response({
                'order_id': razorpay_order['id'],
                'amount': amount,
                'currency': 'INR',
                'key': settings.RAZORPAY_KEY_ID,
                'plan_name': plans.PLANS[plan_type]['name'],
                'billing_period': period,
            })
        except Exception:
            # (The raw error used to be shown to the user, leaking server details.)
            logger.exception('Could not create the Razorpay order')
            return Response({'error': 'Could not start the payment. Please try again.'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    @action(detail=False, methods=['post'])
    def verify_payment(self, request):
        payment_id = request.data.get('razorpay_payment_id')
        order_id = request.data.get('razorpay_order_id')
        signature = request.data.get('razorpay_signature')
        try:
            razorpay_client.utility.verify_payment_signature({
                'razorpay_order_id': order_id,
                'razorpay_payment_id': payment_id,
                'razorpay_signature': signature
            })
        except Exception:
            return Response({'error': 'Payment verification failed.'}, status=status.HTTP_400_BAD_REQUEST)

        # The order must belong to this user: a valid payment can't upgrade someone else,
        # and replaying it is harmless because activation is idempotent.
        subscription = Subscription.objects.filter(razorpay_order_id=order_id, user=request.user).first()
        if not subscription:
            return Response({'error': 'Order not found.'}, status=status.HTTP_404_NOT_FOUND)
        activate_subscription(subscription, payment_id)
        return Response({'status': 'success', 'plan': plans.plan_summary(User.objects.get(pk=request.user.pk))})

    @action(detail=False, methods=['post'], permission_classes=[permissions.AllowAny], authentication_classes=[])
    def webhook(self, request):
        """Razorpay webhook (payment.captured / order.paid): activates plans even if the
        customer closed the browser before the checkout callback ran.
        Configure in Razorpay > Webhooks with RAZORPAY_WEBHOOK_SECRET."""
        secret = getattr(settings, 'RAZORPAY_WEBHOOK_SECRET', '')
        signature = request.headers.get('X-Razorpay-Signature', '')
        if not secret:
            return Response(status=status.HTTP_503_SERVICE_UNAVAILABLE)
        try:
            razorpay_client.utility.verify_webhook_signature(request.body.decode(), signature, secret)
        except Exception:
            return Response(status=status.HTTP_400_BAD_REQUEST)

        payload = request.data.get('payload', {})
        payment = (payload.get('payment') or {}).get('entity') or {}
        order_id = payment.get('order_id') or ((payload.get('order') or {}).get('entity') or {}).get('id')
        if request.data.get('event') in ('payment.captured', 'order.paid') and order_id:
            subscription = Subscription.objects.filter(razorpay_order_id=order_id).first()
            if subscription:
                activate_subscription(subscription, payment.get('id'))
        return Response({'status': 'ok'})

    @action(detail=False, methods=['post'])
    def create_physical_order(self, request):
        order_id = request.data.get('order_id') # The ID of the PhysicalOrder
        amount = 10000 # 100 INR in paise
        
        try:
            order = PhysicalOrder.objects.get(id=order_id, user=request.user)
            
            razorpay_order = razorpay_client.order.create({
                "amount": amount,
                "currency": "INR",
                "payment_capture": "1"
            })
            
            order.razorpay_order_id = razorpay_order['id']
            order.save()
            
            return Response({
                'order_id': razorpay_order['id'],
                'amount': amount,
                'currency': 'INR',
                'key': settings.RAZORPAY_KEY_ID
            })
        except PhysicalOrder.DoesNotExist:
            return Response({'error': 'Order not found.'}, status=status.HTTP_404_NOT_FOUND)
        except Exception:
            logger.exception('Could not create the sticker payment')
            return Response({'error': 'Could not start the payment. Please try again.'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    @action(detail=False, methods=['post'])
    def verify_physical_order(self, request):
        try:
            payment_id = request.data.get('razorpay_payment_id')
            order_id = request.data.get('razorpay_order_id')
            signature = request.data.get('razorpay_signature')

            params_dict = {
                'razorpay_order_id': order_id,
                'razorpay_payment_id': payment_id,
                'razorpay_signature': signature
            }
            razorpay_client.utility.verify_payment_signature(params_dict)
            
            order = PhysicalOrder.objects.get(razorpay_order_id=order_id, user=request.user)
            order.razorpay_payment_id = payment_id
            order.payment_status = 'PAID'
            order.save()
            
            return Response({'status': 'success'})
        except Exception:
            logger.exception('Sticker payment check failed')
            return Response({'error': 'Payment verification failed.'}, status=status.HTTP_400_BAD_REQUEST)
