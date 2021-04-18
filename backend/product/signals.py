from django.db.models.aggregates import Avg
from .models import Feedback
from django.dispatch import receiver
from django.db.models.signals import post_save


@receiver(post_save, sender=Feedback)
def update_product_rating(sender, instance, created, **kwargs):

    new_rating = Feedback.objects.filter(
        product=instance.product).aggregate(Avg('rating'))

    instance.product.rating = new_rating['rating__avg']
    instance.product.save()
