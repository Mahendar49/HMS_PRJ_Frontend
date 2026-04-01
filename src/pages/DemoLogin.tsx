import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import LayoutLogin from "../components/LayoutLogin";
import { loginDemo } from "../api/authApi";
import { smartRedirectAfterLogin } from "../utils/routeUtils";

export default function DemoLogin() {
  const [email, setEmail] = useState(import.meta.env.VITE_TEST_LOGIN_EMAIL || "");
  const [password, setPassword] = useState(import.meta.env.VITE_TEST_LOGIN_PASSWORD || "");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);
  const navigate = useNavigate();

  const hasDemoCredentials = Boolean(email && password);

  const handleLoginSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!email || !password) {
      setMessage({ type: "error", text: "Please provide demo credentials." });
      return;
    }

    setLoading(true);
    setMessage(null);

    try {
      const result = await loginDemo(email, password);
      if (result?.accessToken) {
        setMessage({ type: "success", text: "Demo login successful. Redirecting..." });
        const token = result.accessToken;
        setTimeout(async () => {
          try {
            await smartRedirectAfterLogin(token, navigate);
          } catch (redirectError) {
            console.error("Demo redirect failed", redirectError);
            navigate("/dashboard");
          }
        }, 500);
      } else {
        setMessage({ type: "error", text: "Demo login failed." });
      }
    } catch (err: any) {
      setMessage({ type: "error", text: err?.message || "Demo login failed." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <LayoutLogin>
      <form onSubmit={handleLoginSubmit}>
        <h3 className="text-center mb-4">Offline Demo Login</h3>

        <p className="text-muted text-center">
          Use demo credentials locally without calling the authentication API.
        </p>

        {message && (
          <div className={`alert ${message.type === "success" ? "alert-success" : "alert-danger"}`} role="alert">
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
            placeholder="Enter demo email"
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
            placeholder="Enter demo password"
            required
          />
        </div>

        <div className="row g-2">
          <div className="col-12">
            <button type="submit" className="btn btn-primary btn-lg w-100" disabled={loading || !hasDemoCredentials}>
              {loading ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2" />
                  Signing in...
                </>
              ) : (
                "Sign In with Demo"
              )}
            </button>
          </div>
        </div>

        <div className="alert alert-info mt-4" role="alert">
          <div className="mb-1">
            <strong>Demo credentials:</strong>
          </div>
          <div>
            <code>{email || "test@hms.local"}</code> / <code>{password || "Test@1234"}</code>
          </div>
        </div>
      </form>
    </LayoutLogin>
  );
}
