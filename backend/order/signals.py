from django.db.models.signals import post_save
from django.dispatch import receiver
from order.models import Order
from payment.views import reduce_from_stock


@receiver(post_save, sender=Order)
def update_stock_after_paid(sender, instance, created, **kwargs):
    if not created:
        if instance.paid:
            reduce_from_stock(instance)
