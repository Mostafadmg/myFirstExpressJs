import { Link } from "react-router-dom";
import { formatCurrency } from "../../utils/formatters.js";
import { RatingStars } from "../common/RatingStars.jsx";

export function ListingCard({ listing }) {
  const initial = (listing.title || "?").trim().charAt(0).toUpperCase();

  return (
    <Link to={`/listings/${listing.id}`} className="listing-card">
      <div className="listing-photo">
        {listing.photoUrl ? (
          <img src={listing.photoUrl} alt={listing.title} />
        ) : (
          <span className="listing-fallback">{initial}</span>
        )}
        {listing.type && <span className="chip">{listing.type}</span>}
      </div>
      <div className="listing-body">
        <p className="eyebrow">{listing.category || "Listing"}</p>
        <strong>{listing.title}</strong>
        <div className="listing-meta">
          <span className="price">{formatCurrency(listing.priceInCents)}</span>
          <RatingStars rating={listing.averageRating} />
        </div>
      </div>
    </Link>
  );
}
