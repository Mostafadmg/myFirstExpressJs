import { useState, useEffect } from "react";
import { getNotifications, markAsRead, markAllAsRead } from "../../api/notificationsApi.js";
import { LoadingSpinner } from "../../components/common/LoadingSpinner.jsx";
import { ErrorMessage } from "../../components/common/ErrorMessage.jsx";
import { EmptyState } from "../../components/common/EmptyState.jsx";
import { formatDateTime } from "../../utils/formatters.js";

export function NotificationsPage() {
  const [notifications, setNotifications] = useState([]);
  const [status, setStatus] = useState("loading");
  const [error, setError] = useState(null);

  useEffect(() => {
    load();
  }, []);

  function load() {
    setStatus("loading");
    getNotifications()
      .then((data) => {
        setNotifications(data);
        setStatus("success");
      })
      .catch((err) => {
        setError(err);
        setStatus("error");
      });
  }

  async function handleMarkRead(id) {
    await markAsRead(id);
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, isRead: true } : n)));
  }

  async function handleMarkAllRead() {
    await markAllAsRead();
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
  }

  if (status === "loading") return <div className="page"><LoadingSpinner /></div>;
  if (status === "error") return <div className="page"><ErrorMessage error={error} /></div>;
  if (notifications.length === 0) return <div className="page"><EmptyState message="No notifications." /></div>;

  return (
    <div className="page">
      <div className="page-toolbar">
        <div>
          <p className="eyebrow">Updates</p>
          <h1>Notifications</h1>
        </div>
        <button className="btn secondary" onClick={handleMarkAllRead}>Mark all as read</button>
      </div>
      <div className="stack">
      {notifications.map((n) => (
        <div key={n.id} className={`card item-row ${n.isRead ? "is-read" : ""}`}>
          <span>{n.message}</span>
          <span className="muted">{formatDateTime(n.createdAt)}</span>
          {!n.isRead && (
            <button className="btn secondary" onClick={() => handleMarkRead(n.id)}>Mark read</button>
          )}
        </div>
      ))}
      </div>
    </div>
  );
}
