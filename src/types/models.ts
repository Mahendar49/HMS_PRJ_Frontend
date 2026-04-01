export interface Patient { id:number; mrn:string; first_name:string; last_name:string; dob?:string; phone?:string; email?:string }
export interface Provider { id:number; provider_code?:string; first_name:string; last_name:string; specialty?:string }
export interface Appointment { id:number; patient_id:number; provider_id?:number; scheduled_start:string; status?:string }

// Role-based access control types
export interface Role {
  id: number;
  name: string;
  description?: string;
  createdAt?: string;
  updatedAt?: string;
  features?: Feature[];
}

export interface Feature {
  id: number;
  name: string;
  description?: string;
  category?: string;
  isActive?: boolean;
}

export interface User {
  id: number;
  email: string;
  mobileNumber?: string;
  enabled?: boolean;
  locked?: boolean;
  roles?: Role[];
  createdAt?: string;
  updatedAt?: string;
}

export interface Permission {
  id: number;
  name: string;
  resource: string;
  action: string;
  description?: string;
}

// API response types
export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}