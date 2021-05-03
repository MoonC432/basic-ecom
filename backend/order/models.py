from django.db import models
from account.models import UserAccount
from product.models import Product

# Create your models here.


class Order(models.Model):

    user = models.ForeignKey(
        UserAccount, on_delete=models.SET_NULL, null=True, blank=False)
    address = models.CharField(max_length=500, null=False, blank=False)
    phone = models.CharField(max_length=15, null=False, blank=False)
    total_amt = models.FloatField(null=False, blank=False)
    payment_method = models.CharField(max_length=15, null=False, blank=False)
    generated_id = models.CharField(max_length=255, null=True, blank=True)
    paid = models.BooleanField(default=False, null=False, blank=False)
    completed = models.BooleanField(default=False, null=False, blank=False)
    date_of_entry = models.DateField(
        auto_now_add=True, null=False, blank=False)
    date_of_delivery = models.DateField(null=True)

    class Meta:
        ordering = ['-date_of_entry', '-paid']

    def __str__(self) -> str:
        return f"{str(self.id)} -> {self.user} -> Rs.{self.total_amt}"


class ProductOrderList(models.Model):
    product = models.ForeignKey(
        Product, on_delete=models.SET_NULL, null=True, blank=False)
    order_details = models.ForeignKey(
        Order, on_delete=models.CASCADE, null=False, blank=False)
    quantity = models.IntegerField(null=False, blank=False)
    price = models.FloatField(null=False, blank=False)

    def __str__(self) -> str:
        return self.product.name
