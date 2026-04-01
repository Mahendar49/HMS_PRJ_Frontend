// src/types/Encounter.ts

export interface EncounterRequest {
  patientId: number;
  appointmentId: number;
  providerId: number;

  startTime: string; // ISO string
  endTime?: string | null; // optional for ongoing encounters

  encounterType: string;
  chiefComplaint: string;
  note?: string;

  status?: string | null; // optional if you have status tracking
  createdBy?: number;
}

export interface EncounterUpdateRequest {
  patientId?: number;
  appointmentId?: number;
  providerId?: number;

  startTime?: string;
  endTime?: string | null;

  encounterType?: string;
  chiefComplaint?: string;
  note?: string;

  status?: string;
  updatedBy?: number;
}

export interface EncounterResponse {
  encounterCode: string;
  id: number;

  patientId: number;
  appointmentId: number;
  providerId: number;

  startTime: string;
  endTime: string | null;

  encounterType: string;
  chiefComplaint: string;
  note?: string;

  status: string;

  createdBy: number;
  createdAt: string;

  updatedBy?: number | null;
  updatedAt?: string | null;

  deletedAt?: string | null;
}
