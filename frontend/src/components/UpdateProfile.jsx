import {
  clearAllUpdateProfileErrors,
  updateProfile,
} from "@/store/slices/updateProfileSlice";
import { getUser } from "@/store/slices/userSlice";
import React, { useEffect, useState } from "react";
import { use } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { totalExperienceOptions } from "@/Constants/FormOptions";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;
const UpdateProfile = () => {
  const { user } = useSelector((state) => state.user);
  const { loading, error, isUpdated } = useSelector(
    (state) => state.updateProfile
  );
  const dispatch = useDispatch();
  const navigateTo = useNavigate();

  // Job Seeker Fields
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [coverLetter, setCoverLetter] = useState("");
  const [roleSeeking, setRoleSeeking] = useState("");
  const [locationPreference, setLocationPreference] = useState("");
  const [approvalCertification, setApprovalCertification] = useState("");
  const [educationQualification, setEducationQualification] = useState("");
  const [dob, setDob] = useState("");
  const [gender, setGender] = useState("");
  const [nationality, setNationality] = useState("");
  const [maritialStatus, setMaritialStatus] = useState("");
  const [country, setCountry] = useState("");
  const [city, setCity] = useState("");
  const [totalExperience, setTotalExperience] = useState("");
  const [resume, setResume] = useState(null);
  const [resumePreview, setResumePreview] = useState("");

  // Recruiter Fields
  const [companyType, setCompanyType] = useState("");
  const [registrationNumber, setRegistrationNumber] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [companyLocation, setCompanyLocation] = useState("");

 
  useEffect(() => {
    if (user) {
      setName(user.name || "");
      setEmail(user.email || "");
      setPhone(user.phone || "");
      setAddress(user.address || "");
      setCoverLetter(user.coverLetter || "");
      setRoleSeeking(user.roleSeeking || "");
      setLocationPreference(user.locationPreference || "");
      setApprovalCertification(user.approvalCertification || "");
      setEducationQualification(user.educationQualification || "");
      setDob(user.dob || "");
      setGender(user.gender || "");
      setNationality(user.nationality || "");
      setMaritialStatus(user.maritialStatus || "");
      setCountry(user.country || "");
      setCity(user.city || "");
      setTotalExperience(user.totalExperience || "");
      setResumePreview(user.resume || "");

      console.log("Resume URL:", user.resume);

      setCompanyType(user.companyType || "");
      setRegistrationNumber(user.registrationNumber || "");
      setCompanyName(user.companyName || "");
      setCompanyLocation(user.companyLocation || "");
    }
  }, [user]);

  const handleUpdateProfile = () => {
    const formData = new FormData();
    formData.append("name", name);
    formData.append("email", email);
    formData.append("phone", phone);
    formData.append("address", address);

    if (user && user.role === "Job Seeker") {
      formData.append("roleSeeking", roleSeeking);
      formData.append("locationPreference", locationPreference);
      formData.append("approvalCertification", approvalCertification);
      formData.append("educationQualification", educationQualification);
      formData.append("dob", dob);
      formData.append("gender", gender);
      formData.append("nationality", nationality);
      formData.append("maritialStatus", maritialStatus);
      formData.append("country", country);
      formData.append("city", city);
      formData.append("totalExperience", totalExperience);
      formData.append("coverLetter", coverLetter);
    }

    if (user && user.role === "Recruiter") {
      formData.append("companyType", companyType);
      formData.append("registrationNumber", registrationNumber);
      formData.append("companyName", companyName);
      formData.append("companyLocation", companyLocation);
    }

    if (resume) {
      formData.append("resume", resume);
    }

    dispatch(updateProfile(formData));
  };

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearAllUpdateProfileErrors());
    }
    if (isUpdated) {
      toast.success("Profile Updated.");
      dispatch(getUser());
      dispatch(clearAllUpdateProfileErrors());
    }
  }, [dispatch, error, isUpdated]);

  // After selecting new resume
  const resumeHandler = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setResume(file);
    setResumePreview(URL.createObjectURL(file)); // Works for PDF/doc preview links
  };

  const formatDateForDisplay = (isoString) => {
    if (!isoString) return "";
    const date = new Date(isoString);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  return (
 <div className="max-w-4xl mx-auto p-6 sm:p-8 bg-white rounded-xl shadow-lg">
  <h3 className="text-2xl font-bold text-gray-800 mb-6">Update Profile</h3>
  <div className="space-y-6">
    {/* Full Name - Letters & Spaces Only */}
    <div>
      <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
        Full Name
      </label>
      <input
        type="text"
        id="name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        onInput={(e) => {
          // Allow only letters and spaces
          const value = e.target.value;
          if (!/^[A-Za-z\s]*$/.test(value)) {
            e.target.value = value.replace(/[^A-Za-z\s]/g, "");
          }
        }}
        pattern="[A-Za-z\s]+"
        title="Name must contain only letters and spaces"
        required
        className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-gray-50 transition duration-200 ${
          name && !/^[A-Za-z\s]+$/.test(name.trim())
            ? "border-red-500"
            : name
            ? "border-green-500"
            : "border-gray-300"
        }`}
      />
      {name && !/^[A-Za-z\s]+$/.test(name.trim()) && (
        <p className="text-red-500 text-xs mt-1">Name can only contain letters and spaces.</p>
      )}
    </div>

    {/* Email Address */}
    <div>
      <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
        Email Address
      </label>
      <input
        type="email"
        id="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
        className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-gray-50 transition duration-200 ${
          email && !/\S+@\S+\.\S+/.test(email) ? "border-red-500" : email ? "border-green-500" : "border-gray-300"
        }`}
      />
      {email && !/\S+@\S+\.\S+/.test(email) && (
        <p className="text-red-500 text-xs mt-1">Enter a valid email address.</p>
      )}
    </div>

    {/* Phone Number with Country Code */}
    <div>
      <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
        Phone Number
      </label>
      <div className="flex items-center space-x-2">
        <input
          type="number"
          id="phone"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          onInput={(e) => {
            let value = e.target.value.replace(/[^0-9]/g, ""); // Remove non-digits
            if (value.length > 10) value = value.slice(0, 10); // Max 10 digits
            e.target.value = value;
            setPhone(value);
          }}
          placeholder="9876543210"
          className={`w-full px-4 py-3 border rounded-r-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-gray-50 transition duration-200 ${
            phone && phone.length < 10 ? "border-red-500" : phone ? "border-green-500" : "border-gray-300"
          }`}
        />
      </div>
      {phone && phone.length < 10 && (
        <p className="text-red-500 text-xs mt-1">Phone must be 10 digits.</p>
      )}
    </div>

    {/* Address */}
    <div>
      <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">
        Current Address
      </label>
      <input
        type="text"
        id="address"
        value={address || ""}
        onChange={(e) => setAddress(e.target.value)}
        required
        className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-gray-50 transition duration-200 ${
          !address?.trim() ? "border-red-500" : "border-gray-300"
        }`}
      />
      {!address?.trim() && (
        <p className="text-red-500 text-xs mt-1">Address is required.</p>
      )}
    </div>

    {/* Job Seeker Fields */}
    {user && user.role === "Job Seeker" && (
      <>
        {/* Role Seeking */}
        <div>
          <label htmlFor="roleSeeking" className="block text-sm font-medium text-gray-700 mb-1">
            Role Seeking
          </label>
          <input
            type="text"
            id="roleSeeking"
            value={roleSeeking || ""}
            onChange={(e) => setRoleSeeking(e.target.value)}
            onInput={(e) => {
              const value = e.target.value;
              if (!/^[A-Za-z\s]*$/.test(value)) {
                e.target.value = value.replace(/[^A-Za-z\s]/g, "");
              }
            }}
            pattern="[A-Za-z\s]+"
            className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-gray-50 transition duration-200 ${
              roleSeeking && !/^[A-Za-z\s]+$/.test(roleSeeking.trim())
                ? "border-red-500"
                : roleSeeking
                ? "border-green-500"
                : "border-gray-300"
            }`}
          />
          {roleSeeking && !/^[A-Za-z\s]+$/.test(roleSeeking.trim()) && (
            <p className="text-red-500 text-xs mt-1">Only letters and spaces allowed.</p>
          )}
        </div>

        {/* Location Preference */}
        <div>
          <label htmlFor="locationPreference" className="block text-sm font-medium text-gray-700 mb-1">
            Job Location/Preference
          </label>
          <input
            type="text"
            id="locationPreference"
            value={locationPreference || ""}
            onChange={(e) => setLocationPreference(e.target.value)}
            onInput={(e) => {
              const value = e.target.value;
              if (!/^[A-Za-z\s,.-]*$/.test(value)) {
                e.target.value = value.replace(/[^A-Za-z\s,.-]/g, "");
              }
            }}
            className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-gray-50 transition duration-200 ${
              locationPreference && !/^[A-Za-z\s,.-]+$/.test(locationPreference.trim())
                ? "border-red-500"
                : locationPreference
                ? "border-green-500"
                : "border-gray-300"
            }`}
          />
          {locationPreference && !/^[A-Za-z\s,.-]+$/.test(locationPreference.trim()) && (
            <p className="text-red-500 text-xs mt-1">Only letters, spaces, commas, and periods allowed.</p>
          )}
        </div>

        {/* Education/Qualification */}
        <div>
          <label htmlFor="educationQualification" className="block text-sm font-medium text-gray-700 mb-1">
            Education/Qualification
          </label>
          <input
            type="text"
            id="educationQualification"
            value={educationQualification || ""}
            onChange={(e) => setEducationQualification(e.target.value)}
            onInput={(e) => {
              const value = e.target.value;
              if (!/^[A-Za-z\s&()]*$/.test(value)) {
                e.target.value = value.replace(/[^A-Za-z\s&()]/g, "");
              }
            }}
            className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-gray-50 transition duration-200 ${
              educationQualification && !/^[A-Za-z\s&()]+$/.test(educationQualification.trim())
                ? "border-red-500"
                : educationQualification
                ? "border-green-500"
                : "border-gray-300"
            }`}
          />
          {educationQualification && !/^[A-Za-z\s&()]+$/.test(educationQualification.trim()) && (
            <p className="text-red-500 text-xs mt-1">Only letters, spaces, and symbols like &() allowed.</p>
          )}
        </div>

        {/* City, Country */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-1">
              City
            </label>
            <input
              type="text"
              id="city"
              value={city || ""}
              onChange={(e) => setCity(e.target.value)}
              onInput={(e) => {
                const value = e.target.value;
                if (!/^[A-Za-z\s]*$/.test(value)) {
                  e.target.value = value.replace(/[^A-Za-z\s]/g, "");
                }
              }}
              className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-gray-50 transition duration-200 ${
                city && !/^[A-Za-z\s]+$/.test(city.trim()) ? "border-red-500" : city ? "border-green-500" : "border-gray-300"
              }`}
            />
            {city && !/^[A-Za-z\s]+$/.test(city.trim()) && (
              <p className="text-red-500 text-xs mt-1">City must contain only letters and spaces.</p>
            )}
          </div>
          <div>
            <label htmlFor="country" className="block text-sm font-medium text-gray-700 mb-1">
              Country
            </label>
            <input
              type="text"
              id="country"
              value={country || ""}
              onChange={(e) => setCountry(e.target.value)}
              onInput={(e) => {
                const value = e.target.value;
                if (!/^[A-Za-z\s]*$/.test(value)) {
                  e.target.value = value.replace(/[^A-Za-z\s]/g, "");
                }
              }}
              className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-gray-50 transition duration-200 ${
                country && !/^[A-Za-z\s]+$/.test(country.trim())
                  ? "border-red-500"
                  : country
                  ? "border-green-500"
                  : "border-gray-300"
              }`}
            />
            {country && !/^[A-Za-z\s]+$/.test(country.trim()) && (
              <p className="text-red-500 text-xs mt-1">Country must contain only letters and spaces.</p>
            )}
          </div>
        </div>

        {/* Gender, Nationality, Marital Status */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label htmlFor="gender" className="block text-sm font-medium text-gray-700 mb-1">
              Gender
            </label>
            <input
              type="text"
              id="gender"
              value={gender || ""}
              onChange={(e) => setGender(e.target.value)}
              onInput={(e) => {
                const value = e.target.value;
                if (!/^[A-Za-z\s]*$/.test(value)) {
                  e.target.value = value.replace(/[^A-Za-z\s]/g, "");
                }
              }}
              className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-gray-50 transition duration-200 ${
                gender && !/^[A-Za-z\s]+$/.test(gender.trim())
                  ? "border-red-500"
                  : gender
                  ? "border-green-500"
                  : "border-gray-300"
              }`}
            />
            {gender && !/^[A-Za-z\s]+$/.test(gender.trim()) && (
              <p className="text-red-500 text-xs mt-1">Only letters and spaces allowed.</p>
            )}
          </div>
          <div>
            <label htmlFor="nationality" className="block text-sm font-medium text-gray-700 mb-1">
              Nationality
            </label>
            <input
              type="text"
              id="nationality"
              value={nationality || ""}
              onChange={(e) => setNationality(e.target.value)}
              onInput={(e) => {
                const value = e.target.value;
                if (!/^[A-Za-z\s]*$/.test(value)) {
                  e.target.value = value.replace(/[^A-Za-z\s]/g, "");
                }
              }}
              className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-gray-50 transition duration-200 ${
                nationality && !/^[A-Za-z\s]+$/.test(nationality.trim())
                  ? "border-red-500"
                  : nationality
                  ? "border-green-500"
                  : "border-gray-300"
              }`}
            />
            {nationality && !/^[A-Za-z\s]+$/.test(nationality.trim()) && (
              <p className="text-red-500 text-xs mt-1">Only letters and spaces allowed.</p>
            )}
          </div>
          <div>
            <label htmlFor="maritialStatus" className="block text-sm font-medium text-gray-700 mb-1">
              Marital Status
            </label>
            <input
              type="text"
              id="maritialStatus"
              value={maritialStatus || ""}
              onChange={(e) => setMaritialStatus(e.target.value)}
              onInput={(e) => {
                const value = e.target.value;
                if (!/^[A-Za-z\s]*$/.test(value)) {
                  e.target.value = value.replace(/[^A-Za-z\s]/g, "");
                }
              }}
              className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-gray-50 transition duration-200 ${
                maritialStatus && !/^[A-Za-z\s]+$/.test(maritialStatus.trim())
                  ? "border-red-500"
                  : maritialStatus
                  ? "border-green-500"
                  : "border-gray-300"
              }`}
            />
            {maritialStatus && !/^[A-Za-z\s]+$/.test(maritialStatus.trim()) && (
              <p className="text-red-500 text-xs mt-1">Only letters and spaces allowed.</p>
            )}
          </div>
        </div>

        {/* Total Experience */}
        <div>
          <label htmlFor="totalExperience" className="block text-sm font-medium text-gray-700 mb-1">
            Total Experience
          </label>
          <select
            id="totalExperience"
            value={totalExperience}
            onChange={(e) => setTotalExperience(e.target.value)}
            className={`w-full px-4 py-3 border rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition duration-200 ${
              !totalExperience ? "border-red-500" : "border-gray-300"
            }`}
          >
            <option value="">Select</option>
            {totalExperienceOptions.map((te) => (
              <option key={te} value={te}>
                {te}
              </option>
            ))}
          </select>
          {!totalExperience && (
            <p className="text-red-500 text-xs mt-1">Please select experience.</p>
          )}
        </div>

        {/* Cover Letter */}
        <div>
          <label htmlFor="coverLetter" className="block text-sm font-medium text-gray-700 mb-1">
            Cover Letter
          </label>
          <textarea
            id="coverLetter"
            value={coverLetter || ""}
            onChange={(e) => setCoverLetter(e.target.value)}
            rows={4}
            className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-gray-50 transition duration-200 ${
              !coverLetter?.trim() ? "border-red-500" : "border-gray-300"
            }`}
          />
          {!coverLetter?.trim() && (
            <p className="text-red-500 text-xs mt-1">Cover letter is required.</p>
          )}
        </div>

        {/* Upload Resume */}
        <div>
          <label htmlFor="resume" className="block text-sm font-medium text-gray-700 mb-1">
            Upload Resume
          </label>
          <input
            type="file"
            id="resume"
            onChange={resumeHandler}
            accept=".pdf,.doc,.docx"
            className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-gray-50 transition duration-200 ${
              !resume && !resumePreview ? "border-red-500" : "border-gray-300"
            }`}
          />
          {!resume && !resumePreview && (
            <p className="text-red-500 text-xs mt-1">Resume is required.</p>
          )}
          {resumePreview && (
            <div className="mt-2">
              <a
                href={
                  resumePreview.startsWith("http")
                    ? resumePreview
                    : `${BASE_URL}${resumePreview}`
                }
                target="_blank"
                rel="noopener noreferrer"
                className="text-indigo-600 hover:text-indigo-800 underline"
              >
                View Resume
              </a>
            </div>
          )}
        </div>
      </>
    )}

    {/* Recruiter Fields */}
    {user && user.role === "Recruiter" && (
      <>
        <div>
          <label htmlFor="companyName" className="block text-sm font-medium text-gray-700 mb-1">
            Company Name
          </label>
          <input
            type="text"
            id="companyName"
            value={companyName || ""}
            onChange={(e) => setCompanyName(e.target.value)}
            required
            className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-gray-50 transition duration-200 ${
              !companyName?.trim() ? "border-red-500" : "border-gray-300"
            }`}
          />
          {!companyName?.trim() && (
            <p className="text-red-500 text-xs mt-1">Company name is required.</p>
          )}
        </div>

        <div>
          <label htmlFor="companyType" className="block text-sm font-medium text-gray-700 mb-1">
            Type of Company
          </label>
          <input
            type="text"
            id="companyType"
            value={companyType || ""}
            onChange={(e) => setCompanyType(e.target.value)}
            required
            className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-gray-50 transition duration-200 ${
              !companyType?.trim() ? "border-red-500" : "border-gray-300"
            }`}
          />
          {!companyType?.trim() && (
            <p className="text-red-500 text-xs mt-1">Type of company is required.</p>
          )}
        </div>

        <div>
          <label htmlFor="companyLocation" className="block text-sm font-medium text-gray-700 mb-1">
            Company Location
          </label>
          <input
            type="text"
            id="companyLocation"
            value={companyLocation || ""}
            onChange={(e) => setCompanyLocation(e.target.value)}
            required
            className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-gray-50 transition duration-200 ${
              !companyLocation?.trim() ? "border-red-500" : "border-gray-300"
            }`}
          />
          {!companyLocation?.trim() && (
            <p className="text-red-500 text-xs mt-1">Company location is required.</p>
          )}
        </div>
      </>
    )}

    {/* Save Button */}
    <div className="pt-4">
      <button
        onClick={handleUpdateProfile}
        disabled={loading}
        className="w-full sm:w-auto px-6 py-3 bg-indigo-600 text-white font-semibold rounded-lg shadow-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition duration-200"
      >
        {loading ? "Saving..." : "Save Changes"}
      </button>
    </div>
  </div>
</div>
  );
};

export default UpdateProfile;
