// src/App.jsx (અપડેટ કરો)

import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/Login.jsx'; // ખાતરી કરો કે આ ફાઇલ બની ગઈ છે!
import StudentDashboard from './components/StudentDashboard.jsx';
import QuizAttempt from './components/QuizAttempt.jsx';
import ScorePage from './components/ScorePage.jsx'; // આ કોમ્પોનન્ટ હવે પછી બનાવીશું
import AdminDashboard from './components/AdminDashboard.jsx'; // આ પણ હવે પછી બનાવીશું
import AddQuiz from './components/AddQuiz.jsx'; // આ પણ હવે પછી બનાવીશું


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        
        {/* સ્ટુડન્ટ રાઉટ્સ */}
        <Route path="/student/dashboard" element={<StudentDashboard />} />
        <Route path="/quiz/:quizId" element={<QuizAttempt />} /> {/* ક્વિઝ એટેમ્પ્ટ */}
        <Route path="/student/scores" element={<ScorePage />} /> {/* સ્કોર પેજ */}

        {/* એડમિન/ટીચર રાઉટ્સ */}
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/admin/add-quiz" element={<AddQuiz />} />
        
        <Route path="/" element={<Navigate to="/login" />} />
      </Routes>
    </Router>
  );
}

export default App;