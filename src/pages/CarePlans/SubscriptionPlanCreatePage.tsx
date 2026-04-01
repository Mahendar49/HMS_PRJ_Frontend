// src/pages/CarePlans/SubscriptionPlanCreatePage.tsx

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  createSubscriptionPlan,
  SubscriptionPlanCreatePayload,
} from "../../api/subscriptionPlanApi";

const SubscriptionPlanCreatePage: React.FC = () => {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState<string>("0");
  const [billingCycle, setBillingCycle] =
    useState<"monthly" | "quarterly" | "yearly">("monthly");
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim()) {
      alert("Name is required");
      return;
    }

    const payload: SubscriptionPlanCreatePayload = {
      name: name.trim(),
      description: description.trim() || undefined,
      price: Number(price),
      billingCycle,
      // ❌ No `code` sent → backend auto-generates SUB-YYYY-xxxxxx
    };

    try {
      setSaving(true);
      await createSubscriptionPlan(payload);
      navigate("/careplans/subscription-plans");
    } catch (err) {
      console.error("Failed to create subscription plan", err);
      alert("Failed to create subscription plan");
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    navigate("/careplans/subscription-plans");
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

      <h2 className="mb-3">Add Subscription Plan</h2>

      <div className="row justify-content-center">
        <div className="col-lg-6 col-md-8 col-sm-12">
          <div className="card shadow-sm">
            <div className="card-body">
              <form onSubmit={handleSubmit}>

                {/* Name */}
                <div className="mb-3">
                  <label className="form-label">Name</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="e.g., Basic Plan"
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
                    placeholder="Short description..."
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
                    {saving ? "Saving..." : "Save Subscription Plan"}
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

export default SubscriptionPlanCreatePage;
