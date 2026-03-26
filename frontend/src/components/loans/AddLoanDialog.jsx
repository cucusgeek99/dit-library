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

const selectClass =
  "flex h-10 w-full rounded-xl border border-slate-200/70 bg-background px-3 py-2 text-sm outline-none focus:border-[#154854]";

export default function AddLoanDialog({ onSaveLoan, books = [], users = [] }) {
  const today = new Date().toISOString().slice(0, 10);
  const [open, setOpen] = useState(false);
  const [bookId, setBookId] = useState("");
  const [userId, setUserId] = useState("");
  const [borrowDate, setBorrowDate] = useState(today);

  const handleClose = () => {
    setOpen(false);
    setBookId("");
    setUserId("");
    setBorrowDate(today);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!bookId || !userId || !borrowDate) return;
    onSaveLoan({ bookId: Number(bookId), userId: Number(userId), borrowDate });
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
            Sélectionnez le livre et l’étudiant pour créer un emprunt.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="bookId">Livre</Label>
              <select
                id="bookId"
                value={bookId}
                onChange={(e) => setBookId(e.target.value)}
                className={selectClass}
                required
              >
                <option value="">— Sélectionner un livre —</option>
                {books.map((b) => (
                  <option key={b.id} value={b.id}>
                    {b.title}
                  </option>
                ))}
              </select>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="borrowDate">Date d'emprunt</Label>
              <Input
                id="borrowDate"
                type="date"
                value={borrowDate}
                onChange={(e) => setBorrowDate(e.target.value)}
                required
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="userId">Emprunteur</Label>
              <select
                id="userId"
                value={userId}
                onChange={(e) => setUserId(e.target.value)}
                className={selectClass}
                required
              >
                <option value="">— Sélectionner un utilisateur —</option>
                {users.map((u) => (
                  <option key={u.id} value={u.id}>
                    {u.full_name} ({u.user_type})
                  </option>
                ))}
              </select>
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
