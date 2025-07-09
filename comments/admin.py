from django.contrib import admin
from .models import Comment

@admin.register(Comment)
class CommentAdmin(admin.ModelAdmin):
    list_display = ('user', 'algorithm', 'text', 'created_at', 'likes')
    search_fields = ('user__username', 'text')
    list_filter = ('created_at',)
    ordering = ('-created_at',)