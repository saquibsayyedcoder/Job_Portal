import React, { useState, useEffect, useRef } from "react";
import html2pdf from "html2pdf.js";
import axios from "axios";
import { Button } from "@/components/ui/button";

// Utility: Sanitize placeholder garbage like "abcabcabc"
const sanitizeText = (text) => {
  if (typeof text !== 'string') return text;
  const trimmed = text.trim();
  if (/^(abc)+abc*$/.test(trimmed)) return "";
  if (trimmed.length > 50 && /(abc){5,}/i.test(trimmed)) return "";
  return text;
};

// Resume Form Component
const ResumeBuilderForm = ({ form, handleChange, handlePhotoChange, setForm }) => {
  const handleNestedChange = (e, index, section) => {
    const { name, value } = e.target;
    setForm((prev) => {
      const newSection = [...prev[section]];
      newSection[index] = { ...newSection[index], [name]: value };
      return { ...prev, [section]: newSection };
    });
  };

  const addField = (section) => {
    const templates = {
      education: { college: "", degree: "", startDate: "", endDate: "" },
      experience: { company: "", jobTitle: "", description: "", startDate: "", endDate: "" },
      projects: { title: "", technology: "", description: "" }
    };
    setForm((prev) => ({ ...prev, [section]: [...prev[section], templates[section]] }));
  };

  const removeField = (index, section) => {
    setForm((prev) => ({
      ...prev,
      [section]: prev[section].filter((_, i) => i !== index)
    }));
  };

  const formatTotalExperience = (years) => {
    if (years <= 0) return "";
    const flooredYears = Math.floor(years);
    return `${flooredYears} year${flooredYears !== 1 ? "s" : ""}`;
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-md max-h-screen overflow-y-auto">
      <h2 className="text-2xl font-bold mb-4 text-gray-800">Build Your Resume</h2>

      {/* Photo Upload */}
      <div className="mb-4">
        <label className="block font-medium text-sm text-gray-700 mb-1">Upload Photo</label>
        <input type="file" accept="image/*" onChange={handlePhotoChange} className="text-sm" />
      </div>

      {/* Personal Info */}
      {[
        { label: "Full Name", name: "name" },
        { label: "Email", name: "email" },
        { label: "Mobile Number", name: "phone" },
        { label: "Alternate Mobile", name: "mobile" },
        { label: "LinkedIn", name: "linkedIn" },
        { label: "Job Title", name: "jobTitle" },
        { label: "Summary", name: "summary", rows: 3 },
        { label: "Skills (comma-separated)", name: "skills", rows: 2 },
      ].map(({ label, name, rows = 1 }) => (
        <div key={name} className="mb-4">
          <label className="block font-medium text-sm text-gray-700 mb-1">{label}</label>
          <textarea
            name={name}
            rows={rows}
            value={form[name] || ""}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-md p-2 text-sm focus:ring-2 focus:ring-indigo-500"
          />
        </div>
      ))}

      {/* Education */}
      <div className="mb-4">
        <label className="block font-medium text-sm text-gray-700 mb-1">Education</label>
        {form.education.map((edu, index) => (
          <div key={index} className="space-y-2 mb-4 border-b pb-2">
            <input
              type="text"
              name="college"
              placeholder="College / Institution"
              value={edu.college || ""}
              onChange={(e) => handleNestedChange(e, index, "education")}
              className="w-full border border-gray-300 rounded-md p-2 text-sm"
            />
            <input
              type="text"
              name="degree"
              placeholder="Degree & Field of Study"
              value={edu.degree || ""}
              onChange={(e) => handleNestedChange(e, index, "education")}
              className="w-full border border-gray-300 rounded-md p-2 text-sm"
            />
            <div className="grid grid-cols-2 gap-2">
              <input
                type="date"
                name="startDate"
                value={edu.startDate || ""}
                onChange={(e) => handleNestedChange(e, index, "education")}
                className="w-full border border-gray-300 rounded-md p-2 text-sm"
              />
              <input
                type="date"
                name="endDate"
                value={edu.endDate || ""}
                onChange={(e) => handleNestedChange(e, index, "education")}
                className="w-full border border-gray-300 rounded-md p-2 text-sm"
              />
            </div>
            {form.education.length > 1 && (
              <button
                type="button"
                onClick={() => removeField(index, "education")}
                className="text-red-500 text-sm hover:underline"
              >
                Remove Education
              </button>
            )}
          </div>
        ))}
        <button
          type="button"
          onClick={() => addField("education")}
          className="text-blue-500 text-sm hover:underline"
        >
          + Add More Education
        </button>
      </div>

      {/* Work Experience */}
      <div className="mb-4">
        <label className="block font-medium text-sm text-gray-700 mb-1">Work Experience</label>
        {form.experience.map((exp, index) => (
          <div key={index} className="space-y-2 mb-4 border-b pb-2">
            <input
              type="text"
              name="company"
              placeholder="Company Name"
              value={exp.company || ""}
              onChange={(e) => handleNestedChange(e, index, "experience")}
              className="w-full border border-gray-300 rounded-md p-2 text-sm"
            />
            <input
              type="text"
              name="jobTitle"
              placeholder="Job Title"
              value={exp.jobTitle || ""}
              onChange={(e) => handleNestedChange(e, index, "experience")}
              className="w-full border border-gray-300 rounded-md p-2 text-sm"
            />
            <textarea
              name="description"
              placeholder="Description of Role"
              rows={2}
              value={exp.description || ""}
              onChange={(e) => handleNestedChange(e, index, "experience")}
              className="w-full border border-gray-300 rounded-md p-2 text-sm"
            />
            <div className="grid grid-cols-2 gap-2">
              <input
                type="date"
                name="startDate"
                value={exp.startDate || ""}
                onChange={(e) => handleNestedChange(e, index, "experience")}
                className="w-full border border-gray-300 rounded-md p-2 text-sm"
              />
              <input
                type="date"
                name="endDate"
                value={exp.endDate || ""}
                onChange={(e) => handleNestedChange(e, index, "experience")}
                className="w-full border border-gray-300 rounded-md p-2 text-sm"
              />
            </div>
            {form.experience.length > 1 && (
              <button
                type="button"
                onClick={() => removeField(index, "experience")}
                className="text-red-500 text-sm hover:underline"
              >
                Remove Experience
              </button>
            )}
          </div>
        ))}
        <button
          type="button"
          onClick={() => addField("experience")}
          className="text-blue-500 text-sm hover:underline"
        >
          + Add More Experience
        </button>
      </div>

      {/* Projects */}
      <div className="mb-4">
        <label className="block font-medium text-sm text-gray-700 mb-1">Projects</label>
        {form.projects.map((project, index) => (
          <div key={index} className="space-y-2 mb-4 border-b pb-2">
            <input
              type="text"
              name="title"
              placeholder="Project Title"
              value={project.title || ""}
              onChange={(e) => handleNestedChange(e, index, "projects")}
              className="w-full border border-gray-300 rounded-md p-2 text-sm"
            />
            <input
              type="text"
              name="technology"
              placeholder="Technologies Used"
              value={project.technology || ""}
              onChange={(e) => handleNestedChange(e, index, "projects")}
              className="w-full border border-gray-300 rounded-md p-2 text-sm"
            />
            <textarea
              name="description"
              placeholder="Project Description"
              rows={2}
              value={project.description || ""}
              onChange={(e) => handleNestedChange(e, index, "projects")}
              className="w-full border border-gray-300 rounded-md p-2 text-sm"
            />
            {form.projects.length > 1 && (
              <button
                type="button"
                onClick={() => removeField(index, "projects")}
                className="text-red-500 text-sm hover:underline"
              >
                Remove Project
              </button>
            )}
          </div>
        ))}
        <button
          type="button"
          onClick={() => addField("projects")}
          className="text-blue-500 text-sm hover:underline"
        >
          + Add More Project
        </button>
      </div>

      {/* Certifications */}
      <div className="mb-4">
        <label className="block font-medium text-sm text-gray-700 mb-1">Certifications</label>
        <textarea
          name="certifications"
          rows={3}
          value={form.certifications || ""}
          onChange={handleChange}
          placeholder="Enter certifications (each line as one certification)"
          className="w-full border border-gray-300 rounded-md p-2 text-sm"
        />
      </div>

      {/* Auto Calculated Fields */}
      <div className="mb-4">
        <label className="block font-medium text-sm text-gray-700 mb-1">Total Experience</label>
        <input
          type="text"
          value={formatTotalExperience(form.totalExperience)}
          readOnly
          className="w-full border border-gray-300 rounded-md p-2 bg-gray-100 text-sm"
        />
      </div>
      <div className="mb-4">
        <label className="block font-medium text-sm text-gray-700 mb-1">Employment Type</label>
        <input
          type="text"
          name="employmentType"
          value={form.employmentType || ""}
          onChange={handleChange}
          placeholder="e.g., Full-time, Remote, Freelance"
          className="w-full border border-gray-300 rounded-md p-2 text-sm"
        />
      </div>
      <div className="mb-4">
        <label className="block font-medium text-sm text-gray-700 mb-1">Availability to Join</label>
        <input
          type="text"
          name="availabilityToJoin"
          value={form.availabilityToJoin || ""}
          onChange={handleChange}
          placeholder="e.g., Immediately or within 2 weeks"
          className="w-full border border-gray-300 rounded-md p-2 text-sm"
        />
      </div>
      <div className="mb-4 flex items-center">
        <input
          type="checkbox"
          id="relocate"
          name="willingToRelocate"
          checked={!!form.willingToRelocate}
          onChange={handleChange}
          className="mr-2"
        />
        <label htmlFor="relocate" className="text-sm text-gray-700">
          Willing to Relocate
        </label>
      </div>
    </div>
  );
};

