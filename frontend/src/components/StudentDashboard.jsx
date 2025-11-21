// src/components/StudentDashboard.jsx

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './StudentDashboard.css'; // સ્ટાઇલિંગ માટે

const API_BASE_URL = 'http://localhost:8000'; 

const StudentDashboard = () => {
    const [quizzes, setQuizzes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const navigate = useNavigate();
    
    // Local Storage માંથી Auth Token મેળવો
    const authToken = localStorage.getItem('authToken');

    // જો Auth Token ન હોય તો લોગિન પર રીડાયરેક્ટ કરો
    useEffect(() => {
        if (!authToken) {
            navigate('/login');
            return;
        }
        fetchQuizzes();
    }, [authToken, navigate]);


    // ઉપલબ્ધ ક્વિઝને બેકએન્ડમાંથી ફેચ કરવાનું ફંક્શન
    const fetchQuizzes = async () => {
        try {
            const response = await axios.get(
                `${API_BASE_URL}/api/student/quizzes/`,
                {
                    headers: {
                        // JWT ટોકન Authorization હેડર દ્વારા મોકલો
                        'Authorization': `Bearer ${authToken}` 
                    }
                }
            );
            setQuizzes(response.data);
            setLoading(false);
        } catch (err) {
            console.error("Failed to fetch quizzes:", err);
            setError('ક્વિઝની યાદી મેળવવામાં નિષ્ફળ. કૃપા કરીને ફરી પ્રયાસ કરો.');
            setLoading(false);
            // જો ટોકન અમાન્ય હોય, તો યુઝરને લોગઆઉટ કરો
            if (err.response && err.response.status === 401) {
                handleLogout();
            }
        }
    };

    // ક્વિઝ આપવા માટે નેવિગેશન
    const startQuiz = (quizId) => {
        navigate(`/quiz/${quizId}`);
    };

    // લોગઆઉટ ફંક્શન
    const handleLogout = () => {
        localStorage.removeItem('authToken');
        localStorage.removeItem('userRole');
        navigate('/login');
    };

    if (loading) {
        return <div className="dashboard-container"><h2>લોડિંગ...</h2></div>;
    }

    return (
        <div className="dashboard-container">
            <div className="dashboard-header">
                <h2>📚 ઉપલબ્ધ ક્વિઝ</h2>
                <button onClick={handleLogout} className="logout-btn">
                    લોગઆઉટ
                </button>
            </div>

            {error && <p className="error-message">{error}</p>}

            {quizzes.length === 0 ? (
                <p>અત્યારે કોઈ ક્વિઝ ઉપલબ્ધ નથી.</p>
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
                                ક્વિઝ આપો
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default StudentDashboard;