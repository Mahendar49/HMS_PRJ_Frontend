import React from "react";
import { Link } from "react-router-dom";
import { FaHospitalAlt } from "react-icons/fa";

const PageNotFound: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gray-50 p-6">
      <div className="bg-white shadow-lg rounded-2xl p-10 max-w-lg w-full text-center border border-gray-200">
        
        <div className="flex justify-center mb-6">
          <FaHospitalAlt className="text-blue-600" size={60} />
        </div>

        <h1 className="text-5xl font-bold text-blue-700 mb-3">404</h1>
        <h2 className="text-2xl font-semibold text-gray-700 mb-4">
          Page Not Found
        </h2>

        <p className="text-gray-500 text-lg mb-8">
          The page you are looking for might be removed,  
          had its name changed, or is temporarily unavailable.
        </p>

        <Link to="/">
          <button className="bg-blue-600 text-white rounded-xl px-6 py-2 text-lg shadow-md hover:bg-blue-700 transition">
            Go Back to Dashboard
          </button>
        </Link>
      </div>
    </div>
  );
};

export default PageNotFound;
