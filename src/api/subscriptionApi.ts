// src/api/subscriptionApi.ts
// src/api/subscriptionApi.ts
import { getAllPatients } from "./patientApi";
import type { PatientResponse } from "../types/Patient";
import { fetchSubscriptionPlans, SubscriptionPlan } from "./subscriptionPlanApi";

const HMS_BASE = "http://localhost:8084"; // same as medicationApi.ts

export interface Subscription {
  id: number;
  patientId: number;
  planId: number;

  // optional names if backend joins & sends them
  patientName?: string;
  planName?: string;
  planCode?: string;

  startedAt?: string;       // DATETIME
  nextBillingAt?: string;   // DATETIME
  status: string;           // 'active' | 'paused' | 'cancelled' | 'expired'
  autoRenew: boolean;
}

export interface SubscriptionCreatePayload {
  patientId: number;
  planId: number;
  startedAt?: string | null;
  nextBillingAt?: string | null;
  status: string;      // 'active' | 'paused' | 'cancelled' | 'expired'
  autoRenew: boolean;
}

export type SubscriptionUpdatePayload = SubscriptionCreatePayload;


// same helper pattern as medicationApi.ts
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

// 🔹 For now we only need LIST – we'll add create/update/delete later
export function fetchSubscriptions() {
  return request<Subscription[]>("/api/subscriptions", {
    method: "GET",
  });
}

// GET single subscription by ID
export function fetchSubscriptionById(id: number) {
  return request<Subscription>(`/api/subscriptions/${id}`, {
    method: "GET",
  });
}

// CREATE
export function createSubscription(payload: SubscriptionCreatePayload) {
  return request<Subscription>("/api/subscriptions", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

// UPDATE
export function updateSubscription(
  id: number,
  payload: SubscriptionUpdatePayload
) {
  return request<Subscription>(`/api/subscriptions/${id}`, {
    method: "PUT",
    body: JSON.stringify(payload),
  });
}

// DELETE
export async function deleteSubscription(id: number): Promise<void> {
  const token = localStorage.getItem("authToken");

  const res = await fetch(`${HMS_BASE}/api/subscriptions/${id}`, {
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

export interface SimpleSubscriptionPlan {
  id: number;
  code: string;
  name: string;
}

export async function fetchPatientsForDropdown(): Promise<SimplePatient[]> {
  const patients: PatientResponse[] = await getAllPatients();
  return patients.map((p) => ({
    id: p.id,
    firstName: p.firstName,
    lastName: p.lastName,
    fullName: (p as any).fullName,
  }));
}

export async function fetchPlansForDropdown(): Promise<SimpleSubscriptionPlan[]> {
  const plans: SubscriptionPlan[] = await fetchSubscriptionPlans();
  return plans.map((pl) => ({
    id: pl.id,
    code: pl.code,
    name: pl.name,
  }));
}
  
