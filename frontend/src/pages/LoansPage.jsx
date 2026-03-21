import { useEffect, useMemo, useState } from "react";
import {
  ClipboardList,
  RefreshCcw,
  AlertTriangle,
  CheckCircle2,
} from "lucide-react";
import AddLoanDialog from "@/components/loans/AddLoanDialog";
import LoansTable from "@/components/loans/LoansTable";
import InfoCard from "@/components/common/InfoCard";
import TablePagination from "@/components/common/TablePagination";
import { Input } from "@/components/ui/input";

const initialLoans = [
  {
    id: 1,
    bookTitle: "Clean Code",
    borrowerName: "Alice Johnson",
    startDate: "2026-03-10",
    dueDate: "2026-03-24",
    returnDate: null,
    status: "En cours",
  },
  {
    id: 2,
    bookTitle: "The Pragmatic Programmer",
    borrowerName: "Ruth Ncube",
    startDate: "2026-03-05",
    dueDate: "2026-03-15",
    returnDate: null,
    status: "En retard",
  },
  {
    id: 3,
    bookTitle: "Designing Data-Intensive Applications",
    borrowerName: "Dr. Patrick Moyo",
    startDate: "2026-03-01",
    dueDate: "2026-03-12",
    returnDate: "2026-03-11",
    status: "Retourné",
  },
  {
    id: 4,
    bookTitle: "Code Complete",
    borrowerName: "Jean Mukendi",
    startDate: "2026-03-14",
    dueDate: "2026-03-28",
    returnDate: null,
    status: "En cours",
  },
  {
    id: 5,
    bookTitle: "Refactoring",
    borrowerName: "Sarah Bello",
    startDate: "2026-03-08",
    dueDate: "2026-03-18",
    returnDate: null,
    status: "En retard",
  },
  {
    id: 6,
    bookTitle: "Domain-Driven Design",
    borrowerName: "David Tchala",
    startDate: "2026-03-02",
    dueDate: "2026-03-12",
    returnDate: "2026-03-10",
    status: "Retourné",
  },
];

const ITEMS_PER_PAGE = 5;

export default function LoansPage() {
  const [loans, setLoans] = useState(initialLoans);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const filteredLoans = useMemo(() => {
    const term = search.toLowerCase().trim();

    if (!term) return loans;

    return loans.filter(
      (loan) =>
        loan.bookTitle.toLowerCase().includes(term) ||
        loan.borrowerName.toLowerCase().includes(term) ||
        loan.status.toLowerCase().includes(term)
    );
  }, [loans, search]);

  const totalPages = Math.ceil(filteredLoans.length / ITEMS_PER_PAGE);

  const paginatedLoans = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    const end = start + ITEMS_PER_PAGE;
    return filteredLoans.slice(start, end);
  }, [filteredLoans, currentPage]);

  useEffect(() => {
    setCurrentPage(1);
  }, [search]);

  useEffect(() => {
    if (currentPage > totalPages && totalPages > 0) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  const handleSaveLoan = (loanData) => {
    setLoans((prev) => [loanData, ...prev]);
  };

  const handleReturnLoan = (id) => {
    const today = new Date().toISOString().slice(0, 10);

    setLoans((prev) =>
      prev.map((loan) =>
        loan.id === id
          ? {
              ...loan,
              returnDate: today,
              status: "Retourné",
            }
          : loan
      )
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">
            Emprunts
          </h1>
          <p className="mt-1 text-slate-500">
            Gérez les prêts, les retours et le suivi des ouvrages empruntés.
          </p>
        </div>

        <AddLoanDialog onSaveLoan={handleSaveLoan} />
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <InfoCard
          title="Total des emprunts"
          value={loans.length}
          description="Historique global des prêts"
          icon={ClipboardList}
          badgeText="Suivi"
          badgeVariant="default"
        />

        <InfoCard
          title="En cours"
          value={loans.filter((loan) => loan.status === "En cours").length}
          description="Emprunts actuellement actifs"
          icon={RefreshCcw}
          badgeText="Actif"
          badgeVariant="success"
        />

        <InfoCard
          title="En retard"
          value={loans.filter((loan) => loan.status === "En retard").length}
          description="Retards à traiter"
          icon={AlertTriangle}
          badgeText="Attention"
          badgeVariant="danger"
        />

        <InfoCard
          title="Retournés"
          value={loans.filter((loan) => loan.status === "Retourné").length}
          description="Emprunts clôturés"
          icon={CheckCircle2}
          badgeText="Clos"
          badgeVariant="neutral"
        />
      </div>

      <div className="rounded-3xl border border-slate-200/40 bg-white p-4 shadow-sm shadow-slate-200/20">
        <div className="mb-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-lg font-semibold text-slate-900">
              Liste des emprunts
            </h2>
            <p className="text-sm text-slate-500">
              Recherchez et consultez l’état des emprunts enregistrés.
            </p>
          </div>

          <div className="w-full md:max-w-sm">
            <Input
              placeholder="Rechercher par livre, emprunteur ou statut..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="rounded-xl border-slate-200/40 bg-white"
            />
          </div>
        </div>

        <LoansTable loans={paginatedLoans} onReturnLoan={handleReturnLoan} />

        <TablePagination
          currentPage={currentPage}
          totalPages={totalPages}
          totalItems={filteredLoans.length}
          itemsPerPage={ITEMS_PER_PAGE}
          onPageChange={setCurrentPage}
        />
      </div>
    </div>
  );
}
