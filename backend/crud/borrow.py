from datetime import datetime
from fastapi import HTTPException
from sqlalchemy.exc import SQLAlchemyError
from sqlalchemy.orm import Session
from models.models import Borrow, UserDB, Book
from schemas.schemas import BorrowSchema, BorrowCreate

def create_borrow(db: Session, borrow: BorrowCreate) -> Borrow:
    try:
        user = db.query(UserDB).filter(UserDB.id == borrow.user_id).first()
        if not user:
            raise HTTPException(status_code=404, detail="Utilisateur introuvable")

        book = db.query(Book).filter(Book.id == borrow.book_id).first()
        if not book:
            raise HTTPException(status_code=404, detail="Livre introuvable")

        if book.total_copies <= 0 or book.is_available is False:
            raise HTTPException(status_code=400, detail="Ce livre est en rupture de stock")

        new_borrow = Borrow(
            user_id=borrow.user_id,
            book_id=borrow.book_id,
            borrow_date=borrow.borrow_date,
            date_created=borrow.date_created,
        )

        # Diminuer le stock
        book.total_copies -= 1
        if book.total_copies <= 0:
            book.total_copies = 0
            book.is_available = False
        else:
            book.is_available = True

        db.add(new_borrow)
        db.commit()
        db.refresh(new_borrow)
        return new_borrow

    except HTTPException:
        raise
    except SQLAlchemyError as e:
        db.rollback()
        raise HTTPException(
            status_code=500,
            detail=f"Erreur SQL lors de la création de l'emprunt : {str(e)}"
        )

def get_borrow(db: Session, borrow_id: int) -> Borrow:
    borrow = db.query(Borrow).filter(Borrow.id == borrow_id).first()
    if not borrow:
        return None
    return borrow

def get_borrows(db: Session) -> list[Borrow]:
    borrows = db.query(Borrow).order_by(Borrow.date_created).all()
    return borrows or []

def get_borrow_by_user_id(db: Session, user_id: int) -> list[Borrow]:
    borrows = (
        db.query(Borrow)
        .filter(Borrow.user_id == user_id)
        .order_by(Borrow.date_created)
        .all()
    )
    return borrows or []

def update_borrow(db: Session, borrow_id: int, borrow_data: BorrowSchema) -> Borrow:
    borrow = db.query(Borrow).filter(Borrow.id == borrow_id).first()
    if not borrow:
        return None

    borrow.user_id = borrow_data.user_id
    borrow.book_id = borrow_data.book_id
    borrow.borrow_date = borrow_data.borrow_date
    borrow.return_date = borrow_data.return_date
    borrow.is_returned = borrow_data.is_returned
    borrow.date_updated = borrow_data.date_updated

    db.commit()
    db.refresh(borrow)
    return borrow

def delete_borrow(db: Session, borrow_id: int) -> bool:
    borrow = db.query(Borrow).filter(Borrow.id == borrow_id).first()
    if not borrow:
        return False

    db.delete(borrow)
    db.commit()
    return True

def get_returned_borrows(db: Session) -> list[Borrow]:
    borrows = (
        db.query(Borrow)
        .filter(Borrow.is_returned == True)
        .order_by(Borrow.date_created)
        .all()
    )
    return borrows or []

def get_borrow_by_student_id(db: Session, student_id: int) -> list[Borrow]:
    borrows = (
        db.query(Borrow)
        .filter(Borrow.user_id == student_id)
        .order_by(Borrow.date_created)
        .all()
    )
    return borrows or []

def get_borrow_by_book_id(db: Session, book_id: int) -> list[Borrow]:
    borrows = (
        db.query(Borrow)
        .filter(Borrow.book_id == book_id)
        .order_by(Borrow.date_created)
        .all()
    )
    return borrows or []

def return_borrow(db: Session, book_id: int, std_id: int) -> Borrow:
    borrow = db.query(Borrow).filter(
        Borrow.book_id == book_id,
        Borrow.user_id == std_id,
        Borrow.is_returned == False
    ).first()

    if not borrow:
        return None

    book = db.query(Book).filter(Book.id == book_id).first()
    if not book:
        raise HTTPException(status_code=404, detail="Livre introuvable")

    borrow.is_returned = True
    borrow.return_date = datetime.today()
    borrow.date_updated = datetime.today().date()

    # Remettre le stock
    book.total_copies += 1
    book.is_available = True

    db.commit()
    db.refresh(borrow)
    return borrow