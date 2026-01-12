import { catchAsyncErrors } from "../middlewares/catchAsyncErrors.js";
import ErrorHandler from "../middlewares/error.js";
import { User } from "../models/userSchema.js";
import { sendToken } from "../utils/jwtToken.js";
import crypto from "crypto";
import axios from "axios";
import fs from "fs";
import path from "path";
import {sendEmail} from "../utils/sendEmail.js"
export const register = catchAsyncErrors(async (req, res, next) => {
  try {
    const {
      name,
      email,
      phone,
      address,
      dob,
      gender,
      nationality,
      maritialStatus,
      country,
      city,
      password,
      role,
      coverLetter,
      roleSeeking,
      locationPreference,
      approvalCertification,
      educationQualification,
      totalExperience,
      companyName,
      companyLocation,
      companyType,
    } = req.body;

    if (!name || !email || !phone || !address || !password || !role) {
      return next(new ErrorHandler("All fields are required.", 400));
    }

    if (role === "Admin") {
      const existingAdmin = await User.findOne({ role: "Admin" });
      if (existingAdmin) {
        return next(new ErrorHandler("Admin already exists.", 403));
      }
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return next(new ErrorHandler("Email is already registered", 400));
    }

    const userData = {
      name,
      email,
      phone,
      address,
      password,
      role,
      coverLetter,
      resume: "", // Optional by default
    };

    if (role === "Recruiter") {
      if (!companyName || !companyLocation || !companyType) {
        return next(
          new ErrorHandler(
            "All company details are required for recruiters.",
            400
          )
        );
      }
      userData.companyDetails = {
        name: companyName,
        location: companyLocation,
        type: companyType,
      };
    }

    if (role === "Job Seeker") {
      if (
        !roleSeeking ||
        !locationPreference ||
        !approvalCertification ||
        !educationQualification ||
        !totalExperience
      ) {
        return next(
          new ErrorHandler("All job seeker fields are required.", 400)
        );
      }
      (userData.dob = dob),
        (userData.gender = gender),
        (userData.nationality = nationality),
        (userData.maritialStatus = maritialStatus),
        (userData.country = country),
        (userData.city = city),
        (userData.roleSeeking = roleSeeking);
      userData.locationPreference = locationPreference;
      userData.approvalCertification = approvalCertification;
      userData.educationQualification = educationQualification;

      userData.totalExperience = totalExperience;
    }

    // Optional company details (e.g., for job seekers switching to recruiters)
    if (req.body.companyDetails) {
      userData.companyDetails = req.body.companyDetails;
    }

    // Resume handling
    if (req.files && req.files.resume) {
      const { resume } = req.files;
      const resumeFileName = `${Date.now()}_${resume.name}`;
      const resumePath = path.join(
        path.resolve(),
        "uploads",
        "resumes",
        resumeFileName
      );

      await resume.mv(resumePath);
      userData.resume = encodeURI(`/uploads/resumes/${resumeFileName}`);
    } else if (req.body.resume) {
      userData.resume = encodeURI(req.body.resume);
    } else if (role === "Job Seeker") {
      return next(new ErrorHandler("Resume is required for job seekers.", 400));
    }

    const user = await User.create(userData);
    sendToken(user, 201, res, "User Registered.");
  } catch (error) {
    next(error);
  }
});

export const login = catchAsyncErrors(async (req, res, next) => {
  const { role, email, password } = req.body;
  if (!role || !email || !password) {
    return next(
      new ErrorHandler("Email, password and role are required.", 400)
    );
  }
  const user = await User.findOne({ email }).select("+password");
  if (!user) {
    return next(new ErrorHandler("Invalid email or password.", 400));
  }
  const isPasswordMatched = await user.comparePassword(password);
  if (!isPasswordMatched) {
    return next(new ErrorHandler("Invalid email or password.", 400));
  }
  if (user.role !== role) {
    return next(new ErrorHandler("Invalid user role.", 400));
  }
  sendToken(user, 200, res, "login successfully.");
});

export const logout = catchAsyncErrors(async (req, res, next) => {
  res
    .status(200)
    .cookie("token", "", {
      expires: new Date(Date.now()),
      httpOnly: true,
    })
    .json({
      success: true,
      message: "Logged out successfully.",
    });
});

export const getUser = catchAsyncErrors(async (req, res, next) => {
  const user = req.user;
  res.status(200).json({
    success: true,
    user,
  });
});

