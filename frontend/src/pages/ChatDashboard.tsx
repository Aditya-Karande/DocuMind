import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import { MessageSquare, FileText, Brain, Upload, Trash2, Loader2, Folder } from 'lucide-react';
import { Document } from '../types';
import * as api from '../services/api';

const ChatDashboard: React.FC = () => {
  const { chatId } = useParams<{ chatId: string }>();
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
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
      <div className="h-full flex items-center justify-center bg-gray-800">
        <div className="flex flex-col items-center gap-4">
          <Loader2 size={40} className="animate-spin text-blue-500" />
          <p className="text-gray-400">Loading workspace...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full bg-gray-800 overflow-y-auto">
      <div className="max-w-5xl mx-auto p-8">
        {/* Header */}
        <div className="mb-10">
          <h1 className="text-3xl font-bold text-white mb-2">Workspace Dashboard</h1>
          <p className="text-gray-400">
            Upload documents and choose how you want to interact with them
          </p>
        </div>

        {/* Action Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <Link
            to={`/chat/${chatId}/ask`}
            className="group relative overflow-hidden bg-gray-900 rounded-2xl p-6 border border-gray-700/50 hover:border-blue-500/50 transition-all hover:shadow-xl hover:shadow-blue-500/10"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="relative">
              <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center mb-5 shadow-lg shadow-blue-500/25 group-hover:scale-110 transition-transform">
                <MessageSquare size={28} className="text-white" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">Chat with Documents</h3>
              <p className="text-gray-400 text-sm">Ask questions and get instant answers with source citations</p>
            </div>
          </Link>

          <Link
            to={`/chat/${chatId}/summary`}
            className="group relative overflow-hidden bg-gray-900 rounded-2xl p-6 border border-gray-700/50 hover:border-green-500/50 transition-all hover:shadow-xl hover:shadow-green-500/10"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-green-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="relative">
              <div className="w-14 h-14 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center mb-5 shadow-lg shadow-green-500/25 group-hover:scale-110 transition-transform">
                <FileText size={28} className="text-white" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">Generate Summary</h3>
              <p className="text-gray-400 text-sm">Get a comprehensive overview of your documents</p>
            </div>
          </Link>

          <Link
            to={`/chat/${chatId}/quiz`}
            className="group relative overflow-hidden bg-gray-900 rounded-2xl p-6 border border-gray-700/50 hover:border-purple-500/50 transition-all hover:shadow-xl hover:shadow-purple-500/10"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="relative">
              <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-violet-600 rounded-xl flex items-center justify-center mb-5 shadow-lg shadow-purple-500/25 group-hover:scale-110 transition-transform">
                <Brain size={28} className="text-white" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">Generate Quiz</h3>
              <p className="text-gray-400 text-sm">Test your knowledge with interactive quizzes</p>
            </div>
          </Link>
        </div>

        {/* Documents Section */}
        <div className="bg-gray-900/50 rounded-2xl border border-gray-700/50 p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <Folder size={24} className="text-gray-400" />
              <h2 className="text-xl font-semibold text-white">Uploaded Documents</h2>
              {documents.length > 0 && (
                <span className="px-2.5 py-0.5 bg-gray-700 text-gray-300 text-sm rounded-full">
                  {documents.length}
                </span>
              )}
            </div>
            <label className="cursor-pointer">
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleUpload}
                accept=".pdf,.doc,.docx,.txt,.ppt,.pptx"
                className="hidden"
              />
              <div className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white rounded-xl transition-all shadow-lg shadow-blue-500/20 hover:shadow-blue-500/30">
                {uploading ? (
                  <>
                    <Loader2 size={18} className="animate-spin" />
                    Uploading...
                  </>
                ) : (
                  <>
                    <Upload size={18} />
                    Upload Document
                  </>
                )}
              </div>
            </label>
          </div>

          {documents.length === 0 ? (
            <div className="text-center py-12 text-gray-400">
              <div className="w-20 h-20 bg-gray-800 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <FileText size={36} className="text-gray-600" />
              </div>
              <p className="text-lg font-medium text-gray-300 mb-1">No documents uploaded yet</p>
              <p className="text-sm">Upload a document to get started with AI-powered analysis</p>
            </div>
          ) : (
            <div className="space-y-3">
              {documents.map((doc) => (
                <div
                  key={doc.id}
                  className="flex items-center justify-between bg-gray-800/50 rounded-xl p-4 border border-gray-700/50 hover:border-gray-600 transition-all group"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gray-700 rounded-xl flex items-center justify-center">
                      <FileText size={24} className="text-gray-400" />
                    </div>
                    <div>
                      <p className="text-gray-200 font-medium">{doc.filename}</p>
                      {doc.uploaded_at && (
                        <p className="text-xs text-gray-500">
                          Added {new Date(doc.uploaded_at).toLocaleDateString()}
                        </p>
                      )}
                    </div>
                  </div>
                  <button
                    onClick={() => handleDelete(doc.id)}
                    className="p-2.5 text-gray-500 hover:text-red-400 hover:bg-red-500/10 opacity-0 group-hover:opacity-100 transition-all rounded-lg"
                  >
                    <Trash2 size={18} />
                  </button>
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
