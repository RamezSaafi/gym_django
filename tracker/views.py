from django.shortcuts import render
from django.views.generic import (
    ListView,
    DetailView,
    CreateView,
    UpdateView,
    DeleteView,
    TemplateView,
)
from django.urls import reverse_lazy
from .models import Trainer, Member, WorkoutSession
from .forms import TrainerForm, MemberForm, WorkoutSessionForm
from django.urls import reverse
from django.http import JsonResponse
from django.shortcuts import get_object_or_404


# --- Homepage ---
class HomePageView(TemplateView):
    template_name = "tracker/home.html"
    def get_context_data(self, **kwargs):
        # Call the base implementation first to get a context
        context = super().get_context_data(**kwargs)
        # Add in the counts
        context['trainer_count'] = Trainer.objects.count()
        context['member_count'] = Member.objects.count()
        context['workout_count'] = WorkoutSession.objects.count()
        return context


# --- Trainer CRUD ---
class TrainerListView(ListView):
    model = Trainer
    template_name = "tracker/trainer_list.html"
    context_object_name = "trainers"

    def get_queryset(self):

        queryset = super().get_queryset().order_by('name') 
        specialty_filter = self.request.GET.get('specialty', None)
        if specialty_filter and specialty_filter.strip():
            queryset = queryset.filter(specialty__icontains=specialty_filter.strip())
        return queryset

    def get_context_data(self, **kwargs):

        context = super().get_context_data(**kwargs)
        context['current_specialty_filter'] = self.request.GET.get('specialty', '')
        return context


class TrainerDetailView(DetailView):
    model = Trainer
    template_name = "tracker/trainer_detail.html"
    context_object_name = "trainer"


class TrainerCreateView(CreateView):
    model = Trainer
    form_class = TrainerForm
    template_name = "tracker/trainer_form.html"
    success_url = reverse_lazy("tracker:trainer_list")


class TrainerUpdateView(UpdateView):
    model = Trainer
    form_class = TrainerForm
    template_name = "tracker/trainer_form.html"
    success_url = reverse_lazy("tracker:trainer_list")


class TrainerDeleteView(DeleteView):
    model = Trainer
    template_name = "tracker/trainer_confirm_delete.html"
    success_url = reverse_lazy("tracker:trainer_list")
    context_object_name = "trainer"


# --- Trainer AJAX ---
def trainer_ajax_detail(request, pk):
    trainer = get_object_or_404(Trainer, pk=pk)

    assigned_members = []
    for member in trainer.member_set.all().order_by("name"):
        assigned_members.append(
            {
                "id": member.pk,
                "name": member.name,
                "url": reverse(
                    "tracker:member_detail", args=[member.pk]
                ),
            }
        )

    data = {
        "id": trainer.pk,
        "name": trainer.name,
        "specialty": trainer.specialty,
        "members": assigned_members,
        "edit_url": reverse(
            "tracker:trainer_update", args=[trainer.pk]
        ),
        "delete_url": reverse(
            "tracker:trainer_delete", args=[trainer.pk]
        ),
    }
    return JsonResponse(data)


# --- Member CRUD ---
class MemberListView(ListView):
    model = Member
    template_name = "tracker/member_list.html"
    context_object_name = "members"

    def get_queryset(self):

        queryset = super().get_queryset().order_by('name')
        name_filter = self.request.GET.get('name', None)
        if name_filter and name_filter.strip():
            queryset = queryset.filter(name__icontains=name_filter.strip())
        return queryset

    def get_context_data(self, **kwargs):

        context = super().get_context_data(**kwargs)
        context['current_name_filter'] = self.request.GET.get('name', '')
        return context


class MemberDetailView(DetailView):
    model = Member
    template_name = "tracker/member_detail.html"
    context_object_name = "member"


class MemberCreateView(CreateView):
    model = Member
    form_class = MemberForm
    template_name = "tracker/member_form.html"
    success_url = reverse_lazy("tracker:member_list")


