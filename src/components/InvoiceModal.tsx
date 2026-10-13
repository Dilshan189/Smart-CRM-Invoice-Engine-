'use client';

import React, { useState, useEffect } from 'react';
import {
  X,
  Plus,
  Trash2,
  Sparkles,
  Save,
  Send,
  Calendar,
  Building,
  DollarSign,
  FileText,
} from 'lucide-react';
import {
  Invoice,
  InvoiceItem,
  Client,
  InvoiceStatus,
  PaymentTerms,
  AgencyBranding,
} from '@/types';
import { formatCurrency } from '@/lib/formatters';

interface InvoiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (invoice: Invoice) => void;
  initialInvoice?: Invoice | null;
  clients: Client[];
  branding: AgencyBranding;
  onOpenAiParser: () => void;
}

export function InvoiceModal({
  isOpen,
  onClose,
  onSave,
  initialInvoice,
  clients,
  branding,
  onOpenAiParser,
}: InvoiceModalProps) {
  const [selectedClientId, setSelectedClientId] = useState('');
  const [invoiceNumber, setInvoiceNumber] = useState('');
  const [issueDate, setIssueDate] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [status, setStatus] = useState<InvoiceStatus>('Draft');
  const [paymentTerms, setPaymentTerms] = useState<PaymentTerms>('Net 30');
  const [currency, setCurrency] = useState('USD');
  const [items, setItems] = useState<InvoiceItem[]>([]);
  const [notes, setNotes] = useState('');
  const [terms, setTerms] = useState('');

  // Synchronize state when opening or when initialInvoice changes
  useEffect(() => {
    if (initialInvoice) {
      setSelectedClientId(initialInvoice.clientId);
      setInvoiceNumber(initialInvoice.invoiceNumber);
      setIssueDate(initialInvoice.issueDate);
      setDueDate(initialInvoice.dueDate);
      setStatus(initialInvoice.status);
      setPaymentTerms(initialInvoice.paymentTerms);
      setCurrency(initialInvoice.currency);
      setItems(initialInvoice.items);
      setNotes(initialInvoice.notes || '');
      setTerms(initialInvoice.terms || branding.terms || '');
    } else {
      const today = new Date().toISOString().split('T')[0];
      const due = new Date();
      due.setDate(due.getDate() + 30);
      const defaultClient = clients[0];

      const randomNum = Math.floor(100 + Math.random() * 900);
      setInvoiceNumber(`${branding.invoicePrefix || 'INV'}-2025-${randomNum}`);
      setSelectedClientId(defaultClient ? defaultClient.id : '');
      setIssueDate(today);
      setDueDate(due.toISOString().split('T')[0]);
      setStatus('Draft');
      setPaymentTerms(defaultClient ? defaultClient.paymentTerms : 'Net 30');
      setCurrency(branding.currency || 'USD');
      setNotes(branding.notes || '');
      setTerms(branding.terms || '');
      setItems([
        {
          id: `item_${Date.now()}_1`,
          description: 'High-Velocity Product Engineering Sprint',
          category: 'Development',
          quantity: 20,
          unitPrice: 150,
          taxRate: 0,
          discount: 0,
          amount: 3000,
        },
      ]);
    }
  }, [initialInvoice, isOpen, clients, branding]);

  if (!isOpen) return null;

  const currentClient = clients.find((c) => c.id === selectedClientId) || clients[0];

  const handleClientSelect = (clientId: string) => {
    setSelectedClientId(clientId);
    const cl = clients.find((c) => c.id === clientId);
    if (cl) {
      setPaymentTerms(cl.paymentTerms);
      setCurrency(cl.currency || 'USD');
      // Adjust due date based on payment terms
      const now = new Date(issueDate || new Date());
      let days = 30;
      if (cl.paymentTerms === 'Net 15') days = 15;
      else if (cl.paymentTerms === 'Net 45') days = 45;
      else if (cl.paymentTerms === 'Net 60') days = 60;
      else if (cl.paymentTerms === 'Due on Receipt') days = 0;
      now.setDate(now.getDate() + days);
      setDueDate(now.toISOString().split('T')[0]);
    }
  };

  const handleAddItem = () => {
    const newItem: InvoiceItem = {
      id: `item_${Date.now()}`,
      description: 'Consulting & Deliverable Item',
      category: 'Development',
      quantity: 1,
      unitPrice: 150,
      taxRate: 0,
      discount: 0,
      amount: 150,
    };
    setItems([...items, newItem]);
  };

  const handleUpdateItem = (
    index: number,
    field: keyof InvoiceItem,
    val: any
  ) => {
    const updated = [...items];
    updated[index] = {
      ...updated[index],
      [field]: val,
    };
    // Recompute amount
    const qty = field === 'quantity' ? val : updated[index].quantity;
    const price = field === 'unitPrice' ? val : updated[index].unitPrice;
    const disc = field === 'discount' ? val : updated[index].discount || 0;
    const base = qty * price;
    const discAmount = (base * disc) / 100;
    updated[index].amount = Math.max(0, base - discAmount);

    setItems(updated);
  };

  const handleRemoveItem = (index: number) => {
    if (items.length <= 1) return;
    setItems(items.filter((_, i) => i !== index));
  };

  // Calculations
  const subtotal = items.reduce(
    (sum, item) => sum + item.quantity * item.unitPrice,
    0
  );
  const discountTotal = items.reduce((sum, item) => {
    const disc = item.discount || 0;
    return sum + (item.quantity * item.unitPrice * disc) / 100;
  }, 0);
  const taxTotal = items.reduce((sum, item) => {
    const itemAmount = item.quantity * item.unitPrice * (1 - (item.discount || 0) / 100);
    return sum + (itemAmount * (item.taxRate || 0)) / 100;
  }, 0);
  const total = subtotal - discountTotal + taxTotal;

  const handleSaveInvoice = (statusToSave: InvoiceStatus) => {
    const finalClient = currentClient || {
      id: 'custom_client',
      name: 'Direct Client',
      company: 'Client Company',
      email: 'client@example.com',
      address: 'Corporate Headquarters',
      currency: 'USD',
      paymentTerms: 'Net 30',
      createdAt: new Date().toISOString(),
    };

    const invoiceToSave: Invoice = {
      id: initialInvoice ? initialInvoice.id : `inv_${Date.now()}`,
      invoiceNumber: invoiceNumber.trim() || 'INV-2025-001',
      clientId: finalClient.id,
      clientName: finalClient.name,
      clientCompany: finalClient.company,
      clientEmail: finalClient.email,
      clientAddress: finalClient.address,
      clientTaxId: finalClient.taxId,
      issueDate: issueDate || new Date().toISOString().split('T')[0],
      dueDate: dueDate || new Date().toISOString().split('T')[0],
      status: statusToSave,
      items,
      subtotal,
      discountTotal,
      taxTotal,
      total,
      amountPaid: statusToSave === 'Paid' ? total : initialInvoice?.amountPaid || 0,
      currency,
      notes,
      terms,
      paymentTerms,
      createdAt: initialInvoice?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      paidAt: statusToSave === 'Paid' ? new Date().toISOString() : undefined,
    };

    onSave(invoiceToSave);
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-container"
        style={{ maxWidth: 960 }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div
          style={{
            padding: '20px 28px',
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
              <FileText size={18} color="var(--brand-primary)" />
            </div>
            <div>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#ffffff' }}>
                {initialInvoice ? `Edit Invoice: ${initialInvoice.invoiceNumber}` : 'Create Commercial Invoice'}
              </h3>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                Structured billing registry entry with dynamic tax and PDF rendering
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <button
              onClick={onOpenAiParser}
              id="btn-modal-open-ai"
              className="btn-ai-magic"
              style={{ padding: '7px 14px', fontSize: '0.8rem' }}
              title="Parse raw chat log and insert items"
            >
              <Sparkles size={14} />
              AI Chat Parser
            </button>
            <button
              onClick={onClose}
              id="btn-close-invoice-modal"
              style={{ color: 'var(--text-muted)', padding: 6 }}
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Scrollable Form Body */}
        <div
          style={{
            padding: '24px 28px',
            overflowY: 'auto',
            maxHeight: 'calc(90vh - 150px)',
            display: 'flex',
            flexDirection: 'column',
            gap: 22,
          }}
        >
          {/* Top Section: Client & Invoice Metadata */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: 16,
              background: 'rgba(255, 255, 255, 0.02)',
              padding: 18,
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border-subtle)',
            }}
          >
            {/* Client Picker */}
            <div>
              <label style={{ fontSize: '0.775rem', fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: 6 }}>
                Client / Organization
              </label>
              <select
                id="select-invoice-client"
                value={selectedClientId}
                onChange={(e) => handleClientSelect(e.target.value)}
                style={{ width: '100%' }}
              >
                {clients.map((c) => (
                  <option key={c.id} value={c.id} style={{ background: '#121826' }}>
                    {c.company} ({c.name})
                  </option>
                ))}
              </select>
            </div>

            {/* Invoice Number */}
            <div>
              <label style={{ fontSize: '0.775rem', fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: 6 }}>
                Invoice Identifier
              </label>
              <input
                type="text"
                id="input-invoice-number"
                value={invoiceNumber}
                onChange={(e) => setInvoiceNumber(e.target.value)}
                placeholder="INV-2025-001"
                style={{ width: '100%', fontFamily: 'var(--font-mono)' }}
              />
            </div>

            {/* Issue Date */}
            <div>
              <label style={{ fontSize: '0.775rem', fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: 6 }}>
                Issue Date
              </label>
              <input
                type="date"
                id="input-invoice-issue-date"
                value={issueDate}
                onChange={(e) => setIssueDate(e.target.value)}
                style={{ width: '100%' }}
              />
            </div>

            {/* Due Date */}
            <div>
              <label style={{ fontSize: '0.775rem', fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: 6 }}>
                Due Date
              </label>
              <input
                type="date"
                id="input-invoice-due-date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                style={{ width: '100%' }}
              />
            </div>

            {/* Status */}
            <div>
              <label style={{ fontSize: '0.775rem', fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: 6 }}>
                Initial Status
              </label>
              <select
                id="select-invoice-status"
                value={status}
                onChange={(e) => setStatus(e.target.value as InvoiceStatus)}
                style={{ width: '100%' }}
              >
                <option value="Draft" style={{ background: '#121826' }}>Draft</option>
                <option value="Sent" style={{ background: '#121826' }}>Sent</option>
                <option value="Paid" style={{ background: '#121826' }}>Paid</option>
                <option value="Overdue" style={{ background: '#121826' }}>Overdue</option>
              </select>
            </div>

            {/* Payment Terms */}
            <div>
              <label style={{ fontSize: '0.775rem', fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: 6 }}>
                Payment Terms
              </label>
              <select
                id="select-invoice-terms"
                value={paymentTerms}
                onChange={(e) => setPaymentTerms(e.target.value as PaymentTerms)}
                style={{ width: '100%' }}
              >
                <option value="Due on Receipt" style={{ background: '#121826' }}>Due on Receipt</option>
                <option value="Net 15" style={{ background: '#121826' }}>Net 15</option>
                <option value="Net 30" style={{ background: '#121826' }}>Net 30</option>
                <option value="Net 45" style={{ background: '#121826' }}>Net 45</option>
                <option value="Net 60" style={{ background: '#121826' }}>Net 60</option>
              </select>
            </div>
          </div>

          {/* Line Items Table */}
          <div>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: 12,
              }}
            >
              <span style={{ fontSize: '0.9rem', fontWeight: 700, color: '#ffffff' }}>
                Tabular Billable Deliverables
              </span>
              <button
                type="button"
                id="btn-add-line-item"
                onClick={handleAddItem}
                className="btn-secondary"
                style={{ fontSize: '0.8rem', padding: '6px 12px' }}
              >
                <Plus size={14} />
                Add Line Item
              </button>
            </div>

            <div style={{ overflowX: 'auto', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-md)' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: 700 }}>
                <thead>
                  <tr
                    style={{
                      background: 'rgba(255, 255, 255, 0.03)',
                      borderBottom: '1px solid var(--border-subtle)',
                      fontSize: '0.75rem',
                      color: 'var(--text-muted)',
                      textTransform: 'uppercase',
                    }}
                  >
                    <th style={{ padding: '10px 12px' }}>Description</th>
                    <th style={{ padding: '10px 12px', width: 130 }}>Category</th>
                    <th style={{ padding: '10px 12px', width: 80, textAlign: 'right' }}>Qty/Hrs</th>
                    <th style={{ padding: '10px 12px', width: 100, textAlign: 'right' }}>Rate ({currency})</th>
                    <th style={{ padding: '10px 12px', width: 75, textAlign: 'right' }}>Tax %</th>
                    <th style={{ padding: '10px 12px', width: 75, textAlign: 'right' }}>Disc %</th>
                    <th style={{ padding: '10px 12px', width: 110, textAlign: 'right' }}>Total</th>
                    <th style={{ padding: '10px 12px', width: 40 }} />
                  </tr>
                </thead>
                <tbody>
                  {items.map((item, idx) => (
                    <tr
                      key={item.id || idx}
                      style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.05)' }}
                    >
                      <td style={{ padding: '10px 12px' }}>
                        <input
                          type="text"
                          value={item.description}
                          onChange={(e) => handleUpdateItem(idx, 'description', e.target.value)}
                          placeholder="Deliverable description"
                          style={{ width: '100%', fontSize: '0.85rem' }}
                        />
                      </td>
                      <td style={{ padding: '10px 12px' }}>
                        <select
                          value={item.category}
                          onChange={(e) => handleUpdateItem(idx, 'category', e.target.value)}
                          style={{ width: '100%', fontSize: '0.8rem' }}
                        >
                          <option value="Development">Development</option>
                          <option value="Design">Design</option>
                          <option value="Strategy">Strategy</option>
                          <option value="Infrastructure">Infrastructure</option>
                          <option value="Retainer">Retainer</option>
                          <option value="Expenses">Expenses</option>
                          <option value="General">General</option>
                        </select>
                      </td>
                      <td style={{ padding: '10px 12px', textAlign: 'right' }}>
                        <input
                          type="number"
                          min="0.25"
                          step="0.5"
                          value={item.quantity}
                          onChange={(e) =>
                            handleUpdateItem(idx, 'quantity', parseFloat(e.target.value) || 0)
                          }
                          style={{ width: 70, textAlign: 'right', fontSize: '0.85rem' }}
                        />
                      </td>
                      <td style={{ padding: '10px 12px', textAlign: 'right' }}>
                        <input
                          type="number"
                          min="0"
                          step="5"
                          value={item.unitPrice}
                          onChange={(e) =>
                            handleUpdateItem(idx, 'unitPrice', parseFloat(e.target.value) || 0)
                          }
                          style={{ width: 85, textAlign: 'right', fontSize: '0.85rem' }}
                        />
                      </td>
                      <td style={{ padding: '10px 12px', textAlign: 'right' }}>
                        <input
                          type="number"
                          min="0"
                          max="100"
                          step="1"
                          value={item.taxRate}
                          onChange={(e) =>
                            handleUpdateItem(idx, 'taxRate', parseFloat(e.target.value) || 0)
                          }
                          style={{ width: 65, textAlign: 'right', fontSize: '0.85rem' }}
                        />
                      </td>
                      <td style={{ padding: '10px 12px', textAlign: 'right' }}>
                        <input
                          type="number"
                          min="0"
                          max="100"
                          step="1"
                          value={item.discount || 0}
                          onChange={(e) =>
                            handleUpdateItem(idx, 'discount', parseFloat(e.target.value) || 0)
                          }
                          style={{ width: 65, textAlign: 'right', fontSize: '0.85rem' }}
                        />
                      </td>
                      <td
                        style={{
                          padding: '10px 12px',
                          textAlign: 'right',
                          fontWeight: 700,
                          color: '#ffffff',
                          fontSize: '0.9rem',
                        }}
                      >
                        {formatCurrency(item.amount, currency)}
                      </td>
                      <td style={{ padding: '10px 12px', textAlign: 'center' }}>
                        <button
                          type="button"
                          onClick={() => handleRemoveItem(idx)}
                          disabled={items.length <= 1}
                          style={{
                            color: items.length <= 1 ? 'var(--text-dim)' : 'var(--text-muted)',
                            cursor: items.length <= 1 ? 'not-allowed' : 'pointer',
                          }}
                        >
                          <Trash2 size={14} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Bottom Totals & Notes */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
              gap: 24,
            }}
          >
            {/* Notes & Terms */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <div>
                <label style={{ fontSize: '0.775rem', fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: 4 }}>
                  Client Notes / Memo
                </label>
                <textarea
                  rows={2}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="e.g. SOW #4 Deliverables. Bank wire details on page 2."
                  style={{ width: '100%', fontSize: '0.85rem' }}
                />
              </div>
              <div>
                <label style={{ fontSize: '0.775rem', fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: 4 }}>
                  Terms & Conditions
                </label>
                <textarea
                  rows={2}
                  value={terms}
                  onChange={(e) => setTerms(e.target.value)}
                  placeholder="Terms governing invoice payment and interest charges"
                  style={{ width: '100%', fontSize: '0.85rem' }}
                />
              </div>
            </div>

            {/* Financial Summary Card */}
            <div
              className="glass-panel"
              style={{
                padding: '18px 22px',
                display: 'flex',
                flexDirection: 'column',
                gap: 8,
                backgroundColor: 'rgba(15, 23, 42, 0.7)',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
                <span style={{ color: 'var(--text-secondary)' }}>Subtotal:</span>
                <span style={{ color: '#ffffff', fontWeight: 600 }}>
                  {formatCurrency(subtotal, currency)}
                </span>
              </div>
              {discountTotal > 0 && (
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
                  <span style={{ color: 'var(--text-secondary)' }}>Discounts Applied:</span>
                  <span style={{ color: '#10b981', fontWeight: 600 }}>
                    -{formatCurrency(discountTotal, currency)}
                  </span>
                </div>
              )}
              {taxTotal > 0 && (
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
                  <span style={{ color: 'var(--text-secondary)' }}>Estimated Tax / VAT:</span>
                  <span style={{ color: '#ffffff', fontWeight: 600 }}>
                    {formatCurrency(taxTotal, currency)}
                  </span>
                </div>
              )}
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  paddingTop: 10,
                  marginTop: 6,
                  borderTop: '1px solid var(--border-subtle)',
                }}
              >
                <span style={{ fontSize: '0.95rem', fontWeight: 700, color: '#ffffff' }}>
                  Total Invoiced:
                </span>
                <span
                  style={{
                    fontSize: '1.4rem',
                    fontWeight: 800,
                    color: '#818cf8',
                    letterSpacing: '-0.02em',
                  }}
                >
                  {formatCurrency(total, currency)}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Actions Footer */}
        <div
          style={{
            padding: '16px 28px',
            borderTop: '1px solid var(--border-subtle)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-end',
            gap: 12,
            background: 'rgba(18, 24, 38, 0.95)',
          }}
        >
          <button
            type="button"
            onClick={onClose}
            className="btn-secondary"
            style={{ fontSize: '0.875rem' }}
          >
            Cancel
          </button>
          <button
            type="button"
            id="btn-save-draft"
            onClick={() => handleSaveInvoice('Draft')}
            className="btn-secondary"
            style={{ fontSize: '0.875rem' }}
          >
            <Save size={15} />
            Save as Draft
          </button>
          <button
            type="button"
            id="btn-save-and-send"
            onClick={() => handleSaveInvoice('Sent')}
            className="btn-primary"
            style={{ fontSize: '0.875rem' }}
          >
            <Send size={15} />
            Publish & Dispatch (Sent)
          </button>
        </div>
      </div>
    </div>
  );
}
