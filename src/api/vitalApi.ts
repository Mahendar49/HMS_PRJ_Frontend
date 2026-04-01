import axios from "axios";
import { VitalRequest, VitalResponse } from "../types/Vital";

const API_URL = "http://localhost:8084/api/vitals";

// Get JWT token and prepare headers
const getAuthHeaders = () => {
  const token = localStorage.getItem("authToken");
  return {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  };
};

// ---------------------- API CALLS ----------------------

// CREATE
export const createVital = async (data: VitalRequest, config?: any) => {
  return axios.post<VitalResponse>(API_URL, data, config ?? getAuthHeaders());
};

// GET ALL
export const getAllVitals = async () => {
  return axios.get<VitalResponse[]>(API_URL, getAuthHeaders());
};

// GET BY ID
export const getVitalById = async (id: number) => {
  return axios.get<VitalResponse>(`${API_URL}/${id}`, getAuthHeaders());
};

// GET BY PATIENT
export const getVitalsByPatient = async (patientId: number) => {
  return axios.get<VitalResponse[]>(
    `${API_URL}/patient/${patientId}`,
    getAuthHeaders()
  );
};

// GET BY ENCOUNTER
export const getVitalsByEncounter = async (encounterId: number) => {
  return axios.get<VitalResponse[]>(
    `${API_URL}/encounter/${encounterId}`,
    getAuthHeaders()
  );
};

// UPDATE
export const updateVital = async (id: number, data: VitalRequest) => {
  return axios.put<VitalResponse>(
    `${API_URL}/${id}`,
    data,
    getAuthHeaders()
  );
};

// DELETE
export const deleteVital = async (id: number) => {
  return axios.delete(`${API_URL}/${id}`, getAuthHeaders());
};
