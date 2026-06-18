import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Brain, Loader2, ArrowLeft, Sparkles, CheckCircle, X, Zap, Trophy, Target, Check } from 'lucide-react';
import * as api from '../services/api';
import { QuizQuestion } from '../types';

const QuizPage: React.FC = () => {
  const { chatId } = useParams<{ chatId: string }>();
  const [numQuestions, setNumQuestions] = useState(5);
  const [quiz, setQuiz] = useState<QuizQuestion[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [revealedAnswers, setRevealedAnswers] = useState<Set<number>>(new Set());
  const [selectedAnswers, setSelectedAnswers] = useState<Map<number, number>>(new Map());

  const handleGenerate = async () => {
    setLoading(true);
    setError(null);
    setQuiz(null);
    setRevealedAnswers(new Set());
    setSelectedAnswers(new Map());
    try {
      const response = await api.generateQuiz(chatId!, numQuestions);
      setQuiz(response.data.questions || response.data.quiz || response.data);
    } catch (err: unknown) {
      const error = err as { response?: { data?: { detail?: string } } };
      setError(error.response?.data?.detail || 'Failed to generate quiz');
    }
    setLoading(false);
  };

  const toggleReveal = (index: number) => {
    setRevealedAnswers((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(index)) {
        newSet.delete(index);
      } else {
        newSet.add(index);
      }
      return newSet;
    });
  };

  const selectAnswer = (questionIndex: number, answerIndex: number) => {
    setSelectedAnswers((prev) => {
      const newMap = new Map(prev);
      newMap.set(questionIndex, answerIndex);
      return newMap;
    });
  };

  const getScore = () => {
    if (!quiz) return 0;
    let correct = 0;
    quiz.forEach((q, idx) => {
      if (selectedAnswers.get(idx) === q.correct_answer) {
        correct++;
      }
    });
    return correct;
  };

  const allRevealed = quiz && quiz.every((_, idx) => revealedAnswers.has(idx));
  const showRevealAll = quiz && !allRevealed;

  const getOptionStyle = (questionIndex: number, optionIndex: number) => {
    const isSelected = selectedAnswers.get(questionIndex) === optionIndex;
    const isRevealed = revealedAnswers.has(questionIndex);
    const isCorrect = quiz && quiz[questionIndex]?.correct_answer === optionIndex;

    if (isRevealed) {
      if (isCorrect) {
        return 'bg-green-500/10 border-green-500/30 text-green-300';
      } else if (isSelected && !isCorrect) {
        return 'bg-red-500/10 border-red-500/30 text-red-300';
      }
      return 'bg-gray-800/50 text-gray-400 border-gray-700/50';
    } else if (isSelected) {
      return 'bg-purple-500/10 border-purple-500/30 text-purple-300';
    }
    return 'bg-gray-800/50 hover:bg-gray-800 text-gray-300 border-gray-700/50 hover:border-gray-600';
  };

  return (
    <div className="h-full overflow-y-auto">
      <div className="relative max-w-4xl mx-auto p-8">
        {/* Header */}
        <div className="mb-10">
          <Link
            to={`/chat/${chatId}`}
            className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-8 group"
          >
            <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
            Back to Dashboard
          </Link>

          <div className="flex items-center gap-4 mb-4">
            <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-violet-600 rounded-2xl flex items-center justify-center shadow-xl shadow-purple-500/30">
              <Brain size={28} className="text-white" />
            </div>
            <div>
              <h1 className="text-3xl lg:text-4xl font-bold text-white">
                Document
                <span className="bg-gradient-to-r from-purple-400 to-violet-400 bg-clip-text text-transparent"> Quiz</span>
              </h1>
              <p className="text-gray-400 mt-1">Test your knowledge with AI-generated questions</p>
            </div>
          </div>
        </div>

        {!quiz && !loading && (
          <div className="glass-card rounded-2xl p-10">
            <div className="text-center mb-8">
              <div className="w-24 h-24 bg-gradient-to-br from-purple-500/20 to-violet-500/10 rounded-2xl flex items-center justify-center mx-auto mb-8">
                <Target size={40} className="text-purple-400" />
              </div>
              <h2 className="text-2xl font-semibold text-white mb-4">
                Quiz Setup
              </h2>
              <p className="text-gray-400 max-w-md mx-auto leading-relaxed">
                Choose the number of questions and test your understanding of the uploaded documents
              </p>
            </div>

            {error && (
              <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 mb-6">
                <p className="text-red-400 text-center">{error}</p>
              </div>
            )}

            <div className="flex flex-col items-center gap-8">
              <div className="flex items-center gap-6">
                <label className="text-gray-300 font-medium">Questions:</label>
                <div className="flex gap-2">
                  {[5, 10, 15].map((num) => (
                    <button
                      key={num}
                      onClick={() => setNumQuestions(num)}
                      className={`px-5 py-2.5 rounded-xl font-medium transition-all ${
                        numQuestions === num
                          ? 'bg-gradient-to-r from-purple-600 to-violet-500 text-white shadow-lg shadow-purple-500/25'
                          : 'bg-gray-800/50 text-gray-400 hover:text-white border border-gray-700/50 hover:border-gray-600'
                      }`}
                    >
                      {num}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex flex-wrap items-center justify-center gap-3">
                <div className="flex items-center gap-2 px-4 py-2 bg-gray-800/50 rounded-full text-sm text-gray-400">
                  <Check size={14} className="text-purple-400" />
                  Instant feedback
                </div>
                <div className="flex items-center gap-2 px-4 py-2 bg-gray-800/50 rounded-full text-sm text-gray-400">
                  <Check size={14} className="text-purple-400" />
                  Multiple choice
                </div>
                <div className="flex items-center gap-2 px-4 py-2 bg-gray-800/50 rounded-full text-sm text-gray-400">
                  <Check size={14} className="text-purple-400" />
                  Track score
                </div>
              </div>

              <button
                onClick={handleGenerate}
                disabled={loading}
                className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-purple-600 to-violet-500 hover:from-purple-500 hover:to-violet-400 text-white font-semibold rounded-xl transition-all disabled:opacity-50 shadow-xl shadow-purple-500/25 hover:shadow-purple-500/40 hover:scale-[1.02]"
              >
                <Sparkles size={20} />
                Generate Quiz
              </button>
            </div>
          </div>
        )}

        {loading && (
          <div className="glass-card rounded-2xl p-10 text-center">
            <div className="relative w-24 h-24 mx-auto mb-8">
              <div className="absolute inset-0 bg-gradient-to-br from-purple-500/20 to-violet-500/10 rounded-2xl shimmer" />
              <div className="absolute inset-0 flex items-center justify-center">
                <Loader2 size={36} className="animate-spin text-purple-400" />
              </div>
            </div>
            <h2 className="text-2xl font-semibold text-white mb-4">
              Generating quiz...
            </h2>
            <p className="text-gray-400 max-w-md mx-auto">
              Creating {numQuestions} questions based on your documents
            </p>
            <div className="flex items-center justify-center gap-2 mt-6">
              <Zap size={16} className="text-purple-400" />
              <span className="text-sm text-purple-400">AI Processing</span>
            </div>
          </div>
        )}

        {quiz && !loading && (
          <div className="space-y-6">
            {/* Score Banner */}
            {allRevealed && (
              <div className="bg-gradient-to-r from-purple-600/20 to-violet-600/20 glass-card rounded-2xl p-6 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-violet-500 rounded-xl flex items-center justify-center">
                    <Trophy size={24} className="text-white" />
                  </div>
                  <div>
                    <p className="text-sm text-purple-300">Your Score</p>
                    <p className="text-3xl font-bold text-white">{getScore()} / {quiz.length}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-400">Accuracy</p>
                  <p className="text-2xl font-semibold text-purple-400">
                    {Math.round((getScore() / quiz.length) * 100)}%
                  </p>
                </div>
              </div>
            )}

            {/* Header */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-purple-500/20 rounded-xl flex items-center justify-center">
                  <Brain size={20} className="text-purple-400" />
                </div>
                <div>
                  <span className="font-semibold text-white">{quiz.length} Questions</span>
                  <p className="text-xs text-gray-500">Select your answers below</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                {showRevealAll && (
                  <button
                    onClick={() => {
                      const allIndices = new Set(quiz.map((_, idx) => idx));
                      setRevealedAnswers(allIndices);
                    }}
                    className="flex items-center gap-2 px-4 py-2 text-sm text-gray-400 hover:text-white border border-gray-700/50 hover:border-gray-600 rounded-lg transition-all"
                  >
                    <CheckCircle size={16} />
                    Reveal All
                  </button>
                )}
                <button
                  onClick={handleGenerate}
                  className="flex items-center gap-2 px-5 py-2.5 text-sm text-purple-400 hover:text-purple-300 border border-purple-500/30 hover:border-purple-500/50 rounded-lg transition-all"
                >
                  <Sparkles size={16} />
                  New Quiz
                </button>
              </div>
            </div>

            {/* Questions */}
            {quiz.map((question, qIndex) => (
              <div key={qIndex} className="glass-card rounded-2xl overflow-hidden">
                <div className="p-6 border-b border-gray-700/50">
                  <div className="flex items-start gap-4">
                    <div className={`flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center font-semibold ${
                      revealedAnswers.has(qIndex)
                        ? selectedAnswers.get(qIndex) === question.correct_answer
                          ? 'bg-green-500/20 text-green-400'
                          : 'bg-red-500/20 text-red-400'
                        : 'bg-purple-500/20 text-purple-400'
                    }`}>
                      {qIndex + 1}
                    </div>
                    <h3 className="text-lg font-medium text-white leading-relaxed flex-1">
                      {question.question}
                    </h3>
                  </div>
                </div>

                <div className="p-5 grid grid-cols-1 md:grid-cols-2 gap-3">
                  {question.options.map((option, oIndex) => (
                    <button
                      key={oIndex}
                      onClick={() => !revealedAnswers.has(qIndex) && selectAnswer(qIndex, oIndex)}
                      disabled={revealedAnswers.has(qIndex)}
                      className={`text-left p-4 rounded-xl border transition-all ${
                        getOptionStyle(qIndex, oIndex)
                      } ${revealedAnswers.has(qIndex) ? 'cursor-default' : 'cursor-pointer hover:scale-[1.01]'}`}
                    >
                      <span className="flex items-center gap-3">
                        <span className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm font-medium ${
                          revealedAnswers.has(qIndex) && question.correct_answer === oIndex
                            ? 'bg-green-500/30 text-green-300'
                            : revealedAnswers.has(qIndex) && selectedAnswers.get(qIndex) === oIndex && question.correct_answer !== oIndex
                            ? 'bg-red-500/30 text-red-300'
                            : 'bg-gray-700/50 text-gray-400'
                        }`}>
                          {String.fromCharCode(65 + oIndex)}
                        </span>
                        <span className="flex-1">{option}</span>
                        {revealedAnswers.has(qIndex) && question.correct_answer === oIndex && (
                          <CheckCircle size={18} className="text-green-400" />
                        )}
                      </span>
                    </button>
                  ))}
                </div>

                <div className="px-6 py-4 border-t border-gray-700/50 bg-gray-900/30 flex items-center justify-between">
                  <button
                    onClick={() => toggleReveal(qIndex)}
                    className="flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors"
                  >
                    {revealedAnswers.has(qIndex) ? (
                      <>
                        <X size={16} />
                        Hide Answer
                      </>
                    ) : (
                      <>
                        <CheckCircle size={16} />
                        Show Answer
                      </>
                    )}
                  </button>

                  {revealedAnswers.has(qIndex) && (
                    <div className="flex items-center gap-2">
                      <span className="text-gray-500">Correct:</span>
                      <span className="text-green-400 font-medium">
                        {String.fromCharCode(65 + question.correct_answer)}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default QuizPage;
