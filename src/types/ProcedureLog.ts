// src/types/ProcedureLog.ts

export interface ProcedureLogRequest {
  encounterId: number;
  patientId: number;
  code: string;
  description: string;
  performedAt: string; // ISO string
  performedBy: number;
}

export interface ProcedureLogUpdateRequest {
  encounterId?: number;
  patientId?: number;
  code?: string;
  description?: string;
  performedAt?: string;
  performedBy?: number;
}

export interface ProcedureLogResponse {
  id: number;
  encounterId: number;
  patientId: number;
  code: string;
  description: string;
  performedAt: string;
  performedBy: number;
  createdAt: string;
}
