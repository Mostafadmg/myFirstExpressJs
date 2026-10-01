import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { createListing, uploadListingPhotos } from "../../api/listingsApi.js";
import { getCategories } from "../../api/categoriesApi.js";
import { PhotoUploader } from "../../components/common/PhotoUploader.jsx";
import { ErrorMessage } from "../../components/common/ErrorMessage.jsx";
import { LISTING_TYPE } from "../../utils/constants.js";

export function CreateListingPage() {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [createdListingId, setCreatedListingId] = useState(null);
  const [photos, setPhotos] = useState([]);
  const [previews, setPreviews] = useState([]);
  const [attachedCount, setAttachedCount] = useState(0);
  const previewsRef = useRef([]);

  // blob: URLs are owned by this page. Revoke them when the page unmounts
  // so the browser can drop the image bytes.
  useEffect(() => {
    return () => {
      previewsRef.current.forEach((url) => URL.revokeObjectURL(url));
    };
  }, []);

  function handlePhotoChange(event) {
    const files = Array.from(event.target.files || []);
    previewsRef.current.forEach((url) => URL.revokeObjectURL(url));
    const urls = files.map((file) => URL.createObjectURL(file));
    previewsRef.current = urls;
    setPhotos(files);
    setPreviews(urls);
  }

  useEffect(() => {
    getCategories()
      .then(setCategories)
      .catch(() => setCategories([]));
  }, []);

  async function handleSubmit(e) {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);
    const form = new FormData(e.target);

    try {
      const listing = await createListing({
        title: form.get("title"),
        description: form.get("description"),
        priceInCents: Math.round(Number(form.get("price")) * 100),
        category: form.get("category"),
        type: form.get("type"),
        stock:
          form.get("type") === LISTING_TYPE.PRODUCT
            ? Number(form.get("stock"))
            : undefined,
      });

      // The listing id does not exist until create returns. Photos are
      // optional: skip the upload when the file input was left empty.
      // If the photo step fails, the listing still exists — don't make
      // the user submit the form again and create a second copy.
      if (photos.length > 0) {
        try {
          await uploadListingPhotos(listing.id, photos);
          setAttachedCount(photos.length);
        } catch (photoErr) {
          setError(photoErr);
        }
      }
      setCreatedListingId(listing.id);
    } catch (err) {
      setError(err);
    } finally {
      setIsSubmitting(false);
    }
  }

  // Photos chosen on the form are uploaded as soon as the listing has an
  // id. This screen is only for adding more, or for skipping ahead.
  if (createdListingId) {
    return (
      <div className="page narrow">
        <p className="eyebrow">Almost there</p>
        <h1>{attachedCount > 0 ? "Photos attached" : "Add photos"}</h1>
        <p>
          {attachedCount > 0
            ? "Those photos are already on the listing. The first one is the picture on the home page card. You can add more, or go look."
            : "The listing is already saved. A photo is optional — add one now, or leave the card with just its title."}
        </p>
        {error && <ErrorMessage error={error} />}
        <PhotoUploader
          multiple
          onUpload={(files) => uploadListingPhotos(createdListingId, files)}
          label="Listing photos"
        />
        <div className="row">
          <button className="btn" type="button" onClick={() => navigate("/")}>
            View on home page
          </button>
          <button
            className="btn secondary"
            type="button"
            onClick={() => navigate(`/listings/${createdListingId}`)}
          >
            Open listing
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="page narrow">
      <p className="eyebrow">New listing</p>
      <h1>Add a listing</h1>
      <p>
        Fill this in and it shows up on the home page with the other listings. Nothing is
        sent to the Express server yet.
      </p>
      <form onSubmit={handleSubmit} className="card">
        <div className="field">
          <label>Title</label>
          <input name="title" required />
        </div>
        <div className="field">
          <label>Description</label>
          <textarea name="description" rows="4" required />
        </div>
        <div className="field">
          <label>Price (USD)</label>
          <input name="price" type="number" step="0.01" min="0" required />
        </div>
        <div className="field">
          <label>Category</label>
          <select name="category" required>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>
        <div className="field">
          <label>Type</label>
          <select name="type" required>
            <option value={LISTING_TYPE.PRODUCT}>Physical product (has stock)</option>
            <option value={LISTING_TYPE.SERVICE}>
              Bookable service (has availability)
            </option>
          </select>
        </div>
        <div className="field">
          <label>Stock (products only)</label>
          <input name="stock" type="number" min="0" />
        </div>
        <div className="field">
          <label htmlFor="listing-photos">Photos (optional)</label>
          <input
            id="listing-photos"
            name="photos"
            type="file"
            accept="image/*"
            multiple
            onChange={handlePhotoChange}
          />
          <p className="muted">
            Skip this if you want. The first photo is the picture on the home page card.
          </p>
          {previews.length > 0 && (
            <div className="photo-preview-row">
              {previews.map((src) => (
                <img key={src} src={src} alt="" className="photo-preview" />
              ))}
            </div>
          )}
        </div>
        {error && <ErrorMessage error={error} />}
        <button className="btn" type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Creating..." : "Create listing"}
        </button>
      </form>
    </div>
  );
}
