// src/pages/CarePlans/SubscriptionEditPage.tsx

import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import {
  fetchSubscriptionById,
  updateSubscription,
  Subscription,
  SubscriptionUpdatePayload,
} from "../../api/subscriptionApi";

import {
  fetchPatientsForDropdown,
  SimplePatient,
} from "../../api/patientCarePlanApi";

import {
  fetchSubscriptionPlans,
  SubscriptionPlan,
} from "../../api/subscriptionPlanApi";


const SubscriptionEditPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  // dropdown data
  const [patients, setPatients] = useState<SimplePatient[]>([]);
  const [plans, setPlans] = useState<SubscriptionPlan[]>([]);


  // search text (for filtering in dropdown)
  const [patientSearch, setPatientSearch] = useState("");
  const [planSearch, setPlanSearch] = useState("");

  // form fields
  const [patientId, setPatientId] = useState<number | "">("");
  const [planId, setPlanId] = useState<number | "">("");

  const [startDate, setStartDate] = useState<string>("");        // yyyy-MM-dd
  const [nextBillingDate, setNextBillingDate] = useState<string>("");

  const [status, setStatus] = useState<string>("active");
  const [autoRenew, setAutoRenew] = useState<boolean>(true);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // ---------- helpers ----------

  const toDateInputValue = (dt?: string | null): string => {
    if (!dt) return "";
    // "2025-11-01T10:00:00" -> "2025-11-01"
    const [date] = dt.split("T");
    return date;
  };

  // ---------- initial load ----------

  useEffect(() => {
    if (!id) return;

    const subId = parseInt(id, 10);
    if (Number.isNaN(subId)) {
      alert("Invalid subscription id");
      navigate("/careplans/subscriptions");
      return;
    }

    const loadAll = async () => {
      try {
        setLoading(true);

        // load dropdown data in parallel
        const [patientList, planList, subscription] = await Promise.all([
  fetchPatientsForDropdown(),
  fetchSubscriptionPlans(),
  fetchSubscriptionById(subId),
]);


        setPatients(patientList);
        setPlans(planList);

        // fill form from existing subscription
        setPatientId(subscription.patientId);
        setPlanId(subscription.planId);
        setStartDate(toDateInputValue(subscription.startedAt));
        setNextBillingDate(toDateInputValue(subscription.nextBillingAt));
        setStatus(subscription.status || "active");
        setAutoRenew(Boolean(subscription.autoRenew));
      } catch (err) {
        console.error("Failed to load subscription for edit", err);
        alert("Failed to load subscription");
        navigate("/careplans/subscriptions");
      } finally {
        setLoading(false);
      }
    };

    loadAll();
  }, [id, navigate]);

  // ---------- submit ----------

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id) return;

    if (!patientId || !planId) {
      alert("Patient and Subscription Plan are required");
      return;
    }

    // convert "yyyy-MM-dd" → "yyyy-MM-ddT00:00:00" or null
