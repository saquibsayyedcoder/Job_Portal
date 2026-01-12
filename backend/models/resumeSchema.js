// models/resumeSchema.js
import mongoose from 'mongoose';

const resumeSchema = new mongoose.Schema({
   userId: { 
    type: String, 
    required: [true, "User ID is required"], 
    unique: true // One resume per user
  },
  fullName: { type: String },
  email: { type: String },
  phone: { type: String },
  careerObjective: { type: String },
  jobTitle: { type: String },
  totalExperience: { type: Number },
  employmentType: { type: String },
  availabilityToJoin: { type: String },
  willingToRelocate: { type: Boolean },
  personalInfo: {
    fullName: { type: String },
    dob: { type: Date },
    gender: { type: String },
    nationality: { type: String },
    maritalStatus: { type: String },
    currentLocation: { type: String },
    profilePhoto: { type: String },
  },
  contactDetails: {
    email: { type: String },
    mobileNumber: { type: String },
    currentAddress: { type: String },
  },
  skills: [{ type: String }],
  languagesKnown: [{ type: String }],
  majorExperience: [{ type: Object }],
  industrySectors: [{ type: String }],
  preferredJobTitles: [{ type: String }],
  preferredLocations: [{ type: String }],
  workExperiences: [{ type: Object }],
  educations: [{ type: Object }],
  certifications: [{ type: Object }],
  uploadedCertificates: [{ type: String }],
  references: [{ type: Object }],
  clientApprovals: [{ type: Object }],
});

const Resume = mongoose.model("Resume", resumeSchema);

export default Resume;