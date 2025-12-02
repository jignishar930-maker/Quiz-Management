import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Login from './components/Login.jsx';
import QuizList from './components/QuizList.jsx';
import QuizAttempt from './components/QuizAttempt.jsx'; // This is the component we just finished
import ResultPage from './components/ResultPage.jsx'; // NEW: Import the Result Page

function App() {
  return (
    <Router>
      <div className="App" style={{ fontFamily: 'Inter, sans-serif' }}>
        
        {/* Navigation Header using Tailwind CSS classes for better styling */}
        <header className="bg-white shadow-md p-4 sm:px-6">
            <nav>
                <ul className="flex space-x-6 text-lg font-medium">
                    <li>
                        <Link to="/" className="text-indigo-600 hover:text-indigo-800 transition duration-150">Home (Quizzes)</Link>
                    </li>
                    <li>
                        <Link to="/login" className="text-gray-600 hover:text-indigo-800 transition duration-150">Login</Link>
                    </li>
                    {/* Placeholder for User Dashboard/Logout */}
                    <li>
                        <span className="text-gray-400">|</span>
                    </li>
                    <li>
                        <Link to="/user/results" className="text-gray-600 hover:text-indigo-800 transition duration-150">My Results</Link>
                    </li>
                </ul>
            </nav>
        </header>

        <main className="p-4 sm:p-6">
          <Routes>
            {/* Default route shows the list of quizzes */}
            <Route path="/" element={<QuizList />} />
            
            {/* Login Page */}
            <Route path="/login" element={<Login />} />
            
            {/* Quiz Attempt Page: quizId is a URL parameter (e.g., /attempt/5) */}
            <Route path="/attempt/:quizId" element={<QuizAttempt />} />
            
            {/* NEW: Quiz Result Page: resultId is a URL parameter */}
            <Route path="/result/:resultId" element={<ResultPage />} />
            
            {/* User Results Listing (You can use QuizList component for now, or create a new one later) */}
            <Route path="/user/results" element={<QuizList />} /> 

            {/* Optional: Add a 404 Not Found Page */}
            <Route path="*" element={<div className="text-center mt-20 text-xl text-gray-500">404: Page Not Found</div>} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;