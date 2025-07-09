
from rest_framework import generics, permissions
from .models import Algorithm
from .serializers import AlgorithmSerializer
from rest_framework_simplejwt.authentication import JWTAuthentication

class AlgorithmListCreate(generics.ListCreateAPIView):
    serializer_class = AlgorithmSerializer
    permission_classes = [permissions.IsAuthenticated]
    authentication_classes = [JWTAuthentication]
    
    def get_queryset(self):
        return Algorithm.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

class AlgorithmRetrieveUpdateDestroy(generics.RetrieveUpdateDestroyAPIView):
    serializer_class      = AlgorithmSerializer
    permission_classes    = [permissions.IsAuthenticated]
    authentication_classes = [JWTAuthentication]

    def get_queryset(self):
        return Algorithm.objects.filter(user=self.request.user)
