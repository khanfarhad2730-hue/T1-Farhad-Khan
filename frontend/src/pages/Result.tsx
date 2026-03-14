import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../services/api';
import type { AttemptDetail } from '../types';
import Navbar from '../components/Navbar';
import ResultSummary from '../components/ResultSummary';
import QuestionCard from '../components/QuestionCard';
import LoadingSkeleton from '../components/LoadingSkeleton';

const Result: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [attempt, setAttempt] = useState<AttemptDetail | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchResult = async () => {
      try {
        const res = await api.get<AttemptDetail>(`/attempts/${id}/`);
        setAttempt(res.data);
      } catch {
        // handle error
      } finally {
        setLoading(false);
      }
    };
    fetchResult();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen">
        <Navbar />
        <main className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
          <LoadingSkeleton count={1} type="card" />
          <div className="mt-6">
            <LoadingSkeleton count={3} type="question" />
          </div>
        </main>
      </div>
    );
  }

  if (!attempt) {
    return (
      <div className="min-h-screen">
        <Navbar />
        <main className="max-w-4xl mx-auto px-4 sm:px-6 py-8 text-center">
          <p className="text-surface-400">Result not found.</p>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-white mb-1">{attempt.quiz_title}</h1>
          <p className="text-sm text-surface-400">
            Submitted on {new Date(attempt.submitted_at).toLocaleString()}
          </p>
        </div>

        <ResultSummary attempt={attempt} />

        {/* Detailed Review */}
        <div className="mt-8">
          <h2 className="text-xl font-bold text-white mb-4">Detailed Review</h2>
          <div className="space-y-6">
            {attempt.questions?.map((question, index) => (
              <QuestionCard
                key={question.id}
                questionNumber={index + 1}
                questionText={question.question_text}
                options={question.options}
                selectedAnswer={attempt.answers[String(question.id)] ?? null}
                onSelectAnswer={() => {}}
                showResult={true}
                correctAnswer={question.correct_answer_index}
              />
            ))}
          </div>
        </div>

        <div className="flex items-center justify-center gap-4 mt-8">
          <Link
            to="/quizzes"
            className="px-6 py-2.5 rounded-xl glass text-sm font-medium hover:border-primary-500/40 transition-all"
          >
            Browse Quizzes
          </Link>
          <Link
            to="/history"
            className="px-6 py-2.5 rounded-xl glass text-sm font-medium hover:border-primary-500/40 transition-all"
          >
            View History
          </Link>
        </div>
      </main>
    </div>
  );
};

export default Result;
