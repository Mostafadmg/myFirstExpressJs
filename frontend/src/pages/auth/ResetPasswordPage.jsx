import { useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { resetPassword } from "../../api/authApi.js";
import { ErrorMessage } from "../../components/common/ErrorMessage.jsx";

export function ResetPasswordPage() {
  // The reset link Express/email would send looks like:
  // https://.../reset-password?token=abc123 — useSearchParams reads that
  // ?token=abc123 part out of the current URL.
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const navigate = useNavigate();

  const [newPassword, setNewPassword] = useState("");
  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await resetPassword(token, newPassword);
      navigate("/login");
    } catch (err) {
      setError(err);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="page auth-page">
      <p className="eyebrow">Choose a new one</p>
      <h1>Reset password</h1>
      <form onSubmit={handleSubmit} className="card">
        <div className="field">
          <label>New password</label>
          <input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} required />
        </div>
        {error && <ErrorMessage error={error} />}
        <button className="btn" type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Saving..." : "Save new password"}
        </button>
      </form>
    </div>
  );
}
