from sqlalchemy import Boolean, Column, Integer, String, DateTime, Date, ForeignKey
from db.database import Base
from datetime import datetime

#========================================
# Class Student pour gérer les étudiants dans la bibliothèque
#=========================================
class Student(Base):
    __tablename__ = "students"

    id = Column(Integer, primary_key=True, index=True)
    matriculation_number = Column(String(255), unique=True, index=True)
    name = Column(String(255), index=True)
    email = Column(String(255), unique=True, index=True)
    classe= Column(String(255), index=True, nullable=True)
    date_created = Column(Date, nullable=False, default=datetime.now().date)
    date_updated = Column(Date, nullable=True)


#========================================
# Class Book pour gérer les livres dans la bibliothèque
#=========================================
class Book(Base):
    __tablename__ = "books"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(255), index=True, nullable=False)
    author = Column(String(255), index=True, nullable=True, default="Auteur inconnu")
    published_year = Column(Integer, nullable=False, default=datetime.now().year)
    isbn = Column(String(255), unique=True, index=True, nullable=False)
    total_copies = Column(Integer, default=1)
    is_available = Column(Boolean, index=True, default=True)
    cover_path = Column(String(255), nullable=True) 
    date_created = Column(Date, nullable=False, default=datetime.now().date)
    date_updated = Column(Date, nullable=True)


#========================================
# Class Borrow pour gérer les emprunts de livres par les étudiants
#=========================================
class Borrow(Base):
    __tablename__ = "borrows"

    id = Column(Integer, primary_key=True, index=True)
    student_id = Column(Integer, ForeignKey("students.id", ondelete="CASCADE"))
    book_id = Column(Integer, ForeignKey("books.id", ondelete="CASCADE"))
    borrow_date = Column(DateTime, index=True, nullable=False, default=datetime.now)
    return_date = Column(DateTime, nullable=True)
    is_returned = Column(Boolean, index=True, default=False)
    date_created = Column(Date, nullable=False, default=datetime.now().date)
    date_updated = Column(Date, nullable=True)

    