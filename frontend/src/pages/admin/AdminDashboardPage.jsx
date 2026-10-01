import { useState, useEffect } from "react";
import { getPlatformStats } from "../../api/adminApi.js";
import { Sidebar } from "../../components/layout/Sidebar.jsx";
import { LoadingSpinner } from "../../components/common/LoadingSpinner.jsx";
import { ErrorMessage } from "../../components/common/ErrorMessage.jsx";

const ADMIN_LINKS = [
  { to: "/admin", label: "Overview" },
  { to: "/admin/users", label: "Manage users" },
  { to: "/admin/listings", label: "Moderate listings" },
];

export function AdminDashboardPage() {
  const [stats, setStats] = useState(null);
  const [status, setStatus] = useState("loading");
  const [error, setError] = useState(null);

  useEffect(() => {
    getPlatformStats()
      .then((data) => {
        setStats(data);
        setStatus("success");
      })
      .catch((err) => {
        setError(err);
        setStatus("error");
      });
  }, []);

  return (
    <div className="page split">
      <Sidebar links={ADMIN_LINKS} />
      <div>
        <p className="eyebrow">Admin</p>
        <h1>Overview</h1>
        {status === "loading" && <LoadingSpinner />}
        {status === "error" && <ErrorMessage error={error} />}
        {status === "success" && (
          <div className="grid">
            <div className="card stat"><p className="muted">Users</p><h2>{stats.totalUsers}</h2></div>
            <div className="card stat"><p className="muted">Listings</p><h2>{stats.totalListings}</h2></div>
            <div className="card stat"><p className="muted">Orders</p><h2>{stats.totalOrders}</h2></div>
            <div className="card stat"><p className="muted">Revenue</p><h2>${(stats.revenueCents / 100).toFixed(2)}</h2></div>
          </div>
        )}
      </div>
    </div>
  );
}
