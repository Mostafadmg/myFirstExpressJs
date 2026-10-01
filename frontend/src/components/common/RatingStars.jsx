export function RatingStars({ rating = 0, outOf = 5 }) {
  const stars = Array.from({ length: outOf }, (_, i) => (i < Math.round(rating) ? "★" : "☆"));
  return (
    <span className="stars" aria-label={`Rated ${rating} out of ${outOf}`} title={`${rating} / ${outOf}`}>
      {stars.join("")}
    </span>
  );
}
