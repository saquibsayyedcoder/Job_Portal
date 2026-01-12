import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { clearAllUserErros, login } from "@/store/slices/userSlice";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { FaRegUser, FaEye, FaEyeSlash } from "react-icons/fa";
import { MdOutlineMailOutline } from "react-icons/md";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useForm } from "react-hook-form";

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, isAuthenticated, error } = useSelector((state) => state.user);

  // Initialize React Hook Form
  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    setValue,
    trigger,
  } = useForm({
    mode: "onChange", // Validate on change
    defaultValues: {
      role: "",
      email: "",
      password: "",
    },
  });

  const [showPassword, setShowPassword] = useState(false);

  // Handle form submission
  const onSubmit = (data) => {
    const formData = new FormData();
    formData.append("role", data.role);
    formData.append("email", data.email);
    formData.append("password", data.password);
    dispatch(login(formData));
  };

  // Handle Select change via setValue + trigger validation
  const handleRoleChange = (value) => {
    setValue("role", value);
    trigger("role"); // Trigger validation for role
  };

  // Show toast on error
  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearAllUserErros());
    }

    if (isAuthenticated) {
      navigate("/");
    }
  }, [error, isAuthenticated, dispatch, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 py-10">
      <Card className="w-full max-w-4xl grid grid-cols-1 lg:grid-cols-2 overflow-hidden shadow-xl rounded-2xl">
        
        {/* Left Side - Welcome Message with Background Image */}
        <div
          className="hidden lg:flex relative h-full min-h-[30rem]"
          style={{
            backgroundImage: `url('/img/bg5.jpg')`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-br from-black/70 via-purple-900/40 to-transparent"></div>
          <div className="relative z-10 flex flex-col justify-center items-center text-center text-white p-8 space-y-6 w-full">
            <h2 className="text-3xl md:text-4xl font-bold leading-tight">
              Honor Freelance
            </h2>
            <p className="text-lg md:text-xl max-w-md leading-relaxed">
              Welcome to the future of freelance hiring. Connect, collaborate, and create with the best professionals. 🚀
            </p>
          </div>
        </div>

        {/* Right Side - Login Form */}
        <CardContent className="p-8 sm:p-10 flex flex-col justify-center">
          <CardHeader className="mb-6 text-center pb-0">
            <CardTitle className="text-2xl font-semibold text-gray-800">Login to Your Account</CardTitle>
          </CardHeader>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Role Selection */}
            <div>
              <Label className="mb-1 block">Login As</Label>
              <Select
                onValueChange={handleRoleChange}
                value={undefined} // Controlled by React Hook Form via setValue
              >
                <SelectTrigger
                  className={errors.role ? "border-red-500" : ""}
                >
                  <SelectValue placeholder="Select Role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Recruiter">Login as Recruiter</SelectItem>
                  <SelectItem value="Job Seeker">Login as Job Seeker</SelectItem>
                </SelectContent>
              </Select>
              {errors.role && (
                <p className="mt-1 text-sm text-red-600">{errors.role.message}</p>
              )}
            </div>

            {/* Email */}
            <div>
              <Label className="mb-1 block">Email</Label>
              <div className="relative">
                <Input
                  type="email"
                  placeholder="youremail@gmail.com"
                  {...register("email", {
                    required: "Email is required",
                    pattern: {
                      value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                      message: "Please enter a valid email address",
                    },
                  })}
                  className={errors.email ? "border-red-500" : ""}
                />
                <MdOutlineMailOutline className="absolute top-1/2 right-3 transform -translate-y-1/2 text-xl text-gray-400 pointer-events-none" />
              </div>
              {errors.email && (
                <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
              )}
            </div>

            {/* Password */}
            <div>
              <Label className="mb-1 block">Password</Label>
              <div className="relative">
                <Input
                  type={showPassword ? "text" : "password"}
                  placeholder="Your Password"
                  {...register("password", {
                    required: "Password is required",
                    minLength: {
                      value: 6,
                      message: "Password must be at least 6 characters",
                    },
                  })}
                  className={errors.password ? "border-red-500" : ""}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute top-1/2 right-3 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition"
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
              {errors.password && (
                <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>
              )}
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={loading || !isValid}
              className="w-full bg-indigo-600 hover:bg-indigo-700"
            >
              {loading ? "Logging in..." : "Login"}
            </Button>

            {/* Extra Links */}
            <div className="text-center text-sm text-gray-600 space-y-1 mt-4">
              <p>
                Don’t have an account?{" "}
                <Link to="/register" className="text-indigo-600 hover:underline font-medium">
                  Sign Up
                </Link>
              </p>
              <p>
                <Link to="/forgetpassword" className="text-indigo-600 hover:underline font-medium">
                  Forgot password?
                </Link>
              </p>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default Login;