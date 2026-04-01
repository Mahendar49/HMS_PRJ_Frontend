export interface AppointmentRequest {
  provider_id: number;
  patient_id: number;
  organizationId: number;

  scheduledStart: string; // ISO string
  scheduledEnd: string;   // ISO string

  reason: string;
  visitType: string;
  status: string;

  createdBy: number;
}


export interface AppointmentUpdateRequest {
  patientId: number;
  providerId: number;
  organizationId?: number;

  scheduledStart?: string;
  scheduledEnd?: string;

  reason?: string;
  visitType?: string;

  status?: string;

  updatedBy?: number;
}

export interface AppointmentResponse {
  id: number;

  patientId: number;
  providerId: number;
   patientName?: string;   // <-- add this
  providerName?: string;
  organizationId: number | null;

  scheduledStart: string;
  scheduledEnd: string | null;

  status: string;
  reason: string;
  visitType: string;

  createdBy: number;
  createdAt: string;

  updatedBy: number | null;
  updatedAt: string;

  deletedAt: string | null;
  appointmentCode:string;
}
