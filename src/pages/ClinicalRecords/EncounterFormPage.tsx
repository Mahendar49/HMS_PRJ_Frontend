import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { createEncounter } from "../../api/encounterApi";
import axios from "axios";

// Interfaces
interface Patient {
  id: number;
  name?: string;
  mrn?: string;
  firstName?: string;
  lastName?: string;
}

interface Provider {
  id: number;
  providerName?: string;  // backend field
  providerCode?: string;   // backend code
}

interface Appointment {
  id: number;
  appointmentCode?: string;  // 🔥 you said backend has this
  description?: string;
  scheduledStart?: string;
}

export default function EncounterFormPage() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    patientId: 0,
    appointmentId: 0,
    providerId: 0,
    startTime: "",
    endTime: "",
    encounterType: "",
    chiefComplaint: "",
    note: "",
  });

  const [patients, setPatients] = useState<Patient[]>([]);
  const [providers, setProviders] = useState<Provider[]>([]);
  const [appointments, setAppointments] = useState<Appointment[]>([]);

  useEffect(() => {
    fetchDropdowns();
  }, []);

  const fetchDropdowns = async () => {
    try {
      const token = localStorage.getItem("authToken");
      const headers = token ? { Authorization: `Bearer ${token}` } : {};

      const [patientsRes, providersRes, appointmentsRes] = await Promise.all([
        axios.get("http://localhost:8084/api/v1/patients", { headers }),
        axios.get("http://localhost:8084/api/v1/providers", { headers }),
        axios.get("http://localhost:8084/api/v1/appointments", { headers }),
      ]);

      setPatients(patientsRes.data);
      setProviders(providersRes.data);
      setAppointments(appointmentsRes.data);
    } catch (err) {
      console.error("Error fetching dropdown data:", err);
      alert("Failed to load dropdown data. Check console for details.");
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("authToken");
      const headers = token ? { Authorization: `Bearer ${token}` } : {};

      await createEncounter({ ...formData }, { headers });
      alert("Encounter created successfully!");
      navigate("/clinicalrecords/encounters");
    } catch (err) {
      console.error("Error creating encounter:", err);
      alert("Failed to create encounter. Check console for details.");
    }
  };

  const inputStyle: React.CSSProperties = {
    padding: "10px",
    borderRadius: "6px",
    border: "1px solid #ccc",
    fontSize: "16px",
    width: "100%",
  };

  return (
    <div
      style={{
        maxWidth: "800px",
        margin: "40px auto",
        padding: "20px",
        background: "#fff",
        borderRadius: "10px",
        boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
        fontFamily: "Arial, sans-serif",
      }}
    >
      <h1 style={{ fontSize: "24px", fontWeight: "bold", marginBottom: "20px" }}>
        Create Encounter
      </h1>

      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "15px" }}>

        {/* Patient */}
        <div>
          <label style={{ fontWeight: "bold", display: "block", marginBottom: "5px" }}>Patient</label>
          <select
            name="patientId"
            value={formData.patientId}
            onChange={handleChange}
            style={inputStyle}
            required
          >
            <option value="">Select Patient</option>
            {patients.map((p) => {
              const displayName =
                p.name ||
                (p.firstName && p.lastName
                  ? `${p.firstName} ${p.lastName}`
                  : p.firstName
                  ? p.firstName
                  : `Patient ${p.id}`);
              return (
                <option key={p.id} value={p.id}>
                  {displayName} ({p.mrn})
                </option>
              );
            })}
          </select>
        </div>

        {/* Appointment */}
        <div>
          <label style={{ fontWeight: "bold", display: "block", marginBottom: "5px" }}>
            Appointment
          </label>
          <select
            name="appointmentId"
            value={formData.appointmentId}
            onChange={handleChange}
            style={inputStyle}
            required
          >
            <option value="">Select Appointment</option>

            {/* 🔥 ONLY THIS PART IS MODIFIED */}
            {appointments.map((a) => {
              const displayName =
                a.appointmentCode ||                     // show code from backend
                a.description ||
                (a.scheduledStart
                  ? `Appointment ${a.id} - ${new Date(a.scheduledStart).toLocaleString()}`
                  : `Appointment ${a.id}`);

              return (
                <option key={a.id} value={a.id}>
                  {displayName}
                </option>
              );
            })}

          </select>
        </div>

        {/* Provider */}
        <div>
          <label style={{ fontWeight: "bold", display: "block", marginBottom: "5px" }}>Provider</label>
          <select
            name="providerId"
            value={formData.providerId}
            onChange={handleChange}
            style={inputStyle}
            required
          >
            <option value="">Select Provider</option>
            {providers.map((p) => (
              <option key={p.id} value={p.id}>
                {p.providerName} ({p.providerCode})
              </option>
            ))}
          </select>
        </div>

        {/* Start Time */}
        <div>
          <label style={{ fontWeight: "bold", display: "block", marginBottom: "5px" }}>Start Time</label>
          <input
            type="datetime-local"
            name="startTime"
            value={formData.startTime}
            onChange={handleChange}
            style={inputStyle}
            required
          />
        </div>

        {/* End Time */}
        <div>
          <label style={{ fontWeight: "bold", display: "block", marginBottom: "5px" }}>End Time</label>
          <input
            type="datetime-local"
            name="endTime"
            value={formData.endTime}
            onChange={handleChange}
            style={inputStyle}
            required
          />
        </div>

        {/* Encounter Type */}
        <div>
          <label style={{ fontWeight: "bold", display: "block", marginBottom: "5px" }}>Encounter Type</label>
          <select
            name="encounterType"
            value={formData.encounterType}
            onChange={handleChange}
            style={inputStyle}
            required
          >
            <option value="">Select type</option>
            <option value="Consultation">Consultation</option>
            <option value="Follow-up">Follow-up</option>
            <option value="Emergency">Emergency</option>
          </select>
        </div>

        {/* Chief Complaint */}
        <div>
          <label style={{ fontWeight: "bold", display: "block", marginBottom: "5px" }}>Chief Complaint</label>
          <input
            type="text"
            name="chiefComplaint"
            value={formData.chiefComplaint}
            onChange={handleChange}
            style={inputStyle}
          />
        </div>

        {/* Note */}
        <div>
          <label style={{ fontWeight: "bold", display: "block", marginBottom: "5px" }}>Note</label>
          <textarea
            name="note"
            value={formData.note}
            onChange={handleChange}
            style={{ ...inputStyle, height: "100px" }}
          />
        </div>

        <button
          type="submit"
          style={{
            padding: "12px",
            backgroundColor: "#2563eb",
            color: "#fff",
            border: "none",
            borderRadius: "6px",
            fontWeight: "bold",
            fontSize: "16px",
            cursor: "pointer",
            boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
            transition: "background-color 0.3s",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#1d4ed8")}
          onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#2563eb")}
        >
          Create Encounter
        </button>
      </form>
    </div>
  );
}
