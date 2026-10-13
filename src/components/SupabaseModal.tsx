'use client';

import React, { useState } from 'react';
import {
  X,
  Database,
  Check,
  Copy,
  Terminal,
  ExternalLink,
  Shield,
  Layers,
} from 'lucide-react';
import { isSupabaseConfigured } from '@/lib/supabase';

interface SupabaseModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const SUPABASE_SCHEMA_PREVIEW = `-- =======================================================
-- ApexLedger Commercial Billing Engine - Supabase Schema
-- =======================================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. CLIENTS TABLE
CREATE TABLE IF NOT EXISTS clients (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    company TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT,
    address TEXT NOT NULL,
    tax_id TEXT,
    currency VARCHAR(10) DEFAULT 'USD',
    payment_terms VARCHAR(30) DEFAULT 'Net 30',
    avatar_color VARCHAR(20) DEFAULT '#6366f1',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. INVOICES TABLE
CREATE TABLE IF NOT EXISTS invoices (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    invoice_number VARCHAR(50) UNIQUE NOT NULL,
    client_id UUID REFERENCES clients(id) ON DELETE SET NULL,
    client_name TEXT NOT NULL,
    client_company TEXT NOT NULL,
    client_email TEXT NOT NULL,
    client_address TEXT NOT NULL,
    client_tax_id TEXT,
    issue_date DATE NOT NULL,
    due_date DATE NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'Draft' CHECK (status IN ('Draft', 'Sent', 'Paid', 'Overdue')),
    subtotal NUMERIC(12, 2) NOT NULL DEFAULT 0.00,
    tax_total NUMERIC(12, 2) NOT NULL DEFAULT 0.00,
    discount_total NUMERIC(12, 2) NOT NULL DEFAULT 0.00,
    total NUMERIC(12, 2) NOT NULL DEFAULT 0.00,
    amount_paid NUMERIC(12, 2) NOT NULL DEFAULT 0.00,
    currency VARCHAR(10) DEFAULT 'USD',
    notes TEXT,
    terms TEXT,
    payment_terms VARCHAR(30) DEFAULT 'Net 30',
    paid_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. INVOICE LINE ITEMS
CREATE TABLE IF NOT EXISTS invoice_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    invoice_id UUID NOT NULL REFERENCES invoices(id) ON DELETE CASCADE,
    description TEXT NOT NULL,
    category VARCHAR(30) NOT NULL DEFAULT 'Development',
    quantity NUMERIC(10, 2) NOT NULL DEFAULT 1.00,
    unit_price NUMERIC(12, 2) NOT NULL DEFAULT 0.00,
    tax_rate NUMERIC(5, 2) NOT NULL DEFAULT 0.00,
    discount NUMERIC(5, 2) DEFAULT 0.00,
    amount NUMERIC(12, 2) NOT NULL DEFAULT 0.00,
    notes TEXT,
    sort_order INT DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. AGENCY BRANDING
CREATE TABLE IF NOT EXISTS agency_branding (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    agency_name TEXT NOT NULL DEFAULT 'Apex Digital Studio',
    tagline TEXT DEFAULT 'High-Velocity Product Engineering',
    email TEXT DEFAULT 'billing@apexstudio.io',
    phone TEXT DEFAULT '+1 (415) 890-4211',
    website TEXT DEFAULT 'https://apexstudio.io',
    address TEXT DEFAULT '550 Montgomery St, Suite 700, San Francisco, CA 94111',
    tax_id TEXT DEFAULT 'US-EIN-93-8401928',
    currency VARCHAR(10) DEFAULT 'USD',
    primary_color VARCHAR(10) DEFAULT '#4f46e5',
    payment_instructions TEXT DEFAULT 'Wire transfer / ACH preferred.',
    bank_name TEXT DEFAULT 'Silicon Valley Bank / First Republic',
    account_number TEXT DEFAULT '••••••••8392',
    routing_number TEXT DEFAULT '••••0210',
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- INDEXES & ROW LEVEL SECURITY
CREATE INDEX IF NOT EXISTS idx_invoices_status ON invoices(status);
CREATE INDEX IF NOT EXISTS idx_invoices_client_id ON invoices(client_id);
ALTER TABLE clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE invoice_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE agency_branding ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow all clients" ON clients FOR ALL USING (true);
CREATE POLICY "Allow all invoices" ON invoices FOR ALL USING (true);
CREATE POLICY "Allow all items" ON invoice_items FOR ALL USING (true);
CREATE POLICY "Allow all branding" ON agency_branding FOR ALL USING (true);`;

