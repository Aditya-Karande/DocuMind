from fastapi import APIRouter,Depends,HTTPException,status
from sqlalchemy.orm import Session
from app.database.connection import get_db
from app.database.curd import create_user, delete_user,get_all_users, get_user
from app.models.schemas import UserCreate,UserShow
from app.services.hashing import Hash
from app.database.models import User
from app.services.oauth2 import get_current_user

user_router = APIRouter(prefix='/user',tags=['User'])


@user_router.post('/new',response_model=UserShow)
def create_new_user(req:UserCreate, db:Session = Depends(get_db)):

    hashed_password = Hash.hash_password(req.password)

    new_user = create_user(
        username=req.username,
        email=req.email,
        password=hashed_password,
        db=db
    )
    return new_user

@user_router.get('/me')
def get_me(get_current_user: User = Depends(get_current_user)):
    return {
        "id": get_current_user.id,
        "username": get_current_user.username,
        "email": get_current_user.email
    }

@user_router.delete('/{user_id}')
def remove_user(user_id:int, db:Session = Depends(get_db), get_current_user: User = Depends(get_current_user)):
    user = delete_user(
        user_id=user_id,
        db=db
    )
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User Not Found..."
        )
    
    return HTTPException(
        status_code=status.HTTP_200_OK,
        detail="User Deleted Successfully.."
    )

@user_router.get('/')
def fetch_all_users(db:Session = Depends(get_db),get_current_user: User = Depends(get_current_user)):
    return get_all_users(db)

@user_router.get('/{user_id}')
def fetch_one_user(db:Session = Depends(get_db), user_id=int,get_current_user: User = Depends(get_current_user)):
    user = get_user(
        user_id=user_id,
        db=db
    )

    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"User with id {user_id} not found in database..."
        )
    
    return user
