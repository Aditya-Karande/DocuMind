import axios from 'axios';

const API_BASE_URL = 'http://localhost:8000';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth APIs
export const login = (email: string, password: string) => {
  const formData = new FormData();
  formData.append('username', email);
  formData.append('password', password);
  return api.post('/auth/login', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};

export const register = (name: string, email: string, password: string) =>
  api.post('/user/new', { username: name, email, password });

// Chat APIs
export const getChats = () => api.get('/chat/');

export const createChat = (title: string) =>
  api.post(`/chat/new?title=${encodeURIComponent(title)}`);

export const updateChat = (chatId: string, title: string) =>
  api.put(`/chat/${chatId}`, { title });

export const deleteChat = (chatId: string) =>
  api.delete(`/chat/${chatId}`);

export const getChatMessages = (chatId: string) =>
  api.get(`/chat/${chatId}/messages`);

// Document APIs
export const getDocuments = (chatId: string) =>
  api.get(`/documents/${chatId}`);

export const uploadDocument = (chatId: string, file: File) => {
  const formData = new FormData();
  formData.append('file', file);
  return api.post(`/upload/upload_file/${chatId}`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};

export const deleteDocument = (docId: string) =>
  api.delete(`/documents/${docId}`);

// Query APIs
export const sendQuery = (chatId: string, req: string) =>
  api.post(`/query/query/${chatId}`, { req });

export const generateSummary = (chatId: string) =>
  api.post(`/query/summary/${chatId}`);

export const generateQuiz = (chatId: string, numQuestions: number) =>
  api.post(`/query/quiz/${chatId}`, { num_questions: numQuestions });

export const getMe = () => api.get('user/me')

export default api;
