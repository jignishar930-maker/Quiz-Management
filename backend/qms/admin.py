from django.contrib import admin
from .models import (
    Quiz, Question, Option, 
    Result, StudentAnswer, UserProfile
)
class OptionInline(admin.TabularInline):
    model = Option
    extra = 4 

class QuestionAdmin(admin.ModelAdmin):
    list_display = ('quiz', 'text')
    inlines = [OptionInline]


class QuizAdmin(admin.ModelAdmin):
    list_display = ('title', 'created_by', 'created_at')
    list_filter = ('created_by',)
    search_fields = ('title', 'description')


admin.site.register(Quiz, QuizAdmin)
admin.site.register(Question, QuestionAdmin)


admin.site.register(Result)
admin.site.register(StudentAnswer)
admin.site.register(UserProfile)
