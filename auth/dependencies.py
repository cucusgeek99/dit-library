import jwt
from fastapi.security import OAuth2PasswordBearer
from fastapi import FastAPI, Depends, HTTPException, status
from sqlalchemy.orm import Session
import crud.auth as auth
from models.models import UserDB
from db.database import session_local

# Dépendance pour obtenir une session de base de données
def get_db():
    db = session_local()
    try:
        yield db
    finally:
        db.close()

# Indique à FastAPI où récupérer le token (header Authorization: Bearer <token>)
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="user/login")

def get_current_user(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Identifiants invalides",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, auth.SECRET_KEY, algorithms=[auth.ALGORITHM])
        user_id: str = payload.get("sub")
        token_type: str = payload.get("type")
        
        # Vérifie que c'est un Access Token et pas un Refresh Token
        if user_id is None or token_type != "access":
            raise credentials_exception
            
    except jwt.PyJWTError:
        raise credentials_exception

    user = db.query(UserDB).filter(UserDB.id == int(user_id)).first()
    if user is None:
        raise credentials_exception
        
    return user

class RoleChecker:
    def __init__(self, allowed_roles: list[str]):
        self.allowed_roles = allowed_roles

    def __call__(self, user: UserDB = Depends(get_current_user)):
        if user.user_type not in self.allowed_roles:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Vous n'avez pas les permissions nécessaires"
            )
        return user