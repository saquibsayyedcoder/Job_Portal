import axios from "axios";
import { catchAsyncErrors } from "../middlewares/catchAsyncErrors.js";
import ErrorHandler from "../middlewares/error.js";
import { Application } from "../models/applicationSchema.js";
import { Job } from "../models/jobSchema.js";
import {User} from "../models/userSchema.js"
import { sendEmail } from "../utils/sendEmail.js";
//import { v2 as cloudinary } from "cloudinary";

export const postApplication = catchAsyncErrors(async (req, res, next) => {
  const { id } = req.params;
  const { name, email, phone, address, coverLetter } = req.body;
  
  if (!name || !email || !phone || !address || !coverLetter) {
    return next(new ErrorHandler("All fields are required.", 400));
  }

  const jobDetails = await Job.findById(id);
  if (!jobDetails) {
    return next(new ErrorHandler("Job not found.", 404));
  }

  const isAlreadyApplied = await Application.findOne({
    "jobInfo.jobId": id,
    "jobSeekerInfo.id": req.user._id,
  });

  if (isAlreadyApplied) {
    return next(new ErrorHandler("You have already applied for this job.", 400));
  }

  const jobSeekerInfo = {
    id: req.user._id,
    name,
    email,
    phone,
    address,
    coverLetter,
    role: "Job Seeker",
  };

  const recruiterInfo = {
    id: jobDetails.postedBy,
    role: "Recruiter",
  };

  const jobInfo = {
    jobId: id,
    jobTitle: jobDetails.title,
  };

  // Resume handling
  let resumePath = null;
  console.log("req.file:", req.file); // Should log file metadata 

  if (req.file) {
    resumePath = `/uploads/resumes/${req.file.filename}`;
  } else if (req.user?.resume?.url) {
    resumePath = req.user.resume.url;
  } else {
    return next(new ErrorHandler("Please upload a resume.", 400));
  }

  const application = await Application.create({
    jobSeekerInfo,
    recruiterInfo,
    jobInfo,
    resume: resumePath, // ✅ Save resume at top-level
    resumeStatus: "Pending",
    finalStatus: "Pending",
  });

  res.status(201).json({
    success: true,
    message: "Application submitted successfully.",
    application,
  });
});

export const recruiterGetAllApplication = catchAsyncErrors(
  async (req, res, next) => {
    const { _id } = req.user;
    const applications = await Application.find({
        "recruiterInfo.id": _id,
        "deletedBy.recruiter": false,
      });

      console.log(applications);
      
      
    res.status(200).json({
      success: true,
      applications,
    });
   
      
  }
);

export const jobSeekerGetAllApplication = catchAsyncErrors(
  async (req, res, next) => {
    const { _id } = req.user;
    const applications = await Application.find({
      "jobSeekerInfo.id": _id,
      "deletedBy.jobSeeker": false,
    });
    res.status(200).json({
      success: true,
      applications,
    });
  }
);

export const deleteApplication = catchAsyncErrors(async (req, res, next) => {
  const { id } = req.params;
  const application = await Application.findById(id);
  if (!application) {
    return next(new ErrorHandler("Application not found.", 404));
  }
  const { role } = req.user;
  switch (role) {
    case "Job Seeker":
      application.deletedBy.jobSeeker = true;
      await application.save();
      break;
    case "Recruiter":
      application.deletedBy.recruiter = true;
      await application.save();
      break;

    default:
      console.log("Default case for application delete function.");
      break;
  }

  if (
    application.deletedBy.recruiter === true &&
    application.deletedBy.jobSeeker === true
  ) {
    await application.deleteOne();
  }
  res.status(200).json({
    success: true,
    message: "Application Deleted.",
  });
});

