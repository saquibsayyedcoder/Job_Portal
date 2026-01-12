import React, { useEffect, useState } from "react";
import { clearAllUserErros, register } from "@/store/slices/userSlice"; // Adjust path if needed
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Eye, EyeOff } from "lucide-react";
import { Label } from "@/components/ui/label"; // Adjust path if needed
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select"; // Adjust path if needed
import { Button } from "@/components/ui/button"; // Adjust path if needed
import JobSeekerForm from "./JobSeekerForm";
import RecruiterForm from "./RecruiterForm"; // Import the new component
import { CountryCodes } from "@/Constants/FormOptions";

const Register = () => {
  const dispatch = useDispatch();
  const navigateTo = useNavigate();
  const { loading, isAuthenticated, error, message } = useSelector(
    (state) => state.user
  );

  const [isReloaded, setIsReloaded] = useState(false);

  // Load saved data if available (from failed submission)
  const getSavedData = (key, fallback = "") =>
    localStorage.getItem(`failedRegistration_${key}`) || fallback;

  // Helper to safely get array from localStorage
  const getSavedArray = (key) => {
    const savedData = getSavedData(key);
    if (!savedData) return [];
    try {
      const parsed = JSON.parse(savedData);
      return Array.isArray(parsed) ? parsed : [];
    } catch (e) {
      console.error(`Error parsing saved data for key ${key}:`, e);
      return [];
    }
  };

  // --- Shared State ---
  const [role, setRole] = useState(getSavedData("role"));
  const [name, setName] = useState(getSavedData("name"));
  const [email, setEmail] = useState(getSavedData("email"));
  const [phone, setPhone] = useState(getSavedData("phone"));
  const [address, setAddress] = useState(getSavedData("address"));
  const [password, setPassword] = useState(getSavedData("password"));
  const [countryCode, setCountryCode] = useState(
    getSavedData("countryCode", "+91")
  );
  const [showPassword, setShowPassword] = useState(false);

  // --- Job Seeker State ---
  const [dob, setDob] = useState(getSavedData("dob"));
  const [gender, setGender] = useState(getSavedData("gender"));
  const [nationality, setNationality] = useState(getSavedData("nationality"));
  const [maritialStatus, setMaritialStatus] = useState(
    getSavedData("maritialStatus")
  );
  const [country, setCountry] = useState(getSavedData("country"));
  const [city, setCity] = useState(getSavedData("city"));
  const [coverLetter, setCoverLetter] = useState(getSavedData("coverLetter"));
  const [resume, setResume] = useState(null); // File objects not serializable
  const [roleSeeking, setRoleSeeking] = useState(getSavedData("roleSeeking"));
  const [locationPreference, setLocationPreference] = useState(
    getSavedData("locationPreference")
  );
  const [approvalCertification, setApprovalCertification] = useState(() =>
    getSavedArray("approvalCertification")
  ); // Robust initialization
  const [educationQualification, setEducationQualification] = useState(
    getSavedData("educationQualification")
  );
  const [totalExperience, setTotalExperience] = useState(
    getSavedData("totalExperience")
  );

  // --- Recruiter State ---
  const [companyType, setCompanyType] = useState(getSavedData("companyType"));
  const [companyName, setCompanyName] = useState(getSavedData("companyName"));
  const [companyLocation, setCompanyLocation] = useState(
    getSavedData("companyLocation")
  );

  const resumeHandler = (e) => {
    const file = e.target.files[0];
    setResume(file);
  };

  // Detect manual reload
  useEffect(() => {
    const performance = window.performance;
    const isReload =
      performance.navigation?.type === PerformanceNavigation.TYPE_RELOAD ||
      performance.getEntriesByType("navigation")?.[0]?.type === "reload";

    if (isReload) {
      // Clear failed registration data
      [
        "role",
        "name",
        "email",
        "phone",
        "address",
        "password",
        "dob",
        "gender",
        "nationality",
        "maritialStatus",
        "country",
        "city",
        "coverLetter",
        "roleSeeking",
        "locationPreference",
        "approvalCertification",
        "educationQualification",
        "totalExperience",
        "companyType",
        "companyName",
        "companyLocation",
        "countryCode",
      ].forEach((key) => localStorage.removeItem(`failedRegistration_${key}`));
    }
    setIsReloaded(isReload);
  }, []);

  const handleRegister = (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("role", role);
    formData.append("name", name);
    formData.append("email", email);
    formData.append("phone", `${countryCode}${phone}`);
    formData.append("address", address);
    formData.append("password", password);

    if (role === "Job Seeker") {
      formData.append("roleSeeking", roleSeeking);
      formData.append("locationPreference", locationPreference);
      // Append certifications as a JSON string
      formData.append(
        "approvalCertification",
        JSON.stringify(approvalCertification)
      );
      formData.append("coverLetter", coverLetter);
      formData.append("resume", resume);
      formData.append("educationQualification", educationQualification);
      formData.append("country", country);
      formData.append("city", city);
      formData.append("dob", dob);
      formData.append("gender", gender);
      formData.append("nationality", nationality);
      formData.append("maritialStatus", maritialStatus);
      formData.append("totalExperience", totalExperience);
    }

    if (role === "Recruiter") {
      formData.append("companyName", companyName);
      formData.append("companyLocation", companyLocation);
      formData.append("companyType", companyType);
    }

    // Save current state to localStorage for recovery if needed
    const saveFailedData = () => {
      localStorage.setItem(`failedRegistration_role`, role);
      localStorage.setItem(`failedRegistration_name`, name);
      localStorage.setItem(`failedRegistration_email`, email);
      localStorage.setItem(`failedRegistration_phone`, phone);
      localStorage.setItem(`failedRegistration_address`, address);
      localStorage.setItem(`failedRegistration_password`, password);
      localStorage.setItem(`failedRegistration_countryCode`, countryCode);
      localStorage.setItem(`failedRegistration_roleSeeking`, roleSeeking);
      localStorage.setItem(
        `failedRegistration_locationPreference`,
        locationPreference
      );
      // Save certifications as a JSON string
      localStorage.setItem(
        `failedRegistration_approvalCertification`,
        JSON.stringify(approvalCertification)
      );
      localStorage.setItem(
        `failedRegistration_educationQualification`,
        educationQualification
      );
      localStorage.setItem(
        `failedRegistration_totalExperience`,
        totalExperience
      );
      localStorage.setItem(`failedRegistration_companyType`, companyType);
      localStorage.setItem(`failedRegistration_companyName`, companyName);
      localStorage.setItem(
        `failedRegistration_companyLocation`,
        companyLocation
      );
      localStorage.setItem(`failedRegistration_dob`, dob);
      localStorage.setItem(`failedRegistration_gender`, gender);
      localStorage.setItem(`failedRegistration_nationality`, nationality);
      localStorage.setItem(`failedRegistration_maritialStatus`, maritialStatus);
      localStorage.setItem(`failedRegistration_country`, country);
      localStorage.setItem(`failedRegistration_city`, city);
      localStorage.setItem(`failedRegistration_coverLetter`, coverLetter);
      // Note: resume file object cannot be easily saved to localStorage
    };

    saveFailedData(); // Save before submitting
    dispatch(register(formData));
  };

  // Handle registration result
  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearAllUserErros());
    }
    if (isAuthenticated) {
      // Clear saved failed data
      [
        "role",
        "name",
        "email",
        "phone",
        "address",
        "password",
        "dob",
        "gender",
        "nationality",
        "maritialStatus",
        "country",
        "city",
        "coverLetter",
        "roleSeeking",
        "locationPreference",
        "approvalCertification",
        "educationQualification",
        "totalExperience",
        "companyType",
        "companyName",
        "companyLocation",
        "countryCode",
      ].forEach((key) => localStorage.removeItem(`failedRegistration_${key}`));
      navigateTo("/");
    }
  }, [dispatch, error, isAuthenticated, navigateTo]);

  return (
    <div className="relative">
      <section className="authPage bg-sky-100 py-8 px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="container mx-auto max-w-4xl bg-white p-6 rounded-lg shadow-gray-400 shadow-lg">
          <div className="text-center mb-6">
            <h3 className="text-2xl font-semibold text-black">
              HONOR <span className="text-teal-400 font-bold"> FREELANCE</span>{" "}
              <br />
              create a new account
            </h3>
          </div>

          {/* State for validation errors */}
          {error && (
            <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">
              {error}
            </div>
          )}

          <form onSubmit={handleRegister} encType="multipart/form-data">
            {/* --- Shared Fields --- */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
              <div className="w-full px-4 py-2 sm:px-0">
                <Label
                  htmlFor="role-select"
                  className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                  Register As
                </Label>
                <Select value={role} onValueChange={(val) => setRole(val)}>
                  <SelectTrigger
                    id="role-select"
                    className={`w-full rounded-md ${
                      !role ? "border-red-500" : "border-gray-300"
                    } bg-white px-4 py-2 text-left shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-800 dark:text-white sm:text-sm`}
                  >
                    <SelectValue placeholder="Select Role" />
                  </SelectTrigger>
                  <SelectContent className="z-50 min-w-[90vw] rounded-md bg-white p-2 shadow-lg ring-1 ring-black ring-opacity-5 dark:bg-gray-800 dark:text-white sm:min-w-[200px]">
                    <SelectItem
                      value="Recruiter"
                      className="cursor-pointer select-none rounded px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700"
                    >
                      Register as Recruiter
                    </SelectItem>
                    <SelectItem
                      value="Job Seeker"
                      className="cursor-pointer select-none rounded px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700"
                    >
                      Register as Job Seeker
                    </SelectItem>
                  </SelectContent>
                </Select>
                {!role && (
                  <p className="text-red-500 text-xs mt-1">Role is required</p>
                )}
              </div>

            <div>
  <label className="text-sm text-black">
    {role === "Job Seeker"
      ? "Name"
      : role === "Recruiter"
      ? "Contact Name"
      : "Name"}
  </label>
<input
  type="text"
  placeholder="Enter Name"
  value={name}
  onChange={(e) => {
    const value = e.target.value;
    // Allow only letters and spaces, up to 100 characters
    if (/^[a-zA-Z\s]*$/.test(value) && value.length <= 100) {
      setName(value);
    }
  }}
  maxLength={100} // Ensures browser enforces limit
  className={`w-full p-3 bg-transparent border rounded ${
    name && !/^[a-zA-Z\s]+$/.test(name)
      ? "border-red-500"
      : "border-gray-300"
  }`}
/>
{ name && !/^[a-zA-Z\s]+$/.test(name) && (
  <p className="text-red-500 text-xs mt-1">
    Name should contain only letters and spaces.
  </p>
)}
  {/* Optionally show required message only if submitted? Or skip it entirely */}
</div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
  <div>
    <label className="text-sm">Email</label>
    <input
      type="email"
      value={email}
      placeholder="Enter Your Email"
      onChange={(e) => setEmail(e.target.value)}
      className={`w-full p-3 bg-transparent border rounded ${
        email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
          ? "border-red-500"
          : "border-gray-300"
      }`}
    />
    {email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) && (
      <p className="text-red-500 text-xs mt-1">
        Please enter a valid email address
      </p>
    )}
  </div>

  <div>
    <label className="text-sm text-black">
      {role === "Job Seeker"
        ? "Phone"
        : role === "Recruiter"
        ? "Contact Number"
        : "Phone Number"}
    </label>
    <div className="flex gap-2">
      <select
        value={countryCode}
        onChange={(e) => setCountryCode(e.target.value)}
        className="w-1/3 p-3 bg-transparent border border-gray-300 rounded text-black focus:ring-2 focus:ring-blue-500 focus:outline-none"
      >
        {CountryCodes.map((country) => (
          <option key={country.code} value={country.code}>
            {country.name} ({country.code})
          </option>
        ))}
      </select>
      <input
        type="tel"
        placeholder="1234567890"
        value={phone}
        onChange={(e) => {
          const value = e.target.value;
          if (/^\d{0,10}$/.test(value)) {
            setPhone(value);
          }
        }}
        className={`w-2/3 p-3 bg-transparent border rounded ${
          phone && !/^\d{10}$/.test(phone)
            ? "border-red-500"
            : "border-gray-300"
        }`}
        maxLength="15"
      />
    </div>
    {phone && !/^\d{10}$/.test(phone) && (
      <p className="text-red-500 text-xs mt-1">
        Phone number must be exactly 10 digits
      </p>
    )}
  </div>
</div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
  {/* Current Address */}
  <div>
    <label className="text-sm">Current Address</label>
    <input
      type="text"
      placeholder="Enter Your Address"
      value={address}
      onChange={(e) => setAddress(e.target.value)}
      className={`w-full p-3 bg-transparent border rounded ${
        address && !address ? "border-red-500" : "border-gray-300"
      }`}
    />
    {address && !address && (
      <p className="text-red-500 text-xs mt-1">Address is required</p>
    )}
  </div>

  {/* Password */}
  <div className="relative">
    <label className="text-sm">Password</label>
    <input
      type={showPassword ? "text" : "password"}
      placeholder="Enter Your Password"
      value={password}
      onChange={(e) => setPassword(e.target.value)}
      className={`w-full p-3 bg-transparent border rounded outline-none ${
        password && password.length < 8 ? "border-red-500" : "border-gray-300"
      }`}
    />
    <button
      type="button"
      onClick={() => setShowPassword(!showPassword)}
      className="absolute right-3 top-9 text-gray-500 hover:text-gray-700"
      aria-label={showPassword ? "Hide password" : "Show password"}
    >
      {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
    </button>
    {password && password.length < 8 && (
      <p className="text-red-500 text-xs mt-1">
        Password must be at least 8 characters
      </p>
    )}
  </div>
</div>
            {/* --- End Shared Fields --- */}

            {/* --- Conditional Rendering based on Role --- */}
            {role === "Job Seeker" && (
              <JobSeekerForm
                // Pass all Job Seeker related props
                name={name}
                setName={setName}
                nationality={nationality}
                setNationality={setNationality}
                maritialStatus={maritialStatus}
                setMaritialStatus={setMaritialStatus}
                dob={dob}
                setDob={setDob}
                gender={gender}
                setGender={setGender}
                roleSeeking={roleSeeking}
                setRoleSeeking={setRoleSeeking}
                locationPreference={locationPreference}
                setLocationPreference={setLocationPreference}
                approvalCertification={approvalCertification}
                setApprovalCertification={setApprovalCertification}
                educationQualification={educationQualification}
                setEducationQualification={setEducationQualification}
                city={city}
                setCity={setCity}
                country={country}
                setCountry={setCountry}
                totalExperience={totalExperience}
                setTotalExperience={setTotalExperience}
                coverLetter={coverLetter}
                setCoverLetter={setCoverLetter}
                resume={resume}
                setResume={setResume}
                countryCode={countryCode}
                setCountryCode={setCountryCode}
                resumeHandler={resumeHandler}
              />
            )}

            {role === "Recruiter" && (
              <RecruiterForm
                // Pass all Recruiter related props
                companyName={companyName}
                setCompanyName={setCompanyName}
                companyLocation={companyLocation}
                setCompanyLocation={setCompanyLocation}
                companyType={companyType}
                setCompanyType={setCompanyType}
              />
            )}
            {/* --- End Conditional Rendering --- */}

            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-black hover:bg-black text-white py-3 rounded-lg"
            >
              {loading ? "Signing Up..." : "Sign Up"}
            </Button>
            <div className="text-center mt-4">
              <Link to="/login" className="hover:font-bold">
                Login Now
              </Link>
            </div>
          </form>
        </div>
      </section>
    </div>
  );
};

