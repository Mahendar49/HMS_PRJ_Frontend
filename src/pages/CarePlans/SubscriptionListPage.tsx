import React, { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  fetchSubscriptions,
  deleteSubscription,
  Subscription,
  fetchPatientsForDropdown,
  fetchPlansForDropdown,
  SimplePatient,
  SimpleSubscriptionPlan,
} from "../../api/subscriptionApi";


const SubscriptionListPage: React.FC = () => {
  const [subs, setSubs] = useState<Subscription[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [patients, setPatients] = useState<SimplePatient[]>([]);
const [plans, setPlans] = useState<SimpleSubscriptionPlan[]>([]);


  const navigate = useNavigate(); // ✅ For edit navigation

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
  try {
    setLoading(true);

    const [subsData, patientList, planList] = await Promise.all([
      fetchSubscriptions(),
      fetchPatientsForDropdown(),
      fetchPlansForDropdown(),
    ]);

    setSubs(subsData);
    setPatients(patientList);
    setPlans(planList);
  } catch (err) {
    console.error("Failed to load subscriptions", err);
    alert("Failed to load subscriptions");
  } finally {
    setLoading(false);
  }
};


  const handleDelete = async (id: number) => {
    if (!window.confirm("Are you sure you want to delete this subscription?")) {
      return;
    }

    try {
      await deleteSubscription(id);
      loadData();
    } catch (err) {
      console.error("Failed to delete subscription", err);
      alert("Failed to delete subscription");
    }
  };

  const getPatientLabel = (s: Subscription) => {
  const p = patients.find((p) => p.id === s.patientId);
  if (!p) return `#${s.patientId}`;

  const name =
    p.fullName ||
    `${p.firstName || ""} ${p.lastName || ""}`.trim();

  return name ? `${name} (ID: ${p.id})` : `#${p.id}`;
};

const getPlanLabel = (s: Subscription) => {
  const pl = plans.find((pl) => pl.id === s.planId);
  if (!pl) return `#${s.planId}`;

  return `${pl.name}${pl.code ? ` (${pl.code})` : ""}`;
};


  const filtered = useMemo(
  () =>
    subs.filter((s) => {
      const text = `${getPatientLabel(s)} ${getPlanLabel(s)} ${
        s.status || ""
      }`.toLowerCase();
      return text.includes(search.toLowerCase());
    }),
  [subs, search, patients, plans]
);


  const formatDateTime = (value?: string) => {
    if (!value) return "-";
    const [date, time] = value.split("T");
    return `${date} ${time?.slice(0, 5) || ""}`;
  };

  return (
    <div className="container-fluid mt-3">
      <h2 className="mb-3">Subscriptions</h2>

      {/* Search + New button row */}
      <div className="d-flex justify-content-between align-items-center mb-3">
        <div className="flex-grow-1 me-2">
          <div className="input-group">
            <span className="input-group-text">
              <i className="bi bi-search" />
            </span>
            <input
              type="text"
              className="form-control"
              placeholder="Search by patient, plan, status..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        <Link to="/careplans/subscriptions/new" className="btn btn-primary">
          + New
        </Link>
      </div>

      <div className="card shadow-sm">
        <div className="card-body p-0">
          {loading ? (
            <div className="p-3 text-center text-muted">Loading...</div>
          ) : filtered.length === 0 ? (
            <div className="p-3 text-center text-muted">
              No subscriptions found.
            </div>
          ) : (
            <table className="table mb-0">
              <thead className="table-primary">
                <tr>
                  <th style={{ width: "60px" }}>ID</th>
                  <th>Patient</th>
                  <th>Plan</th>
                  <th style={{ width: "160px" }}>Started</th>
                  <th style={{ width: "180px" }}>Next Billing</th>
                  <th style={{ width: "120px" }}>Status</th>
                  <th style={{ width: "100px" }}>Auto Renew</th>
                  {/* ✅ New Actions column */}
                  <th style={{ width: "160px" }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((s) => (
                  <tr key={s.id}>
                    <td>{s.id}</td>
                    <td>{getPatientLabel(s)}</td>
<td>{getPlanLabel(s)}</td>

                    <td>{formatDateTime(s.startedAt)}</td>
                    <td>{formatDateTime(s.nextBillingAt)}</td>
                    <td className="text-capitalize">{s.status}</td>
                    <td>{s.autoRenew ? "Yes" : "No"}</td>

                    {/* ✅ Edit + Delete buttons */}
                    <td>
                      <div className="d-flex gap-2">
                        {/* EDIT */}
                        <button
                          className="btn btn-sm btn-outline-primary"
                          onClick={() =>
                            navigate(
                              `/careplans/subscriptions/${s.id}/edit`
                            )
                          }
                        >
                          Edit
                        </button>

                        {/* DELETE */}
                        <button
                          className="btn btn-sm btn-outline-danger"
                          onClick={() => handleDelete(s.id)}
                        >
                          Delete
                        </button>
                      </div>
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

export default SubscriptionListPage;