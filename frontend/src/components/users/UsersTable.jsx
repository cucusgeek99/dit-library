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

export default function UsersTable({ users, onDeleteUser, onEditClick }) {
  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200/40 bg-white shadow-sm shadow-slate-200/20">
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="border-b border-slate-200/40 hover:bg-transparent">
              <TableHead className="text-slate-600">Nom complet</TableHead>
              <TableHead className="text-slate-600">Adresse e-mail</TableHead>
              <TableHead className="text-slate-600">Type</TableHead>
              <TableHead className="text-slate-600">Statut</TableHead>
              <TableHead className="text-right text-slate-600">
                Actions
              </TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {users.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={5}
                  className="h-28 text-center text-slate-500"
                >
                  Aucun utilisateur disponible pour le moment.
                </TableCell>
              </TableRow>
            ) : (
              users.map((user) => (
                <TableRow
                  key={user.id}
                  className="border-b border-slate-100 transition hover:bg-slate-50/70"
                >
                  <TableCell className="font-medium text-slate-900">
                    {user.fullName}
                  </TableCell>
                  <TableCell className="text-slate-600">{user.email}</TableCell>
                  <TableCell className="text-slate-600">
                    {user.userType}
                  </TableCell>
                  <TableCell>
                    <Badge className="bg-emerald-100 text-emerald-700 hover:bg-emerald-100">
                      {user.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="outline"
                        size="icon"
                        className="rounded-xl border-slate-200/40"
                        onClick={() => onEditClick(user)}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>

                      <DeleteConfirmDialog
                        title="Supprimer cet utilisateur ?"
                        description={`Le compte de "${user.fullName}" sera supprimé. Cette action est irréversible.`}
                        onConfirm={() => onDeleteUser(user.id)}
                      />
                    </div>
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
