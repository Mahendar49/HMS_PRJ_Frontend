import React, { useEffect, useState } from "react";
import { FaSearch, FaEye, FaEdit, FaTrash } from "react-icons/fa";

import { getAllPatients } from "../../api/patientApi";
import { PatientResponse } from "../../types/Patient";
import { deletePatient } from "../../api/authApi";

export default function PatientList() {
  const [patients, setPatients] = useState<PatientResponse[]>([]);
  const [search, setSearch] = useState("");
  const [mrnFilter, setMrnFilter] = useState(""); // TEXT INPUT FILTER
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);

  const pageSize = 5;

  // ---------------- LOAD DATA ----------------
  useEffect(() => {
    loadPatients();
  }, []);

  const loadPatients = async () => {
    try {
      setLoading(true);
      const data = await getAllPatients();
      setPatients(data);
    } catch (err) {
      console.error("Failed to load patients", err);
    } finally {
      setLoading(false);
    }
  };

  // ---------------- DELETE PATIENT ----------------
  const handleDelete = async (id: number) => {
    if (!window.confirm("Are you sure you want to delete this patient?"))
      return;

    try {
      await deletePatient(id);
      loadPatients();
    } catch (err) {
      alert("Delete failed!");
    }
  };

  // ---------------- FILTER DATA ----------------
  const filtered = patients.filter((p) => {
    const matchesSearch = (
      p.firstName +
      p.lastName +
      p.mrn +
      p.email +
      p.mobile +
      p.gender
    )
      .toLowerCase()
      .includes(search.toLowerCase());

    const matchesMrn =
      mrnFilter.trim() !== ""
        ? p.mrn.toLowerCase().includes(mrnFilter.toLowerCase())
        : true;

    return matchesSearch && matchesMrn;
  });

  // ---------------- PAGINATION ----------------
  const paginatedPatients = filtered.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const totalPages = Math.ceil(filtered.length / pageSize);

  return (
    <div className="container mt-4">
      {/* Page Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h3 className="fw-bold text-primary">
          <i className="bi bi-people-fill me-2"></i>
          Patient Directory
        </h3>

        <a href="/patients/new" className="btn btn-primary shadow-sm rounded-3">
          + Add Patient
        </a>
      </div>

      {/* Filters Card */}
      <div className="card shadow-sm border-0 rounded-4 mb-4">
        <div className="card-body row g-3 p-3">
          {/* Global Search */}
          <div className="col-md-6">
            <label className="form-label fw-semibold text-primary">
              Search
            </label>
            <div className="input-group">
              <span className="input-group-text bg-white border-end-0">
                <FaSearch className="text-primary" />
              </span>
              <input
                type="text"
                className="form-control border-start-0"
                placeholder="Search by name, MRN, email, gender..."
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setCurrentPage(1);
                }}
              />
            </div>
          </div>

          {/* MRN Input Filter */}
          <div className="col-md-6">
            <label className="form-label fw-semibold text-primary">
              Filter by MRN
            </label>
            <input
              type="text"
              className="form-control shadow-sm"
              placeholder="Enter MRN..."
              value={mrnFilter}
              onChange={(e) => {
                setMrnFilter(e.target.value);
                setCurrentPage(1);
              }}
            />
          </div>
        </div>
      </div>

      {/* Table */}
      {loading ? (
        <div className="text-center py-5 text-primary fw-bold">
          Loading patients...
        </div>
      ) : (
        <>
          <div className="card shadow-sm border-0 rounded-4">
            <div className="card-body p-0">
              <table className="table table-hover mb-0 align-middle">
                <thead className="table-primary text-dark">
                  <tr>
                    <th>#</th>
                    <th>Name</th>
                    <th>MRN</th>
                    <th>Gender</th>
                    <th>Email</th>
                    <th>Mobile</th>
                    <th className="text-center">Actions</th>
                  </tr>
                </thead>

                <tbody>
                  {paginatedPatients.map((p, i) => (
                    <tr key={p.userId}>
                      <td>{(currentPage - 1) * pageSize + i + 1}</td>

                      <td className="fw-semibold">
                        {p.firstName} {p.lastName}
                      </td>

                      <td>
                        <span className="badge bg-primary text-white px-3 py-2 rounded-pill">
                          {p.mrn}
                        </span>
                      </td>

                      <td>
                        <span className="badge bg-info text-dark px-3 py-2 rounded-pill fw-semibold">
                          {p.gender}
                        </span>
                      </td>

                      <td>{p.email}</td>
                      <td>{p.mobile}</td>

                      <td className="text-center">
                        <button
                          className="btn btn-sm btn-outline-info rounded-circle me-1"
                          onClick={() =>
                            (window.location.href = `/patients/${p.userId}`)
                          }
                        >
                          <FaEye />
                        </button>

                        <button
                          className="btn btn-sm btn-outline-primary rounded-circle me-1"
                          onClick={() =>
                            (window.location.href = `/patients/edit/${p.userId}`)
                          }
                        >
                          <FaEdit />
                        </button>

                        <button
                          className="btn btn-sm btn-outline-danger rounded-circle"
                          onClick={() => handleDelete(p.userId)}
                        >
                          <FaTrash />
                        </button>
                      </td>
                    </tr>
                  ))}

                  {paginatedPatients.length === 0 && (
                    <tr>
                      <td colSpan={7} className="text-center py-4 text-muted">
                        No patients found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <nav className="mt-3">
              <ul className="pagination justify-content-center">
                {[...Array(totalPages)].map((_, idx) => (
                  <li
                    key={idx}
                    className={`page-item ${
                      currentPage === idx + 1 ? "active" : ""
                    }`}
                  >
                    <button
                      className="page-link"
                      onClick={() => setCurrentPage(idx + 1)}
                    >
                      {idx + 1}
                    </button>
                  </li>
                ))}
              </ul>
            </nav>
          )}
        </>
      )}
    </div>
  );
}
