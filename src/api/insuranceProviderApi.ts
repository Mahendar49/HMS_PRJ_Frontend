// src/api/insuranceProviderApi.ts

import {
  InsuranceProvider,
  InsuranceProviderCreatePayload,
  InsuranceProviderUpdatePayload,
} from "../types/insurance";

const HMS_BASE = "http://localhost:8084"; // same HMS backend as care plans

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const token = localStorage.getItem("authToken");

  const res = await fetch(`${HMS_BASE}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options.headers || {}),
    },
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || `Request failed with status ${res.status}`);
  }

  return res.json() as Promise<T>;
}

// Create
export function createInsuranceProvider(payload: InsuranceProviderCreatePayload) {
  return request<InsuranceProvider>("/api/insurance/providers", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

// List all
export function fetchInsuranceProviders() {
  return request<InsuranceProvider[]>("/api/insurance/providers", {
    method: "GET",
  });
}

// Get single by id
export function fetchInsuranceProviderById(id: number) {
  return request<InsuranceProvider>(`/api/insurance/providers/${id}`, {
    method: "GET",
  });
}

// Update
export function updateInsuranceProvider(
  id: number,
  payload: InsuranceProviderUpdatePayload
) {
  return request<InsuranceProvider>(`/api/insurance/providers/${id}`, {
    method: "PUT",
    body: JSON.stringify(payload),
  });
}

// Delete (same pattern as deleteCarePlan)
export async function deleteInsuranceProvider(id: number): Promise<void> {
  const token = localStorage.getItem("authToken");

  const res = await fetch(`${HMS_BASE}/api/insurance/providers/${id}`, {
    method: "DELETE",
    headers: {
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || `Request failed with status ${res.status}`);
  }
}
