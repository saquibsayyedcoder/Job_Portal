import React, { useEffect, useState } from "react";
import {
  clearAllApplicationErrors,
  deleteApplication,
  fetchRecruiterApplications,
  rejectResume,
  resetApplicationSlice,
  shortlistResume,
  updateFinalStatus,
  rescheduleInterview,
} from "@/store/slices/applicationSlice";
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

// Utility function to build resume URL
const getResumeURL = (resumePath) => {
  if (!resumePath) return null;
  const baseUrl = import.meta.env.VITE_API_BASE_URL.replace(/\/+$/, "").replace(/^\/+/, "");
  const cleanResumePath = resumePath.replace(/^\/+/, "");
  return `${baseUrl}/${cleanResumePath}`;
};

// Modal for setting/rescheduling interviews
const InterviewModal = ({ isOpen, onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    interviewDate: "",
    interviewTime: "",
    interviewLocation: "",
  });

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = () => {
    const { interviewDate, interviewTime, interviewLocation } = formData;
    if (!interviewDate || !interviewTime || !interviewLocation) {
      toast.error("Please fill all fields.");
      return;
    }
    onSubmit(formData);
    setFormData({ interviewDate: "", interviewTime: "", interviewLocation: "" });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
      <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-lg">
        <h3 className="mb-4 text-xl font-semibold">Set Interview Details</h3>
        <div className="space-y-3">
          <input
            name="interviewDate"
            type="date"
            onChange={handleChange}
            value={formData.interviewDate}
            className="w-full rounded border px-3 py-2"
          />
          <input
            name="interviewTime"
            type="time"
            onChange={handleChange}
            value={formData.interviewTime}
            className="w-full rounded border px-3 py-2"
          />
          <input
            name="interviewLocation"
            placeholder="Location"
            onChange={handleChange}
            value={formData.interviewLocation}
            className="w-full rounded border px-3 py-2"
          />
        </div>
        <div className="mt-5 flex justify-end gap-3">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} className="bg-green-600 hover:bg-green-700">
            Submit
          </Button>
        </div>
      </div>
    </div>
  );
};

// Feedback Modal for Final Status
const FeedbackModal = ({ isOpen, onClose, onSubmit, status }) => {
  const [feedback, setFeedback] = useState("");

  const handleSubmit = () => {
    onSubmit(status, feedback);
    setFeedback("");
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
      <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-lg">
        <h3 className="mb-4 text-xl font-semibold">
          {status === "Selected" ? "Candidate Selected" : "Candidate Rejected"}
        </h3>
        <textarea
          value={feedback}
          onChange={(e) => setFeedback(e.target.value)}
          placeholder="Add optional feedback..."
          rows={4}
          className="mb-4 w-full rounded border px-3 py-2"
        ></textarea>
        <div className="flex justify-end gap-3">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            className={status === "Selected" ? "bg-blue-600 hover:bg-blue-700" : "bg-red-600 hover:bg-red-700"}
          >
            Confirm {status}
          </Button>
        </div>
      </div>
    </div>
  );
};

