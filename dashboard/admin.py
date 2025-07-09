from django.contrib import admin
from .models import Algorithm

@admin.register(Algorithm)
class AlgorithmAdmin(admin.ModelAdmin):
    list_display = ['id', 'title', 'user', 'last_updated']
    search_fields = ['title', 'user__username']
    list_filter = ['last_updated']