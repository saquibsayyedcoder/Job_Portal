import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { useNavigate, useLocation, Outlet, Link } from "react-router-dom";
import { logout, clearAllUserErros } from "@/store/slices/userSlice";
import {
  FaUsers,
  FaBriefcase,
  FaClipboardList,
  FaSignOutAlt,
  FaBars,
  FaTimes,
} from "react-icons/fa";


const AdminDashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { isAuthenticated, user, error } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    dispatch(logout());
    toast.success("Logged out successfully.");
  };

  useEffect(() => {
    if (!isAuthenticated || user?.role !== "Admin") {
      navigate("/");
    }
    if (error) {
      toast.error(error);
      dispatch(clearAllUserErros());
    }
  }, [isAuthenticated, user, error]);

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-gray-100">
      {/* Mobile Navbar */}
      <div className="md:hidden bg-white text-black w-full flex items-center justify-between p-4 shadow">
        <button onClick={() => setSidebarOpen(!sidebarOpen)} className="text-black text-2xl">
          {sidebarOpen ? <FaTimes /> : <FaBars />}
        </button>
        <h2 className="text-xl font-bold">Admin Panel</h2>
      </div>

      {/* Sidebar */}
      <aside
        className={`${
          sidebarOpen ? "block" : "hidden"
        } md:block md:w-72 bg-white sticky top-0 text-black min-h-screen p-6`}
      >
        {/* Navigation */}
        <nav className="flex flex-col space-y-4">
          <Link
            to="users"
            onClick={() => setSidebarOpen(false)}
            className={`flex items-center gap-3 px-4 py-3 rounded-lg text-left transition ${
              location.pathname.includes("users")
                ? "bg-slate-700 text-green-400"
                : "hover:bg-teal-100"
            }`}
          >
            <FaUsers /> All Users
          </Link>

          <Link
            to="jobs"
            onClick={() => setSidebarOpen(false)}
            className={`flex items-center gap-3 px-4 py-3 rounded-lg text-left transition ${
              location.pathname.includes("jobs")
                ? "bg-slate-700 text-green-400"
                : "hover:bg-teal-100"
            }`}
          >
            <FaBriefcase /> All Jobs
          </Link>

          <Link
            to="applications"
            onClick={() => setSidebarOpen(false)}
            className={`flex items-center gap-3 px-4 py-3 rounded-lg text-left transition ${
              location.pathname.includes("applications")
                ? "bg-slate-700 text-green-400"
                : "hover:bg-teal-100"
            }`}
          >
            <FaClipboardList /> All Applications
          </Link>
        </nav>

        {/* Logout */}
        <div className="pt-6 border-t border-slate-700 mt-auto">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-3 rounded-lg text-red-400 hover:bg-teal-100 transition w-full text-left"
          >
            <FaSignOutAlt /> Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-2">
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-800">
            {location.pathname.includes("users")
              ? "All Users"
              : location.pathname.includes("jobs")
              ? "All Jobs"
              : location.pathname.includes("applications")
              ? "All Applications"
              : "Admin Panel"}
          </h1>
          <p className="text-gray-600 text-sm sm:text-base">
            Welcome, <span className="font-semibold">{user?.name}</span>
          </p>
        </div>

        <div className="bg-white p-4 sm:p-6 rounded-xl shadow-md">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;