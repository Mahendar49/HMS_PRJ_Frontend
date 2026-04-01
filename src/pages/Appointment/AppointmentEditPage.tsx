import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";

import {
  getAppointmentById,
  updateAppointment,
} from "../../api/appointmentApi";

import { getAllPatients } from "../../api/patientApi";
import { getAllProviders } from "../../api/providerApi";

import type { AppointmentUpdateRequest } from "../../types/Appointment";
import type { PatientResponse } from "../../types/Patient";
import type { ProviderResponse } from "../../types/provider";

type AppointmentFormState = {
  patientId?: number;
  providerId?: number;
  organizationId?: number;
  scheduledStart?: string;
  scheduledEnd?: string;
  reason?: string;
  visitType?: string;
  status?: string;
};

export default function AppointmentEditPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState<AppointmentFormState>({});
  const [patients, setPatients] = useState<PatientResponse[]>([]);
  const [providers, setProviders] = useState<ProviderResponse[]>([]);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState("");

  useEffect(() => {
    loadPage();
  }, []);

  async function loadPage() {
    try {
      setLoading(true);

      const [patientList, providerList, appointment] = await Promise.all([
        getAllPatients(),
        getAllProviders(),
        getAppointmentById(Number(id)),
      ]);

      setPatients(patientList);
      setProviders(providerList);

      setForm({
        patientId: appointment.patientId,
        providerId: appointment.providerId,
        organizationId: appointment.organizationId ?? undefined,
        scheduledStart: appointment.scheduledStart,
        scheduledEnd: appointment.scheduledEnd ?? "",
        reason: appointment.reason,
        visitType: appointment.visitType,
        status: appointment.status,
      });
    } catch (err: any) {
      setError(err?.message || "Failed to load appointment.");
    } finally {
      setLoading(false);
    }
  }

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]:
        name === "patientId" ||
        name === "providerId" ||
        name === "organizationId"
          ? Number(value)
          : value,
    }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);

    try {
      const payload: AppointmentUpdateRequest = {
        ...form,
        patientId: Number(form.patientId),
        providerId: Number(form.providerId),
      };

      await updateAppointment(Number(id), payload);

      setSuccess("Appointment updated successfully!");
      setTimeout(() => navigate("/appointments"), 1000);
    } catch (err: any) {
      alert(err?.message || "Failed to update appointment");
    } finally {
      setSaving(false);
    }
  }

  if (loading)
    return (
      <p className="text-center mt-5 text-primary fw-bold">
        Loading appointment...
      </p>
    );

  if (error)
    return <p className="text-danger text-center mt-4 fw-semibold">{error}</p>;

  return (
    <div className="container mt-4">
      {/* Page Header */}
      <div className="d-flex align-items-center mb-3">
        <h3 className="text-primary fw-bold">
          <i className="bi bi-calendar-check me-2"></i>
          Edit Appointment #{id}
        </h3>
      </div>

      {/* Card */}
      <div className="card border-0 shadow-sm rounded-4">
        <div className="card-header bg-primary text-white rounded-top-4 py-3 px-4">
          <h5 className="mb-0 fw-semibold">
            <i className="bi bi-pencil-square me-2"></i>Update Appointment
          </h5>
        </div>

        <div className="card-body px-4 py-4">
          {success && (
            <div className="alert alert-success fw-semibold">{success}</div>
          )}

          <form onSubmit={handleSubmit} className="row g-4">
            {/* Patient Dropdown */}
            <div className="col-md-6">
              <label className="form-label fw-semibold text-primary">
                <i className="bi bi-person-fill me-1"></i> Patient
              </label>
              <select
                name="patientId"
                className="form-select shadow-sm"
                value={form.patientId ?? ""}
                onChange={handleChange}
                disabled={patients.length === 0}
              >
                <option value="">Select Patient</option>
                {patients.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.firstName} {p.lastName} (#{p.id})
                  </option>
                ))}
              </select>
            </div>

            {/* Provider Dropdown */}
            <div className="col-md-6">
              <label className="form-label fw-semibold text-primary">
                <i className="bi bi-person-badge-fill me-1"></i> Provider
              </label>
              <select
                name="providerId"
                className="form-select shadow-sm"
                value={form.providerId ?? ""}
                onChange={handleChange}
                disabled={providers.length === 0}
              >
                <option value="">Select Provider</option>
                {providers.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.providerName} ({p.specialization})
                  </option>
                ))}
              </select>
            </div>

            {/* Start Time */}
            <div className="col-md-6">
              <label className="form-label fw-semibold text-primary">
                <i className="bi bi-clock-history me-1"></i> Start Time
              </label>
              <input
                type="datetime-local"
                name="scheduledStart"
                className="form-control shadow-sm"
                value={form.scheduledStart ?? ""}
                onChange={handleChange}
              />
            </div>

            {/* End Time */}
            <div className="col-md-6">
              <label className="form-label fw-semibold text-primary">
                <i className="bi bi-clock me-1"></i> End Time
              </label>
              <input
                type="datetime-local"
                name="scheduledEnd"
                className="form-control shadow-sm"
                value={form.scheduledEnd ?? ""}
                onChange={handleChange}
              />
            </div>

            {/* Reason */}
            <div className="col-md-6">
              <label className="form-label fw-semibold text-primary">
                <i className="bi bi-file-text me-1"></i> Reason
              </label>
              <input
                type="text"
                name="reason"
                className="form-control shadow-sm"
                value={form.reason ?? ""}
                onChange={handleChange}
                placeholder="Enter visit reason"
              />
            </div>

            {/* Visit Type */}
            <div className="col-md-6">
              <label className="form-label fw-semibold text-primary">
                <i className="bi bi-hospital me-1"></i> Visit Type
              </label>
              <select
                name="visitType"
                className="form-select shadow-sm"
                value={form.visitType ?? ""}
                onChange={handleChange}
              >
                <option value="">Select Visit Type</option>
                <option value="consultation">Consultation</option>
                <option value="follow_up">Follow-Up</option>
                <option value="emergency">Emergency</option>
                <option value="routine_checkup">Routine Checkup</option>
                <option value="telehealth">Telehealth</option>
                <option value="lab_test">Lab Test</option>
                <option value="procedure">Procedure</option>
              </select>
            </div>

            {/* Status */}
            <div className="col-md-4">
              <label className="form-label fw-semibold text-primary">
                <i className="bi bi-flag me-1"></i> Status
              </label>
              <select
                name="status"
                className="form-select shadow-sm"
                value={form.status ?? "pending"}
                onChange={handleChange}
              >
                <option value="pending">Pending</option>
                <option value="confirmed">Confirmed</option>
                <option value="checked_in">Checked In</option>
                <option value="in_progress">In Progress</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
                <option value="no_show">No Show</option>
              </select>
            </div>

            {/* Buttons */}
            <div className="col-12 text-end mt-4">
              <button
                type="submit"
                className="btn btn-primary px-4 py-2 fw-semibold shadow-sm me-2"
                disabled={saving}
              >
                {saving ? "Saving..." : "Save Changes"}
              </button>

              <Link
                to="/appointments"
                className="btn btn-outline-secondary px-4 py-2 shadow-sm"
              >
                Cancel
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
