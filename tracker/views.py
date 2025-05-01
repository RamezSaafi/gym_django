# tracker/views.py
from django.shortcuts import render
from django.views.generic import (
    ListView, DetailView, CreateView, UpdateView, DeleteView, TemplateView
)
from django.urls import reverse_lazy
from .models import Trainer, Member, WorkoutSession
from .forms import TrainerForm, MemberForm, WorkoutSessionForm # Import forms

# --- Homepage ---
class HomePageView(TemplateView):
    template_name = 'tracker/home.html'

# --- Trainer CRUD ---
class TrainerListView(ListView):
    model = Trainer
    template_name = 'tracker/trainer_list.html' 
    context_object_name = 'trainers'

class TrainerDetailView(DetailView):
    model = Trainer
    template_name = 'tracker/trainer_detail.html'
    context_object_name = 'trainer' 

class TrainerCreateView(CreateView):
    model = Trainer
    form_class = TrainerForm
    template_name = 'tracker/trainer_form.html'
    success_url = reverse_lazy('tracker:trainer_list') 

class TrainerUpdateView(UpdateView):
    model = Trainer
    form_class = TrainerForm
    template_name = 'tracker/trainer_form.html'
    success_url = reverse_lazy('tracker:trainer_list')

class TrainerDeleteView(DeleteView):
    model = Trainer
    template_name = 'tracker/trainer_confirm_delete.html' 
    success_url = reverse_lazy('tracker:trainer_list')
    context_object_name = 'trainer'

# --- Member CRUD ---
class MemberListView(ListView):
    model = Member
    template_name = 'tracker/member_list.html'
    context_object_name = 'members'

class MemberDetailView(DetailView):
    model = Member
    template_name = 'tracker/member_detail.html'
    context_object_name = 'member'

class MemberCreateView(CreateView):
    model = Member
    form_class = MemberForm
    template_name = 'tracker/member_form.html'
    success_url = reverse_lazy('tracker:member_list')

class MemberUpdateView(UpdateView):
    model = Member
    form_class = MemberForm
    template_name = 'tracker/member_form.html'
    success_url = reverse_lazy('tracker:member_list')

class MemberDeleteView(DeleteView):
    model = Member
    template_name = 'tracker/member_confirm_delete.html'
    success_url = reverse_lazy('tracker:member_list')
    context_object_name = 'member'

# --- Workout Session CRUD ---
class WorkoutSessionListView(ListView):
    model = WorkoutSession
    template_name = 'tracker/workoutsession_list.html'
    context_object_name = 'workout_sessions'

class WorkoutSessionDetailView(DetailView):
    model = WorkoutSession
    template_name = 'tracker/workoutsession_detail.html'
    context_object_name = 'session' 

class WorkoutSessionCreateView(CreateView):
    model = WorkoutSession
    form_class = WorkoutSessionForm
    template_name = 'tracker/workoutsession_form.html'
    success_url = reverse_lazy('tracker:workout_list')

class WorkoutSessionUpdateView(UpdateView):
    model = WorkoutSession
    form_class = WorkoutSessionForm
    template_name = 'tracker/workoutsession_form.html'
    success_url = reverse_lazy('tracker:workout_list')

class WorkoutSessionDeleteView(DeleteView):
    model = WorkoutSession
    template_name = 'tracker/workoutsession_confirm_delete.html'
    success_url = reverse_lazy('tracker:workout_list')
    context_object_name = 'session'