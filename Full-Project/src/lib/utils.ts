import { type ClassValue } from 'clsx';
import { Currency, DealStage, QualityStage, ShipmentStatus, LCStatus, LGStatus, WorkflowStatus } from '../types';

/**
 * Merge classnames with tailwind-merge functionality
 * Handles conflicting Tailwind classes intelligently
 */
export function cn(...inputs: ClassValue[]): string {
  const classes: string[] = [];
  const seen = new Set<string>();
  const tailwindGroups: Record<string, string[]> = {
    bg: [],
    text: [],
    border: [],
    p: [],
    m: [],
    w: [],
    h: [],
    flex: [],
    grid: [],
  };

  const processInput = (input: any) => {
    if (!input) return;
    if (typeof input === 'string') {
      const tokens = input.split(/\s+/).filter(Boolean);
      tokens.forEach(token => {
        // Extract base class for conflict detection
        const base = token.split('-').slice(0, 2).join('-');

        // Handle tailwind groups
        let group = '';
        if (token.startsWith('bg-')) group = 'bg';
        else if (token.startsWith('text-')) group = 'text';
        else if (token.startsWith('border')) group = 'border';
        else if (token.startsWith('p-')) group = 'p';
        else if (token.startsWith('m-')) group = 'm';
        else if (token.startsWith('w-')) group = 'w';
        else if (token.startsWith('h-')) group = 'h';
        else if (token.startsWith('flex')) group = 'flex';
        else if (token.startsWith('grid')) group = 'grid';

        if (group && tailwindGroups[group]) {
          // Remove conflicting classes in this group
          tailwindGroups[group] = tailwindGroups[group].filter(
            c => !c.split('-').slice(0, 2).join('-').startsWith(base.split('-')[0])
          );
          tailwindGroups[group].push(token);
        } else if (!seen.has(base)) {
          classes.push(token);
          seen.add(base);
        }
      });
    } else if (Array.isArray(input)) {
      input.forEach(processInput);
    } else if (typeof input === 'object') {
      Object.entries(input).forEach(([key, value]) => {
        if (value) processInput(key);
      });
    }
  };

  inputs.forEach(processInput);
  Object.values(tailwindGroups).forEach(group => classes.push(...group));
  return classes.join(' ');
}

/**
 * Format currency value with symbol and proper decimal places
 */
export function formatCurrency(amount: number, currency: Currency | string): string {
  const currencySymbols: Record<string, string> = {
    USD: '$',
    CNY: '¥',
    SAR: '﷼',
    AED: 'د.إ',
    KWD: 'د.ك',
    QAR: 'ر.ق',
    BHD: 'د.ب',
    OMR: 'ر.ع',
  };

  const symbol = currencySymbols[currency] || currency;
  const formatted = new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);

  return `${symbol} ${formatted}`;
}

/**
 * Format date according to locale
 */
export function formatDate(date: Date | string, locale: 'en' | 'ar' | 'zh' = 'en'): string {
  const d = typeof date === 'string' ? new Date(date) : date;

  if (isNaN(d.getTime())) return 'Invalid Date';

  const options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  };

  if (locale === 'ar') {
    return d.toLocaleDateString('ar-SA', options);
  } else if (locale === 'zh') {
    return d.toLocaleDateString('zh-CN', options);
  }

  return d.toLocaleDateString('en-US', options);
}

/**
 * Format date and time
 */
export function formatDateTime(date: Date | string, locale: 'en' | 'ar' | 'zh' = 'en'): string {
  const d = typeof date === 'string' ? new Date(date) : date;

  if (isNaN(d.getTime())) return 'Invalid Date';

  const options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  };

  if (locale === 'ar') {
    return d.toLocaleDateString('ar-SA', options);
  } else if (locale === 'zh') {
    return d.toLocaleDateString('zh-CN', options);
  }

  return d.toLocaleDateString('en-US', options);
}

/**
 * Get status background color for UI display
 */
