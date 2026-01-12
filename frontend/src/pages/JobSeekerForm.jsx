// src/components/JobSeekerForm.jsx
import React, { useState } from "react";
import { CERTIFICATION_CATEGORIES } from "@/Constants/Certifications"; // Adjust path if needed
import {
  locationOptions,
  roleOptions,
  educationOptions,
  nationalityOptions,
  maritalStatusOptions,
  CountryOptions,
  CityOptions,
  genderOptions,
  totalExperienceOptions,
  CountryCodes,
  COUNTRY_CITY_MAP,
} from "@/Constants/FormOptions"; // Adjust path if needed
import { Label } from "@/components/ui/label"; // Adjust path if needed
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select"; // Adjust path if needed

const JobSeekerForm = ({
  // Props for all Job Seeker related state and setters
  name, setName,
  nationality, setNationality,
  maritialStatus, setMaritialStatus,
  dob, setDob,
  gender, setGender,
  roleSeeking, setRoleSeeking,
  locationPreference, setLocationPreference,
  approvalCertification, setApprovalCertification, // This is the array state
  educationQualification, setEducationQualification,
  city, setCity,
  country, setCountry,
  totalExperience, setTotalExperience,
  coverLetter, setCoverLetter,
  resume, setResume, // This is the file object
  countryCode, setCountryCode,
  resumeHandler, // Function to handle resume file selection
}) => {
  const [showCertDropdown, setShowCertDropdown] = useState(false);
const [error, setError] = useState('');
const handleDobChange = (e) => {
  const selectedDate = e.target.value;
  setDob(selectedDate);

  const today = new Date();
  const birthDate = new Date(selectedDate);
  const age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  const dayDiff = today.getDate() - birthDate.getDate();

  if (birthDate > today) {
    setError('Date of birth cannot be in the future.');
  } else if (age < 18 || (age === 18 && (monthDiff < 0 || (monthDiff === 0 && dayDiff < 0)))) {
    setError('You must be at least 18 years old.');
  } else {
    setError('');
  }
};
  return (
    <>
      {/* --- Job Seeker Specific Fields Start --- */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
        <div>
          <label className="text-sm "> Nationality</label>
          <select
            value={nationality}
            onChange={(e) => setNationality(e.target.value)}
            className="w-full p-3 bg-transparent text-black border border-gray-300 rounded"
          >
            <option className="text-black" value="">
              Select nationality
            </option>
            {nationalityOptions.map((nationality) => (
              <option key={nationality} value={nationality}>
                {nationality}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="text-sm ">Maritial Status</label>
          <select
            value={maritialStatus}
            onChange={(e) => setMaritialStatus(e.target.value)}
            className="w-full p-3 bg-transparent text-black border border-gray-300 rounded"
          >
            <option className="text-black" value="">
              Select Maritial Status
            </option>
            {maritalStatusOptions.map((maritialStatus) => (
              <option key={maritialStatus} value={maritialStatus}>
                {maritialStatus}
              </option>
            ))}
          </select>
        </div>
     <div>
  <label className="text-sm">Date Of Birth</label>
  <input
    type="date"
    required
    value={dob}
    onChange={(e) => setDob(e.target.value)}
    className={`w-full p-3 bg-transparent border rounded ${
      dob && new Date(dob) > new Date() ? 'border-red-500' : 'border-gray-300'
    }`}
    max={new Date().toISOString().split('T')[0]}
  />
  {dob && new Date(dob) > new Date() && (
    <p className="text-red-500 text-xs mt-1">Date of birth cannot be in the future.</p>
  )}
  {dob && (() => {
    const today = new Date();
    const birthDate = new Date(dob);
    const age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    const dayDiff = today.getDate() - birthDate.getDate();
    const isUnderage = age < 18 || (age === 18 && (monthDiff < 0 || (monthDiff === 0 && dayDiff < 0)));
    return isUnderage ? (
      <p className="text-red-500 text-xs mt-1">You must be at least 18 years old.</p>
    ) : null;
  })()}
</div>
        <div>
          <label className="text-sm ">Gender</label>
          <select
            value={gender}
            onChange={(e) => setGender(e.target.value)}
            className="w-full p-3 bg-transparent text-black border border-gray-300 rounded"
          >
            <option className="text-black" value="">
              Select Gender
            </option>
            {genderOptions.map((gender) => (
              <option key={gender} value={gender}>
                {gender}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="text-sm font-medium">Role Seeking</label>
          <select
            value={roleSeeking}
            onChange={(e) => setRoleSeeking(e.target.value)}
            className="w-full p-3 bg-white text-black border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Select</option>
            {roleOptions.map((group) => (
              <optgroup key={group.category} label={group.category}>
                {group.positions.map((position) => (
                  <option key={position} value={position}>
                    {position}
                  </option>
                ))}
              </optgroup>
            ))}
          </select>
        </div>
        <div>
          <label className="text-sm ">Location Preference</label>
          <select
            value={locationPreference}
            onChange={(e) => setLocationPreference(e.target.value)}
            className="w-full p-3 bg-transparent text-black border border-gray-300 rounded"
          >
            <option value="">Select</option>
            {locationOptions.map((loc) => (
              <option key={loc} value={loc}>
                {loc}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
        {/* Approval/Certification Dropdown */}
        <div className="relative">
          <label className="text-sm block text-black mb-1">
            Approval/Certification
          </label>
          <div
            className="w-full p-3 bg-white border border-gray-300 rounded text-black cursor-pointer"
            onClick={() => setShowCertDropdown(!showCertDropdown)}
          >
            {/* Safe display: check if it's an array before joining */}
            {Array.isArray(approvalCertification) && approvalCertification.length > 0
              ? approvalCertification.join(", ")
              : "Select"}
          </div>

          {showCertDropdown && (
            <div className="absolute z-50 mt-1 w-full bg-white border border-gray-300 rounded shadow-lg p-4 max-h-96 overflow-y-auto">
              {CERTIFICATION_CATEGORIES.map((categoryData, categoryIndex) => (
                <div key={categoryIndex} className="mb-4">
                  <div className="font-semibold text-gray-700 mb-2">
                    {categoryData.category}
                  </div>
                  {categoryData.items.map((item) => (
                    // FIX: Use a unique key combining categoryIndex and item
                    <label key={`${categoryIndex}-${item}`} className="flex items-center text-sm mb-1 ml-2">
                      <input
                        type="checkbox"
                        value={item}
                        checked={Array.isArray(approvalCertification) && approvalCertification.includes(item)}
                        onChange={() => {
                          setApprovalCertification((prev) => {
                            // Ensure prev is always an array
                            const currentArray = Array.isArray(prev) ? prev : [];
                            if (currentArray.includes(item)) {
                              return currentArray.filter((v) => v !== item);
                            } else {
                              return [...currentArray, item];
                            }
                          });
                        }}
                        className="mr-2"
                      />
                      {item}
                    </label>
                  ))}
                </div>
              ))}
            </div>
          )}
        </div>
        {/* End Approval/Certification Dropdown */}

        <div>
          <label className="text-sm ">Education/Qualification</label>
          <select
            value={educationQualification}
            onChange={(e) =>
              setEducationQualification(e.target.value)
            }
            className="w-full p-3 bg-transparent text-black border border-gray-300 rounded"
          >
            <option value="">Select</option>
            {educationOptions.map((edu) => (
              <option key={edu} value={edu}>
                {edu}
              </option>
            ))}
          </select>
        </div>
       <div>
  <label className="text-sm">Country</label>
  <select
    value={country}
    onChange={(e) => {
      const selectedCountry = e.target.value;
      setCountry(selectedCountry);
      setCity(""); // Reset city when country changes
    }}
    className="w-full p-3 bg-transparent text-black border border-gray-300 rounded"
  >
    <option value="">Select</option>
    {CountryOptions.map((countryOption) => (
      <option key={countryOption} value={countryOption}>
        {countryOption}
      </option>
    ))}
  </select>
</div>

<div>
  <label className="text-sm">Cities</label>
  <select
    value={city}
    onChange={(e) => setCity(e.target.value)}
    className="w-full p-3 bg-transparent text-black border border-gray-300 rounded"
    disabled={!country} // Disable if no country selected
  >
    <option value="">Select</option>
    {country && COUNTRY_CITY_MAP[country] ? (
      COUNTRY_CITY_MAP[country].map((cityName) => (
        <option key={cityName} value={cityName}>
          {cityName}
        </option>
      ))
    ) : (
      <option disabled>No cities available</option>
    )}
  </select>
</div>
        <div>
          <label
            htmlFor="totalExperience"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Total Experience
          </label>
          <select
            id="totalExperience"
            value={totalExperience}
            onChange={(e) => setTotalExperience(e.target.value)}
            className="w-full p-3 bg-white text-black border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="">Select</option>
            {totalExperienceOptions.map((te) => (
              <option key={te} value={te}>
                {te}
              </option>
            ))}
          </select>
        </div>
      </div>
      <div className="mb-6">
        <label className="text-sm ">Carrier Snap Shot (Cover Letter)</label>
        <textarea
          value={coverLetter}
          onChange={(e) => setCoverLetter(e.target.value)}
          className="w-full p-3 bg-transparent  border border-gray-300 rounded"
          rows={4}
        />
      </div>
      <div className="mb-6">
        <label className="text-sm">Upload Resume</label>
        <input
          type="file"
          accept=".pdf,.doc,.docx"
          onChange={resumeHandler}
          className="w-full p-3 bg-transparent border border-gray-300 rounded"
        />
        {/* Optionally display selected file name */}
        {resume && <p className="mt-1 text-sm text-gray-500">Selected: {resume.name}</p>}
      </div>
      {/* --- Job Seeker Specific Fields End --- */}
    </>
  );
};

export default JobSeekerForm;