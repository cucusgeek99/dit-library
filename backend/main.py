from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
import crud.student as crud_student
import crud.book as crud_book
import crud.borrow as ops_borrow
from db.database import session_local
from models.models import Book, Student
from schemas.schemas import BookCreate, BookSchema, BookUpdate, BorrowCreate, BorrowSchema, StudentSchema, StudentUpdate, StudentCreate
import crud.dashoard as stats

# Dépendance pour obtenir une session de base de données
def get_db():
    db = session_local()
    try:
        yield db
    finally:
        db.close()

# Définition de l'application FastAPI
app = FastAPI(
    title="DIT Library API",
    description="API pour gérer la bibliothèque de l'établissement DIT",
    version="1.0.0",
)

# Definition des autorisations de doamines pour les requêtes CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Permet toutes les origines, à ajuster en production
    allow_methods=["*"],  # Permet toutes les méthodes HTTP
    allow_headers=["*"],  # Permet tous les headers
)

@app.get("/")
def index():
    return {"message": "Bienvenue à la DIT Library API! Rendez-vous à la page", "docs": "http://127.0.0.1:8000/docs/"}


#=================================
# Routes pour les statistiques
#=================================
@app.get("/statistiques", tags=["Dashboard"])
def get_dashboard_summary(db: Session = Depends(get_db)):
    """
    Récupère toutes les statistiques globales pour le tableau de bord.
    """
    # Récupération des compteurs simples
    general = stats.get_general_stats(db)
    
    # Formatage des stats par classe
    by_class = [
        {"classe": row[0], "total": row[1]} 
        for row in stats.get_borrows_by_class(db)
    ]
    
    # Formatage des livres les plus empruntés
    top_books = [
        {"title": row[0], "borrow_count": row[1]} 
        for row in stats.get_most_borrowed_books(db)
    ]

    # Récupération des emprunts non rendus
    overdue_borrow = stats.get_overdue_borrows(db)
    
    return {
        **general,
        "borrows_by_class": by_class,
        "top_books": top_books,
        "overdue_borrow": overdue_borrow
    }


# ===================================
# Routes pour les étudiants
# ===================================
@app.post("/student/create", response_model=StudentCreate, tags=["Étudiants"])
def create_student(student: StudentSchema, db: Session = Depends(get_db)):
    try:
        student_data = crud_student.create_student(db, student)
        return student_data
    except Exception as e:
        raise HTTPException(status_code=500, detail="Erreur lors de la création de l'étudiant")

@app.get("/students", tags=["Étudiants"])
def get_all_students(db: Session = Depends(get_db)):
    try:
        students = crud_student.get_students(db)
        return students
    except Exception as e:
        raise HTTPException(status_code=500, detail="Erreur lors de la récupération des étudiants")
    
@app.get("/student/{student_id}", tags=["Étudiants"])
def get_student_by_id(student_id: int, db: Session = Depends(get_db)):
    student = crud_student.get_student(db, student_id)
    try:
        if not student:
            raise HTTPException(status_code=404, detail="Étudiant non trouvé")
        return student
    except Exception as e:
        raise HTTPException(status_code=500, detail="Erreur lors de la récupération de l'étudiant")
    
@app.put("/student/{student_id}/update", response_model=StudentUpdate, tags=["Étudiants"])
def update_student_by_id(student_id: int, student: StudentSchema, db: Session = Depends(get_db)):
    try:
        updated_student = crud_student.update_student(db, student_id, student)
        if not updated_student:
            raise HTTPException(status_code=404, detail="Étudiant non trouvé")
        return updated_student
    except Exception as e:
        raise HTTPException(status_code=500, detail="Erreur lors de la mise à jour de l'étudiant")

@app.delete("/student/{student_id}/delete", tags=["Étudiants"])
def delete_student_by_id(student_id: int, db: Session = Depends(get_db)):
    try:
        result = crud_student.delete_student(db, student_id)
        if not result:
            raise HTTPException(status_code=404, detail="Étudiant non trouvé")
        return {"message": "Étudiant supprimé avec succès"}
    except Exception as e:
        raise HTTPException(status_code=500, detail="Erreur lors de la suppression de l'étudiant")
    
# ===================================
# Routes pour les livres
# ===================================
@app.post("/book/create", response_model=BookCreate, tags=["Livres"])
def create_book(book: BookCreate, db: Session = Depends(get_db)):
    try:
        result = crud_book.create_book(db, book)
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Erreur lors de la création du livre : {str(e)}")

@app.get("/books", tags=["Livres"])
def get_books(db: Session = Depends(get_db)):
    try:
        books = crud_book.get_books(db)
        if not books:
            raise HTTPException(status_code=404, detail="Aucun livre trouvé")
        return books
    except Exception as e:
        raise HTTPException(status_code=500, detail="Erreur lors de la récupération des livres")
    
@app.get("/book/{book_id}", tags=["Livres"])
def get_book_by_id(book_id: int, db: Session = Depends(get_db)):
    try:
        book = crud_book.get_book(db, book_id)
        if not book:
            raise HTTPException(status_code=404, detail="Livre non trouvé")
        return book
    except Exception as e:
        raise HTTPException(status_code=500, detail="Erreur lors de la récupération du livre")

