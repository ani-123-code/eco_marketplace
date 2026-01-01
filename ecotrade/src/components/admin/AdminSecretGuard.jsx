import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const ADMIN_SECRET = '12#$#WDDFF#$%%%####diuefcb';
const SECRET_STORAGE_KEY = 'admin_secret_verified';

// Hash function using Web Crypto API (browser native) - matches backend SHA-256
const hashSecret = async (secret) => {
  const encoder = new TextEncoder();
  const data = encoder.encode(secret);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
};

const AdminSecretGuard = ({ children }) => {
  const [secret, setSecret] = useState('');
  const [error, setError] = useState('');
  const [isVerified, setIsVerified] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if secret is already verified in session storage
    const checkVerification = async () => {
      const storedHash = sessionStorage.getItem(SECRET_STORAGE_KEY);
      if (storedHash) {
        const expectedHash = await hashSecret(ADMIN_SECRET);
        if (storedHash === expectedHash) {
          setIsVerified(true);
        } else {
          // Clear invalid stored hash
          sessionStorage.removeItem(SECRET_STORAGE_KEY);
        }
      }
    };
    checkVerification();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!secret) {
      setError('Please enter the admin secret code');
      return;
    }

    try {
      // Hash and verify the secret
      const hashedInput = await hashSecret(secret);
      const hashedSecret = await hashSecret(ADMIN_SECRET);

      if (hashedInput === hashedSecret) {
        // Store verification in session storage
        sessionStorage.setItem(SECRET_STORAGE_KEY, hashedInput);
        setIsVerified(true);
      } else {
        setError('Invalid secret code. Access denied.');
        setSecret('');
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
      console.error('Hash error:', err);
    }
  };

  // If verified, render children
  if (isVerified) {
    return children;
  }

  // Show secret code entry form
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        <div className="bg-gray-800 rounded-2xl shadow-2xl p-8 border border-gray-700">
          <div className="text-center mb-8">
            <div className="inline-block p-3 bg-red-600 rounded-full mb-4">
              <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <h1 className="text-3xl font-bold text-white mb-2">🔒 Admin Access</h1>
            <p className="text-gray-400">Enter the secret code to continue</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="secret" className="block text-sm font-medium text-gray-300 mb-2">
                Secret Code
              </label>
              <input
                id="secret"
                type="password"
                value={secret}
                onChange={(e) => setSecret(e.target.value)}
                className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-red-500 focus:border-transparent transition"
                placeholder="Enter admin secret code"
                required
                autoFocus
              />
            </div>

            {error && (
              <div className="bg-red-900/50 border border-red-700 text-red-200 px-4 py-3 rounded-lg">
                {error}
              </div>
            )}

            <button
              type="submit"
              className="w-full bg-red-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:ring-offset-gray-800 transition"
            >
              Verify & Continue
            </button>
          </form>

          <div className="mt-6 text-center">
            <button
              onClick={() => navigate('/')}
              className="text-sm text-gray-400 hover:text-gray-300 font-medium"
            >
              ← Back to Website
            </button>
          </div>
        </div>

        <p className="text-center text-xs text-gray-500 mt-6">
          🔐 This page is encrypted and protected. Authorized access only.
        </p>
      </div>
    </div>
  );
};

export default AdminSecretGuard;

