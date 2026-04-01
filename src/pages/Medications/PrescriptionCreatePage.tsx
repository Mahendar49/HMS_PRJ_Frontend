import { getAllPatients } from "../../api/patientApi";      // ✅ named export
import { PatientResponse } from "../../types/Patient"; 
import { getAllProviders } from "../../api/providerApi";
import { ProviderResponse } from "../../types/provider"; 
import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaArrowLeft, FaSave } from "react-icons/fa";
import { Medication, fetchMedications } from "../../api/medicationApi";
import { createPrescription } from "../../api/prescriptionApi";
import { getAllEncounters } from "../../api/encounterApi"; // ✅ added encounters

const PrescriptionCreatePage: React.FC = () => {
  const navigate = useNavigate();

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

  const [encounters, setEncounters] = useState<any[]>([]);
  const [loadingEncounters, setLoadingEncounters] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const data = await fetchMedications();
        setMedications(data);
      } catch (e) {
        console.error("Failed to load medications", e);
      }
    };
    load();
  }, []);

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

    const loadEncounters = async () => {
      try {
        const res = await getAllEncounters();
        setEncounters(res.data || []);
      } catch (err) {
        console.error("Error loading encounters", err);
      } finally {
        setLoadingEncounters(false);
      }
    };

    loadPatients();
    loadProviders();
    loadEncounters();
  }, []);

  const filteredProviders = useMemo(
    () =>
      providers.filter((p) => {
        const text = ((p.providerName || "") + " " + (p.specialization || "")).toLowerCase();
        return text.includes(providerInput.toLowerCase());
      }),
    [providers, providerInput]
  );

  const filteredMeds = useMemo(
    () =>
      medications.filter((m) => {
        const label = (m.name || "") + " " + (m.form || "") + " " + (m.strength || "") + " " + (m.rxnormCode || "");
        return label.toLowerCase().includes(medSearch.toLowerCase()) || String(m.id).includes(medSearch);
      }),
    [medications, medSearch]
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createPrescription({
        patientId: Number(formData.patient_id),
        encounterId: Number(formData.encounter_id),
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

      alert("Prescription saved successfully.");
      navigate("/medications/prescriptions");
    } catch (error) {
      console.error("Failed to save prescription:", error);
      alert("Failed to save prescription. Please try again.");
    }
  };

  const handleProviderSelect = (pr: ProviderResponse) => {
    const label = pr.providerName + (pr.specialization ? ` (${pr.specialization})` : "");
    setProviderInput(label);
    setFormData((prev) => ({ ...prev, prescribed_by: String(pr.id) }));
    setIsProviderOpen(false);
  };

  return (
    <div className="container-fluid px-2 px-sm-3 px-md-4">
      <div className="mx-auto" style={{ maxWidth: "750px" }}>
        <div className="d-flex align-items-center mb-4">
          <button className="btn btn-light border me-3" onClick={() => navigate("/medications/prescriptions")}>
            <FaArrowLeft className="me-1" /> Back
          </button>
          <h2 className="fw-semibold mb-0">Add Prescription</h2>
        </div>

        <div className="card shadow-sm border-0 rounded-4 p-4">
          <form onSubmit={handleSubmit}>
            {/* Patient Dropdown */}
            <div className="mb-3">
              <label className="form-label fw-semibold">Patient</label>
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

            {/* Encounter Dropdown */}
            <div className="mb-3">
              <label className="form-label fw-semibold">Encounter</label>
              <select
                name="encounter_id"
                className="form-select"
                value={formData.encounter_id}
                onChange={handleChange}
                required
              >
                <option value="">Select encounter</option>
                {loadingEncounters ? (
                  <option>Loading...</option>
                ) : encounters.length === 0 ? (
                  <option>No encounters found</option>
                ) : (
                  encounters.map((e) => (
                    <option key={e.id} value={e.id}>
                      {e.encounterCode || `Encounter-${e.id}`} (ID: {e.id})
                    </option>
                  ))
                )}
              </select>
            </div>

            {/* Prescribed By */}
            <div className="mb-3 position-relative">
              <label className="form-label fw-semibold">Prescribed By</label>
              <input
                type="text"
                className="form-control"
                placeholder={loadingProviders ? "Loading providers..." : "Search & select provider..."}
                value={providerInput}
                onChange={(e) => {
                  setProviderInput(e.target.value);
                  setIsProviderOpen(true);
                }}
                onFocus={() => setIsProviderOpen(true)}
                onBlur={() => setTimeout(() => setIsProviderOpen(false), 150)}
                autoComplete="off"
              />
              {isProviderOpen && !loadingProviders && (
                <div className="dropdown-menu show w-100" style={{ maxHeight: "200px", overflowY: "auto" }}>
                  {filteredProviders.length === 0 ? (
                    <button className="dropdown-item disabled" type="button">
                      No providers found
                    </button>
                  ) : (
                    filteredProviders.map((pr) => (
                      <button key={pr.id} type="button" className="dropdown-item" onMouseDown={() => handleProviderSelect(pr)}>
                        {pr.providerName}
                        {pr.specialization ? ` (${pr.specialization})` : ""}
                      </button>
                    ))
                  )}
                </div>
              )}
              <small className="text-muted">Start typing a provider name or specialization, then select from the list.</small>
            </div>

            {/* Medication */}
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
                onBlur={() => setTimeout(() => setShowMedDropdown(false), 150)}
                autoComplete="off"
              />
              {showMedDropdown && filteredMeds.length > 0 && (
                <div className="dropdown-menu show w-100" style={{ maxHeight: "200px", overflowY: "auto" }}>
                  {filteredMeds.map((m) => (
                    <button
                      key={m.id}
                      type="button"
                      className="dropdown-item"
                      onMouseDown={() => {
                        setFormData((prev) => ({ ...prev, medication_id: String(m.id) }));
                        setMedSearch(`${m.name}${m.form || m.strength ? ` (${m.form || ""} ${m.strength || ""})` : ""}${m.rxnormCode ? ` - ${m.rxnormCode}` : ""}`);
                        setShowMedDropdown(false);
                      }}
                    >
                      {m.name}
                      {m.form || m.strength ? ` (${m.form || ""} ${m.strength || ""})` : ""}
                      {m.rxnormCode ? ` - ${m.rxnormCode}` : ""}
                    </button>
                  ))}
                </div>
              )}
              <small className="text-muted">
                Start typing a medication name, form, strength, or RxNorm, then select from the list.
              </small>
            </div>

            {/* SIG */}
            <div className="mb-3">
              <label className="form-label fw-semibold">SIG (Instructions)</label>
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

            {/* Dose */}
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

            {/* Frequency */}
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

            {/* Quantity */}
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

            {/* Refills */}
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

            {/* Start Date */}
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

            {/* End Date */}
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

            {/* Status */}
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
              <button type="button" className="btn btn-light border me-3" onClick={() => navigate("/medications/prescriptions")}>
                Cancel
              </button>
              <button type="submit" className="btn btn-primary d-flex align-items-center">
                <FaSave className="me-2" /> Save Prescription
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default PrescriptionCreatePage;
