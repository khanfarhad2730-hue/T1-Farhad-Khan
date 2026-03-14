import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import type { Attempt, PaginatedResponse, Quiz } from '../types';
import Navbar from '../components/Navbar';

const Dashboard: React.FC = () => {
  const { user, isAdmin } = useAuth();
  const [recentAttempts, setRecentAttempts] = useState<Attempt[]>([]);
  const [quizCount, setQuizCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const [attemptsRes, quizzesRes] = await Promise.all([
          api.get<PaginatedResponse<Attempt>>('/my-attempts/'),
          api.get<PaginatedResponse<Quiz>>('/quizzes/'),
        ]);
        setRecentAttempts(attemptsRes.data.results.slice(0, 5));
        setQuizCount(quizzesRes.data.count);
      } catch {
        // silently handle
      } finally {
        setLoading(false);
      }
    };
    fetchDashboard();
  }, []);

  const avgScore = recentAttempts.length > 0
    ? Math.round(
        recentAttempts.reduce((acc, a) => acc + (a.score / a.total_questions) * 100, 0) / recentAttempts.length
      )
    : 0;

  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        {/* Welcome */}
        <div className="glass rounded-3xl p-8 mb-8 relative overflow-hidden">
          <div className="absolute -top-20 -right-20 w-60 h-60 bg-primary-500/10 rounded-full blur-3xl" />
          <div className="relative z-10">
            <h1 className="text-3xl font-bold text-white mb-2">
              Welcome back, <span className="gradient-text">{user?.name?.split(' ')[0]}</span>!
            </h1>
            <p className="text-surface-400">Ready to challenge yourself today?</p>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="glass rounded-2xl p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-primary-500/20 rounded-xl flex items-center justify-center">
                <svg className="w-6 h-6 text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <div>
                <div className="text-2xl font-bold text-white">{loading ? '—' : quizCount}</div>
                <div className="text-sm text-surface-400">Available Quizzes</div>
              </div>
            </div>
          </div>

          <div className="glass rounded-2xl p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-success/20 rounded-xl flex items-center justify-center">
                <svg className="w-6 h-6 text-success" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <div>
                <div className="text-2xl font-bold text-white">{loading ? '—' : recentAttempts.length}</div>
                <div className="text-sm text-surface-400">Attempts Made</div>
              </div>
            </div>
          </div>

          <div className="glass rounded-2xl p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-warning/20 rounded-xl flex items-center justify-center">
                <svg className="w-6 h-6 text-warning" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <div>
                <div className="text-2xl font-bold text-white">{loading ? '—' : `${avgScore}%`}</div>
                <div className="text-sm text-surface-400">Average Score</div>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <Link
            to="/quizzes"
            className="glass rounded-2xl p-6 hover:border-primary-500/40 transition-all duration-300 group"
          >
            <h3 className="text-lg font-semibold text-white mb-1 group-hover:text-primary-300 transition-colors">
              📝 Browse Quizzes
            </h3>
            <p className="text-sm text-surface-400">Find and attempt available quizzes</p>
          </Link>
          <Link
            to="/history"
            className="glass rounded-2xl p-6 hover:border-primary-500/40 transition-all duration-300 group"
          >
            <h3 className="text-lg font-semibold text-white mb-1 group-hover:text-primary-300 transition-colors">
              📊 View History
            </h3>
            <p className="text-sm text-surface-400">Review your past quiz attempts</p>
          </Link>
        </div>

        {/* Admin quick action */}
        {isAdmin && (
          <Link
            to="/admin/create-quiz"
            className="glass rounded-2xl p-6 hover:border-primary-500/40 transition-all duration-300 block group mb-8"
          >
            <h3 className="text-lg font-semibold text-primary-400 mb-1 group-hover:text-primary-300 transition-colors">
              ⚡ Create New Quiz
            </h3>
            <p className="text-sm text-surface-400">Design and publish a new quiz for users</p>
          </Link>
        )}

        {/* Recent Attempts */}
        {recentAttempts.length > 0 && (
          <div>
            <h2 className="text-xl font-bold text-white mb-4">Recent Attempts</h2>
            <div className="space-y-3">
              {recentAttempts.map((attempt) => (
                <Link
                  key={attempt.id}
                  to={`/results/${attempt.id}`}
                  className="glass rounded-xl p-4 flex items-center justify-between hover:border-primary-500/30 transition-all block"
                >
                  <div>
                    <h4 className="text-sm font-medium text-white">{attempt.quiz_title}</h4>
                    <p className="text-xs text-surface-500">
                      {new Date(attempt.submitted_at).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="text-right">
                    <span className={`text-lg font-bold ${attempt.score / attempt.total_questions >= 0.5 ? 'text-success' : 'text-danger'}`}>
                      {attempt.score}/{attempt.total_questions}
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default Dashboard;
