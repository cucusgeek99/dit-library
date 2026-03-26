import { Navigate, Route, Routes } from "react-router-dom";
import AppLayout from "@/components/layout/AppLayout";
import RoleGuard from "@/components/layout/RoleGuard";
import LoginPage from "@/pages/LoginPage";
import SignupPage from "@/pages/SignupPage";
import BooksPage from "@/pages/BooksPage";
import UsersPage from "@/pages/UsersPage";
import LoansPage from "@/pages/LoansPage";
import ProfilePage from "@/pages/ProfilePage";
import { useAuth } from "@/context/AuthContext";

const ROLE_MAP = {
  Etudiant: "etudiant",
  Professeur: "agent_bibliotheque",
  "Personnel administratif": "super_admin",
};

export default function AppRoutes() {
  const { user, token } = useAuth();
  const isAuthenticated = !!token;

  const role = user ? (ROLE_MAP[user.user_type] ?? "etudiant") : "etudiant";
  const currentUser = user
    ? { nom: user.full_name, email: user.email, role }
    : null;

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
                  allowedRoles={["super_admin", "agent_bibliotheque", "etudiant"]}
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
                  allowedRoles={["super_admin"]}
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
                  allowedRoles={["super_admin", "agent_bibliotheque", "etudiant"]}
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
