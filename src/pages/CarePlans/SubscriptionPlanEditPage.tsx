// src/pages/CarePlans/SubscriptionPlanEditPage.tsx

import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  fetchSubscriptionPlanById,
  updateSubscriptionPlan,
  SubscriptionPlan,
  SubscriptionPlanUpdatePayload,
} from "../../api/subscriptionPlanApi";

const SubscriptionPlanEditPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [item, setItem] = useState<SubscriptionPlan | null>(null);
  const [code, setCode] = useState("");
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState<string>("0");
  const [billingCycle, setBillingCycle] =
    useState<"monthly" | "quarterly" | "yearly">("monthly");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!id) return;
    loadItem(parseInt(id, 10));
  }, [id]);

  const loadItem = async (planId: number) => {
    try {
      setLoading(true);
      const data = await fetchSubscriptionPlanById(planId);
      setItem(data);
      setCode(data.code);
      setName(data.name);
      setDescription(data.description || "");
      setPrice(data.price.toString());
      setBillingCycle(data.billingCycle);
    } catch (err) {
      console.error("Failed to load subscription plan", err);
      alert("Failed to load subscription plan");
      navigate("/careplans/subscription-plans");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id) return;

    if (!code.trim() || !name.trim()) {
      alert("Code and Name are required");
      return;
    }

    const payload: SubscriptionPlanUpdatePayload = {
      code: code.trim(),
      name: name.trim(),
      description: description.trim() || undefined,
      price: Number(price),
      billingCycle,
    };

    try {
      setSaving(true);
      await updateSubscriptionPlan(parseInt(id, 10), payload);
      navigate("/careplans/subscription-plans");
    } catch (err) {
      console.error("Failed to update subscription plan", err);
      alert("Failed to update subscription plan");
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    navigate("/careplans/subscription-plans");
  };

  if (loading) {
    return (
      <div className="container-fluid mt-3">
        <div className="p-3 text-center text-muted">Loading...</div>
      </div>
    );
  }

  if (!item) {
    return (
      <div className="container-fluid mt-3">
        <div className="p-3 text-center text-muted">
          Subscription plan not found.
        </div>
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

      <h2 className="mb-3">Edit Subscription Plan</h2>

      <div className="row justify-content-center">
        <div className="col-lg-6 col-md-8 col-sm-12">
          <div className="card shadow-sm">
            <div className="card-body">
              <form onSubmit={handleSubmit}>
                {/* Code */}
                <div className="mb-3">
                  <label className="form-label">Plan Code</label>
                  <input
                    type="text"
                    className="form-control"
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                  />
                </div>

                {/* Name */}
                <div className="mb-3">
                  <label className="form-label">Name</label>
                  <input
                    type="text"
                    className="form-control"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>

                {/* Description */}
                <div className="mb-3">
                  <label className="form-label">Description</label>
                  <textarea
                    className="form-control"
                    rows={3}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                  />
                </div>

                {/* Price */}
                <div className="mb-3">
                  <label className="form-label">Price</label>
                  <input
                    type="number"
                    step="0.01"
                    className="form-control"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                  />
                </div>

                {/* Billing Cycle */}
                <div className="mb-4">
                  <label className="form-label">Billing Cycle</label>
                  <select
                    className="form-select"
                    value={billingCycle}
                    onChange={(e) =>
                      setBillingCycle(e.target.value as any)
                    }
                  >
                    <option value="monthly">Monthly</option>
                    <option value="quarterly">Quarterly</option>
                    <option value="yearly">Yearly</option>
                  </select>
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

export default SubscriptionPlanEditPage;
