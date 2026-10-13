'use client';

import React, { useState } from 'react';
import {
  X,
  Download,
  Printer,
  Sparkles,
  Palette,
  Check,
  FileCheck,
  Shield,
} from 'lucide-react';
import { pdf } from '@react-pdf/renderer';
import { Invoice, AgencyBranding } from '@/types';
import { InvoicePdfDocument } from '@/components/PdfDocument';
import { formatCurrency, formatDate } from '@/lib/formatters';

interface PdfPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  invoice: Invoice | null;
  branding: AgencyBranding;
  onUpdateBrandingColor?: (newColor: string) => void;
}

const BRAND_PALETTE = [
  { name: 'Indigo Luxe', hex: '#4f46e5' },
  { name: 'Emerald Vault', hex: '#059669' },
  { name: 'Royal Violet', hex: '#7c3aed' },
  { name: 'Obsidian Slate', hex: '#334155' },
  { name: 'Amber Gold', hex: '#d97706' },
  { name: 'Crimson Rose', hex: '#e11d48' },
];

export function PdfPreviewModal({
  isOpen,
  onClose,
  invoice,
  branding,
  onUpdateBrandingColor,
}: PdfPreviewModalProps) {
  const [activeColor, setActiveColor] = useState(branding.primaryColor || '#4f46e5');
  const [isDownloading, setIsDownloading] = useState(false);

  if (!isOpen || !invoice) return null;

  const currentBranding: AgencyBranding = {
    ...branding,
    primaryColor: activeColor,
  };

  const handleColorChange = (hex: string) => {
    setActiveColor(hex);
    if (onUpdateBrandingColor) {
      onUpdateBrandingColor(hex);
    }
  };

  // Direct Server Rendered PDF Pipeline
  const handleServerDownload = async () => {
    setIsDownloading(true);
    try {
      const response = await fetch('/api/invoices/render-pdf', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          invoice,
          branding: currentBranding,
        }),
      });

      if (!response.ok) {
        throw new Error('Server PDF route returned error');
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${invoice.invoiceNumber}_${invoice.clientCompany.replace(/[^a-zA-Z0-9]/g, '_')}.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (err) {
      console.warn('Falling back to client-side @react-pdf renderer generation...', err);
      // Client-side fallback using @react-pdf/renderer
      try {
        const docBlob = await pdf(
          (<InvoicePdfDocument invoice={invoice} branding={currentBranding} /> as any)
        ).toBlob();
        const url = URL.createObjectURL(docBlob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${invoice.invoiceNumber}.pdf`;
        a.click();
        URL.revokeObjectURL(url);
      } catch (clientErr) {
        alert('Could not generate PDF: ' + (clientErr as any).message);
      }
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-container"
        style={{ maxWidth: 1040, height: '94vh' }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Top Control Bar */}
        <div
          style={{
            padding: '16px 24px',
            borderBottom: '1px solid var(--border-subtle)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            background: 'rgba(18, 24, 38, 0.95)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div
              style={{
                width: 34,
                height: 34,
                borderRadius: 8,
                backgroundColor: 'rgba(99, 102, 241, 0.15)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <FileCheck size={18} color="var(--brand-primary)" />
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#ffffff' }}>
                  Client-Ready PDF Preview
                </h3>
                <span
                  style={{
                    fontSize: '0.72rem',
                    padding: '2px 8px',
                    borderRadius: 999,
                    backgroundColor: 'rgba(16, 185, 129, 0.15)',
                    color: '#34d399',
                    border: '1px solid rgba(16, 185, 129, 0.3)',
                  }}
                >
                  @react-pdf/renderer Engine
                </span>
              </div>
              <p style={{ fontSize: '0.775rem', color: 'var(--text-muted)' }}>
                {invoice.invoiceNumber} • {invoice.clientCompany}
              </p>
            </div>
          </div>

          {/* Quick Branding Color Switcher */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: 4 }}>
              <Palette size={13} />
              Brand Accent:
            </span>
            <div style={{ display: 'flex', gap: 6 }}>
              {BRAND_PALETTE.map((c) => (
                <button
                  key={c.hex}
                  id={`btn-color-theme-${c.name.toLowerCase().replace(/\s+/g, '-')}`}
                  onClick={() => handleColorChange(c.hex)}
                  title={c.name}
                  style={{
                    width: 20,
                    height: 20,
                    borderRadius: '50%',
                    backgroundColor: c.hex,
                    border: activeColor === c.hex ? '2px solid #ffffff' : '2px solid transparent',
                    boxShadow: activeColor === c.hex ? '0 0 8px ' + c.hex : 'none',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                  }}
                >
                  {activeColor === c.hex && <Check size={11} color="#ffffff" />}
                </button>
              ))}
            </div>
          </div>

          {/* Download & Close actions */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <button
              onClick={handleServerDownload}
              id="btn-download-pdf-modal"
              disabled={isDownloading}
              className="btn-primary"
              style={{ fontSize: '0.85rem', padding: '8px 16px' }}
            >
              <Download size={15} />
              {isDownloading ? 'Generating PDF...' : 'Download Official PDF'}
            </button>
            <button
              onClick={onClose}
              id="btn-close-pdf-preview"
              style={{ color: 'var(--text-muted)', padding: 6 }}
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* PDF Preview Canvas Area */}
        <div
          style={{
            flex: 1,
            overflowY: 'auto',
            padding: 30,
            background: '#04060a',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'flex-start',
          }}
        >
          {/* Simulated White Sheet matching exact A4 dimensions and typography */}
          <div
            id="pdf-render-canvas"
            style={{
              maxWidth: 780,
              width: '100%',
              backgroundColor: '#ffffff',
              color: '#1e293b',
              borderRadius: 4,
              boxShadow: '0 20px 60px rgba(0, 0, 0, 0.7), 0 0 0 1px rgba(255, 255, 255, 0.1)',
              padding: 44,
              position: 'relative',
              fontFamily: 'Helvetica, Arial, sans-serif',
            }}
          >
            {/* Top Brand Accent Stripe */}
            <div
              style={{
                height: 6,
                backgroundColor: activeColor,
                borderRadius: 3,
                marginBottom: 28,
              }}
            />

            {/* Header: Agency vs Invoice Meta */}
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'flex-start',
                marginBottom: 28,
              }}
            >
              <div>
                <h1 style={{ fontSize: '1.45rem', fontWeight: 800, color: '#0f172a', marginBottom: 2 }}>
                  {currentBranding.agencyName}
                </h1>
                <p style={{ fontSize: '0.825rem', color: '#64748b', marginBottom: 6 }}>
                  {currentBranding.tagline}
                </p>
                <p style={{ fontSize: '0.8rem', color: '#475569', lineHeight: 1.4 }}>
                  {currentBranding.address}<br />
                  {currentBranding.email} • {currentBranding.phone}<br />
                  Tax ID / VAT: {currentBranding.taxId}
                </p>
              </div>

              <div style={{ textAlign: 'right' }}>
                <div
                  style={{
                    fontSize: '1.8rem',
                    fontWeight: 800,
                    color: activeColor,
                    letterSpacing: '0.04em',
                    lineHeight: 1,
                  }}
                >
                  INVOICE
                </div>
                <div style={{ fontSize: '0.95rem', fontWeight: 700, color: '#334155', marginTop: 4, fontFamily: 'monospace' }}>
                  {invoice.invoiceNumber}
                </div>
                <div style={{ marginTop: 8 }}>
                  <span
                    style={{
                      display: 'inline-block',
                      padding: '3px 10px',
                      borderRadius: 4,
                      fontSize: '0.75rem',
                      fontWeight: 700,
                      textTransform: 'uppercase',
                      backgroundColor:
                        invoice.status === 'Paid'
                          ? '#dcfce7'
                          : invoice.status === 'Sent'
                          ? '#dbeafe'
                          : invoice.status === 'Overdue'
                          ? '#fee2e2'
                          : '#f1f5f9',
                      color:
                        invoice.status === 'Paid'
                          ? '#15803d'
                          : invoice.status === 'Sent'
                          ? '#1d4ed8'
                          : invoice.status === 'Overdue'
                          ? '#b91c1c'
                          : '#475569',
                    }}
                  >
                    ● {invoice.status}
                  </span>
                </div>
                <div style={{ marginTop: 8, fontSize: '0.8rem', color: '#475569' }}>
                  <div><strong>Issue Date:</strong> {formatDate(invoice.issueDate)}</div>
                  <div><strong>Due Date:</strong> {formatDate(invoice.dueDate)}</div>
                  <div><strong>Terms:</strong> {invoice.paymentTerms}</div>
                </div>
              </div>
            </div>

            {/* Billed To / Destination Box */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: 20,
                backgroundColor: '#f8fafc',
                border: '1px solid #e2e8f0',
                borderRadius: 6,
                padding: '16px 20px',
                marginBottom: 24,
              }}
            >
              <div>
                <div style={{ fontSize: '0.7rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 4 }}>
                  Billed To
                </div>
                <div style={{ fontSize: '0.95rem', fontWeight: 700, color: '#0f172a' }}>
                  {invoice.clientCompany}
                </div>
                <div style={{ fontSize: '0.825rem', color: '#475569', lineHeight: 1.4 }}>
                  Attn: {invoice.clientName}<br />
                  {invoice.clientEmail}<br />
                  {invoice.clientAddress}
                  {invoice.clientTaxId && <><br />Tax ID: {invoice.clientTaxId}</>}
                </div>
              </div>

              <div>
                <div style={{ fontSize: '0.7rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 4 }}>
                  Payment Destination
                </div>
                <div style={{ fontSize: '0.95rem', fontWeight: 700, color: '#0f172a' }}>
                  {currentBranding.agencyName}
                </div>
                <div style={{ fontSize: '0.825rem', color: '#475569', lineHeight: 1.4 }}>
                  Bank: {currentBranding.bankName}<br />
                  Account: {currentBranding.accountNumber}<br />
                  Routing: {currentBranding.routingNumber}<br />
                  SWIFT: {currentBranding.swiftBic || 'N/A'}
                </div>
              </div>
            </div>

            {/* Line Items Table */}
            <div style={{ marginBottom: 20 }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                <thead>
                  <tr
                    style={{
                      backgroundColor: '#f1f5f9',
                      borderTop: '1px solid #cbd5e1',
                      borderBottom: '1px solid #cbd5e1',
                      fontSize: '0.75rem',
                      fontWeight: 700,
                      color: '#334155',
                      textTransform: 'uppercase',
                    }}
                  >
                    <th style={{ padding: '8px 10px' }}>Description & Scope</th>
                    <th style={{ padding: '8px 10px', width: 110 }}>Category</th>
                    <th style={{ padding: '8px 10px', width: 65, textAlign: 'right' }}>Qty</th>
                    <th style={{ padding: '8px 10px', width: 95, textAlign: 'right' }}>Rate</th>
                    <th style={{ padding: '8px 10px', width: 65, textAlign: 'right' }}>Tax</th>
                    <th style={{ padding: '8px 10px', width: 105, textAlign: 'right' }}>Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {invoice.items.map((item, index) => (
                    <tr
                      key={item.id || index}
                      style={{
                        backgroundColor: index % 2 === 1 ? '#fafafa' : '#ffffff',
                        borderBottom: '1px solid #e2e8f0',
                        fontSize: '0.825rem',
                      }}
                    >
                      <td style={{ padding: '10px 10px' }}>
                        <div style={{ fontWeight: 600, color: '#0f172a' }}>
                          {item.description}
                        </div>
                        {item.notes && (
                          <div style={{ fontSize: '0.75rem', color: '#64748b' }}>
                            {item.notes}
                          </div>
                        )}
                      </td>
                      <td style={{ padding: '10px 10px' }}>
                        <span
                          style={{
                            fontSize: '0.7rem',
                            color: '#475569',
                            backgroundColor: '#f1f5f9',
                            padding: '2px 6px',
                            borderRadius: 3,
                          }}
                        >
                          {item.category}
                        </span>
                      </td>
                      <td style={{ padding: '10px 10px', textAlign: 'right', color: '#334155' }}>
                        {item.quantity}
                      </td>
                      <td style={{ padding: '10px 10px', textAlign: 'right', color: '#334155' }}>
                        {formatCurrency(item.unitPrice, invoice.currency)}
                      </td>
                      <td style={{ padding: '10px 10px', textAlign: 'right', color: '#334155' }}>
                        {item.taxRate > 0 ? `${item.taxRate}%` : '0%'}
                      </td>
                      <td style={{ padding: '10px 10px', textAlign: 'right', fontWeight: 700, color: '#0f172a' }}>
                        {formatCurrency(item.amount, invoice.currency)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Subtotal & Totals Box */}
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 28 }}>
              <div style={{ width: 260, fontSize: '0.85rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '4px 0', color: '#64748b' }}>
                  <span>Subtotal:</span>
                  <span style={{ fontWeight: 600, color: '#1e293b' }}>
                    {formatCurrency(invoice.subtotal, invoice.currency)}
                  </span>
                </div>
                {invoice.discountTotal > 0 && (
                  <div style={{ display: 'flex', justifyContent: 'space-between', padding: '4px 0', color: '#16a34a' }}>
                    <span>Discount:</span>
                    <span style={{ fontWeight: 600 }}>
                      -{formatCurrency(invoice.discountTotal, invoice.currency)}
                    </span>
                  </div>
                )}
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '4px 0', color: '#64748b' }}>
                  <span>Tax & VAT:</span>
                  <span style={{ fontWeight: 600, color: '#1e293b' }}>
                    {formatCurrency(invoice.taxTotal, invoice.currency)}
                  </span>
                </div>
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    backgroundColor: activeColor,
                    color: '#ffffff',
                    padding: '8px 12px',
                    borderRadius: 4,
                    marginTop: 8,
                  }}
                >
                  <span style={{ fontSize: '0.85rem', fontWeight: 700 }}>TOTAL AMOUNT DUE:</span>
                  <span style={{ fontSize: '1.05rem', fontWeight: 800 }}>
                    {formatCurrency(invoice.total, invoice.currency)}
                  </span>
                </div>
              </div>
            </div>

            {/* Notes & Bank Details */}
            <div
              style={{
                borderTop: '1px solid #e2e8f0',
                paddingTop: 16,
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: 20,
                fontSize: '0.775rem',
                color: '#475569',
              }}
            >
              <div>
                <div style={{ fontWeight: 700, color: '#334155', textTransform: 'uppercase', marginBottom: 4, fontSize: '0.72rem' }}>
                  Wire Payment Instructions
                </div>
                <p style={{ lineHeight: 1.4 }}>{currentBranding.paymentInstructions}</p>
                <div style={{ marginTop: 6, padding: '8px 10px', backgroundColor: '#f8fafc', borderRadius: 4, border: '1px solid #e2e8f0' }}>
                  Wire Beneficiary: {currentBranding.agencyName}<br />
                  Account: {currentBranding.accountNumber} | Routing: {currentBranding.routingNumber}
                </div>
              </div>

              <div>
                <div style={{ fontWeight: 700, color: '#334155', textTransform: 'uppercase', marginBottom: 4, fontSize: '0.72rem' }}>
                  Terms & Conditions
                </div>
                <p style={{ lineHeight: 1.4 }}>{invoice.terms || currentBranding.terms}</p>
                {invoice.notes && (
                  <p style={{ marginTop: 6, fontStyle: 'italic', color: '#64748b' }}>
                    Note: {invoice.notes}
                  </p>
                )}
              </div>
            </div>

            {/* Footer */}
            <div
              style={{
                marginTop: 30,
                borderTop: '1px solid #f1f5f9',
                paddingTop: 8,
                textAlign: 'center',
                fontSize: '0.7rem',
                color: '#94a3b8',
              }}
            >
              {currentBranding.agencyName} • {currentBranding.website} • Commercial Invoice
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
