import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { checkout } from "../../api/ordersApi.js";
import { ErrorMessage } from "../../components/common/ErrorMessage.jsx";

export function CheckoutPage() {
  const navigate = useNavigate();
  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);
    const form = new FormData(e.target);
    try {
      // Submitting this exact form twice in a row (double-click, or a
      // retry after a slow response) should NOT create two orders â€”
      // that's the idempotency problem you'll solve on the backend.
      const order = await checkout({
        line1: form.get("line1"),
        city: form.get("city"),
        postalCode: form.get("postalCode"),
      });
      navigate(`/orders/${order.id}`);
    } catch (err) {
      setError(err);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="page narrow">
      <p className="eyebrow">Shipping</p>
      <h1>Checkout</h1>
      <form onSubmit={handleSubmit} className="card">
        <div className="field">
          <label>Address line</label>
          <input name="line1" required />
        </div>
        <div className="field">
          <label>City</label>
          <input name="city" required />
        </div>
        <div className="field">
          <label>Postal code</label>
          <input name="postalCode" required />
        </div>
        <p className="muted">Payment is a placeholder for now â€” no real payment processor is wired up.</p>
        {error && <ErrorMessage error={error} />}
        <button className="btn" type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Placing order..." : "Place order"}
        </button>
      </form>
    </div>
  );
}
