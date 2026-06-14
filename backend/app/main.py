from fastapi import FastAPI
from app.api.upload_route import upload_router
from app.api.query_route import query_router
from app.api.chat_route import chat_router
from app.api.document_route import doc_router
from app.api.user_route import user_router
from app.api.authentication import auth_router
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  # Vite default port
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def root():
    return {"status": "ok"}

app.include_router(auth_router)
app.include_router(upload_router)
app.include_router(query_router)
app.include_router(chat_router)
app.include_router(doc_router)
app.include_router(user_router)