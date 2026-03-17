# 📚 Service Livres — Bibliothèque Numérique DIT

Microservice de gestion des livres pour la plateforme
Bibliothèque Numérique du Dakar Institute of Technology.

---

## 🏗 Architecture

Ce service fait partie d'une architecture microservices :

- **service-livres** (ce repo) — Port 8001


---

## 🚀 Installation et lancement

### Prérequis
- Docker Desktop installé et ouvert
- Git

### Lancer le projet
```bash
git clone https://github.com/Bintcheikh/service-livres-dit.git
cd service-livres-dit
docker-compose up --build
```

C'est tout ! Une seule commande lance :
- ✅ Le service FastAPI (port 8001)
- ✅ La base de données PostgreSQL
- ✅ Le réseau entre les deux

---

## 🌐 URLs disponibles

| URL | Description |
|-----|-------------|
| http://localhost:8001/api/livres | API principale |
| http://localhost:8001/redoc | Documentation alternative |
| http://localhost:3000 | Interface web frontend |

---

## 📡 Endpoints API

| Méthode | Route | Description |
|---------|-------|-------------|
| GET | /api/livres | Lister tous les livres |
| GET | /api/livres/search?q=... | Rechercher par titre/auteur/ISBN |
| GET | /api/livres/{id} | Afficher un livre par ID |
| POST | /api/livres | Ajouter un nouveau livre |
| PUT | /api/livres/{id} | Modifier un livre |
| DELETE | /api/livres/{id} | Supprimer un livre |

---

## 📝 Exemples d'utilisation

### Ajouter un livre
```bash
curl -X POST http://localhost:8001/api/livres \
  -H "Content-Type: application/json" \
  -d '{"titre": "Python avancé", "auteur": "Jean Dupont", "isbn": "978-0001"}'
```

### Lister les livres
```bash
curl http://localhost:8001/api/livres
```

### Rechercher un livre
```bash
curl "http://localhost:8001/api/livres/search?q=python"
```

### Emprunter un livre (marquer indisponible)
```bash
curl -X PUT http://localhost:8001/api/livres/1 \
  -H "Content-Type: application/json" \
  -d '{"disponible": false}'
```

---

## 📁 Structure du projet
```
service-livres-dit/
├── main.py              # API FastAPI (6 routes)
├── requirements.txt     # Dépendances Python
├── Dockerfile           # Conteneurisation backend
├── docker-compose.yml   # Orchestration service + BDD
├── .env                 # Variables d'environnement
├── .gitignore
├── README.md
└── frontend/
    ├── index.html       # Interface web
    └── Dockerfile       # Conteneurisation frontend
```

---

## 🔗 Intégration avec les autres services

Le service Emprunts utilise ces 2 routes :
```
# Vérifier disponibilité avant emprunt
GET http://service-livres:8001/api/livres/{id}

# Mettre à jour après emprunt/retour
PUT http://service-livres:8001/api/livres/{id}
```

