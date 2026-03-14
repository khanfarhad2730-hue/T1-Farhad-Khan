import React from 'react';

interface QuestionCardProps {
  questionNumber: number;
  questionText: string;
  options: string[];
  selectedAnswer: number | null;
  onSelectAnswer: (index: number) => void;
  showResult?: boolean;
  correctAnswer?: number;
}

const QuestionCard: React.FC<QuestionCardProps> = ({
  questionNumber,
  questionText,
  options,
  selectedAnswer,
  onSelectAnswer,
  showResult = false,
  correctAnswer,
}) => {
  const getOptionStyle = (index: number): string => {
    const base = 'w-full text-left p-4 rounded-xl border transition-all duration-200 flex items-center gap-3';

    if (showResult) {
      if (index === correctAnswer) {
        return `${base} border-success/50 bg-success/10 text-success`;
      }
      if (index === selectedAnswer && index !== correctAnswer) {
        return `${base} border-danger/50 bg-danger/10 text-danger`;
      }
      return `${base} border-surface-700/50 bg-surface-800/30 text-surface-500`;
    }

    if (index === selectedAnswer) {
      return `${base} border-primary-500 bg-primary-500/10 text-primary-300 shadow-[0_0_15px_rgba(99,102,241,0.15)]`;
    }

    return `${base} border-surface-700/50 bg-surface-800/30 text-surface-300 hover:border-primary-500/30 hover:bg-primary-500/5 cursor-pointer`;
  };

  const optionLabels = ['A', 'B', 'C', 'D'];

  return (
    <div className="glass rounded-2xl p-6 md:p-8">
      <div className="flex items-start gap-4 mb-6">
        <span className="flex-shrink-0 w-8 h-8 rounded-lg bg-primary-500/20 text-primary-400 flex items-center justify-center text-sm font-bold">
          {questionNumber}
        </span>
        <h3 className="text-lg font-medium text-white leading-relaxed">{questionText}</h3>
      </div>

      <div className="space-y-3 ml-12">
        {options.map((option, index) => (
          <button
            key={index}
            className={getOptionStyle(index)}
            onClick={() => !showResult && onSelectAnswer(index)}
            disabled={showResult}
          >
            <span className="flex-shrink-0 w-7 h-7 rounded-lg bg-surface-700/50 flex items-center justify-center text-xs font-bold">
              {optionLabels[index]}
            </span>
            <span className="text-sm">{option}</span>
            {showResult && index === correctAnswer && (
              <svg className="w-5 h-5 ml-auto text-success" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            )}
            {showResult && index === selectedAnswer && index !== correctAnswer && (
              <svg className="w-5 h-5 ml-auto text-danger" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            )}
          </button>
        ))}
      </div>
    </div>
  );
};

export default QuestionCard;
