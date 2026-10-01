import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getCart, updateCartItem, removeFromCart } from "../../api/cartApi.js";
import { LoadingSpinner } from "../../components/common/LoadingSpinner.jsx";
import { ErrorMessage } from "../../components/common/ErrorMessage.jsx";
import { EmptyState } from "../../components/common/EmptyState.jsx";
import { formatCurrency } from "../../utils/formatters.js";

export function CartPage() {
  const navigate = useNavigate();
  const [cart, setCart] = useState(null);
  const [status, setStatus] = useState("loading");
  const [error, setError] = useState(null);

  useEffect(() => {
    loadCart();
  }, []);

  function loadCart() {
    setStatus("loading");
    getCart()
      .then((data) => {
        setCart(data);
        setStatus("success");
      })
      .catch((err) => {
        setError(err);
        setStatus("error");
      });
  }

  async function handleQuantityChange(listingId, quantity) {
    await updateCartItem(listingId, quantity);
    loadCart();
  }

  async function handleRemove(listingId) {
    await removeFromCart(listingId);
    loadCart();
  }

  if (status === "loading") return <div className="page"><LoadingSpinner /></div>;
  if (status === "error") return <div className="page"><ErrorMessage error={error} onRetry={loadCart} /></div>;
  if (cart.items.length === 0) return <div className="page"><EmptyState message="Your cart is empty." actionLabel="Browse listings" onAction={() => navigate("/")} /></div>;

  return (
    <div className="page">
      <p className="eyebrow">Basket</p>
      <h1>Your cart</h1>
      <div className="stack">
        {cart.items.map((item) => (
          <div key={item.listingId} className="card item-row">
            <Link to={`/listings/${item.listingId}`}><strong>{item.title}</strong></Link>
            <input
              className="qty"
              type="number"
              min="1"
              value={item.quantity}
              onChange={(e) => handleQuantityChange(item.listingId, Number(e.target.value))}
            />
            <span className="price">{formatCurrency(item.price * item.quantity)}</span>
            <button className="btn danger" onClick={() => handleRemove(item.listingId)}>Remove</button>
          </div>
        ))}
      </div>
      <div className="total-bar">
        <h3>Total {formatCurrency(cart.total)}</h3>
        <Link to="/checkout" className="btn">Checkout</Link>
      </div>
    </div>
  );
}
