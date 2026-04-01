import React, { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { FaArrowLeft, FaSave } from "react-icons/fa";

import { getAllPatients } from "../../api/patientApi";
import { PatientResponse } from "../../types/Patient";
import { getAllProviders } from "../../api/providerApi";
import { ProviderResponse } from "../../types/provider";
import { Medication, fetchMedications } from "../../api/medicationApi";
import {
  fetchPrescriptionById,
  updatePrescription,
} from "../../api/prescriptionApi";

const PrescriptionEditPage: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  const [formData, setFormData] = useState({
    patient_id: "",
    encounter_id: "",
    prescribed_by: "",
    medication_id: "",
    sig: "",
    dose: "",
    frequency: "",
    quantity: "",
    refills: "",
    start_date: "",
    end_date: "",
    status: "",
  });

  const [patients, setPatients] = useState<PatientResponse[]>([]);
  const [loadingPatients, setLoadingPatients] = useState(true);

  const [providers, setProviders] = useState<ProviderResponse[]>([]);
  const [loadingProviders, setLoadingProviders] = useState(true);
  const [providerInput, setProviderInput] = useState("");
  const [isProviderOpen, setIsProviderOpen] = useState(false);

  const [medications, setMedications] = useState<Medication[]>([]);
  const [medSearch, setMedSearch] = useState("");
  const [showMedDropdown, setShowMedDropdown] = useState(false);

  const [loadingPrescription, setLoadingPrescription] = useState(true);
  const loading = loadingPrescription || loadingPatients || loadingProviders;

  // load patients, providers, medications (same as create)
  useEffect(() => {
    const loadPatients = async () => {
      try {
        const data = await getAllPatients();
        setPatients(data);
      } catch (error) {
        console.error("Error loading patients:", error);
      } finally {
        setLoadingPatients(false);
      }
    };

    const loadProviders = async () => {
      try {
        const data = await getAllProviders();
        setProviders(data);
      } catch (error) {
        console.error("Error loading providers:", error);
      } finally {
        setLoadingProviders(false);
      }
    };

    const loadMeds = async () => {
      try {
        const data = await fetchMedications();
        setMedications(data);
      } catch (e) {
        console.error("Failed to load medications", e);
      }
    };

    loadPatients();
    loadProviders();
    loadMeds();
  }, []);

  // load existing prescription
  useEffect(() => {
    const load = async () => {
      if (!id) return;
      try {
        const p = await fetchPrescriptionById(Number(id));

        setFormData({
          patient_id: String(p.patientId),
          encounter_id: "", // keep empty, we always send null
          prescribed_by: String(p.prescribedBy),
          medication_id: String(p.medicationId),
          sig: p.sig || "",
          dose: p.dose || "",
          frequency: p.frequency || "",
          quantity: String(p.quantity ?? ""),
          refills: String(p.refills ?? ""),
          start_date: p.startDate || "",
          end_date: p.endDate || "",
          status: p.status || "",
        });
      } catch (err) {
        console.error("Failed to load prescription", err);
        alert("Failed to load prescription.");
        navigate("/medications/prescriptions");
      } finally {
        setLoadingPrescription(false);
      }
    };

    load();
  }, [id, navigate]);

  // set providerInput label from loaded data
  useEffect(() => {
    if (!formData.prescribed_by || providers.length === 0) return;
    const pr = providers.find(
      (p) => String(p.id) === String(formData.prescribed_by)
    );
    if (pr) {
      const label =
        pr.providerName +
        (pr.specialization ? ` (${pr.specialization})` : "");
      setProviderInput(label);
    }
  }, [providers, formData.prescribed_by]);

  // set medication search label from loaded data
  useEffect(() => {
    if (!formData.medication_id || medications.length === 0) return;
    const m = medications.find(
      (mm) => String(mm.id) === String(formData.medication_id)
    );
    if (m) {
      const label =
        m.name +
        (m.form || m.strength
          ? ` (${m.form || ""} ${m.strength || ""})`
          : "") +
        (m.rxnormCode ? ` - ${m.rxnormCode}` : "");
      setMedSearch(label);
    }
  }, [medications, formData.medication_id]);

  const filteredProviders = useMemo(
    () =>
      providers.filter((p) => {
        const text = (
          (p.providerName || "") +
          " " +
          (p.specialization || "")
        ).toLowerCase();
        return text.includes(providerInput.toLowerCase());
      }),
    [providers, providerInput]
  );

  const filteredMeds = useMemo(
    () =>
      medications.filter((m) => {
        const label =
          (m.name || "") +
          " " +
          (m.form || "") +
          " " +
          (m.strength || "") +
          " " +
          (m.rxnormCode || "");
        return (
          label.toLowerCase().includes(medSearch.toLowerCase()) ||
          String(m.id).includes(medSearch)
        );
      }),
    [medications, medSearch]
  );

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleProviderSelect = (pr: ProviderResponse) => {
    const label =
      pr.providerName +
      (pr.specialization ? ` (${pr.specialization})` : "");

    setProviderInput(label);
    setFormData((prev) => ({
      ...prev,
      prescribed_by: String(pr.id),
    }));
    setIsProviderOpen(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id) return;

    try {
      await updatePrescription(Number(id), {
        patientId: Number(formData.patient_id),
        encounterId: null, // keep encounterId null as required
        prescribedBy: Number(formData.prescribed_by),
        medicationId: Number(formData.medication_id),
        sig: formData.sig,
        dose: formData.dose,
        frequency: formData.frequency,
        quantity: Number(formData.quantity || 0),
        refills: Number(formData.refills || 0),
        startDate: formData.start_date,
        endDate: formData.end_date,
        status: formData.status,
      });

      alert("Prescription updated successfully.");
      navigate("/medications/prescriptions");
    } catch (err) {
      console.error("Failed to update prescription", err);
      alert("Failed to update prescription. Please try again.");
    }
  };

  if (loading) {
    return (
      <div className="container-fluid px-2 px-sm-3 px-md-4">
        <div className="mx-auto" style={{ maxWidth: "750px" }}>
          <p className="mt-4">Loading prescription...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container-fluid px-2 px-sm-3 px-md-4">
      <div className="mx-auto" style={{ maxWidth: "750px" }}>
        {/* Header */}
        <div className="d-flex align-items-center mb-4">
          <button
            className="btn btn-light border me-3"
            onClick={() => navigate("/medications/prescriptions")}
          >
            <FaArrowLeft className="me-1" />
            Back
          </button>

          <h2 className="fw-semibold mb-0">Edit Prescription</h2>
        </div>

        {/* Form Card */}
        <div className="card shadow-sm border-0 rounded-4 p-4">
          <form onSubmit={handleSubmit}>
            {/* patient_id */}
            <div className="mb-3">
              <label className="form-label fw-semibold">Patient ID</label>
              <select
                name="patient_id"
                className="form-select"
                value={formData.patient_id}
                onChange={handleChange}
                required
              >
                <option value="">Select patient</option>

                {loadingPatients ? (
                  <option>Loading...</option>
                ) : patients.length === 0 ? (
                  <option>No patients found</option>
                ) : (
                  patients.map((p) => (
                    <option key={p.id} value={String(p.id)}>
                      {p.firstName} {p.lastName} (ID: {p.id})
                    </option>
                  ))
                )}
              </select>
            </div>

            {/* encounter_id */}
            <div className="mb-3">
              <label className="form-label fw-semibold">Encounter ID</label>
              <input
                type="number"
                name="encounter_id"
                className="form-control"
                placeholder="(kept for future use, will be sent as null)"
                value={formData.encounter_id}
                onChange={handleChange}
              />
            </div>

            {/* Prescribed By */}
            <div className="mb-3 position-relative">
              <label className="form-label fw-semibold">Prescribed By</label>

              <input
                type="text"
                className="form-control"
                placeholder={
                  loadingProviders
                    ? "Loading providers..."
                    : "Search & select provider..."
                }
                value={providerInput}
                onChange={(e) => {
                  setProviderInput(e.target.value);
                  setIsProviderOpen(true);
                }}
                onFocus={() => setIsProviderOpen(true)}
                onBlur={() => {
                  setTimeout(() => setIsProviderOpen(false), 150);
                }}
                autoComplete="off"
              />

              {isProviderOpen && !loadingProviders && (
                <div
                  className="dropdown-menu show w-100"
                  style={{ maxHeight: "200px", overflowY: "auto" }}
                >
                  {filteredProviders.length === 0 ? (
                    <button className="dropdown-item disabled" type="button">
                      No providers found
                    </button>
                  ) : (
                    filteredProviders.map((pr) => (
                      <button
                        key={pr.id}
                        type="button"
                        className="dropdown-item"
                        onMouseDown={() => handleProviderSelect(pr)}
                      >
                        {pr.providerName}
                        {pr.specialization ? ` (${pr.specialization})` : ""}
                      </button>
                    ))
                  )}
                </div>
              )}

              <small className="text-muted">
                Start typing a provider name or specialization, then select from
                the list.
              </small>
            </div>

            {/* medication_id */}
            <div className="mb-3 position-relative">
              <label className="form-label fw-semibold">Medication</label>

              <input
                type="text"
                className="form-control"
                placeholder="Search & select medication..."
                value={medSearch}
                onChange={(e) => {
                  setMedSearch(e.target.value);
                  setShowMedDropdown(true);
                }}
                onFocus={() => setShowMedDropdown(true)}
                onBlur={() => {
                  setTimeout(() => setShowMedDropdown(false), 150);
                }}
                autoComplete="off"
              />

              {showMedDropdown && filteredMeds.length > 0 && (
                <div
                  className="dropdown-menu show w-100"
                  style={{ maxHeight: "200px", overflowY: "auto" }}
                >
                  {filteredMeds.map((m) => (
                    <button
                      key={m.id}
                      type="button"
                      className="dropdown-item"
                      onMouseDown={() => {
                        setFormData((prev) => ({
                          ...prev,
                          medication_id: String(m.id),
                        }));
                        const label =
                          m.name +
                          (m.form || m.strength
                            ? ` (${m.form || ""} ${m.strength || ""})`
                            : "") +
                          (m.rxnormCode ? ` - ${m.rxnormCode}` : "");
                        setMedSearch(label);
                        setShowMedDropdown(false);
                      }}
                    >
                      {m.name}
                      {m.form || m.strength
                        ? ` (${m.form || ""} ${m.strength || ""})`
                        : ""}
                      {m.rxnormCode ? ` - ${m.rxnormCode}` : ""}
                    </button>
                  ))}
                </div>
              )}

              <small className="text-muted">
                Start typing a medication name, form, strength, or RxNorm, then
                select from the list.
              </small>
            </div>

            {/* sig */}
            <div className="mb-3">
              <label className="form-label fw-semibold">
                SIG (Instructions)
              </label>
              <input
                type="text"
                name="sig"
                className="form-control"
                placeholder="e.g., Take 1 tablet twice a day"
                value={formData.sig}
                onChange={handleChange}
                required
              />
            </div>

            {/* dose */}
            <div className="mb-3">
              <label className="form-label fw-semibold">Dose</label>
              <input
                type="text"
                name="dose"
                className="form-control"
                placeholder="e.g., 500mg"
                value={formData.dose}
                onChange={handleChange}
                required
              />
            </div>

            {/* frequency */}
            <div className="mb-3">
              <label className="form-label fw-semibold">Frequency</label>
              <input
                type="text"
                name="frequency"
                className="form-control"
                placeholder="e.g., 2 times/day"
                value={formData.frequency}
                onChange={handleChange}
                required
              />
            </div>

            {/* quantity */}
            <div className="mb-3">
              <label className="form-label fw-semibold">Quantity</label>
              <input
                type="number"
                name="quantity"
                className="form-control"
                placeholder="e.g., 30"
                value={formData.quantity}
                onChange={handleChange}
                required
              />
            </div>

            {/* refills */}
            <div className="mb-3">
              <label className="form-label fw-semibold">Refills</label>
              <input
                type="number"
                name="refills"
                className="form-control"
                placeholder="e.g., 2"
                value={formData.refills}
                onChange={handleChange}
                required
              />
            </div>

            {/* start_date */}
            <div className="mb-3">
              <label className="form-label fw-semibold">Start Date</label>
              <input
                type="date"
                name="start_date"
                className="form-control"
                value={formData.start_date}
                onChange={handleChange}
                required
              />
            </div>

            {/* end_date */}
            <div className="mb-3">
              <label className="form-label fw-semibold">End Date</label>
              <input
                type="date"
                name="end_date"
                className="form-control"
                value={formData.end_date}
                onChange={handleChange}
                required
              />
            </div>

            {/* status */}
            <div className="mb-3">
              <label className="form-label fw-semibold">Status</label>
              <select
                name="status"
                className="form-select"
                value={formData.status}
                onChange={handleChange}
                required
              >
                <option value="">Select status</option>
                <option value="active">Active</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>

            {/* Buttons */}
            <div className="d-flex justify-content-end mt-4">
              <button
                type="button"
                className="btn btn-light border me-3"
                onClick={() => navigate("/medications/prescriptions")}
              >
                Cancel
              </button>

              <button
                type="submit"
                className="btn btn-primary d-flex align-items-center"
              >
                <FaSave className="me-2" />
                Update Prescription
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default PrescriptionEditPage;
