from fastapi import FastAPI
from api.upload_route import upload_router
from api.query_route import query_router
from api.chat_route import chat_router
from api.document_route import doc_router
from api.user_route import user_router
from api.authentication import auth_router
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  # Vite default port
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth_router)
app.include_router(upload_router)
app.include_router(query_router)
app.include_router(chat_router)
app.include_router(doc_router)
app.include_router(user_router)