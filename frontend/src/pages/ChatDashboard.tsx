import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import { MessageSquare, FileText, Brain, Upload, Trash2, Loader2, Folder, Sparkles, Zap, ArrowRight, Check } from 'lucide-react';
import { Document } from '../types';
import * as api from '../services/api';

const ChatDashboard: React.FC = () => {
  const { chatId } = useParams<{ chatId: string }>();
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const fetchDocuments = useCallback(async () => {
    if (!chatId) return;
    try {
      const response = await api.getDocuments(chatId);
      setDocuments(response.data);
    } catch (error) {
      console.error('Failed to fetch documents:', error);
    }
    setLoading(false);
  }, [chatId]);

  useEffect(() => {
    if (chatId) {
      fetchDocuments();
    }
  }, [chatId, fetchDocuments]);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      await api.uploadDocument(chatId!, file);
      await fetchDocuments();
    } catch (error) {
      console.error('Failed to upload document:', error);
    }
    setUploading(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    const file = e.dataTransfer.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      await api.uploadDocument(chatId!, file);
      await fetchDocuments();
    } catch (error) {
      console.error('Failed to upload document:', error);
    }
    setUploading(false);
  };

  const handleDelete = async (docId: string) => {
    try {
      await api.deleteDocument(docId);
      setDocuments(documents.filter((d) => d.id !== docId));
    } catch (error) {
      console.error('Failed to delete document:', error);
    }
  };

  if (loading) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-center">
          <div className="relative w-20 h-20 mx-auto mb-6">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-cyan-400 rounded-2xl animate-pulse" />
            <div className="absolute inset-2 bg-gray-950 rounded-xl flex items-center justify-center">
              <Loader2 size={32} className="animate-spin text-blue-400" />
            </div>
          </div>
          <p className="text-gray-400">Loading workspace...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full overflow-y-auto">
      <div className="relative max-w-6xl mx-auto p-8">
        {/* Header */}
        <div className="mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-500/10 border border-blue-500/20 rounded-full text-blue-400 text-sm mb-6">
            <Zap size={14} />
            <span>Workspace Ready</span>
          </div>
          <h1 className="text-4xl lg:text-5xl font-bold text-white mb-4">
            Your Document
            <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent"> Workspace</span>
          </h1>
          <p className="text-gray-400 text-lg max-w-2xl">
            Upload documents and choose how you want to interact with them using AI-powered tools
          </p>
        </div>

        {/* Action Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <Link
            to={`/chat/${chatId}/ask`}
            className="group glass-card rounded-2xl p-8 hover:border-blue-500/50 transition-all duration-300"
          >
            <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mb-6 shadow-lg shadow-blue-500/30 group-hover:scale-110 transition-transform duration-300">
              <MessageSquare size={28} className="text-white" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-2 flex items-center gap-2">
              Chat with Documents
              <ArrowRight size={18} className="opacity-0 group-hover:opacity-100 transition-all transform translate-x-0 group-hover:translate-x-1" />
            </h3>
            <p className="text-gray-400 text-sm leading-relaxed">Ask questions in natural language and get instant answers with source citations</p>
          </Link>

          <Link
            to={`/chat/${chatId}/summary`}
            className="group glass-card rounded-2xl p-8 hover:border-green-500/50 transition-all duration-300"
          >
            <div className="w-14 h-14 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center mb-6 shadow-lg shadow-green-500/30 group-hover:scale-110 transition-transform duration-300">
              <FileText size={28} className="text-white" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-2 flex items-center gap-2">
              Generate Summary
              <ArrowRight size={18} className="opacity-0 group-hover:opacity-100 transition-all transform translate-x-0 group-hover:translate-x-1" />
            </h3>
            <p className="text-gray-400 text-sm leading-relaxed">Get a comprehensive overview of all your documents in seconds</p>
          </Link>

          <Link
            to={`/chat/${chatId}/quiz`}
            className="group glass-card rounded-2xl p-8 hover:border-purple-500/50 transition-all duration-300"
          >
            <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-violet-600 rounded-2xl flex items-center justify-center mb-6 shadow-lg shadow-purple-500/30 group-hover:scale-110 transition-transform duration-300">
              <Brain size={28} className="text-white" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-2 flex items-center gap-2">
              Create Quiz
              <ArrowRight size={18} className="opacity-0 group-hover:opacity-100 transition-all transform translate-x-0 group-hover:translate-x-1" />
            </h3>
            <p className="text-gray-400 text-sm leading-relaxed">Test your knowledge with AI-generated interactive quizzes</p>
          </Link>
        </div>

        {/* Documents Section */}
        <div className="relative">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-gray-700 to-gray-800 rounded-xl flex items-center justify-center">
                <Folder size={20} className="text-gray-400" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-white">Uploaded Documents</h2>
                <p className="text-sm text-gray-500">PDF, Word, PowerPoint, and text files</p>
              </div>
              {documents.length > 0 && (
                <span className="px-3 py-1 bg-blue-500/20 text-blue-400 text-sm font-medium rounded-full border border-blue-500/30">
                  {documents.length} file{documents.length !== 1 ? 's' : ''}
                </span>
              )}
            </div>
          </div>

          {/* Upload Area */}
          <div
            className={`relative border-2 border-dashed rounded-2xl p-8 text-center mb-6 transition-all ${
              dragActive
                ? 'border-blue-500 bg-blue-500/10 glass-card'
                : 'border-gray-700/50 hover:border-gray-600 bg-gray-900/30'
            }`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleUpload}
              accept=".pdf,.doc,.docx,.txt,.ppt,.pptx"
              className="hidden"
              id="file-upload"
            />
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <div className={`w-16 h-16 rounded-2xl flex items-center justify-center transition-all ${
                dragActive ? 'bg-blue-500/20' : 'bg-gray-800/50'
              }`}>
                <Upload size={28} className={dragActive ? 'text-blue-400' : 'text-gray-400'} />
              </div>
              <div className="text-center sm:text-left">
                <p className={`font-medium ${dragActive ? 'text-blue-400' : 'text-gray-200'}`}>
                  {dragActive ? 'Drop your file here' : 'Drag and drop your documents'}
                </p>
                <p className="text-sm text-gray-500 mt-1">
                  or <label htmlFor="file-upload" className="text-blue-400 hover:text-blue-300 cursor-pointer">browse files</label>
                </p>
              </div>
              {uploading && (
                <div className="flex items-center gap-2 text-gray-400">
                  <Loader2 size={20} className="animate-spin" />
                  <span>Uploading...</span>
                </div>
              )}
            </div>
          </div>

          {/* Documents List */}
          {documents.length === 0 ? (
            <div className="text-center py-16 glass-card rounded-2xl">
              <div className="w-20 h-20 bg-gray-800/50 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <FileText size={36} className="text-gray-600" />
              </div>
              <p className="text-lg font-medium text-gray-300 mb-2">No documents uploaded yet</p>
              <p className="text-sm text-gray-500 max-w-md mx-auto">
                Upload a document to unlock AI-powered chat, summaries, and quizzes
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {documents.map((doc) => (
                <div
                  key={doc.id}
                  className="group glass-card rounded-xl p-5 hover:border-gray-600 transition-all"
                >
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-gray-700 to-gray-800 rounded-xl flex items-center justify-center flex-shrink-0">
                      <FileText size={24} className="text-gray-400" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-white font-medium truncate">{doc.filename}</p>
                      {doc.uploaded_at && (
                        <p className="text-xs text-gray-500 mt-1">
                          Added {new Date(doc.uploaded_at).toLocaleDateString()}
                        </p>
                      )}
                    </div>
                    <button
                      onClick={() => handleDelete(doc.id)}
                      className="p-2 text-gray-600 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all opacity-0 group-hover:opacity-100"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChatDashboard;
