from sqlalchemy.orm import Session
from models.models import Student
from schemas.schemas import StudentSchema
from sqlalchemy.exc import IntegrityError, SQLAlchemyError, NoResultFound

def create_student(db: Session, student: StudentSchema) -> Student:
    new_student = Student(
        matriculation_number=student.matriculation_number,
        name=student.name,
        email=student.email,
        classe=student.classe,
        date_created=student.date_created,
        date_updated=student.date_updated
    )
    try:
        db.add(new_student)
        db.commit()
        db.refresh(new_student)
        return new_student
    except IntegrityError as e:
        db.rollback()
        raise ValueError()
    except SQLAlchemyError as e:
        db.rollback()
        raise RuntimeError()
    

def get_student(db: Session, student_id: int) -> Student:
    try:
        student = db.query(Student).filter(Student.id == student_id).first()
        if not student:
            return NoResultFound()
        return student
    except SQLAlchemyError as e:
        raise e

def get_students(db: Session) -> list[Student]:
    try:
        list_students = db.query(Student).all()
        return list_students
    except SQLAlchemyError as e:
        raise e
    
def update_student(db: Session, student_id: int, student_data: StudentSchema) -> Student:
    try:
        student = db.query(Student).filter(Student.id == student_id).first()
        if not student:
            return NoResultFound()
        
        student.matriculation_number = student_data.matriculation_number
        student.name = student_data.name
        student.email = student_data.email
        student.classe = student_data.classe
        student.date_updated = student_data.date_updated
        
        db.commit()
        db.refresh(student)
        return student
    except IntegrityError as e:
        db.rollback()
        raise ValueError()
    except SQLAlchemyError as e:
        db.rollback()
        raise e
    

def delete_student(db: Session, student_id: int) -> None:
    try:
        student = db.query(Student).filter(Student.id == student_id).first()
        if not student:
            return NoResultFound()
        
        db.delete(student)
        db.commit()
    except SQLAlchemyError as e:
        db.rollback()
        raise e