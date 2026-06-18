import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { FileText, Loader2, ArrowLeft, Sparkles, RefreshCw, Zap, Check, Download } from 'lucide-react';
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

  const handleDownload = () => {
    if (!summary) return;
    const blob = new Blob([summary], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'document-summary.txt';
    a.click();
    URL.revokeObjectURL(url);
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
            <div className="w-14 h-14 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center shadow-xl shadow-green-500/30">
              <FileText size={28} className="text-white" />
            </div>
            <div>
              <h1 className="text-3xl lg:text-4xl font-bold text-white">
                Document
                <span className="bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent"> Summary</span>
              </h1>
              <p className="text-gray-400 mt-1">Generate a comprehensive overview of your documents</p>
            </div>
          </div>
        </div>

        {!summary && !loading && (
          <div className="glass-card rounded-2xl p-10 text-center">
            <div className="w-24 h-24 bg-gradient-to-br from-green-500/20 to-emerald-500/10 rounded-2xl flex items-center justify-center mx-auto mb-8">
              <Sparkles size={40} className="text-green-400" />
            </div>
            <h2 className="text-2xl font-semibold text-white mb-4">
              Ready to summarize
            </h2>
            <p className="text-gray-400 mb-8 max-w-lg mx-auto leading-relaxed">
              Our AI will analyze all your uploaded documents and create a comprehensive summary highlighting the key points and insights
            </p>
            <div className="flex flex-wrap items-center justify-center gap-3 mb-8">
              <div className="flex items-center gap-2 px-4 py-2 bg-gray-800/50 rounded-full text-sm text-gray-400">
                <Check size={14} className="text-green-400" />
                Multi-document analysis
              </div>
              <div className="flex items-center gap-2 px-4 py-2 bg-gray-800/50 rounded-full text-sm text-gray-400">
                <Check size={14} className="text-green-400" />
                Key insights extraction
              </div>
              <div className="flex items-center gap-2 px-4 py-2 bg-gray-800/50 rounded-full text-sm text-gray-400">
                <Check size={14} className="text-green-400" />
                Instant results
              </div>
            </div>
            <button
              onClick={handleGenerate}
              disabled={loading}
              className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-green-600 to-emerald-500 hover:from-green-500 hover:to-emerald-400 text-white font-semibold rounded-xl transition-all disabled:opacity-50 shadow-xl shadow-green-500/25 hover:shadow-green-500/40 hover:scale-[1.02]"
            >
              <Sparkles size={20} />
              Generate Summary
            </button>
          </div>
        )}

        {loading && (
          <div className="glass-card rounded-2xl p-10 text-center">
            <div className="relative w-24 h-24 mx-auto mb-8">
              <div className="absolute inset-0 bg-gradient-to-br from-green-500/20 to-emerald-500/10 rounded-2xl shimmer" />
              <div className="absolute inset-0 flex items-center justify-center">
                <Loader2 size={36} className="animate-spin text-green-400" />
              </div>
            </div>
            <h2 className="text-2xl font-semibold text-white mb-4">
              Generating summary...
            </h2>
            <p className="text-gray-400 max-w-md mx-auto">
              Analyzing your documents and extracting key information. This may take a moment.
            </p>
            <div className="flex items-center justify-center gap-2 mt-6">
              <Zap size={16} className="text-green-400" />
              <span className="text-sm text-green-400">AI Processing</span>
            </div>
          </div>
        )}

        {error && (
          <div className="bg-red-500/10 border border-red-500/20 rounded-2xl p-8 mb-6">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-10 h-10 bg-red-500/20 rounded-xl flex items-center justify-center">
                <RefreshCw size={20} className="text-red-400" />
              </div>
              <p className="text-red-400">{error}</p>
            </div>
            <button
              onClick={handleGenerate}
              className="flex items-center gap-2 px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-xl transition-colors font-medium"
            >
              <RefreshCw size={18} />
              Try Again
            </button>
          </div>
        )}

        {summary && !loading && (
          <div className="glass-card rounded-2xl overflow-hidden">
            <div className="flex items-center justify-between p-6 border-b border-gray-700/50">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-green-500/20 rounded-xl flex items-center justify-center">
                  <FileText size={20} className="text-green-400" />
                </div>
                <div>
                  <span className="font-semibold text-white">Summary Generated</span>
                  <p className="text-xs text-gray-500">AI-powered analysis complete</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={handleDownload}
                  className="flex items-center gap-2 px-4 py-2 text-sm text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition-all"
                >
                  <Download size={16} />
                  Export
                </button>
                <button
                  onClick={handleGenerate}
                  className="flex items-center gap-2 px-4 py-2 text-sm text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition-all"
                >
                  <RefreshCw size={16} />
                  Regenerate
                </button>
              </div>
            </div>
            <div className="p-8">
              <div className="prose prose-invert max-w-none">
                <ReactMarkdown
                  remarkPlugins={[remarkGfm]}
                  components={{
                    h1: ({ children }) => (
                      <h1 className="text-3xl font-bold mb-6 text-white">{children}</h1>
                    ),
                    h2: ({ children }) => (
                      <h2 className="text-2xl font-semibold mb-4 text-green-300 flex items-center gap-2">
                        <FileText size={18} className="text-green-400" />
                        {children}
                      </h2>
                    ),
                    h3: ({ children }) => (
                      <h3 className="text-xl font-semibold mb-3 text-emerald-300">{children}</h3>
                    ),
                    p: ({ children }) => (
                      <p className="leading-8 text-gray-200 mb-4">{children}</p>
                    ),
                    strong: ({ children }) => (
                      <strong className="font-semibold text-green-300">{children}</strong>
                    ),
                    ul: ({ children }) => (
                      <ul className="list-disc marker:text-green-400 space-y-3 ml-6 mb-4 text-gray-200">
                        {children}
                      </ul>
                    ),
                    li: ({ children }) => (
                      <li>{children}</li>
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
