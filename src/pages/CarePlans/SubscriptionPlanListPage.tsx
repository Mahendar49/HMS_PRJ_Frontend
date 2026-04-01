// src/pages/CarePlans/SubscriptionPlanListPage.tsx

import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  fetchSubscriptionPlans,
  deleteSubscriptionPlan,
  SubscriptionPlan,
} from "../../api/subscriptionPlanApi";

const SubscriptionPlanListPage: React.FC = () => {
  const [plans, setPlans] = useState<SubscriptionPlan[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadPlans();
  }, []);

  const loadPlans = async () => {
    try {
      setLoading(true);
      const data = await fetchSubscriptionPlans();
      setPlans(data);
    } catch (err) {
      console.error("Failed to load subscription plans", err);
      alert("Failed to load subscription plans");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm("Delete this subscription plan?")) return;

    try {
      await deleteSubscriptionPlan(id);
      await loadPlans();
    } catch (err) {
      console.error("Failed to delete subscription plan", err);
      alert("Failed to delete subscription plan");
    }
  };

  const filtered = useMemo(
    () =>
      plans.filter((p) => {
        const text = `${p.code || ""} ${p.name || ""}`.toLowerCase();
        return text.includes(search.toLowerCase());
      }),
    [plans, search]
  );

  return (
    <div className="container-fluid mt-3">
      <h2 className="mb-3">Subscription Plans</h2>

      {/* Search + New button row (like Medications) */}
      <div className="d-flex justify-content-between align-items-center mb-3">
        <div className="flex-grow-1 me-2">
          <div className="input-group">
            <span className="input-group-text">
              <i className="bi bi-search" />
            </span>
            <input
              type="text"
              className="form-control"
              placeholder="Search by code or name..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        <Link
          to="/careplans/subscription-plans/new"
          className="btn btn-primary"
        >
          + New
        </Link>
      </div>

      <div className="card shadow-sm">
        <div className="card-body p-0">
          {loading ? (
            <div className="p-3 text-center text-muted">Loading...</div>
          ) : filtered.length === 0 ? (
            <div className="p-3 text-center text-muted">
              No subscription plans found.
            </div>
          ) : (
            <table className="table mb-0">
              <thead className="table-primary">
                <tr>
                  <th style={{ width: "60px" }}>ID</th>
                  <th style={{ width: "140px" }}>Code</th>
                  <th>Name</th>
                  <th>Description</th>
                  <th style={{ width: "120px" }}>Price</th>
                  <th style={{ width: "140px" }}>Billing Cycle</th>
                  <th style={{ width: "160px" }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((p) => (
                  <tr key={p.id}>
                    <td>{p.id}</td>
                    <td className="fw-semibold">{p.code}</td>
                    <td>{p.name}</td>
                    <td>
                      {p.description && p.description.length > 60
                        ? p.description.slice(0, 60) + "..."
                        : p.description}
                    </td>
                    <td>₹{p.price.toFixed(2)}</td>
                    <td>{p.billingCycle}</td>
                    <td>
                      <Link
                        to={`/careplans/subscription-plans/${p.id}/edit`}
                        className="btn btn-sm btn-outline-primary me-2"
                      >
                        Edit
                      </Link>
                      <button
                        className="btn btn-sm btn-outline-danger"
                        onClick={() => handleDelete(p.id)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};

export default SubscriptionPlanListPage;
