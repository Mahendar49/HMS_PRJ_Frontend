// src/pages/features/RoleFeatureManager.tsx
import React, { useEffect, useState } from "react";
import {
  getAllRoles,
  mlGetFeatureTree,
  getRoleFeatures,
  assignFeatureToRole,
  assignMultipleFeaturesToRole,
  removeSingleFeatureFromRole,
  removeAllFeaturesFromRole,
} from "../../api/authApi";

import { toast } from "react-toastify";
import {
  FaTrash,
  FaPlus,
  FaSyncAlt,
  FaCheckCircle,
  FaShieldAlt,
} from "react-icons/fa";

export default function RoleFeatureManager() {
  const [roles, setRoles] = useState<any[]>([]);
  const [features, setFeatures] = useState<any[]>([]);
  const [selectedRole, setSelectedRole] = useState<number | null>(null);
  const [assignedFeatures, setAssignedFeatures] = useState<number[]>([]);
  const [selectedFeatureIds, setSelectedFeatureIds] = useState<number[]>([]);

  // Load Roles + Feature Tree
  useEffect(() => {
    async function fetchData() {
      try {
        const [rolesRes, featuresRes] = await Promise.all([
          getAllRoles(),
          mlGetFeatureTree(),
        ]);
        setRoles(rolesRes);
        setFeatures(featuresRes);
      } catch (err) {
        toast.error("Failed to load roles or features");
      }
    }
    fetchData();
  }, []);

  // Load assigned feature IDs for selected role
  useEffect(() => {
    if (!selectedRole) return;
    async function loadRoleFeatures() {
      try {
        const res = await getRoleFeatures(selectedRole as number);
        setAssignedFeatures(res.map((f: any) => f.id));
      } catch {
        toast.error("Failed to load assigned features");
      }
    }
    loadRoleFeatures();
  }, [selectedRole]);

  // Assign Single Feature
  const handleAssignSingle = async (featureId: number) => {
    if (!selectedRole) return;
    try {
      await assignFeatureToRole(selectedRole, featureId);
      setAssignedFeatures((prev) => [...prev, featureId]);
      toast.success("Feature assigned successfully");
    } catch {
      toast.error("Failed to assign feature");
    }
  };

  // Assign Multiple
  const handleAssignMultiple = async () => {
    if (!selectedRole || selectedFeatureIds.length === 0) return;
    try {
      await assignMultipleFeaturesToRole(selectedRole, selectedFeatureIds);
      setAssignedFeatures((prev) => [
        ...new Set([...prev, ...selectedFeatureIds]),
      ]);
      setSelectedFeatureIds([]);
      toast.success("Multiple features assigned");
    } catch {
      toast.error("Failed to assign selected features");
    }
  };

  // Remove Single Feature
  const handleRemoveSingle = async (featureId: number) => {
    if (!selectedRole) return;
    try {
      await removeSingleFeatureFromRole(selectedRole, featureId);
      setAssignedFeatures((prev) => prev.filter((id) => id !== featureId));
      toast.info("Feature removed");
    } catch {
      toast.error("Failed to remove feature");
    }
  };

  // Remove All Features
  const handleRemoveAll = async () => {
    if (!selectedRole) return;
    try {
      await removeAllFeaturesFromRole(selectedRole);
      setAssignedFeatures([]);
      toast.info("All features removed");
    } catch {
      toast.error("Failed to remove all features");
    }
  };

  return (
    <div className="container mt-4">
      {/* Page Header */}
      <h3 className="fw-bold text-primary d-flex align-items-center mb-4">
        <FaShieldAlt className="me-2" />
        Role Feature Management
      </h3>

      <div className="card shadow-sm border-0 rounded-4">
        <div className="card-body">
          {/* Select Role Dropdown */}
          <div className="mb-4">
            <label className="fw-semibold text-primary">Select Role</label>
            <select
              className="form-select shadow-sm mt-2 w-auto"
              value={selectedRole ?? ""}
              onChange={(e) => setSelectedRole(Number(e.target.value))}
            >
              <option value="">-- Select Role --</option>
              {roles.map((role) => (
                <option key={role.id} value={role.id}>
                  {role.name}
                </option>
              ))}
            </select>
          </div>

          {selectedRole && (
            <div className="row g-4">
              {/* LEFT - All Features */}
              <div className="col-md-6">
                <div className="card shadow-sm border-0 rounded-4">
                  <div className="card-header bg-success text-white fw-semibold rounded-top-4">
                    Available Features
                  </div>

                  <div className="card-body p-0">
                    {features.length === 0 ? (
                      <p className="text-center text-muted py-3">
                        No features available.
                      </p>
                    ) : (
                      <div
                        className="list-group list-group-flush"
                        style={{ maxHeight: "450px", overflowY: "auto" }}
                      >
                        {features.map((f) => (
                          <div
                            className="list-group-item d-flex justify-content-between align-items-center"
                            key={f.id}
                          >
                            <div className="form-check">
                              <input
                                type="checkbox"
                                className="form-check-input"
                                checked={selectedFeatureIds.includes(f.id)}
                                onChange={(e) =>
                                  setSelectedFeatureIds((prev) =>
                                    e.target.checked
                                      ? [...prev, f.id]
                                      : prev.filter((id) => id !== f.id)
                                  )
                                }
                              />
                              <label className="form-check-label ms-2">
                                {f.name}
                              </label>
                            </div>

                            <button
                              className="btn btn-sm btn-outline-success rounded-pill"
                              onClick={() => handleAssignSingle(f.id)}
                            >
                              <FaPlus className="me-1" /> Assign
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="card-footer text-end bg-light rounded-bottom-4">
                    <button
                      className="btn btn-primary px-4 rounded-pill shadow-sm"
                      disabled={selectedFeatureIds.length === 0}
                      onClick={handleAssignMultiple}
                    >
                      <FaCheckCircle className="me-2" />
                      Assign Selected
                    </button>
                  </div>
                </div>
              </div>

              {/* RIGHT - Assigned Features */}
              <div className="col-md-6">
                <div className="card shadow-sm border-0 rounded-4">
                  <div className="card-header bg-danger text-white fw-semibold rounded-top-4">
                    Assigned Features
                  </div>

                  <div className="card-body p-0">
                    {assignedFeatures.length === 0 ? (
                      <p className="text-center text-muted py-3">
                        No features assigned.
                      </p>
                    ) : (
                      <div
                        className="list-group list-group-flush"
                        style={{ maxHeight: "450px", overflowY: "auto" }}
                      >
                        {features
                          .filter((f) => assignedFeatures.includes(f.id))
                          .map((f) => (
                            <div
                              className="list-group-item d-flex justify-content-between align-items-center"
                              key={f.id}
                            >
                              <span className="fw-semibold">{f.name}</span>

                              <button
                                className="btn btn-sm btn-outline-danger rounded-pill"
                                onClick={() => handleRemoveSingle(f.id)}
                              >
                                <FaTrash className="me-1" />
                                Remove
                              </button>
                            </div>
                          ))}
                      </div>
                    )}
                  </div>

                  <div className="card-footer text-end bg-light rounded-bottom-4">
                    <button
                      className="btn btn-danger px-4 rounded-pill shadow-sm"
                      onClick={handleRemoveAll}
                    >
                      <FaTrash className="me-2" />
                      Remove All
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
