import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getAllDiagnosis, deleteDiagnosis } from "../../api/diagnosisApi";
import { getAllPatients } from "../../api/patientApi";
import { getAllEncounters } from "../../api/encounterApi";

import type { DiagnosisResponse } from "../../types/Diagnosis";
import type { PatientResponse } from "../../types/Patient";

export default function DiagnosisListPage() {
  const [diagnoses, setDiagnoses] = useState<DiagnosisResponse[]>([]);
  const [patients, setPatients] = useState<PatientResponse[]>([]);
  const [encounters, setEncounters] = useState<any[]>([]);
  const [search, setSearch] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    fetchDiagnoses();
    fetchPatients();
    fetchEncounters();
  }, []);

  const fetchDiagnoses = async () => {
    try {
      const res = await getAllDiagnosis();
      setDiagnoses(res.data);
    } catch (err) {
      console.error("Failed to fetch diagnoses:", err);
    }
  };

  const fetchPatients = async () => {
    try {
      const res = await getAllPatients();
      setPatients(res);
    } catch (err) {
      console.error("Failed to fetch patients:", err);
    }
  };

  const fetchEncounters = async () => {
    try {
      const res = await getAllEncounters();
      setEncounters(res.data);
    } catch (err) {
      console.error("Failed to fetch encounters:", err);
    }
  };

  // Map patientId → full name
  const patientNameMap = patients.reduce((map, p) => {
    map[p.id] = `${p.firstName || ""} ${p.lastName || ""}`.trim();
    return map;
  }, {} as Record<number, string>);

  // Map encounterId → encounterCode
  const encounterCodeMap = encounters.reduce((map, e) => {
    map[e.id] = e.encounterCode || `Encounter-${e.id}`;
    return map;
  }, {} as Record<number, string>);

  const handleDelete = async (id: number) => {
    if (!window.confirm("Are you sure you want to delete this diagnosis?")) return;

    try {
      await deleteDiagnosis(id);
      setDiagnoses((prev) => prev.filter((d) => d.id !== id));
      alert("Diagnosis deleted successfully!");
    } catch (err) {
      console.error("Failed to delete diagnosis:", err);
      alert("Failed to delete diagnosis. Check console for details.");
    }
  };

  // Search by → code, description, patientName
  const filteredDiagnoses = diagnoses.filter((d) => {
    const patientName = patientNameMap[d.patientId]?.toLowerCase() || "";
    const query = search.toLowerCase();

    return (
      d.code.toLowerCase().includes(query) ||
      d.description.toLowerCase().includes(query) ||
      patientName.includes(query)
    );
  });

  const styles: { [key: string]: React.CSSProperties } = {
    container: { padding: "20px", minHeight: "100vh", background: "#f9f9f9" },
    header: { fontSize: "1.5rem", fontWeight: 600, marginBottom: "20px" },
    search: {
      padding: "10px",
      borderRadius: "6px",
      border: "1px solid #ccc",
      width: "300px",
      marginBottom: "20px",
      fontSize: "16px",
    },
    createBtn: {
      padding: "10px 18px",
      backgroundColor: "#16a34a",
      color: "#fff",
      border: "none",
      borderRadius: "6px",
      cursor: "pointer",
      fontSize: "16px",
      marginBottom: "20px",
    },
    table: {
      width: "100%",
      borderCollapse: "collapse",
      background: "#fff",
      borderRadius: "8px",
      overflow: "hidden",
      boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
    },
    th: {
      border: "1px solid #ddd",
      padding: "10px",
      textAlign: "left" as const,
      backgroundColor: "#f3f4f6",
    },
    td: {
      border: "1px solid #ddd",
      padding: "10px",
      textAlign: "left" as const,
    },
    btn: {
      padding: "6px 12px",
      backgroundColor: "#2563eb",
      color: "#fff",
      border: "none",
      borderRadius: "4px",
      cursor: "pointer",
      marginRight: "5px",
      fontSize: "14px",
    },
    deleteBtn: {
      padding: "6px 12px",
      backgroundColor: "#dc2626",
      color: "#fff",
      border: "none",
      borderRadius: "4px",
      cursor: "pointer",
      fontSize: "14px",
    },
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.header}>Diagnosis Records</h2>

      <button
        style={styles.createBtn}
        onClick={() => navigate("/clinicalrecords/diagnosis/new")}
      >
        Create Diagnosis
      </button>

      <input
        type="text"
        placeholder="Search by code, description, or patient name"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        style={styles.search}
      />

      <table style={styles.table}>
        <thead>
          <tr>
            <th style={styles.th}>ID</th>
            <th style={styles.th}>Patient</th>
            <th style={styles.th}>Encounter</th>
            <th style={styles.th}>Code</th>
            <th style={styles.th}>Description</th>
            <th style={styles.th}>Onset Date</th>
            <th style={styles.th}>Status</th>
            <th style={styles.th}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredDiagnoses.map((d) => (
            <tr key={d.id}>
              <td style={styles.td}>{d.id}</td>
              <td style={styles.td}>
                {patientNameMap[d.patientId] || "Unknown"}
              </td>

              {/* Show encounter code safely */}
              <td style={styles.td}>
                {d.encounterId != null
                  ? encounterCodeMap[d.encounterId] || d.encounterId
                  : "-"}
              </td>

              <td style={styles.td}>{d.code}</td>
              <td style={styles.td}>{d.description}</td>
              <td style={styles.td}>{d.onsetDate || "-"}</td>
              <td style={styles.td}>{d.status}</td>

              <td style={styles.td}>
                <button
                  style={styles.btn}
                  onClick={() => navigate(`/clinicalrecords/diagnosis/${d.id}`)}
                >
                  View
                </button>
                <button
                  style={styles.btn}
                  onClick={() => navigate(`/clinicalrecords/diagnosis/${d.id}/edit`)}
                >
                  Edit
                </button>
                <button
                  style={styles.deleteBtn}
                  onClick={() => handleDelete(d.id)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
