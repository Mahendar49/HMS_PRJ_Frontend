export interface PatientInsuranceRequest {
  patientId: number;
  insuranceProviderId: number;
  subscriberName: string;
  effectiveFrom: string; // yyyy-mm-dd
  effectiveTo: string;   // yyyy-mm-dd
}

export interface PatientInsuranceUpdateRequest {
  patientId: number;
  insuranceProviderId: number;
  subscriberName: string;
  effectiveFrom: string;
  effectiveTo: string;
}

export interface PatientInsuranceResponse {
  id: number;
  patientId: number;
  insuranceProviderId: number;
  policyNumber: string;
  subscriberName: string;
  effectiveFrom: string;
  effectiveTo: string;
  createdAt: string;
}
