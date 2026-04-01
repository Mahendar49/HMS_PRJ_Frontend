import { get } from "react-hook-form";
import { PatientResponse, PatientUpdateRequest } from "../types/Patient";

const HMS_BASE = "http://localhost:8084/api/v1/patients";

/** Always load fresh JWT from localStorage */
function getAuthToken(): string | null {
  return localStorage.getItem("authToken");
}

/** Global HMS API client with auto-token */
async function httpHms<T>(path: string, options: RequestInit = {}): Promise<T> {
  const token = getAuthToken();

  const headers: Record<string, string> = {
    Accept: "application/json",
    "Content-Type": "application/json",
    ...(options.headers as Record<string, string>),
  };

  if (token) headers["Authorization"] = `Bearer ${token}`;

  const response = await fetch(path, {
    ...options,
    headers,
    mode: "cors",
  });

  if (response.status === 204) return undefined as T;

  const body = await response.json().catch(() => ({}));

  if (!response.ok) {
    const message = body?.message || body?.error || `HTTP ${response.status}`;
    throw new Error(message);
  }

  return body as T;
}

/* --------------------------
   PATIENT API METHODS
----------------------------- */

/** ✔ Get ALL patients */
export const getAllPatients = (): Promise<PatientResponse[]> =>
  httpHms<PatientResponse[]>(HMS_BASE);
getAllPatients().then((data) => console.log(data));

/** ✔ Get single patient by ID */
export const getPatientById = (id: number): Promise<PatientResponse> =>
  httpHms<PatientResponse>(`${HMS_BASE}/${id}`);

/** ✔ Update patient */
export const updatePatient = (
  id: number,
  payload: PatientUpdateRequest
): Promise<PatientResponse> =>
  httpHms<PatientResponse>(`${HMS_BASE}/${id}`, {
    method: "PUT",
    body: JSON.stringify(payload),
  });
