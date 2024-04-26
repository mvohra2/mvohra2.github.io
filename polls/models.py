import datetime
from django.db import models
from django.utils import timezone
from django.contrib.postgres.fields import JSONField  # If using Django version < 3.1

class Question(models.Model):
    question_text = models.CharField(max_length=200)
    response_text = models.TextField()
    pub_date = models.DateTimeField()
    actions = models.JSONField(default=list, blank=True)
    emotions = models.JSONField(default=list, blank=True)
    people = models.JSONField(default=list, blank=True)
