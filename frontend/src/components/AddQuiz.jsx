import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './AddQuiz.css'; 

const API_BASE_URL = 'http://localhost:8000';

const AddQuiz = () => {
    const navigate = useNavigate();
    const authToken = localStorage.getItem('authToken');

    const [quizDetails, setQuizDetails] = useState({
        title: '',
        description: '',
    });
    const [questions, setQuestions] = useState([]);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    if (!authToken) {
        navigate('/login');
    }

    const handleDetailChange = (e) => {
        setQuizDetails({
            ...quizDetails,
            [e.target.name]: e.target.value,
        });
    };

    const addQuestion = () => {
        setQuestions([
            ...questions,
            { 
                id: Date.now() + questions.length, 
                text: '', 
                marks: 1, 
                options: [
                    { text: '', is_correct: false }, 
                    { text: '', is_correct: false }
                ] 
            },
        ]);
    };

    const handleQuestionChange = (index, e) => {
        const newQuestions = [...questions];
        newQuestions[index][e.target.name] = e.target.value;
        setQuestions(newQuestions);
    };

    const handleOptionChange = (qIndex, oIndex, e) => {
        const newQuestions = [...questions];
        
        if (e.target.name === 'text') {
            newQuestions[qIndex].options[oIndex].text = e.target.value;
        } else if (e.target.name === 'is_correct') {
            newQuestions[qIndex].options.forEach((opt, idx) => {
                opt.is_correct = (idx === oIndex);
            });
        }
        setQuestions(newQuestions);
    };
    
    const addOption = (qIndex) => {
        const newQuestions = [...questions];
        newQuestions[qIndex].options.push({ text: '', is_correct: false });
        setQuestions(newQuestions);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setMessage('');

        const finalData = {
            title: quizDetails.title,
            description: quizDetails.description,
            questions: questions.map(q => ({
                text: q.text,
                marks: parseInt(q.marks),
                options: q.options.filter(o => o.text.trim() !== '') 
            }))
        };
        
        try {
            const response = await axios.post(
                `${API_BASE_URL}/api/quizzes/`,
                finalData,
                {
                    headers: {
                        'Authorization': `Bearer ${authToken}`,
                        'Content-Type': 'application/json'
                    }
                }
            );
            setMessage(`Quiz "${response.data.title}" created successfully.`);
            setQuizDetails({ title: '', description: '' });
            setQuestions([]);

        } catch (err) {
            console.error("Quiz creation failed:", err.response || err);
            setError('Quiz creation failed. Are you logged in as a Teacher?');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="add-quiz-container">
            <h2>➕ Create New Quiz</h2>
            <button onClick={() => navigate('/admin/dashboard')} className="back-btn">
                ← Go back to Dashboard
            </button>
            
            {message && <p className="success-message">{message}</p>}
            {error && <p className="error-message">{error}</p>}
            
            <form onSubmit={handleSubmit}>
                {/* 1. Quiz Details */}
                <div className="quiz-details-section form-section">
                    <h3>Quiz Details</h3>
                    <input
                        type="text"
                        name="title"
                        value={quizDetails.title}
                        onChange={handleDetailChange}
                        placeholder="Quiz Title (e.g., Python Basics)"
                        required
                    />
                    <textarea
                        name="description"
                        value={quizDetails.description}
                        onChange={handleDetailChange}
                        placeholder="Short description of the quiz"
                        required
                    />
                </div>
                <hr/>
                {/* 2. Add Questions Section */}
                <div className="questions-section">
                    <h3>Questions ({questions.length})</h3>
                    {questions.map((question, qIndex) => (
                        // ✅ FIX 1: Added key prop using the unique question index (qIndex)
                        <div key={qIndex} className="question-card">
                            <h4>Question {qIndex + 1}</h4>
                            <input
                                type="text"
                                name="text"
                                value={question.text}
                                onChange={(e) => handleQuestionChange(qIndex, e)}
                                placeholder="Question text"
                                required
                            />
                            <input
                                type="number"
                                name="marks"
                                value={question.marks}
                                onChange={(e) => handleQuestionChange(qIndex, e)}
                                placeholder="Marks"
                                min="1"
                                required
                            />
                            
                            {/* Options */}
                            <div className="options-section">
                                <h5>Options and Correct Answer</h5>
                                {question.options.map((option, oIndex) => (
                                    // ✅ FIX 1: Added key prop using the unique option index (oIndex)
                                    <div key={oIndex} className="option-row">
                                        <input
                                            type="radio"
                                            // ✅ FIX 2: Removed the redundant and incorrect 'name' prop on the radio button input element
                                            // The logic is handled by handleOptionChange, which checks the 'is_correct' boolean state.
                                            checked={option.is_correct}
                                            onChange={(e) => handleOptionChange(qIndex, oIndex, e)}
                                            name="is_correct" // This 'name' prop is crucial for the handleOptionChange logic
                                        />
                                        <input
                                            type="text"
                                            value={option.text}
                                            onChange={(e) => handleOptionChange(qIndex, oIndex, e)}
                                            placeholder={`Option ${oIndex + 1}`}
                                            name="text"
                                            required
                                        />
                                    </div>
                                ))}
                                <button type="button" onClick={() => addOption(qIndex)} className="add-option-btn">
                                    + Add new option
                                </button>
                            </div>
                        </div>
                    ))}
                    <button type="button" onClick={addQuestion} className="add-question-btn">
                        ➕ Add new question
                    </button>
                </div>
                <hr/>
                <button type="submit" className="submit-quiz-btn" disabled={loading || questions.length === 0}>
                    {loading ? 'Submitting...' : 'Save Quiz'}
                </button>
            </form>
        </div>
    );
};

export default AddQuiz;