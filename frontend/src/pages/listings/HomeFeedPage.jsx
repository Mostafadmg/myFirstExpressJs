import { useState, useEffect } from "react";
import { getListings } from "../../api/listingsApi.js";
import { getCategories } from "../../api/categoriesApi.js";
import { ListingGrid } from "../../components/listings/ListingGrid.jsx";
import { FilterPanel } from "../../components/listings/FilterPanel.jsx";
import { SearchBar } from "../../components/listings/SearchBar.jsx";
import { Pagination } from "../../components/common/Pagination.jsx";
import { LoadingSpinner } from "../../components/common/LoadingSpinner.jsx";
import { ErrorMessage } from "../../components/common/ErrorMessage.jsx";
import { usePagination } from "../../hooks/usePagination.js";

export function HomeFeedPage() {
  const [listings, setListings] = useState([]);
  const [categories, setCategories] = useState([]);
  const [filters, setFilters] = useState({});
  const [status, setStatus] = useState("loading"); // loading | success | error
  const [error, setError] = useState(null);
  const { page, setPage, pageSize, totalPages, setTotalPages, nextPage, prevPage } =
    usePagination();

  // Loads categories once. Empty dependency array = "run after the first
  // render only," same lesson as the Animal Shelter's useEffect fix.
  useEffect(() => {
    getCategories()
      .then(setCategories)
      .catch(() => setCategories([]));
  }, []);

  // Re-fetches whenever filters or page change â€” this is the pattern
  // that will drive your Express query-string parsing (?category=&page=).
  useEffect(() => {
    setStatus("loading");
    getListings({ ...filters, page, limit: pageSize })
      .then((data) => {
        setListings(data.listings);
        setTotalPages(data.totalPages || 1);
        setStatus("success");
      })
      .catch((err) => {
        setError(err);
        setStatus("error");
      });
  }, [filters, page, pageSize]);

  function handleSearch(query) {
    setPage(1);
    setFilters((f) => ({ ...f, q: query }));
  }

  return (
    <div className="page">
      <section className="hero">
        <div>
          <p className="eyebrow">Goods · Time · People</p>
          <h1>A market for things and hours.</h1>
          <p>
            Shop physical listings, book a time slot, or follow the person who made it.
          </p>
        </div>
        <div className="hero-aside">
          <div className="hero-chip">
            <strong>Products</strong>
            <span>Stock, cart, and checkout</span>
          </div>
          <div className="hero-chip">
            <strong>Services</strong>
            <span>A calendar of open slots</span>
          </div>
          <div className="hero-chip">
            <strong>People</strong>
            <span>Profiles, reviews, and messages</span>
          </div>
        </div>
      </section>
      <div className="browse-head">
        <div>
          <p className="eyebrow">The floor</p>
          <h2>Browse listings</h2>
        </div>
      </div>
      <SearchBar onSearch={handleSearch} />
      <FilterPanel
        categories={categories}
        filters={filters}
        onChange={(next) => {
          setPage(1);
          setFilters(next);
        }}
      />
      {status === "loading" && <LoadingSpinner />}
      {status === "error" && <ErrorMessage error={error} />}
      {status === "success" && (
        <>
          <ListingGrid listings={listings} />
          <Pagination
            page={page}
            totalPages={totalPages}
            onPrev={prevPage}
            onNext={nextPage}
          />
        </>
      )}
    </div>
  );
}
