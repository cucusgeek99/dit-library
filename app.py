from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import create_engine, Column, Integer, String, Boolean
from sqlalchemy.orm import declarative_base, sessionmaker, Session
from pydantic import BaseModel
from typing import Optional
import os, time

# ─────────────────────────────────────────
# Initialisation FastAPI
# ─────────────────────────────────────────
app = FastAPI(
    title="Bibliothèque DIT — Service Livres",
    description="API REST pour la gestion des livres",
    version="1.0.0"
)

# CORS — autorise le frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# ─────────────────────────────────────────
# Connexion base de données
# ─────────────────────────────────────────
DATABASE_URL = os.environ.get(
    'DATABASE_URL',
    'postgresql://admin:secret@db-livres:5432/livres_db'
)

engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(bind=engine)
Base = declarative_base()

# ─────────────────────────────────────────
# Modèle SQLAlchemy (table en BDD)
# ─────────────────────────────────────────
class Livre(Base):
    __tablename__ = 'livres'

    id         = Column(Integer, primary_key=True, index=True)
    titre      = Column(String(255), nullable=False)
    auteur     = Column(String(255), nullable=False)
    isbn       = Column(String(20), unique=True, nullable=True)
    disponible = Column(Boolean, default=True)

# ─────────────────────────────────────────
# Schémas Pydantic (validation des données)
# ─────────────────────────────────────────
class LivreCreate(BaseModel):
    titre:  str
    auteur: str
    isbn:   Optional[str] = None

class LivreUpdate(BaseModel):
    titre:      Optional[str]  = None
    auteur:     Optional[str]  = None
    isbn:       Optional[str]  = None
    disponible: Optional[bool] = None

class LivreResponse(BaseModel):
    id:         int
    titre:      str
    auteur:     str
    isbn:       Optional[str]
    disponible: bool

    class Config:
        from_attributes = True

# ─────────────────────────────────────────
# Création des tables avec retry
# ─────────────────────────────────────────
def init_db():
    retries = 5
    while retries > 0:
        try:
            Base.metadata.create_all(bind=engine)
            print("✅ Base de données connectée avec succès !")
            break
        except Exception as e:
            retries -= 1
            print(f"⏳ BDD pas encore prête... tentatives restantes : {retries}")
            time.sleep(3)

init_db()

# Helper — obtenir une session BDD
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

from fastapi import Depends

# ─────────────────────────────────────────
# ROUTE 1 : Lister tous les livres
# GET /api/livres
# ─────────────────────────────────────────
@app.get("/api/livres", response_model=list[LivreResponse])
def get_livres(db: Session = Depends(get_db)):
    return db.query(Livre).all()

# ─────────────────────────────────────────
# ROUTE 2 : Recherche par titre/auteur/ISBN
# GET /api/livres/search?q=python
# ─────────────────────────────────────────
@app.get("/api/livres/search", response_model=list[LivreResponse])
def search_livres(q: str, db: Session = Depends(get_db)):
    if not q:
        raise HTTPException(status_code=400, detail="Paramètre q requis")
    resultats = db.query(Livre).filter(
        Livre.titre.ilike(f'%{q}%')  |
        Livre.auteur.ilike(f'%{q}%') |
        Livre.isbn.ilike(f'%{q}%')
    ).all()
    return resultats

# ─────────────────────────────────────────
# ROUTE 3 : Afficher un seul livre
# GET /api/livres/1
# ─────────────────────────────────────────
@app.get("/api/livres/{id}", response_model=LivreResponse)
def get_livre(id: int, db: Session = Depends(get_db)):
    livre = db.query(Livre).filter(Livre.id == id).first()
    if not livre:
        raise HTTPException(status_code=404, detail="Livre non trouvé")
    return livre

# ─────────────────────────────────────────
# ROUTE 4 : Créer un livre
# POST /api/livres
# ─────────────────────────────────────────
@app.post("/api/livres", status_code=201)
def create_livre(data: LivreCreate, db: Session = Depends(get_db)):
    # Vérifier ISBN unique
    if data.isbn:
        existant = db.query(Livre).filter(Livre.isbn == data.isbn).first()
        if existant:
            raise HTTPException(status_code=409, detail="ISBN déjà utilisé")

    nouveau = Livre(titre=data.titre, auteur=data.auteur, isbn=data.isbn)
    db.add(nouveau)
    db.commit()
    db.refresh(nouveau)
    return {"message": "Livre créé avec succès", "id": nouveau.id}

# ─────────────────────────────────────────
# ROUTE 5 : Modifier un livre
# PUT /api/livres/1
# ─────────────────────────────────────────
@app.put("/api/livres/{id}", response_model=LivreResponse)
def update_livre(id: int, data: LivreUpdate, db: Session = Depends(get_db)):
    livre = db.query(Livre).filter(Livre.id == id).first()
    if not livre:
        raise HTTPException(status_code=404, detail="Livre non trouvé")

    if data.titre      is not None: livre.titre      = data.titre
    if data.auteur     is not None: livre.auteur     = data.auteur
    if data.isbn       is not None: livre.isbn       = data.isbn
    if data.disponible is not None: livre.disponible = data.disponible

    db.commit()
    db.refresh(livre)
    return livre

# ─────────────────────────────────────────
# ROUTE 6 : Supprimer un livre
# DELETE /api/livres/1
# ─────────────────────────────────────────
@app.delete("/api/livres/{id}")
def delete_livre(id: int, db: Session = Depends(get_db)):
    livre = db.query(Livre).filter(Livre.id == id).first()
    if not livre:
        raise HTTPException(status_code=404, detail="Livre non trouvé")

    db.delete(livre)
    db.commit()
    return {"message": "Livre supprimé avec succès"}
```

---

## Mettre à jour `requirements.txt`

Remplace tout par :
```
fastapi==0.110.0
uvicorn==0.29.0
sqlalchemy==2.0.29
psycopg2-binary==2.9.9
pydantic==2.6.4