// src/api/labOrdersApi.tsx
import { LabOrderRequest, LabOrderResponse, LabOrderUpdateRequest } from "../types/LabOrders";

const BASE_URL = "http://localhost:8084/api/lab/orders";

// Read JWT token safely
const getToken = (): string | null => localStorage.getItem("authToken");

// Shared HTTP wrapper with strong typing
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

// -------------------------
// API CALLS
// -------------------------

export const createLabOrder = (payload: LabOrderRequest) =>
  http<LabOrderResponse>("", { method: "POST", body: JSON.stringify(payload) });

export const getLabOrderById = (id: number) =>
  http<LabOrderResponse>(`/${id}`, { method: "GET" });

export const getAllLabOrders = () =>
  http<LabOrderResponse[]>(``, { method: "GET" });

export const updateLabOrder = (id: number, payload: LabOrderUpdateRequest) =>
  http<LabOrderResponse>(`/${id}`, { method: "PUT", body: JSON.stringify(payload) });

export const deleteLabOrder = (id: number) =>
  http<void>(`/${id}`, { method: "DELETE" });