import {
  Mail,
  Building2,
  UserCircle2,
  ShieldCheck,
  KeyRound,
  LogOut,
  Clock3,
  CalendarDays,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";

const ROLE_LABELS = {
  Etudiant: "Étudiant",
  Professeur: "Professeur",
  "Personnel administratif": "Personnel administratif",
};

export default function ProfilePage() {
  const { user: authUser, logout } = useAuth();
  const navigate = useNavigate();

  const user = {
    fullName: authUser?.full_name ?? "—",
    email: authUser?.email ?? "—",
    role: ROLE_LABELS[authUser?.user_type] ?? authUser?.user_type ?? "—",
    status: "Actif",
    institution: "Dakar Institute of Technology",
    department: "Bibliothèque numérique",
    joinedAt: "—",
  };

  const activities = [
    {
      title: "Mise à jour du catalogue",
      description: "Un nouvel ouvrage a été ajouté à la bibliothèque.",
      time: "Il y a 2 heures",
    },
    {
      title: "Contrôle des accès",
      description: "Les autorisations d’un utilisateur ont été vérifiées.",
      time: "Aujourd’hui, 09:20",
    },
    {
      title: "Suivi des emprunts",
      description: "Vérification des retards et des livres retournés.",
      time: "Hier, 16:45",
    },
  ];

  const handleChangePassword = () => {
    // à implémenter
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="space-y-8">
      <div className="space-y-1">
        <h1 className="text-3xl font-semibold tracking-tight text-slate-900">
          Profil
        </h1>
        <p className="text-sm text-slate-500">
          Consultez les informations liées à votre compte.
        </p>
      </div>

      <div className="grid gap-6 xl:grid-cols-[320px_minmax(0,1fr)]">
        <div className="space-y-6">
          <Card className="rounded-3xl border border-[#154854]/50 bg-white shadow-sm shadow-[#154854]">
            <CardContent className="p-6">
              <div className="flex flex-col items-center text-center">
                <div className="flex h-20 w-20 items-center justify-center rounded-3xl bg-[#154854] text-2xl font-semibold text-white">
                  DB
                </div>

                <h2 className="mt-4 text-2xl font-semibold text-slate-900">
                  {user.fullName}
                </h2>

                <p className="mt-1 text-sm text-slate-500">{user.email}</p>

                <div className="mt-4 flex flex-wrap justify-center gap-2">
                  <Badge className="rounded-full bg-[#154854] px-3 py-1 text-white hover:bg-[#154854]">
                    {user.role}
                  </Badge>
                  <Badge className="rounded-full bg-emerald-100 px-3 py-1 text-emerald-700 hover:bg-emerald-100">
                    {user.status}
                  </Badge>
                </div>
              </div>

              <div className="mt-6 space-y-3 border-t border-slate-200/40 pt-6">
                <Button
                  onClick={handleChangePassword}
                  className="w-full justify-start rounded-2xl bg-[#154854] text-white hover:bg-[#123e48]"
                >
                  <KeyRound className="mr-2 h-4 w-4" />
                  Changer le mot de passe
                </Button>

                <Button
                  variant="outline"
                  onClick={handleLogout}
                  className="w-full justify-start rounded-2xl border border-slate-200/40 text-red-600 hover:bg-red-50 hover:text-red-600"
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  Déconnexion
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="rounded-3xl border border-[#154854]/50 bg-white shadow-sm shadow-[#154854]">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-semibold text-slate-900">
                Informations du compte
              </CardTitle>
              <CardDescription className="text-slate-500">
                Détails principaux liés à votre identité utilisateur.
              </CardDescription>
            </CardHeader>

            <CardContent>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="rounded-2xl border border-slate-200/40 bg-slate-50/60 p-4">
                  <div className="flex items-start gap-3">
                    <Mail className="mt-0.5 h-4 w-4 text-[#154854]" />
                    <div>
                      <p className="text-sm text-slate-500">Adresse e-mail</p>
                      <p className="mt-1 font-medium text-slate-900">
                        {user.email}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="rounded-2xl border border-slate-200/40 bg-slate-50/60 p-4">
                  <div className="flex items-start gap-3">
                    <Mail className="mt-0.5 h-4 w-4 text-[#154854]" />
                    <div>
                      <p className="text-sm text-slate-500">Type de compte</p>
                      <p className="mt-1 font-medium text-slate-900">
                        {user.role}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="rounded-2xl border border-slate-200/40 bg-slate-50/60 p-4">
                  <div className="flex items-start gap-3">
                    <UserCircle2 className="mt-0.5 h-4 w-4 text-[#154854]" />
                    <div>
                      <p className="text-sm text-slate-500">Nom complet</p>
                      <p className="mt-1 font-medium text-slate-900">
                        {user.fullName}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="rounded-2xl border border-slate-200/40 bg-slate-50/60 p-4">
                  <div className="flex items-start gap-3">
                    <ShieldCheck className="mt-0.5 h-4 w-4 text-[#154854]" />
                    <div>
                      <p className="text-sm text-slate-500">Rôle</p>
                      <p className="mt-1 font-medium text-slate-900">
                        {user.role}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="rounded-2xl border border-slate-200/40 bg-slate-50/60 p-4">
                  <div className="flex items-start gap-3">
                    <Building2 className="mt-0.5 h-4 w-4 text-[#154854]" />
                    <div>
                      <p className="text-sm text-slate-500">Institution</p>
                      <p className="mt-1 font-medium text-slate-900">
                        {user.institution}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="rounded-2xl border border-slate-200/40 bg-slate-50/60 p-4">
                  <div className="flex items-start gap-3">
                    <Building2 className="mt-0.5 h-4 w-4 text-[#154854]" />
                    <div>
                      <p className="text-sm text-slate-500">Service</p>
                      <p className="mt-1 font-medium text-slate-900">
                        {user.department}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="rounded-2xl border border-slate-200/40 bg-slate-50/60 p-4 md:col-span-2">
                  <div className="flex items-start gap-3">
                    <CalendarDays className="mt-0.5 h-4 w-4 text-[#154854]" />
                    <div>
                      <p className="text-sm text-slate-500">
                        Date d’intégration
                      </p>
                      <p className="mt-1 font-medium text-slate-900">
                        {user.joinedAt}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-3xl border border-[#154854]/50 bg-white shadow-sm shadow-[#154854]">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-semibold text-slate-900">
                Activité récente
              </CardTitle>
              <CardDescription className="text-slate-500">
                Historique synthétique des dernières actions.
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-3">
              {activities.map((activity, index) => (
                <div
                  key={index}
                  className="rounded-2xl border border-slate-200/40 bg-slate-50/60 p-4"
                >
                  <div className="flex items-start gap-3">
                    <Clock3 className="mt-0.5 h-4 w-4 text-[#154854]" />
                    <div className="min-w-0">
                      <p className="font-medium text-slate-900">
                        {activity.title}
                      </p>
                      <p className="mt-1 text-sm text-slate-500">
                        {activity.description}
                      </p>
                      <p className="mt-2 text-xs text-slate-400">
                        {activity.time}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
