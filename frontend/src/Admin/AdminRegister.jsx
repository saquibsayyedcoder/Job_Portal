import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { Button } from "@/components/ui/button";
import { register } from "@/store/slices/userSlice";
import { Eye, EyeOff } from "lucide-react";

const AdminRegister = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [password, setPassword] = useState("");
  const [countryCode, setCountryCode] = useState("+91");
  const [showPassword, setShowPassword] = useState(false);

  const { loading, error } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigateTo = useNavigate();

  const handleRegister = (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("role", "Admin");
    formData.append("name", name);
    formData.append("email", email);
    formData.append("phone", `${countryCode}${phone}`);
    formData.append("address", address);
    formData.append("password", password);

    dispatch(register(formData));
  };

  React.useEffect(() => {
    if (error) {
      toast.error(error);
    }
  }, [error]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="w-full max-w-4xl bg-white rounded-2xl shadow-xl overflow-hidden">
        <div className="md:flex">
          {/* Left Side - Branding */}
          <div className="md:w-2/5 bg-gradient-to-b from-indigo-600 to-purple-700 p-8 text-white flex flex-col justify-center">
            <div className="text-center">
              <h1 className="text-3xl font-bold mb-2">HONOR</h1>
              <h2 className="text-2xl font-semibold mb-6">FREELANCE</h2>
              <div className="border-t border-indigo-400 my-6"></div>
              <p className="text-indigo-100">Join our admin team</p>
              <p className="text-indigo-100 mt-2">Manage and grow your business</p>
            </div>
          </div>

          {/* Right Side - Form */}
          <div className="md:w-3/5 p-8">
            <div className="text-center mb-8">
              <h3 className="text-2xl font-bold text-gray-800">
                Admin Registration
              </h3>
              <p className="text-gray-500 mt-2">Create your admin account</p>
            </div>

            <form onSubmit={handleRegister} encType="multipart/form-data">
              {/* Name and Email - Side by side */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Full Name
                  </label>
                  <input
                    type="text"
                    placeholder="Enter Full Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={email}
                    placeholder="Enter Your Email"
                    required
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                  />
                </div>
              </div>

              {/* Phone and Address - Side by side */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phone Number
                  </label>
                  <div className="flex gap-2">
                    <select
                      value={countryCode}
                      onChange={(e) => setCountryCode(e.target.value)}
                      className="w-1/3 px-3 py-3 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition text-gray-800"
                    >
                      {[
                        { code: "+91", name: "India" },
                        { code: "+1", name: "USA" },
                        { code: "+44", name: "UK" },
                      ].map((country) => (
                        <option key={country.code} value={country.code}>
                          {country.code}
                        </option>
                      ))}
                    </select>
                    <input
                      type="tel"
                      placeholder="1234567890"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-2/3 px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition text-gray-800"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Current Address
                  </label>
                  <input
                    type="text"
                    placeholder="Enter Your Address"
                    required
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                  />
                </div>
              </div>

              {/* Password */}
              <div className="mb-8">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter Your Password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition pr-12"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-500 hover:text-gray-700"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                disabled={loading}
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-lg font-medium transition duration-300 shadow-md hover:shadow-lg disabled:opacity-70"
              >
                {loading ? "Creating Account..." : "Register Admin"}
              </Button>

              {/* Login Link */}
              <div className="text-center mt-6">
                <Link 
                  to="/admin/adminlogin" 
                  className="text-indigo-600 hover:text-indigo-800 font-medium transition"
                >
                  Already have an account? <span className="font-semibold">Login Now</span>
                </Link>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminRegister;