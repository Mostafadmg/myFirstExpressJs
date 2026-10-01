export function Pagination({ page, totalPages, onPrev, onNext }) {
  if (totalPages <= 1) return null;

  return (
    <div className="row pager">
      <button className="btn secondary" onClick={onPrev} disabled={page <= 1}>
        Previous
      </button>
      <span className="muted">
        Page {page} of {totalPages}
      </span>
      <button className="btn secondary" onClick={onNext} disabled={page >= totalPages}>
        Next
      </button>
    </div>
  );
}
