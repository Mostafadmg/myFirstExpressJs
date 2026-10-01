import { Link } from "react-router-dom";

export function NotFoundPage() {
  return (
    <div className="page center-page">
      <p className="display-num">404</p>
      <h1>This stall is empty.</h1>
      <p className="muted">That page doesn’t exist.</p>
      <Link to="/" className="btn">Go home</Link>
    </div>
  );
}
