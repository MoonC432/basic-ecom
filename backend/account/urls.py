from django.urls import path
from .views import ChangePasswordView, DeleteUser, EmailVerification, GoogleLogin, Login, Logout, Register, RequestPasswordResetEmail, SendEmailVerification, SetNewPasswordAPIView

urlpatterns = [
    path('register/', Register.as_view(), name='register'),
    path('verify-email/<str:token>/',
         EmailVerification.as_view(), name='verify_email'),
    path('send-email-verification/',
         SendEmailVerification.as_view(), name='send-email-verification'),
    path('login/', Login.as_view(), name='login'),
    path('logout/', Logout.as_view(), name='logout'),
    path('change-password/', ChangePasswordView.as_view(),
         name='change-password'),  # Authentication header >> user token
    path('request-reset-email/', RequestPasswordResetEmail.as_view(),
         name="request-reset-email"),
    path('password-reset-complete/', SetNewPasswordAPIView.as_view(),
         name='password-reset-complete'),
    path('delete/', DeleteUser.as_view(), name="deleteUser"),


#     Social Auths
    path('google/', GoogleLogin.as_view(), name="google_login")


]
