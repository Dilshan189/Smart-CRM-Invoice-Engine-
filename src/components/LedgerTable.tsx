'use client';

import React, { useState, useMemo } from 'react';
import {
  Search,
  Filter,
  Download,
  Eye,
  Edit3,
  Trash2,
  CheckCircle2,
  Send,
  Clock,
  AlertCircle,
  FileText,
  Copy,
  ChevronDown,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { Invoice, InvoiceStatus, AgencyBranding } from '@/types';
import { formatCurrency, formatDate, calculateDaysDifference } from '@/lib/formatters';

interface LedgerTableProps {
  invoices: Invoice[];
  branding: AgencyBranding;
  onSelectInvoice: (invoice: Invoice) => void;
  onEditInvoice: (invoice: Invoice) => void;
  onPreviewPdf: (invoice: Invoice) => void;
  onStatusChange: (invoiceId: string, status: InvoiceStatus) => void;
  onDeleteInvoice: (invoiceId: string) => void;
  onDuplicateInvoice: (invoice: Invoice) => void;
}

export function LedgerTable({
  invoices,
  branding,
  onSelectInvoice,
  onEditInvoice,
  onPreviewPdf,
  onStatusChange,
  onDeleteInvoice,
  onDuplicateInvoice,
}: LedgerTableProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'All' | InvoiceStatus>('All');
  const [downloadingId, setDownloadingId] = useState<string | null>(null);

  // Filtered and searched invoices
  const filteredInvoices = useMemo(() => {
    return invoices.filter((inv) => {
      const matchesStatus =
        statusFilter === 'All' ? true : inv.status === statusFilter;
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        inv.invoiceNumber.toLowerCase().includes(q) ||
        inv.clientCompany.toLowerCase().includes(q) ||
        inv.clientName.toLowerCase().includes(q) ||
        inv.items.some((item) => item.description.toLowerCase().includes(q));
      return matchesStatus && matchesSearch;
    });
  }, [invoices, statusFilter, searchQuery]);

  // Counts for tabs
  const counts = useMemo(() => {
    return {
      All: invoices.length,
      Draft: invoices.filter((i) => i.status === 'Draft').length,
      Sent: invoices.filter((i) => i.status === 'Sent').length,
      Paid: invoices.filter((i) => i.status === 'Paid').length,
      Overdue: invoices.filter((i) => i.status === 'Overdue').length,
    };
  }, [invoices]);

  // Handle Mark as Paid with confetti celebration
  const handleMarkAsPaid = (e: React.MouseEvent, inv: Invoice) => {
    e.stopPropagation();
    onStatusChange(inv.id, 'Paid');

    // Trigger celebratory particle blast
    try {
      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.7 },
        colors: ['#10b981', '#3b82f6', '#8b5cf6', '#ec4899'],
      });
    } catch {
      // ignore
    }
  };

  // Direct Server PDF Download Pipeline
  const handleDirectPdfDownload = async (e: React.MouseEvent, invoice: Invoice) => {
    e.stopPropagation();
    setDownloadingId(invoice.id);
    try {
      const response = await fetch('/api/invoices/render-pdf', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ invoice, branding }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate PDF on server');
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
      console.error(err);
      // Fallback: open preview modal
      onPreviewPdf(invoice);
    } finally {
      setDownloadingId(null);
    }
  };

  return (
    <div className="glass-panel" style={{ padding: '24px 28px', overflow: 'hidden' }}>
      {/* Table Toolbar Header */}
      <div style={{
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        alignItems: 'center',
        gap: 16,
        marginBottom: 24,
      }}>
        <div>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#ffffff', letterSpacing: '-0.02em', marginBottom: 4 }}>
            Commercial Billing Ledger
          </h2>
          <p style={{ fontSize: '0.825rem', color: 'var(--text-secondary)' }}>
            Real-time status tracking, audit trail, and server-side PDF download pipeline
          </p>
        </div>

        {/* Search input */}
        <div style={{ position: 'relative', minWidth: 280, maxWidth: 360, width: '100%' }}>
          <Search size={16} color="var(--text-muted)" style={{ position: 'absolute', left: 14, top: 12 }} />
          <input
            type="text"
            id="input-ledger-search"
            placeholder="Search invoice #, client, deliverable..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{ width: '100%', paddingLeft: 40 }}
          />
        </div>
      </div>

      {/* Filter Tabs */}
      <div style={{
        display: 'flex',
        gap: 8,
        borderBottom: '1px solid var(--border-subtle)',
        paddingBottom: 14,
        marginBottom: 16,
        overflowX: 'auto',
      }}>
        {(['All', 'Draft', 'Sent', 'Paid', 'Overdue'] as const).map((tab) => {
          const isActive = statusFilter === tab;
          return (
            <button
              key={tab}
              id={`tab-filter-${tab.toLowerCase()}`}
              onClick={() => setStatusFilter(tab)}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 8,
                padding: '8px 16px',
                borderRadius: 999,
                fontSize: '0.825rem',
                fontWeight: 600,
                backgroundColor: isActive ? 'var(--brand-primary)' : 'rgba(255, 255, 255, 0.04)',
                color: isActive ? '#ffffff' : 'var(--text-secondary)',
                border: `1px solid ${isActive ? 'var(--brand-primary)' : 'var(--border-subtle)'}`,
                boxShadow: isActive ? '0 4px 12px rgba(99, 102, 241, 0.35)' : 'none',
              }}
            >
              <span>{tab === 'All' ? 'All Invoices' : tab}</span>
              <span style={{
                fontSize: '0.72rem',
                padding: '1px 6px',
                borderRadius: 999,
                backgroundColor: isActive ? 'rgba(255, 255, 255, 0.25)' : 'rgba(255, 255, 255, 0.08)',
                color: isActive ? '#ffffff' : 'var(--text-muted)',
              }}>
                {counts[tab]}
              </span>
            </button>
          );
        })}
      </div>

      {/* Table Container */}
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: 860 }}>
          <thead>
            <tr style={{
              borderBottom: '1px solid var(--border-subtle)',
              fontSize: '0.775rem',
              textTransform: 'uppercase',
              color: 'var(--text-muted)',
              letterSpacing: '0.05em',
            }}>
              <th style={{ padding: '12px 14px' }}>Invoice</th>
              <th style={{ padding: '12px 14px' }}>Client</th>
              <th style={{ padding: '12px 14px' }}>Dates & Aging</th>
              <th style={{ padding: '12px 14px' }}>Deliverables</th>
              <th style={{ padding: '12px 14px', textAlign: 'right' }}>Amount Due</th>
              <th style={{ padding: '12px 14px', textAlign: 'center' }}>Status</th>
              <th style={{ padding: '12px 14px', textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredInvoices.length === 0 ? (
              <tr>
                <td colSpan={7} style={{ textAlign: 'center', padding: '48px 16px' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10 }}>
                    <FileText size={40} color="var(--text-muted)" />
                    <p style={{ color: 'var(--text-secondary)', fontWeight: 600 }}>No invoices matching filter</p>
                    <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                      Try adjusting your search criteria or create a new invoice.
                    </p>
                  </div>
                </td>
              </tr>
            ) : (
              filteredInvoices.map((inv) => {
                const aging = calculateDaysDifference(inv.dueDate);
                const isPaid = inv.status === 'Paid';
                const isOverdue = inv.status === 'Overdue';

                return (
                  <tr
                    key={inv.id}
                    id={`invoice-row-${inv.id}`}
                    onClick={() => onSelectInvoice(inv)}
                    style={{
                      borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
                      transition: 'background-color 0.15s ease',
                      cursor: 'pointer',
                    }}
                    onMouseEnter={(e) => {
                      (e.currentTarget as HTMLElement).style.backgroundColor = 'rgba(255, 255, 255, 0.03)';
                    }}
                    onMouseLeave={(e) => {
                      (e.currentTarget as HTMLElement).style.backgroundColor = 'transparent';
                    }}
                  >
                    {/* Invoice ID */}
                    <td style={{ padding: '16px 14px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <div style={{
                          width: 8,
                          height: 8,
                          borderRadius: '50%',
                          backgroundColor:
                            inv.status === 'Paid'
                              ? '#10b981'
                              : inv.status === 'Sent'
                              ? '#3b82f6'
                              : inv.status === 'Overdue'
                              ? '#ef4444'
                              : '#94a3b8',
                        }} />
                        <div>
                          <div style={{ fontWeight: 700, color: '#ffffff', fontSize: '0.925rem', fontFamily: 'var(--font-mono)' }}>
                            {inv.invoiceNumber}
                          </div>
                          <div style={{ fontSize: '0.725rem', color: 'var(--text-muted)' }}>
                            {inv.paymentTerms}
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Client Details */}
                    <td style={{ padding: '16px 14px' }}>
                      <div style={{ fontWeight: 600, color: 'var(--text-primary)', fontSize: '0.9rem' }}>
                        {inv.clientCompany}
                      </div>
                      <div style={{ fontSize: '0.775rem', color: 'var(--text-muted)' }}>
                        {inv.clientName}
                      </div>
                    </td>

                    {/* Dates & Aging */}
                    <td style={{ padding: '16px 14px' }}>
                      <div style={{ fontSize: '0.825rem', color: 'var(--text-primary)' }}>
                        Due {formatDate(inv.dueDate)}
                      </div>
                      <div style={{ fontSize: '0.725rem', color: isOverdue ? '#f87171' : 'var(--text-muted)' }}>
                        {isPaid
                          ? `Paid on ${formatDate(inv.paidAt || inv.updatedAt)}`
                          : aging.isOverdue
                          ? `${aging.days} days overdue`
                          : `${aging.days} days remaining`}
                      </div>
                    </td>

                    {/* Deliverables snippet */}
                    <td style={{ padding: '16px 14px', maxWidth: 220 }}>
                      <div style={{
                        fontSize: '0.825rem',
                        color: 'var(--text-secondary)',
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                      }}>
                        {inv.items[0]?.description || 'Service Deliverable'}
                      </div>
                      <div style={{ fontSize: '0.725rem', color: 'var(--text-muted)' }}>
                        {inv.items.length} line item{inv.items.length !== 1 ? 's' : ''} • {inv.items[0]?.category}
                      </div>
                    </td>

                    {/* Amount */}
                    <td style={{ padding: '16px 14px', textAlign: 'right' }}>
                      <div style={{ fontWeight: 700, color: '#ffffff', fontSize: '0.95rem' }}>
                        {formatCurrency(inv.total, inv.currency)}
                      </div>
                      {inv.amountPaid > 0 && inv.amountPaid < inv.total && (
                        <div style={{ fontSize: '0.725rem', color: '#10b981' }}>
                          Paid: {formatCurrency(inv.amountPaid, inv.currency)}
                        </div>
                      )}
                    </td>

                    {/* Status Dropdown */}
                    <td style={{ padding: '16px 14px', textAlign: 'center' }}>
                      <div style={{ position: 'relative', display: 'inline-block' }} onClick={(e) => e.stopPropagation()}>
                        <select
                          id={`select-status-${inv.id}`}
                          value={inv.status}
                          onChange={(e) => onStatusChange(inv.id, e.target.value as InvoiceStatus)}
                          className={`status-badge ${inv.status}`}
                          style={{
                            appearance: 'none',
                            WebkitAppearance: 'none',
                            cursor: 'pointer',
                            paddingRight: 22,
                            paddingLeft: 10,
                            paddingTop: 4,
                            paddingBottom: 4,
                            border: '1px solid currentColor',
                          }}
                        >
                          <option value="Draft" style={{ background: '#121826', color: '#94a3b8' }}>Draft</option>
                          <option value="Sent" style={{ background: '#121826', color: '#3b82f6' }}>Sent</option>
                          <option value="Paid" style={{ background: '#121826', color: '#10b981' }}>Paid</option>
                          <option value="Overdue" style={{ background: '#121826', color: '#ef4444' }}>Overdue</option>
                        </select>
                        <ChevronDown size={11} style={{ position: 'absolute', right: 7, top: 9, pointerEvents: 'none' }} />
                      </div>
                    </td>

                    {/* Actions */}
                    <td style={{ padding: '16px 14px', textAlign: 'right' }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 6 }} onClick={(e) => e.stopPropagation()}>
                        {/* Quick Mark Paid button if not yet paid */}
                        {!isPaid && (
                          <button
                            id={`btn-mark-paid-${inv.id}`}
                            onClick={(e) => handleMarkAsPaid(e, inv)}
                            style={{
                              padding: '6px 8px',
                              borderRadius: 6,
                              backgroundColor: 'rgba(16, 185, 129, 0.12)',
                              color: '#10b981',
                              border: '1px solid rgba(16, 185, 129, 0.25)',
                              fontSize: '0.75rem',
                              fontWeight: 600,
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: 4,
                            }}
                            title="Mark as Paid & record payment"
                          >
                            <CheckCircle2 size={13} />
                            Paid
                          </button>
                        )}

                        {/* Live PDF Preview */}
                        <button
                          id={`btn-preview-pdf-${inv.id}`}
                          onClick={() => onPreviewPdf(inv)}
                          style={{
                            padding: '6px',
                            borderRadius: 6,
                            backgroundColor: 'rgba(255, 255, 255, 0.05)',
                            color: 'var(--text-secondary)',
                          }}
                          title="Preview Client-Ready PDF"
                        >
                          <Eye size={15} />
                        </button>

                        {/* Direct Server PDF Download Pipeline */}
                        <button
                          id={`btn-download-pdf-${inv.id}`}
                          onClick={(e) => handleDirectPdfDownload(e, inv)}
                          disabled={downloadingId === inv.id}
                          style={{
                            padding: '6px',
                            borderRadius: 6,
                            backgroundColor: 'rgba(99, 102, 241, 0.12)',
                            color: '#818cf8',
                            border: '1px solid rgba(99, 102, 241, 0.2)',
                          }}
                          title="Download Server Rendered PDF"
                        >
                          <Download size={15} />
                        </button>

                        {/* Edit */}
                        <button
                          id={`btn-edit-inv-${inv.id}`}
                          onClick={() => onEditInvoice(inv)}
                          style={{
                            padding: '6px',
                            borderRadius: 6,
                            backgroundColor: 'rgba(255, 255, 255, 0.05)',
                            color: 'var(--text-secondary)',
                          }}
                          title="Edit Invoice Details"
                        >
                          <Edit3 size={15} />
                        </button>

                        {/* Duplicate */}
                        <button
                          id={`btn-duplicate-inv-${inv.id}`}
                          onClick={() => onDuplicateInvoice(inv)}
                          style={{
                            padding: '6px',
                            borderRadius: 6,
                            backgroundColor: 'rgba(255, 255, 255, 0.05)',
                            color: 'var(--text-secondary)',
                          }}
                          title="Duplicate Invoice"
                        >
                          <Copy size={15} />
                        </button>

                        {/* Delete */}
                        <button
                          id={`btn-delete-inv-${inv.id}`}
                          onClick={() => {
                            if (confirm(`Delete ${inv.invoiceNumber} permanently?`)) {
                              onDeleteInvoice(inv.id);
                            }
                          }}
                          style={{
                            padding: '6px',
                            borderRadius: 6,
                            backgroundColor: 'rgba(239, 68, 68, 0.1)',
                            color: '#f87171',
                          }}
                          title="Delete"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
