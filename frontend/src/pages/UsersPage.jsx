import { useEffect, useMemo, useState } from "react";
import { Users, GraduationCap, BriefcaseBusiness } from "lucide-react";
import AddUserDialog from "@/components/users/AddUserDialog";
import UsersTable from "@/components/users/UsersTable";
import InfoCard from "@/components/common/InfoCard";
import TablePagination from "@/components/common/TablePagination";
import { Input } from "@/components/ui/input";

const initialUsers = [
  {
    id: 1,
    fullName: "Alice Johnson",
    email: "alice@dit.ac.za",
    userType: "Étudiant",
    status: "Actif",
  },
  {
    id: 2,
    fullName: "Dr. Patrick Moyo",
    email: "patrick@dit.ac.za",
    userType: "Professeur",
    status: "Actif",
  },
  {
    id: 3,
    fullName: "Ruth Ncube",
    email: "ruth@dit.ac.za",
    userType: "Personnel administratif",
    status: "Actif",
  },
  {
    id: 4,
    fullName: "Jean Mukendi",
    email: "jean@dit.ac.za",
    userType: "Étudiant",
    status: "Actif",
  },
  {
    id: 5,
    fullName: "Sarah Bello",
    email: "sarah@dit.ac.za",
    userType: "Étudiant",
    status: "Actif",
  },
  {
    id: 6,
    fullName: "David Tchala",
    email: "david@dit.ac.za",
    userType: "Professeur",
    status: "Actif",
  },
];

const ITEMS_PER_PAGE = 5;

export default function UsersPage() {
  const [users, setUsers] = useState(initialUsers);
  const [search, setSearch] = useState("");
  const [editingUser, setEditingUser] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);

  const filteredUsers = useMemo(() => {
    const term = search.toLowerCase().trim();

    if (!term) return users;

    return users.filter(
      (user) =>
        user.fullName.toLowerCase().includes(term) ||
        user.email.toLowerCase().includes(term) ||
        user.userType.toLowerCase().includes(term)
    );
  }, [users, search]);

  const totalPages = Math.ceil(filteredUsers.length / ITEMS_PER_PAGE);

  const paginatedUsers = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    const end = start + ITEMS_PER_PAGE;
    return filteredUsers.slice(start, end);
  }, [filteredUsers, currentPage]);

  useEffect(() => {
    setCurrentPage(1);
  }, [search]);

  useEffect(() => {
    if (currentPage > totalPages && totalPages > 0) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  const handleSaveUser = (userData) => {
    const exists = users.some((user) => user.id === userData.id);

    if (exists) {
      setUsers((prev) =>
        prev.map((user) => (user.id === userData.id ? userData : user))
      );
    } else {
      setUsers((prev) => [userData, ...prev]);
    }
  };

  const handleDeleteUser = (id) => {
    setUsers((prev) => prev.filter((user) => user.id !== id));
  };

  const handleEditClick = (user) => {
    setEditingUser(user);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">
            Utilisateurs
          </h1>
          <p className="mt-1 text-slate-500">
            Gérez les comptes des usagers de la bibliothèque.
          </p>
        </div>

        <AddUserDialog
          onSaveUser={handleSaveUser}
          onEditUser={setEditingUser}
          editUser={editingUser}
        />
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <InfoCard
          title="Total des utilisateurs"
          value={users.length}
          description="Comptes enregistrés dans la plateforme"
          icon={Users}
          badgeText="Actifs"
          badgeVariant="default"
        />

        <InfoCard
          title="Étudiants"
          value={users.filter((user) => user.userType === "Étudiant").length}
          description="Utilisateurs de type étudiant"
          icon={GraduationCap}
          badgeText="Académique"
          badgeVariant="success"
        />

        <InfoCard
          title="Personnel & professeurs"
          value={users.filter((user) => user.userType !== "Étudiant").length}
          description="Personnel administratif et enseignant"
          icon={BriefcaseBusiness}
          badgeText="Encadrement"
          badgeVariant="neutral"
        />
      </div>

      <div className="rounded-3xl border border-slate-200/40 bg-white p-4 shadow-sm shadow-slate-200/20">
        <div className="mb-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-lg font-semibold text-slate-900">
              Liste des utilisateurs
            </h2>
            <p className="text-sm text-slate-500">
              Recherchez et consultez les comptes enregistrés.
            </p>
          </div>

          <div className="w-full md:max-w-sm">
            <Input
              placeholder="Rechercher par nom, e-mail ou type..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="rounded-xl border-slate-200/40 bg-white"
            />
          </div>
        </div>

        <UsersTable
          users={paginatedUsers}
          onDeleteUser={handleDeleteUser}
          onEditClick={handleEditClick}
        />

        <TablePagination
          currentPage={currentPage}
          totalPages={totalPages}
          totalItems={filteredUsers.length}
          itemsPerPage={ITEMS_PER_PAGE}
          onPageChange={setCurrentPage}
        />
      </div>
    </div>
  );
}
