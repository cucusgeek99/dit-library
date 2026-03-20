from fastapi import HTTPException
from sqlalchemy import String
from sqlalchemy.orm import Session
from models.models import Book
from schemas.schemas import BookCreate, BookUpdate
from sqlalchemy.exc import IntegrityError

def get_books(db: Session):
    books = db.query(Book).order_by(Book.id).all()
    if not books:
        return None
    return books
    

def search_books(db: Session, q: str):
    q = q.strip()
    if not q:
        return []        
    
    books = db.query(Book).filter(
        Book.title.ilike(f'%{q}%') | Book.author.ilike(f'%{q}%') | Book.isbn.ilike(f'%{q}%') | 
        Book.published_year.cast(String).ilike(f'%{q}%') | Book.total_copies.cast(String).ilike(f'%{q}%') |
        Book.is_available.cast(String).ilike(f'%{q}%')
    ).all()

    if not books:
        return None    

    return books     


def get_book(db: Session, id: int):
    book = db.query(Book).filter(Book.id == id).first()    
    if not book:
        return None
    return book


def create_book(db: Session, data: BookCreate):
    try: 
        new_book = Book(
            title=data.title, 
            author=data.author, 
            isbn=data.isbn, 
            published_year=data.published_year, 
            total_copies=data.total_copies, 
            cover_path=data.cover_path,
            is_available=data.is_available,
            date_created=data.date_created
        )
        db.add(new_book)
        db.commit()
        db.refresh(new_book)
        return new_book
    except IntegrityError as e:
        db.rollback()
        raise HTTPException(status_code=400, detail="Ce livre (ISBN) existe déjà dans la base.")
    

def update_books(db: Session, id: int, data: BookUpdate):
    try:
        book = db.query(Book).filter(Book.id == id).first()
        if not book:
            return None

        if not data:
            return None
    
        for key, value in data.dict(exclude_unset=True).items():
            setattr(book, key, value)

        db.commit()
        db.refresh(book)
        return book
    except IntegrityError as e:
        db.rollback()
        raise HTTPException(status_code=400, detail="Données invalides")    


def delete_book(db: Session, id: int):
    book = get_book(db, id)
    if not book:
        return None
    try:
        db.delete(book)
        db.commit()
        return {"message": "Livre supprimé avec succès"}
    except IntegrityError as e:
        db.rollback()
        raise HTTPException(status_code=500, detail="Erreur lors de la suppression du livre")