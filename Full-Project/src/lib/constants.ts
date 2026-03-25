import {
  DealStage,
  QualityStage,
  Incoterm,
  Currency,
  LCType,
  LGType,
  PaymentTerms,
} from '../types';

// ============================================================================
// SECTORS
// ============================================================================

export const SECTORS = [
  {
    id: 'steel',
    nameEn: 'Steel & Metals',
    nameAr: 'الحديد والمعادن',
    icon: '⚙️',
  },
  {
    id: 'electronics',
    nameEn: 'Electronics',
    nameAr: 'الإلكترونيات',
    icon: '📱',
  },
  {
    id: 'chemicals',
    nameEn: 'Chemicals & Petrochemicals',
    nameAr: 'الكيماويات والبتروكيماويات',
    icon: '🧪',
  },
  {
    id: 'textiles',
    nameEn: 'Textiles & Apparel',
    nameAr: 'المنسوجات والملابس',
    icon: '👕',
  },
  {
    id: 'machinery',
    nameEn: 'Machinery & Equipment',
    nameAr: 'الآلات والمعدات',
    icon: '🏭',
  },
  {
    id: 'energy',
    nameEn: 'Solar & Renewable Energy',
    nameAr: 'الطاقة الشمسية والطاقة المتجددة',
    icon: '☀️',
  },
  {
    id: 'packaging',
    nameEn: 'Packaging & Materials',
    nameAr: 'التغليف والمواد',
    icon: '📦',
  },
  {
    id: 'pharma',
    nameEn: 'Pharmaceuticals',
    nameAr: 'الأدوية',
    icon: '💊',
  },
  {
    id: 'construction',
    nameEn: 'Construction Materials',
    nameAr: 'مواد البناء',
    icon: '🏗️',
  },
  {
    id: 'agriculture',
    nameEn: 'Agriculture & Food',
    nameAr: 'الزراعة والغذاء',
    icon: '🌾',
  },
];

// ============================================================================
// GULF COUNTRIES
// ============================================================================

export const GULF_COUNTRIES = [
  {
    code: 'SA',
    nameEn: 'Saudi Arabia',
    nameAr: 'المملكة العربية السعودية',
    flag: '🇸🇦',
    currency: Currency.SAR,
    currencySymbol: '﷼',
  },
  {
    code: 'AE',
    nameEn: 'United Arab Emirates',
    nameAr: 'الإمارات العربية المتحدة',
    flag: '🇦🇪',
    currency: Currency.AED,
    currencySymbol: 'د.إ',
  },
  {
    code: 'KW',
    nameEn: 'Kuwait',
    nameAr: 'الكويت',
    flag: '🇰🇼',
    currency: Currency.KWD,
    currencySymbol: 'د.ك',
  },
  {
    code: 'QA',
    nameEn: 'Qatar',
    nameAr: 'قطر',
    flag: '🇶🇦',
    currency: Currency.QAR,
    currencySymbol: 'ر.ق',
  },
  {
    code: 'BH',
    nameEn: 'Bahrain',
    nameAr: 'البحرين',
    flag: '🇧🇭',
    currency: Currency.BHD,
    currencySymbol: 'د.ب',
  },
  {
    code: 'OM',
    nameEn: 'Oman',
    nameAr: 'عمان',
    flag: '🇴🇲',
    currency: Currency.OMR,
    currencySymbol: 'ر.ع',
  },
];

// ============================================================================
// SHIPPING COMPANIES - SEA FREIGHT
// ============================================================================

