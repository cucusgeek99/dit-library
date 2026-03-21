# 📚 Bibliothèque Numérique Microservices - Frontend

## 🧾 Introduction

Ce projet est le **frontend d’un système de gestion de la bibliothèque numérique** développé dans le cadre de **l'examen pratique DevOps**.

L’application a pour objectif de fournir une interface moderne permettant de gérer efficacement :

- les livres 📖  
- les utilisateurs 👥  
- les emprunts 🔄  
<!-- - les profils 👤   -->

---

## 🚀 Lancer le projet en local (après clonage)

### 1. Cloner le projet

```bash
git clone <URL_DU_REPO>
cd frontend-library
```

### 2. Installer les dépendances

```bash
npm install
```

### 3. Lancer le serveur de développement

```bash
npm run dev
```

### 4. Accéder à l’application
Ouvrez votre navigateur et rendez-vous à l’adresse suivante :

```
http://localhost:5173
```
---

## 🛠️ Technologies utilisées
- **React** : Bibliothèque JavaScript pour construire des interfaces utilisateur.
- **Vite** : Outil de build rapide pour les projets frontend.
- **Tailwind CSS** : Framework CSS utilitaire pour un design rapide et responsive.
- **ShadCN UI** : Composants UI modernes et personnalisables pour React.
- **React Router DOM**
- **Lucide React** pour les icônes

---
## 📁 Structure du projet
```
frontend-library/
├── public/             # Fichiers statiques
├── src/                # Code source de l'application
│   ├── components/     # Composants réutilisables
|   ├── data/           # Fichiers de données (ex: livres, utilisateurs)
│   ├── pages/          # Pages de l'application
|   ├── routes/         # Configuration des routes
│   ├── App.jsx         # Composant principal
|   ├── index.css       # Styles globaux
│   └── main.jsx        # Point d'entrée de l'application
├── package.json        # Dépendances et scripts
├── vite.config.js      # Configuration de Vite
└── README.md           # Documentation du projet
```
---

