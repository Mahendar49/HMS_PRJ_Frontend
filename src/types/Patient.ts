// -----------------------------
// PATIENT – CREATE REQUEST
// Sent to: /api/v1/auth/registerPatient
// -----------------------------
export interface PatientRequest {
  password: string;
  mobile: string;
  enabled: boolean;
  locked: boolean;

  firstName: string;
  lastName: string;
  middleName: string;

  dob: string; // YYYY-MM-DD
  gender: string;

  email: string;
  preferredLanguage: string;

  address: string;
  cityId: number;
  stateId: number;
  countryId: number;

  postalCode: string;

  emergencyContactName: string;
  emergencyContactPhone: string;
}

// -----------------------------
// PATIENT – UPDATE REQUEST
// Sent to: /api/v1/patients/{id} (PUT)
// -----------------------------
export interface PatientUpdateRequest {
  firstName: string;
  lastName: string;
  middleName?: string | null;

  dob: string; // YYYY-MM-DD
  gender: string;

  email: string;
  mobile: string;

  preferredLanguage?: string | null;
  address: string;

  cityId: number;
  stateId: number;
  countryId: number;

  postalCode: string;

  emergencyContactName: string;
  emergencyContactPhone: string;
}

// -----------------------------
// PATIENT – RESPONSE DTO
// Returned from: GET /patients, GET /patients/{id}
// -----------------------------
export interface PatientResponse {
  id: number;
  userId: number;
  mrn: string;

  firstName: string;
  lastName: string;
  middleName: string | null;

  dob: string; // LocalDate → string
  gender: string;

  email: string;
  mobile: string;

  preferredLanguage: string | null;
  address: string;

  cityId: number;
  stateId: number;
  countryId: number;

  postalCode: string;

  emergencyContactName: string;
  emergencyContactPhone: string;

  createdAt: string; // LocalDateTime → ISO string
  updatedAt: string;
}
