from django.db import models

class Trainer(models.Model):
    name = models.CharField(max_length=100)
    specialty = models.CharField(max_length=100)

class Member(models.Model):
    name = models.CharField(max_length=100)
    email = models.EmailField()
    trainer = models.ForeignKey(Trainer, on_delete=models.CASCADE)

class WorkoutSession(models.Model):
    member = models.ForeignKey(Member, on_delete=models.CASCADE)
    workout_type = models.CharField(max_length=100)
    duration = models.IntegerField()
    date = models.DateField()
