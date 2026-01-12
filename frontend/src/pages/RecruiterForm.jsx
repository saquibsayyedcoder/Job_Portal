// src/components/RecruiterForm.jsx
import React from "react";
import {
  CompanyLocationArray,
  CompanyTypeArray,
} from "@/Constants/FormOptions"; // Adjust path if needed

const RecruiterForm = ({
  // Props for all Recruiter related state and setters
  companyName, setCompanyName,
  companyLocation, setCompanyLocation,
  companyType, setCompanyType,
}) => {
  return (
    <>
      {/* --- Recruiter Specific Fields Start --- */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
        <div>
          <label className="text-sm ">Company Specialization</label>
          <select
            value={companyType}
            onChange={(e) => setCompanyType(e.target.value)}
            className="w-full p-3 bg-transparent  border border-gray-300 rounded"
          >
            <option value="">Select</option>
            {CompanyTypeArray.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="text-sm">Company Name</label>
          <input
            type="text"
            value={companyName}
            onChange={(e) => setCompanyName(e.target.value)}
            className="w-full p-3 bg-transparent border border-gray-300 rounded"
          />
        </div>
        <div>
          <label className="text-sm">Company Location</label>
          <select
            value={companyLocation}
            onChange={(e) => setCompanyLocation(e.target.value)}
            className="w-full p-3 bg-transparent text-black border border-gray-300 rounded"
          >
            <option value="">Select</option>
            {CompanyLocationArray.map((city) => (
              <option key={city} value={city}>
                {city}
              </option>
            ))}
          </select>
        </div>
      </div>
      {/* --- Recruiter Specific Fields End --- */}
    </>
  );
};

export default RecruiterForm;