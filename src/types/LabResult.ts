import { ReactNode } from "react";

export type ResultStatus = "finalv" | "preliminary" | "amended";


// ----------------------------
// CREATE REQUEST
// ----------------------------
export interface LabResultRequest {
  labOrderId: number;
  
  testName: string;
  resultValue: string;
  referenceRange: string;
  units: string;
  resultStatus: ResultStatus;
   // ISO string
}

// ----------------------------
// UPDATE REQUEST
// ----------------------------
export interface LabResultUpdateRequest {
  testCode?: string;
  testName?: string;
  resultValue?: string;
  referenceRange?: string;
  units?: string;
  resultStatus?: ResultStatus;
  resultDate?: string;
}

// ----------------------------
// RESPONSE FROM BACKEND
// ----------------------------
export interface LabResultResponse {
  createdAt: string | number | Date;
  performedAt: string | number | Date;
  resultDetails: ReactNode;
  orderedBy: ReactNode;
  encounterId: ReactNode;
  patientId: ReactNode;
  id: number;
 
  labOrderId: number;
  testCode: string;
  testName: string;
  resultValue: string;
  referenceRange: string;
  units: string;
  resultStatus: ResultStatus;
  resultDate: string; // ISO LocalDateTime
}