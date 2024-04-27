from django.urls import path
from .views import IndexView

from . import views

app_name = "polls"
urlpatterns = [
    path('', views.IndexView.as_view(), name='index'),
    path('submit_question/', views.submit_question, name='submit_question'),
]
