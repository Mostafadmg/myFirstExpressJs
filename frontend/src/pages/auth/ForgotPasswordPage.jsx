import { useState } from "react";
import { forgotPassword } from "../../api/authApi.js";
import { ErrorMessage } from "../../components/common/ErrorMessage.jsx";

export function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState("idle"); // idle | sending | sent | error
  const [error, setError] = useState(null);

  async function handleSubmit(e) {
    e.preventDefault();
    setStatus("sending");
    try {
      await forgotPassword(email);
      setStatus("sent");
    } catch (err) {
      setError(err);
      setStatus("error");
    }
  }

  if (status === "sent") {
    return (
      <div className="page auth-page">
        <p className="eyebrow">Check your inbox</p>
        <div className="card"><p>If that email exists, a reset link has been sent.</p></div>
      </div>
    );
  }

  return (
    <div className="page auth-page">
      <p className="eyebrow">Account help</p>
      <h1>Forgot password</h1>
      <form onSubmit={handleSubmit} className="card">
        <div className="field">
          <label>Email</label>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        </div>
        {status === "error" && <ErrorMessage error={error} />}
        <button className="btn" type="submit" disabled={status === "sending"}>
          {status === "sending" ? "Sending..." : "Send reset link"}
        </button>
      </form>
    </div>
  );
}
