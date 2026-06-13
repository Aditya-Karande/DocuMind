from pydantic import BaseModel, ConfigDict
from typing import Optional

class Query(BaseModel):
    req: str

class UpdateChatRequest(BaseModel):
    title:str

class UserCreate(BaseModel):
    username: str
    email: str
    password: str

class UserLogin(BaseModel):
    email: str
    password: str

class UserShow(BaseModel):
    username:str
    email:str
    model_config = ConfigDict(
        from_attributes=True
    )

class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    email: Optional[str] = None

class QuizRequest(BaseModel):
    num_questions: int = 5