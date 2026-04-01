// src/pages/medications/PrescriptionsPage.tsx
import React, { useEffect, useMemo, useState } from "react";
import { FaSearch, FaPlus, FaEdit, FaTrash } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

import {
  fetchPrescriptions,
  Prescription,
  deletePrescription,
} from "../../api/prescriptionApi";

import { getAllPatients } from "../../api/patientApi";
import { getAllProviders } from "../../api/providerApi";
import { getAllEncounters } from "../../api/encounterApi";
import { fetchMedications } from "../../api/medicationApi";

const PrescriptionsPage: React.FC = () => {
  const navigate = useNavigate();

  // Search & Data states
  const [search, setSearch] = useState("");
  const [prescriptions, setPrescriptions] = useState<Prescription[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Maps for displaying names
  const [patientMap, setPatientMap] = useState<Record<number, string>>({});
  const [providerMap, setProviderMap] = useState<Record<number, string>>({});
  const [encounterMap, setEncounterMap] = useState<Record<number, string>>({});
  const [medicationMap, setMedicationMap] = useState<Record<number, string>>({});

  // Load everything on mount
  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setError(null);

      try {
        // 1. Prescriptions
        const data = await fetchPrescriptions();
        setPrescriptions(data);

        // 2. Patients
        const pat = await getAllPatients();
        const patMap: Record<number, string> = {};
        pat.forEach((p: any) => {
          patMap[p.id] = `${p.firstName} ${p.lastName}`;
        });
        setPatientMap(patMap);

        // 3. Providers
        const prov = await getAllProviders();
        const provMap: Record<number, string> = {};
        prov.forEach((p: any) => {
          provMap[p.id] = p.providerName || `${p.firstName} ${p.lastName}`;
        });
        setProviderMap(provMap);

        // 4. Encounters
        const enc = await getAllEncounters();
        const encMap: Record<number, string> = {};
        enc.data.forEach((e: any) => {
          encMap[e.id] = e.encounterCode || `Encounter-${e.id}`;
        });
        setEncounterMap(encMap);

        // 5. Medications
        const meds = await fetchMedications();
        const medMap: Record<number, string> = {};
        meds.forEach((m) => {
          medMap[m.id] = m.name;
        });
        setMedicationMap(medMap);

      } catch (err) {
        console.error("Failed to load prescriptions", err);
        setError("Failed to load prescriptions.");
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  // Search filtering
  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase();
    if (!term) return prescriptions;

    return prescriptions.filter((p) => {
      const text = `
        ${patientMap[p.patientId] || ""} 
        ${encounterMap[p.encounterId || 0] || ""} 
        ${providerMap[p.prescribedBy] || ""} 
        ${medicationMap[p.medicationId] || ""} 
        ${p.sig} ${p.dose} ${p.frequency} 
        ${p.quantity} ${p.refills} ${p.status}
      `.toLowerCase();

      return text.includes(term);
    });
  }, [prescriptions, search, patientMap, providerMap, encounterMap, medicationMap]);

  const handleNew = () => navigate("/medications/prescriptions/new");

  const handleEdit = (p: Prescription) => {
    navigate(`/medications/prescriptions/${p.id}/edit`);
  };

  const handleDelete = async (p: Prescription) => {
    const ok = window.confirm(`Delete prescription #${p.id}?`);
    if (!ok) return;

    try {
      await deletePrescription(p.id);
      setPrescriptions((prev) => prev.filter((x) => x.id !== p.id));
    } catch (err) {
      console.error("Failed to delete prescription", err);
      alert("Failed to delete prescription. Please try again.");
    }
  };

  return (
    <div className="container-fluid px-2 px-sm-3 px-md-4">
      <div className="mx-auto" style={{ maxWidth: "1120px" }}>
        {/* Header */}
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h2 className="mb-0 fw-semibold">Prescriptions</h2>

          <button className="btn btn-primary d-flex align-items-center" onClick={handleNew}>
            <FaPlus className="me-2" />
            New
          </button>
        </div>

        {/* Search */}
        <div className="mb-3">
          <div className="input-group">
            <span className="input-group-text bg-white border-end-0">
              <FaSearch className="text-primary" />
            </span>
            <input
              type="text"
              className="form-control border-start-0"
              placeholder="Search prescriptions..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        {/* Table */}
        <div className="card shadow-sm border-0 rounded-4">
          <div className="card-body p-0">
            <div className="table-responsive">
              <table className="table table-hover mb-0 align-middle">
                <thead className="table-primary text-dark">
                  <tr>
                    <th>Patient</th>
                    <th>Encounter</th>
                    <th>Prescribed By</th>
                    <th>Medication</th>
                    <th>Sig</th>
                    <th>Dose</th>
                    <th>Frequency</th>
                    <th>Qty</th>
                    <th>Refills</th>
                    <th>Status</th>
                    <th className="text-end" style={{ width: "9rem" }}>
                      Actions
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {loading ? (
                    <tr>
                      <td colSpan={11} className="text-center py-4">
                        Loading prescriptions...
                      </td>
                    </tr>
                  ) : error ? (
                    <tr>
                      <td colSpan={11} className="text-center text-danger py-4">
                        {error}
                      </td>
                    </tr>
                  ) : filtered.length === 0 ? (
                    <tr>
                      <td colSpan={11} className="text-center py-4 text-muted">
                        No prescriptions yet. Click <strong>New</strong> to add one.
                      </td>
                    </tr>
                  ) : (
                    filtered.map((p) => (
                      <tr key={p.id}>
                        <td>{patientMap[p.patientId] || p.patientId}</td>
                        <td>{encounterMap[p.encounterId || 0] || "-"}</td>
                        <td>{providerMap[p.prescribedBy] || p.prescribedBy}</td>
                        <td>{medicationMap[p.medicationId] || p.medicationId}</td>
                        <td>{p.sig}</td>
                        <td>{p.dose}</td>
                        <td>{p.frequency}</td>
                        <td>{p.quantity}</td>
                        <td>{p.refills}</td>
                        <td>{p.status}</td>

                        <td className="text-end">
                          <button
                            className="btn btn-sm btn-outline-primary me-2"
                            onClick={() => handleEdit(p)}
                          >
                            <FaEdit className="me-1" /> Edit
                          </button>

                          <button
                            className="btn btn-sm btn-outline-danger"
                            onClick={() => handleDelete(p)}
                          >
                            <FaTrash className="me-1" /> Delete
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>

              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrescriptionsPage;
