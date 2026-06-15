from fastapi import APIRouter, Depends, HTTPException
from app.database.curd import get_document,get_one_document, delete_document
from sqlalchemy.orm import Session
from app.database.connection import get_db
from app.services.vector_store import VectorStoreManager
import os
from app.database.models import User
from app.services.oauth2 import get_current_user
from app.services.qdrant_store import QdrantStore
from app.services.cloudinary_service import delete_file_from_cloudinary

doc_router = APIRouter(prefix='/documents', tags=['Documents'])

@doc_router.get('/{chat_id}')
def fetch_document(chat_id:int ,db:Session = Depends(get_db), get_current_user: User = Depends(get_current_user)):
    return get_document(
        chat_id=chat_id,
        db=db
    )

@doc_router.delete('/{doc_id}')
def delete_document_db(doc_id:int,db:Session = Depends(get_db), get_current_user: User = Depends(get_current_user)):
    
    doc = get_one_document(
        db=db,
        doc_id=doc_id
    )

    if not doc :
        raise HTTPException(
            status_code=404,
            detail="Document not found"
        )
    
    qdrant_store = QdrantStore()

    qdrant_store.delete_document(doc.id)

    delete_file_from_cloudinary(
        doc.cloudinary_public_id
    )
    
    if os.path.exists(doc.file_path):
        os.remove(doc.file_path)
    
    delete_document(
        db=db,
        document=doc
    )

    return {
        "message":"Document deleted Successfully..."
    }