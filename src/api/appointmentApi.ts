import {
  AppointmentRequest,
  AppointmentResponse,
  AppointmentUpdateRequest,
} from "../types/Appointment";

const BASE_URL = "http://localhost:8084/api/v1/appointments";

// ----------------------------------------------------
//  Read JWT token safely
// ----------------------------------------------------
const getToken = (): string | null => localStorage.getItem("authToken");

// ----------------------------------------------------
//  Shared HTTP wrapper with strong typing
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

  // Read raw text first
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
//  API CALLS
// ------------------------------------------------------------

// CREATE
export const createAppointment = (payload: AppointmentRequest) =>
  http<AppointmentResponse>("", {
    method: "POST",
    body: JSON.stringify(payload),
  });

// GET BY ID
export const getAppointmentById = (id: number) =>
  http<AppointmentResponse>(`/${id}`, { method: "GET" });

// GET ALL
export const getAllAppointments = () =>
  http<AppointmentResponse[]>(``, { method: "GET" });


// UPDATE
export const updateAppointment = (
  id: number,
  payload: AppointmentUpdateRequest
) =>
  http<AppointmentResponse>(`/${id}`, {
    method: "PUT",
    body: JSON.stringify(payload),
  });

// UPDATE ONLY STATUS
export const updateAppointmentStatus = (id: number, status: string) =>
  http<AppointmentResponse>(`/${id}/status?status=${status}`, {
    method: "PATCH",
  });

// DELETE
export const deleteAppointment = (id: number) =>
  http<void>(`/${id}`, {
    method: "DELETE",
  });
