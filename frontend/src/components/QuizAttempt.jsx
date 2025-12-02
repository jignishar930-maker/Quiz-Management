import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

// Base URL for the Django backend API
const API_BASE_URL = 'http://127.0.0.1:8000/api/qms';

const QuizAttempt = () => {
  const { quizId } = useParams(); // Gets the quiz ID from the URL (e.g., /quiz/1)
  const navigate = useNavigate();

  const [quiz, setQuiz] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userAnswers, setUserAnswers] = useState({}); // Stores answers: {questionId: [selectedOptionId(s)]}
  const [timer, setTimer] = useState(0); // Timer in seconds
  const [isSubmitted, setIsSubmitted] = useState(false);

  // --- 1. Fetch Quiz Data ---
  useEffect(() => {
    const token = localStorage.getItem('access');
    if (!token) {
      navigate('/login');
      return;
    }

    const fetchQuizData = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/quiz/${quizId}/questions/`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        
        const { quiz_duration, questions } = response.data;

        setQuiz({
            title: response.data.quiz_title,
            duration: quiz_duration
        });
        setQuestions(questions);
        setTimer(quiz_duration * 60); // Convert minutes to seconds
        setLoading(false);
      } catch (err) {
        console.error("Error fetching quiz data:", err);
        setError("Failed to load quiz. Please check your network or login status.");
        setLoading(false);
      }
    };

    fetchQuizData();
  }, [quizId, navigate]);

  // --- 2. Timer Logic ---
  useEffect(() => {
    if (loading || !quiz || isSubmitted) return;

    // Start the countdown timer
    const interval = setInterval(() => {
      setTimer((prevTimer) => {
        if (prevTimer <= 1) {
          clearInterval(interval);
          // Auto-submit when time runs out
          if (!isSubmitted) {
             handleSubmitQuiz(true); // Auto-submit
          }
          return 0;
        }
        return prevTimer - 1;
      });
    }, 1000);

    // Cleanup function
    return () => clearInterval(interval);
  }, [loading, quiz, isSubmitted]);


  // --- 3. Handle Answer Change ---
  const handleAnswerChange = (questionId, optionId) => {
    setUserAnswers(prevAnswers => {
      const currentAnswers = prevAnswers[questionId] || [];
      
      // For simplicity, we assume single-choice questions for now (radio button behavior).
      // If your model supports multiple options, change this to toggle the optionId in the array.
      // E.g., const index = currentAnswers.indexOf(optionId); ... if (index > -1) ... else ...
      
      // Single Choice Logic: Replace existing answer
      return {
        ...prevAnswers,
        [questionId]: [optionId], // Always store as an array for consistency with backend
      };
    });
  };

  // --- 4. Submit Quiz ---
  const handleSubmitQuiz = async (isAutoSubmit = false) => {
    if (isSubmitted) return;
    setIsSubmitted(true);
    
    // Convert userAnswers structure for the API: {questionId: [optionId]}
    const answersPayload = {};
    Object.entries(userAnswers).forEach(([qId, selectedOptions]) => {
        // Ensure keys are integers for the Python backend
        answersPayload[parseInt(qId)] = selectedOptions.map(id => parseInt(id));
    });

    const payload = {
      quiz_id: parseInt(quizId),
      answers: answersPayload,
    };

    const token = localStorage.getItem('access');
    
    try {
        const response = await axios.post(`${API_BASE_URL}/quiz/submit/`, payload, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });
        
        // After successful submission, redirect to the results page
        if (response.data.result_id) {
            navigate(`/result/${response.data.result_id}`);
        } else {
            setError("Submission failed to return a valid result ID.");
        }
    } catch (err) {
        console.error("Submission error:", err.response ? err.response.data : err);
        setIsSubmitted(false); // Allow re-submission if network fails
        setError("Failed to submit quiz. Please try again.");
    }
  };

  // --- Helper for Time Display ---
  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  // --- Loading and Error States ---
  if (loading) return <div className="text-center p-8 text-xl text-gray-700">Loading Quiz...</div>;
  if (error) return <div className="text-center p-8 text-xl text-red-600 font-bold">{error}</div>;
  if (!quiz) return <div className="text-center p-8 text-xl text-gray-700">Quiz not found or loaded.</div>;

  // --- Render Component ---
  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-8">
      <div className="max-w-4xl mx-auto bg-white shadow-xl rounded-lg overflow-hidden">
        
        {/* Header and Timer */}
        <div className="p-5 border-b border-gray-200 flex justify-between items-center bg-indigo-600 text-white">
          <h1 className="text-2xl font-extrabold">{quiz.title}</h1>
          <div className={`text-2xl font-mono px-4 py-2 rounded-full shadow-lg ${timer < 60 ? 'bg-red-500' : 'bg-indigo-700'}`}>
            Time Left: {formatTime(timer)}
          </div>
        </div>

        {/* Question List */}
        <div className="p-6 space-y-8">
          {questions.length === 0 ? (
            <p className="text-center text-gray-500 text-lg">No questions found for this quiz.</p>
          ) : (
            questions.map((question, index) => (
              <div key={question.id} className="border border-gray-100 p-5 rounded-xl shadow-md bg-gray-50">
                <p className="text-lg font-semibold mb-3 text-gray-800">
                  {index + 1}. {question.text}
                </p>
                
                {/* Options List */}
                <div className="space-y-3 mt-4">
                  {question.options.map((option) => (
                    <label 
                      key={option.id} 
                      className={`flex items-center p-3 rounded-lg cursor-pointer transition duration-200 
                                 ${userAnswers[question.id] && userAnswers[question.id].includes(option.id.toString()) 
                                   ? 'bg-indigo-100 border-indigo-500 ring-2 ring-indigo-500' 
                                   : 'bg-white hover:bg-gray-100 border border-gray-300'}`
                              }
                    >
                      <input
                        type="radio" // Use radio for single-choice questions
                        name={`question_${question.id}`}
                        value={option.id}
                        checked={userAnswers[question.id]?.includes(option.id.toString()) || false}
                        onChange={() => handleAnswerChange(question.id.toString(), option.id.toString())}
                        className="mr-3 h-5 w-5 text-indigo-600 focus:ring-indigo-500"
                        disabled={isSubmitted}
                      />
                      <span className="text-gray-700">{option.text}</span>
                    </label>
                  ))}
                </div>
              </div>
            ))
          )}
        </div>

        {/* Submission Button */}
        <div className="p-6 bg-gray-100 border-t border-gray-200">
          <button
            onClick={() => handleSubmitQuiz(false)}
            disabled={isSubmitted || loading || questions.length === 0}
            className={`w-full py-3 px-4 text-white font-bold rounded-xl text-lg transition duration-300 transform hover:scale-[1.01] shadow-lg 
                        ${isSubmitted || loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-green-600 hover:bg-green-700'}`
                      }
          >
            {isSubmitted ? 'Submitting...' : 'Submit Quiz & View Result'}
          </button>
          {timer === 0 && !isSubmitted && (
             <p className="text-center text-red-500 mt-2 font-medium">Time's up! Auto-submitting...</p>
          )}
        </div>
        
      </div>
    </div>
  );
};

export default QuizAttempt;