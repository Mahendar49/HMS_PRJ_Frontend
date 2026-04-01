import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  createSubscription,
  SubscriptionCreatePayload,
  fetchPatientsForDropdown,
  fetchPlansForDropdown,
  SimplePatient,
  SimpleSubscriptionPlan,
} from "../../api/subscriptionApi";

const SubscriptionCreatePage: React.FC = () => {
  const navigate = useNavigate();

  const [patients, setPatients] = useState<SimplePatient[]>([]);
  const [plans, setPlans] = useState<SimpleSubscriptionPlan[]>([]);

  const [patientId, setPatientId] = useState<number | "">("");
  const [planId, setPlanId] = useState<number | "">("");

  const [startedAtDate, setStartedAtDate] = useState<string>("");
  const [startedAtTime, setStartedAtTime] = useState<string>("");

  const [nextBillingDate, setNextBillingDate] = useState<string>("");
  const [nextBillingTime, setNextBillingTime] = useState<string>("");

  const [status, setStatus] = useState<string>("active");
  const [autoRenew, setAutoRenew] = useState<boolean>(true);

  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const loadDropdowns = async () => {
      try {
        const [pats, pls] = await Promise.all([
          fetchPatientsForDropdown(),
          fetchPlansForDropdown(),
        ]);
        setPatients(pats);
        setPlans(pls);
      } catch (err) {
        console.error("Failed to load patients or subscription plans", err);
        alert("Failed to load patients or subscription plans");
      }
    };

    loadDropdowns();
  }, []);

  const buildLocalDateTime = (date: string, time: string) => {
    if (!date) return null;
    return `${date}T${time || "00:00" }:00`;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!patientId || !planId) {
      alert("Patient and Subscription Plan are required");
      return;
    }

    const payload: SubscriptionCreatePayload = {
      patientId: Number(patientId),
      planId: Number(planId),
      startedAt: buildLocalDateTime(startedAtDate, startedAtTime),
      nextBillingAt: buildLocalDateTime(nextBillingDate, nextBillingTime),
      status,
      autoRenew,
    };

    try {
      setSaving(true);
      await createSubscription(payload);
      navigate("/careplans/subscriptions");
    } catch (err) {
      console.error("Failed to create subscription", err);
      alert("Failed to create subscription");
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    navigate("/careplans/subscriptions");
  };

  return (
    <div className="container-fluid mt-3">
      <button
        type="button"
        className="btn btn-link mb-3"
        onClick={() => navigate(-1)}
      >
        <i className="bi bi-arrow-left" /> Back
      </button>

      <h2 className="mb-3">Add Subscription</h2>

      <div className="row justify-content-center">
        <div className="col-lg-6 col-md-8 col-sm-12">
          <div className="card shadow-sm">
            <div className="card-body">
              <form onSubmit={handleSubmit}>
                {/* Patient */}
                <div className="mb-3">
                  <label className="form-label">Patient</label>
                  <select
                    className="form-select"
                    value={patientId === "" ? "" : patientId}
                    onChange={(e) =>
                      setPatientId(
                        e.target.value === "" ? "" : Number(e.target.value)
                      )
                    }
                  >
                    <option value="">Select patient</option>
                    {patients.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.fullName ||
                          `${p.firstName || ""} ${p.lastName || ""}`.trim()}{" "}
                        (ID: {p.id})
                      </option>
                    ))}
                  </select>
                </div>

                {/* Subscription Plan */}
                <div className="mb-3">
                  <label className="form-label">Subscription Plan</label>
                  <select
                    className="form-select"
                    value={planId === "" ? "" : planId}
                    onChange={(e) =>
                      setPlanId(
                        e.target.value === "" ? "" : Number(e.target.value)
                      )
                    }
                  >
                    <option value="">Select plan</option>
                    {plans.map((pl) => (
                      <option key={pl.id} value={pl.id}>
                        {pl.name} ({pl.code})
                      </option>
                    ))}
                  </select>
                </div>

                {/* START DATE + TIME */}
                <div className="mb-3">
                  <label className="form-label">Start Date & Time</label>

                  <div className="d-flex gap-2">
                    <input
                      type="date"
                      className="form-control"
                      value={startedAtDate}
                      onChange={(e) => setStartedAtDate(e.target.value)}
                    />
                    <input
                      type="time"
                      className="form-control"
                      value={startedAtTime}
                      onChange={(e) => setStartedAtTime(e.target.value)}
                    />
                  </div>
                </div>

                {/* NEXT BILLING DATE + TIME */}
                <div className="mb-3">
                  <label className="form-label">Next Billing Date & Time</label>

                  <div className="d-flex gap-2">
                    <input
                      type="date"
                      className="form-control"
                      value={nextBillingDate}
                      onChange={(e) => setNextBillingDate(e.target.value)}
                    />
                    <input
                      type="time"
                      className="form-control"
                      value={nextBillingTime}
                      onChange={(e) => setNextBillingTime(e.target.value)}
                    />
                  </div>
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

                {/* Auto Renew */}
                <div className="form-check mb-4">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    id="autoRenew"
                    checked={autoRenew}
                    onChange={(e) => setAutoRenew(e.target.checked)}
                  />
                  <label className="form-check-label" htmlFor="autoRenew">
                    Auto renew
                  </label>
                </div>

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
                    {saving ? "Saving..." : "Save Subscription"}
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

export default SubscriptionCreatePage;
