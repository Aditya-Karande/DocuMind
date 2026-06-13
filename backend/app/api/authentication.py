from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from database.connection import get_db
from database.models import User
from services.hashing import Hash
from datetime import timedelta
from services.JWT_tokens import create_access_token, ACCESS_TOKEN_EXPIRE_MINUTES
from fastapi.security import OAuth2PasswordRequestForm

auth_router = APIRouter(prefix='/auth', tags=['Authentication'])

@auth_router.post('/login')
def login(req:OAuth2PasswordRequestForm = Depends(), db:Session = Depends(get_db)):
    user = db.query(User).filter(
        User.email == req.username
    ).first()

    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Invalid Credentials"
        )
    
    if not Hash.verify_password(req.password, user.password):
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Invalid Credentials"
        )
    
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub":user.email},
        expires_delta=access_token_expires 
    )

    return {"access_token":access_token, "token_type":"Bearer"}
