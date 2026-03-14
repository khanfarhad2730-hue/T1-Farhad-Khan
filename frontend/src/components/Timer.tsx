import React, { useState, useEffect, useCallback } from 'react';

interface TimerProps {
  initialMinutes: number;
  onTimeUp: () => void;
  isRunning: boolean;
}

const Timer: React.FC<TimerProps> = ({ initialMinutes, onTimeUp, isRunning }) => {
  const [secondsLeft, setSecondsLeft] = useState(initialMinutes * 60);

  useEffect(() => {
    setSecondsLeft(initialMinutes * 60);
  }, [initialMinutes]);

  useEffect(() => {
    if (!isRunning || secondsLeft <= 0) return;

    const interval = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isRunning, secondsLeft]);

  const handleTimeUp = useCallback(() => {
    onTimeUp();
  }, [onTimeUp]);

  useEffect(() => {
    if (secondsLeft === 0 && isRunning) {
      handleTimeUp();
    }
  }, [secondsLeft, isRunning, handleTimeUp]);

  const minutes = Math.floor(secondsLeft / 60);
  const seconds = secondsLeft % 60;
  const progress = (secondsLeft / (initialMinutes * 60)) * 100;
  const isUrgent = secondsLeft < 60;
  const isWarning = secondsLeft < 300 && !isUrgent;

  return (
    <div className={`glass rounded-xl p-4 ${isUrgent ? 'pulse-glow border-danger/50' : ''}`}>
      <div className="flex items-center gap-3">
        <svg
          className={`w-5 h-5 ${isUrgent ? 'text-danger animate-pulse' : isWarning ? 'text-warning' : 'text-primary-400'}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <span className={`text-2xl font-mono font-bold ${isUrgent ? 'text-danger' : isWarning ? 'text-warning' : 'text-white'}`}>
          {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
        </span>
      </div>
      <div className="mt-3 h-1.5 rounded-full bg-surface-700/50 overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-1000 ease-linear ${
            isUrgent ? 'bg-danger' : isWarning ? 'bg-warning' : 'bg-primary-500'
          }`}
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
};

export default Timer;
