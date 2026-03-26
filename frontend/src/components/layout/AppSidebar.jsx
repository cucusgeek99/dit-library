import { NavLink } from "react-router-dom";
import { X } from "lucide-react";
import { navigationItems } from "@/data/navigation";

export default function AppSidebar({
  role = "super_admin",
  mobileOpen = false,
  setMobileOpen,
}) {
  const filteredLinks = navigationItems.filter((item) =>
    item.roles.includes(role)
  );

  const getRoleLabel = () => {
    if (role === "Personnel administratif") return "Personnel administratif";
    if (role === "Professeur") return "Professeur";
    if (role === "Etudiant") return "Étudiant";
    return "Utilisateur";
  };

  const sidebarContent = (
    <div className="flex h-full flex-col bg-[#154854] text-white">
      <div className="border-b border-white/10 px-4 py-4">
        <div className="rounded-2xl bg-white/5 p-3 backdrop-blur-sm">
          <div className="flex items-start justify-between gap-3">
            <img
              src="/logo.png"
              alt="DIT Dakar Institute of Technology"
              className="h-14 w-full object-contain object-left"
            />

            <button
              onClick={() => setMobileOpen(false)}
              className="rounded-xl p-2 transition hover:bg-white/10 md:hidden"
            >
              <X size={18} />
            </button>
          </div>

          <p className="mt-3 text-xs text-white/65">
            Système de gestion de bibliothèque
          </p>
        </div>
      </div>

      <nav className="flex-1 space-y-2 p-4">
        {filteredLinks.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            onClick={() => setMobileOpen(false)}
            className={({ isActive }) =>
              `flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium transition-all ${
                isActive
                  ? "bg-white text-[#154854] shadow-sm"
                  : "text-white/85 hover:bg-white/10"
              }`
            }
          >
            <Icon size={18} />
            <span>{label}</span>
          </NavLink>
        ))}
      </nav>

      <div className="p-4">
        <div className="rounded-2xl border border-white/10 bg-white/10 p-4 backdrop-blur-sm">
          <p className="text-[11px] uppercase tracking-[0.18em] text-white/55">
            Rôle
          </p>
          <p className="mt-2 text-sm font-semibold">{getRoleLabel()}</p>
        </div>
      </div>
    </div>
  );

  return (
    <>
      <aside className="hidden h-full md:flex md:flex-col">
        {sidebarContent}
      </aside>

      {mobileOpen && (
        <>
          <div
            className="fixed inset-0 z-40 bg-black/40 backdrop-blur-[1px] md:hidden"
            onClick={() => setMobileOpen(false)}
          />
          <aside className="fixed inset-y-0 left-0 z-50 w-72 shadow-2xl md:hidden">
            {sidebarContent}
          </aside>
        </>
      )}
    </>
  );
}
