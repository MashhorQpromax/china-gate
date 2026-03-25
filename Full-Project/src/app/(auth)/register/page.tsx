'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ChevronRight } from 'lucide-react';
import { StepIndicator } from '@/components/ui/StepIndicator';
import { ACCOUNT_TYPES } from '@/constants/auth';
import GulfBuyerForm from './forms/GulfBuyerForm';
import ChineseSupplierForm from './forms/ChineseSupplierForm';
import GulfManufacturerForm from './forms/GulfManufacturerForm';

type AccountType = 'gulf-buyer' | 'chinese-supplier' | 'gulf-manufacturer';

export default function RegisterPage() {
  const [step, setStep] = useState<1 | 2>(1);
  const [accountType, setAccountType] = useState<AccountType | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const steps = [
    { id: 'type', label: 'Choose Type', label_ar: 'اختر النوع' },
    { id: 'details', label: 'Fill Details', label_ar: 'إملأ البيانات' },
  ];

  const handleSelectType = (type: AccountType) => {
    setAccountType(type);
    setStep(2);
  };

  const handleBack = () => {
    if (step === 2) {
      setStep(1);
      setAccountType(null);
    }
  };

  const handleSubmit = async (formData: unknown) => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000));
      console.log('Registration:', { accountType, formData });
      // Redirect or handle success
    } catch (error) {
      console.error('Registration error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      {/* Header */}
      <h2 className="text-2xl font-bold text-white mb-2">إنشاء حساب جديد</h2>
      <p className="text-gray-400 text-sm mb-6">
        Create your China Gate account in 3 easy steps
      </p>

      {/* Step Indicator */}
      <div className="mb-8">
        <StepIndicator steps={steps} current={step - 1} dir="rtl" />
      </div>

      {/* Step 1: Choose Account Type */}
      {step === 1 && (
        <div className="space-y-4">
          {ACCOUNT_TYPES.map((type) => (
            <button
              key={type.id}
              onClick={() => handleSelectType(type.id as AccountType)}
              className="w-full p-4 border border-gray-700 rounded-lg hover:border-red-500 hover:bg-red-600 hover:bg-opacity-10 transition text-left group"
            >
              <div className="flex items-start gap-4">
                <span className="text-3xl">{type.emoji}</span>
                <div className="flex-1">
                  <h3 className="text-white font-semibold group-hover:text-red-400 transition">
                    {type.title_ar}
                  </h3>
                  <p className="text-gray-400 text-sm">{type.title_en}</p>
                  <p className="text-gray-500 text-xs mt-1">{type.subtitle_ar}</p>
                </div>
                <ChevronRight className="text-gray-500 group-hover:text-red-400 transition mt-1" />
              </div>
            </button>
          ))}

          {/* Back to Login */}
          <div className="text-center mt-6">
            <p className="text-gray-400 text-sm">
              لديك حساب بالفعل؟{' '}
              <Link
                href="/login"
                className="text-red-500 hover:text-red-400 font-medium transition"
              >
                تسجيل الدخول
              </Link>
            </p>
          </div>
        </div>
      )}

      {/* Step 2: Fill Registration Form */}
      {step === 2 && accountType && (
        <div>
          {accountType === 'gulf-buyer' && (
            <GulfBuyerForm
              onSubmit={handleSubmit}
              isLoading={isLoading}
              onBack={handleBack}
            />
          )}

          {accountType === 'chinese-supplier' && (
            <ChineseSupplierForm
              onSubmit={handleSubmit}
              isLoading={isLoading}
              onBack={handleBack}
            />
          )}

          {accountType === 'gulf-manufacturer' && (
            <GulfManufacturerForm
              onSubmit={handleSubmit}
              isLoading={isLoading}
              onBack={handleBack}
            />
          )}
        </div>
      )}
    </div>
  );
}
