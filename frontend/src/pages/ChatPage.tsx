import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Send, FileText, Bot, ArrowLeft, CornerDownLeft, Sparkles } from 'lucide-react';
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
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const fetchMessages = useCallback(async () => {
    if (!chatId) return;
    try {
      const response = await api.getChatMessages(chatId);
      setMessages(response.data.filter(
        (msg: Message) => msg.role === 'user' || msg.role === 'assistant'
      ));
    } catch (error) {
      console.error('Failed to fetch messages:', error);
    }
    setLoading(false);
  }, [chatId]);

  useEffect(() => {
    if (chatId) fetchMessages();
  }, [chatId, fetchMessages]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, sending]);

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
    setTimeout(() => inputRef.current?.focus(), 100);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  if (loading) {
    return (
      <div className="h-full flex items-center justify-center bg-gray-950">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-sm text-gray-500">Loading conversation...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col bg-gray-950">

      {/* Header - Fixed height */}
      <header className="flex-shrink-0 h-16 flex items-center justify-between px-6 border-b border-white/[0.06]">
        <Link
          to={`/chat/${chatId}`}
          className="flex items-center gap-2 text-gray-500 hover:text-gray-300 transition-colors"
        >
          <ArrowLeft size={18} />
          <span className="text-sm">Dashboard</span>
        </Link>
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 bg-gradient-to-br from-blue-500 to-cyan-400 rounded-lg flex items-center justify-center">
            <Sparkles size={12} className="text-white" />
          </div>
          <span className="text-sm font-medium text-gray-300">DocuMind</span>
        </div>
      </header>

      {/* Messages Area - Scrollable, takes remaining space */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-[960px] mx-auto px-6">

          {/* Empty state */}
          {messages.length === 0 ? (
            <div className="flex items-center justify-center py-20">
              <div className="text-center max-w-lg">
                <div className="w-20 h-20 bg-gradient-to-br from-blue-500/10 to-cyan-500/5 rounded-3xl flex items-center justify-center mx-auto mb-6 border border-blue-500/10">
                  <Bot size={36} className="text-blue-400/80" />
                </div>
                <h2 className="text-2xl font-semibold text-white mb-3">What would you like to know?</h2>
                <p className="text-gray-500 mb-10">Ask anything about your uploaded documents</p>
                <div className="space-y-3">
                  {[
                    'What are the main topics covered?',
                    'Summarize the key findings',
                    'What are the most important takeaways?',
                  ].map((q) => (
                    <button
                      key={q}
                      onClick={() => setInput(q)}
                      className="w-full text-left px-5 py-3.5 text-sm text-gray-400 hover:text-gray-200 hover:bg-white/[0.03] rounded-2xl border border-white/[0.06] transition-all hover:border-white/[0.1]"
                    >
                      {q}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            /* Messages */
            <div className="py-6">
              {messages.map((message, idx) => {
                const isUser = message.role === 'user';
                const showBranding = !isUser && (idx === 0 || messages[idx - 1]?.role === 'user');

                return (
                  <div key={message.id} className={isUser ? 'flex justify-end mb-6' : 'mb-6'}>
                    {isUser ? (
                      /* User message - right-aligned bubble */
                      <div className="max-w-[75%] bg-blue-600 rounded-2xl rounded-tr-sm px-5 py-3">
                        <p className="text-white text-[15px] leading-7 whitespace-pre-wrap">
                          {message.content}
                        </p>
                      </div>
                    ) : (
                      /* Assistant message - left aligned, full width */
                      <div className="w-full max-w-[85%]">
                        {showBranding && (
                          <div className="flex items-center gap-2 mb-2">
                            <div className="w-5 h-5 bg-gradient-to-br from-blue-500 to-cyan-400 rounded-md flex items-center justify-center">
                              <Sparkles size={10} className="text-white" />
                            </div>
                            <span className="text-xs font-medium text-gray-500">DocuMind</span>
                          </div>
                        )}
                        <div className="text-[15px] text-gray-300 leading-7">
                          <ReactMarkdown
                            remarkPlugins={[remarkGfm]}
                            components={{
                              p: ({ children }) => <p className="mb-4 last:mb-0">{children}</p>,
                              ul: ({ children }) => <ul className="mb-4 ml-5 space-y-1.5 list-disc list-outside">{children}</ul>,
                              ol: ({ children }) => <ol className="mb-4 ml-5 space-y-1.5 list-decimal list-outside">{children}</ol>,
                              li: ({ children }) => <li className="text-gray-300">{children}</li>,
                              h1: ({ children }) => <h1 className="text-2xl font-bold mb-4 text-white">{children}</h1>,
                              h2: ({ children }) => <h2 className="text-xl font-semibold mb-3 text-white">{children}</h2>,
                              h3: ({ children }) => <h3 className="text-lg font-semibold mb-2 text-gray-200">{children}</h3>,
                              strong: ({ children }) => <strong className="font-semibold text-white">{children}</strong>,
                              code: ({ children }) => (
                                <code className="bg-white/[0.06] px-1.5 py-0.5 rounded text-cyan-300/90 text-sm font-mono">
                                  {children}
                                </code>
                              ),
                              pre: ({ children }) => (
                                <pre className="bg-white/[0.03] rounded-xl p-4 mb-4 overflow-x-auto border border-white/[0.06]">
                                  {children}
                                </pre>
                              ),
                              a: ({ children, href }) => (
                                <a href={href} className="text-blue-400 hover:text-blue-300 underline" target="_blank" rel="noopener noreferrer">
                                  {children}
                                </a>
                              ),
                              blockquote: ({ children }) => (
                                <blockquote className="border-l-2 border-gray-700 pl-4 my-4 text-gray-400 italic">
                                  {children}
                                </blockquote>
                              ),
                            }}
                          >
                            {message.content}
                          </ReactMarkdown>
                        </div>

                        {/* Sources */}
                        {message.sources && message.sources.pdf && message.sources.pdf.length > 0 && (
                          <div className="mt-4 pt-3 border-t border-white/[0.06]">
                            <p className="text-[11px] text-gray-600 mb-2 uppercase tracking-wider font-medium">Sources</p>
                            <div className="flex flex-wrap gap-1.5">
                              {message.sources.pdf.map((source, idx) => (
                                <span
                                  key={`pdf-${idx}`}
                                  className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-white/[0.04] rounded-lg text-xs text-gray-500 border border-white/[0.06]"
                                >
                                  <FileText size={10} />
                                  {source.source} p.{source.page}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}

              {/* Typing indicator */}
              {sending && (
                <div className="mb-6">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-5 h-5 bg-gradient-to-br from-blue-500 to-cyan-400 rounded-md flex items-center justify-center">
                      <Sparkles size={10} className="text-white" />
                    </div>
                    <span className="text-xs font-medium text-gray-500">DocuMind</span>
                  </div>
                  <div className="flex items-center gap-1 py-2">
                    <div className="w-2 h-2 bg-gray-600 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                    <div className="w-2 h-2 bg-gray-600 rounded-full animate-bounce" style={{ animationDelay: '120ms' }} />
                    <div className="w-2 h-2 bg-gray-600 rounded-full animate-bounce" style={{ animationDelay: '240ms' }} />
                  </div>
                </div>
              )}

              {/* Scroll anchor */}
              <div ref={messagesEndRef} />
            </div>
          )}
        </div>
      </div>

      {/* Composer - Fixed height at bottom */}
      <div className="flex-shrink-0 px-6 py-4 border-t border-white/[0.06]">
        <div className="max-w-[960px] mx-auto">
          <div className="relative bg-gray-900/80 backdrop-blur-xl rounded-2xl border border-white/[0.08] transition-all focus-within:border-white/[0.15] focus-within:ring-1 focus-within:ring-blue-500/20">
            <div className="flex items-end gap-3 px-4 py-3">
              <textarea
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask anything about your documents..."
                rows={1}
                className="flex-1 bg-transparent text-white text-[15px] resize-none focus:outline-none placeholder:text-gray-600 max-h-40 leading-6"
                disabled={sending}
              />
              <button
                onClick={handleSend}
                disabled={sending || !input.trim()}
                className="mb-0.5 p-2 bg-white hover:bg-gray-200 disabled:bg-white/10 disabled:cursor-not-allowed text-gray-900 disabled:text-gray-600 rounded-xl transition-all flex-shrink-0"
              >
                <Send size={18} />
              </button>
            </div>
            <div className="px-4 pb-2 flex items-center justify-between">
              <p className="text-[11px] text-gray-600 flex items-center gap-1">
                <CornerDownLeft size={10} />
                Enter to send
              </p>
              <p className="text-[11px] text-gray-600">Shift+Enter for new line</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatPage;
