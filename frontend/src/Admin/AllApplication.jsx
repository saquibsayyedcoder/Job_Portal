// AllApplications.jsx
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchAllApplications } from "@/store/slices/adminSlice";

const AllApplications = () => {
  const dispatch = useDispatch();
  const { applications, loading, error } = useSelector((state) => state.admin);

  // Count stats - ✅ Use root-level fields
  const totalApplications = applications?.length || 0;

  const shortlistedCount = applications?.filter(
    (app) => app.resumeStatus === "Shortlisted"
  ).length || 0;

  const selectedCount = applications?.filter(
    (app) => app.finalStatus === "Selected"
  ).length || 0;

  const rejectedCount = applications?.filter(
    (app) => app.finalStatus === "Rejected"
  ).length || 0;

  useEffect(() => {
    dispatch(fetchAllApplications());
  }, [dispatch]);

  return (
    <div className="p-4 md:p-6 max-w-7xl mx-auto">
      <h2 className="text-2xl md:text-3xl font-bold mb-6 text-gray-800">
        All Applications
      </h2>

      {/* Stats Summary */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-blue-50 p-4 rounded-lg shadow border border-blue-200">
          <h3 className="text-sm text-blue-600 font-semibold">Total Applications</h3>
          <p className="text-2xl font-bold text-blue-800">{totalApplications}</p>
        </div>
        <div className="bg-green-50 p-4 rounded-lg shadow border border-green-200">
          <h3 className="text-sm text-green-600 font-semibold">Shortlisted</h3>
          <p className="text-2xl font-bold text-green-800">{shortlistedCount}</p>
        </div>
        <div className="bg-indigo-50 p-4 rounded-lg shadow border border-indigo-200">
          <h3 className="text-sm text-indigo-600 font-semibold">Selected</h3>
          <p className="text-2xl font-bold text-indigo-800">{selectedCount}</p>
        </div>
        <div className="bg-red-50 p-4 rounded-lg shadow border border-red-200">
          <h3 className="text-sm text-red-600 font-semibold">Rejected</h3>
          <p className="text-2xl font-bold text-red-800">{rejectedCount}</p>
        </div>
      </div>

      {/* Loading / Error States */}
      {loading && <p className="text-blue-500">Loading applications...</p>}
      {error && <p className="text-red-500">Error: {error}</p>}
      {!loading && (!applications || applications.length === 0) && (
        <p className="text-gray-600">No applications found.</p>
      )}

      {/* Application List */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {applications?.map((app) => (
          <div
            key={app._id}
            className="bg-white p-5 rounded-xl shadow hover:shadow-lg transition-all border border-gray-200"
          >
            <h3 className="text-lg font-semibold mb-2 text-gray-900">
              {app.jobInfo?.jobTitle || "Job Title Unknown"}
            </h3>

            <div className="space-y-1 text-sm text-gray-700">
              <p>
                <strong>Company:</strong>{" "}
                {app.jobInfo?.jobId?.companyName || "Unknown"}
              </p>
              <p>
                <strong>Recruiter:</strong>{" "}
                {app.recruiterInfo?.id?.name || "N/A"}{" "}
                ({app.recruiterInfo?.id?.email || "N/A"})
              </p>
              <p>
                <strong>Job Seeker:</strong>{" "}
                {app.jobSeekerInfo?.name || "N/A"}{" "}
                ({app.jobSeekerInfo?.email || "N/A"})
              </p>
              <p>
                <strong>Phone:</strong> {app.jobSeekerInfo?.phone || "N/A"}
              </p>
              <p>
                <strong>Location:</strong> {app.jobSeekerInfo?.address || "N/A"}
              </p>

              {/* ✅ Resume Status Badge - Use root-level field */}
              <div className="mt-2">
                <span
                  className={`inline-block px-2 py-1 text-xs font-medium rounded-full ${
                    app.resumeStatus === "Shortlisted"
                      ? "bg-green-100 text-green-800"
                      : app.resumeStatus === "Rejected"
                      ? "bg-red-100 text-red-800"
                      : "bg-yellow-100 text-yellow-800"
                  }`}
                >
                  Resume: {app.resumeStatus || "Pending"}
                </span>
              </div>

              {/* ✅ Final Status Badge */}
              {app.finalStatus && (
                <div className="mt-1">
                  <span
                    className={`inline-block px-2 py-1 text-xs font-medium rounded-full ${
                      app.finalStatus === "Selected"
                        ? "bg-blue-100 text-blue-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    Final: {app.finalStatus}
                  </span>
                </div>
              )}

              {/* Interview Details */}
              {app.resumeStatus === "Shortlisted" && app.interviewDate && (
                <div className="mt-2 text-xs text-gray-600">
                  <p><strong>Interview:</strong> {app.interviewDate} at {app.interviewTime}</p>
                  <p>{app.interviewLocation}</p>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AllApplications;