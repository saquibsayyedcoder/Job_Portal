import mongoose from "mongoose";

const jobSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    jobType: {
      type: String,
      required: true,
      enum: ["Full-time", "Part-time"],
    },
    location: {
       type: [String],
  required: [true, "At least one Location is required."],
  validate: {
    validator: (v) => Array.isArray(v) && v.length > 0,
    message: "Please select at least one location.",
  },
    },
    companyName: {
      type: String,
      required: true,
    },
    introduction: {
      type: String,
      required: true, // recommended
    },
    responsibilities: {
      type: String,
      required: true,
    },
   qualifications: {
  type: [String],
  required: [true, "At least one qualification is required."],
  validate: {
    validator: (v) => Array.isArray(v) && v.length > 0,
    message: "Please select at least one qualification.",
  },
},
   requiredSkill: {
  type: [String],
  required: [true, "At least one required skill is required."],
  validate: {
    validator: (v) => Array.isArray(v) && v.length > 0,
    message: "Please add at least one required skill.",
  },
},
    salary: {
      type: String,
    },
    hiringMultipleCandidates: {
      type: Boolean,
      default: false,
    },
    personalWebsite: {
      title: String,
      url: String,
    },
   jobRole: {
  type: [String],
  required: [true, "At least one job role is required."],
  validate: {
    validator: (v) => Array.isArray(v) && v.length > 0,
    message: "Please select at least one job role."
  }
},
    // Structured offers object
    offers: {
      accommodation: {
        type: Boolean,
        default: false,
      },
      food: {
        type: Boolean,
        default: false,
      },
      travel: {
        type: Boolean,
        default: false,
      },
    },
    newsLettersSent: {
      type: Boolean,
      default: false,
    },
    postedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    likes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
  },
  {
    timestamps: true, // adds createdAt and updatedAt
  }
);

export const Job = mongoose.model("Job", jobSchema);