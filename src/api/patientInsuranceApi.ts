import axios from "axios";
import {
  PatientInsuranceRequest,
  PatientInsuranceResponse,
  PatientInsuranceUpdateRequest,
} from "../types/PatientInsurance";

const API_URL = "http://localhost:8084/api/patient-insurance";

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
export const createPatientInsurance = async (
  data: PatientInsuranceRequest,
  config?: any
) => {
  return axios.post<PatientInsuranceResponse>(
    `${API_URL}/create`,
    data,
    config ?? getAuthHeaders()
  );
};

// GET ALL
export const getAllPatientInsurance = async () => {
  return axios.get<PatientInsuranceResponse[]>(
    `${API_URL}/all`,
    getAuthHeaders()
  );
};

// GET BY ID
export const getPatientInsuranceById = async (id: number) => {
  return axios.get<PatientInsuranceResponse>(
    `${API_URL}/${id}`,
    getAuthHeaders()
  );
};

// UPDATE
export const updatePatientInsurance = async (
  id: number,
  data: PatientInsuranceUpdateRequest
) => {
  return axios.put<PatientInsuranceResponse>(
    `${API_URL}/update/${id}`,
    data,
    getAuthHeaders()
  );
};

// DELETE
export const deletePatientInsurance = async (id: number) => {
  return axios.delete(
    `${API_URL}/delete/${id}`,
    getAuthHeaders()
  );
};