@app.get("/books/search", tags=["Livres"])
def search_books(q: str, db: Session = Depends(get_db)):
    try:
        books = crud_book.search_books(db, q)
        if not books:
            raise HTTPException(status_code=404, detail="Aucun livre trouvé pour la recherche")
        return books
    except Exception as e:
        raise HTTPException(status_code=500, detail="Erreur lors de la recherche des livres")
    
@app.put("/book/{book_id}/update", tags=["Livres"])
def update_book_by_id(book_id: int, book: BookUpdate, db: Session = Depends(get_db)):
    try:
        updated_book = crud_book.update_books(db, book_id, book)
        if not updated_book:
            raise HTTPException(status_code=404, detail="Livre non trouvé")
        return updated_book
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Erreur lors de la mise à jour du livre {str(e)}")

@app.delete("/book/{book_id}/delete", tags=["Livres"])
def delete_book_by_id(book_id: int, db: Session = Depends(get_db)):
    try:
        result = crud_book.delete_book(db, book_id)
        if not result:
            raise HTTPException(status_code=404, detail="Livre non trouvé")
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail="Erreur lors de la suppression du livre")


# ===================================
# Routes pour les emprunts
# ===================================
@app.post("/borrow/create", tags=["Emprunts"])
def create_borrow(borrow: BorrowCreate, db: Session = Depends(get_db)):
    try:
        result = ops_borrow.create_borrow(db, borrow)
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Erreur lors de la création de l'emprunt : {str(e)}")
    
@app.get("/borrows", tags=["Emprunts"])
def get_borrows(db: Session = Depends(get_db)):
    try:
        borrows = ops_borrow.get_borrows(db)
        if not borrows:
            raise HTTPException(status_code=404, detail="Aucun emprunt trouvé")
        return borrows
    except Exception as e:
        raise HTTPException(status_code=500, detail="Erreur lors de la récupération des emprunts")

@app.get("/borrow/{borrow_id}", tags=["Emprunts"])
def get_borrow_by_id(borrow_id: int, db: Session = Depends(get_db)):
    try:
        borrow_data = ops_borrow.get_borrow(db, borrow_id)
        if not borrow_data:
            raise HTTPException(status_code=404, detail="Emprunt non trouvé")
        return borrow_data
    except Exception as e:
        raise HTTPException(status_code=500, detail="Erreur lors de la récupération de l'emprunt")
    
@app.put("/borrow/{borrow_id}/update", tags=["Emprunts"])
def update_borrow_by_id(borrow_id: int, borrow_data: BorrowSchema, db: Session = Depends(get_db)):
    try:
        updated_borrow = ops_borrow.update_borrow(db, borrow_id, borrow_data)
        if not updated_borrow:
            raise HTTPException(status_code=404, detail="Emprunt non trouvé")
        return updated_borrow
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Erreur lors de la mise à jour de l'emprunt : {str(e)}")

@app.delete("/borrow/{borrow_id}/delete", tags=["Emprunts"])
def delete_borrow_by_id(borrow_id: int, db: Session = Depends(get_db)):
    try:
        result = ops_borrow.delete_borrow(db, borrow_id)
        if not result:
            raise HTTPException(status_code=404, detail="Emprunt non trouvé")
        return {"message": "Emprunt supprimé avec succès"}
    except Exception as e:
        raise HTTPException(status_code=500, detail="Erreur lors de la suppression de l'emprunt")
    
@app.get("/borrows/returned", tags=["Emprunts"])
def get_returned_borrows(db: Session = Depends(get_db)):
    try:
        borrows = ops_borrow.get_returned_borrows(db)
        if not borrows or len(borrows) == 0:
            return {"message": "Aucun emprunt retourné trouvé"}            
        return borrows
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Erreur lors de la récupération des emprunts retournés : {str(e)}")

@app.get("/borrows/student/{student_id}", tags=["Emprunts"])
def get_borrow_by_student_id(student_id: int, db: Session = Depends(get_db)):
    try:
        borrows = ops_borrow.get_borrow_by_student_id(db, student_id)
        if not borrows:
            raise HTTPException(status_code=404, detail="Aucun emprunt trouvé pour cet étudiant")
        return borrows
    except Exception as e:
        raise HTTPException(status_code=500, detail="Erreur lors de la récupération des emprunts pour l'étudiant")
    
@app.get("/borrows/book/{book_id}", tags=["Emprunts"])
def get_borrow_by_book_id(book_id: int, db: Session = Depends(get_db)):
    try:
        borrows = ops_borrow.get_borrow_by_book_id(db, book_id)
        if not borrows:
            raise HTTPException(status_code=404, detail="Aucun emprunt trouvé pour ce livre")
        return borrows
    except Exception as e:
        raise HTTPException(status_code=500, detail="Erreur lors de la récupération des emprunts pour le livre")
    
@app.post("/borrow/{book_id}/{std_id}/return", tags=["Emprunts"])
def return_borrow(book_id: int, std_id: int, db: Session = Depends(get_db)):
    try:
        borrow= ops_borrow.return_borrow(db, book_id, std_id)
        if not borrow:
            raise HTTPException(status_code=404, detail="Aucun emprunt trouvé pour ce livre")
        return borrow
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Erreur lors de l'enregistrement du retour du prêt du livre {str(e)}")