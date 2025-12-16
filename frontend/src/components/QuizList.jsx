import React, { useState, useEffect } from 'react';
import { fetchAvailableQuizzes } from '../api';

function QuizList() {
    // ✅ શરૂઆતમાં ખાતરી કરો કે તે ખાલી એરે [] છે.
    const [quizzes, setQuizzes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        // API કોલ પહેલા હંમેશા error અને loading ને રીસેટ કરો
        setLoading(true);
        setError(null);
        
        fetchAvailableQuizzes('/api/qms/quizzes/') 
            .then(data => {
                // બેકએન્ડમાંથી સીધો ડેટા એરે મેળવો
                if (Array.isArray(data)) {
                    setQuizzes(data);
                } else {
                    // જો response.data એરે ન હોય, તો તેને ખાલી એરે સેટ કરો
                    setQuizzes([]); 
                }
                setLoading(false);
            })
            .catch(err => {
                console.error("API Call Error:", err);
                
                if (err.response && err.response.status === 401) {
                    setError("not access. Pleace login now.");
                } else {
                    // જો કોઈ ભૂલ આવે, તો quizzes ને ખાલી એરે સેટ કરો
                    setQuizzes([]); 
                    setError("quiz find error. chek the server.");
                }
                setLoading(false);
            });
    }, []);

    // રેન્ડરિંગ: લોડિંગ, ભૂલ, અને પછી ક્વિઝ લિસ્ટ
    if (loading) {
        return <div>Loading the quiz...</div>;
    }

    if (error) {
        return <div style={{ color: 'red', padding: '20px' }}>{error}</div>;
    }

    return (
        <div style={{ padding: '20px' }}>
            <h2>📝 Uvailable quiz</h2>
            
            {/* ✅ સુરક્ષિત ચેક: ખાતરી કરો કે quizzes એ એરે છે અને તેની લંબાઈ 0 છે */}
            {Array.isArray(quizzes) && quizzes.length === 0 ? (
                <p>Not found the quiz.</p>
            ) : (
                <ul>
                    {/* ✅ સુરક્ષિત map: માત્ર જો quizzes એરે હોય તો જ map કરો */}
                    {Array.isArray(quizzes) && quizzes.map(quiz => (
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