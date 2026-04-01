// File: src/pages/insurance/claims/ViewClaim.tsx

import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { InsuranceClaimResponse } from "../../types/claims";

import { getInsuranceClaimById } from "../../api/insuranceClaimsApi";
import { getPatientById } from "../../api/patientApi";
import { fetchInsuranceProviderById } from "../../api/insuranceProviderApi";
import { getEncounterById } from "../../api/encounterApi";

const InsuranceClaimViewPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [claim, setClaim] = useState<InsuranceClaimResponse | null>(null);

  // extra states for names
  const [patientName, setPatientName] = useState<string>("");
  const [providerName, setProviderName] = useState<string>("");
  const [encounterCode, setEncounterCode] = useState<string>("");

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchClaimDetails() {
      try {
        if (!id) return;

        // Main Claim
        const claimData = await getInsuranceClaimById(Number(id));
        setClaim(claimData);

        // Fetch Patient Name
        if (claimData.patientId) {
          const patient = await getPatientById(claimData.patientId);
          setPatientName(`${patient.firstName} ${patient.lastName}`);
        }

        // Fetch Insurance Provider Name
        if (claimData.insuranceProviderId) {
          const provider = await fetchInsuranceProviderById(claimData.insuranceProviderId);
          setProviderName(provider.name);
        }

        // Fetch Encounter Code
        if (claimData.encounterId) {
          const encounter = await getEncounterById(claimData.encounterId);
          setEncounterCode(`${encounter.data.encounterCode} (ID: ${encounter.data.id})`);
        }

      } catch (err: any) {
        alert(err.message || "Failed to load claim details");
      } finally {
        setLoading(false);
      }
    }

    fetchClaimDetails();
  }, [id]);

  if (loading) return <p className="text-center mt-5">Loading...</p>;
  if (!claim) return <p className="text-center mt-5">Claim not found.</p>;

  return (
    <div className="container mt-4">
      <div className="mb-3">
        <button
          className="btn btn-secondary"
          onClick={() => navigate("/insurance/claims")}
        >
          <i className="bi bi-arrow-left-circle me-2"></i> Back to Claims
        </button>
      </div>

      <div className="card shadow-lg border-0 rounded-4">
        <div className="card-header bg-primary text-white rounded-top-4">
          <h4 className="mb-0">
            <i className="bi bi-eye me-2"></i> Insurance Claim Details
          </h4>
        </div>

        <div className="card-body">
          <div className="row g-3">

            {/* Claim ID */}
            <div className="col-md-6">
              <label className="form-label text-muted">Claim ID</label>
              <p className="fw-semibold">{claim.id}</p>
            </div>

            {/* Patient Name */}
            <div className="col-md-6">
              <label className="form-label text-muted">Patient</label>
              <p className="fw-semibold">
                {patientName} <span className="text-muted">({claim.patientId})</span>
              </p>
            </div>

            {/* Insurance Provider Name */}
            <div className="col-md-6">
              <label className="form-label text-muted">Insurance Provider</label>
              <p className="fw-semibold">
                {providerName} <span className="text-muted">({claim.insuranceProviderId})</span>
              </p>
            </div>

            {/* Encounter */}
            <div className="col-md-6">
              <label className="form-label text-muted">Encounter</label>
              <p className="fw-semibold">
                {encounterCode || "—"}{" "}
                <span className="text-muted">({claim.encounterId})</span>
              </p>
            </div>

            {/* Claim Number */}
            <div className="col-md-6">
              <label className="form-label text-muted">Claim Number</label>
              <p className="fw-semibold">{claim.claimNumber}</p>
            </div>

            {/* Status */}
            <div className="col-md-6">
              <label className="form-label text-muted">Status</label>
              <span
                className={`badge ${claim.status === "paid"
                    ? "bg-success"
                    : claim.status === "denied"
                    ? "bg-danger"
                    : claim.status === "processing"
                    ? "bg-warning text-dark"
                    : "bg-primary"
                  }`}
              >
                {claim.status}
              </span>
            </div>

            {/* Total Amount */}
            <div className="col-md-6">
              <label className="form-label text-muted">Total Amount</label>
              <p className="fw-semibold">₹{claim.totalAmount?.toFixed(2)}</p>
            </div>

            {/* Submitted At */}
            <div className="col-md-6">
              <label className="form-label text-muted">Submitted At</label>
              <p className="fw-semibold">
                {claim.submittedAt ? new Date(claim.submittedAt).toLocaleString() : "—"}
              </p>
            </div>

            {/* Adjudicated At */}
            <div className="col-md-6">
              <label className="form-label text-muted">Adjudicated At</label>
              <p className="fw-semibold">
                {claim.adjudicatedAt ? new Date(claim.adjudicatedAt).toLocaleString() : "—"}
              </p>
            </div>

            {/* Created At */}
            <div className="col-md-6">
              <label className="form-label text-muted">Created At</label>
              <p className="fw-semibold">
                {claim.createdAt ? new Date(claim.createdAt).toLocaleString() : "—"}
              </p>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default InsuranceClaimViewPage;
