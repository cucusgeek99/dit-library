import { useEffect, useMemo, useState } from "react";
import { BookOpen, Library, Boxes } from "lucide-react";
import AddBookDialog from "@/components/books/AddBookDialog";
import BooksTable from "@/components/books/BooksTable";
import InfoCard from "@/components/common/InfoCard";
import TablePagination from "@/components/common/TablePagination";
import { Input } from "@/components/ui/input";

const initialBooks = [
  {
    id: 1,
    title: "Clean Code",
    author: "Robert C. Martin",
    isbn: "9780132350884",
    quantity: 4,
    status: "Disponible",
  },
  {
    id: 2,
    title: "The Pragmatic Programmer",
    author: "Andrew Hunt",
    isbn: "9780201616224",
    quantity: 2,
    status: "Disponible",
  },
  {
    id: 3,
    title: "Designing Data-Intensive Applications",
    author: "Martin Kleppmann",
    isbn: "9781449373320",
    quantity: 1,
    status: "Disponible",
  },
  {
    id: 4,
    title: "Refactoring",
    author: "Martin Fowler",
    isbn: "9780201485677",
    quantity: 3,
    status: "Disponible",
  },
  {
    id: 5,
    title: "Code Complete",
    author: "Steve McConnell",
    isbn: "9780735619678",
    quantity: 2,
    status: "Disponible",
  },
  {
    id: 6,
    title: "Introduction to Algorithms",
    author: "Thomas H. Cormen",
    isbn: "9780262046305",
    quantity: 5,
    status: "Disponible",
  },
  {
    id: 7,
    title: "Domain-Driven Design",
    author: "Eric Evans",
    isbn: "9780321125217",
    quantity: 2,
    status: "Disponible",
  },
];

const ITEMS_PER_PAGE = 5;

export default function BooksPage() {
  const [books, setBooks] = useState(initialBooks);
  const [search, setSearch] = useState("");
  const [editingBook, setEditingBook] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);

  const filteredBooks = useMemo(() => {
    const term = search.toLowerCase().trim();

    if (!term) return books;

    return books.filter(
      (book) =>
        book.title.toLowerCase().includes(term) ||
        book.author.toLowerCase().includes(term) ||
        book.isbn.toLowerCase().includes(term)
    );
  }, [books, search]);

  const totalPages = Math.ceil(filteredBooks.length / ITEMS_PER_PAGE);

  const paginatedBooks = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    const end = start + ITEMS_PER_PAGE;
    return filteredBooks.slice(start, end);
  }, [filteredBooks, currentPage]);

  useEffect(() => {
    setCurrentPage(1);
  }, [search]);

  useEffect(() => {
    if (currentPage > totalPages && totalPages > 0) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  const handleSaveBook = (bookData) => {
    const exists = books.some((book) => book.id === bookData.id);

    if (exists) {
      setBooks((prev) =>
        prev.map((book) => (book.id === bookData.id ? bookData : book))
      );
    } else {
      setBooks((prev) => [bookData, ...prev]);
    }
  };

  const handleDeleteBook = (id) => {
    setBooks((prev) => prev.filter((book) => book.id !== id));
  };

  const handleEditClick = (book) => {
    setEditingBook(book);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">
            Livres
          </h1>
          <p className="mt-1 text-slate-500">
            Gérez le catalogue des ouvrages disponibles dans la bibliothèque.
          </p>
        </div>

        <AddBookDialog
          onAddBook={handleSaveBook}
          onEditBook={setEditingBook}
          editBook={editingBook}
        />
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <InfoCard
          title="Total des livres"
          value={books.length}
          description="Ouvrages enregistrés dans le catalogue"
          icon={BookOpen}
          badgeText="Catalogue"
          badgeVariant="default"
        />

        <InfoCard
          title="Livres disponibles"
          value={books.filter((book) => book.status === "Disponible").length}
          description="Ouvrages actuellement disponibles"
          icon={Library}
          badgeText="Disponible"
          badgeVariant="success"
        />

        <InfoCard
          title="Total des exemplaires"
          value={books.reduce((sum, book) => sum + book.quantity, 0)}
          description="Nombre cumulé d’exemplaires"
          icon={Boxes}
          badgeText="Stock"
          badgeVariant="neutral"
        />
      </div>

      <div className="rounded-3xl border border-slate-200/40 bg-white p-4 shadow-sm shadow-slate-200/20">
        <div className="mb-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-lg font-semibold text-slate-900">
              Catalogue des livres
            </h2>
            <p className="text-sm text-slate-500">
              Recherchez et consultez les ouvrages enregistrés.
            </p>
          </div>

          <div className="w-full md:max-w-sm">
            <Input
              placeholder="Rechercher par titre, auteur ou ISBN..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="rounded-xl border-slate-200/40 bg-white"
            />
          </div>
        </div>

        <BooksTable
          books={paginatedBooks}
          onDeleteBook={handleDeleteBook}
          onEditClick={handleEditClick}
        />

        <TablePagination
          currentPage={currentPage}
          totalPages={totalPages}
          totalItems={filteredBooks.length}
          itemsPerPage={ITEMS_PER_PAGE}
          onPageChange={setCurrentPage}
        />
      </div>
    </div>
  );
}
