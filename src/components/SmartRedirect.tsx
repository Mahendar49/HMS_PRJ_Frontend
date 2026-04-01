import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { getFirstAccessibleRoute } from '../utils/routeUtils';

/**
 * Smart redirect component that redirects authenticated users to their first accessible route
 * instead of always redirecting to dashboard
 */
export default function SmartRedirect() {
  const [redirectPath, setRedirectPath] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const findRedirectPath = async () => {
      try {
        console.log('🔍 SmartRedirect: Finding redirect path...');
        const token = localStorage.getItem("authToken");
        if (!token) {
          console.log('❌ SmartRedirect: No token found, redirecting to login');
          setRedirectPath("/login");
          setLoading(false);
          return;
        }

        console.log('🎯 SmartRedirect: Getting first accessible route...');
        const path = await getFirstAccessibleRoute(token);
        console.log('✅ SmartRedirect: Redirect path determined:', path);
        setRedirectPath(path);
      } catch (error) {
        console.error('❌ SmartRedirect Error:', error);
        // Fallback to dashboard for any errors
        console.log('🔄 SmartRedirect: Using dashboard fallback');
        setRedirectPath("/dashboard");
      } finally {
        setLoading(false);
      }
    };

    findRedirectPath();
  }, []);

  // Show loading while determining redirect path
  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: '100vh' }}>
        <div className="spinner-border" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  // Redirect to the determined path
  return redirectPath ? <Navigate to={redirectPath} replace /> : null;
}