from pydantic import BaseModel, EmailStr
from datetime import datetime

class UserCreate(BaseModel):
    email: EmailStr
    password: str

class UserResponse(BaseModel):
    id: int
    email: EmailStr
    created_at: datetime

    class Config:
        from_attributes = True
    
class DocumentResponse(BaseModel):
    id: int
    filename: str
    upload_date: datetime
    owner_id: int

    class Config:
        from_attributes = True