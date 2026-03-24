import { Navigate, Route, Routes } from "react-router-dom";
import AppLayout from "@/components/layout/AppLayout";
import RoleGuard from "@/components/layout/RoleGuard";
import LoginPage from "@/pages/LoginPage";
import SignupPage from "@/pages/SignupPage";
import BooksPage from "@/pages/BooksPage";
import UsersPage from "@/pages/UsersPage";
import LoansPage from "@/pages/LoansPage";
import ProfilePage from "@/pages/ProfilePage";

export default function AppRoutes() {
  const isAuthenticated = false;

  const currentUser = {
    nom: "Don Bosenga",
    email: "don@example.com",
    role: "super_admin",
  };

  return (
    <Routes>
      {!isAuthenticated ? (
        <>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </>
      ) : (
        <>
          <Route
            element={<AppLayout role={currentUser.role} user={currentUser} />}
          >
            <Route path="/" element={<Navigate to="/books" replace />} />

            <Route
              path="/books"
              element={
                <RoleGuard
                  userRole={currentUser.role}
                  allowedRoles={["super_admin", "agent_bibliotheque"]}
                >
                  <BooksPage />
                </RoleGuard>
              }
            />

            <Route
              path="/users"
              element={
                <RoleGuard
                  userRole={currentUser.role}
                  allowedRoles={["super_admin", "gestion_utilisateurs"]}
                >
                  <UsersPage />
                </RoleGuard>
              }
            />

            <Route
              path="/loans"
              element={
                <RoleGuard
                  userRole={currentUser.role}
                  allowedRoles={["super_admin", "agent_bibliotheque"]}
                >
                  <LoansPage />
                </RoleGuard>
              }
            />

            <Route path="/profile" element={<ProfilePage />} />
          </Route>

          <Route path="*" element={<Navigate to="/" replace />} />
        </>
      )}
    </Routes>
  );
}
