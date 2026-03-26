import { RotateCcw } from "lucide-react";
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

export default function LoansTable({ loans, onReturnLoan }) {
  const getBadgeClass = (status) => {
    if (status === "Retourné") {
      return "bg-slate-100 text-slate-700 hover:bg-slate-100";
    }

    if (status === "En retard") {
      return "bg-red-100 text-red-700 hover:bg-red-100";
    }

    return "bg-emerald-100 text-emerald-700 hover:bg-emerald-100";
  };

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200/70 bg-white shadow-sm shadow-slate-200/30">
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="border-b border-slate-200/70 hover:bg-transparent">
              <TableHead className="text-slate-600">Livre</TableHead>
              <TableHead className="text-slate-600">Emprunteur</TableHead>
              <TableHead className="text-slate-600">Date d’emprunt</TableHead>
              <TableHead className="text-slate-600">Date de retour</TableHead>
              <TableHead className="text-slate-600">Statut</TableHead>
              <TableHead className="text-right text-slate-600">
                Actions
              </TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {loans.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={6}
                  className="h-28 text-center text-slate-500"
                >
                  Aucun emprunt disponible pour le moment.
                </TableCell>
              </TableRow>
            ) : (
              loans.map((loan) => (
                <TableRow
                  key={loan.id}
                  className="border-b border-slate-100 transition hover:bg-slate-50/70"
                >
                  <TableCell className="font-medium text-slate-900">
                    {loan.bookTitle}
                  </TableCell>
                  <TableCell className="text-slate-600">
                    {loan.borrowerName}
                  </TableCell>
                  <TableCell className="text-slate-600">
                    {loan.startDate}
                  </TableCell>
                  <TableCell className="text-slate-600">
                    {loan.returnDate || "—"}
                  </TableCell>
                  <TableCell>
                    <Badge className={getBadgeClass(loan.status)}>
                      {loan.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    {loan.status !== "Retourné" ? (
                      <Button
                        variant="outline"
                        className="rounded-xl border-slate-200/70"
                        onClick={() => onReturnLoan(loan.id)}
                      >
                        <RotateCcw className="mr-2 h-4 w-4" />
                        Retourner
                      </Button>
                    ) : (
                      <span className="text-sm text-slate-400">
                        Aucune action
                      </span>
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
