import razorpay
from django.conf import settings
from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import Subscription, User
from websites.models import PhysicalOrder

razorpay_client = razorpay.Client(auth=(settings.RAZORPAY_KEY_ID, settings.RAZORPAY_KEY_SECRET))

class SubscriptionViewSet(viewsets.ViewSet):
    permission_classes = [permissions.IsAuthenticated]

    PLAN_PRICES = {
        'TEST': 0,
        'STARTER': 19900, # paise
        'BUSINESS': 49900,
        'PREMIUM': 99900,
    }

    @action(detail=False, methods=['post'])
    def create_order(self, request):
        plan_type = request.data.get('plan_type')
        if plan_type not in self.PLAN_PRICES:
            return Response({'error': 'Invalid plan type'}, status=status.HTTP_400_BAD_REQUEST)
        
        amount = self.PLAN_PRICES[plan_type]
        
        if amount == 0:
            # Handle free tier
            user = request.user
            user.membership = plan_type
            user.has_completed_onboarding = True
            user.save()
            return Response({'status': 'success', 'plan': plan_type})
            
        try:
            # Create Razorpay Order
            razorpay_order = razorpay_client.order.create({
                "amount": amount,
                "currency": "INR",
                "payment_capture": "1"
            })
            
            # Create Subscription record
            subscription = Subscription.objects.create(
                user=request.user,
                plan_type=plan_type,
                razorpay_order_id=razorpay_order['id'],
                amount=amount / 100
            )
            
            return Response({
                'order_id': razorpay_order['id'],
                'amount': amount,
                'currency': 'INR',
                'key': settings.RAZORPAY_KEY_ID
            })
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    @action(detail=False, methods=['post'])
    def verify_payment(self, request):
        try:
            payment_id = request.data.get('razorpay_payment_id')
            order_id = request.data.get('razorpay_order_id')
            signature = request.data.get('razorpay_signature')

            # Verify signature
            params_dict = {
                'razorpay_order_id': order_id,
                'razorpay_payment_id': payment_id,
                'razorpay_signature': signature
            }
            razorpay_client.utility.verify_payment_signature(params_dict)
            
            # Update Subscription & User
            subscription = Subscription.objects.get(razorpay_order_id=order_id)
            subscription.razorpay_payment_id = payment_id
            subscription.status = 'SUCCESS'
            subscription.save()
            
            user = request.user
            user.membership = subscription.plan_type
            user.has_completed_onboarding = True
            user.save()
            
            return Response({'status': 'success'})
        except Exception as e:
            # Mark as failed if necessary
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)

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
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

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
            
            order = PhysicalOrder.objects.get(razorpay_order_id=order_id)
            order.razorpay_payment_id = payment_id
            order.payment_status = 'PAID'
            order.save()
            
            return Response({'status': 'success'})
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)
