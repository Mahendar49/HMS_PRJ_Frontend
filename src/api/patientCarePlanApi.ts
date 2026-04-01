// src/api/patientCarePlanApi.ts
// add this import (adjust path if your file name is different)
import { getAllPatients } from "./patientApi";
import type { PatientResponse } from "../types/Patient";
import { fetchCarePlans } from "./carePlanApi";


const HMS_BASE = "http://localhost:8084";

export interface PatientCarePlan {
  id: number;
  patientId: number;
  carePlanId: number;
  startDate?: string | null;
  endDate?: string | null;
  status: string; // 'active', 'paused', 'completed', 'cancelled'
  assignedBy?: number | null;
  createdAt?: string;

  // optional, if backend sends them
  patientName?: string;
  carePlanName?: string;
  assignedByName?: string;
}

// Payloads we send from UI (do NOT include assignedBy - backend sets it)
export interface PatientCarePlanCreatePayload {
  patientId: number;
  carePlanId: number;
  startDate?: string | null;
  endDate?: string | null;
  status: string;
   // 'active', 'paused', 'completed', 'cancelled'
    assignedBy: number, 
  // ❌ no assignedBy here
}

export type PatientCarePlanUpdatePayload = PatientCarePlanCreatePayload;


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

// LIST all
export function fetchPatientCarePlans() {
  return request<PatientCarePlan[]>("/api/patient-care-plans", {
    method: "GET",
  });
}

// GET one
export function fetchPatientCarePlanById(id: number) {
  return request<PatientCarePlan>(`/api/patient-care-plans/${id}`, {
    method: "GET",
  });
}

// CREATE
export function createPatientCarePlan(payload: PatientCarePlanCreatePayload) {
  return request<PatientCarePlan>("/api/patient-care-plans", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

// UPDATE
export function updatePatientCarePlan(
  id: number,
  payload: PatientCarePlanUpdatePayload
) {
  return request<PatientCarePlan>(`/api/patient-care-plans/${id}`, {
    method: "PUT",
    body: JSON.stringify(payload),
  });
}

// DELETE
export async function deletePatientCarePlan(id: number): Promise<void> {
  const token = localStorage.getItem("authToken");

  const res = await fetch(`${HMS_BASE}/api/patient-care-plans/${id}`, {
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

// ---------- Helper types & APIs for dropdowns ----------

export interface SimplePatient {
  id: number;
  firstName?: string;
  lastName?: string;
  fullName?: string;
}

export interface SimpleCarePlan {
  id: number;
  name: string;
}

export async function fetchPatientsForDropdown(): Promise<SimplePatient[]> {
  // getAllPatients() returns PatientResponse[]
  const patients: PatientResponse[] = await getAllPatients();

  // map to the simple shape we need for the dropdown
  return patients.map((p) => ({
    id: p.id,
    firstName: p.firstName,
    lastName: p.lastName,
    // if your PatientResponse has fullName, keep it; otherwise it will be undefined
    fullName: (p as any).fullName,
  }));
}


export async function fetchCarePlansForDropdown(): Promise<SimpleCarePlan[]> {
  const carePlans = await fetchCarePlans(); // existing working API

  return carePlans.map((cp: any) => ({
    id: cp.id,
    name: cp.name,
  }));
}