// Resume Preview Component
const ResumePreview = React.forwardRef(({ form, photo }, ref) => {
  const calculateTotalExperience = () => {
    let totalYears = 0;
    if (Array.isArray(form.experience)) {
      form.experience.forEach((exp) => {
        if (exp.startDate && exp.endDate) {
          const start = new Date(exp.startDate);
          const end = new Date(exp.endDate);
          if (!isNaN(start.getTime()) && !isNaN(end.getTime())) {
            const diffTime = Math.abs(end - start);
            const diffYears = diffTime / (1000 * 60 * 60 * 24 * 365);
            totalYears += diffYears;
          }
        }
      });
    }
    if (totalYears <= 0) return "";
    const flooredYears = Math.floor(totalYears);
    return `${flooredYears} year${flooredYears !== 1 ? "s" : ""}`;
  };

  return (
    <div ref={ref} className="bg-white p-6 rounded-xl shadow-lg border w-full">
      {/* Header */}
      <div className="flex items-center space-x-4 mb-4">
        {photo && (
          <img
            src={photo}
            alt="Profile"
            className="w-20 h-20 rounded-full border object-cover"
          />
        )}
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{form.name || "Your Name"}</h1>
          <p className="text-sm text-gray-600">
            {form.email} | {form.phone} | {form.mobile}
          </p>
          <p className="text-xs text-gray-500">{form.jobTitle}</p>
          {form.linkedIn && <p className="text-xs text-blue-600">{form.linkedIn}</p>}
        </div>
      </div>

      {/* Summary */}
      {form.summary && (
        <div className="mb-4">
          <h2 className="text-lg font-semibold text-gray-800 border-b pb-1">Summary</h2>
          <p className="text-sm text-gray-700 whitespace-pre-wrap mt-2">{form.summary}</p>
        </div>
      )}

      {/* Skills */}
      {form.skills && (
        <div className="mb-4">
          <h2 className="text-lg font-semibold text-gray-800 border-b pb-1">Skills</h2>
          <div className="flex flex-wrap gap-2 mt-2">
            {form.skills
              .split(",")
              .map((skill, i) => skill.trim() && (
                <span
                  key={i}
                  className="px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-xs"
                >
                  {skill.trim()}
                </span>
              ))}
          </div>
        </div>
      )}

      {/* Work Experience */}
      {Array.isArray(form.experience) &&
        form.experience.some(exp => exp.company || exp.jobTitle) && (
          <div className="mb-4">
            <h2 className="text-lg font-semibold text-gray-800 border-b pb-1">Work Experience</h2>
            {form.experience.map(
              (exp, idx) =>
                (exp.company || exp.jobTitle) && (
                  <div key={idx} className="mt-3 border-l-2 border-indigo-200 pl-4">
                    <p className="font-medium text-gray-900">{exp.jobTitle}</p>
                    <p className="text-sm text-indigo-600 font-medium">{exp.company}</p>
                    {exp.description && (
                      <p className="text-sm text-gray-600 mt-1 whitespace-pre-wrap">
                        {exp.description}
                      </p>
                    )}
                    <p className="text-xs text-gray-500 mt-1">
                      {exp.startDate && exp.endDate && `${exp.startDate} – ${exp.endDate}`}
                    </p>
                  </div>
                )
            )}
          </div>
        )}

      {/* Education */}
      {Array.isArray(form.education) &&
        form.education.some(edu => edu.college || edu.degree) && (
          <div className="mb-4">
            <h2 className="text-lg font-semibold text-gray-800 border-b pb-1">Education</h2>
            {form.education.map(
              (edu, idx) =>
                (edu.college || edu.degree) && (
                  <div key={idx} className="mt-3 border-l-2 border-green-200 pl-4">
                    <p className="font-medium text-gray-900">{edu.degree}</p>
                    <p className="text-sm text-green-600 font-medium">{edu.college}</p>
                    <p className="text-xs text-gray-500 mt-1">
                      {edu.startDate && edu.endDate && `${edu.startDate} – ${edu.endDate}`}
                    </p>
                  </div>
                )
            )}
          </div>
        )}

      {/* Projects */}
      {Array.isArray(form.projects) &&
        form.projects.some(proj => proj.title) && (
          <div className="mb-4">
            <h2 className="text-lg font-semibold text-gray-800 border-b pb-1">Projects</h2>
            {form.projects.map(
              (project, idx) =>
                project.title && (
                  <div key={idx} className="mt-3 border-l-2 border-purple-200 pl-4">
                    <p className="font-medium text-gray-900">{project.title}</p>
                    {project.technology && (
                      <p className="text-sm text-purple-600 font-medium">
                        Technologies: {project.technology}
                      </p>
                    )}
                    {project.description && (
                      <p className="text-sm text-gray-600 mt-1 whitespace-pre-wrap">
                        {project.description}
                      </p>
                    )}
                  </div>
                )
            )}
          </div>
        )}

      {/* Certifications */}
      {form.certifications && (
        <div className="mb-4">
          <h2 className="text-lg font-semibold text-gray-800 border-b pb-1">Certifications</h2>
          <ul className="list-disc list-inside text-sm text-gray-700 pl-4 mt-2">
            {form.certifications
              .split('\n')
              .filter(line => line.trim())
              .map((cert, i) => (
                <li key={i} className="whitespace-pre-wrap">{cert.trim()}</li>
              ))}
          </ul>
        </div>
      )}

      {/* Additional Info */}
      <div className="grid grid-cols-1 gap-2 text-sm text-gray-700 mt-4 pt-4 border-t">
        <div>Total Experience: {calculateTotalExperience()}</div>
        {form.employmentType && <div>Employment Type: {form.employmentType}</div>}
        {form.availabilityToJoin && <div>Availability: {form.availabilityToJoin}</div>}
        <div>Willing to Relocate: {form.willingToRelocate ? "Yes" : "No"}</div>
      </div>

      {/* Footer */}
      <div className="text-center ml-6 my-10">
        <h1 className="font-sans text-xl font-bold">
          HONOR <span className="text-teal-500">FREELANCE</span>
        </h1>
        <p className="text-sm text-gray-600">Power By AIZTS INFOTECH PVT LTD.</p>
      </div>
    </div>
  );
});

