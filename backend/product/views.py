from re import search
from django.db.models.query_utils import Q
from rest_framework import generics, status
from rest_framework import permissions
from rest_framework.authentication import TokenAuthentication
from rest_framework.permissions import AllowAny, IsAuthenticated, IsAuthenticatedOrReadOnly

from .models import Feedback, Product
from rest_framework.response import Response

from .serializers import FeedbacksFetchSerializer, ProductDetailSerializer
from .serializers import FeedbackSerializer

# Create your views here.


class ProductDetails(generics.GenericAPIView):
    serializer_class = ProductDetailSerializer

    def get(self, request, *args, **kwargs):

        product = Product.objects.get(id=kwargs['pid'])
        serializer = self.serializer_class(product)

        return Response(serializer.data)


class SelectProducts(generics.GenericAPIView):
    serializer_class = ProductDetailSerializer

    def get(self, request, *args, **kwargs):
        if kwargs['tag'] == 'latest':
            tag = '-date_of_entry'
        elif kwargs['tag'] == 'featured':
            tag = '-rating'
        count = kwargs['count']
        query_string = Product.objects.order_by(tag)[:count]
        serializer = self.serializer_class(query_string, many=True)
        return Response({"response": serializer.data}, status=status.HTTP_200_OK)


class SearchResults(generics.GenericAPIView):
    serializer_class = ProductDetailSerializer

    def get(self, request, *args, **kwargs):
        search_term = kwargs['searchTerm']
        query_string = Product.objects.filter(
            Q(name__icontains=str(search_term)) | Q(category__icontains=str(
                search_term)) | Q(model_number__icontains=str(search_term))
        )
        serializer = self.serializer_class(query_string, many=True)
        return Response({"response": serializer.data}, status=status.HTTP_200_OK)


class FeedbackView(generics.GenericAPIView):
    serializer_class = FeedbackSerializer
    authentication_classes = (TokenAuthentication,)
    permission_classes = (IsAuthenticatedOrReadOnly,)

    def get(self, request, *args, **kwargs):
        feedbacks = Feedback.objects.filter(product=kwargs['pid'])
        serializer = FeedbacksFetchSerializer(feedbacks, many=True)

        return Response({'response': serializer.data}, status=status.HTTP_200_OK)

    def post(self, request, *args, **kwargs):

        serializer = self.serializer_class(
            data=request.data)
        serializer.is_valid(raise_exception=True)

        product = Product.objects.get(
            id=serializer.validated_data['product_id'])

        instance = Feedback.objects.filter(product=product, user=request.user)

        if instance.exists():
            serializer.update(instance[0], serializer.validated_data)
            return Response({"response": "Feedback updated successfully."}, status=status.HTTP_200_OK)

        else:
            serializer.create(
                serializer.validated_data, user=request.user)
            return Response({"response": "Feedback added successfully."}, status=status.HTTP_200_OK)

    def delete(self, request, **kwargs):
        pid = kwargs['pid']
        try:

            product = Product.objects.get(id=pid)
            feedback = Feedback.objects.get(
                user=request.user, product=product)
            feedback.delete()
            return Response({"response": 'Feedback deleted successfully.'}, status=status.HTTP_200_OK)
        except:
            return Response({"error": "An error occured while processing your request."}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
