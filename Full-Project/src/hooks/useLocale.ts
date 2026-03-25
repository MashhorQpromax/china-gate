import { useLocaleStore } from '../lib/store';

export type Locale = 'en' | 'ar' | 'zh';

/**
 * Hook to access and manage locale state
 * Returns current locale and methods to change it
 */
export function useLocale() {
  const { locale, setLocale } = useLocaleStore();

  return {
    locale: locale as Locale,
    setLocale,
    isRTL: locale === 'ar',
    isArabic: locale === 'ar',
    isEnglish: locale === 'en',
    isChinese: locale === 'zh',
  };
}
