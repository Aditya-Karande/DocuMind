export interface User {
  id: string;
  name: string;
  email: string;
}

export interface Chat {
  id: string;
  title: string;
  created_at: string;
}

export interface Message {
  id: string;
  role: 'user' | 'assistant' | 'summary' | 'quiz';
  content: string;
  sources?: {
    pdf: Array<{ source: string; page: number }>;
    web?: Array<{ url: string; title?: string }>;
  };
  created_at: string;
}

export interface Document {
  id: string;
  filename: string;
  uploaded_at: string;
}

export interface QuizQuestion {
  question: string;
  options: string[];
  correct_answer: number;
}

export interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
  loading: boolean;
}
