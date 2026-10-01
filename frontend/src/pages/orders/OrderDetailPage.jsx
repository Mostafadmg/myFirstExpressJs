import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { getOrderById, cancelOrder } from "../../api/ordersApi.js";
import { LoadingSpinner } from "../../components/common/LoadingSpinner.jsx";
import { ErrorMessage } from "../../components/common/ErrorMessage.jsx";
import { formatCurrency, formatDateTime } from "../../utils/formatters.js";
import { ORDER_STATUS } from "../../utils/constants.js";

export function OrderDetailPage() {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [status, setStatus] = useState("loading");
  const [error, setError] = useState(null);

  useEffect(() => {
    load();
  }, [id]);

  function load() {
    setStatus("loading");
    getOrderById(id)
      .then((data) => {
        setOrder(data);
        setStatus("success");
      })
      .catch((err) => {
        setError(err);
        setStatus("error");
      });
  }

  async function handleCancel() {
    await cancelOrder(id);
    load();
  }

  if (status === "loading") return <div className="page"><LoadingSpinner /></div>;
  if (status === "error") return <div className="page"><ErrorMessage error={error} /></div>;

  return (
    <div className="page">
      <p className="eyebrow">Receipt</p>
      <h1>Order #{order.id}</h1>
      <p className="muted">{formatDateTime(order.createdAt)}</p>
      <p>Status <span className={`badge ${order.status}`}>{order.status}</span></p>
      <div className="stack">
      {order.items.map((item) => (
        <div key={item.listingId} className="card item-row">
          <span>{item.title} × {item.quantity}</span>
          <span className="price">{formatCurrency(item.price * item.quantity)}</span>
        </div>
      ))}
      </div>
      <div className="total-bar">
        <h3>Total {formatCurrency(order.totalInCents)}</h3>
      </div>
      {order.status === ORDER_STATUS.PENDING && (
        <button className="btn danger" onClick={handleCancel}>Cancel order</button>
      )}
    </div>
  );
}
