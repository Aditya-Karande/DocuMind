from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from app.services.JWT_tokens import verify_token
from sqlalchemy.orm import Session
from app.database.connection import get_db
from app.database.models import User

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/auth/login")

def get_current_user(token: str = Depends(oauth2_scheme),db:Session = Depends(get_db)):
    credential_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials..",
        headers={"WWW-Authenticate":"Bearer"}
    )

    token_data = verify_token(token=token, credential_exception=credential_exception)

    user = db.query(User).filter(
        User.email == token_data.email
    ).first()

    if user is None:
        raise credential_exception
    
    return user