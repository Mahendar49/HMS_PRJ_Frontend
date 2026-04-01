/**
 * Route registry for mapping menu codes to internal route paths
 * Add new mappings here as your application grows
 */
export const routesByCode: Record<string, string> = {
  // Dashboard routes
  dashboard: "/dashboard",
  DASH: "/dashboard",

  // Patient management
  patients: "/patients",
  PAT: "/patients",
  PATIENTS: "/patients",
  "patient-detail": "/patients/:id",

  // Provider management
  providers: "/providers",
  PROV: "/providers",
  PROVIDERS: "/providers",

  // Appointment management
  appointments: "/appointments",
  APT: "/appointments",
  APPOINTMENTS: "/appointments",

  //Clinical Records Management
  clinicalrecords: "/clinicalrecords",
  CLNR: "/clinicalrecords",
  CLINICALRECORDS: "/clinicalrecords",
  
  //Encounter management
  encounters: "/clinicalrecords/encounters",
  ENC: "/clinicalrecords/encounters",
  ENCOUNTERS: "/clinicalrecords/encounters",

  //Diagnosis management
  diagnosis: "/clinicalrecords/diagnosis",
  DIAG: "/clinicalrecords/diagnosis",
  DIAGNOSIS: "/clinicalrecords/diagnosis",

    //Vitals management
  vitals: "/clinicalrecords/vitals",
  VTL: "/clinicalrecords/vitals",
  VITALS: "/clinicalrecords/vitals",

  //procedureLog management
procedurelogs: "/clinicalrecords/procedure-logs",
PRC: "/clinicalrecords/procedure-logs",
PROCEDURELOGS: "/clinicalrecords/procedure-logs",
PROCEDURE_LOGS: "/clinicalrecords/procedure-logs",


   // Medications
  medications: "/medications",
  MED: "/medications",
  MEDICATIONS: "/medications",

laborders: "/laborders",
LO: "/laborders",
LABORDERS: "/laborders",

LabOrdersAndResults:"/laborders",
LOR: "/laborders",
LABORDERSANDRESULTS:"/laborders",



labresults: "/laborders/results",
LR: "/laborders/results",
LABRESULTS: "/laborders/results",


careplans: "/careplans",
CP: "/careplans",
CAREPLANS: "/careplans",

insurance:"/insurance",
IP:"/insurance",
INSURANCE:"/insurance",

insuranceprovider:"/insurance",
IPP:"/insurance",
INSURANCEPROVIDER:"/insurance",

patientinsurance:"/insurance/patient-insurance",
PI:"/insurance/patient-insurance",
PATIENTINSURANCE:"/insurance/patient-insurance",

CLM: "/insurance/claims",
clm: "/insurance/claims",
CLAIMS: "/insurance/claims",

  // Billing
  billing: "/billing",
  BILL: "/billing",
  BILLING: "/billing",

  // Administration
  admin: "/admin",
  ADM: "/admin",
  ADMIN: "/admin",
  users: "/admin/users",
  USR: "/admin/users",
  USERS: "/admin/users",
  roles: "/admin/roles",
  RL: "/admin/roles",
  ROLES: "/admin/roles",
  features: "/admin/features",
  FTR: "/admin/features",
  FEATURES: "/admin/features",
  "role-features": "/admin/role-feature-manager",
  "role-feature-manager": "/admin/role-feature-manager",
  RFM: "/admin/role-feature-manager",

  // Reports (example)
  reports: "/reports",
  "financial-reports": "/reports/financial",
  "patient-reports": "/reports/patients",

  // Settings
  settings: "/settings",
  profile: "/profile",

  // Add more mappings as needed
};

/**
 * Gets the route path for a given menu code
 * @param code Menu code from MenuItem
 * @returns Route path or default path based on code
 */
export function getRouteForCode(code: string): string {
  const route = routesByCode[code];
  if (route) {
    console.log("🗺️ [ROUTE-REGISTRY] Route found for code:", { code, route });
    return route;
  }

  // Try lowercase fallback
  const lowerRoute = routesByCode[code.toLowerCase()];
  if (lowerRoute) {
    console.log("🗺️ [ROUTE-REGISTRY] Route found (lowercase) for code:", {
      code,
      route: lowerRoute,
    });
    return lowerRoute;
  }

  // Generate default route
  const defaultRoute = `/${code.toLowerCase()}`;
  console.log("⚠️ [ROUTE-REGISTRY] No explicit route found, using default:", {
    code,
    defaultRoute,
  });
  return defaultRoute;
}

/**
 * Register a new route mapping dynamically
 * @param code Menu code
 * @param route Route path
 */
export function registerRoute(code: string, route: string): void {
  console.log("📝 [ROUTE-REGISTRY] Registering new route:", { code, route });
  routesByCode[code] = route;
}

/**
 * Checks if a code has an explicit route mapping
 * @param code Menu code to check
 * @returns True if code has explicit mapping
 */
export function hasExplicitRoute(code: string): boolean {
  return code in routesByCode;
}
