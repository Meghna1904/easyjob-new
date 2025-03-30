// src/pages/auth/forgot-password.tsx
import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const ForgotPasswordPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (!email) {
      setError('Email address is required');
      return;
    }
    
    // Here you would call an API to handle the password reset
    console.log('Password reset requested for:', email);
    setSubmitted(true);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
        <h2 className="text-2xl font-bold mb-6 text-center">Reset Your Password</h2>
        
        {submitted ? (
          <div className="text-center">
            <div className="mb-4 p-3 bg-green-100 text-green-700 rounded">
              Password reset instructions have been sent to your email address.
            </div>
            <p className="mt-4">
              <Link to="/login" className="text-blue-600 hover:underline">
                Return to login
              </Link>
            </p>
          </div>
        ) : (
          <>
            {error && <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">{error}</div>}
            
            <p className="mb-4 text-gray-600">
              Enter your email address and we'll send you instructions to reset your password.
            </p>
            
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter your email address"
                />
              </div>
              
              <button 
                type="submit"
                className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
              >
                Send Reset Link
              </button>
            </form>
            
            <p className="mt-4 text-center text-sm text-gray-600">
              <Link to="/login" className="text-blue-600 hover:underline">
                Back to login
              </Link>
            </p>
          </>
        )}
      </div>
    </div>
  );
};

export default ForgotPasswordPage;