// src/pages/Dashboard.jsx
import React from "react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logout, clearAllUserErros } from "@/store/slices/userSlice";
import { toast } from "react-toastify";
import { useEffect, useState } from "react";
import {
  FaUser,
  FaEdit,
  FaKey,
  FaPlusCircle,
  FaBriefcase,
  FaClipboardList,
  FaSignOutAlt,
  FaFileAlt,
  FaArrowRight,
} from "react-icons/fa";
import { Link } from "react-router-dom";

const Dashboard = () => {
  const { user, error, isAuthenticated } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearAllUserErros());
    }
    if (!isAuthenticated) {
      navigate("/");
    }
  }, [error, isAuthenticated]);

  return (
    <section className="min-h-screen bg-gray-50 grid lg:grid-cols-[16rem_1fr]">
      {/* Sidebar */}
      <div
        className={`z-40 fixed top-0 left-0 h-full w-64 bg-white shadow-lg text-black p-6 transition-transform duration-300 ease-in-out transform ${
          show ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0 lg:static`}
      >
        <h4 className="text-xl font-bold text-gray-800 mb-10 border-b pb-4">
          {user?.name}
        </h4>

        <ul className="space-y-4 text-sm">
          <li>
            <Link
              to="/dashboard"
              className={`w-full text-left flex items-center gap-2 hover:text-green-500 ${
                location.pathname === "/dashboard" ? "text-green-600 font-semibold" : ""
              }`}
            >
              <FaUser className="text-green-500" /> My Profile
            </Link>
          </li>

          <li>
            <Link
              to="/dashboard/update-profile"
              className="w-full text-left flex items-center gap-2 hover:text-blue-500"
            >
              <FaEdit className="text-blue-500" /> Update Profile
            </Link>
          </li>

          <li>
            <Link
              to="/dashboard/update-password"
              className="w-full text-left flex items-center gap-2 hover:text-orange-500"
            >
              <FaKey className="text-orange-500" /> Update Password
            </Link>
          </li>

          {user?.role === "Recruiter" && (
            <>
              <li>
                <Link
                  to="/dashboard/job-post"
                  className="w-full text-left flex items-center gap-2 hover:text-yellow-500"
                >
                  <FaPlusCircle className="text-yellow-500" /> Post New Job
                </Link>
              </li>
              <li>
                <Link
                  to="/dashboard/my-jobs"
                  className="w-full text-left flex items-center gap-2 hover:text-indigo-500"
                >
                  <FaBriefcase className="text-indigo-500" /> My Jobs
                </Link>
              </li>
              <li>
                <Link
                  to="/dashboard/applications"
                  className="w-full text-left flex items-center gap-2 hover:text-rose-500"
                >
                  <FaClipboardList className="text-rose-500" /> Applications
                </Link>
              </li>
            </>
          )}

          {user?.role === "Job Seeker" && (
            <>
              <li>
                <Link
                  to="/dashboard/my-applications"
                  className="w-full text-left flex items-center gap-2 hover:text-cyan-500"
                >
                  <FaFileAlt className="text-cyan-500" /> My Applications
                </Link>
              </li>
              <li>
                <Link
                  to="/dashboard/resume-builder"
                  className="w-full text-left flex items-center gap-2 hover:text-indigo-500"
                >
                  <FaFileAlt className="text-indigo-500" /> Resume Builder
                </Link>
              </li>
            </>
          )}

          <li>
            <button
              onClick={() => {
                dispatch(logout());
                toast.success("Logged Out Successfully.");
              }}
              className="w-full text-left flex items-center gap-2 hover:text-red-500"
            >
              <FaSignOutAlt className="text-red-500" /> Logout
            </button>
          </li>
        </ul>
      </div>

      {/* Main Content */}
      <div className="bg-gray-100 min-h-screen p-4 lg:p-8">
        <div className="lg:hidden flex justify-between items-center mb-4">
          <p className="text-lg font-semibold text-gray-700">
            Welcome, <span className="font-bold">{user?.name}</span>
          </p>
          <button
            onClick={() => setShow(!show)}
            className="p-2 rounded-full bg-black text-white"
          >
            <FaArrowRight
              className={`transition-transform ${show ? "rotate-180" : ""}`}
            />
          </button>
        </div>

        <h1 className="text-2xl font-bold text-gray-800 mb-6">Dashboard</h1>

        <Outlet />
      </div>
    </section>
  );
};

export default Dashboard;
