import { useNavigate } from "react-router-dom";
import "./Profile.css";

function Profile() {
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user"));

  if (!user) {
    return (
      <main className="profile-page">
        <div className="profile-card">
          <h2>Please login first</h2>

          <button
            type="button"
            onClick={() => navigate("/login")}
          >
            Go to Login
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="profile-page">
      <div className="profile-card">
        <div className="profile-avatar">
          {user.name
            ? user.name.charAt(0).toUpperCase()
            : "U"}
        </div>

        <h1>{user.name}</h1>

        <p className="profile-role">
          {user.role || "USER"}
        </p>

        <div className="profile-details">
          <div className="profile-detail-row">
            <span>Name</span>
            <strong>{user.name || "Not available"}</strong>
          </div>

          <div className="profile-detail-row">
            <span>Email</span>
            <strong>{user.email || "Not available"}</strong>
          </div>

          <div className="profile-detail-row">
            <span>Role</span>
            <strong>{user.role || "USER"}</strong>
          </div>

          <div className="profile-detail-row">
            <span>User ID</span>
            <strong>{user.id || "Not available"}</strong>
          </div>
        </div>

        <button
          type="button"
          className="edit-profile-button"
          onClick={() => navigate("/profile/edit")}
        >
          Edit Profile
        </button>
      </div>
    </main>
  );
}

export default Profile;