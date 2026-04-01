import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getAllEncounters, deleteEncounter } from "../../api/encounterApi";
import { getAllPatients } from "../../api/patientApi";
import { getAllProviders } from "../../api/providerApi";
import { getAllAppointments } from "../../api/appointmentApi";

export default function EncounterListPage() {
  const [encounters, setEncounters] = useState<any[]>([]);
  const [filtered, setFiltered] = useState<any[]>([]);

  const [patientMap, setPatientMap] = useState<{ [key: number]: string }>({});
  const [providerMap, setProviderMap] = useState<{ [key: number]: string }>({});
  const [appointmentMap, setAppointmentMap] = useState<{ [key: number]: string }>({});

  const [searchField, setSearchField] = useState("patientName");
  const [searchValue, setSearchValue] = useState("");

  const navigate = useNavigate();

  // Fetch encounters + patients + providers + appointments
  const fetchData = async () => {
    try {
      const [encRes, patRes, provRes, appRes] = await Promise.all([
        getAllEncounters(),
        getAllPatients(),
        getAllProviders(),
        getAllAppointments(),
      ]);

      const encountersData = encRes.data;
      setEncounters(encountersData);
      setFiltered(encountersData);

      // Patients map
      const pMap: any = {};
      patRes.forEach((p: any) => {
        const name = `${p.firstName ?? ""} ${p.lastName ?? ""}`.trim();
        pMap[p.id] = name || "Unknown Patient";
      });
      setPatientMap(pMap);

      // Providers map
      const prMap: any = {};
      provRes.forEach((pr: any) => {
        prMap[pr.id] = pr.providerName || "Unknown Provider";
      });
      setProviderMap(prMap);

      // Appointments map (id → code)
      const aMap: any = {};
      appRes.forEach((a: any) => {
        aMap[a.id] = a.appointmentCode || "N/A";
      });
      setAppointmentMap(aMap);

    } catch (err) {
      console.error("Error fetching:", err);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // -----------------------------
  // SEARCH FUNCTION
  // -----------------------------
  const handleSearch = () => {
    if (!searchValue.trim()) {
      setFiltered(encounters);
      return;
    }

    const value = searchValue.toLowerCase();

    const results = encounters.filter((enc: any) => {
      if (searchField === "patientName") {
        return (patientMap[enc.patientId] || "").toLowerCase().includes(value);
      }

      if (searchField === "providerName") {
        return (providerMap[enc.providerId] || "").toLowerCase().includes(value);
      }

      if (searchField === "appointmentCode") {
        return (appointmentMap[enc.appointmentId] || "").toLowerCase().includes(value);
      }

      return String(enc[searchField]).toLowerCase().includes(value);
    });

    setFiltered(results);
  };

  const resetSearch = () => {
    setSearchValue("");
    setFiltered(encounters);
  };

  // Delete encounter
  const handleDelete = async (id: number) => {
    if (!window.confirm("Are you sure you want to delete this encounter?")) return;

    try {
      await deleteEncounter(id);
      alert("Encounter deleted successfully!");
      fetchData();
    } catch (err) {
      console.error("Delete failed:", err);
      alert("Failed to delete encounter");
    }
  };

  // ---- STYLES ----
  const searchBoxStyle: React.CSSProperties = {
    display: "flex",
    gap: "10px",
    marginBottom: "20px",
    background: "#f0f7fb",
    padding: "12px",
    borderRadius: "10px",
    border: "1px solid #cfe4ee",
  };

  const selectStyle: React.CSSProperties = {
    padding: "8px",
    borderRadius: "6px",
    border: "1px solid #b4cfe0",
    background: "#ffffff",
  };

  const inputStyle: React.CSSProperties = {
    flex: 1,
    padding: "8px 12px",
    border: "1px solid #b4cfe0",
    borderRadius: "6px",
    background: "#ffffff",
  };

  const btnStyle: React.CSSProperties = {
    padding: "8px 14px",
    background: "#0284c7",
    color: "white",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
    fontWeight: 600,
  };

  const btnResetStyle: React.CSSProperties = {
    padding: "8px 14px",
    background: "#475569",
    color: "white",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
    fontWeight: 600,
  };

  const tableWrapperStyle: React.CSSProperties = {
    border: "1px solid #d0d7de",
    borderRadius: "8px",
    overflow: "hidden",
  };

  const tableStyle: React.CSSProperties = {
    width: "100%",
    borderCollapse: "collapse",
  };

  const thStyle: React.CSSProperties = {
    background: "#0c4a6e",
    color: "white",
    padding: "10px",
    borderBottom: "1px solid #ffffff",
  };

  const tdStyle: React.CSSProperties = {
    padding: "10px",
    borderBottom: "1px solid #e2e8f0",
  };

  const actionBtnStyle = (bgColor: string): React.CSSProperties => ({
    padding: "4px 8px",
    margin: "0 2px",
    borderRadius: "5px",
    border: "none",
    color: "white",
    background: bgColor,
    cursor: "pointer",
    fontWeight: 600,
  });

  return (
    <div style={{ maxWidth: "1000px", margin: "40px auto" }}>
      <h1 style={{ marginBottom: "20px", color: "#0c4a6e" }}>Encounter List</h1>

      {/* SEARCH BAR */}
      <div style={searchBoxStyle}>
        <select
          style={selectStyle}
          value={searchField}
          onChange={(e) => setSearchField(e.target.value)}
        >
          <option value="patientName">Patient Name</option>
          <option value="providerName">Provider Name</option>
          <option value="appointmentCode">Appointment Code</option>
        </select>

        <input
          style={inputStyle}
          placeholder="Enter search…"
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
        />

        <button style={btnStyle} onClick={handleSearch}>Search</button>
        <button style={btnResetStyle} onClick={resetSearch}>Reset</button>
      </div>

      {/* TABLE */}
      <div style={tableWrapperStyle}>
        <table style={tableStyle}>
          <thead>
            <tr>
              <th style={thStyle}>ID</th>
              <th style={thStyle}>Patient</th>
              <th style={thStyle}>Provider</th>
              <th style={thStyle}>Appointment Code</th>
              <th style={thStyle}>Type</th>
              <th style={thStyle}>Actions</th>
            </tr>
          </thead>

          <tbody>
            {filtered.map((enc: any) => (
              <tr key={enc.id}>
                <td style={tdStyle}>{enc.id}</td>

                <td style={tdStyle}>{patientMap[enc.patientId]}</td>

                <td style={tdStyle}>{providerMap[enc.providerId]}</td>

                <td style={tdStyle}>
                  {appointmentMap[enc.appointmentId] ?? enc.appointmentId}
                </td>

                <td style={tdStyle}>{enc.encounterType}</td>

                <td style={tdStyle}>
                  <button
                    style={actionBtnStyle("#16a34a")}
                    onClick={() => navigate(`/clinicalrecords/encounters/view/${enc.id}`)}
                  >
                    View
                  </button>

                  <button
                    style={actionBtnStyle("#2563eb")}
                    onClick={() => navigate(`/clinicalrecords/encounters/edit/${enc.id}`)}
                  >
                    Edit
                  </button>

                  <button
                    style={actionBtnStyle("#dc2626")}
                    onClick={() => handleDelete(enc.id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}

            {filtered.length === 0 && (
              <tr>
                <td style={tdStyle} colSpan={6} align="center">
                  No results found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Create Button */}
      <div style={{ marginTop: "20px", textAlign: "right" }}>
        <button
          style={{ ...btnStyle, padding: "10px 16px" }}
          onClick={() => navigate("/clinicalrecords/encounters/new")}
        >
          Create Encounter
        </button>
      </div>
    </div>
  );
}
