from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
import crud.student as crud_student
import crud.book as crud_book
from db.database import session_local
from models.models import Book, Student
from schemas.schemas import BookCreate, BookSchema, BookUpdate, StudentSchema

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
    return {"message": "Bienvenue à la DIT Library API!"}


# ===================================
# Routes pour les étudiants
# ===================================
@app.post("/student/create", response_model=StudentSchema, tags=["Étudiants"])
def create_student(student: StudentSchema, db: Session = Depends(get_db)):
    try:
        student_data = crud_student.create_student(db, student)
        return student_data
    except Exception as e:
        raise HTTPException(status_code=500, detail="Erreur lors de la création de l'étudiant")

@app.get("/students", response_model=list[StudentSchema], tags=["Étudiants"])
def get_all_students(db: Session = Depends(get_db)):
    try:
        students = crud_student.get_students(db)
        return students
    except Exception as e:
        raise HTTPException(status_code=500, detail="Erreur lors de la récupération des étudiants")
    
@app.get("/student/{student_id}", response_model=StudentSchema, tags=["Étudiants"])
def get_student_by_id(student_id: int, db: Session = Depends(get_db)):
    student = crud_student.get_student(db, student_id)
    try:
        if not student:
            raise HTTPException(status_code=404, detail="Étudiant non trouvé")
        return student
    except Exception as e:
        raise HTTPException(status_code=500, detail="Erreur lors de la récupération de l'étudiant")
    
@app.put("/student/{student_id}/update", response_model=StudentSchema, tags=["Étudiants"])
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