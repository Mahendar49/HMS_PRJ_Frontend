import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";

import { getPatientInsuranceById } from "../../api/patientInsuranceApi";
import { getPatientById } from "../../api/patientApi";
import { fetchInsuranceProviderById } from "../../api/insuranceProviderApi";

import type { PatientInsuranceResponse } from "../../types/PatientInsurance";
import type { PatientResponse } from "../../types/Patient";
import type { InsuranceProvider } from "../../types/insurance";

const PatientInsuranceViewPage: React.FC = () => {
  const { id } = useParams();
  
  const [data, setData] = useState<PatientInsuranceResponse | null>(null);
  const [patient, setPatient] = useState<PatientResponse | null>(null);
  const [provider, setProvider] = useState<InsuranceProvider | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    async function load() {
      try {
        if (!id) return;

        const res = await getPatientInsuranceById(Number(id));
        setData(res.data);

        // Fetch Patient
        const pRes = await getPatientById(res.data.patientId);
        setPatient(pRes);

        // Fetch Provider
        const provRes = await fetchInsuranceProviderById(res.data.insuranceProviderId);
        setProvider(provRes);

      } catch (err: any) {
        console.error(err);
        setError("Failed to load patient insurance details");
      }
    }
    load();
  }, [id]);

  if (error) return <p className="text-danger">{error}</p>;
  if (!data) return <p>Loading...</p>;

  return (
    <div className="container mt-4">
      <h2>Patient Insurance Details</h2>
      <hr />

      <div className="card p-4 shadow-sm">

        <div className="mb-3">
          <strong>Patient:</strong>
          <p>
            {patient?.firstName} {patient?.lastName}
          </p>
        </div>

        <div className="mb-3">
          <strong>Insurance Provider:</strong>
          <p>{provider?.name}</p>
        </div>

        <div className="mb-3">
          <strong>Subscriber Name:</strong>
          <p>{data.subscriberName}</p>
        </div>

        <div className="mb-3">
          <strong>Effective From:</strong>
          <p>{data.effectiveFrom}</p>
        </div>

        <div className="mb-3">
          <strong>Effective To:</strong>
          <p>{data.effectiveTo}</p>
        </div>

        <div className="mb-3">
          <strong>Created At:</strong>
          <p>{data.createdAt}</p>
        </div>

        {/* Buttons */}
        <div className="mt-3">
          <Link to="/insurance/patient-insurance" className="btn btn-secondary me-2">
            Back
          </Link>

          <Link
            to={`/insurance/patient-insurance/${data.id}/edit`}
            className="btn btn-primary"
          >
            Edit
          </Link>
        </div>
      </div>
    </div>
  );
};

export default PatientInsuranceViewPage;
