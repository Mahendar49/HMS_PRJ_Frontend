// File: src/pages/insurance/claims/EditClaim.tsx

import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";

import {
  InsuranceClaimRequest,
} from "../../types/claims";

import { getInsuranceClaimById, updateInsuranceClaim } from "../../api/insuranceClaimsApi";
import { getAllPatients } from "../../api/patientApi";
import { fetchInsuranceProviders } from "../../api/insuranceProviderApi";
import { getAllEncounters } from "../../api/encounterApi";

const InsuranceClaimEditPage: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  const [loading, setLoading] = useState(true);

  const [patients, setPatients] = useState<any[]>([]);
  const [providers, setProviders] = useState<any[]>([]);
  const [encounters, setEncounters] = useState<any[]>([]);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<InsuranceClaimRequest>();

  useEffect(() => {
    async function loadData() {
      try {
        const [patRes, provRes, encRes, claim] = await Promise.all([
          getAllPatients(),
          fetchInsuranceProviders(),
          getAllEncounters(),
          getInsuranceClaimById(Number(id)),
        ]);

        setPatients(patRes);
        setProviders(provRes);
        setEncounters(encRes.data);

        // Pre-fill form (claimNumber removed)
        reset({
          patientId: claim.patientId,
          insuranceProviderId: claim.insuranceProviderId,
          encounterId: claim.encounterId,
          status: claim.status,
          totalAmount: claim.totalAmount,
          submittedAt: claim.submittedAt,
          adjudicatedAt: claim.adjudicatedAt,
        });
      } catch (err: any) {
        alert(err.message || "Failed to load data");
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, [id, reset]);

  const onSubmit = async (formData: InsuranceClaimRequest) => {
    try {
      await updateInsuranceClaim(Number(id), formData);
      alert("Claim updated successfully!");
      navigate("/insurance/claims");
    } catch (err: any) {
      alert(err.message || "Update failed");
    }
  };

  if (loading) return <p className="text-center mt-5">Loading...</p>;

  return (
    <div className="container mt-4">
      <div className="card shadow-lg border-0 rounded-4">
        <div className="card-header bg-primary text-white py-3 rounded-top-4">
          <h4 className="mb-0">
            <i className="bi bi-pencil-square me-2"></i>
            Edit Insurance Claim
          </h4>
        </div>

        <div className="card-body p-4">
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="row g-4">

              {/* Patient */}
              <div className="col-md-6">
                <label className="form-label fw-bold">Patient</label>
                <select
                  className="form-select"
                  {...register("patientId", { required: true })}
                >
                  <option value="">Select patient</option>
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

              {/* Insurance Provider */}
              <div className="col-md-6">
                <label className="form-label fw-bold">Insurance Provider</label>
                <select
                  className="form-select"
                  {...register("insuranceProviderId", { required: true })}
                >
                  <option value="">Select provider</option>
                  {providers.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.providerName} (ID: {p.id})
                    </option>
                  ))}
                </select>
                {errors.insuranceProviderId && (
                  <small className="text-danger">Provider is required</small>
                )}
              </div>

              {/* Encounter */}
              <div className="col-md-6">
                <label className="form-label fw-bold">Encounter</label>
                <select
                  className="form-select"
                  {...register("encounterId", { required: true })}
                >
                  <option value="">Select encounter</option>
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
                  <small className="text-danger">Submitted date is required</small>
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
                  <small className="text-danger">Adjudicated date is required</small>
                )}
              </div>

            </div>

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
                {isSubmitting ? "Updating..." : "Update Claim"}
              </button>
            </div>

          </form>
        </div>
      </div>
    </div>
  );
};

export default InsuranceClaimEditPage;
