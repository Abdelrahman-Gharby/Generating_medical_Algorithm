from django.urls import path
from .views import GenerateAlgorithmView, ConvertImageView 

urlpatterns = [
    path('generate/', GenerateAlgorithmView.as_view(), name='generate-algorithm'),
    path('convert-image/', ConvertImageView.as_view(), name="convert-image"),
]
