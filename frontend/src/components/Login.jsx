// src/components/Login.jsx

import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './Login.css';

const API_BASE_URL = 'http://localhost:8000';

const Login = () => {
    const [credentials, setCredentials] = useState({
        username: '',
        password: ''
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleChange = (e) => {
        setCredentials({
            ...credentials,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            // Django API ને લોગિન રિક્વેસ્ટ મોકલો
            const response = await axios.post(
                `${API_BASE_URL}/api/login/`,
                credentials
            );

            const { token, role } = response.data;

            // ૧. JWT Token અને Role ને Local Storage માં સેવ કરો
            localStorage.setItem('authToken', token);
            localStorage.setItem('userRole', role);

            // ૨. Role ના આધારે ડેશબોર્ડ પર રીડાયરેક્ટ કરો
            if (role === 'teacher') {
                navigate('/admin/dashboard');
            } else if (role === 'student') {
                navigate('/student/dashboard');
            } else {
                setError('અમાન્ય ભૂમિકા (Invalid role).');
            }

        } catch (err) {
            console.error("Login failed:", err);
            // Django API માંથી આવતી ભૂલનો મેસેજ દર્શાવો (જેમ કે 'Invalid Credentials')
            setError(err.response?.data?.error || 'લોગિન નિષ્ફળ. સર્વર ભૂલ.');
            localStorage.removeItem('authToken');
            localStorage.removeItem('userRole');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="login-container">
            <form className="login-form" onSubmit={handleSubmit}>
                <h2>Quiz Portal માં સ્વાગત છે</h2>
                
                {error && <p className="error-message">{error}</p>}
                
                <div className="form-group">
                    <label htmlFor="username">યુઝરનેમ</label>
                    <input
                        type="text"
                        id="username"
                        name="username"
                        value={credentials.username}
                        onChange={handleChange}
                        required
                        disabled={loading}
                    />
                </div>
                
                <div className="form-group">
                    <label htmlFor="password">પાસવર્ડ</label>
                    <input
                        type="password"
                        id="password"
                        name="password"
                        value={credentials.password}
                        onChange={handleChange}
                        required
                        disabled={loading}
                    />
                </div>
                
                <button type="submit" disabled={loading} className="login-btn">
                    {loading ? 'લોગિન થઈ રહ્યું છે...' : 'લોગિન'}
                </button>
            </form>
        </div>
    );
};

export default Login;