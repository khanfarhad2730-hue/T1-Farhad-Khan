import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import api from '../services/api';
import Navbar from '../components/Navbar';

interface QuestionForm {
  question_text: string;
  options: string[];
  correct_answer_index: number;
}

const AdminQuizCreate: React.FC = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState<'quiz' | 'questions'>('quiz');
  const [quizId, setQuizId] = useState<number | null>(null);
  const [quizTitle, setQuizTitle] = useState('');

  // Quiz form
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [timeLimit, setTimeLimit] = useState(30);
  const [creatingQuiz, setCreatingQuiz] = useState(false);

  // Question form
  const [questions, setQuestions] = useState<QuestionForm[]>([]);
  const [currentQ, setCurrentQ] = useState<QuestionForm>({
    question_text: '',
    options: ['', '', '', ''],
    correct_answer_index: 0,
  });
  const [addingQuestion, setAddingQuestion] = useState(false);

  const handleCreateQuiz = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreatingQuiz(true);

    try {
      const res = await api.post('/quizzes/create/', {
        title,
        description,
        time_limit: timeLimit,
      });
      setQuizId(res.data.id);
      setQuizTitle(title);
      setStep('questions');
      toast.success('Quiz created! Now add questions.');
    } catch (error: any) {
      toast.error(error?.response?.data?.error || 'Failed to create quiz');
    } finally {
      setCreatingQuiz(false);
    }
  };

  const handleAddQuestion = async () => {
    if (!quizId) return;

    // Validation
    if (!currentQ.question_text.trim()) {
      toast.error('Question text is required');
      return;
    }
    if (currentQ.options.some((opt) => !opt.trim())) {
      toast.error('All 4 options must be filled');
      return;
    }

    setAddingQuestion(true);
    try {
      await api.post(`/quizzes/${quizId}/questions/create/`, {
        question_text: currentQ.question_text,
        options: currentQ.options,
        correct_answer_index: currentQ.correct_answer_index,
      });
      setQuestions([...questions, { ...currentQ }]);
      setCurrentQ({
        question_text: '',
        options: ['', '', '', ''],
        correct_answer_index: 0,
      });
      toast.success(`Question ${questions.length + 1} added!`);
    } catch (error: any) {
      toast.error(error?.response?.data?.error || 'Failed to add question');
    } finally {
      setAddingQuestion(false);
    }
  };

  const updateOption = (index: number, value: string) => {
    const newOptions = [...currentQ.options];
    newOptions[index] = value;
    setCurrentQ({ ...currentQ, options: newOptions });
  };

  const optionLabels = ['A', 'B', 'C', 'D'];

  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="max-w-3xl mx-auto px-4 sm:px-6 py-8">
        <h1 className="text-2xl font-bold text-white mb-2">Create New Quiz</h1>
        <p className="text-surface-400 text-sm mb-8">
          {step === 'quiz' ? 'Set up your quiz details' : `Adding questions to "${quizTitle}"`}
        </p>

        {/* Step indicator */}
        <div className="flex items-center gap-4 mb-8">
          <div className={`flex items-center gap-2 ${step === 'quiz' ? 'text-primary-400' : 'text-success'}`}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${step === 'quiz' ? 'bg-primary-500 text-white' : 'bg-success text-white'}`}>
              {step === 'quiz' ? '1' : '✓'}
            </div>
            <span className="text-sm font-medium">Quiz Details</span>
          </div>
          <div className="h-px flex-1 bg-surface-700" />
          <div className={`flex items-center gap-2 ${step === 'questions' ? 'text-primary-400' : 'text-surface-500'}`}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${step === 'questions' ? 'bg-primary-500 text-white' : 'bg-surface-700 text-surface-400'}`}>
              2
            </div>
            <span className="text-sm font-medium">Add Questions</span>
          </div>
        </div>

        {step === 'quiz' && (
          <form onSubmit={handleCreateQuiz} className="glass rounded-2xl p-6 md:p-8 space-y-6">
            <div>
              <label className="block text-sm font-medium text-surface-300 mb-2">Quiz Title *</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                className="w-full px-4 py-3 rounded-xl bg-surface-800/50 border border-surface-700/50 text-white placeholder-surface-500 focus:border-primary-500 focus:outline-none transition-colors"
                placeholder="e.g., JavaScript Fundamentals"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-surface-300 mb-2">Description</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
                className="w-full px-4 py-3 rounded-xl bg-surface-800/50 border border-surface-700/50 text-white placeholder-surface-500 focus:border-primary-500 focus:outline-none transition-colors resize-none"
                placeholder="Brief description of the quiz..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-surface-300 mb-2">Time Limit (minutes) *</label>
              <input
                type="number"
                value={timeLimit}
                onChange={(e) => setTimeLimit(Number(e.target.value))}
                min={1}
                max={180}
                required
                className="w-full px-4 py-3 rounded-xl bg-surface-800/50 border border-surface-700/50 text-white placeholder-surface-500 focus:border-primary-500 focus:outline-none transition-colors"
              />
            </div>

            <button
              type="submit"
              disabled={creatingQuiz}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-primary-600 to-primary-500 text-white font-medium hover:from-primary-500 hover:to-primary-400 transition-all disabled:opacity-50 shadow-lg shadow-primary-500/20 cursor-pointer"
            >
              {creatingQuiz ? 'Creating...' : 'Create Quiz & Add Questions →'}
            </button>
          </form>
        )}

        {step === 'questions' && (
          <div className="space-y-6">
            {/* Added questions summary */}
            {questions.length > 0 && (
              <div className="glass rounded-2xl p-4">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-sm font-medium text-surface-300">Added Questions</h3>
                  <span className="text-xs text-primary-400">{questions.length} question{questions.length !== 1 ? 's' : ''}</span>
                </div>
                <div className="space-y-2">
                  {questions.map((q, i) => (
                    <div key={i} className="flex items-center gap-3 text-sm">
                      <span className="w-6 h-6 rounded bg-primary-500/20 text-primary-400 flex items-center justify-center text-xs font-bold">{i + 1}</span>
                      <span className="text-surface-300 truncate">{q.question_text}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* New question form */}
            <div className="glass rounded-2xl p-6 md:p-8 space-y-6">
              <h3 className="text-lg font-semibold text-white">Question {questions.length + 1}</h3>

              <div>
                <label className="block text-sm font-medium text-surface-300 mb-2">Question Text *</label>
                <textarea
                  value={currentQ.question_text}
                  onChange={(e) => setCurrentQ({ ...currentQ, question_text: e.target.value })}
                  rows={2}
                  className="w-full px-4 py-3 rounded-xl bg-surface-800/50 border border-surface-700/50 text-white placeholder-surface-500 focus:border-primary-500 focus:outline-none transition-colors resize-none"
                  placeholder="Enter your question..."
                />
              </div>

              <div className="space-y-3">
                <label className="block text-sm font-medium text-surface-300">Options *</label>
                {currentQ.options.map((opt, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => setCurrentQ({ ...currentQ, correct_answer_index: i })}
                      className={`flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold transition-all cursor-pointer ${
                        currentQ.correct_answer_index === i
                          ? 'bg-success text-white'
                          : 'bg-surface-700/50 text-surface-400 hover:bg-surface-600/50'
                      }`}
                      title="Mark as correct answer"
                    >
                      {optionLabels[i]}
                    </button>
                    <input
                      type="text"
                      value={opt}
                      onChange={(e) => updateOption(i, e.target.value)}
                      className="flex-1 px-4 py-2.5 rounded-xl bg-surface-800/50 border border-surface-700/50 text-white placeholder-surface-500 focus:border-primary-500 focus:outline-none transition-colors text-sm"
                      placeholder={`Option ${optionLabels[i]}`}
                    />
                    {currentQ.correct_answer_index === i && (
                      <span className="text-xs text-success font-medium">✓ Correct</span>
                    )}
                  </div>
                ))}
                <p className="text-xs text-surface-500">Click the letter button to mark the correct answer</p>
              </div>

              <div className="flex items-center gap-4">
                <button
                  onClick={handleAddQuestion}
                  disabled={addingQuestion}
                  className="flex-1 py-3 rounded-xl bg-gradient-to-r from-primary-600 to-primary-500 text-white font-medium hover:from-primary-500 hover:to-primary-400 transition-all disabled:opacity-50 shadow-lg shadow-primary-500/20 cursor-pointer"
                >
                  {addingQuestion ? 'Adding...' : '+ Add Question'}
                </button>
                {questions.length > 0 && (
                  <button
                    onClick={() => {
                      toast.success('Quiz published successfully!');
                      navigate('/quizzes');
                    }}
                    className="px-6 py-3 rounded-xl bg-gradient-to-r from-success to-emerald-500 text-white font-medium hover:opacity-90 transition-all shadow-lg shadow-success/20 cursor-pointer"
                  >
                    Finish & Publish
                  </button>
                )}
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default AdminQuizCreate;
