import { Bell, Menu, ChevronDown, LogOut, UserCircle2 } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function AppNavbar({
  onMenuClick,
  role = "super_admin",
  user = {
    nom: "Don Bosenga",
    email: "don@example.com",
  },
  onLogout = () => console.log("Logout clicked"),
}) {
  const getRoleLabel = () => {
    if (role === "super_admin") return "Super administrateur";
    if (role === "agent_bibliotheque") return "Agent de bibliothèque";
    if (role === "gestion_utilisateurs") return "Gestionnaire utilisateurs";
    if (role === "lecteur") return "Lecteur";
    return "Utilisateur";
  };

  const initials = user.nom
    ?.split(" ")
    .map((part) => part[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <header className="z-20 h-20 shrink-0 border-b border-slate-200/60 bg-white/95 backdrop-blur">
      <div className="flex h-full items-center justify-between px-4 md:px-6">
        <div className="flex items-center gap-3">
          <button
            onClick={onMenuClick}
            className="rounded-2xl border border-slate-200 bg-white p-2.5 transition hover:bg-slate-50 md:hidden"
          >
            <Menu size={20} className="text-slate-700" />
          </button>

          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#154854] shadow-sm">
            <img
              src="/logo-dit.png"
              alt="DIT"
              className="h-7 w-7 object-contain"
            />
          </div>

          <div>
            <h2 className="text-xl font-semibold tracking-tight text-[#154854] md:text-2xl">
              Gestion de bibliothèque
            </h2>
            <p className="hidden text-sm text-slate-500 sm:block">
              Espace de gestion des ressources documentaires
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button className="relative rounded-2xl border border-slate-200/70 bg-white p-2.5 shadow-sm shadow-slate-200/30 transition hover:bg-slate-50">
            <Bell size={18} className="text-slate-700" />
            <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-[#154854]" />
          </button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="flex items-center gap-3 rounded-2xl border border-slate-200/70 bg-white px-3 py-2 shadow-sm shadow-slate-200/30 transition hover:bg-slate-50 focus:outline-none">
                <Avatar className="h-11 w-11 border border-slate-200">
                  <AvatarImage src="" alt={user.nom} />
                  <AvatarFallback className="bg-[#154854] text-sm font-bold text-white">
                    {initials || "DB"}
                  </AvatarFallback>
                </Avatar>

                <div className="hidden text-left sm:block">
                  <p className="text-sm font-semibold leading-none text-[#154854]">
                    {user.nom}
                  </p>
                  <p className="mt-1 text-xs text-slate-500">
                    {getRoleLabel()}
                  </p>
                </div>

                <ChevronDown
                  size={16}
                  className="hidden text-slate-500 sm:block"
                />
              </button>
            </DropdownMenuTrigger>

            <DropdownMenuContent
              align="end"
              className="w-64 rounded-2xl border border-slate-200/70 bg-white p-2 shadow-xl shadow-slate-200/40"
            >
              <div className="px-2 py-2">
                <p className="text-sm font-semibold text-[#154854]">
                  {user.nom}
                </p>
                <p className="text-xs text-slate-500">{user.email}</p>
                <p className="mt-1 text-xs text-[#154854]">{getRoleLabel()}</p>
              </div>

              <DropdownMenuSeparator className="bg-slate-200/70" />

              <DropdownMenuItem className="cursor-pointer rounded-xl text-slate-700 focus:bg-slate-100 focus:text-[#154854]">
                <UserCircle2 className="mr-2 h-4 w-4" />
                Mon profil
              </DropdownMenuItem>

              <DropdownMenuItem
                onClick={onLogout}
                className="cursor-pointer rounded-xl text-red-600 focus:bg-red-50 focus:text-red-600"
              >
                <LogOut className="mr-2 h-4 w-4" />
                Déconnexion
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
