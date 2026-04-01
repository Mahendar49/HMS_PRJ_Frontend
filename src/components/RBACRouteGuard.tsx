import React, { useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useMenuItems, useMenuLoading, useMenuError } from '../state/menuStore';

interface RBACRouteGuardProps {
  children: React.ReactNode;
  requiredPath?: string;
}

export default function RBACRouteGuard({ children, requiredPath }: RBACRouteGuardProps) {
  const location = useLocation();
  const rbacMenuItems = useMenuItems();
  const isLoading = useMenuLoading();
  const menuError = useMenuError();
  const [loadingTimeout, setLoadingTimeout] = useState(false);
  
  // Determine which path to check - use provided path or current location
  const pathToCheck = requiredPath || location.pathname;
  
  // Check if RBAC is enabled
  const rbacEnabled = import.meta.env.VITE_ENABLE_RBAC !== 'false';
  
  // Set a timeout for loading state to prevent infinite loading
  useEffect(() => {
    if (isLoading) {
      const timer = setTimeout(() => {
        console.warn("⚠️ RBAC loading timeout - proceeding with fallback permissions");
        setLoadingTimeout(true);
      }, 5000); // 5 second timeout
      
      return () => clearTimeout(timer);
    } else {
      setLoadingTimeout(false);
    }
  }, [isLoading]);
  
  // If RBAC is disabled, allow access
  if (!rbacEnabled) {
    return <>{children}</>;
  }
  
  // If loading has timed out or there's a service error, be permissive
  if (loadingTimeout || (menuError && menuError.includes("service unavailable"))) {
    console.warn("⚠️ RBAC issues detected, allowing access:", pathToCheck);
    return <>{children}</>;
  }
  
  // Only show loading for a short period, then be permissive
  if (isLoading && rbacMenuItems === null && !loadingTimeout) {
    return (
      <div className="container mt-5">
        <div className="row justify-content-center">
          <div className="col-md-6 text-center">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading permissions...</span>
            </div>
            <p className="mt-3 text-muted">Verifying permissions...</p>
          </div>
        </div>
      </div>
    );
  }
  
  // Function to check if user has access to a specific path
  const hasAccessToPath = (path: string): boolean => {
    // If menu is empty or null due to errors, be permissive for non-admin routes
    if (!rbacMenuItems || rbacMenuItems.length === 0) {
      // For admin paths, check if there's an explicit permission error
      if (path.startsWith('/admin/')) {
        // If there's a specific permission error (not a service error), deny access
        if (menuError && menuError.includes("Access denied")) {
          return false;
        }
        // Otherwise be permissive (service might be down)
        return true;
      }
      // For basic paths, always allow access
      return true;
    }
    
    // Create reverse mapping from routes to RBAC codes
    const routeToCodeMap: Record<string, string[]> = {
      '/admin': ['ADM', 'adm', 'admin'],
      '/admin/users': ['USR', 'usr', 'users'],
      '/admin/roles': ['RL', 'rl', 'roles'],
      '/admin/features': ['FTR', 'ftr', 'features'],
      '/admin/role-feature-manager': ['RFM', 'rfm', 'role-feature-manager'],
      '/dashboard': ['DASH', 'dash', 'dashboard'],
      '/patients': ['PAT', 'pat', 'patients'],
      '/providers': ['PROV', 'prov', 'providers'],
      '/appointments': ['APT', 'apt', 'appointments'],
      '/billing': ['BILL', 'bill', 'billing'],
      '/clinicalrecords':['CLNR','clnr','clnr'],
      
      '/laborders': ['LO', 'lo', 'laborders'],
      '/laborders/results': ['LR', 'lr', 'labresults'],
      "/insurance":['IP','ip','insurance'],
      "/insurance/providers":["IPP",'IPP',"insurnaceproviders"],

    };

    // Get possible codes for this path
    const possibleCodes = routeToCodeMap[path] || [];
    
    // Check if any of the RBAC menu items match
    const hasDirectAccess = rbacMenuItems.some(item => 
      possibleCodes.includes(item.code)
    );
    
    // Check if any child items match
    const hasChildAccess = rbacMenuItems.some(item => 
      item.children?.some(child => possibleCodes.includes(child.code))
    );
    
    return hasDirectAccess || hasChildAccess;
  };

  // Check if user has access
  if (!hasAccessToPath(pathToCheck)) {
    return (
      <div className="container mt-5">
        <div className="row justify-content-center">
          <div className="col-md-6">
            <div className="alert alert-danger text-center">
              <h4 className="alert-heading">🚫 Access Denied</h4>
              <p>You don't have permission to access this page.</p>
              <hr />
              <p className="mb-0">
                <strong>Path:</strong> {pathToCheck}<br />
                <small className="text-muted">
                  Contact your administrator if you believe this is an error.
                </small>
              </p>
              <div className="mt-3">
                <button 
                  className="btn btn-primary"
                  onClick={() => window.history.back()}
                >
                  Go Back
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // User has access, render the children
  return <>{children}</>;
}
