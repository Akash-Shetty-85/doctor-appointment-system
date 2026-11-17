import React from 'react';
import { AppointmentStatus, EnquiryStatus } from '../../types';

interface BadgeProps {
  children: React.ReactNode;
  variant?:
    | 'default'
    | 'success'
    | 'warning'
    | 'danger'
    | 'info'
    | 'purple'
    | 'appointment'
    | 'enquiry';
  status?: AppointmentStatus | EnquiryStatus;
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'default',
  status,
  className = '',
}) => {
  let badgeStyles = 'bg-slate-100 text-slate-700 border-slate-200';

  if (status) {
    switch (status) {
      case 'Confirmed':
        badgeStyles = 'bg-emerald-50 text-emerald-700 border-emerald-200';
        break;
      case 'Checked-in':
        badgeStyles = 'bg-blue-50 text-blue-700 border-blue-200';
        break;
      case 'In-consultation':
        badgeStyles = 'bg-purple-50 text-purple-700 border-purple-200 animate-pulse';
        break;
      case 'Completed':
        badgeStyles = 'bg-teal-50 text-teal-800 border-teal-200';
        break;
      case 'Pending':
      case 'New':
        badgeStyles = 'bg-amber-50 text-amber-700 border-amber-200';
        break;
      case 'Cancelled':
      case 'Closed':
        badgeStyles = 'bg-rose-50 text-rose-700 border-rose-200';
        break;
      case 'No-show':
        badgeStyles = 'bg-slate-100 text-slate-500 border-slate-300';
        break;
      case 'Rescheduled':
      case 'Contacted':
        badgeStyles = 'bg-indigo-50 text-indigo-700 border-indigo-200';
        break;
    }
  } else {
    switch (variant) {
      case 'success':
        badgeStyles = 'bg-emerald-50 text-emerald-700 border-emerald-200';
        break;
      case 'warning':
        badgeStyles = 'bg-amber-50 text-amber-700 border-amber-200';
        break;
      case 'danger':
        badgeStyles = 'bg-rose-50 text-rose-700 border-rose-200';
        break;
      case 'info':
        badgeStyles = 'bg-sky-50 text-sky-700 border-sky-200';
        break;
      case 'purple':
        badgeStyles = 'bg-purple-50 text-purple-700 border-purple-200';
        break;
      default:
        badgeStyles = 'bg-slate-100 text-slate-700 border-slate-200';
        break;
    }
  }

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${badgeStyles} ${className}`}
    >
      {children}
    </span>
  );
};
