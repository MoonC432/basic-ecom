from account.models import UserAccount
from django.dispatch import receiver
from django.conf import settings
from django.db.models.signals import post_save
from rest_framework.authtoken.models import Token
from allauth.account.models import EmailAddress


@receiver(post_save, sender=settings.AUTH_USER_MODEL)
def create_auth_token(sender, instance=None, created=False, **kwargs):
    if created:
        Token.objects.create(user=instance)


@receiver(post_save, sender=EmailAddress)
def set_active_user(sender, instance, created, **kwargs):
    if created and instance.verified:
        user = instance.user
        user.is_active = True
        user.save()
