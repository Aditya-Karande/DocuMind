# 🧠 DocuMind - AI Powered Document Intelligence Platform

> A RAG-based multi-document assistant that enables users to upload PDFs, DOCX, PPTX, and image-based documents, ask questions, generate summaries, create quizzes, and receive citation-supported answers using modern AI technologies.

![Architecture](screenshots/DocuMind_architecture.jpg)

---

## 🚀 Features

### 📄 Multi-Document Upload
- Upload multiple documents into a workspace.
- Supports:
  - PDF
  - DOCX
  - PPTX
  - Images

### 🔍 Intelligent Document Search
- Ask natural language questions about uploaded documents.
- Semantic search using vector embeddings.
- Retrieves only the most relevant chunks.

### 🧠 Retrieval-Augmented Generation (RAG)
- Context-aware question answering.
- Uses retrieved document chunks to generate accurate responses.
- Reduces hallucinations by grounding answers in source documents.

### 📚 Source Citations
- Displays document references used to generate answers.
- Helps users verify information directly from source documents.

### 📝 AI Summary Generation
- Generates structured markdown summaries.
- Covers all important topics and key concepts.
- Student-friendly format.

### 🎯 Quiz Generation
- Automatically creates multiple-choice questions from uploaded documents.
- Useful for revision and self-assessment.

### 💬 Conversation Memory
- Maintains chat history for each workspace.
- Context-aware conversations.

### 🔐 Authentication & Authorization
- User Signup/Login
- JWT Authentication
- Protected API Routes
- User-specific workspaces and chat history

### 🖼 OCR Support
- Extracts text from:
  - Scanned PDFs
  - Images
  - Handwritten notes
- Powered by EasyOCR.

---

# 🏗 Architecture

The system follows a layered architecture:

```text
Frontend (React + TypeScript)
        │
        ▼
Backend (FastAPI)
        │
 ┌──────┼──────┐
 ▼      ▼      ▼
PostgreSQL  File Storage  ChromaDB
                │
                ▼
       Document Processing
      (OCR → Extraction → Chunking)
                │
                ▼
       Sentence Transformers
                │
                ▼
           ChromaDB
                │
                ▼
         Retriever
                │
                ▼
       Prompt Builder
                │
                ▼
      Groq Llama 3.3 70B
                │
                ▼
     Answer + Citations
```

---

# ⚙️ Tech Stack

## Frontend

- React
- TypeScript
- Tailwind CSS
- React Router
- Axios
- React Markdown

## Backend

- FastAPI
- SQLAlchemy
- Alembic
- JWT Authentication
- Pydantic

## AI / RAG Stack

- LangChain
- RecursiveCharacterTextSplitter
- Sentence Transformers
- ChromaDB
- Groq API
- Llama 3.3 70B Versatile

## OCR & Document Processing

- EasyOCR
- PyMuPDF
- pdf2image
- docx2txt
- python-pptx
- unstructured

## Database

- PostgreSQL

---

# 🔄 RAG Pipeline

```text
User Query
     │
     ▼
Conversation History
     │
     ▼
Retriever
     │
     ▼
ChromaDB
     │
     ▼
Relevant Chunks
     │
     ▼
Citation Generator
     │
     ▼
Prompt Builder
     │
     ▼
Groq Llama 3.3 70B
     │
     ▼
Answer + Citations
```

---

# 📦 Document Processing Pipeline

```text
PDF / DOCX / PPTX / Images
            │
            ▼
       OCR (EasyOCR)
            │
            ▼
      Text Extraction
            │
            ▼
          Chunking
            │
            ▼
Sentence Transformers
            │
            ▼
         ChromaDB
```

---

# 📸 Screenshots

## Homepage

![Homepage](screenshots/DocuMind_homepage.png)

---

## Sign Up

![Signup](screenshots/DocuMind_signup.png)

---

## Sign In

![Signin](screenshots/DocuMind_signin.png)

---

## Dashboard

![Dashboard](screenshots/DocuMind_dashboard.png)

---

## New Workspace

![New Chat](screenshots/DocuMind_new_chat.png)

---

## Document Query

![Query](screenshots/DocuMind_query.png)

---

## Summary Generation

![Summary](screenshots/DocuMind_summary.png)

---

## Quiz Generation

![Quiz](screenshots/DocuMind_quiz.png)

---

## System Architecture

![Architecture](screenshots/DocuMind_architecture.jpeg)

---

# 🗂 Project Structure

```text
DocuMind/
│
├── backend/
│   ├── app/
│   ├── rag_env/
│   └── requirements.txt
│
├── frontend/
│   ├── src/
│   ├── public/
│   └── package.json
│
├── screenshots/
│   ├── DocuMind_homepage.png
│   ├── DocuMind_signup.png
│   ├── DocuMind_signin.png
│   ├── DocuMind_dashboard.png
│   ├── DocuMind_new_chat.png
│   ├── DocuMind_query.png
│   ├── DocuMind_summary.png
│   ├── DocuMind_quiz.png
│   └── DocuMind_architecture.jpeg
│
├── demo/
│   └── DocuMind_demo.mp4
│
└── README.md
```

---

# 🛠 Installation

## Clone Repository

```bash
git clone https://github.com/Aditya-Karande/DocuMind.git

cd DocuMind
```

---

## Backend Setup

```bash
cd backend

python -m venv rag_env

rag_env\Scripts\activate

pip install -r requirements.txt
```

### Configure Environment Variables

Create a `.env` file:

```env
GROQ_API_KEY=your_groq_api_key

DATABASE_URL=your_postgresql_url

SECRET_KEY=your_secret_key
```

---

### Run Backend

```bash
cd app

uvicorn main:app --reload
```

Backend:

```text
http://localhost:8000
```

Swagger Docs:

```text
http://localhost:8000/docs
```

---

## Frontend Setup

```bash
cd frontend

npm install

npm run dev
```

Frontend:

```text
http://localhost:5173
```

---

# 🔐 Authentication Flow

```text
User Signup
      │
      ▼
User Login
      │
      ▼
JWT Token Generation
      │
      ▼
Protected Routes
```

---

# 🌟 Future Improvements

- Web Search Integration
- Multi-Modal RAG
- PDF Annotation Support
- Team Workspaces
- Document Sharing
- Hybrid Search (Keyword + Semantic)
- Streaming Responses
- Voice-Based Queries
- Advanced Analytics Dashboard

---

# 👨‍💻 Author

**Aditya Karande**

AI / Data Science Engineering Student

Built with:
- React
- FastAPI
- PostgreSQL
- ChromaDB
- Sentence Transformers
- Groq Llama 3.3 70B

---

# ⭐ Support

If you found this project useful, consider giving it a star on GitHub.

⭐ Star the repository
🍴 Fork the repository
📢 Share it with others