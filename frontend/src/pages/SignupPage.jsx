import AuthShell from "@/components/auth/AuthShell";
import SignupForm from "@/components/auth/SignupForm";

export default function SignupPage() {
  return (
    <AuthShell
      title="Créer un compte"
      subtitle="Enregistrez un nouveau compte pour accéder à la plateforme."
    >
      <SignupForm />
    </AuthShell>
  );
}
