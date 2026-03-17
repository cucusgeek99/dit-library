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
- source .venv/bin/activate # pour linux 
- .venv/Scripts/activate # pour windows

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


## UTILISATION DU PACKAGE ALEMBIC
Le package alembic nous permet de gérer proprement notre base de données

# INSTALLATION
pip install alembic

# INITIALISATION
alembic init alembic

# CONFIGURATION
- Dans le fichier alembic.ini
Ouvrez le fichier alembic.ini qui se trouve à la racine du projet, cherchez la ligne : 
sqlalchemy.url = mettez votre chaine de connexion ici

- Dans le fichier : env.py
Rendez vous dans : alembic/env.py et modifier rajouter ceci 
* from db.database import Base 
pour importe la Base

* from models.models import *
pour importer tous nos models afin que alembic soit au courant des models

* target_metadata = Base.metadata
recherchez la ligne target_metadata = None, enlevez le None et mettez les metadata de la Base

# LES MIGRATIONS
- alembic revision --autogenerate -m "Message ici"
- alembic upgrade head