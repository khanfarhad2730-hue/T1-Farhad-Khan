import React from 'react';

interface LoadingSkeletonProps {
  count?: number;
  type?: 'card' | 'line' | 'question';
}

const LoadingSkeleton: React.FC<LoadingSkeletonProps> = ({ count = 3, type = 'card' }) => {
  if (type === 'line') {
    return (
      <div className="space-y-3">
        {Array.from({ length: count }).map((_, i) => (
          <div key={i} className="skeleton h-4 rounded" style={{ width: `${80 - i * 10}%` }} />
        ))}
      </div>
    );
  }

  if (type === 'question') {
    return (
      <div className="space-y-6">
        {Array.from({ length: count }).map((_, i) => (
          <div key={i} className="glass rounded-2xl p-6">
            <div className="skeleton h-5 w-3/4 mb-4 rounded" />
            <div className="space-y-3 ml-12">
              {Array.from({ length: 4 }).map((_, j) => (
                <div key={j} className="skeleton h-12 rounded-xl" />
              ))}
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="glass rounded-2xl p-6">
          <div className="flex items-start justify-between mb-4">
            <div className="skeleton w-12 h-12 rounded-xl" />
            <div className="skeleton w-20 h-6 rounded-full" />
          </div>
          <div className="skeleton h-5 w-3/4 mb-2 rounded" />
          <div className="skeleton h-4 w-full mb-1 rounded" />
          <div className="skeleton h-4 w-2/3 mb-4 rounded" />
          <div className="flex justify-between pt-4 border-t border-surface-700/50">
            <div className="skeleton h-3 w-20 rounded" />
            <div className="skeleton h-3 w-16 rounded" />
          </div>
        </div>
      ))}
    </div>
  );
};

export default LoadingSkeleton;
