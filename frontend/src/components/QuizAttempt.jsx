import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { submitQuiz } from '../api';
import './QuizAttempt.css'; 
import '../App.css';


const API_BASE_URL = 'http://127.0.0.1:8000/api/qms';

const QuizAttempt = () => {
  const { quizId } = useParams();
  const navigate = useNavigate();

  const [quiz, setQuiz] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userAnswers, setUserAnswers] = useState({});
  const [timer, setTimer] = useState(0);
  const [isSubmitted, setIsSubmitted] = useState(false);

  // ક્વિઝ ડેટા ફેચ કરવો
  useEffect(() => {
    const token = localStorage.getItem('access_token');
    if (!token) {
      navigate('/login');
      return;
    }

    const fetchQuizData = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/quiz/${quizId}/questions/`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        
        const { quiz_duration, questions, quiz_title } = response.data;
        setQuiz({ title: quiz_title, duration: quiz_duration });
        setQuestions(questions);
        setTimer(quiz_duration * 60);
        setLoading(false);
      } catch (err) {
        setError("ક્વિઝ લોડ કરવામાં ભૂલ આવી.");
        setLoading(false);
      }
    };
    fetchQuizData();
  }, [quizId, navigate]);

  // આન્સર ચેન્જ હેન્ડલર
  const handleAnswerChange = (questionId, optionId) => {
    setUserAnswers(prev => ({ ...prev, [questionId]: [optionId] }));
  };

  // ક્વિઝ સબમિટ ફંક્શન
  const handleSubmitQuiz = useCallback(async (isAutoSubmit = false) => {
    if (isSubmitted) return;
    
    if (Object.keys(userAnswers).length === 0 && !isAutoSubmit) {
        alert("કૃપા કરીને ઓછામાં ઓછો એક જવાબ પસંદ કરો.");
        return;
    }

    setIsSubmitted(true);

    try {
        const formattedAnswers = {};
        Object.entries(userAnswers).forEach(([qId, selectedOptions]) => {
            if (selectedOptions.length > 0) {
                formattedAnswers[parseInt(qId)] = parseInt(selectedOptions[0]);
            }
        });

        const result = await submitQuiz(parseInt(quizId), formattedAnswers);

        if (result) {
            alert(`સબમિટ થઈ ગયું!\nતમારો સ્કોર: ${result.score} / ${result.total_questions}`);
            navigate('/my-results'); 
        }
    } catch (err) {
        setIsSubmitted(false);
        alert("ભૂલ આવી: " + (err.message || "સર્વર કનેક્શન પ્રોબ્લેમ"));
    }
  }, [isSubmitted, userAnswers, quizId, navigate]);

  // ટાઈમર લોજિક
  useEffect(() => {
    if (loading || !quiz || isSubmitted) return;
    const interval = setInterval(() => {
      setTimer((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          if (!isSubmitted) handleSubmitQuiz(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [loading, quiz, isSubmitted, handleSubmitQuiz]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  if (loading) return <div className="loading-container">કૃપા કરી રાહ જુઓ...</div>;
  if (error) return <div className="error-msg">{error}</div>;

  return (
    <div className="quiz-main-wrapper">
      {/* Sticky Header */}
      <header className="quiz-attempt-header">
        <div className="header-inner">
          <div className="quiz-info">
            <h2>{quiz.title}</h2>
            <p>કુલ પ્રશ્નો: {questions.length}</p>
          </div>
          <div className={`timer-box ${timer < 60 ? 'critical' : ''}`}>
            <span className="timer-icon">⏱️</span>
            <span className="timer-val">{formatTime(timer)}</span>
          </div>
        </div>
      </header>

      {/* Questions Area */}
      <main className="questions-container">
        {questions.map((question, index) => (
          <div key={question.id} className="question-card-modern">
            <div className="question-header">
              <span className="q-index">પ્રશ્ન {index + 1}</span>
            </div>
            <h3 className="q-text">{question.text}</h3>
            
            <div className="options-grid">
              {question.options.map((option) => (
                <label 
                  key={option.id} 
                  className={`option-box-modern ${userAnswers[question.id.toString()]?.includes(option.id.toString()) ? 'selected' : ''}`}
                >
                  <input
                    type="radio"
                    name={`question_${question.id}`}
                    checked={userAnswers[question.id.toString()]?.includes(option.id.toString())}
                    onChange={() => handleAnswerChange(question.id.toString(), option.id.toString())}
                    disabled={isSubmitted}
                  />
                  <span className="option-label-text">{option.text}</span>
                </label>
              ))}
            </div>
          </div>
        ))}
      </main>

      {/* Bottom Action Bar */}
      <footer className="quiz-action-bar">
        <div className="bar-content">
          <p className="status-text">
            તમે <strong>{Object.keys(userAnswers).length}</strong> / {questions.length} પ્રશ્નોના જવાબ આપ્યા છે.
          </p>
          <button
            onClick={() => handleSubmitQuiz(false)}
            disabled={isSubmitted || questions.length === 0}
            className="btn-submit-advance"
          >
            {isSubmitted ? 'સબમિટ થઈ રહ્યું છે...' : 'ક્વિઝ સબમિટ કરો'}
          </button>
        </div>
      </footer>
    </div>
  );
};

export default QuizAttempt;