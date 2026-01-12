import Resume from "../models/resumeSchema.js";
import path from "path";
import fs from "fs";

// Create folder if not exist
const ensureDir = (dirPath) => {
  if (!fs.existsSync(dirPath)) fs.mkdirSync(dirPath, { recursive: true });
};

// Helper to parse JSON fields
const parseJsonFields = (body, fields) => {
  const parsed = { ...body };
  fields.forEach((key) => {
    if (body[key] && typeof body[key] === "string") {
      try {
        parsed[key] = JSON.parse(body[key]);
      } catch {
        parsed[key] = [];
      }
    }
  });
  return parsed;
};

// POST /api/v1/resume/create

export const createResume = async (req, res) => {
  try {
    let data = parseJsonFields(req.body, [
      "personalInfo", "contactDetails", "skills", "languagesKnown", "majorExperience",
      "industrySectors", "preferredJobTitles", "preferredLocations", "workExperiences",
      "educations", "certifications", "references", "clientApprovals"
    ]);

    // Upload profile photo
    if (req.files?.profilePhoto) {
      const file = req.files.profilePhoto;
      const filename = Date.now() + "_" + file.name;
      const uploadPath = path.join("uploads/profilePhotos", filename);
      ensureDir("uploads/profilePhotos");
      await file.mv(uploadPath);
      data.personalInfo = data.personalInfo || {};
      data.personalInfo.profilePhoto = `/uploads/profilePhotos/${filename}`;
    }

    // Upload certificates
    if (req.files?.uploadedCertificates) {
      const files = Array.isArray(req.files.uploadedCertificates)
        ? req.files.uploadedCertificates
        : [req.files.uploadedCertificates];
      const paths = [];
      ensureDir("uploads/certificates");
      for (const cert of files) {
        const filename = Date.now() + "_" + cert.name;
        const certPath = path.join("uploads/certificates", filename);
        await cert.mv(certPath);
        paths.push(`/uploads/certificates/${filename}`);
      }
      data.uploadedCertificates = paths;
    }

    // ✅ UPSERT: Create or update by userId
    const resume = await Resume.findOneAndUpdate(
      { userId: data.userId },
      data,
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );

    res.status(200).json({ success: true, message: "Resume saved", resume });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// GET /api/v1/resume/:userId
export const getResumeByUser = async (req, res) => {
  try {
    const resume = await Resume.findOne({ userId: req.params.userId });
    if (!resume) return res.status(404).json({ success: false, message: "Resume not found" });
    res.json({ success: true, resume });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// PUT /api/v1/resume/update/:userId
export const updateResume = async (req, res) => {
  try {
    const resume = await Resume.findOne({ userId: req.params.userId });
    if (!resume) return res.status(404).json({ success: false, message: "Resume not found" });

    let data = parseJsonFields(req.body, [
      "personalInfo", "contactDetails", "skills", "languagesKnown", "majorExperience",
      "industrySectors", "preferredJobTitles", "preferredLocations", "workExperiences",
      "educations", "certifications", "references", "clientApprovals"
    ]);

    // Update photo
    if (req.files?.profilePhoto) {
      const file = req.files.profilePhoto;
      const filename = Date.now() + "_" + file.name;
      ensureDir("uploads/profilePhotos");
      const uploadPath = path.join("uploads/profilePhotos", filename);
      await file.mv(uploadPath);
      data.personalInfo = data.personalInfo || {};
      data.personalInfo.profilePhoto = `/uploads/profilePhotos/${filename}`;
    }

    // New certificates
    if (req.files?.uploadedCertificates) {
      const files = Array.isArray(req.files.uploadedCertificates)
        ? req.files.uploadedCertificates
        : [req.files.uploadedCertificates];
      ensureDir("uploads/certificates");
      const newCerts = [];
      for (const cert of files) {
        const filename = Date.now() + "_" + cert.name;
        const certPath = path.join("uploads/certificates", filename);
        await cert.mv(certPath);
        newCerts.push(`/uploads/certificates/${filename}`);
      }
      data.uploadedCertificates = [...(resume.uploadedCertificates || []), ...newCerts];
    }

    Object.assign(resume, data);
    await resume.save();
    res.json({ success: true, message: "Resume updated", resume });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// DELETE /api/v1/resume/:id
export const deleteResume = async (req, res) => {
  try {
    const resume = await Resume.findById(req.params.id);
    if (!resume) return res.status(404).json({ success: false, message: "Resume not found" });
    await resume.deleteOne();
    res.json({ success: true, message: "Resume deleted" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
