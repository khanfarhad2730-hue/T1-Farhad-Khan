import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import type { Attempt, PaginatedResponse } from '../types';
import Navbar from '../components/Navbar';
import LoadingSkeleton from '../components/LoadingSkeleton';

const AttemptHistory: React.FC = () => {
  const [attempts, setAttempts] = useState<Attempt[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [hasNext, setHasNext] = useState(false);
  const [hasPrev, setHasPrev] = useState(false);

  useEffect(() => {
    const fetchAttempts = async () => {
      setLoading(true);
      try {
        const res = await api.get<PaginatedResponse<Attempt>>(`/my-attempts/?page=${page}`);
        setAttempts(res.data.results);
        setHasNext(!!res.data.next);
        setHasPrev(!!res.data.previous);
      } catch {
        // handle error
      } finally {
        setLoading(false);
      }
    };
    fetchAttempts();
  }, [page]);

  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
        <h1 className="text-2xl font-bold text-white mb-6">Attempt History</h1>

        {loading ? (
          <div className="space-y-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="glass rounded-xl p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="skeleton h-5 w-48 mb-2 rounded" />
                    <div className="skeleton h-3 w-32 rounded" />
                  </div>
                  <div className="skeleton h-8 w-16 rounded" />
                </div>
              </div>
            ))}
          </div>
        ) : attempts.length === 0 ? (
          <div className="glass rounded-2xl p-12 text-center">
            <svg className="w-16 h-16 text-surface-600 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h3 className="text-lg font-medium text-surface-400">No attempts yet</h3>
            <p className="text-sm text-surface-500 mt-1 mb-4">Start taking quizzes to see your history here</p>
            <Link
              to="/quizzes"
              className="inline-flex px-6 py-2.5 rounded-xl bg-primary-600 text-white text-sm font-medium hover:bg-primary-500 transition-all"
            >
              Browse Quizzes
            </Link>
          </div>
        ) : (
          <>
            <div className="space-y-3">
              {attempts.map((attempt) => {
                const percentage = Math.round((attempt.score / attempt.total_questions) * 100);
                const isPassing = percentage >= 50;

                return (
                  <Link
                    key={attempt.id}
                    to={`/results/${attempt.id}`}
                    className="glass rounded-xl p-5 flex items-center justify-between hover:border-primary-500/30 transition-all block group"
                  >
                    <div>
                      <h4 className="font-medium text-white group-hover:text-primary-300 transition-colors">
                        {attempt.quiz_title}
                      </h4>
                      <p className="text-xs text-surface-500 mt-1">
                        {new Date(attempt.submitted_at).toLocaleString()}
                      </p>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <div className={`text-lg font-bold ${isPassing ? 'text-success' : 'text-danger'}`}>
                          {attempt.score}/{attempt.total_questions}
                        </div>
                        <div className={`text-xs ${isPassing ? 'text-success/70' : 'text-danger/70'}`}>
                          {percentage}%
                        </div>
                      </div>
                      <svg className="w-5 h-5 text-surface-500 group-hover:text-primary-400 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </Link>
                );
              })}
            </div>

            {(hasPrev || hasNext) && (
              <div className="flex items-center justify-center gap-4 mt-8">
                <button
                  onClick={() => setPage((p) => p - 1)}
                  disabled={!hasPrev}
                  className="px-4 py-2 rounded-lg glass text-sm font-medium disabled:opacity-30 disabled:cursor-not-allowed hover:border-primary-500/40 transition-all cursor-pointer"
                >
                  ← Previous
                </button>
                <span className="text-sm text-surface-400">Page {page}</span>
                <button
                  onClick={() => setPage((p) => p + 1)}
                  disabled={!hasNext}
                  className="px-4 py-2 rounded-lg glass text-sm font-medium disabled:opacity-30 disabled:cursor-not-allowed hover:border-primary-500/40 transition-all cursor-pointer"
                >
                  Next →
                </button>
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
};

export default AttemptHistory;
