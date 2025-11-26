import React, { useState, useEffect } from 'react';
import axios from 'axios';

// Main URL for the Django API
const BASE_URL = 'http://127.0.0.1:8000/api/qms'; 

function QuizList() {
    const [quizzes, setQuizzes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        // 1. Get the JWT token from local storage
        const token = localStorage.getItem('access_token'); 

        // 2. Define headers to send the token
        const config = {
            headers: {
                // Check if the token exists, and if so, add the Authorization header
                ...(token && { Authorization: `Bearer ${token}` }) 
            }
        };

        // Send GET request to fetch quiz data
        axios.get(`${BASE_URL}/quizzes/`, config)
            .then(response => {
                setQuizzes(response.data.results || response.data); 
                setLoading(false);
            })
            .catch(err => {
                console.error("API Call Error:", err);
                // Handle 401 errors, which means the token is missing or expired
                if (err.response && err.response.status === 401) {
                    setError("Unauthorized access. Please log in to view this list.");
                } else {
                    setError("Error fetching quizzes. Check if backend is running.");
                }
                setLoading(false);
            });
    }, []);

    if (loading) {
        return <div>Loading Quizzes...</div>;
    }

    if (error) {
        return <div style={{ color: 'red', padding: '20px' }}>{error}</div>;
    }

    return (
        <div style={{ padding: '20px' }}>
            <h2>📝 Available Quizzes</h2>
            {quizzes.length === 0 ? (
                <p>No quizzes found. Please add a quiz via the Django Admin page.</p>
            ) : (
                <ul>
                    {quizzes.map(quiz => (
                        <li key={quiz.id} style={{ marginBottom: '10px', borderBottom: '1px dotted #ccc' }}>
                            <strong>{quiz.title}</strong> ({quiz.id})<br />
                            <small>{quiz.description}</small>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}

export default QuizList;