import {
  InsuranceClaimRequest,
  InsuranceClaimResponse,
} from "../types/claims";

const BASE_URL = "http://localhost:8084/api/v1/insurance-claims";

// ----------------------------------------------------
//  Read JWT token
// ----------------------------------------------------
const getToken = (): string | null => localStorage.getItem("authToken");

// ----------------------------------------------------
//  Generic HTTP Wrapper
// ----------------------------------------------------
async function http<T>(path: string, init: RequestInit = {}): Promise<T> {
  const token = getToken();

  const headers: Record<string, string> = {
    Accept: "application/json",
    "Content-Type": "application/json",
    ...(init.headers as Record<string, string>),
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const response = await fetch(`${BASE_URL}${path}`, {
    ...init,
    headers,
    cache: "no-cache",
    mode: "cors",
  });

  // Read raw text
  const raw = await response.text();

  let data: any = {};
  try {
    data = raw ? JSON.parse(raw) : {};
  } catch {
    data = { message: raw };
  }

  if (!response.ok) {
    const message = data?.message || `HTTP ${response.status}`;
    const error: any = new Error(message);
    error.status = response.status;
    error.body = data;
    throw error;
  }

  return data as T;
}

// ------------------------------------------------------------
//  API CALLS — CRUD
// ------------------------------------------------------------

// CREATE Claim
export const createInsuranceClaim = (payload: InsuranceClaimRequest) =>
  http<InsuranceClaimResponse>("", {
    method: "POST",
    body: JSON.stringify(payload),
  });

// UPDATE Claim by ID
export const updateInsuranceClaim = (
  id: number,
  payload: InsuranceClaimRequest
) =>
  http<InsuranceClaimResponse>(`/${id}`, {
    method: "PUT",
    body: JSON.stringify(payload),
  });

// GET Single Claim by ID
export const getInsuranceClaimById = (id: number) =>
  http<InsuranceClaimResponse>(`/${id}`, {
    method: "GET",
  });

// GET All Claims
export const getAllInsuranceClaims = () =>
  http<InsuranceClaimResponse[]>(``, {
    method: "GET",
  });

// DELETE Claim
export const deleteInsuranceClaim = (id: number) =>
  http<string>(`/${id}`, {
    method: "DELETE",
  });