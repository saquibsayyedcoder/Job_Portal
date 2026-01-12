// src/components/MyApplications.jsx
import React, { useEffect } from "react";
import {
  clearAllApplicationErrors,
  deleteApplication,
  fetchJobSeekerApplications,
  resetApplicationSlice,
} from "@/store/slices/applicationSlice"; // Make sure this path is correct
import { useDispatch, useSelector } from "react-redux";
// Revert to Sonner for toast notifications
import { Toaster, toast } from "@/components/ui/sonner";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/components/ui/alert";
import { Textarea } from "@/components/ui/textarea";
import { Skeleton } from "@/components/ui/skeleton"; // Keep Skeleton for loading
import Spinner from "./Spinner"; // Keep your existing Spinner

// Icons (You can use Lucide React or any icon library)
import { FileText, Calendar, Clock, MapPin, User, Mail, Phone, Map, AlertCircle, Download, Trash2, FileSearch } from 'lucide-react';

// Helper function to safely build resume URL
const getResumeURL = (resumePath) => {
  if (!resumePath) return null;

  const baseUrl = import.meta.env.VITE_API_BASE_URL?.replace(/\/+$/, "") || "";
  const cleanResumePath = resumePath.replace(/^\/+/, "");

  return `${baseUrl}/${cleanResumePath}`;
};

