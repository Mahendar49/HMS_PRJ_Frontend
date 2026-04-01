import axios from "axios";
import {
  EncounterRequest,
  EncounterResponse,
  EncounterUpdateRequest,
} from "../types/Encounter";

const API_URL = "http://localhost:8084/api/encounters";

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
export const createEncounter = async (
  data: EncounterRequest,
  config?: any
) => {
  return axios.post<EncounterResponse>(
    API_URL,
    data,
    config ?? getAuthHeaders()
  );
};

// GET ALL
export const getAllEncounters = async () => {
  return axios.get<EncounterResponse[]>(API_URL, getAuthHeaders());
};

// GET BY ID
export const getEncounterById = async (id: number) => {
  return axios.get<EncounterResponse>(`${API_URL}/${id}`, getAuthHeaders());
};

// UPDATE
export const updateEncounter = async (id: number, data: EncounterUpdateRequest) => {
  return axios.put<EncounterResponse>(`${API_URL}/${id}`, data, getAuthHeaders());
};

// DELETE
export const deleteEncounter = async (id: number) => {
  return axios.delete(`${API_URL}/${id}`, getAuthHeaders());
};
