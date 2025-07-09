from django.contrib import admin
from django.urls import path, include
from django.http import JsonResponse

def home(request):
    return JsonResponse({"message": "Welcome to the AI Medical Algorithm API!"})

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/accounts/', include('accounts.urls')),
    path('api/dashboard/', include('dashboard.urls')),
    path('api/comments/', include('comments.urls')),
    path('api/generation/', include('generation.urls')),
    path('', home),
]
