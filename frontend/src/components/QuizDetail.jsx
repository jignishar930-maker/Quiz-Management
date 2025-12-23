import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom'; // useNavigate ઉમેર્યું
import { fetchQuizDetail, submitQuiz } from '../api'; // submitQuiz ફંક્શન api.js માં હોવું જોઈએ

function QuizDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [quiz, setQuiz] = useState(null);
    const [selectedAnswers, setSelectedAnswers] = useState({}); // જવાબો સ્ટોર કરવા માટે
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchQuizDetail(id).then(data => {
            setQuiz(data);
            setLoading(false);
        }).catch(err => setLoading(false));
    }, [id]);

    // જ્યારે યુઝર ઓપ્શન સિલેક્ટ કરે ત્યારે
    const handleOptionChange = (questionId, optionId) => {
        setSelectedAnswers({
            ...selectedAnswers,
            [questionId]: [optionId] // backend લિસ્ટ ફોર્મેટમાં જવાબ માંગે છે
        });
    };

    // સબમિટ બટન પર ક્લિક કરવાથી
    const handleSubmit = async () => {
        try {
            const response = await submitQuiz(id, selectedAnswers);
            alert(`તમારો સ્કોર: ${response.score} / ${response.total_questions}`);
            navigate('/my-results'); // રિઝલ્ટ પેજ પર જવા માટે
        } catch (err) {
            alert("સબમિશનમાં ભૂલ આવી: " + (err.response?.data?.detail || "Unknown error"));
        }
    };

    if (loading) return <div>Loading...</div>;

    return (
        <div style={{ padding: '20px' }}>
            <h1>{quiz?.title}</h1>
            <hr />
            {quiz?.questions?.map((q) => (
                <div key={q.id} style={{ marginBottom: '20px', textAlign: 'left', border: '1px solid #ddd', padding: '15px' }}>
                    <h3>{q.text}</h3>
                    {q.options.map(opt => (
                        <div key={opt.id}>
                            <input 
                                type="radio" 
                                name={`question-${q.id}`} 
                                onChange={() => handleOptionChange(q.id, opt.id)}
                            />
                            <label style={{ marginLeft: '10px' }}>{opt.text}</label>
                        </div>
                    ))}
                </div>
            ))}
            <button 
                onClick={handleSubmit}
                style={{ padding: '10px 20px', backgroundColor: 'green', color: 'white', cursor: 'pointer' }}
            >
                Submit Quiz
            </button>
        </div>
    );
}

export default QuizDetail;