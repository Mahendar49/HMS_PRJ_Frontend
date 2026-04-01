// src/api/prescriptionApi.ts

// ADDED: DTO coming from backend
export interface Prescription {
  id: number;
  patientId: number;
  encounterId: number | null;
  prescribedBy: number;
  medicationId: number;
  sig: string;
  dose: string;
  frequency: string;
  quantity: number;
  refills: number;
  startDate: string; // ISO date (YYYY-MM-DD)
  endDate: string;   // ISO date (YYYY-MM-DD)
  status: string;
  createdAt?: string;
}

// ADDED: payload for create / update
export interface PrescriptionCreatePayload {
  patientId: number;
  encounterId: number | null; // <-- we will send null
  prescribedBy: number;
  medicationId: number;
  sig: string;
  dose: string;
  frequency: string;
  quantity: number;
  refills: number;
  startDate: string;
  endDate: string;
  status: string;
}

const HMS_BASE = "http://localhost:8084"; // ADDED: HMS backend base URL

// ADDED: common request helper
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

// ADDED: POST /api/prescriptions
export function createPrescription(payload: PrescriptionCreatePayload) {
  return request<Prescription>("/api/prescriptions", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

// ADDED: GET /api/prescriptions
export function fetchPrescriptions() {
  return request<Prescription[]>("/api/prescriptions", {
    method: "GET",
  });
}
// ADDED: get single prescription
export function fetchPrescriptionById(id: number) {
  return request<Prescription>(`/api/prescriptions/${id}`, {
    method: "GET",
  });
}

// ADDED: update prescription
export function updatePrescription(id: number, payload: PrescriptionCreatePayload) {
  return request<Prescription>(`/api/prescriptions/${id}`, {
    method: "PUT",
    body: JSON.stringify(payload),
  });
}
// ADDED: delete prescription
export async function deletePrescription(id: number): Promise<void> {
  const token = localStorage.getItem("authToken");

  const res = await fetch(`${HMS_BASE}/api/prescriptions/${id}`, {
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


