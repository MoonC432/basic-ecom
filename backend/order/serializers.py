from product.models import Product
from rest_framework import serializers, status
from rest_framework.exceptions import ValidationError
from .models import Order, ProductOrderList


class PlaceOrderSerializer(serializers.Serializer):

    PAYMENT_CHOICES = (
        ('paypal', 'Paypal'),
        ('razorpay', 'Razorpay'),
        ('custom', 'Custom')
    )

    address = serializers.CharField(required=True)
    phone = serializers.CharField(required=True)
    payment_method = serializers.ChoiceField(
        required=True, choices=PAYMENT_CHOICES)
    product_list = serializers.ListField(
        child=serializers.JSONField(), required=True)

    def validate(self, attrs):
        phone = attrs.get('phone')
        if " " in phone:
            raise ValidationError(
                "There can be no spaces in phone number.", status.HTTP_406_NOT_ACCEPTABLE)
        return super().validate(attrs)

    def create(self, validated_data, **kwargs):

        # validating and getting total amount
        total_amt = 0
        for product in validated_data['product_list']:
            instance = Product.objects.get(id=product['id'])

            if product['quantity'] > instance.stock or product['quantity'] < 1:
                raise ValidationError(
                    "Quantity of product either exceeds the stock or is insufficient.", status.HTTP_503_SERVICE_UNAVAILABLE)
            else:
                price = instance.discount_price or instance.price
                total_amt += price * product['quantity']

        # creating Order instance

        order = Order.objects.create(
            user=kwargs['user'],
            address=validated_data['address'],
            phone=validated_data['phone'],
            payment_method=validated_data['payment_method'],
            total_amt=total_amt
        )

        order.save()

        # creating ProductList for the Order instance

        for product in validated_data['product_list']:
            instance = Product.objects.get(id=product['id'])
            product_order_list = ProductOrderList.objects.create(
                product=instance,
                order_details=order,
                quantity=product['quantity'],
                price=instance.discount_price or instance.price
            )
            product_order_list.save()

        return order


class GetUserOrders(serializers.ModelSerializer):
    class Meta:
        model = Order
        exclude = ('address', 'phone', 'user')
