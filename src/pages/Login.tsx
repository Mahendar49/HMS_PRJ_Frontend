import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import LayoutLogin from "../components/LayoutLogin";
import { login } from "../api/authApi";
import { smartRedirectAfterLogin } from "../utils/routeUtils";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);
  const navigate = useNavigate();

  const handleLoginSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!email || !password) {
      setMessage({ type: "error", text: "Please fill in all fields" });
      return;
    }

    setLoading(true);
    setMessage(null);

    try {
      const result = await login(email, password);

      if (result?.accessToken || result?.token) {
        setMessage({
          type: "success",
          text: "Login successful! Redirecting...",
        });

        // Use smart redirect instead of hardcoded dashboard redirect
        const token = result?.accessToken || result?.token;
        setTimeout(async () => {
          try {
            console.log("🚀 Starting smart redirect after login...");
            await smartRedirectAfterLogin(token, navigate);
          } catch (redirectError) {
            console.error(
              "❌ Smart redirect failed, falling back to dashboard:",
              redirectError
            );
            navigate("/dashboard");
          }
        }, 1000);
      } else {
        setMessage({
          type: "error",
          text: "Login failed. Please check your credentials.",
        });
      }
    } catch (error: any) {
      setMessage({
        type: "error",
        text: "Invalid email or password. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <LayoutLogin>
      <form onSubmit={handleLoginSubmit}>
        {message && (
          <div
            className={`alert ${
              message.type === "success" ? "alert-success" : "alert-danger"
            }`}
            role="alert"
          >
            {message.text}
          </div>
        )}

        <div className="mb-3">
          <label htmlFor="email" className="form-label">
            Email Address
          </label>
          <input
            type="email"
            className="form-control"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            required
          />
        </div>

        <div className="mb-3">
          <label htmlFor="password" className="form-label">
            Password
          </label>
          <input
            type="password"
            className="form-control"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter your password"
            required
          />
        </div>

        <div className="row g-2">
          <div className="col-6">
            <button
              type="submit"
              className="btn btn-primary btn-lg w-100"
              disabled={loading}
            >
              {loading ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2" />
                  Signing in...
                </>
              ) : (
                "Sign In"
              )}
            </button>
          </div>

          <div className="col-6">
            <button
              type="button"
              onClick={() => navigate("/register")}
              className="btn btn-outline-secondary btn-lg w-100"
            >
              Register
            </button>
          </div>
        </div>

        <div className="text-center mt-3">
          <button
            type="button"
            onClick={() => navigate("/forgot-password")}
            className="btn btn-link text-muted text-decoration-none"
          >
            Forgot your password?
          </button>
        </div>

        <div className="text-center mt-3">
          <button
            type="button"
            onClick={() => navigate("/demo-login")}
            className="btn btn-link"
          >
            Use demo login (offline)
          </button>
        </div>
      </form>
    </LayoutLogin>
  );
}
