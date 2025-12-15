import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogIn, UserPlus, Zap } from 'lucide-react'; // Icons

// API functions imported from the relative path "../api.js"
import { loginUser, registerUser } from '../api.js';

const Login = () => {
    // React Router hook for navigation
    const navigate = useNavigate();

    // State for form data
    const [isLogin, setIsLogin] = useState(true); // Toggle between Login and Register
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [email, setEmail] = useState('');
    
    // State for UI feedback
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');
    const [messageType, setMessageType] = useState(''); // 'success' or 'error'

    // Component to display feedback messages
    const MessageDisplay = ({ type, text }) => {
        if (!text) return null;
        const colorClass = type === 'success' 
            ? 'bg-green-100 border-green-400 text-green-700' 
            : 'bg-red-100 border-red-400 text-red-700';
        
        return (
            <div className={`p-3 border rounded-lg mb-4 text-sm ${colorClass}`}>
                {text}
            </div>
        );
    };

    // Form submission handler - સુધારો અહીં છે 👇
    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage('');
        setLoading(true);

        if (isLogin) {
            // LOGIN LOGIC
            try {
                // loginUser હવે ટોકન મેળવ્યા પછી કોઈ ભૂલ ફેંકશે નહીં
                await loginUser(username, password);
                
                // જો ઉપરનું ફંક્શન સફળ થાય, તો તે અહીં આવશે.
                setMessageType('success');
                setMessage('Login successful! Redirecting...');
                
                // Navigate to the dashboard/quiz list after a short delay
                setTimeout(() => {
                    navigate('/'); 
                }, 1000);

            } catch (error) {
                // જો api.js માંથી કોઈ ભૂલ ફેંકવામાં આવે (દા.ત., 401 Unauthorized)
                setMessageType('error');
                // error.message માં api.js માંથી આવેલો ચોક્કસ સંદેશ હશે
                const errorText = error.message || 'Login failed. Check server connection.'; 
                setMessage(`Login Failed: ${errorText}`);
            }

        } else {
            // REGISTER LOGIC
            // Ensure email is required for registration
            if (!email) {
                 setMessageType('error');
                 setMessage('Email is required for registration.');
                 setLoading(false);
                 return;
            }

            try {
                await registerUser(username, email, password);
                
                setMessageType('success');
                setMessage('Registration successful! Please log in.');
                // Automatically switch back to the login view
                setIsLogin(true);

            } catch (error) {
                setMessageType('error');
                const errorText = error.message || 'Registration failed due to unknown reason.';
                setMessage(`Registration Failed: ${errorText}`);
            }
        }
        
        setLoading(false);
    };
    // સુધારો અહીં સમાપ્ત થાય છે ☝️

    return (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
            <div className="w-full max-w-md bg-white rounded-xl shadow-2xl p-8">
                
                {/* Header */}
                <div className="flex flex-col items-center mb-6">
                    <Zap className="w-10 h-10 text-indigo-600 mb-2"/>
                    <h1 className="text-3xl font-bold text-gray-800">
                        {isLogin ? 'Welcome Back!' : 'Create Account'}
                    </h1>
                    <p className="text-sm text-gray-500 mt-1">Quiz Management System</p>
                </div>

                {/* Message Box */}
                <MessageDisplay type={messageType} text={message} />

                {/* Form */}
                <form onSubmit={handleSubmit}>
                    
                    {/* Username Input */}
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-semibold mb-2" htmlFor="username">
                            Username
                        </label>
                        <input
                            type="text"
                            id="username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            className="shadow appearance-none border rounded-lg w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-indigo-500 transition duration-150"
                            placeholder="Enter your username"
                            required
                        />
                    </div>

                    {/* Email Input (Only for Register) */}
                    {!isLogin && (
                        <div className="mb-4">
                            <label className="block text-gray-700 text-sm font-semibold mb-2" htmlFor="email">
                                Email
                            </label>
                            <input
                                type="email"
                                id="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="shadow appearance-none border rounded-lg w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-indigo-500 transition duration-150"
                                placeholder="Enter your email"
                                required={!isLogin} // Email is only required during registration
                            />
                        </div>
                    )}

                    {/* Password Input */}
                    <div className="mb-6">
                        <label className="block text-gray-700 text-sm font-semibold mb-2" htmlFor="password">
                            Password
                        </label>
                        <input
                            type="password"
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="shadow appearance-none border rounded-lg w-full py-3 px-4 text-gray-700 mb-3 leading-tight focus:outline-none focus:ring-2 focus:ring-indigo-500 transition duration-150"
                            placeholder="Enter your password"
                            required
                        />
                    </div>

                    {/* Submit Button */}
                    <div className="flex items-center justify-between">
                        <button
                            type="submit"
                            className="flex items-center justify-center w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-4 rounded-lg focus:outline-none focus:shadow-outline transition duration-200 disabled:opacity-50"
                            disabled={loading}
                        >
                            {loading && (
                                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                            )}
                            {isLogin ? (
                                <>
                                    <LogIn className="w-5 h-5 mr-2" />
                                    {loading ? 'Logging In...' : 'Login'}
                                </>
                            ) : (
                                <>
                                    <UserPlus className="w-5 h-5 mr-2" />
                                    {loading ? 'Registering...' : 'Register'}
                                </>
                            )}
                        </button>
                    </div>
                </form>

                {/* Toggle Link */}
                <div className="mt-6 text-center">
                    <button
                        type="button"
                        onClick={() => {
                            setIsLogin(!isLogin);
                            setMessage('');
                            setUsername('');
                            setPassword('');
                            setEmail('');
                        }}
                        className="inline-block align-baseline font-bold text-sm text-indigo-500 hover:text-indigo-800 transition duration-150"
                    >
                        {isLogin ? "Don't have an account? Register" : "Already have an account? Login"}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Login;