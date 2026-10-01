import { useState, useEffect } from "react";
import { useAuth } from "../../hooks/useAuth.js";
import { getUserProfile, updateProfile, uploadAvatar, uploadCoverPhoto } from "../../api/usersApi.js";
import { getMyListings } from "../../api/listingsApi.js";
import { PhotoUploader } from "../../components/common/PhotoUploader.jsx";
import { ListingGrid } from "../../components/listings/ListingGrid.jsx";
import { LoadingSpinner } from "../../components/common/LoadingSpinner.jsx";
import { ErrorMessage } from "../../components/common/ErrorMessage.jsx";
import { RoleGate } from "../../components/common/RoleGate.jsx";
import { ROLES } from "../../utils/constants.js";

export function MyProfilePage() {
  const { currentUser } = useAuth();
  const [profile, setProfile] = useState(null);
  const [myListings, setMyListings] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [status, setStatus] = useState("loading");
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!currentUser) return;
    Promise.all([getUserProfile(currentUser.id), getMyListings()])
      .then(([profileData, listingsData]) => {
        setProfile(profileData);
        setMyListings(listingsData);
        setStatus("success");
      })
      .catch((err) => {
        setError(err);
        setStatus("error");
      });
  }, [currentUser]);

  async function handleSave(e) {
    e.preventDefault();
    const form = new FormData(e.target);
    const updated = await updateProfile(currentUser.id, {
      name: form.get("name"),
      bio: form.get("bio"),
      location: form.get("location"),
    });
    setProfile(updated);
    setIsEditing(false);
  }

  if (status === "loading") return <div className="page"><LoadingSpinner /></div>;
  if (status === "error") return <div className="page"><ErrorMessage error={error} /></div>;

  return (
    <div className="page">
      <div className="card profile-card">
        <div className="cover">
          {profile.coverPhotoUrl && <img src={profile.coverPhotoUrl} alt="" />}
        </div>
        <div className="profile-body">
        <div className="avatar">
          {profile.avatarUrl ? <img src={profile.avatarUrl} alt="" /> : (profile.name || "?").trim().charAt(0).toUpperCase()}
        </div>
        <h1>{profile.name}</h1>
        <p className="muted">{profile.location}</p>
        <p>{profile.bio}</p>
        <div className="profile-actions">
          <PhotoUploader onUpload={async (file) => setProfile(await uploadAvatar(currentUser.id, file))} label="Avatar" />
          <PhotoUploader onUpload={async (file) => setProfile(await uploadCoverPhoto(currentUser.id, file))} label="Cover photo" />
        </div>
        {isEditing ? (
          <form onSubmit={handleSave}>
            <div className="field">
              <label>Name</label>
              <input name="name" defaultValue={profile.name} />
            </div>
            <div className="field">
              <label>Location</label>
              <input name="location" defaultValue={profile.location} />
            </div>
            <div className="field">
              <label>Bio</label>
              <textarea name="bio" defaultValue={profile.bio} rows="3" />
            </div>
            <button className="btn" type="submit">Save</button>
          </form>
        ) : (
          <button className="btn secondary" onClick={() => setIsEditing(true)}>Edit profile</button>
        )}
        </div>
      </div>

      <RoleGate allow={[ROLES.SELLER, ROLES.ADMIN]}>
        <h2>My listings</h2>
        <ListingGrid listings={myListings} />
      </RoleGate>
    </div>
  );
}
