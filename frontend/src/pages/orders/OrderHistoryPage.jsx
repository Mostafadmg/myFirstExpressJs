import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getMyOrders } from "../../api/ordersApi.js";
import { LoadingSpinner } from "../../components/common/LoadingSpinner.jsx";
import { ErrorMessage } from "../../components/common/ErrorMessage.jsx";
import { EmptyState } from "../../components/common/EmptyState.jsx";
import { Pagination } from "../../components/common/Pagination.jsx";
import { formatCurrency, formatDate } from "../../utils/formatters.js";
import { usePagination } from "../../hooks/usePagination.js";

export function OrderHistoryPage() {
  const [orders, setOrders] = useState([]);
  const [status, setStatus] = useState("loading");
  const [error, setError] = useState(null);
  const { page, pageSize, totalPages, setTotalPages, nextPage, prevPage } = usePagination();

  useEffect(() => {
    setStatus("loading");
    getMyOrders(page, pageSize)
      .then((data) => {
        setOrders(data.orders);
        setTotalPages(data.totalPages || 1);
        setStatus("success");
      })
      .catch((err) => {
        setError(err);
        setStatus("error");
      });
  }, [page, pageSize]);

  if (status === "loading") return <div className="page"><LoadingSpinner /></div>;
  if (status === "error") return <div className="page"><ErrorMessage error={error} /></div>;
  if (orders.length === 0) return <div className="page"><EmptyState message="No orders yet." /></div>;

  return (
    <div className="page">
      <p className="eyebrow">Purchases</p>
      <h1>Order history</h1>
      <div className="stack">
      {orders.map((order) => (
        <Link key={order.id} to={`/orders/${order.id}`} className="card item-row">
          <strong>Order #{order.id}</strong>
          <span className="muted">{formatDate(order.createdAt)}</span>
          <span className={`badge ${order.status}`}>{order.status}</span>
          <span className="price">{formatCurrency(order.totalInCents)}</span>
        </Link>
      ))}
      </div>
      <Pagination page={page} totalPages={totalPages} onPrev={prevPage} onNext={nextPage} />
    </div>
  );
}