// Main Component
const ResumeBuilder = () => {
  const resumeRef = useRef();
  const [photo, setPhoto] = useState(null);
  const [step, setStep] = useState(1);
  const [userId, setUserId] = useState(null);
  const [loading, setLoading] = useState(true);
  const BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:4000";

  const getDefaultForm = () => ({
    name: "",
    email: "",
    mobile: "",
    phone: "",
    summary: "",
    education: [{ college: "", degree: "", startDate: "", endDate: "" }],
    experience: [{ company: "", jobTitle: "", description: "", startDate: "", endDate: "" }],
    projects: [{ title: "", technology: "", description: "" }],
    skills: "",
    linkedIn: "",
    jobTitle: "",
    totalExperience: 0,
    employmentType: "",
    availabilityToJoin: "",
    willingToRelocate: false,
    certifications: "",
  });

  const [form, setForm] = useState(getDefaultForm());

  // 🔁 Load resume from backend first, fallback to localStorage
  useEffect(() => {
    const loadResumeData = async () => {
      setLoading(true);

      try {
        // Get user ID
        const userRes = await axios.get(`${BASE_URL}/v1/user/getuser`, { withCredentials: true });
        const currentUserId = userRes.data.user?._id;
        if (currentUserId) setUserId(currentUserId);

        let formData = { ...getDefaultForm() };

        // If user is logged in, fetch resume from backend
        if (currentUserId) {
          try {
            const res = await axios.get(`${BASE_URL}/v1/resume/${currentUserId}`, { withCredentials: true });
            const resume = res.data.resume;

            if (resume) {
              console.log("Loaded from server:", resume);

              formData = {
                ...formData,
                name: resume.personalInfo?.fullName || resume.fullName || formData.name,
                email: resume.contactDetails?.email || resume.email || formData.email,
                phone: resume.contactDetails?.mobileNumber || resume.phone || formData.phone,
                mobile: formData.mobile,
                summary: resume.careerObjective || formData.summary,
                jobTitle: resume.jobTitle || formData.jobTitle,
                employmentType: resume.employmentType || formData.employmentType,
                availabilityToJoin: resume.availabilityToJoin || formData.availabilityToJoin,
                willingToRelocate: resume.willingToRelocate ?? formData.willingToRelocate,
                totalExperience: resume.totalExperience || 0,

                skills: Array.isArray(resume.skills) ? resume.skills.join(", ") : formData.skills,
                certifications: Array.isArray(resume.certifications)
                  ? resume.certifications.map(c => c.name || c).join("\n")
                  : resume.uploadedCertificates
                  ? resume.uploadedCertificates.join("\n")
                  : formData.certifications,

                education: Array.isArray(resume.educations) ? resume.educations.map(edu => ({
                  college: edu.college || "",
                  degree: edu.degree || "",
                  startDate: edu.startDate?.split('T')[0] || "",
                  endDate: edu.endDate?.split('T')[0] || "",
                })) : formData.education,

                experience: Array.isArray(resume.workExperiences) ? resume.workExperiences.map(exp => ({
                  company: exp.company || "",
                  jobTitle: exp.jobTitle || "",
                  description: exp.description || "",
                  startDate: exp.startDate?.split('T')[0] || "",
                  endDate: exp.endDate?.split('T')[0] || "",
                })) : formData.experience,

                projects: Array.isArray(resume.projects) ? resume.projects.map(proj => ({
                  title: proj.title || "",
                  technology: proj.technology || "",
                  description: proj.description || "",
                })) : formData.projects,
              };

              if (resume.personalInfo?.profilePhoto) {
                setPhoto(resume.personalInfo.profilePhoto);
              }
            }
          } catch (err) {
            console.warn("No resume found on server, will try localStorage", err);
          }
        }

        // Fallback: Load from localStorage
        try {
          const savedData = localStorage.getItem("resumeBuilderData");
          const savedPhoto = localStorage.getItem("resumeBuilderPhoto");

          if (savedData) {
            const parsed = JSON.parse(savedData);
            Object.keys(parsed).forEach(key => {
              if (typeof parsed[key] === 'string') {
                parsed[key] = sanitizeText(parsed[key]);
              }
            });
            formData = { ...formData, ...parsed };
          }
          if (savedPhoto) setPhoto(savedPhoto);
        } catch (e) {
          console.error("Failed to parse localStorage", e);
        }

        setForm(formData);
      } catch (err) {
        console.warn("User not logged in or failed to fetch user data", err);
        // Still try localStorage
        try {
          const savedData = localStorage.getItem("resumeBuilderData");
          if (savedData) {
            setForm({ ...getDefaultForm(), ...JSON.parse(savedData) });
          }
        } catch (e) { /* ignore */ }
      } finally {
        setLoading(false);
      }
    };

    loadResumeData();
  }, []);

  // Save to localStorage
  useEffect(() => {
    if (!loading) {
      try {
        localStorage.setItem("resumeBuilderData", JSON.stringify(form));
      } catch (e) {
        console.warn("Failed to save to localStorage", e);
      }
    }
  }, [form, loading]);

  useEffect(() => {
    try {
      if (photo) {
        localStorage.setItem("resumeBuilderPhoto", photo);
      } else {
        localStorage.removeItem("resumeBuilderPhoto");
      }
    } catch (e) {
      console.warn("Failed to save photo", e);
    }
  }, [photo]);

  const handleChange = (e) => {
    const { name, value, checked, type } = e.target;
    const finalValue = type === "checkbox" ? checked : value;
    setForm(prev => ({ ...prev, [name]: finalValue }));
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => setPhoto(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleDownloadPDF = () => {
    if (resumeRef.current) {
      html2pdf()
        .set({
          margin: 0.2,
          filename: `${form.name || "Resume"}_CV.pdf`,
          jsPDF: { format: "letter", orientation: "portrait" },
          html2canvas: { scale: 2 }
        })
        .from(resumeRef.current)
        .save();
    }
  };

  // Auto-calculate experience
  useEffect(() => {
    let totalYears = 0;
    form.experience.forEach(exp => {
      if (exp.startDate && exp.endDate) {
        const start = new Date(exp.startDate);
        const end = new Date(exp.endDate);
        if (!isNaN(start.getTime()) && !isNaN(end.getTime())) {
          const diffTime = Math.abs(end - start);
          const diffYears = diffTime / (1000 * 60 * 60 * 24 * 365);
          totalYears += diffYears;
        }
      }
    });
    setForm(prev => ({ ...prev, totalExperience: parseFloat(totalYears.toFixed(2)) }));
  }, [form.experience]);

  // Save resume to backend
  const saveResume = async () => {
    if (!userId) {
      alert("You must be logged in to save your resume.");
      return null;
    }

    try {
      const payload = {
        userId,
        fullName: form.name,
        email: form.email,
        phone: form.phone,
        careerObjective: form.summary,
        jobTitle: form.jobTitle,
        totalExperience: parseFloat(form.totalExperience) || 0,
        employmentType: form.employmentType,
        availabilityToJoin: form.availabilityToJoin,
        willingToRelocate: form.willingToRelocate,

        personalInfo: {
          fullName: form.name,
          profilePhoto: photo,
        },
        contactDetails: {
          email: form.email,
          mobileNumber: form.phone,
          currentAddress: "",
        },
        skills: form.skills ? form.skills.split(",").map(s => s.trim()) : [],
        workExperiences: form.experience,
        educations: form.education,
        certifications: form.certifications
          ? form.certifications.split("\n").filter(Boolean).map(c => ({ name: c.trim() }))
          : [],
        uploadedCertificates: [],
      };

      const response = await axios.post(`${BASE_URL}/v1/resume/create`, payload, {
        withCredentials: true,
      });

      console.log("Resume saved:", response.data);
      return response.data.resume;
    } catch (error) {
      console.error("Error saving resume:", error.response?.data || error.message);
      alert("Failed to save resume. Please try again.");
      return null;
    }
  };

  if (loading) return <div className="text-center p-8">Loading your data...</div>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">Professional Resume Builder</h1>
          <p className="text-gray-600">Create your professional resume in minutes</p>
        </div>

        {step === 1 && (
          <>
            <div className="grid lg:grid-cols-2 gap-6">
              <ResumeBuilderForm
                form={form}
                handleChange={handleChange}
                handlePhotoChange={handlePhotoChange}
                setForm={setForm}
              />
              <div className="max-w-4xl mx-auto bg-white p-6 rounded-xl shadow-lg">
                <ResumePreview form={form} photo={photo} />
              </div>
            </div>
            <div className="mt-6 flex justify-center">
              <button
                onClick={async () => {
                  const saved = await saveResume();
                  if (saved) {
                    alert("Resume saved successfully!");
                    setStep(2);
                  }
                }}
                className="bg-green-600 text-white px-8 py-3 rounded-lg hover:bg-green-700 transition-colors shadow-lg"
              >
                Preview & Download
              </button>
            </div>
          </>
        )}

        {step === 2 && (
          <>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-3xl font-bold text-gray-800">Resume Preview</h2>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 justify-center mt-6 mb-6">
              <Button
                onClick={handleDownloadPDF}
                className="bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition-colors shadow-lg"
              >
                📄 Download PDF
              </Button>
              <Button
                onClick={() => setStep(1)}
                className="bg-yellow-500 text-white px-6 py-3 rounded-lg hover:bg-yellow-600 transition-colors shadow-lg"
              >
                ✏️ Edit Resume
              </Button>
            </div>
            <div className="max-w-4xl mx-auto">
              <ResumePreview ref={resumeRef} form={form} photo={photo} />
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ResumeBuilder;