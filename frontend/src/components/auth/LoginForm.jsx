import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { loginUser } from "@/services/authService";
import { saveAuthData } from "@/lib/auth";

export default function LoginForm() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrorMessage("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage("");

    try {
      const payload = {
        email: formData.email,
        password: formData.password,
      };

      const data = await loginUser(payload);

      saveAuthData({
        access_token: data.access_token,
        refresh_token: data.refresh_token,
        token_type: data.token_type,
        user: data.user,
      });

      window.location.href = "/books";
    } catch (error) {
      console.error("Erreur de connexion :", error);

      const detail = error.response?.data?.detail;

      if (typeof detail === "string") {
        setErrorMessage(detail);
      } else if (Array.isArray(detail) && detail.length > 0) {
        setErrorMessage(detail[0]?.msg || "Requête invalide.");
      } else {
        setErrorMessage("Impossible de se connecter au serveur.");
      }
    } finally {
      setLoading(false);
    }
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
              placeholder="Entrez votre mot de passe"
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

        {errorMessage && (
          <div className="rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-600">
            {errorMessage}
          </div>
        )}

        <div className="flex items-center justify-between text-sm">
          <label className="flex items-center gap-2 text-slate-500">
            <input type="checkbox" className="rounded border-slate-300" />
            Se souvenir de moi
          </label>

          <button
            type="button"
            className="font-medium text-[#154854] hover:underline"
          >
            Mot de passe oublié ?
          </button>
        </div>

        <Button
          type="submit"
          disabled={loading}
          className="h-12 w-full rounded-2xl bg-[#154854] text-base font-medium text-white hover:bg-[#123e48]"
        >
          {loading ? "Connexion en cours..." : "Se connecter"}
        </Button>
      </form>

      <p className="mt-7 text-center text-sm text-slate-500">
        Vous n’avez pas de compte ?{" "}
        <Link
          to="/signup"
          className="font-medium text-[#154854] hover:underline"
        >
          Créer un compte
        </Link>
      </p>
    </div>
  );
}