export const SHIPPING_COMPANIES_SEA = [
  {
    id: 'cosco',
    nameEn: 'COSCO Shipping',
    nameAr: 'كوسكو للشحن',
    website: 'www.cosco.com',
    type: 'SEA',
  },
  {
    id: 'maersk',
    nameEn: 'Maersk',
    nameAr: 'ميرسك',
    website: 'www.maersk.com',
    type: 'SEA',
  },
  {
    id: 'msc',
    nameEn: 'MSC (Mediterranean Shipping Company)',
    nameAr: 'إم إس سي',
    website: 'www.msc.com',
    type: 'SEA',
  },
  {
    id: 'cma_cgm',
    nameEn: 'CMA CGM',
    nameAr: 'سي إم إيه سي جي إم',
    website: 'www.cmacgm.com',
    type: 'SEA',
  },
  {
    id: 'hapag_lloyd',
    nameEn: 'Hapag-Lloyd',
    nameAr: 'هابا-لويد',
    website: 'www.hapag-lloyd.com',
    type: 'SEA',
  },
  {
    id: 'evergreen',
    nameEn: 'Evergreen Marine',
    nameAr: 'إفرجرين',
    website: 'www.evergreen-marine.com',
    type: 'SEA',
  },
  {
    id: 'yang_ming',
    nameEn: 'Yang Ming Marine Transport',
    nameAr: 'يانج مينج',
    website: 'www.yangming.com.tw',
    type: 'SEA',
  },
  {
    id: 'one',
    nameEn: 'Ocean Network Express (ONE)',
    nameAr: 'أوشن نيتورك إكسبريس',
    website: 'www.one-line.com',
    type: 'SEA',
  },
  {
    id: 'pil',
    nameEn: 'Pacific International Lines (PIL)',
    nameAr: 'باسيفيك إنترناشيونال لاينز',
    website: 'www.pilship.com',
    type: 'SEA',
  },
  {
    id: 'zim',
    nameEn: 'Zim Integrated Shipping Services',
    nameAr: 'زيم',
    website: 'www.zim.com',
    type: 'SEA',
  },
  {
    id: 'bahri',
    nameEn: 'Bahri (Saudi Aramco Shipping)',
    nameAr: 'بحري',
    website: 'www.bahri.com.sa',
    type: 'SEA',
  },
];

// ============================================================================
// SHIPPING COMPANIES - AIR FREIGHT
// ============================================================================

export const SHIPPING_COMPANIES_AIR = [
  {
    id: 'saudi_airlines',
    nameEn: 'Saudi Arabian Airlines',
    nameAr: 'الخطوط الجوية العربية السعودية',
    website: 'www.saudia.com',
    type: 'AIR',
  },
  {
    id: 'saudia_cargo',
    nameEn: 'Saudia Cargo',
    nameAr: 'كارجو السعودية',
    website: 'www.saudiacargo.com',
    type: 'AIR',
  },
  {
    id: 'emirates_skycargo',
    nameEn: 'Emirates SkyCargo',
    nameAr: 'كارجو الإمارات',
    website: 'www.emiratesgreencargo.com',
    type: 'AIR',
  },
  {
    id: 'qatar_airways_cargo',
    nameEn: 'Qatar Airways Cargo',
    nameAr: 'كارجو الخطوط القطرية',
    website: 'www.qatarairwayscargo.com',
    type: 'AIR',
  },
  {
    id: 'cainiao',
    nameEn: 'Cainiao Network',
    nameAr: 'كاينياو',
    website: 'www.cainiao.com',
    type: 'AIR',
  },
  {
    id: 'sf_express',
    nameEn: 'S.F. Express',
    nameAr: 'إس إف إكسبريس',
    website: 'www.sf-express.com',
    type: 'AIR',
  },
  {
    id: 'china_airlines',
    nameEn: 'China Airlines',
    nameAr: 'شركة الخطوط الجوية الصينية',
    website: 'www.china-airlines.com',
    type: 'AIR',
  },
  {
    id: 'air_china_cargo',
    nameEn: 'Air China Cargo',
    nameAr: 'كارجو الخطوط الجوية الصينية',
    website: 'www.airchina.com.cn',
    type: 'AIR',
  },
  {
    id: 'fedex',
    nameEn: 'FedEx',
    nameAr: 'فيدكس',
    website: 'www.fedex.com',
    type: 'AIR',
  },
  {
    id: 'dhl',
    nameEn: 'DHL Express',
    nameAr: 'دي إتش إل',
    website: 'www.dhl.com',
    type: 'AIR',
  },
  {
    id: 'ups',
    nameEn: 'UPS',
    nameAr: 'يو بي إس',
    website: 'www.ups.com',
    type: 'AIR',
  },
  {
    id: 'aramex',
    nameEn: 'Aramex',
    nameAr: 'أرامكس',
    website: 'www.aramex.com',
    type: 'AIR',
  },
];

// ============================================================================
// DEAL STAGES
// ============================================================================

