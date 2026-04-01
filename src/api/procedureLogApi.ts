import axios from "axios";
import {
  ProcedureLogRequest,
  ProcedureLogResponse,
} from "../types/ProcedureLog";

const API_URL = "http://localhost:8084/api/procedure-log";

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
export const createProcedureLog = async (
  data: ProcedureLogRequest,
  config?: any
) => {
  return axios.post<ProcedureLogResponse>(
    API_URL,
    data,
    config ?? getAuthHeaders()
  );
};

// GET ALL
export const getAllProcedureLogs = async () => {
  return axios.get<ProcedureLogResponse[]>(API_URL, getAuthHeaders());
};

// GET BY ID
export const getProcedureLogById = async (id: number) => {
  return axios.get<ProcedureLogResponse>(
    `${API_URL}/${id}`,
    getAuthHeaders()
  );
};

// GET BY PATIENT
export const getProcedureLogsByPatient = async (patientId: number) => {
  return axios.get<ProcedureLogResponse[]>(
    `${API_URL}/patient/${patientId}`,
    getAuthHeaders()
  );
};

// GET BY ENCOUNTER
export const getProcedureLogsByEncounter = async (encounterId: number) => {
  return axios.get<ProcedureLogResponse[]>(
    `${API_URL}/encounter/${encounterId}`,
    getAuthHeaders()
  );
};

// UPDATE
export const updateProcedureLog = async (
  id: number,
  data: ProcedureLogRequest
) => {
  return axios.put<ProcedureLogResponse>(
    `${API_URL}/${id}`,
    data,
    getAuthHeaders()
  );
};

// DELETE
export const deleteProcedureLog = async (id: number) => {
  return axios.delete(`${API_URL}/${id}`, getAuthHeaders());
};
