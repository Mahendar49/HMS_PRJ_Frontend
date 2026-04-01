import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Register from "./pages/Register";
import Login from "./pages/Login";
import DemoLogin from "./pages/DemoLogin";
import LayoutHybrid from "./components/LayoutHybrid";
import LayoutLogin from "./components/LayoutLogin";
import RBACRouteGuard from "./components/RBACRouteGuard";
import SmartRedirect from "./components/SmartRedirect";
import Dashboard from "./pages/Dashboard";

import Providers from "./pages/Providers";
import Appointments from "./pages/Appointments";
import Billing from "./pages/Billing";
import Admin from "./pages/Admin";
import NotAuthorized from "./pages/NotAuthorized";
import ViewUser from "./pages/users/ViewUser";
import EditUser from "./pages/users/EditUser";
import AssignRoles from "./pages/users/AssignRoles";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import RoleCreation from "./pages/roles/RoleCreation";
import FeatureManager from "./pages/features/FeatureManager";
import UsersManager from "./pages/users/UsersManager";
import RoleFeatureManager from "./pages/features/RoleFeatureManager";
import PatientRegister from "./pages/patient/PatientRegister";
import PatientDetail from "./pages/patient/PatientDetail";
import ProviderRegister from "./pages/providers/ProviderRegister";
import ProviderList from "./pages/providers/ProviderList";
import ProviderEdit from "./pages/providers/ProviderEdit";
import ProviderDetails from "./pages/providers/ProviderDetails";
import PatientList from "./pages/patient/PatientList";
import PatientDetails from "./pages/patient/PatientDetail";
import PatientEdit from "./pages/patient/PatientEdit";
import AppointmentCreate from "./pages/Appointment/AppointmentCreate";
import AppointmentListPage from "./pages/Appointment/AppointmentListPage";
import AppointmentEditPage from "./pages/Appointment/AppointmentEditPage";
import AppointmentViewPage from "./pages/Appointment/AppointmentViewPage";
import EncounterFormPage from "./pages/ClinicalRecords/EncounterFormPage";
import EncounterListPage from "./pages/ClinicalRecords/EncounterListPage";
import EncounterViewPage from "./pages/ClinicalRecords/EncounterViewPage";
import EncounterEditPage from "./pages/ClinicalRecords/EncounterEditPage";
import DiagnosisListPage from "./pages/ClinicalRecords/DiagnosisListPage";
import DiagnosisFormPage from "./pages/ClinicalRecords/DiagnosisFormPage";
import DiagnosisViewPage from "./pages/ClinicalRecords/DiagnosisViewPage";
import DiagnosisEditPage from "./pages/ClinicalRecords/DiagnosisEditPage";

import MedicationCreatePage from "./pages/Medications/MedicationsCreatePage";
import PrescriptionCreatePage from "./pages/Medications/PrescriptionCreatePage";
import PrescriptionPage from "./pages/Medications/PrescriptionPage";
import MedicationsPage from "./pages/Medications/MedicationsPage";
import MedicationEditPage from "./pages/Medications/MedicationEditPage";
import PrescriptionEditPage from "./pages/Medications/PrescriptionEditPage";

import CarePlanListPage from "./pages/CarePlans/CarePlanListPage";
import PatientCarePlanListPage from "./pages/CarePlans/PatientCarePlanListPage";
import SubscriptionPlanListPage from "./pages/CarePlans/SubscriptionPlanListPage";
import SubscriptionListPage from "./pages/CarePlans/SubscriptionListPage";
import CarePlanEditPage from "./pages/CarePlans/CarePlanEditPage";
import CarePlanCreatePage from "./pages/CarePlans/CarePlanCreatePage";
import PatientCarePlanEditPage from "./pages/CarePlans/PatientCarePlanEditPage";
import PatientCarePlanCreatePage from "./pages/CarePlans/PatientCarePlanCreatePage";
import SubscriptionPlanCreatePage from "./pages/CarePlans/SubscriptionPlanCreatePage";
import SubscriptionPlanEditPage from "./pages/CarePlans/SubscriptionPlanEditPage";
import SubscriptionCreatePage from "./pages/CarePlans/SubscriptionCreatePage";

