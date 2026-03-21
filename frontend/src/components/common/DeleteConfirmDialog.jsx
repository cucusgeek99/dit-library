import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

export default function DeleteConfirmDialog({
  title = "Confirmer la suppression",
  description = "Cette action est irréversible.",
  onConfirm,
}) {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          className="rounded-xl border-slate-200/40 text-red-600 hover:bg-red-50 hover:text-red-600"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </AlertDialogTrigger>

      <AlertDialogContent className="rounded-3xl border border-slate-200/40 bg-white shadow-xl shadow-slate-200/20">
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription className="text-slate-500">
            {description}
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter>
          <AlertDialogCancel className="rounded-xl border-slate-200/40">
            Annuler
          </AlertDialogCancel>

          <AlertDialogAction
            onClick={onConfirm}
            className="rounded-xl bg-red-600 text-white hover:bg-red-700"
          >
            Supprimer
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
