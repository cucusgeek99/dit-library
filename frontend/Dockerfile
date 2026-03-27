# ---- Étape 1 : Build ----
FROM node:20-alpine AS builder

WORKDIR /app

# Build arg pour l'URL de l'API (injecté par docker-compose)
ARG VITE_API_URL=http://localhost:8000
ENV VITE_API_URL=$VITE_API_URL

# Installer les dépendances
COPY package*.json ./
RUN npm install

# Copier le code et builder
COPY . .
RUN npm run build

# ---- Étape 2 : Serveur de production Nginx ----
FROM nginx:alpine

# Copier le build dans le dossier Nginx
COPY --from=builder /app/dist /usr/share/nginx/html

# Copier la configuration Nginx personnalisée
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
