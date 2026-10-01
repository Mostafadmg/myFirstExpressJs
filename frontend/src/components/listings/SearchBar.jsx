import { useState } from "react";

export function SearchBar({ onSearch, placeholder = "Search Marketspace..." }) {
  const [value, setValue] = useState("");

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
