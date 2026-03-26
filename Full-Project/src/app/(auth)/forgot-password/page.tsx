'use client';

import { useState } from 'react';
import Link from 'next/link';
import { validateEmail } from '@/lib/validation';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email) {
      setError('Email is required');
      return;
    }
    if (!validateEmail(email)) {
      setError('Please enter a valid email address');
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      // Always show success regardless of response
      setIsSubmitted(true);
    } catch (err) {
      setIsSubmitted(true); // Still show success for security
    } finally {
      setIsLoading(false);
    }
  };

  if (isSubmitted) {
    return (
      <div className="w-full max-w-md mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-[#1a1d23] mb-2">Check Your Email</h1>
          <p className="text-gray-600 text-sm">تحقق من بريدك الإلكتروني</p>
        </div>

        <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
          <div className="flex items-start gap-3">
            <svg className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <div>
              <p className="text-green-800 text-sm font-medium">Reset link sent</p>
              <p className="text-green-700 text-sm mt-1">
                If an account exists with <strong>{email}</strong>, you will receive a password reset link shortly.
              </p>
            </div>
          </div>
        </div>

        <p className="text-gray-600 text-sm mb-6">
          Did not receive the email? Check your spam folder or try again with a different email address.
        </p>

        <div className="space-y-3">
          <button
            onClick={() => { setIsSubmitted(false); setEmail(''); }}
            className="w-full border-2 border-gray-300 hover:border-gray-400 text-gray-700 font-medium py-3 rounded-lg transition"
          >
            Try Another Email
          </button>
          <Link
            href="/login"
            className="block w-full text-center bg-[#c41e3a] hover:bg-[#a01830] text-white font-semibold py-3 rounded-lg transition"
          >
            Back to Sign In
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-[#1a1d23] mb-1">Forgot Password</h1>
        <h2 className="text-lg font-semibold text-[#1a1d23] mb-2">نسيت كلمة المرور</h2>
        <p className="text-gray-600 text-sm">
          Enter your email address and we will send you a link to reset your password.
        </p>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block text-gray-700 font-medium text-sm mb-2">
            Email Address
            <span className="text-[#c41e3a] ml-1">*</span>
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => { setEmail(e.target.value); setError(''); }}
            placeholder="you@example.com"
            className={`w-full px-4 py-3 border rounded-lg bg-white text-gray-900 placeholder-gray-400 transition focus:outline-none ${
              error
                ? 'border-[#c41e3a] focus:border-[#c41e3a] focus:ring-1 focus:ring-[#c41e3a]'
                : 'border-gray-300 focus:border-[#c41e3a] focus:ring-1 focus:ring-[#c41e3a]'
            }`}
          />
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-[#c41e3a] hover:bg-[#a01830] disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold py-3 rounded-lg transition flex items-center justify-center gap-2"
        >
          {isLoading ? (
            <>
              <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              Sending...
            </>
          ) : (
            'Send Reset Link'
          )}
        </button>
      </form>

      <div className="mt-8 text-center">
        <Link
          href="/login"
          className="text-sm text-[#c41e3a] hover:text-[#a01830] font-medium transition"
        >
          ← Back to Sign In
        </Link>
      </div>
    </div>
  );
}
