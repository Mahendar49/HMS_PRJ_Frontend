import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { registerUser } from "../api/userApi";
import type { RegisterRequest } from "../types/user";

export default function Register(): JSX.Element {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [mobile, setMobile] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [dob, setDob] = useState("");
  const [address, setAddress] = useState("");
  const [enabled, setEnabled] = useState(true);
  const [locked, setLocked] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const navigate = useNavigate();

  // ------------ VALIDATION ------------
  function validate(): string | null {
    if (!email) return "Email is required.";
    const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRe.test(email)) return "Please enter a valid email.";

    if (!password) return "Password is required.";
    if (password.length < 6) return "Password must be at least 6 characters.";
    if (password !== confirmPassword) return "Passwords do not match.";

    if (!mobile) return "Mobile number is required.";
    const digits = mobile.replace(/\D/g, "");
    if (digits.length < 7 || digits.length > 15)
      return "Enter a valid phone number (7–15 digits).";

    if (!firstName) return "First name is required.";
    if (!lastName) return "Last name is required.";

    if (!dob) return "Date of birth is required.";
    if (!address) return "Address is required.";

    return null;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    const validationError = validate();
    if (validationError) return setError(validationError);

    const payload: RegisterRequest = {
      email,
      password,
      mobile,
      firstName,
      lastName,
      dob,
      address,
      enabled,
      locked,
    };

    try {
      setLoading(true);
      await registerUser(payload);
      setSuccess("User registered successfully! Redirecting...");

      // reset
      setEmail("");
      setPassword("");
      setConfirmPassword("");
      setMobile("");
      setFirstName("");
      setLastName("");
      setDob("");
      setAddress("");
      setEnabled(true);
      setLocked(false);

      setTimeout(() => navigate("/admin/users"), 1500);
    } catch (err: any) {
      setError(err?.message || "Failed to register user.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="container mt-4" style={{ maxWidth: "640px" }}>
      {/* HEADER */}
      <h3 className="fw-bold text-primary mb-3">
        <i className="bi bi-person-plus-fill me-2"></i>
        Register New User
      </h3>

      {/* FORM CARD */}
      <div className="card shadow-sm border-0 rounded-4">
        <div className="card-body p-4">
          {error && (
            <div className="alert alert-danger fw-semibold">{error}</div>
          )}

          {success && (
            <div className="alert alert-success fw-semibold">{success}</div>
          )}

          <form onSubmit={handleSubmit} className="row g-3">
            {/* EMAIL */}
            <div className="col-md-12">
              <label className="form-label fw-semibold text-primary">
                Email
              </label>
              <input
                type="email"
                className="form-control shadow-sm"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            {/* PASSWORD */}
            <div className="col-md-6">
              <label className="form-label fw-semibold text-primary">
                Password
              </label>
              <input
                type="password"
                className="form-control shadow-sm"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            {/* CONFIRM PASSWORD */}
            <div className="col-md-6">
              <label className="form-label fw-semibold text-primary">
                Confirm Password
              </label>
              <input
                type="password"
                className="form-control shadow-sm"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>

            {/* MOBILE */}
            <div className="col-md-6">
              <label className="form-label fw-semibold text-primary">
                Mobile Number
              </label>
              <input
                type="tel"
                className="form-control shadow-sm"
                value={mobile}
                onChange={(e) => setMobile(e.target.value)}
                placeholder="+1234567890"
                required
              />
            </div>

            {/* DATE OF BIRTH */}
            <div className="col-md-6">
              <label className="form-label fw-semibold text-primary">
                Date of Birth
              </label>
              <input
                type="date"
                className="form-control shadow-sm"
                value={dob}
                onChange={(e) => setDob(e.target.value)}
                required
              />
            </div>

            {/* FIRST NAME */}
            <div className="col-md-6">
              <label className="form-label fw-semibold text-primary">
                First Name
              </label>
              <input
                type="text"
                className="form-control shadow-sm"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                required
              />
            </div>

            {/* LAST NAME */}
            <div className="col-md-6">
              <label className="form-label fw-semibold text-primary">
                Last Name
              </label>
              <input
                type="text"
                className="form-control shadow-sm"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                required
              />
            </div>

            {/* ADDRESS */}
            <div className="col-md-12">
              <label className="form-label fw-semibold text-primary">
                Address
              </label>
              <textarea
                className="form-control shadow-sm"
                value={address}
                rows={3}
                onChange={(e) => setAddress(e.target.value)}
                required
              />
            </div>

            {/* ENABLED + LOCKED */}
            <div className="col-md-12 d-flex gap-4 mt-2">
              <label className="fw-semibold d-flex align-items-center gap-2">
                <input
                  type="checkbox"
                  checked={enabled}
                  onChange={(e) => setEnabled(e.target.checked)}
                />
                Enabled
              </label>

              <label className="fw-semibold d-flex align-items-center gap-2">
                <input
                  type="checkbox"
                  checked={locked}
                  onChange={(e) => setLocked(e.target.checked)}
                />
                Locked
              </label>
            </div>

            {/* SUBMIT BUTTON */}
            <div className="col-md-12 text-end mt-3">
              <button
                type="submit"
                className="btn btn-primary px-4 py-2 fw-semibold shadow-sm"
                disabled={loading}
              >
                {loading ? "Registering..." : "Register User"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
