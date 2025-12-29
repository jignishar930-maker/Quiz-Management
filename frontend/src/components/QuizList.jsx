import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { fetchAvailableQuizzes } from '../api';
import '../App.css';

const QuizList = () => {
    const [quizzes, setQuizzes] = useState([]);

    useEffect(() => {
        fetchAvailableQuizzes().then(setQuizzes);
    }, []);

    return (
        <div className="quiz-page-wrapper">
            <h2 className="section-title">🚀 Available Quizzes</h2>
            <div className="quiz-grid">
                {quizzes.map(quiz => (
                    <div key={quiz.id} className="quiz-card-modern">
                        <div className="quiz-badge">New</div>
                        <h3>{quiz.title}</h3>
                        <p>{quiz.description || "Test your knowledge with this quiz!"}</p>
                        <div className="quiz-footer">
                            <span>Questions: {quiz.total_questions || 0}</span>
                            <Link to={`/quiz/${quiz.id}`} className="start-btn">Start Quiz</Link>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default QuizList;