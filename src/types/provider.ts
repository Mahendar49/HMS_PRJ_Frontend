// -------------------- REGISTER PROVIDER --------------------
export interface RegisterProviderRequest {
  email: string;
  password: string;
  mobile: string;
  enabled: boolean;
  locked: boolean;
  providerName: string;
  specialization: string;
  experienceYears: number;
  address: string;
  status: string;
}
export interface ProviderResponse {
  id: number;
  userId: number;
  email: string;
  mobile: string;
  providerCode: string;
  providerName: string;
  specialization: string;
  experienceYears: number;
  address: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  fullName:string;
}

export interface ProviderCreateRequest {
  email: string;
  password: string;
  mobile: string;
  enabled: boolean;
  locked: boolean;
  providerCode: string;
  providerName: string;
  specialization: string;
  experienceYears: number;
  address: string;
  status: string;
}

export interface ProviderUpdateRequest {
  providerName?: string;
  specialization?: string;
  experienceYears?: number;
  address?: string;
  status?: string;
}
//==================++
