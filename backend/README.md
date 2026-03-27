# DIT Library — Backend

API REST développée avec **FastAPI** pour gérer la bibliothèque du Dakar Institut of Technology.

## Stack technique

- **Python 3.10+**
- **FastAPI** — framework web
- **SQLAlchemy** — ORM
- **Alembic** — migrations de base de données
- **MySQL 8** (via Docker)
- **PyJWT** — authentification JWT
- **bcrypt** — hachage des mots de passe
- **mysql-connector-python** — driver MySQL

---

## Installation

### 1. Démarrer MySQL avec Docker

```bash
docker network create dit-library

docker run -d \
  --name mysql_server \
  --network dit-library \
  -e MYSQL_ROOT_PASSWORD=admin123 \
  -e MYSQL_DATABASE=dit-library-bd \
  -e MYSQL_USER=admin \
  -e MYSQL_PASSWORD=admin123 \
  -p 3306:3306 \
  mysql:8.4
```

La chaîne de connexion configurée dans `db/database.py` :
```
mysql+mysqlconnector://admin:admin123@localhost:3306/dit-library-bd
```

### 2. Environnement Python

```bash
python3 -m venv venv
source venv/bin/activate    # Linux/macOS
# venv\Scripts\activate     # Windows

pip install -r requirements.txt
```

### 3. Migrations Alembic

```bash
# Première fois — générer les tables
alembic revision --autogenerate -m "initial tables"
alembic upgrade head

# Après modification d'un modèle
alembic revision --autogenerate -m "description du changement"
alembic upgrade head
```

### 4. Lancer l'API

```bash
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

API disponible sur http://localhost:8000
Documentation interactive (Swagger) : http://localhost:8000/docs

---

## Structure du projet

```
backend/
├── alembic/            # Migrations de base de données
│   ├── versions/       # Fichiers de migration générés
│   └── env.py          # Configuration Alembic
├── crud/               # Fonctions d'accès aux données
│   ├── book.py         # CRUD livres
│   ├── borrow.py       # CRUD emprunts
│   └── user.py         # CRUD utilisateurs
├── db/
│   └── database.py     # Connexion SQLAlchemy + session
├── models/
│   └── models.py       # Modèles ORM (Book, User, Borrow)
├── schemas/
│   └── schemas.py      # Schémas Pydantic (validation)
├── main.py             # Point d'entrée FastAPI + toutes les routes
├── requirements.txt
└── alembic.ini
```

---

## Endpoints principaux

### Authentification

| Méthode | Route           | Description              | Rôle requis |
|---------|-----------------|--------------------------|-------------|
| POST    | `/user/login`   | Connexion (JWT)          | —           |
| POST    | `/user/create`  | Créer un utilisateur     | —           |

### Livres

| Méthode | Route                   | Description         | Rôle requis              |
|---------|-------------------------|---------------------|--------------------------|
| GET     | `/books`                | Lister les livres   | —                        |
| POST    | `/book/create`          | Ajouter un livre    | Personnel / Professeur   |
| PUT     | `/book/{id}/update`     | Modifier un livre   | Personnel / Professeur   |
| DELETE  | `/book/{id}/delete`     | Supprimer un livre  | Personnel / Professeur   |

### Utilisateurs

| Méthode | Route               | Description             | Rôle requis           |
|---------|---------------------|-------------------------|-----------------------|
| GET     | `/users/`           | Lister les utilisateurs | Personnel             |
| DELETE  | `/user/{id}/delete` | Supprimer un utilisateur| Personnel             |

### Emprunts

| Méthode | Route                              | Description          | Rôle requis |
|---------|------------------------------------|----------------------|-------------|
| GET     | `/borrows`                         | Lister les emprunts  | —           |
| POST    | `/borrow/create`                   | Créer un emprunt     | Etudiant    |
| POST    | `/borrow/{book_id}/{user_id}/return` | Retourner un livre | Etudiant    |

---

## Types de comptes

| `user_type`               | Permissions                           |
|---------------------------|---------------------------------------|
| `Etudiant`                | Créer et retourner des emprunts       |
| `Professeur`              | Gérer les livres, consulter emprunts  |
| `Personnel administratif` | Accès complet                         |

---

## Configuration Alembic

`alembic/env.py` importe la `Base` et tous les modèles pour que les migrations soient détectées automatiquement :

```python
from db.database import Base
from models.models import *
target_metadata = Base.metadata
```

La chaîne de connexion est lue depuis la variable d'environnement `DATABASE_URL` (avec fallback local) :

```python
database_url = os.getenv(
    "DATABASE_URL",
    "mysql+mysqlconnector://admin:admin123@localhost:3306/dit-library-bd"
)
config.set_main_option("sqlalchemy.url", database_url)
```

En production Docker, `DATABASE_URL` est injectée par `docker-compose.yml` et pointe vers le service `db`.
