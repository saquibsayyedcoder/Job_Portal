// src/pages/ForgotPassword.jsx
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL; // e.g., http://localhost:4000/api

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    setError('');

    // 👉 Client-side validation
    if (!email) {
      setError('Please enter your email.');
      setLoading(false);
      return;
    }

    if (!/\S+@\S+\.\S+/.test(email)) {
      setError('Please enter a valid email.');
      setLoading(false);
      return;
    }

    try {
      const res = await fetch(`${API_BASE_URL}/v1/user/password/forgot`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json', // ✅ Required!
        },
        body: JSON.stringify({ email }), // ✅ Must be { email: "..." }
      });

      const data = await res.json();

      if (res.ok) {
        setMessage(data.message || 'Reset link sent to your email.');
        setEmail(''); // Clear form
      } else {
        // Backend returned error (e.g., 400)
        throw new Error(data.message || data.error || 'Failed to send reset link');
      }
    } catch (err) {
      console.error('Frontend error:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="my-10 mx-auto w-full sm:w-96 lg:w-1/2 xl:w-1/3 h-auto bg-slate-50 rounded-xl p-6 shadow-md">
      <h1 className="text-center font-bold text-2xl sm:text-3xl">
        HONOR <span className="text-teal-500">FREELANCE</span>
      </h1>
      <h2 className="text-center font-semibold py-4 text-xl">Forgot Password?</h2>
      <p className="text-center px-2 pb-6 text-sm text-gray-600">
        Enter your registered email. We'll send a password reset link.
      </p>

      {/* Success Message */}
      {message && (
        <div className="mb-4 p-3 text-green-700 bg-green-100 rounded text-sm text-center">
          {message}
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="mb-4 p-3 text-red-700 bg-red-100 rounded text-sm text-center">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="input-field px-6">
        <input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="h-12 w-full border border-gray-300 rounded-lg px-3 focus:outline-none focus:ring-2 focus:ring-green-400"
          disabled={loading}
        />
        <br />
        <Button
          type="submit"
          disabled={loading}
          className="mt-4 w-full bg-teal-500 hover:bg-teal-600 text-white"
        >
          {loading ? 'Sending...' : 'Send Reset Link'}
        </Button>
      </form>

      <p className="text-center mt-4 text-sm text-gray-500">
        Remember your password?{' '}
        <a href="/login" className="text-green-500 hover:underline">
          Log in
        </a>
      </p>
    </div>
  );
};

export default ForgotPassword;