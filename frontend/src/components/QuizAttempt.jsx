import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './QuizAttempt.css'; 
import '../App.css'; // સાચો રિલેટિવ પાથ

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

  // ૧. ક્વિઝ ડેટા મેળવવો
  useEffect(() => {
    const token = localStorage.getItem('access_token') || localStorage.getItem('authToken');
    
    if (!token) {
      navigate('/login'); // લોગિન વગર એક્સેસ ના મળે
      return;
    }

    const fetchQuizData = async () => {
      try {
        // બદલાયેલ URL: તમારા Django DefaultRouter મુજબ
        const response = await axios.get(`http://127.0.0.1:8000/api/qms/quizzes/${quizId}/`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });

        const data = response.data;
        // Serializer મુજબ ડેટા સેટિંગ
        setQuiz({
          title: data.title || data.quiz_title || "Quiz",
          duration: data.duration || data.quiz_duration || 10
        });
        
        setQuestions(data.questions || []);
        setTimer((data.duration || data.quiz_duration || 10) * 60);
        setLoading(false);
      } catch (err) {
        console.error("Fetch error details:", err);
        setError("not load quiz. Pleace try again...");
        setLoading(false);
      }
    };

    fetchQuizData();
  }, [quizId, navigate]);

  // ૨. જવાબ સેટ કરવા
  const handleAnswerChange = (questionId, optionId) => {
    setUserAnswers(prev => ({ ...prev, [questionId]: optionId }));
  };

  // ૩. ક્વિઝ સબમિટ કરવી
  const handleSubmitQuiz = useCallback(async (isAutoSubmit = false) => {
    if (isSubmitted) return;
    setIsSubmitted(true);

    const token = localStorage.getItem('access_token') || localStorage.getItem('authToken');

    try {
      // તમારા urls.py મુજબ 'submit/' પાથ પર ડેટા મોકલો
      await axios.post(`http://127.0.0.1:8000/api/qms/submit/`, {
        quiz_id: parseInt(quizId),
        answers: userAnswers
      }, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      alert("complaly submited!");
      navigate('/my-results'); 
    } catch (err) {
      console.error("Submit error:", err);
      setIsSubmitted(false);
      alert("submit error.");
    }
  }, [isSubmitted, userAnswers, quizId, navigate]);

  // ૪. ટાઈમર લોજિક
  useEffect(() => {
    if (loading || !quiz || isSubmitted) return;
    const interval = setInterval(() => {
      setTimer((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          handleSubmitQuiz(true);
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
      <header className="quiz-attempt-header">
        <div className="header-inner">
          <h2>{quiz.title}</h2>
          <div className={`timer-box ${timer < 60 ? 'critical' : ''}`}>
            <span>⏱️ {formatTime(timer)}</span>
          </div>
        </div>
      </header>

      <main className="questions-container">
        {questions.length > 0 ? (
          questions.map((question, index) => (
            <div key={question.id} className="question-card-modern">
              <h3 className="q-text">{index + 1}. {question.text}</h3>
              <div className="options-grid">
                {question.options && question.options.map((option) => (
                  <label key={option.id} className={`option-box-modern ${userAnswers[question.id] === option.id ? 'selected' : ''}`}>
                    <input
                      type="radio"
                      name={`question_${question.id}`}
                      value={option.id}
                      checked={userAnswers[question.id] === option.id}
                      onChange={() => handleAnswerChange(question.id, option.id)}
                      disabled={isSubmitted}
                    />
                    <span className="option-label-text">{option.text}</span>
                  </label>
                ))}
              </div>
            </div>
          ))
        ) : (
          <p>There are no quition available in this quiz.</p>
        )}
      </main>

      <footer className="quiz-action-bar">
        <button onClick={() => handleSubmitQuiz(false)} disabled={isSubmitted} className="btn-submit-advance">
          {isSubmitted ? 'Submitting...' : 'submit'}
        </button>
      </footer>
    </div>
  );
};

export default QuizAttempt;
