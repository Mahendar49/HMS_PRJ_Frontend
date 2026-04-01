import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { getUserById, updateUserProfile } from "../../api/userApi";

export default function EditUser() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState<any>({
    firstName: "",
    lastName: "",
    email: "",
    mobile: "",
    address: "",
    dob: "",
  });
  const token = localStorage.getItem("authToken");

  useEffect(() => {
    if (!id || !token) return;
    getUserById(Number(id), token)
      .then((data) => {
        setForm({
          firstName: data.profile?.firstName || "",
          lastName: data.profile?.lastName || "",
          email: data.user?.email || "",
          mobile: data.profile?.mobile || "",
          address: data.profile?.address || "",
          dob: data.profile?.dob || "",
        });
      })
      .catch((err) => alert(err.message));
  }, [id, token]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const payload = {
        firstName: form.firstName,
        lastName: form.lastName,
        mobile: form.mobile,
        address: form.address,
        dob: form.dob,
      };
      await updateUserProfile(Number(id), payload, token || "");
      alert("User updated successfully!");
      navigate("/admin/users");
    } catch (err: any) {
      alert(err.message);
    }
  };

  return (
    <div className="container mt-5">
      <div
        className="card shadow-lg border-0 rounded-4 p-4 mx-auto"
        style={{ maxWidth: "700px" }}
      >
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h3 className="fw-semibold text-primary mb-0">
            <i className="bi bi-pencil-square me-2"></i> Edit User
          </h3>
          <button
            className="btn btn-link text-decoration-none"
            onClick={() => navigate("/admin/users")}
          >
            <i className="bi bi-arrow-left-circle me-1"></i> Back to Users
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Profile Section */}
          <div className="mb-4">
            <h5 className="border-bottom pb-2 mb-3 text-secondary">
              <i className="bi bi-person-circle me-2 text-primary"></i>
              Profile Information
            </h5>
            <div className="row g-3">
              <div className="col-md-6">
                <label className="form-label fw-medium">
                  <i className="bi bi-person me-2 text-secondary"></i>
                  First Name
                </label>
                <input
                  type="text"
                  name="firstName"
                  value={form.firstName}
                  onChange={handleChange}
                  className="form-control"
                  placeholder="Enter first name"
                />
              </div>
              <div className="col-md-6">
                <label className="form-label fw-medium">
                  <i className="bi bi-person-fill me-2 text-secondary"></i>
                  Last Name
                </label>
                <input
                  type="text"
                  name="lastName"
                  value={form.lastName}
                  onChange={handleChange}
                  className="form-control"
                  placeholder="Enter last name"
                />
              </div>
            </div>
          </div>

          {/* Contact & Personal Section */}
          <div className="mb-4">
            <h5 className="border-bottom pb-2 mb-3 text-secondary">
              <i className="bi bi-envelope-at me-2 text-primary"></i>
              Contact & Personal
            </h5>
            <div className="mb-3">
              <label className="form-label fw-medium">
                <i className="bi bi-envelope me-2 text-secondary"></i>
                Email
              </label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                className="form-control bg-light"
                disabled
              />
            </div>
            <div className="row g-3">
              <div className="col-md-6">
                <label className="form-label fw-medium">
                  <i className="bi bi-telephone me-2 text-secondary"></i>
                  Mobile
                </label>
                <input
                  type="text"
                  name="mobile"
                  value={form.mobile}
                  onChange={handleChange}
                  className="form-control"
                  placeholder="Enter mobile number"
                />
              </div>
              <div className="col-md-6">
                <label className="form-label fw-medium">
                  <i className="bi bi-calendar-date me-2 text-secondary"></i>
                  Date of Birth
                </label>
                <input
                  type="date"
                  name="dob"
                  value={form.dob}
                  onChange={handleChange}
                  className="form-control"
                />
              </div>
            </div>
          </div>

          {/* Address Section */}
          <div className="mb-4">
            <h5 className="border-bottom pb-2 mb-3 text-secondary">
              <i className="bi bi-geo-alt me-2 text-primary"></i>
              Address
            </h5>
            <label className="form-label fw-medium">
              <i className="bi bi-house-door me-2 text-secondary"></i>
              Address
            </label>
            <input
              type="text"
              name="address"
              value={form.address}
              onChange={handleChange}
              className="form-control"
              placeholder="Enter address"
            />
          </div>

          {/* Buttons */}
          <div className="d-flex justify-content-end gap-3">
            <button
              type="button"
              onClick={() => navigate("/admin/users")}
              className="btn btn-outline-secondary px-4"
            >
              <i className="bi bi-x-circle me-2"></i> Cancel
            </button>
            <button type="submit" className="btn btn-primary px-4">
              <i className="bi bi-check2-circle me-2"></i> Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
