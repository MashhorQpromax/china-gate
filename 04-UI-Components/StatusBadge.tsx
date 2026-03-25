'use client';

import React from 'react';
import { cn } from '@/lib/utils';

type DealStatus =
  | 'pending'
  | 'active'
  | 'negotiation'
  | 'completed'
  | 'cancelled'
  | 'expired';
type ShipmentStatus =
  | 'pending'
  | 'processing'
  | 'shipped'
  | 'in_transit'
  | 'delivered'
  | 'cancelled';
type LCLGStatus = 'pending' | 'issued' | 'confirmed' | 'accepted' | 'rejected';

type Status = DealStatus | ShipmentStatus | LCLGStatus;

interface StatusBadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  status: Status;
  type?: 'deal' | 'shipment' | 'lclg';
  bilingual?: boolean;
}

const getStatusConfig = (status: Status, type: 'deal' | 'shipment' | 'lclg' = 'deal') => {
  const dealStatusMap: Record<DealStatus, { en: string; ar: string; color: string; pulse: boolean }> = {
    pending: {
      en: 'Pending',
      ar: 'قيد الانتظار',
      color: 'bg-gray-500 bg-opacity-10 text-gray-400',
      pulse: false,
    },
    active: {
      en: 'Active',
      ar: 'نشط',
      color: 'bg-emerald-500 bg-opacity-10 text-emerald-400',
      pulse: true,
    },
    negotiation: {
      en: 'Negotiation',
      ar: 'تحت التفاوض',
      color: 'bg-blue-500 bg-opacity-10 text-blue-400',
      pulse: true,
    },
    completed: {
      en: 'Completed',
      ar: 'مكتمل',
      color: 'bg-emerald-500 bg-opacity-10 text-emerald-400',
      pulse: false,
    },
    cancelled: {
      en: 'Cancelled',
      ar: 'ملغى',
      color: 'bg-red-500 bg-opacity-10 text-red-400',
      pulse: false,
    },
    expired: {
      en: 'Expired',
      ar: 'منتهي الصلاحية',
      color: 'bg-orange-500 bg-opacity-10 text-orange-400',
      pulse: false,
    },
  };

  const shipmentStatusMap: Record<ShipmentStatus, { en: string; ar: string; color: string; pulse: boolean }> = {
    pending: {
      en: 'Pending',
      ar: 'قيد الانتظار',
      color: 'bg-gray-500 bg-opacity-10 text-gray-400',
      pulse: false,
    },
    processing: {
      en: 'Processing',
      ar: 'قيد المعالجة',
      color: 'bg-blue-500 bg-opacity-10 text-blue-400',
      pulse: true,
    },
    shipped: {
      en: 'Shipped',
      ar: 'مرسل',
      color: 'bg-indigo-500 bg-opacity-10 text-indigo-400',
      pulse: true,
    },
    in_transit: {
      en: 'In Transit',
      ar: 'قيد الشحن',
      color: 'bg-amber-500 bg-opacity-10 text-amber-400',
      pulse: true,
    },
    delivered: {
      en: 'Delivered',
      ar: 'تم التسليم',
      color: 'bg-emerald-500 bg-opacity-10 text-emerald-400',
      pulse: false,
    },
    cancelled: {
      en: 'Cancelled',
      ar: 'ملغى',
      color: 'bg-red-500 bg-opacity-10 text-red-400',
      pulse: false,
    },
  };

  const lcLgStatusMap: Record<LCLGStatus, { en: string; ar: string; color: string; pulse: boolean }> = {
    pending: {
      en: 'Pending',
      ar: 'قيد الانتظار',
      color: 'bg-gray-500 bg-opacity-10 text-gray-400',
      pulse: false,
    },
    issued: {
      en: 'Issued',
      ar: 'صادر',
      color: 'bg-blue-500 bg-opacity-10 text-blue-400',
      pulse: true,
    },
    confirmed: {
      en: 'Confirmed',
      ar: 'مؤكد',
      color: 'bg-indigo-500 bg-opacity-10 text-indigo-400',
      pulse: true,
    },
    accepted: {
      en: 'Accepted',
      ar: 'مقبول',
      color: 'bg-emerald-500 bg-opacity-10 text-emerald-400',
      pulse: false,
    },
    rejected: {
      en: 'Rejected',
      ar: 'مرفوض',
      color: 'bg-red-500 bg-opacity-10 text-red-400',
      pulse: false,
    },
  };

  let statusMap;
  if (type === 'deal') {
    statusMap = dealStatusMap;
  } else if (type === 'shipment') {
    statusMap = shipmentStatusMap;
  } else {
    statusMap = lcLgStatusMap;
  }

  return statusMap[status as any] || dealStatusMap.pending;
};

const StatusBadge = React.forwardRef<HTMLDivElement, StatusBadgeProps>(
  (
    {
      status,
      type = 'deal',
      bilingual = false,
      className,
      ...props
    },
    ref
  ) => {
    const config = getStatusConfig(status, type);

    return (
      <div
        ref={ref}
        className={cn(
          'inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium',
          config.color,
          className
        )}
        {...props}
      >
        <div className={cn('w-2 h-2 rounded-full', config.color.split(' ')[0])} />
        <span>
          {bilingual ? `${config.en} / ${config.ar}` : config.en}
        </span>
        {config.pulse && (
          <div className="w-1.5 h-1.5 rounded-full animate-pulse" style={{
            backgroundColor: config.color.includes('emerald') ? '#10b981' :
                           config.color.includes('blue') ? '#3b82f6' :
                           config.color.includes('indigo') ? '#6366f1' :
                           config.color.includes('amber') ? '#f59e0b' : '#10b981'
          }} />
        )}
      </div>
    );
  }
);

StatusBadge.displayName = 'StatusBadge';

export default StatusBadge;