export function getStatusColor(status: string): string {
  const colors: Record<string, string> = {
    // Deal stages
    [DealStage.NEGOTIATION]: 'bg-blue-100 text-blue-800',
    [DealStage.QUOTATION_SENT]: 'bg-blue-100 text-blue-800',
    [DealStage.QUOTATION_REVIEW]: 'bg-yellow-100 text-yellow-800',
    [DealStage.QUOTATION_ACCEPTED]: 'bg-green-100 text-green-800',
    [DealStage.PO_ISSUED]: 'bg-green-100 text-green-800',
    [DealStage.PO_CONFIRMED]: 'bg-green-100 text-green-800',
    [DealStage.PRODUCTION_START]: 'bg-orange-100 text-orange-800',
    [DealStage.PRODUCTION_INSPECTION]: 'bg-orange-100 text-orange-800',
    [DealStage.READY_FOR_SHIPMENT]: 'bg-orange-100 text-orange-800',
    [DealStage.LC_ISSUED]: 'bg-purple-100 text-purple-800',
    [DealStage.GOODS_SHIPPED]: 'bg-indigo-100 text-indigo-800',
    [DealStage.GOODS_IN_TRANSIT]: 'bg-indigo-100 text-indigo-800',
    [DealStage.PORT_ARRIVED]: 'bg-indigo-100 text-indigo-800',
    [DealStage.CUSTOMS_CLEARANCE]: 'bg-red-100 text-red-800',
    [DealStage.DELIVERY]: 'bg-green-100 text-green-800',
    [DealStage.COMPLETED]: 'bg-green-100 text-green-800',

    // Workflow statuses
    [WorkflowStatus.PENDING]: 'bg-gray-100 text-gray-800',
    [WorkflowStatus.IN_PROGRESS]: 'bg-blue-100 text-blue-800',
    [WorkflowStatus.APPROVED]: 'bg-green-100 text-green-800',
    [WorkflowStatus.REJECTED]: 'bg-red-100 text-red-800',
    [WorkflowStatus.ON_HOLD]: 'bg-yellow-100 text-yellow-800',
    [WorkflowStatus.COMPLETED]: 'bg-green-100 text-green-800',

    // LC/LG statuses
    [LCStatus.DRAFT]: 'bg-gray-100 text-gray-800',
    [LCStatus.REQUESTED]: 'bg-blue-100 text-blue-800',
    [LCStatus.APPROVED]: 'bg-green-100 text-green-800',
    [LCStatus.ISSUED]: 'bg-green-100 text-green-800',
    [LCStatus.EXPIRED]: 'bg-red-100 text-red-800',
    [LCStatus.CANCELLED]: 'bg-red-100 text-red-800',

    [LGStatus.DRAFT]: 'bg-gray-100 text-gray-800',
    [LGStatus.APPROVED]: 'bg-green-100 text-green-800',
    [LGStatus.ISSUED]: 'bg-green-100 text-green-800',
    [LGStatus.CLAIMED]: 'bg-red-100 text-red-800',
    [LGStatus.RELEASED]: 'bg-green-100 text-green-800',

    // Shipment statuses
    [ShipmentStatus.PENDING]: 'bg-gray-100 text-gray-800',
    [ShipmentStatus.SHIPPED]: 'bg-blue-100 text-blue-800',
    [ShipmentStatus.IN_TRANSIT]: 'bg-indigo-100 text-indigo-800',
    [ShipmentStatus.DELIVERED]: 'bg-green-100 text-green-800',
    [ShipmentStatus.DAMAGED]: 'bg-red-100 text-red-800',
  };

  return colors[status] || 'bg-gray-100 text-gray-800';
}

/**
 * Get human-readable status label
 */
