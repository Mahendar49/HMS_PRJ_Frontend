// src/pages/PatientInsurance/PatientInsuranceListPage.tsx

import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import {
  getAllPatientInsurance,
  deletePatientInsurance,
} from "../../api/patientInsuranceApi";

import { getAllPatients } from "../../api/patientApi";
import { fetchInsuranceProviders } from "../../api/insuranceProviderApi";

import type { PatientInsuranceResponse } from "../../types/PatientInsurance";

export default function PatientInsuranceListPage() {
  const [records, setRecords] = useState<PatientInsuranceResponse[]>([]);
  const [searchTerm, setSearchTerm] = useState("");

  const [patientsMap, setPatientsMap] = useState<Record<number, string>>({});
  const [providersMap, setProvidersMap] = useState<Record<number, string>>({});

  // ================= FETCH DATA =================

  const fetchRecords = async () => {
    try {
      const res = await getAllPatientInsurance();
      setRecords(res.data);
    } catch (err) {
      console.error("Error fetching insurance records", err);
    }
  };

  const fetchPatients = async () => {
    try {
      const res = await getAllPatients();
      const map: Record<number, string> = {};

      res.forEach((p: any) => {
        map[p.id] = p.firstName && p.lastName
          ? `${p.firstName} ${p.lastName}`
          : p.name || "Unknown";
      });

      setPatientsMap(map);
    } catch (err) {
      console.error("Error fetching patients", err);
    }
  };

  const fetchProviders = async () => {
    try {
      const res = await fetchInsuranceProviders();
      const map: Record<number, string> = {};

      res.forEach((provider: any) => {
        map[provider.id] = provider.name;
      });

      setProvidersMap(map);
    } catch (err) {
      console.error("Error fetching insurance providers", err);
    }
  };

  const handleDelete = async (id: number) => {
    if (window.confirm("Are you sure you want to delete this record?")) {
      try {
        await deletePatientInsurance(id);
        fetchRecords();
      } catch (err) {
        console.error("Error deleting record", err);
      }
    }
  };

  useEffect(() => {
    fetchRecords();
    fetchPatients();
    fetchProviders();
  }, []);

  // ================= SEARCH FILTER =================
  const filtered = records.filter((rec) => {
    const patientName = (patientsMap[rec.patientId] || "").toLowerCase();
    const providerName = (providersMap[rec.insuranceProviderId] || "").toLowerCase();

    const search = searchTerm.toLowerCase();

    return (
      patientName.includes(search) ||
      providerName.includes(search) ||
      rec.policyNumber.toLowerCase().includes(search) ||
      rec.subscriberName.toLowerCase().includes(search)
    );
  });

  return (
    <div>
      <h3>Patient Insurance Records</h3>

      <div className="d-flex justify-content-between align-items-center mb-2">
        <Link
          to="/insurance/patient-insurance/new"
          className="btn btn-primary"
        >
          Create Insurance Record
        </Link>

        <input
          type="text"
          placeholder="Search by Patient, Provider, Policy No, Subscriber..."
          className="form-control w-50"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <table className="table table-striped">
        <thead>
          <tr>
            <th>ID</th>
            <th>Patient</th>
            <th>Provider</th>
            <th>Subscriber</th>
            <th>Policy Number</th>
            <th>Effective From</th>
            <th>Effective To</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          {filtered.map((rec) => (
            <tr key={rec.id}>
              <td>{rec.id}</td>

              <td>{patientsMap[rec.patientId] || rec.patientId}</td>

              <td>{providersMap[rec.insuranceProviderId] || rec.insuranceProviderId}</td>

              <td>{rec.subscriberName}</td>

              <td>{rec.policyNumber}</td>

              <td>{rec.effectiveFrom}</td>
              <td>{rec.effectiveTo}</td>

              <td>
                <Link
                  to={`/insurance/patient-insurance/${rec.id}`}
                  className="btn btn-sm btn-info me-1"
                >
                  View
                </Link>

                <Link
                  to={`/insurance/patient-insurance/${rec.id}/edit`}
                  className="btn btn-sm btn-warning me-1"
                >
                  Edit
                </Link>

                <button
                  className="btn btn-sm btn-danger"
                  onClick={() => handleDelete(rec.id)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
