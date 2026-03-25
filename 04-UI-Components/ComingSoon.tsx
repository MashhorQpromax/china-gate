import React from 'react';

interface ComingSoonProps {
  title?: string;
  titleAr?: string;
  description?: string;
  descriptionAr?: string;
  icon?: string;
  showNotifyButton?: boolean;
  language?: 'en' | 'ar';
}

export default function ComingSoon({
  title = 'Coming Soon',
  titleAr = 'قريباً',
  description = 'This feature is under development and will be available soon.',
  descriptionAr = 'هذه الميزة قيد التطوير وستكون متاحة قريباً.',
  icon = '🚀',
  showNotifyButton = true,
  language = 'en',
}: ComingSoonProps) {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4 bg-[#1a1d23] border border-[#242830] rounded-lg">
      <div className="text-6xl mb-6">{icon}</div>

      <h2 className="text-2xl font-bold text-white mb-3 text-center">
        {language === 'en' ? title : titleAr}
      </h2>

      <p className="text-gray-400 text-center max-w-md mb-6">
        {language === 'en' ? description : descriptionAr}
      </p>

      {showNotifyButton && (
        <button className="px-6 py-3 bg-[#c41e3a] text-white rounded-lg hover:bg-red-700 transition-colors font-semibold">
          {language === 'en' ? 'Notify Me' : 'أخبرني'}
        </button>
      )}
    </div>
  );
}
