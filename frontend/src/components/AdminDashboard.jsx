import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Login from './Login.jsx';
import QuizList from './QuizList.jsx';
import QuizAttempt from './QuizAttempt.jsx';
import ResultsList from './ResultsList.jsx'; 
import QuizDetail from './QuizDetail';
import '..App.jsx'; 

function App() {
  return (
    <Router>
      <div className="App" style={{ fontFamily: 'Inter, sans-serif', minHeight: '100vh', backgroundColor: '#f5f3ff' }}>
        
        {/* Modern Purple Navigation Header */}
        <header className="main-header">
          <nav className="nav-container">
            <div className="logo">
              <Link to="/" style={{ color: 'white', textDecoration: 'none' }}>QuizMaster</Link>
            </div>
            <ul className="nav-links">
              <li>
                <Link to="/" className="nav-item">Home</Link>
              </li>
              <li>
                <Link to="/login" className="nav-item">Login</Link>
              </li>
              <li>
                <Link to="/my-results" className="nav-item">My Results</Link>
              </li>
            </ul>
          </nav>
        </header>

        {/* Main Content Area */}
        <main className="p-4 sm:p-8">
          <div className="max-w-7xl mx-auto">
            <Routes>
              {/* બધી ક્વિઝનું લિસ્ટ (Home) */}
              <Route path="/" element={<QuizList />} />
              
              {/* લોગિન પેજ */}
              <Route path="/login" element={<Login />} />
              
              {/* ક્વિઝની વિગતો અને એટેમ્પટ પેજ */}
              <Route path="/quiz/:id" element={<QuizDetail />} />
              <Route path="/attempt/:quizId" element={<QuizAttempt />} />
              
              {/* યુઝરના રિઝલ્ટ માટેનો સાચો પાથ */}
              <Route path="/my-results" element={<ResultsList />} />

              {/* 404 Page - જો પેજ ના મળે તો */}
              <Route path="*" element={
                <div className="text-center mt-20">
                  <h1 className="text-6xl font-bold text-purple-300">404</h1>
                  <p className="text-xl text-gray-500 mt-4">Oops! Page Not Found</p>
                  <Link to="/" className="inline-block mt-6 text-purple-600 hover:underline">Go back to Home</Link>
                </div>
              } />
            </Routes>
          </div>
        </main>
      </div>
    </Router>
  );
}

export default App;