import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Plus, MessageSquare, MoreVertical, Trash2, Pencil, LogOut, Brain } from 'lucide-react';
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
    <div className="w-72 h-full bg-gray-900 border-r border-gray-800 flex flex-col overflow-x-hidden">
      {/* Logo */}
      <div className="p-5 border-b border-gray-800">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-cyan-400 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/20">
            <Brain size={20} className="text-white" />
          </div>
          <span className="text-xl font-bold text-white">DocuMind</span>
        </div>
      </div>

      {/* New Chat Button */}
      <div className="p-4">
        <button
          onClick={onNewChat}
          className="w-full flex items-center gap-3 px-4 py-3 bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 rounded-xl transition-all text-white font-medium shadow-lg shadow-blue-500/20 hover:shadow-blue-500/30"
        >
          <Plus size={20} />
          New Chat
        </button>
      </div>

      {/* Chats List */}
      <div className="flex-1 overflow-y-auto px-3">
        <div className="text-xs font-medium text-gray-500 uppercase tracking-wider px-3 py-2">
          Recent Chats
        </div>
        {chats.length === 0 ? (
          <div className="text-center py-8 text-gray-500 text-sm">
            No chats yet
          </div>
        ) : (
          chats.map((chat) => (
            <div
              key={chat.id}
              className={`group relative flex items-center rounded-xl mb-1 transition-all ${
                chatId === chat.id
                  ? 'bg-gray-800/80 border border-gray-700'
                  : 'hover:bg-gray-800/50'
              }`}
            >
              {editingChat === chat.id ? (
                <div className="flex-1 p-2">
                  <input
                    type="text"
                    value={editTitle}
                    onChange={(e) => setEditTitle(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') handleRename(chat.id);
                      if (e.key === 'Escape') setEditingChat(null);
                    }}
                    className="w-full bg-gray-700 text-white px-3 py-1.5 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    autoFocus
                  />
                </div>
              ) : (
                <button
                  onClick={() => navigate(`/chat/${chat.id}`)}
                  className="flex-1 flex items-center gap-3 px-3 py-2.5 text-left text-gray-300"
                >
                  <MessageSquare size={18} className="text-gray-500" />
                  <span className="truncate text-sm">{chat.title}</span>
                </button>
              )}

              <div className="relative" ref={menuOpen === chat.id ? menuRef : undefined}>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setMenuOpen(menuOpen === chat.id ? null : chat.id);
                  }}
                  className="p-2 text-gray-500 hover:text-white opacity-0 group-hover:opacity-100 transition-all"
                >
                  <MoreVertical size={16} />
                </button>

                {menuOpen === chat.id && (
                  <div className="absolute right-0 top-full mt-1 bg-gray-800 rounded-xl shadow-xl border border-gray-700 py-1 z-50 min-w-[140px]">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        startEditing(chat);
                      }}
                      className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-gray-300 hover:bg-gray-700/50 transition-colors"
                    >
                      <Pencil size={14} />
                      Rename
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(chat.id);
                      }}
                      className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-red-400 hover:bg-gray-700/50 transition-colors"
                    >
                      <Trash2 size={14} />
                      Delete
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {/* User Section */}
      <div className="p-4 border-t border-gray-800">
        <div className="flex items-center justify-between mb-3 px-1">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-gradient-to-br from-gray-600 to-gray-700 rounded-full flex items-center justify-center">
              <span className="text-white text-sm font-medium">
                {user?.username?.charAt(0)?.toUpperCase() || username?.charAt(0)?.toUpperCase() || 'U'}
              </span>
            </div>
            <span className="text-sm text-gray-300 truncate">{user?.username || username}</span>
          </div>
        </div>
        <button
          onClick={() => {
            logout();
            navigate('/');
          }}
          className="w-full flex items-center gap-3 px-3 py-2.5 text-gray-400 hover:text-white hover:bg-gray-800/50 rounded-xl transition-all text-sm"
        >
          <LogOut size={16} />
          Log out
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
