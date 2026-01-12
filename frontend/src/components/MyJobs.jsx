import React, { useEffect, useState } from "react";
import {
  clearAllJobErrors,
  deleteJob,
  getmyJobs,
  resetJobSlice,
} from "@/store/slices/jobSlice";
import { useDispatch, useSelector } from "react-redux";
import { toast, ToastContainer } from "react-toastify";
import Spinner from "./Spinner";

// shadcn/ui components
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";

// Excel export
import { utils, writeFile } from "xlsx";

const MyJobs = () => {
  const { loading, error, myJobs, message } = useSelector((state) => state.jobs);
  const dispatch = useDispatch();

  // Search state
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearAllJobErrors());
    }
    if (message) {
      toast.success(message);
      dispatch(resetJobSlice());
    }
    dispatch(getmyJobs());
  }, [dispatch, error, message]);

  const handleDeleteJob = (id) => {
    if (window.confirm("Are you sure you want to delete this job?")) {
      dispatch(deleteJob(id));
    }
  };

  // Helper to format offers
  const renderOffers = (offers) => {
    if (!offers) return "N/A";
    const list = [];
    if (offers.accommodation) list.push("Accommodation");
    if (offers.food) list.push("Food");
    if (offers.travel) list.push("Travel");
    return list.length > 0 ? list.join(", ") : "No offers";
  };

  // Filter jobs based on search term
  const filteredJobs = myJobs?.filter((job) => {
    const searchLower = searchTerm.toLowerCase();
    return (
      job.title.toLowerCase().includes(searchLower) ||
      job.companyName.toLowerCase().includes(searchLower) ||
      (Array.isArray(job.location) &&
        job.location.some((loc) => loc.toLowerCase().includes(searchLower))) ||
      (Array.isArray(job.jobRole) &&
        job.jobRole.some((role) => role.toLowerCase().includes(searchLower)))
    );
  });

  // Export to Excel
  const handleExport = () => {
    if (!filteredJobs || filteredJobs.length === 0) {
      toast.warn("No jobs to export.");
      return;
    }

    const worksheetData = filteredJobs.map((job) => ({
      "Job Title": job.title,
      "Company": job.companyName,
      "Role": Array.isArray(job.jobRole) ? job.jobRole.join(", ") : job.jobRole || "N/A",
      "Location": Array.isArray(job.location) ? job.location.join(", ") : job.location || "N/A",
      "Job Type": job.jobType,
      "Salary": job.salary || "Not disclosed",
      "Introduction": job.introduction || "N/A",
      "Qualifications": Array.isArray(job.qualifications) ? job.qualifications.join(", ") : job.qualifications || "N/A",
      "Responsibilities": Array.isArray(job.responsibilities) ? job.responsibilities.join(", ") : job.responsibilities || "N/A",
      "Required Skills": Array.isArray(job.requiredSkill) ? job.requiredSkill.join(", ") : "N/A",
      "We Offer": renderOffers(job.offers),
      "Apply Link": job.personalWebsite?.url || "N/A",
      "Posted On": new Date(job.createdAt).toLocaleDateString("en-GB"), // dd/mm/yy
    }));

    const worksheet = utils.json_to_sheet(worksheetData);
    const workbook = utils.book_new();
    utils.book_append_sheet(workbook, worksheet, "My Jobs");

    // Export to file
    writeFile(workbook, `MyJobs_${new Date().toISOString().split("T")[0]}.xlsx`);
    toast.success("Jobs exported to Excel!");
  };

  if (loading) return <Spinner />;
  if (!myJobs || myJobs.length === 0) {
    return (
      <div className="p-6 text-center">
        <h1 className="text-xl font-semibold text-gray-600">You have not posted any job!</h1>
      </div>
    );
  }

  return (
    <>
      {/* Inline Styles to Hide Scrollbar */}
      <style jsx>{`
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>

      <div className="px-4 py-6 sm:px-6 lg:px-12 max-w-7xl mx-auto flex flex-col h-[calc(100vh-80px)]">
        {/* Header with Search & Export */}
        <Card className="mb-6 bg-gradient-to-r from-rose-100 to-sky-100 border-none shadow-md">
          <CardHeader className="space-y-4 pb-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <CardTitle className="text-2xl font-bold text-gray-800">My Job Postings</CardTitle>
                <p className="text-sm text-gray-600 mt-1">
                  Manage and view all your posted jobs.{" "}
                  <span className="font-medium">
                    ({filteredJobs?.length || 0} job{filteredJobs?.length !== 1 ? "s" : ""} shown)
                  </span>
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                {/* Search Input */}
                <div className="flex-1 min-w-48">
                  <Label htmlFor="search" className="sr-only">
                    Search Jobs
                  </Label>
                  <Input
                    id="search"
                    placeholder="Search by title, company, role..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="bg-white"
                  />
                </div>

                {/* Export Button */}
                <Button
                  onClick={handleExport}
                  variant="outline"
                  className="bg-teal-500 hover:bg-teal-600 text-white border-none"
                >
                Export to Excel
                </Button>
              </div>
            </div>
          </CardHeader>
        </Card>

        {/* Scrollable Cards Container */}
        <div className="flex-1 hide-scrollbar overflow-y-auto pr-1">
          <div className="grid gap-8 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-2">
            {filteredJobs.map((job) => (
              <Card
                key={job._id}
                className="bg-white border border-gray-200 p-6 flex flex-col h-full transition-all hover:shadow-xl"
              >
                <CardContent className="p-0 space-y-4 flex-1">
                  {/* Title & Date */}
                  <div className="flex justify-between items-start">
                    <h4 className="text-xl font-bold text-gray-800 truncate">{job.title}</h4>
                    <span
                      title={`Posted on ${new Date(job.createdAt).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}`}
                      className="text-xs font-medium text-green-600 bg-green-50 px-2 py-1 rounded-full"
                    >posted job:- 
                      {new Date(job.createdAt).toLocaleDateString("en-GB")}
                    </span>
                  </div>

                  {/* Details */}
                  <div className="space-y-2 text-sm text-gray-700">
                    <p>
                      <span className="font-semibold text-gray-900">Role:</span>{" "}
                      {Array.isArray(job.jobRole)
                        ? job.jobRole.join(", ")
                        : job.jobRole || "N/A"}
                    </p>
                    <p>
                      <span className="font-semibold text-gray-900">Company:</span>{" "}
                      {job.companyName}
                    </p>
                    <p>
                      <span className="font-semibold text-gray-900">Location:</span>{" "}
                      <span className="text-gray-600">
                        {Array.isArray(job.location)
                          ? job.location.join(", ")
                          : typeof job.location === "string"
                          ? job.location.replace(/([A-Z])/g, " $1").trim()
                          : "N/A"}
                      </span>
                    </p>
                    <p>
                      <span className="font-semibold text-gray-900">Type:</span> {job.jobType}
                    </p>
                    <p>
                      <span className="font-semibold text-gray-900">Salary:</span>{" "}
                      {job.salary || "Not disclosed"}
                    </p>
                    {job.introduction && (
                      <p>
                        <span className="font-semibold text-gray-900">Intro:</span>{" "}
                        {job.introduction}
                      </p>
                    )}
                    {job.qualifications && (
                      <p>
                        <span className="font-semibold text-gray-900">Qualifications:</span>{" "}
                        {Array.isArray(job.qualifications)
                          ? job.qualifications.join(", ")
                          : job.qualifications}
                      </p>
                    )}
                    {job.responsibilities && (
                      <p>
                        <span className="font-semibold text-gray-900">Responsibilities:</span>{" "}
                        {Array.isArray(job.responsibilities)
                          ? job.responsibilities.join(", ")
                          : job.responsibilities}
                      </p>
                    )}
                    {job.requiredSkill && Array.isArray(job.requiredSkill) && job.requiredSkill.length > 0 && (
                      <p>
                        <span className="font-semibold text-gray-900">Skills:</span>{" "}
                        {job.requiredSkill.join(", ")}
                      </p>
                    )}
                    <p>
                      <span className="font-semibold text-gray-900">We Offer:</span>{" "}
                      {renderOffers(job.offers)}
                    </p>
                    {job.personalWebsite?.url && (
                      <p>
                        <span className="font-semibold text-gray-900">Apply:</span>{" "}
                        <a
                          href={job.personalWebsite.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:underline font-medium"
                        >
                          {job.personalWebsite.title || "Visit Website"}
                        </a>
                      </p>
                    )}
                  </div>

                  {/* Delete Button */}
                  <Button
                    onClick={() => handleDeleteJob(job._id)}
                    variant="destructive"
                    className="w-full mt-4"
                  >
                    Delete Job
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>

      {/* Toast Container */}
      <ToastContainer position="top-right" autoClose={3000} theme="colored" />
    </>
  );
};

export default MyJobs;