import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { createDiagnosis } from "../../api/diagnosisApi";
import type { DiagnosisRequest } from "../../types/Diagnosis";
import axios from "axios";

export default function DiagnosisFormPage() {
  const navigate = useNavigate();

  const [form, setForm] = useState<DiagnosisRequest>({
    patientId: "",
    encounterId: "",
    code: "", // <-- Removed from UI, but kept in object (backend auto-generates)
    description: "",
    onsetDate: "",
  });

  const [patients, setPatients] = useState<any[]>([]);
  const [encounters, setEncounters] = useState<any[]>([]);

  // Load dropdowns
  useEffect(() => {
    loadDropdowns();
  }, []);

  const loadDropdowns = async () => {
    try {
      const token = localStorage.getItem("authToken");
      const headers = token ? { Authorization: `Bearer ${token}` } : {};

      const [patientRes, encounterRes] = await Promise.all([
        axios.get("http://localhost:8084/api/v1/patients", { headers }),
        axios.get("http://localhost:8084/api/encounters", { headers }),
      ]);

      setPatients(patientRes.data);
      setEncounters(encounterRes.data);
    } catch (err) {
      console.log("Failed to load dropdowns:", err);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;

    setForm({
      ...form,
      [name]: name === "patientId" || name === "encounterId" ? Number(value) : value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createDiagnosis(form);
      alert("Diagnosis created successfully!");
      navigate("/clinicalrecords/diagnosis");
    } catch (e) {
      alert("Failed to save diagnosis");
      console.error(e);
    }
  };

  // Styling
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
        Create Diagnosis
      </h1>

      <form
        onSubmit={handleSubmit}
        style={{ display: "flex", flexDirection: "column", gap: "15px" }}
      >
        {/* Patient Dropdown */}
        <div>
          <label style={{ fontWeight: "bold", display: "block", marginBottom: "5px" }}>
            Patient
          </label>
          <select
            name="patientId"
            value={form.patientId}
            onChange={handleChange}
            style={inputStyle}
            required
          >
            <option value="">Select Patient</option>
            {patients.map((p) => (
              <option key={p.id} value={p.id}>
                {p.firstName} {p.lastName} (ID: {p.id})
              </option>
            ))}
          </select>
        </div>

        {/* Encounter Dropdown */}
        <div>
          <label style={{ fontWeight: "bold", display: "block", marginBottom: "5px" }}>
            Encounter
          </label>
          <select
            name="encounterId"
            value={form.encounterId}
            onChange={handleChange}
            style={inputStyle}
            required
          >
            <option value="">Select Encounter</option>
            {encounters.map((e) => (
              <option key={e.id} value={e.id}>
                {e.encounterCode} (ID: {e.id})
              </option>
            ))}
          </select>
        </div>

        {/* Description */}
        <div>
          <label style={{ fontWeight: "bold", display: "block", marginBottom: "5px" }}>
            Description
          </label>
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            style={{ ...inputStyle, height: "120px" }}
            required
          />
        </div>

        {/* Onset Date */}
        <div>
          <label style={{ fontWeight: "bold", display: "block", marginBottom: "5px" }}>
            Onset Date
          </label>
          <input
            name="onsetDate"
            type="date"
            value={form.onsetDate}
            onChange={handleChange}
            style={inputStyle}
          />
        </div>

        {/* Save Button */}
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
          Save Diagnosis
        </button>
      </form>
    </div>
  );
}
