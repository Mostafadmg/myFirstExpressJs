import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getListingById, updateListing, deleteListing, uploadListingPhotos } from "../../api/listingsApi.js";
import { PhotoUploader } from "../../components/common/PhotoUploader.jsx";
import { LoadingSpinner } from "../../components/common/LoadingSpinner.jsx";
import { ErrorMessage } from "../../components/common/ErrorMessage.jsx";

export function EditListingPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [listing, setListing] = useState(null);
  const [status, setStatus] = useState("loading");
  const [error, setError] = useState(null);

  useEffect(() => {
    getListingById(id)
      .then((data) => {
        setListing(data);
        setStatus("success");
      })
      .catch((err) => {
        setError(err);
        setStatus("error");
      });
  }, [id]);

  async function handleSubmit(e) {
    e.preventDefault();
    const form = new FormData(e.target);
    const updated = await updateListing(id, {
      title: form.get("title"),
      description: form.get("description"),
      priceInCents: Math.round(Number(form.get("price")) * 100),
    });
    setListing(updated);
  }

  async function handleDelete() {
    await deleteListing(id);
    navigate("/");
  }

  if (status === "loading") return <div className="page"><LoadingSpinner /></div>;
  if (status === "error") return <div className="page"><ErrorMessage error={error} /></div>;

  return (
    <div className="page narrow">
      <p className="eyebrow">Seller</p>
      <h1>Edit listing</h1>
      <form onSubmit={handleSubmit} className="card">
        <div className="field">
          <label>Title</label>
          <input name="title" defaultValue={listing.title} required />
        </div>
        <div className="field">
          <label>Description</label>
          <textarea name="description" rows="4" defaultValue={listing.description} required />
        </div>
        <div className="field">
          <label>Price (USD)</label>
          <input name="price" type="number" step="0.01" defaultValue={listing.priceInCents / 100} required />
        </div>
        <button className="btn" type="submit">Save changes</button>
      </form>

      <PhotoUploader multiple onUpload={(files) => uploadListingPhotos(id, files)} label="Add more photos" />

      <button className="btn danger" onClick={handleDelete}>
        Delete listing
      </button>
    </div>
  );
}
