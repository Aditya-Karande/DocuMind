import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Plus, MessageSquare, MoreVertical, Trash2, Pencil, LogOut, Brain, Sparkles, Menu, X } from 'lucide-react';
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
  const [mobileOpen, setMobileOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const { chatId } = useParams();
  const { logout, user } = useAuth();

  const storedUser = localStorage.getItem('user');
  const username = storedUser ? (JSON.parse(storedUser).name || 'User') : 'User';

  useEffect(() => {
    fetchChats();
  }, [chatId]);

  // Close sidebar on route change (mobile)
  useEffect(() => {
    setMobileOpen(false);
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
      if (String(chatId) === String(id)) navigate('/new');
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

  const sidebarContent = (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      {/* Logo */}
      <div style={{ padding: '20px 20px 16px', borderBottom: '1px solid rgba(255,255,255,0.07)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 40, height: 40, background: 'linear-gradient(135deg, #3864ff, #6ee7f7)', borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 0 16px rgba(56,100,255,0.3)' }}>
            <Brain size={20} className="text-white" />
          </div>
          <div>
            <span style={{ fontSize: 17, fontWeight: 700, color: '#fff' }}>DocuMind</span>
            <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.35)', marginTop: 1 }}>AI Document Intelligence</p>
          </div>
        </div>
        {/* Close button — mobile only */}
        <button onClick={() => setMobileOpen(false)} style={{ display: 'none', background: 'none', border: 'none', color: 'rgba(255,255,255,0.4)', cursor: 'pointer', padding: 4 }} className="sidebar-close-btn">
          <X size={20} />
        </button>
      </div>

      {/* New Chat Button */}
      <div style={{ padding: '14px 14px 8px' }}>
        <button
          onClick={() => { onNewChat(); setMobileOpen(false); }}
          className="w-full group flex items-center justify-center gap-3 px-5 py-4 bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 rounded-xl transition-all text-white font-semibold shadow-xl shadow-blue-500/25 hover:shadow-blue-500/40"
        >
          <Plus size={18} />
          New Workspace
          <Sparkles size={14} className="opacity-60" />
        </button>
      </div>

      {/* Chats List */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '0 10px' }}>
        <div style={{ fontSize: 11, fontWeight: 600, color: 'rgba(255,255,255,0.3)', textTransform: 'uppercase', letterSpacing: '0.8px', padding: '10px 12px 8px', display: 'flex', alignItems: 'center', gap: 6 }}>
          <MessageSquare size={11} /> Recent Workspaces
        </div>
        {chats.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px 16px' }}>
            <div style={{ width: 48, height: 48, background: 'rgba(255,255,255,0.04)', borderRadius: 14, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 12px' }}>
              <MessageSquare size={22} color="rgba(255,255,255,0.2)" />
            </div>
            <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.3)' }}>No workspaces yet</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {chats.map((chat) => (
              <div key={chat.id} className={`group relative rounded-xl transition-all ${chatId === chat.id ? 'bg-gradient-to-r from-blue-600/20 to-cyan-600/10 border border-blue-500/30' : 'hover:bg-gray-800/50 border border-transparent'}`}>
                {editingChat === chat.id ? (
                  <div style={{ padding: 8 }}>
                    <input
                      type="text"
                      value={editTitle}
                      onChange={(e) => setEditTitle(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') handleRename(chat.id);
                        if (e.key === 'Escape') setEditingChat(null);
                      }}
                      className="w-full bg-gray-800 text-white px-3 py-2 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 border border-gray-700"
                      autoFocus
                    />
                  </div>
                ) : (
                  <button onClick={() => navigate(`/chat/${chat.id}`)} className="w-full flex items-center gap-3 px-3 py-3 text-left">
                    <div className={`w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 ${chatId === chat.id ? 'bg-blue-500/30 text-blue-400' : 'bg-gray-800 text-gray-500'}`}>
                      <MessageSquare size={14} />
                    </div>
                    <span className={`truncate text-sm flex-1 ${chatId === chat.id ? 'text-white' : 'text-gray-400'}`}>{chat.title}</span>
                  </button>
                )}
                <div className="absolute right-2 top-1/2 -translate-y-1/2" ref={menuOpen === chat.id ? menuRef : undefined}>
                  <button
                    onClick={(e) => { e.stopPropagation(); setMenuOpen(menuOpen === chat.id ? null : chat.id); }}
                    className={`p-1.5 rounded-lg transition-all ${chatId === chat.id ? 'text-gray-400 hover:text-white hover:bg-white/10' : 'text-gray-600 hover:text-white hover:bg-gray-700'} opacity-0 group-hover:opacity-100`}
                  >
                    <MoreVertical size={15} />
                  </button>
                  {menuOpen === chat.id && (
                    <div className="absolute right-0 top-full mt-1 glass-card rounded-xl shadow-2xl py-1.5 z-50 min-w-[150px]">
                      <button onClick={(e) => { e.stopPropagation(); startEditing(chat); }} className="w-full flex items-center gap-2 px-3 py-2 text-sm text-gray-300 hover:bg-gray-700/50 hover:text-white transition-colors">
                        <Pencil size={13} /> Rename
                      </button>
                      <div className="my-1 border-t border-gray-700/50" />
                      <button onClick={(e) => { e.stopPropagation(); handleDelete(chat.id); }} className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-400 hover:bg-red-500/10 transition-colors">
                        <Trash2 size={13} /> Delete
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
      <div style={{ borderTop: '1px solid rgba(255,255,255,0.07)', padding: '12px 14px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10, padding: '10px 12px', borderRadius: 12, background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
          <div style={{ width: 34, height: 34, background: 'linear-gradient(135deg, #3864ff, #6ee7f7)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <span style={{ color: '#fff', fontSize: 13, fontWeight: 700 }}>
              {(user?.name || username)?.charAt(0)?.toUpperCase() || 'U'}
            </span>
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <p style={{ fontSize: 13, fontWeight: 500, color: '#fff', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{user?.name || username}</p>
            <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.3)' }}>Pro Member</p>
          </div>
        </div>
        <button
          onClick={() => { logout(); navigate('/'); }}
          className="w-full flex items-center justify-center gap-2 px-4 py-2.5 text-gray-400 hover:text-white hover:bg-gray-800/50 rounded-xl transition-all text-sm border border-gray-800/50 hover:border-gray-700"
        >
          <LogOut size={15} /> Sign Out
        </button>
      </div>
    </div>
  );

  return (
    <>
      <style>{`
        @media (max-width: 768px) {
          .sidebar-desktop { display: none !important; }
          .sidebar-mobile-trigger { display: flex !important; }
          .sidebar-close-btn { display: flex !important; }
        }
        @media (min-width: 769px) {
          .sidebar-mobile-overlay { display: none !important; }
          .sidebar-mobile-trigger { display: none !important; }
        }
      `}</style>

      {/* Desktop sidebar */}
      <div className="sidebar-desktop" style={{ width: 280, height: '100%', background: 'rgba(8,12,20,0.95)', borderRight: '1px solid rgba(255,255,255,0.07)', flexShrink: 0 }}>
        {sidebarContent}
      </div>

      {/* Mobile hamburger trigger */}
      <button
        className="sidebar-mobile-trigger"
        onClick={() => setMobileOpen(true)}
        style={{ display: 'none', position: 'fixed', top: 14, left: 14, zIndex: 100, width: 40, height: 40, borderRadius: 10, background: 'rgba(56,100,255,0.15)', border: '1px solid rgba(56,100,255,0.3)', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
      >
        <Menu size={20} color="#7aa4ff" />
      </button>

      {/* Mobile overlay + drawer */}
      {mobileOpen && (
        <div className="sidebar-mobile-overlay" style={{ position: 'fixed', inset: 0, zIndex: 200 }}>
          {/* Backdrop */}
          <div onClick={() => setMobileOpen(false)} style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)' }} />
          {/* Drawer */}
          <div style={{ position: 'absolute', top: 0, left: 0, bottom: 0, width: 300, background: '#0a0f1e', borderRight: '1px solid rgba(255,255,255,0.08)', overflowY: 'auto' }}>
            {sidebarContent}
          </div>
        </div>
      )}
    </>
  );
};

export default Sidebar;