import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Brain, Loader2, ArrowLeft, Sparkles, CheckCircle, X } from 'lucide-react';
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

  const getOptionStyle = (questionIndex: number, optionIndex: number) => {
    const isSelected = selectedAnswers.get(questionIndex) === optionIndex;
    const isRevealed = revealedAnswers.has(questionIndex);
    const isCorrect = quiz && quiz[questionIndex]?.correct_answer === optionIndex;

    let baseClass = 'bg-gray-800/50 hover:bg-gray-800 text-gray-200 border-gray-700/50';

    if (isRevealed) {
      if (isCorrect) {
        baseClass = 'bg-green-500/20 border-green-500/50 text-green-300';
      } else if (isSelected && !isCorrect) {
        baseClass = 'bg-red-500/20 border-red-500/50 text-red-300';
      }
    } else if (isSelected) {
      baseClass = 'bg-purple-500/20 border-purple-500/50 text-purple-300';
    }

    return baseClass;
  };

  return (
    <div className="h-full bg-gray-800 overflow-y-auto">
      <div className="max-w-4xl mx-auto p-8">
        {/* Header */}
        <div className="mb-8">
          <Link
            to={`/chat/${chatId}`}
            className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-6"
          >
            <ArrowLeft size={20} />
            Back to Dashboard
          </Link>
          <div className="flex items-start gap-4">
            <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-violet-600 rounded-xl flex items-center justify-center shadow-lg shadow-purple-500/25">
              <Brain size={28} className="text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">Quiz Generator</h1>
              <p className="text-gray-400">
                Test your knowledge with AI-generated questions from your documents
              </p>
            </div>
          </div>
        </div>

        {!quiz && !loading && (
          <div className="bg-gray-900/50 rounded-2xl border border-gray-700/50 p-10">
            <div className="text-center mb-8">
              <div className="w-24 h-24 bg-gradient-to-br from-purple-500/20 to-violet-500/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Brain size={48} className="text-purple-400" />
              </div>
              <h2 className="text-2xl font-semibold text-white mb-3">
                Quiz Setup
              </h2>
              <p className="text-gray-400 max-w-md mx-auto">
                Choose the number of questions and test your understanding of the documents
              </p>
            </div>

            {error && (
              <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 mb-6">
                <p className="text-red-400">{error}</p>
              </div>
            )}

            <div className="flex flex-col items-center gap-6">
              <div className="flex items-center gap-4">
                <label className="text-gray-300 font-medium">Number of questions:</label>
                <select
                  value={numQuestions}
                  onChange={(e) => setNumQuestions(Number(e.target.value))}
                  className="bg-gray-800 text-white px-5 py-2.5 rounded-xl border border-gray-700 focus:outline-none focus:border-purple-500 transition-colors"
                >
                  <option value={5}>5 questions</option>
                  <option value={10}>10 questions</option>
                  <option value={15}>15 questions</option>
                </select>
              </div>

              <button
                onClick={handleGenerate}
                disabled={loading}
                className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-purple-600 to-violet-500 hover:from-purple-500 hover:to-violet-400 text-white font-medium rounded-xl transition-all disabled:opacity-50 shadow-lg shadow-purple-500/25 hover:shadow-purple-500/40"
              >
                <Sparkles size={20} />
                Generate Quiz
              </button>
            </div>
          </div>
        )}

        {loading && (
          <div className="bg-gray-900/50 rounded-2xl border border-gray-700/50 p-12 text-center">
            <div className="relative w-24 h-24 mx-auto mb-6">
              <div className="absolute inset-0 bg-gradient-to-br from-purple-500/20 to-violet-500/10 rounded-2xl animate-pulse" />
              <div className="absolute inset-0 flex items-center justify-center">
                <Loader2 size={40} className="animate-spin text-purple-400" />
              </div>
            </div>
            <h2 className="text-2xl font-semibold text-white mb-3">
              Generating quiz...
            </h2>
            <p className="text-gray-400 max-w-md mx-auto">
              Creating {numQuestions} questions based on your documents
            </p>
          </div>
        )}

        {quiz && !loading && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Brain size={20} className="text-purple-400" />
                <span className="text-white font-medium">{quiz.length} Questions</span>
              </div>
              <button
                onClick={handleGenerate}
                className="flex items-center gap-2 px-5 py-2.5 text-sm text-purple-400 hover:text-purple-300 border border-purple-500/30 hover:border-purple-500/50 rounded-xl transition-all"
              >
                <Sparkles size={16} />
                Generate New Quiz
              </button>
            </div>

            {quiz.map((question, qIndex) => (
              <div
                key={qIndex}
                className="bg-gray-900/50 rounded-2xl border border-gray-700/50 overflow-hidden"
              >
                <div className="p-6 border-b border-gray-700/50">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-3">
                      <span className="flex-shrink-0 w-8 h-8 bg-purple-500/20 text-purple-400 rounded-lg flex items-center justify-center text-sm font-medium">
                        {qIndex + 1}
                      </span>
                      <h3 className="text-lg font-medium text-white leading-relaxed">
                        {question.question}
                      </h3>
                    </div>
                  </div>
                </div>

                <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-3">
                  {question.options.map((option, oIndex) => (
                    <button
                      key={oIndex}
                      onClick={() =>
                        !revealedAnswers.has(qIndex) && selectAnswer(qIndex, oIndex)
                      }
                      disabled={revealedAnswers.has(qIndex)}
                      className={`text-left p-4 rounded-xl border transition-all ${getOptionStyle(
                        qIndex,
                        oIndex
                      )} ${
                        revealedAnswers.has(qIndex)
                          ? 'cursor-default'
                          : 'cursor-pointer'
                      }`}
                    >
                      <span className="inline-flex items-center justify-center w-7 h-7 rounded-lg bg-gray-700/50 text-sm font-medium mr-3">
                        {String.fromCharCode(65 + oIndex)}
                      </span>
                      {option}
                    </button>
                  ))}
                </div>

                <div className="px-6 py-4 border-t border-gray-700/50 flex items-center justify-between bg-gray-800/30">
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
                    <div className="text-sm">
                      <span className="text-gray-400">Correct answer: </span>
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
