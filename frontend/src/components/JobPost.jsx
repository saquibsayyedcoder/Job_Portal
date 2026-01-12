import React, { useEffect, useState } from "react";
import {
  clearAllJobErrors,
  postJob,
  resetJobSlice,
} from "@/store/slices/jobSlice";
import { useDispatch, useSelector } from "react-redux";
import { toast, ToastContainer } from "react-toastify";

// Import from your formOptions.js
import {
  locationOptions,
  educationOptions,
  skillOptions,
} from "@/Constants/FormOptions";

const JobPost = () => {
  const [title, setTitle] = useState("");
  const [jobType, setJobType] = useState("");
  const [location, setLocation] = useState([]);
  const [companyName, setCompanyName] = useState("");
  const [introduction, setIntroduction] = useState("");
  const [responsibilities, setResponsibilities] = useState("");
  const [qualifications, setQualifications] = useState([]);
  const [requiredSkill, setRequiredSkill] = useState([]);
  const [customSkill, setCustomSkill] = useState(""); // For user-typed skill
  const [jobRole, setJobRole] = useState([]); // Array for multiple roles
  const [customJobRole, setCustomJobRole] = useState(""); // ✅ Fixed: was missing!
  const [salary, setSalary] = useState("");
  const [hiringMultipleCandidates, setHiringMultipleCandidates] =
    useState("No");
  const [personalWebsiteTitle, setPersonalWebsiteTitle] = useState("");
  const [personalWebsiteUrl, setPersonalWebsiteUrl] = useState("");
  const [accommodation, setAccommodation] = useState(false);
  const [food, setFood] = useState(false);
  const [travel, setTravel] = useState(false);

  // Dropdown states
  const [isLocationOpen, setIsLocationOpen] = useState(false);
  const [isQualificationsOpen, setIsQualificationsOpen] = useState(false);
  const [isSkillsOpen, setIsSkillsOpen] = useState(false);
  const [isJobRoleOpen, setIsJobRoleOpen] = useState(false);

  const { loading, error, message } = useSelector((state) => state.jobs);
  const dispatch = useDispatch();

  // Job roles (can be moved to formOptions.js later)
  const jobArray = [
    "Project Director",
    "Project Manager",
    "Deputy Project Manager",
    "Project Control Manager",
    "Planning Supervisor",
    "Planning Engineers",
    "Schedulers",
    "Cost Control Engineer",
    "Risk Manager",
    "Contract Administrator",
    "Interface Manager",
    "Document Controller",
    "Civil Engineer",
    "Structural Engineer",
    "Geotechnical Engineer",
    "Draftsman",
    "Mechanical Engineer (Static & Rotating)",
    "HVAC Engineer",
    "Equipment Engineer",
    "Stress Analyst",
    "Piping Engineer",
    "Layout Engineer",
    "Piping Material Engineer",
    "3D Modeler/Draftsman",
    "Electrical Engineer",
    "Power Systems Engineer",
    "Lighting & Earthing Designer",
    "Instrumentation Engineer",
    "Control Systems Engineer (DCS/PLC)",
    "Analyzer Engineer",
    "Process Engineer",
    "Simulation Specialist",
    "HAZOP/Process Safety Engineer",
    "MEP Engineer",
    "Lead Discipline Engineers",
    "Design Coordinator",
    "Interface Engineer",
    "Procurement Manager",
    "Procurement Engineer",
    "Buyer",
    "Expeditor",
    "Logistics Coordinator",
    "Material Controller",
    "Vendor Coordinator",
    "Construction Manager",
    "General Superintendent",
    "Site Engineers (Civil, Mechanical, Electrical, I&C)",
    "MEP Supervisor",
    "MEP Foreman",
    "Construction Supervisors/Foremen",
    "Surveyor",
    "Site Admin/Timekeeper",
    "Skilled Labor (Welders, Fitters, etc.)",
    "QA/QC Manager",
    "Discipline Supervisors & Inspectors",
    "NDT Technician",
    "Calibration Engineer",
    "Procurement QA/QC Engineer",
    "HSE Manager",
    "Safety Officer",
    "Safety Supervisor",
    "Environmental Engineer",
    "Industrial Hygienist",
    "Commissioning Manager",
    "Commissioning Engineers",
    "Pre-Commissioning Technicians",
    "DCS/PLC Engineers",
    "Punch List Coordinator",
    "System Completion Coordinator",
    "Secretary / Administrative Assistant",
    "Male Nurse",
    "Resident Doctor",
    "Driver",
    "Crane Operator",
    "Heavy Equipment Operator",
    "Forklift Operator",
    "Manlift Operator",
    "Utility Worker / General Labor",
    "Camp Boss / Camp Administrator",
    "Janitor",
    "Cook / Catering Staff",
    "Security Guard",
    "Frontend Developer",
    "Backend Developer",
    "Full Stack Developer",
    "Data Scientist",
    "UX/UI Designer",
    "Product Manager",
    "Mobile App Developer",
    "DevOps Engineer",
    "Cloud Engineer",
    "Machine Learning Engineer",
    "AI Research Scientist",
    "Cybersecurity Specialist",
    "Network Engineer",
    "Systems Administrator",
    "Software Engineer",
    "Web Developer",
    "Game Developer",
    "Blockchain Developer",
    "Quality Assurance Engineer",
    "Technical Support Engineer",
    "Cloud Architect",
    "Data Engineer",
    "Software Architect",
    "Business Intelligence Analyst",
    "Digital Marketing Specialist",
    "SEO Specialist",
    "IT Consultant",
    "Technical Project Manager",
    "Database Administrator",
    "Salesforce Developer",
    "JavaScript Developer",
    "Ruby on Rails Developer",
    "PHP Developer",
    "C# Developer",
    "Python Developer",
  ];

  // Handle checkbox change for locations
  const handleLocationChange = (city) => {
    setLocation((prev) =>
      prev.includes(city) ? prev.filter((c) => c !== city) : [...prev, city]
    );
  };

  // Handle checkbox change for qualifications
  const handleQualificationChange = (qual) => {
    setQualifications((prev) =>
      prev.includes(qual) ? prev.filter((q) => q !== qual) : [...prev, qual]
    );
  };

  // Handle checkbox change for skills
  const handleSkillChange = (skill) => {
    setRequiredSkill((prev) =>
      prev.includes(skill) ? prev.filter((s) => s !== skill) : [...prev, skill]
    );
  };

  // Add custom skill
  const handleAddCustomSkill = () => {
    const trimmed = customSkill.trim();
    if (!trimmed) {
      toast.warning("Please enter a skill.");
      return;
    }
    if (requiredSkill.includes(trimmed)) {
      toast.info("This skill is already added.");
      return;
    }
    setRequiredSkill((prev) => [...prev, trimmed]);
    setCustomSkill("");
    toast.success("Skill added!");
  };

  // Remove a skill
  const handleRemoveSkill = (skillToRemove) => {
    setRequiredSkill((prev) => prev.filter((s) => s !== skillToRemove));
  };

  // Handle checkbox change for job roles
  const handleJobRoleChange = (role) => {
    setJobRole((prev) =>
      prev.includes(role) ? prev.filter((r) => r !== role) : [...prev, role]
    );
  };

  // Add custom job role
  const handleAddCustomJobRole = () => {
    const trimmed = customJobRole.trim();
    if (!trimmed) {
      toast.warning("Please enter a job role.");
      return;
    }
    if (jobRole.includes(trimmed)) {
      toast.info("This role is already added.");
      return;
    }
    setJobRole((prev) => [...prev, trimmed]);
    setCustomJobRole("");
    toast.success("Job role added!");
  };

  // Remove a job role
  const handleRemoveJobRole = (roleToRemove) => {
    setJobRole((prev) => prev.filter((r) => r !== roleToRemove));
  };

  const handlePostJob = (e) => {
    e.preventDefault();

    // Validation
    if (!title) return toast.error("Job title is required.");
    if (!jobType) return toast.error("Job type is required.");
    if (location.length === 0)
      return toast.error("Please select at least one location.");
    if (!companyName) return toast.error("Company name is required.");
    if (!introduction) return toast.error("Introduction is required.");
    if (!responsibilities) return toast.error("Responsibilities are required.");
    if (qualifications.length === 0)
      return toast.error("Please select at least one qualification.");
    if (requiredSkill.length === 0)
      return toast.error("Please add at least one required skill.");
    if (jobRole.length === 0)
      return toast.error("Please select at least one job role."); // ✅ Fixed: was `!jobRole`

    const formData = new FormData();
    formData.append("title", title);
    formData.append("jobType", jobType);
    formData.append("companyName", companyName);
    formData.append("introduction", introduction);
    formData.append("responsibilities", responsibilities);
    formData.append("salary", salary);
    formData.append("hiringMultipleCandidates", hiringMultipleCandidates);

    if (personalWebsiteTitle)
      formData.append("personalWebsiteTitle", personalWebsiteTitle);
    if (personalWebsiteUrl)
      formData.append("personalWebsiteUrl", personalWebsiteUrl);

    // Append offers
    formData.append("accommodation", accommodation);
    formData.append("food", food);
    formData.append("travel", travel);

    // Append arrays (each item separately)
    location.forEach((loc) => formData.append("location", loc));
    qualifications.forEach((qual) => formData.append("qualifications", qual));
    requiredSkill.forEach((skill) => formData.append("requiredSkill", skill));
    jobRole.forEach((role) => formData.append("jobRole", role)); // ✅ Correct

    dispatch(postJob(formData));
  };

  useEffect(() => {
    if (!loading && error) {
      toast.error(error);
      dispatch(clearAllJobErrors());
    }
    if (!loading && message) {
      toast.success(message);
      const timeout = setTimeout(() => {
        dispatch(resetJobSlice());
        // Reset form
        setTitle("");
        setJobType("");
        setLocation([]);
        setCompanyName("");
        setIntroduction("");
        setResponsibilities("");
        setQualifications([]);
        setRequiredSkill([]);
        setCustomSkill("");
        setJobRole([]);
        setCustomJobRole("");
        setSalary("");
        setHiringMultipleCandidates("No");
        setPersonalWebsiteTitle("");
        setPersonalWebsiteUrl("");
        setAccommodation(false);
        setFood(false);
        setTravel(false);
        setIsLocationOpen(false);
        setIsQualificationsOpen(false);
        setIsSkillsOpen(false);
        setIsJobRoleOpen(false);
      }, 1000);
      return () => clearTimeout(timeout);
    }
  }, [dispatch, error, message, loading]);

  return (
    <>
      <div className="max-w-4xl mx-auto p-6 shadow-md rounded-lg bg-white">
        <h3 className="text-2xl font-semibold mb-6">Post a New Job</h3>
        <form onSubmit={handlePostJob}>
          {/* Title */}
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">
              Job Title *
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => {
                const value = e.target.value;
                if (/^[A-Za-z\s\-']*$/.test(value)) {
                  setTitle(value);
                } else {
                  toast.warning(
                    "Numbers and special characters are not allowed in job title.",
                    {
                      autoClose: 2000,
                    }
                  );
                }
              }}
              placeholder="e.g. Full Stack Developer"
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
            {!title && (
              <p className="text-red-500 text-sm mt-1">
                Job title is required.
              </p>
            )}
          </div>

          {/* Job Type */}
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">Job Type *</label>
            <select
              value={jobType}
              onChange={(e) => setJobType(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg"
              required
            >
              <option value="">Select Job Type</option>
              <option value="Full-time">Full-time</option>
              <option value="Part-time">Part-time</option>
            </select>
          </div>

          {/* Location (Multi-select Dropdown) */}
          <div className="mb-4 relative">
            <label className="block text-sm font-medium mb-2">
              Location (City) *
            </label>
            <div>
              <div
                onClick={() => setIsLocationOpen(!isLocationOpen)}
                className="p-3 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 flex justify-between items-center"
              >
                {location.length > 0
                  ? `${location.length} selected`
                  : "Select locations..."}
                <span className="text-gray-500">▼</span>
              </div>
              {isLocationOpen && (
                <div className="absolute z-10 mt-1 w-full border border-gray-300 rounded-lg bg-white shadow-lg max-h-48 overflow-y-auto">
                  {locationOptions.map((city) => (
                    <div
                      key={city}
                      className="flex items-center p-2 hover:bg-gray-100"
                    >
                      <input
                        type="checkbox"
                        id={`city-${city}`}
                        checked={location.includes(city)}
                        onChange={() => handleLocationChange(city)}
                        className="w-4 h-4 mr-2 accent-blue-600"
                      />
                      <label htmlFor={`city-${city}`} className="text-sm">
                        {city}
                      </label>
                    </div>
                  ))}
                </div>
              )}
            </div>
            {location.length === 0 && (
              <p className="text-red-500 text-sm mt-1">
                At least one location is required.
              </p>
            )}
          </div>

          {/* Company Name */}
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">
              Company Name *
            </label>
            <input
              type="text"
              value={companyName}
              onChange={(e) => {
                const value = e.target.value;
                if (/^[A-Za-z\s\-.'&]*$/.test(value)) {
                  setCompanyName(value);
                }
              }}
              placeholder="e.g. Tech Innovators LLC"
              className="w-full p-3 border border-gray-300 rounded-lg"
              required
            />
            {!companyName && (
              <p className="text-red-500 text-sm mt-1">
                Company name is required.
              </p>
            )}
          </div>

          {/* Introduction */}
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">
              Company/Job Introduction *
            </label>
            <textarea
              value={introduction}
              onChange={(e) => setIntroduction(e.target.value)}
              placeholder="Brief introduction about the company or job..."
              rows={5}
              className="w-full p-3 border border-gray-300 rounded-lg"
              required
            />
          </div>

          {/* Responsibilities */}
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">
              Job Responsibilities *
            </label>
            <textarea
              value={responsibilities}
              onChange={(e) => setResponsibilities(e.target.value)}
              placeholder="List key responsibilities..."
              rows={5}
              className="w-full p-3 border border-gray-300 rounded-lg"
              required
            />
          </div>

          {/* Qualifications (Dropdown with Checkboxes) */}
          <div className="mb-4 relative">
            <label className="block text-sm font-medium mb-2">
              Education & Qualifications *
            </label>
            <div>
              <div
                onClick={() => setIsQualificationsOpen(!isQualificationsOpen)}
                className="p-3 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 flex justify-between items-center"
              >
                {qualifications.length > 0
                  ? `${qualifications.length} selected`
                  : "Select qualifications..."}
                <span className="text-gray-500">▼</span>
              </div>
              {isQualificationsOpen && (
                <div className="absolute z-10 mt-1 w-full border border-gray-300 rounded-lg bg-white shadow-lg max-h-48 overflow-y-auto">
                  {educationOptions.map((qual) => (
                    <div
                      key={qual}
                      className="flex items-center p-2 hover:bg-gray-100"
                    >
                      <input
                        type="checkbox"
                        id={`qual-${qual}`}
                        checked={qualifications.includes(qual)}
                        onChange={() => handleQualificationChange(qual)}
                        className="w-4 h-4 mr-2 accent-blue-600"
                      />
                      <label htmlFor={`qual-${qual}`} className="text-sm">
                        {qual}
                      </label>
                    </div>
                  ))}
                </div>
              )}
            </div>
            {qualifications.length === 0 && (
              <p className="text-red-500 text-sm mt-1">
                At least one qualification is required.
              </p>
            )}
          </div>

          {/* Required Skills (With Custom Input) */}
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">
              Required Skills *
            </label>

            {/* Selected Skills Tags */}
            <div className="flex flex-wrap gap-2 mb-2">
              {requiredSkill.map((skill) => (
                <span
                  key={skill}
                  className="inline-flex items-center px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                >
                  {skill}
                  <button
                    type="button"
                    onClick={() => handleRemoveSkill(skill)}
                    className="ml-2 text-red-500 hover:text-red-700"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>

            {/* Dropdown for predefined skills */}
            <div className="relative mb-2">
              <div
                onClick={() => setIsSkillsOpen(!isSkillsOpen)}
                className="p-3 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 text-gray-500 text-sm"
              >
                Select from common skills
              </div>
              {isSkillsOpen && (
                <div className="absolute z-10 mt-1 w-full border border-gray-300 rounded-lg bg-white shadow-lg max-h-48 overflow-y-auto">
                  {skillOptions.map((skill) => (
                    <div
                      key={skill}
                      className="flex items-center p-2 hover:bg-gray-100"
                    >
                      <input
                        type="checkbox"
                        id={`skill-${skill}`}
                        checked={requiredSkill.includes(skill)}
                        onChange={() => handleSkillChange(skill)}
                        className="w-4 h-4 mr-2 accent-blue-600"
                      />
                      <label htmlFor={`skill-${skill}`} className="text-sm">
                        {skill}
                      </label>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Custom Skill Input */}
            <div className="flex gap-2">
              <input
                type="text"
                value={customSkill}
                onChange={(e) => setCustomSkill(e.target.value)}
                placeholder="Add a custom skill..."
                className="flex-1 p-3 border border-gray-300 rounded-lg text-sm"
                onKeyPress={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    handleAddCustomSkill();
                  }
                }}
              />
              <button
                type="button"
                onClick={handleAddCustomSkill}
                className="px-4 py-3 bg-green-600 text-white rounded-lg text-sm hover:bg-green-700"
              >
                Add
              </button>
            </div>
            {requiredSkill.length === 0 && (
              <p className="text-red-500 text-sm mt-1">
                At least one skill is required.
              </p>
            )}
          </div>

          {/* Job Role (Multi-select with Custom Input) */}
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">
              Job Role(s) *
            </label>

            {/* Selected Job Roles Tags */}
            <div className="flex flex-wrap gap-2 mb-2">
              {jobRole.map((role) => (
                <span
                  key={role}
                  className="inline-flex items-center px-3 py-1 bg-gray-200 text-gray-800 rounded-full text-sm"
                >
                  {role}
                  <button
                    type="button"
                    onClick={() => handleRemoveJobRole(role)}
                    className="ml-2 text-red-500 hover:text-red-700"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>

            {/* Predefined Roles Dropdown */}
            <div className="relative mb-2">
              <div
                onClick={() => setIsJobRoleOpen(!isJobRoleOpen)}
                className="p-3 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 text-gray-500 text-sm"
              >
                Select common roles
              </div>
              {isJobRoleOpen && (
                <div className="absolute z-10 mt-1 w-full border border-gray-300 rounded-lg bg-white shadow-lg max-h-48 overflow-y-auto">
                  {jobArray.map((role) => (
                    <div
                      key={role}
                      className="flex items-center p-2 hover:bg-gray-100"
                    >
                      <input
                        type="checkbox"
                        id={`role-${role}`}
                        checked={jobRole.includes(role)}
                        onChange={() => handleJobRoleChange(role)}
                        className="w-4 h-4 mr-2 accent-blue-600"
                      />
                      <label htmlFor={`role-${role}`} className="text-sm">
                        {role}
                      </label>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Custom Job Role Input */}
            <div className="flex gap-2">
              <input
                type="text"
                value={customJobRole}
                onChange={(e) => setCustomJobRole(e.target.value)}
                placeholder="Add custom role (e.g. GitHub Developer)"
                className="flex-1 p-3 border border-gray-300 rounded-lg text-sm"
                onKeyPress={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    handleAddCustomJobRole();
                  }
                }}
              />
              <button
                type="button"
                onClick={handleAddCustomJobRole}
                className="px-4 py-3 bg-green-600 text-white rounded-lg text-sm hover:bg-green-700"
              >
                Add
              </button>
            </div>
            {jobRole.length === 0 && (
              <p className="text-red-500 text-sm mt-1">
                At least one job role is required.
              </p>
            )}
          </div>

          {/* Salary */}
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">
              Salary (Optional)
            </label>
            <input
              type="text"
              value={salary}
              onChange={(e) => setSalary(e.target.value)}
              placeholder="e.g. 80,000 - 120,000 AED/year"
              className="w-full p-3 border border-gray-300 rounded-lg"
            />
          </div>

          {/* Hiring Multiple Candidates */}
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">
              Hiring Multiple Candidates?
            </label>
            <select
              value={hiringMultipleCandidates}
              onChange={(e) => setHiringMultipleCandidates(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg"
            >
              <option value="No">No</option>
              <option value="Yes">Yes</option>
            </select>
          </div>

          {/* What We Offer */}
          <div className="mb-6 p-4 border border-gray-200 rounded-lg bg-gray-50">
            <h4 className="font-medium text-gray-800 mb-3">What We Offer</h4>
            <div className="space-y-4">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="accommodation"
                  checked={accommodation}
                  onChange={(e) => setAccommodation(e.target.checked)}
                  className="w-4 h-4 mr-2 accent-blue-600"
                />
                <label htmlFor="accommodation" className="text-sm">
                  Accommodation
                </label>
              </div>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="food"
                  checked={food}
                  onChange={(e) => setFood(e.target.checked)}
                  className="w-4 h-4 mr-2 accent-blue-600"
                />
                <label htmlFor="food" className="text-sm">
                  Food
                </label>
              </div>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="travel"
                  checked={travel}
                  onChange={(e) => setTravel(e.target.checked)}
                  className="w-4 h-4 mr-2 accent-blue-600"
                />
                <label htmlFor="travel" className="text-sm">
                  Travel
                </label>
              </div>
            </div>
          </div>

          {/* Personal Website */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div>
              <label className="block text-sm font-medium mb-2">
                Website Title (Optional)
              </label>
              <input
                type="text"
                value={personalWebsiteTitle}
                onChange={(e) => setPersonalWebsiteTitle(e.target.value)}
                placeholder="e.g. Apply Here"
                className="w-full p-3 border border-gray-300 rounded-lg"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">
                Website URL (Optional)
              </label>
              <input
                type="url"
                value={personalWebsiteUrl}
                onChange={(e) => setPersonalWebsiteUrl(e.target.value)}
                placeholder="https://apply.example.com"
                className="w-full p-3 border border-gray-300 rounded-lg"
              />
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full p-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 disabled:opacity-60 disabled:cursor-not-allowed transition"
            disabled={loading}
          >
            {loading ? "Posting Job..." : "Post Job"}
          </button>
        </form>
        <ToastContainer position="top-right" autoClose={3000} theme="colored" />
      </div>
    </>
  );
};

export default JobPost;
