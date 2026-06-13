import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import MainLayout from './components/MainLayout';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import ChatDashboard from './pages/ChatDashboard';
import ChatPage from './pages/ChatPage';
import SummaryPage from './pages/SummaryPage';
import QuizPage from './pages/QuizPage';
import { Brain, FileText, MessageSquare, Plus } from 'lucide-react';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route
            path="/new"
            element={
              <ProtectedRoute>
                <MainLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<NewChatPlaceholder />} />
          </Route>
          <Route
            path="/chat/:chatId"
            element={
              <ProtectedRoute>
                <MainLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<ChatDashboard />} />
            <Route path="ask" element={<ChatPage />} />
            <Route path="summary" element={<SummaryPage />} />
            <Route path="quiz" element={<QuizPage />} />
          </Route>
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

function NewChatPlaceholder({ onNewChat }: { onNewChat: () => void }) {
  return (
    <div className="h-full flex flex-col items-center justify-center text-center px-8 bg-gray-800">
      {/* Icon */}
      <div className="w-20 h-20 bg-gradient-to-br from-blue-500/20 to-cyan-400/20 rounded-2xl flex items-center justify-center mb-6 border border-blue-500/20">
        <Brain size={40} className="text-blue-400" />
      </div>

      {/* Heading */}
      <h1 className="text-3xl font-bold text-white mb-3">Welcome to DocuMind</h1>
      <p className="text-gray-400 text-base mb-2">Upload your PDFs and start asking questions</p>
      <p className="text-gray-500 text-sm mb-8">Your documents, your knowledge, your assistant</p>

      {/* Feature pills */}
      <div className="flex flex-wrap justify-center gap-3 mb-10">
        <div className="flex items-center gap-2 px-4 py-2 bg-gray-900 rounded-full border border-gray-700 text-sm text-gray-300">
          <MessageSquare size={14} className="text-blue-400" />
          Chat with PDFs
        </div>
        <div className="flex items-center gap-2 px-4 py-2 bg-gray-900 rounded-full border border-gray-700 text-sm text-gray-300">
          <FileText size={14} className="text-cyan-400" />
          Generate Summary
        </div>
        <div className="flex items-center gap-2 px-4 py-2 bg-gray-900 rounded-full border border-gray-700 text-sm text-gray-300">
          <Brain size={14} className="text-purple-400" />
          Generate Quiz
        </div>
      </div>

      {/* CTA Button */}
      <button
        onClick={onNewChat}
        className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white rounded-xl transition-all shadow-lg shadow-blue-500/20 font-medium"
      >
        <Plus size={20} />
        Create New Chat
      </button>
    </div>
  );
}

export default App;