export default Register;

// const Register = () => {
//   const [role, setRole] = useState("");
//   const [name, setName] = useState("");
//   const [email, setEmail] = useState("");
//   const [phone, setPhone] = useState("");
//   const [address, setAddress] = useState("");
//   const [password, setPassword] = useState("");
//   const [dob, setDob] = useState("");
//   const [gender, setGender] = useState("");
//   const [nationality, setNationality] = useState("");
//   const [maritialStatus, setMaritialStatus] = useState("");
//   const [country, setCountry] = useState("");
//   const [city, setCity] = useState("");

//   const [coverLetter, setCoverLetter] = useState("");
//   const [resume, setResume] = useState(null);

//   const [roleSeeking, setRoleSeeking] = useState("");
//   const [locationPreference, setLocationPreference] = useState("");
//   const [approvalCertification, setApprovalCertification] = useState("");
//   const [educationQualification, setEducationQualification] = useState("");
//   // const [jobCardCertificate, setJobCardCertificate] = useState("");
//   // const [currentJobTitle, setCurrentJobTitle] = useState("");
//   // const [currentJobDuration, setCurrentJobDuration] = useState("");
//   const [totalExperience, setTotalExperience] = useState("");

//   const [companyType, setCompanyType] = useState("");
//   const [companyName, setCompanyName] = useState(""); // ✅ correct
//   const [companyLocation, setCompanyLocation] = useState("");
//   const [countryCode, setCountryCode] = useState("+91");
//   const [showPassword, setShowPassword] = useState(false);
//   const [showCertDropdown, setShowCertDropdown] = useState(false);
//   const resumeHandler = (e) => {
//     const file = e.target.files[0];
//     setResume(file);
//   };

