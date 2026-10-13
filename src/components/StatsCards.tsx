'use client';

import React from 'react';
import {
  TrendingUp,
  Clock,
  AlertTriangle,
  FileCheck2,
  Calendar,
  Layers,
} from 'lucide-react';
import { LedgerMetrics } from '@/types';
import { formatCurrency } from '@/lib/formatters';

interface StatsCardsProps {
  metrics: LedgerMetrics;
  currency: string;
}

export function StatsCards({ metrics, currency }: StatsCardsProps) {
  const totalTracked =
    metrics.totalRevenue + metrics.outstandingBalance + metrics.overdueAmount;
  const collectionRate =
    totalTracked > 0
      ? Math.round((metrics.totalRevenue / totalTracked) * 100)
      : 100;

  const totalOutstanding = metrics.outstandingBalance;
  const currentPct =
    totalOutstanding > 0
      ? Math.round((metrics.aging.current / totalOutstanding) * 100)
      : 100;
  const bucket31_60Pct =
    totalOutstanding > 0
      ? Math.round((metrics.aging.bucket31_60 / totalOutstanding) * 100)
      : 0;
  const bucket61_90Pct =
    totalOutstanding > 0
      ? Math.round((metrics.aging.bucket61_90 / totalOutstanding) * 100)
      : 0;

  return (
    <div style={{ marginBottom: 32 }}>
      {/* 4 Core KPIs */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
        gap: 18,
        marginBottom: 20,
      }}>
        {/* Metric 1: Total Realized Revenue */}
        <div className="glass-panel" style={{ padding: '22px 24px', position: 'relative', overflow: 'hidden' }}>
          <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: 3,
            background: 'linear-gradient(90deg, #10b981, #059669)',
          }} />
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
            <span style={{ fontSize: '0.825rem', fontWeight: 600, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              Realized Revenue
            </span>
            <div style={{
              width: 36,
              height: 36,
              borderRadius: 10,
              backgroundColor: 'rgba(16, 185, 129, 0.12)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
              <TrendingUp size={18} color="#10b981" />
            </div>
          </div>
          <div style={{ fontSize: '2rem', fontWeight: 800, color: '#ffffff', letterSpacing: '-0.03em', marginBottom: 8 }}>
            {formatCurrency(metrics.totalRevenue, currency)}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: '0.8rem' }}>
            <span style={{
              padding: '2px 8px',
              borderRadius: 6,
              backgroundColor: 'rgba(16, 185, 129, 0.15)',
              color: '#34d399',
              fontWeight: 600,
            }}>
              {collectionRate}% Collected
            </span>
            <span style={{ color: 'var(--text-muted)' }}>
              Avg {metrics.averageDaysToPay}d settlement
            </span>
          </div>
        </div>

        {/* Metric 2: Outstanding Receivables */}
        <div className="glass-panel" style={{ padding: '22px 24px', position: 'relative', overflow: 'hidden' }}>
          <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: 3,
            background: 'linear-gradient(90deg, #3b82f6, #6366f1)',
          }} />
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
            <span style={{ fontSize: '0.825rem', fontWeight: 600, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              Outstanding Balance
            </span>
            <div style={{
              width: 36,
              height: 36,
              borderRadius: 10,
              backgroundColor: 'rgba(59, 130, 246, 0.12)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
              <Clock size={18} color="#3b82f6" />
            </div>
          </div>
          <div style={{ fontSize: '2rem', fontWeight: 800, color: '#ffffff', letterSpacing: '-0.03em', marginBottom: 8 }}>
            {formatCurrency(metrics.outstandingBalance, currency)}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: '0.8rem' }}>
            <span style={{
              padding: '2px 8px',
              borderRadius: 6,
              backgroundColor: 'rgba(59, 130, 246, 0.15)',
              color: '#60a5fa',
              fontWeight: 600,
            }}>
              Active Ledgers
            </span>
            <span style={{ color: 'var(--text-muted)' }}>
              Due within Net terms
            </span>
          </div>
        </div>

        {/* Metric 3: Overdue Ledger Balance */}
        <div className="glass-panel" style={{ padding: '22px 24px', position: 'relative', overflow: 'hidden' }}>
          <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: 3,
            background: 'linear-gradient(90deg, #ef4444, #dc2626)',
          }} />
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
            <span style={{ fontSize: '0.825rem', fontWeight: 600, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              Overdue Aging
            </span>
            <div style={{
              width: 36,
              height: 36,
              borderRadius: 10,
              backgroundColor: 'rgba(239, 68, 68, 0.14)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
              <AlertTriangle size={18} color="#ef4444" />
            </div>
          </div>
          <div style={{ fontSize: '2rem', fontWeight: 800, color: metrics.overdueAmount > 0 ? '#f87171' : '#ffffff', letterSpacing: '-0.03em', marginBottom: 8 }}>
            {formatCurrency(metrics.overdueAmount, currency)}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: '0.8rem' }}>
            <span style={{
              padding: '2px 8px',
              borderRadius: 6,
              backgroundColor: metrics.overdueAmount > 0 ? 'rgba(239, 68, 68, 0.2)' : 'rgba(16, 185, 129, 0.1)',
              color: metrics.overdueAmount > 0 ? '#fca5a5' : '#34d399',
              fontWeight: 600,
            }}>
              {metrics.overdueAmount > 0 ? 'Requires Action' : 'All Clear'}
            </span>
            <span style={{ color: 'var(--text-muted)' }}>
              1-click chase reminder
            </span>
          </div>
        </div>

        {/* Metric 4: Draft Pipeline */}
        <div className="glass-panel" style={{ padding: '22px 24px', position: 'relative', overflow: 'hidden' }}>
          <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: 3,
            background: 'linear-gradient(90deg, #a855f7, #ec4899)',
          }} />
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
            <span style={{ fontSize: '0.825rem', fontWeight: 600, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              Draft Pipeline
            </span>
            <div style={{
              width: 36,
              height: 36,
              borderRadius: 10,
              backgroundColor: 'rgba(168, 85, 247, 0.12)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
              <Layers size={18} color="#c084fc" />
            </div>
          </div>
          <div style={{ fontSize: '2rem', fontWeight: 800, color: '#ffffff', letterSpacing: '-0.03em', marginBottom: 8 }}>
            {formatCurrency(metrics.draftAmount, currency)}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: '0.8rem' }}>
            <span style={{
              padding: '2px 8px',
              borderRadius: 6,
              backgroundColor: 'rgba(168, 85, 247, 0.15)',
              color: '#d8b4fe',
              fontWeight: 600,
            }}>
              In Preparation
            </span>
            <span style={{ color: 'var(--text-muted)' }}>
              Ready for dispatch
            </span>
          </div>
        </div>
      </div>

      {/* Receivables Aging Breakdown Bar */}
      <div className="glass-panel" style={{ padding: '16px 20px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <Calendar size={15} color="var(--brand-primary)" />
            <span style={{ fontSize: '0.825rem', fontWeight: 600, color: 'var(--text-primary)' }}>
              Commercial Receivables Aging Schedule
            </span>
          </div>
          <span style={{ fontSize: '0.775rem', color: 'var(--text-muted)' }}>
            Standard GAAP Net terms breakdown
          </span>
        </div>

        {/* Visual Bar */}
        <div style={{
          height: 8,
          borderRadius: 999,
          backgroundColor: 'rgba(255, 255, 255, 0.06)',
          display: 'flex',
          overflow: 'hidden',
          marginBottom: 12,
        }}>
          <div
            style={{
              width: `${Math.max(currentPct, 5)}%`,
              backgroundColor: '#3b82f6',
              transition: 'width 0.4s ease',
            }}
            title={`Current (0-30 Days): ${formatCurrency(metrics.aging.current, currency)}`}
          />
          <div
            style={{
              width: `${metrics.overdueAmount > 0 ? 30 : 0}%`,
              backgroundColor: '#f59e0b',
              transition: 'width 0.4s ease',
            }}
            title="31-60 Days Overdue"
          />
          <div
            style={{
              width: `${metrics.overdueAmount > 0 ? 15 : 0}%`,
              backgroundColor: '#ef4444',
              transition: 'width 0.4s ease',
            }}
            title="61+ Days Overdue"
          />
        </div>

        {/* Legend */}
        <div style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: 20,
          fontSize: '0.775rem',
          color: 'var(--text-secondary)',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <span style={{ width: 8, height: 8, borderRadius: 2, backgroundColor: '#3b82f6' }} />
            <span>Current (0-30 days):</span>
            <strong style={{ color: '#ffffff' }}>{formatCurrency(metrics.aging.current || metrics.outstandingBalance, currency)}</strong>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <span style={{ width: 8, height: 8, borderRadius: 2, backgroundColor: '#f59e0b' }} />
            <span>31-60 days:</span>
            <strong style={{ color: '#ffffff' }}>{formatCurrency(metrics.aging.bucket31_60, currency)}</strong>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <span style={{ width: 8, height: 8, borderRadius: 2, backgroundColor: '#ef4444' }} />
            <span>61-90+ days:</span>
            <strong style={{ color: '#ffffff' }}>{formatCurrency(metrics.aging.bucket61_90 + metrics.aging.bucket90Plus, currency)}</strong>
          </div>
        </div>
      </div>
    </div>
  );
}
