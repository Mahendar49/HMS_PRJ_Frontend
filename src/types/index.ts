// Re-export types from models
export * from "./models";

// Additional types for the role-feature management
export interface Role {
  id: number;
  name: string;
  description?: string;
  createdAt?: string;
  updatedAt?: string;
}
export interface FeatureForm {
  id?: number;
  code: string;
  name: string;
  description?: string;
  enable: boolean;
  sequence: number;
  parentId?: string;
}

export interface FeatureDto {
  id?: number;
  code: string;
  name: string;
  description?: string;
  enable: boolean;
  sequence: number;
  parentId?: number;
}
// src/types/index.ts
export interface RoleCretateRequest {
  id: number;
  name: string;
  description?: string;
}
