# qms/serializers.py

from rest_framework import serializers
from .models import Quiz, Question, Option, Result, StudentAnswer


class OptionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Option
        fields = ['id', 'text', 'is_correct']

class QuestionSerializer(serializers.ModelSerializer):
    options = OptionSerializer(many=True)

    class Meta:
        model = Question
        fields = ['id', 'text', 'marks', 'options']
        
    def create(self, validated_data):
        options_data = validated_data.pop('options')
        question = Question.objects.create(**validated_data)
        for option_data in options_data:
            Option.objects.create(question=question, **option_data)
        return question

class QuizSerializer(serializers.ModelSerializer):
    questions = QuestionSerializer(many=True, required=False) 

    class Meta:
        model = Quiz
        fields = ['id', 'title', 'description', 'created_by', 'created_at', 'questions']
        read_only_fields = ['created_by'] 
    
    def create(self, validated_data):
       
        questions_data = validated_data.pop('questions', [])
        
        quiz = Quiz.objects.create(**validated_data)
        
        for question_data in questions_data:
            options_data = question_data.pop('options')
            question = Question.objects.create(quiz=quiz, **question_data)
            
        
            for option_data in options_data:
                Option.objects.create(question=question, **option_data)
                
        return quiz


class StudentOptionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Option
        fields = ['id', 'text'] # is_correct

#student Question Serializer
class StudentQuestionSerializer(serializers.ModelSerializer):
    options = StudentOptionSerializer(many=True) 

    class Meta:
        model = Question
        fields = ['id', 'text', 'options']

# student Quiz Serializer
class StudentQuizListSerializer(serializers.ModelSerializer):
    class Meta:
        model = Quiz
        fields = ['id', 'title', 'description', 'created_at']

# start the quiz
class StudentQuizAttemptSerializer(serializers.ModelSerializer):
    questions = StudentQuestionSerializer(many=True)

    class Meta:
        model = Quiz
        fields = ['id', 'title', 'description', 'questions']