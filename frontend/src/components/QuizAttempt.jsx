// src/components/QuizAttempt.jsx

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import './QuizAttempt.css'; 

const API_BASE_URL = 'http://localhost:8000';

const QuizAttempt = () => {
    const { quizId } = useParams(); // URL માંથી ક્વિઝ ID મેળવો
    const navigate = useNavigate();
    
    const [quizData, setQuizData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    // જવાબો સ્ટોર કરવા માટે: { question_id: selected_option_id, ... }
    const [answers, setAnswers] = useState({});
    
    const authToken = localStorage.getItem('authToken');

    // ક્વિઝ ડેટા ફેચ કરો (નોંધ: આના માટે બેકએન્ડમાં એક GET API બનાવવું પડશે જે એક ચોક્કસ Quiz ID નો ડેટા આપે)
    const fetchQuizData = async () => {
        if (!authToken) {
            navigate('/login');
            return;
        }

        try {
            // ધારો કે તમે ક્વિઝ જોવા માટે /api/quizzes/<id> નો ઉપયોગ કરી શકો છો (પરંતુ સ્ટુડન્ટ સિરિયલાઇઝર સાથે)
            // જો બેકએન્ડમાં આ API ફક્ત teacher માટે હોય, તો તમારે student માટે એક અલગ GET API બનાવવું પડશે.
            const response = await axios.get(
                `${API_BASE_URL}/api/quizzes/${quizId}/`, 
                {
                    headers: {
                        'Authorization': `Bearer ${authToken}`
                    }
                }
            );
            // અહીં ધારીએ કે બેકએન્ડ (view માં) સ્ટુડન્ટને StudentQuizAttemptSerializer દ્વારા ડેટા મોકલે છે
            setQuizData(response.data);
            setLoading(false);
        } catch (err) {
            console.error("Failed to fetch quiz details:", err);
            setError('ક્વિઝનો ડેટા મેળવવામાં નિષ્ફળ.');
            setLoading(false);
            if (err.response && err.response.status === 401) {
                navigate('/login');
            }
        }
    };

    useEffect(() => {
        fetchQuizData();
    }, [quizId, navigate]);

    // વિકલ્પ પસંદ થવા પર જવાબ સ્ટોર કરો
    const handleOptionChange = (questionId, optionId) => {
        setAnswers({
            ...answers,
            [questionId]: optionId,
        });
    };

    // ક્વિઝ સબમિટ કરો
    const handleSubmit = async () => {
        const finalAnswers = Object.keys(answers).map(qId => ({
            question_id: parseInt(qId),
            selected_option_id: answers[qId],
        }));

        try {
            const response = await axios.post(
                `${API_BASE_URL}/api/student/submit/${quizId}/`,
                { answers: finalAnswers },
                {
                    headers: {
                        'Authorization': `Bearer ${authToken}`,
                    }
                }
            );
            
            // સબમિશન પછી સ્કોર પેજ પર રીડાયરેક્ટ કરો
            navigate('/student/scores', { state: { result: response.data } });

        } catch (err) {
            console.error("Quiz submission failed:", err);
            setError(err.response?.data?.detail || 'ક્વિઝ સબમિટ કરવામાં ભૂલ આવી.');
        }
    };

    if (loading) return <div className="quiz-attempt-container"><h2>લોડિંગ ક્વિઝ...</h2></div>;
    if (error) return <div className="quiz-attempt-container"><p className="error-message">{error}</p></div>;
    if (!quizData) return <div className="quiz-attempt-container"><p>ક્વિઝ ડેટા ઉપલબ્ધ નથી.</p></div>;


    return (
        <div className="quiz-attempt-container">
            <h2>{quizData.title}</h2>
            <p className="quiz-description">{quizData.description}</p>
            
            {quizData.questions.map((question, index) => (
                <div key={question.id} className="question-card">
                    <h4>{index + 1}. {question.text} (Marks: {question.marks})</h4>
                    
                    <div className="options-list">
                        {question.options.map((option) => (
                            <div key={option.id} className="option-item">
                                <input
                                    type="radio"
                                    id={`q${question.id}-o${option.id}`}
                                    name={`question-${question.id}`}
                                    value={option.id}
                                    onChange={() => handleOptionChange(question.id, option.id)}
                                    checked={answers[question.id] === option.id}
                                />
                                <label htmlFor={`q${question.id}-o${option.id}`}>{option.text}</label>
                            </div>
                        ))}
                    </div>
                </div>
            ))}
            
            <button 
                onClick={handleSubmit} 
                className="submit-quiz-btn"
                disabled={Object.keys(answers).length !== quizData.questions.length}
            >
                ક્વિઝ સબમિટ કરો
            </button>
            <p className="submission-note">બધા પ્રશ્નોના જવાબ આપવા ફરજિયાત છે.</p>
        </div>
    );
};

export default QuizAttempt;