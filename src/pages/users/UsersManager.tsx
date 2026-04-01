import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getAllUsers } from "../../api/userApi";
import { deleteUser } from "../../api/authApi";
import { FaSearch, FaEye, FaEdit, FaTrash, FaUserShield } from "react-icons/fa";

interface User {
  serId: number;
  firstName: string;
  lastName: string;
  email: string;
  mobile: string;
  role?: string;
}

export default function UsersManager() {
  const [users, setUsers] = useState<User[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showModal, setShowModal] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);
  const [usersPerPage, setUsersPerPage] = useState(5);

  const navigate = useNavigate();
  const token = localStorage.getItem("authToken");

  // Load users
  useEffect(() => {
    if (!token) return;
    getAllUsers(token)
      .then(setUsers)
      .catch((err) => console.error("Error:", err.message));
  }, [token]);

  // Filter Users
  const filteredUsers = users.filter(
    (u) =>
      u.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Pagination
  const totalPages = Math.ceil(filteredUsers.length / usersPerPage);
  const startIndex = (currentPage - 1) * usersPerPage;
  const currentUsers = filteredUsers.slice(
    startIndex,
    startIndex + usersPerPage
  );

  // Delete User
  const handleDelete = async (id: number) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;

    try {
      await deleteUser(id);
      setUsers(users.filter((u) => u.serId !== id));
      alert("User deleted successfully!");
    } catch (err: any) {
      alert(`Failed to delete user: ${err.message}`);
    }
  };

  return (
    <div className="container mt-4">
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h3 className="fw-bold text-primary">
          <i className="bi bi-person-lines-fill me-2"></i>
          Users Management
        </h3>

        <button
          className="btn btn-success shadow-sm rounded-3"
          onClick={() => navigate("/admin/register")}
        >
          + Create New User
        </button>
      </div>

      {/* Search + Filters */}
      <div className="card shadow-sm border-0 rounded-4 mb-4">
        <div className="card-body row g-3 p-3">
          {/* Search */}
          <div className="col-md-12">
            <label className="form-label fw-semibold text-primary">
              Search Users
            </label>
            <div className="input-group">
              <span className="input-group-text bg-white border-end-0">
                <FaSearch className="text-primary" />
              </span>
              <input
                type="text"
                className="form-control border-start-0"
                placeholder="Search by name or email..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1);
                }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Users Table */}
      <div className="card shadow-sm border-0 rounded-4">
        <div className="card-header bg-primary text-white fw-semibold py-3 rounded-top-4">
          All Users ({filteredUsers.length})
        </div>

        <div className="card-body p-0">
          <table className="table table-hover align-middle mb-0">
            <thead className="table-light">
              <tr>
                <th>#</th>
                <th>Name</th>
                <th>Email</th>
                <th>Mobile</th>
                <th>Role</th>
                <th className="text-center">Actions</th>
              </tr>
            </thead>

            <tbody>
              {currentUsers.map((u, index) => (
                <tr key={u.serId}>
                  <td>{(currentPage - 1) * usersPerPage + index + 1}</td>

                  <td className="fw-semibold">
                    {u.firstName} {u.lastName}
                  </td>
                  <td>{u.email}</td>
                  <td>{u.mobile}</td>

                  <td>
                    <span className="badge bg-info text-dark px-3 py-2 fw-semibold rounded-pill">
                      {u.role ?? "Not Assigned"}
                    </span>
                  </td>

                  {/* Actions */}
                  <td className="text-center">
                    <div className="btn-group">
                      <button
                        className="btn btn-sm btn-outline-info rounded-circle me-2"
                        onClick={() => navigate(`/users/${u.serId}/view`)}
                      >
                        <FaEye />
                      </button>

                      <button
                        className="btn btn-sm btn-outline-primary rounded-circle me-2"
                        onClick={() => navigate(`/users/${u.serId}/edit`)}
                      >
                        <FaEdit />
                      </button>

                      <button
                        className="btn btn-sm btn-outline-success rounded-circle me-2"
                        onClick={() =>
                          navigate(`/admin/users/assign-role/${u.serId}`)
                        }
                      >
                        <FaUserShield />
                      </button>

                      <button
                        className="btn btn-sm btn-outline-danger rounded-circle"
                        onClick={() => handleDelete(u.serId)}
                      >
                        <FaTrash />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}

              {filteredUsers.length === 0 && (
                <tr>
                  <td colSpan={6} className="text-center py-4 text-muted">
                    No users found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      {filteredUsers.length > usersPerPage && (
        <div className="d-flex justify-content-between align-items-center mt-3">
          <div>
            <button
              className="btn btn-outline-primary me-2"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
            >
              Previous
            </button>

            <button
              className="btn btn-outline-primary"
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
            >
              Next
            </button>
          </div>

          <div className="fw-semibold">
            Page {currentPage} of {totalPages}
          </div>

          <select
            value={usersPerPage}
            onChange={(e) => {
              setUsersPerPage(Number(e.target.value));
              setCurrentPage(1);
            }}
            className="form-select w-auto"
          >
            <option value={5}>5 per page</option>
            <option value={10}>10 per page</option>
            <option value={20}>20 per page</option>
          </select>
        </div>
      )}

      {/* Not Found Modal */}
      {showModal && (
        <div
          className="modal show d-block"
          style={{ background: "rgba(0,0,0,0.5)" }}
        >
          <div className="modal-dialog">
            <div className="modal-content rounded-4">
              <div className="modal-body text-center py-4">
                <h5 className="fw-bold mb-2">No User Found</h5>
                <p>Would you like to create a new one?</p>
              </div>

              <div className="modal-footer justify-content-center">
                <button
                  className="btn btn-secondary"
                  onClick={() => setShowModal(false)}
                >
                  Cancel
                </button>

                <button
                  className="btn btn-primary"
                  onClick={() => {
                    setShowModal(false);
                    navigate("/admin/register");
                  }}
                >
                  Create User
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
