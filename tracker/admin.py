from django.contrib import admin
from .models import Trainer, Member, WorkoutSession

admin.site.register(Trainer)
admin.site.register(Member)
admin.site.register(WorkoutSession)
