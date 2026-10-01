import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getConversations } from "../../api/messagesApi.js";
import { LoadingSpinner } from "../../components/common/LoadingSpinner.jsx";
import { ErrorMessage } from "../../components/common/ErrorMessage.jsx";
import { EmptyState } from "../../components/common/EmptyState.jsx";
import { formatDateTime } from "../../utils/formatters.js";

export function InboxPage() {
  const [conversations, setConversations] = useState([]);
  const [status, setStatus] = useState("loading");
  const [error, setError] = useState(null);

  useEffect(() => {
    getConversations()
      .then((data) => {
        setConversations(data);
        setStatus("success");
      })
      .catch((err) => {
        setError(err);
        setStatus("error");
      });
  }, []);

  if (status === "loading") return <div className="page"><LoadingSpinner /></div>;
  if (status === "error") return <div className="page"><ErrorMessage error={error} /></div>;
  if (conversations.length === 0) return <div className="page"><EmptyState message="No conversations yet." /></div>;

  return (
    <div className="page">
      <p className="eyebrow">Inbox</p>
      <h1>Messages</h1>
      <div className="stack">
      {conversations.map((c) => (
        <Link key={c.id} to={`/messages/${c.id}`} className="card item-row">
          <strong>{c.otherUserName}</strong>
          <span className="muted">{c.lastMessagePreview}</span>
          <span className="muted">{formatDateTime(c.updatedAt)}</span>
        </Link>
      ))}
      </div>
    </div>
  );
}
