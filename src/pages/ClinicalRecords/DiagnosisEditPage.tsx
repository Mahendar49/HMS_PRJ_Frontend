import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getDiagnosisById, updateDiagnosis } from "../../api/diagnosisApi";
import { getAllPatients } from "../../api/patientApi";
import { getAllEncounters } from "../../api/encounterApi";
import type { DiagnosisResponse, DiagnosisUpdateRequest } from "../../types/Diagnosis";
import type { PatientResponse } from "../../types/Patient";
import type { EncounterResponse } from "../../types/Encounter";

export default function DiagnosisEditPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [patients, setPatients] = useState<PatientResponse[]>([]);
  const [encounters, setEncounters] = useState<EncounterResponse[]>([]);

  const [form, setForm] = useState<DiagnosisUpdateRequest>({
    patientId: 0,
    encounterId: 0,
    code: "",
    description: "",
    onsetDate: "",
    status: "active",
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) loadData();
  }, [id]);

  const loadData = async () => {
    try {
      const [patientsRes, encountersRes, diagnosisRes] = await Promise.all([
        getAllPatients(),
        getAllEncounters(),
        getDiagnosisById(Number(id)),
      ]);

      setPatients(patientsRes || []);
      setEncounters(encountersRes.data || []);

      const d: DiagnosisResponse = diagnosisRes.data;

      setForm({
        patientId: d.patientId,
        encounterId: d.encounterId ?? 0,
        code: d.code,
        description: d.description,
        onsetDate: d.onsetDate || "",
        status: d.status as "active" | "resolved" | "chronic" | "historical",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setForm({
      ...form,
      [name]: name === "patientId" || name === "encounterId" ? Number(value) : value,
    });
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await updateDiagnosis(Number(id), form);
      alert("Diagnosis updated successfully!");
      navigate("/clinicalrecords/diagnosis");
    } catch (err) {
      alert("Failed to update diagnosis.");
      console.error(err);
    }
  };

  if (loading) return <p style={{ textAlign: "center" }}>Loading...</p>;

  const styles = {
    container: { padding: "30px", background: "#eef2f7", minHeight: "100vh" },
    header: { marginBottom: "20px", fontSize: "1.8rem", fontWeight: "700", color: "#1e3a8a", textAlign: "center" as const },
    card: { background: "#ffffff", padding: "25px", borderRadius: "10px", boxShadow: "0px 4px 20px rgba(0,0,0,0.1)", maxWidth: "650px", margin: "0 auto" },
    formGroup: { display: "flex", flexDirection: "column" as const, marginBottom: "15px" },
    label: { marginBottom: "6px", fontWeight: 600, color: "#374151" },
    input: { padding: "10px 12px", borderRadius: "6px", border: "1px solid #9ca3af", fontSize: "1rem", background: "#f9fafb" },
    textarea: { padding: "10px 12px", borderRadius: "6px", border: "1px solid #9ca3af", minHeight: "100px", fontSize: "1rem", background: "#f9fafb" },
    select: { padding: "10px 12px", borderRadius: "6px", border: "1px solid #9ca3af", fontSize: "1rem", background: "#f9fafb" },
    btn: { padding: "12px 20px", backgroundColor: "#1d4ed8", color: "white", border: "none", borderRadius: "8px", cursor: "pointer", fontSize: "1rem", marginTop: "15px", width: "100%" },
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.header}>Edit Diagnosis</h2>

      <form style={styles.card} onSubmit={handleUpdate}>
        {/* Patient Dropdown */}
        <div style={styles.formGroup}>
          <label style={styles.label}>Patient</label>
          <select
            name="patientId"
            value={form.patientId}
            onChange={handleChange}
            style={styles.select}
            required
          >
            <option value="">Select Patient</option>
            {patients.map((p) => (
              <option key={p.id} value={p.id}>
                {p.firstName} {p.lastName} ({p.mrn})
              </option>
            ))}
          </select>
        </div>

        {/* Encounter Dropdown */}
        <div style={styles.formGroup}>
          <label style={styles.label}>Encounter</label>
          <select
            name="encounterId"
            value={form.encounterId}
            onChange={handleChange}
            style={styles.select}
            required
          >
            <option value="">Select Encounter</option>
            {encounters.map((e) => (
              <option key={e.id} value={e.id}>
                {e.encounterCode || `Encounter-${e.id}`} ({e.id})
              </option>
            ))}
          </select>
        </div>

        {/* Code */}
        <div style={styles.formGroup}>
          <label style={styles.label}>Diagnosis Code</label>
          <input
            name="code"
            type="text"
            value={form.code}
            onChange={handleChange}
            style={styles.input}
            required
          />
        </div>

        {/* Description */}
        <div style={styles.formGroup}>
          <label style={styles.label}>Description</label>
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            style={styles.textarea}
            required
          />
        </div>

        {/* Onset Date */}
        <div style={styles.formGroup}>
          <label style={styles.label}>Onset Date</label>
          <input
            name="onsetDate"
            type="date"
            value={form.onsetDate}
            onChange={handleChange}
            style={styles.input}
          />
        </div>

        {/* Status */}
        <div style={styles.formGroup}>
          <label style={styles.label}>Status</label>
          <select name="status" value={form.status} onChange={handleChange} style={styles.select}>
            <option value="active">Active</option>
            <option value="resolved">Resolved</option>
            <option value="chronic">Chronic</option>
            <option value="historical">Historical</option>
          </select>
        </div>

        <button type="submit" style={styles.btn}>
          Update Diagnosis
        </button>
      </form>
    </div>
  );
}
