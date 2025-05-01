# tracker_app/urls.py
from django.urls import path
from . import views

app_name = 'tracker' # Define an app namespace

urlpatterns = [
    # Homepage
    path('', views.HomePageView.as_view(), name='home'), # Use root for home if desired

    # Trainer URLs
    path('trainers/', views.TrainerListView.as_view(), name='trainer_list'),
    path('trainers/new/', views.TrainerCreateView.as_view(), name='trainer_create'),
    path('trainers/<int:pk>/', views.TrainerDetailView.as_view(), name='trainer_detail'),
    path('trainers/<int:pk>/edit/', views.TrainerUpdateView.as_view(), name='trainer_update'),
    path('trainers/<int:pk>/delete/', views.TrainerDeleteView.as_view(), name='trainer_delete'),

    # Member URLs
    path('members/', views.MemberListView.as_view(), name='member_list'),
    path('members/new/', views.MemberCreateView.as_view(), name='member_create'),
    path('members/<int:pk>/', views.MemberDetailView.as_view(), name='member_detail'),
    path('members/<int:pk>/edit/', views.MemberUpdateView.as_view(), name='member_update'),
    path('members/<int:pk>/delete/', views.MemberDeleteView.as_view(), name='member_delete'),

    # Workout Session URLs
    path('workouts/', views.WorkoutSessionListView.as_view(), name='workout_list'),
    path('workouts/new/', views.WorkoutSessionCreateView.as_view(), name='workout_create'),
    path('workouts/<int:pk>/', views.WorkoutSessionDetailView.as_view(), name='workout_detail'),
    path('workouts/<int:pk>/edit/', views.WorkoutSessionUpdateView.as_view(), name='workout_update'),
    path('workouts/<int:pk>/delete/', views.WorkoutSessionDeleteView.as_view(), name='workout_delete'),
]