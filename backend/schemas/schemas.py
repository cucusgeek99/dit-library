from typing import Dict, List, Optional

from pydantic import BaseModel, EmailStr, Field
from datetime import date
from enum import Enum


#========================================
# Type de compte
#========================================
class TypeCompte(str, Enum):
    ETUDIANT = "Etudiant"
    PROFESSEUR = "Professeur"
    PERSONNEL_ADMINISTRATIF = "Personnel administratif"

class UserCreate(BaseModel):
    full_name: str
    email: EmailStr
    user_type: TypeCompte
    password: str    

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class UserOut(BaseModel):
    id: int
    full_name: str
    email: EmailStr
    user_type: TypeCompte

    class Config:
        from_attributes = True

#========================================
# Schema Book pour gérer les livres dans la bibliothèque
#=========================================
class BookSchema(BaseModel):
    title: str = Field(min_length = 1, max_length = 255)
    author: str | None = None
    published_year: int = Field(gt=0)
    isbn: str = Field(min_length = 5, max_length = 5)
    total_copies: int = Field(gt=0)
    is_available: bool
    cover_path: str | None = None
    date_created: date = Field(default_factory=date.today)
    date_updated: date | None = None
    class Config:
        from_attributes = True

class BookCreate(BaseModel):
    title:  str
    author: str
    isbn:   Optional[str] = None
    published_year: int = Field(gt=0)
    total_copies: int = Field(gt=0)
    is_available: bool = Field(default=True)
    cover_path: Optional[str] = None
    date_created: date = Field(default_factory=date.today)

class BookUpdate(BaseModel):
    title:  str
    author: str
    isbn:   Optional[str] = None
    published_year: int = Field(gt=0)
    total_copies: int = Field(gt=0)
    is_available: bool = Field(default=True)
    cover_path: Optional[str] = None
    date_updated: date = Field(default_factory=date.today)

#========================================
# Schema Borrow pour gérer les emprunts de livres par les étudiants
#========================================= 
class BorrowSchema(BaseModel):
    user_id: int
    book_id: int
    borrow_date: date
    return_date: date | None = None
    is_returned: bool = Field(default=False)
    date_created: date = Field(default_factory=date.today)
    date_updated: date | None = None

    class Config:
        from_attributes = True

class BorrowCreate(BaseModel):
    user_id: int
    book_id: int
    borrow_date: date
    date_created: date = Field(default_factory=date.today)

    class Config:
        from_attributes = True