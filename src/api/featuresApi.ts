// src/api/features.ts
import { mlGetFeatureTree } from "./authApi";
import { FeatureDto } from "../types";

// Base URL for RBAC features - correct RBAC service port
const FEATURE_BASE = "http://localhost:8082/api/v1/rbac/features";

// ✅ 1. Get all features
export const getAllFeatures = async (): Promise<FeatureDto[]> => {
  const token = localStorage.getItem("authToken");

  const res = await fetch(FEATURE_BASE, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  if (res.status === 403) {
    console.warn("🚫 Features API: User lacks permissions");
    throw new Error(
      "Access denied: You don't have permission to manage features"
    );
  }

  if (res.status === 401) {
    console.error("🔒 Features API: Authentication failed");
    throw new Error("Authentication required: Please log in again");
  }

  if (!res.ok) {
    console.error("❌ getAllFeatures failed:", res.status, res.statusText);
    throw new Error(`Server error: ${res.status} ${res.statusText}`);
  }

  return res.json();
};

// ✅ 2. Get feature by ID
export const getFeatureById = async (id: number): Promise<FeatureDto> => {
  const res = await fetch(`${FEATURE_BASE}/${id}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("authToken")}`,
    },
  });

  if (!res.ok) throw new Error(`Feature with ID ${id} not found`);
  return res.json();
};

// ✅ 3. Create new feature
export const createFeature = async (feature: {
  name: string;
  description?: string;
}): Promise<FeatureDto> => {
  const res = await fetch(FEATURE_BASE, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("authToken")}`,
    },
    body: JSON.stringify(feature),
  });

  if (!res.ok) throw new Error("Failed to create feature");
  return res.json();
};

// ✅ 4. Update existing feature
export const updateFeature = async (
  id: number,
  feature: { name: string; description?: string }
): Promise<FeatureDto> => {
  const res = await fetch(`${FEATURE_BASE}/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("authToken")}`,
    },
    body: JSON.stringify(feature),
  });

  if (!res.ok) throw new Error("Failed to update feature");
  return res.json();
};

// ✅ 5. Delete feature by ID
export const deleteFeature = async (id: number): Promise<string> => {
  const res = await fetch(`${FEATURE_BASE}/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${localStorage.getItem("authToken")}`,
    },
  });

  if (!res.ok) throw new Error("Failed to delete feature");
  return "Feature deleted successfully";
};

// ✅ 6. Get feature tree (if hierarchical view needed)
export const getFeatureTree = async (): Promise<FeatureDto[]> => {
  const res = await mlGetFeatureTree();
  return res.data || res || [];
};

export default {
  getAllFeatures,
  getFeatureById,
  createFeature,
  updateFeature,
  deleteFeature,
  getFeatureTree,
};
