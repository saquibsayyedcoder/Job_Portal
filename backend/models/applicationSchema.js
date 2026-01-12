// models/applicationModel.js

import mongoose from "mongoose";
import validator from "validator";

const applicationSchema = new mongoose.Schema({
  jobSeekerInfo: {
    id: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      validate: [validator.isEmail, "Please provide a valid email"],
    },
    phone: {
      type: Number,
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
    coverLetter: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ["Job Seeker"],
      required: true,
    },
  },

  recruiterInfo: {
    id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    role: {
      type: String,
      enum: ["Recruiter"],
      required: true,
    },
  },

  jobInfo: {
    jobId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Job",
      required: true,
    },
    jobTitle: {
      type: String,
      required: true,
    },
  },

  resume: {
    type: String,
    required: false,
  },

  resumeStatus: {
    type: String,
    enum: ["Pending", "Shortlisted", "Rejected"],
    default: "Pending",
  },

  finalStatus: {
    type: String,
    enum: ["Pending", "Selected", "Rejected"],
    default: "Pending",
  },

  // 🆕 Add these new fields for interview scheduling/rescheduling
  interviewDate: {
    type: String, // You can use Date if needed
  },
  interviewTime: {
    type: String,
  },
  interviewLocation: {
    type: String,
  },

  deletedBy: {
    jobSeeker: {
      type: Boolean,
      default: false,
    },
    recruiter: {
      type: Boolean,
      default: false,
    },
  },
});

export const Application = mongoose.model("Application", applicationSchema);