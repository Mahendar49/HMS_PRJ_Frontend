// src/pages/Vitals/VitalViewPage.tsx
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getVitalById } from "../../api/vitalApi";
import type { VitalResponse } from "../../types/Vital";

export default function VitalViewPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [vital, setVital] = useState<VitalResponse | null>(null);

  useEffect(() => {
    if (id) fetchVital(parseInt(id));
  }, [id]);

  const fetchVital = async (vitalId: number) => {
    try {
      const res = await getVitalById(vitalId);
      setVital(res.data);
    } catch (err) {
      console.error("Error fetching vital", err);
    }
  };

  if (!vital) return <p>Loading...</p>;

  return (
    <div>
      <h3>Vital Details</h3>

      {/* Back Button */}
      <button
        className="btn btn-secondary mb-3"
        onClick={() => navigate("/clinicalrecords/vitals")}
      >
        Back to List
      </button>

      <table className="table table-bordered">
        <tbody>
          <tr>
            <th>ID</th>
            <td>{vital.id}</td>
          </tr>
          <tr>
            <th>Patient ID</th>
            <td>{vital.patientId}</td>
          </tr>
          <tr>
            <th>Encounter ID</th>
            <td>{vital.encounterId}</td>
          </tr>
          <tr>
            <th>Type</th>
            <td>{vital.type}</td>
          </tr>
          <tr>
            <th>Value</th>
            <td>{vital.value}</td>
          </tr>
          <tr>
            <th>Unit</th>
            <td>{vital.unit}</td>
          </tr>
          <tr>
            <th>Measured At</th>
            <td>{new Date(vital.measuredAt).toLocaleString()}</td>
          </tr>
          <tr>
            <th>Recorded By</th>
            <td>{vital.recordedBy}</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}