export const DEAL_STAGES = [
  {
    stage: DealStage.NEGOTIATION,
    nameEn: 'Negotiation',
    nameAr: 'التفاوض',
    description: 'Initial discussion and negotiation phase',
  },
  {
    stage: DealStage.QUOTATION_SENT,
    nameEn: 'Quotation Sent',
    nameAr: 'تم إرسال العرض',
    description: 'Quotation provided to buyer',
  },
  {
    stage: DealStage.QUOTATION_REVIEW,
    nameEn: 'Quotation Review',
    nameAr: 'مراجعة العرض',
    description: 'Buyer reviewing quotation',
  },
  {
    stage: DealStage.QUOTATION_ACCEPTED,
    nameEn: 'Quotation Accepted',
    nameAr: 'تم قبول العرض',
    description: 'Quotation approved by buyer',
  },
  {
    stage: DealStage.PO_ISSUED,
    nameEn: 'PO Issued',
    nameAr: 'تم إصدار أمر الشراء',
    description: 'Purchase order issued',
  },
  {
    stage: DealStage.PO_CONFIRMED,
    nameEn: 'PO Confirmed',
    nameAr: 'تم تأكيد أمر الشراء',
    description: 'Supplier confirms PO',
  },
  {
    stage: DealStage.PRODUCTION_START,
    nameEn: 'Production Started',
    nameAr: 'بدء الإنتاج',
    description: 'Manufacturing begins',
  },
  {
    stage: DealStage.PRODUCTION_INSPECTION,
    nameEn: 'Production Inspection',
    nameAr: 'فحص الإنتاج',
    description: 'Quality inspection during production',
  },
  {
    stage: DealStage.READY_FOR_SHIPMENT,
    nameEn: 'Ready for Shipment',
    nameAr: 'جاهز للشحن',
    description: 'Goods packaged and ready to ship',
  },
  {
    stage: DealStage.LC_ISSUED,
    nameEn: 'LC Issued',
    nameAr: 'تم إصدار خطاب الاعتماد',
    description: 'Letter of credit issued by bank',
  },
  {
    stage: DealStage.GOODS_SHIPPED,
    nameEn: 'Goods Shipped',
    nameAr: 'تم شحن البضائع',
    description: 'Shipment departing from origin',
  },
  {
    stage: DealStage.GOODS_IN_TRANSIT,
    nameEn: 'In Transit',
    nameAr: 'قيد النقل',
    description: 'Goods in transit to destination',
  },
  {
    stage: DealStage.PORT_ARRIVED,
    nameEn: 'Port Arrived',
    nameAr: 'وصول الميناء',
    description: 'Goods arrived at destination port',
  },
  {
    stage: DealStage.CUSTOMS_CLEARANCE,
    nameEn: 'Customs Clearance',
    nameAr: 'التخليص الجمركي',
    description: 'Customs inspection and clearance',
  },
  {
    stage: DealStage.DELIVERY,
    nameEn: 'In Delivery',
    nameAr: 'قيد التسليم',
    description: 'Final delivery to buyer',
  },
  {
    stage: DealStage.COMPLETED,
    nameEn: 'Completed',
    nameAr: 'مكتمل',
    description: 'Transaction completed successfully',
  },
];

// ============================================================================
// QUALITY STAGES
// ============================================================================

export const QUALITY_STAGES = [
  {
    stage: QualityStage.PRE_PRODUCTION,
    nameEn: 'Pre-Production',
    nameAr: 'ما قبل الإنتاج',
  },
  {
    stage: QualityStage.MATERIAL_CHECK,
    nameEn: 'Material Check',
    nameAr: 'فحص المواد',
  },
  {
    stage: QualityStage.FIRST_ARTICLE_INSPECTION,
    nameEn: 'First Article Inspection',
    nameAr: 'فحص المقالة الأولى',
  },
  {
    stage: QualityStage.PRODUCTION_PROCESS,
    nameEn: 'Production Process',
    nameAr: 'عملية الإنتاج',
  },
  {
    stage: QualityStage.IN_PROCESS_INSPECTION,
    nameEn: 'In-Process Inspection',
    nameAr: 'الفحص أثناء الإنتاج',
  },
  {
    stage: QualityStage.FINAL_INSPECTION,
    nameEn: 'Final Inspection',
    nameAr: 'الفحص النهائي',
  },
  {
    stage: QualityStage.PACKAGING_INSPECTION,
    nameEn: 'Packaging Inspection',
    nameAr: 'فحص التغليف',
  },
  {
    stage: QualityStage.LOAD_CHECK,
    nameEn: 'Load Check',
    nameAr: 'فحص التحميل',
  },
  {
    stage: QualityStage.TRANSIT_MONITORING,
    nameEn: 'Transit Monitoring',
    nameAr: 'مراقبة النقل',
  },
  {
    stage: QualityStage.POST_DELIVERY_VERIFICATION,
    nameEn: 'Post-Delivery Verification',
    nameAr: 'التحقق بعد التسليم',
  },
];

