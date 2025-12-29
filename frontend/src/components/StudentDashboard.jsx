import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './StudentDashboard.css'; 

const API_BASE_URL = 'http://localhost:8000'; 

const StudentDashboard = () => {
    const [quizzes, setQuizzes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const navigate = useNavigate();
    
    // અગત્યનું: ચેક કરો કે લોગિન વખતે કયા નામે ટોકન સેવ થાય છે (access_token કે authToken?)
    const authToken = localStorage.getItem('access_token') || localStorage.getItem('authToken');

    // લોગઆઉટ ફંક્શન
    const handleLogout = useCallback(() => {
        localStorage.removeItem('access_token');
        localStorage.removeItem('authToken');
        localStorage.removeItem('userRole');
        navigate('/login');
    }, [navigate]);

    // ક્વિઝ ડેટા લાવવા માટેનું ફંક્શન
    const fetchQuizzes = useCallback(async () => {
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
            setError('Quiz list not found. Please try again.');
            setLoading(false);
            if (err.response && err.response.status === 401) {
                handleLogout();
            }
        }
    }, [authToken, handleLogout]);

    useEffect(() => {
        if (!authToken) {
            navigate('/login');
            return;
        }
        fetchQuizzes();
    }, [authToken, navigate, fetchQuizzes]); // અહીં fetchQuizzes ઉમેરવાથી વોર્નિંગ જતી રહેશે

    const startQuiz = (quizId) => {
        navigate(`/quiz/${quizId}`);
    };

    if (loading) {
        return <div className="dashboard-container"><h2 className="loading-text">Loading Quizzes...</h2></div>;
    }

    return (
        <div className="dashboard-container">
            <div className="dashboard-header">
                <h2>📚 Available Quizzes</h2>
                <button onClick={handleLogout} className="logout-btn">
                    Logout
                </button>
            </div>

            {error && <div className="error-box">{error}</div>}

            {quizzes.length === 0 ? (
                <div className="no-quiz">
                    <p>No quizzes available right now.</p>
                </div>
            ) : (
                <div className="quiz-list">
                    {quizzes.map((quiz) => (
                        <div key={quiz.id} className="quiz-card">
                            <div className="quiz-card-content">
                                <h3>{quiz.title}</h3>
                                <p>{quiz.description || "No description available."}</p>
                                <button 
                                    onClick={() => startQuiz(quiz.id)}
                                    className="start-btn"
                                >
                                    Take Quiz
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default StudentDashboard;