import React, { useEffect, useState } from 'react';
import { login } from '@/store/slices/userSlice';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { FaLock, FaEye, FaEyeSlash } from 'react-icons/fa';
import { MdOutlineMailOutline } from 'react-icons/md';
import { MdAccountCircle } from 'react-icons/md'


const AdminLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const { loading, isAuthenticated, error } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigateTo = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('role', 'Admin'); // Hardcoded role
    formData.append('email', email);
    formData.append('password', password);
    dispatch(login(formData));
  };

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearAllUserErros());
    }
    if (isAuthenticated) {
      navigateTo('/admin/dashboard'); // Redirect to admin dashboard after login
    }
  }, [dispatch, error, loading, isAuthenticated]);

  return (
    <div className="relative min-h-screen">
      <section className="relative z-10 min-h-screen flex items-center justify-center py-8">
        <div className="w-full max-w-md bg-gray-800 bg-opacity-5 p-8 rounded-2xl shadow-gray-200 shadow-xl border border-gray-600">
          

          <h3 className="text-2xl font-bold text-center text-black mb-6">Admin Login</h3>

          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="block text-sm font-semibold mb-2">Email</label>
              <div className="flex items-center border border-gray-500 rounded-lg bg-white bg-opacity-10 px-4 py-2">
                <input
                  type="email"
                  placeholder="admin@example.com"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-transparent placeholder-gray-500 focus:outline-none"
                />
                <MdOutlineMailOutline className="text-xl ml-3 text-white" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2">Password</label>
              <div className="flex items-center border border-gray-500 rounded-lg bg-white bg-opacity-10 px-4 py-2 relative">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-transparent placeholder-gray-500 focus:outline-none "
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 text-white"
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-semibold transition duration-300 disabled:bg-blue-300"
            >
              {loading ? 'Logging in...' : 'Login as Admin'}
            </button>
            <Link
          to="/admin/adminRegister"
          className="block text-center text-blue-400 hover:text-blue-300 mt-4"
        >
          Don't have an account? Register as Admin
        </Link>
          </form>
        </div>
      </section>
    </div>
  );
};

export default AdminLogin;