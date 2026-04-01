// src/pages/ProcedureLog/ProcedureLogEditPage.tsx
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  getProcedureLogById,
  updateProcedureLog,
} from "../../api/procedureLogApi";
import { getAllPatients } from "../../api/patientApi";
import { getAllEncounters } from "../../api/encounterApi";
import { getAllUsers } from "../../api/userApi";
import type { ProcedureLogRequest } from "../../types/ProcedureLog";

export default function ProcedureLogEditPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const token = localStorage.getItem("authToken");

  const [patients, setPatients] = useState<any[]>([]);
  const [encounters, setEncounters] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [form, setForm] = useState<Partial<ProcedureLogRequest>>({});

  useEffect(() => {
    const loadData = async () => {
      try {
        await Promise.all([fetchPatients(), fetchEncounters(), fetchUsers()]);
        if (id) fetchProcedureLog(parseInt(id));
      } catch (err) {
        console.error("Error loading initial data", err);
      }
    };
    loadData();
  }, [id]);

  const fetchPatients = async () => {
    try {
      const res = await getAllPatients();
      setPatients(res);
    } catch (err) {
      console.error("Error fetching patients", err);
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

  const fetchUsers = async () => {
    try {
      if (!token) return;
      const res = await getAllUsers(token);

      const sorted = res.sort((a: any, b: any) =>
        (a.firstName || "").localeCompare(b.firstName || "")
      );

      setUsers(sorted);
    } catch (err) {
      console.error("Error fetching users", err);
    }
  };

  const fetchProcedureLog = async (plId: number) => {
    try {
      const res = await getProcedureLogById(plId);

      const fixed = {
        ...res.data,
        performedBy: Number(res.data.performedBy) || 0,
      };

      setForm(fixed);
    } catch (err) {
      console.error("Error fetching procedure log", err);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const name = e.target.name;
    let value: any = e.target.value;

    if (
      name === "performedBy" ||
      name === "patientId" ||
      name === "encounterId"
    ) {
      value = value === "" ? 0 : Number(value);
    }

    setForm({ ...form, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (id) {
        await updateProcedureLog(parseInt(id), {
          ...form,
          performedBy: Number(form.performedBy),
        } as ProcedureLogRequest);
      }
      navigate("/clinicalrecords/procedure-logs");
    } catch (err) {
      console.error("Error updating procedure log", err);
    }
  };

  return (
    <div>
      <h3>Edit Procedure Log</h3>
      <form onSubmit={handleSubmit}>
        
        {/* Patient */}
        <label>Patient</label>
        <select
          name="patientId"
          value={form.patientId || 0}
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

        {/* Encounter */}
        <label>Encounter</label>
        <select
          name="encounterId"
          value={form.encounterId || 0}
          onChange={handleChange}
          className="form-control mb-2"
        >
          <option value={0}>Select Encounter</option>
          {encounters.map((e) => (
            <option key={e.id} value={e.id}>
              {e.encounterCode} - {e.encounterType} (ID: {e.id})
            </option>
          ))}
        </select>

        {/* Procedure Code */}
        <label>Procedure Code</label>
        <input
          type="text"
          name="code"
          value={form.code || ""}
          onChange={handleChange}
          className="form-control mb-2"
        />

        {/* Description */}
        <label>Description</label>
        <textarea
          name="description"
          value={form.description || ""}
          onChange={handleChange}
          className="form-control mb-2"
        />

        {/* Performed At */}
        <label>Performed At</label>
        <input
          type="datetime-local"
          name="performedAt"
          value={form.performedAt?.slice(0, 16) || ""}
          onChange={handleChange}
          className="form-control mb-2"
        />

        {/* Performed By */}
        <label>Performed By</label>
        <select
          name="performedBy"
          value={form.performedBy || 0}
          onChange={handleChange}
          className="form-control mb-3"
        >
          <option value={0}>Select User</option>

          {users.map((u) => (
            <option
              key={u.id ?? u.userId}
              value={u.id ?? u.userId}
            >
              {(u.firstName || "") + " " + (u.lastName || "")} (ID: {u.id ?? u.userId})
            </option>
          ))}

        </select>

        <button type="submit" className="btn btn-primary">
          Update
        </button>
      </form>
    </div>
  );
}
