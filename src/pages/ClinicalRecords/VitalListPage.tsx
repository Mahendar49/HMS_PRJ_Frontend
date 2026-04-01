// src/pages/Vitals/VitalListPage.tsx
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getAllVitals, deleteVital } from "../../api/vitalApi";
import { getAllPatients } from "../../api/patientApi";
import { getAllUsers } from "../../api/userApi"; 
import { getAllEncounters } from "../../api/encounterApi";
import type { VitalResponse } from "../../types/Vital";
import type { PatientResponse } from "../../types/Patient";
import type { UserResponse } from "../../types/user";

export default function VitalListPage() {
  const [vitals, setVitals] = useState<VitalResponse[]>([]);
  const [patients, setPatients] = useState<PatientResponse[]>([]);
  const [users, setUsers] = useState<UserResponse[]>([]);
  const [encounters, setEncounters] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchVitals();
    fetchPatients();
    fetchUsers();
    fetchEncounters();
  }, []);

  const fetchVitals = async () => {
    try {
      const res = await getAllVitals();
      setVitals(res.data);
    } catch (err) {
      console.error("Error fetching vitals", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchPatients = async () => {
    try {
      const res = await getAllPatients();
      setPatients(res);
    } catch (err) {
      console.error("Error fetching patients", err);
    }
  };

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem("authToken");
      if (!token) return;
      const res = await getAllUsers(token);
      setUsers(res.data ?? res);
    } catch (err) {
      console.error("Error fetching users", err);
    }
  };

  const fetchEncounters = async () => {
    try {
      const res = await getAllEncounters();
      setEncounters(res.data);
    } catch (err) {
      console.error("Error fetching encounters", err);
    }
  };

  // Patient ID → Full Name
  const patientMap = patients.reduce((map, p) => {
    map[p.id] = `${p.firstName} ${p.lastName}`.trim();
    return map;
  }, {} as Record<number, string>);

  // User ID → Full Name
  const userMap = users.reduce((map, u) => {
    const full = `${u.firstName ?? ""} ${u.lastName ?? ""}`.trim();
    map[u.userId] = full || "Unknown User";
    return map;
  }, {} as Record<number, string>);

  // Encounter ID → Encounter Code
  const encounterMap = encounters.reduce((map, e) => {
    map[e.id] = e.encounterCode || `Encounter-${e.id}`;
    return map;
  }, {} as Record<number, string>);

  // ----------- Filter based on search -----------
  const filteredVitals = vitals.filter((v) => {
    const patientName = patientMap[v.patientId]?.toLowerCase() || "";
    const recordedByName = userMap[v.recordedBy]?.toLowerCase() || "";
    const encounterCode = encounterMap[v.encounterId]?.toLowerCase() || "";
    const query = searchTerm.toLowerCase();

    return (
      `${v.patientId} ${v.encounterId} ${v.type} ${v.recordedBy}`
        .toLowerCase()
        .includes(query) ||
      patientName.includes(query) ||
      recordedByName.includes(query) ||
      encounterCode.includes(query)
    );
  });

  const handleDelete = async (id: number) => {
    if (window.confirm("Are you sure to delete this vital record?")) {
      try {
        await deleteVital(id);
        fetchVitals();
      } catch (err) {
        console.error("Error deleting vital", err);
      }
    }
  };

  if (loading) return <p>Loading vitals...</p>;

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h3>Vitals</h3>
        <Link className="btn btn-primary" to="/clinicalrecords/vitals/new">
          Add Vital
        </Link>
      </div>

      {/* Search Bar */}
      <input
        type="text"
        placeholder="Search by Patient Name, Encounter, Type, Recorded By..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="form-control mb-3"
      />

      <table className="table table-striped">
        <thead>
          <tr>
            <th>ID</th>
            <th>Patient</th>
            <th>Encounter</th>
            <th>Type</th>
            <th>Value</th>
            <th>Unit</th>
            <th>Measured At</th>
            <th>Recorded By</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredVitals.map((v) => (
            <tr key={v.id}>
              <td>{v.id}</td>

              {/* Show Patient Name */}
              <td>{patientMap[v.patientId] || `ID: ${v.patientId}`}</td>

              {/* Show Encounter Code */}
              <td>{encounterMap[v.encounterId] || `ID: ${v.encounterId}`}</td>

              <td>{v.type}</td>
              <td>{v.value}</td>
              <td>{v.unit}</td>
              <td>{new Date(v.measuredAt).toLocaleString()}</td>

              {/* Show User Name */}
              <td>{userMap[v.recordedBy] || `ID: ${v.recordedBy}`}</td>

              <td>
                <Link
                  className="btn btn-sm btn-info me-1"
                  to={`/clinicalrecords/vitals/view/${v.id}`}
                >
                  View
                </Link>
                <Link
                  className="btn btn-sm btn-warning me-1"
                  to={`/clinicalrecords/vitals/edit/${v.id}`}
                >
                  Edit
                </Link>
                <button
                  className="btn btn-sm btn-danger"
                  onClick={() => handleDelete(v.id)}
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