export const updateFinalStatus = catchAsyncErrors(async (req, res, next) => {
  const { id } = req.params;
  const { status } = req.body;

  const validStatuses = ["Selected", "Rejected"];
  if (!validStatuses.includes(status)) {
    return next(new ErrorHandler("Invalid status", 400));
  }

  const application = await Application.findById(id).populate({
    path: "jobInfo.jobId",
    select: "postedBy",
  });

  if (!application) {
    return next(new ErrorHandler("Application not found", 404));
  }

  const job = application.jobInfo.jobId;

  if (!job || !job.postedBy || job.postedBy.toString() !== req.user.id) {
    return next(new ErrorHandler("Not authorized to update final status", 403));
  }

  // ✅ Update final status
  application.finalStatus = status;
  await application.save();

  // ✅ Notify the job seeker
  const jobSeeker = await User.findById(application.jobSeekerInfo.id);

  if (!jobSeeker || !jobSeeker.email) {
    return next(new ErrorHandler("Job seeker's updated email not found", 404));
  }

  let subject, message, html, whatsappMessage;

  if (status === "Selected") {
    subject = "🎉 Final Selection: You're Hired!";
    message = `Dear ${jobSeeker.name}, congratulations! You have been selected for the ${application.jobInfo.jobTitle} position.`;
    whatsappMessage = `Hi ${jobSeeker.name}, Congratulations! You've been *selected* for the position of ${application.jobInfo.jobTitle}. Our team will contact you soon. - Recruitment Team`;

    html = `
      <p>Dear <strong>${jobSeeker.name}</strong>,</p>
      <p>🎉 We are delighted to inform you that you have been <strong style="color:green;">selected</strong> for the <strong>${application.jobInfo.jobTitle}</strong> position.</p>
      <p>Our team will be reaching out to you shortly with further details and onboarding instructions.</p>
      <p>We look forward to having you onboard!</p>
      <p>Congratulations once again!</p>
      <p>Regards,<br/>Recruitment Team</p>
    `;
  } else if (status === "Rejected") {
    subject = "📢 Final Update on Your Application";
    message = `Dear ${jobSeeker.name}, we appreciate your efforts, but unfortunately, you have not been selected for the ${application.jobInfo.jobTitle} position.`;
    whatsappMessage = `Hi ${jobSeeker.name}, thank you for applying for the ${application.jobInfo.jobTitle} position. Unfortunately, you have *not been selected*. We appreciate your time and encourage you to apply again. - Recruitment Team`;

    html = `
      <p>Dear <strong>${jobSeeker.name}</strong>,</p>
      <p>Thank you for attending the interview for the <strong>${application.jobInfo.jobTitle}</strong> position.</p>
      <p>After thorough evaluation, we regret to inform you that you have <strong style="color:red;">not been selected</strong> for the role.</p>
      <p>We sincerely appreciate your interest and effort, and we encourage you to apply for future openings.</p>
      <p>Wishing you the very best in your career journey.</p>
      <p>Regards,<br/>Recruitment Team</p>
    `;
  }

  // ✅ Send Email
  await sendEmail({
    email: jobSeeker.email,
    subject,
    message,
    html,
  });

  // ✅ Send WhatsApp
  const phoneNumber = jobSeeker.phone;
  if (!phoneNumber) {
    return next(new ErrorHandler("Job seeker's phone number not found", 404));
  }

  const whatsappUrl = `http://wa.techrush.in/api/authkeywa-api.php?authkey=333361697a747377613130301748931177&route=68&number=${phoneNumber}&message=${encodeURIComponent(whatsappMessage)}`;

  try {
    await axios.get(whatsappUrl);
  } catch (error) {
    console.error("Failed to send WhatsApp message:", error.message);
  }

  res.status(200).json({
    success: true,
    message: `Final status updated to ${status}.`,
    application,
  });
});

