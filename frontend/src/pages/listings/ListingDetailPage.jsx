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

const FEEDBACK_PREVIEW = 3;

function authorInitial(name) {
  return (name || "?").trim().charAt(0).toUpperCase();
}

export function ListingDetailPage() {
  const { id } = useParams();
  const { currentUser } = useAuth();

  const [listing, setListing] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [comments, setComments] = useState([]);
  const [photoIndex, setPhotoIndex] = useState(0);
  const [showAllReviews, setShowAllReviews] = useState(false);
  const [showAllComments, setShowAllComments] = useState(false);
  const [status, setStatus] = useState("loading");
  const [error, setError] = useState(null);

  // Runs again whenever `id` changes (navigating from one listing straight
  // to another re-triggers this effect because `id` is in the dependency
  // array) — that's the correct, intentional use of a dependency array,
  // unlike the earlier bug where the effect depended on its own output.
  useEffect(() => {
    setStatus("loading");
    setShowAllReviews(false);
    setShowAllComments(false);
    Promise.all([getListingById(id), getReviewsForListing(id), getCommentsForListing(id)])
      .then(([listingData, reviewsData, commentsData]) => {
        setListing(listingData);
        setReviews(reviewsData);
        setComments(commentsData);
        setPhotoIndex(0);
        setStatus("success");
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

  const visibleReviews = showAllReviews ? reviews : reviews.slice(0, FEEDBACK_PREVIEW);
  const visibleComments = showAllComments ? comments : comments.slice(0, FEEDBACK_PREVIEW);
  const hiddenReviewCount = Math.max(reviews.length - FEEDBACK_PREVIEW, 0);
  const hiddenCommentCount = Math.max(comments.length - FEEDBACK_PREVIEW, 0);

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

          <div className="row">
            <Link to={`/listings/${id}/edit`} className="btn secondary">
              Edit listing
            </Link>
            {currentUser && listing.type === LISTING_TYPE.PRODUCT && (
              <>
                <button className="btn" type="button" onClick={handleAddToCart}>
                  Add to cart
                </button>
                <button className="btn secondary" type="button" onClick={handleFavorite}>
                  Save to favorites
                </button>
              </>
            )}
            {currentUser && listing.type === LISTING_TYPE.SERVICE && (
              <Link to={`/bookings/new?listingId=${id}`} className="btn">
                Check availability &amp; book
              </Link>
            )}
          </div>
        </div>
      </div>

      <section className="section-block feedback-section">
        <div className="section-head">
          <div>
            <p className="eyebrow">Buyer feedback</p>
            <h3>Reviews</h3>
          </div>
          {reviews.length > 0 && (
            <div className="section-head-meta">
              <RatingStars rating={listing.averageRating} />
              <span className="muted feedback-count">
                {listing.averageRating?.toFixed(1)} · {reviews.length}{" "}
                {reviews.length === 1 ? "review" : "reviews"}
              </span>
            </div>
          )}
        </div>

        {reviews.length === 0 ? (
          <p className="feedback-empty muted">No reviews yet. Be the first to share your experience.</p>
        ) : (
          <ul className="feedback-list">
            {visibleReviews.map((review) => (
              <li key={review.id} className="feedback-item">
                <div className="feedback-author">
                  <span className="feedback-avatar" aria-hidden="true">
                    {authorInitial(review.authorName)}
                  </span>
                  <div>
                    <p className="feedback-name">{review.authorName || "Buyer"}</p>
                    <RatingStars rating={review.rating} />
                  </div>
                </div>
                {review.comment ? <p className="feedback-body">{review.comment}</p> : null}
              </li>
            ))}
          </ul>
        )}

        {hiddenReviewCount > 0 && (
          <button
            type="button"
            className="btn link feedback-toggle"
            onClick={() => setShowAllReviews((open) => !open)}
          >
            {showAllReviews
              ? "Show fewer reviews"
              : `Show all ${reviews.length} reviews`}
          </button>
        )}

        {currentUser && !userAlreadyReviewed && (
          <form onSubmit={handleReviewSubmit} className="card feedback-form">
            <p className="eyebrow">Write a review</p>
            <div className="field">
              <label htmlFor="review-rating">Your rating</label>
              <input
                id="review-rating"
                name="rating"
                type="number"
                min="1"
                max="5"
                required
              />
            </div>
            <div className="field">
              <label htmlFor="review-comment">Your review</label>
              <textarea
                id="review-comment"
                name="comment"
                rows="3"
                placeholder="What did you like? Would you recommend this listing?"
              />
            </div>
            <button className="btn" type="submit">
              Publish review
            </button>
          </form>
        )}
      </section>

      <section className="section-block feedback-section">
        <div className="section-head">
          <div>
            <p className="eyebrow">Community</p>
            <h3>Questions &amp; comments</h3>
          </div>
          {comments.length > 0 && (
            <span className="muted feedback-count">
              {comments.length} {comments.length === 1 ? "comment" : "comments"}
            </span>
          )}
        </div>

        {comments.length === 0 ? (
          <p className="feedback-empty muted">Ask a question or leave a note for other shoppers.</p>
        ) : (
          <ul className="feedback-list">
            {visibleComments.map((comment) => (
              <li key={comment.id} className="feedback-item">
                <div className="feedback-author">
                  <span className="feedback-avatar" aria-hidden="true">
                    {authorInitial(comment.authorName)}
                  </span>
                  <div>
                    <p className="feedback-name">{comment.authorName || "Shopper"}</p>
                    {comment.createdAt ? (
                      <p className="feedback-meta muted">{formatDateTime(comment.createdAt)}</p>
                    ) : null}
                  </div>
                </div>
                <p className="feedback-body">{comment.text}</p>
              </li>
            ))}
          </ul>
        )}

        {hiddenCommentCount > 0 && (
          <button
            type="button"
            className="btn link feedback-toggle"
            onClick={() => setShowAllComments((open) => !open)}
          >
            {showAllComments
              ? "Show fewer comments"
              : `Show all ${comments.length} comments`}
          </button>
        )}

        {currentUser && (
          <form onSubmit={handleCommentSubmit} className="composer feedback-composer">
            <input name="text" placeholder="Ask about sizing, pickup, or details…" required />
            <button className="btn secondary" type="submit">
              Post comment
            </button>
          </form>
        )}
      </section>
    </div>
  );
}
