import React, { useState, useEffect } from 'react';
import { fetchUserResults } from '../api'; // સાચું ફંક્શન નામ
import '../App.css'; 

const ResultsList = () => {
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchResults = async () => {
            try {
                const data = await fetchUserResults();
                setResults(data);
            } catch (error) {
                console.error("Error fetching results:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchResults();
    }, []);

    if (loading) return <div className="text-center mt-10" style={{color: '#6d28d9'}}>Loading...</div>;

    return (
        <div className="results-container" style={{ padding: '20px', maxWidth: '1000px', margin: '0 auto' }}>
            <h2 className="login-title" style={{ textAlign: 'left', marginBottom: '20px' }}>My Quiz Results</h2>

            <div style={{ background: 'white', borderRadius: '15px', overflow: 'hidden', boxShadow: '0 4px 15px rgba(0,0,0,0.05)' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                        <tr style={{ background: '#6d28d9', color: 'white' }}>
                            <th style={{ padding: '15px', textAlign: 'left' }}>Quiz Name</th>
                            <th style={{ padding: '15px', textAlign: 'center' }}>Score</th>
                            <th style={{ padding: '15px', textAlign: 'center' }}>Percentage</th>
                        </tr>
                    </thead>
                    <tbody>
                        {results.length > 0 ? (
                            results.map((result, index) => (
                                <tr key={index} style={{ borderBottom: '1px solid #f3e8ff' }}>
                                    <td style={{ padding: '15px', fontWeight: '600', color: '#4c1d95' }}>
                                        {/* અહીં result.Quiz ? result.Quiz.title વાપરો જો બેકએન્ડમાંથી આવતું હોય */}
                                        {result.quiz_name || result.Quiz?.title || "Final check quiz"}
                                    </td>
                                    <td style={{ padding: '15px', textAlign: 'center' }}>{result.score} / {result.total_questions || 1}</td>
                                    <td style={{ padding: '15px', textAlign: 'center' }}>
                                        <span style={{ background: '#f3e8ff', color: '#6d28d9', padding: '4px 10px', borderRadius: '20px', fontWeight: 'bold' }}>
                                            {result.percentage}%
                                        </span>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr><td colSpan="3" style={{ padding: '30px', textAlign: 'center' }}>No results found.</td></tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ResultsList;