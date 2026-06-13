import React, { useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import Sidebar from './Sidebar';
import { X } from 'lucide-react';
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
    <div className="flex h-screen bg-gray-950">
      <Sidebar onNewChat={handleNewChat} />
      <main className="flex-1 overflow-hidden">
        <Outlet />
      </main>

      {/* New Chat Modal */}
      {showNewChatModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-gray-900 rounded-2xl p-8 w-full max-w-md shadow-2xl border border-gray-800">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-semibold text-white">New Workspace</h2>
              <button
                onClick={() => setShowNewChatModal(false)}
                className="p-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition-all"
              >
                <X size={24} />
              </button>
            </div>
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-400 mb-2">
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
                className="w-full bg-gray-800/50 text-white px-5 py-4 rounded-xl border border-gray-700 focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500 transition-all placeholder:text-gray-500"
                autoFocus
              />
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setShowNewChatModal(false)}
                className="flex-1 px-5 py-3 bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-xl transition-colors font-medium"
              >
                Cancel
              </button>
              <button
                onClick={createNewChat}
                disabled={creating || !newChatTitle.trim()}
                className="flex-1 px-5 py-3 bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed font-medium shadow-lg shadow-blue-500/20"
              >
                {creating ? 'Creating...' : 'Create'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MainLayout;
