// src/types/user.ts
export interface RegisterRequest {
  email: string;
  password: string;
  mobile: string;
  enabled?: boolean;
  locked?: boolean;
  firstName: string;
  lastName: string;
  dob: string; // ISO date string format (YYYY-MM-DD)
  address: string;
}

export interface UserResponse {
  id: any;
  userId: number;
  firstName: string;
  lastName: string;
  dob: string;          // LocalDate → string (YYYY-MM-DD)
  mobile: string;
  address: string;
  createdAt: string;    // LocalDateTime → ISO string
  updatedAt: string;    // LocalDateTime → ISO string
}