// Select Resume (shortlist)
export const selectResume = catchAsyncErrors(async (req, res, next) => {
  const applicationId = req.params.id;
  const { interviewDate, interviewTime, interviewLocation } = req.body;

  const application = await Application.findById(applicationId).populate({
    path: "jobInfo.jobId",
    select: "postedBy",
  });

  if (!application) {
    return next(new ErrorHandler("Application not found", 404));
  }

  const job = application.jobInfo.jobId;

  if (!job || !job.postedBy) {
    return next(new ErrorHandler("Job information not available", 400));
  }

  if (job.postedBy.toString() !== req.user.id) {
    return next(new ErrorHandler("Not authorized to select this resume", 403));
  }

  // ✅ Fix: Update root-level resumeStatus
  application.resumeStatus = "Shortlisted";
  await application.save();

  const jobSeeker = await User.findById(application.jobSeekerInfo.id);

  if (!jobSeeker || !jobSeeker.email) {
    return next(new ErrorHandler("Job seeker's updated email not found", 404));
  }

  const subject = "🎉 Your Resume Has Been Shortlisted!";
  const message = `Dear ${jobSeeker.name}, your resume has been shortlisted. Please attend the interview.`;

  const html = `
    <p>Dear <strong>${jobSeeker.name}</strong>,</p>
    <p>🎉 Congratulations! Your resume has been <strong style="color:green;">shortlisted</strong> for the <strong>${application.jobInfo.jobTitle}</strong> position.</p>
    <p><strong>Interview Details:</strong></p>
    <ul>
      <li><strong>Date:</strong> ${interviewDate}</li>
      <li><strong>Time:</strong> ${interviewTime}</li>
      <li><strong>Location:</strong> ${interviewLocation}</li>
    </ul>
    <p>Please be on time. Best of luck!</p>
    <p>Regards,<br/>Recruitment Team</p>
  `;

  await sendEmail({ email: jobSeeker.email, subject, message, html });

  // ✅ WhatsApp notification
  const whatsappMessage = `Hello ${jobSeeker.name}, your resume has been shortlisted for the ${application.jobInfo.jobTitle} position!\nInterview on ${interviewDate} at ${interviewTime}, Location: ${interviewLocation}.`;

  const whatsappUrl = `http://wa.techrush.in/api/authkeywa-api.php?authkey=333361697a747377613130301748931177&route=68&number=${jobSeeker.phone}&message=${encodeURIComponent(whatsappMessage)}`;

  try {
    const response = await axios.get(whatsappUrl);
    console.log("✅ WhatsApp API Response:", response.data);
  } catch (error) {
    console.error("❌ Failed to send WhatsApp message:", error.message);
    if (error.response) {
      console.error("WhatsApp API error details:", error.response.data);
    }
  }

  res.status(200).json({
    success: true,
    message: "Resume status updated to Shortlisted.",
    application,
  });
});



export const rejectResume = catchAsyncErrors(async (req, res, next) => {
  const applicationId = req.params.id;

  // 1. Find the application and populate job poster
  const application = await Application.findById(applicationId).populate({
    path: "jobInfo.jobId",
    select: "postedBy",
  });

  if (!application) {
    return next(new ErrorHandler("Application not found", 404));
  }

  const job = application.jobInfo.jobId;

  if (!job || !job.postedBy) {
    return next(new ErrorHandler("Job information not available", 400));
  }

  // 2. Ensure the logged-in recruiter is the job poster
  if (job.postedBy.toString() !== req.user.id) {
    return next(new ErrorHandler("Not authorized to reject this resume", 403));
  }

  // ✅ 3. Update the correct resumeStatus field at the root level
  application.resumeStatus = "Rejected";
  await application.save();

  // 4. Get job seeker details
  const jobSeeker = await User.findById(application.jobSeekerInfo.id);
  if (!jobSeeker || !jobSeeker.email) {
    return next(new ErrorHandler("Job seeker's updated email not found", 404));
  }

  // 5. Prepare and send email
  const subject = "📢 Update on Your Job Application";
  const message = `Dear ${jobSeeker.name}, we regret to inform you that your resume was not shortlisted for the ${application.jobInfo.jobTitle} position.`;

  const html = `
    <p>Dear <strong>${jobSeeker.name}</strong>,</p>
    <p>Thank you for applying for the <strong>${application.jobInfo.jobTitle}</strong> position.</p>
    <p>After careful consideration, we regret to inform you that your resume was <strong style="color:red;">not shortlisted</strong> for the next round.</p>
    <p>We appreciate your interest and encourage you to apply for future openings that match your profile.</p>
    <p>Wishing you all the best in your job search.</p>
    <p>Regards,<br/>Recruitment Team</p>
  `;

  await sendEmail({ email: jobSeeker.email, subject, message, html });

  // 6. Send WhatsApp notification
  const whatsappMessage = `Hello ${jobSeeker.name}, thank you for applying for the ${application.jobInfo.jobTitle} position. We regret to inform you that your resume was not shortlisted. We wish you all the best for future opportunities.`;

  const whatsappUrl = `http://wa.techrush.in/api/authkeywa-api.php?authkey=333361697a747377613130301748931177&route=68&number=${jobSeeker.phone}&message=${encodeURIComponent(whatsappMessage)}`;

  try {
    const response = await axios.get(whatsappUrl);
    console.log("✅ WhatsApp API Response:", response.data);
  } catch (error) {
    console.error("❌ Failed to send WhatsApp message:", error.message);
    if (error.response) {
      console.error("WhatsApp API error details:", error.response.data);
    }
  }

  // 7. Send success response
  res.status(200).json({
    success: true,
    message: "Resume status updated to Rejected.",
    application,
  });
});

