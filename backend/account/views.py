from rest_framework.views import APIView
from .models import UserAccount
from .utils import Util
# from decouple import config
import os
from django.http import HttpResponseRedirect


from rest_framework import status, generics
from rest_framework.response import Response
from rest_framework.authtoken.models import Token
from rest_framework.permissions import IsAuthenticated
from rest_framework.authentication import TokenAuthentication

from .serializers import ChangePasswordSerializer, SetNewPasswordSerializer, UserAccountSerializer
from rest_framework.authtoken.views import ObtainAuthToken

from django.utils.http import urlsafe_base64_encode
from django.utils.encoding import smart_bytes
from django.contrib.auth.tokens import PasswordResetTokenGenerator
from django.contrib.auth import logout

from allauth.socialaccount.providers.google.views import GoogleOAuth2Adapter
from dj_rest_auth.registration.views import SocialAccountListView, SocialLoginView
from allauth.socialaccount.providers.oauth2.client import OAuth2Client
from allauth.socialaccount.models import SocialAccount
# Create your views here.


class Register(generics.GenericAPIView):

    def post(self, request, *args, **kwargs):

        serializer = UserAccountSerializer(data=request.data)
        data = {}
        if serializer.is_valid():
            account = serializer.save()
            
            Token.objects.create(user=account)
            # send an email verification
            SendEmailVerification().post(request=request)

            data['status'] = status.HTTP_200_OK
            data['response'] = 'Verify your email to activate your account.'

            return Response(data, status=data['status'])

        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class SendEmailVerification(APIView):
    def post(self, request):
        email = request.data['email']
        user = UserAccount.objects.get(email=email)
        token = Token.objects.get(user=user).key
        email_body = '''Hello, \nClick the link Below to activete your account. \n{}/account/verify-email/{}/'''.format(
            os.environ.get("SERVER_URL"), token)
        email_data = {
            'email_body': email_body,
            'to_email': email,
            'email_subject': 'Verify your Account.'
        }
        Util.send_email(email_data)
        return Response({"response": "Verification email resent"}, status=status.HTTP_200_OK)


class EmailVerification(APIView):

    def get(self, request, token):
        user = Token.objects.get(key=token).user
        user.is_active = True
        user.save()
        return HttpResponseRedirect("{}/login".format(os.environ.get("CLIENT_URL")))


class Login(ObtainAuthToken):

    def send_user(self, user):
        social_user = SocialAccount.objects.filter(user=user)
        provider = "default"
        if social_user.exists():
            provider = social_user[0].provider

        data = {}
        data['status'] = status.HTTP_200_OK
        data['response'] = 'Successfully logged In.'
        data['payload'] = {
            'provider': provider,
            'subscribed': user.subscribed,
            'email': user.email,
            'first_name': user.first_name,
            'last_name': user.last_name,
            'id': user.id
        }
        return data

    def post(self, request, *args, **kwargs):

        serializer = self.serializer_class(
            data=request.data, context={'request': request})

        data = {}

        if serializer.is_valid(raise_exception=True):
            user = serializer.validated_data['user']
            token, created = Token.objects.get_or_create(user=user)
            print(token, created)

            data = self.send_user(user)
            data['token'] = token.key
            return Response(data, status=data['status'])
        else:
            return Response(serializer.errors, status=status.HTTP_404_NOT_FOUND)

    def get(self, request, *args, **kwargs):
        try:
            user = request.user
            data = self.send_user(user)
            return Response(data, status=data['status'])
        except:
            return Response({"error": "Could not login."}, status=status.HTTP_401_UNAUTHORIZED)


class Logout(APIView):
    authentication_classes = (TokenAuthentication,)
    permission_classes = (IsAuthenticated,)

    def post(self, request):
        try:
            logout(request)

            return Response({'response': "Logged out successfully."}, status=status.HTTP_204_NO_CONTENT)
        except:
            return Response({'error': "Invalid tokne."}, status=status.HTTP_406_NOT_ACCEPTABLE)