export const updateProfile = catchAsyncErrors(async (req, res, next) => {
  const newUserData = {
    name: req.body.name,
    email: req.body.email,
    phone: req.body.phone,
    address: req.body.address,
    dob: req.body.dob,
    gender: req.body.gender,
    nationality: req.body.nationality,
    maritialStatus: req.body.maritialStatus,
    country: req.body.country,
    city: req.body.city,
    coverLetter: req.body.coverLetter,
    roleSeeking: req.body.roleSeeking,
    locationPreference: req.body.locationPreference,
    approvalCertification: req.body.approvalCertification,
    educationQualification: req.body.educationQualification,
    totalExperience: req.body.totalExperience,
    companyDetails: {
      name: req.body.companyName,
      location: req.body.companyLocation,
      type: req.body.companyType,
    },
  };

  // Handle resume file upload if provided
  if (req.files && req.files.resume) {
    const resume = req.files.resume;
    const resumeFileName = `${Date.now()}_${resume.name}`;
    const resumePath = path.join(
      path.resolve(),
      "uploads",
      "resumes",
      resumeFileName
    );

    // Move file from temp directory to uploads/resumes
    await resume.mv(resumePath);

    // Save file path to DB
    newUserData.resume = encodeURI(`/uploads/resumes/${resumeFileName}`);
  }
  const user = await User.findByIdAndUpdate(req.user.id, newUserData, {
    new: true,
    runValidators: true,
    useFindAndModify: false,
  });

  res.status(200).json({
    success: true,
    user,
    message: "Profile updated.",
  });
});

export const updatePassword = catchAsyncErrors(async (req, res, next) => {
  const user = await User.findById(req.user.id).select("+password");
  const isPasswordMatched = await user.comparePassword(req.body.oldPassword);

  if (!isPasswordMatched) {
    return next(new ErrorHandler("Old password is incorrect.", 400));
  }
  if (req.body.newPassword !== req.body.confirmPassword) {
    return next(
      new ErrorHandler("New password & confirm password do not match.", 400)
    );
  }
  user.password = req.body.newPassword;
  await user.save();
  sendToken(user, 200, res, "Password updated successfully.");
});

export const forgotPassword = catchAsyncErrors(async (req, res, next) => {
  const { email } = req.body;

  if (!email) {
    return next(new ErrorHandler("Email address is required", 400));
  }

  // Find user by email
  const user = await User.findOne({ email }).select("+password");

  // 🔐 Step 1: If user doesn't exist → return generic success (prevent enumeration)
  if (!user) {
    return res.status(200).json({
      success: true,
      message: "If your account exists, a reset link has been sent to your email.",
    });
  }

  // 🛠 Step 2: User exists → generate reset token
  const resetToken = user.getResetPasswordToken();
  await user.save({ validateBeforeSave: false });

  // 🌐 Step 3: Create reset URL
  const resetUrl = `${req.protocol}://${req.get("host")}/reset-password/${resetToken}`;

  // 📧 Step 4: Prepare email
  const htmlMessage = `
    <h2>Password Reset Request</h2>
    <p>Hello ${user.name || "User"},</p>
    <p>You requested a password reset. Click the button below to set a new password:</p>
    <a href="${resetUrl}" style="display: inline-block; padding: 10px 20px; background-color: #007bff; color: white; text-decoration: none; border-radius: 5px;">
      Reset Password
    </a>
    <p><small>This link will expire in 30 minutes.</small></p>
    <p>If you didn't request this, please ignore this email.</p>
  `;

  // 📬 Step 5: Try to send email — but don't fail the request if it fails
  try {
    await sendEmail({
      email: user.email,
      subject: "Password Reset Request",
      html: htmlMessage, // use html instead of message (cleaner)
    });

    console.log(`✅ Reset email sent to ${user.email}`);
  } catch (error) {
    console.error(`❌ Failed to send reset email to ${user.email}:`, error.message);

    // 🧹 Clean up: remove token if email failed
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save({ validateBeforeSave: false });

    // 💡 DO NOT return error — continue silently
  }

  // ✅ Step 6: Always return generic success
  res.status(200).json({
    success: true,
    message: "If your account exists, a reset link has been sent to your email.",
  });
});

export const resetPassword = catchAsyncErrors(async (req, res, next) => {
  const { newPassword, confirmPassword } = req.body;

  if (!newPassword || !confirmPassword) {
    return next(new ErrorHandler("All fields are required", 400));
  }

  if (newPassword !== confirmPassword) {
    return next(new ErrorHandler("Passwords do not match", 400));
  }

  const resetTokenHash = crypto
    .createHash("sha256")
    .update(req.params.token)
    .digest("hex");

  const user = await User.findOne({
    resetPasswordToken: resetTokenHash,
    resetPasswordExpire: { $gt: Date.now() }, // ← fixed: no extra 's'
  });

  if (!user) {
    return next(new ErrorHandler("Invalid or expired reset token", 400));
  }

  // Set new password
  user.password = newPassword;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;

  await user.save();

  sendToken(user, 200, res, "Password reset successful.");
});
