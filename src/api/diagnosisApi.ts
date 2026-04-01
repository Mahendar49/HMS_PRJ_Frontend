import axios from "axios";
import {
  DiagnosisRequest,
  DiagnosisResponse,
  DiagnosisUpdateRequest,
} from "../types/Diagnosis";

const API_URL = "http://localhost:8084/api/diagnosis";

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
export const createDiagnosis = async (data: DiagnosisRequest) => {
  return axios.post<DiagnosisResponse>(API_URL, data, getAuthHeaders());
};

// GET ALL
export const getAllDiagnosis = async () => {
  return axios.get<DiagnosisResponse[]>(API_URL, getAuthHeaders());
};

// GET BY ID
export const getDiagnosisById = async (id: number) => {
  return axios.get<DiagnosisResponse>(`${API_URL}/${id}`, getAuthHeaders());
};

// UPDATE
export const updateDiagnosis = async (id: number, data: DiagnosisUpdateRequest) => {
  return axios.put<DiagnosisResponse>(`${API_URL}/${id}`, data, getAuthHeaders());
};

// DELETE
export const deleteDiagnosis = async (id: number) => {
  return axios.delete(`${API_URL}/${id}`, getAuthHeaders());
};
