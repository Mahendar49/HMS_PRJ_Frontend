// src/pages/Insurance/InsuranceProviderCreatePage.tsx

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createInsuranceProvider } from "../../api/insuranceProviderApi";
import { InsuranceProviderCreatePayload } from "../../types/insurance";

const InsuranceProviderCreatePage: React.FC = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState<InsuranceProviderCreatePayload>({
    name: "",
    payerId: "",
    contactInfo: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createInsuranceProvider(form);
      navigate("/insurance/providers");
    } catch (error) {
      console.error("Failed to create insurance provider", error);
    }
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <h2>Add Insurance Provider</h2>
      </div>

      <form className="form-card" onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="name">Provider Name</label>
          <input
            id="name"
            name="name"
            className="form-control"
            value={form.name}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group mt-3">
          <label htmlFor="payerId">Payer ID</label>
          <input
            id="payerId"
            name="payerId"
            className="form-control"
            value={form.payerId}
            onChange={handleChange}
          />
        </div>

        <div className="form-group mt-3">
          <label htmlFor="contactInfo">Contact Info</label>
          <textarea
            id="contactInfo"
            name="contactInfo"
            className="form-control"
            rows={3}
            value={form.contactInfo}
            onChange={handleChange}
          />
        </div>

        <div className="form-actions mt-4">
          <button type="submit" className="btn btn-primary">
            Save
          </button>
          <button
            type="button"
            className="btn btn-secondary ms-2"
            onClick={() => navigate("/insurance/providers")}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default InsuranceProviderCreatePage;
