import { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { getAvailability, createBooking } from "../../api/bookingsApi.js";
import { LoadingSpinner } from "../../components/common/LoadingSpinner.jsx";
import { ErrorMessage } from "../../components/common/ErrorMessage.jsx";
import { EmptyState } from "../../components/common/EmptyState.jsx";

export function BookingCalendarPage() {
  const [searchParams] = useSearchParams();
  const listingId = searchParams.get("listingId");
  const navigate = useNavigate();

  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [slots, setSlots] = useState([]);
  const [status, setStatus] = useState("loading");
  const [error, setError] = useState(null);

  useEffect(() => {
    setStatus("loading");
    getAvailability(listingId, date)
      .then((data) => {
        setSlots(data.slots);
        setStatus("success");
      })
      .catch((err) => {
        setError(err);
        setStatus("error");
      });
  }, [listingId, date]);

  async function handleBook(slot) {
    const booking = await createBooking(listingId, slot.start, slot.end);
    navigate(`/bookings/mine`, { state: { justBooked: booking.id } });
  }

  return (
    <div className="page">
      <p className="eyebrow">Services</p>
      <h1>Choose a time</h1>
      <div className="field date-field">
        <label>Date</label>
        <input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
      </div>
      {status === "loading" && <LoadingSpinner />}
      {status === "error" && <ErrorMessage error={error} />}
      {status === "success" && slots.length === 0 && <EmptyState message="No available slots on this date." />}
      {status === "success" && (
        <div className="grid">
          {slots.map((slot) => (
            <button
              key={slot.start}
              className="card slot"
              disabled={!slot.isAvailable}
              onClick={() => handleBook(slot)}
            >
              {new Date(slot.start).toLocaleTimeString()} - {new Date(slot.end).toLocaleTimeString()}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
