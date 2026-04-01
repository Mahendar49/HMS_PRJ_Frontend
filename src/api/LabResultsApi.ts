// src/api/labResultsApi.tsx
import { LabResultRequest, LabResultResponse, LabResultUpdateRequest } from "../types/LabResult";

const BASE_URL = "http://localhost:8084/api/lab/results";

const getToken = (): string | null => localStorage.getItem("authToken");

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

export const createLabResult = (payload: LabResultRequest) =>
  http<LabResultResponse>("", { method: "POST", body: JSON.stringify(payload) });

export const getLabResultById = (id: number) =>
  http<LabResultResponse>(`/${id}`, { method: "GET" });

export const getAllLabResults = () =>
  http<LabResultResponse[]>(``, { method: "GET" });

export const updateLabResult = (id: number, payload: LabResultUpdateRequest) =>
  http<LabResultResponse>(`/${id}`, { method: "PUT", body: JSON.stringify(payload) });

export const deleteLabResult = (id: number) =>
  http<void>(`/${id}`, { method: "DELETE" });