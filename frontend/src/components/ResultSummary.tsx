import React from 'react';
import type { AttemptDetail } from '../types';

interface ResultSummaryProps {
  attempt: AttemptDetail;
}

const ResultSummary: React.FC<ResultSummaryProps> = ({ attempt }) => {
  const percentage = Math.round((attempt.score / attempt.total_questions) * 100);
  const isPassing = percentage >= 50;

  return (
    <div className="glass rounded-2xl p-8 text-center">
      <div className="mb-6">
        <div
          className={`inline-flex items-center justify-center w-24 h-24 rounded-full text-3xl font-bold ${
            isPassing
              ? 'bg-success/10 text-success border-2 border-success/30'
              : 'bg-danger/10 text-danger border-2 border-danger/30'
          }`}
        >
          {percentage}%
        </div>
      </div>

      <h2 className="text-2xl font-bold text-white mb-2">
        {isPassing ? '🎉 Great Job!' : '📚 Keep Practicing!'}
      </h2>
      <p className="text-surface-400 mb-6">
        You scored {attempt.score} out of {attempt.total_questions} questions correctly.
      </p>

      <div className="grid grid-cols-3 gap-4">
        <div className="glass-light rounded-xl p-4">
          <div className="text-2xl font-bold text-white">{attempt.total_questions}</div>
          <div className="text-xs text-surface-500 mt-1">Total</div>
        </div>
        <div className="glass-light rounded-xl p-4">
          <div className="text-2xl font-bold text-success">{attempt.score}</div>
          <div className="text-xs text-surface-500 mt-1">Correct</div>
        </div>
        <div className="glass-light rounded-xl p-4">
          <div className="text-2xl font-bold text-danger">{attempt.total_questions - attempt.score}</div>
          <div className="text-xs text-surface-500 mt-1">Incorrect</div>
        </div>
      </div>
    </div>
  );
};

export default ResultSummary;
