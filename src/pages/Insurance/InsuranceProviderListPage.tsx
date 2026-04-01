// src/pages/Insurance/InsuranceProviderListPage.tsx

import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  fetchInsuranceProviders,
  deleteInsuranceProvider,
} from "../../api/insuranceProviderApi";
import { InsuranceProvider } from "../../types/insurance";


const InsuranceProviderListPage: React.FC = () => {
  const [providers, setProviders] = useState<InsuranceProvider[]>([]);
  const [search, setSearch] = useState("");

  const loadProviders = async () => {
    try {
      const data = await fetchInsuranceProviders();
      setProviders(data);
    } catch (error) {
      console.error("Failed to load insurance providers", error);
    }
  };

  useEffect(() => {
    loadProviders();
  }, []);

  const handleDelete = async (id: number) => {
    const confirmed = window.confirm("Are you sure you want to delete?");
    if (!confirmed) return;

    try {
      await deleteInsuranceProvider(id);
      await loadProviders();
    } catch (error) {
      console.error("Failed to delete insurance provider", error);
    }
  };

  const filtered = providers.filter((p) =>
    (p.name || "").toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="page-container">
      {/* Title – same style as CarePlans */}
      <div className="page-header">
        <h2>Insurance Providers</h2>
      </div>

      {/* Search + +New row – same pattern as CarePlans */}
      <div className="d-flex align-items-center mt-3">
        <input
          className="search-input flex-grow-1 me-3"
          placeholder="Search by provider name, payer id..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <Link to="/insurance/providers/new" className="btn btn-primary">
          + New
        </Link>
      </div>

      {/* Table – same table style as CarePlans */}
      <div className="table-responsive mt-3">
        <table className="table table-striped">
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Payer ID</th>
              <th>Contact Info</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((p) => (
              <tr key={p.id}>
                <td>{p.id}</td>
                <td>{p.name}</td>
                <td>{p.payerId}</td>
                <td>{p.contactInfo}</td>
                <td>
                  <Link
                    to={`/insurance/providers/${p.id}/edit`}
                    className="btn btn-sm btn-primary"
                  >
                    Edit
                  </Link>
                  <button
                    className="btn btn-sm btn-danger ms-2"
                    onClick={() => handleDelete(p.id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}

            {filtered.length === 0 && (
              <tr>
                <td colSpan={5} className="text-center">
                  No insurance providers found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default InsuranceProviderListPage;
