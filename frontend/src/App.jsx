import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Login from './components/Login.jsx';
import QuizList from './components/QuizList.jsx';
import QuizAttempt from './components/QuizAttempt.jsx';
import ResultsList from './components/ResultsList.jsx'; // ખાતરી કરો કે આ નામ સાચું છે
import QuizDetail from './components/QuizDetail';

function App() {
  return (
    <Router>
      <div className="App" style={{ fontFamily: 'Inter, sans-serif' }}>
        
        {/* Navigation Header */}
        <header className="bg-white shadow-md p-4 sm:px-6">
            <nav>
                <ul className="flex space-x-6 text-lg font-medium">
                    <li>
                        <Link to="/" className="text-indigo-600 hover:text-indigo-800 transition duration-150">Home (Quizzes)</Link>
                    </li>
                    <li>
                        <Link to="/login" className="text-gray-600 hover:text-indigo-800 transition duration-150">Login</Link>
                    </li>
                    <li>
                        <span className="text-gray-400">|</span>
                    </li>
                    <li>
                        {/* ✅ આ લિંક હવે સાચા પેજ પર લઈ જશે */}
                        <Link to="/user/results" className="text-gray-600 hover:text-indigo-800 transition duration-150">My Results</Link>
                    </li>
                </ul>
            </nav>
        </header>

        <main className="p-4 sm:p-6">
          <Routes>
            {/* બધી ક્વિઝનું લિસ્ટ */}
            <Route path="/" element={<QuizList />} />
            
            {/* લોગિન પેજ */}
            <Route path="/login" element={<Login />} />
            
            {/* ક્વિઝ આપવા માટેનું પેજ */}
            <Route path="/quiz/:id" element={<QuizDetail />} />
            <Route path="/attempt/:quizId" element={<QuizAttempt />} />
            
            {/* ✅ સુધારો: યુઝરના બધા રિઝલ્ટ જોવા માટેનું લિસ્ટ પેજ */}
            <Route path="/user/results" element={<ResultsList />} /> 

            {/* 404 Page */}
            <Route path="*" element={<div className="text-center mt-20 text-xl text-gray-500">404: Page Not Found</div>} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;