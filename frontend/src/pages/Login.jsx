import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import "./Login.css";

function Login() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((previousData) => ({
      ...previousData,
      [name]: value,
    }));
  };

  const saveFcmToken = async (userId) => {
    const fcmToken = localStorage.getItem("fcmToken");

    if (!userId || !fcmToken) {
      return;
    }

    try {
      await axios.put(
        `http://localhost:8080/api/users/${userId}/fcm-token`,
        {
          fcmToken,
        }
      );

      console.log("FCM token saved in MongoDB.");
    } catch (error) {
      console.error("FCM token save error:", error);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!formData.email.trim() || !formData.password.trim()) {
      toast.warning("Please enter email and password.");
      return;
    }

    try {
      setLoading(true);

      const response = await axios.post(
        "http://localhost:8080/api/auth/login",
        {
          email: formData.email.trim(),
          password: formData.password,
        }
      );

      const loggedInUser = response.data;

      localStorage.setItem(
        "user",
        JSON.stringify(loggedInUser)
      );

      await saveFcmToken(loggedInUser.id);

      toast.success("Login successful!");

      if (loggedInUser.role === "ADMIN") {
        navigate("/admin");
      } else {
        navigate("/restaurants");
      }
    } catch (error) {
      console.error("Login error:", error);

      const message =
        typeof error.response?.data === "string"
          ? error.response.data
          : "Login failed.";

      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="login-page">
      <div className="login-card">
        <div className="login-logo">🍔</div>

        <h1>Welcome Back</h1>

        <p>
          Login to continue ordering your favourite food.
        </p>

        <form onSubmit={handleSubmit}>
          <div className="login-form-group">
            <label htmlFor="email">
              Email Address
            </label>

            <input
              id="email"
              type="email"
              name="email"
              placeholder="Enter your email"
              value={formData.email}
              onChange={handleChange}
              autoComplete="email"
            />
          </div>

          <div className="login-form-group">
            <label htmlFor="password">
              Password
            </label>

            <input
              id="password"
              type="password"
              name="password"
              placeholder="Enter your password"
              value={formData.password}
              onChange={handleChange}
              autoComplete="current-password"
            />
          </div>

          <div
            style={{
              textAlign: "right",
              marginBottom: "18px",
            }}
          >
            <button
              type="button"
              onClick={() =>
                navigate("/forgot-password")
              }
              style={{
                border: "none",
                background: "transparent",
                color: "#ff4d4d",
                fontWeight: "700",
                cursor: "pointer",
              }}
            >
              Forgot Password?
            </button>
          </div>

          <button
            type="submit"
            className="login-button"
            disabled={loading}
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <p className="register-link">
          Don&apos;t have an account?{" "}
          <button
            type="button"
            onClick={() => navigate("/register")}
          >
            Register
          </button>
        </p>
      </div>
    </main>
  );
}

export default Login;