import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { getAllPatients } from "../../api/patientApi";
import { fetchInsuranceProviders } from "../../api/insuranceProviderApi";
import {
  getPatientInsuranceById,
  updatePatientInsurance,
} from "../../api/patientInsuranceApi";

import type { PatientResponse } from "../../types/Patient";
import type { InsuranceProvider } from "../../types/insurance";
import type {
  PatientInsuranceRequest,
  PatientInsuranceResponse,
} from "../../types/PatientInsurance";

const PatientInsuranceEditPage: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams(); // URL param

  const [patients, setPatients] = useState<PatientResponse[]>([]);
  const [providers, setProviders] = useState<InsuranceProvider[]>([]);
  const [loading, setLoading] = useState(true);

  const [formData, setFormData] = useState<PatientInsuranceRequest>({
    patientId: 0,
    insuranceProviderId: 0,
    subscriberName: "",
    effectiveFrom: "",
    effectiveTo: "",
  });

  const [error, setError] = useState("");

  // --------------------- Load Initial Data ---------------------
  useEffect(() => {
    async function loadData() {
      try {
        const [pat, prov, insurance] = await Promise.all([
          getAllPatients(),
          fetchInsuranceProviders(),
          getPatientInsuranceById(Number(id)),
        ]);

        setPatients(pat);
        setProviders(prov);

        const data: PatientInsuranceResponse = insurance.data;

        // Fill the form
        setFormData({
          patientId: data.patientId,
          insuranceProviderId: data.insuranceProviderId,
          subscriberName: data.subscriberName,
          effectiveFrom: data.effectiveFrom,
          effectiveTo: data.effectiveTo,
        });
      } catch (err) {
        console.error(err);
        setError("Failed to load Patient Insurance details");
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, [id]);

  // --------------------- Handle Input Change ---------------------
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // --------------------- Submit Handler ---------------------
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      await updatePatientInsurance(Number(id), formData);
      navigate("/insurance/patient-insurance");
    } catch (err: any) {
      console.error(err);
      setError(err.response?.data?.message || "Failed to update");
    }
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div className="container mt-4">
      <h2>Edit Patient Insurance</h2>
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

        <button type="submit" className="btn btn-primary">
          Update
        </button>
      </form>
    </div>
  );
};

export default PatientInsuranceEditPage;
