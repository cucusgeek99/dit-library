import { BookOpen, Users, Repeat, UserCircle } from "lucide-react"

export const navigationItems = [
    {
        to: "/books",
        label: "Livres",
        icon: BookOpen,
        roles: ["super_admin", "agent_bibliotheque"],
    },
    {
        to: "/loans",
        label: "Emprunts",
        icon: Repeat,
        roles: ["super_admin", "agent_bibliotheque"],
    },
    {
        to: "/users",
        label: "Utilisateurs",
        icon: Users,
        roles: ["super_admin", "gestion_utilisateurs"],
    },
    {
        to: "/profile",
        label: "Profil",
        icon: UserCircle,
        roles: [
            "super_admin",
            "agent_bibliotheque",
            "gestion_utilisateurs",
            "lecteur",
        ],
    },
]