// RBAC Permission Handler
// Handles cases where user doesn't have RBAC admin permissions
import React from 'react';

export interface RBACPermissionState {
  hasPermission: boolean;
  message: string;
  canRetry: boolean;
}

// Check if user has RBAC permissions by testing an endpoint
export const checkRBACPermissions = async (): Promise<RBACPermissionState> => {
  const token = localStorage.getItem("authToken");
  
  if (!token) {
    return {
      hasPermission: false,
      message: "Please login to access RBAC features",
      canRetry: true
    };
  }

  try {
    // Test the simplest RBAC endpoint
    const response = await fetch("http://localhost:8082/api/v1/rbac/roles", {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    if (response.ok) {
      return {
        hasPermission: true,
        message: "RBAC access granted",
        canRetry: false
      };
    } else if (response.status === 403) {
      return {
        hasPermission: false,
        message: "Your account doesn't have RBAC admin permissions. Contact your administrator to grant RBAC access.",
        canRetry: false
      };
    } else if (response.status === 401) {
      return {
        hasPermission: false,
        message: "Authentication expired. Please login again.",
        canRetry: true
      };
    } else {
      return {
        hasPermission: false,
        message: `RBAC service error: ${response.status} ${response.statusText}`,
        canRetry: true
      };
    }
  } catch (error) {
    return {
      hasPermission: false,
      message: `Connection error: ${error instanceof Error ? error.message : 'Unknown error'}`,
      canRetry: true
    };
  }
};

// Component to show RBAC permission status
export const RBACPermissionGuard: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [permissionState, setPermissionState] = React.useState<RBACPermissionState | null>(null);
  const [isChecking, setIsChecking] = React.useState(true);

  React.useEffect(() => {
    checkRBACPermissions().then(state => {
      setPermissionState(state);
      setIsChecking(false);
    });
  }, []);

  const retryCheck = async () => {
    setIsChecking(true);
    const state = await checkRBACPermissions();
    setPermissionState(state);
    setIsChecking(false);
  };

  if (isChecking) {
    return (
      <div className="alert alert-info">
        <div className="d-flex align-items-center">
          <div className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></div>
          Checking RBAC permissions...
        </div>
      </div>
    );
  }

  if (!permissionState?.hasPermission) {
    return (
      <div className="alert alert-warning">
        <h5>🔐 RBAC Access Required</h5>
        <p>{permissionState?.message}</p>
        {permissionState?.canRetry && (
          <button className="btn btn-outline-primary btn-sm" onClick={retryCheck}>
            Retry Check
          </button>
        )}
        <hr />
        <small className="text-muted">
          RBAC (Role-Based Access Control) features require special admin permissions.
          If you should have access, contact your system administrator.
        </small>
      </div>
    );
  }

  return <>{children}</>;
};

// Hook to check RBAC permissions
export const useRBACPermissions = () => {
  const [permissionState, setPermissionState] = React.useState<RBACPermissionState | null>(null);
  
  React.useEffect(() => {
    checkRBACPermissions().then(setPermissionState);
  }, []);

  const recheckPermissions = () => {
    checkRBACPermissions().then(setPermissionState);
  };

  return {
    hasPermission: permissionState?.hasPermission || false,
    message: permissionState?.message || "Checking permissions...",
    canRetry: permissionState?.canRetry || false,
    recheck: recheckPermissions
  };
};