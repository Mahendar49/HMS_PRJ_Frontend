import { useState } from "react";
import { RegisterProviderRequest } from "../../types/provider";
import { useNavigate } from "react-router-dom";
import { registerProvider } from "../../api/authApi";

export default function ProviderRegister() {
  const [form, setForm] = useState<RegisterProviderRequest>({
    email: "",
    password: "",
    mobile: "",
    enabled: true,
    locked: false,
    providerName: "",
    specialization: "",
    experienceYears: 0,
    address: "",
    status: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [success, setSuccess] = useState<string>("");
  const navigate = useNavigate();
  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  // ---------------- VALIDATION ----------------
  const validate = () => {
    const err: Record<string, string> = {};

    if (!form.email.trim()) err.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(form.email))
      err.email = "Invalid email format";

    if (!form.password.trim()) err.password = "Password required";
    else if (form.password.length < 6)
      err.password = "Password must be at least 6 characters";

    if (!form.mobile.trim()) err.mobile = "Mobile required";
    else if (!/^\d{10}$/.test(form.mobile))
      err.mobile = "Mobile must be 10 digits";
    if (!form.providerName.trim())
      err.providerName = "Provider Name is required";

    if (!form.specialization.trim())
      err.specialization = "Specialization required";

    if (form.experienceYears < 0)
      err.experienceYears = "Experience cannot be negative";

    if (!form.address.trim()) err.address = "Address is required";

    if (!form.status.trim()) err.status = "Status is required";

    setErrors(err);
    return Object.keys(err).length === 0;
  };

  // ---------------- SUBMIT ----------------
  const handleSubmit = async (e: any) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      await registerProvider(form);
      setSuccess("🎉 Provider Registered Successfully!");

      // Reset form
      setForm({
        email: "",
        password: "",
        mobile: "",
        enabled: true,
        locked: false,
        providerName: "",
        specialization: "",
        experienceYears: 0,
        address: "",
        status: "",
      });

      setErrors({});
    } catch (err: any) {
      alert(err?.message || "Registration failed");
    }
    navigate("/providers");
  };

  return (
    <div className="container mt-4">
      <div className="card shadow-lg border-0">
        <div className="card-header bg-primary text-white fw-bold">
          <i className="bi bi-person-badge-fill me-2"></i>
          Provider Registration
        </div>

        <div className="card-body">
          {success && <div className="alert alert-success">{success}</div>}

          <form onSubmit={handleSubmit} className="row g-3">
            {/* Email */}
            <div className="col-md-6">
              <label className="form-label">Email</label>
              <div className="input-group">
                <span className="input-group-text">
                  <i className="bi bi-envelope"></i>
                </span>
                <input
                  name="email"
                  className="form-control"
                  value={form.email}
                  onChange={handleChange}
                />
              </div>
              {errors.email && (
                <small className="text-danger">{errors.email}</small>
              )}
            </div>

            {/* Mobile */}
            <div className="col-md-6">
              <label className="form-label">Mobile</label>
              <div className="input-group">
                <span className="input-group-text">
                  <i className="bi bi-phone"></i>
                </span>
                <input
                  name="mobile"
                  className="form-control"
                  value={form.mobile}
                  onChange={handleChange}
                />
              </div>
              {errors.mobile && (
                <small className="text-danger">{errors.mobile}</small>
              )}
            </div>

            {/* Password */}
            <div className="col-md-6">
              <label className="form-label">Password</label>
              <div className="input-group">
                <span className="input-group-text">
                  <i className="bi bi-lock-fill"></i>
                </span>
                <input
                  type="password"
                  name="password"
                  className="form-control"
                  value={form.password}
                  onChange={handleChange}
                />
              </div>
              {errors.password && (
                <small className="text-danger">{errors.password}</small>
              )}
            </div>

            {/* Provider Name */}
            <div className="col-md-6">
              <label className="form-label">Provider Name</label>
              <input
                name="providerName"
                className="form-control"
                value={form.providerName}
                onChange={handleChange}
              />
              {errors.providerName && (
                <small className="text-danger">{errors.providerName}</small>
              )}
            </div>

            {/* Specialization */}
            <div className="col-md-6">
              <label className="form-label">Specialization</label>
              <input
                name="specialization"
                className="form-control"
                value={form.specialization}
                onChange={handleChange}
              />
              {errors.specialization && (
                <small className="text-danger">{errors.specialization}</small>
              )}
            </div>

            {/* Experience */}
            <div className="col-md-4">
              <label className="form-label">Experience (Years)</label>
              <input
                type="number"
                name="experienceYears"
                className="form-control"
                value={form.experienceYears}
                onChange={handleChange}
              />
              {errors.experienceYears && (
                <small className="text-danger">{errors.experienceYears}</small>
              )}
            </div>

            {/* Status */}
            <div className="col-md-4">
              <label className="form-label">Status</label>
              <select
                name="status"
                className="form-select"
                value={form.status}
                onChange={handleChange}
              >
                <option value="">Select status...</option>
                <option value="ACTIVE">ACTIVE</option>
                <option value="INACTIVE">INACTIVE</option>
              </select>
              {errors.status && (
                <small className="text-danger">{errors.status}</small>
              )}
            </div>

            {/* Address */}
            <div className="col-md-12">
              <label className="form-label">Address</label>
              <textarea
                name="address"
                className="form-control"
                value={form.address}
                onChange={handleChange}
              />
              {errors.address && (
                <small className="text-danger">{errors.address}</small>
              )}
            </div>

            <div className="col-12 text-end">
              <button className="btn btn-primary">
                <i className="bi bi-check-circle me-2"></i>
                Register Provider
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
