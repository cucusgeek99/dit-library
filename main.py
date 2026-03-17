from fastapi import FastAPI, Depends, HTTPException
from sqlalchemy.orm import Session
import crud.student as crud_student
from db.database import session_local
from models.models import Student
from schemas.schemas import StudentSchema

def get_db():
    db = session_local()
    try:
        yield db
    finally:
        db.close()

app = FastAPI(
    title="DIT Library API",
    description="API pour gérer la bibliothèque de l'établissement DIT",
    version="1.0.0",
)

@app.get("/")
def index():
    return {"message": "Bienvenue à la DIT Library API!"}


# ===================================
# Routes pour les étudiants
# ===================================
@app.post("/student/create", response_model=StudentSchema)
def create_student(student: StudentSchema, db: Session = Depends(get_db)):
    try:
        student_data = crud_student.create_student(db, student)
        return student_data
    except Exception as e:
        raise HTTPException(status_code=500, detail="Erreur lors de la création de l'étudiant")

@app.get("/students", response_model=list[StudentSchema])
def get_all_students(db: Session = Depends(get_db)):
    try:
        students = crud_student.get_students(db)
        return students
    except Exception as e:
        raise HTTPException(status_code=500, detail="Erreur lors de la récupération des étudiants")
    
@app.get("/student/{student_id}", response_model=StudentSchema)
def get_student_by_id(student_id: int, db: Session = Depends(get_db)):
    student = crud_student.get_student(db, student_id)
    try:
        if not student:
            raise HTTPException(status_code=404, detail="Étudiant non trouvé")
        return student
    except Exception as e:
        raise HTTPException(status_code=500, detail="Erreur lors de la récupération de l'étudiant")
    
@app.put("/student/{student_id}/update", response_model=StudentSchema)
def update_student_by_id(student_id: int, student: StudentSchema, db: Session = Depends(get_db)):
    try:
        updated_student = crud_student.update_student(db, student_id, student)
        if not updated_student:
            raise HTTPException(status_code=404, detail="Étudiant non trouvé")
        return updated_student
    except Exception as e:
        raise HTTPException(status_code=500, detail="Erreur lors de la mise à jour de l'étudiant")

@app.delete("/student/{student_id}/delete")
def delete_student_by_id(student_id: int, db: Session = Depends(get_db)):
    try:
        result = crud_student.delete_student(db, student_id)
        if not result:
            raise HTTPException(status_code=404, detail="Étudiant non trouvé")
        return {"message": "Étudiant supprimé avec succès"}
    except Exception as e:
        raise HTTPException(status_code=500, detail="Erreur lors de la suppression de l'étudiant")