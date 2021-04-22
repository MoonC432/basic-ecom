from datetime import timezone
from account.models import UserAccount
from django.db import models
from django.utils import timezone

# Create your models here.


class Product(models.Model):
    name = models.CharField(max_length=50, blank=False, null=False)
    model_number = models.CharField(max_length=50, blank=True, null=True)
    category = models.CharField(max_length=50, blank=False, null=False)
    price = models.FloatField(blank=False, null=False)
    discount_price = models.FloatField(null=True, blank=True)
    stock = models.PositiveIntegerField(blank=False, null=False)
    rating = models.FloatField(default=0)
    description = models.TextField()
    picture = models.ImageField(
        upload_to='images/products/', blank=False, null=False)
    date_of_entry = models.DateField(auto_now_add=True)

    def __str__(self):
        return self.name


class Feedback(models.Model):
    user = models.ForeignKey(UserAccount, on_delete=models.CASCADE)
    product = models.ForeignKey(
        Product, on_delete=models.CASCADE, related_name='feedbacks')
    rating = models.FloatField(blank=False, null=False)
    message = models.TextField(blank=True, null=True)
    date_of_entry = models.DateField(auto_now=True)

    def __str__(self):
        return self.product.name
