// src/pages/Appointment/AppointmentListPage.tsx

import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  getAllAppointments,
  deleteAppointment, // <-- new API function
} from "../../api/appointmentApi";

import { getPatientById } from "../../api/patientApi";
import { getProviderById } from "../../api/providerApi";

import type { AppointmentResponse } from "../../types/Appointment";

import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";

const STATUS_OPTIONS = [
  { value: "all", label: "All statuses" },
  { value: "pending", label: "Pending" },
  { value: "confirmed", label: "Confirmed" },
  { value: "checked_in", label: "Checked-In" },
  { value: "in_progress", label: "In Progress" },
  { value: "completed", label: "Completed" },
  { value: "cancelled", label: "Cancelled" },
  { value: "no_show", label: "No Show" },
];

function formatDateTime(v?: string | null): string {
  if (!v) return "";
  const d = new Date(v);
  return isNaN(d.getTime()) ? v.replace("T", " ") : d.toLocaleString();
}

function getStatusBadgeClass(status: string): string {
  switch (status) {
    case "confirmed":
      return "badge rounded-pill bg-success";
    case "pending":
      return "badge rounded-pill bg-warning text-dark";
    case "cancelled":
      return "badge rounded-pill bg-secondary";
    case "completed":
      return "badge rounded-pill bg-primary";
    case "checked_in":
    case "in_progress":
      return "badge rounded-pill bg-info text-dark";
    case "no_show":
      return "badge rounded-pill bg-danger";
    default:
      return "badge rounded-pill bg-light text-dark border";
  }
}

const AppointmentListPage: React.FC = () => {
  const [appointments, setAppointments] = useState<AppointmentResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [onlyToday, setOnlyToday] = useState(false);
  const [exporting, setExporting] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    try {
      setLoading(true);

      const data = await getAllAppointments();

      const mapped = data.map((a: any) => ({
        ...a,
        patientId: a.patientId ?? a.patient_id ?? null,
        providerId: a.providerId ?? a.provider_id ?? null,
        organizationId: a.organizationId ?? a.organization_id ?? a.orgId ?? null,
        patientName: "-",
        providerName: "-",
      }));

      const patientIds = [...new Set(mapped.map((a) => a.patientId).filter(Boolean))];
      const providerIds = [...new Set(mapped.map((a) => a.providerId).filter(Boolean))];

      const patientNameMap: Record<number, string> = {};
      for (const id of patientIds) {
        try {
          const p = await getPatientById(id);
          patientNameMap[id] = `${p.firstName} ${p.lastName}`;
        } catch {
          patientNameMap[id] = "-";
        }
      }

      const providerNameMap: Record<number, string> = {};
      for (const id of providerIds) {
        try {
          const pr = await getProviderById(id);
          providerNameMap[id] = pr.providerName;
        } catch {
          providerNameMap[id] = "-";
        }
      }

      const finalList = mapped.map((a) => ({
        ...a,
        patientName: patientNameMap[a.patientId] || "-",
        providerName: providerNameMap[a.providerId] || "-",
      }));

      setAppointments(finalList);
      setError(null);
    } catch (err: any) {
      setError(err?.message || "Failed to load appointments");
    } finally {
      setLoading(false);
    }
  }

  // ---------------------------------------------------
  // DELETE APPOINTMENT
  // ---------------------------------------------------
  async function handleDelete(id: number) {
    if (!window.confirm("Are you sure you want to delete this appointment?")) return;

    try {
      await deleteAppointment(id); // call backend API to delete
      setAppointments((list) => list.filter((a) => a.id !== id));
      alert("Appointment deleted successfully!");
    } catch (err: any) {
      alert(err?.message || "Failed to delete appointment");
    }
  }

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    const today = new Date().toISOString().slice(0, 10);

    return appointments.filter((a) => {
      if (statusFilter !== "all" && a.status !== statusFilter) return false;

      if (onlyToday && a.scheduledStart) {
        if (a.scheduledStart.slice(0, 10) !== today) return false;
      }

      if (!q) return true;

      return (
        String(a.id).includes(q) ||
        (a.patientName || "").toLowerCase().includes(q) ||
        (a.providerName || "").toLowerCase().includes(q) ||
        (a.reason || "").toLowerCase().includes(q)
      );
    });
  }, [appointments, search, statusFilter, onlyToday]);

  function handleExportPdf() {
    try {
      setExporting(true);

      const doc = new jsPDF();

      const tableColumn = [
        "ID",
        "Patient Name",
        "Provider Name",
        "Organization ID",
        "Start",
        "End",
        "Status",
        "Visit",
        "Reason",
      ];

      const rows: any[] = [];

      filtered.forEach((a) => {
        rows.push([
          a.id,
          a.patientName,
          a.providerName,
          a.organizationId,
          formatDateTime(a.scheduledStart),
          formatDateTime(a.scheduledEnd),
          a.status,
          a.visitType,
          a.reason,
        ]);
      });

      doc.text("Appointments Report", 14, 15);

      autoTable(doc, {
        head: [tableColumn],
        body: rows,
        startY: 20,
        theme: "grid",
        styles: { fontSize: 8 },
      });

      doc.save("appointments.pdf");
    } finally {
      setExporting(false);
    }
  }

  if (loading)
    return (
      <div className="container mt-5 text-center">
        <div className="spinner-border text-primary" />
        <p className="mt-2 text-muted">Loading appointments…</p>
      </div>
    );

  if (error)
    return (
      <div className="container mt-5">
        <div className="alert alert-danger">{error}</div>
      </div>
    );

  return (
    <div className="container mt-4">
      <div className="d-flex gap-2 mb-3">
        <Link to="/appointments" className="btn btn-primary">
          Appointments
        </Link>
        <Link to="/appointments/new" className="btn btn-outline-primary">
          Create Appointment
        </Link>
      </div>

      <h3 className="mb-3">Appointments</h3>

      <div className="card shadow-sm border-0">
        <div className="table-responsive">
          <table className="table table-hover mb-0 align-middle">
            <thead className="table-light">
              <tr>
                <th>ID</th>
                <th>Patient</th>
                <th>Provider</th>
                <th>Org ID</th>
                <th>Start</th>
                <th>End</th>
                <th>Status</th>
                <th>Visit</th>
                <th>Reason</th>
                <th className="text-end">Actions</th>
              </tr>
            </thead>

            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={10} className="text-center py-4 text-muted">
                    No appointments found
                  </td>
                </tr>
              ) : (
                filtered.map((a) => (
                  <tr key={a.id}>
                    <td>{a.id}</td>
                    <td>{a.patientName}</td>
                    <td>{a.providerName}</td>
                    <td>{a.organizationId || "-"}</td>
                    <td>{formatDateTime(a.scheduledStart)}</td>
                    <td>{formatDateTime(a.scheduledEnd)}</td>
                    <td>
                      <span className={getStatusBadgeClass(a.status)}>
                        {a.status.replace("_", " ")}
                      </span>
                    </td>
                    <td>{a.visitType || "-"}</td>
                    <td className="text-truncate" style={{ maxWidth: 220 }}>
                      {a.reason || "-"}
                    </td>
                    <td className="text-end">
                      <div className="btn-group btn-group-sm">
                        <Link
                          to={`/appointments/view/${a.id}`}
                          className="btn btn-outline-primary"
                        >
                          View
                        </Link>
                        <Link
                          to={`/appointments/edit/${a.id}`}
                          className="btn btn-outline-secondary"
                        >
                          Edit
                        </Link>
                        <button
                          className="btn btn-outline-danger"
                          onClick={() => handleDelete(a.id)}
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AppointmentListPage;
