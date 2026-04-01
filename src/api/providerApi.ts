// providerApi.ts

import {
  RegisterProviderRequest,
  ProviderResponse,
  ProviderCreateRequest,
  ProviderUpdateRequest,
} from "../types/provider";

const HMS_BASE = "http://localhost:8084/api/v1/providers";

// get JWT token
const getToken = () => localStorage.getItem("authToken");

// shared http wrapper
async function httpProvider<T>(
  path: string,
  init: RequestInit = {}
): Promise<T> {
  const token = getToken();

  const headers: Record<string, string> = {
    Accept: "application/json",
    ...(init.headers as Record<string, string>),
  };

  if (init.body && !headers["Content-Type"]) {
    headers["Content-Type"] = "application/json";
  }

  if (token) headers["Authorization"] = `Bearer ${token}`;

  const res = await fetch(`${HMS_BASE}${path}`, {
    mode: "cors",
    credentials: "include",
    ...init,
    headers,
  });

  let data: any = {};
  try {
    if (res.status !== 204) data = await res.json();
  } catch {
    data = { message: "No JSON body returned" };
  }

  if (!res.ok) {
    const msg =
      data?.message || `Provider API Error: ${res.status} ${res.statusText}`;

    const error: any = new Error(msg);
    error.status = res.status;
    error.body = data;
    throw error;
  }

  return data as T;
}

// ---------------- API ----------------

export const registerProvider = (payload: RegisterProviderRequest) =>
  httpProvider<ProviderResponse>("", {
    method: "POST",
    body: JSON.stringify(payload),
  });

export const getAllProviders = () => httpProvider<ProviderResponse[]>("");

export const getProviderById = (id: number) =>
  httpProvider<ProviderResponse>(`/${id}`);

export const createProviderHms = (payload: ProviderCreateRequest) =>
  httpProvider<ProviderResponse>("", {
    method: "POST",
    body: JSON.stringify(payload),
  });

export const updateProviderHms = (id: number, payload: ProviderUpdateRequest) =>
  httpProvider<ProviderResponse>(`/${id}`, {
    method: "PUT",
    body: JSON.stringify(payload),
  });

export const deleteProviderHms = (id: number) =>
  httpProvider<void>(`/${id}`, {
    method: "DELETE",
  });
