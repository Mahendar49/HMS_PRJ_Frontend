export interface DiagnosisRequest {
  encounterId?: number |string;
  patientId: number|string;
  code?: string;
  description?: string;
  onsetDate?: string; // yyyy-MM-dd
  status?: "active" | "resolved" | "chronic" | "historical";
}

export interface DiagnosisResponse {
  id: number;
  encounterId?: number | null;
  patientId: number;
  code: string;
  description: string;
  onsetDate: string;
  status: string;
  createdAt: string;
}

export interface DiagnosisUpdateRequest {
  code?: string;
  description?: string;
  onsetDate?: string;
  status?: "active" | "resolved" | "chronic" | "historical";
  encounterId?:number|string;
  patientId?:number|string;
}
