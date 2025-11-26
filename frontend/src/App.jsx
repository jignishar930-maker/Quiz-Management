import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Login from './components/Login.jsx';
import QuizList from './components/QuizList.jsx'; // This currently serves as the Student Dashboard
import QuizAttempt from './components/QuizAttempt.jsx'; 
// Note: Ensure you have created and imported the QuizAttempt component

function App() {
    return (
        <Router>
            <div className="App" style={{ fontFamily: 'Arial, sans-serif' }}>
                <header style={{ backgroundColor: '#f8f9fa', padding: '15px 20px', borderBottom: '1px solid #e9ecef' }}>
                    <nav>
                        <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', gap: '20px' }}>
                            <li>
                                <Link to="/" style={{ textDecoration: 'none', color: '#007bff', fontWeight: 'bold' }}>Home / Quizzes</Link>
                            </li>
                            <li>
                                <Link to="/login" style={{ textDecoration: 'none', color: '#007bff', fontWeight: 'bold' }}>Login</Link>
                            </li>
                            {/* Example link for a specific quiz ID 1. You can test this manually */}
                            <li>
                                <Link to="/attempt/1" style={{ textDecoration: 'none', color: '#007bff', fontWeight: 'bold' }}>Test Quiz 1</Link>
                            </li>
                        </ul>
                    </nav>
                </header>
                
                <main>
                    <Routes>
                        {/* Default route shows the list of quizzes */}
                        <Route path="/" element={<QuizList />} /> 
                        
                        {/* Login Page */}
                        <Route path="/login" element={<Login />} />
                        
                        {/* Quiz Attempt Page: :quizId is a URL parameter (e.g., /attempt/5) */}
                        <Route path="/attempt/:quizId" element={<QuizAttempt />} /> 
                        
                        {/* Student Dashboard route, also pointing to the QuizList component for now */}
                        <Route path="/student/dashboard" element={<QuizList />} /> 
                    </Routes>
                </main>
            </div>
        </Router>
    );
}

export default App;