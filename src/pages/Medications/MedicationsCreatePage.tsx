import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaArrowLeft, FaSave } from "react-icons/fa";
import { createMedication } from "../../api/medicationApi"; // ⬅️ NEW IMPORT (adjust path if needed)

const MedicationCreatePage: React.FC = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    rxnorm_code: "",
    form: "",
    strength: "",
  });

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

    try {
      // Map rxnorm_code (UI) -> rxnormCode (backend DTO)
      await createMedication({
        name: formData.name,
        rxnormCode: formData.rxnorm_code,
        form: formData.form,
        strength: formData.strength,
      });

      alert("Medication saved successfully.");
      navigate("/medications");
    } catch (error) {
      console.error("Error saving medication:", error);
      alert("Failed to save medication. Please try again.");
    }
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

          <h2 className="fw-semibold mb-0">Add Medication</h2>
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
                Save Medication
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default MedicationCreatePage;
