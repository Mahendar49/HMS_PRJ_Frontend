// src/api/role.ts
import {
  getAllRoles,
  getRoleById,
  createRole,
  updateRole,
  deleteRole,
  mlGetRoleFeatures,
  mlSetRoleFeatures,
} from "./authApi";
import { Role } from "../types";

// ----------------------------------------------
// 🧩 1. GET all roles
// ----------------------------------------------
// ----------------------------------------------
export const getRoles = async (): Promise<Role[]> => {
  const res = await getAllRoles();
  return Array.isArray(res) ? res : [];
};

// ----------------------------------------------
// 🧩 2. GET role by ID
// ----------------------------------------------
export const fetchRoleById = async (id: number): Promise<Role> => {
  const res = await getRoleById(id);
  return res.data || res;
};

// ----------------------------------------------
// 🧩 3. CREATE new role
// ----------------------------------------------
export const createNewRole = async (payload: {
  name: string;
  description?: string;
}): Promise<Role> => {
  const res = await createRole(payload);
  return res.data || res;
};

// ----------------------------------------------
// 🧩 4. UPDATE existing role
// ----------------------------------------------
export const updateExistingRole = async (
  id: number,
  payload: { name: string; description?: string }
): Promise<Role> => {
  const res = await updateRole(id, payload);
  return res.data || res;
};

// ----------------------------------------------
// 🧩 5. DELETE role by ID
// ----------------------------------------------
export const removeRole = async (id: number): Promise<string> => {
  const res = await deleteRole(id);
  return res.data || res || "Role deleted successfully";
};

// ----------------------------------------------
// 🧩 6. ROLE-FEATURE Mapping
// ----------------------------------------------
export const getRoleFeatures = async (roleId: number): Promise<number[]> => {
  const res = await mlGetRoleFeatures(roleId);
  return res.data || res || [];
};

export const setRoleFeatures = async (
  roleId: number,
  featureIds: number[]
): Promise<any> => {
  const res = await mlSetRoleFeatures(roleId, featureIds);
  return res.data || res;
};

// ----------------------------------------------
// 🧩 Default export bundle
// ----------------------------------------------
export default {
  getRoles,
  fetchRoleById,
  createNewRole,
  updateExistingRole,
  removeRole,
  getRoleFeatures,
  setRoleFeatures,
};
