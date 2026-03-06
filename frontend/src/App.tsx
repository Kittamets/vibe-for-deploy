import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';

import LoginPage from './pages/auth/LoginPage';
import AuthCallback from './pages/auth/AuthCallback';

import GradesPage from './pages/student/GradesPage';
import SchedulePage from './pages/student/SchedulePage';
import ExamsPage from './pages/student/ExamsPage';
import RegisterPage from './pages/student/RegisterPage';

import CoursesPage from './pages/instructor/CoursesPage';
import StudentsGradePage from './pages/instructor/StudentsGradePage';
import DepartmentResultsPage from './pages/instructor/DepartmentResultsPage';
import StudentDetailPage from './pages/instructor/StudentDetailPage';

import ManageSchedulePage from './pages/staff/ManageSchedulePage';
import ManageExamsPage from './pages/staff/ManageExamsPage';
import FacultyResultsPage from './pages/staff/FacultyResultsPage';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/auth/callback" element={<AuthCallback />} />

          {/* Student */}
          <Route path="/student/grades" element={<ProtectedRoute role="student"><GradesPage /></ProtectedRoute>} />
          <Route path="/student/schedule" element={<ProtectedRoute role="student"><SchedulePage /></ProtectedRoute>} />
          <Route path="/student/exams" element={<ProtectedRoute role="student"><ExamsPage /></ProtectedRoute>} />
          <Route path="/student/register" element={<ProtectedRoute role="student"><RegisterPage /></ProtectedRoute>} />

          {/* Instructor */}
          <Route path="/instructor/courses" element={<ProtectedRoute role="instructor"><CoursesPage /></ProtectedRoute>} />
          <Route path="/instructor/courses/:id/students" element={<ProtectedRoute role="instructor"><StudentsGradePage /></ProtectedRoute>} />
          <Route path="/instructor/department" element={<ProtectedRoute role="instructor"><DepartmentResultsPage /></ProtectedRoute>} />
          <Route path="/instructor/students/:userId" element={<ProtectedRoute role="instructor"><StudentDetailPage /></ProtectedRoute>} />

          {/* Staff */}
          <Route path="/staff/schedule" element={<ProtectedRoute role="staff"><ManageSchedulePage /></ProtectedRoute>} />
          <Route path="/staff/exams" element={<ProtectedRoute role="staff"><ManageExamsPage /></ProtectedRoute>} />
          <Route path="/staff/faculty-results" element={<ProtectedRoute role="staff"><FacultyResultsPage /></ProtectedRoute>} />

          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
