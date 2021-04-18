from account.serializers import UserAccountSerializer
from account.models import UserAccount
from rest_framework import serializers, status
from .models import Feedback, Product
from rest_framework.fields import CurrentUserDefault
from rest_framework.response import Response


class ProductDetailSerializer(serializers.ModelSerializer):

    class Meta:
        model = Product
        fields = '__all__'

class FeedbacksFetchSerializer(serializers.ModelSerializer):

    user = UserAccountSerializer()
    class Meta:
        model = Feedback
        fields = (
            'message','rating','date_of_entry','product','user'
        )
        
        
        
class FeedbackSerializer(serializers.Serializer):
    rating = serializers.FloatField()
    product_id = serializers.IntegerField()
    message = serializers.CharField()

    def validate(self, attrs):
        if attrs.get("rating") < 0 or attrs.get("rating") > 10:
            raise serializers.ValidationError(
                'Rating has to be on the scale 0 to 10.', code=status.HTTP_406_NOT_ACCEPTABLE)
        return super().validate(attrs)

    def create(self, validated_data, **kwargs):
        try:
            product = Product.objects.get(id=validated_data['product_id'])
            feedback = Feedback.objects.create(
                product=product, user=kwargs['user'], rating=validated_data['rating'], message=validated_data['message'])
            feedback.save()
            return feedback
        except:
            return Response({"error": "Error while entering ."}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    def update(self, instance, validated_data):
        try:
            instance.rating = validated_data['rating']
            instance.message = validated_data['message']
            instance.save()
            return instance
        except:
            return Response({"error": "Error while updating ."}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
