// src/api/subscriptionPlanApi.ts

const HMS_BASE = "http://localhost:8084"; // same as medicationApi.ts

export interface SubscriptionPlan {
  id: number;
  code: string;
  name: string;
  description: string;
  price: number;              // DECIMAL(12,2)
  billingCycle: "monthly" | "quarterly" | "yearly";
       // 'monthly' | 'quarterly' | 'yearly'
  createdAt?: string;
}

export interface SubscriptionPlanCreatePayload {
  code:string;
  name: string;
  description?: string;
  price: number;
  billingCycle: "monthly" | "quarterly" | "yearly"; // or "monthly" | "quarterly" | "yearly"
}

export type SubscriptionPlanUpdatePayload = SubscriptionPlanCreatePayload;


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

// 🔹 For now we only need LIST – create/update/delete later
export function fetchSubscriptionPlans() {
  return request<SubscriptionPlan[]>("/api/subscription-plans", {
    method: "GET",
  });
}
// GET single by ID
export function fetchSubscriptionPlanById(id: number) {
  return request<SubscriptionPlan>(`/api/subscription-plans/${id}`, {
    method: "GET",
  });
}

// CREATE
export function createSubscriptionPlan(payload: SubscriptionPlanCreatePayload) {
  return request<SubscriptionPlan>("/api/subscription-plans", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

// UPDATE
export function updateSubscriptionPlan(
  id: number,
  payload: SubscriptionPlanUpdatePayload
) {
  return request<SubscriptionPlan>(`/api/subscription-plans/${id}`, {
    method: "PUT",
    body: JSON.stringify(payload),
  });
}

// DELETE
export async function deleteSubscriptionPlan(id: number): Promise<void> {
  const token = localStorage.getItem("authToken");

  const res = await fetch(`${HMS_BASE}/api/subscription-plans/${id}`, {
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

