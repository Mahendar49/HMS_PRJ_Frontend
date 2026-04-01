// src/pages/users/ViewUser.tsx
import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { getUserById } from "../../api/userApi";
import {
  User as UserIcon,
  Shield,
  Mail,
  Phone,
  Calendar,
  MapPin,
  Edit,
} from "lucide-react";

export default function ViewUser() {
  const { id } = useParams();
  const [userData, setUserData] = useState<any>(null);
  const token = localStorage.getItem("authToken");
  const navigate = useNavigate();

  useEffect(() => {
    if (!id || !token) return;
    getUserById(Number(id), token)
      .then((data) => setUserData(data))
      .catch((err) => alert(err.message));
  }, [id, token]);

  if (!userData) return <div className="text-center mt-5">Loading...</div>;
  const { user, profile, roles } = userData;

  const roleBadge = (name: string) => {
    if (name.includes("ADMIN")) return "badge bg-danger";
    if (name.includes("USER")) return "badge bg-success";
    if (name.includes("MOD")) return "badge bg-warning text-dark";
    return "badge bg-primary";
  };

  return (
    <div className="container mt-4">
      <div className="card shadow-sm">
        <div className="card-body">
          <div className="d-flex justify-content-between align-items-center mb-3">
            <div className="d-flex align-items-center gap-2">
              <UserIcon className="me-2" />
              <h4 className="mb-0">User Profile</h4>
            </div>

            <div>
              <button
                className="btn btn-warning me-2"
                onClick={() => navigate(`/users/${id}/edit`)}
              >
                <Edit className="me-1" /> Edit User
              </button>
              <button
                className="btn btn-primary"
                onClick={() => navigate("/admin/users")}
              >
                Back to Users List
              </button>
            </div>
          </div>

          <div className="row">
            <div className="col-md-6">
              <p className="text-muted mb-1">Full Name</p>
              <h5>
                {profile.firstName} {profile.lastName}
              </h5>

              <p className="text-muted mt-3 mb-1">Email</p>
              <p>{user.email}</p>

              <p className="text-muted mt-3 mb-1">Mobile</p>
              <p>{profile.mobile}</p>
            </div>

            <div className="col-md-6">
              <p className="text-muted mb-1">Date of Birth</p>
              <p>
                {profile.dob ? new Date(profile.dob).toLocaleDateString() : "-"}
              </p>

              <p className="text-muted mt-3 mb-1">Address</p>
              <p>{profile.address}</p>

              <p className="text-muted mt-3 mb-1">Account Status</p>
              <p>
                <span
                  className={`me-2 ${
                    user.enabled ? "badge bg-success" : "badge bg-danger"
                  }`}
                >
                  {user.enabled ? "Active" : "Disabled"}
                </span>
                <span
                  className={`${
                    user.locked ? "badge bg-danger" : "badge bg-success"
                  }`}
                >
                  {user.locked ? "Locked" : "Not Locked"}
                </span>
              </p>
            </div>
          </div>

          <hr />

          <div className="d-flex justify-content-between align-items-start">
            <div>
              <h6>Role</h6>
              <div className="mt-2">
                {roles && roles.length ? (
                  roles.map((r: any) => (
                    <span
                      key={r.id}
                      className={`${roleBadge(r.name)} me-2`}
                      title={r.description}
                    >
                      {r.name.replace("ROLE_", "")}
                    </span>
                  ))
                ) : (
                  <p className="text-muted">No roles assigned.</p>
                )}
              </div>
            </div>

            <div className="text-muted small">
              <div>
                Created:{" "}
                {profile.createdAt
                  ? new Date(profile.createdAt).toLocaleString()
                  : "-"}
              </div>
              <div>
                Updated:{" "}
                {profile.updatedAt
                  ? new Date(profile.updatedAt).toLocaleString()
                  : "-"}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
