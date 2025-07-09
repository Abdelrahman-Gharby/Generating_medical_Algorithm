from rest_framework import generics
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticatedOrReadOnly
from .models import Comment
from .serializers import CommentSerializer
from django.contrib.auth.models import User

class CommentListCreateView(generics.ListCreateAPIView):
    serializer_class = CommentSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]

    def get_queryset(self):
        algorithm_id = self.request.query_params.get('algorithm')
        if algorithm_id:
            return Comment.objects.filter(parent=None, algorithm_id=algorithm_id)
        return Comment.objects.none() 

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

class CommentReplyView(generics.ListCreateAPIView):
    serializer_class = CommentSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]

    def get_queryset(self):
        parent_id = self.kwargs['parent_id']
        return Comment.objects.filter(parent_id=parent_id)

    def perform_create(self, serializer):
        parent = Comment.objects.get(id=self.kwargs['parent_id'])
        serializer.save(user=self.request.user, parent=parent)

class CommentUpdateDeleteView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Comment.objects.all()
    serializer_class = CommentSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]
