// src/components/StudentDashboard.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './StudentDashboard.css'; 

const API_BASE_URL = 'http://localhost:8000'; 

const StudentDashboard = () => {
    const [quizzes, setQuizzes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const navigate = useNavigate();
    
    const authToken = localStorage.getItem('authToken');

    useEffect(() => {
        if (!authToken) {
            navigate('/login');
            return;
        }
        fetchQuizzes();
    }, [authToken, navigate]);

    const fetchQuizzes = async () => {
        try {
            const response = await axios.get(
                `${API_BASE_URL}/api/student/quizzes/`,
                {
                    headers: {
                        'Authorization': `Bearer ${authToken}` 
                    }
                }
            );
            setQuizzes(response.data);
            setLoading(false);
        } catch (err) {
            console.error("Failed to fetch quizzes:", err);
            setError('Not found quiz list.Pleace try again.');
            setLoading(false);
            if (err.response && err.response.status === 401) {
                handleLogout();
            }
        }
    };

    const startQuiz = (quizId) => {
        navigate(`/quiz/${quizId}`);
    };

    const handleLogout = () => {
        localStorage.removeItem('authToken');
        localStorage.removeItem('userRole');
        navigate('/login');
    };

    if (loading) {
        return <div className="dashboard-container"><h2>Loanding...</h2></div>;
    }

    return (
        <div className="dashboard-container">
            <div className="dashboard-header">
                <h2>📚 Available quiz</h2>
                <button onClick={handleLogout} className="logout-btn">
                    Logout
                </button>
            </div>

            {error && <p className="error-message">{error}</p>}

            {quizzes.length === 0 ? (
                <p>Not available quiz.</p>
            ) : (
                <div className="quiz-list">
                    {quizzes.map((quiz) => (
                        <div key={quiz.id} className="quiz-card">
                            <h3>{quiz.title}</h3>
                            <p>{quiz.description}</p>
                            <button 
                                onClick={() => startQuiz(quiz.id)}
                                className="start-btn"
                            >
                                Give the quiz
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default StudentDashboard;