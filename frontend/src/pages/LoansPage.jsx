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
import {
  getBorrows,
  createBorrow,
  returnBorrow,
  getBooks,
  getUsers,
} from "@/lib/api";
import { getStoredUser } from "@/lib/auth";

const ITEMS_PER_PAGE = 5;

function loanStatus(b) {
  if (b.is_returned) return "Retourné";

  const borrowDate = b.borrow_date ? new Date(b.borrow_date) : null;
  if (!borrowDate) return "En cours";

  const today = new Date();
  const diffInDays = Math.floor((today - borrowDate) / (1000 * 60 * 60 * 24));

  return diffInDays > 14 ? "En retard" : "En cours";
}

function mapLoan(b, booksMap, usersMap) {
  return {
    id: b.id,
    bookId: b.book_id,
    userId: b.user_id,
    bookTitle: booksMap[b.book_id] ?? `Livre #${b.book_id}`,
    borrowerName: usersMap[b.user_id] ?? `Utilisateur #${b.user_id}`,
    startDate: b.borrow_date ? b.borrow_date.slice(0, 10) : null,
    returnDate:
      b.is_returned && b.return_date ? b.return_date.slice(0, 10) : null,
    status: loanStatus(b),
  };
}

export default function LoansPage() {
  const [loans, setLoans] = useState([]);
  const [books, setBooks] = useState([]);
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const currentUser = getStoredUser();
  const isAdmin = currentUser?.user_type === "Personnel administratif";
  const canBorrow = [
    "Personnel administratif",
    "Professeur",
    "Etudiant",
  ].includes(currentUser?.user_type);

  const fetchLoans = async (booksMap = {}, usersMap = {}) => {
    try {
      const data = await getBorrows();
      setLoans(data.map((b) => mapLoan(b, booksMap, usersMap)));
    } catch (e) {
      console.error("Erreur récupération emprunts", e);
      console.error("Réponse backend :", e?.response?.data);
    }
  };

  useEffect(() => {
    Promise.all([getBooks().catch(() => []), getUsers().catch(() => [])]).then(
      ([booksData, usersData]) => {
        setBooks(booksData);
        setUsers(usersData);

        const booksMap = Object.fromEntries(
          booksData.map((b) => [b.id, b.title])
        );
        const usersMap = Object.fromEntries(
          usersData.map((u) => [u.id, u.full_name])
        );

        fetchLoans(booksMap, usersMap);
      }
    );
  }, []);

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

  const handleSaveLoan = async (loanData) => {
    try {
      await createBorrow({
        book_id: loanData.bookId,
        user_id: loanData.userId,
        borrow_date: `${loanData.borrowDate}T00:00:00`,
      });

      const booksMap = Object.fromEntries(books.map((b) => [b.id, b.title]));
      const usersMap = Object.fromEntries(
        users.map((u) => [u.id, u.full_name])
      );
      await fetchLoans(booksMap, usersMap);
    } catch (e) {
      console.error("Erreur création emprunt", e);
      console.error("Réponse backend :", e?.response?.data);
      alert(e?.response?.data?.detail || "Impossible de créer l'emprunt.");
    }
  };

  const handleReturnLoan = async (id) => {
    const loan = loans.find((l) => l.id === id);
    if (!loan) return;

    try {
      await returnBorrow(loan.bookId, loan.userId);
      const booksMap = Object.fromEntries(books.map((b) => [b.id, b.title]));
      const usersMap = Object.fromEntries(
        users.map((u) => [u.id, u.full_name])
      );
      await fetchLoans(booksMap, usersMap);
    } catch (e) {
      console.error("Erreur retour emprunt", e);
      console.error("Réponse backend :", e?.response?.data);
      alert(e?.response?.data?.detail || "Impossible de retourner l'emprunt.");
    }
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

        {canBorrow && (
          <AddLoanDialog
            onSaveLoan={handleSaveLoan}
            books={books}
            users={users}
            currentUser={currentUser}
            isAdmin={isAdmin}
          />
        )}
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
