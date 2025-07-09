from django.urls import path
from .views import CommentListCreateView, CommentReplyView, CommentUpdateDeleteView

urlpatterns = [
    path('', CommentListCreateView.as_view(), name='comments'),
    path('<int:pk>/', CommentUpdateDeleteView.as_view(), name='comment-detail'),
    path('<int:parent_id>/replies/', CommentReplyView.as_view(), name='comment-replies'),
]