const toBackendDateTime = (d: string): string | null => {
  return d ? `${d}T00:00:00` : null;
};


    const payload: SubscriptionUpdatePayload = {
  patientId: Number(patientId),
  planId: Number(planId),
  startedAt: toBackendDateTime(startDate),
  nextBillingAt: toBackendDateTime(nextBillingDate),
  status,
  autoRenew,
};


    try {
      setSaving(true);
      await updateSubscription(parseInt(id, 10), payload);
      navigate("/careplans/subscriptions");
    } catch (err) {
      console.error("Failed to update subscription", err);
      alert("Failed to update subscription");
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    navigate("/careplans/subscriptions");
  };

  // ---------- render ----------

  if (loading) {
    return (
      <div className="container-fluid mt-3">
        <div className="p-3 text-center text-muted">Loading...</div>
      </div>
    );
  }

  return (
    <div className="container-fluid mt-3">
      <button
        type="button"
        className="btn btn-link mb-3"
        onClick={() => navigate(-1)}
      >
        <i className="bi bi-arrow-left" /> Back
      </button>

      <h2 className="mb-3">Edit Subscription</h2>

      <div className="row justify-content-center">
        <div className="col-lg-6 col-md-8 col-sm-12">
          <div className="card shadow-sm">
            <div className="card-body">
              <form onSubmit={handleSubmit}>
                {/* Patient: search + dropdown (single bar style) */}
                <div className="mb-3">
                  <label className="form-label">Patient</label>

                  <div className="input-group">
                    <span className="input-group-text">
                      <i className="bi bi-search" />
                    </span>
                    <select
                      className="form-select"
                      value={patientId}
                      onChange={(e) =>
                        setPatientId(
                          e.target.value === "" ? "" : Number(e.target.value)
                        )
                      }
                      onClick={(e) => {
                        // simple "type to filter" behaviour using native select
                        // (optional: you can ignore patientSearch state if not used)
                      }}
                    >
                      <option value="">Select patient</option>
                      {patients
                        .filter((p) => {
                          if (!patientSearch.trim()) return true;
                          const term = patientSearch.toLowerCase();
                          const name =
                            (p.fullName ||
                              `${p.firstName || ""} ${p.lastName || ""}`) ??
                            "";
                          return name.toLowerCase().includes(term);
                        })
                        .map((p) => {
                          const name =
                            p.fullName ||
                            `${p.firstName || ""} ${p.lastName || ""}`.trim();
                          return (
                            <option key={p.id} value={p.id}>
                              {name || `Patient #${p.id}`} (ID: {p.id})
                            </option>
                          );
                        })}
                    </select>
                  </div>
                  {/* optional helper text */}
                  <small className="text-muted">
                    Start typing the patient name to quickly jump in the
                    dropdown.
                  </small>
                </div>

                {/* Subscription Plan: search + dropdown (single bar style) */}
                <div className="mb-3">
                  <label className="form-label">Subscription Plan</label>

                  <div className="input-group">
                    <span className="input-group-text">
                      <i className="bi bi-search" />
                    </span>
                    <select
                      className="form-select"
                      value={planId}
                      onChange={(e) =>
                        setPlanId(
                          e.target.value === "" ? "" : Number(e.target.value)
                        )
                      }
                    >
                      <option value="">Select plan</option>
                      {plans
                        .filter((pl) => {
                          if (!planSearch.trim()) return true;
                          const term = planSearch.toLowerCase();
                          return (
                            pl.name.toLowerCase().includes(term) ||
                            (pl.code || "").toLowerCase().includes(term)
                          );
                        })
                        .map((pl) => (
                          <option key={pl.id} value={pl.id}>
                            {pl.name} {pl.code ? `(${pl.code})` : ""}
                          </option>
                        ))}
                    </select>
                  </div>
                  <small className="text-muted">
                    Start typing plan name / code to jump in the dropdown.
                  </small>
                </div>

                {/* Start Date */}
                <div className="mb-3">
                  <label className="form-label">Start Date</label>
                  <input
                    type="date"
                    className="form-control"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                  />
                </div>

                {/* Next Billing Date */}
                <div className="mb-3">
                  <label className="form-label">Next Billing Date</label>
                  <input
                    type="date"
                    className="form-control"
                    value={nextBillingDate}
                    onChange={(e) => setNextBillingDate(e.target.value)}
                  />
                </div>

                {/* Status */}
                <div className="mb-3">
                  <label className="form-label">Status</label>
                  <select
                    className="form-select"
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                  >
                    <option value="active">Active</option>
                    <option value="paused">Paused</option>
                    <option value="cancelled">Cancelled</option>
                    <option value="expired">Expired</option>
                  </select>
                </div>

                {/* Auto renew */}
                <div className="form-check mb-4">
                  <input
                    type="checkbox"
                    className="form-check-input"
                    id="autoRenew"
                    checked={autoRenew}
                    onChange={(e) => setAutoRenew(e.target.checked)}
                  />
                  <label className="form-check-label" htmlFor="autoRenew">
                    Auto renew
                  </label>
                </div>

                {/* Buttons */}
                <div className="d-flex justify-content-end">
                  <button
                    type="button"
                    className="btn btn-outline-secondary me-2"
                    onClick={handleCancel}
                    disabled={saving}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={saving}
                  >
                    {saving ? "Saving..." : "Save Changes"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SubscriptionEditPage;