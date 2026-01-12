// src/pages/ResetPasswordPage.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const ResetPasswordPage = () => {
  const { token } = useParams(); // Get token from URL
  const navigate = useNavigate();

  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [passwordStrength, setPasswordStrength] = useState('');

  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

  // Password strength checker
  useEffect(() => {
    if (newPassword.length === 0) {
      setPasswordStrength('');
    } else if (newPassword.length < 8) {
      setPasswordStrength('Too short');
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!$@%])./.test(newPassword)) {
      setPasswordStrength('Weak - Use upper, lower, number & symbol');
    } else {
      setPasswordStrength('Strong');
    }
  }, [newPassword]);

  const isPasswordValid = passwordStrength === 'Strong';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    if (newPassword !== confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    if (!isPasswordValid) {
      setError('Please choose a stronger password');
      setLoading(false);
      return;
    }

    try {
      const res = await fetch(`${API_BASE_URL}/user/password/reset/${token}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ newPassword, confirmPassword }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Invalid or expired token');
      }

      setSuccess('Password reset successful!');
      setTimeout(() => {
        navigate('/login'); // Redirect to login after success
      }, 2000);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="my-10 mx-auto w-full sm:w-96 lg:w-1/2 xl:w-1/3 h-auto bg-slate-50 rounded-xl p-6 shadow-md">
      <h1 className="text-center font-bold text-2xl sm:text-3xl">
        JOB <span className="text-green-500">DEKHO</span>
      </h1>
      <h2 className="text-center font-semibold py-4 text-xl">Set New Password</h2>

      <p className="text-center px-2 pb-6 text-sm text-gray-600">
        Your password must be at least 8 characters and include uppercase, lowercase, number, and special character (!$@%).
      </p>

      {success ? (
        <div className="mb-6 p-4 text-green-700 bg-green-100 rounded text-center">
          {success} Redirecting to login...
        </div>
      ) : (
        <>
          {error && (
            <div className="mb-4 p-3 text-red-700 bg-red-100 rounded text-sm text-center">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="input-field px-6">
            <input
              type="password"
              placeholder="Enter new password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className={`h-12 w-full border px-3 rounded-lg focus:outline-none focus:ring-2 mb-2 ${
                passwordStrength === 'Strong'
                  ? 'border-green-500 focus:ring-green-400'
                  : passwordStrength ? 'border-red-500 focus:ring-red-400' : 'border-gray-300'
              }`}
              required
            />
            {passwordStrength && (
              <p
                className={`text-xs mb-3 ${
                  passwordStrength === 'Strong' ? 'text-green-600' : 'text-red-600'
                }`}
              >
                Password: {passwordStrength}
              </p>
            )}

            <input
              type="password"
              placeholder="Confirm new password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="h-12 w-full border border-gray-300 rounded-lg px-3 focus:outline-none focus:ring-2 focus:ring-green-400 mb-4"
              required
            />

            <Button
              type="submit"
              disabled={loading || !isPasswordValid}
              className="mt-2 w-full bg-green-500 hover:bg-green-600 text-white"
            >
              {loading ? 'Resetting...' : 'Reset Password'}
            </Button>
          </form>
        </>
      )}

      <p className="text-center mt-6 text-sm text-gray-500">
        Remembered your password?{' '}
        <a href="/login" className="text-green-500 hover:underline">
          Back to Login
        </a>
      </p>
    </div>
  );
};

export default ResetPasswordPage;