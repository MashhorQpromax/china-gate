// Validation utilities
export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validatePhone = (phone: string): boolean => {
  // Remove all non-digit characters
  const cleaned = phone.replace(/\D/g, '');
  // Phone should be 7-15 digits
  return cleaned.length >= 7 && cleaned.length <= 15;
};

export const validatePassword = (password: string) => {
  return {
    length: password.length >= 8,
    uppercase: /[A-Z]/.test(password),
    number: /\d/.test(password),
    special: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password),
  };
};

export const isPasswordStrong = (password: string): boolean => {
  const requirements = validatePassword(password);
  return Object.values(requirements).every((req) => req);
};

export const getPasswordStrength = (password: string): 'weak' | 'medium' | 'strong' | 'very-strong' => {
  const requirements = validatePassword(password);
  const passedCount = Object.values(requirements).filter(Boolean).length;

  if (passedCount <= 1) return 'weak';
  if (passedCount === 2) return 'medium';
  if (passedCount === 3) return 'strong';
  return 'very-strong';
};

export const validateCommercialRegistration = (cr: string): boolean => {
  // Basic validation: should be 10 digits for Saudi CR
  return /^\d{10}$/.test(cr.replace(/\s/g, ''));
};

export const validateChineseBusinessLicense = (license: string): boolean => {
  // Chinese business license is 18 digits
  return /^\d{18}$/.test(license.replace(/\s/g, ''));
};

export const validateIndustrialLicense = (license: string): boolean => {
  // Saudi industrial license validation
  return license.trim().length >= 5;
};

export const validateCompanyName = (name: string): boolean => {
  return name.trim().length >= 2;
};

export const validateURL = (url: string): boolean => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

export const formatPhoneNumber = (
  phone: string,
  countryCode: string,
): string => {
  // Remove all non-digit characters
  const cleaned = phone.replace(/\D/g, '');

  // Format based on country
  if (countryCode === '+86') {
    // China: +86 XXXXX XXXXX
    if (cleaned.length === 11) {
      return `${cleaned.slice(0, 3)} ${cleaned.slice(3, 8)} ${cleaned.slice(8)}`;
    }
  } else {
    // Gulf countries: format as needed
    if (cleaned.length >= 7) {
      return cleaned.slice(0, 3) + ' ' + cleaned.slice(3);
    }
  }

  return phone;
};

export const getCountryCodePrefix = (countryCode: string): string => {
  const prefixes: Record<string, string> = {
    'SA': '+966',
    'AE': '+971',
    'KW': '+965',
    'BH': '+973',
    'QA': '+974',
    'OM': '+968',
    'CN': '+86',
  };
  return prefixes[countryCode] || countryCode;
};
