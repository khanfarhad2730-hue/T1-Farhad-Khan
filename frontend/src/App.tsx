import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from './components/ProtectedRoute';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import QuizList from './pages/QuizList';
import QuizAttempt from './pages/QuizAttempt';
import Result from './pages/Result';
import AttemptHistory from './pages/AttemptHistory';
import AdminQuizCreate from './pages/AdminQuizCreate';

const App: React.FC = () => {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />

      <Route
        path="/quizzes"
        element={
          <ProtectedRoute>
            <QuizList />
          </ProtectedRoute>
        }
      />

      <Route
        path="/quizzes/:id"
        element={
          <ProtectedRoute>
            <QuizAttempt />
          </ProtectedRoute>
        }
      />

      <Route
        path="/results/:id"
        element={
          <ProtectedRoute>
            <Result />
          </ProtectedRoute>
        }
      />

      <Route
        path="/history"
        element={
          <ProtectedRoute>
            <AttemptHistory />
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin/create-quiz"
        element={
          <ProtectedRoute adminOnly>
            <AdminQuizCreate />
          </ProtectedRoute>
        }
      />

      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
};

export default App;
