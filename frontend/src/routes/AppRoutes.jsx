import { Navigate, Route, Routes } from "react-router-dom";
import AppLayout from "@/components/layout/AppLayout";
import RoleGuard from "@/components/layout/RoleGuard";
import LoginPage from "@/pages/LoginPage";
import SignupPage from "@/pages/SignupPage";
import BooksPage from "@/pages/BooksPage";
import UsersPage from "@/pages/UsersPage";
import LoansPage from "@/pages/LoansPage";
import ProfilePage from "@/pages/ProfilePage";
import { getStoredUser, isAuthenticated } from "@/lib/auth";

export default function AppRoutes() {
  const authenticated = isAuthenticated();
  const storedUser = getStoredUser();

  const currentUser = storedUser
    ? {
        nom: storedUser.full_name,
        email: storedUser.email,
        role: storedUser.user_type,
      }
    : null;

  return (
    <Routes>
      {!authenticated ? (
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
            {/* <Route path="/" element={<HomePage />} /> */}

            <Route
              path="/books"
              element={
                <RoleGuard
                  userRole={currentUser.role}
                  allowedRoles={[
                    "Personnel administratif",
                    "Professeur",
                    "Etudiant",
                  ]}
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
                  allowedRoles={["Personnel administratif"]}
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
                  allowedRoles={[
                    "Personnel administratif",
                    "Professeur",
                    "Etudiant",
                  ]}
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
