import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function TablePagination({
  currentPage,
  totalPages,
  totalItems,
  itemsPerPage,
  onPageChange,
}) {
  if (totalPages <= 1) return null;

  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);

  return (
    <div className="mt-4 flex flex-col gap-3 rounded-2xl border border-slate-200/40 bg-white px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
      <div className="text-sm text-slate-500">
        Affichage de{" "}
        <span className="font-medium text-slate-900">{startItem}</span> à{" "}
        <span className="font-medium text-slate-900">{endItem}</span> sur{" "}
        <span className="font-medium text-slate-900">{totalItems}</span>{" "}
        éléments
      </div>

      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          className="rounded-xl border-slate-200/40"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
        >
          <ChevronLeft className="mr-1 h-4 w-4" />
          Précédent
        </Button>

        <div className="rounded-xl bg-slate-50 px-3 py-2 text-sm font-medium text-slate-700">
          Page {currentPage} / {totalPages}
        </div>

        <Button
          variant="outline"
          size="sm"
          className="rounded-xl border-slate-200/40"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          Suivant
          <ChevronRight className="ml-1 h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
