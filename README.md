# DIT Library

Système de gestion de bibliothèque numérique pour le **Dakar Institut of Technology (DIT)**.
Monorepo contenant le backend (API REST FastAPI) et le frontend (React + Vite).

## Architecture

```
devops_exam/
├── backend/          # API FastAPI (Python 3)
├── frontend/         # Application React (Vite + Tailwind + ShadCN UI)
├── docker-compose.yml
└── Jenkinsfile       # Pipeline CI/CD Jenkins
```

### Flux Docker (production)

```
Browser → Nginx:80
  ├── GET /          → React SPA (fichiers statiques)
  └── ANY /api/...   → proxy → backend:8000 → MySQL:3306
```

---

## Prérequis

- Python 3.10+
- Node.js 18+
- Docker + Docker Compose

---

## Démarrage rapide

### Option A — Docker Compose (stack complète)

```bash
docker-compose up --build
```

| Service  | URL                              |
|----------|----------------------------------|
| Frontend | http://localhost                 |
| Backend  | http://localhost:8000/docs       |

### Option B — Développement local

#### 1. Lancer MySQL via Docker

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

#### 2. Backend

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

API disponible sur http://localhost:8000 — Swagger : http://localhost:8000/docs

#### 3. Frontend

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

| Service           | Dev local | Docker Compose |
|-------------------|-----------|----------------|
| Frontend (Nginx)  | 5173      | 80             |
| Backend (FastAPI) | 8000      | 8000           |
| MySQL             | 3306      | 3306 (interne) |

---

## CI/CD Jenkins

Le fichier `Jenkinsfile` à la racine définit un pipeline déclaratif avec 6 stages :

1. **Checkout** — récupération du code source
2. **Build Backend** — création du virtualenv Python + installation des dépendances
3. **Lint Backend** — vérification syntaxique des fichiers Python (`py_compile`)
4. **Build Frontend** — `npm ci` + `npm run lint` + `npm run build`
5. **Docker Build** — construction des images backend et frontend
6. **Deploy** — déploiement via `docker-compose up -d --build`

Pour utiliser Jenkins, créer un pipeline pointant sur ce dépôt (Pipeline from SCM).
