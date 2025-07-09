from rest_framework import serializers
from .models import Comment

class CommentSerializer(serializers.ModelSerializer):
    username = serializers.CharField(source='user.username', read_only=True)
    replies = serializers.SerializerMethodField()

    class Meta:
        model = Comment
        fields = ['id', 'username', 'text', 'parent', 'algorithm', 'likes', 'created_at', 'replies']

    def get_replies(self, obj):
        return CommentSerializer(obj.replies.all(), many=True).data