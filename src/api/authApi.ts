import { PatientRequest } from "../types/Patient";
import { RegisterProviderRequest } from "../types/provider";

// auth.ts - Authentication & RBAC API wrapper
const AUTH_BASE = "http://localhost:8081";
const MLMENU_BASE = "http://localhost:8082/api/v1/rbac"; // Correct RBAC service port

let accessToken: string | null = null;

// -------------------- TOKEN HANDLING ----------------

export function setAccessToken(token: string | null) {
  accessToken = token;
  if (token) {
    localStorage.setItem("authToken", token);
  } else {
    localStorage.removeItem("authToken");
  }
}

export function initializeAuth() {
  const storedToken = localStorage.getItem("authToken");
  if (storedToken) setAccessToken(storedToken);
}

// -------------------- BASE HTTP FUNCTION ----------------

async function http<T>(
  base: string,
  path: string,
  init: RequestInit = {}
): Promise<T> {
  // Always get fresh token from localStorage to ensure consistency
  const token = localStorage.getItem("authToken");

  const headers: Record<string, string> = {
    Accept: "application/json",
    ...(init.headers as Record<string, string> | undefined),
  };

  if (init.body && !headers["Content-Type"])
    headers["Content-Type"] = "application/json";

  // Use token from localStorage instead of global variable
  if (token) headers["Authorization"] = `Bearer ${token}`;

  const res = await fetch(`${base}${path}`, {
    mode: "cors",
    credentials: "include",
    ...init,
    headers,
  });

  if (res.status === 204) return undefined as T;

  let data;
  try {
    data = await res.json();
  } catch (e) {
    try {
      // Fallback: read plain text response
      const text = await res.text();
      data = { message: text } as any;
    } catch {
      data = {} as T;
    }
  }

  if (!res.ok) {
    console.error("❌ HTTP Error:", {
      status: res.status,
      statusText: res.statusText,
      url: `${base}${path}`,
      data,
    });

    // Handle specific error codes with user-friendly messages
    if (res.status === 403) {
      const msg = "Access denied: You don't have permission for this action";
      const err = new Error(msg) as Error & { status?: number; body?: unknown };
      err.status = res.status;
      err.body = data;
      throw err;
    }

    if (res.status === 401) {
      const msg = "Authentication required: Please log in again";
      const err = new Error(msg) as Error & { status?: number; body?: unknown };
      err.status = res.status;
      err.body = data;
      throw err;
    }

    const msg =
      (data as any)?.message ||
      (data as any)?.error ||
      `Server error: ${res.status} ${res.statusText}`;
    const err = new Error(msg) as Error & { status?: number; body?: unknown };
    err.status = res.status;
    err.body = data;
    throw err;
  }

  return data as T;
}

// -------------------- JWT / CLAIMS HELPERS --------------------

/**
 * Safely parse a JWT and return the payload (claims).
 * Returns null if token missing/invalid.
 */
export function parseJwt(token?: string | null): Record<string, any> | null {
  if (!token) return null;
  try {
    const parts = token.split(".");
    if (parts.length < 2) return null;
    // base64url -> base64
    const payload = parts[1].replace(/-/g, "+").replace(/_/g, "/");
    // pad with '='
    const pad = payload.length % 4;
    const padded = pad ? payload + "=".repeat(4 - pad) : payload;
    const json = atob(padded);
    return JSON.parse(json);
  } catch (err) {
    console.error("parseJwt error:", err);
    return null;
  }
}

const DEMO_LOGIN_EMAIL = import.meta.env.VITE_TEST_LOGIN_EMAIL;
const DEMO_LOGIN_PASSWORD = import.meta.env.VITE_TEST_LOGIN_PASSWORD;

