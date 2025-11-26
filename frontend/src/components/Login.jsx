import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

// JWT ટોકન મેળવવાનો URL (જે તમે હમણાં જ સેટ કર્યો છે)
const LOGIN_URL = 'http://127.0.0.1:8000/api/auth/token/'; 

function Login() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);

        try {
            // API ને POST વિનંતી મોકલો
            const response = await axios.post(LOGIN_URL, {
                username,
                password,
            });

            // ઍક્સેસ અને રિફ્રેશ ટોકન્સ સ્ટોર કરો 
            // આ ટોકન્સનો ઉપયોગ હવે પછીના સુરક્ષિત API કૉલ્સમાં થશે
            localStorage.setItem('access_token', response.data.access);
            localStorage.setItem('refresh_token', response.data.refresh);
            
            alert("Successfuiiy login! Start the stoken.");

            // યુઝરને ડેશબોર્ડ પર રીડાયરેક્ટ કરો
            navigate('/student/dashboard'); 

        } catch (err) {
            console.error("Login Error:", err);
            // 401 Unauthorized ભૂલોને હેન્ડલ કરવા
            if (err.response && err.response.status === 401) {
                setError("Wrong username and password.");
            } else {
                setError("login error,chek the server.");
            }
        }
    };

    return (
        <div style={{ padding: '40px', maxWidth: '400px', margin: '50px auto', border: '1px solid #ccc', borderRadius: '8px' }}>
            <h2>🔐 Login</h2>
            <form onSubmit={handleSubmit}>
                {error && <p style={{ color: 'red', fontWeight: 'bold' }}>{error}</p>}
                
                <div style={{ marginBottom: '15px' }}>
                    <label style={{ display: 'block', marginBottom: '5px' }}>Username:</label>
                    <input 
                        type="text" 
                        value={username} 
                        onChange={(e) => setUsername(e.target.value)} 
                        required 
                        style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }}
                    />
                </div>
                
                <div style={{ marginBottom: '20px' }}>
                    <label style={{ display: 'block', marginBottom: '5px' }}>Password:</label>
                    <input 
                        type="password" 
                        value={password} 
                        onChange={(e) => setPassword(e.target.value)} 
                        required 
                        style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }}
                    />
                </div>
                
                <button type="submit" style={{ width: '100%', padding: '10px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>
                    Login
                </button>
            </form>
        </div>
    );
}

export default Login;