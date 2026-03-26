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
  title: "",
  author: "",
  isbn: "",
  quantity: "",
  published_year: String(new Date().getFullYear()),
};

export default function AddBookDialog({
  onAddBook,
  onEditBook,
  editBook = null,
}) {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState(initialForm);

  const isEditMode = Boolean(editBook);

  useEffect(() => {
    if (editBook) {
      setFormData({
        title: editBook.title || "",
        author: editBook.author || "",
        isbn: editBook.isbn || "",
        quantity: String(editBook.quantity ?? ""),
        published_year: String(editBook.published_year ?? new Date().getFullYear()),
      });
      setOpen(true);
    }
  }, [editBook]);

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
    if (isEditMode && onEditBook) {
      onEditBook(null);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (
      !formData.title.trim() ||
      !formData.author.trim() ||
      !formData.isbn.trim()
    ) {
      return;
    }

    const payload = {
      title: formData.title.trim(),
      author: formData.author.trim(),
      isbn: formData.isbn.trim() || null,
      quantity: Number(formData.quantity) || 1,
      published_year: Number(formData.published_year) || new Date().getFullYear(),
    };

    if (isEditMode) {
      onAddBook({ ...editBook, ...payload, _isEdit: true });
    } else {
      onAddBook({ ...payload });
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
            + Ajouter un livre
          </Button>
        </DialogTrigger>
      )}

      <DialogContent className="sm:max-w-140 rounded-2xl border border-slate-200/70 bg-white shadow-xl shadow-slate-200/40">
        <DialogHeader>
          <DialogTitle>
            {isEditMode ? "Modifier le livre" : "Ajouter un livre"}
          </DialogTitle>
          <DialogDescription>
            {isEditMode
              ? "Mettez à jour les informations de l’ouvrage."
              : "Renseignez les informations du livre à ajouter au catalogue."}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="title">Titre</Label>
              <Input
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="Ex. Clean Code"
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="author">Auteur</Label>
              <Input
                id="author"
                name="author"
                value={formData.author}
                onChange={handleChange}
                placeholder="Ex. Robert C. Martin"
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="isbn">ISBN</Label>
              <Input
                id="isbn"
                name="isbn"
                value={formData.isbn}
                onChange={handleChange}
                placeholder="Ex. 9780132350884"
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="grid gap-2">
                <Label htmlFor="quantity">Quantité</Label>
                <Input
                  id="quantity"
                  name="quantity"
                  type="number"
                  min="1"
                  value={formData.quantity}
                  onChange={handleChange}
                  placeholder="Ex. 3"
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="published_year">Année de publication</Label>
                <Input
                  id="published_year"
                  name="published_year"
                  type="number"
                  min="1000"
                  max="2100"
                  value={formData.published_year}
                  onChange={handleChange}
                  placeholder="Ex. 2008"
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
              {isEditMode ? "Enregistrer les modifications" : "Enregistrer"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
