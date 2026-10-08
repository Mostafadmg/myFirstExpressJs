import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { getListingById } from "../../api/listingsApi.js";
import { getReviewsForListing, createReview } from "../../api/reviewsApi.js";
import { getCommentsForListing, createComment } from "../../api/commentsApi.js";
import { addToCart } from "../../api/cartApi.js";
import { addFavorite } from "../../api/favoritesApi.js";
import { LoadingSpinner } from "../../components/common/LoadingSpinner.jsx";
import { ErrorMessage } from "../../components/common/ErrorMessage.jsx";
import { RatingStars } from "../../components/common/RatingStars.jsx";
import { formatCurrency, formatDateTime } from "../../utils/formatters.js";
import { LISTING_TYPE } from "../../utils/constants.js";
import { useAuth } from "../../hooks/useAuth.js";

export function ListingDetailPage() {
  const { id } = useParams();
  const { currentUser } = useAuth();

  const [listing, setListing] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [comments, setComments] = useState([]);
  const [photoIndex, setPhotoIndex] = useState(0);
  const [status, setStatus] = useState("loading");
  const [error, setError] = useState(null);

  // Runs again whenever `id` changes (navigating from one listing straight
  // to another re-triggers this effect because `id` is in the dependency
  // array) — that's the correct, intentional use of a dependency array,
  // unlike the earlier bug where the effect depended on its own output.
  useEffect(() => {
    setStatus("loading");
    Promise.all([getListingById(id), getReviewsForListing(id), getCommentsForListing(id)])
      .then(([listingData, reviewsData, commentsData]) => {
        setListing(listingData);
        setReviews(reviewsData);
        setComments(commentsData);
        setPhotoIndex(0);
        setStatus("success");
        console.log("commentsData:", commentsData);
        console.log("reviewsData:", reviewsData);
        console.log("listingData:", listingData);
      })
      .catch((err) => {
        setError(err);
        setStatus("error");
      });
  }, [id]);

  async function handleAddToCart() {
    await addToCart(id, 1);
  }

  async function handleFavorite() {
    await addFavorite(id);
  }

  async function handleReviewSubmit(e) {
    e.preventDefault();
    const form = new FormData(e.target);
    const review = await createReview(
      id,
      Number(form.get("rating")),
      form.get("comment"),
    );
    setReviews((prev) => [
      ...prev,
      { ...review, authorName: currentUser?.name, userId: review.userId },
    ]);
    e.target.reset();
  }

  async function handleCommentSubmit(e) {
    e.preventDefault();
    const form = new FormData(e.target);
    const comment = await createComment(id, form.get("text"));
    setComments((prev) => [...prev, comment]);
    e.target.reset();
  }

  if (status === "loading")
    return (
      <div className="page">
        <LoadingSpinner />
      </div>
    );
  if (status === "error")
    return (
      <div className="page">
        <ErrorMessage error={error} />
      </div>
    );

  const initial = (listing.title || "?").trim().charAt(0).toUpperCase();
  const photos = listing.photos?.length
    ? listing.photos
    : listing.photoUrl
      ? [listing.photoUrl]
      : [];
  const activePhoto = photos[photoIndex] || photos[0];

  const userAlreadyReviewed =
    currentUser &&
    reviews.some(
      (review) =>
        review.authorName === currentUser.name ||
        (review.userId != null &&
          String(review.userId) === String(currentUser.id)),
    );

  return (
    <div className="page">
      <Link to="/" className="back-link">
        &larr; Back to browse
      </Link>
      <div className="detail">
        <div>
          <div className="detail-media">
            {activePhoto ? (
              <img src={activePhoto} alt={listing.title} />
            ) : (
              <div className="detail-placeholder">
                <span>{initial}</span>
              </div>
            )}
          </div>
          {photos.length > 1 && (
            <div className="thumbs">
              {photos.map((src, index) => (
                <button
                  key={src}
                  type="button"
                  className={index === photoIndex ? "is-selected" : ""}
                  onClick={() => setPhotoIndex(index)}
                >
                  <img src={src} alt="" />
                </button>
              ))}
            </div>
          )}
        </div>
        <div className="card detail-panel">
          <p className="eyebrow">
            {[listing.category, listing.type].filter(Boolean).join(" · ")}
          </p>
          <h1>{listing.title}</h1>
          {listing.sellerId && (
            <Link to={`/users/${listing.sellerId}`} className="seller-link">
              {listing.sellerAvatarUrl && <img src={listing.sellerAvatarUrl} alt="" />}
              <span>{listing.sellerName}</span>
            </Link>
          )}
          <p className="detail-price">{formatCurrency(listing.priceInCents)}</p>
          <p>{listing.description}</p>

          {currentUser && listing.type === LISTING_TYPE.PRODUCT && (
            <div className="row">
              <button className="btn" onClick={handleAddToCart}>
                Add to cart
              </button>
              <button className="btn secondary" onClick={handleFavorite}>
                Save to favorites
              </button>
            </div>
          )}

          {currentUser && listing.type === LISTING_TYPE.SERVICE && (
            <Link to={`/bookings/new?listingId=${id}`} className="btn">
              Check availability &amp; book
            </Link>
          )}
        </div>
      </div>

      <section className="section-block">
        <h3>
          Reviews <RatingStars rating={listing.averageRating} />
        </h3>
        <div className="stack">
          {reviews.map((review) => (
            <div key={review.id} className="card">
              <RatingStars rating={review.rating} />
              <p>{review.comment}</p>
            </div>
          ))}
        </div>
        {currentUser && !userAlreadyReviewed && (
          <form onSubmit={handleReviewSubmit} className="card">
            <div className="field">
              <label>Rating (1-5)</label>
              <input name="rating" type="number" min="1" max="5" required />
            </div>
            <div className="field">
              <label>Comment</label>
              <textarea name="comment" rows="3" />
            </div>
            <button className="btn" type="submit">
              Submit review
            </button>
          </form>
        )}
      </section>

      <section className="section-block">
        <h3>Comments</h3>
        <div className="stack">
          {comments.map((comment) => (
            <div key={comment.id} className="card muted">
              <p className="eyebrow">
                {comment.authorName} · {formatDateTime(comment.createdAt)}
              </p>
              <p>{comment.text}</p>
            </div>
          ))}
        </div>
        {currentUser && (
          <form onSubmit={handleCommentSubmit} className="row composer">
            <input name="text" placeholder="Add a comment..." required />
            <button className="btn secondary" type="submit">
              Post
            </button>
          </form>
        )}
      </section>
    </div>
  );
}
