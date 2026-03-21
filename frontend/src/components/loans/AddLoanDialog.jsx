import { useState } from "react";
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
  bookTitle: "",
  borrowerName: "",
  startDate: "",
  dueDate: "",
};

export default function AddLoanDialog({ onSaveLoan }) {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState(initialForm);

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
  };

  const resolveStatus = (dueDate) => {
    const today = new Date();
    const limit = new Date(dueDate);

    today.setHours(0, 0, 0, 0);
    limit.setHours(0, 0, 0, 0);

    return limit < today ? "En retard" : "En cours";
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (
      !formData.bookTitle.trim() ||
      !formData.borrowerName.trim() ||
      !formData.startDate ||
      !formData.dueDate
    ) {
      return;
    }

    const newLoan = {
      id: Date.now(),
      bookTitle: formData.bookTitle.trim(),
      borrowerName: formData.borrowerName.trim(),
      startDate: formData.startDate,
      dueDate: formData.dueDate,
      returnDate: null,
      status: resolveStatus(formData.dueDate),
    };

    onSaveLoan(newLoan);
    handleClose();
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(value) => (!value ? handleClose() : setOpen(value))}
    >
      <DialogTrigger asChild>
        <Button className="rounded-xl text-white px-3 py-5 bg-[#154854] hover:bg-[#123e48]">
          + Nouvel emprunt
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-140 rounded-2xl border border-slate-200/70 bg-white shadow-xl shadow-slate-200/40">
        <DialogHeader>
          <DialogTitle>Ajouter un emprunt</DialogTitle>
          <DialogDescription>
            Renseignez les informations relatives au nouvel emprunt.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="bookTitle">Titre du livre</Label>
              <Input
                id="bookTitle"
                name="bookTitle"
                value={formData.bookTitle}
                onChange={handleChange}
                placeholder="Ex. Clean Code"
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="borrowerName">Nom de l’emprunteur</Label>
              <Input
                id="borrowerName"
                name="borrowerName"
                value={formData.borrowerName}
                onChange={handleChange}
                placeholder="Ex. Alice Johnson"
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="grid gap-2">
                <Label htmlFor="startDate">Date d’emprunt</Label>
                <Input
                  id="startDate"
                  name="startDate"
                  type="date"
                  value={formData.startDate}
                  onChange={handleChange}
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="dueDate">Date limite</Label>
                <Input
                  id="dueDate"
                  name="dueDate"
                  type="date"
                  value={formData.dueDate}
                  onChange={handleChange}
                />
              </div>
            </div>
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
              Enregistrer
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
