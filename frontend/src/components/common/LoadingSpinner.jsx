export function LoadingSpinner({ label = "Loading..." }) {
  return <p className="spinner" role="status">{label}</p>;
}
