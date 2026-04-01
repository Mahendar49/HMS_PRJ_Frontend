import React, { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { ToastContainer, toast } from "react-toastify";

import {
  FaEdit,
  FaTrash,
  FaTimes,
  FaSortUp,
  FaSortDown,
  FaSearch,
  FaSync,
} from "react-icons/fa";

import featureService from "../../api/featuresApi";

import "bootstrap/dist/css/bootstrap.min.css";
import "react-toastify/dist/ReactToastify.css";

export interface FeatureForm {
  id?: number;
  code: string;
  name: string;
  description?: string;
  enable: boolean;
  sequence: number;
  parentId?: number;
}

export default function FeatureManager() {
  const [features, setFeatures] = useState<FeatureForm[]>([]);
  const [editingId, setEditingId] = useState<number | null>(null);

  const [searchQuery, setSearchQuery] = useState("");
  const [filterByParentId, setFilterByParentId] = useState("");
  const [filterSequence, setFilterSequence] = useState("");

  const [sortField, setSortField] = useState<keyof FeatureForm>("id");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  const { register, handleSubmit, reset } = useForm<FeatureForm>({
    defaultValues: {
      code: "",
      name: "",
      description: "",
      enable: true,
      sequence: 1,
      parentId: 0,
    },
  });

  // Load all features
  const loadFeatures = async () => {
    try {
      const data = await featureService.getAllFeatures();
      setFeatures(data);
    } catch {
      toast.error("Failed to load features");
    }
  };

  useEffect(() => {
    loadFeatures();
  }, []);

  // Create or update
  const onSubmit = async (data: FeatureForm) => {
    try {
      if (editingId) {
        await featureService.updateFeature(editingId, data);
        toast.success("Feature updated successfully");
      } else {
        await featureService.createFeature(data);
        toast.success("Feature created successfully");
      }
      reset();
      setEditingId(null);
      loadFeatures();
    } catch (err: any) {
      toast.error(err.message || "Operation failed");
    }
  };

  const handleEdit = (f: FeatureForm) => {
    reset(f);
    setEditingId(f.id!);
  };

  const handleCancel = () => {
    setEditingId(null);
    reset({
      code: "",
      name: "",
      description: "",
      enable: true,
      sequence: 1,
      parentId: 0,
    });
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm("Are you sure you want to delete this feature?"))
      return;
    try {
      await featureService.deleteFeature(id);
      toast.success("Feature deleted successfully");
      loadFeatures();
    } catch {
      toast.error("Failed to delete feature");
    }
  };

  // Toggle enable
  const handleToggleEnable = async (feature: FeatureForm) => {
    try {
      const updated = { ...feature, enable: !feature.enable };
      await featureService.updateFeature(feature.id!, updated);
      setFeatures((prev) =>
        prev.map((f) => (f.id === feature.id ? updated : f))
      );
      toast.info(`Feature "${feature.name}" updated`);
    } catch {
      toast.error("Failed to update status");
    }
  };

  // Sorting
  const handleSort = (field: keyof FeatureForm) => {
    if (sortField === field) setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    else {
      setSortField(field);
      setSortOrder("asc");
    }
  };

  const clearFilters = () => {
    setSearchQuery("");
    setFilterByParentId("");
    setFilterSequence("");
  };

  // Filter + sort + paginated
  const filteredFeatures = useMemo(() => {
    let data = [...features];
    const q = searchQuery.toLowerCase();

    if (q) {
      data = data.filter(
        (f) =>
          f.name.toLowerCase().includes(q) ||
          f.code.toLowerCase().includes(q) ||
          f.description?.toLowerCase().includes(q)
      );
    }

    if (filterByParentId.trim()) {
      data = data.filter(
        (f) => String(f.parentId || 0) === filterByParentId.trim()
      );
    }

    if (filterSequence.trim()) {
      data = data.filter(
        (f) => String(f.sequence || 0) === filterSequence.trim()
      );
    }

    data.sort((a, b) => {
      let valA = a[sortField]?.toString().toLowerCase();
      let valB = b[sortField]?.toString().toLowerCase();
      if (!valA) valA = "";
      if (!valB) valB = "";
      return sortOrder === "asc"
        ? valA.localeCompare(valB)
        : valB.localeCompare(valA);
    });

    return data;
  }, [
    features,
    searchQuery,
    filterByParentId,
    filterSequence,
    sortField,
    sortOrder,
  ]);

  // Pagination
  const totalPages = Math.ceil(filteredFeatures.length / itemsPerPage);
  const pageData = filteredFeatures.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // -------------------- UI STARTS --------------------

  return (
    <div className="container mt-4">
      <ToastContainer position="top-right" />

      {/* Page Header */}
      <h3 className="fw-bold text-primary mb-2">
        <i className="bi bi-grid-fill me-2"></i>Feature Management
      </h3>
      <p className="text-muted mb-4">Manage system features and hierarchy</p>

      {/* Search + Filter Card */}
      <div className="card shadow-sm border-0 rounded-4 mb-4">
        <div className="card-body">
          <div className="row g-3 align-items-center">
            {/* Search */}
            <div className="col-md-4">
              <div className="input-group shadow-sm">
                <span className="input-group-text bg-primary text-white">
                  <FaSearch />
                </span>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Search name, code, description..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>

            {/* Filters */}
            <div className="col-md-6 d-flex gap-2">
              <input
                type="text"
                className="form-control shadow-sm"
                placeholder="Filter by Parent ID"
                value={filterByParentId}
                onChange={(e) => setFilterByParentId(e.target.value)}
              />

              <input
                type="text"
                className="form-control shadow-sm"
                placeholder="Filter by Sequence"
                value={filterSequence}
                onChange={(e) => setFilterSequence(e.target.value)}
              />
            </div>

            {/* Clear Filters */}
            <div className="col-md-2 text-end">
              <button
                className="btn btn-outline-secondary shadow-sm"
                onClick={clearFilters}
              >
                <FaSync className="me-1" /> Clear
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Create / Edit Feature Form */}
      <div className="card shadow-sm border-0 rounded-4 mb-4">
        <div className="card-header bg-primary text-white fw-semibold rounded-top-4">
          {editingId ? "Edit Feature" : "Add New Feature"}
        </div>

        <div className="card-body">
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="row g-3">
              <div className="col-md-4">
                <label className="form-label fw-semibold text-primary">
                  Code
                </label>
                <input
                  {...register("code", { required: true })}
                  className="form-control shadow-sm"
                  placeholder="Feature code"
                />
              </div>

              <div className="col-md-4">
                <label className="form-label fw-semibold text-primary">
                  Name
                </label>
                <input
                  {...register("name", { required: true })}
                  className="form-control shadow-sm"
                  placeholder="Feature name"
                />
              </div>

              <div className="col-md-4">
                <label className="form-label fw-semibold text-primary">
                  Sequence
                </label>
                <input
                  type="number"
                  {...register("sequence")}
                  className="form-control shadow-sm"
                  placeholder="Sequence"
                />
              </div>

              <div className="col-md-12">
                <label className="form-label fw-semibold text-primary">
                  Description
                </label>
                <textarea
                  {...register("description")}
                  className="form-control shadow-sm"
                  placeholder="Feature description"
                ></textarea>
              </div>

              <div className="col-md-6">
                <label className="form-label fw-semibold text-primary">
                  Parent ID
                </label>
                <input
                  {...register("parentId")}
                  className="form-control shadow-sm"
                  placeholder="Parent ID"
                />
              </div>

              <div className="col-md-6 d-flex align-items-center">
                <div className="form-check mt-4">
                  <input
                    type="checkbox"
                    {...register("enable")}
                    className="form-check-input"
                  />
                  <label className="form-check-label fw-semibold ms-2">
                    Enable
                  </label>
                </div>
              </div>
            </div>

            <div className="text-end mt-3">
              <button className="btn btn-primary shadow-sm px-4">
                {editingId ? "Update Feature" : "Create Feature"}
              </button>

              {editingId && (
                <button
                  type="button"
                  className="btn btn-outline-secondary ms-2 shadow-sm"
                  onClick={handleCancel}
                >
                  <FaTimes className="me-1" />
                  Cancel
                </button>
              )}
            </div>
          </form>
        </div>
      </div>

      {/* Features List Table */}
      <div className="card shadow-sm border-0 rounded-4">
        <div className="card-header bg-light fw-semibold rounded-top-4">
          All Features ({filteredFeatures.length})
        </div>

        <div className="card-body table-responsive p-0">
          <table className="table mb-0 table-hover align-middle">
            <thead className="table-primary">
              <tr>
                {[
                  "id",
                  "code",
                  "name",
                  "description",
                  "sequence",
                  "parentId",
                ].map((key) => (
                  <th
                    key={key}
                    style={{ cursor: "pointer" }}
                    onClick={() => handleSort(key as keyof FeatureForm)}
                  >
                    {key.toUpperCase()}{" "}
                    {sortField === key &&
                      (sortOrder === "asc" ? <FaSortUp /> : <FaSortDown />)}
                  </th>
                ))}

                <th>Enable</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {pageData.length === 0 ? (
                <tr>
                  <td colSpan={8} className="text-center py-4 text-muted">
                    No features found.
                  </td>
                </tr>
              ) : (
                pageData.map((f) => (
                  <tr key={f.id}>
                    <td>{f.id}</td>
                    <td>{f.code}</td>
                    <td>{f.name}</td>
                    <td>{f.description || "-"}</td>
                    <td>{f.sequence}</td>
                    <td>{f.parentId || "-"}</td>

                    <td>
                      <input
                        type="checkbox"
                        checked={f.enable}
                        onChange={() => handleToggleEnable(f)}
                      />
                    </td>

                    <td>
                      <button
                        className="btn btn-sm btn-outline-info me-2 rounded-pill"
                        onClick={() => handleEdit(f)}
                      >
                        <FaEdit className="me-1" />
                        Edit
                      </button>

                      <button
                        className="btn btn-sm btn-outline-danger rounded-pill"
                        onClick={() => handleDelete(f.id!)}
                      >
                        <FaTrash className="me-1" />
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      <div className="d-flex justify-content-between align-items-center mt-3">
        <small className="text-muted">
          Page {currentPage} of {totalPages || 1}
        </small>

        <div>
          <button
            className="btn btn-outline-primary btn-sm me-2"
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((p) => p - 1)}
          >
            Previous
          </button>

          <button
            className="btn btn-outline-primary btn-sm"
            disabled={currentPage === totalPages || totalPages === 0}
            onClick={() => setCurrentPage((p) => p + 1)}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}
