from django.urls import path
from .views import RegisterView, LoginView, LogoutView, MeView, JobListCreateView, TaskListView, EarningsListView, TaskUpdateView
from .views import BidListCreateView, JobBidsListView, BidUpdateView

urlpatterns = [
    path('register/', RegisterView.as_view(), name='register'),
    path('login/', LoginView.as_view(), name='login'),
    path('logout/', LogoutView.as_view(), name='logout'),
    path('me/', MeView.as_view(), name='me'),
    path('jobs/', JobListCreateView.as_view(), name='jobs'),
    path('bids/', BidListCreateView.as_view(), name='bids'),
    path('jobs/<int:job_id>/bids/', JobBidsListView.as_view(), name='job-bids'),
    path('bids/<int:pk>/', BidUpdateView.as_view(), name='bid-update'),
    path('tasks/<int:pk>/', TaskUpdateView.as_view(), name='task-update'),
    path('tasks/', TaskListView.as_view(), name='tasks'),
    path('earnings/', EarningsListView.as_view(), name='earnings'),
]
