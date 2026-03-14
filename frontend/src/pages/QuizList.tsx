import React, { useEffect, useState } from 'react';
import api from '../services/api';
import type { Quiz, PaginatedResponse } from '../types';
import Navbar from '../components/Navbar';
import QuizCard from '../components/QuizCard';
import LoadingSkeleton from '../components/LoadingSkeleton';

const QuizList: React.FC = () => {
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [hasNext, setHasNext] = useState(false);
  const [hasPrev, setHasPrev] = useState(false);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    const fetchQuizzes = async () => {
      setLoading(true);
      try {
        const res = await api.get<PaginatedResponse<Quiz>>(`/quizzes/?page=${page}`);
        setQuizzes(res.data.results);
        setHasNext(!!res.data.next);
        setHasPrev(!!res.data.previous);
        setTotal(res.data.count);
      } catch {
        // handle error
      } finally {
        setLoading(false);
      }
    };
    fetchQuizzes();
  }, [page]);

  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-white">Available Quizzes</h1>
            <p className="text-surface-400 text-sm mt-1">{total} quiz{total !== 1 ? 'zes' : ''} available</p>
          </div>
        </div>

        {loading ? (
          <LoadingSkeleton count={6} type="card" />
        ) : quizzes.length === 0 ? (
          <div className="glass rounded-2xl p-12 text-center">
            <svg className="w-16 h-16 text-surface-600 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <h3 className="text-lg font-medium text-surface-400">No quizzes available yet</h3>
            <p className="text-sm text-surface-500 mt-1">Check back later for new quizzes!</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {quizzes.map((quiz) => (
                <QuizCard key={quiz.id} quiz={quiz} />
              ))}
            </div>

            {/* Pagination */}
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

export default QuizList;
