import React, { useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import Sidebar from './Sidebar';
import { X, Sparkles, FolderPlus } from 'lucide-react';
import * as api from '../services/api';

const MainLayout: React.FC = () => {
  const [showNewChatModal, setShowNewChatModal] = useState(false);
  const [newChatTitle, setNewChatTitle] = useState('');
  const [creating, setCreating] = useState(false);
  const navigate = useNavigate();

  const handleNewChat = () => {
    setShowNewChatModal(true);
  };

  const createNewChat = async () => {
    if (!newChatTitle.trim()) return;
    setCreating(true);
    try {
      const response = await api.createChat(newChatTitle);
      const chatId = response.data.id || response.data.chat_id;
      setShowNewChatModal(false);
      setNewChatTitle('');
      navigate(`/chat/${chatId}`);
    } catch (error) {
      console.error('Failed to create chat:', error);
    }
    setCreating(false);
  };

  return (
    <div className="flex h-screen">
      <Sidebar onNewChat={handleNewChat} />
      <main className="flex-1 overflow-hidden">
        <Outlet />
      </main>

      {/* New Workspace Modal */}
      {showNewChatModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
            onClick={() => setShowNewChatModal(false)}
          />

          {/* Modal */}
          <div className="relative w-full max-w-lg mx-4">
            <div className="glass-card rounded-2xl overflow-hidden shadow-2xl">
              {/* Header */}
              <div className="relative px-8 pt-8 pb-6">
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 to-cyan-400" />
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-400 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/30">
                      <FolderPlus size={24} className="text-white" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-white">New Workspace</h2>
                      <p className="text-gray-400 text-sm mt-1">Create a space for your documents</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setShowNewChatModal(false)}
                    className="p-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition-all"
                  >
                    <X size={20} />
                  </button>
                </div>
              </div>

              {/* Content */}
              <div className="px-8 pb-8">
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-300 mb-3">
                    Workspace name
                  </label>
                  <input
                    type="text"
                    placeholder="e.g., Research Papers, Work Documents..."
                    value={newChatTitle}
                    onChange={(e) => setNewChatTitle(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') createNewChat();
                      if (e.key === 'Escape') setShowNewChatModal(false);
                    }}
                    className="w-full bg-gray-800/50 text-white px-5 py-4 rounded-xl border border-gray-700/50 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all placeholder:text-gray-500"
                    autoFocus
                  />
                </div>

                <div className="flex items-center gap-3 mb-6 p-4 glass-card rounded-xl bg-blue-500/5">
                  <Sparkles size={18} className="text-blue-400" />
                  <p className="text-sm text-gray-400">
                    Upload documents to your workspace to unlock AI-powered chat, summaries, and quizzes
                  </p>
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={() => setShowNewChatModal(false)}
                    className="flex-1 px-5 py-3.5 bg-gray-800/50 hover:bg-gray-800 text-gray-300 rounded-xl transition-all font-medium border border-gray-700/50 hover:border-gray-600"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={createNewChat}
                    disabled={creating || !newChatTitle.trim()}
                    className="flex-1 px-5 py-3.5 bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed font-semibold shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 flex items-center justify-center gap-2"
                  >
                    {creating ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        Creating...
                      </>
                    ) : (
                      <>
                        <Sparkles size={18} />
                        Create Workspace
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MainLayout;
