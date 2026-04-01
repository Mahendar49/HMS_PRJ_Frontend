export interface InsuranceClaimRequest {
  patientId: number;
  insuranceProviderId: number;
  encounterId?: number;
  claimNumber?: string;
  status?: string;
  totalAmount?: number;
  submittedAt?: string | null;
  adjudicatedAt?: string | null;
}

export interface InsuranceClaimResponse {
  id: number;
  patientId: number;
  insuranceProviderId: number;
  encounterId: number;
  claimNumber: string;
  status: string;
  totalAmount: number;
  submittedAt: string | null;
  adjudicatedAt: string | null;
  createdAt: string;
}