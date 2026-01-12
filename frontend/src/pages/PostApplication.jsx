// PostApplication.jsx
import React, { useEffect, useState } from "react";
import {
  clearAllApplicationErrors,
  postApplication,
  resetApplicationSlice,
} from "@/store/slices/applicationSlice";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { fetchSingleJob } from "@/store/slices/jobSlice";
import { IoMdCash } from "react-icons/io";
import { FaToolbox, FaUser, FaEnvelope, FaPhone, FaFileAlt } from "react-icons/fa";
import { FaLocationDot } from "react-icons/fa6";
import { Link } from "react-router-dom";

const PostApplication = () => {
  const { singleJob } = useSelector((state) => state.jobs);
  const { isAuthenticated, user } = useSelector((state) => state.user);
  const { loading, error, message } = useSelector((state) => state.applications);
  const { jobId } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [coverLetter, setCoverLetter] = useState("");
  const [resume, setResume] = useState(null);
  const [resumePreview, setResumePreview] = useState("");

  // Generic parser for string content (supports " .", ",", or newline)
  const parseContent = (content) => {
    if (Array.isArray(content)) return content;
    if (typeof content !== 'string') return [];
    return content
      .split(/ \.|,|\n/g) // Handle multiple delimiters
      .map(item => item.trim())
      .filter(Boolean);
  };

  // Extract job details safely
  const qualifications = parseContent(singleJob?.qualifications);
  const responsibilities = parseContent(singleJob?.responsibilities);
  const requiredSkills = parseContent(singleJob?.requiredSkill);

  // Handle offers
  const offeredBenefits = [];
  if (singleJob?.offers?.accommodation) offeredBenefits.push("Accommodation Provided");
  if (singleJob?.offers?.food) offeredBenefits.push("Food Provided");
  if (singleJob?.offers?.travel) offeredBenefits.push("Travel Covered");

  // Resume handler
  const resumeHandler = (e) => {
    const file = e.target.files[0];
    if (file) {
      setResume(file);
      setResumePreview(URL.createObjectURL(file));
    }
  };

  // Form submission
  const handlePostApplications = (e) => {
    e.preventDefault();

    if (!name || !email || !phone || !address || !coverLetter) {
      toast.error("All fields are required.");
      return;
    }

    if (!jobId) {
      toast.error("Job ID is missing.");
      return;
    }

    const formData = new FormData();
    formData.append("name", name);
    formData.append("email", email);
    formData.append("phone", phone);
    formData.append("address", address);
    formData.append("coverLetter", coverLetter);
    if (resume) {
      formData.append("resume", resume);
    }

    dispatch(postApplication({ formData, jobId }));
  };

  // Populate user data and fetch job
  useEffect(() => {
    if (user) {
      setName(user.name || "");
      setEmail(user.email || "");
      setPhone(user.phone || "");
      setAddress(user.address || "");
      setCoverLetter(user.coverLetter || "");
      setResumePreview(user.resume?.url || "");
    }

    if (error) {
      toast.error(error);
      dispatch(clearAllApplicationErrors());
    }

    if (message) {
      toast.success(message);
      if (message.toLowerCase().includes("application submitted")) {
        setTimeout(() => navigate("/jobs"), 2000);
      }
      dispatch(resetApplicationSlice());
    }

    dispatch(fetchSingleJob(jobId));
  }, [dispatch, error, message, jobId, user, navigate]);

  return (
    <section className="bg-gray-50 min-h-screen py-8 px-4">
      <div className="max-w-7xl mx-auto bg-white shadow-xl rounded-lg overflow-hidden">
        
        {/* Top: Candidate Info */}
        {isAuthenticated && user?.role === "Job Seeker" && (
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 border-b">
            <h2 className="text-xl font-bold text-gray-800 mb-3 flex items-center">
              <FaUser className="mr-2 text-blue-600" /> Your Information
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
              <div className="flex items-center space-x-2 text-gray-700">
                <FaUser /> <span><strong>Name:</strong> {name}</span>
              </div>
              <div className="flex items-center space-x-2 text-gray-700">
                <FaEnvelope /> <span><strong>Email:</strong> {email}</span>
              </div>
              <div className="flex items-center space-x-2 text-gray-700">
                <FaPhone /> <span><strong>Phone:</strong> {phone}</span>
              </div>
              <div className="flex items-center space-x-2 text-gray-700">
                <FaFileAlt /> <span><strong>Location:</strong> {address || "Not set"}</span>
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-8">
          
          {/* Left: Application Form */}
          <div className="space-y-8">
            <h3 className="text-3xl font-bold text-gray-800">Apply for This Job</h3>

            <form onSubmit={handlePostApplications} className="space-y-6">
              
              {/* Cover Letter */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Cover Letter
                </label>
                <textarea
                  value={coverLetter}
                  onChange={(e) => setCoverLetter(e.target.value)}
                  rows="5"
                  className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  placeholder="Tell us why you're a great fit for this role..."
                />
              </div>

              {/* Resume Upload */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Upload Resume (PDF or DOCX)
                </label>
                <div className="mt-1 flex items-center space-x-4">
                  <label className="cursor-pointer w-full">
                    <div className="flex items-center justify-center px-4 py-3 border border-dashed border-gray-400 rounded-md hover:bg-gray-50 transition">
                      <span className="text-gray-600">
                        {resume ? `Selected: ${resume.name}` : "Choose a file..."}
                      </span>
                    </div>
                    <input
                      type="file"
                      accept=".pdf,.doc,.docx"
                      onChange={resumeHandler}
                      className="hidden"
                    />
                  </label>
                </div>
                {resumePreview && (
                  <a
                    href={resumePreview}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-500 underline text-sm inline-block mt-1"
                  >
                    Preview Resume
                  </a>
                )}
              </div>z

              {/* Submit Button */}
              {!isAuthenticated ? (
                <div className="flex justify-end mt-6">
                  <Link
                    to="/register"
                    className="px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-semibold rounded-md hover:from-green-600 hover:to-emerald-700 focus:outline-none"
                  >
                    Create Account to Apply
                  </Link>
                </div>
              ) : user?.role === "Job Seeker" ? (
                <div className="flex justify-end mt-6">
                  <button
                    type="submit"
                    className="px-6 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-semibold rounded-md hover:from-blue-600 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-60"
                    disabled={loading}
                  >
                    {loading ? "Submitting..." : "Submit Application"}
                  </button>
                </div>
              ) : (
                <p className="text-red-500">Only Job Seekers can apply.</p>
              )}
            </form>
          </div>

          {/* Right: Job Details */}
          <div className="space-y-6">
            <header className="bg-blue-50 p-6 rounded-lg shadow-sm">
              <h3 className="text-2xl font-bold text-gray-800">
                {singleJob?.title || "Loading..."}
              </h3>
              <p className="text-green-600 font-semibold text-lg mt-1">{singleJob?.salary}/yr</p>
              {singleJob?.personalWebsite && (
                <Link
                  to={singleJob.personalWebsite.url}
                  target="_blank"
                  className="text-blue-600 hover:underline text-sm"
                >
                  {singleJob.personalWebsite.title}
                </Link>
              )}
            </header>

            {/* Job Info Badges */}
           {singleJob?.salary !== undefined && singleJob?.salary !== null && singleJob?.salary !== "" && (
  <div className="flex items-center space-x-3 text-gray-700">
    <IoMdCash className="text-green-500" size={20} />
    <span>
      <strong>Salary:</strong>{" "}
      {singleJob.salary}/year
    </span>
  </div>
)}

            {/* Job Details */}
            <div className="border-t pt-6 space-y-6">
              <section>
                <h4 className="text-lg font-semibold text-gray-800 mb-2">Introduction</h4>
                <p className="text-gray-700 leading-relaxed">{singleJob?.introduction}</p>
              </section>

              {qualifications.length > 0 && (
                <section>
                  <h4 className="text-lg font-semibold text-gray-800 mb-2">Qualifications</h4>
                  <ul className="list-disc pl-5 space-y-1 text-gray-700 ml-2">
                    {qualifications.map((q, i) => (
                      <li key={i} className="text-sm">{q}</li>
                    ))}
                  </ul>
                </section>
              )}

              {responsibilities.length > 0 && (
                <section>
                  <h4 className="text-lg font-semibold text-gray-800 mb-2">Responsibilities</h4>
                  <ul className="list-disc pl-5 space-y-1 text-gray-700 ml-2">
                    {responsibilities.map((r, i) => (
                      <li key={i} className="text-sm">{r}</li>
                    ))}
                  </ul>
                </section>
              )}

              {requiredSkills.length > 0 && (
                <section>
                  <h4 className="text-lg font-semibold text-gray-800 mb-2">Required Skills</h4>
                  <ul className="list-disc pl-5 space-y-1 text-gray-700 ml-2">
                    {requiredSkills.map((skill, i) => (
                      <li key={i} className="text-sm">{skill}</li>
                    ))}
                  </ul>
                </section>
              )}

              {offeredBenefits.length > 0 && (
                <section>
                  <h4 className="text-lg font-semibold text-gray-800 mb-2">We Offer</h4>
                  <ul className="list-disc pl-5 space-y-1 text-gray-700 ml-2">
                    {offeredBenefits.map((benefit, i) => (
                      <li key={i} className="text-sm">{benefit}</li>
                    ))}
                  </ul>
                </section>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PostApplication;