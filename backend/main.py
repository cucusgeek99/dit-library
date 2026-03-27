from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
import crud.book as crud_book
import crud.borrow as ops_borrow
import crud.user as ops_user
import crud.auth as auth
from models.models import UserDB
from schemas.schemas import (
    BookCreate, BookUpdate, BorrowCreate, BorrowSchema,
    UserOut, UserCreate, UserLogin    
)
import crud.dashoard as stats
import jwt
from auth.dependencies import get_db, get_current_user, RoleChecker

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

# ================ CONFIG DES ROLES =====================
ROLE_EMPRUNTEUR = ["Etudiant", "Professeur", "Personnel administratif"]
ROLE_PERS_ADMIN = ["Personnel administratif"]

#=================================
# Routes pour les statistiques
#=================================
@app.get("/statistiques", tags=["Dashboard"])
def get_dashboard_summary(
    db: Session = Depends(get_db), _: UserDB = Depends(RoleChecker(ROLE_PERS_ADMIN))
):
    """
    Récupère toutes les statistiques globales pour le tableau de bord.
    """
    # Récupération des compteurs simples
    general = stats.get_general_stats(db)
    
    # Formatage des livres les plus empruntés
    top_books = [
        {"title": row[0], "borrow_count": row[1]} 
        for row in stats.get_most_borrowed_books(db)
    ]

    # Récupération des emprunts non rendus
    overdue_borrow = stats.get_overdue_borrows(db)
    
    return {
        **general,
        "top_books": top_books,
        "overdue_borrow": overdue_borrow
    }

#==========================================
# Routes pour l'inscription et la connexion
#==========================================
@app.post("/user/login", tags=["Authentification"])
def login(user_credentials: UserLogin, db: Session = Depends(get_db)):    
    user = db.query(UserDB).filter(UserDB.email == user_credentials.email).first()
        
    if not user or not ops_user.verify_password(user_credentials.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Identifiants incorrects"
        )

    # 1. Créer le token
    tokens = auth.create_access_token(user_id=user.id)

    # 2. Retourner le token ET les infos user (selon votre besoin)
    return {
        **tokens,
        "user": {
            "id": user.id,
            "full_name": user.full_name,
            "email": user.email,
            "user_type": user.user_type
        }
    }

@app.post("/user/refresh/token", tags=["Authentification"])
def refresh_token(refresh_token: str):
    try:
        # 1. Décoder et vérifier le refresh token
        payload = auth.refresh_token(refresh_token=refresh_token)
        
        # 2. Vérifier si c'est bien un token de type "refresh"
        if payload.get("type") != "refresh":
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Type de token invalide"
            )
            
        user_id = payload.get("sub")
        if user_id is None:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Token invalide : ID utilisateur manquant"
            )

        # 3. Générer un nouvel access token
        new_tokens = auth.create_access_token(user_id=int(user_id))
        
        return {
            "access_token": new_tokens["access_token"],
            "token_type": "bearer"
        }

    except jwt.ExpiredSignatureError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED, 
            detail="Le refresh token a expiré, merci de vous reconnecter"
        )
    except jwt.PyJWTError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED, 
            detail="Token invalide"
        )

# Route accessible à tout utilisateur connecté (peu importe le rôle)
@app.get("/user/me")
def me(current_user: UserDB = Depends(get_current_user)):
    return current_user

@app.post("/user/create", response_model=UserOut, tags=["Utilisateurs"])
def create_user(user: UserCreate, db: Session = Depends(get_db)):
    try:
        user_data = ops_user.create_user(db=db, user=user)        
        return user_data
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=f"Erreur lors de la création de l'utilisateur {e}")

@app.get("/users/", response_model=list[UserOut], tags=["Utilisateurs"])
def get_users(db: Session = Depends(get_db), _ = Depends(get_current_user)):
    try:
        users = ops_user.get_users(db)
        return users
    except Exception as e:
        HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Erreur lors de la recuperation des utilisateurs")

@app.get("/user/{user_id}", response_model=UserOut, tags=["Utilisateurs"])
def get_user(user_id: int, db: Session = Depends(get_db)):
    try:
        user = ops_user.get_user_by_id(db, user_id)
        if not user:
            return HTTPException(status_code=status.HTTP_404_NOT_FOUND)
        return user
    except Exception as e:
        HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Erreur lors de la recuperation des utilisateurs")

@app.delete("/user/{user_id}/delete", tags=["Utilisateurs"])
def delete_user_by_id(user_id: int, db: Session = Depends(get_db), _ = Depends(RoleChecker(ROLE_PERS_ADMIN))):
    try:
        result = ops_user.delete_user_by_id(db, user_id)
        if not result:
            raise HTTPException(status_code=404, detail="Étudiant non trouvé")
        return {"message": "Étudiant supprimé avec succès"}
    except Exception as e:
        raise HTTPException(status_code=500, detail="Erreur lors de la suppression de l'étudiant")

@app.get("/students", tags=["Utilisateurs"])
def get_all_students(db: Session = Depends(get_db), _ = Depends(get_current_user)):
    try:
        students = ops_user.get_students(db)
        return students
    except Exception as e:
        raise HTTPException(status_code=500, detail="Erreur lors de la récupération des étudiants")

@app.get("/teachers", tags=["Utilisateurs"])
def get_all_teachers(db: Session = Depends(get_db), _ = Depends(RoleChecker(ROLE_PERS_ADMIN))):
    try:
        students = ops_user.get_teachers(db)
        return students
    except Exception as e:
        raise HTTPException(status_code=500, detail="Erreur lors de la récupération des professeurs")

