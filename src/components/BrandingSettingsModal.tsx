'use client';

import React, { useState } from 'react';
import {
  X,
  Palette,
  Save,
  Building,
  CreditCard,
  FileText,
  RotateCcw,
} from 'lucide-react';
import { AgencyBranding } from '@/types';
import { DEFAULT_BRANDING } from '@/lib/storage';

interface BrandingSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  branding: AgencyBranding;
  onSave: (updated: AgencyBranding) => void;
}

export function BrandingSettingsModal({
  isOpen,
  onClose,
  branding,
  onSave,
}: BrandingSettingsModalProps) {
  const [formData, setFormData] = useState<AgencyBranding>(branding);

  if (!isOpen) return null;

  const handleChange = (field: keyof AgencyBranding, val: string) => {
    setFormData({
      ...formData,
      [field]: val,
    });
  };

  const handleResetDefaults = () => {
    setFormData(DEFAULT_BRANDING);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-container"
        style={{ maxWidth: 840 }}
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
                backgroundColor: 'rgba(99, 102, 241, 0.15)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Palette size={18} color="var(--brand-primary)" />
            </div>
            <div>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#ffffff' }}>
                Agency Branding & PDF Pipeline Settings
              </h3>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                Customize visual identity, PDF styling, wire details, and invoice headers
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            id="btn-close-branding"
            style={{ color: 'var(--text-muted)', padding: 6 }}
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', flex: 1, overflow: 'hidden' }}>
          <div
            style={{
              padding: '24px 26px',
              overflowY: 'auto',
              maxHeight: 'calc(90vh - 150px)',
              display: 'flex',
              flexDirection: 'column',
              gap: 20,
            }}
          >
            {/* Identity Section */}
            <div>
              <h4 style={{ fontSize: '0.85rem', fontWeight: 700, color: '#818cf8', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: 12, display: 'flex', alignItems: 'center', gap: 6 }}>
                <Building size={15} />
                Agency Commercial Identity
              </h4>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                <div>
                  <label style={{ fontSize: '0.775rem', fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: 4 }}>
                    Agency Name
                  </label>
                  <input
                    type="text"
                    id="input-agency-name"
                    value={formData.agencyName}
                    onChange={(e) => handleChange('agencyName', e.target.value)}
                    style={{ width: '100%' }}
                    required
                  />
                </div>
                <div>
                  <label style={{ fontSize: '0.775rem', fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: 4 }}>
                    Tagline / Subheading
                  </label>
                  <input
                    type="text"
                    id="input-agency-tagline"
                    value={formData.tagline}
                    onChange={(e) => handleChange('tagline', e.target.value)}
                    style={{ width: '100%' }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '0.775rem', fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: 4 }}>
                    Billing Email
                  </label>
                  <input
                    type="email"
                    id="input-agency-email"
                    value={formData.email}
                    onChange={(e) => handleChange('email', e.target.value)}
                    style={{ width: '100%' }}
                    required
                  />
                </div>
                <div>
                  <label style={{ fontSize: '0.775rem', fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: 4 }}>
                    Phone Number
                  </label>
                  <input
                    type="text"
                    id="input-agency-phone"
                    value={formData.phone}
                    onChange={(e) => handleChange('phone', e.target.value)}
                    style={{ width: '100%' }}
                  />
                </div>
                <div style={{ gridColumn: 'span 2' }}>
                  <label style={{ fontSize: '0.775rem', fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: 4 }}>
                    Office Address
                  </label>
                  <input
                    type="text"
                    id="input-agency-address"
                    value={formData.address}
                    onChange={(e) => handleChange('address', e.target.value)}
                    style={{ width: '100%' }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '0.775rem', fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: 4 }}>
                    Tax ID / EIN / VAT
                  </label>
                  <input
                    type="text"
                    id="input-agency-taxid"
                    value={formData.taxId}
                    onChange={(e) => handleChange('taxId', e.target.value)}
                    style={{ width: '100%' }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '0.775rem', fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: 4 }}>
                    Brand Accent Color (Hex)
                  </label>
                  <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                    <input
                      type="color"
                      id="input-agency-color-picker"
                      value={formData.primaryColor || '#4f46e5'}
                      onChange={(e) => handleChange('primaryColor', e.target.value)}
                      style={{ width: 44, height: 40, padding: 2, cursor: 'pointer' }}
                    />
                    <input
                      type="text"
                      id="input-agency-color-text"
                      value={formData.primaryColor}
                      onChange={(e) => handleChange('primaryColor', e.target.value)}
                      style={{ flex: 1, fontFamily: 'var(--font-mono)' }}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Wire & Bank Instructions */}
            <div>
              <h4 style={{ fontSize: '0.85rem', fontWeight: 700, color: '#34d399', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: 12, display: 'flex', alignItems: 'center', gap: 6 }}>
                <CreditCard size={15} />
                Wire & Treasury Destination (Printed on PDF)
              </h4>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                <div>
                  <label style={{ fontSize: '0.775rem', fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: 4 }}>
                    Bank Name
                  </label>
                  <input
                    type="text"
                    id="input-agency-bank"
                    value={formData.bankName}
                    onChange={(e) => handleChange('bankName', e.target.value)}
                    style={{ width: '100%' }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '0.775rem', fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: 4 }}>
                    Account Number
                  </label>
                  <input
                    type="text"
                    id="input-agency-account"
                    value={formData.accountNumber}
                    onChange={(e) => handleChange('accountNumber', e.target.value)}
                    style={{ width: '100%' }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '0.775rem', fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: 4 }}>
                    Routing / ABA Number
                  </label>
                  <input
                    type="text"
                    id="input-agency-routing"
                    value={formData.routingNumber}
                    onChange={(e) => handleChange('routingNumber', e.target.value)}
                    style={{ width: '100%' }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '0.775rem', fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: 4 }}>
                    SWIFT / BIC (International)
                  </label>
                  <input
                    type="text"
                    id="input-agency-swift"
                    value={formData.swiftBic || ''}
                    onChange={(e) => handleChange('swiftBic', e.target.value)}
                    style={{ width: '100%' }}
                  />
                </div>
                <div style={{ gridColumn: 'span 2' }}>
                  <label style={{ fontSize: '0.775rem', fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: 4 }}>
                    Payment Instructions Memo
                  </label>
                  <input
                    type="text"
                    id="input-agency-paymemo"
                    value={formData.paymentInstructions}
                    onChange={(e) => handleChange('paymentInstructions', e.target.value)}
                    style={{ width: '100%' }}
                  />
                </div>
              </div>
            </div>

            {/* Standard Terms & Notes */}
            <div>
              <h4 style={{ fontSize: '0.85rem', fontWeight: 700, color: '#f59e0b', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: 12, display: 'flex', alignItems: 'center', gap: 6 }}>
                <FileText size={15} />
                Standard Terms & Boilerplate
              </h4>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 14 }}>
                <div>
                  <label style={{ fontSize: '0.775rem', fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: 4 }}>
                    Default Terms & Late Fee Policy
                  </label>
                  <textarea
                    rows={2}
                    id="input-agency-terms"
                    value={formData.terms}
                    onChange={(e) => handleChange('terms', e.target.value)}
                    style={{ width: '100%', fontSize: '0.85rem' }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div
            style={{
              padding: '16px 26px',
              borderTop: '1px solid var(--border-subtle)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              background: 'rgba(18, 24, 38, 0.95)',
            }}
          >
            <button
              type="button"
              onClick={handleResetDefaults}
              className="btn-secondary"
              style={{ fontSize: '0.8rem' }}
            >
              <RotateCcw size={13} />
              Reset Defaults
            </button>
            <div style={{ display: 'flex', gap: 10 }}>
              <button
                type="button"
                onClick={onClose}
                className="btn-secondary"
                style={{ fontSize: '0.85rem' }}
              >
                Cancel
              </button>
              <button
                type="submit"
                id="btn-save-branding"
                className="btn-primary"
                style={{ fontSize: '0.85rem' }}
              >
                <Save size={15} />
                Save Brand Settings
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