const MyApplications = () => {
  const { user, isAuthenticated } = useSelector((state) => state.user);
  const { loading, error, applications, message } = useSelector(
    (state) => state.applications
  );
  const dispatch = useDispatch();

  // Fetch applications when component mounts
  useEffect(() => {
    if (isAuthenticated) {
      dispatch(fetchJobSeekerApplications());
    }
  }, [dispatch, isAuthenticated]);

  // Handle success/error messages using Sonner (Reverted)
  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearAllApplicationErrors());
    }
    if (message) {
      toast.success(message);
      dispatch(resetApplicationSlice());
      dispatch(fetchJobSeekerApplications()); // Re-fetch after successful action
    }
  }, [dispatch, error, message]);

  // Delete application with Sonner confirmation (Reverted)
  const handleDeleteApplication = (id) => {
    toast.warning("Are you sure?", {
      description: "This will delete your job application permanently.",
      action: {
        label: "Delete",
        onClick: () => {
          dispatch(deleteApplication(id));
          // Success toast for deletion is now handled by the useEffect watching `message`
        },
      },
      cancel: {
        label: "Cancel",
      },
    });
  };

  // Improved empty state UI using Shadcn Alert
  if (!loading && applications && applications.length <= 0) {
    return (
      <div className="container mx-auto py-12 px-4 sm:py-16">
        <Alert className="max-w-2xl mx-auto">
          <FileSearch className="h-5 w-5" />
          <AlertTitle className="text-xl">No Applications Found</AlertTitle>
          <AlertDescription className="text-base">
            You haven't applied for any jobs yet. Start exploring opportunities to build your career!
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <>
      {/* Use Sonner Toaster */}
      <Toaster richColors />

      {loading ? (
        // Using Skeletons for a more integrated loading experience, or fallback to Spinner
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
          <div className="space-y-6">
            {/* Simulate loading cards with Skeletons */}
            {[...Array(3)].map((_, index) => (
              <Card key={index} className="overflow-hidden">
                <CardHeader className="pb-3">
                  <Skeleton className="h-6 w-3/4" />
                  <Skeleton className="h-4 w-1/2 mt-2" />
                </CardHeader>
                <CardContent className="pb-4 space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {[...Array(4)].map((_, i) => (
                      <div key={i} className="space-y-2">
                        <Skeleton className="h-3 w-1/4" />
                        <Skeleton className="h-4 w-full" />
                      </div>
                    ))}
                  </div>
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-1/3" />
                    <Skeleton className="h-20 w-full" />
                  </div>
                  <Separator />
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-1/2" />
                    <div className="flex flex-wrap gap-4">
                      <Skeleton className="h-8 w-24 rounded-full" />
                      <Skeleton className="h-8 w-24 rounded-full" />
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between bg-muted/50 py-4">
                  <Skeleton className="h-9 w-32" />
                  <Skeleton className="h-9 w-32" />
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
        // Or, simpler fallback:
        // <div className="flex justify-center items-center min-h-[400px]">
        //   <Spinner />
        // </div>
      ) : (
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
          {/* Header Section */}
          <div className="mb-6 sm:mb-8">
            <h1 className="text-2xl sm:text-3xl font-bold">My Applications</h1>
            <p className="text-muted-foreground mt-1"> {/* Shadcn class */}
              Track the status of your job applications.
            </p>
          </div>

          {/* Applications List */}
          <div className="space-y-6">
            {applications?.map((application) => {
              const resumeUrl = getResumeURL(application.resume);
              const isShortlisted = application.resumeStatus === "Shortlisted";
              const isSelected = application.finalStatus === "Selected";
              // const isRejected = application.finalStatus === "Rejected"; // Not directly used in current logic

             // Determine resume status display
let resumeStatusDisplay = "Not Reviewed";
let resumeStatusClass = "bg-gray-100 text-gray-800";

if (application.resumeStatus) {
  resumeStatusDisplay = application.resumeStatus;
  resumeStatusClass =
    application.resumeStatus === "Shortlisted"
      ? "bg-blue-100 text-blue-800"
      : "bg-yellow-100 text-yellow-800"; // e.g., 'Rejected', 'Under Review', etc.
}

// Determine final status display — only show if resume was NOT rejected
let finalStatusDisplay = null;
let finalStatusClass = "";

if (application.resumeStatus === "Rejected") {
  // Do not show final status at all if resume is rejected
  finalStatusDisplay = null;
} else {
  // Resume is not rejected — show final status or default to "Pending"
  finalStatusDisplay = application.finalStatus || "Pending";
  finalStatusClass =
    application.finalStatus === "Selected"
      ? "bg-green-100 text-green-800"
      : "bg-gray-100 text-gray-800"; // Use neutral color for "Pending" or other
}

              return (
                <Card key={application._id} className="overflow-hidden transition-shadow hover:shadow-md">
                  <CardHeader className="pb-3">
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div>
                        <CardTitle className="text-xl">
                          {application.jobInfo?.jobTitle || "Job Title Not Available"}
                        </CardTitle>
                        {/* <p className="text-sm text-muted-foreground mt-1">
                          Applied on {new Date(application.createdAt).toLocaleDateString()}
                        </p> */}
                      </div>
                      {/* Combined Status Badge - Top Right */}
                      <div className="flex flex-col items-end gap-1">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${resumeStatusClass}`}>
                          Resume: {resumeStatusDisplay}
                        </span>
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${finalStatusClass}`}>
                          Final: {finalStatusDisplay}
                        </span>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="pb-4">
                    {/* Applicant Info Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-5 text-sm">
                      <div className="flex items-start">
                        <User className="h-4 w-4 mt-0.5 mr-2 text-muted-foreground flex-shrink-0" />
                        <div>
                          <p className="font-medium text-muted-foreground">Name</p> {/* Shadcn class */}
                          <p className="text-sm">{application.jobSeekerInfo?.name || "N/A"}</p>
                        </div>
                      </div>
                      <div className="flex items-start">
                        <Mail className="h-4 w-4 mt-0.5 mr-2 text-muted-foreground flex-shrink-0" />
                        <div>
                          <p className="font-medium text-muted-foreground">Email</p>
                          <p className="text-sm">{application.jobSeekerInfo?.email || "N/A"}</p>
                        </div>
                      </div>
                      <div className="flex items-start">
                        <Phone className="h-4 w-4 mt-0.5 mr-2 text-muted-foreground flex-shrink-0" />
                        <div>
                          <p className="font-medium text-muted-foreground">Phone</p>
                          <p className="text-sm">{application.jobSeekerInfo?.phone || "N/A"}</p>
                        </div>
                      </div>
                      <div className="flex items-start">
                        <Map className="h-4 w-4 mt-0.5 mr-2 text-muted-foreground flex-shrink-0" />
                        <div>
                          <p className="font-medium text-muted-foreground">Address</p>
                          <p className="text-sm">{application.jobSeekerInfo?.address || "N/A"}</p>
                        </div>
                      </div>
                    </div>

                    <Separator className="my-4" />

                    {/* Cover Letter */}
                    <div className="mb-5">
                      <h3 className="text-sm font-medium mb-2 flex items-center">
                        <FileText className="h-4 w-4 mr-2" />
                        Cover Letter
                      </h3>
                      <Textarea
                        value={application.jobSeekerInfo?.coverLetter || "No cover letter provided."}
                        readOnly
                        className="min-h-[100px] text-sm resize-none"
                      />
                    </div>

                    {/* Interview Details Section (Conditional) */}
                    {(isShortlisted || isSelected) && application.interviewDate && (
                      <>
                        <Separator className="my-4" />
                        <div className="mb-5 p-4 bg-muted rounded-lg"> {/* Shadcn classes */}
                          <h3 className="text-sm font-medium mb-3 flex items-center">
                            <Calendar className="h-4 w-4 mr-2" />
                            Interview Details
                          </h3>
                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-sm">
                            <div className="flex items-start">
                              <Calendar className="h-4 w-4 mt-0.5 mr-2 text-muted-foreground flex-shrink-0" />
                              <div>
                                <p className="font-medium text-muted-foreground">Date</p>
                                <p>{new Date(application.interviewDate).toLocaleDateString()}</p>
                              </div>
                            </div>
                            <div className="flex items-start">
                              <Clock className="h-4 w-4 mt-0.5 mr-2 text-muted-foreground flex-shrink-0" />
                              <div>
                                <p className="font-medium text-muted-foreground">Time</p>
                                <p>{application.interviewTime || "TBD"}</p>
                              </div>
                            </div>
                            <div className="flex items-start">
                              <MapPin className="h-4 w-4 mt-0.5 mr-2 text-muted-foreground flex-shrink-0" />
                              <div>
                                <p className="font-medium text-muted-foreground">Location</p>
                                <p>{application.interviewLocation || "TBD"}</p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </>
                    )}

                    {/* Status Section - Dedicated Area for Clarity (Improved) */}
                    <div className="mb-5 p-4 bg-gray-50 rounded-lg border border-gray-200"> {/* Reverted to Tailwind for consistency if Shadcn bg-muted isn't working as expected */}
                      <h3 className="font-medium text-gray-800 mb-2">Application Status</h3>
                      <div className="flex flex-wrap items-center gap-4 text-sm">
                        <div>
                          <p className="font-medium text-gray-700">Resume Status</p>
                          <p className={`font-semibold ${application.resumeStatus === "Shortlisted" ? "text-blue-600" : application.resumeStatus ? "text-yellow-600" : "text-gray-500"}`}>
                            {resumeStatusDisplay}
                          </p>
                        </div>
                        <div>
                          <p className="font-medium text-gray-700">Final Status</p>
                          <p className={`font-semibold ${application.finalStatus === "Selected" ? "text-green-600" : application.finalStatus === "Rejected" ? "text-red-600" : "text-gray-500"}`}>
                            {finalStatusDisplay}
                          </p>
                        </div>
                      </div>
                    </div>

                  </CardContent>
                  <CardFooter className="flex flex-col sm:flex-row justify-between sm:items-center gap-3 bg-muted/50 py-4"> {/* Shadcn classes */}
                    <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
                      {/* View Resume Button */}
                      {resumeUrl ? (
                        <Button variant="outline" size="sm" asChild>
                          <a
                            href={resumeUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center"
                          >
                            <Download className="h-4 w-4 mr-2" />
                            View Resume
                          </a>
                        </Button>
                      ) : (
                        <Button variant="outline" size="sm" disabled className="flex items-center">
                          <AlertCircle className="h-4 w-4 mr-2" />
                          No Resume
                        </Button>
                      )}
                    </div>

                    {/* Delete Application Button */}
                    <Button
                      variant="destructive" 
                      size="sm"
                      onClick={() => handleDeleteApplication(application._id)}
                      className="w-full sm:w-auto flex items-center"
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Delete
                    </Button>
                  </CardFooter>
                </Card>
              );
            })}
          </div>
        </div>
      )}
    </>
  );
};

export default MyApplications;