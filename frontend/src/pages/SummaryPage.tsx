import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { FileText, Loader2, ArrowLeft, Sparkles, RefreshCw } from 'lucide-react';
import * as api from '../services/api';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

const SummaryPage: React.FC = () => {
  const { chatId } = useParams<{ chatId: string }>();
  const [summary, setSummary] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.generateSummary(chatId!);
      setSummary(response.data.summary || response.data.output || response.data);
    } catch (err: unknown) {
      const error = err as { response?: { data?: { detail?: string } } };
      setError(error.response?.data?.detail || 'Failed to generate summary');
    }
    setLoading(false);
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
            <div className="w-14 h-14 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center shadow-lg shadow-green-500/25">
              <FileText size={28} className="text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">Document Summary</h1>
              <p className="text-gray-400">
                Generate a comprehensive summary of all your uploaded documents
              </p>
            </div>
          </div>
        </div>

        {!summary && !loading && (
          <div className="bg-gray-900/50 rounded-2xl border border-gray-700/50 p-12 text-center">
            <div className="w-24 h-24 bg-gradient-to-br from-green-500/20 to-emerald-500/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <Sparkles size={48} className="text-green-400" />
            </div>
            <h2 className="text-2xl font-semibold text-white mb-3">
              Ready to summarize
            </h2>
            <p className="text-gray-400 mb-8 max-w-md mx-auto">
              Our AI will analyze all your uploaded documents and create a comprehensive summary with key points
            </p>
            <button
              onClick={handleGenerate}
              disabled={loading}
              className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-green-600 to-emerald-500 hover:from-green-500 hover:to-emerald-400 text-white font-medium rounded-xl transition-all disabled:opacity-50 shadow-lg shadow-green-500/25 hover:shadow-green-500/40"
            >
              <Sparkles size={20} />
              Generate Summary
            </button>
          </div>
        )}

        {loading && (
          <div className="bg-gray-900/50 rounded-2xl border border-gray-700/50 p-12 text-center">
            <div className="relative w-24 h-24 mx-auto mb-6">
              <div className="absolute inset-0 bg-gradient-to-br from-green-500/20 to-emerald-500/10 rounded-2xl animate-pulse" />
              <div className="absolute inset-0 flex items-center justify-center">
                <Loader2 size={40} className="animate-spin text-green-400" />
              </div>
            </div>
            <h2 className="text-2xl font-semibold text-white mb-3">
              Generating summary...
            </h2>
            <p className="text-gray-400 max-w-md mx-auto">
              Analyzing your documents and extracting key information. This may take a moment.
            </p>
          </div>
        )}

        {error && (
          <div className="bg-red-500/10 border border-red-500/20 rounded-2xl p-6 mb-6">
            <p className="text-red-400 mb-4">{error}</p>
            <button
              onClick={handleGenerate}
              className="flex items-center gap-2 px-5 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
            >
              <RefreshCw size={18} />
              Try Again
            </button>
          </div>
        )}

        {summary && !loading && (
          <div className="bg-gray-900/50 rounded-2xl border border-gray-700/50">
            <div className="flex items-center justify-between p-6 border-b border-gray-700/50">
              <div className="flex items-center gap-3">
                <FileText size={20} className="text-green-400" />
                <span className="font-medium text-white">Summary</span>
              </div>
              <button
                onClick={handleGenerate}
                className="flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors"
              >
                <RefreshCw size={16} />
                Regenerate
              </button>
            </div>
            <div className="p-6">
              <div className="prose prose-invert max-w-none">
  <ReactMarkdown
    remarkPlugins={[remarkGfm]}
    components={{
      h1: ({ children }) => (
        <h1 className="text-4xl font-bold mb-6 text-white">
          {children}
        </h1>
      ),

      h2: ({ children }) => (
        <>
          <div className="border-t border-gray-700/50 my-6" />
          <h2 className="text-2xl font-semibold mb-4 text-green-300">
            📄 {children}
          </h2>
        </>
      ),

      h3: ({ children }) => (
        <h3 className="text-xl font-semibold mb-3 text-emerald-300">
          ✨ {children}
        </h3>
      ),

      p: ({ children }) => (
        <p className="leading-8 text-gray-200 mb-4">
          {children}
        </p>
      ),

      strong: ({ children }) => (
        <strong className="font-semibold text-green-300">
          {children}
        </strong>
      ),

      ul: ({ children }) => (
        <ul className="space-y-3 ml-4 mb-4">
          {children}
        </ul>
      ),

      li: ({ children }) => (
        <li className="mb-2 text-gray-200">
          {children}
        </li>
      ),
    }}
  >
    {summary}
  </ReactMarkdown>
</div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SummaryPage;
