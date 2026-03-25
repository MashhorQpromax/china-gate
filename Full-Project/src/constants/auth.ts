// Gulf Countries
export const GULF_COUNTRIES = [
  { code: 'SA', name: 'المملكة العربية السعودية', name_en: 'Saudi Arabia', flag: '🇸🇦' },
  { code: 'AE', name: 'الإمارات العربية المتحدة', name_en: 'UAE', flag: '🇦🇪' },
  { code: 'KW', name: 'الكويت', name_en: 'Kuwait', flag: '🇰🇼' },
  { code: 'BH', name: 'البحرين', name_en: 'Bahrain', flag: '🇧🇭' },
  { code: 'QA', name: 'قطر', name_en: 'Qatar', flag: '🇶🇦' },
  { code: 'OM', name: 'عمان', name_en: 'Oman', flag: '🇴🇲' },
];

// Sectors for Gulf Buyers
export const GULF_SECTORS = [
  { ar: 'السيارات والمحركات', en: 'Automotive & Motors' },
  { ar: 'الكهرباء والالكترونيات', en: 'Electrical & Electronics' },
  { ar: 'المعادن والتعدين', en: 'Metals & Mining' },
  { ar: 'المنسوجات والملابس', en: 'Textiles & Clothing' },
  { ar: 'الهندسة والآلات', en: 'Machinery & Engineering' },
  { ar: 'الكيماويات والمواد الخام', en: 'Chemicals & Raw Materials' },
  { ar: 'معدات البناء والتشييد', en: 'Construction Equipment' },
  { ar: 'الأثاث والديكور', en: 'Furniture & Decor' },
  { ar: 'الأغذية والمشروبات', en: 'Food & Beverages' },
  { ar: 'الأخرى', en: 'Other' },
];

// Factory Types
export const FACTORY_TYPES = [
  { value: 'manufacturer', label_en: 'Manufacturer', label_ar: 'مصنع' },
  { value: 'trading', label_en: 'Trading Company', label_ar: 'شركة تجارة' },
  { value: 'both', label_en: 'Both', label_ar: 'كلاهما' },
];

// Certifications
export const CERTIFICATIONS = [
  { value: 'iso9001', label: 'ISO 9001', category: 'Quality' },
  { value: 'iso14001', label: 'ISO 14001', category: 'Environment' },
  { value: 'iso45001', label: 'ISO 45001', category: 'Safety' },
  { value: 'ce', label: 'CE', category: 'Europe' },
  { value: 'saso', label: 'SASO', category: 'Gulf' },
  { value: 'fda', label: 'FDA', category: 'Pharma' },
  { value: 'reach', label: 'REACH', category: 'Europe' },
  { value: 'brc', label: 'BRC', category: 'Food' },
  { value: 'ohsas', label: 'OHSAS 18001', category: 'Safety' },
  { value: 'iatf', label: 'IATF 16949', category: 'Automotive' },
];

// MODON Cities (Saudi Industrial Cities)
export const MODON_CITIES = [
  { value: 'riyadh', label_ar: 'مدينة الرياض الصناعية', label_en: 'Riyadh Industrial City' },
  { value: 'jeddah', label_ar: 'مدينة جدة الصناعية', label_en: 'Jeddah Industrial City' },
  { value: 'dammam', label_ar: 'مدينة الدمام الصناعية', label_en: 'Dammam Industrial City' },
  { value: 'buraydah', label_ar: 'مدينة بريدة الصناعية', label_en: 'Buraydah Industrial City' },
  { value: 'jubail', label_ar: 'مدينة الجبيل الصناعية', label_en: 'Jubail Industrial City' },
  { value: 'yanbu', label_ar: 'مدينة ينبع الصناعية', label_en: 'Yanbu Industrial City' },
];

// Industrial Sectors
export const INDUSTRIAL_SECTORS = [
  { ar: 'السيارات والقطع', en: 'Automotive Parts' },
  { ar: 'الكيماويات والبتروكيماويات', en: 'Chemicals & Petrochemicals' },
  { ar: 'الغذاء والمشروبات', en: 'Food & Beverages' },
  { ar: 'الأدوية والكوسمتيك', en: 'Pharmaceuticals & Cosmetics' },
  { ar: 'المعادن والتعدين', en: 'Metals & Mining' },
  { ar: 'الاسمنت والمواد الإنشائية', en: 'Cement & Construction Materials' },
  { ar: 'الورق والطباعة', en: 'Paper & Printing' },
  { ar: 'الهندسة والآلات', en: 'Engineering & Machinery' },
  { ar: 'النسيج والملابس', en: 'Textile & Apparel' },
  { ar: 'الأثاث والخشب', en: 'Furniture & Wood' },
  { ar: 'الكهرباء والالكترونيات', en: 'Electrical & Electronics' },
  { ar: 'الأخرى', en: 'Other' },
];

// Account Types
export const ACCOUNT_TYPES = [
  {
    id: 'gulf-buyer',
    emoji: '🏢',
    title_ar: 'مشتري/تاجر خليجي',
    title_en: 'Gulf Buyer/Merchant',
    subtitle_ar: 'أبحث عن موردين صينيين',
    subtitle_en: 'Looking for Chinese suppliers',
  },
  {
    id: 'chinese-supplier',
    emoji: '🏭',
    title_ar: 'مورد صيني',
    title_en: 'Chinese Supplier',
    subtitle_ar: 'أريد بيع منتجاتي في الخليج',
    subtitle_en: 'Want to sell to Gulf market',
  },
  {
    id: 'gulf-manufacturer',
    emoji: '🏗️',
    title_ar: 'مصنع سعودي/خليجي',
    title_en: 'Gulf Manufacturer',
    subtitle_ar: 'أبحث عن شراكات تصنيعية',
    subtitle_en: 'Looking for manufacturing partnerships',
  },
];

export const PASSWORD_REQUIREMENTS = [
  { key: 'length', label_en: 'At least 8 characters', label_ar: '8 أحرف على الأقل' },
  { key: 'uppercase', label_en: 'One uppercase letter', label_ar: 'حرف واحد كبير' },
  { key: 'number', label_en: 'One number', label_ar: 'رقم واحد' },
  { key: 'special', label_en: 'One special character', label_ar: 'حرف خاص واحد' },
];