export function SupabaseModal({ isOpen, onClose }: SupabaseModalProps) {
  const [copied, setCopied] = useState(false);
  const isConfigured = isSupabaseConfigured();

  if (!isOpen) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(SUPABASE_SCHEMA_PREVIEW);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-container"
        style={{ maxWidth: 880 }}
        onClick={(e) => e.stopPropagation()}
      >
        <div
          style={{
            padding: '20px 26px',
            borderBottom: '1px solid var(--border-subtle)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            background: 'rgba(18, 24, 38, 0.9)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div
              style={{
                width: 36,
                height: 36,
                borderRadius: 10,
                backgroundColor: 'rgba(16, 185, 129, 0.15)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Database size={18} color="#10b981" />
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#ffffff' }}>
                  Supabase Cloud Database & Schema
                </h3>
                <span
                  style={{
                    fontSize: '0.72rem',
                    padding: '2px 8px',
                    borderRadius: 999,
                    backgroundColor: isConfigured ? 'rgba(16, 185, 129, 0.2)' : 'rgba(245, 158, 11, 0.2)',
                    color: isConfigured ? '#34d399' : '#fbbf24',
                    border: `1px solid ${isConfigured ? 'rgba(16, 185, 129, 0.4)' : 'rgba(245, 158, 11, 0.4)'}`,
                  }}
                >
                  {isConfigured ? 'Connected' : 'Ready to Connect (Local Sync Active)'}
                </span>
              </div>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                Commercial PostgreSQL schema with RLS, ledger indexes, and client relations
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            id="btn-close-supabase"
            style={{ color: 'var(--text-muted)', padding: 6 }}
          >
            <X size={20} />
          </button>
        </div>

        <div
          style={{
            padding: '24px 26px',
            overflowY: 'auto',
            maxHeight: 'calc(90vh - 140px)',
            display: 'flex',
            flexDirection: 'column',
            gap: 20,
          }}
        >
          {/* Environment Variables Info */}
          <div className="glass-panel" style={{ padding: '16px 20px', backgroundColor: 'rgba(15, 23, 42, 0.8)' }}>
            <h4 style={{ fontSize: '0.85rem', fontWeight: 700, color: '#ffffff', marginBottom: 8, display: 'flex', alignItems: 'center', gap: 6 }}>
              <Terminal size={15} color="#10b981" />
              Environment Variables Configuration
            </h4>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: 12 }}>
              To connect your live Supabase instance, add the following to your <code>.env.local</code> file:
            </p>
            <pre
              style={{
                backgroundColor: '#090d16',
                padding: '12px 14px',
                borderRadius: 8,
                fontSize: '0.8rem',
                color: '#a5b4fc',
                fontFamily: 'var(--font-mono)',
                border: '1px solid var(--border-subtle)',
              }}
            >
{`NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`}
            </pre>
          </div>

          {/* SQL Migration Script Box */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
              <span style={{ fontSize: '0.825rem', fontWeight: 700, color: '#ffffff' }}>
                PostgreSQL Migration Script (Ready to Paste)
              </span>
              <button
                onClick={handleCopy}
                id="btn-copy-sql"
                className="btn-secondary"
                style={{ fontSize: '0.775rem', padding: '6px 12px' }}
              >
                {copied ? <Check size={14} color="#10b981" /> : <Copy size={14} />}
                {copied ? 'Copied to Clipboard!' : 'Copy SQL Schema'}
              </button>
            </div>
            <pre
              style={{
                backgroundColor: '#07090e',
                padding: '14px 16px',
                borderRadius: 8,
                fontSize: '0.775rem',
                color: '#e2e8f0',
                fontFamily: 'var(--font-mono)',
                maxHeight: 280,
                overflowY: 'auto',
                border: '1px solid var(--border-subtle)',
                lineHeight: 1.45,
              }}
            >
              {SUPABASE_SCHEMA_PREVIEW}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
}