class ChangePasswordView(generics.UpdateAPIView):
    """
    An endpoint for changing password.
    """
    serializer_class = ChangePasswordSerializer
    model = UserAccount
    permission_classes = (IsAuthenticated,)
    authentication_classes = (TokenAuthentication,)

    def get_object(self, queryset=None):
        obj = self.request.user
        return obj

    def update(self, request, *args, **kwargs):
        self.object = self.get_object()
        serializer = self.get_serializer(data=request.data)

        data = {}

        if serializer.is_valid():
            # Check old password
            if not self.object.check_password(serializer.data.get("old_password")):
                return Response({"old_password": "Wrong password."}, status=status.HTTP_400_BAD_REQUEST)
            # set_password also hashes the password that the user will get
            elif serializer.data.get('new_password') != serializer.data.get('confirm_password'):
                return Response({"confirm_password": "Passwords Does Not Match."}, status.HTTP_406_NOT_ACCEPTABLE)
            elif len(serializer.data.get('new_password')) < 6:
                return Response({"Password": "Length of Password must be more than 5 Digits."}, status.HTTP_411_LENGTH_REQUIRED)
            self.object.set_password(serializer.data.get("new_password"))
            self.object.save()
            data = {
                'status': status.HTTP_200_OK,
                'response': 'Password updated successfully.',
            }

            return Response(data, status=data['status'])

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class RequestPasswordResetEmail(generics.GenericAPIView):

    def post(self, request):

        email = request.data.get('email', '')
        data = {}
        if email and UserAccount.objects.filter(email=email).exists():

            user = UserAccount.objects.get(email=email)
            uidb64 = urlsafe_base64_encode(smart_bytes(user.id))
            token = PasswordResetTokenGenerator().make_token(user)

            absurl = "{}/password-reset-complete/{}/{}".format(
                os.environ.get("CLIENT_URL"), uidb64, token)

            email_body = "Hello, \n Please use the Link below to reset your password. \n {}".format(
                absurl)

            email_data = {
                'email_body': email_body,
                'to_email': user.email,
                'email_subject': 'Reset your passsword'
            }
            try:
                Util.send_email(email_data)
                data['status'] = status.HTTP_200_OK
                data['response'] = "We have sent you a link to reset your password."
            except:
                data['error'] = ("Could not send email")
                data['status'] = status.HTTP_500_INTERNAL_SERVER_ERROR
        else:
            data['status'] = status.HTTP_404_NOT_FOUND
            data['error'] = ("Email not registered.")

        return Response(data, status=data['status'])


class SetNewPasswordAPIView(generics.GenericAPIView):
    serializer_class = SetNewPasswordSerializer

    def patch(self, request):
        serializer = self.serializer_class(data=request.data)
        serializer.is_valid(raise_exception=True)
        return Response({'response': 'Password reset success'}, status=status.HTTP_200_OK)


class DeleteUser(generics.DestroyAPIView):
    permission_classes = (IsAuthenticated,)
    authentication_classes = (TokenAuthentication,)

    def delete(self, request, *args, **kwargs):
        try:
            user = UserAccount.objects.get(email=request.user.email)
            user.delete()
            return Response({'response': "User account deleted successfully."}, status=status.HTTP_200_OK)
        except Exception:
            return Response({'error': 'Internal server error.'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class SubscriptionView(generics.GenericAPIView):
    permission_classes = (IsAuthenticated,)
    authentication_classes = (TokenAuthentication,)

    def get(self, request, *args, **kwargs):
        user = request.user
        user.subscribed = True
        user.save()
        return Response({"response": "Subscribed"}, status=status.HTTP_200_OK)

    def delete(self, request, *args, **kwargs):
        user = request.user
        user.subscribed = False
        user.save()
        return Response({"response": "Unsubscribed"}, status=status.HTTP_200_OK)


class GoogleLogin(SocialLoginView):
    authentication_classes = []  # disable authentication
    adapter_class = GoogleOAuth2Adapter
    callback_url = os.environ.get('CLIENT_URL')
    client_class = OAuth2Client


class EmailMessage(APIView):
    def post(self, request, *args, **kwargs):
        email = request.data.get("email")
        message = request.data.get("message")
        admins = UserAccount.objects.values_list("email", flat=True).filter(
            is_admin=True)

        email_data = {

            'email_body': f"from : {email} \nmessage : {message}",
            'to_email': ", ".join(admins),
            'email_subject': 'Reaching out.'
        }
        Util.send_email(email_data)
        return Response({"response": "Message sent. Response will be directed to your email."}, status=status.HTTP_200_OK)
