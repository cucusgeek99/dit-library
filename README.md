# DIT Library

Système de gestion de bibliothèque numérique pour le **Dakar Institut of Technology (DIT)**.
Monorepo contenant le backend (API REST FastAPI) et le frontend (React + Vite).

## Architecture

```
devops_exam/
├── backend/    # API FastAPI (Python 3)
└── frontend/   # Application React (Vite + Tailwind + ShadCN UI)
```

---

## Prérequis

- Python 3.10+
- Node.js 18+
- Docker (pour MySQL)

---

## Démarrage rapide

### 1. Lancer MySQL via Docker

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

# Interface d'administration (optionnel)
docker run -d \
  --name phpmyadmin \
  --network dit-library \
  -e PMA_HOST=mysql_server \
  -p 8081:80 \
  phpmyadmin:latest
```

> phpMyAdmin disponible sur http://localhost:8081 — utilisateur : `root`, mot de passe : `admin123`

### 2. Backend

```bash
cd backend
python3 -m venv venv
source venv/bin/activate        # Linux/macOS
# venv\Scripts\activate         # Windows

pip install -r requirements.txt

alembic revision --autogenerate -m "initial"
alembic upgrade head

uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

API disponible sur http://localhost:8000
Documentation interactive : http://localhost:8000/docs

### 3. Frontend

```bash
cd frontend
npm install
npm run dev
```

Application disponible sur http://localhost:5173

---

## Comptes de test

Créer un premier compte via l'API ou la page `/signup` :

```bash
curl -X POST http://localhost:8000/user/create \
  -H "Content-Type: application/json" \
  -d '{"full_name":"Admin","email":"admin@dit.ac.za","user_type":"Personnel administratif","password":"admin123"}'
```

| Type de compte            | Accès                                        |
|---------------------------|----------------------------------------------|
| Personnel administratif   | Livres, Utilisateurs, Emprunts               |
| Professeur                | Livres, Emprunts                             |
| Etudiant                  | Livres, Emprunts (créer et retourner)        |

---

## Fonctionnalités

- Authentification JWT avec session persistante (localStorage)
- Contrôle d'accès par rôle (RBAC)
- Gestion des livres — ajout, modification, suppression
- Gestion des utilisateurs — création, suppression
- Gestion des emprunts — création et retour de livres

---

## Ports utilisés

| Service    | Port |
|------------|------|
| Backend    | 8000 |
| Frontend   | 5173 |
| MySQL      | 3306 |
| phpMyAdmin | 8081 |
