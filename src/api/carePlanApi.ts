// src/api/carePlanApi.ts

export interface CarePlan {
  id: number;
  name: string;
  description: string;
  active: boolean;
  createdAt?: string;
  createdBy?: number | null;
}

export interface CarePlanCreatePayload {
  name: string;
  description: string;
  active: boolean;
}

export type CarePlanUpdatePayload = CarePlanCreatePayload;

const HMS_BASE = "http://localhost:8084"; // same HMS backend

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
export function createCarePlan(payload: CarePlanCreatePayload) {
  return request<CarePlan>("/api/care-plans", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

// List all
export function fetchCarePlans() {
  return request<CarePlan[]>("/api/care-plans", {
    method: "GET",
  });
}

// Get single by id
export function fetchCarePlanById(id: number) {
  return request<CarePlan>(`/api/care-plans/${id}`, {
    method: "GET",
  });
}

// Update
export function updateCarePlan(id: number, payload: CarePlanUpdatePayload) {
  return request<CarePlan>(`/api/care-plans/${id}`, {
    method: "PUT",
    body: JSON.stringify(payload),
  });
}

// Delete
export async function deleteCarePlan(id: number): Promise<void> {
  const token = localStorage.getItem("authToken");

  const res = await fetch(`${HMS_BASE}/api/care-plans/${id}`, {
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
