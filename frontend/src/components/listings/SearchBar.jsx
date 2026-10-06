import { useEffect, useState } from "react";

export function SearchBar({ onSearch, query = "", placeholder = "Search Marketspace..." }) {
  const [value, setValue] = useState(query);

  // The address bar owns the query. Back/forward and a shared link must
  // refill this box, not leave it showing whatever was typed last.
  useEffect(() => {
    setValue(query);
  }, [query]);

  function handleSubmit(e) {
    e.preventDefault();
    onSearch(value);
  }

  return (
    <form onSubmit={handleSubmit} className="row search-bar">
      <input value={value} onChange={(e) => setValue(e.target.value)} placeholder={placeholder} />
      <button className="btn" type="submit">Search</button>
    </form>
  );
}
