'use client';

import { useState } from 'react';
import { ChevronLeft, Loader } from 'lucide-react';
import { PasswordStrength } from '@/components/ui/PasswordStrength';
import { PhoneInput } from '@/components/ui/PhoneInput';
import { TagInput } from '@/components/ui/TagInput';
import { FileUpload } from '@/components/ui/FileUpload';
import { FACTORY_TYPES, CERTIFICATIONS } from '@/constants/auth';
import {
  validateEmail,
  validateCompanyName,
  validateChineseBusinessLicense,
  validateURL,
  isPasswordStrong,
} from '@/lib/validation';

interface ChineseSupplierFormProps {
  onSubmit: (data: unknown) => Promise<void>;
  isLoading: boolean;
  onBack: () => void;
}

export default function ChineseSupplierForm({
  onSubmit,
  isLoading,
  onBack,
}: ChineseSupplierFormProps) {
  const [formData, setFormData] = useState({
    companyName_en: '',
    companyName_cn: '',
    contactPerson: '',
    province: '',
    businessLicense: '',
    factoryType: '',
    mainProducts: [] as string[],
    phone: '',
    countryCode: 'CN',
    email: '',
    wechatId: '',
    alibabaStore: '',
    productionCapacity: '',
    certifications: [] as string[],
    logoFile: null as File | null,
    password: '',
    termsAccepted: false,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [generalError, setGeneralError] = useState('');

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!validateCompanyName(formData.companyName_en)) {
      newErrors.companyName_en = 'Company name (English) required';
    }
    if (!validateCompanyName(formData.companyName_cn)) {
      newErrors.companyName_cn = 'Company name (Chinese) required';
    }
    if (!formData.contactPerson.trim()) {
      newErrors.contactPerson = 'Contact person required';
    }
    if (!formData.province.trim()) {
      newErrors.province = 'Province/City required';
    }
    if (!validateChineseBusinessLicense(formData.businessLicense)) {
      newErrors.businessLicense = 'Invalid business license format';
    }
    if (!formData.factoryType) {
      newErrors.factoryType = 'Select factory type';
    }
    if (formData.mainProducts.length === 0) {
      newErrors.mainProducts = 'Add at least one product';
    }
    if (!formData.phone) {
      newErrors.phone = 'Phone required';
    }
    if (!validateEmail(formData.email)) {
      newErrors.email = 'Invalid email address';
    }
    if (formData.alibabaStore && !validateURL(formData.alibabaStore)) {
      newErrors.alibabaStore = 'Invalid URL format';
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

  const productSuggestions = [
    'Electronics',
    'Machinery',
    'Textiles',
    'Metal Parts',
    'Plastic Products',
    'Chemical Products',
    'Auto Parts',
    'LED Products',
  ];

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-h-96 overflow-y-auto pr-2">
      {generalError && (
        <div className="p-3 bg-red-600 bg-opacity-20 border border-red-600 rounded-lg text-red-400 text-sm">
          {generalError}
        </div>
      )}

      {/* Company Name English */}
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">
          Company Name (English) <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          value={formData.companyName_en}
          onChange={(e) =>
            setFormData({ ...formData, companyName_en: e.target.value })
          }
          placeholder="Enter company name"
          className={`w-full px-4 py-2.5 bg-gray-700 border rounded-lg text-white focus:outline-none focus:border-red-500 transition ${
            errors.companyName_en ? 'border-red-500' : 'border-gray-600'
          }`}
        />
        {errors.companyName_en && (
          <p className="text-sm text-red-400 mt-1">{errors.companyName_en}</p>
        )}
      </div>

      {/* Company Name Chinese */}
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">
          公司名称 (Chinese) <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          value={formData.companyName_cn}
          onChange={(e) =>
            setFormData({ ...formData, companyName_cn: e.target.value })
          }
          placeholder="请输入公司名称"
          className={`w-full px-4 py-2.5 bg-gray-700 border rounded-lg text-white focus:outline-none focus:border-red-500 transition ${
            errors.companyName_cn ? 'border-red-500' : 'border-gray-600'
          }`}
        />
        {errors.companyName_cn && (
          <p className="text-sm text-red-400 mt-1">{errors.companyName_cn}</p>
        )}
      </div>

      {/* Contact Person */}
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">
          Contact Person <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          value={formData.contactPerson}
          onChange={(e) =>
            setFormData({ ...formData, contactPerson: e.target.value })
          }
          placeholder="Full name"
          className={`w-full px-4 py-2.5 bg-gray-700 border rounded-lg text-white focus:outline-none focus:border-red-500 transition ${
            errors.contactPerson ? 'border-red-500' : 'border-gray-600'
          }`}
        />
        {errors.contactPerson && (
          <p className="text-sm text-red-400 mt-1">{errors.contactPerson}</p>
        )}
      </div>

      {/* Province/City */}
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">
          Province/City <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          value={formData.province}
          onChange={(e) =>
            setFormData({ ...formData, province: e.target.value })
          }
          placeholder="e.g., Guangdong"
          className={`w-full px-4 py-2.5 bg-gray-700 border rounded-lg text-white focus:outline-none focus:border-red-500 transition ${
            errors.province ? 'border-red-500' : 'border-gray-600'
          }`}
        />
        {errors.province && (
          <p className="text-sm text-red-400 mt-1">{errors.province}</p>
        )}
      </div>

      {/* Business License */}
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">
          Business License Number <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          value={formData.businessLicense}
          onChange={(e) =>
            setFormData({
              ...formData,
              businessLicense: e.target.value.replace(/\D/g, ''),
            })
          }
          placeholder="18-digit license number"
          maxLength={18}
          className={`w-full px-4 py-2.5 bg-gray-700 border rounded-lg text-white focus:outline-none focus:border-red-500 transition ${
            errors.businessLicense ? 'border-red-500' : 'border-gray-600'
          }`}
        />
        {errors.businessLicense && (
          <p className="text-sm text-red-400 mt-1">{errors.businessLicense}</p>
        )}
      </div>

      {/* Factory Type */}
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">
          Factory Type <span className="text-red-500">*</span>
        </label>
        <div className="space-y-2">
          {FACTORY_TYPES.map((type) => (
            <label key={type.value} className="flex items-center gap-2">
              <input
                type="radio"
                name="factoryType"
                value={type.value}
                checked={formData.factoryType === type.value}
                onChange={(e) =>
                  setFormData({ ...formData, factoryType: e.target.value })
                }
                className="w-4 h-4 accent-red-600 cursor-pointer"
              />
              <span className="text-gray-300 text-sm">{type.label_en}</span>
            </label>
          ))}
        </div>
        {errors.factoryType && (
          <p className="text-sm text-red-400 mt-1">{errors.factoryType}</p>
        )}
      </div>

      {/* Main Products */}
      <TagInput
        value={formData.mainProducts}
        onChange={(v) => setFormData({ ...formData, mainProducts: v })}
        label="Main Products"
        label_ar="المنتجات الرئيسية"
        suggestions={productSuggestions}
        maxTags={8}
        error={errors.mainProducts}
        required
        dir="ltr"
      />

      {/* Phone */}
      <PhoneInput
        value={formData.phone}
        onChange={(v) => setFormData({ ...formData, phone: v })}
        countryCode={formData.countryCode}
        onCountryChange={(c) =>
          setFormData({ ...formData, countryCode: c })
        }
        label="Phone"
        label_ar="الهاتف"
        error={errors.phone}
        required
        dir="ltr"
        allowChinese
      />

      {/* Email */}
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">
          Email <span className="text-red-500">*</span>
        </label>
        <input
          type="email"
          value={formData.email}
          onChange={(e) =>
            setFormData({ ...formData, email: e.target.value })
          }
          placeholder="email@company.com"
          className={`w-full px-4 py-2.5 bg-gray-700 border rounded-lg text-white focus:outline-none focus:border-red-500 transition ${
            errors.email ? 'border-red-500' : 'border-gray-600'
          }`}
        />
        {errors.email && (
          <p className="text-sm text-red-400 mt-1">{errors.email}</p>
        )}
      </div>

      {/* WeChat ID */}
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">
          WeChat ID
        </label>
        <input
          type="text"
          value={formData.wechatId}
          onChange={(e) =>
            setFormData({ ...formData, wechatId: e.target.value })
          }
          placeholder="WeChat handle"
          className="w-full px-4 py-2.5 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-red-500 transition"
        />
      </div>

      {/* Alibaba Store */}
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">
          Alibaba Store URL (Optional)
        </label>
        <input
          type="text"
          value={formData.alibabaStore}
          onChange={(e) =>
            setFormData({ ...formData, alibabaStore: e.target.value })
          }
          placeholder="https://store.alibaba.com/..."
          className={`w-full px-4 py-2.5 bg-gray-700 border rounded-lg text-white focus:outline-none focus:border-red-500 transition ${
            errors.alibabaStore ? 'border-red-500' : 'border-gray-600'
          }`}
        />
        {errors.alibabaStore && (
          <p className="text-sm text-red-400 mt-1">{errors.alibabaStore}</p>
        )}
      </div>

      {/* Production Capacity */}
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">
          Production Capacity
        </label>
        <input
          type="text"
          value={formData.productionCapacity}
          onChange={(e) =>
            setFormData({ ...formData, productionCapacity: e.target.value })
          }
          placeholder="e.g., 10,000 units/month"
          className="w-full px-4 py-2.5 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-red-500 transition"
        />
      </div>

      {/* Certifications */}
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">
          Certifications
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

      {/* Company Logo */}
      <FileUpload
        onFile={(f) => setFormData({ ...formData, logoFile: f })}
        label="Company Logo"
        label_ar="شعار الشركة"
        accept="image/*"
        maxSize={5}
        dir="ltr"
      />

      {/* Password */}
      <PasswordStrength
        value={formData.password}
        onChange={(v) => setFormData({ ...formData, password: v })}
        label="Password"
        label_ar="كلمة المرور"
        error={errors.password}
        required
        dir="ltr"
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
          I agree to the{' '}
          <a href="#" className="text-red-500 hover:text-red-400">
            Terms of Service
          </a>{' '}
          and{' '}
          <a href="#" className="text-red-500 hover:text-red-400">
            Privacy Policy
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
          Back
        </button>
        <button
          type="submit"
          disabled={isLoading}
          className="flex-1 flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold py-2.5 rounded-lg transition"
        >
          {isLoading && <Loader size={18} className="animate-spin" />}
          {isLoading ? 'Loading...' : 'Create Account'}
        </button>
      </div>
    </form>
  );
}
