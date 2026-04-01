import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

import { getEncounterById, updateEncounter } from "../../api/encounterApi";
import { getAllPatients } from "../../api/patientApi";
import { getAllProviders } from "../../api/providerApi";
import { getAllAppointments } from "../../api/appointmentApi";

import type { PatientResponse } from "../../types/Patient";
import type { ProviderResponse } from "../../types/provider";
import type { AppointmentResponse } from "../../types/Appointment";

export default function EncounterEditPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [patients, setPatients] = useState<PatientResponse[]>([]);
  const [providers, setProviders] = useState<ProviderResponse[]>([]);
  const [appointments, setAppointments] = useState<AppointmentResponse[]>([]);

  const [form, setForm] = useState({
    patientId: "",
    providerId: "",
    appointmentId: "",
    encounterType: "",
    chiefComplaint: "",
    note: "",
    startTime: "",
    endTime: "",
  });

  const [loading, setLoading] = useState(true);

  // ---------------------- Fetch Initial Data ------------------------
  useEffect(() => {
    async function loadData() {
      try {
        const [patientsRes, providersRes, appointmentsRes, encounterRes] =
          await Promise.all([
            getAllPatients(),
            getAllProviders(),
            getAllAppointments(),
            getEncounterById(Number(id)),
          ]);

        // FIXED: your API returns arrays, not {data: []}
        setPatients(patientsRes || []);
        setProviders(providersRes || []);
        setAppointments(appointmentsRes || []);

        const e = encounterRes.data;

        setForm({
          patientId: e.patientId?.toString() || "",
          providerId: e.providerId?.toString() || "",
          appointmentId: e.appointmentId?.toString() || "",
          encounterType: e.encounterType || "",
          chiefComplaint: e.chiefComplaint || "",
          note: e.note || "",
          startTime: e.startTime ? e.startTime.slice(0, 16) : "",
          endTime: e.endTime ? e.endTime.slice(0, 16) : "",
        });
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, [id]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const payload = {
      ...form,
      patientId: Number(form.patientId),
      providerId: Number(form.providerId),
      appointmentId: Number(form.appointmentId),
    };

    try {
      await updateEncounter(Number(id), payload);
      alert("Encounter updated successfully!");
      navigate(`/clinicalrecords/encounters/view/${id}`);
    } catch (err) {
      console.error(err);
      alert("Failed to update encounter.");
    }
  };

  if (loading) return <p>Loading...</p>;

  // ---------------------- Styles ------------------------
  const container = { maxWidth: "700px", margin: "40px auto", padding: "20px" };
  const formCard = {
    background: "#fff",
    padding: "25px",
    borderRadius: "8px",
    boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
  };
  const label = { fontWeight: 600, marginBottom: "6px" };
  const input = {
    padding: "10px",
    borderRadius: "6px",
    border: "1px solid #ccc",
    marginBottom: "16px",
    width: "100%",
  };

  return (
    <div style={container}>
      <h2 style={{ marginBottom: "20px", color: "#0c4a6e" }}>Edit Encounter</h2>

      <form style={formCard} onSubmit={handleSubmit}>
        {/* ---------------- Patient ---------------- */}
        <label style={label}>Patient</label>
        <select
          name="patientId"
          value={form.patientId}
          onChange={handleChange}
          style={input}
          required
        >
          <option value="">Select Patient</option>
          {patients.map((p) => (
            <option key={p.id} value={p.id}>
              {p.firstName} {p.lastName} ({p.mrn})
            </option>
          ))}
        </select>

        {/* ---------------- Provider ---------------- */}
        <label style={label}>Provider</label>
        <select
          name="providerId"
          value={form.providerId}
          onChange={handleChange}
          style={input}
          required
        >
          <option value="">Select Provider</option>
          {providers.map((pr) => (
            <option key={pr.id} value={pr.id}>
              {pr.providerName} ({pr.providerCode})
            </option>
          ))}
        </select>

        {/* ---------------- Appointment ---------------- */}
        <label style={label}>Appointment</label>
        <select
          name="appointmentId"
          value={form.appointmentId}
          onChange={handleChange}
          style={input}
        >
          <option value="">Select Appointment</option>
          {appointments.map((a) => (
            <option key={a.id} value={a.id}>
              {a.appointmentCode} — {a.patientName} with {a.providerName}
            </option>
          ))}
        </select>

        {/* ---------------- Type ---------------- */}
        <label style={label}>Encounter Type</label>
        <select
          name="encounterType"
          value={form.encounterType}
          onChange={handleChange}
          style={input}
          required
        >
          <option value="">Select</option>
          <option value="OPD">OPD</option>
          <option value="EMERGENCY">Emergency</option>
          <option value="FOLLOWUP">Follow-up</option>
          <option value="ROUTINE">Routine Check</option>
        </select>

        {/* ---------------- Other Fields ---------------- */}
        <label style={label}>Chief Complaint</label>
        <input
          type="text"
          name="chiefComplaint"
          value={form.chiefComplaint}
          onChange={handleChange}
          style={input}
        />

        <label style={label}>Note</label>
        <textarea
          name="note"
          value={form.note}
          onChange={handleChange}
          style={input}
        />

        <label style={label}>Start Time</label>
        <input
          type="datetime-local"
          name="startTime"
          value={form.startTime}
          onChange={handleChange}
          style={input}
          required
        />

        <label style={label}>End Time</label>
        <input
          type="datetime-local"
          name="endTime"
          value={form.endTime}
          onChange={handleChange}
          style={input}
        />

        <button
          type="submit"
          style={{
            padding: "12px",
            background: "#0284c7",
            color: "#fff",
            border: "none",
            borderRadius: "6px",
            cursor: "pointer",
            width: "100%",
            fontSize: "1rem",
          }}
        >
          Update Encounter
        </button>
      </form>
    </div>
  );
}
