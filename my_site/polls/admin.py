from django.contrib import admin
from .models import Question
from django.utils.html import format_html_join
from django.utils.safestring import mark_safe

class QuestionAdmin(admin.ModelAdmin):
    fieldsets = [
        (None, {'fields': ['question_text', 'response_text', 'actions', 'emotions', 'people']}),
        ('Date information', {'fields': ['pub_date'], 'classes': ['collapse']}),
    ]
    list_display = ['question_text', 'list_actions', 'list_emotions', 'list_people', 'pub_date']

    def list_actions(self, obj):
        return mark_safe("<br>".join(obj.actions))
    list_actions.short_description = 'Actions'

    def list_emotions(self, obj):
        return mark_safe("<br>".join(obj.emotions))
    list_emotions.short_description = 'Emotions'

    def list_people(self, obj):
        return mark_safe("<br>".join(obj.people))
    list_people.short_description = 'People'

admin.site.register(Question, QuestionAdmin)


    


