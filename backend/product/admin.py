from django.contrib import admin
from .models import Feedback, Product

# Register your models here.


class ProductAdmin(admin.ModelAdmin):
    list_display = ('name', 'model_number', 'price', 'discount_price', 'stock')
    search_fields = ('name', 'model_number', 'description')

class FeedbackAdmin(admin.ModelAdmin):
    list_display = ('id','product', 'user', 'rating')
    search_fields = ('product', 'user', 'rating', 'message')

admin.site.register(Product, ProductAdmin)
admin.site.register(Feedback, FeedbackAdmin)
