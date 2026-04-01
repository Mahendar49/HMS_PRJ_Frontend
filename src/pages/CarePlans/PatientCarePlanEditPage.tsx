// src/pages/CarePlans/PatientCarePlanEditPage.tsx

import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  fetchPatientCarePlanById,
  updatePatientCarePlan,
  PatientCarePlan,
  PatientCarePlanUpdatePayload,
} from "../../api/patientCarePlanApi";

const PatientCarePlanEditPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [item, setItem] = useState<PatientCarePlan | null>(null);
  const [patientId, setPatientId] = useState<number | "">("");
  const [carePlanId, setCarePlanId] = useState<number | "">("");
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");
  const [status, setStatus] = useState<string>("active");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [assignedByLabel, setAssignedByLabel] = useState<string>("");

  useEffect(() => {
    if (!id) return;
    loadItem(parseInt(id, 10));
  }, [id]);

  const loadItem = async (pid: number) => {
    try {
      setLoading(true);
      const data = await fetchPatientCarePlanById(pid);
      setItem(data);
      setPatientId(data.patientId);
      setCarePlanId(data.carePlanId);
      setStartDate(data.startDate ? data.startDate.split("T")[0] : "");
      setEndDate(data.endDate ? data.endDate.split("T")[0] : "");
      setStatus(data.status);
      const displayAssignedBy =
  data.assignedByName ||
  (data.assignedBy != null ? `User #${data.assignedBy}` : "Current user (auto)");
setAssignedByLabel(displayAssignedBy);
      
    } catch (err) {
      console.error("Failed to load patient care plan", err);
      alert("Failed to load patient care plan");
      navigate("/careplans/patient-care-plans");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id) return;

    if (!patientId || !carePlanId) {
      alert("Patient and Care Plan are required");
      return;
    }

    const payload: PatientCarePlanUpdatePayload = {
      patientId: Number(patientId),
      carePlanId: Number(carePlanId),
      startDate: startDate || null,
      endDate: endDate || null,
      status,
      //assignedBy: assignedBy ? Number(assignedBy) : null,
    };

    try {
      setSaving(true);
      await updatePatientCarePlan(parseInt(id, 10), payload);
      navigate("/careplans/patient-care-plans");
    } catch (err) {
      console.error("Failed to update patient care plan", err);
      alert("Failed to update patient care plan");
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    navigate("/careplans/patient-care-plans");
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
          Patient care plan not found.
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

      <h2 className="mb-3">Edit Patient Care Plan</h2>

      <div className="row justify-content-center">
        <div className="col-lg-6 col-md-8 col-sm-12">
          <div className="card shadow-sm">
            <div className="card-body">
              <form onSubmit={handleSubmit}>
                {/* Patient ID */}
                <div className="mb-3">
                  <label className="form-label">Patient ID</label>
                  <input
                    type="number"
                    className="form-control"
                    value={patientId}
                    onChange={(e) =>
                      setPatientId(
                        e.target.value === "" ? "" : Number(e.target.value)
                      )
                    }
                  />
                </div>

                {/* Care Plan ID */}
                <div className="mb-3">
                  <label className="form-label">Care Plan ID</label>
                  <input
                    type="number"
                    className="form-control"
                    value={carePlanId}
                    onChange={(e) =>
                      setCarePlanId(
                        e.target.value === "" ? "" : Number(e.target.value)
                      )
                    }
                  />
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

                {/* Assigned By */}
                {/* Assigned By (read-only) */}
<div className="mb-4">
  <label className="form-label">Assigned By</label>
  <input
    type="text"
    className="form-control"
    value={assignedByLabel}
    readOnly
  />
  <div className="form-text">
    This is set automatically based on who created/assigned the plan.
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

export default PatientCarePlanEditPage;
