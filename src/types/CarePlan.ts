export interface CarePlanResponse {
  id: number;
  name: string;
  description?: string | null;
  active: boolean;
  createdAt?: string;   // ISO date string from backend
  createdBy?: number | null;
}

export interface CarePlanRequest {
  name: string;
  description?: string | null;
  active: boolean;
}
