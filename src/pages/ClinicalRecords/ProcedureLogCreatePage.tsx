// src/pages/ProcedureLog/ProcedureLogCreatePage.tsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { createProcedureLog } from "../../api/procedureLogApi";
import { getAllPatients } from "../../api/patientApi";
import { getAllEncounters } from "../../api/encounterApi";
import { getAllUsers } from "../../api/userApi";

import type { ProcedureLogRequest } from "../../types/ProcedureLog";

export default function ProcedureLogCreatePage() {
  const navigate = useNavigate();

  const loggedInUserId = Number(localStorage.getItem("userId"));
  const token = localStorage.getItem("authToken");

  const [patients, setPatients] = useState<any[]>([]);
  const [encounters, setEncounters] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);

  const [form, setForm] = useState<ProcedureLogRequest>({
    patientId: 0,
    encounterId: 0,
    code: "", // ✓ will be ignored because backend generates automatically
    description: "",
    performedAt: new Date().toISOString(),
    performedBy: loggedInUserId
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const p = await getAllPatients();
    const e = await getAllEncounters();

    let u: any[] = [];
    if (token) {
      u = await getAllUsers(token);
    }

    setPatients(p);
    setEncounters(e.data);
    setUsers(u);
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const payload = { ...form, code: "" }; // ensure no code sent
      await createProcedureLog(payload);
      navigate("/clinicalrecords/procedure-logs");
    } catch (err) {
      console.error("Error creating procedure log", err);
    }
  };

  return (
    <div>
      <h3>Create Procedure Log</h3>
      <form onSubmit={handleSubmit}>
        
        {/* Patient Dropdown */}
        <label className="form-label">Patient</label>
        <select
          name="patientId"
          value={form.patientId}
          onChange={handleChange}
          className="form-control mb-2"
        >
          <option value="">-- Select Patient --</option>
          {patients.map((p) => (
            <option key={p.id} value={p.id}>
              {p.firstName} {p.lastName} (ID: {p.id})
            </option>
          ))}
        </select>

        {/* Encounter Dropdown WITH Encounter Code */}
        <label className="form-label">Encounter</label>
        <select
          name="encounterId"
          value={form.encounterId}
          onChange={handleChange}
          className="form-control mb-2"
        >
          <option value="">-- Select Encounter --</option>
          {encounters.map((e) => (
            <option key={e.id} value={e.id}>
              {e.encounterCode} – {e.encounterType} – {e.startTime?.slice(0, 10)} (ID: {e.id})
            </option>
          ))}
        </select>

        {/* Removed Procedure Code Input */}

        {/* Description */}
        <label className="form-label">Description</label>
        <textarea
          name="description"
          placeholder="Description"
          value={form.description}
          onChange={handleChange}
          className="form-control mb-2"
        />

        {/* Performed At */}
        <label className="form-label">Performed At</label>
        <input
          type="datetime-local"
          name="performedAt"
          value={form.performedAt.slice(0, 16)}
          onChange={handleChange}
          className="form-control mb-2"
        />

        {/* Recorded By */}
        <label className="form-label">Recorded By</label>
        <select
          name="performedBy"
          value={form.performedBy}
          onChange={handleChange}
          className="form-control mb-2"
        >
          <option value="">-- Select User --</option>
          {users.map((u) => (
            <option key={u.id ?? u.userId} value={u.id ?? u.userId}>
              {(u.firstName || "") + " " + (u.lastName || "")} (ID: {u.userId})
            </option>
          ))}
        </select>

        <button type="submit" className="btn btn-primary">
          Create
        </button>
      </form>
    </div>
  );
}
