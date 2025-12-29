import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { loginUser } from '../api';
import './Login.css'; // CSS ફાઇલ ખાસ ઇમ્પોર્ટ કરવી

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            await loginUser(username, password);
            navigate('/'); 
        } catch (err) {
            alert("Login Failed");
        }
    };

    return (
        <div className="login-page-container">
            <div className="login-box-card">
                <div className="login-header-section">
                    <span className="lock-icon">🔒</span>
                    <h2 className="login-title">Admin Login</h2>
                    <p className="login-subtitle">Enter your credentials to access the dashboard.</p>
                </div>
                
                <form onSubmit={handleLogin} className="login-form-fields">
                    <div className="input-control">
                        <label>Username</label>
                        <input 
                            type="text" 
                            placeholder="Enter username" 
                            onChange={(e) => setUsername(e.target.value)} 
                        />
                    </div>
                    <div className="input-control">
                        <label>Password</label>
                        <input 
                            type="password" 
                            placeholder="Enter password" 
                            onChange={(e) => setPassword(e.target.value)} 
                        />
                    </div>
                    <button type="submit" className="login-submit-btn">Login</button>
                </form>
            </div>
        </div>
    );
};

export default Login;