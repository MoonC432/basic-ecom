
from rest_framework import generics, status
from rest_framework.permissions import IsAuthenticated
from rest_framework.authentication import TokenAuthentication
from rest_framework.response import Response

from .serializers import GetUserOrders, PlaceOrderSerializer
from .models import Order, ProductOrderList


# Create your views here.


class PlaceOrder(generics.CreateAPIView):

    permission_classes = (IsAuthenticated,)
    authentication_classes = (TokenAuthentication,)

    def post(self, request, *args, **kwargs):
        serializer = PlaceOrderSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        created_order = serializer.create(
            serializer.validated_data, user=request.user)
        data = {}
        data['order_id'] = created_order.id
        data['generated_id'] = created_order.generated_id
        return Response({"response": data}, status=status.HTTP_200_OK)

    def get(self, request, *args, **kwargs):

        orders = Order.objects.filter(user=request.user)
        serializer = GetUserOrders(orders, many=True)

        return Response({"response": serializer.data}, status=status.HTTP_200_OK)


# class GetOrderDetails(generics.GenericAPIView):

#     permission_classes = (IsAuthenticated,)
#     authentication_classes = (TokenAuthentication,)

#     def get(self, request, *args, **kwargs):
#         data = []
#         oid = kwargs['oid']
#         product_list = ProductOrderList.objects.filter(order_details=oid)

#         for product in product_list:
#             info = {
#                 "name": product.product.name,
#                 "model_number": product.product.model_number,
#                 "quantity": product.quantity,
#                 "price": product.price
#             }
#             data.append(info)
#         return Response({"response": data}, status=status.HTTP_200_OK)