export const rescheduleInterview = catchAsyncErrors(async (req, res, next) => {
  const applicationId = req.params.id;
  const { interviewDate, interviewTime, interviewLocation } = req.body;

  const application = await Application.findById(applicationId).populate({
    path: "jobInfo.jobId",
    select: "postedBy",
  });

  if (!application) {
    return next(new ErrorHandler("Application not found", 404));
  }

  const job = application.jobInfo.jobId;

  if (!job || !job.postedBy) {
    return next(new ErrorHandler("Job information not available", 400));
  }

  if (job.postedBy.toString() !== req.user.id) {
    return next(new ErrorHandler("Not authorized", 403));
  }

  if (application.resumeStatus !== "Shortlisted") {
    return next(
      new ErrorHandler("Only shortlisted applications can be rescheduled", 400)
    );
  }

  application.interviewDate = interviewDate;
  application.interviewTime = interviewTime;
  application.interviewLocation = interviewLocation;
  await application.save();

  const jobSeeker = await User.findById(application.jobSeekerInfo.id);

  if (!jobSeeker || !jobSeeker.email) {
    return next(new ErrorHandler("Job seeker's email not found", 404));
  }

  const subject = "📅 Interview Rescheduled";
  const message = `Dear ${jobSeeker.name}, your interview has been rescheduled.`;
  const html = `
    <p>Dear <strong>${jobSeeker.name}</strong>,</p>
    <p>📅 Your interview for the <strong>${application.jobInfo.jobTitle}</strong> position has been rescheduled.</p>
    <p><strong>New Interview Details:</strong></p>
    <ul>
      <li><strong>Date:</strong> ${interviewDate}</li>
      <li><strong>Time:</strong> ${interviewTime}</li>
      <li><strong>Location:</strong> ${interviewLocation}</li>
    </ul>
    <p>Please make sure to attend on time. Best of luck!</p>
    <p>Regards,<br/>Recruitment Team</p>
  `;

  await sendEmail({ email: jobSeeker.email, subject, message, html });

  const whatsappMessage = `Hello ${jobSeeker.name}, your interview for the ${application.jobInfo.jobTitle} position has been rescheduled.\nNew Date: ${interviewDate}\nTime: ${interviewTime}\nLocation: ${interviewLocation}`;

  const whatsappUrl = `http://wa.techrush.in/api/authkeywa-api.php?authkey=333361697a747377613130301748931177&route=68&number=${jobSeeker.phone}&message=${encodeURIComponent(whatsappMessage)}`;

  try {
    await axios.get(whatsappUrl);
  } catch (error) {
    console.error("Failed to send WhatsApp message:", error.message);
  }

  res.status(200).json({
    success: true,
    message: "Interview rescheduled successfully.",
    application,
  });
});
