# DIT Library API

Ce projet est une API développée avec FastAPI pour gérer la bibliothèque du Dakar Institut of Technology (DIT).

## Prérequis
- Python 3.8 ou supérieur
- pip (gestionnaire de paquets Python)

## Installation et lancement

### 1. Cloner le projet
```
git clone <url-du-repo>
cd dit-library-api

### 2. Création d'un environnement viruel
```
python3 -m venv .venv
source .venv/bin/activate # pour linux
.venv/Scripts/activate # pour windows

### 3. Installer les dépendances
```
pip install -r requirements.txt
```

### 4. Lancer l'API
```
uvicorn main:app --reload
```

- `main` : nom du fichier principal (modifiez si besoin)
- `app` : nom de l'instance FastAPI
- `--reload` : pour le développement (recharge automatique)

L'API sera accessible sur [http://localhost:8000](http://localhost:8000).

## Compatibilité
Ce projet fonctionne sur tous les systèmes d'exploitation (Windows, macOS, Linux) tant que Python et pip sont installés.

## Documentation
La documentation interactive est disponible sur [http://localhost:8000/docs](http://localhost:8000/docs).
