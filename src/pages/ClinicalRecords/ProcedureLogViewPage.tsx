// src/pages/ProcedureLog/ProcedureLogViewPage.tsx
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getProcedureLogById } from "../../api/procedureLogApi";
import type { ProcedureLogResponse } from "../../types/ProcedureLog";

export default function ProcedureLogViewPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [procedureLog, setProcedureLog] = useState<ProcedureLogResponse | null>(null);

  useEffect(() => {
    if (id) fetchProcedureLog(parseInt(id));
  }, [id]);

  const fetchProcedureLog = async (plId: number) => {
    try {
      const res = await getProcedureLogById(plId);
      setProcedureLog(res.data);
    } catch (err) {
      console.error("Error fetching procedure log", err);
    }
  };

  if (!procedureLog) {
    return (
      <div className="p-3">
        <p>Loading procedure log details...</p>
      </div>
    );
  }

  return (
    <div>
      <h3>Procedure Log Details</h3>
      <table className="table table-bordered">
        <tbody>
          <tr>
            <th>ID</th>
            <td>{procedureLog.id}</td>
          </tr>
          <tr>
            <th>Patient ID</th>
            <td>{procedureLog.patientId}</td>
          </tr>
          <tr>
            <th>Encounter ID</th>
            <td>{procedureLog.encounterId}</td>
          </tr>
          <tr>
            <th>Code</th>
            <td>{procedureLog.code}</td>
          </tr>
          <tr>
            <th>Description</th>
            <td>{procedureLog.description}</td>
          </tr>
          <tr>
            <th>Performed At</th>
            <td>{procedureLog.performedAt}</td>
          </tr>
          <tr>
            <th>Performed By</th>
            <td>{procedureLog.performedBy}</td>
          </tr>
          <tr>
            <th>Created At</th>
            <td>{procedureLog.createdAt}</td>
          </tr>
        </tbody>
      </table>
      <button
        className="btn btn-secondary"
        onClick={() => navigate("/clinicalrecords/procedure-logs")}
      >
        Back
      </button>
    </div>
  );
}
