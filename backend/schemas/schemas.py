from typing import Dict, List, Optional

from pydantic import BaseModel, Field
from datetime import date
from enum import Enum

#========================================
# Enum StudentClass pour gérer les classes de l"établissement
#=========================================
class StudentClass(str, Enum):
    L1_BIG_DATA = "Licence 1 BIG DATA"
    L2_BIG_DATA = "Licence 2 BIG DATA"
    L3_BIG_DATA = "Licence 3 BIG DATA"
    M1_IA = "Master 1 IA"
    M2_IA = "Master 2 IA"
    M1_FD = "Master 1 FD"
    M2_FD = "Master 2 FD"

#========================================
# Schema Student pour gérer les étudiants dans la bibliothèque
#=========================================
# Schéma de base (champs communs)
class StudentBase(BaseModel):
    matriculation_number: str = Field(min_length=1)
    name: str = Field(min_length=2, max_length=255)
    email: str = Field(pattern=r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$')
    classe: StudentClass

class StudentSchema(StudentBase):    
    date_created: date = Field(default_factory=date.today)
    date_updated: date | None = None

    class Config:
        from_attributes = True

# Schéma pour la CRÉATION (L'utilisateur ne voit/remplit pas l'ID)
class StudentCreate(StudentBase):
    date_created: date = Field(default_factory=date.today)

class StudentUpdate(StudentBase):
    date_updated: date = Field(default_factory=date.today)

# Schéma pour la LECTURE (L'API retourne l'ID généré par la DB)
# class StudentRead(StudentBase):
#     id: int # On l'ajoute ici uniquement pour le retour
#     date_created: date
#     date_updated: date | None = None

#     class Config:
#         from_attributes = True

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
    student_id: int
    book_id: int
    borrow_date: date
    return_date: date | None = None
    is_returned: bool = Field(default=False)
    date_created: date = Field(default_factory=date.today)
    date_updated: date | None = None

    class Config:
        from_attributes = True

class BorrowCreate(BaseModel):
    student_id: int
    book_id: int
    borrow_date: date
    date_created: date = Field(default_factory=date.today)

    class Config:
        from_attributes = True

#==========================================
# Schema pour les statistiques
#==========================================
class DashboardStats(BaseModel):
    total_students: int
    total_books: int
    active_borrows: int
    available_books: int
    borrows_by_class: List[Dict[str, int]]
    top_books: List[Dict[str, int]]

    class Config:
        from_attributes = True