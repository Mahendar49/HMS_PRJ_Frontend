import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { getRoles } from "../../api/rolesApi";
import { Role } from "../../types";
import { assignRoleToUser } from "../../api/userApi";

function AssignRoles() {
  const [roles, setRoles] = useState<Role[]>([]);
  const [selectedRoleId, setSelectedRoleId] = useState<string>("");
  const { userId } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRoles = async () => {
      try {
        const data = await getRoles();
        setRoles(data);
      } catch (err) {
        toast.error("Failed to load roles");
      }
    };

    fetchRoles();
  }, []);

  const handleRoleAssignment = async () => {
    if (!selectedRoleId) {
      toast.warning("Please select a role");
      return;
    }

    // Find the selected role to get the role name
    const selectedRole = roles.find(
      (role) => role.id === Number(selectedRoleId)
    );
    if (!selectedRole) {
      toast.error("Selected role not found");
      return;
    }

    console.log("🚀 Starting role assignment:", {
      userId: Number(userId),
      selectedRoleId: Number(selectedRoleId),
      roleName: selectedRole.name,
    });

    try {
      const token = localStorage.getItem("authToken");
      if (!token) {
        toast.error("Not authenticated - please log in again");
        return;
      }

      toast.info("Assigning role...", {
        autoClose: false,
        toastId: "assigning",
      });

      const res = await assignRoleToUser(
        Number(userId),
        selectedRole.name,
        token
      );

      toast.dismiss("assigning");
      toast.success("Role assigned successfully!");
      navigate("/admin/users");
    } catch (err: any) {
      toast.dismiss("assigning");
      console.error("💥 Role assignment failed:", err);

      if (err.message?.includes("Permission denied")) {
        toast.error("Permission Denied: You don't have rights to assign roles");
      } else if (err.message?.includes("Authentication failed")) {
        toast.error("Please log in again");
      } else {
        toast.error(err.message || "Failed to assign role");
      }
    }
  };

  return (
    <div className="container mt-4">
      <h4 className="mb-3">Assign Role to User (ID: {userId})</h4>
      <div className="d-flex gap-3 align-items-center">
        <select
          className="form-select"
          value={selectedRoleId}
          onChange={(e) => setSelectedRoleId(e.target.value)}
        >
          <option value="">Select Role</option>
          {roles.map((role) => (
            <option key={role.id} value={role.id}>
              {role.name}
            </option>
          ))}
        </select>

        <button onClick={handleRoleAssignment} className="btn btn-primary">
          Assign Role
        </button>
      </div>

      <button
        className="btn btn-outline-secondary mt-3"
        onClick={() => navigate("/admin/users")}
      >
        ← Back to Users
      </button>
    </div>
  );
}

export default AssignRoles;
