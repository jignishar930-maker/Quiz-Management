import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link, Navigate } from 'react-router-dom';
import Login from '../src/components/Login';
import QuizList from './components/QuizList'; // આ તમારું "Available Quizzes" પેજ છે
import QuizAttempt from './components/QuizAttempt';
import MyResults from './components/ResultsList';
import './App.css';

function App() {
  // લોગિન સ્ટેટ ચેક કરવા માટે (Optional)

  return (
    <Router>
      <div className="app-container">
        {/* --- Global Navigation Header --- */}
        <header className="main-header">
          <div className="nav-container">
            <Link to="/" className="logo">QMS</Link>
            <nav>
              <ul className="nav-links">
                <li><Link to="/" className="nav-item">Home</Link></li>
                
                <li><Link to="/login" className="nav-item">Student Login</Link></li>
                <li><Link to="/my-results" className="nav-item">Result Check</Link></li>
              </ul>
            </nav>
          </div>
        </header>

        {/* --- Main Content Routes --- */}
        <main className="content-area">
          <Routes>
            {/* હોમ પેજ પર ક્વિઝ લિસ્ટ દેખાશે */}
            <Route path="/" element={<QuizList />} />
            
            {/* લોગિન પેજ */}
            <Route path="/login" element={<Login />} />
            
            {/* ક્વિઝ આપવા માટેનું પેજ */}
            <Route path="/quiz/:quizId" element={<QuizAttempt />} />
            
            {/* રીઝલ્ટ જોવા માટેનું પેજ */}
            <Route path="/my-results" element={<MyResults />} />

            {/* જો કોઈ ખોટો પાથ નાખે તો હોમ પર રીડાયરેક્ટ કરવા માટે */}
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </main>

        {/* --- Optional Footer --- */}
        <footer style={{ textAlign: 'center', padding: '20px', opacity: 0.5, fontSize: '0.8rem' }}>
          © 2025 Quiz Management System | Neural Interface v2.0
        </footer>
      </div>
    </Router>
  );
}

export default App;