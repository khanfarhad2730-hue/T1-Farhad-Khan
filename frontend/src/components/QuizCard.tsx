import React from 'react';
import { useNavigate } from 'react-router-dom';
import type { Quiz } from '../types';

interface QuizCardProps {
  quiz: Quiz;
}

const QuizCard: React.FC<QuizCardProps> = ({ quiz }) => {
  const navigate = useNavigate();

  return (
    <div
      className="glass rounded-2xl p-6 hover:border-primary-500/40 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_8px_30px_rgba(99,102,241,0.15)] cursor-pointer group"
      onClick={() => navigate(`/quizzes/${quiz.id}`)}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="w-12 h-12 bg-gradient-to-br from-primary-500/20 to-primary-700/20 rounded-xl flex items-center justify-center group-hover:from-primary-500/30 group-hover:to-primary-700/30 transition-all">
          <svg className="w-6 h-6 text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        </div>
        <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-primary-500/10 text-primary-400 border border-primary-500/20">
          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          {quiz.time_limit} min
        </span>
      </div>

      <h3 className="text-lg font-semibold text-white mb-2 group-hover:text-primary-300 transition-colors">
        {quiz.title}
      </h3>
      <p className="text-surface-400 text-sm mb-4 line-clamp-2">
        {quiz.description || 'No description provided.'}
      </p>

      <div className="flex items-center justify-between pt-4 border-t border-surface-700/50">
        <span className="text-xs text-surface-500">
          {quiz.question_count} question{quiz.question_count !== 1 ? 's' : ''}
        </span>
        <span className="text-xs text-surface-500">
          by {quiz.created_by_name || 'Unknown'}
        </span>
      </div>
    </div>
  );
};

export default QuizCard;