class MemberUpdateView(UpdateView):
    model = Member
    form_class = MemberForm
    template_name = "tracker/member_form.html"
    success_url = reverse_lazy("tracker:member_list")


class MemberDeleteView(DeleteView):
    model = Member
    template_name = "tracker/member_confirm_delete.html"
    success_url = reverse_lazy("tracker:member_list")
    context_object_name = "member"


# --- Member AJAX ---
def member_ajax_detail(request, pk):
    member = get_object_or_404(Member, pk=pk)

    workout_sessions = []
    for session in member.workoutsession_set.all().order_by(
        "-date"
    ):
        workout_sessions.append(
            {
                "id": session.pk,
                "workout_type": session.workout_type,
                "duration": session.duration,
                "date": session.date.strftime("%Y-%m-%d"), 
                "url": reverse(
                    "tracker:workout_detail", args=[session.pk]
                ), 
            }
        )

    trainer_data = None
    if member.trainer:
        trainer_data = {
            "id": member.trainer.pk,
            "name": member.trainer.name,
            "url": reverse(
                "tracker:trainer_detail", args=[member.trainer.pk]
            ), 
        }

    data = {
        "id": member.pk,
        "name": member.name,
        "email": member.email,
        "trainer": trainer_data,
        "workout_sessions": workout_sessions,
        "edit_url": reverse(
            "tracker:member_update", args=[member.pk]
        ), 
        "delete_url": reverse(
            "tracker:member_delete", args=[member.pk]
        ),
    }
    return JsonResponse(data)


# --- Workout Session CRUD ---
class WorkoutSessionListView(ListView):
    model = WorkoutSession
    template_name = "tracker/workoutsession_list.html"
    context_object_name = "workout_sessions"
    def get_queryset(self):
        queryset = super().get_queryset().order_by('-date', '-id') 

        workout_type_filter = self.request.GET.get('type', None)
        date_filter = self.request.GET.get('date', None)

        if workout_type_filter and workout_type_filter.strip(): 

            queryset = queryset.filter(workout_type__icontains=workout_type_filter.strip())

        if date_filter:
            
            try:
                queryset = queryset.filter(date=date_filter)
            except ValueError:
               pass

        return queryset

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)

        context['current_type_filter'] = self.request.GET.get('type', '')
        context['current_date_filter'] = self.request.GET.get('date', '')
        return context


class WorkoutSessionDetailView(DetailView):
    model = WorkoutSession
    template_name = "tracker/workoutsession_detail.html"
    context_object_name = "session"


class WorkoutSessionCreateView(CreateView):
    model = WorkoutSession
    form_class = WorkoutSessionForm
    template_name = "tracker/workoutsession_form.html"
    success_url = reverse_lazy("tracker:workout_list")


class WorkoutSessionUpdateView(UpdateView):
    model = WorkoutSession
    form_class = WorkoutSessionForm
    template_name = "tracker/workoutsession_form.html"
    success_url = reverse_lazy("tracker:workout_list")


class WorkoutSessionDeleteView(DeleteView):
    model = WorkoutSession
    template_name = "tracker/workoutsession_confirm_delete.html"
    success_url = reverse_lazy("tracker:workout_list")
    context_object_name = "session"


# --- Workout Session AJAX ---
def workout_ajax_detail(request, pk):

    session = get_object_or_404(WorkoutSession, pk=pk)

    member_data = {
        "id": session.member.pk,
        "name": session.member.name,
        "url": reverse(
            "tracker:member_detail", args=[session.member.pk]
        ), 
    }

    data = {
        "id": session.pk,
        "member": member_data,
        "workout_type": session.workout_type,
        "duration": session.duration,
        "date": session.date.strftime("%Y-%m-%d"),  
        "date_display": session.date.strftime(
            "%B %d, %Y"
        ),
        "edit_url": reverse("tracker:workout_update", args=[session.pk]),
        "delete_url": reverse("tracker:workout_delete", args=[session.pk]),
    }
    return JsonResponse(data)
