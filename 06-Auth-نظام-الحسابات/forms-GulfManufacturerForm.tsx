'use client';

import { useState } from 'react';
import { ChevronLeft, Loader } from 'lucide-react';
import { PasswordStrength } from '@/components/ui/PasswordStrength';
import { PhoneInput } from '@/components/ui/PhoneInput';
import { TagInput } from '@/components/ui/TagInput';
import { FileUpload } from '@/components/ui/FileUpload';
import { MODON_CITIES, INDUSTRIAL_SECTORS, CERTIFICATIONS } from '@/constants/auth';
import {
  validateEmail,
  validateCompanyName,
  validateIndustrialLicense,
  isPasswordStrong,
  validatePhone,
} from '@/lib/validation';

interface GulfManufacturerFormProps {
  onSubmit: (data: unknown) => Promise<void>;
  isLoading: boolean;
  onBack: () => void;
}

export default function GulfManufacturerForm({
  onSubmit,
  isLoading,
  onBack,
}: GulfManufacturerFormProps) {
  const [formData, setFormData] = useState({
    factoryName_ar: '',
    factoryName_en: '',
    industrialLicense: '',
    modonCity: '',
    industrialSector: '',
    currentCapacity: '',
    maxCapacity: '',
    workforce: '',
    products: [] as string[],
    certifications: [] as string[],
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

    if (!validateCompanyName(formData.factoryName_ar)) {
      newErrors.factoryName_ar = 'اسم المصنع (العربية) مطلوب';
    }
    if (!validateCompanyName(formData.factoryName_en)) {
      newErrors.factoryName_en = 'Factory Name (English) required';
    }
    if (!validateIndustrialLicense(formData.industrialLicense)) {
      newErrors.industrialLicense = 'رقم الترخيص الصناعي غير صحيح';
    }
    if (!formData.modonCity) {
      newErrors.modonCity = 'Select industrial city';
    }
    if (!formData.industrialSector) {
      newErrors.industrialSector = 'Select industrial sector';
    }
    if (!formData.currentCapacity) {
      newErrors.currentCapacity = 'Current capacity required';
    }
    if (!formData.maxCapacity) {
      newErrors.maxCapacity = 'Max capacity required';
    }
    if (!formData.workforce) {
      newErrors.workforce = 'Workforce size required';
    }
    if (formData.products.length === 0) {
      newErrors.products = 'Add at least one product';
    }
    if (!validatePhone(formData.phone)) {
      newErrors.phone = 'رقم الهاتف غير صحيح';
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
      setGeneralError('فشل في إنشاء الحساب. يرجى المحاولة مجدداً');
    }
  };

  const productSuggestions = [
    'Auto Parts',
    'Machinery',
    'Electronics',
    'Chemicals',
    'Metal Products',
    'Plastics',
    'Textiles',
    'Food Products',
  ];

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-h-96 overflow-y-auto pr-2">
      {generalError && (
        <div className="p-3 bg-red-600 bg-opacity-20 border border-red-600 rounded-lg text-red-400 text-sm">
          {generalError}
        </div>
      )}

      {/* Factory Name Arabic */}
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">
          اسم المصنع (العربية) <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          value={formData.factoryName_ar}
          onChange={(e) =>
            setFormData({ ...formData, factoryName_ar: e.target.value })
          }
          placeholder="أدخل اسم المصنع"
          className={`w-full px-4 py-2.5 bg-gray-700 border rounded-lg text-white focus:outline-none focus:border-red-500 transition ${
            errors.factoryName_ar ? 'border-red-500' : 'border-gray-600'
          }`}
        />
        {errors.factoryName_ar && (
          <p className="text-sm text-red-400 mt-1">{errors.factoryName_ar}</p>
        )}
      </div>

      {/* Factory Name English */}
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">
          Factory Name (English) <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          value={formData.factoryName_en}
          onChange={(e) =>
            setFormData({ ...formData, factoryName_en: e.target.value })
          }
          placeholder="Enter factory name"
          className={`w-full px-4 py-2.5 bg-gray-700 border rounded-lg text-white focus:outline-none focus:border-red-500 transition ${
            errors.factoryName_en ? 'border-red-500' : 'border-gray-600'
          }`}
        />
        {errors.factoryName_en && (
          <p className="text-sm text-red-400 mt-1">{errors.factoryName_en}</p>
        )}
      </div>

      {/* Industrial License */}
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">
          رقم الترخيص الصناعي <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          value={formData.industrialLicense}
          onChange={(e) =>
            setFormData({ ...formData, industrialLicense: e.target.value })
          }
          placeholder="License number"
          className={`w-full px-4 py-2.5 bg-gray-700 border rounded-lg text-white focus:outline-none focus:border-red-500 transition ${
            errors.industrialLicense ? 'border-red-500' : 'border-gray-600'
          }`}
        />
        {errors.industrialLicense && (
          <p className="text-sm text-red-400 mt-1">{errors.industrialLicense}</p>
        )}
      </div>

      {/* MODON City */}
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">
          المدينة الصناعية <span className="text-red-500">*</span>
        </label>
        <select
          value={formData.modonCity}
          onChange={(e) =>
            setFormData({ ...formData, modonCity: e.target.value })
          }
          className={`w-full px-4 py-2.5 bg-gray-700 border rounded-lg text-white focus:outline-none focus:border-red-500 transition ${
            errors.modonCity ? 'border-red-500' : 'border-gray-600'
          }`}
        >
          <option value="">اختر المدينة الصناعية</option>
          {MODON_CITIES.map((city) => (
            <option key={city.value} value={city.value}>
              {city.label_ar}
            </option>
          ))}
        </select>
        {errors.modonCity && (
          <p className="text-sm text-red-400 mt-1">{errors.modonCity}</p>
        )}
      </div>

      {/* Industrial Sector */}
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">
          القطاع الصناعي <span className="text-red-500">*</span>
        </label>
        <select
          value={formData.industrialSector}
          onChange={(e) =>
            setFormData({ ...formData, industrialSector: e.target.value })
          }
          className={`w-full px-4 py-2.5 bg-gray-700 border rounded-lg text-white focus:outline-none focus:border-red-500 transition ${
            errors.industrialSector ? 'border-red-500' : 'border-gray-600'
          }`}
        >
          <option value="">اختر القطاع</option>
          {INDUSTRIAL_SECTORS.map((sector) => (
            <option key={sector.en} value={sector.en}>
              {sector.ar}
            </option>
          ))}
        </select>
        {errors.industrialSector && (
          <p className="text-sm text-red-400 mt-1">
            {errors.industrialSector}
          </p>
        )}
      </div>

      {/* Current & Max Capacity */}
      <div className="grid grid-cols-2 gap-2">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            الطاقة الحالية <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={formData.currentCapacity}
            onChange={(e) =>
              setFormData({ ...formData, currentCapacity: e.target.value })
            }
            placeholder="e.g., 5000"
            className={`w-full px-4 py-2.5 bg-gray-700 border rounded-lg text-white focus:outline-none focus:border-red-500 transition ${
              errors.currentCapacity ? 'border-red-500' : 'border-gray-600'
            }`}
          />
          {errors.currentCapacity && (
            <p className="text-sm text-red-400 mt-1">
              {errors.currentCapacity}
            </p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            الطاقة القصوى <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={formData.maxCapacity}
            onChange={(e) =>
              setFormData({ ...formData, maxCapacity: e.target.value })
            }
            placeholder="e.g., 10000"
            className={`w-full px-4 py-2.5 bg-gray-700 border rounded-lg text-white focus:outline-none focus:border-red-500 transition ${
              errors.maxCapacity ? 'border-red-500' : 'border-gray-600'
            }`}
          />
          {errors.maxCapacity && (
            <p className="text-sm text-red-400 mt-1">{errors.maxCapacity}</p>
          )}
        </div>
      </div>

      {/* Workforce */}
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">
          عدد العمالة <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          value={formData.workforce}
          onChange={(e) =>
            setFormData({ ...formData, workforce: e.target.value })
          }
          placeholder="e.g., 150"
          className={`w-full px-4 py-2.5 bg-gray-700 border rounded-lg text-white focus:outline-none focus:border-red-500 transition ${
            errors.workforce ? 'border-red-500' : 'border-gray-600'
          }`}
        />
        {errors.workforce && (
          <p className="text-sm text-red-400 mt-1">{errors.workforce}</p>
        )}
      </div>

      {/* Products */}
      <TagInput
        value={formData.products}
        onChange={(v) => setFormData({ ...formData, products: v })}
        label="Manufactured Products"
        label_ar="المنتجات المصنّعة"
        suggestions={productSuggestions}
        maxTags={8}
        error={errors.products}
        required
        dir="rtl"
      />

      {/* Certifications */}
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">
          الشهادات
        </label>
        <div className="grid grid-cols-2 gap-2">
          {CERTIFICATIONS.map((cert) => (
            <label key={cert.value} className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={formData.certifications.includes(cert.value)}
                onChange={(e) => {
                  if (e.target.checked) {
                    setFormData({
                      ...formData,
                      certifications: [...formData.certifications, cert.value],
                    });
                  } else {
                    setFormData({
                      ...formData,
                      certifications: formData.certifications.filter(
                        (c) => c !== cert.value,
                      ),
                    });
                  }
                }}
                className="w-4 h-4 accent-red-600 bg-gray-700 border border-gray-600 rounded cursor-pointer"
              />
              <span className="text-gray-300 text-sm">{cert.label}</span>
            </label>
          ))}
        </div>
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
          placeholder="email@factory.com"
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

      {/* Factory Logo */}
      <FileUpload
        onFile={(f) => setFormData({ ...formData, logoFile: f })}
        label="Factory Logo"
        label_ar="شعار المصنع"
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
