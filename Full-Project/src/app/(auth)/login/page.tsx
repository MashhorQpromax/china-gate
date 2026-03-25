'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Mail, Lock, Loader } from 'lucide-react';
import { validateEmail, validatePhone } from '@/lib/validation';
import { collectClientInfo } from '@/lib/tracking/client-info';

export default function LoginPage() {
  const [emailOrPhone, setEmailOrPhone] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [generalError, setGeneralError] = useState('');

  const isEmail = emailOrPhone.includes('@');

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!emailOrPhone) {
      newErrors.emailOrPhone = 'البريد الإلكتروني أو الهاتف مطلوب';
    } else if (isEmail && !validateEmail(emailOrPhone)) {
      newErrors.emailOrPhone = 'البريد الإلكتروني غير صحيح';
    } else if (!isEmail && !validatePhone(emailOrPhone)) {
      newErrors.emailOrPhone = 'رقم الهاتف غير صحيح';
    }

    if (!password) {
      newErrors.password = 'كلمة المرور مطلوبة';
    } else if (password.length < 8) {
      newErrors.password = 'كلمة المرور قصيرة جداً';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setGeneralError('');

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    try {
      // Collect client info for tracking
      const clientInfo = collectClientInfo();

      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: emailOrPhone,
          password,
          clientInfo,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Login failed');
      }

      // Store session token in localStorage and cookie
      if (result.session?.access_token) {
        localStorage.setItem('access_token', result.session.access_token);
        localStorage.setItem('refresh_token', result.session.refresh_token);
        localStorage.setItem('user_profile', JSON.stringify(result.user.profile));
        // Set cookie for middleware auth (httpOnly not possible from client, but needed for SSR)
        document.cookie = `access_token=${result.session.access_token}; path=/; max-age=${60 * 60 * 24 * 7}; SameSite=Lax`;
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
      setGeneralError(error.message || 'فشل تسجيل الدخول. يرجى المحاولة مجدداً');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      {/* Header */}
      <h2 className="text-2xl font-bold text-white mb-2">تسجيل الدخول</h2>
      <p className="text-gray-400 text-sm mb-6">
        Sign In to your China Gate account
      </p>

      {/* Error Alert */}
      {generalError && (
        <div className="mb-4 p-3 bg-red-600 bg-opacity-20 border border-red-600 rounded-lg text-red-400 text-sm">
          {generalError}
        </div>
      )}

      {/* Login Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Email/Phone Input */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            البريد الإلكتروني أو رقم الجوال
            <span className="text-red-500 ml-1">*</span>
          </label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
            <input
              type="text"
              value={emailOrPhone}
              onChange={(e) => {
                setEmailOrPhone(e.target.value);
                if (errors.emailOrPhone) {
                  setErrors({ ...errors, emailOrPhone: '' });
                }
              }}
              placeholder="example@email.com أو 966501234567"
              className={`w-full pl-10 pr-4 py-2.5 bg-gray-700 border text-white rounded-lg focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 transition ${
                errors.emailOrPhone ? 'border-red-500' : 'border-gray-600'
              }`}
            />
          </div>
          {errors.emailOrPhone && (
            <p className="text-sm text-red-400 mt-1">{errors.emailOrPhone}</p>
          )}
        </div>

        {/* Password Input */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            كلمة المرور
            <span className="text-red-500 ml-1">*</span>
          </label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
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
              className={`w-full pl-10 pr-12 py-2.5 bg-gray-700 border text-white rounded-lg focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 transition ${
                errors.password ? 'border-red-500' : 'border-gray-600'
              }`}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-200 transition"
            >
              {showPassword ? '👁️' : '👁️‍🗨️'}
            </button>
          </div>
          {errors.password && (
            <p className="text-sm text-red-400 mt-1">{errors.password}</p>
          )}
        </div>

        {/* Forgot Password Link */}
        <div className="flex justify-end">
          <Link
            href="/forgot-password"
            className="text-sm text-red-500 hover:text-red-400 transition"
          >
            نسيت كلمة المرور؟
          </Link>
        </div>

        {/* Login Button */}
        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-red-600 hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold py-2.5 rounded-lg transition flex items-center justify-center gap-2"
        >
          {isLoading && <Loader size={18} className="animate-spin" />}
          {isLoading ? 'جاري التحميل...' : 'تسجيل الدخول'}
        </button>
      </form>

      {/* Divider */}
      <div className="my-6 flex items-center gap-4">
        <div className="flex-1 h-px bg-gray-700" />
        <span className="text-gray-500 text-sm">أو</span>
        <div className="flex-1 h-px bg-gray-700" />
      </div>

      {/* Social Login */}
      <div className="space-y-3">
        {/* Google Sign In */}
        <button
          type="button"
          className="w-full flex items-center justify-center gap-2 bg-gray-700 hover:bg-gray-600 text-white font-medium py-2.5 rounded-lg transition"
        >
          <span>🔵</span>
          Google تسجيل الدخول عبر
        </button>

        {/* WeChat Sign In */}
        <button
          type="button"
          className="w-full flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white font-medium py-2.5 rounded-lg transition"
        >
          <span>💚</span>
          WeChat تسجيل الدخول عبر
        </button>
      </div>

      {/* Sign Up Link */}
      <div className="mt-6 text-center">
        <p className="text-gray-400 text-sm">
          ليس لديك حساب؟{' '}
          <Link
            href="/register"
            className="text-red-500 hover:text-red-400 font-medium transition"
          >
            سجل الآن
          </Link>
        </p>
      </div>
    </div>
  );
}
