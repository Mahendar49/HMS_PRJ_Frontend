import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import {
  FaUser,
  FaEnvelope,
  FaPhone,
  FaMapMarkerAlt,
  FaTransgender,
  FaArrowLeft,
  FaEdit,
  FaIdBadge,
} from "react-icons/fa";

import { getPatientById } from "../../api/patientApi";
import { PatientResponse } from "../../types/Patient";

export default function PatientDetails() {
  const { id } = useParams<{ id: string }>();
  const [patient, setPatient] = useState<PatientResponse | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPatient();
  }, []);

  const loadPatient = async () => {
    try {
      setLoading(true);
      const data = await getPatientById(Number(id));
      setPatient(data);
    } catch (err) {
      console.error("Failed to load patient", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading)
    return (
      <div className="text-center mt-5">
        <h4>Loading Patient Details...</h4>
      </div>
    );

  if (!patient)
    return (
      <div className="text-center mt-5">
        <h4>Patient Not Found</h4>
      </div>
    );

  // Convert ISO DOB to readable (optional)
  const dobFormatted = patient.dob
    ? new Date(patient.dob).toLocaleDateString()
    : "N/A";

  return (
    <div className="container mt-4">
      {/* Back Button */}
      <Link to="/patients" className="btn btn-outline-secondary mb-3">
        <FaArrowLeft /> Back to Patient List
      </Link>

      <div className="card shadow-lg border-0">
        <div className="card-body p-4">
          <h3 className="fw-bold text-primary mb-3">
            <FaUser /> {patient.firstName} {patient.lastName}
          </h3>

          <div className="row">
            {/* LEFT COLUMN */}
            <div className="col-md-6">
              <ul className="list-group list-group-flush">
                <li className="list-group-item">
                  <FaIdBadge className="text-primary" /> <strong>MRN:</strong>{" "}
                  {patient.mrn}
                </li>

                <li className="list-group-item">
                  <FaEnvelope className="text-primary" />{" "}
                  <strong>Email:</strong> {patient.email}
                </li>

                <li className="list-group-item">
                  <FaPhone className="text-primary" /> <strong>Mobile:</strong>{" "}
                  {patient.mobile}
                </li>

                <li className="list-group-item">
                  <FaTransgender className="text-primary" />{" "}
                  <strong>Gender:</strong> {patient.gender}
                </li>

                <li className="list-group-item">
                  <FaUser className="text-primary" />{" "}
                  <strong>Preferred Language:</strong>{" "}
                  {patient.preferredLanguage || "N/A"}
                </li>

                <li className="list-group-item">
                  <strong>Date of Birth:</strong> {dobFormatted}
                </li>
              </ul>
            </div>

            {/* RIGHT COLUMN */}
            <div className="col-md-6">
              <ul className="list-group list-group-flush">
                <li className="list-group-item">
                  <FaMapMarkerAlt className="text-primary" />{" "}
                  <strong>Address:</strong> {patient.address}
                </li>

                <li className="list-group-item">
                  <strong>City ID:</strong> {patient.cityId}
                </li>

                <li className="list-group-item">
                  <strong>State ID:</strong> {patient.stateId}
                </li>

                <li className="list-group-item">
                  <strong>Country ID:</strong> {patient.countryId}
                </li>

                <li className="list-group-item">
                  <strong>Postal Code:</strong> {patient.postalCode}
                </li>

                <li className="list-group-item">
                  <FaPhone className="text-danger" />{" "}
                  <strong>Emergency Contact:</strong>{" "}
                  {patient.emergencyContactName} (
                  {patient.emergencyContactPhone})
                </li>
              </ul>
            </div>
          </div>

          {/* ACTION BUTTON */}
          <div className="mt-4 d-flex gap-3">
            <Link
              to={`/patients/edit/${patient.userId}`}
              className="btn btn-warning"
            >
              <FaEdit /> Edit Patient
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
