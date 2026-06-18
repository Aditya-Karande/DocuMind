import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Plus, MessageSquare, MoreVertical, Trash2, Pencil, LogOut, Brain, Sparkles } from 'lucide-react';
import { Chat } from '../types';
import * as api from '../services/api';
import { useAuth } from '../contexts/AuthContext';

interface SidebarProps {
  onNewChat: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ onNewChat }) => {
  const [chats, setChats] = useState<Chat[]>([]);
  const [menuOpen, setMenuOpen] = useState<string | null>(null);
  const [editingChat, setEditingChat] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const menuRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const { chatId } = useParams();
  const { logout, user } = useAuth();

  useEffect(() => {
    fetchChats();
  }, [chatId]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMenuOpen(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const fetchChats = async () => {
    try {
      const response = await api.getChats();
      setChats(response.data);
    } catch (error) {
      console.error('Failed to fetch chats:', error);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await api.deleteChat(id);
      setChats(chats.filter((c) => c.id !== id));
      if (String(chatId) === String(id)) {
        navigate('/new');
      }
    } catch (error) {
      console.error('Failed to delete chat:', error);
    }
    setMenuOpen(null);
  };

  const handleRename = async (id: string) => {
    if (!editTitle.trim()) return;
    try {
      await api.updateChat(id, editTitle);
      setChats(chats.map((c) => (c.id === id ? { ...c, title: editTitle } : c)));
    } catch (error) {
      console.error('Failed to rename chat:', error);
    }
    setEditingChat(null);
    setMenuOpen(null);
  };

  const startEditing = (chat: Chat) => {
    setEditingChat(chat.id);
    setEditTitle(chat.title);
    setMenuOpen(null);
  };

  const username = localStorage.getItem('username') || 'User';

  return (
    <div className="w-80 h-full bg-gray-950/80 backdrop-blur-sm border-r border-gray-800/50 flex flex-col overflow-hidden relative">
      {/* Logo */}
      <div className="p-6 border-b border-gray-800/50">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 bg-gradient-to-br from-blue-500 to-cyan-400 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/30">
            <Brain size={22} className="text-white" />
          </div>
          <div>
            <span className="text-xl font-bold text-white">DocuMind</span>
            <p className="text-xs text-gray-500">AI Document Intelligence</p>
          </div>
        </div>
      </div>

      {/* New Chat Button */}
      <div className="p-4">
        <button
          onClick={onNewChat}
          className="w-full group flex items-center justify-center gap-3 px-5 py-4 bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 rounded-xl transition-all text-white font-semibold shadow-xl shadow-blue-500/25 hover:shadow-blue-500/40 hover:scale-[1.02]"
        >
          <Plus size={20} />
          New Workspace
          <Sparkles size={16} className="opacity-60 group-hover:opacity-100 transition-opacity" />
        </button>
      </div>

      {/* Chats List */}
      <div className="flex-1 overflow-y-auto px-3">
        <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider px-4 py-3 flex items-center gap-2">
          <MessageSquare size={12} />
          Recent Workspaces
        </div>
        {chats.length === 0 ? (
          <div className="text-center py-12 px-4">
            <div className="w-16 h-16 bg-gray-800/50 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <MessageSquare size={28} className="text-gray-600" />
            </div>
            <p className="text-gray-500 text-sm">No workspaces yet</p>
            <p className="text-gray-600 text-xs mt-1">Create one to get started</p>
          </div>
        ) : (
          <div className="space-y-1">
            {chats.map((chat) => (
              <div
                key={chat.id}
                className={`group relative rounded-xl transition-all ${
                  chatId === chat.id
                    ? 'bg-gradient-to-r from-blue-600/20 to-cyan-600/10 border border-blue-500/30'
                    : 'hover:bg-gray-800/50 border border-transparent'
                }`}
              >
                {editingChat === chat.id ? (
                  <div className="p-2">
                    <input
                      type="text"
                      value={editTitle}
                      onChange={(e) => setEditTitle(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') handleRename(chat.id);
                        if (e.key === 'Escape') setEditingChat(null);
                      }}
                      className="w-full bg-gray-800 text-white px-4 py-2.5 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 border border-gray-700"
                      autoFocus
                    />
                  </div>
                ) : (
                  <button
                    onClick={() => navigate(`/chat/${chat.id}`)}
                    className="w-full flex items-center gap-3 px-4 py-3.5 text-left"
                  >
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                      chatId === chat.id
                        ? 'bg-blue-500/30 text-blue-400'
                        : 'bg-gray-800 text-gray-500'
                    }`}>
                      <MessageSquare size={16} />
                    </div>
                    <span className={`truncate text-sm flex-1 ${
                      chatId === chat.id ? 'text-white' : 'text-gray-400'
                    }`}>
                      {chat.title}
                    </span>
                  </button>
                )}

                <div className="absolute right-2 top-1/2 -translate-y-1/2" ref={menuOpen === chat.id ? menuRef : undefined}>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setMenuOpen(menuOpen === chat.id ? null : chat.id);
                    }}
                    className={`p-2 rounded-lg transition-all ${
                      chatId === chat.id
                        ? 'text-gray-400 hover:text-white hover:bg-white/10'
                        : 'text-gray-600 hover:text-white hover:bg-gray-700'
                    } opacity-0 group-hover:opacity-100`}
                  >
                    <MoreVertical size={16} />
                  </button>

                  {menuOpen === chat.id && (
                    <div className="absolute right-0 top-full mt-1 glass-card rounded-xl shadow-2xl py-1.5 z-50 min-w-[160px]">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          startEditing(chat);
                        }}
                        className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-300 hover:bg-gray-700/50 hover:text-white transition-colors"
                      >
                        <Pencil size={14} />
                        Rename
                      </button>
                      <div className="my-1 border-t border-gray-700/50" />
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDelete(chat.id);
                        }}
                        className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-400 hover:bg-red-500/10 transition-colors"
                      >
                        <Trash2 size={14} />
                        Delete
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* User Section */}
      <div className="border-t border-gray-800/50 p-4">
        <div className="flex items-center gap-3 mb-3 p-3 rounded-xl glass-card bg-gray-900/50">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-cyan-400 rounded-full flex items-center justify-center shadow-lg shadow-blue-500/20">
            <span className="text-white text-sm font-bold">
              {user?.username?.charAt(0)?.toUpperCase() || username?.charAt(0)?.toUpperCase() || 'U'}
            </span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-white truncate">{user?.username || username}</p>
            <p className="text-xs text-gray-500">Pro Member</p>
          </div>
        </div>
        <button
          onClick={() => {
            logout();
            navigate('/');
          }}
          className="w-full flex items-center justify-center gap-2 px-4 py-3 text-gray-400 hover:text-white hover:bg-gray-800/50 rounded-xl transition-all text-sm border border-gray-800/50 hover:border-gray-700"
        >
          <LogOut size={16} />
          Sign Out
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
