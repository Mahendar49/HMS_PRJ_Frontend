// src/types/Vital.ts

export interface VitalRequest {
  patientId: number;
  encounterId: number;
  type: string;
  value: string;
  unit: string;
  measuredAt: string; // ISO date string
  recordedBy: number;
}

export interface VitalUpdateRequest {
  patientId?: number;
  encounterId?: number;
  type?: string;
  value?: string;
  unit?: string;
  measuredAt?: string;
  recordedBy?: number;
}

export interface VitalResponse {
  id: number;
  patientId: number;
  encounterId: number;
  type: string;
  value: string;
  unit: string;
  measuredAt: string;
  recordedBy: number;
}
