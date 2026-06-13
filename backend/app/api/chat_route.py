from fastapi import Depends, APIRouter
from sqlalchemy.orm import Session

from app.database.connection import get_db
from app.database.curd import create_chat, get_chat, get_all_chats, delete_chat, update_chat_name,get_chat_messages

from app.models.schemas import UpdateChatRequest

from app.database.models import User
from app.services.oauth2 import get_current_user

chat_router = APIRouter(prefix='/chat',tags=['Chat'])

@chat_router.post("/new")
def create_new_chat(title:str, db: Session = Depends(get_db),current_user: User = Depends(get_current_user)):
    chat = create_chat(
        title=title,
        db=db,
        path=f"vector_store/{title}",
        user_id=current_user.id
    )
    return chat

@chat_router.get("/")
def fetch_all_chats(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    return get_all_chats(db,user_id = current_user.id)

@chat_router.get("/{chat_id}")
def fetch_chat(chat_id:int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    chat = get_chat(
        chat_id=chat_id,
        db=db
    )

    if not chat:
        return {"error":"chat not found..."}
    
    return chat

@chat_router.put('/{chat_id}')
def rename_chat(chat_id:int,new_title:UpdateChatRequest ,db:Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    chat = update_chat_name(
        chat_id=chat_id,
        new_title=new_title.title,
        db=db
    )

    if not chat:
        return {"error":"chat not found..."}
    
    return {"msg":"Chat renamed successfully..."}

@chat_router.delete('/{chat_id}')
def remove_chat(chat_id:int, db:Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    chat = delete_chat(
        chat_id=chat_id,
        db= db
    )

    if not chat:
        return {"error":"chat not found..."}
    
    return {"msg":"chat deleted sucessfully.."}

@chat_router.get("/{chat_id}/messages")
def fetch_messages(chat_id:int,db:Session=Depends(get_db), current_user: User = Depends(get_current_user)):
    return get_chat_messages(chat_id=chat_id, db=db)