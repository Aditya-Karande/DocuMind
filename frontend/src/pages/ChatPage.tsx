import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { Send, Loader2, FileText, Brain, Sparkles } from 'lucide-react';
import { User, Bot } from 'lucide-react';
import { Message } from '../types';
import * as api from '../services/api';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

const ChatPage: React.FC = () => {
  const { chatId } = useParams<{ chatId: string }>();
  const username = localStorage.getItem('username') || 'User';
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const fetchMessages = useCallback(async () => {
    if (!chatId) return;
    try {
      const response = await api.getChatMessages(chatId);
      console.log(response.data);
      setMessages(response.data.filter(
        (msg: Message) => msg.role === 'user' || msg.role === 'assistant'
      ));
    } catch (error) {
      console.error('Failed to fetch messages:', error);
    }
    setLoading(false);
  }, [chatId]);

  useEffect(() => {
    if (chatId) {
      fetchMessages();
    }
  }, [chatId, fetchMessages]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || sending) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      created_at: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setSending(true);

    try {
      const response = await api.sendQuery(chatId!, input);
      const { answer, sources } = response.data.output;

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: answer,
        sources,
        created_at: new Date().toISOString(),
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Failed to send message:', error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: 'Sorry, an error occurred while processing your request.',
        created_at: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    }
    setSending(false);
  };

  const renderMessage = (message: Message) => {
    if (message.role === 'summary') {
      return (
        <div key={message.id} className="w-full max-w-3xl mx-auto mb-6">
          <div className="bg-gradient-to-br from-green-500/10 to-emerald-500/5 rounded-2xl p-6 border border-green-500/20">
            <div className="flex items-center gap-2 mb-4 text-green-400">
              <FileText size={20} />
              <span className="font-medium">Summary</span>
            </div>
            <div className="text-gray-200 whitespace-pre-wrap leading-relaxed">{message.content}</div>
          </div>
        </div>
      );
    }

    if (message.role === 'quiz') {
      return (
        <div key={message.id} className="w-full max-w-3xl mx-auto mb-6">
          <div className="bg-gradient-to-br from-purple-500/10 to-violet-500/5 rounded-2xl p-6 border border-purple-500/20">
            <div className="flex items-center gap-2 mb-4 text-purple-400">
              <Brain size={20} />
              <span className="font-medium">Quiz</span>
            </div>
            <div className="text-gray-200 whitespace-pre-wrap leading-relaxed">{message.content}</div>
          </div>
        </div>
      );
    }

    const isUser = message.role === 'user';

    return (
      <div
  key={message.id}
  className={`flex items-start ${
    isUser ? 'justify-end gap-2 max-w-[60%] ml-auto' : 'justify-start gap-3'
  } mb-6`}
>
  {!isUser && (
    <div className="w-10 h-10 flex-shrink-0 bg-gradient-to-br from-blue-500 to-cyan-400 rounded-full flex items-center justify-center">
      <Bot size={20} className="text-white" />
    </div>
  )}

  <div
  className={`rounded-2xl px-5 py-4 ${
    isUser
      ? 'w-fit max-w-[50%] bg-gradient-to-r from-blue-600 to-cyan-500 text-white'
      : 'w-full max-w-[70%] bg-gray-700/80 text-gray-100 border border-gray-600/50'
  }`}
>
    {isUser ? (
  <p className="text-white text-sm">{message.content}</p>
) : (
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
          <div className="border-t border-gray-600 my-6" />
          <h2 className="text-2xl font-semibold mb-4 text-blue-300">
            📖 {children}
          </h2>
        </>
      ),

      h3: ({ children }) => (
        <h3 className="text-xl font-semibold mb-3 text-blue-300">
          💡 {children}
        </h3>
      ),

      p: ({ children }) => (
        <p className="leading-8 text-gray-200 mb-4">
          {children}
        </p>
      ),

      ul: ({ children }) => (
        <ul className="space-y-3 mb-4 ml-4">
          {children}
        </ul>
      ),

      li: ({ children }) => (
        <li className="mb-3 text-gray-200">
          {children}
        </li>
      ),

      strong: ({ children }) => (
        <strong className="font-semibold text-cyan-300">
          {children}
        </strong>
      ),
    }}
  >
    {message.content}
  </ReactMarkdown>
</div>
)}

    {message.sources && message.sources.pdf && (
      <div className="mt-4 pt-4 border-t border-gray-500/30">
        {/* citations */}
      </div>
    )}
  </div>

  {isUser && (
  <div className="w-10 h-10 flex-shrink-0 bg-gray-600 rounded-full flex items-center justify-center">
    <span className="text-white font-semibold">
      {username.charAt(0).toUpperCase()}
    </span>
  </div>
)}
</div>
    );
  };

  if (loading) {
    return (
      <div className="h-full flex items-center justify-center bg-gray-800">
        <div className="flex flex-col items-center gap-4">
          <Loader2 size={40} className="animate-spin text-blue-500" />
          <p className="text-gray-400">Loading conversation...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col bg-gray-800">
      {/* Header */}
      <div className="border-b border-gray-700/50 px-6 py-4">
        <div className="max-w-4xl mx-auto flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-cyan-400 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/20">
            <Sparkles size={20} className="text-white" />
          </div>
          <div>
            <h2 className="text-white font-medium">Document Chat</h2>
            <p className="text-xs text-gray-400">Ask questions about your uploaded documents</p>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-6">
        {messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-gray-400">
            <div className="w-20 h-20 bg-gray-700/50 rounded-2xl flex items-center justify-center mb-6">
              <MessageBubble size={40} className="opacity-50" />
            </div>
            <p className="text-xl font-medium text-gray-300 mb-2">No messages yet</p>
            <p className="text-sm">Start a conversation about your documents</p>
          </div>
        ) : (
          <div className="max-w-4xl mx-auto">
            {messages.map(renderMessage)}
            <div ref={messagesEndRef} />
          </div>
        )}
        {sending && (
          <div className="flex justify-start mb-6">
            <div className="bg-gray-700/80 rounded-2xl px-5 py-4 border border-gray-600/50">
              <div className="flex items-center gap-3 text-gray-400">
                <Loader2 size={18} className="animate-spin" />
                <span className="text-sm">Thinking...</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Input */}
      <div className="border-t border-gray-700/50 p-6">
        <div className="max-w-4xl mx-auto">
          <div className="flex gap-4">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSend();
                }
              }}
              placeholder="Ask a question about your documents..."
              className="flex-1 bg-gray-700/50 text-white px-5 py-4 rounded-xl border border-gray-600/50 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 transition-all placeholder:text-gray-500"
              disabled={sending}
            />
            <button
              onClick={handleSend}
              disabled={sending || !input.trim()}
              className="px-6 py-4 bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-blue-500/20 hover:shadow-blue-500/30"
            >
              <Send size={20} />
            </button>
          </div>
          <p className="text-xs text-gray-500 mt-3 text-center">
            Press Enter to send • Documents are analyzed securely
          </p>
        </div>
      </div>
    </div>
  );
};

const MessageBubble = ({ size, className }: { size: number; className?: string }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
  </svg>
);

export default ChatPage;
