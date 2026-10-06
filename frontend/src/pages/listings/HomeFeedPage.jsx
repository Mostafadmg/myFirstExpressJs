import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { getListings } from "../../api/listingsApi.js";
import { getCategories } from "../../api/categoriesApi.js";
import { ListingGrid } from "../../components/listings/ListingGrid.jsx";
import { FilterPanel } from "../../components/listings/FilterPanel.jsx";
import { SearchBar } from "../../components/listings/SearchBar.jsx";
import { Pagination } from "../../components/common/Pagination.jsx";
import { LoadingSpinner } from "../../components/common/LoadingSpinner.jsx";
import { ErrorMessage } from "../../components/common/ErrorMessage.jsx";
import { DEFAULT_PAGE_SIZE } from "../../utils/constants.js";

// These are the only keys this page writes into the address bar.
// Example: /?category=wear&q=lamp&sort=rating_desc&page=2
const FILTER_KEYS = ["q", "category", "minPrice", "maxPrice", "sort"];

function filtersFromSearch(searchParams) {
  const filters = {};
  for (const key of FILTER_KEYS) {
    const value = searchParams.get(key);
    if (value) filters[key] = value;
  }
  return filters;
}

export function HomeFeedPage() {
  // searchParams is the query string of the current URL, already parsed.
  // setSearchParams writes a new query string, which changes the address bar
  // and pushes a history entry (Back undoes the last filter).
  const [searchParams, setSearchParams] = useSearchParams();
  const filters = filtersFromSearch(searchParams);
  const page = Number(searchParams.get("page")) || 1;

  const [listings, setListings] = useState([]);
  const [categories, setCategories] = useState([]);
  const [status, setStatus] = useState("loading"); // loading | success | error
  const [error, setError] = useState(null);
  const [totalPages, setTotalPages] = useState(1);

  // patch is { category: "wear", q: "" }. Empty values are removed so the
  // URL stays /?category=wear instead of /?category=wear&q=.
  function writeSearch(patch, { resetPage = false, replace = false } = {}) {
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      for (const [key, value] of Object.entries(patch)) {
        if (value === "" || value == null) next.delete(key);
        else next.set(key, String(value));
      }
      if (resetPage) next.delete("page");
      return next;
    }, { replace });
  }

  // Loads categories once. Empty dependency array = "run after the first
  // render only," same lesson as the Animal Shelter's useEffect fix.
  useEffect(() => {
    getCategories()
      .then(setCategories)
      .catch(() => setCategories([]));
  }, []);

  // The address bar is the source of truth. Changing it (category, search,
  // price, sort, page) re-runs this fetch with those same query params.
  useEffect(() => {
    const activeFilters = filtersFromSearch(searchParams);
    const activePage = Number(searchParams.get("page")) || 1;
    let ignore = false;

    setStatus("loading");
    getListings({ ...activeFilters, page: activePage, limit: DEFAULT_PAGE_SIZE })
      .then((data) => {
        if (ignore) return;
        setListings(data.listings);
        setTotalPages(data.totalPages || 1);
        setStatus("success");
      })
      .catch((err) => {
        if (ignore) return;
        setError(err);
        setStatus("error");
      });

    return () => {
      ignore = true;
    };
  }, [searchParams]);

  function handleSearch(query) {
    writeSearch({ q: query.trim() }, { resetPage: true });
  }

  function handleFilterChange(next) {
    // Price fields update on every keystroke. Replace the current history
    // entry for those so Back still means "previous category/search", while
    // the address bar still shows the digits as they are typed.
    const priceOnly =
      (next.category || "") === (filters.category || "") &&
      (next.sort || "") === (filters.sort || "");

    writeSearch(
      {
        category: next.category || "",
        minPrice: next.minPrice || "",
        maxPrice: next.maxPrice || "",
        sort: next.sort || "",
      },
      { resetPage: true, replace: priceOnly }
    );
  }

  function goToPage(nextPage) {
    const clamped = Math.min(Math.max(nextPage, 1), totalPages);
    writeSearch({ page: clamped <= 1 ? "" : String(clamped) });
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
      <SearchBar query={filters.q || ""} onSearch={handleSearch} />
      <FilterPanel
        categories={categories}
        filters={filters}
        onChange={handleFilterChange}
      />
      {status === "loading" && <LoadingSpinner />}
      {status === "error" && <ErrorMessage error={error} />}
      {status === "success" && (
        <>
          <ListingGrid listings={listings} />
          <Pagination
            page={page}
            totalPages={totalPages}
            onPrev={() => goToPage(page - 1)}
            onNext={() => goToPage(page + 1)}
          />
        </>
      )}
    </div>
  );
}
