import { User } from "../models/userSchema.js";
import { Job } from "../models/jobSchema.js";
import { Application } from "../models/applicationSchema.js";

export const getAllUsers = async (req, res) => {
  try {
    const jobSeekers = await User.find({ role: "Job Seeker" }).select("-password");
    const recruiter = await User.find({ role: "Recruiter" }).select("-password");

    res.status(200).json({
      success: true,
      jobSeekers,
      recruiter,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch users",
      error: error.message,
    });
  }
};


export const getAllJobs = async (req, res) => {
  const jobs = await Job.find().populate("postedBy", "name email role");
  res.json(jobs);
};

export const getAllApplications = async (req, res) => {
  const applications = await Application.find()
    .populate("jobInfo.jobId", "title companyName")
    .populate("recruiterInfo.id", "name email")
    .populate("jobSeekerInfo.id", "name email");
  res.json(applications);
};
 