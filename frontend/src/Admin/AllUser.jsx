// AllUser.jsx
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import JobSeekerList from "./JobSeekerList";
import EmployerList from "./EmployerList";
import { fetchAllUsers } from "@/store/slices/adminSlice";
import { toast } from "react-toastify";
import * as XLSX from 'xlsx';
import { Button } from "@/components/ui/button";

const AllUser = () => {
  const dispatch = useDispatch();
  const { jobSeekers, recruiter, loading, error } = useSelector((state) => state.admin);
  const [view, setView] = useState("jobSeekers");

  useEffect(() => {
    dispatch(fetchAllUsers());
  }, [dispatch]);

  useEffect(() => {
    if (error) {
      toast.error(error);
    }
  }, [error]);

  // Helper: Format date
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    try {
      const date = new Date(dateString);
      return `${date.getDate().toString().padStart(2, '0')}-${(date.getMonth() + 1)
        .toString()
        .padStart(2, '0')}-${date.getFullYear().toString().slice(-2)}`;
    } catch {
      return "N/A";
    }
  };

  // Prepare Job Seeker Data for Export
  const prepareJobSeekerData = () => {
    return (jobSeekers || []).map(user => ({
      "Name": user.name || "N/A",
      "Email": user.email || "N/A",
      "Phone": user.phone || user.personalInfo?.phone || "N/A",
      "Education": user.educationQualification || "N/A",
      "Role Seeking": user.roleSeeking || "N/A",
      "Total Experience (Yrs)": user.totalExperience || "N/A",
      "Current Location": user.address || "N/A",
      "Location Preference": user.locationPreference || "N/A",
      "Nationality": user.nationality || "N/A",
      "DOB": formatDate(user.dob),
      "Gender": user.gender || user.personalInfo?.gender || "N/A",
      "Marital Status": user.maritialStatus || "N/A",
      "Certification": user.approvalCertification || "N/A",
      "Account Created At": formatDate(user.createdAt),
    }));
  };

  // Prepare Recruiter (Employer) Data for Export
  const prepareRecruiterData = () => {
    return (recruiter || []).map(user => ({
      "Name": user.name || "N/A",
      "Email": user.email || "N/A",
      "Phone": user.phone || user.personalInfo?.phone || "N/A",
      "Company Name": user.companyDetails?.name || "N/A",
      "Company Specialization": user.companyDetails?.type || "N/A",
      "Company Location": user.companyDetails?.location || "N/A",
      "Account Created At": formatDate(user.createdAt),
    }));
  };

  const handleExport = () => {
    if (loading) {
      toast.info("Please wait for data to load.");
      return;
    }

    try {
      if (view === "jobSeekers") {
        if (!jobSeekers?.length) {
          toast.info("No job seekers to export.");
          return;
        }
        const data = prepareJobSeekerData();
        const worksheet = XLSX.utils.json_to_sheet(data);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Job Seekers");
        XLSX.writeFile(workbook, "JobSeekers_Full_Details.xlsx");
      } else if (view === "recruiter") {
        if (!recruiter?.length) {
          toast.info("No recruiters to export.");
          return;
        }
        const data = prepareRecruiterData();
        const worksheet = XLSX.utils.json_to_sheet(data);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Recruiters");
        XLSX.writeFile(workbook, "Recruiters_Full_Details.xlsx");
      } else {
        // Export All Users
        const jobSeekerData = prepareJobSeekerData();
        const recruiterData = prepareRecruiterData();
        const allData = [
          ...jobSeekerData.map(d => ({ ...d, "User Type": "Job Seeker" })),
          ...recruiterData.map(d => ({ ...d, "User Type": "Recruiter" }))
        ];
        const worksheet = XLSX.utils.json_to_sheet(allData);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "All Users");
        XLSX.writeFile(workbook, "All_Users_Full_Details.xlsx");
      }
      toast.success("Exported successfully!");
    } catch (err) {
      console.error("Export failed:", err);
      toast.error("Failed to export data. Please try again.");
    }
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-md">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold text-gray-800">Manage Users</h2>
        <Button
          onClick={handleExport}
          disabled={loading}
          className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition flex items-center gap-2"
        >
          {loading ? "Loading..." : "📥 Export to Excel"}
        </Button>
      </div>

      <div className="flex space-x-4 mb-6">
        <Button
          onClick={() => setView("jobSeekers")}
          className={`px-4 py-2 rounded-lg transition ${
            view === "jobSeekers"
              ? "bg-blue-600 text-white"
              : "bg-gray-200 text-gray-800"
          }`}
        >
          Job Seekers
        </Button>
        <Button
          onClick={() => setView("recruiter")}
          className={`px-4 py-2 rounded-lg transition ${
            view === "recruiter"
              ? "bg-blue-600 text-white"
              : "bg-gray-200 text-gray-800"
          }`}
        >
          Recruiter (HR)
        </Button>
      </div>

      {loading ? (
        <p className="text-center text-lg text-gray-600">Loading user data...</p>
      ) : (
        <>
          {view === "jobSeekers" && <JobSeekerList jobSeekers={jobSeekers} />}
          {view === "recruiter" && <EmployerList recruiter={recruiter} />}
        </>
      )}
    </div>
  );
};

export default AllUser;