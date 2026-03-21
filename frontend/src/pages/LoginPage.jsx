import AuthShell from "@/components/auth/AuthShell";
import LoginForm from "@/components/auth/LoginForm";

export default function LoginPage() {
  return (
    <AuthShell
      title="Connexion"
      subtitle="Accédez à votre espace de gestion de bibliothèque."
    >
      <LoginForm />
    </AuthShell>
  );
}
