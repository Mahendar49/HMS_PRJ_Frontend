import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { FaArrowLeft, FaSave } from "react-icons/fa";
import { fetchMedicationById, updateMedication } from "../../api/medicationApi";

// later we can use this to load/update from backend
// import { fetchMedicationById, updateMedication } from "../../api/medicationApi";

const MedicationEditPage: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  const [formData, setFormData] = useState({
    name: "",
    rxnorm_code: "",
    form: "",
    strength: "",
  });

  // 🔹 Later we’ll load data from backend here using the id
  useEffect(() => {
  if (!id) return;

  const load = async () => {
    const med = await fetchMedicationById(Number(id));
    setFormData({
      name: med.name,
      rxnorm_code: med.rxnormCode || "",
      form: med.form || "",
      strength: med.strength || "",
    });
  };

  load();
}, [id]);


  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  if (!id) return;

  await updateMedication(Number(id), {
    name: formData.name,
    rxnormCode: formData.rxnorm_code,
    form: formData.form,
    strength: formData.strength,
  });

  alert("Medication updated successfully.");
  navigate("/medications");
};


  return (
    <div className="container-fluid px-2 px-sm-3 px-md-4">
      <div className="mx-auto" style={{ maxWidth: "700px" }}>
        {/* Header */}
        <div className="d-flex align-items-center mb-4">
          <button
            className="btn btn-light border me-3"
            onClick={() => navigate("/medications")}
          >
            <FaArrowLeft className="me-1" />
            Back
          </button>

          <h2 className="fw-semibold mb-0">Edit Medication</h2>
        </div>

        {/* Form Card */}
        <div className="card shadow-sm border-0 rounded-4 p-4">
          <form onSubmit={handleSubmit}>
            {/* Name */}
            <div className="mb-3">
              <label className="form-label fw-semibold">Name</label>
              <input
                type="text"
                name="name"
                className="form-control"
                placeholder="e.g., Amoxicillin"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>

            {/* RxNorm Code */}
            <div className="mb-3">
              <label className="form-label fw-semibold">RxNorm Code</label>
              <input
                type="text"
                name="rxnorm_code"
                className="form-control"
                placeholder="e.g., RX1001"
                value={formData.rxnorm_code}
                onChange={handleChange}
                required
              />
            </div>

            {/* Form */}
            <div className="mb-3">
              <label className="form-label fw-semibold">Form</label>
              <select
                name="form"
                className="form-select"
                value={formData.form}
                onChange={handleChange}
                required
              >
                <option value="">Select form</option>
                <option value="tablet">Tablet</option>
                <option value="capsule">Capsule</option>
                <option value="injection">Injection</option>
                <option value="syrup">Syrup</option>
              </select>
            </div>

            {/* Strength */}
            <div className="mb-3">
              <label className="form-label fw-semibold">Strength</label>
              <input
                type="text"
                name="strength"
                className="form-control"
                placeholder="e.g., 500mg"
                value={formData.strength}
                onChange={handleChange}
                required
              />
            </div>

            {/* Buttons */}
            <div className="d-flex justify-content-end mt-4">
              <button
                type="button"
                className="btn btn-light border me-3"
                onClick={() => navigate("/medications")}
              >
                Cancel
              </button>

              <button
                type="submit"
                className="btn btn-primary d-flex align-items-center"
              >
                <FaSave className="me-2" />
                Update Medication
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default MedicationEditPage;
