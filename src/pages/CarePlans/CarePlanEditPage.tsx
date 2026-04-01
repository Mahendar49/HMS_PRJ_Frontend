// src/pages/CarePlans/CarePlanEditPage.tsx

import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  fetchCarePlanById,
  updateCarePlan,
  CarePlan,
  CarePlanUpdatePayload,
} from "../../api/carePlanApi";

const CarePlanEditPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [carePlan, setCarePlan] = useState<CarePlan | null>(null);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [active, setActive] = useState(true);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // load existing care plan
  useEffect(() => {
    if (!id) return;
    loadCarePlan(parseInt(id, 10));
  }, [id]);

  const loadCarePlan = async (carePlanId: number) => {
    try {
      setLoading(true);
      const data = await fetchCarePlanById(carePlanId);
      setCarePlan(data);
      setName(data.name || "");
      setDescription(data.description || "");
      setActive(data.active);
    } catch (err) {
      console.error("Failed to load care plan", err);
      alert("Failed to load care plan");
      navigate("/careplans");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id) return;

    if (!name.trim()) {
      alert("Name is required");
      return;
    }

    const payload: CarePlanUpdatePayload = {
      name: name.trim(),
      description: description.trim(),
      active,
    };

    try {
      setSaving(true);
      await updateCarePlan(parseInt(id, 10), payload);
      navigate("/careplans");
    } catch (err) {
      console.error("Failed to update care plan", err);
      alert("Failed to update care plan");
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    navigate("/careplans");
  };

  if (loading) {
    return (
      <div className="container-fluid mt-3">
        <div className="p-3 text-center text-muted">Loading...</div>
      </div>
    );
  }

  if (!carePlan) {
    return (
      <div className="container-fluid mt-3">
        <div className="p-3 text-center text-muted">Care plan not found.</div>
      </div>
    );
  }

  return (
    <div className="container-fluid mt-3">
      {/* Back button */}
      <button
        type="button"
        className="btn btn-link mb-3"
        onClick={() => navigate(-1)}
      >
        <i className="bi bi-arrow-left" /> Back
      </button>

      <h2 className="mb-3">Edit Care Plan</h2>

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

                {/* Buttons */}
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
                    {saving ? "Saving..." : "Save Changes"}
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

export default CarePlanEditPage;
