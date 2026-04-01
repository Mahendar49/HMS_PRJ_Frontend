import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  fetchCarePlans,
  deleteCarePlan,
} from "../../api/carePlanApi";
import type { CarePlan } from "../../api/carePlanApi";

const CarePlanListPage: React.FC = () => {
  const [carePlans, setCarePlans] = useState<CarePlan[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadCarePlans();
  }, []);

  const loadCarePlans = async () => {
    try {
      setLoading(true);
      const data = await fetchCarePlans();
      setCarePlans(data);
    } catch (err) {
      console.error("Failed to load care plans", err);
      alert("Failed to load care plans");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm("Delete this care plan?")) return;
    try {
      await deleteCarePlan(id);
      await loadCarePlans();
    } catch (err) {
      console.error("Failed to delete care plan", err);
      alert("Failed to delete care plan");
    }
  };

  const filtered = useMemo(
    () =>
      carePlans.filter((cp) =>
        (cp.name || "").toLowerCase().includes(search.toLowerCase())
      ),
    [carePlans, search]
  );

  return (
    <div className="container-fluid mt-3">
      <h2 className="mb-3">Care Plans</h2>

      {/* Search + New button row (same style as Medications) */}
      <div className="d-flex justify-content-between align-items-center mb-3">
        <div className="flex-grow-1 me-2">
          <div className="input-group">
            <span className="input-group-text">
              <i className="bi bi-search" />
            </span>
            <input
              type="text"
              className="form-control"
              placeholder="Search care plans..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>
        <Link to="/careplans/new" className="btn btn-primary">
          + New
        </Link>
      </div>

      <div className="card shadow-sm">
        <div className="card-body p-0">
          {loading ? (
            <div className="p-3 text-center text-muted">Loading...</div>
          ) : filtered.length === 0 ? (
            <div className="p-3 text-center text-muted">
              No care plans found.
            </div>
          ) : (
            <table className="table mb-0">
              <thead className="table-primary">
                <tr>
                  <th style={{ width: "60px" }}>ID</th>
                  <th>Name</th>
                  <th>Description</th>
                  <th style={{ width: "120px" }}>Active</th>
                  <th style={{ width: "160px" }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((cp) => (
                  <tr key={cp.id}>
                    <td>{cp.id}</td>
                    <td className="fw-semibold">{cp.name}</td>
                    <td>
                      {cp.description && cp.description.length > 60
                        ? cp.description.slice(0, 60) + "..."
                        : cp.description}
                    </td>
                    <td>{cp.active ? "Yes" : "No"}</td>
                    <td>
                      <Link
                        to={`/careplans/${cp.id}/edit`}
                        className="btn btn-sm btn-outline-primary me-2"
                      >
                        Edit
                      </Link>
                      <button
                        className="btn btn-sm btn-outline-danger"
                        onClick={() => handleDelete(cp.id)}
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

export default CarePlanListPage;
