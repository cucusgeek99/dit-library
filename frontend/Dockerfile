# Image nginx légère pour servir les fichiers HTML
FROM nginx:alpine

# Copier tous les fichiers frontend dans nginx
COPY . /usr/share/nginx/html

# Port 80 par défaut de nginx
EXPOSE 80

# Démarrer nginx
CMD ["nginx", "-g", "daemon off;"]