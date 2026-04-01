// src/api/medicationApi.ts

export interface Medication {
  id: number;
  name: string;
  rxnormCode: string;
  form: string;
  strength: string;
  createdAt?: string;
}

export interface MedicationCreatePayload {
  name: string;
  rxnormCode: string;
  form: string;
  strength: string;
}
export type MedicationUpdatePayload = MedicationCreatePayload;


const HMS_BASE = "http://localhost:8084"; // HMS backend

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

export function createMedication(payload: MedicationCreatePayload) {
  return request<Medication>("/api/medications", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

// 🔹 NEW: fetch all medications for main list
export function fetchMedications() {
  return request<Medication[]>("/api/medications", {
    method: "GET",
  });
}
  // 🔹 NEW: get single medication by id
export function fetchMedicationById(id: number) {
  return request<Medication>(`/api/medications/${id}`, {
    method: "GET",
  });
}

// 🔹 NEW: update medication
export function updateMedication(id: number, payload: MedicationUpdatePayload) {
  return request<Medication>(`/api/medications/${id}`, {
    method: "PUT",
    body: JSON.stringify(payload),
  });
}

  //delete medication
  export async function deleteMedication(id: number): Promise<void> {
  const token = localStorage.getItem("authToken");

  const res = await fetch(`${HMS_BASE}/api/medications/${id}`, {
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



