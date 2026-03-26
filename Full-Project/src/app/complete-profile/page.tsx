'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

const COUNTRIES = [
  { value: 'Saudi Arabia', label: 'المملكة العربية السعودية' },
  { value: 'UAE', label: 'الإمارات العربية المتحدة' },
  { value: 'Kuwait', label: 'الكويت' },
  { value: 'Bahrain', label: 'البحرين' },
  { value: 'Oman', label: 'عمان' },
  { value: 'Qatar', label: 'قطر' },
];

const SECTORS = [
  { value: 'retail', label: 'تجزئة' },
  { value: 'wholesale', label: 'جملة' },
  { value: 'manufacturing', label: 'تصنيع' },
  { value: 'construction', label: 'مقاولات' },
  { value: 'food', label: 'أغذية' },
  { value: 'electronics', label: 'إلكترونيات' },
  { value: 'textiles', label: 'منسوجات' },
  { value: 'automotive', label: 'سيارات' },
  { value: 'healthcare', label: 'رعاية صحية' },
  { value: 'other', label: 'أخرى' },
];

const ACCOUNT_TYPES = [
  {
    value: 'gulf_buyer',
    labelAr: 'مشتري خليجي',
    labelEn: 'Gulf Buyer',
    descAr: 'استيراد منتجات من الصين',
  },
  {
    value: 'chinese_supplier',
    labelAr: 'مورد صيني',
    labelEn: 'Chinese Supplier',
    descAr: 'تصدير منتجات للخليج',
  },
  {
    value: 'gulf_manufacturer',
    labelAr: 'مصنع خليجي',
    labelEn: 'Gulf Manufacturer',
    descAr: 'شراء مواد خام ومعدات',
  },
];

export default function CompleteProfilePage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [userName, setUserName] = useState('');

  const [formData, setFormData] = useState({
    accountType: 'gulf_buyer',
    fullNameAr: '',
    fullNameEn: '',
    companyName: '',
    country: 'Saudi Arabia',
    city: '',
    phone: '',
    commercialReg: '',
    sector: '',
  });

  useEffect(() => {
    try {
      const cookie = document.cookie
        .split('; ')
        .find(row => row.startsWith('user_profile_data='));
      if (cookie) {
        const data = JSON.parse(decodeURIComponent(cookie.split('=')[1]));
        setUserEmail(data.email || '');
        setUserName(data.full_name_en || '');
        if (data.full_name_en) {
          setFormData(prev => ({ ...prev, fullNameEn: data.full_name_en }));
        }
      }
    } catch {
      // ignore cookie parse errors
    }
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await fetch('/api/auth/complete-profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (data.success) {
        router.push(data.data?.redirectTo || '/dashboard/buyer');
      } else {
        setError(data.error || 'حدث خطأ أثناء حفظ البيانات');
      }
    } catch {
      setError('حدث خطأ في الاتصال');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-lg max-w-lg w-full p-8">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900">
            أكمل بياناتك
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Complete your profile
          </p>
          {userEmail && (
            <p className="text-sm text-gray-400 mt-2">{userEmail}</p>
          )}
        </div>

        {error && (
          <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm mb-4 text-right">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {step === 1 && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 text-right mb-2">
                  نوع الحساب
                </label>
                <div className="space-y-2">
                  {ACCOUNT_TYPES.map(type => (
                    <label
                      key={type.value}
                      className={`flex items-center justify-between p-3 border rounded-lg cursor-pointer transition-colors ${
                        formData.accountType === type.value
                          ? 'border-red-500 bg-red-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <input
                          type="radio"
                          name="accountType"
                          value={type.value}
                          checked={formData.accountType === type.value}
                          onChange={handleChange}
                          className="text-red-600"
                        />
                        <span className="text-sm text-gray-500">{type.labelEn}</span>
                      </div>
                      <div className="text-right">
                        <span className="text-sm font-medium text-gray-900">{type.labelAr}</span>
                        <p className="text-xs text-gray-400">{type.descAr}</p>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              <button
                type="button"
                onClick={() => setStep(2)}
                className="w-full bg-red-600 text-white py-3 rounded-lg font-medium hover:bg-red-700 transition-colors"
              >
                التالي
              </button>
            </>
          )}

          {step === 2 && (
            <>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 text-right mb-1">
                    الاسم بالعربي *
                  </label>
                  <input
                    type="text"
                    name="fullNameAr"
                    value={formData.fullNameAr}
                    onChange={handleChange}
                    required
                    dir="rtl"
                    placeholder="محمد أحمد"
                    className="w-full border border-gray-300 rounded-lg p-2.5 text-sm text-right focus:ring-2 focus:ring-red-500 focus:border-red-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 text-right mb-1">
                    الاسم بالإنجليزي *
                  </label>
                  <input
                    type="text"
                    name="fullNameEn"
                    value={formData.fullNameEn}
                    onChange={handleChange}
                    required
                    placeholder="Mohammed Ahmed"
                    className="w-full border border-gray-300 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-red-500 focus:border-red-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 text-right mb-1">
                  اسم الشركة *
                </label>
                <input
                  type="text"
                  name="companyName"
                  value={formData.companyName}
                  onChange={handleChange}
                  required
                  dir="rtl"
                  placeholder="اسم الشركة أو المؤسسة"
                  className="w-full border border-gray-300 rounded-lg p-2.5 text-sm text-right focus:ring-2 focus:ring-red-500 focus:border-red-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 text-right mb-1">
                  رقم الجوال *
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                  dir="ltr"
                  placeholder="+966 5XX XXX XXXX"
                  className="w-full border border-gray-300 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-red-500 focus:border-red-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 text-right mb-1">
                    الدولة *
                  </label>
                  <select
                    name="country"
                    value={formData.country}
                    onChange={handleChange}
                    required
                    className="w-full border border-gray-300 rounded-lg p-2.5 text-sm text-right focus:ring-2 focus:ring-red-500 focus:border-red-500"
                  >
                    {COUNTRIES.map(c => (
                      <option key={c.value} value={c.value}>{c.label}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 text-right mb-1">
                    المدينة *
                  </label>
                  <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    required
                    dir="rtl"
                    placeholder="الرياض"
                    className="w-full border border-gray-300 rounded-lg p-2.5 text-sm text-right focus:ring-2 focus:ring-red-500 focus:border-red-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 text-right mb-1">
                  القطاع
                </label>
                <select
                  name="sector"
                  value={formData.sector}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg p-2.5 text-sm text-right focus:ring-2 focus:ring-red-500 focus:border-red-500"
                >
                  <option value="">اختر القطاع</option>
                  {SECTORS.map(s => (
                    <option key={s.value} value={s.value}>{s.label}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 text-right mb-1">
                  السجل التجاري
                </label>
                <input
                  type="text"
                  name="commercialReg"
                  value={formData.commercialReg}
                  onChange={handleChange}
                  dir="ltr"
                  placeholder="1234567890"
                  className="w-full border border-gray-300 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-red-500 focus:border-red-500"
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="flex-1 border border-gray-300 text-gray-700 py-3 rounded-lg font-medium hover:bg-gray-50 transition-colors"
                >
                  رجوع
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 bg-red-600 text-white py-3 rounded-lg font-medium hover:bg-red-700 transition-colors disabled:opacity-50"
                >
                  {loading ? 'جاري الحفظ...' : 'حفظ البيانات'}
                </button>
              </div>
            </>
          )}
        </form>
      </div>
    </div>
  );
}
