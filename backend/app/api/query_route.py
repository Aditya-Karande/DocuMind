from fastapi import APIRouter, Depends
from app.models.schemas import Query, QuizRequest
from sqlalchemy.orm import Session
from app.database.connection import get_db
from app.database.curd import create_message
from app.database.models import User
from app.services.oauth2 import get_current_user
import json

query_router = APIRouter(prefix="/query", tags=['Query'])

@query_router.post('/query/{chat_id}')
def user_query(chat_id:int, req:Query,db:Session = Depends(get_db),get_current_user: User = Depends(get_current_user)):

    from app.services.rag_pipeline import generate_output

    #save users message
    create_message(
        chat_id=chat_id,
        role="user",
        content=req.req,
        db=db
    )
    

    res = generate_output(query=req.req,db=db,chat_id=chat_id)

    #save assistants message
    create_message(
        chat_id=chat_id,
        role="assistant",
        content=res["answer"],
        db=db
    )

    return {
        "output":res
    }

@query_router.post('/summary/{chat_id}')
def create_summary(chat_id: int, db:Session = Depends(get_db),get_current_user: User = Depends(get_current_user)):

    from app.services.rag_pipeline import generate_summary
    
    response = generate_summary(db=db, chat_id=chat_id)

    #save assistants message as "Summary"
    create_message(
        chat_id=chat_id,
        role="summary",
        content=response,
        db=db
    )

    return {"summary": response}

@query_router.post('/quiz/{chat_id}')
def create_quiz(chat_id: int, req:QuizRequest, db:Session = Depends(get_db),get_current_user: User = Depends(get_current_user)):

    from app.services.rag_pipeline import generate_quiz
    
    response = generate_quiz(db=db, chat_id=chat_id, num_questions=req.num_questions)

    #save assistants message as "Quiz"
    create_message(
        chat_id=chat_id,
        role="quiz",
        content=json.dumps(response),
        db=db
    )    

    return {"quiz": response}