// src/pages/Appointment/AppointmentViewPage.tsx

import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { getAppointmentById } from "../../api/appointmentApi";
import { getPatientById } from "../../api/patientApi";
import { getProviderById } from "../../api/providerApi";
import type { AppointmentResponse } from "../../types/Appointment";

export default function AppointmentViewPage() {
  const { id } = useParams();
  const [appointment, setAppointment] = useState<AppointmentResponse | null>(
    null
  );
  const [patientName, setPatientName] = useState<string>("Unknown");
  const [providerName, setProviderName] = useState<string>("Unknown");
  const [error, setError] = useState("");

  useEffect(() => {
    async function load() {
      try {
        const res = await getAppointmentById(Number(id));
        setAppointment(res);

        // Fetch patient name
        if (res.patientId) {
          try {
            const p = await getPatientById(res.patientId);
            setPatientName(`${p.firstName} ${p.lastName}`);
          } catch {
            setPatientName("Unknown");
          }
        }

        // Fetch provider name
        if (res.providerId) {
          try {
            const pr = await getProviderById(res.providerId);
            setProviderName(pr.providerName || `${pr.providerName} `);
          } catch {
            setProviderName("Unknown");
          }
        }
      } catch (err: any) {
        setError(err?.message || "Failed to load appointment");
      }
    }
    load();
  }, [id]);

  if (error) return <p className="text-danger mt-4">{error}</p>;
  if (!appointment) return <p className="text-center mt-4">Loading...</p>;

  return (
    <div className="container mt-4">
      <div className="card shadow-lg border-0">
        {/* Header */}
        <div className="card-header bg-primary text-white py-3">
          <h4 className="mb-0">
            <i className="bi bi-calendar-check me-2"></i>
            Appointment #{appointment.id}
          </h4>
        </div>

        <div className="card-body p-4">
          {/* Status Badge */}
          <div className="mb-4">
            <span className="badge bg-info text-dark fs-6 px-3 py-2 text-uppercase">
              <i className="bi bi-info-circle me-1"></i>
              {appointment.status}
            </span>
          </div>

          {/* Row 1 */}
          <div className="row mb-3">
            <div className="col-md-6 mb-3">
              <label className="fw-bold text-secondary">
                <i className="bi bi-person-fill me-1"></i>Patient
              </label>
              <div className="form-control bg-light">
                {patientName} (ID: {appointment.patientId})
              </div>
            </div>

            <div className="col-md-6 mb-3">
              <label className="fw-bold text-secondary">
                <i className="bi bi-person-badge-fill me-1"></i>Provider
              </label>
              <div className="form-control bg-light">
                {providerName} (ID: {appointment.providerId})
              </div>
            </div>
          </div>

          {/* Row 2 */}
          <div className="row mb-3">
            <div className="col-md-4 mb-3">
              <label className="fw-bold text-secondary">
                <i className="bi bi-building me-1"></i>Organization
              </label>
              <div className="form-control bg-light">
                {appointment.organizationId ?? "N/A"}
              </div>
            </div>

            <div className="col-md-4 mb-3">
              <label className="fw-bold text-secondary">
                <i className="bi bi-clock me-1"></i>Start Time
              </label>
              <div className="form-control bg-light">
                {appointment.scheduledStart?.replace("T", " ")}
              </div>
            </div>

            <div className="col-md-4 mb-3">
              <label className="fw-bold text-secondary">
                <i className="bi bi-clock-history me-1"></i>End Time
              </label>
              <div className="form-control bg-light">
                {appointment.scheduledEnd?.replace("T", " ") || "—"}
              </div>
            </div>
          </div>

          {/* Row 3 */}
          <div className="row mb-3">
            <div className="col-md-6 mb-3">
              <label className="fw-bold text-secondary">
                <i className="bi bi-clipboard-check me-1"></i>Reason
              </label>
              <div className="form-control bg-light">{appointment.reason}</div>
            </div>

            <div className="col-md-6 mb-3">
              <label className="fw-bold text-secondary">
                <i className="bi bi-hospital me-1"></i>Visit Type
              </label>
              <div className="form-control bg-light">{appointment.visitType}</div>
            </div>
          </div>

          {/* Actions */}
          <div className="mt-4 text-end">
            <Link
              to={`/appointments/edit/${appointment.id}`}
              className="btn btn-warning me-2"
            >
              <i className="bi bi-pencil-square me-1"></i>Edit
            </Link>

            <Link to="/appointments" className="btn btn-secondary">
              <i className="bi bi-arrow-left me-1"></i>Back
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
