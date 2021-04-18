from decouple import config
import json
from rest_framework.authentication import TokenAuthentication
from rest_framework.response import Response
from rest_framework import generics, status
from rest_framework.permissions import IsAuthenticated
from rest_framework.authentication import TokenAuthentication

from order.models import Order
from product.models import Product
from order.models import ProductOrderList


import paypalrestsdk
import razorpay


# Create your views here.

def after_payment_verified(saved_order_instance):
    try:
        # change paid stauts here
        saved_order_instance.paid = True
        saved_order_instance.save()

        # reduce products from stock

        product_list_instances = ProductOrderList.objects.filter(
            order_details=saved_order_instance.id)
        for product in product_list_instances:
            product_instance = Product.objects.get(id=product.product.id)
            product_instance.stock -= product.quantity
            product_instance.save()

        return True
    except:
        return False


paypalrestsdk.configure({
    "mode": "sandbox",  # sandbox or live
    "client_id": config('PAYPAL_CLIENT_ID'),
    "client_secret": config('PAYPAL_SECRET_ID')})


class PaypalExecute(generics.GenericAPIView):
    permission_classes = (IsAuthenticated,)
    authentication_classes = (TokenAuthentication,)

    def get(self, request, *args, **kwargs):
        pay_id = request.GET.get('paymentId', '')
        payer_id = request.GET.get('PayerID', '')

        payment = paypalrestsdk.Payment.find(pay_id)

        order_id = int(payment['transactions'][0]['custom'])
        order_instance = Order.objects.get(id=order_id)

        if float(order_instance.total_amt) == float(payment['transactions'][0]['amount']['total']):
            if payment.execute({"payer_id": payer_id}):
                print("Payment execute successfully")
                order_instance.paid = True
                order_instance.save()
                return Response({'response': "Payment executed successfully"}, status=status.HTTP_200_OK)
            else:
                print(payment.error)  # Error Hash

        return Response({'error': "Invalid payment! Amount does not match."}, status=status.HTTP_409_CONFLICT)


class RazorpayVerification(generics.GenericAPIView):

    permission_classes = (IsAuthenticated,)
    authentication_classes = (TokenAuthentication,)

    def post(self, request, *args, **kwargs):
        payload = json.loads(request.body)
        saved_order_instance = Order.objects.get(id=payload['order_id'])
        if request.user != saved_order_instance.user:
            return Response({"error": "Invalid user"}, status=status.HTTP_401_UNAUTHORIZED)

        # generating and comparing the payment signature

        client = razorpay.Client(
            auth=(config("RAZORPAY_KEY_ID"), config("RAZORPAY_SECRET_ID")))

        params_dict = {
            'razorpay_order_id': saved_order_instance.generated_id,
            'razorpay_payment_id': payload['razorpay_payment_id'],
            'razorpay_signature': payload['razorpay_signature']
        }
        verified = client.utility.verify_payment_signature(
            params_dict)  # returns None when successful and 0 when failed
        if verified:
            return Response({"error": "Invalid Payment Signature. Verification Failed"}, status=status.HTTP_402_PAYMENT_REQUIRED)

        if after_payment_verified(saved_order_instance):
            return Response({"response": "Successfully verified"}, status=status.HTTP_200_OK)
