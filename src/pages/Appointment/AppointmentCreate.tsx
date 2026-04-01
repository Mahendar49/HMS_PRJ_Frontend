// src/pages/Appointment/AppointmentCreatePage.tsx

import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { createAppointment } from "../../api/appointmentApi";
import { getAllPatients } from "../../api/patientApi";
import { getAllProviders } from "../../api/providerApi";

import type { AppointmentRequest } from "../../types/Appointment";
import { getLoggedUserFromToken } from "../../api/authApi";

export default function AppointmentCreatePage() {
  const navigate = useNavigate();

  const [patients, setPatients] = useState<any[]>([]);
  const [providers, setProviders] = useState<any[]>([]);

  // ✅ Get logged-in user using your helper
  const loggedUser = getLoggedUserFromToken();
  const loggedUserId = loggedUser?.id || 0;
  const loggedUserEmail = loggedUser?.email || "Unknown User";

  const [form, setForm] = useState<AppointmentRequest>({
    provider_id: 0,
    patient_id: 0,
    organizationId: 1,
    scheduledStart: "",
    scheduledEnd: "",
    reason: "",
    visitType: "",
    status: "pending",
    createdBy: loggedUserId, // auto-set from JWT
  });

  useEffect(() => {
    loadPatients();
    loadProviders();
  }, []);

  const loadPatients = async () => {
    try {
      const res = await getAllPatients();
      setPatients(res || []);
    } catch (err) {
      console.error("Error fetching patients", err);
    }
  };

  const loadProviders = async () => {
    try {
      const res = await getAllProviders();
      setProviders(res || []);
    } catch (err) {
      console.error("Error fetching providers", err);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const payload: AppointmentRequest = {
      ...form,
      provider_id: Number(form.provider_id),
      patient_id: Number(form.patient_id),
      organizationId: Number(form.organizationId),
      createdBy: Number(loggedUserId), // ensure correct value
    };

    try {
      await createAppointment(payload);
      alert("Appointment created successfully!");
      navigate("/appointments");
    } catch (err) {
      console.error("Error creating appointment:", err);
      alert("Failed to create appointment");
    }
  };

  return (
    <div className="container mt-4">
      <h2>Create Appointment</h2>

      <form onSubmit={handleSubmit} className="mt-3">
        
        {/* Patient */}
        <div className="mb-3">
          <label className="form-label">Patient</label>
          <select
            name="patient_id"
            className="form-control"
            value={form.patient_id}
            onChange={handleChange}
            required
          >
            <option value="">Select Patient</option>
            {patients.map((p) => (
              <option key={p.id} value={p.id}>
                {p.id} - {p.firstName} {p.lastName}
              </option>
            ))}
          </select>
        </div>

        {/* Provider */}
        <div className="mb-3">
          <label className="form-label">Provider</label>
          <select
            name="provider_id"
            className="form-control"
            value={form.provider_id}
            onChange={handleChange}
            required
          >
            <option value="">Select Provider</option>
            {providers.map((p) => (
              <option key={p.id} value={p.id}>
                {p.id} - {p.providerName || `${p.firstName} ${p.lastName}`}
              </option>
            ))}
          </select>
        </div>

        {/* Start time */}
        <div className="mb-3">
          <label className="form-label">Start Time</label>
          <input
            type="datetime-local"
            name="scheduledStart"
            className="form-control"
            value={form.scheduledStart}
            onChange={handleChange}
            required
          />
        </div>

        {/* End time */}
        <div className="mb-3">
          <label className="form-label">End Time</label>
          <input
            type="datetime-local"
            name="scheduledEnd"
            className="form-control"
            value={form.scheduledEnd}
            onChange={handleChange}
            required
          />
        </div>

        {/* Reason */}
        <div className="mb-3">
          <label className="form-label">Reason</label>
          <input
            type="text"
            name="reason"
            className="form-control"
            value={form.reason}
            onChange={handleChange}
          />
        </div>

        {/* Visit Type */}
        <div className="mb-3">
          <label className="form-label">Visit Type</label>
          <select
            name="visitType"
            className="form-control"
            value={form.visitType}
            onChange={handleChange}
            required
          >
            <option value="">Select Visit Type</option>
            <option value="Consultation">Consultation</option>
            <option value="Follow-up">Follow-up</option>
            <option value="Emergency">Emergency</option>
            <option value="Routine Checkup">Routine Checkup</option>
            <option value="Telehealth">Telehealth</option>
          </select>
        </div>

        {/* Status */}
        <div className="mb-3">
          <label className="form-label">Status</label>
          <select
            name="status"
            className="form-control"
            value={form.status}
            onChange={handleChange}
          >
            <option value="pending">Pending</option>
            <option value="confirmed">Confirmed</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>

        {/* CreatedBy */}
        <div className="mb-3">
          <label className="form-label">Created By</label>
          <input
            type="text"
            className="form-control"
            value={`${loggedUserEmail} - [${loggedUserId}]`}
            disabled
          />
        </div>

        <button className="btn btn-primary" type="submit">
          Create Appointment
        </button>
      </form>
    </div>
  );
}
