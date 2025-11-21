import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
       
        <Route path="/student/dashboard" element={<StudentDashboard />} />
        <Route path="/quiz/:quizId" element={<QuizAttempt />} />
        <Route path="/student/scores" element={<StudentScorePage />} />
        
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/admin/add-quiz" element={<AddQuiz />} />
       
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </Router>
  );
}
//...