import VitalListPage from "./pages/ClinicalRecords/VitalListPage";
import VitalCreatePage from "./pages/ClinicalRecords/VitalCreatePage";
import VitalViewPage from "./pages/ClinicalRecords/VitalViewPage";
import VitalEditPage from "./pages/ClinicalRecords/VitalEditpage";
import ProcedureLogListPage from "./pages/ClinicalRecords/ProcedureLogListPage";
import ProcedureLogCreatePage from "./pages/ClinicalRecords/ProcedureLogCreatePage";
import ProcedureLogViewPage from "./pages/ClinicalRecords/ProcedureLogViewPage";
import ProcedureLogEditPage from "./pages/ClinicalRecords/ProcedureLogEditPage";
import LabOrdersListPage from "./pages/LabResultsAndRecords/LabOrdersListPage";
import LabOrdersCreatePage from "./pages/LabResultsAndRecords/LabOrdersCreatePage";
import LabOrdersViewPage from "./pages/LabResultsAndRecords/LabOrdersViewPage";
import LabOrdersEditPage from "./pages/LabResultsAndRecords/LabOrdersEditPage";
import LabResultsListPage from "./pages/LabResultsAndRecords/LabResultsListPage";
import LabResultCreatePage from "./pages/LabResultsAndRecords/LabResultsCreatePage";
import LabResultsViewPage from "./pages/LabResultsAndRecords/LabResultsViewPage";
import LabResultEditPage from "./pages/LabResultsAndRecords/LabResultsEditPage";
import SubscriptionEditPage from "./pages/CarePlans/SubscriptionEditPage";
import PageNotFound from "./components/PageNotFound";
import InsuranceProviderListPage from "./pages/Insurance/InsuranceProviderListPage";
import InsuranceProviderCreatePage from "./pages/Insurance/InsuranceProviderCreatePage";
import InsuranceProviderEditPage from "./pages/Insurance/InsuranceProviderEditPage";
import PatientInsuranceListPage from "./pages/Insurance/PatientInsuranceListPage";
import PatientInsuranceCreatePage from "./pages/Insurance/PatientInsuranceCreatePage";
import PatientInsuranceViewPage from "./pages/Insurance/PatientInsuranceViewPage";
import PatientInsuranceEditPage from "./pages/Insurance/PatientInsuranceEditPage";
import InsuranceClaimCreatePage from "./pages/Insurance/InsuranceClaimCreatePage";
import InsuranceClaimEditPage from "./pages/Insurance/InsuranceClaimEditPage";
import InsuranceClaimViewPage from "./pages/Insurance/InsuranceClaimViewPage";
import InsuranceClaimListPage from "./pages/Insurance/InsuranceClaimListPage";

// Simple authentication checker
const isAuthenticated = (): boolean => {
  // Check if user has a valid token
  const token = localStorage.getItem("authToken");
  return token !== null;
};

// Protected Route component
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const authenticated = isAuthenticated();
  return authenticated ? <>{children}</> : <Navigate to="/login" replace />;
};

// Public Route component (for login/register only)
const PublicRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const authenticated = isAuthenticated();
  return !authenticated ? <>{children}</> : <SmartRedirect />;
};

