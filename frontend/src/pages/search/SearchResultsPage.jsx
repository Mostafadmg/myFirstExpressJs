import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { search } from "../../api/searchApi.js";
import { ListingCard } from "../../components/listings/ListingCard.jsx";
import { SearchBar } from "../../components/listings/SearchBar.jsx";
import { LoadingSpinner } from "../../components/common/LoadingSpinner.jsx";
import { ErrorMessage } from "../../components/common/ErrorMessage.jsx";

export function SearchResultsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const query = searchParams.get("q") || "";
  const [results, setResults] = useState({ listings: [], users: [] });
  const [status, setStatus] = useState(query ? "loading" : "idle");
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!query.trim()) {
      setResults({ listings: [], users: [] });
      setStatus("idle");
      setError(null);
      return;
    }

    let ignore = false;
    setStatus("loading");
    setError(null);

    search(query)
      .then((data) => {
        if (ignore) return;
        setResults(data);
        setStatus("success");
      })
      .catch((requestError) => {
        if (ignore) return;
        setError(requestError);
        setStatus("error");
      });

    return () => {
      ignore = true;
    };
  }, [query]);

  function submitSearch(value) {
    const nextQuery = value.trim();
    setSearchParams(nextQuery ? { q: nextQuery } : {});
  }

  return (
    <div className="page search-page">
      <header className="search-heading">
        <p className="eyebrow">Find your next favorite</p>
        <h1>Search the marketplace</h1>
        <p className="muted">Explore thoughtful objects and the people who make them.</p>
      </header>

      <SearchBar query={query} onSearch={submitSearch} placeholder="Try ‘ceramic’, ‘Cairo’, or ‘lamp’" />

      {!query && status === "idle" && (
        <div className="search-prompt card">
          <span className="search-prompt-mark" aria-hidden="true">⌕</span>
          <div>
            <h2>What are you looking for?</h2>
            <p className="muted">Search by item, category, maker, or location.</p>
          </div>
        </div>
      )}
      {status === "loading" && <LoadingSpinner />}
      {status === "error" && <ErrorMessage error={error} />}

      {status === "success" && (
        <>
          <p className="search-summary">Results for <strong>“{query}”</strong></p>

          <section className="search-section">
            <div className="section-heading-row">
              <div>
                <p className="eyebrow">Objects & experiences</p>
                <h2>Listings <span className="result-count">{results.listings.length}</span></h2>
              </div>
              <Link to={`/?q=${encodeURIComponent(query)}`} className="text-link">Browse all matching listings</Link>
            </div>
            {results.listings.length ? (
              <div className="grid">
                {results.listings.map((listing) => <ListingCard key={listing.id} listing={listing} />)}
              </div>
            ) : (
              <p className="empty card">No listings matched this search.</p>
            )}
          </section>

          <section className="search-section">
            <div className="section-heading-row">
              <div>
                <p className="eyebrow">Meet the makers</p>
                <h2>People <span className="result-count">{results.users.length}</span></h2>
              </div>
            </div>
            {results.users.length ? (
              <div className="people-grid">
                {results.users.map((user) => (
                  <Link className="person-card card" to={`/users/${user.id}`} key={user.id}>
                    <div className="person-avatar">
                      {user.avatarUrl ? <img src={user.avatarUrl} alt="" /> : user.name.charAt(0)}
                    </div>
                    <div className="person-copy">
                      <h3>{user.name}</h3>
                      <p className="person-meta">{user.location || user.role}</p>
                      {user.bio && <p className="person-bio">{user.bio}</p>}
                    </div>
                    <span className="person-arrow" aria-hidden="true">↗</span>
                  </Link>
                ))}
              </div>
            ) : (
              <p className="empty card">No people matched this search.</p>
            )}
          </section>
        </>
      )}
    </div>
  );
}
