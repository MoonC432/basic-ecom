from rest_framework import serializers
from .models import UserAccount
from django.contrib.auth.tokens import PasswordResetTokenGenerator
from django.utils.encoding import force_str,  DjangoUnicodeDecodeError
from django.utils.http import urlsafe_base64_decode

from rest_framework.exceptions import AuthenticationFailed
from rest_framework_simplejwt.tokens import RefreshToken, TokenError
from rest_framework import status


class UserAccountSerializer(serializers.ModelSerializer):
    password2 = serializers.CharField(
        style={'input-type': 'password'}, write_only=True)

    class Meta:
        model = UserAccount
        fields = ['email', 'password', 'password2',
                  'first_name', 'last_name', 'id']
        extra_kwargs = {
            'password': {'write_only': True}
        }

    def save(self):
        account = UserAccount(
            email=self.validated_data['email'],
            first_name=self.validated_data['first_name'],
            last_name=self.validated_data['last_name'])

        password = self.validated_data['password']
        password2 = self.validated_data['password2']
        if password != password2:
            raise serializers.ValidationError(
                "Passwords must match.", code="Invalid")
        elif len(password) < 6:
            raise serializers.ValidationError(
                "Password Cannot Be Less Than 6 Digits.", code="Invalid")
        account.set_password(password)
        account.save()
        return account


class ChangePasswordSerializer(serializers.Serializer):
    model = UserAccount

    """
    Serializer for password change endpoint.
    """
    old_password = serializers.CharField(required=True)
    new_password = serializers.CharField(required=True)
    confirm_password = serializers.CharField(required=True)


class SetNewPasswordSerializer(serializers.Serializer):
    password = serializers.CharField(
        min_length=6, max_length=68, write_only=True)
    password2 = serializers.CharField(
        min_length=6, max_length=68, write_only=True)
    token = serializers.CharField(
        min_length=1, write_only=True)
    uidb64 = serializers.CharField(
        min_length=1, write_only=True)

    class Meta:
        fields = ['password', 'password2', 'token', 'uidb64']

    def validate(self, attrs):

        password = attrs.get('password')
        password2 = attrs.get('password2')
        token = attrs.get('token')
        uidb64 = attrs.get('uidb64')

        id = force_str(urlsafe_base64_decode(uidb64))
        user = UserAccount.objects.get(id=id)

        if password != password2:
            raise serializers.ValidationError(
                "Passwords Does not match.", code=status.HTTP_400_BAD_REQUEST)

        elif not PasswordResetTokenGenerator().check_token(user, token):
            raise AuthenticationFailed(
                'The reset link is invalid', code=status.HTTP_401_UNAUTHORIZED)

        user.set_password(password)
        user.save()

        return (user)
