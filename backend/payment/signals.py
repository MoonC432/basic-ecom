from django.db.models.signals import post_save
from django.dispatch import receiver
from order.models import Order
import razorpay
# from decouple import config
import os

client = razorpay.Client(
    auth=(os.environ.get("RAZORPAY_KEY_ID"), os.environ.get("RAZORPAY_SECRET_ID")))


@receiver(post_save, sender=Order)
def create_razorpay_order(sender, instance, created, **kwargs):

    if created and instance.payment_method == str.lower("razorpay"):
        # create an order to razorpay api

        razorpay_order = client.order.create(
            {"amount": instance.total_amt * 100,  # amount in subunits
                "currency": "INR",
                "receipt": str(instance.id),
                "notes": {
                    "address": instance.address,
                    "phone": instance.phone
                }}
        )
        instance.generated_id = razorpay_order['id']
        instance.save()
