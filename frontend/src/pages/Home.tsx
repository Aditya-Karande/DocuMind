import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import {
  FileText,
  MessageSquare,
  Brain,
  Upload,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  Zap,
  Shield,
} from 'lucide-react';

const Home: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  if (isAuthenticated) {
    navigate('/new');
    return null;
  }

  return (
    <div className="min-h-screen" style={{
  background: 'radial-gradient(ellipse at 20% 50%, rgba(30, 58, 138, 0.3) 0%, transparent 50%), radial-gradient(ellipse at 80% 20%, rgba(88, 28, 135, 0.2) 0%, transparent 50%), #080d1a'
}}>
      {/* Hero Section */}
      <div className="relative overflow-hidden">

        {/* Navigation */}
        <nav className="relative z-10 flex items-center justify-between px-6 lg:px-12 py-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-cyan-400 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/25">
              <Brain size={22} className="text-white" />
            </div>
            <span className="text-xl font-bold text-white">DocuMind</span>
          </div>
          <div className="flex items-center gap-4">
            <Link
              to="/login"
              className="px-4 py-2 text-gray-300 hover:text-white transition-colors"
            >
              Sign In
            </Link>
            <Link
              to="/register"
              className="px-5 py-2.5 bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white font-medium rounded-lg transition-all shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40"
            >
              Get Started
            </Link>
          </div>
        </nav>

        {/* Hero Content */}
        <div className="relative z-10 max-w-6xl mx-auto px-6 lg:px-12 pt-20 pb-32 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-500/10 border border-blue-500/20 rounded-full text-blue-400 text-sm mb-8">
            <Sparkles size={16} />
            <span>AI-powered document intelligence</span>
          </div>

          <h1 className="text-5xl lg:text-7xl font-bold text-white mb-6 leading-tight">
            Chat with your
            <br />
            <span className="bg-gradient-to-r from-blue-400 via-cyan-400 to-teal-400 bg-clip-text text-transparent">
              Documents
            </span>
          </h1>

          <p className="text-xl text-gray-400 max-w-2xl mx-auto mb-10">
            Upload any document and have intelligent conversations. Get instant answers,
            generate summaries, and create quizzes powered by advanced AI.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/register"
              className="group flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white font-semibold rounded-xl transition-all shadow-xl shadow-blue-500/25 hover:shadow-blue-500/40 hover:scale-105"
            >
              Start Free
              <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              to="/login"
              className="flex items-center gap-2 px-8 py-4 bg-white/5 hover:bg-white/10 text-white font-medium rounded-xl border border-white/10 transition-all"
            >
              Sign In
            </Link>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="relative py-24 border-t border-gray-800/50">
        <div className="max-w-6xl mx-auto px-6 lg:px-12">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4">
              Everything you need to understand your documents
            </h2>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              Powerful AI tools designed to help you extract insights from any document format
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="group p-8 bg-gray-800/50 hover:bg-gray-800 rounded-2xl border border-gray-700/50 hover:border-blue-500/50 transition-all">
              <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-lg shadow-blue-500/25">
                <MessageSquare size={28} className="text-white" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">Smart Chat</h3>
              <p className="text-gray-400">
                Ask questions in natural language and get accurate answers with source citations from your documents.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="group p-8 bg-gray-800/50 hover:bg-gray-800 rounded-2xl border border-gray-700/50 hover:border-green-500/50 transition-all">
              <div className="w-14 h-14 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-lg shadow-green-500/25">
                <FileText size={28} className="text-white" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">Auto Summaries</h3>
              <p className="text-gray-400">
                Generate comprehensive summaries of lengthy documents in seconds. Save hours of reading time.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="group p-8 bg-gray-800/50 hover:bg-gray-800 rounded-2xl border border-gray-700/50 hover:border-purple-500/50 transition-all">
              <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-violet-600 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-lg shadow-purple-500/25">
                <Brain size={28} className="text-white" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">Quiz Generator</h3>
              <p className="text-gray-400">
                Create interactive quizzes from your documents to test knowledge and improve retention.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* How It Works Section */}
      <div className="py-24 border-t border-gray-800/50">
        <div className="max-w-6xl mx-auto px-6 lg:px-12">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4">
              Simple. Fast. Intelligent.
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-500/20 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Upload size={32} className="text-blue-400" />
              </div>
              <div className="text-4xl font-bold text-white mb-2">1</div>
              <h3 className="text-xl font-semibold text-white mb-2">Upload</h3>
              <p className="text-gray-400">Upload your documents in any format - PDF, Word, or text files</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-cyan-500/20 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Zap size={32} className="text-cyan-400" />
              </div>
              <div className="text-4xl font-bold text-white mb-2">2</div>
              <h3 className="text-xl font-semibold text-white mb-2">Process</h3>
              <p className="text-gray-400">AI analyzes and indexes your documents instantly</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-teal-500/20 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <MessageSquare size={32} className="text-teal-400" />
              </div>
              <div className="text-4xl font-bold text-white mb-2">3</div>
              <h3 className="text-xl font-semibold text-white mb-2">Interact</h3>
              <p className="text-gray-400">Chat, summarize, or quiz - get insights instantly</p>
            </div>
          </div>
        </div>
      </div>

      {/* Benefits Section */}
      <div className="py-24 border-t border-gray-800/50">
        <div className="max-w-6xl mx-auto px-6 lg:px-12">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-3xl lg:text-4xl font-bold text-white mb-6">
                Built for productivity and security
              </h2>
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-green-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                    <CheckCircle2 size={20} className="text-green-400" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-1">Multi-format support</h3>
                    <p className="text-gray-400">Works with PDF, Word, PowerPoint, and text documents</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Shield size={20} className="text-blue-400" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-1">Secure & Private</h3>
                    <p className="text-gray-400">Your documents are processed securely and never shared</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
              <div className="w-10 h-10 bg-purple-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                <Brain size={20} className="text-purple-400" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white mb-1">Quiz Generation</h3>
                <p className="text-gray-400">Auto-generate MCQ quizzes from your documents to test and retain knowledge</p>
              </div>
            </div>
              </div>
            </div>

            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-3xl blur-2xl" />
              <div className="relative bg-gray-800 rounded-2xl border border-gray-700 p-6 shadow-2xl">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-3 h-3 bg-red-500 rounded-full" />
                  <div className="w-3 h-3 bg-yellow-500 rounded-full" />
                  <div className="w-3 h-3 bg-green-500 rounded-full" />
                </div>
                <div className="space-y-4">
                  <div className="flex justify-end">
                    <div className="bg-blue-600 text-white px-4 py-3 rounded-2xl rounded-br-md max-w-xs">
                      What are the key findings in the research paper?
                    </div>
                  </div>
                  <div className="flex justify-start">
                    <div className="bg-gray-700 text-gray-100 px-4 py-3 rounded-2xl rounded-bl-md max-w-sm">
                      <p className="mb-2">The research identifies three key findings:</p>
                      <ul className="text-sm text-gray-300 space-y-1">
                        <li>• 40% improvement in efficiency</li>
                        <li>• Cost reduction of $2.3M annually</li>
                        <li>• 95% user satisfaction rate</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-24 border-t border-gray-800/50">
        <div className="max-w-4xl mx-auto px-6 lg:px-12 text-center">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 via-cyan-500/20 to-teal-500/20 rounded-3xl blur-3xl" />
            <div className="relative bg-gray-800/80 backdrop-blur-sm rounded-3xl border border-gray-700 p-12">
              <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4">
                Ready to understand your documents?
              </h2>
              <p className="text-gray-400 text-lg mb-8">
                Join thousands of users who save hours every week with DocuMind
              </p>
              <Link
                to="/register"
                className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white font-semibold rounded-xl transition-all shadow-xl shadow-blue-500/25 hover:scale-105"
              >
                Get Started Free
                <ArrowRight size={20} />
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-gray-800/50 py-8">
        <div className="max-w-6xl mx-auto px-6 lg:px-12 flex items-center justify-between">
          <div className="flex items-center gap-2 text-gray-400">
            <Brain size={20} />
            <span>DocuMind</span>
          </div>
          <p className="text-gray-500 text-sm">
            © {new Date().getFullYear()} DocuMind. Intelligent document conversations.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Home;
