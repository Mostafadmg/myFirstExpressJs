import { useState, useEffect } from "react";
import { getAllUsers, banUser, changeUserRole } from "../../api/adminApi.js";
import { Sidebar } from "../../components/layout/Sidebar.jsx";
import { Pagination } from "../../components/common/Pagination.jsx";
import { LoadingSpinner } from "../../components/common/LoadingSpinner.jsx";
import { ErrorMessage } from "../../components/common/ErrorMessage.jsx";
import { ROLES } from "../../utils/constants.js";
import { usePagination } from "../../hooks/usePagination.js";

const ADMIN_LINKS = [
  { to: "/admin", label: "Overview" },
  { to: "/admin/users", label: "Manage users" },
  { to: "/admin/listings", label: "Moderate listings" },
];

export function ManageUsersPage() {
  const [users, setUsers] = useState([]);
  const [status, setStatus] = useState("loading");
  const [error, setError] = useState(null);
  const { page, pageSize, totalPages, setTotalPages, nextPage, prevPage } = usePagination();

  useEffect(() => {
    load();
  }, [page]);

  function load() {
    setStatus("loading");
    getAllUsers(page, pageSize)
      .then((data) => {
        setUsers(data.users);
        setTotalPages(data.totalPages || 1);
        setStatus("success");
      })
      .catch((err) => {
        setError(err);
        setStatus("error");
      });
  }

  async function handleBan(userId) {
    await banUser(userId);
    load();
  }

  async function handleRoleChange(userId, role) {
    await changeUserRole(userId, role);
    load();
  }

  return (
    <div className="page split">
      <Sidebar links={ADMIN_LINKS} />
      <div>
        <p className="eyebrow">Admin</p>
        <h1>Manage users</h1>
        {status === "loading" && <LoadingSpinner />}
        {status === "error" && <ErrorMessage error={error} />}
        {status === "success" && (
          <>
            <div className="stack">
            {users.map((user) => (
              <div key={user.id} className="card item-row">
                <span><strong>{user.name}</strong> <span className="muted">{user.email}</span></span>
                <select className="role-select" value={user.role} onChange={(e) => handleRoleChange(user.id, e.target.value)}>
                  {Object.values(ROLES).map((role) => (
                    <option key={role} value={role}>{role}</option>
                  ))}
                </select>
                <span className={`badge ${user.isBanned ? "cancelled" : "completed"}`}>{user.isBanned ? "Banned" : "Active"}</span>
                {!user.isBanned && (
                  <button className="btn danger" onClick={() => handleBan(user.id)}>Ban</button>
                )}
              </div>
            ))}
            </div>
            <Pagination page={page} totalPages={totalPages} onPrev={prevPage} onNext={nextPage} />
          </>
        )}
      </div>
    </div>
  );
}
