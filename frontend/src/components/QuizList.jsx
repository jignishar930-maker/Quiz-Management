import React, { useState, useEffect } from 'react';
import { fetchAvailableQuizzes } from '../api';

// BASE_URL હવે api.js માં સેટ થયેલ હોવાથી, તમે તેને ટૂંકાવી શકો છો
// જો કે, સ્પષ્ટતા માટે તેને રાખવું હોય તો રાખી શકાય.
// const BASE_URL = 'http://127.0.0.1:8000/api/qms'; // જરૂર નથી

function QuizList() {
    const [quizzes, setQuizzes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        // GET વિનંતી મોકલો. api.js ઓટોમેટીકલી ટોકન અને baseURL ઉમેરશે.
        // જો baseURL api.js માં 'http://127.0.0.1:8000' સેટ કરેલ હોય, તો:
        fetchAvailableQuizzes('/api/qms/quizzes/') 
            .then(response => {
                // DRFનું ModelViewSet ક્યારેક 'results' માં ડેટા આપે છે
                setQuizzes(response.data.results || response.data); 
                setLoading(false);
            })
            .catch(err => {
                console.error("API Call Error:", err);
                
                // 401 ભૂલનું હેન્ડલિંગ
                if (err.response && err.response.status === 401) {
                    // જો 401 આવે, તો યુઝરને લૉગિન પેજ પર રીડાયરેક્ટ કરવું જોઈએ.
                    setError("not access.Pleace login now.");
                    // navigate('/login'); // જો તમે Router નો ઉપયોગ કરતા હોવ
                } else {
                    setError("quiz find error. chek the server.");
                }
                setLoading(false);
            });
    }, []);

    if (loading) {
        return <div>Loading the quiz...</div>;
    }

    if (error) {
        return <div style={{ color: 'red', padding: '20px' }}>{error}</div>;
    }

    return (
        <div style={{ padding: '20px' }}>
            <h2>📝 Uvailable quiz</h2>
            {quizzes.length === 0 ? (
                <p>Not found the quiz.</p>
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