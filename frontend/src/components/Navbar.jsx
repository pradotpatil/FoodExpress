import { Link, useNavigate } from "react-router-dom";
import { useContext } from "react";
import { ThemeContext } from "../context/ThemeContext";
import { toast } from "react-toastify";

function Navbar() {
  const navigate = useNavigate();

  const { darkMode, toggleTheme } = useContext(ThemeContext);

  const user = JSON.parse(localStorage.getItem("user"));

  const handleLogout = () => {
    localStorage.removeItem("user");

    toast.success("Logged out successfully!");

    navigate("/login");
  };

  return (
    <nav
      style={{
        background: "#ff4d4f",
        color: "white",
        padding: "15px 40px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        position: "sticky",
        top: 0,
        zIndex: 1000,
      }}
    >
      <h2
        style={{
          margin: 0,
          cursor: "pointer",
        }}
        onClick={() => navigate("/")}
      >
        🍔 FoodExpress
      </h2>

      <div
        style={{
          display: "flex",
          gap: "25px",
          alignItems: "center",
        }}
      >
        <Link style={linkStyle} to="/">
          Home
        </Link>

        {user && (
          <>
            <Link style={linkStyle} to="/restaurants">
              Restaurants
            </Link>

            <Link style={linkStyle} to="/cart">
              Cart
            </Link>

            <Link style={linkStyle} to="/orders">
              Orders
            </Link>

            <Link style={linkStyle} to="/profile">
              Profile
            </Link>
          </>
        )}

        {/* 🌙 Dark Mode Toggle */}
        <button
          type="button"
          onClick={toggleTheme}
          style={{
            border: "none",
            background: "transparent",
            color: "white",
            fontSize: "22px",
            cursor: "pointer",
          }}
          title="Toggle Theme"
        >
          {darkMode ? "☀️" : "🌙"}
        </button>

        {!user ? (
          <>
            <Link style={linkStyle} to="/login">
              Login
            </Link>

            <Link style={linkStyle} to="/register">
              Register
            </Link>
          </>
        ) : (
          <>
            <span
              style={{
                fontWeight: "bold",
                color: "#fff",
              }}
            >
              👋 {user.name}
            </span>

            <button
              onClick={handleLogout}
              style={{
                background: "#fff",
                color: "#ff4d4f",
                border: "none",
                padding: "8px 15px",
                borderRadius: "8px",
                cursor: "pointer",
                fontWeight: "bold",
              }}
            >
              Logout
            </button>
          </>
        )}
      </div>
    </nav>
  );
}

const linkStyle = {
  color: "white",
  textDecoration: "none",
  fontWeight: "bold",
  fontSize: "17px",
};

export default Navbar;