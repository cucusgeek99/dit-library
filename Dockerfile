# ─────────────────────────────────────────
# ETAPE 1 : Image de base
# On part d'une image Python officielle légère
# ─────────────────────────────────────────
FROM python:3.11-slim

# ─────────────────────────────────────────
# ETAPE 2 : Dossier de travail
# Tous nos fichiers seront dans /app
# à l'intérieur du conteneur
# ─────────────────────────────────────────
WORKDIR /app

# ─────────────────────────────────────────
# ETAPE 3 : Copier et installer les dépendances
# On copie requirements.txt EN PREMIER
# pour profiter du cache Docker
# ─────────────────────────────────────────
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# ─────────────────────────────────────────
# ETAPE 4 : Copier le reste du code
# ─────────────────────────────────────────
COPY . .

# ─────────────────────────────────────────
# ETAPE 5 : Déclarer le port
# ─────────────────────────────────────────
EXPOSE 8001

# ─────────────────────────────────────────
# ETAPE 6 : Démarrer l'application
# ─────────────────────────────────────────
CMD ["uvicorn", "app:app", "--host", "0.0.0.0", "--port", "8001"]