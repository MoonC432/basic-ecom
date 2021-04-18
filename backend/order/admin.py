from django.contrib import admin
from .models import Order, ProductOrderList
# Register your models here.


class OrderAdmin(admin.ModelAdmin):
    list_display = ('id', 'user', 'total_amt', 'completed', 'paid',
                    'date_of_entry', 'date_of_delivery')


class ProductOrderListAdmin(admin.ModelAdmin):
    list_display = ('order_id', 'user',  'product',
                    'quantity', 'price', 'total_amount', 'completed', 'paid')

    def completed(self, obj):
        return obj.order_details.completed

    def paid(self, obj):
        return obj.order_details.paid

    def order_id(self, obj):
        return obj.order_details.id

    def user(self, obj):
        return obj.order_details.user

    def total_amount(self, obj):
        return obj.order_details.total_amt


admin.site.register(Order, OrderAdmin)
admin.site.register(ProductOrderList, ProductOrderListAdmin)
