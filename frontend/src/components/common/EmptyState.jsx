export function EmptyState({ message = "Nothing here yet.", actionLabel, onAction }) {
  return (
    <div className="card empty">
      <p className="eyebrow">Empty</p>
      <p className="muted">{message}</p>
      {actionLabel && onAction && (
        <button className="btn" onClick={onAction}>
          {actionLabel}
        </button>
      )}
    </div>
  );
}
