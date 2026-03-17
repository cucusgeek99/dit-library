# GUIDE DE DEMARAGE DDU PROJET AVEC DOCKER

Pour le faire il faut suivre les étapes ci-dessous

## 1- CREATION D'UN RESEAU 

```
docker netwrok create dit-library

## 2- RECUPERER l'image de MySql

```
docker pull mysql:8.4


## 3- RECUPERER l'image de PhpMyadmin 

Pour pouvoir gérer graphique la BD

```
docker pull phpmyadmin:latest


## 4- LANCER LE CONTENEUR MYSQL SUR LE RESEAU

```
docker run -d \
  --name mysql_server \
  --network dit-library \
  -e MYSQL_ROOT_PASSWORD=admin123 \
  -e MYSQL_DATABASE=dit-library-bd \
  -e MYSQL_USER=admin \
  -e MYSQL_PASSWORD=admin123 \
  -p 33060:3306 \
  -v mysqldata:/var/lib/mysql \
  mysql:8.4

## 5- LANCER LE CONTENEUR PHPMYADMIN SUR LE RESEAU

```

docker run -d \
  --name phpmyadmin \
  --network dit-library \
  -e PMA_HOST=mysql_server \
  -p 8081:80 \
  phpmyadmin:latest

Vous pouvez acceder à la page suivant sur un navigateur : http://localhost:8081/ 
Saisissez les identifiant : username : root, mot de pass : admin123 pour vous connecter à l'interface

