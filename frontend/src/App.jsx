import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/Login.jsx'; 
import StudentDashboard from './components/StudentDashboard.jsx';
import QuizAttempt from './components/QuizAttempt.jsx';
import ScorePage from './components/ScorePage.jsx'; 
import AdminDashboard from './components/AdminDashboard.jsx'; 
import AddQuiz from './components/AddQuiz.jsx'; 


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        
        {/* student router */}
        <Route path="/student/dashboard" element={<StudentDashboard />} />
        <Route path="/quiz/:quizId" element={<QuizAttempt />} />  
        <Route path="/student/scores" element={<ScorePage />} /> 

        {/* admin/teacher router */}
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/admin/add-quiz" element={<AddQuiz />} />
        
        <Route path="/" element={<Navigate to="/login" />} />
      </Routes>
    </Router>
  );
}

export default App;