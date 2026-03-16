from pydantic import BaseModel, Field
from datetime import date

#========================================
# Schema Classe pour gérer les classes de l"établissement
#=========================================
class ClasseSchema(BaseModel):
    name: str
    date_created: date = Field(default_factory=date.today)
    date_updated: date | None = None

    class Config:
        from_attributes = True

#========================================
# Schema Student pour gérer les étudiants dans la bibliothèque
#=========================================
class StudentSchema(BaseModel):
    matriculation_number: str
    name: str
    email: str
    classe_id: int
    date_created: date = Field(default_factory=date.today)
    date_updated: date | None = None

    class Config:
        from_attributes = True

#========================================
# Schema Book pour gérer les livres dans la bibliothèque
#=========================================
class BookSchema(BaseModel):
    title: str
    author: str | None = None
    published_year: int
    isbn: str
    total_copies: int
    is_available: bool
    cover_path: str | None = None
    date_created: date = Field(default_factory=date.today)
    date_updated: date | None = None
    class Config:
        from_attributes = True

#========================================
# Schema Borrow pour gérer les emprunts de livres par les étudiants
#========================================= 
class BorrowSchema(BaseModel):
    student_id: int
    book_id: int
    borrow_date: date
    return_date: date | None = None
    is_returned: bool
    date_created: date = Field(default_factory=date.today)
    date_updated: date | None = None

    class Config:
        from_attributes = True