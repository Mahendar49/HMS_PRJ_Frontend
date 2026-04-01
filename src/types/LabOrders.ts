import { ReactNode } from "react";

export interface LabOrderRequest {
  patientId: number;
  encounterId: number;
  orderedBy: number;
  
  orderStatus?: "ordered" | "in_progress" | "completed" | "cancelled";
  orderedAt?: string;       // optional ISO string
  performedAt?: string;     // optional ISO string
  resultSummary?: string;
}

// src/types/LabOrders.ts

export interface LabOrderUpdateRequest {
  orderCode?: string;
  patientId?: number;
  testCode?: string;
  orderStatus?: string;
  priority?: string;
  notes?: string;
  resultSummary?: string;

  encounterId?: number;  // ➕ added
  orderedBy?: number;      // ➕ added
}



export interface LabOrderResponse {
  patientName: ReactNode;
  notes: string | undefined;
  priority: string | undefined;
  testCode: string | undefined;
  id: number;
  patientId: number;
  encounterId: number;
  orderedBy: number;
  orderCode: string;
  orderStatus: "ordered" | "in_progress" | "completed" | "cancelled";
  orderedAt: string;
  performedAt?: string;
  resultSummary?: string;
  createdAt: string;
}