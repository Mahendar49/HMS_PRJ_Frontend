import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getDiagnosisById } from "../../api/diagnosisApi";
import type { DiagnosisResponse } from "../../types/Diagnosis";

export default function DiagnosisViewPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [diagnosis, setDiagnosis] = useState<DiagnosisResponse | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      getDiagnosisById(Number(id))
        .then((res) => setDiagnosis(res.data))
        .catch(() => alert("Failed to load diagnosis"))
        .finally(() => setLoading(false));
    }
  }, [id]);

  if (loading) return <p>Loading...</p>;
  if (!diagnosis) return <p>No diagnosis found.</p>;

  return (
    <div className="page-container">
      <h2 className="page-title">Diagnosis Details</h2>

      <div className="details-card">
        <p><strong>ID:</strong> {diagnosis.id}</p>
        <p><strong>Patient ID:</strong> {diagnosis.patientId}</p>
        <p><strong>Encounter ID:</strong> {diagnosis.encounterId}</p>
        <p><strong>Diagnosis Code:</strong> {diagnosis.code}</p>
        <p><strong>Description:</strong> {diagnosis.description}</p>
        <p><strong>Created At:</strong> {diagnosis.createdAt}</p>
      </div>

      <button
        onClick={() => navigate(`/clinicalrecords/diagnosis`)}
        className="btn-primary"
      >
       Back
      </button>
    </div>
  );
}
