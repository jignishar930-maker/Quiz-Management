# qms/admin.py

from django.contrib import admin
from .models import Quiz, Question, Option, Result

# Question અને Option ને Quiz માં જ ઇનલાઇન એડ કરવા માટે (UX સુધારવા)
class OptionInline(admin.TabularInline):
    model = Option
    extra = 4 # એકસાથે 4 વિકલ્પો ઉમેરવા માટે

class QuestionInline(admin.StackedInline):
    model = Question
    inlines = [OptionInline] # Question માં Options ઉમેરવા
    extra = 1

@admin.register(Quiz)
class QuizAdmin(admin.ModelAdmin):
    list_display = ('title', 'created_by', 'created_at')
    inlines = [QuestionInline] # Quiz માં પ્રશ્નો ઉમેરવા

@admin.register(Result)
class ResultAdmin(admin.ModelAdmin):
    list_display = ('student', 'quiz', 'score', 'attempted_at')
    list_filter = ('quiz', 'attempted_at')

