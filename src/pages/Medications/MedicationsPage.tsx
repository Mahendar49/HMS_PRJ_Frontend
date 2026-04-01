// src/pages/medications/MedicationsPage.tsx
import React, { useEffect, useMemo, useState } from "react";
import { FaSearch, FaPlus, FaEdit, FaTrash } from "react-icons/fa";
import { fetchMedications, Medication, deleteMedication } from "../../api/medicationApi";

import { useNavigate } from "react-router-dom";



const MedicationsPage: React.FC = () => {
  const [search, setSearch] = useState("");
  const [medications, setMedications] = useState<Medication[]>([]);
    useEffect(() => {
    const load = async () => {
      try {
        const data = await fetchMedications();
        setMedications(data);
      } catch (error) {
        console.error("Failed to load medications", error);
      }
    };

    load();
  }, []);


  const navigate = useNavigate();

  const filtered = useMemo(
    () =>
      medications.filter((m) => {
        const text = (m.name + m.form + m.rxnormCode + m.strength).toLowerCase();
        return text.includes(search.toLowerCase());
      }),
    [medications, search]
  );

  const handleNew = () => navigate("/medications/new");


  const handleEdit = (med: Medication) => {
  navigate(`/medications/${med.id}/edit`);
};


  const handleDelete = async (med: Medication) => {
  const ok = window.confirm(`Delete medication "${med.name}"?`);
  if (!ok) return;

  try {
    await deleteMedication(med.id);
    setMedications((prev) => prev.filter((m) => m.id !== med.id));
  } catch (err) {
    console.error("Failed to delete medication", err);
    alert("Failed to delete medication. Please try again.");
  }
};


  return (
    <div className="container-fluid px-2 px-sm-3 px-md-4">
      <div
        className="mx-auto"
        style={{ maxWidth: "1120px" }} // make it smaller & centered on big screens
      >
        {/* Page title */}
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h2 className="mb-0 fw-semibold">Medications</h2>

          <button
            className="btn btn-primary d-flex align-items-center"
            onClick={handleNew}
          >
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
              placeholder="Search medications..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        {/* Table card */}
        <div className="card shadow-sm border-0 rounded-4">
          <div className="card-body p-0">
            <div
              className="table-responsive"
              style={{ maxHeight: "360px", overflowY: "auto" }}
            >
              <table className="table table-hover mb-0 align-middle">
                <thead className="table-primary text-dark">
                  <tr>
                    <th style={{ width: "5rem" }}>ID</th>
                    <th>Name</th>
                    <th>Form</th>
                    <th>Strength</th>
                    <th>RxNorm</th>
                    <th style={{ width: "9rem" }} className="text-end">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="text-center py-4 text-muted">
                        No medications yet. Click <strong>New</strong> to add one.
                      </td>
                    </tr>
                  ) : (
                    filtered.map((med) => (
                      <tr key={med.id}>
                        <td>{med.id}</td>
                        <td className="fw-semibold">{med.name}</td>
                        <td>{med.form}</td>
                        <td>{med.strength}</td>
                        <td>{med.rxnormCode}</td>
                        <td className="text-end">
                          <button
                            className="btn btn-sm btn-outline-primary me-2"
                            onClick={() => handleEdit(med)}
                          >
                            <FaEdit className="me-1" />
                            Edit
                          </button>
                          <button
                            className="btn btn-sm btn-outline-danger"
                            onClick={() => handleDelete(med)}
                          >
                            <FaTrash className="me-1" />
                            Delete
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

export default MedicationsPage;
