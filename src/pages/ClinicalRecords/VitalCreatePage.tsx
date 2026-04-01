// src/pages/Vitals/VitalCreatePage.tsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { createVital } from "../../api/vitalApi";
import { getAllPatients } from "../../api/patientApi";
import { getAllEncounters } from "../../api/encounterApi";
import { getAllUsers } from "../../api/userApi";
import type { VitalRequest } from "../../types/Vital";

export default function VitalCreatePage() {
  const navigate = useNavigate();

  const [patients, setPatients] = useState<any[]>([]);
  const [encounters, setEncounters] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);

  const [form, setForm] = useState<VitalRequest>({
    patientId: 0,
    encounterId: 0,
    type: "",
    value: "",
    unit: "",
    measuredAt: new Date().toISOString(),
    recordedBy: 0,
  });

  // ----------- Load Dropdown Data ------------
  useEffect(() => {
    const loadData = async () => {
      try {
        const token = localStorage.getItem("authToken") || "";

        const p = await getAllPatients();
        const e = await getAllEncounters();
        const u = await getAllUsers(token);

        setPatients(p);
        setEncounters(e.data);
        setUsers(u);
      } catch (err) {
        console.error("Error loading dropdown data", err);
      }
    };

    loadData();
  }, []);

  // ----------- Handle Input Change ----------
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const value =
      e.target.name === "patientId" || e.target.name === "encounterId"
        ? Number(e.target.value)
        : e.target.value;
    setForm({ ...form, [e.target.name]: value });
  };

  // ----------- Handle Submit ----------
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createVital(form);
      navigate("/clinicalrecords/vitals");
    } catch (err) {
      console.error("Error creating vital", err);
    }
  };

  return (
    <div>
      <h3>Create Vital</h3>
      <form onSubmit={handleSubmit}>

        {/* Patient Dropdown */}
        <label>Patient</label>
        <select
          name="patientId"
          value={form.patientId}
          onChange={handleChange}
          className="form-control mb-2"
        >
          <option value={0}>Select Patient</option>
          {patients.map((p) => (
            <option key={p.id} value={p.id}>
              {p.firstName} {p.lastName} (ID: {p.id})
            </option>
          ))}
        </select>

        {/* Encounter Dropdown */}
        <label>Encounter</label>
        <select
          name="encounterId"
          value={form.encounterId}
          onChange={handleChange}
          className="form-control mb-2"
        >
          <option value={0}>Select Encounter</option>
          {encounters.map((e) => (
            <option key={e.id} value={e.id}>
              {e.encounterCode || `Encounter-${e.id}`} (ID: {e.id})
            </option>
          ))}
        </select>

        {/* Vital Type */}
        <label>Vital Type</label>
        <input
          type="text"
          name="type"
          placeholder="Enter Vital Type"
          value={form.type}
          onChange={handleChange}
          className="form-control mb-2"
        />

        {/* Value */}
        <label>Value</label>
        <input
          type="text"
          name="value"
          placeholder="Enter Value (e.g., 120/80)"
          value={form.value}
          onChange={handleChange}
          className="form-control mb-2"
        />

        {/* Unit */}
        <label>Unit</label>
        <input
          type="text"
          name="unit"
          placeholder="Enter Unit"
          value={form.unit}
          onChange={handleChange}
          className="form-control mb-2"
        />

        {/* Measured At */}
        <label>Measured At</label>
        <input
          type="datetime-local"
          name="measuredAt"
          value={form.measuredAt.slice(0, 16)}
          onChange={handleChange}
          className="form-control mb-2"
        />

        {/* Recorded By Dropdown */}
        <label>Recorded By (User)</label>
        <select
          name="recordedBy"
          value={form.recordedBy}
          onChange={(e) =>
            setForm({ ...form, recordedBy: Number(e.target.value) })
          }
          className="form-control mb-2"
        >
          <option value={0}>Select User</option>
          {users.map((u) => (
            <option key={u.userId} value={u.userId}>
              {u.firstName} {u.lastName} (ID: {u.userId})
            </option>
          ))}
        </select>

        <button type="submit" className="btn btn-primary">
          Save
        </button>
      </form>
    </div>
  );
}
