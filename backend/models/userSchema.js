import mongoose from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import validator from "validator";
import crypto from "crypto";

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minLength: [3, "Name must contain at least 3 characters"],
    maxLength: [30, "Name cannot exceed 30 characters."]
  },
  email: {
    type: String,
    required: true,
    validate: [validator.isEmail, "Please provide valid email."]
  },
  phone: {
    type: Number,
    required: true,
  },
  address: {
    type: String,
    required: true
  },
  //DOB , GENDER , Natioanlity, Maritial Status, Country/City , working sence 

  dob:{
    type:Date
  },
  gender:{
      type:String
  },
  nationality:{
    type:String
  },
  maritialStatus:{
    type:String
  },
  country:{
    type:String
  },
  city:{
    type:String
  },
  password: {
    type: String,
    required: true,
    minlength: [8, "Password must contain at least 8 characters."],
    maxlength: [32, "Password cannot exceed 32 characters."],
    select: false
  },
  resume: {
    type: String, // Store the file path (e.g., "/uploads/resumes/john_doe_resume.pdf")
    required: function () {
        return this.role === "Job Seeker";
      },
  },
  coverLetter: {
    type: String,
  },
  role: {
    type: String,
    required: true,
    enum: ["Job Seeker", "Recruiter", "Admin"]
  },
  roleSeeking: {
    type: String,
    required: function() { return this.role === "Job Seeker"; },
  },
  locationPreference: {
    type: String,
    required: function() { return this.role === "Job Seeker"; },
  },
  approvalCertification: {
    type: String,
    required: function() { return this.role === "Job Seeker"; },
  },
  educationQualification: {
    type: String,
    required: function() { return this.role === "Job Seeker"; },
  },
  
  totalExperience: {
    type: String,
    required: function() { return this.role === "Job Seeker"; },
  },
  companyDetails: {
    name: { type: String, },
    location: { type: String, },
    type: { type: String, },
  },
  resetPasswordToken: {type:String},
  resetPasswordExpires: {type:Date},
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    next();
  }
  this.password = await bcrypt.hash(this.password, 10);
});

userSchema.methods.comparePassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

userSchema.methods.getJWTToken = function () {
  return jwt.sign({ id: this._id }, process.env.JWT_SECRET_KEY, {
    expiresIn: process.env.JWT_EXPIRE,
  });
};

// Method to generate reset token
userSchema.methods.getResetPasswordToken = function () {
  const resetToken = crypto.randomBytes(20).toString("hex");
  this.resetPasswordToken = crypto.createHash("sha256")
    .update(resetToken).digest("hex");
  this.resetPasswordExpires = Date.now() + 30 * 60 * 1000; // 30 minutes
  return resetToken;
};

export const User = mongoose.model("User", userSchema);
