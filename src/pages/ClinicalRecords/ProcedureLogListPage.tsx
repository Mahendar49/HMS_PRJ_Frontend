// src/pages/ProcedureLog/ProcedureLogListPage.tsx
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  getAllProcedureLogs,
  deleteProcedureLog,
} from "../../api/procedureLogApi";
import { getAllPatients } from "../../api/patientApi";
import { getAllUsers } from "../../api/userApi";
import { getAllEncounters } from "../../api/encounterApi";
import type { ProcedureLogResponse } from "../../types/ProcedureLog";

export default function ProcedureLogListPage() {
  const [procedureLogs, setProcedureLogs] = useState<ProcedureLogResponse[]>([]);
  const [searchTerm, setSearchTerm] = useState("");

  const [patientsMap, setPatientsMap] = useState<Record<number, string>>({});
  const [usersMap, setUsersMap] = useState<Record<number, string>>({});
  const [encounterMap, setEncounterMap] = useState<Record<number, string>>({}); // ✅ NEW

  const token = localStorage.getItem("authToken");

  const fetchProcedureLogs = async () => {
    try {
      const res = await getAllProcedureLogs();
      setProcedureLogs(res.data);
    } catch (err) {
      console.error("Error fetching procedure logs", err);
    }
  };

  const fetchPatients = async () => {
    try {
      const res = await getAllPatients();

      const mapping: Record<number, string> = {};
      res.forEach((p: any) => {
        const name =
          p.firstName && p.lastName
            ? `${p.firstName} ${p.lastName}`
            : p.name || "Unknown";
        mapping[p.id] = name;
      });

      setPatientsMap(mapping);
    } catch (err) {
      console.error("Error fetching patients", err);
    }
  };

  const fetchUsers = async () => {
    try {
      if (!token) {
        console.error("No auth token found");
        return;
      }

      const res = await getAllUsers(token);

      const mapping: Record<number, string> = {};
      res.forEach((u: any) => {
        const id = u.id ?? u.userId;
        const name =
          u.firstName && u.lastName
            ? `${u.firstName} ${u.lastName}`
            : u.username || "Unknown User";

        mapping[id] = name;
      });

      setUsersMap(mapping);
    } catch (err) {
      console.error("Error fetching users", err);
    }
  };

  // ✅ NEW: Fetch Encounter Code mapping
  const fetchEncounters = async () => {
    try {
      const res = await getAllEncounters();

      const mapping: Record<number, string> = {};
      res.data.forEach((e: any) => {
        mapping[e.id] = e.encounterCode; // store encounterCode
      });

      setEncounterMap(mapping);
    } catch (err) {
      console.error("Error fetching encounters", err);
    }
  };

  const handleDelete = async (id: number) => {
    if (window.confirm("Are you sure you want to delete this record?")) {
      try {
        await deleteProcedureLog(id);
        fetchProcedureLogs();
      } catch (err) {
        console.error("Error deleting procedure log", err);
      }
    }
  };

  useEffect(() => {
    fetchProcedureLogs();
    fetchPatients();
    fetchUsers();
    fetchEncounters(); // ✅ NEW
  }, []);

  // Search by patient name, code, description, encounter code
  const filteredLogs = procedureLogs.filter((pl) => {
    const patientName = (patientsMap[pl.patientId] || "").toLowerCase();
    const encounterCode = (encounterMap[pl.encounterId] || "").toLowerCase();
    const search = searchTerm.toLowerCase();

    return (
      pl.code.toLowerCase().includes(search) ||
      pl.description.toLowerCase().includes(search) ||
      patientName.includes(search) ||
      encounterCode.includes(search) || // ✅ search by encounter code also
      pl.encounterId.toString().includes(search)
    );
  });

  return (
    <div>
      <h3>Procedure Logs</h3>

      <div className="d-flex justify-content-between align-items-center mb-2">
        <Link
          to="/clinicalrecords/procedure-logs/new"
          className="btn btn-primary"
        >
          Create Procedure Log
        </Link>

        {/* Search Bar */}
        <input
          type="text"
          placeholder="Search by Patient, Code, Description, Encounter..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="form-control w-50"
        />
      </div>

      <table className="table table-striped">
        <thead>
          <tr>
            <th>ID</th>
            <th>Patient</th>
            <th>Encounter</th> {/* changed label */}
            <th>Code</th>
            <th>Description</th>
            <th>Performed At</th>
            <th>Performed By</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredLogs.map((pl) => (
            <tr key={pl.id}>
              <td>{pl.id}</td>

              {/* Patient Name */}
              <td>{patientsMap[pl.patientId] || pl.patientId}</td>

              {/* Encounter Code Instead of ID */}
              <td>{encounterMap[pl.encounterId] || pl.encounterId}</td>

              <td>{pl.code}</td>
              <td>{pl.description}</td>
              <td>{pl.performedAt}</td>

              {/* User Name */}
              <td>{usersMap[pl.performedBy] || pl.performedBy}</td>

              <td>
                <Link
                  to={`/clinicalrecords/procedure-logs/view/${pl.id}`}
                  className="btn btn-sm btn-info me-1"
                >
                  View
                </Link>
                <Link
                  to={`/clinicalrecords/procedure-logs/edit/${pl.id}`}
                  className="btn btn-sm btn-warning me-1"
                >
                  Edit
                </Link>
                <button
                  className="btn btn-sm btn-danger"
                  onClick={() => handleDelete(pl.id)}
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
