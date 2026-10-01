import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { getUserProfile, followUser, unfollowUser, getFollowers } from "../../api/usersApi.js";
import { LoadingSpinner } from "../../components/common/LoadingSpinner.jsx";
import { ErrorMessage } from "../../components/common/ErrorMessage.jsx";
import { useAuth } from "../../hooks/useAuth.js";

export function PublicProfilePage() {
  const { id } = useParams();
  const { currentUser } = useAuth();
  const [profile, setProfile] = useState(null);
  const [followerCount, setFollowerCount] = useState(0);
  const [isFollowing, setIsFollowing] = useState(false);
  const [status, setStatus] = useState("loading");
  const [error, setError] = useState(null);

  useEffect(() => {
    Promise.all([getUserProfile(id), getFollowers(id)])
      .then(([profileData, followers]) => {
        setProfile(profileData);
        setFollowerCount(followers.length);
        setIsFollowing(followers.some((f) => f.id === currentUser?.id));
        setStatus("success");
      })
      .catch((err) => {
        setError(err);
        setStatus("error");
      });
  }, [id, currentUser]);

  async function toggleFollow() {
    if (isFollowing) {
      await unfollowUser(id);
      setFollowerCount((c) => c - 1);
    } else {
      await followUser(id);
      setFollowerCount((c) => c + 1);
    }
    setIsFollowing(!isFollowing);
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
          <p className="muted">{followerCount} followers</p>
          {currentUser && currentUser.id !== id && (
            <button className="btn" onClick={toggleFollow}>
              {isFollowing ? "Unfollow" : "Follow"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
