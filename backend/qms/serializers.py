# qms/serializers.py

from rest_framework import serializers
from .models import Quiz, Question, Option, Result, StudentAnswer

# Option, Question અને Quiz ને એકસાથે હેન્ડલ કરવા માટે Nesting નો ઉપયોગ કરો

class OptionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Option
        fields = ['id', 'text', 'is_correct']

class QuestionSerializer(serializers.ModelSerializer):
    options = OptionSerializer(many=True) # એક પ્રશ્ન માટે ઘણા વિકલ્પો

    class Meta:
        model = Question
        fields = ['id', 'text', 'marks', 'options']
        
    # ક્વિઝ બનાવતી વખતે nested data (Options) ને સેવ કરવા માટે
    def create(self, validated_data):
        options_data = validated_data.pop('options')
        question = Question.objects.create(**validated_data)
        for option_data in options_data:
            Option.objects.create(question=question, **option_data)
        return question

class QuizSerializer(serializers.ModelSerializer):
    questions = QuestionSerializer(many=True, required=False) # ક્વિઝ બનાવતી વખતે પ્રશ્નો વૈકલ્પિક છે

    class Meta:
        model = Quiz
        fields = ['id', 'title', 'description', 'created_by', 'created_at', 'questions']
        read_only_fields = ['created_by'] # created_by યુઝર આપોઆપ સેટ થશે
    
    # ક્વિઝ અને તેના nested પ્રશ્નો/વિકલ્પો બનાવવા માટે
    def create(self, validated_data):
        # questions ડેટા અલગ કરો
        questions_data = validated_data.pop('questions', [])
        
        # created_by ફિલ્ડ current logged-in user સાથે સેટ કરો (view માં set થશે)
        quiz = Quiz.objects.create(**validated_data)
        
        # દરેક પ્રશ્ન માટે QuestionSerializer નો ઉપયોગ કરીને પ્રશ્નો બનાવો
        for question_data in questions_data:
            options_data = question_data.pop('options')
            question = Question.objects.create(quiz=quiz, **question_data)
            
            # દરેક વિકલ્પ માટે Option ઓબ્જેક્ટ બનાવો
            for option_data in options_data:
                Option.objects.create(question=question, **option_data)
                
        return quiz