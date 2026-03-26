'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { validatePassword, isPasswordStrong } from '@/lib/validation';

export default function ResetPasswordPage() {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  const [accessToken, setAccessToken] = useState('');

  // Extract access_token from URL hash on mount
  useEffect(() => {
    const hash = window.location.hash.substring(1);
    const params = new URLSearchParams(hash);
    const token = params.get('access_token');
    if (token) {
      setAccessToken(token);
    }
  }, []);

  const passwordChecks = validatePassword(password);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!accessToken) {
      setError('Invalid or expired reset link. Please request a new one.');
      return;
    }

    if (!password) {
      setError('Password is required');
      return;
    }

    if (!isPasswordStrong(password)) {
      setError('Password does not meet all requirements');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password, access_token: accessToken }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to reset password');
      }

      setIsSuccess(true);
    } catch (err: any) {
      setError(err.message || 'Failed to reset password. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="w-full max-w-md mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-[#1a1d23] mb-2">Password Reset</h1>
          <p className="text-gray-600 text-sm">تم تغيير كلمة المرور</p>
        </div>

        <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
          <div className="flex items-start gap-3">
            <svg className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <div>
              <p className="text-green-800 text-sm font-medium">Password changed successfully</p>
              <p className="text-green-700 text-sm mt-1">
                Your password has been updated. You can now sign in with your new password.
              </p>
            </div>
          </div>
        </div>

        <Link
          href="/login"
          className="block w-full text-center bg-[#c41e3a] hover:bg-[#a01830] text-white font-semibold py-3 rounded-lg transition"
        >
          Sign In
        </Link>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-[#1a1d23] mb-1">Reset Password</h1>
        <h2 className="text-lg font-semibold text-[#1a1d23] mb-2">إعادة تعيين كلمة المرور</h2>
        <p className="text-gray-600 text-sm">Enter your new password below.</p>
      </div>

      {!accessToken && (
        <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <p className="text-yellow-800 text-sm">
            This link appears to be invalid or expired. Please{' '}
            <Link href="/forgot-password" className="text-[#c41e3a] font-medium hover:underline">
              request a new reset link
            </Link>.
          </p>
        </div>
      )}

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block text-gray-700 font-medium text-sm mb-2">
            New Password
            <span className="text-[#c41e3a] ml-1">*</span>
          </label>
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => { setPassword(e.target.value); setError(''); }}
              placeholder="Enter new password"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-white text-gray-900 placeholder-gray-400 transition focus:outline-none focus:border-[#c41e3a] focus:ring-1 focus:ring-[#c41e3a]"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-600 hover:text-gray-900 transition"
            >
              {showPassword ? (
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                  <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                </svg>
              ) : (
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M3.707 2.293a1 1 0 00-1.414 1.414l14 14a1 1 0 001.414-1.414l-1.473-1.473A10.014 10.014 0 0019.542 10C18.268 5.943 14.478 3 10 3a9.958 9.958 0 00-4.512 1.074l-1.78-1.781zm4.261 4.26l1.514 1.515a2.003 2.003 0 012.45 2.45l1.514 1.514a4 4 0 00-5.478-5.478z" clipRule="evenodd" />
                  <path d="M12.454 16.697L9.75 13.992a4 4 0 01-3.742-3.741L2.335 6.578A9.98 9.98 0 00.458 10c1.274 4.057 5.065 7 9.542 7 .847 0 1.669-.105 2.454-.303z" />
                </svg>
              )}
            </button>
          </div>

          {/* Password requirements */}
          {password && (
            <div className="mt-3 space-y-1">
              {[
                { key: 'length', label: 'At least 8 characters' },
                { key: 'uppercase', label: 'One uppercase letter' },
                { key: 'number', label: 'One number' },
                { key: 'special', label: 'One special character' },
              ].map((req) => (
                <div key={req.key} className="flex items-center gap-2">
                  {passwordChecks[req.key as keyof typeof passwordChecks] ? (
                    <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  ) : (
                    <svg className="w-4 h-4 text-gray-300" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm0-2a6 6 0 100-12 6 6 0 000 12z" clipRule="evenodd" />
                    </svg>
                  )}
                  <span className={`text-xs ${passwordChecks[req.key as keyof typeof passwordChecks] ? 'text-green-600' : 'text-gray-500'}`}>
                    {req.label}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        <div>
          <label className="block text-gray-700 font-medium text-sm mb-2">
            Confirm Password
            <span className="text-[#c41e3a] ml-1">*</span>
          </label>
          <input
            type={showPassword ? 'text' : 'password'}
            value={confirmPassword}
            onChange={(e) => { setConfirmPassword(e.target.value); setError(''); }}
            placeholder="Confirm new password"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-white text-gray-900 placeholder-gray-400 transition focus:outline-none focus:border-[#c41e3a] focus:ring-1 focus:ring-[#c41e3a]"
          />
          {confirmPassword && password !== confirmPassword && (
            <p className="text-sm text-[#c41e3a] mt-1">Passwords do not match</p>
          )}
        </div>

        <button
          type="submit"
          disabled={isLoading || !accessToken}
          className="w-full bg-[#c41e3a] hover:bg-[#a01830] disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold py-3 rounded-lg transition flex items-center justify-center gap-2"
        >
          {isLoading ? (
            <>
              <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              Resetting...
            </>
          ) : (
            'Reset Password'
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
