// src/pages/CarePlans/CarePlanCreatePage.tsx

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createCarePlan, CarePlanCreatePayload } from "../../api/carePlanApi";

const CarePlanCreatePage: React.FC = () => {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [active, setActive] = useState(true);
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim()) {
      alert("Name is required");
      return;
    }

    const payload: CarePlanCreatePayload = {
      name: name.trim(),
      description: description.trim(),
      active,
    };

    try {
      setSaving(true);
      await createCarePlan(payload);
      // after save, go back to care plans list
      navigate("/careplans");
    } catch (err) {
      console.error("Failed to create care plan", err);
      alert("Failed to create care plan");
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    navigate("/careplans");
  };

  return (
    <div className="container-fluid mt-3">
      {/* Back button row (top left) */}
      <button
        type="button"
        className="btn btn-link mb-3"
        onClick={() => navigate(-1)}
      >
        <i className="bi bi-arrow-left" /> Back
      </button>

      {/* Page title (center content like Add Medication) */}
      <h2 className="mb-3">Add Care Plan</h2>

      {/* Centered card like your Add Medication UI */}
      <div className="row justify-content-center">
        <div className="col-lg-6 col-md-8 col-sm-12">
          <div className="card shadow-sm">
            <div className="card-body">
              <form onSubmit={handleSubmit}>
                {/* Name */}
                <div className="mb-3">
                  <label className="form-label">Name</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="e.g., Diabetes Management"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>

                {/* Description */}
                <div className="mb-3">
                  <label className="form-label">Description</label>
                  <textarea
                    className="form-control"
                    rows={3}
                    placeholder="Short description of this care plan"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                  />
                </div>

                {/* Active switch */}
                <div className="form-check form-switch mb-4">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    id="activeSwitch"
                    checked={active}
                    onChange={(e) => setActive(e.target.checked)}
                  />
                  <label className="form-check-label" htmlFor="activeSwitch">
                    Active
                  </label>
                </div>

                {/* Buttons row – Cancel + Save on right side */}
                <div className="d-flex justify-content-end">
                  <button
                    type="button"
                    className="btn btn-outline-secondary me-2"
                    onClick={handleCancel}
                    disabled={saving}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={saving}
                  >
                    {saving ? "Saving..." : "Save Care Plan"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CarePlanCreatePage;
