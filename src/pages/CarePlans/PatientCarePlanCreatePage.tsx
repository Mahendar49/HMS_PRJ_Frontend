// src/pages/CarePlans/PatientCarePlanCreatePage.tsx

import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  createPatientCarePlan,
  PatientCarePlanCreatePayload,
  fetchPatientsForDropdown,
  fetchCarePlansForDropdown,
  SimplePatient,
  SimpleCarePlan,
} from "../../api/patientCarePlanApi";
import { getLoggedUserFromToken } from "../../api/authApi";

 const loggedUser = getLoggedUserFromToken();
  const loggedUserId = loggedUser?.id || 0;
  const loggedUserEmail = loggedUser?.email || "Unknown User";

// Helper: try to get current user name from localStorage / token
function getCurrentUserName(): string {
  // if you store username explicitly
  const storedName =
    localStorage.getItem("userName") ||
    localStorage.getItem("username") ||
    localStorage.getItem("fullName");
  if (storedName) return storedName;

  // fallback: try decode JWT token
  const token = localStorage.getItem("authToken");
  if (!token) return "Current user (auto)";

  try {
    const payloadPart = token.split(".")[1];
    const decoded = JSON.parse(atob(payloadPart));
    return (
      decoded.name ||
      decoded.fullName ||
      decoded.username ||
      decoded.sub ||
      "Current user (auto)"
    );
  } catch (e) {
    return "Current user (auto)";
  }
}

const PatientCarePlanCreatePage: React.FC = () => {
  const navigate = useNavigate();

  const [patientId, setPatientId] = useState<number | "">("");
  const [carePlanId, setCarePlanId] = useState<number | "">("");
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");
  const [status, setStatus] = useState<string>("active");
  const [saving, setSaving] = useState(false);

  // dropdown data
  const [patients, setPatients] = useState<SimplePatient[]>([]);
  const [carePlans, setCarePlans] = useState<SimpleCarePlan[]>([]);

  // search text for dropdowns
  const [carePlanSearch, setCarePlanSearch] = useState("");

  // Assigned By label (display only)
  const [assignedByLabel] = useState<string>(getCurrentUserName());

  // load patients + care plans for dropdowns
  useEffect(() => {
    const loadDropdownData = async () => {
      try {
        const [patientsData, carePlansData] = await Promise.all([
          fetchPatientsForDropdown(),
          fetchCarePlansForDropdown(),
        ]);
        setPatients(patientsData);
        setCarePlans(carePlansData);
      } catch (err) {
        console.error("Failed to load patients/care plans", err);
        alert("Failed to load patients or care plans");
      }
    };

    loadDropdownData();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!patientId || !carePlanId) {
      alert("Patient and Care Plan are required");
      return;
    }

    const payload: PatientCarePlanCreatePayload = {
      patientId: Number(patientId),
      carePlanId: Number(carePlanId),
      startDate: startDate || null,
      endDate: endDate || null,
      status,
      assignedBy: loggedUserId,
      // ❌ no assignedBy – backend sets it based on current user
    };

    try {
      setSaving(true);
      await createPatientCarePlan(payload);
      navigate("/careplans/patient-care-plans");
    } catch (err) {
      console.error("Failed to create patient care plan", err);
      alert("Failed to create patient care plan");
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    navigate("/careplans/patient-care-plans");
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

      <h2 className="mb-3">Add Patient Care Plan</h2>

      <div className="row justify-content-center">
        <div className="col-lg-6 col-md-8 col-sm-12">
          <div className="card shadow-sm">
            <div className="card-body">
              <form onSubmit={handleSubmit}>
                {/* Patient (search + dropdown) */}
                {/* Patient ID (single select like Add Prescription) */}
<div className="mb-3">
  <label className="form-label">Patient ID</label>
  <select
    className="form-select"
    value={patientId}
    onChange={(e) =>
      setPatientId(
        e.target.value === "" ? "" : Number(e.target.value)
      )
    }
  >
    <option value="">Select patient</option>
    {patients.map((p) => {
      const label =
        p.fullName ||
        `${p.firstName || ""} ${p.lastName || ""}`.trim() ||
        `Patient #${p.id}`;
      return (
        <option key={p.id} value={p.id}>
          {label} (ID: {p.id})
        </option>
      );
    })}
  </select>
</div>


                {/* Care Plan (search + dropdown) */}
                {/* Care Plan (single select) */}
<div className="mb-3">
  <label className="form-label">Care Plan</label>
  <select
    className="form-select"
    value={carePlanId}
    onChange={(e) =>
      setCarePlanId(
        e.target.value === "" ? "" : Number(e.target.value)
      )
    }
  >
    <option value="">Select care plan</option>
    {carePlans.map((cp) => (
      <option key={cp.id} value={cp.id}>
        {cp.name} (ID: {cp.id})
      </option>
    ))}
  </select>
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

                {/* End Date */}
                <div className="mb-3">
                  <label className="form-label">End Date</label>
                  <input
                    type="date"
                    className="form-control"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
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
                    <option value="completed">Completed</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </div>

                {/* Assigned By (read-only) */}
                <div className="mb-4">
                  <label className="form-label">Assigned By</label>
                  <input
                    type="text"
                    className="form-control"
                    value={`${loggedUserEmail}-[${loggedUserId}]`}
                    readOnly
                  />
                  <div className="form-text">
                    This will be saved automatically as the logged-in user.
                  </div>
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
                    {saving ? "Saving..." : "Save Patient Care Plan"}
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

export default PatientCarePlanCreatePage;
