// src/api/users.ts
import type { RegisterRequest } from "../types/user";

const AUTH_BASE = "http://localhost:8081";
const USERS_BASE = "http://localhost:8083";

// -------------------- AUTH APIs --------------------
export async function registerUser(payload: RegisterRequest) {
  const token = localStorage.getItem("authToken"); // ✅ FIXED

  const headers: any = { "Content-Type": "application/json" };
  if (token) headers.Authorization = `Bearer ${token}`;

  const res = await fetch(`${AUTH_BASE}/api/v1/auth/registerUser`, {
    method: "POST",
    headers,
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const msg = await res.text();
    throw new Error(msg || "Registration failed");
  }

  return res.json();
}

// -------------------- USER PROFILE APIs --------------------

// // Logged-in user
// export async function getLoggedUser(token: string) {
//   const res = await fetch(`${USERS_BASE}/api/v1/users/me`, {
//     headers: {
//       Authorization: `Bearer ${token}`,
//     },
//   });
//   if (!res.ok) throw new Error("Failed to fetch logged user");
//   return res.json();
// }

// Get all users
export async function getAllUsers(token: string) {
  const res = await fetch(`${USERS_BASE}/api/v1/users`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  if (!res.ok) throw new Error("Failed to fetch all users");
  return res.json();
}

// Get user by ID
export async function getUserById(id: number, token: string) {
  const res = await fetch(`${USERS_BASE}/api/v1/users/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  if (!res.ok) throw new Error(`Failed to fetch user with ID: ${id}`);
  return res.json();
}

// Update profile
export async function updateUserProfile(
  id: number,
  request: any,
  token: string
) {
  const res = await fetch(`${USERS_BASE}/api/v1/users/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(request),
  });
  if (!res.ok) throw new Error("Failed to update user profile");
  return res.json();
}

// Assign role
export async function assignRoleToUser(
  userId: number,
  roleName: string,
  token: string
) {
  if (!userId || !roleName || !token) {
    throw new Error("Missing required parameters for role assignment");
  }

  const res = await fetch(`${AUTH_BASE}/api/v1/auth/assign-role/${userId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ roleName }),
  });

  if (res.ok) {
    const data = await res.text();
    return { success: true, message: data };
  } else if (res.status === 403) {
    throw new Error("Permission denied: You don't have authorization.");
  } else if (res.status === 401) {
    throw new Error("Authentication failed: Please log in again.");
  } else {
    const errorText = await res.text().catch(() => `HTTP ${res.status}`);
    throw new Error(`Role assignment failed: ${errorText}`);
  }
}
