export function FilterPanel({ categories, filters, onChange }) {
  function update(field, value) {
    onChange({ ...filters, [field]: value });
  }

  return (
    <div className="card filters">
      <select value={filters.category || ""} onChange={(e) => update("category", e.target.value)}>
        <option value="">All categories</option>
        {categories.map((c) => (
          <option key={c.id} value={c.id}>{c.name}</option>
        ))}
      </select>
      <input
        type="number"
        placeholder="Min price"
        value={filters.minPrice || ""}
        onChange={(e) => update("minPrice", e.target.value)}
      />
      <input
        type="number"
        placeholder="Max price"
        value={filters.maxPrice || ""}
        onChange={(e) => update("maxPrice", e.target.value)}
      />
      <select value={filters.sort || ""} onChange={(e) => update("sort", e.target.value)}>
        <option value="">Sort: relevance</option>
        <option value="price_asc">Price: low to high</option>
        <option value="price_desc">Price: high to low</option>
        <option value="rating_desc">Top rated</option>
        <option value="newest">Newest</option>
      </select>
    </div>
  );
}
