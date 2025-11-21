import React, { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './ScorePage.css'; 

const ScorePage = () => {

    const location = useLocation();
    const navigate = useNavigate();
    
    
    const result = location.state?.result; 

    
    useEffect(() => {
        if (!result) {
            navigate('/student/dashboard', { replace: true });
        }
    }, [result, navigate]);

    if (!result) {
        return null; 
    }

    const { score, total_marks, message } = result;

    return (
        <div className="score-page-container">
            <div className="score-box">
                <h2>🎉 Finish the quiz!</h2>
                <p className="message">{message}</p>
                
                <div className="score-display">
                    <h3>Your Score:</h3>
                    <p className="score-value">{score} / {total_marks}</p>
                </div>

                <div className="action-buttons">
                    <button 
                        onClick={() => navigate('/student/dashboard')}
                        className="btn-dashboard"
                    >
                        return the deshboard
                    </button>
                    
                </div>
            </div>
        </div>
    );
};

export default ScorePage;