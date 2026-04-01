// src/types/insurance.ts

export interface InsuranceProvider {
  id: number;
  name: string;
  payerId: string;
  contactInfo: string;
  createdAt?: string;
}

export interface InsuranceProviderCreatePayload {
  name: string;
  payerId: string;
  contactInfo: string;
}

export type InsuranceProviderUpdatePayload = InsuranceProviderCreatePayload;
