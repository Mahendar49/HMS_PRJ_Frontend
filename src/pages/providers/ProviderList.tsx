import React, { useEffect, useState } from "react";
import { ProviderResponse } from "../../types/provider";
import { FaEdit, FaTrash, FaEye, FaSearch } from "react-icons/fa";
import { deleteProviderHms, getAllProviders } from "../../api/providerApi";

export default function ProviderList() {
  const [providers, setProviders] = useState<ProviderResponse[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);

  const pageSize = 5;

  useEffect(() => {
    loadProviders();
  }, []);

  const loadProviders = async () => {
    try {
      setLoading(true);
      const data = await getAllProviders();
      setProviders(data);
    } catch (err) {
      console.error("Failed to load providers", err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm("Are you sure you want to delete this provider?"))
      return;

    try {
      await deleteProviderHms(id);
      loadProviders();
    } catch (err) {
      alert("Delete failed!");
    }
  };

  const filtered = providers.filter((p) =>
    (p.providerName + p.specialization + p.providerCode + p.email)
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  const paginatedProviders = filtered.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const totalPages = Math.ceil(filtered.length / pageSize);

  return (
    <div className="container mt-4">
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h3 className="fw-bold text-primary">
          <i className="bi bi-people-fill me-2"></i>
          Provider Directory
        </h3>

        <a
          href="/providers/register-provider"
          className="btn btn-primary shadow-sm rounded-3"
        >
          + Add Provider
        </a>
      </div>

      {/* Search Card */}
      <div className="card shadow-sm border-0 rounded-4 mb-4">
        <div className="card-body p-3">
          <div className="input-group">
            <span className="input-group-text bg-white border-end-0">
              <FaSearch className="text-primary" />
            </span>
            <input
              type="text"
              className="form-control border-start-0"
              placeholder="Search providers by name, specialization, code or email..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setCurrentPage(1);
              }}
            />
          </div>
        </div>
      </div>

      {/* Table */}
      {loading ? (
        <div className="text-center py-5 text-primary fw-bold">
          Loading providers...
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
                    <th>Specialization</th>
                    <th>Experience</th>
                    <th>Status</th>
                    <th>Email</th>
                    <th className="text-center">Actions</th>
                  </tr>
                </thead>

                <tbody>
                  {paginatedProviders.map((p, i) => (
                    <tr key={p.id}>
                      <td>{(currentPage - 1) * pageSize + i + 1}</td>
                      <td className="fw-semibold">{p.providerName}</td>
                      <td>{p.specialization}</td>
                      <td>{p.experienceYears} yrs</td>

                      <td>
                        <span
                          className={`badge px-3 py-2 rounded-pill fw-semibold ${
                            p.status === "active"
                              ? "bg-success"
                              : p.status === "inactive"
                              ? "bg-secondary"
                              : "bg-warning"
                          }`}
                        >
                          {p.status}
                        </span>
                      </td>

                      <td>{p.email}</td>

                      <td className="text-center">
                        <button
                          className="btn btn-sm btn-outline-info me-1 rounded-circle"
                          onClick={() =>
                            (window.location.href = `/providers/${p.id}`)
                          }
                        >
                          <FaEye />
                        </button>

                        <button
                          className="btn btn-sm btn-outline-primary me-1 rounded-circle"
                          onClick={() =>
                            (window.location.href = `/providers/edit/${p.id}`)
                          }
                        >
                          <FaEdit />
                        </button>

                        <button
                          className="btn btn-sm btn-outline-danger rounded-circle"
                          onClick={() => handleDelete(p.id)}
                        >
                          <FaTrash />
                        </button>
                      </td>
                    </tr>
                  ))}

                  {paginatedProviders.length === 0 && (
                    <tr>
                      <td colSpan={7} className="text-center py-4 text-muted">
                        No providers found.
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
