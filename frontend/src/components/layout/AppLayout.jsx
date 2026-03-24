import { Outlet } from "react-router-dom";
import { useState } from "react";
import AppNavbar from "./AppNavbar";
import AppSidebar from "./AppSidebar";

export default function AppLayout({
  role = "super_admin",
  user = {
    nom: "Don Bosenga",
    email: "don@example.com",
  },
}) {
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = () => {
    console.log("User logged out");
  };

  return (
    <div className="h-screen overflow-hidden bg-slate-50">
      <div className="flex h-full">
        <div className="hidden w-72 shrink-0 md:block">
          <div className="h-full">
            <AppSidebar
              role={role}
              mobileOpen={mobileOpen}
              setMobileOpen={setMobileOpen}
            />
          </div>
        </div>

        <div className="flex min-w-0 flex-1 flex-col">
          <AppNavbar
            role={role}
            user={user}
            onMenuClick={() => setMobileOpen(true)}
            onLogout={handleLogout}
          />

          <main className="flex-1 overflow-y-auto p-4 md:p-6">
            <Outlet />
          </main>
        </div>
      </div>

      <div className="md:hidden">
        <AppSidebar
          role={role}
          mobileOpen={mobileOpen}
          setMobileOpen={setMobileOpen}
        />
      </div>
    </div>
  );
}
