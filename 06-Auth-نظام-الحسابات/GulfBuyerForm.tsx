'use client';

import { useState } from 'react';
import { ChevronLeft, Loader } from 'lucide-react';
import { PasswordStrength } from '@/components/ui/PasswordStrength';
import { PhoneInput } from '@/components/ui/PhoneInput';
import { FileUpload } from '@/components/ui/FileUpload';
import { GULF_COUNTRIES, GULF_SECTORS } from '@/constants/auth';
import {
  validateEmail,
  validateCompanyName,
  validateCommercialRegistration,
  isPasswordStrong,
} from '@/lib/validation';

interface GulfBuyerFormProps {
  onSubmit: (data: unknown) => Promise<void>;
  isLoading: boolean;
  onBack: () => void;
}

export default function GulfBuyerForm({
  onSubmit,
  isLoading,
  onBack,
}: GulfBuyerFormProps) {
  const [formData, setFormData] = useState({
    fullName_ar: '',
    fullName_en: '',
    companyName: '',
    country: 'SA',
    city: '',
    commercialRegistration: '',
    sector: '',
    phone: '',
    countryCode: 'SA',
    email: '',
    password: '',
    logoFile: null as File | null,
    termsAccepted: false,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [generalError, setGeneralError] = useState('');

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.fullName_ar.trim()) {
      newErrors.fullName_ar = 'الاسم الكامل (العربية) مطلوب';
    }
    if (!formData.fullName_en.trim()) {
      newErrors.fullName_en = 'Full Name (English) required';
    }
    if (!validateCompanyName(formData.companyName)) {
      newErrors.companyName = 'Company name required';
    }
    if (!formData.city.trim()) {
      newErrors.city = 'المدينة مطلوبة';
    }
    if (!validateCommercialRegistration(formData.commercialRegistration)) {
      newErrors.commercialRegistration = 'رقم السجل التجاري غير صحيح';
    }
    if (!formData.sector) {
      newErrors.sector = 'Select a sector';
    }
    if (!formData.phone) {
      newErrors.phone = 'رقم الجوال مطلوب';
    }
    if (!validateEmail(formData.email)) {
      newErrors.email = 'Invalid email address';
    }
    if (!isPasswordStrong(formData.password)) {
      newErrors.password = 'Password does not meet requirements';
    }
    if (!formData.termsAccepted) {
      newErrors.termsAccepted = 'You must accept the terms';
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

    try {
      await onSubmit(formData);
    } catch (error) {
      setGeneralError('Failed to create account. Please try again.');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-h-96 overflow-y-auto pr-2">
      {generalError && (
        <div className="p-3 bg-red-600 bg-opacity-20 border border-red-600 rounded-lg text-red-400 text-sm">
          {generalError}
        </div>
      )}

      {/* Full Name Arabic */}
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">
          الاسم الكامل (العربية) <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          value={formData.fullName_ar}
          onChange={(e) =>
            setFormData({ ...formData, fullName_ar: e.target.value })
          }
          placeholder="أدخل الاسم الكامل"
          className={`w-full px-4 py-2.5 bg-gray-700 border rounded-lg text-white focus:outline-none focus:border-red-500 transition ${
            errors.fullName_ar ? 'border-red-500' : 'border-gray-600'
          }`}
        />
        {errors.fullName_ar && (
          <p className="text-sm text-red-400 mt-1">{errors.fullName_ar}</p>
        )}
      </div>

      {/* Full Name English */}
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">
          Full Name (English) <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          value={formData.fullName_en}
          onChange={(e) =>
            setFormData({ ...formData, fullName_en: e.target.value })
          }
          placeholder="Enter your full name"
          className={`w-full px-4 py-2.5 bg-gray-700 border rounded-lg text-white focus:outline-none focus:border-red-500 transition ${
            errors.fullName_en ? 'border-red-500' : 'border-gray-600'
          }`}
        />
        {errors.fullName_en && (
          <p className="text-sm text-red-400 mt-1">{errors.fullName_en}</p>
        )}
      </div>

      {/* Company Name */}
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">
          اسم الشركة <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          value={formData.companyName}
          onChange={(e) =>
            setFormData({ ...formData, companyName: e.target.value })
          }
          placeholder="Company Name"
          className={`w-full px-4 py-2.5 bg-gray-700 border rounded-lg text-white focus:outline-none focus:border-red-500 transition ${
            errors.companyName ? 'border-red-500' : 'border-gray-600'
          }`}
        />
        {errors.companyName && (
          <p className="text-sm text-red-400 mt-1">{errors.companyName}</p>
        )}
      </div>

      {/* Country & City */}
      <div className="grid grid-cols-2 gap-2">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            البلد <span className="text-red-500">*</span>
          </label>
          <select
            value={formData.country}
            onChange={(e) =>
              setFormData({ ...formData, country: e.target.value })
            }
            className="w-full px-4 py-2.5 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-red-500 transition"
          >
            {GULF_COUNTRIES.map((c) => (
              <option key={c.code} value={c.code}>
                {c.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            المدينة <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={formData.city}
            onChange={(e) =>
              setFormData({ ...formData, city: e.target.value })
            }
            placeholder="City"
            className={`w-full px-4 py-2.5 bg-gray-700 border rounded-lg text-white focus:outline-none focus:border-red-500 transition ${
              errors.city ? 'border-red-500' : 'border-gray-600'
            }`}
          />
          {errors.city && (
            <p className="text-sm text-red-400 mt-1">{errors.city}</p>
          )}
        </div>
      </div>

      {/* Commercial Registration */}
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">
          رقم السجل التجاري <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          value={formData.commercialRegistration}
          onChange={(e) =>
            setFormData({
              ...formData,
              commercialRegistration: e.target.value.replace(/\D/g, ''),
            })
          }
          placeholder="1234567890"
          maxLength="10"
          className={`w-full px-4 py-2.5 bg-gray-700 border rounded-lg text-white focus:outline-none focus:border-red-500 transition ${
            errors.commercialRegistration
              ? 'border-red-500'
              : 'border-gray-600'
          }`}
        />
        {errors.commercialRegistration && (
          <p className="text-sm text-red-400 mt-1">
            {errors.commercialRegistration}
          </p>
        )}
      </div>

      {/* Sector */}
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">
          القطاع <span className="text-red-500">*</span>
        </label>
        <select
          value={formData.sector}
          onChange={(e) =>
            setFormData({ ...formData, sector: e.target.value })
          }
          className={`w-full px-4 py-2.5 bg-gray-700 border rounded-lg text-white focus:outline-none focus:border-red-500 transition ${
            errors.sector ? 'border-red-500' : 'border-gray-600'
          }`}
        >
          <option value="">اختر القطاع</option>
          {GULF_SECTORS.map((s) => (
            <option key={s.en} value={s.en}>
              {s.ar}
            </option>
          ))}
        </select>
        {errors.sector && (
          <p className="text-sm text-red-400 mt-1">{errors.sector}</p>
        )}
      </div>

      {/* Phone */}
      <PhoneInput
        value={formData.phone}
        onChange={(v) => setFormData({ ...formData, phone: v })}
        countryCode={formData.countryCode}
        onCountryChange={(c) =>
          setFormData({ ...formData, countryCode: c })
        }
        label="Phone"
        label_ar="رقم الجوال"
        error={errors.phone}
        required
        dir="rtl"
      />

      {/* Email */}
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">
          البريد الإلكتروني <span className="text-red-500">*</span>
        </label>
        <input
          type="email"
          value={formData.email}
          onChange={(e) =>
            setFormData({ ...formData, email: e.target.value })
          }
          placeholder="email@example.com"
          className={`w-full px-4 py-2.5 bg-gray-700 border rounded-lg text-white focus:outline-none focus:border-red-500 transition ${
            errors.email ? 'border-red-500' : 'border-gray-600'
          }`}
        />
        {errors.email && (
          <p className="text-sm text-red-400 mt-1">{errors.email}</p>
        )}
      </div>

      {/* Password */}
      <PasswordStrength
        value={formData.password}
        onChange={(v) => setFormData({ ...formData, password: v })}
        label="Password"
        label_ar="كلمة المرور"
        error={errors.password}
        required
        dir="rtl"
      />

      {/* Company Logo */}
      <FileUpload
        onFile={(f) => setFormData({ ...formData, logoFile: f })}
        label="Company Logo"
        label_ar="شعار الشركة"
        accept="image/*"
        maxSize={5}
        dir="rtl"
      />

      {/* Terms Checkbox */}
      <div className="flex items-start gap-2">
        <input
          type="checkbox"
          id="terms"
          checked={formData.termsAccepted}
          onChange={(e) =>
            setFormData({ ...formData, termsAccepted: e.target.checked })
          }
          className="mt-1 w-4 h-4 accent-red-600 bg-gray-700 border border-gray-600 rounded cursor-pointer"
        />
        <label htmlFor="terms" className="text-sm text-gray-300">
          أوافق على{' '}
          <a href="#" className="text-red-500 hover:text-red-400">
            شروط الخدمة
          </a>{' '}
          و
          <a href="#" className="text-red-500 hover:text-red-400">
            سياسة الخصوصية
          </a>
          <span className="text-red-500">*</span>
        </label>
      </div>
      {errors.termsAccepted && (
        <p className="text-sm text-red-400">{errors.termsAccepted}</p>
      )}

      {/* Buttons */}
      <div className="flex gap-2 pt-4 border-t border-gray-700">
        <button
          type="button"
          onClick={onBack}
          className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 border border-gray-600 text-gray-300 rounded-lg hover:border-gray-500 hover:text-white transition"
        >
          <ChevronLeft size={18} />
          رجوع
        </button>
        <button
          type="submit"
          disabled={isLoading}
          className="flex-1 flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold py-2.5 rounded-lg transition"
        >
          {isLoading && <Loader size={18} className="animate-spin" />}
          {isLoading ? 'جاري...' : 'إنشاء الحساب'}
        </button>
      </div>
    </form>
  );
}
