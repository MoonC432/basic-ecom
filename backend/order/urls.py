from .views import PlaceOrder, GetOrderDetails
from django.urls import path

urlpatterns = [
    path('place-order/', PlaceOrder.as_view(), name="palce_order"),
    path('get-order-details/<oid>/',
         GetOrderDetails.as_view(), name="order_details")
]
