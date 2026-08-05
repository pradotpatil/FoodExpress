import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import api from "../services/api";
import "./ForgotPassword.css";

function ForgotPassword() {
  const navigate = useNavigate();

  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    email: "",
    code: "",
    newPassword: "",
    confirmPassword: "",
  });

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((previousData) => ({
      ...previousData,
      [name]: value,
    }));
  };

  const handleSendCode = async (event) => {
    event.preventDefault();

    if (!formData.email.trim()) {
      toast.warning("Please enter your email.");
      return;
    }

    try {
      setLoading(true);

      await api.post("/auth/password/send-code", {
        email: formData.email.trim(),
      });

      toast.success("Reset code sent to your email.");
      setStep(2);
    } catch (error) {
      console.error("Send reset code error:", error);

      toast.error(
        error.response?.data || "Failed to send reset code."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (event) => {
    event.preventDefault();

    if (
      !formData.code.trim() ||
      !formData.newPassword.trim() ||
      !formData.confirmPassword.trim()
    ) {
      toast.warning("Please fill all password reset details.");
      return;
    }

    if (formData.newPassword.length < 6) {
      toast.warning(
        "Password must contain at least 6 characters."
      );
      return;
    }

    if (
      formData.newPassword !== formData.confirmPassword
    ) {
      toast.warning("Passwords do not match.");
      return;
    }

    try {
      setLoading(true);

      await api.post("/auth/password/reset", {
        email: formData.email.trim(),
        code: formData.code.trim(),
        newPassword: formData.newPassword,
      });

      toast.success("Password reset successfully!");

      navigate("/login");
    } catch (error) {
      console.error("Password reset error:", error);

      toast.error(
        error.response?.data || "Failed to reset password."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="forgot-password-page">
      <div className="forgot-password-card">
        <div className="forgot-password-icon">
          🔐
        </div>

        <h1>Forgot Password</h1>

        {step === 1 ? (
          <>
            <p>
              Enter your registered email address. We will send
              you a six-digit reset code.
            </p>

            <form onSubmit={handleSendCode}>
              <div className="forgot-password-field">
                <label htmlFor="email">
                  Email Address
                </label>

                <input
                  id="email"
                  type="email"
                  name="email"
                  placeholder="Enter your registered email"
                  value={formData.email}
                  onChange={handleChange}
                />
              </div>

              <button
                type="submit"
                disabled={loading}
              >
                {loading
                  ? "Sending Code..."
                  : "Send Reset Code"}
              </button>
            </form>
          </>
        ) : (
          <>
            <p>
              Enter the reset code sent to your email and create
              a new password.
            </p>

            <form onSubmit={handleResetPassword}>
              <div className="forgot-password-field">
                <label htmlFor="code">
                  Reset Code
                </label>

                <input
                  id="code"
                  type="text"
                  name="code"
                  placeholder="Enter 6-digit code"
                  maxLength="6"
                  value={formData.code}
                  onChange={handleChange}
                />
              </div>

              <div className="forgot-password-field">
                <label htmlFor="newPassword">
                  New Password
                </label>

                <input
                  id="newPassword"
                  type="password"
                  name="newPassword"
                  placeholder="Enter new password"
                  value={formData.newPassword}
                  onChange={handleChange}
                />
              </div>

              <div className="forgot-password-field">
                <label htmlFor="confirmPassword">
                  Confirm Password
                </label>

                <input
                  id="confirmPassword"
                  type="password"
                  name="confirmPassword"
                  placeholder="Confirm new password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                />
              </div>

              <button
                type="submit"
                disabled={loading}
              >
                {loading
                  ? "Resetting Password..."
                  : "Reset Password"}
              </button>

              <button
                type="button"
                className="resend-code-button"
                onClick={handleSendCode}
                disabled={loading}
              >
                Resend Code
              </button>
            </form>
          </>
        )}

        <button
          type="button"
          className="back-login-button"
          onClick={() => navigate("/login")}
        >
          Back to Login
        </button>
      </div>
    </main>
  );
}

export default ForgotPassword;