export function getStatusLabel(status: string, locale: 'en' | 'ar' | 'zh' = 'en'): string {
  const labels: Record<string, Record<string, string>> = {
    // Deal stages
    [DealStage.NEGOTIATION]: { en: 'Negotiation', ar: 'التفاوض', zh: '谈判中' },
    [DealStage.QUOTATION_SENT]: { en: 'Quotation Sent', ar: 'تم إرسال العرض', zh: '已发送报价' },
    [DealStage.QUOTATION_REVIEW]: { en: 'Quotation Review', ar: 'مراجعة العرض', zh: '报价审查中' },
    [DealStage.QUOTATION_ACCEPTED]: { en: 'Quotation Accepted', ar: 'تم قبول العرض', zh: '报价已接受' },
    [DealStage.PO_ISSUED]: { en: 'PO Issued', ar: 'تم إصدار أمر الشراء', zh: '已发出采购单' },
    [DealStage.PO_CONFIRMED]: { en: 'PO Confirmed', ar: 'تم تأكيد أمر الشراء', zh: '采购单已确认' },
    [DealStage.PRODUCTION_START]: { en: 'Production Started', ar: 'بدء الإنتاج', zh: '生产已开始' },
    [DealStage.PRODUCTION_INSPECTION]: { en: 'Production Inspection', ar: 'فحص الإنتاج', zh: '生产检验中' },
    [DealStage.READY_FOR_SHIPMENT]: { en: 'Ready for Shipment', ar: 'جاهز للشحن', zh: '准备发货' },
    [DealStage.LC_ISSUED]: { en: 'LC Issued', ar: 'تم إصدار خطاب الاعتماد', zh: '已签发信用证' },
    [DealStage.GOODS_SHIPPED]: { en: 'Goods Shipped', ar: 'تم شحن البضائع', zh: '商品已发货' },
    [DealStage.GOODS_IN_TRANSIT]: { en: 'In Transit', ar: 'قيد النقل', zh: '运输中' },
    [DealStage.PORT_ARRIVED]: { en: 'Port Arrived', ar: 'وصول الميناء', zh: '已到达港口' },
    [DealStage.CUSTOMS_CLEARANCE]: { en: 'Customs Clearance', ar: 'التخليص الجمركي', zh: '海关清关' },
    [DealStage.DELIVERY]: { en: 'In Delivery', ar: 'قيد التسليم', zh: '配送中' },
    [DealStage.COMPLETED]: { en: 'Completed', ar: 'مكتمل', zh: '已完成' },

    // Workflow statuses
    [WorkflowStatus.PENDING]: { en: 'Pending', ar: 'قيد الانتظار', zh: '待审核' },
    [WorkflowStatus.IN_PROGRESS]: { en: 'In Progress', ar: 'قيد المعالجة', zh: '进行中' },
    [WorkflowStatus.APPROVED]: { en: 'Approved', ar: 'موافق عليه', zh: '已批准' },
    [WorkflowStatus.REJECTED]: { en: 'Rejected', ar: 'مرفوض', zh: '已拒绝' },
    [WorkflowStatus.ON_HOLD]: { en: 'On Hold', ar: 'معلق', zh: '暂停' },
    [WorkflowStatus.COMPLETED]: { en: 'Completed', ar: 'مكتمل', zh: '已完成' },

    // LC/LG statuses
    [LCStatus.DRAFT]: { en: 'Draft', ar: 'مسودة', zh: '草稿' },
    [LCStatus.REQUESTED]: { en: 'Requested', ar: 'مطلوب', zh: '已申请' },
    [LCStatus.APPROVED]: { en: 'Approved', ar: 'موافق عليه', zh: '已批准' },
    [LCStatus.ISSUED]: { en: 'Issued', ar: 'صادر', zh: '已签发' },
    [LCStatus.EXPIRED]: { en: 'Expired', ar: 'منتهي الصلاحية', zh: '已过期' },
    [LCStatus.CANCELLED]: { en: 'Cancelled', ar: 'ملغي', zh: '已取消' },

    [LGStatus.DRAFT]: { en: 'Draft', ar: 'مسودة', zh: '草稿' },
    [LGStatus.APPROVED]: { en: 'Approved', ar: 'موافق عليه', zh: '已批准' },
    [LGStatus.ISSUED]: { en: 'Issued', ar: 'صادر', zh: '已签发' },
    [LGStatus.CLAIMED]: { en: 'Claimed', ar: 'مطالب به', zh: '已索赔' },
    [LGStatus.RELEASED]: { en: 'Released', ar: 'مفرج عنه', zh: '已释放' },

    // Shipment statuses
    [ShipmentStatus.PENDING]: { en: 'Pending', ar: 'قيد الانتظار', zh: '待处理' },
    [ShipmentStatus.SHIPPED]: { en: 'Shipped', ar: 'تم الشحن', zh: '已发货' },
    [ShipmentStatus.IN_TRANSIT]: { en: 'In Transit', ar: 'قيد النقل', zh: '运输中' },
    [ShipmentStatus.DELIVERED]: { en: 'Delivered', ar: 'تم التسليم', zh: '已交付' },
    [ShipmentStatus.DAMAGED]: { en: 'Damaged', ar: 'تالف', zh: '受损' },
  };

  const statusLabels = labels[status];
  if (!statusLabels) {
    return status.replace(/_/g, ' ').replace(/\b\w/g, char => char.toUpperCase());
  }

  return statusLabels[locale] || status;
}

