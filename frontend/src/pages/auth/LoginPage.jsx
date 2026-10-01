import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth.js";
import { ErrorMessage } from "../../components/common/ErrorMessage.jsx";

export function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);
    try {
      await login(email, password);
      navigate("/");
    } catch (err) {
      setError(err);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="page auth-page">
      <p className="eyebrow">Welcome back</p>
      <h1>Log in</h1>
      <form onSubmit={handleSubmit} className="card">
        <div className="field">
          <label>Email</label>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        </div>
        <div className="field">
          <label>Password</label>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        </div>
        {error && <ErrorMessage error={error} />}
        <button className="btn" type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Logging in..." : "Log in"}
        </button>
      </form>
      <p className="muted auth-links">
        No account? <Link to="/register">Sign up</Link> · <Link to="/forgot-password">Forgot password?</Link>
      </p>
      <div className="card demo-accounts">
        <p className="eyebrow">Try a placeholder account</p>
        <p>Password for all three is <strong>password</strong></p>
        <p className="muted">lina@marketspace.test — buyer</p>
        <p className="muted">mostafa@marketspace.test — seller</p>
        <p className="muted">admin@marketspace.test — admin</p>
      </div>
    </div>
  );
}
