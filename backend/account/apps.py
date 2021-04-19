from django.apps import AppConfig


class AccountConfig(AppConfig):
    name = 'account'
    label = 'user_account'

    def ready(self):
        import account.signals
