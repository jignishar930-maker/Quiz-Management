import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { CheckCircle, XCircle, ChevronLeft } from 'lucide-react'; // icons

const API_BASE_URL = 'http://127.0.0.1:8000/api';

const ResultPage = () => {
    // URL માંથી result_id મેળવો
    const { resultId } = useParams();
    const [result, setResult] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // ડેટા મેળવવા માટેની ફંક્શન
    useEffect(() => {
        const fetchResult = async () => {
            if (!resultId) {
                setError("Result ID is missing.");
                setLoading(false);
                return;
            }

            try {
                // તમારે આ URL ને તમારા ResultViewSet URL સાથે મેચ કરવું પડશે
                const response = await fetch(`${API_BASE_URL}/qms/results/${resultId}/`, {
                    headers: {
                        // Auth token અહીંયા ઉમેરવાની જરૂર પડશે.
                        // હાલમાં, અમે માત્ર ડેટા fetch કરી રહ્યા છીએ.
                        'Authorization': `Bearer ${localStorage.getItem('access_token')}` 
                    }
                });

                if (!response.ok) {
                    // જો Response 404 કે 500 હોય
                    throw new Error(`Failed to fetch result: ${response.status} ${response.statusText}`);
                }

                const data = await response.json();
                setResult(data);
                
            } catch (err) {
                console.error("Fetch Error:", err);
                setError(err.message || "An unknown error occurred while fetching the result.");
            } finally {
                setLoading(false);
            }
        };

        fetchResult();
    }, [resultId]);

    // Loading State
    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-[50vh]">
                <div className="text-xl font-semibold">Loading Result...</div>
            </div>
        );
    }

    // Error State
    if (error) {
        return (
            <div className="container mx-auto p-4 max-w-lg mt-10 bg-red-100 text-red-700 border border-red-400 rounded-lg shadow-md">
                <h2 className="text-2xl font-bold mb-4">Error</h2>
                <p>{error}</p>
                <button 
                    onClick={() => window.location.href = '/'}
                    className="mt-4 flex items-center text-sm font-semibold text-red-600 hover:text-red-800"
                >
                    <ChevronLeft className="w-4 h-4 mr-1"/> Back to Home
                </button>
            </div>
        );
    }
    
    // જો result object null હોય
    if (!result) {
        return <div className="text-center mt-10 text-lg">No result data found.</div>;
    }

    const { quiz, score, percentage, total_questions } = result;
    const isPass = percentage >= 60; // ઉદાહરણ તરીકે, 60% પાસ માર્ક્સ

    return (
        <div className="container mx-auto p-4 max-w-4xl">
            <div className="bg-white p-8 rounded-xl shadow-2xl border-t-4" style={{borderColor: isPass ? '#10B981' : '#EF4444'}}>
                
                {/* Header */}
                <div className="flex justify-center items-center mb-6">
                    {isPass ? (
                        <CheckCircle className="w-16 h-16 text-green-500 mr-4" />
                    ) : (
                        <XCircle className="w-16 h-16 text-red-500 mr-4" />
                    )}
                    <h1 className="text-4xl font-extrabold text-gray-800">
                        {isPass ? "Congratulations! You Passed" : "Quiz Failed. Try Again!"}
                    </h1>
                </div>

                {/* Quiz Info */}
                <h2 className="text-3xl font-semibold text-indigo-700 border-b pb-2 mb-6">
                    Quiz: {quiz?.title || "Unknown Quiz"}
                </h2>

                {/* Score Summary Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
                    
                    {/* Percentage Card */}
                    <div className="bg-indigo-50 p-6 rounded-lg shadow-md">
                        <p className="text-sm font-medium text-indigo-600 uppercase">Your Percentage</p>
                        <p className={`mt-1 text-5xl font-bold ${isPass ? 'text-green-600' : 'text-red-600'}`}>
                            {percentage}%
                        </p>
                    </div>

                    {/* Score Card */}
                    <div className="bg-blue-50 p-6 rounded-lg shadow-md">
                        <p className="text-sm font-medium text-blue-600 uppercase">Your Score</p>
                        <p className="mt-1 text-5xl font-bold text-blue-800">
                            {score}
                        </p>
                    </div>

                    {/* Total Questions Card */}
                    <div className="bg-gray-50 p-6 rounded-lg shadow-md">
                        <p className="text-sm font-medium text-gray-600 uppercase">Total Questions</p>
                        <p className="mt-1 text-5xl font-bold text-gray-800">
                            {total_questions}
                        </p>
                    </div>
                </div>

                {/* Footer Button */}
                <div className="mt-8 pt-6 border-t flex justify-center">
                    <button
                        onClick={() => window.location.href = '/'}
                        className="flex items-center px-6 py-3 bg-indigo-600 text-white font-semibold rounded-lg shadow-lg hover:bg-indigo-700 transition duration-300 transform hover:scale-105"
                    >
                        <ChevronLeft className="w-5 h-5 mr-2"/> Back to Quizzes
                    </button>
                </div>

            </div>
        </div>
    );
};

export default ResultPage;