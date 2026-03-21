# 📚 Bibliothèque Numérique Microservices - Frontend

## 🧾 Introduction

Ce projet est le **frontend d’un système de gestion de la bibliothèque numérique** développé dans le cadre de **l'examen pratique DevOps**.

L’application a pour objectif de fournir une interface moderne permettant de gérer efficacement :

- les livres 📖
- les utilisateurs 👥
- les emprunts 🔄
<!-- - les profils 👤   -->

---

## 🚀 Lancer le projet en local

### 1. Cloner le projet

```bash
git clone https://github.com/DonBos27/gestion-bibliotheque-frontend
cd frontend-library
```

### 2. Installer les dépendances

#### Dépendances générales

```bash
npm install
```

#### Tailwind CSS

```bash
npm install tailwindcss @tailwindcss/vite
```

#### ShadCN UI

Initialisation de ShadCN UI :

```bash
npx shadcn@latest init -t vite
```

Installation des composants ShadCN UI :

```bash
npx shadcn@latest add button
npx shadcn@latest add input
npx shadcn@latest add label
npx shadcn@latest add dialog
npx shadcn@latest add table
npx shadcn@latest add badge
npx shadcn@latest add alert-dialog
npx shadcn@latest add dropdown-menu
npx shadcn@latest add avatar
npx shadcn@latest add card
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

## 💻 Pages disponibles

Selon la configuration actuelle, les principales routes sont :

- /login → page de connexion
- /signup → page de création de compte
- /books → gestion des livres
- /users → gestion des utilisateurs
- /loans → gestion des emprunts
- /profile → profil utilisateur

---
