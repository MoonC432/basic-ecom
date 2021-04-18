from django.urls import path
from .views import PaypalExecute, RazorpayVerification

urlpatterns = [
    path('paypal/execute/', PaypalExecute.as_view(), name="paypal_execute"),
    path('razorpay/verify/', RazorpayVerification.as_view(), name="razorpay_verify"),
]
