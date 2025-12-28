import React, { useState, useEffect, useCallback } from 'react'; // useCallback ઉમેર્યું
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { submitQuiz } from '../api'; // તમારી api.js માંથી ફંક્શન ઇમ્પોર્ટ કર્યું

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

  useEffect(() => {
    // 1. ટોકનનું નામ તમારી api.js મુજબ 'access_token' રાખો
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

 
  const handleAnswerChange = (questionId, optionId) => {
    setUserAnswers(prev => ({ ...prev, [questionId]: [optionId] }));
  };
 
  // --- 4. Submit Quiz (useCallback સાથે) ---
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
            navigate('/user/results'); 
        }
    } catch (err) {
        setIsSubmitted(false);
        alert("ભૂલ આવી: " + (err.message || "સર્વર કનેક્શન પ્રોબ્લેમ"));
    }
  }, [isSubmitted, userAnswers, quizId, navigate]); // આ ડિપેન્ડન્સી છે
  
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

  if (loading) return <div className="text-center p-10 text-xl">ક્વિઝ લોડ થઈ રહી છે...</div>;
  if (error) return <div className="text-center p-10 text-red-600 font-bold">{error}</div>;

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-3xl mx-auto bg-white shadow-lg rounded-lg">
        <div className="p-4 bg-indigo-600 text-white flex justify-between items-center rounded-t-lg">
          <h1 className="text-xl font-bold">{quiz.title}</h1>
          <div className={`px-4 py-1 rounded text-lg font-mono ${timer < 60 ? 'bg-red-500' : 'bg-indigo-800'}`}>
            {formatTime(timer)}
          </div>
        </div>

        <div className="p-6 space-y-6">
          {questions.map((question, index) => (
            <div key={question.id} className="p-4 border rounded-lg bg-gray-50">
              <p className="font-semibold text-lg mb-4">{index + 1}. {question.text}</p>
              <div className="space-y-2">
                {question.options.map((option) => (
                  <label key={option.id} className="flex items-center p-3 border rounded bg-white hover:bg-indigo-50 cursor-pointer transition">
                    <input
                      type="radio"
                      name={`question_${question.id}`}
                      checked={userAnswers[question.id]?.includes(option.id.toString())}
                      onChange={() => handleAnswerChange(question.id.toString(), option.id.toString())}
                      className="mr-3 w-4 h-4 text-indigo-600"
                      disabled={isSubmitted}
                    />
                    <span>{option.text}</span>
                  </label>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="p-6 border-t bg-gray-50 text-right">
          <button
            onClick={() => handleSubmitQuiz(false)}
            disabled={isSubmitted || questions.length === 0}
            className={`px-8 py-3 rounded-lg text-white font-bold text-lg shadow-md transition ${
              isSubmitted ? 'bg-gray-400' : 'bg-green-600 hover:bg-green-700 active:scale-95'
            }`}
          >
            {isSubmitted ? 'સબમિટ થઈ રહ્યું છે...' : 'ક્વિઝ સબમિટ કરો'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default QuizAttempt;