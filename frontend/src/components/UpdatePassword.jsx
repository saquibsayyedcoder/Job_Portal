import React, { useEffect, useState } from "react";
import {
  clearAllUpdateProfileErrors,
  updatePassword,
} from "@/store/slices/updateProfileSlice";
import { getUser } from "@/store/slices/userSlice";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { FaRegEyeSlash, FaEye } from "react-icons/fa";

const UpdatePassword = () => {
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const { loading, error, isUpdated } = useSelector(
    (state) => state.updateProfile
  );

  const dispatch = useDispatch();

  const handleUpdatePassword = () => {
    const formData = new FormData();
    formData.append("oldPassword", oldPassword);
    formData.append("newPassword", newPassword);
    formData.append("confirmPassword", confirmPassword);
    dispatch(updatePassword(formData));
  };

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearAllUpdateProfileErrors());
    }
    if (isUpdated) {
      toast.success("Password Updated");
      dispatch(getUser());
      dispatch(clearAllUpdateProfileErrors());
    }
  }, [dispatch, loading, error, isUpdated]);

  return (
    <div className="account_components update_password_component max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
    <h3 className="text-xl font-semibold mb-6 text-center">Update Password</h3>
  
    {/* Current Password */}
    <div className="mb-4">
      <label className="block text-sm font-medium text-gray-700">Current Password</label>
      <div className="relative">
        <input
          type={showPassword ? "text" : "password"}
          value={oldPassword}
          onChange={(e) => setOldPassword(e.target.value)}
          className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        {showPassword ? (
          <FaRegEyeSlash
            className="absolute top-3 right-3 cursor-pointer text-gray-600"
            onClick={() => setShowPassword(!showPassword)}
          />
        ) : (
          <FaEye
            className="absolute top-3 right-3 cursor-pointer text-gray-600"
            onClick={() => setShowPassword(!showPassword)}
          />
        )}
      </div>
    </div>
  
    {/* New Password */}
    <div className="mb-4">
      <label className="block text-sm font-medium text-gray-700">New Password</label>
      <div className="relative">
        <input
          type={showPassword ? "text" : "password"}
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        {showPassword ? (
          <FaRegEyeSlash
            className="absolute top-3 right-3 cursor-pointer text-gray-600"
            onClick={() => setShowPassword(!showPassword)}
          />
        ) : (
          <FaEye
            className="absolute top-3 right-3 cursor-pointer text-gray-600"
            onClick={() => setShowPassword(!showPassword)}
          />
        )}
      </div>
    </div>
  
    {/* Confirm Password */}
    <div className="mb-6">
      <label className="block text-sm font-medium text-gray-700">Confirm Password</label>
      <div className="relative">
        <input
          type={showPassword ? "text" : "password"}
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        {showPassword ? (
          <FaRegEyeSlash
            className="absolute top-3 right-3 cursor-pointer text-gray-600"
            onClick={() => setShowPassword(!showPassword)}
          />
        ) : (
          <FaEye
            className="absolute top-3 right-3 cursor-pointer text-gray-600"
            onClick={() => setShowPassword(!showPassword)}
          />
        )}
      </div>
    </div>
  
    {/* Update Button */}
    <div className="save_change_btn_wrapper text-center">
      <button
        className="w-full bg-blue-500 hover:bg-blue-600 text-white font-medium py-3 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
        onClick={handleUpdatePassword}
        disabled={loading}
      >
        {loading ? 'Updating...' : 'Update Password'}
      </button>
    </div>
  </div>
  
  
  );
};

export default UpdatePassword;
