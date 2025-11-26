import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';

const BASE_URL = 'http://127.0.0.1:8000/api/qms'; 

function QuizAttempt() {
    const { quizId } = useParams(); // Get quizId from the URL (e.g., /attempt/1)
    const navigate = useNavigate();
    
    const [questions, setQuestions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [answers, setAnswers] = useState({}); // Stores answers: {questionId: selectedOptionId}

    useEffect(() => {
        const token = localStorage.getItem('access_token');
        const config = {
            headers: {
                ...(token && { Authorization: `Bearer ${token}` }) 
            }
        };
        
        // Fetch questions filtered by the quizId. Assumes QuestionViewSet supports filtering by quiz_id
        axios.get(`${BASE_URL}/questions/?quiz_id=${quizId}`, config) 
            .then(response => {
                setQuestions(response.data.results || response.data);
                setLoading(false);
            })
            .catch(err => {
                console.error("Error fetching questions:", err);
                setError(`Error loading quiz ${quizId}. Check console.`);
                setLoading(false);
            });
    }, [quizId]);

    const handleOptionChange = (questionId, optionId) => {
        setAnswers(prevAnswers => ({
            ...prevAnswers,
            [questionId]: optionId
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        
        // 🚨 Next major step: Implement the API call to submit these answers to the backend.
        
        console.log("Submitting Answers:", answers);
        alert("Answers submitted! (Next step: implement submit API call)");

        // For now, just navigate back to the dashboard or to a score page placeholder
        // navigate('/student/dashboard');
    };

    if (loading) {
        return <div style={{padding: '20px'}}>Loading Quiz Questions...</div>;
    }

    if (error) {
        return <div style={{ color: 'red', padding: '20px' }}>{error}</div>;
    }
    
    if (questions.length === 0) {
        return <div style={{padding: '20px'}}>No questions found for this quiz. Check Django Admin.</div>;
    }

    return (
        <div style={{ padding: '20px' }}>
            <h2>Quiz Attempt: Quiz ID {quizId}</h2>
            <p>Total Questions: {questions.length}</p>
            
            <form onSubmit={handleSubmit}>
                {questions.map((question, index) => (
                    <div key={question.id} style={{ marginBottom: '30px', border: '1px solid #ddd', padding: '15px', borderRadius: '5px' }}>
                        <h4>{index + 1}. {question.text} (Marks: {question.marks})</h4>
                        
                        <div>
                            {/* Render Options for the current question */}
                            {question.options.map(option => (
                                <label key={option.id} style={{ display: 'block', margin: '10px 0' }}>
                                    <input
                                        type="radio"
                                        name={`question_${question.id}`}
                                        value={option.id}
                                        checked={answers[question.id] === option.id}
                                        onChange={() => handleOptionChange(question.id, option.id)}
                                    />
                                    {option.text}
                                </label>
                            ))}
                        </div>
                    </div>
                ))}
                
                <button type="submit" style={{ padding: '10px 20px', backgroundColor: '#28a745', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer', marginTop: '20px' }}>
                    Submit Quiz
                </button>
            </form>
        </div>
    );
}

export default QuizAttempt;