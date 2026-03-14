import React, { useEffect, useState, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import api from '../services/api';
import type { QuizDetail, AttemptDetail } from '../types';
import Navbar from '../components/Navbar';
import QuestionCard from '../components/QuestionCard';
import Timer from '../components/Timer';
import LoadingSkeleton from '../components/LoadingSkeleton';

const QuizAttempt: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [quiz, setQuiz] = useState<QuizDetail | null>(null);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [started, setStarted] = useState(false);

  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        const res = await api.get<QuizDetail>(`/quizzes/${id}/`);
        setQuiz(res.data);
      } catch {
        toast.error('Failed to load quiz');
        navigate('/quizzes');
      } finally {
        setLoading(false);
      }
    };
    fetchQuiz();
  }, [id, navigate]);

  const handleSelectAnswer = (questionId: number, optionIndex: number) => {
    setAnswers((prev) => ({ ...prev, [String(questionId)]: optionIndex }));
  };

  const handleSubmit = useCallback(async () => {
    if (submitting || !quiz) return;
    setSubmitting(true);

    try {
      const res = await api.post<AttemptDetail>('/attempt/', {
        quiz_id: quiz.id,
        answers,
      });
      toast.success('Quiz submitted successfully!');
      navigate(`/results/${res.data.id}`);
    } catch (error: any) {
      toast.error(error?.response?.data?.error || 'Failed to submit quiz');
      setSubmitting(false);
    }
  }, [submitting, quiz, answers, navigate]);

  const handleTimeUp = useCallback(() => {
    toast.error('Time is up! Auto-submitting...');
    handleSubmit();
  }, [handleSubmit]);

  if (loading) {
    return (
      <div className="min-h-screen">
        <Navbar />
        <main className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
          <LoadingSkeleton count={2} type="question" />
        </main>
      </div>
    );
  }

  if (!quiz) return null;

  // Start screen
  if (!started) {
    return (
      <div className="min-h-screen">
        <Navbar />
        <main className="max-w-2xl mx-auto px-4 sm:px-6 py-8">
          <div className="glass rounded-3xl p-8 text-center">
            <div className="w-16 h-16 bg-primary-500/20 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <svg className="w-8 h-8 text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-white mb-2">{quiz.title}</h1>
            {quiz.description && (
              <p className="text-surface-400 mb-6">{quiz.description}</p>
            )}

            <div className="grid grid-cols-2 gap-4 mb-8">
              <div className="glass-light rounded-xl p-4">
                <div className="text-xl font-bold text-white">{quiz.questions.length}</div>
                <div className="text-xs text-surface-500">Questions</div>
              </div>
              <div className="glass-light rounded-xl p-4">
                <div className="text-xl font-bold text-white">{quiz.time_limit} min</div>
                <div className="text-xs text-surface-500">Time Limit</div>
              </div>
            </div>

            <button
              onClick={() => setStarted(true)}
              className="px-8 py-3 bg-gradient-to-r from-primary-600 to-primary-500 text-white rounded-xl font-medium hover:from-primary-500 hover:to-primary-400 transition-all shadow-lg shadow-primary-500/20 cursor-pointer"
            >
              Start Quiz →
            </button>
          </div>
        </main>
      </div>
    );
  }

  const question = quiz.questions[currentQuestion];
  const answeredCount = Object.keys(answers).length;

  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
        {/* Top bar: Timer + Progress */}
        <div className="grid grid-cols-1 md:grid-cols-[1fr_auto] gap-4 mb-6">
          <div className="glass rounded-xl p-4">
            <div className="flex items-center justify-between text-sm">
              <span className="text-surface-400">
                Question {currentQuestion + 1} of {quiz.questions.length}
              </span>
              <span className="text-surface-400">
                {answeredCount}/{quiz.questions.length} answered
              </span>
            </div>
            <div className="mt-2 h-1.5 rounded-full bg-surface-700/50 overflow-hidden">
              <div
                className="h-full rounded-full bg-primary-500 transition-all duration-300"
                style={{ width: `${((currentQuestion + 1) / quiz.questions.length) * 100}%` }}
              />
            </div>
          </div>
          <Timer
            initialMinutes={quiz.time_limit}
            onTimeUp={handleTimeUp}
            isRunning={true}
          />
        </div>

        {/* Question */}
        <QuestionCard
          questionNumber={currentQuestion + 1}
          questionText={question.question_text}
          options={question.options}
          selectedAnswer={answers[String(question.id)] ?? null}
          onSelectAnswer={(idx) => handleSelectAnswer(question.id, idx)}
        />

        {/* Navigation */}
        <div className="flex items-center justify-between mt-6">
          <button
            onClick={() => setCurrentQuestion((p) => Math.max(0, p - 1))}
            disabled={currentQuestion === 0}
            className="px-6 py-2.5 rounded-xl glass text-sm font-medium disabled:opacity-30 disabled:cursor-not-allowed hover:border-primary-500/40 transition-all cursor-pointer"
          >
            ← Previous
          </button>

          {/* Question dots */}
          <div className="hidden md:flex items-center gap-1.5 flex-wrap justify-center max-w-sm">
            {quiz.questions.map((q, i) => (
              <button
                key={q.id}
                onClick={() => setCurrentQuestion(i)}
                className={`w-8 h-8 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                  i === currentQuestion
                    ? 'bg-primary-500 text-white'
                    : answers[String(q.id)] !== undefined
                    ? 'bg-primary-500/20 text-primary-400 border border-primary-500/30'
                    : 'bg-surface-800/50 text-surface-500 border border-surface-700/50'
                }`}
              >
                {i + 1}
              </button>
            ))}
          </div>

          {currentQuestion === quiz.questions.length - 1 ? (
            <button
              onClick={handleSubmit}
              disabled={submitting}
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-success to-emerald-500 text-white text-sm font-medium hover:opacity-90 transition-all disabled:opacity-50 shadow-lg shadow-success/20 cursor-pointer"
            >
              {submitting ? 'Submitting...' : 'Submit Quiz ✓'}
            </button>
          ) : (
            <button
              onClick={() => setCurrentQuestion((p) => Math.min(quiz.questions.length - 1, p + 1))}
              className="px-6 py-2.5 rounded-xl glass text-sm font-medium hover:border-primary-500/40 transition-all cursor-pointer"
            >
              Next →
            </button>
          )}
        </div>
      </main>
    </div>
  );
};

export default QuizAttempt;
