import React from "react";
import { Link, useNavigate } from "react-router-dom";

/**
 * NotAuthorized page component
 * Displayed when users try to access routes they don't have permission for
 */
export default function NotAuthorized() {
  const navigate = useNavigate();

  return (
    <div className="container-fluid d-flex align-items-center justify-content-center min-vh-100">
      <div className="text-center">
        <div className="mb-4">
          <i className="bi bi-shield-exclamation text-warning" style={{ fontSize: "4rem" }}></i>
        </div>
        
        <h1 className="h2 mb-3">Access Denied</h1>
        
        <p className="text-muted mb-4">
          You don't have permission to access this resource.<br />
          Please contact your administrator if you believe this is an error.
        </p>
        
        <div className="d-flex gap-3 justify-content-center">
          <button 
            className="btn btn-primary"
            onClick={() => navigate(-1)}
          >
            <i className="bi bi-arrow-left me-1"></i>
            Go Back
          </button>
        </div>
        
        <div className="mt-4">
          <small className="text-muted">
            Need help? <Link to="/help" className="text-decoration-none">Contact Support</Link>
          </small>
        </div>
      </div>
    </div>
  );
}