// src/components/AdminDashboard.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import './AdminDashboard.css';

const AdminDashboard = () => {
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem('authToken');
        localStorage.removeItem('userRole');
        navigate('/login');
    };

    return (
        <div className="admin-dashboard-container">
            <div className="header">
                <h2>🧑‍🏫 Teacher Deshboard</h2>
                <button onClick={handleLogout} className="logout-btn">
                    Logut
                </button>
            </div>
            
            <div className="action-area">
                <h3>Quiz Management</h3>
                <button 
                    onClick={() => navigate('/admin/add-quiz')}
                    className="action-btn create-btn"
                >
                    ➕ Start new quiz
                </button>
                
                <p style={{marginTop: '20px', color: '#666'}}>
                    Note: Currently, only the 'Create New Quiz' functionality is being added.
                </p>
            </div>
        </div>
    );
};

export default AdminDashboard;