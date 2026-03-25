'use client';

import { useState } from 'react';
import { cn } from '@/lib/utils';

interface FormData {
  name: string;
  email: string;
  phone: string;
  company: string;
  message: string;
}

export default function ContactSection() {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    phone: '',
    company: '',
    message: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));
      setSubmitStatus('success');
      setFormData({ name: '', email: '', phone: '', company: '', message: '' });

      // Reset status after 5 seconds
      setTimeout(() => setSubmitStatus('idle'), 5000);
    } catch (error) {
      setSubmitStatus('error');
      setTimeout(() => setSubmitStatus('idle'), 5000);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className={cn(
      'w-full py-20 px-4',
      'bg-gradient-to-b from-[#0c0f14] to-[#0a0d12]',
      'relative overflow-hidden'
    )}>
      {/* Background accents */}
      <div className={cn(
        'absolute top-0 left-1/3 w-96 h-96 rounded-full',
        'bg-gradient-to-br from-[#c41e3a] to-transparent opacity-5',
        'pointer-events-none'
      )} />

      <div className={cn(
        'absolute bottom-0 right-1/4 w-96 h-96 rounded-full',
        'bg-gradient-to-tl from-[#d4a843] to-transparent opacity-5',
        'pointer-events-none'
      )} />

      <div className="relative z-10 max-w-7xl mx-auto">
        {/* Title */}
        <div className="text-center mb-16">
          <h2 className={cn(
            'text-4xl sm:text-5xl font-bold mb-4',
            'text-white'
          )}>
            تواصل معنا
          </h2>
          <p className="text-[#d4a843] text-lg sm:text-xl font-semibold">
            Contact Us
          </p>
          <div className={cn(
            'w-24 h-1 bg-gradient-to-r from-[#c41e3a] to-[#d4a843]',
            'mx-auto mt-4'
          )} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Contact Info */}
          <div className="lg:col-span-1 space-y-8">
            {/* Email */}
            <div className={cn(
              'p-6 rounded-xl',
              'bg-[#0c0f14]/80 backdrop-blur',
              'border border-gray-800',
              'hover:border-[#c41e3a]/50 transition-colors duration-300'
            )}>
              <div className="text-3xl mb-4">📧</div>
              <h3 className="font-bold text-white mb-2">البريد الإلكتروني</h3>
              <p className="text-[#d4a843] text-sm font-semibold mb-2">Email</p>
              <a
                href="mailto:info@chinagate.com"
                className="text-gray-300 hover:text-[#d4a843] transition-colors duration-300"
              >
                info@chinagate.com
              </a>
            </div>

            {/* Phone */}
            <div className={cn(
              'p-6 rounded-xl',
              'bg-[#0c0f14]/80 backdrop-blur',
              'border border-gray-800',
              'hover:border-[#c41e3a]/50 transition-colors duration-300'
            )}>
              <div className="text-3xl mb-4">📞</div>
              <h3 className="font-bold text-white mb-2">الهاتف</h3>
              <p className="text-[#d4a843] text-sm font-semibold mb-2">Phone</p>
              <a
                href="tel:+966XXX"
                className="text-gray-300 hover:text-[#d4a843] transition-colors duration-300"
              >
                +966 XX XXX XXXX
              </a>
            </div>

            {/* Social */}
            <div>
              <h3 className="font-bold text-white mb-4">تابعنا على</h3>
              <p className="text-gray-400 text-sm mb-4">Follow Us</p>

              <div className="flex gap-4">
                {/* WhatsApp */}
                <button className={cn(
                  'flex-1 py-3 rounded-lg font-bold',
                  'bg-green-600 hover:bg-green-700',
                  'text-white transition-all duration-300',
                  'hover:scale-105 active:scale-95'
                )}>
                  <span className="text-lg">💬</span>
                  <span className="block text-xs mt-1">WhatsApp</span>
                </button>

                {/* WeChat */}
                <button className={cn(
                  'flex-1 py-3 rounded-lg font-bold',
                  'bg-green-500 hover:bg-green-600',
                  'text-white transition-all duration-300',
                  'hover:scale-105 active:scale-95'
                )}>
                  <span className="text-lg">🟢</span>
                  <span className="block text-xs mt-1">WeChat</span>
                </button>
              </div>
            </div>

            {/* Hours */}
            <div className={cn(
              'p-6 rounded-xl',
              'bg-[#0c0f14]/80 backdrop-blur',
              'border border-gray-800'
            )}>
              <div className="text-3xl mb-4">🕐</div>
              <h3 className="font-bold text-white mb-2">ساعات العمل</h3>
              <p className="text-[#d4a843] text-sm font-semibold mb-2">Working Hours</p>
              <p className="text-gray-400 text-sm">
                الأحد - الخميس
                <br />
                09:00 - 18:00
              </p>
            </div>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-2">
            <div className={cn(
              'p-8 rounded-2xl',
              'bg-[#0c0f14]/80 backdrop-blur',
              'border border-gray-800',
              'hover:border-[#c41e3a]/30 transition-colors duration-300'
            )}>
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Name and Email */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="name" className="block text-white font-semibold mb-2">
                      الاسم الكامل
                      <span className="text-gray-400 text-sm ml-1">Full Name</span>
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className={cn(
                        'w-full px-4 py-3 rounded-lg',
                        'bg-[#0a0d12] border border-gray-700',
                        'text-white placeholder-gray-500',
                        'focus:border-[#c41e3a] focus:outline-none',
                        'transition-colors duration-300'
                      )}
                      placeholder="أدخل اسمك"
                    />
                  </div>

                  <div>
                    <label htmlFor="email" className="block text-white font-semibold mb-2">
                      البريد الإلكتروني
                      <span className="text-gray-400 text-sm ml-1">Email</span>
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className={cn(
                        'w-full px-4 py-3 rounded-lg',
                        'bg-[#0a0d12] border border-gray-700',
                        'text-white placeholder-gray-500',
                        'focus:border-[#c41e3a] focus:outline-none',
                        'transition-colors duration-300'
                      )}
                      placeholder="your@email.com"
                    />
                  </div>
                </div>

                {/* Phone and Company */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="phone" className="block text-white font-semibold mb-2">
                      رقم الهاتف
                      <span className="text-gray-400 text-sm ml-1">Phone</span>
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className={cn(
                        'w-full px-4 py-3 rounded-lg',
                        'bg-[#0a0d12] border border-gray-700',
                        'text-white placeholder-gray-500',
                        'focus:border-[#c41e3a] focus:outline-none',
                        'transition-colors duration-300'
                      )}
                      placeholder="+966XX XXXXXX"
                    />
                  </div>

                  <div>
                    <label htmlFor="company" className="block text-white font-semibold mb-2">
                      الشركة
                      <span className="text-gray-400 text-sm ml-1">Company</span>
                    </label>
                    <input
                      type="text"
                      id="company"
                      name="company"
                      value={formData.company}
                      onChange={handleChange}
                      className={cn(
                        'w-full px-4 py-3 rounded-lg',
                        'bg-[#0a0d12] border border-gray-700',
                        'text-white placeholder-gray-500',
                        'focus:border-[#c41e3a] focus:outline-none',
                        'transition-colors duration-300'
                      )}
                      placeholder="اسم الشركة"
                    />
                  </div>
                </div>

                {/* Message */}
                <div>
                  <label htmlFor="message" className="block text-white font-semibold mb-2">
                    الرسالة
                    <span className="text-gray-400 text-sm ml-1">Message</span>
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows={5}
                    className={cn(
                      'w-full px-4 py-3 rounded-lg',
                      'bg-[#0a0d12] border border-gray-700',
                      'text-white placeholder-gray-500',
                      'focus:border-[#c41e3a] focus:outline-none',
                      'transition-colors duration-300',
                      'resize-none'
                    )}
                    placeholder="اكتب رسالتك هنا..."
                  />
                </div>

                {/* Status Messages */}
                {submitStatus === 'success' && (
                  <div className={cn(
                    'p-4 rounded-lg',
                    'bg-green-500/20 border border-green-500/50',
                    'text-green-300'
                  )}>
                    ✅ تم إرسال رسالتك بنجاح! شكراً لتواصلك معنا.
                  </div>
                )}

                {submitStatus === 'error' && (
                  <div className={cn(
                    'p-4 rounded-lg',
                    'bg-red-500/20 border border-red-500/50',
                    'text-red-300'
                  )}>
                    ❌ حدث خطأ. يرجى المحاولة مجدداً.
                  </div>
                )}

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={cn(
                    'w-full py-3 rounded-lg font-bold text-lg',
                    'bg-gradient-to-r from-[#c41e3a] to-[#d4a843]',
                    'text-white transition-all duration-300',
                    'hover:shadow-lg hover:shadow-[#c41e3a]/50',
                    'hover:scale-105 active:scale-95',
                    'disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100'
                  )}
                >
                  {isSubmitting ? 'جاري الإرسال...' : 'إرسال الرسالة — Send Message'}
                </button>

                {/* Privacy note */}
                <p className="text-gray-500 text-xs text-center">
                  نحن نحترم خصوصيتك. لن نشارك بيانات بريدك الإلكتروني مع أي طرف آخر.
                </p>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
