// File: src/pages/insurance/claims/ListClaimsEnhanced.tsx

import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import { InsuranceClaimResponse } from "../../types/claims";
import {
  deleteInsuranceClaim,
  getAllInsuranceClaims,
} from "../../api/insuranceClaimsApi";

import { getAllPatients } from "../../api/patientApi";
import { fetchInsuranceProviders } from "../../api/insuranceProviderApi";
import { PatientResponse } from "../../types/Patient";
import { InsuranceProvider } from "../../types/insurance";

type SortDirection = "asc" | "desc";

const STATUS_OPTIONS = [
  "all",
  "draft",
  "submitted",
  "processing",
  "denied",
  "paid",
  "adjusted",
  "rejected",
];

const PAGE_SIZES = [10, 25, 50];

const InsuranceClaimListPage: React.FC = () => {
  const navigate = useNavigate();

  const [claims, setClaims] = useState<InsuranceClaimResponse[]>([]);
  const [loading, setLoading] = useState(true);

  const [patients, setPatients] = useState<PatientResponse[]>([]);
  const [providers, setProviders] = useState<InsuranceProvider[]>([]);

  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  const [statusFilter, setStatusFilter] = useState("all");
  const [patientFilter, setPatientFilter] = useState("");
  const [providerFilter, setProviderFilter] = useState("");

  const [sortBy, setSortBy] =
    useState<keyof InsuranceClaimResponse>("createdAt");
  const [sortDir, setSortDir] = useState<SortDirection>("desc");

  const [pageSize, setPageSize] = useState(PAGE_SIZES[0]);
  const [page, setPage] = useState(1);

  // Debounce search
  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(searchTerm), 300);
    return () => clearTimeout(t);
  }, [searchTerm]);

  // Fetch all data
  useEffect(() => {
    (async () => {
      setLoading(true);
      const data = await getAllInsuranceClaims();
      const patientsList = await getAllPatients();
      const providerList = await fetchInsuranceProviders();

      setClaims(data || []);
      setPatients(patientsList || []);
      setProviders(providerList || []);

      setLoading(false);
    })();
  }, []);

  // Maps: patientId → patient name
  const patientMap = useMemo(() => {
    const map: Record<number, string> = {};
    patients.forEach((p) => {
      map[p.id] = `${p.firstName} ${p.lastName}`;
    });
    return map;
  }, [patients]);

  // Maps: providerId → provider name
  const providerMap = useMemo(() => {
    const map: Record<number, string> = {};
    providers.forEach((p) => {
      map[p.id] = p.name;
    });
    return map;
  }, [providers]);

  // Filter + Search + Sort
  const filtered = useMemo(() => {
    let list = [...claims];

    if (statusFilter !== "all") {
      list = list.filter((x) => x.status === statusFilter);
    }

    if (patientFilter) {
      list = list.filter((x) =>
        String(x.patientId).includes(patientFilter.trim())
      );
    }

    if (providerFilter) {
      list = list.filter((x) =>
        String(x.insuranceProviderId).includes(providerFilter.trim())
      );
    }

    if (debouncedSearch) {
      const s = debouncedSearch.toLowerCase();
      list = list.filter(
        (x) =>
          x.claimNumber?.toLowerCase().includes(s) ||
          String(x.id).includes(s)
      );
    }

    list.sort((a: any, b: any) => {
      const av = a[sortBy];
      const bv = b[sortBy];
      if (av < bv) return sortDir === "asc" ? -1 : 1;
      if (av > bv) return sortDir === "asc" ? 1 : -1;
      return 0;
    });

    return list;
  }, [
    claims,
    statusFilter,
    patientFilter,
    providerFilter,
    debouncedSearch,
    sortDir,
    sortBy,
  ]);

  // Pagination
  const total = filtered.length;
  const totalPages = Math.ceil(total / pageSize);

  const paged = filtered.slice((page - 1) * pageSize, page * pageSize);

  const toggleSort = (field: keyof InsuranceClaimResponse) => {
    if (sortBy === field) {
      setSortDir(sortDir === "asc" ? "desc" : "asc");
    } else {
      setSortBy(field);
      setSortDir("asc");
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm("Are you sure you want to delete this claim?")) return;
    await deleteInsuranceClaim(id);
    setClaims((prev) => prev.filter((x) => x.id !== id));
  };

  return (
    <div className="container mt-4">

      {/* HEADER */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h3 className="fw-bold text-primary">
          <i className="bi bi-file-medical me-2"></i>
          Insurance Claims
        </h3>

        <button
          className="btn btn-success"
          onClick={() => navigate("/insurance/claims/create")}
        >
          <i className="bi bi-plus-circle me-2"></i>Create Claim
        </button>
      </div>

      {/* FILTERS CARD */}
      <div className="card shadow-sm mb-4">
        <div className="card-body">

          <div className="row g-3">

            <div className="col-md-4">
              <input
                type="text"
                className="form-control"
                placeholder="Search (Claim No / ID)"
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setPage(1);
                }}
              />
            </div>

            <div className="col-md-2">
              <select
                className="form-select"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                {STATUS_OPTIONS.map((s) => (
                  <option key={s}>{s}</option>
                ))}
              </select>
            </div>

            <div className="col-md-2">
              <input
                type="text"
                className="form-control"
                placeholder="Patient ID"
                value={patientFilter}
                onChange={(e) => setPatientFilter(e.target.value)}
              />
            </div>

            <div className="col-md-2">
              <input
                type="text"
                className="form-control"
                placeholder="Provider ID"
                value={providerFilter}
                onChange={(e) => setProviderFilter(e.target.value)}
              />
            </div>

            <div className="col-md-2">
              <select
                className="form-select"
                value={pageSize}
                onChange={(e) => setPageSize(Number(e.target.value))}
              >
                {PAGE_SIZES.map((s) => (
                  <option key={s}>{s}</option>
                ))}
              </select>
            </div>

          </div>

        </div>
      </div>

      {/* TABLE CARD */}
      <div className="card shadow-sm">
        <div className="card-body p-0">

          <table className="table table-hover table-striped m-0">
            <thead className="table-primary">
              <tr>
                <th onClick={() => toggleSort("id")} style={{ cursor: "pointer" }}>
                  ID {sortBy === "id" ? (sortDir === "asc" ? "▲" : "▼") : ""}
                </th>
                <th onClick={() => toggleSort("claimNumber")} style={{ cursor: "pointer" }}>
                  Claim No
                </th>
                <th>Patient</th>
                <th>Provider</th>
                <th>Status</th>
                <th onClick={() => toggleSort("totalAmount")} style={{ cursor: "pointer" }}>
                  Amount
                </th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={7} className="text-center py-4">
                    <div className="spinner-border text-primary"></div>
                  </td>
                </tr>
              ) : paged.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-4 text-muted">
                    No Claims Found
                  </td>
                </tr>
              ) : (
                paged.map((c) => (
                  <tr key={c.id}>
                    <td>{c.id}</td>
                    <td>{c.claimNumber}</td>

                    {/* Patient Name */}
                    <td>
                      {patientMap[c.patientId] || `ID: ${c.patientId}`}
                    </td>

                    {/* Provider Name */}
                    <td>
                      {providerMap[c.insuranceProviderId] ||
                        `ID: ${c.insuranceProviderId}`}
                    </td>

                    <td>
                      <span className="badge bg-info text-dark">{c.status}</span>
                    </td>

                    <td>₹{c.totalAmount}</td>

                    <td>
                      <div className="btn-group">
                        <button
                          className="btn btn-sm btn-secondary"
                          onClick={() => navigate(`/insurance/claims/${c.id}/view`)}
                        >
                          <i className="bi bi-eye"></i>
                        </button>
                        <button
                          className="btn btn-sm btn-primary"
                          onClick={() => navigate(`/insurance/claims/${c.id}/edit`)}
                        >
                          <i className="bi bi-pencil-square"></i>
                        </button>
                        <button
                          className="btn btn-sm btn-danger"
                          onClick={() => handleDelete(c.id)}
                        >
                          <i className="bi bi-trash"></i>
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

      {/* PAGINATION */}
      <div className="d-flex justify-content-between align-items-center mt-3">

        <span className="text-muted">
          Showing {(page - 1) * pageSize + 1} –{" "}
          {Math.min(page * pageSize, total)} of {total}
        </span>

        <div className="btn-group">
          <button className="btn btn-outline-primary" disabled={page === 1} onClick={() => setPage(1)}>
            <i className="bi bi-skip-backward"></i>
          </button>
          <button className="btn btn-outline-primary" disabled={page === 1} onClick={() => setPage(page - 1)}>
            <i className="bi bi-chevron-left"></i>
          </button>

          <button className="btn btn-outline-primary disabled">
            Page {page} / {totalPages}
          </button>

          <button className="btn btn-outline-primary" disabled={page === totalPages} onClick={() => setPage(page + 1)}>
            <i className="bi bi-chevron-right"></i>
          </button>
          <button className="btn btn-outline-primary" disabled={page === totalPages} onClick={() => setPage(totalPages)}>
            <i className="bi bi-skip-forward"></i>
          </button>
        </div>

      </div>

    </div>
  );
};

export default InsuranceClaimListPage;
