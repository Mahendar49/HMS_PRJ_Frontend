import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getEncounterById } from "../../api/encounterApi";

export default function EncounterViewPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [encounter, setEncounter] = useState<any>(null);

  useEffect(() => {
    if (id) {
      getEncounterById(Number(id))
        .then(res => setEncounter(res.data))
        .catch(err => console.error(err));
    }
  }, [id]);

  if (!encounter) return <div>Loading...</div>;

  return (
    <div style={{ maxWidth: "800px", margin: "40px auto" }}>
      <h1>View Encounter</h1>
      <p><strong>Patient ID:</strong> {encounter.patientId}</p>
      <p><strong>Appointment ID:</strong> {encounter.appointmentId}</p>
      <p><strong>Provider ID:</strong> {encounter.providerId}</p>
      <p><strong>Start Time:</strong> {encounter.startTime}</p>
      <p><strong>End Time:</strong> {encounter.endTime}</p>
      <p><strong>Type:</strong> {encounter.encounterType}</p>
      <p><strong>Chief Complaint:</strong> {encounter.chiefComplaint}</p>
      <p><strong>Note:</strong> {encounter.note}</p>
      <button onClick={() => navigate("/clinicalrecords/encounters")}>Back</button>
    </div>
  );
}