function base64UrlEncode(value: string) {
  return btoa(value).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function createFakeJwt(payload: Record<string, any>) {
  const header = base64UrlEncode(JSON.stringify({ alg: "HS256", typ: "JWT" }));
  const body = base64UrlEncode(
    JSON.stringify({
      ...payload,
      exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24,
      demo: true,
    })
  );
  return `${header}.${body}.demo-signature`;
}

export async function loginDemo(identifier: string, password: string) {
  if (!DEMO_LOGIN_EMAIL || !DEMO_LOGIN_PASSWORD) {
    throw new Error("Demo login is not configured.");
  }

  if (identifier !== DEMO_LOGIN_EMAIL || password !== DEMO_LOGIN_PASSWORD) {
    throw new Error("Invalid demo credentials.");
  }

  const token = createFakeJwt({
    sub: "demo-user",
    email: identifier,
    roles: ["admin"],
  });

  setAccessToken(token);
  return { accessToken: token, demo: true, user: { email: identifier } };
}

/**
 * Return claims from the currently stored auth token (localStorage "authToken").
 * If no token, returns null.
 */
export function getAuthClaims(): Record<string, any> | null {
  const token = localStorage.getItem("authToken");
  return parseJwt(token);
}

/**
 * Convenience that returns a normalized logged user object { id, email, rawClaims }.
 * It looks for common claim keys: id, userId, sub (subject), email, username.
 * If an id/email cannot be determined, those fields will be null.
 */
export function getLoggedUserFromToken(): {
  id: number | null;
  email: string | null;
  raw?: Record<string, any> | null;
} {
  const claims = getAuthClaims();
  if (!claims) return { id: null, email: null, raw: null };

  // Common claim keys across different backends
  const possibleIdKeys = ["id", "userId", "sub", "uid"];
  const possibleEmailKeys = ["email", "mail", "username", "preferred_username"];

  let id: number | null = null;
  for (const k of possibleIdKeys) {
    if (claims[k] !== undefined && claims[k] !== null) {
      // convert numeric-like string to number when possible
      const n = Number(claims[k]);
      id = Number.isFinite(n) ? n : null;
      if (id === null && typeof claims[k] === "number") id = claims[k];
      if (id !== null) break;
    }
  }

  let email: string | null = null;
  for (const k of possibleEmailKeys) {
    if (claims[k]) {
      email = String(claims[k]);
      break;
    }
  }

  return { id, email, raw: claims };
}


// ---------------- AUTH APIs ------------------

export async function login(identifier: string, password: string) {
  const body = { email: identifier, password };

  const resp = await http<any>(AUTH_BASE, "/api/v1/auth/login", {
    method: "POST",
    body: JSON.stringify(body),
  });

  const token =
    resp?.accessToken || resp?.token || resp?.jwt || resp?.data?.accessToken;

  if (token) setAccessToken(token);

  return resp;
}

export function logout() {
  setAccessToken(null);
  window.location.href = "/login";
}

// --- Register User (Admin Only)

export const registerUser = (payload: any) =>
  http<string>(AUTH_BASE, "/api/v1/auth/registerUser", {
    method: "POST",
    body: JSON.stringify(payload),
  });

// --- Register Patient (Public + Admin allowed)

export const registerPatient = (payload: PatientRequest) =>
  http<string>(AUTH_BASE, "/api/v1/auth/registerPatient", {
    method: "POST",
    body: JSON.stringify(payload),
  });

// --- Register Provider (Super Admin)

export const registerProvider = (payload: RegisterProviderRequest) =>
  http<string>(AUTH_BASE, "/api/v1/auth/registerProvider", {
    method: "POST",
    body: JSON.stringify(payload),
  });

// --- Refresh Token

export const refreshToken = (refresh: string) =>
  http<any>(AUTH_BASE, "/api/v1/auth/refresh", {
    method: "POST",
    body: JSON.stringify({ refreshToken: refresh }),
  });

// --- Revoke Tokens (Logout)

export const revokeTokens = (userId: number) =>
  http<string>(AUTH_BASE, `/api/v1/auth/revoke/${userId}`, {
    method: "POST",
  });

// --- Assign Role to User

export const assignRoleToUser = (userId: number, roleName: string) =>
  http<string>(AUTH_BASE, `/api/v1/auth/assign-role/${userId}`, {
    method: "PUT",
    body: JSON.stringify({ roleName }),
  });

// --- GET User By ID

export const getUserById = (id: number) =>
  http<any>(AUTH_BASE, `/api/v1/auth/${id}`);

// --- GET User Roles

export const getUserRoles = (id: number) =>
  http<any[]>(AUTH_BASE, `/api/v1/auth/${id}/roles`);

// --- Delete User

export const deleteUser = (id: number) =>
  http<void>(AUTH_BASE, `/api/v1/auth/deleteUser/${id}`, {
    method: "DELETE",
  });

// --- Delete Patient

export const deletePatient = (id: number) =>
  http<void>(AUTH_BASE, `/api/v1/auth/deletePatient/${id}`, {
    method: "DELETE",
  });

// --- Delete Provider

export const deleteProvider = (id: number) =>
  http<void>(AUTH_BASE, `/api/v1/auth/deleteProvider/${id}`, {
    method: "DELETE",
  });

// --- Forgot Password

export const requestPasswordReset = (email: string) =>
  http<any>(
    AUTH_BASE,
    `/api/v1/auth/forgot-password?email=${encodeURIComponent(email)}`,
    { method: "POST" }
  );

// --- Reset Password

export const resetPassword = (token: string, newPassword: string) =>
  http<any>(
    AUTH_BASE,
    `/api/v1/auth/reset-password?token=${encodeURIComponent(
      token
    )}&newPassword=${encodeURIComponent(newPassword)}`,
    { method: "POST" }
  );

// ---------------- LOGIN HANDLER ------------------

export async function handleLoginSubmit(
  identifier: string,
  pwd: string,
  onSuccess: () => void,
  onError: (msg: string) => void
) {
  try {
    await login(identifier, pwd);
    onSuccess();
  } catch (e: any) {
    onError(
      e?.status === 401 ? "Invalid credentials" : e?.message || "Login failed"
    );
  }
}

// -------------------- RBAC / MULTILEVEL MENU APIs ----------------

// 🌳 Feature Tree
//export const mlGetFeatureTree = () => http<any>(MLMENU_BASE, "/features");

// 🧩 Role → Feature Mapping
export const mlGetRoleFeatures = (roleId: number) =>
  http<any>(MLMENU_BASE, `/mapping/roles/${roleId}`);

export const mlSetRoleFeatures = (roleId: number, featureIds: number[]) =>
  http<any>(
    MLMENU_BASE,
    `/api/v1/rbac/mapping/assign/${roleId}/${featureIds}`,
    {
      method: "POST",
      body: JSON.stringify({ featureIds }),
    }
  );

// -------------------- ROLE CRUD APIs --------------------

// ✅ Get All Roles
export const getAllRoles = () => http<any[]>(MLMENU_BASE, "/roles");

// ✅ Get Role by ID
export const getRoleById = (id: number) =>
  http<any>(MLMENU_BASE, `/roles/${id}`);

// ✅ Create Role
export const createRole = (role: { name: string; description?: string }) =>
  http<any>(MLMENU_BASE, "/roles", {
    method: "POST",
    body: JSON.stringify(role),
  });

// ✅ Update Role
export const updateRole = (
  id: number,
  role: { name: string; description?: string }
) =>
  http<any>(MLMENU_BASE, `/roles/${id}`, {
    method: "PUT",
    body: JSON.stringify(role),
  });

// ✅ Delete Role
export const deleteRole = (id: number) =>
  http<any>(MLMENU_BASE, `/roles/${id}`, {
    method: "DELETE",
  });

// // ---------------- RBAC / MULTILEVEL MENU APIs ----------------

// ✅ Get Feature Tree
export const mlGetFeatureTree = () =>
  http<any>(MLMENU_BASE, "/features");

// ✅ Get Role → Feature Mapping
export const getRoleFeatures = (roleId: number) =>
  http<any[]>(MLMENU_BASE, `/mappings/role/${roleId}`);

// ✅ Assign SINGLE feature (Corrected)
export const assignFeatureToRole = (roleId: number, featureId: number) =>
  http<any>(MLMENU_BASE, `/mappings/assign/${roleId}`, {
    method: "POST",
    body: JSON.stringify({ featureId }),
  });

// ✅ Assign MULTIPLE features (Corrected)
export const assignMultipleFeaturesToRole = (
  roleId: number,
  featureIds: number[]
) =>
  http<any>(MLMENU_BASE, `/mappings/assign/${roleId}`, {
    method: "POST",
    body: JSON.stringify({ featureIds }),
  });

// ✅ Replace all features for a role
export const updateRoleFeatures = (roleId: number, featureIds: number[]) =>
  http<any>(MLMENU_BASE, `/mappings/role/${roleId}`, {
    method: "PUT",
    body: JSON.stringify(featureIds),
  });

// ✅ Remove single feature
export const removeSingleFeatureFromRole = (
  roleId: number,
  featureId: number
) =>
  http<any>(MLMENU_BASE, `/mappings/role/${roleId}/feature/${featureId}`, {
    method: "DELETE",
  });

// ✅ Remove all features
export const removeAllFeaturesFromRole = (roleId: number) =>
  http<any>(MLMENU_BASE, `/mappings/role/${roleId}`, {
    method: "DELETE",
  });

