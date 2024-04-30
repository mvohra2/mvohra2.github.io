from django.shortcuts import render, redirect, get_object_or_404
from django.views import generic
from django.utils import timezone
from .models import Question
from .api import process_response_text
from django.urls import reverse
action_list = []
class IndexView(generic.ListView):
    template_name = "polls/index.html"
    context_object_name = "latest_question_list"

    def get_queryset(self):
        return Question.objects.order_by("-pub_date")

def submit_question(request):
    if request.method == "POST":
        question_text = request.POST.get('question_text', '')
        response_text = request.POST.get('response_text', '')

        if question_text and response_text:
            actions, people, emotions = process_response_text(response_text)  # Adjusted to unpack the tuple
            question = Question.objects.create(
                question_text=question_text,
                response_text=response_text,
                actions=actions,  # Assuming your model has these fields now
                people=people,
                emotions=emotions,
                pub_date=timezone.now()
            )

            return redirect(f"{reverse('polls:index')}?latest_id={question.id}")
        


from collections import defaultdict

def index(request):
    latest_question_list = Question.objects.order_by('-pub_date')
    latest_id = request.GET.get('latest_id', None)

    context = {
        'latest_question_list': latest_question_list,
        'latest_id': latest_id
    }
    return render(request, 'polls/index.html', context)



