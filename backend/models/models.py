from sqlalchemy import Boolean, Column, Integer, String, DateTime, Date, ForeignKey
from db.database import Base
from datetime import datetime

#=======================================
# Class User pour gérer les utilisateurs
#=======================================
class UserDB(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    full_name = Column(String(255))
    email = Column(String(100), unique=True, index=True)    
    user_type = Column(String(100), index=True, nullable=False)
    hashed_password = Column(String(255)) # On stocke le hash, pas le mot de passe clair
    date_created = Column(Date, nullable=False, default=datetime.now().date)
    date_updated = Column(Date, nullable=True)    


#========================================
# Class Book pour gérer les livres dans la bibliothèque
#========================================
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

    def __repr__(self):
        return f"{self.title} by {self.author}"


#========================================
# Class Borrow pour gérer les emprunts de livres par les étudiants
#========================================
class Borrow(Base):
    __tablename__ = "borrows"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"))
    book_id = Column(Integer, ForeignKey("books.id", ondelete="CASCADE"))
    borrow_date = Column(DateTime, index=True, nullable=False, default=datetime.now)
    return_date = Column(DateTime, nullable=True)
    is_returned = Column(Boolean, index=True, default=False)
    date_created = Column(Date, nullable=False, default=datetime.now().date)
    date_updated = Column(Date, nullable=True)