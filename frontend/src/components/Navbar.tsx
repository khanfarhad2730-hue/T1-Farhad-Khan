import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar: React.FC = () => {
  const { user, isAdmin, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="glass sticky top-0 z-50 px-6 py-3">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <Link to="/dashboard" className="flex items-center gap-3 group">
          <div className="w-9 h-9 bg-gradient-to-br from-primary-500 to-primary-700 rounded-lg flex items-center justify-center text-white font-bold text-lg group-hover:scale-110 transition-transform">
            Q
          </div>
          <span className="text-xl font-bold gradient-text">QuizPortal</span>
        </Link>

        <div className="hidden md:flex items-center gap-6">
          <Link
            to="/dashboard"
            className="text-surface-300 hover:text-white transition-colors text-sm font-medium"
          >
            Dashboard
          </Link>
          <Link
            to="/quizzes"
            className="text-surface-300 hover:text-white transition-colors text-sm font-medium"
          >
            Quizzes
          </Link>
          <Link
            to="/history"
            className="text-surface-300 hover:text-white transition-colors text-sm font-medium"
          >
            History
          </Link>
          {isAdmin && (
            <Link
              to="/admin/create-quiz"
              className="text-primary-400 hover:text-primary-300 transition-colors text-sm font-medium"
            >
              + Create Quiz
            </Link>
          )}
        </div>

        <div className="flex items-center gap-4">
          {user?.photo_url ? (
            <img
              src={user.photo_url}
              alt={user.name}
              className="w-8 h-8 rounded-full border-2 border-primary-500/50"
              referrerPolicy="no-referrer"
            />
          ) : (
            <div className="w-8 h-8 rounded-full bg-primary-600 flex items-center justify-center text-white text-sm font-bold">
              {user?.name?.charAt(0) || '?'}
            </div>
          )}
          <span className="text-sm text-surface-300 hidden lg:block">{user?.name}</span>
          <button
            onClick={handleLogout}
            className="text-sm text-surface-400 hover:text-danger transition-colors cursor-pointer"
          >
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
