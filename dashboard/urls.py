from django.urls import path
from .views import AlgorithmListCreate, AlgorithmRetrieveUpdateDestroy

urlpatterns = [
    path('', AlgorithmListCreate.as_view(), name='algorithm-list-create'),
    path("<int:pk>/", AlgorithmRetrieveUpdateDestroy.as_view(), name="algorithm-detail"),
]