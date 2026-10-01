import { useState, useEffect } from "react";
import { getMyBookings, cancelBooking } from "../../api/bookingsApi.js";
import { LoadingSpinner } from "../../components/common/LoadingSpinner.jsx";
import { ErrorMessage } from "../../components/common/ErrorMessage.jsx";
import { EmptyState } from "../../components/common/EmptyState.jsx";
import { formatDateTime } from "../../utils/formatters.js";
import { BOOKING_STATUS } from "../../utils/constants.js";

export function MyBookingsPage() {
  const [bookings, setBookings] = useState([]);
  const [status, setStatus] = useState("loading");
  const [error, setError] = useState(null);

  useEffect(() => {
    load();
  }, []);

  function load() {
    setStatus("loading");
    getMyBookings()
      .then((data) => {
        setBookings(data);
        setStatus("success");
      })
      .catch((err) => {
        setError(err);
        setStatus("error");
      });
  }

  async function handleCancel(bookingId) {
    await cancelBooking(bookingId);
    load();
  }

  if (status === "loading") return <div className="page"><LoadingSpinner /></div>;
  if (status === "error") return <div className="page"><ErrorMessage error={error} /></div>;
  if (bookings.length === 0) return <div className="page"><EmptyState message="No bookings yet." /></div>;

  return (
    <div className="page">
      <p className="eyebrow">Calendar</p>
      <h1>My bookings</h1>
      <div className="stack">
      {bookings.map((booking) => (
        <div key={booking.id} className="card item-row">
          <strong>{booking.listingTitle}</strong>
          <span className="muted">{formatDateTime(booking.start)}</span>
          <span className={`badge ${booking.status}`}>{booking.status}</span>
          {booking.status === BOOKING_STATUS.CONFIRMED && (
            <button className="btn danger" onClick={() => handleCancel(booking.id)}>Cancel</button>
          )}
        </div>
      ))}
      </div>
    </div>
  );
}
