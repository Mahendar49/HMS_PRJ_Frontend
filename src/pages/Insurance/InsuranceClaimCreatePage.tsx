// File: src/pages/insurance/claims/CreateClaim.tsx

import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";

import { InsuranceClaimRequest } from "../../types/claims";
import { createInsuranceClaim } from "../../api/insuranceClaimsApi";

import { getAllPatients } from "../../api/patientApi";
import { fetchInsuranceProviders } from "../../api/insuranceProviderApi";
import { getAllEncounters } from "../../api/encounterApi";

const InsuranceClaimCreatePage: React.FC = () => {
  const navigate = useNavigate();

  const [patients, setPatients] = useState<any[]>([]);
  const [providers, setProviders] = useState<any[]>([]);
  const [encounters, setEncounters] = useState<any[]>([]);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<InsuranceClaimRequest>({
    defaultValues: {
      patientId: 0,
      insuranceProviderId: 0,
      encounterId: 0,
      status: "",
      totalAmount: 0,
      submittedAt: "",
      adjudicatedAt: "",
    },
  });

  // Fetch dropdown data
  useEffect(() => {
    const loadData = async () => {
      try {
        const [patientRes, providerRes, encounterRes] = await Promise.all([
          getAllPatients(),
          fetchInsuranceProviders(),
          getAllEncounters(),
        ]);

        setPatients(patientRes);
        setProviders(providerRes);
        setEncounters(encounterRes.data);
      } catch (err) {
        console.error("Failed to load dropdown data", err);
      }
    };

    loadData();
  }, []);

  const onSubmit = async (formData: InsuranceClaimRequest) => {
    try {
      await createInsuranceClaim(formData);
      alert("Claim created successfully!");
      navigate("/insurance/claims");
    } catch (err: any) {
      alert(err.message || "Failed to create claim");
    }
  };

  return (
    <div className="container mt-4">
      <div className="card shadow-lg border-0 rounded-4">
        <div className="card-header bg-primary text-white py-3 rounded-top-4">
          <h4 className="mb-0">
            <i className="bi bi-file-earmark-medical me-2"></i>
            Create Insurance Claim
          </h4>
        </div>

        <div className="card-body p-4">
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="row g-4">

              {/* Patient Dropdown */}
              <div className="col-md-6">
                <label className="form-label fw-bold">Patient</label>
                <select
                  className="form-select"
                  {...register("patientId", { required: true })}
                >
                  <option value="">Select Patient</option>
                  {patients.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.firstName} {p.lastName} (ID: {p.id})
                    </option>
                  ))}
                </select>
                {errors.patientId && (
                  <small className="text-danger">Patient is required</small>
                )}
              </div>

              {/* Insurance Provider Dropdown */}
              <div className="col-md-6">
                <label className="form-label fw-bold">Insurance Provider</label>
                <select
                  className="form-select"
                  {...register("insuranceProviderId", { required: true })}
                >
                  <option value="">Select Provider</option>
                  {providers.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name} (ID: {p.id})
                    </option>
                  ))}
                </select>
                {errors.insuranceProviderId && (
                  <small className="text-danger">
                    Insurance provider is required
                  </small>
                )}
              </div>

              {/* Encounter Dropdown */}
              <div className="col-md-6">
                <label className="form-label fw-bold">Encounter</label>
                <select
                  className="form-select"
                  {...register("encounterId", { required: true })}
                >
                  <option value="">Select Encounter</option>
                  {encounters.map((e) => (
                    <option key={e.id} value={e.id}>
                      {e.encounterCode} (ID: {e.id})
                    </option>
                  ))}
                </select>
                {errors.encounterId && (
                  <small className="text-danger">Encounter is required</small>
                )}
              </div>

              {/* Status */}
              <div className="col-md-6">
                <label className="form-label fw-bold">Status</label>
                <select
                  className="form-select"
                  {...register("status", { required: true })}
                >
                  <option value="">Select status</option>
                  <option value="draft">Draft</option>
                  <option value="submitted">Submitted</option>
                  <option value="processing">Processing</option>
                  <option value="denied">Denied</option>
                  <option value="paid">Paid</option>
                </select>
                {errors.status && (
                  <small className="text-danger">Status is required</small>
                )}
              </div>

              {/* Total Amount */}
              <div className="col-md-6">
                <label className="form-label fw-bold">Total Amount</label>
                <input
                  type="number"
                  step="0.01"
                  {...register("totalAmount", { required: true })}
                  className="form-control"
                />
                {errors.totalAmount && (
                  <small className="text-danger">Amount is required</small>
                )}
              </div>

              {/* Submitted At */}
              <div className="col-md-6">
                <label className="form-label fw-bold">Submitted At</label>
                <input
                  type="datetime-local"
                  {...register("submittedAt", { required: true })}
                  className="form-control"
                />
                {errors.submittedAt && (
                  <small className="text-danger">
                    Submitted time is required
                  </small>
                )}
              </div>

              {/* Adjudicated At */}
              <div className="col-md-6">
                <label className="form-label fw-bold">Adjudicated At</label>
                <input
                  type="datetime-local"
                  {...register("adjudicatedAt", { required: true })}
                  className="form-control"
                />
                {errors.adjudicatedAt && (
                  <small className="text-danger">
                    Adjudicated time is required
                  </small>
                )}
              </div>

            </div>

            {/* Buttons */}
            <div className="mt-4 d-flex justify-content-end gap-3">
              <button
                type="button"
                className="btn btn-secondary px-4"
                onClick={() => navigate("/insurance/claims")}
              >
                <i className="bi bi-arrow-left-circle me-2"></i>
                Cancel
              </button>

              <button
                type="submit"
                disabled={isSubmitting}
                className="btn btn-success px-4"
              >
                <i className="bi bi-check-circle me-2"></i>
                {isSubmitting ? "Submitting..." : "Create Claim"}
              </button>
            </div>

          </form>
        </div>
      </div>
    </div>
  );
};

export default InsuranceClaimCreatePage;
