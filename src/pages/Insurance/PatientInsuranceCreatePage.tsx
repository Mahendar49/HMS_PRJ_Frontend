import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { getAllPatients } from "../../api/patientApi";
import { fetchInsuranceProviders } from "../../api/insuranceProviderApi";
import { createPatientInsurance } from "../../api/patientInsuranceApi";

import type { PatientResponse } from "../../types/Patient";
import type { InsuranceProvider } from "../../types/insurance";
import type { PatientInsuranceRequest } from "../../types/PatientInsurance";

const PatientInsuranceCreatePage: React.FC = () => {
  const navigate = useNavigate();

  const [patients, setPatients] = useState<PatientResponse[]>([]);
  const [providers, setProviders] = useState<InsuranceProvider[]>([]);

  const [formData, setFormData] = useState<PatientInsuranceRequest>({
    patientId: 0,
    insuranceProviderId: 0,
    subscriberName: "",
    effectiveFrom: "",
    effectiveTo: "",
  });

  const [error, setError] = useState<string>("");

  // Load dropdown data
  useEffect(() => {
    async function loadData() {
      try {
        const patientRes = await getAllPatients();
        const providerRes = await fetchInsuranceProviders();

        setPatients(patientRes);
        setProviders(providerRes);
      } catch (err) {
        console.error(err);
        setError("Failed to load dropdown data");
      }
    }
    loadData();
  }, []);

  // Handle form changes
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // Submit handler
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!formData.patientId || !formData.insuranceProviderId) {
      setError("Please select both patient and insurance provider");
      return;
    }

    try {
      await createPatientInsurance(formData);
      navigate("/insurance/patient-insurance");
    } catch (err: any) {
      console.error(err);
      setError(
        err.response?.data?.message ||
          "Failed to create patient insurance"
      );
    }
  };

  return (
    <div className="container mt-4">
      <h2>Create Patient Insurance</h2>
      <hr />

      {error && <p className="text-danger">{error}</p>}

      <form onSubmit={handleSubmit} className="mt-3">

        {/* Patient Dropdown */}
        <div className="mb-3">
          <label className="form-label">Patient</label>
          <select
            className="form-select"
            name="patientId"
            value={formData.patientId}
            onChange={handleChange}
            required
          >
            <option value="">-- Select Patient --</option>
            {patients.map((p) => (
              <option key={p.id} value={p.id}>
                {p.firstName} {p.lastName}
              </option>
            ))}
          </select>
        </div>

        {/* Insurance Provider Dropdown */}
        <div className="mb-3">
          <label className="form-label">Insurance Provider</label>
          <select
            className="form-select"
            name="insuranceProviderId"
            value={formData.insuranceProviderId}
            onChange={handleChange}
            required
          >
            <option value="">-- Select Provider --</option>
            {providers.map((prov) => (
              <option key={prov.id} value={prov.id}>
                {prov.name}
              </option>
            ))}
          </select>
        </div>

        {/* Subscriber Name */}
        <div className="mb-3">
          <label className="form-label">Subscriber Name</label>
          <input
            type="text"
            className="form-control"
            name="subscriberName"
            value={formData.subscriberName}
            onChange={handleChange}
            required
          />
        </div>

        {/* Effective From */}
        <div className="mb-3">
          <label className="form-label">Effective From</label>
          <input
            type="date"
            className="form-control"
            name="effectiveFrom"
            value={formData.effectiveFrom}
            onChange={handleChange}
            required
          />
        </div>

        {/* Effective To */}
        <div className="mb-3">
          <label className="form-label">Effective To</label>
          <input
            type="date"
            className="form-control"
            name="effectiveTo"
            value={formData.effectiveTo}
            onChange={handleChange}
          />
        </div>

        {/* Submit Button */}
        <button type="submit" className="btn btn-primary">
          Save
        </button>

      </form>
    </div>
  );
};

export default PatientInsuranceCreatePage;
