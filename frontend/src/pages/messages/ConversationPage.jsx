import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { getMessages, sendMessage } from "../../api/messagesApi.js";
import { LoadingSpinner } from "../../components/common/LoadingSpinner.jsx";
import { ErrorMessage } from "../../components/common/ErrorMessage.jsx";

export function ConversationPage() {
  const { id } = useParams();
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const [status, setStatus] = useState("loading");
  const [error, setError] = useState(null);

  useEffect(() => {
    getMessages(id)
      .then((data) => {
        setMessages(data);
        setStatus("success");
      })
      .catch((err) => {
        setError(err);
        setStatus("error");
      });
  }, [id]);

  async function handleSend(e) {
    e.preventDefault();
    if (!text.trim()) return;
    const message = await sendMessage(id, text);
    setMessages((prev) => [...prev, message]);
    setText("");
  }

  if (status === "loading") return <div className="page"><LoadingSpinner /></div>;
  if (status === "error") return <div className="page"><ErrorMessage error={error} /></div>;

  return (
    <div className="page">
      <p className="eyebrow">Thread</p>
      <h1>Conversation</h1>
      <div className="card thread">
        {messages.map((m) => (
          <p key={m.id} className="bubble">
            <strong>{m.senderName}</strong>
            {m.text}
          </p>
        ))}
      </div>
      <form onSubmit={handleSend} className="row composer">
        <input value={text} onChange={(e) => setText(e.target.value)} placeholder="Type a message..." />
        <button className="btn" type="submit">Send</button>
      </form>
    </div>
  );
}
