from django.db import models
from django.conf import settings


class Algorithm(models.Model):
    
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    title = models.CharField(max_length=100)
    algorithm_json = models.JSONField()
    last_updated = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.title