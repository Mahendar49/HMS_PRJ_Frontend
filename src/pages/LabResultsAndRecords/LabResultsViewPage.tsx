// src/pages/LabResults/LabResultViewPage.tsx
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getLabResultById } from "../../api/LabResultsApi";
import { LabResultResponse } from "../../types/LabResult";

const LabResultViewPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [result, setResult] = useState<LabResultResponse | null>(null);
  const navigate = useNavigate(); // for back navigation

  useEffect(() => {
    if (id) fetchResult(+id);
  }, [id]);

  const fetchResult = async (id: number) => {
    try {
      const data = await getLabResultById(id);
      setResult(data);
    } catch (err) {
      console.error("Failed to fetch lab result:", err);
    }
  };

  if (!result) return <div className="p-4">Loading...</div>;

  return (
    <div className="p-4">
      {/* Back button */}
      <button className="btn btn-secondary mb-3" onClick={() => navigate(-1)}>
        &larr; Back
      </button>

      <h3>Lab Result #{result.id}</h3>
      <p><strong>Lab Order ID:</strong> {result.labOrderId}</p>
      <p><strong>Test Name:</strong> {result.testName}</p>
      <p><strong>Patient ID:</strong> {result.patientId}</p>
      <p><strong>Encounter ID:</strong> {result.encounterId}</p>
      <p><strong>Ordered By:</strong> {result.orderedBy}</p>
      <p><strong>Status:</strong> {result.resultStatus}</p>
      <p><strong>Result Details:</strong> {result.resultDetails}</p>
      <p><strong>Result Date:</strong> {new Date(result.resultDate).toLocaleString()}</p>
      {result.performedAt && (
        <p><strong>Performed At:</strong> {new Date(result.performedAt).toLocaleString()}</p>
      )}
      <p><strong>Created At:</strong> {new Date(result.createdAt).toLocaleString()}</p>
    </div>
  );
};

export default LabResultViewPage;