// ============================================================================
// LC & LG TYPES
// ============================================================================

export const LC_TYPES = [
  { type: LCType.IRREVOCABLE, nameEn: 'Irrevocable', nameAr: 'غير قابل للإلغاء' },
  { type: LCType.REVOCABLE, nameEn: 'Revocable', nameAr: 'قابل للإلغاء' },
  { type: LCType.STANDBY, nameEn: 'Standby', nameAr: 'احتياطي' },
  { type: LCType.REVOLVING, nameEn: 'Revolving', nameAr: 'دوار' },
  { type: LCType.BACK_TO_BACK, nameEn: 'Back-to-Back', nameAr: 'متسلسل' },
  { type: LCType.TRANSFERABLE, nameEn: 'Transferable', nameAr: 'قابل للتحويل' },
];

export const LG_TYPES = [
  { type: LGType.BID_BOND, nameEn: 'Bid Bond', nameAr: 'ضمان العطاء' },
  { type: LGType.PERFORMANCE_BOND, nameEn: 'Performance Bond', nameAr: 'ضمان الأداء' },
  {
    type: LGType.ADVANCE_PAYMENT_GUARANTEE,
    nameEn: 'Advance Payment Guarantee',
    nameAr: 'ضمان الدفع المقدم',
  },
  { type: LGType.CUSTOMS_GUARANTEE, nameEn: 'Customs Guarantee', nameAr: 'ضمان جمركي' },
  { type: LGType.RETENTION_GUARANTEE, nameEn: 'Retention Guarantee', nameAr: 'ضمان الاستحقاق' },
];

// ============================================================================
// PAYMENT TERMS
// ============================================================================

export const PAYMENT_TERMS_LIST = [
  { value: PaymentTerms.ADVANCE, nameEn: 'Advance Payment', nameAr: 'دفع مقدم' },
  { value: PaymentTerms.ADVANCE_DEPOSIT, nameEn: '30% Advance + 70% on Delivery', nameAr: '30% مقدم + 70% عند التسليم' },
  { value: PaymentTerms.AFTER_INSPECTION, nameEn: 'After Inspection', nameAr: 'بعد الفحص' },
  { value: PaymentTerms.COD, nameEn: 'Cash on Delivery (COD)', nameAr: 'الدفع عند الاستلام' },
  { value: PaymentTerms.NET_30, nameEn: 'Net 30 Days', nameAr: '30 يوم صافي' },
  { value: PaymentTerms.NET_60, nameEn: 'Net 60 Days', nameAr: '60 يوم صافي' },
  { value: PaymentTerms.NET_90, nameEn: 'Net 90 Days', nameAr: '90 يوم صافي' },
  { value: PaymentTerms.LC, nameEn: 'Letter of Credit', nameAr: 'خطاب اعتماد' },
];

// ============================================================================
// INCOTERMS
// ============================================================================

export const INCOTERMS_LIST = [
  {
    value: Incoterm.FOB,
    nameEn: 'Free on Board',
    nameAr: 'حر على السفينة',
    description: 'Supplier pays freight to port, buyer pays for shipment and insurance',
  },
  {
    value: Incoterm.CIF,
    nameEn: 'Cost, Insurance and Freight',
    nameAr: 'تكلفة والتأمين والشحن',
    description: 'Supplier pays all costs including insurance until port of destination',
  },
  {
    value: Incoterm.CFR,
    nameEn: 'Cost and Freight',
    nameAr: 'التكلفة والشحن',
    description: 'Supplier pays freight to destination, buyer arranges insurance',
  },
  {
    value: Incoterm.EXW,
    nameEn: 'Ex Works',
    nameAr: 'من المصنع',
    description: 'Buyer arranges and pays for transport from supplier location',
  },
  {
    value: Incoterm.DDP,
    nameEn: 'Delivered Duty Paid',
    nameAr: 'تسليم مع دفع الضرائب',
    description: 'Supplier delivers to buyer location, pays all costs and duties',
  },
  {
    value: Incoterm.FCA,
    nameEn: 'Free Carrier',
    nameAr: 'حر الناقل',
    description: 'Supplier delivers to designated carrier, buyer pays from there',
  },
  {
    value: Incoterm.CPT,
    nameEn: 'Carriage Paid To',
    nameAr: 'النقل مدفوع إلى',
    description: 'Supplier pays transport to destination, buyer pays insurance',
  },
  {
    value: Incoterm.CIP,
    nameEn: 'Carriage and Insurance Paid',
    nameAr: 'النقل والتأمين مدفوع',
    description: 'Supplier pays transport and insurance to destination',
  },
];

