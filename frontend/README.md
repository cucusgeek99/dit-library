# DIT Library — Frontend

Interface web du système de gestion de bibliothèque numérique du **Dakar Institut of Technology**.
Développée dans le cadre de l'examen pratique DevOps.

## Stack technique

- **React 19** — bibliothèque UI
- **Vite** — build tool et serveur de développement
- **Tailwind CSS** — styles utilitaires
- **ShadCN UI** — composants UI (Button, Dialog, Table, Badge...)
- **Lucide React** — icônes
- **React Router v6** — routing côté client
- **Axios** — appels HTTP vers le backend

---

## Prérequis

Le backend FastAPI doit être lancé sur http://localhost:8000 avant de démarrer le frontend.
Voir `../backend/README.md` pour l'installation du backend.

---

## Installation et lancement

```bash
npm install
npm run dev
```

Application disponible sur http://localhost:5173

---

## Structure du projet

```
frontend/
├── public/
└── src/
    ├── components/
    │   ├── auth/           # LoginForm, SignupForm
    │   ├── books/          # BooksTable, AddBookDialog
    │   ├── loans/          # LoansTable, AddLoanDialog
    │   ├── users/          # UsersTable, AddUserDialog
    │   ├── common/         # InfoCard, TablePagination
    │   └── layout/         # AppLayout, RoleGuard
    ├── context/
    │   └── AuthContext.jsx # Authentification (login, logout, token)
    ├── lib/
    │   └── api.js          # Instance Axios + fonctions d'appel API
    ├── pages/
    │   ├── LoginPage.jsx
    │   ├── SignupPage.jsx
    │   ├── BooksPage.jsx
    │   ├── UsersPage.jsx
    │   ├── LoansPage.jsx
    │   └── ProfilePage.jsx
    ├── routes/
    │   └── AppRoutes.jsx   # Routes protégées par rôle
    ├── App.jsx
    └── main.jsx
```

---

## Pages et accès par rôle

| Route      | Description              | Rôles autorisés                           |
|------------|--------------------------|-------------------------------------------|
| `/login`   | Connexion                | Tous                                      |
| `/signup`  | Création de compte       | Tous                                      |
| `/books`   | Gestion des livres       | Personnel administratif, Professeur, Etudiant |
| `/users`   | Gestion des utilisateurs | Personnel administratif uniquement        |
| `/loans`   | Gestion des emprunts     | Personnel administratif, Professeur, Etudiant |
| `/profile` | Profil utilisateur       | Tous (connectés)                          |

---

## Authentification

Le token JWT est stocké dans le `localStorage` après connexion (`access_token` et `user`).
Il est automatiquement attaché à chaque requête API via un intercepteur Axios.

La session est restaurée au rechargement de la page.
La déconnexion efface le `localStorage` et redirige vers `/login`.

---

## Connexion au backend

L'URL du backend est contrôlée par la variable d'environnement `VITE_API_URL` (injectée à la compilation).

| Contexte       | Valeur de `VITE_API_URL`  | Comportement                              |
|----------------|---------------------------|-------------------------------------------|
| Développement  | _(non définie)_           | Requêtes vers `http://localhost:8000`     |
| Docker (prod)  | `/api`                    | Requêtes proxifiées par Nginx → backend   |

Configuration dans `src/lib/api.js` :

```js
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:8000",
});
```

Pour changer l'URL en développement, créer un fichier `.env.local` :

```env
VITE_API_URL=http://mon-serveur:8000
```
