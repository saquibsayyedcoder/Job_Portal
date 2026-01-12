import React, { useEffect } from "react";
import Home from "./pages/Home";
import Jobs from "./pages/Jobs";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import NotFound from "./pages/NotFound";
import Register from "./pages/Register";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import PostApplication from "./pages/PostApplication";
import Footer from "./components/Footer";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useDispatch } from "react-redux";
import { getUser } from "./store/slices/userSlice";
import ForgetPassword from "./pages/ForgotPassword";
import Admin from "./Admin/Admin";
import AdminLogin from "./Admin/AdminLogin";
import AdminRegister from "./Admin/AdminRegister";
import ResumeBuilder from "./components/ResumeBuilder";
import MyProfile from "./components/MyProfile";
import UpdateProfile from "./components/UpdateProfile";
import UpdatePassword from "./components/UpdatePassword";
import JobPost from "./components/JobPost";
import MyJobs from "./components/MyJobs";
import Applications from "./components/Applications";
import MyApplications from "./components/MyApplications";
import AllUser from "./Admin/AllUser";
import AllJobs from "./Admin/AllJobs";
import AllApplications from "./Admin/AllApplication";
import ResetPasswordPage from "./pages/ResetPassword";

const App = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getUser());
  }, []);
  
  return (
    <>
      <Router>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/jobs" element={<Jobs />} />
          <Route path="/dashboard" element={<Dashboard />}>
            <Route index element={<MyProfile />} />
            <Route path="update-profile" element={<UpdateProfile />} />
            <Route path="update-password" element={<UpdatePassword />} />
            <Route path="job-post" element={<JobPost />} />
            <Route path="my-jobs" element={<MyJobs />} />
            <Route path="applications" element={<Applications />} />
            <Route path="my-applications" element={<MyApplications />} />
            <Route path="resume-builder" element={<ResumeBuilder />} />
          </Route>
          <Route path="/login" element={<Login />} />
          <Route path="/forgetpassword" element={<ForgetPassword />} />
          <Route path="/resetpassword" element={<ResetPasswordPage />} />

          <Route path="*" element={<NotFound />} />
          <Route path="/register" element={<Register />} />
          <Route
            path="/post/application/:jobId"
            element={<PostApplication />}
          />
          <Route path="/admin" element={<Admin />}>
            <Route index element={<AllUser />} />{" "}
            {/* Default: /admin -> /admin/users */}
            <Route path="users" element={<AllUser />} />
            <Route path="jobs" element={<AllJobs />} />
            <Route path="applications" element={<AllApplications />} />
          </Route>
          <Route path="/admin/adminlogin" element={<AdminLogin />} />
          <Route path="/admin/adminRegister" element={<AdminRegister />} />
          <Route path="/resume-builder" element={<ResumeBuilder />} />
        </Routes>
        <Footer />
        <ToastContainer
          position="top-left"
          theme="light"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
        />
      </Router>
    </>
  );
};

export default App;