/**
 * Generate unique reference numbers for LC, LG, Deal, etc.
 */
export function generateReference(prefix: string): string {
  const timestamp = Date.now().toString().slice(-8);
  const random = Math.random().toString(36).substring(2, 8).toUpperCase();
  return `${prefix}-${timestamp}-${random}`;
}

/**
 * Calculate CIF price (Cost, Insurance, Freight)
 */
export function calculateCIF(
  fob: number,
  shippingCost: number,
  insuranceCost: number
): number {
  return fob + shippingCost + insuranceCost;
}

/**
 * Calculate insurance cost as percentage of value
 */
export function calculateInsurance(fobValue: number, rate: number = 1.25): number {
  return (fobValue * rate) / 100;
}

/**
 * Calculate customs duties by country
 * Returns duty amount
 */
export function calculateDuties(
  cifValue: number,
  country: string
): number {
  const dutyRates: Record<string, number> = {
    SAUDI_ARABIA: 5.0,
    UAE: 5.0,
    KUWAIT: 4.0,
    QATAR: 4.0,
    BAHRAIN: 5.0,
    OMAN: 5.0,
  };

  const rate = dutyRates[country] || 5.0;
  return (cifValue * rate) / 100;
}

/**
 * Calculate VAT (typically 15% in Gulf states)
 */
export function calculateVAT(
  baseValue: number,
  rate: number = 15
): number {
  return (baseValue * rate) / 100;
}

/**
 * Truncate text to specified length
 */
export function truncateText(text: string, length: number): string {
  if (text.length <= length) return text;
  return text.substring(0, length) + '...';
}

/**
 * Get initials from full name
 */
export function getInitials(name: string): string {
  return name
    .split(' ')
    .map(part => part.charAt(0).toUpperCase())
    .join('')
    .substring(0, 2);
}

/**
 * Check if locale is RTL (Right-to-Left)
 */
export function isRTL(locale: string): boolean {
  return locale === 'ar';
}

/**
 * Format file size
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';

  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
}

/**
 * Validate email format
 */
export function isValidEmail(email: string): boolean {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
}

/**
 * Validate phone number (basic)
 */
export function isValidPhone(phone: string): boolean {
  const regex = /^\+?[\d\s\-\(\)]{10,}$/;
  return regex.test(phone);
}

/**
 * Capitalize first letter
 */
export function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

/**
 * Calculate percentage
 */
export function calculatePercentage(value: number, total: number): number {
  if (total === 0) return 0;
  return Math.round((value / total) * 100);
}

/**
 * Format number with thousands separator
 */
export function formatNumber(num: number, decimals: number = 0): string {
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(num);
}

/**
 * Days until date from now
 */
export function daysUntil(date: Date | string): number {
  const targetDate = typeof date === 'string' ? new Date(date) : date;
  const now = new Date();
  const diff = targetDate.getTime() - now.getTime();
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
}

/**
 * Check if date is overdue
 */
export function isOverdue(date: Date | string): boolean {
  return daysUntil(date) < 0;
}