@app.get("/admins", tags=["Utilisateurs"])
def get_all_admins(db: Session = Depends(get_db), _ = Depends(RoleChecker(ROLE_PERS_ADMIN))):
    try:
        students = ops_user.get_pers_admin(db)
        return students
    except Exception as e:
        raise HTTPException(status_code=500, detail="Erreur lors de la récupération des personnels administratifs")
    
# ===================================
# Routes pour les livres
# ===================================
@app.post("/book/create", response_model=BookCreate, tags=["Livres"])
def create_book(book: BookCreate, db: Session = Depends(get_db), _ = Depends(RoleChecker(ROLE_PERS_ADMIN))):
    try:
        result = crud_book.create_book(db, book)
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Erreur lors de la création du livre : {str(e)}")

@app.get("/books", tags=["Livres"])
def get_books(db: Session = Depends(get_db)):
    try:
        return crud_book.get_books(db)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Erreur lors de la récupération des livres {e}")
    
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
def update_book_by_id(book_id: int, book: BookUpdate, db: Session = Depends(get_db), _ = Depends(RoleChecker(ROLE_PERS_ADMIN))):
    try:
        updated_book = crud_book.update_books(db, book_id, book)
        if not updated_book:
            raise HTTPException(status_code=404, detail="Livre non trouvé")
        return updated_book
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Erreur lors de la mise à jour du livre {str(e)}")

@app.delete("/book/{book_id}/delete", tags=["Livres"])
def delete_book_by_id(book_id: int, db: Session = Depends(get_db), _ = Depends(RoleChecker(ROLE_PERS_ADMIN))):
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
def create_borrow(
    borrow: BorrowCreate,
    db: Session = Depends(get_db),
    _ = Depends(RoleChecker(ROLE_EMPRUNTEUR))
):
    return ops_borrow.create_borrow(db, borrow)
    
@app.get("/borrows", tags=["Emprunts"])
def get_borrows(
    db: Session = Depends(get_db),
    current_user: UserDB = Depends(get_current_user)
):
    try:
        if current_user.user_type == "Personnel administratif":
            return ops_borrow.get_borrows(db)
        else:
            return ops_borrow.get_borrow_by_user_id(db, current_user.id)
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Erreur lors de la récupération des emprunts {e}"
        )

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
def update_borrow_by_id(borrow_id: int, borrow_data: BorrowSchema, db: Session = Depends(get_db), _ = Depends(get_current_user)):
    try:
        updated_borrow = ops_borrow.update_borrow(db, borrow_id, borrow_data)
        if not updated_borrow:
            raise HTTPException(status_code=404, detail="Emprunt non trouvé")
        return updated_borrow
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Erreur lors de la mise à jour de l'emprunt : {str(e)}")

@app.delete("/borrow/{borrow_id}/delete", tags=["Emprunts"])
def delete_borrow_by_id(borrow_id: int, db: Session = Depends(get_db), _ = Depends(RoleChecker(ROLE_PERS_ADMIN))):
    try:
        result = ops_borrow.delete_borrow(db, borrow_id)
        if not result:
            raise HTTPException(status_code=404, detail="Emprunt non trouvé")
        return {"message": "Emprunt supprimé avec succès"}
    except Exception as e:
        raise HTTPException(status_code=500, detail="Erreur lors de la suppression de l'emprunt")
    
@app.get("/borrows/returned", tags=["Emprunts"])
def get_returned_borrows(
    db: Session = Depends(get_db),
    _ = Depends(RoleChecker(ROLE_PERS_ADMIN))
):
    try:
        borrows = ops_borrow.get_returned_borrows(db)
        if not borrows or len(borrows) == 0:
            return {"message": "Aucun emprunt retourné trouvé"}
        return borrows
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Erreur lors de la récupération des emprunts retournés : {str(e)}")

@app.get("/borrows/student/{student_id}", tags=["Emprunts"])
def get_borrow_by_student_id(student_id: int, db: Session = Depends(get_db), _ = Depends(RoleChecker(ROLE_PERS_ADMIN))):
    try:
        borrows = ops_borrow.get_borrow_by_student_id(db, student_id)
        if not borrows:
            raise HTTPException(status_code=404, detail="Aucun emprunt trouvé pour cet étudiant")
        return borrows
    except Exception as e:
        raise HTTPException(status_code=500, detail="Erreur lors de la récupération des emprunts pour l'étudiant")
    
@app.get("/borrows/book/{book_id}", tags=["Emprunts"])
def get_borrow_by_book_id(book_id: int, db: Session = Depends(get_db), _ = Depends(RoleChecker(ROLE_PERS_ADMIN))):
    try:
        borrows = ops_borrow.get_borrow_by_book_id(db, book_id)
        if not borrows:
            raise HTTPException(status_code=404, detail="Aucun emprunt trouvé pour ce livre")
        return borrows
    except Exception as e:
        raise HTTPException(status_code=500, detail="Erreur lors de la récupération des emprunts pour le livre")
    
@app.post("/borrow/{book_id}/{std_id}/return", tags=["Emprunts"])
def return_borrow(
    book_id: int,
    std_id: int,
    db: Session = Depends(get_db),
    _ = Depends(RoleChecker(ROLE_EMPRUNTEUR))
):
    borrow = ops_borrow.return_borrow(db, book_id, std_id)
    if not borrow:
        raise HTTPException(status_code=404, detail="Aucun emprunt trouvé pour ce livre")
    return borrow