// ============================================================================
// CERTIFICATIONS
// ============================================================================

export const CERTIFICATIONS = [
  { code: 'ISO9001', nameEn: 'ISO 9001:2015', nameAr: 'ISO 9001:2015', type: 'Quality' },
  { code: 'ISO14001', nameEn: 'ISO 14001:2015', nameAr: 'ISO 14001:2015', type: 'Environmental' },
  { code: 'ISO45001', nameEn: 'ISO 45001:2018', nameAr: 'ISO 45001:2018', type: 'Safety' },
  { code: 'ISO50001', nameEn: 'ISO 50001:2018', nameAr: 'ISO 50001:2018', type: 'Energy' },
  { code: 'CE', nameEn: 'CE Mark', nameAr: 'علامة CE', type: 'Product' },
  { code: 'SASO', nameEn: 'SASO Certificate', nameAr: 'شهادة ساسو', type: 'Safety' },
  { code: 'SABER', nameEn: 'SABER Registration', nameAr: 'تسجيل سابر', type: 'Conformity' },
  { code: 'FSC', nameEn: 'FSC Certification', nameAr: 'شهادة FSC', type: 'Environmental' },
  { code: 'OHSAS', nameEn: 'OHSAS 18001', nameAr: 'OHSAS 18001', type: 'Safety' },
  { code: 'IATF', nameEn: 'IATF 16949', nameAr: 'IATF 16949', type: 'Automotive' },
  { code: 'API', nameEn: 'API Certification', nameAr: 'شهادة API', type: 'Product' },
  { code: 'GSO', nameEn: 'GSO Standards', nameAr: 'معايير GSO', type: 'Product' },
];

// ============================================================================
// MODON - SAUDI INDUSTRIAL CITIES
// ============================================================================

export const MODON_CITIES = [
  {
    id: 'riyadh',
    nameEn: 'Riyadh Industrial City',
    nameAr: 'مدينة الرياض الصناعية',
    location: 'Riyadh',
  },
  {
    id: 'jeddah',
    nameEn: 'Jeddah Industrial City',
    nameAr: 'مدينة جدة الصناعية',
    location: 'Jeddah',
  },
  {
    id: 'dammam',
    nameEn: 'Dammam Industrial City',
    nameAr: 'مدينة الدمام الصناعية',
    location: 'Dammam',
  },
  {
    id: 'jubail',
    nameEn: 'Jubail Industrial City',
    nameAr: 'مدينة الجبيل الصناعية',
    location: 'Jubail',
  },
  {
    id: 'yanbu',
    nameEn: 'Yanbu Industrial City',
    nameAr: 'مدينة ينبع الصناعية',
    location: 'Yanbu',
  },
  {
    id: 'qassim',
    nameEn: 'Qassim Industrial City',
    nameAr: 'مدينة القصيم الصناعية',
    location: 'Qassim',
  },
];

// ============================================================================
// WORKFLOW OPERATIONS
// ============================================================================

export const WORKFLOW_OPERATIONS = [
  { nameEn: 'Create Deal', nameAr: 'إنشاء صفقة' },
  { nameEn: 'Request LC', nameAr: 'طلب خطاب اعتماد' },
  { nameEn: 'Issue Quotation', nameAr: 'إصدار عرض سعر' },
  { nameEn: 'Approve PO', nameAr: 'الموافقة على أمر الشراء' },
  { nameEn: 'Start Production', nameAr: 'بدء الإنتاج' },
  { nameEn: 'Quality Inspection', nameAr: 'فحص الجودة' },
  { nameEn: 'Ship Goods', nameAr: 'شحن البضائع' },
  { nameEn: 'Customs Clearance', nameAr: 'التخليص الجمركي' },
  { nameEn: 'Confirm Delivery', nameAr: 'تأكيد التسليم' },
];

// ============================================================================
// CURRENCIES WITH EXCHANGE RATES (placeholder rates)
// ============================================================================

