from sqlalchemy.orm import Session
from sqlalchemy import func
from models.models import UserDB, Book, Borrow # Assure-tu d'importer tes modèles
from datetime import date

def get_general_stats(db: Session):
    """ Retourne les compteurs principaux pour le dashboard """
    return {
        "total_users": db.query(UserDB).count(),
        "total_student": db.query(UserDB).filter(UserDB.user_type == "Etudiant").count(),
        "total_prof": db.query(UserDB).filter(UserDB.user_type == "Professeur").count(),
        "total_admin": db.query(UserDB).filter(UserDB.user_type == "Personnel administratif").count(),
        "total_books": db.query(Book).count(),
        "active_borrows": db.query(Borrow).filter(Borrow.is_returned == False).count(),
        "available_books": db.query(Book).filter(Book.is_available == True).count()
    }

def get_most_borrowed_books(db: Session, limit: int = 5):
    """ Liste les livres les plus sollicités """
    return db.query(
        Book.title, 
        func.count(Borrow.id).label("borrow_count")
    ).join(Borrow, Book.id == Borrow.book_id)\
     .group_by(Book.id)\
     .order_by(func.count(Borrow.id).desc())\
     .limit(limit).all()

def get_overdue_borrows(db: Session):
    """ Identifie les emprunts non rendus (optionnel: ajouter une logique de date) """
    return db.query(Borrow).filter(
        Borrow.is_returned == False,        
    ).all()
