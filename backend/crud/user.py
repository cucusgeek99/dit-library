from passlib.context import CryptContext
from sqlalchemy.orm import Session
from schemas.schemas import UserCreate, UserLogin, UserOut
from models.models import UserDB
from sqlalchemy.exc import SQLAlchemyError, NoResultFound

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def hash_password(password: str):
    return pwd_context.hash(password)

def verify_password(plain_password, hashed_password):
    return pwd_context.verify(plain_password, hashed_password)

def create_user(db: Session, user: UserCreate) -> UserOut:
    hashed_password = hash_password(user.password)
    new_user = UserDB(
        full_name = user.full_name,
        email = user.email,
        hashed_password = hashed_password,
        user_type = user.user_type
    )
    try:
        db.add(new_user)
        db.commit()
        db.refresh(new_user)
        return new_user
    except SQLAlchemyError as e:
        db.rollback()
        raise e

def get_users(db: Session) -> UserOut:
    try:
        users = db.query(UserDB).order_by(UserDB.id).all()
        if not users:
            return []
        return users
    except SQLAlchemyError as e:
        raise e

def get_user_by_id(db: Session, user_id: int) -> UserOut:
    try:
        user = db.query(UserDB).filter(UserDB.id == user_id).first()
        return user
    except SQLAlchemyError as e:
        raise e

def delete_user_by_id(db: Session, user_id: int) -> None:
    try:
        student = db.query(UserDB).filter(UserDB.id == user_id).first()
        if not student:
            return NoResultFound()
        
        db.delete(student)
        db.commit()
    except SQLAlchemyError as e:
        db.rollback()
        raise e

#=============================
# Opération etudiant
#=============================
def get_students(db: Session) -> list[UserOut]:
    try:
        list_students = db.query(UserDB).filter(UserDB.user_type == "Etudiant").order_by(UserDB.id).all()
        return list_students
    except SQLAlchemyError as e:
        raise e
    
#=============================
# Opération professeur
#=============================
def get_teachers(db: Session) -> list[UserOut]:
    try:
        list_students = db.query(UserDB).filter(UserDB.user_type == "Professeur").order_by(UserDB.id).all()
        return list_students
    except SQLAlchemyError as e:
        raise e

#=============================
# Opération personnel administratif
#=============================
def get_pers_admin(db: Session) -> list[UserOut]:
    try:
        list_students = db.query(UserDB).filter(UserDB.user_type == "Personnel administratif").order_by(UserDB.id).all()
        return list_students
    except SQLAlchemyError as e:
        raise e