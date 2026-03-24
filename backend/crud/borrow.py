from datetime import datetime

from sqlalchemy.orm import Session
from models.models import Borrow
from schemas.schemas import BorrowSchema, BorrowCreate

def create_borrow(db: Session, borrow: BorrowCreate) -> Borrow:
    new_borrow = Borrow(
        user_id=borrow.user_id,
        book_id=borrow.book_id,
        borrow_date=borrow.borrow_date,
        date_created=borrow.date_created,
    )
    db.add(new_borrow)
    db.commit()
    db.refresh(new_borrow)
    return new_borrow

def get_borrow(db: Session, borrow_id: int) -> Borrow:
    borrow = db.query(Borrow).filter(Borrow.id == borrow_id).first()
    if not borrow:
        return None
    return borrow

def get_borrows(db: Session) -> list[Borrow]:
    borrows = db.query(Borrow).order_by(Borrow.date_created).all()
    if not borrows:
        return []
    return borrows

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
    borrows = db.query(Borrow).filter(Borrow.is_returned == True).order_by(Borrow.date_created).all()
    if not borrows:
        return []
    return borrows

def get_borrow_by_student_id(db: Session, student_id: int) -> list[Borrow]:
    borrows = db.query(Borrow).filter(Borrow.student_id == student_id).order_by(Borrow.date_created).all()
    if not borrows:
        return []
    return borrows

def get_borrow_by_book_id(db: Session, book_id: int) -> list[Borrow]:
    borrows = db.query(Borrow).filter(Borrow.book_id == book_id).order_by(Borrow.date_created).all()
    if not borrows:
        return []
    return borrows

def return_borrow(db: Session, book_id: int, std_id: int) -> Borrow:
    borrow = db.query(Borrow).filter(Borrow.book_id == book_id and Borrow.student_id == std_id).first()
    if not borrow:
        return None
    
    borrow.is_returned = True
    borrow.return_date = datetime.today()
    borrow.date_updated = datetime.today()

    db.commit()
    db.refresh(borrow)
    return borrow