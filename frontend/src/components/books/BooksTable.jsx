import { Pencil } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import DeleteConfirmDialog from "@/components/common/DeleteConfirmDialog";

export default function BooksTable({
  books,
  onDeleteBook,
  onEditClick,
  canManageBooks = false,
}) {
  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200/40 bg-white shadow-sm shadow-slate-200/20">
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="border-b border-slate-200/40 hover:bg-transparent">
              <TableHead className="text-slate-600">Titre</TableHead>
              <TableHead className="text-slate-600">Auteur</TableHead>
              <TableHead className="text-slate-600">ISBN</TableHead>
              <TableHead className="text-slate-600">Quantité</TableHead>
              <TableHead className="text-slate-600">Statut</TableHead>
              <TableHead className="text-right text-slate-600">
                Actions
              </TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {books.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={6}
                  className="h-28 text-center text-slate-500"
                >
                  Aucun livre disponible pour le moment.
                </TableCell>
              </TableRow>
            ) : (
              books.map((book) => (
                <TableRow
                  key={book.id}
                  className="border-b border-slate-100 transition hover:bg-slate-50/70"
                >
                  <TableCell className="font-medium text-slate-900">
                    {book.title}
                  </TableCell>
                  <TableCell className="text-slate-600">
                    {book.author}
                  </TableCell>
                  <TableCell className="text-slate-600">{book.isbn}</TableCell>
                  <TableCell className="text-slate-600">
                    {book.quantity}
                  </TableCell>
                  <TableCell>
                    <Badge
                      className={
                        book.status === "Disponible"
                          ? "bg-emerald-100 text-emerald-700 hover:bg-emerald-100"
                          : "bg-red-100 text-red-700 hover:bg-red-100"
                      }
                    >
                      {book.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    {canManageBooks ? (
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="outline"
                          size="icon"
                          className="rounded-xl border-slate-200/40"
                          onClick={() => onEditClick(book)}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>

                        <DeleteConfirmDialog
                          title="Supprimer ce livre ?"
                          description={`Le livre "${book.title}" sera supprimé du catalogue. Cette action est irréversible.`}
                          onConfirm={() => onDeleteBook(book.id)}
                        />
                      </div>
                    ) : (
                      <span className="text-sm text-slate-400">—</span>
                    )}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
