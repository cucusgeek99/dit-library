import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function SignupForm() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    role: "lecteur",
    password: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Signup:", formData);
    navigate("/login");
  };

  return (
    <div className="rounded-4xl bg-white p-7 shadow-xl shadow-slate-200/30 md:p-8">
      <div className="mb-8 flex items-center justify-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-3xl bg-[#154854] text-white shadow-sm">
          <img
            src="/logo-dit.png"
            alt="DIT"
            className="h-10 w-10 object-contain"
          />
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid gap-2.5">
          <Label
            htmlFor="fullName"
            className="text-sm font-medium text-slate-700"
          >
            Nom complet
          </Label>
          <Input
            id="fullName"
            name="fullName"
            placeholder="Entrez votre nom complet"
            value={formData.fullName}
            onChange={handleChange}
            className="h-12 rounded-2xl border-slate-200/40 px-4 text-base shadow-none"
          />
        </div>

        <div className="grid gap-2.5">
          <Label htmlFor="email" className="text-sm font-medium text-slate-700">
            Adresse e-mail
          </Label>
          <Input
            id="email"
            name="email"
            type="email"
            placeholder="Entrez votre adresse e-mail"
            value={formData.email}
            onChange={handleChange}
            className="h-12 rounded-2xl border-slate-200/40 px-4 text-base shadow-none"
          />
        </div>

        <div className="grid gap-2.5">
          <Label htmlFor="role" className="text-sm font-medium text-slate-700">
            Type de compte
          </Label>
          <select
            id="role"
            name="role"
            value={formData.role}
            onChange={handleChange}
            className="flex h-12 w-full rounded-2xl border border-slate-200/40 bg-white px-4 text-base outline-none focus:border-[#154854]"
          >
            <option value="lecteur">Lecteur</option>
            <option value="agent_bibliotheque">Agent de bibliothèque</option>
            <option value="gestion_utilisateurs">
              Gestionnaire utilisateurs
            </option>
            <option value="super_admin">Super administrateur</option>
          </select>
        </div>

        <div className="grid gap-2.5">
          <Label
            htmlFor="password"
            className="text-sm font-medium text-slate-700"
          >
            Mot de passe
          </Label>
          <div className="relative">
            <Input
              id="password"
              name="password"
              type={showPassword ? "text" : "password"}
              placeholder="Créez un mot de passe"
              value={formData.password}
              onChange={handleChange}
              className="h-12 rounded-2xl border-slate-200/40 px-4 pr-12 text-base shadow-none"
            />
            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400"
            >
              {showPassword ? (
                <EyeOff className="h-4 w-4" />
              ) : (
                <Eye className="h-4 w-4" />
              )}
            </button>
          </div>
        </div>

        <Button
          type="submit"
          className="h-12 w-full rounded-2xl bg-[#154854] text-base font-medium text-white hover:bg-[#123e48]"
        >
          Créer un compte
        </Button>
      </form>

      <p className="mt-7 text-center text-sm text-slate-500">
        Vous avez déjà un compte ?{" "}
        <Link
          to="/login"
          className="font-medium text-[#154854] hover:underline"
        >
          Se connecter
        </Link>
      </p>
    </div>
  );
}