//   const { loading, isAuthenticated, error, message } = useSelector(
//     (state) => state.user
//   );
//   const dispatch = useDispatch();
//   const navigateTo = useNavigate();

//   const handleRegister = (e) => {
//     e.preventDefault();
//     const formData = new FormData();
//     formData.append("role", role);
//     formData.append("name", name);
//     formData.append("email", email);
//     formData.append("phone", `${countryCode}${phone}`);
//     formData.append("address", address);
//     formData.append("password", password);

//     if (role === "Job Seeker") {
//       formData.append("roleSeeking", roleSeeking);
//       formData.append("locationPreference", locationPreference);
//       formData.append(
//         "approvalCertification",
//         approvalCertification.join(", ")
//       );

//       formData.append("coverLetter", coverLetter);
//       formData.append("resume", resume);
//       formData.append("educationQualification", educationQualification);
//       formData.append("country", country);
//       formData.append("city", city);
//       formData.append("dob", dob);
//       formData.append("gender", gender);
//       formData.append("nationality", nationality);
//       formData.append("maritialStatus", maritialStatus);
//       formData.append("totalExperience", totalExperience);
//     }

//     if (role === "Recruiter") {
//       formData.append("companyName", companyName);
//       formData.append("companyLocation", companyLocation);
//       formData.append("companyType", companyType);
//     }

//     dispatch(register(formData));
//   };

//   useEffect(() => {
//     if (error) {
//       toast.error(error);
//       dispatch(clearAllUserErros());
//     }
//     if (isAuthenticated) {
//       navigateTo("/");
//     }
//   }, [dispatch, error, loading, isAuthenticated, message]);
