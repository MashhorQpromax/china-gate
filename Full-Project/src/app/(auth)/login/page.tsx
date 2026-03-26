'use client';

import { useState } from 'react';
import Link from 'next/link';
import { validateEmail, validatePhone } from '@/lib/validation';
import { collectClientInfo } from '@/lib/tracking/client-info';

type LoginTab = 'email' | 'phone' | 'qrcode';

interface CountryCode {
  name: string;
  code: string;
  dialCode: string;
}

const COUNTRY_CODES: CountryCode[] = [
  { name: 'Saudi Arabia', code: 'SA', dialCode: '+966' },
  { name: 'UAE', code: 'AE', dialCode: '+971' },
  { name: 'Kuwait', code: 'KW', dialCode: '+965' },
  { name: 'Bahrain', code: 'BH', dialCode: '+973' },
  { name: 'Qatar', code: 'QA', dialCode: '+974' },
  { name: 'Oman', code: 'OM', dialCode: '+968' },
  { name: 'China', code: 'CN', dialCode: '+86' },
];

export default function LoginPage() {
  // Tab state
  const [activeTab, setActiveTab] = useState<LoginTab>('email');

  // Email login state
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  // Phone login state
  const [selectedCountry, setSelectedCountry] = useState<CountryCode>(COUNTRY_CODES[0]);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [showOtpInput, setShowOtpInput] = useState(false);
  const [otp, setOtp] = useState('');

  // Form state
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [generalError, setGeneralError] = useState('');

  // Email validation
  const validateEmailForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!email) {
      newErrors.email = 'Email is required';
    } else if (!validateEmail(email)) {
      newErrors.email = 'Please enter a valid email';
    }

    if (!password) {
      newErrors.password = 'Password is required';
    } else if (password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Email login submission
  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setGeneralError('');

    if (!validateEmailForm()) {
      return;
    }

    setIsLoading(true);
    try {
      const clientInfo = collectClientInfo();

      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          email,
          password,
          clientInfo,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Login failed');
      }

      // Store profile for UI display only (tokens are in httpOnly cookies now)
      if (result.user?.profile) {
        localStorage.setItem('user_profile', JSON.stringify(result.user.profile));
      }

      // Redirect based on account type
      const accountType = result.user?.profile?.account_type;
      if (accountType === 'gulf_buyer') {
        window.location.href = '/dashboard/buyer';
      } else if (accountType === 'chinese_supplier') {
        window.location.href = '/dashboard/supplier';
      } else if (accountType === 'gulf_manufacturer') {
        window.location.href = '/dashboard/manufacturer';
      } else if (accountType === 'admin') {
        window.location.href = '/dashboard/admin';
      } else {
        window.location.href = '/dashboard/buyer';
      }
    } catch (error: any) {
      setGeneralError(error.message || 'Login failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Phone OTP send
  const handleSendOtp = (e: React.FormEvent) => {
    e.preventDefault();
    setGeneralError('');

    const newErrors: Record<string, string> = {};
    if (!phoneNumber) {
      newErrors.phone = 'Phone number is required';
    } else if (!validatePhone(phoneNumber)) {
      newErrors.phone = 'Please enter a valid phone number';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setShowOtpInput(true);
    setErrors({});
  };

  // Social login handler
  const handleSocialLogin = (provider: string) => {
    alert(`Coming soon: ${provider} login`);
  };

  return (
    <div className="w-full max-w-md mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-[#1a1d23] mb-1">Sign In</h1>
        <h2 className="text-lg font-semibold text-[#1a1d23] mb-2">تسجيل الدخول</h2>
        <p className="text-gray-600 text-sm">Access your China Gate account</p>
      </div>

      {/* Error Alert */}
      {generalError && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
          {generalError}
        </div>
      )}

      {/* Tabs */}
      <div className="mb-6 flex gap-8 border-b border-gray-200">
        <button
          onClick={() => {
            setActiveTab('email');
            setGeneralError('');
            setErrors({});
          }}
          className={`pb-3 font-medium text-sm transition relative ${
            activeTab === 'email'
              ? 'text-[#c41e3a]'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          Email
          {activeTab === 'email' && (
            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#c41e3a]" />
          )}
        </button>

        <button
          onClick={() => {
            setActiveTab('phone');
            setGeneralError('');
            setErrors({});
          }}
          className={`pb-3 font-medium text-sm transition relative ${
            activeTab === 'phone'
              ? 'text-[#c41e3a]'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          Phone
          {activeTab === 'phone' && (
            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#c41e3a]" />
          )}
        </button>

        <button
          onClick={() => {
            setActiveTab('qrcode');
            setGeneralError('');
            setErrors({});
          }}
          className={`pb-3 font-medium text-sm transition relative ${
            activeTab === 'qrcode'
              ? 'text-[#c41e3a]'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          QR Code
          {activeTab === 'qrcode' && (
            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#c41e3a]" />
          )}
        </button>
      </div>

      {/* Email Tab */}
      {activeTab === 'email' && (
        <form onSubmit={handleEmailSubmit} className="space-y-5">
          {/* Email Input */}
          <div>
            <label className="block text-gray-700 font-medium text-sm mb-2">
              Email Address
              <span className="text-[#c41e3a] ml-1">*</span>
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (errors.email) {
                  setErrors({ ...errors, email: '' });
                }
              }}
              placeholder="you@example.com"
              className={`w-full px-4 py-3 border rounded-lg bg-white text-gray-900 placeholder-gray-400 transition focus:outline-none ${
                errors.email
                  ? 'border-[#c41e3a] focus:border-[#c41e3a] focus:ring-1 focus:ring-[#c41e3a]'
                  : 'border-gray-300 focus:border-[#c41e3a] focus:ring-1 focus:ring-[#c41e3a]'
              }`}
            />
            {errors.email && (
              <p className="text-sm text-[#c41e3a] mt-1">{errors.email}</p>
            )}
          </div>

          {/* Password Input */}
          <div>
            <label className="block text-gray-700 font-medium text-sm mb-2">
              Password
              <span className="text-[#c41e3a] ml-1">*</span>
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (errors.password) {
                    setErrors({ ...errors, password: '' });
                  }
                }}
                placeholder="••••••••"
                className={`w-full px-4 py-3 border rounded-lg bg-white text-gray-900 placeholder-gray-400 transition focus:outline-none ${
                  errors.password
                    ? 'border-[#c41e3a] focus:border-[#c41e3a] focus:ring-1 focus:ring-[#c41e3a]'
                    : 'border-gray-300 focus:border-[#c41e3a] focus:ring-1 focus:ring-[#c41e3a]'
                }`}
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
                    <path d="M15.171 13.576l1.474 1.474a1 1 0 001.414-1.414l14-14a1 1 0 00-1.414-1.414l-1.473 1.473A10.014 10.014 0 000 10a9.958 9.958 0 004.512 1.074z" />
                  </svg>
                )}
              </button>
            </div>
            {errors.password && (
              <p className="text-sm text-[#c41e3a] mt-1">{errors.password}</p>
            )}
          </div>

          {/* Remember Me & Forgot Password */}
          <div className="flex items-center justify-between">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="w-4 h-4 border-gray-300 rounded cursor-pointer accent-[#c41e3a]"
              />
              <span className="text-gray-700 text-sm">Remember me</span>
            </label>
            <Link
              href="/forgot-password"
              className="text-sm text-[#c41e3a] hover:text-[#a01830] transition"
            >
              Forgot password?
            </Link>
          </div>

          {/* Sign In Button */}
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
                Signing in...
              </>
            ) : (
              'Sign In'
            )}
          </button>
        </form>
      )}

      {/* Phone Tab */}
      {activeTab === 'phone' && (
        <form onSubmit={handleSendOtp} className="space-y-5">
          {/* Country Code & Phone */}
          <div>
            <label className="block text-gray-700 font-medium text-sm mb-2">
              Phone Number
              <span className="text-[#c41e3a] ml-1">*</span>
            </label>
            <div className="flex gap-3">
              <select
                value={selectedCountry.code}
                onChange={(e) => {
                  const country = COUNTRY_CODES.find((c) => c.code === e.target.value);
                  if (country) setSelectedCountry(country);
                }}
                className="px-3 py-3 border border-gray-300 rounded-lg bg-white text-gray-900 focus:outline-none focus:border-[#c41e3a] focus:ring-1 focus:ring-[#c41e3a] transition"
              >
                {COUNTRY_CODES.map((country) => (
                  <option key={country.code} value={country.code}>
                    {country.dialCode} {country.name}
                  </option>
                ))}
              </select>
              <input
                type="tel"
                value={phoneNumber}
                onChange={(e) => {
                  setPhoneNumber(e.target.value);
                  if (errors.phone) {
                    setErrors({ ...errors, phone: '' });
                  }
                }}
                placeholder="50 1234 5678"
                className={`flex-1 px-4 py-3 border rounded-lg bg-white text-gray-900 placeholder-gray-400 transition focus:outline-none ${
                  errors.phone
                    ? 'border-[#c41e3a] focus:border-[#c41e3a] focus:ring-1 focus:ring-[#c41e3a]'
                    : 'border-gray-300 focus:border-[#c41e3a] focus:ring-1 focus:ring-[#c41e3a]'
                }`}
              />
            </div>
            {errors.phone && (
              <p className="text-sm text-[#c41e3a] mt-1">{errors.phone}</p>
            )}
          </div>

          {/* OTP Input (appears after sending) */}
          {showOtpInput && (
            <div>
              <label className="block text-gray-700 font-medium text-sm mb-2">
                Verification Code
              </label>
              <input
                type="text"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                placeholder="Enter 6-digit code"
                maxLength={6}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-white text-gray-900 placeholder-gray-400 transition focus:outline-none focus:border-[#c41e3a] focus:ring-1 focus:ring-[#c41e3a] text-center tracking-widest"
              />
              <p className="text-center text-gray-600 text-xs mt-2">
                OTP feature coming soon
              </p>
            </div>
          )}

          {/* Send OTP / Verify Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-[#d4a843] hover:bg-[#c49933] disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold py-3 rounded-lg transition flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <>
                <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                Sending...
              </>
            ) : showOtpInput ? (
              'Verify Code'
            ) : (
              'Send OTP'
            )}
          </button>
        </form>
      )}

      {/* QR Code Tab */}
      {activeTab === 'qrcode' && (
        <div className="space-y-5">
          {/* QR Code Placeholder */}
          <div className="flex flex-col items-center justify-center py-12 border-2 border-dashed border-gray-300 rounded-lg bg-gray-50">
            <svg className="w-16 h-16 text-gray-400 mb-3" fill="currentColor" viewBox="0 0 20 20">
              <path d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4zm2 6a2 2 0 012-2h8a2 2 0 012 2v4a2 2 0 01-2 2H8a2 2 0 01-2-2v-4zm6 4a2 2 0 100-4 2 2 0 000 4z" />
            </svg>
            <p className="text-gray-700 font-medium mb-1">Scan to login</p>
            <p className="text-gray-600 text-sm">Use WeChat or China Gate app to scan</p>
          </div>

          {/* Instructions */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-center">
            <p className="text-blue-900 text-sm">
              QR Code login feature coming soon. Download the China Gate app for mobile login.
            </p>
          </div>
        </div>
      )}

      {/* Divider */}
      <div className="my-8 flex items-center gap-4">
        <div className="flex-1 h-px bg-gray-300" />
        <span className="text-gray-600 text-sm">OR</span>
        <div className="flex-1 h-px bg-gray-300" />
      </div>

      {/* Social Login Buttons */}
      <div className="space-y-3 mb-8">
        {/* Google */}
        <button
          type="button"
          onClick={() => handleSocialLogin('Google')}
          className="w-full flex items-center justify-center gap-3 border-2 border-gray-300 hover:border-gray-400 text-gray-900 font-medium py-3 rounded-lg transition bg-white"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
          </svg>
          Continue with Google
        </button>

        {/* Apple */}
        <button
          type="button"
          onClick={() => handleSocialLogin('Apple')}
          className="w-full flex items-center justify-center gap-3 bg-black hover:bg-gray-900 text-white font-medium py-3 rounded-lg transition"
        >
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M17.05 13.5c-.91 0-1.62.47-2.05 1.38.43.9 1.13 1.38 2.05 1.38 1.16 0 2.08-.93 2.08-2.08 0-1.15-.92-2.08-2.08-2.08zm0-3.08c1.25 0 2.36 1.11 2.36 2.36s-1.11 2.36-2.36 2.36-2.36-1.11-2.36-2.36 1.11-2.36 2.36-2.36zm-8.36 3.08c-.91 0-1.62.47-2.05 1.38.43.9 1.13 1.38 2.05 1.38 1.16 0 2.08-.93 2.08-2.08 0-1.15-.92-2.08-2.08-2.08zm0-3.08c1.25 0 2.36 1.11 2.36 2.36s-1.11 2.36-2.36 2.36-2.36-1.11-2.36-2.36 1.11-2.36 2.36-2.36zM12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18.5c-4.69 0-8.5-3.81-8.5-8.5S7.31 3.5 12 3.5s8.5 3.81 8.5 8.5-3.81 8.5-8.5 8.5z" />
          </svg>
          Continue with Apple
        </button>

        {/* WeChat */}
        <button
          type="button"
          onClick={() => handleSocialLogin('WeChat')}
          className="w-full flex items-center justify-center gap-3 bg-[#07C160] hover:bg-[#059952] text-white font-medium py-3 rounded-lg transition"
        >
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z" />
          </svg>
          Continue with WeChat
        </button>
      </div>

      {/* Footer Links */}
      <div className="text-center space-y-4">
        <p className="text-gray-700 text-sm">
          Don't have an account?{' '}
          <Link
            href="/register"
            className="text-[#c41e3a] hover:text-[#a01830] font-semibold transition"
          >
            Sign Up
          </Link>
        </p>
        <div className="flex items-center justify-center gap-4 text-xs text-gray-600">
          <Link href="/terms" className="hover:text-gray-900 transition">
            Terms of Service
          </Link>
          <span>·</span>
          <Link href="/privacy" className="hover:text-gray-900 transition">
            Privacy Policy
          </Link>
        </div>
      </div>
    </div>
  );
}
