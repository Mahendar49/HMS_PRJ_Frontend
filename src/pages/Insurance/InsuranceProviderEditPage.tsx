// src/pages/Insurance/InsuranceProviderEditPage.tsx

import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  fetchInsuranceProviderById,
  updateInsuranceProvider,
} from "../../api/insuranceProviderApi";
import {
  InsuranceProvider,
  InsuranceProviderUpdatePayload,
} from "../../types/insurance";

const InsuranceProviderEditPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [form, setForm] = useState<InsuranceProviderUpdatePayload>({
    name: "",
    payerId: "",
    contactInfo: "",
  });

  useEffect(() => {
    const load = async () => {
      if (!id) return;
      try {
        const data: InsuranceProvider = await fetchInsuranceProviderById(
          Number(id)
        );
        setForm({
          name: data.name || "",
          payerId: data.payerId || "",
          contactInfo: data.contactInfo || "",
        });
      } catch (error) {
        console.error("Failed to load insurance provider", error);
      }
    };

    load();
  }, [id]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id) return;
    try {
      await updateInsuranceProvider(Number(id), form);
      navigate("/insurance/providers");
    } catch (error) {
      console.error("Failed to update insurance provider", error);
    }
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <h2>Edit Insurance Provider</h2>
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
            Update
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

export default InsuranceProviderEditPage;
