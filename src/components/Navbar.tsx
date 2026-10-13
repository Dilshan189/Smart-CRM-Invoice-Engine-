'use client';

import React from 'react';
import {
  FileText,
  Sparkles,
  Plus,
  Palette,
  Users,
  Database,
  RefreshCw,
} from 'lucide-react';
import { AgencyBranding } from '@/types';
import { isSupabaseConfigured } from '@/lib/supabase';

interface NavbarProps {
  branding: AgencyBranding;
  onOpenNewInvoice: () => void;
  onOpenAiParser: () => void;
  onOpenBranding: () => void;
  onOpenClients: () => void;
  onOpenSupabase: () => void;
  onResetData: () => void;
}

export function Navbar({
  branding,
  onOpenNewInvoice,
  onOpenAiParser,
  onOpenBranding,
  onOpenClients,
  onOpenSupabase,
  onResetData,
}: NavbarProps) {
  const supabaseActive = isSupabaseConfigured();

  return (
    <header style={{
      borderBottom: '1px solid var(--border-subtle)',
      backgroundColor: 'rgba(7, 9, 14, 0.85)',
      backdropFilter: 'blur(20px)',
      position: 'sticky',
      top: 0,
      zIndex: 50,
      padding: '12px 24px',
    }}>
      <div style={{
        maxWidth: 1400,
        margin: '0 auto',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: 16,
      }}>
        {/* Brand & Agency Info */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <div style={{
            width: 42,
            height: 42,
            borderRadius: 12,
            background: `linear-gradient(135deg, ${branding.primaryColor || '#6366f1'} 0%, #8b5cf6 60%, #ec4899 100%)`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 4px 14px rgba(99, 102, 241, 0.4)',
          }}>
            <FileText size={22} color="#ffffff" />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <h1 style={{ fontSize: '1.25rem', fontWeight: 800, letterSpacing: '-0.03em', color: '#fff' }}>
                ApexLedger
              </h1>
              <span style={{
                fontSize: '0.72rem',
                fontWeight: 600,
                padding: '2px 8px',
                borderRadius: 999,
                backgroundColor: 'rgba(99, 102, 241, 0.18)',
                color: '#a5b4fc',
                border: '1px solid rgba(99, 102, 241, 0.3)',
              }}>
                Agency Engine v2.4
              </span>
            </div>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
              {branding.agencyName} • {branding.currency}
            </p>
          </div>
        </div>

        {/* Database & System Badges */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <button
            onClick={onOpenSupabase}
            id="btn-supabase-status"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6,
              padding: '6px 12px',
              borderRadius: 8,
              fontSize: '0.775rem',
              fontWeight: 600,
              backgroundColor: supabaseActive ? 'rgba(16, 185, 129, 0.12)' : 'rgba(245, 158, 11, 0.12)',
              color: supabaseActive ? '#10b981' : '#f59e0b',
              border: `1px solid ${supabaseActive ? 'rgba(16, 185, 129, 0.25)' : 'rgba(245, 158, 11, 0.25)'}`,
            }}
            title="Click to view Supabase connection & SQL Schema"
          >
            <Database size={13} />
            {supabaseActive ? 'Supabase Live' : 'Supabase SQL Ready'}
          </button>

          <button
            onClick={onResetData}
            id="btn-reset-demo"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 5,
              padding: '6px 10px',
              borderRadius: 8,
              fontSize: '0.75rem',
              color: 'var(--text-muted)',
              border: '1px solid var(--border-subtle)',
            }}
            title="Reset to fresh demo agency data"
          >
            <RefreshCw size={12} />
            Reset Data
          </button>
        </div>

        {/* Action Controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
          <button
            onClick={onOpenClients}
            id="btn-clients-registry"
            className="btn-secondary"
            style={{ fontSize: '0.85rem', padding: '8px 14px' }}
          >
            <Users size={16} />
            Clients
          </button>

          <button
            onClick={onOpenBranding}
            id="btn-branding-settings"
            className="btn-secondary"
            style={{ fontSize: '0.85rem', padding: '8px 14px' }}
          >
            <Palette size={16} />
            Branding & PDF
          </button>

          <button
            onClick={onOpenAiParser}
            id="btn-open-ai-parser"
            className="btn-ai-magic"
            style={{ fontSize: '0.85rem', padding: '8px 16px' }}
          >
            <Sparkles size={16} />
            AI Chat-to-Invoice
          </button>

          <button
            onClick={onOpenNewInvoice}
            id="btn-create-invoice"
            className="btn-primary"
            style={{ fontSize: '0.85rem', padding: '8px 16px' }}
          >
            <Plus size={16} />
            New Invoice
          </button>
        </div>
      </div>
    </header>
  );
}
