import { ListingCard } from "./ListingCard.jsx";
import { EmptyState } from "../common/EmptyState.jsx";

export function ListingGrid({ listings }) {
  if (listings.length === 0) return <EmptyState message="No listings match your filters." />;

  return (
    <div className="grid">
      {listings.map((listing) => (
        <ListingCard key={listing.id} listing={listing} />
      ))}
    </div>
  );
}