export const CURRENCIES = [
  { code: Currency.USD, nameEn: 'US Dollar', nameAr: 'دولار أمريكي', symbol: '$', rate: 1.0 },
  { code: Currency.CNY, nameEn: 'Chinese Yuan', nameAr: 'اليوان الصيني', symbol: '¥', rate: 7.2 },
  { code: Currency.SAR, nameEn: 'Saudi Riyal', nameAr: 'الريال السعودي', symbol: '﷼', rate: 3.75 },
  { code: Currency.AED, nameEn: 'UAE Dirham', nameAr: 'الدرهم الإماراتي', symbol: 'د.إ', rate: 3.67 },
  { code: Currency.KWD, nameEn: 'Kuwaiti Dinar', nameAr: 'الدينار الكويتي', symbol: 'د.ك', rate: 0.31 },
  { code: Currency.QAR, nameEn: 'Qatari Riyal', nameAr: 'الريال القطري', symbol: 'ر.ق', rate: 3.64 },
  { code: Currency.BHD, nameEn: 'Bahraini Dinar', nameAr: 'الدينار البحريني', symbol: 'د.ب', rate: 0.377 },
  { code: Currency.OMR, nameEn: 'Omani Rial', nameAr: 'الريال العماني', symbol: 'ر.ع', rate: 0.385 },
];

// ============================================================================
// CUSTOMS DUTY RATES BY COUNTRY
// ============================================================================

export const CUSTOMS_RATES = {
  SAUDI_ARABIA: 5.0,
  UAE: 5.0,
  KUWAIT: 4.0,
  QATAR: 4.0,
  BAHRAIN: 5.0,
  OMAN: 5.0,
};

// ============================================================================
// VAT RATES BY COUNTRY
// ============================================================================

export const VAT_RATES = {
  SAUDI_ARABIA: 15.0,
  UAE: 5.0,
  KUWAIT: 0.0,
  QATAR: 0.0,
  BAHRAIN: 0.0,
  OMAN: 0.0,
};

// ============================================================================
// PORTS
// ============================================================================

export const MAJOR_PORTS = {
  CHINA: [
    { code: 'CNSHA', nameEn: 'Shanghai', nameAr: 'شنغهاي' },
    { code: 'CNSZX', nameEn: 'Shenzhen', nameAr: 'شنتشن' },
    { code: 'CNYTI', nameEn: 'Yantai', nameAr: 'يانتاي' },
    { code: 'CNQTY', nameEn: 'Qingdao', nameAr: 'تشينجداو' },
    { code: 'CNNBO', nameEn: 'Ningbo', nameAr: 'نينغبو' },
  ],
  GULF: [
    { code: 'AEJEB', nameEn: 'Jebel Ali (Dubai)', nameAr: 'جبل علي' },
    { code: 'AEDXB', nameEn: 'Port Rashid (Dubai)', nameAr: 'ميناء راشد' },
    { code: 'AEKJN', nameEn: 'Khalifa Port (Abu Dhabi)', nameAr: 'ميناء خليفة' },
    { code: 'SAWHA', nameEn: 'King Abdul Aziz Port', nameAr: 'ميناء الملك عبدالعزيز' },
    { code: 'SAWJD', nameEn: 'Jeddah Islamic Port', nameAr: 'ميناء جدة الإسلامي' },
    { code: 'KWPCA', nameEn: 'Port Authority (Kuwait)', nameAr: 'ميناء الكويت' },
    { code: 'QADHD', nameEn: 'Doha Port', nameAr: 'ميناء الدوحة' },
    { code: 'BHBAH', nameEn: 'Bahrain Port', nameAr: 'ميناء البحرين' },
    { code: 'OMMCT', nameEn: 'Muscat Port', nameAr: 'ميناء مسقط' },
  ],
};

// ============================================================================
// HS CODES (Sample)
// ============================================================================

export const HS_CODE_CATEGORIES = [
  { code: '7225', nameEn: 'Flat-rolled Steel', nameAr: 'الفولاذ المسطح' },
  { code: '8517', nameEn: 'Telephone Equipment', nameAr: 'معدات الهاتف' },
  { code: '3902', nameEn: 'Plastics - Polypropylene', nameAr: 'البوليمرات' },
  { code: '5407', nameEn: 'Woven Fabrics', nameAr: 'النسيج المنسوج' },
  { code: '8441', nameEn: 'Paper Making Machinery', nameAr: 'آلات الورق' },
  { code: '8504', nameEn: 'Electrical Transformers', nameAr: 'محولات كهربائية' },
  { code: '8507', nameEn: 'Batteries', nameAr: 'بطاريات' },
  { code: '3808', nameEn: 'Pesticides', nameAr: 'المبيدات' },
  { code: '3004', nameEn: 'Medicaments', nameAr: 'الأدوية' },
  { code: '2710', nameEn: 'Petroleum Oils', nameAr: 'زيوت بترولية' },
];
