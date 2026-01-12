import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { GiHamburgerMenu } from "react-icons/gi";
import { Button } from "./ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@radix-ui/react-popover";
import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import { LogInIcon, LogOut, User2, UserPlusIcon } from "lucide-react";
import { clearAllUserErros, logout } from "@/store/slices/userSlice";
import { toast } from "react-toastify";


const Navbar = () => {
  const [show, setShow] = useState(false);
  const { isAuthenticated, user, error } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigateTo = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
    toast.success("Logged out successfully");
  };

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearAllUserErros());
    }
    if (!isAuthenticated) {
      navigateTo("/");
    }
  }, [isAuthenticated, user, error]);

  return (
    <>
      <nav className="   bg-white text-black p-4 z-[999] relative">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <div className="logo">
            <h1 className="text-2xl font-bold">
              HONOR <span className="text-teal-500">FREELANCE</span>
            </h1>
          </div>

          {/* Desktop Links */}
          <div className="hidden md:flex items-center space-x-8">
            <ul className="flex space-x-8">
              <li className="hover:text-teal-400 font-semibold hover:font-bold cursor-pointer text-lg">
                <Link to={"/"}>Home</Link>
              </li>
              {isAuthenticated && user?.role !== "Admin" && user?.role !== "Recruiter" &&(
                <li className="hover:text-teal-400  font-semibold hover:font-bold cursor-pointer text-lg">
                  <Link to={"/jobs"} onClick={() => setShow(false)}>
                    Jobs
                  </Link>
                </li>
              )}
              {isAuthenticated ? (
                <>
                  <li className="hover:text-teal-400  font-semibold hover:font-bold text-lg cursor-pointer">
                    <Link to={"/dashboard"}>Dashboard</Link>
                  </li>
                  {user?.role === "Admin" && (
                    <li className="hover:text-teal-400 font-semibold hover:font-bold text-lg cursor-pointer">
                      <Link to={"/admin"}>Admin</Link>
                    </li>
                  )}
                  <li className="relative">
                    <Popover>
                      <PopoverTrigger>
                        <Avatar className="cursor-pointer w-10 h-10 rounded-full bg-gray-900 text-white flex items-center justify-center text-lg font-bold">
                          <AvatarImage
                            src={user?.avatar || ""}
                            alt={user?.name}
                            className="w-full h-full object-cover rounded-full"
                          />
                          <AvatarFallback className="uppercase">
                            {user?.name?.charAt(0) || "U"}
                          </AvatarFallback>
                        </Avatar>
                      </PopoverTrigger>
                      <PopoverContent className="bg-white text-black p-4 rounded-lg shadow-lg w-48 z-[9999]">
                        <ul>
                          <li className="hover:text-green-400 cursor-pointer">
                            <Link
                              to="/dashboard"
                              className="flex items-center space-x-2"
                            >
                              <User2 className="text-gray-600" />
                              <span>Profile</span>
                            </Link>
                          </li>
                          <li className="hover:text-red-400 cursor-pointer mt-2">
                            <button
                              onClick={handleLogout}
                              className="flex items-center space-x-2"
                            >
                              <LogOut className="text-gray-600" />
                              <span>Logout</span>
                            </button>
                          </li>
                        </ul>
                      </PopoverContent>
                    </Popover>
                  </li>
                </>
              ) : (
                <>
                  <li>
                   <Link to="/login">
                    <Button className="bg-emerald-500 font-bold hover:bg-emerald-600 text-white rounded-full px-5 py-2 shadow-md transition-transform hover:scale-105">
                      Login
                    </Button>
                  </Link>
                  </li>
                  <li>
                    <Link to="/register">
                    <Button className="bg-indigo-500 hover:bg-indigo-600 font-bold text-white rounded-full px-5 py-2 shadow-md transition-transform hover:scale-105">
                      Sign Up
                    </Button>
                  </Link>
                  </li>
                </>
              )}
            </ul>
          </div>

          {/* Mobile Menu Icon */}
          <GiHamburgerMenu
            className="text-3xl cursor-pointer md:hidden"
            onClick={() => setShow(!show)}
          />
        </div>
      </nav>

      {/* Mobile Dropdown */}
    {show && (
  <div className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center p-6 md:hidden">
    <div className="bg-gray-900 text-white rounded-lg shadow-xl w-full max-w-xs animate-fadeIn">
      <div className="p-6">
        <ul className="flex flex-col space-y-4 text-center">
          {/* Home */}
          <li>
            <Link
              to="/"
              onClick={() => setShow(false)}
              className="flex items-center justify-center gap-3 px-4 py-2 rounded-md hover:bg-gray-800 transition-all"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"></path>
                <polyline points="9 22 9 12 15 12 15 22"></polyline>
              </svg>
              <span>Home</span>
            </Link>
          </li>

          {/* Jobs */}
          {isAuthenticated && user?.role !== "Admin" && user?.role !== "Recruiter" && (
            <li>
              <Link
                to="/jobs"
                onClick={() => setShow(false)}
                className="flex items-center justify-center gap-3 px-4 py-2 rounded-md hover:bg-gray-800 transition-all"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="6" width="20" height="16" rx="2"></rect>
                  <path d="M6 12h4m4 0h6"></path>
                </svg>
                <span>Jobs</span>
              </Link>
            </li>
          )}

          {/* Dashboard */}
          {isAuthenticated ? (
            <>
              <li>
                <Link
                  to="/dashboard"
                  onClick={() => setShow(false)}
                  className="flex items-center justify-center gap-3 px-4 py-2 rounded-md hover:bg-gray-800 transition-all"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect>
                    <path d="M8 21h8M12 17v4"></path>
                  </svg>
                  <span>Dashboard</span>
                </Link>
              </li>

              {/* Admin */}
              {user?.role === "Admin" && (
                <li>
                  <Link
                    to="/admin"
                    onClick={() => setShow(false)}
                    className="flex items-center justify-center gap-3 px-4 py-2 rounded-md hover:bg-gray-800 transition-all"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"></path>
                    </svg>
                    <span>Admin</span>
                  </Link>
                </li>
              )}

              {/* Profile */}
              <li>
                <Link
                  to="/dashboard"
                  onClick={() => setShow(false)}
                  className="flex items-center justify-center gap-3 px-4 py-2 rounded-md hover:bg-gray-800 transition-all"
                >
                  <User2 size={18} />
                  <span>Profile</span>
                </Link>
              </li>

              {/* Logout */}
              <li>
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center justify-center gap-3 px-4 py-2 bg-red-600 hover:bg-red-700 rounded-md transition-all"
                >
                  <LogOut size={18} />
                  <span>Logout</span>
                </button>
              </li>
            </>
          ) : (
            <>
              {/* Login */}
              <li>
                <Link
                  to="/login"
                  onClick={() => setShow(false)}
                  className="w-full flex items-center justify-center gap-3 px-4 py-2 bg-green-600 hover:bg-green-700 rounded-md transition-all"
                >
                  <LogInIcon size={18} />
                  <span>Login</span>
                </Link>
              </li>

              {/* Register */}
              <li>
                <Link
                  to="/register"
                  onClick={() => setShow(false)}
                  className="w-full flex items-center justify-center gap-3 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-md transition-all"
                >
                  <UserPlusIcon size={18} />
                  <span>Register</span>
                </Link>
              </li>
            </>
          )}
        </ul>
      </div>
    </div>
  </div>
)}
    </>
  );
};

export default Navbar;
