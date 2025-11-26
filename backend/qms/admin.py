from django.contrib import admin
from .models import (
    Quiz, Question, Option, 
    Result, StudentAnswer, UserProfile
)

# Question માટે Options ને In-line એડિટ કરવા માટે
class OptionInline(admin.TabularInline):
    model = Option
    extra = 3 # એક સાથે 3 ખાલી Options બતાવશે

# Question મોડેલ માટે કસ્ટમ એડમિન
class QuestionAdmin(admin.ModelAdmin):
    list_display = ('quiz', 'text')
    inlines = [OptionInline] # Options ને Question એડિટ પેજમાં જ ઉમેરી શકાય છે

# Quiz મોડેલ માટે કસ્ટમ એડમિન
class QuizAdmin(admin.ModelAdmin):
    list_display = ('title', 'created_by', 'created_at')
    list_filter = ('created_by',)
    search_fields = ('title', 'description')

# મોડેલ્સને એડમિનમાં રજીસ્ટર કરો
admin.site.register(Quiz, QuizAdmin)
admin.site.register(Question, QuestionAdmin)

# બાકીના મોડેલ્સ સરળ રીતે રજીસ્ટર કરો
admin.site.register(Result)
admin.site.register(StudentAnswer)
admin.site.register(UserProfile)

# Option ને અલગથી રજીસ્ટર કરવાની જરૂર નથી કારણ કે તે QuestionAdmin દ્વારા Inline છે