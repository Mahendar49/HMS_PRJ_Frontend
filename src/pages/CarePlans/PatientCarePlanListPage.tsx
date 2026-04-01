// src/pages/CarePlans/PatientCarePlanListPage.tsx

import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  fetchPatientCarePlans,
  deletePatientCarePlan,
  PatientCarePlan,
  fetchPatientsForDropdown,
  fetchCarePlansForDropdown,
  SimplePatient,
  SimpleCarePlan,
} from "../../api/patientCarePlanApi";
import { getAllPatients } from "../../api/patientApi";
import type { PatientResponse } from "../../types/Patient";

import { fetchCarePlans } from "../../api/carePlanApi";
import type { CarePlan } from "../../api/carePlanApi";


const PatientCarePlanListPage: React.FC = () => {
  const [items, setItems] = useState<PatientCarePlan[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [patientsMap, setPatientsMap] = useState<Record<number, string>>({});
const [carePlansMap, setCarePlansMap] = useState<Record<number, string>>({});


  useEffect(() => {
    loadData();
  }, []);

 const loadData = async () => {
  try {
    setLoading(true);

    const [pcps, patients, carePlans] = await Promise.all([
      fetchPatientCarePlans(),
      getAllPatients(),
      fetchCarePlans(),
    ]);

    setItems(pcps);

    // build patient id → name
    const pMap: Record<number, string> = {};
    patients.forEach((p: PatientResponse) => {
      const name =
        (p as any).fullName ||
        `${p.firstName || ""} ${p.lastName || ""}`.trim() ||
        `Patient #${p.id}`;
      pMap[p.id] = name;
    });

    // build care plan id → name
    const cpMap: Record<number, string> = {};
    carePlans.forEach((cp: CarePlan) => {
      cpMap[cp.id] = cp.name;
    });

    setPatientsMap(pMap);
    setCarePlansMap(cpMap);
  } catch (err) {
    console.error("Failed to load patient care plans", err);
    alert("Failed to load patient care plans");
  } finally {
    setLoading(false);
  }
};



  const handleDelete = async (id: number) => {
    if (!window.confirm("Delete this patient care plan?")) return;
    try {
      await deletePatientCarePlan(id);
      await loadData();
    } catch (err) {
      console.error("Failed to delete patient care plan", err);
      alert("Failed to delete patient care plan");
    }
  };

  const filtered = useMemo(
  () =>
    items.filter((item) => {
      const patientName =
        item.patientName || patientsMap[item.patientId] || "";
      const carePlanName =
        item.carePlanName || carePlansMap[item.carePlanId] || "";

      const text = `${patientName} #${item.patientId} ${carePlanName} #${
        item.carePlanId
      } ${item.status || ""}`.toLowerCase();

      return text.includes(search.toLowerCase());
    }),
  [items, search, patientsMap, carePlansMap]
);


  const formatDate = (value?: string | null) => {
    if (!value) return "-";
    return value.split("T")[0]; // '2025-11-01T00:00:00' → '2025-11-01'
  };

  return (
    <div className="container-fluid mt-3">
      <h2 className="mb-3">Patient Care Plans</h2>

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
              placeholder="Search by patient, care plan, status..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        <Link
          to="/careplans/patient-care-plans/new"
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
              No patient care plans found.
            </div>
          ) : (
            <table className="table mb-0">
              <thead className="table-primary">
                <tr>
                  <th style={{ width: "60px" }}>ID</th>
                  <th>Patient</th>
                  <th>Care Plan</th>
                  <th style={{ width: "120px" }}>Start</th>
                  <th style={{ width: "120px" }}>End</th>
                  <th style={{ width: "120px" }}>Status</th>
                  <th style={{ width: "140px" }}>Assigned By</th>
                  <th style={{ width: "160px" }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((item) => (
                  <tr key={item.id}>
                    <td>{item.id}</td>
                    <td>
  {item.patientName || patientsMap[item.patientId]
    ? `${item.patientName || patientsMap[item.patientId]} (#${item.patientId})`
    : `#${item.patientId}`}
</td>

                    <td>
  {item.carePlanName || carePlansMap[item.carePlanId]
    ? `${
        item.carePlanName || carePlansMap[item.carePlanId]
      } (#${item.carePlanId})`
    : `#${item.carePlanId}`}
</td>


                    <td>{formatDate(item.startDate)}</td>
                    <td>{formatDate(item.endDate)}</td>
                    <td className="text-capitalize">{item.status}</td>
                    <td>{item.assignedByName || item.assignedBy || "-"}</td>
                    <td>
                      <Link
                        to={`/careplans/patient-care-plans/${item.id}/edit`}
                        className="btn btn-sm btn-outline-primary me-2"
                      >
                        Edit
                      </Link>
                      <button
                        className="btn btn-sm btn-outline-danger"
                        onClick={() => handleDelete(item.id)}
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

export default PatientCarePlanListPage;