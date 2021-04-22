from .views import FeedbackView, ProductDetails, SearchResults, SelectProducts
from django.urls import path

urlpatterns = [
    path('feedback/<pid>/', FeedbackView.as_view(),
         name="product_feedback_getDelete"),

    path('feedback/', FeedbackView.as_view(), name="product_feedback"),

    path('details/<pid>/', ProductDetails.as_view(), name="product_details"),

    path('search/<searchTerm>/', SearchResults.as_view(), name="search_results"),

    path('select/<str:tag>/<int:count>/',
         SelectProducts.as_view(), name="latest_products")

]
