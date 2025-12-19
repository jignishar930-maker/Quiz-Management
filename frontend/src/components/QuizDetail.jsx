import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { fetchQuizDetail } from '../api';

function QuizDetail() {
    const { id } = useParams(); // URL માંથી Quiz ID મેળવો
    const [quiz, setQuiz] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchQuizDetail(id)
            .then(data => {
                setQuiz(data);
                setLoading(false);
            })
            .catch(err => {
                console.error(err);
                setLoading(false);
            });
    }, [id]);

    if (loading) return <div>Loading questions...</div>;
    if (!quiz) return <div>Quiz not found.</div>;

    return (
        <div style={{ padding: '20px' }}>
            <h1>{quiz.title}</h1>
            <p>{quiz.description}</p>
            <hr />
            
            {quiz.questions && quiz.questions.map((q, index) => (
                <div key={q.id} style={{ marginBottom: '20px', padding: '15px', border: '1px solid #eee' }}>
                    <h3>{index + 1}. {q.text}</h3>
                    {q.options && q.options.map(opt => (
                        <div key={opt.id}>
                            <input type="radio" name={`question-${q.id}`} value={opt.id} />
                            <label style={{ marginLeft: '10px' }}>{opt.text}</label>
                        </div>
                    ))}
                </div>
            ))}
            <button style={{ padding: '10px 20px', backgroundColor: 'green', color: 'white', border: 'none', cursor: 'pointer' }}>
                Submit Quiz
            </button>
        </div>
    );
}

export default QuizDetail;