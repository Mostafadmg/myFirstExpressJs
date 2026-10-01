import { useState, useEffect } from "react";
import { getAllListingsForModeration, removeListing } from "../../api/adminApi.js";
import { Sidebar } from "../../components/layout/Sidebar.jsx";
import { Pagination } from "../../components/common/Pagination.jsx";
import { LoadingSpinner } from "../../components/common/LoadingSpinner.jsx";
import { ErrorMessage } from "../../components/common/ErrorMessage.jsx";
import { usePagination } from "../../hooks/usePagination.js";

const ADMIN_LINKS = [
  { to: "/admin", label: "Overview" },
  { to: "/admin/users", label: "Manage users" },
  { to: "/admin/listings", label: "Moderate listings" },
];

export function ManageListingsPage() {
  const [listings, setListings] = useState([]);
  const [status, setStatus] = useState("loading");
  const [error, setError] = useState(null);
  const { page, pageSize, totalPages, setTotalPages, nextPage, prevPage } = usePagination();

  useEffect(() => {
    load();
  }, [page]);

  function load() {
    setStatus("loading");
    getAllListingsForModeration(page, pageSize)
      .then((data) => {
        setListings(data.listings);
        setTotalPages(data.totalPages || 1);
        setStatus("success");
      })
      .catch((err) => {
        setError(err);
        setStatus("error");
      });
  }

  async function handleRemove(listingId) {
    await removeListing(listingId);
    load();
  }

  return (
    <div className="page split">
      <Sidebar links={ADMIN_LINKS} />
      <div>
        <p className="eyebrow">Admin</p>
        <h1>Moderate listings</h1>
        {status === "loading" && <LoadingSpinner />}
        {status === "error" && <ErrorMessage error={error} />}
        {status === "success" && (
          <>
            <div className="stack">
            {listings.map((listing) => (
              <div key={listing.id} className="card item-row">
                <strong>{listing.title}</strong>
                <span className="muted">{listing.sellerName}</span>
                <button className="btn danger" onClick={() => handleRemove(listing.id)}>Remove</button>
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
