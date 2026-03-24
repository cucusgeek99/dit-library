import { Navigate } from "react-router-dom";

export default function RoleGuard({ userRole, allowedRoles = [], children }) {
  const isAllowed = allowedRoles.includes(userRole);

  if (!isAllowed) {
    return <Navigate to="/profile" replace />;
  }

  return children;
}
