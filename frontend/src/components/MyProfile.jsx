import { useSelector } from "react-redux";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

// Helper function to format date as dd/mm/yy
const formatDate = (dateString) => {
  if (!dateString) return "";
  const date = new Date(dateString);
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = String(date.getFullYear()).slice(-2); // 2-digit year
  return `${day}/${month}/${year}`;
};

// Helper function to format phone number
const formatPhoneNumber = (phoneNumber) => {
  if (!phoneNumber) return "";
  const phoneStr = phoneNumber.toString().replace(/\D/g, ""); // Remove non-digits
  if (phoneStr.length <= 2) return `+${phoneStr}`;
  return `+${phoneStr.substring(0, 2)} ${phoneStr.substring(2)}`;
};

const MyProfile = () => {
  const { user } = useSelector((state) => state.user);

  // General Info Fields
  const generalFields = [
    { label: "Full Name", value: user?.name },
    { label: "Email Address", value: user?.email },
    { label: "Phone Number", value: formatPhoneNumber(user?.phone) },
    { label: "Current Address", value: user?.address },
    { label: "Role", value: user?.role },
    { label: "Joined HONOR FREELANCE", value: formatDate(user?.createdAt) },
  ];

  // Job Seeker Fields
  const jobSeekerFields = [
    { label: "Role Seeking", value: user?.roleSeeking },
    { label: "Location Preference", value: user?.locationPreference },
    { label: "Approval/Certification", value: user?.approvalCertification },
    { label: "Education/Qualification", value: user?.educationQualification },
    { label: "City", value: user?.city },
    { label: "Country", value: user?.country },
    { label: "Nationality", value: user?.nationality },
    { label: "Marital Status", value: user?.maritialStatus },
    { label: "Date Of Birth", value: formatDate(user?.dob) },
    { label: "Gender", value: user?.gender },
    { label: "Total Experience", value: user?.totalExperience },
  ];

  // Recruiter Fields
  const recruiterFields = [
    { label: "Company Name", value: user?.companyDetails?.name },
    { label: "Company Location", value: user?.companyDetails?.location },
    { label: "Type of Company", value: user?.companyDetails?.type },
  ];

  return (
   <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 py-8 px-4 sm:px-6 lg:px-8">
  <div className="max-w-6xl mx-auto">
    <Card className="shadow-xl rounded-2xl overflow-hidden border-none">
      <CardHeader className="text-center bg-gradient-to-r from-rose-100 to-sky-100 text-black pb-6">
        <CardTitle className="text-3xl sm:text-4xl font-bold">My Profile</CardTitle>
        <p className="text-gray-400 mt-1 text-sm sm:text-base">
          View your personal and professional information
        </p>
      </CardHeader>

      <CardContent className="p-6 sm:p-8 space-y-8">
        {/* General Information */}
        <section>
          <h3 className="text-xl font-semibold text-gray-800 mb-6 border-b pb-2 border-gray-200">
            Personal Information
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {generalFields.map((field, idx) => (
              <div key={idx} className="space-y-2">
                <Label
                  htmlFor={`general-${idx}`}
                  className="text-sm font-medium text-gray-700"
                >
                  {field.label}
                </Label>
                <Input
                  id={`general-${idx}`}
                  type="text"
                  defaultValue={field.value || "N/A"} // ✅ Use defaultValue
                  className="bg-gray-50 border-gray-200 text-black focus:ring-2 focus:ring-violet-500 focus:ring-offset-0 cursor-not-allowed select-text"
                />
              </div>
            ))}
          </div>
        </section>

        {/* Job Seeker Details */}
        {user?.role === "Job Seeker" && (
          <section>
            <h3 className="text-xl font-semibold text-gray-800 mb-6 border-b pb-2 border-gray-200">
              Job Seeker Details
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {jobSeekerFields.map((field, idx) => (
                <div key={idx} className="space-y-2">
                  <Label
                    htmlFor={`jobseeker-${idx}`}
                    className="text-sm font-medium text-gray-700"
                  >
                    {field.label}
                  </Label>
                  <Input
                    id={`jobseeker-${idx}`}
                    type="text"
                    defaultValue={field.value || "N/A"} // ✅ Use defaultValue
                    className="bg-gray-50 border-gray-200 text-black focus:ring-2 focus:ring-violet-500 focus:ring-offset-0 cursor-not-allowed select-text"
                  />
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Recruiter Details */}
        {user?.role === "Recruiter" && (
          <section>
            <h3 className="text-xl font-semibold text-gray-800 mb-6 border-b pb-2 border-gray-200">
              Recruiter Details
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {recruiterFields.map((field, idx) => (
                <div key={idx} className="space-y-2">
                  <Label
                    htmlFor={`recruiter-${idx}`}
                    className="text-sm font-medium text-gray-700"
                  >
                    {field.label}
                  </Label>
                  <Input
                    id={`recruiter-${idx}`}
                    type="text"
                    defaultValue={field.value || "N/A"} // ✅ Use defaultValue
                    className="bg-gray-50 border-gray-200 text-black focus:ring-2 focus:ring-violet-500 focus:ring-offset-0 cursor-not-allowed select-text"
                  />
                </div>
              ))}
            </div>
          </section>
        )}
      </CardContent>
    </Card>
  </div>
</div>
  );
};

export default MyProfile;