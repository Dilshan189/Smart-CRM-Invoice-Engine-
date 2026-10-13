import { InvoiceStatus } from '@/types';

export function formatCurrency(amount: number, currency: string = 'USD'): string {
  try {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency || 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);
  } catch {
    return `$${amount.toFixed(2)}`;
  }
}

export function formatDate(dateString: string): string {
  if (!dateString) return '—';
  try {
    const parts = dateString.split('-');
    if (parts.length === 3) {
      const year = parseInt(parts[0], 10);
      const month = parseInt(parts[1], 10) - 1;
      const day = parseInt(parts[2], 10);
      const date = new Date(year, month, day);
      return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      });
    }
    const d = new Date(dateString);
    return isNaN(d.getTime()) ? dateString : d.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  } catch {
    return dateString;
  }
}

export function calculateDaysDifference(dueDateString: string): { days: number; isOverdue: boolean } {
  try {
    const now = new Date();
    now.setHours(0, 0, 0, 0);

    const parts = dueDateString.split('-');
    let due: Date;
    if (parts.length === 3) {
      due = new Date(parseInt(parts[0], 10), parseInt(parts[1], 10) - 1, parseInt(parts[2], 10));
    } else {
      due = new Date(dueDateString);
    }
    due.setHours(0, 0, 0, 0);

    const diffTime = due.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    return {
      days: Math.abs(diffDays),
      isOverdue: diffDays < 0,
    };
  } catch {
    return { days: 0, isOverdue: false };
  }
}

export function getStatusStyle(status: InvoiceStatus): {
  bg: string;
  color: string;
  border: string;
  dotColor: string;
} {
  switch (status) {
    case 'Paid':
      return {
        bg: 'rgba(16, 185, 129, 0.12)',
        color: '#10b981',
        border: 'rgba(16, 185, 129, 0.28)',
        dotColor: '#10b981',
      };
    case 'Sent':
      return {
        bg: 'rgba(59, 130, 246, 0.12)',
        color: '#3b82f6',
        border: 'rgba(59, 130, 246, 0.28)',
        dotColor: '#3b82f6',
      };
    case 'Overdue':
      return {
        bg: 'rgba(239, 68, 68, 0.14)',
        color: '#ef4444',
        border: 'rgba(239, 68, 68, 0.35)',
        dotColor: '#ef4444',
      };
    case 'Draft':
    default:
      return {
        bg: 'rgba(148, 163, 184, 0.12)',
        color: '#94a3b8',
        border: 'rgba(148, 163, 184, 0.24)',
        dotColor: '#94a3b8',
      };
  }
}
