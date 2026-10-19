import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { createListing, uploadListingPhotos } from "../../api/listingsApi.js";
import { getCategories } from "../../api/categoriesApi.js";
import { ErrorMessage } from "../../components/common/ErrorMessage.jsx";
import { LISTING_TYPE } from "../../utils/constants.js";

export function CreateListingPage() {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [photos, setPhotos] = useState([]);
  const [previews, setPreviews] = useState([]);
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
    if (photos.length < 1) {
      setError(new Error("Add at least one photo."));
      return;
    }
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

      // The listing id does not exist until create returns, so the photo
      // request is second. A photo is required: handleSubmit already
      // returned if photos was empty.
      await uploadListingPhotos(listing.id, photos);
      navigate(`/listings/${listing.id}`);
    } catch (err) {
      setError(err);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="page narrow">
      <p className="eyebrow">New listing</p>
      <h1>Add a listing</h1>
      <p>
        A photo is required. Submitting creates the listing and uploads that photo.
      </p>
      <form onSubmit={handleSubmit} className="card listing-form">
        <div className="field">
          <label htmlFor="listing-title">Title</label>
          <input
            id="listing-title"
            name="title"
            placeholder="e.g. Walnut headphone stand"
            required
          />
        </div>
        <div className="field">
          <label htmlFor="listing-description">Description</label>
          <textarea
            id="listing-description"
            name="description"
            rows="4"
            placeholder="Materials, dimensions, condition, and what makes it worth buying."
            required
          />
        </div>
        <div className="field-row">
          <div className="field">
            <label htmlFor="listing-price">Price (USD)</label>
            <input
              id="listing-price"
              name="price"
              type="number"
              step="0.01"
              min="0"
              placeholder="0.00"
              required
            />
          </div>
          <div className="field">
            <label htmlFor="listing-stock">Stock (products only)</label>
            <input id="listing-stock" name="stock" type="number" min="0" placeholder="1" />
          </div>
        </div>
        <div className="field-row">
          <div className="field">
            <label htmlFor="listing-category">Category</label>
            <div className="select-wrap">
              <select id="listing-category" name="category" required>
                {categories.map((c) => (
                  <option key={c.id} value={c.slug}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="field">
            <label htmlFor="listing-type">Type</label>
            <div className="select-wrap">
              <select id="listing-type" name="type" required>
                <option value={LISTING_TYPE.PRODUCT}>Physical product (has stock)</option>
                <option value={LISTING_TYPE.SERVICE}>
                  Bookable service (has availability)
                </option>
              </select>
            </div>
          </div>
        </div>
        <div className="field">
          <span className="field-label" id="listing-photos-label">
            Photos
          </span>
          <div className="file-upload">
            <input
              id="listing-photos"
              className="file-upload-input"
              name="photos"
              type="file"
              accept="image/*"
              multiple
              required
              onChange={handlePhotoChange}
              aria-labelledby="listing-photos-label"
            />
            <label htmlFor="listing-photos" className="file-upload-label">
              <span className="file-upload-title">Upload photos</span>
              <span className="file-upload-hint">
                {photos.length > 0
                  ? `${photos.length} photo${photos.length === 1 ? "" : "s"} selected`
                  : "JPG, PNG, or WebP · at least one required"}
              </span>
            </label>
          </div>
          {previews.length > 0 && (
            <div className="photo-preview-row">
              {previews.map((src) => (
                <img key={src} src={src} alt="" className="photo-preview" />
              ))}
            </div>
          )}
        </div>
        {error && <ErrorMessage error={error} />}
        <div className="listing-form-actions">
          <button className="btn" type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Creating…" : "Create listing"}
          </button>
        </div>
      </form>
    </div>
  );
}
