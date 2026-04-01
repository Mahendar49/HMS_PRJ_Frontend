import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ProviderResponse } from "../../types/provider";

import {
  FaUserMd,
  FaEnvelope,
  FaPhone,
  FaArrowLeft,
  FaMapMarkerAlt,
  FaBriefcase,
} from "react-icons/fa";
import { getProviderById } from "../../api/providerApi";

export default function ProviderDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [provider, setProvider] = useState<ProviderResponse | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProvider();
  }, []);

  const loadProvider = async () => {
    try {
      const data = await getProviderById(Number(id));
      setProvider(data);
    } catch (err) {
      alert("Failed to load provider details");
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="text-center mt-5">Loading...</div>;

  if (!provider)
    return (
      <div className="text-center mt-5 text-danger">Provider not found</div>
    );

  const statusBadgeClass =
    provider.status === "active"
      ? "badge bg-success"
      : provider.status === "inactive"
      ? "badge bg-secondary"
      : "badge bg-warning";

  return (
    <div className="container mt-4">
      <button
        className="btn btn-outline-secondary mb-3"
        onClick={() => navigate("/providers")}
      >
        <FaArrowLeft /> Back
      </button>

      <div className="card shadow-lg">
        <div className="card-header bg-primary text-white">
          <h4 className="mb-0">
            <FaUserMd className="me-2" />
            {provider.providerName}
          </h4>
        </div>

        <div className="card-body">
          <div className="row mb-3">
            <div className="col-md-4">
              <p>
                <strong>Provider Code:</strong> {provider.providerCode}
              </p>
            </div>
            <div className="col-md-4">
              <p>
                <strong>Status:</strong>{" "}
                <span className={statusBadgeClass}>{provider.status}</span>
              </p>
            </div>
            <div className="col-md-4">
              <p>
                <strong>Experience:</strong> {provider.experienceYears} Years
              </p>
            </div>
          </div>

          <hr />

          <div className="row mb-3">
            <div className="col-md-6">
              <h6>
                <FaEnvelope className="me-2" /> Email
              </h6>
              <p>{provider.email}</p>
            </div>
            <div className="col-md-6">
              <h6>
                <FaPhone className="me-2" /> Mobile
              </h6>
              <p>{provider.mobile}</p>
            </div>
          </div>

          <hr />

          <h6>
            <FaBriefcase className="me-2" /> Specialization
          </h6>
          <p>{provider.specialization}</p>

          <hr />

          <h6>
            <FaMapMarkerAlt className="me-2" /> Address
          </h6>
          <p>{provider.address}</p>

          <hr />

          <div className="text-muted small">
            <p>Created At: {provider.createdAt}</p>
            <p>Updated At: {provider.updatedAt}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