export default function App() {
  return (
    <Routes>
      {/* Public routes - only accessible when NOT logged in */}
      <Route
        path="/login"
        element={
          <PublicRoute>
            <Login />
          </PublicRoute>
        }
      />

      <Route
        path="/demo-login"
        element={
          <PublicRoute>
            <DemoLogin />
          </PublicRoute>
        }
      />

      <Route
        path="/register"
        element={
          <PublicRoute>
            <LayoutLogin wide={true}>
              <PatientRegister />
            </LayoutLogin>
          </PublicRoute>
        }
      />

      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password" element={<ResetPassword />} />

      {/* Not Authorized page - accessible to authenticated users */}
      <Route path="/not-authorized" element={<NotAuthorized />} />

      {/* Protected routes - only accessible when logged in */}
      <Route path="/" element={<SmartRedirect />} />
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <LayoutHybrid>
              <Dashboard />
            </LayoutHybrid>
          </ProtectedRoute>
        }
      />

      <Route
        path="/patients"
        element={
          <ProtectedRoute>
            <RBACRouteGuard requiredPath="/patients">
              <LayoutHybrid>
                <PatientList />
              </LayoutHybrid>
            </RBACRouteGuard>
          </ProtectedRoute>
        }
      />
      <Route
        path="/patients/:id"
        element={
          <ProtectedRoute>
            <RBACRouteGuard requiredPath="/patients">
              <LayoutHybrid>
                <PatientDetails />
              </LayoutHybrid>
            </RBACRouteGuard>
          </ProtectedRoute>
        }
      />
      <Route
        path="/patients/new"
        element={
          <ProtectedRoute>
            <LayoutHybrid>
              <PatientRegister />
            </LayoutHybrid>
          </ProtectedRoute>
        }
      />
      <Route
        path="/patients/edit/:id"
        element={
          <ProtectedRoute>
            <LayoutHybrid>
              <PatientEdit />
            </LayoutHybrid>
          </ProtectedRoute>
        }
      />
      <Route
        path="/patients/:id"
        element={
          <ProtectedRoute>
            <LayoutHybrid>
              <PatientDetail />
            </LayoutHybrid>
          </ProtectedRoute>
        }
      />

      <Route
        path="/providers"
        element={
          <ProtectedRoute>
            <RBACRouteGuard requiredPath="/providers">
              <LayoutHybrid>
                <ProviderList />
              </LayoutHybrid>
            </RBACRouteGuard>
          </ProtectedRoute>
        }
      />
      <Route
        path="/providers/register-provider"
        element={
          <ProtectedRoute>
            <LayoutHybrid>
              <ProviderRegister />
            </LayoutHybrid>
          </ProtectedRoute>
        }
      />
      <Route
        path="/providers/edit/:id"
        element={
          <ProtectedRoute>
            <LayoutHybrid>
              <ProviderEdit />
            </LayoutHybrid>
          </ProtectedRoute>
        }
      />
      <Route
        path="/providers/:id"
        element={
          <ProtectedRoute>
            <LayoutHybrid>
              <ProviderDetails />
            </LayoutHybrid>
          </ProtectedRoute>
        }
      />

      <Route
        path="/providers/delete"
        element={
          <ProtectedRoute>
            <LayoutHybrid>
              <Providers />
            </LayoutHybrid>
          </ProtectedRoute>
        }
      />
      <Route
        path="/appointments"
        element={
          <ProtectedRoute>
            <RBACRouteGuard requiredPath="/appointments">
              <LayoutHybrid>
                <AppointmentListPage />
              </LayoutHybrid>
            </RBACRouteGuard>
          </ProtectedRoute>
        }
      />
      <Route
        path="/appointments/new"
        element={
          <ProtectedRoute>
            <LayoutHybrid>
              <AppointmentCreate />
            </LayoutHybrid>
          </ProtectedRoute>
        }
      />
      <Route
        path="/appointments/edit/:id"
        element={
          <ProtectedRoute>
            <LayoutHybrid>
              <AppointmentEditPage />
            </LayoutHybrid>
          </ProtectedRoute>
        }
      />
      <Route
        path="/appointments/view/:id"
        element={
          <ProtectedRoute>
            <LayoutHybrid>
              <AppointmentViewPage />
            </LayoutHybrid>
          </ProtectedRoute>
        }
      />
      <Route
        path="/appointments/events"
        element={
          <ProtectedRoute>
            <LayoutHybrid>
              <Appointments />
            </LayoutHybrid>
          </ProtectedRoute>
        }
      />
      {/* Clinical Records - Parent route */}
      {/*<Route
  path="/ClinicalRecords"
  element={
    <ProtectedRoute>
      <LayoutHybrid>
        <div>Select a Clinical Record option from the left menu.</div>
      </LayoutHybrid>
    </ProtectedRoute>
  }
/>*/}

      { <Route
        path="/clinicalrecords"
        element={
          <ProtectedRoute>
            <RBACRouteGuard requiredPath="/clinicalrecords">
              <LayoutHybrid>
                <EncounterListPage />
              </LayoutHybrid>
            </RBACRouteGuard>
          </ProtectedRoute>
        }
      /> }

      <Route
        path="/clinicalrecords/encounters"
        element={
          <ProtectedRoute>
            <LayoutHybrid>
              <EncounterListPage />
            </LayoutHybrid>
          </ProtectedRoute>
        }
      />

      <Route
        path="/clinicalrecords/encounters/new"
        element={
          <ProtectedRoute>
            <LayoutHybrid>
              <EncounterFormPage />
            </LayoutHybrid>
          </ProtectedRoute>
        }
      />

      {/* View Encounter */}
      <Route
        path="/clinicalrecords/encounters/view/:id"
        element={
          <ProtectedRoute>
            <LayoutHybrid>
              <EncounterViewPage />
            </LayoutHybrid>
          </ProtectedRoute>
        }
      />

      {/* Edit Encounter */}
      <Route
        path="/clinicalrecords/encounters/edit/:id"
        element={
          <ProtectedRoute>
            <LayoutHybrid>
              <EncounterEditPage />
            </LayoutHybrid>
          </ProtectedRoute>
        }
      />

      {/* -----------------------------------------
    DIAGNOSIS ROUTES
----------------------------------------- */}

      {/* Diagnosis List Page */}
      <Route
        path="/clinicalrecords/diagnosis"
        element={
          <ProtectedRoute>
            <LayoutHybrid>
              <DiagnosisListPage />
            </LayoutHybrid>
          </ProtectedRoute>
        }
      />

      {/* Create Diagnosis */}
      <Route
        path="/clinicalrecords/diagnosis/new"
        element={
          <ProtectedRoute>
            <LayoutHybrid>
              <DiagnosisFormPage />
            </LayoutHybrid>
          </ProtectedRoute>
        }
      />

      {/* View Diagnosis */}
      <Route
        path="/clinicalrecords/diagnosis/:id"
        element={
          <ProtectedRoute>
            <LayoutHybrid>
              <DiagnosisViewPage />
            </LayoutHybrid>
          </ProtectedRoute>
        }
      />

      {/* Edit Diagnosis */}
      <Route
        path="/clinicalrecords/diagnosis/:id/edit"
        element={
          <ProtectedRoute>
            <LayoutHybrid>
              <DiagnosisEditPage />
            </LayoutHybrid>
          </ProtectedRoute>
        }
      />

      {/* -----------------------------------------
  VITALS ROUTES
----------------------------------------- */}

<Route
  path="/clinicalrecords/vitals"
  element={
    <ProtectedRoute>
      <LayoutHybrid>
        <VitalListPage />
      </LayoutHybrid>
    </ProtectedRoute>
  }
/>

<Route
  path="/clinicalrecords/vitals/new"
  element={
    <ProtectedRoute>
      <LayoutHybrid>
        <VitalCreatePage />
      </LayoutHybrid>
    </ProtectedRoute>
  }
/>

<Route
  path="/clinicalrecords/vitals/view/:id"
  element={
    <ProtectedRoute>
      <LayoutHybrid>
        <VitalViewPage />
      </LayoutHybrid>
    </ProtectedRoute>
  }
/>

<Route
  path="/clinicalrecords/vitals/edit/:id"
  element={
    <ProtectedRoute>
      <LayoutHybrid>
        <VitalEditPage />
      </LayoutHybrid>
    </ProtectedRoute>
  }
/>

{/* -----------------------------------------
  PROCEDURE LOGS ROUTES
----------------------------------------- */}

<Route
  path="/clinicalrecords/procedure-logs"
  element={
    <ProtectedRoute>
      <LayoutHybrid>
        <ProcedureLogListPage />
      </LayoutHybrid>
    </ProtectedRoute>
  }
/>

<Route
  path="/clinicalrecords/procedure-logs/new"
  element={
    <ProtectedRoute>
      <LayoutHybrid>
        <ProcedureLogCreatePage />
      </LayoutHybrid>
    </ProtectedRoute>
  }
/>

<Route
  path="/clinicalrecords/procedure-logs/view/:id"
  element={
    <ProtectedRoute>
      <LayoutHybrid>
        <ProcedureLogViewPage />
      </LayoutHybrid>
    </ProtectedRoute>
  }
/>

<Route
  path="/clinicalrecords/procedure-logs/edit/:id"
  element={
    <ProtectedRoute>
      <LayoutHybrid>
        <ProcedureLogEditPage />
      </LayoutHybrid>
    </ProtectedRoute>
  }
/>


      {/* NEW: Medications main page */}
<Route
  path="/medications"
  element={
    <ProtectedRoute>
      <LayoutHybrid>
        < MedicationsPage/>
      </LayoutHybrid>
    </ProtectedRoute>
  }
/>

{/* NEW: Presception page */}
<Route
  path="/medications/prescriptions"
  element={
    <ProtectedRoute>
      <LayoutHybrid>
        <PrescriptionPage />
      </LayoutHybrid>
    </ProtectedRoute>
  }
/>

<Route
  path="/medications/new"
  element={
    <ProtectedRoute>
      <LayoutHybrid>
        <MedicationCreatePage />
      </LayoutHybrid>
    </ProtectedRoute>
  }
/>
<Route
  path="/medications/:id/edit"
  element={
    <ProtectedRoute>
      <LayoutHybrid>
        <MedicationEditPage />
      </LayoutHybrid>
    </ProtectedRoute>
  }
/>

<Route
  path="/medications/prescriptions/new"
  element={
    <ProtectedRoute>
      <LayoutHybrid>
        <PrescriptionCreatePage />
      </LayoutHybrid>
    </ProtectedRoute>
  }
/>
<Route
  path="/medications/prescriptions/:id/edit"
  element={
    <ProtectedRoute>
      <LayoutHybrid>
        <PrescriptionEditPage />
      </LayoutHybrid>
    </ProtectedRoute>
  }
/>
<Route
  path="/careplans"
  element={
    <ProtectedRoute>
      <LayoutHybrid>
        <CarePlanListPage />
      </LayoutHybrid>
    </ProtectedRoute>
  }
/>
<Route
  path="/careplans/new"
  element={
    <ProtectedRoute>
      <LayoutHybrid>
        <CarePlanCreatePage />
      </LayoutHybrid>
    </ProtectedRoute>
  }
/>

<Route
  path="/careplans/:id/edit"
  element={
    <ProtectedRoute>
      <LayoutHybrid>
        <CarePlanEditPage />
      </LayoutHybrid>
    </ProtectedRoute>
  }
/>



  {/* <Route
  path="/careplans/care-plans"
  element={
    <ProtectedRoute>
      <LayoutHybrid>
        <CarePlanListPage />
      </LayoutHybrid>
    </ProtectedRoute>
  }
/> */}

<Route
  path="/careplans/patient-care-plans"
  element={
    <ProtectedRoute>
      <LayoutHybrid>
        <PatientCarePlanListPage />
      </LayoutHybrid>
    </ProtectedRoute>
  }
/>

<Route
  path="/careplans/patient-care-plans/new"
  element={
    <ProtectedRoute>
      <LayoutHybrid>
        <PatientCarePlanCreatePage />
      </LayoutHybrid>
    </ProtectedRoute>
  }
/>

<Route
  path="/careplans/patient-care-plans/:id/edit"
  element={
    <ProtectedRoute>
      <LayoutHybrid>
        <PatientCarePlanEditPage />
      </LayoutHybrid>
    </ProtectedRoute>
  }
/>


<Route
  path="/careplans/subscription-plans"
  element={
    <ProtectedRoute>
      <LayoutHybrid>
        <SubscriptionPlanListPage />
      </LayoutHybrid>
    </ProtectedRoute>
  }
/>

<Route
  path="/careplans/subscription-plans/new"
  element={
    <ProtectedRoute>
      <LayoutHybrid>
        <SubscriptionPlanCreatePage />
      </LayoutHybrid>
    </ProtectedRoute>
  }
/>
<Route
  path="/careplans/subscription-plans/:id/edit"
  element={
    <ProtectedRoute>
      <LayoutHybrid>
        <SubscriptionPlanEditPage />
      </LayoutHybrid>
    </ProtectedRoute>
  }
/>

<Route
  path="/careplans/subscriptions"
  element={
    <ProtectedRoute>
      <LayoutHybrid>
        <SubscriptionListPage />
      </LayoutHybrid>
    </ProtectedRoute>
  }
/>



<Route
  path="/careplans/subscriptions/new"
  element={
    <ProtectedRoute>
      <LayoutHybrid>
        <SubscriptionCreatePage />
      </LayoutHybrid>
    </ProtectedRoute>
  }
/>

<Route
  path="/careplans/subscriptions/:id/edit"
  element={
    <ProtectedRoute>
      <LayoutHybrid>
        <SubscriptionEditPage />
      </LayoutHybrid>
    </ProtectedRoute>
  }
/>


{/* -----------------------------------------
  LAB ORDERS ROUTES
----------------------------------------- */}
<Route
  path="/laborders"
  element={
    <ProtectedRoute>
      <RBACRouteGuard requiredPath="/laborders">
        <LayoutHybrid>
          <LabOrdersListPage />
        </LayoutHybrid>
      </RBACRouteGuard>
    </ProtectedRoute>
  }
/>
<Route
  path="/laborders/new"
  element={
    <ProtectedRoute>
      <LayoutHybrid>
        <LabOrdersCreatePage />
      </LayoutHybrid>
    </ProtectedRoute>
  }
/>
<Route
  path="/laborders/:id"
  element={
    <ProtectedRoute>
      <LayoutHybrid>
        <LabOrdersViewPage />
      </LayoutHybrid>
    </ProtectedRoute>
  }
/>
<Route
  path="/laborders/:id/edit"
  element={
    <ProtectedRoute>
      <LayoutHybrid>
        <LabOrdersEditPage />
      </LayoutHybrid>
    </ProtectedRoute>
  }
/>

{/* -----------------------------------------
  LAB RESULTS ROUTES
----------------------------------------- */}
<Route
  path="/laborders/results"
  element={
    <ProtectedRoute>
      <RBACRouteGuard requiredPath="/laborders/results">
        <LayoutHybrid>
          <LabResultsListPage />
        </LayoutHybrid>
      </RBACRouteGuard>
    </ProtectedRoute>
  }
/>
<Route
  path="/laborders/results/new"
  element={
    <ProtectedRoute>
      <LayoutHybrid>
        <LabResultCreatePage />
      </LayoutHybrid>
    </ProtectedRoute>
  }
/>
<Route
  path="/laborders/results/:id"
  element={
    <ProtectedRoute>
      <LayoutHybrid>
        <LabResultsViewPage />
      </LayoutHybrid>
    </ProtectedRoute>
  }
/>
<Route
  path="/laborders/results/:id/edit"
  element={
    <ProtectedRoute>
      <LayoutHybrid>
        <LabResultEditPage />
      </LayoutHybrid>
    </ProtectedRoute>
  }
/>

{/* -----------------------------------------
  INSURANCE & CLAIMS PROCESSING
----------------------------------------- */}
<Route
  path="/insurance"
  element={
    <ProtectedRoute>
      <LayoutHybrid>
        <InsuranceProviderListPage />
      </LayoutHybrid>
    </ProtectedRoute>
  }
/>


<Route
  path="/insurance/providers"
  element={
    <ProtectedRoute>
      <LayoutHybrid>
        <InsuranceProviderListPage />
      </LayoutHybrid>
    </ProtectedRoute>
  }
/>
<Route
  path="/insurance/providers/new"
  element={
    <ProtectedRoute>
      <LayoutHybrid>
        <InsuranceProviderCreatePage />
      </LayoutHybrid>
    </ProtectedRoute>
  }
/>
<Route
  path="/insurance/providers/:id/edit"
  element={
    <ProtectedRoute>
      <LayoutHybrid>
        <InsuranceProviderEditPage />
      </LayoutHybrid>
    </ProtectedRoute>
  }
/>


{/* -----------------------------------------
  PATIENT INSURANCE
----------------------------------------- */}
<Route
  path="/insurance/patient-insurance"
  element={
    <ProtectedRoute>
      <LayoutHybrid>
        <PatientInsuranceListPage />
      </LayoutHybrid>
    </ProtectedRoute>
  }
/>

<Route
  path="/insurance/patient-insurance/new"
  element={
    <ProtectedRoute>
      <LayoutHybrid>
        <PatientInsuranceCreatePage />
      </LayoutHybrid>
    </ProtectedRoute>
  }
/>

<Route
  path="/insurance/patient-insurance/:id"
  element={
    <ProtectedRoute>
      <LayoutHybrid>
        <PatientInsuranceViewPage />
      </LayoutHybrid>
    </ProtectedRoute>
  }
/>

<Route
  path="/insurance/patient-insurance/:id/edit"
  element={
    <ProtectedRoute>
      <LayoutHybrid>
        <PatientInsuranceEditPage />
      </LayoutHybrid>
    </ProtectedRoute>
  }
/>

<Route
  path="/insurance/claims/create"
  element={
    <ProtectedRoute>
      <LayoutHybrid>
        <InsuranceClaimCreatePage/>
    </LayoutHybrid>
   </ProtectedRoute>
  }
/>

<Route
  path="/insurance/claims/:id/edit"
  element={
    <ProtectedRoute>
    <LayoutHybrid>
        <InsuranceClaimEditPage/>
      </LayoutHybrid>
   // </ProtectedRoute>
  }
/>

<Route
  path="/insurance/claims/:id/view"
  element={
   <ProtectedRoute>
     <LayoutHybrid>
        <InsuranceClaimViewPage/>
     </LayoutHybrid>
    </ProtectedRoute>
  }
/>

<Route
  path="/insurance/claims"
  element={
   <ProtectedRoute>
     <LayoutHybrid>
        <InsuranceClaimListPage/>
   </LayoutHybrid>
    </ProtectedRoute>
  }
/>

      <Route
        path="/billing"
        element={
          <ProtectedRoute>
            <RBACRouteGuard requiredPath="/billing">
              <LayoutHybrid>
                <Billing />
              </LayoutHybrid>
            </RBACRouteGuard>
          </ProtectedRoute>
        }
      />
      <Route
        path="/billing/payments"
        element={
          <ProtectedRoute>
            <LayoutHybrid>
              <Billing />
            </LayoutHybrid>
          </ProtectedRoute>
        }
      />
      <Route
        path="/billing/claims"
        element={
          <ProtectedRoute>
            <LayoutHybrid>
              <Billing />
            </LayoutHybrid>
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin"
        element={
          <ProtectedRoute>
            <RBACRouteGuard requiredPath="/admin">
              <LayoutHybrid>
                <Admin />
              </LayoutHybrid>
            </RBACRouteGuard>
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/users"
        element={
          <ProtectedRoute>
            <RBACRouteGuard requiredPath="/admin/users">
              <LayoutHybrid>
                <UsersManager />
              </LayoutHybrid>
            </RBACRouteGuard>
          </ProtectedRoute>
        }
      />
      <Route
        path="/users/:id/view"
        element={
          <ProtectedRoute>
            <LayoutHybrid>
              <ViewUser />
            </LayoutHybrid>
          </ProtectedRoute>
        }
      />
      <Route
        path="/users/:id/edit"
        element={
          <ProtectedRoute>
            <LayoutHybrid>
              <EditUser />
            </LayoutHybrid>
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/users/assign-role/:userId"
        element={
          <ProtectedRoute>
            <RBACRouteGuard requiredPath="/admin/users">
              <LayoutHybrid>
                <AssignRoles />
              </LayoutHybrid>
            </RBACRouteGuard>
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/roles"
        element={
          <ProtectedRoute>
            <RBACRouteGuard requiredPath="/admin/roles">
              <LayoutHybrid>
                <RoleCreation />
              </LayoutHybrid>
            </RBACRouteGuard>
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/role-feature-manager"
        element={
          <ProtectedRoute>
            <RBACRouteGuard requiredPath="/admin/role-feature-manager">
              <LayoutHybrid>
                <RoleFeatureManager />
              </LayoutHybrid>
            </RBACRouteGuard>
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/register"
        element={
          <ProtectedRoute>
            <LayoutHybrid>
              <Register />
            </LayoutHybrid>
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/features"
        element={
          <ProtectedRoute>
            <RBACRouteGuard requiredPath="/admin/features">
              <LayoutHybrid>
                <FeatureManager />
              </LayoutHybrid>
            </RBACRouteGuard>
          </ProtectedRoute>
        }
      />

      
    </Routes>
  );
}
