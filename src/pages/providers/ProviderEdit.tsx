import React, { useEffect, useState } from "react";
import { ProviderUpdateRequest, ProviderResponse } from "../../types/provider";

import { useParams, useNavigate } from "react-router-dom";
import { FaSave, FaArrowLeft } from "react-icons/fa";
import { getProviderById, updateProviderHms } from "../../api/providerApi";

export default function ProviderEdit() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState<ProviderUpdateRequest>({
    providerName: "",
    specialization: "",
    experienceYears: 0,
    address: "",
    status: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) loadProvider(parseInt(id));
  }, [id]);

  const loadProvider = async (providerId: number) => {
    try {
      const data: ProviderResponse = await getProviderById(providerId);
      setForm({
        providerName: data.providerName,
        specialization: data.specialization,
        experienceYears: data.experienceYears,
        address: data.address,
        status: data.status,
      });
    } catch (err) {
      alert("Failed to load provider");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  // VALIDATION
  const validate = () => {
    const errs: Record<string, string> = {};
    if (!form.providerName?.trim())
      errs.providerName = "Provider name required";
    if (!form.specialization?.trim())
      errs.specialization = "Specialization required";
    if (!form.address?.trim()) errs.address = "Address required";
    if (form.experienceYears! < 0)
      errs.experienceYears = "Experience cannot be negative";
    if (!form.status?.trim()) errs.status = "Status required";

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      await updateProviderHms(parseInt(id!), form);
      alert("Provider updated successfully!");
      navigate("/providers");
    } catch (err) {
      alert("Update failed!");
    }
  };

  if (loading) return <div className="text-center mt-5">Loading...</div>;

  return (
    <div className="container mt-4">
      <button
        className="btn btn-secondary mb-3"
        onClick={() => navigate("/providers")}
      >
        <FaArrowLeft /> Back
      </button>

      <h3 className="fw-bold text-primary mb-3">Edit Provider</h3>

      <form className="card p-4 shadow-sm" onSubmit={handleSubmit}>
        <div className="row g-3">
          <div className="col-md-6">
            <label className="form-label">Provider Name</label>
            <input
              type="text"
              className={`form-control ${
                errors.providerName ? "is-invalid" : ""
              }`}
              name="providerName"
              value={form.providerName}
              onChange={handleChange}
            />
            {errors.providerName && (
              <div className="invalid-feedback">{errors.providerName}</div>
            )}
          </div>

          <div className="col-md-6">
            <label className="form-label">Specialization</label>
            <input
              type="text"
              className={`form-control ${
                errors.specialization ? "is-invalid" : ""
              }`}
              name="specialization"
              value={form.specialization}
              onChange={handleChange}
            />
            {errors.specialization && (
              <div className="invalid-feedback">{errors.specialization}</div>
            )}
          </div>

          <div className="col-md-6">
            <label className="form-label">Experience (Years)</label>
            <input
              type="number"
              className={`form-control ${
                errors.experienceYears ? "is-invalid" : ""
              }`}
              name="experienceYears"
              value={form.experienceYears}
              onChange={handleChange}
            />
            {errors.experienceYears && (
              <div className="invalid-feedback">{errors.experienceYears}</div>
            )}
          </div>

          <div className="col-12">
            <label className="form-label">Address</label>
            <textarea
              className={`form-control ${errors.address ? "is-invalid" : ""}`}
              name="address"
              value={form.address}
              onChange={handleChange}
            ></textarea>
            {errors.address && (
              <div className="invalid-feedback">{errors.address}</div>
            )}
          </div>

          <div className="col-md-6">
            <label className="form-label">Status</label>
            <select
              className={`form-select ${errors.status ? "is-invalid" : ""}`}
              name="status"
              value={form.status}
              onChange={handleChange}
            >
              <option value="">Select...</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
              <option value="suspended">Suspended</option>
            </select>
            {errors.status && (
              <div className="invalid-feedback">{errors.status}</div>
            )}
          </div>
        </div>

        <button className="btn btn-primary mt-4">
          <FaSave /> Save Changes
        </button>
      </form>
    </div>
  );
}
