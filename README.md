# DIT Library

Système de gestion de bibliothèque numérique pour le Dakar Institut of Technology (DIT). Ce monorepo contient le backend (API) et le frontend de l'application.

## Architecture

```
dit-library/
├── backend/    # API FastAPI (Python)
└── frontend/   # Application React (Vite + Tailwind + ShadCN UI)
```

## Backend — FastAPI

API REST pour la gestion des livres, utilisateurs et emprunts.

**Stack :** Python, FastAPI, SQLAlchemy, Alembic, PostgreSQL/MySQL, JWT (PyJWT), bcrypt

### Lancer le backend

```bash
cd backend
python3 -m venv .venv
source .venv/bin/activate   # Linux/macOS
# .venv\Scripts\activate    # Windows
pip install -r requirements.txt
uvicorn main:app --reload
```

L'API sera accessible sur http://localhost:8000
Documentation interactive : http://localhost:8000/docs

### Migrations (Alembic)

```bash
alembic revision --autogenerate -m "description"
alembic upgrade head
```

## Frontend — React + Vite

Interface moderne pour la gestion de la bibliothèque.

**Stack :** React 19, Vite, Tailwind CSS, ShadCN UI, Lucide React, React Router, Axios

### Lancer le frontend

```bash
cd frontend
npm install
npm run dev
```

L'application sera accessible sur http://localhost:5173

### Pages disponibles

| Route      | Description                |
|------------|----------------------------|
| `/login`   | Page de connexion          |
| `/signup`  | Création de compte         |
| `/books`   | Gestion des livres         |
| `/users`   | Gestion des utilisateurs   |
| `/loans`   | Gestion des emprunts       |
| `/profile` | Profil utilisateur         |

## Fonctionnalites

- Gestion des livres (CRUD)
- Gestion des utilisateurs avec authentification JWT
- Systeme d'emprunts et de retours
- Interface responsive et moderne
