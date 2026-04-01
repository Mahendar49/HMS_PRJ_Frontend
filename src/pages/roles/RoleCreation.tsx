import React, { useEffect, useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { RoleCretateRequest } from "../../types";
import { getRoles } from "../../api/rolesApi";
import { createRole, deleteRole, updateRole } from "../../api/authApi";
import { FaSort, FaSortUp, FaSortDown } from "react-icons/fa";

export default function RoleCreation() {
  const [roles, setRoles] = useState<RoleCretateRequest[]>([]);
  const [filteredRoles, setFilteredRoles] = useState<RoleCretateRequest[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [editingRole, setEditingRole] = useState<RoleCretateRequest | null>(
    null
  );

  const [form, setForm] = useState({ name: "", description: "" });
  const [search, setSearch] = useState("");

  const [sortConfig, setSortConfig] = useState<{
    key: keyof RoleCretateRequest | null;
    direction: "asc" | "desc";
  }>({
    key: null,
    direction: "asc",
  });

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  useEffect(() => {
    fetchRoles();
  }, []);

  const fetchRoles = async () => {
    setLoading(true);
    try {
      const data = await getRoles();
      setRoles(data);
      setFilteredRoles(data);
    } catch (err: any) {
      toast.error("Failed to fetch roles");
    } finally {
      setLoading(false);
    }
  };

  // -------------------- Handle Form Change --------------------
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // -------------------- Create / Update Role --------------------
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim()) {
      toast.warn("Role name is required");
      return;
    }
    try {
      if (editingRole) {
        await updateRole(editingRole.id!, form);
        toast.success("Role updated successfully");
      } else {
        await createRole(form);
        toast.success("Role created successfully");
      }
      setForm({ name: "", description: "" });
      setEditingRole(null);
      fetchRoles();
    } catch (err: any) {
      toast.error(err.message || "Failed to save role");
    }
  };

  // -------------------- Edit Role --------------------
  const handleEdit = (role: RoleCretateRequest) => {
    setEditingRole(role);
    setForm({ name: role.name, description: role.description || "" });
  };

  // -------------------- Delete Role --------------------
  const handleDelete = async (id: number) => {
    if (!window.confirm("Are you sure you want to delete this role?")) return;
    try {
      await deleteRole(id);
      toast.success("Role deleted successfully");
      fetchRoles();
    } catch (err: any) {
      toast.error(err.message || "Failed to delete role");
    }
  };

  // -------------------- Cancel Edit --------------------
  const handleCancel = () => {
    setEditingRole(null);
    setForm({ name: "", description: "" });
  };

  // -------------------- Search --------------------
  useEffect(() => {
    const filtered = roles.filter(
      (r) =>
        r.name.toLowerCase().includes(search.toLowerCase()) ||
        (r.description || "").toLowerCase().includes(search.toLowerCase())
    );
    setFilteredRoles(filtered);
    setCurrentPage(1);
  }, [search, roles]);

  // -------------------- Sorting --------------------
  const handleSort = (key: keyof RoleCretateRequest) => {
    let direction: "asc" | "desc" = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });

    const sorted = [...filteredRoles].sort((a, b) => {
      const valA = (a[key] || "").toString().toLowerCase();
      const valB = (b[key] || "").toString().toLowerCase();
      if (valA < valB) return direction === "asc" ? -1 : 1;
      if (valA > valB) return direction === "asc" ? 1 : -1;
      return 0;
    });

    setFilteredRoles(sorted);
  };

  const getSortIcon = (key: keyof RoleCretateRequest) => {
    if (sortConfig.key !== key) return <FaSort />;
    return sortConfig.direction === "asc" ? <FaSortUp /> : <FaSortDown />;
  };

  // -------------------- Pagination --------------------
  const indexOfLast = currentPage * itemsPerPage;
  const indexOfFirst = indexOfLast - itemsPerPage;
  const currentRoles = filteredRoles.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(filteredRoles.length / itemsPerPage);

  return (
    <div className="container mt-4">
      <ToastContainer position="top-right" />

      {/* PAGE HEADER */}
      <h3 className="fw-bold text-primary mb-4">
        <i className="bi bi-shield-lock-fill me-2"></i>Role Management
      </h3>

      {/* SEARCH & FILTERS */}
      <div className="card shadow-sm border-0 rounded-4 mb-4">
        <div className="card-body p-3">
          <div className="input-group">
            <span className="input-group-text bg-white border-end-0">
              <i className="bi bi-search text-primary"></i>
            </span>
            <input
              type="text"
              className="form-control border-start-0 shadow-sm"
              placeholder="Search by name or description..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* ROLE FORM */}
      <div className="card shadow-sm border-0 rounded-4 mb-4">
        <div className="card-header bg-primary text-white fw-semibold rounded-top-4">
          {editingRole ? "Edit Role" : "Create Role"}
        </div>
        <div className="card-body">
          <form onSubmit={handleSubmit} className="row g-3">
            <div className="col-md-6">
              <label className="form-label fw-semibold text-primary">
                Role Name
              </label>
              <input
                type="text"
                className="form-control shadow-sm"
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="Enter role name"
              />
            </div>

            <div className="col-md-6">
              <label className="form-label fw-semibold text-primary">
                Description
              </label>
              <input
                type="text"
                className="form-control shadow-sm"
                name="description"
                value={form.description}
                onChange={handleChange}
                placeholder="Enter description"
              />
            </div>

            <div className="col-md-12 text-end">
              <button type="submit" className="btn btn-primary px-4">
                {editingRole ? "Update Role" : "Create Role"}
              </button>

              {editingRole && (
                <button
                  type="button"
                  className="btn btn-secondary ms-2"
                  onClick={handleCancel}
                >
                  Cancel
                </button>
              )}
            </div>
          </form>
        </div>
      </div>

      {/* ROLE LIST */}
      <div className="card shadow-sm border-0 rounded-4">
        <div className="card-header bg-light fw-semibold rounded-top-4">
          All Roles ({filteredRoles.length})
        </div>

        <div className="card-body p-0">
          {loading ? (
            <p className="p-3">Loading roles...</p>
          ) : filteredRoles.length === 0 ? (
            <p className="p-3 text-muted">No roles found.</p>
          ) : (
            <>
              <table className="table table-hover align-middle mb-0">
                <thead className="table-primary">
                  <tr>
                    <th
                      onClick={() => handleSort("id")}
                      style={{ cursor: "pointer" }}
                    >
                      ID {getSortIcon("id")}
                    </th>
                    <th
                      onClick={() => handleSort("name")}
                      style={{ cursor: "pointer" }}
                    >
                      Name {getSortIcon("name")}
                    </th>
                    <th
                      onClick={() => handleSort("description")}
                      style={{ cursor: "pointer" }}
                    >
                      Description {getSortIcon("description")}
                    </th>
                    <th>Actions</th>
                  </tr>
                </thead>

                <tbody>
                  {currentRoles.map((role) => (
                    <tr key={role.id}>
                      <td>{role.id}</td>
                      <td>{role.name}</td>
                      <td>{role.description || "-"}</td>
                      <td>
                        <button
                          className="btn btn-sm btn-outline-info me-2 rounded-pill"
                          onClick={() => handleEdit(role)}
                        >
                          <i className="bi bi-pencil-square me-1"></i>Edit
                        </button>

                        <button
                          className="btn btn-sm btn-outline-danger rounded-pill"
                          onClick={() => handleDelete(role.id!)}
                        >
                          <i className="bi bi-trash3 me-1"></i>Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* PAGINATION */}
              <div className="p-3">
                <ul className="pagination justify-content-center mb-0">
                  <li
                    className={`page-item ${
                      currentPage === 1 ? "disabled" : ""
                    }`}
                  >
                    <button
                      className="page-link"
                      onClick={() => setCurrentPage(currentPage - 1)}
                    >
                      Previous
                    </button>
                  </li>

                  {[...Array(totalPages)].map((_, i) => (
                    <li
                      key={i}
                      className={`page-item ${
                        currentPage === i + 1 ? "active" : ""
                      }`}
                    >
                      <button
                        className="page-link"
                        onClick={() => setCurrentPage(i + 1)}
                      >
                        {i + 1}
                      </button>
                    </li>
                  ))}

                  <li
                    className={`page-item ${
                      currentPage === totalPages ? "disabled" : ""
                    }`}
                  >
                    <button
                      className="page-link"
                      onClick={() => setCurrentPage(currentPage + 1)}
                    >
                      Next
                    </button>
                  </li>
                </ul>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
