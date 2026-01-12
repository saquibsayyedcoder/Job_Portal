import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchAllJobs } from "../store/slices/adminSlice";

const AllJobs = () => {
  const dispatch = useDispatch();
  const { jobs, loading, error } = useSelector((state) => state.admin);

  useEffect(() => {
    dispatch(fetchAllJobs());
  }, [dispatch]);

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-6 max-w-7xl mx-auto">
      <h2 className="text-3xl font-bold text-gray-800 mb-6">All Jobs</h2>

      {loading && <p className="text-blue-600 text-sm">Loading jobs...</p>}
      {error && <p className="text-red-600 text-sm">Error: {error}</p>}

      {!loading && jobs.length === 0 && (
        <p className="text-gray-500 text-sm">No jobs found.</p>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
        {jobs.map((job) => (
          <div
            key={job._id}
            className="bg-white border border-gray-200 rounded-2xl shadow-sm p-5 transition hover:shadow-md"
          >
            <h3 className="text-xl font-semibold text-gray-800 mb-3">
              {job.title}
            </h3>

            <div className="space-y-1 text-sm text-gray-600">
              <p>
                <span className="font-medium text-gray-700">Company:</span>{" "}
                {job.companyName || "Unknown"}
              </p>
              <p>
                <span className="font-medium text-gray-700">Posted By:</span>{" "}
                {job.postedBy?.name || "N/A"}
              </p>
              <p>
                <span className="font-medium text-gray-700">Email:</span>{" "}
                {job.postedBy?.email || "N/A"}
              </p>
              <p>
                <span className="font-medium text-gray-700">Role:</span>{" "}
                {job.postedBy?.role || "N/A"}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AllJobs;
