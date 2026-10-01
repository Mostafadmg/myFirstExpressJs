export function ErrorMessage({ error, onRetry }) {
  const message = typeof error === "string" ? error : error?.message || "Something went wrong.";
  return (
    <div className="card error-banner">
      <p className="eyebrow">Couldn’t load this</p>
      <p>{message}</p>
      {onRetry && (
        <button className="btn secondary" onClick={onRetry}>
          Try again
        </button>
      )}
    </div>
  );
}
