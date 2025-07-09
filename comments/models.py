from django.db import models
from django.conf import settings

class Comment(models.Model):
    algorithm = models.ForeignKey('dashboard.Algorithm', on_delete=models.CASCADE, related_name='comments')
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    parent = models.ForeignKey('self', on_delete=models.CASCADE, null=True, blank=True, related_name='replies')
    text = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    likes = models.PositiveIntegerField(default=0)

    def __str__(self):
        return f"{self.user.username} - {self.text[:20]}"

    class Meta:
        ordering = ['-created_at']

