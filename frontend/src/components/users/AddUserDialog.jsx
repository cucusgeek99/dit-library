import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

const initialForm = {
  fullName: "",
  email: "",
  userType: "Etudiant",
  password: "",
};

export default function AddUserDialog({
  onSaveUser,
  onEditUser,
  editUser = null,
}) {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState(initialForm);

  const isEditMode = Boolean(editUser);

  useEffect(() => {
    if (editUser) {
      setFormData({
        fullName: editUser.fullName || "",
        email: editUser.email || "",
        userType: editUser.userType || "Etudiant",
        password: "",
      });
      setOpen(true);
    }
  }, [editUser]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const resetForm = () => {
    setFormData(initialForm);
  };

  const handleClose = () => {
    setOpen(false);
    resetForm();
    if (isEditMode && onEditUser) {
      onEditUser(null);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.fullName.trim() || !formData.email.trim()) {
      return;
    }

    const payload = {
      fullName: formData.fullName.trim(),
      email: formData.email.trim(),
      userType: formData.userType,
      password: formData.password,
    };

    if (isEditMode) {
      onSaveUser({ ...editUser, ...payload });
    } else {
      onSaveUser(payload);
    }

    handleClose();
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(value) => (!value ? handleClose() : setOpen(value))}
    >
      {!isEditMode && (
        <DialogTrigger asChild>
          <Button className="rounded-xl text-white px-3 py-5 bg-[#154854] hover:bg-[#123e48]">
            + Ajouter un utilisateur
          </Button>
        </DialogTrigger>
      )}

      <DialogContent className="sm:max-w-140 rounded-2xl border border-slate-200/70 bg-white shadow-xl shadow-slate-200/40">
        <DialogHeader>
          <DialogTitle>
            {isEditMode ? "Modifier l’utilisateur" : "Ajouter un utilisateur"}
          </DialogTitle>
          <DialogDescription>
            {isEditMode
              ? "Mettez à jour les informations de l’utilisateur."
              : "Renseignez les informations du nouvel utilisateur."}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="fullName">Nom complet</Label>
              <Input
                id="fullName"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                placeholder="Ex. Alice Johnson"
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="email">Adresse e-mail</Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Ex. alice@dit.ac.za"
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="userType">Type d’utilisateur</Label>
              <select
                id="userType"
                name="userType"
                value={formData.userType}
                onChange={handleChange}
                className="flex h-10 w-full rounded-xl border border-slate-200/70 bg-background px-3 py-2 text-sm outline-none focus:border-[#154854]"
              >
                <option value="Etudiant">Étudiant</option>
                <option value="Professeur">Professeur</option>
                <option value="Personnel administratif">Personnel administratif</option>
              </select>
            </div>

            {!isEditMode && (
              <div className="grid gap-2">
                <Label htmlFor="password">Mot de passe</Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Mot de passe"
                  required
                />
              </div>
            )}
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              className="rounded-xl border-slate-200/70"
              onClick={handleClose}
            >
              Annuler
            </Button>
            <Button
              type="submit"
              className="rounded-xl text-white bg-[#154854] hover:bg-[#123e48]"
            >
              {isEditMode ? "Enregistrer les modifications" : "Enregistrer"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
