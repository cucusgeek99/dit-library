import { BookOpen, Users, Repeat, UserCircle } from "lucide-react";

export const navigationItems = [
    {
        to: "/books",
        label: "Livres",
        icon: BookOpen,
        roles: ["Personnel administratif", "Professeur", "Etudiant"],
    },
    {
        to: "/users",
        label: "Utilisateurs",
        icon: Users,
        roles: ["Personnel administratif"],
    },
    {
        to: "/loans",
        label: "Emprunts",
        icon: Repeat,
        roles: ["Personnel administratif", "Professeur", "Etudiant"],
    },
    {
        to: "/profile",
        label: "Profil",
        icon: UserCircle,
        roles: ["Personnel administratif", "Professeur", "Etudiant"],
    },
];