// Main Applications Component
const Applications = () => {
  const dispatch = useDispatch();
  const { applications, loading, error, message } = useSelector((state) => state.applications);
  const [isInterviewModalOpen, setIsInterviewModalOpen] = useState(false);
  const [selectedAppId, setSelectedAppId] = useState(null);
  const [isFeedbackModalOpen, setIsFeedbackModalOpen] = useState(false);
  const [finalStatusType, setFinalStatusType] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    dispatch(fetchRecruiterApplications());
  }, [dispatch]);

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearAllApplicationErrors());
    }
    if (message) {
      toast.success(message);
      dispatch(resetApplicationSlice());
    }
  }, [error, message, dispatch]);

  const handleShortlistClick = (id) => {
    setSelectedAppId(id);
    setIsInterviewModalOpen(true);
  };

  const handleInterviewSubmit = (details) => {
    const app = applications.find((a) => a._id === selectedAppId);
    if (app?.resumeStatus === "Shortlisted") {
      dispatch(rescheduleInterview({ id: selectedAppId, interviewDetails: details }))
        .then(() => dispatch(fetchRecruiterApplications()))
        .finally(() => setIsInterviewModalOpen(false));
    } else {
      dispatch(shortlistResume({ id: selectedAppId, interviewDetails: details }))
        .then(() => dispatch(fetchRecruiterApplications()))
        .finally(() => setIsInterviewModalOpen(false));
    }
  };

  const handleFinalStatusClick = (id, status) => {
    setSelectedAppId(id);
    setFinalStatusType(status);
    setIsFeedbackModalOpen(true);
  };

  const handleUpdateFinalStatusWithFeedback = (id, status, feedback) => {
    dispatch(updateFinalStatus({ id, status, feedback }))
      .then(() => dispatch(fetchRecruiterApplications()))
      .finally(() => {
        setIsFeedbackModalOpen(false);
        setFinalStatusType("");
        setSelectedAppId(null);
      });
  };

  const handleRejectResume = (id) =>
    dispatch(rejectResume({ id })).then(() => dispatch(fetchRecruiterApplications()));

  const handleDeleteApplication = (id) => {
    if (window.confirm("Are you sure you want to delete this application?")) {
      dispatch(deleteApplication(id)).then(() => dispatch(fetchRecruiterApplications()));
    }
  };

  // Filter applications
  const filteredApplications = applications?.filter((app) => {
    const searchLower = searchTerm.toLowerCase();
    return (
      app.jobSeekerInfo.name.toLowerCase().includes(searchLower) ||
      app.jobSeekerInfo.email.toLowerCase().includes(searchLower) ||
      app.jobInfo.jobTitle.toLowerCase().includes(searchLower)
    );
  });

  // Export to Excel
  const handleExport = () => {
    if (!filteredApplications || filteredApplications.length === 0) {
      toast.warn("No applications to export.");
      return;
    }

    const worksheetData = filteredApplications.map((app) => ({
      "Job Title": app.jobInfo.jobTitle,
      "Candidate Name": app.jobSeekerInfo.name,
      "Email": app.jobSeekerInfo.email,
      "Phone": app.jobSeekerInfo.phone,
      "Address": app.jobSeekerInfo.address,
      "Cover Letter": app.jobSeekerInfo.coverLetter,
      "Resume URL": getResumeURL(app.resume) || "N/A",
      "Resume Status": app.resumeStatus || "Pending",
      "Interview Date": app.interviewDate || "N/A",
      "Interview Time": app.interviewTime || "N/A",
      "Interview Location": app.interviewLocation || "N/A",
      "Final Status": app.finalStatus || "N/A",
      "Applied On": new Date(app.createdAt).toLocaleDateString("en-GB"),
    }));

    const worksheet = utils.json_to_sheet(worksheetData);
    const workbook = utils.book_new();
    utils.book_append_sheet(workbook, worksheet, "Applications");

    writeFile(workbook, `Applications_${new Date().toISOString().split("T")[0]}.xlsx`);
    toast.success("Applications exported to Excel!");
  };

  if (loading) return <Spinner />;
  if (!applications || applications.length === 0) {
    return (
      <div className="p-6 text-center">
        <h1 className="text-xl font-semibold text-gray-600">No applications received yet.</h1>
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
                <CardTitle className="text-2xl font-bold text-gray-800">Job Applications</CardTitle>
                <p className="text-sm text-gray-600 mt-1">
                  Manage all candidate applications.{" "}
                  <span className="font-medium">
                    ({filteredApplications?.length || 0} application{filteredApplications?.length !== 1 ? "s" : ""} shown)
                  </span>
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                <div className="flex-1 min-w-48">
                  <Label htmlFor="search" className="sr-only">
                    Search Applications
                  </Label>
                  <Input
                    id="search"
                    placeholder="Search by name, email, job..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="bg-white"
                  />
                </div>

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
            {filteredApplications.map((app) => {
              const resumeUrl = getResumeURL(app.resume);
              return (
                <Card
                  key={app._id}
                  className="bg-white border border-gray-200 p-6 flex flex-col h-full transition-all hover:shadow-xl"
                >
                  <CardContent className="p-0 space-y-4 flex-1">
                    {/* Candidate & Job Info */}
                    <div>
                      <p className="text-xl font-bold text-gray-600">{app.jobInfo.jobTitle}</p>
                       <p className="text-sm text-gray-800 truncate">Candidate Name:- {app.jobSeekerInfo.name}</p>
                    </div>

                    {/* Contact Info */}
                    <div className="space-y-2 text-sm text-gray-700">
                      <p>
                        <span className="font-semibold text-gray-900">Email:</span> {app.jobSeekerInfo.email}
                      </p>
                      <p>
                        <span className="font-semibold text-gray-900">Phone:</span> {app.jobSeekerInfo.phone}
                      </p>
                      <p>
                        <span className="font-semibold text-gray-900">Address:</span> {app.jobSeekerInfo.address}
                      </p>
                    </div>

                    {/* Cover Letter */}
                    <div>
                      <p className="font-semibold text-gray-900 text-sm">Cover Letter:</p>
                      <p className="text-xs text-gray-600 line-clamp-3">{app.jobSeekerInfo.coverLetter}</p>
                    </div>

                    {/* Interview Info */}
                    {app.resumeStatus === "Shortlisted" && app.interviewDate && (
                      <div className="mt-3 rounded-md border border-blue-200 bg-blue-50 p-3">
                        <p className="font-semibold text-blue-800 text-sm">Interview:</p>
                        <ul className="text-xs text-blue-700 list-disc pl-5 mt-1">
                          <li>Date: {app.interviewDate}</li>
                          <li>Time: {app.interviewTime}</li>
                          <li>Location: {app.interviewLocation}</li>
                        </ul>
                      </div>
                    )}

                    {/* Status Tags */}
                   <div className="mt-3 flex flex-wrap gap-2">
  {/* Resume Status Badge */}
  <span
    className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
      app.resumeStatus === "Shortlisted"
        ? "bg-green-100 text-green-800"
        : app.resumeStatus === "Rejected"
        ? "bg-red-100 text-red-800"
        : "bg-yellow-100 text-yellow-800"
    }`}
  >
    {app.resumeStatus || "Pending"}
  </span>

  {/* ✅ Only show Final Status if it's "Selected" or "Rejected" (not "Pending") */}
  {app.finalStatus && app.finalStatus !== "Pending" && (
    <span
      className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
        app.finalStatus === "Selected"
          ? "bg-blue-100 text-blue-800"
          : "bg-red-100 text-red-800"
      }`}
    >
      {app.finalStatus}
    </span>
  )}
</div>

                    {/* Action Buttons */}
                    <div className="mt-4 flex flex-wrap gap-2">
                      {!app.resumeStatus || app.resumeStatus === "Pending" ? (
                        <>
                          <Button
                            size="sm"
                            onClick={() => handleShortlistClick(app._id)}
                            className="bg-green-600 hover:bg-green-700"
                          >
                            Shortlist
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => handleRejectResume(app._id)}
                          >
                            Reject
                          </Button>
                        </>
                      ) : app.resumeStatus === "Shortlisted" ? (
                        <>
                          <Button
                            size="sm"
                            variant="secondary"
                            onClick={() => handleShortlistClick(app._id)}
                          >
                            {app.interviewDate ? "Reschedule" : "Set Interview"}
                          </Button>
                          <Button
                            size="sm"
                            onClick={() => handleFinalStatusClick(app._id, "Selected")}
                            className="bg-blue-600 hover:bg-blue-700"
                          >
                            Mark Selected
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => handleFinalStatusClick(app._id, "Rejected")}
                          >
                            Mark Rejected
                          </Button>
                        </>
                      ) : null}

                      <Button
                        size="sm"
                        asChild
                        variant="outline"
                        className="text-indigo-600 border-indigo-600 hover:bg-indigo-50"
                      >
                        <a href={resumeUrl} target="_blank" rel="noopener noreferrer">
                          View Resume
                        </a>
                      </Button>

                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleDeleteApplication(app._id)}
                        className="text-red-600 border-red-600 hover:bg-red-50"
                      >
                        Delete
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </div>

      {/* Modals */}
      <InterviewModal
        isOpen={isInterviewModalOpen}
        onClose={() => setIsInterviewModalOpen(false)}
        onSubmit={handleInterviewSubmit}
      />
      <FeedbackModal
        isOpen={isFeedbackModalOpen}
        onClose={() => setIsFeedbackModalOpen(false)}
        onSubmit={(status, feedback) =>
          handleUpdateFinalStatusWithFeedback(selectedAppId, status, feedback)
        }
        status={finalStatusType}
      />

      {/* Toast Container */}
      <ToastContainer position="top-right" autoClose={3000} theme="colored" />
    </>
  );
};

export default Applications;