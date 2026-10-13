'use client';

import React, { useState, useEffect, useCallback } from 'react';
import {
  Navbar,
} from '@/components/Navbar';
import {
  StatsCards,
} from '@/components/StatsCards';
import {
  LedgerTable,
} from '@/components/LedgerTable';
import {
  InvoiceModal,
} from '@/components/InvoiceModal';
import {
  AIParserModal,
} from '@/components/AIParserModal';
import {
  PdfPreviewModal,
} from '@/components/PdfPreviewModal';
import {
  BrandingSettingsModal,
} from '@/components/BrandingSettingsModal';
import {
  ClientManagerModal,
} from '@/components/ClientManagerModal';
import {
  SupabaseModal,
} from '@/components/SupabaseModal';
import {
  Invoice,
  Client,
  AgencyBranding,
  InvoiceStatus,
  LedgerMetrics,
} from '@/types';
import {
  getStoredInvoices,
  getStoredClients,
  getStoredBranding,
  saveStoredInvoices,
  saveStoredClients,
  saveStoredBranding,
  saveOrUpdateInvoice,
  deleteInvoice,
  updateInvoiceStatus,
  calculateLedgerMetrics,
  resetDemoData,
} from '@/lib/storage';
import { AIParsedInvoiceExtraction } from '@/lib/schemas';
import { Sparkles, Plus, Download, CheckCircle2, ShieldCheck, Zap } from 'lucide-react';

export default function HomePage() {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [branding, setBranding] = useState<AgencyBranding>(getStoredBranding());
  const [metrics, setMetrics] = useState<LedgerMetrics>(() => calculateLedgerMetrics([]));

  // Modals state
  const [isInvoiceModalOpen, setIsInvoiceModalOpen] = useState(false);
  const [editingInvoice, setEditingInvoice] = useState<Invoice | null>(null);

  const [isAiParserModalOpen, setIsAiParserModalOpen] = useState(false);

  const [isPdfPreviewModalOpen, setIsPdfPreviewModalOpen] = useState(false);
  const [previewingInvoice, setPreviewingInvoice] = useState<Invoice | null>(null);

  const [isBrandingModalOpen, setIsBrandingModalOpen] = useState(false);
  const [isClientsModalOpen, setIsClientsModalOpen] = useState(false);
  const [isSupabaseModalOpen, setIsSupabaseModalOpen] = useState(false);

  // Sync state from storage
  const reloadData = useCallback(() => {
    const invs = getStoredInvoices();
    const clis = getStoredClients();
    const brnd = getStoredBranding();
    setInvoices(invs);
    setClients(clis);
    setBranding(brnd);
    setMetrics(calculateLedgerMetrics(invs));
  }, []);

  useEffect(() => {
    reloadData();

    // Listen to custom data updates
    const handleUpdate = () => reloadData();
    window.addEventListener('apexledger_data_updated', handleUpdate);
    return () => window.removeEventListener('apexledger_data_updated', handleUpdate);
  }, [reloadData]);

  // Handle invoice actions
  const handleSaveInvoice = (invoice: Invoice) => {
    const updated = saveOrUpdateInvoice(invoice);
    setInvoices(updated);
    setMetrics(calculateLedgerMetrics(updated));
  };

  const handleStatusChange = (invoiceId: string, status: InvoiceStatus) => {
    const updated = updateInvoiceStatus(invoiceId, status);
    setInvoices(updated);
    setMetrics(calculateLedgerMetrics(updated));
  };

  const handleDeleteInvoice = (invoiceId: string) => {
    const updated = deleteInvoice(invoiceId);
    setInvoices(updated);
    setMetrics(calculateLedgerMetrics(updated));
  };

  const handleDuplicateInvoice = (invoice: Invoice) => {
    const randomNum = Math.floor(100 + Math.random() * 900);
    const duplicated: Invoice = {
      ...invoice,
      id: `inv_${Date.now()}`,
      invoiceNumber: `${branding.invoicePrefix || 'INV'}-2025-${randomNum}`,
      status: 'Draft',
      issueDate: new Date().toISOString().split('T')[0],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      amountPaid: 0,
      paidAt: undefined,
    };
    const updated = saveOrUpdateInvoice(duplicated);
    setInvoices(updated);
    setMetrics(calculateLedgerMetrics(updated));
  };

  // Connect AI Text-to-Invoice parser into invoice creator
  const handleApplyExtractedInvoice = (parsedData: AIParsedInvoiceExtraction) => {
    // Find matching client or fall back
    const matchedClient =
      clients.find(
        (c) =>
          c.company.toLowerCase().includes((parsedData.detectedClientName || '').toLowerCase()) ||
          (parsedData.detectedClientName || '').toLowerCase().includes(c.company.toLowerCase())
      ) || clients[0];

    const today = new Date().toISOString().split('T')[0];
    const due = new Date();
    due.setDate(due.getDate() + (parsedData.detectedPaymentTerms === 'Net 15' ? 15 : 30));

    const convertedItems = parsedData.items.map((item, idx) => ({
      id: `item_ai_${Date.now()}_${idx}`,
      description: item.description,
      category: item.category,
      quantity: item.quantity,
      unitPrice: item.unitPrice,
      taxRate: item.taxRate || 0,
      discount: item.discount || 0,
      amount: item.quantity * item.unitPrice * (1 - (item.discount || 0) / 100),
      notes: item.notes,
    }));

    const subtotal = convertedItems.reduce((sum, it) => sum + it.quantity * it.unitPrice, 0);
    const taxTotal = convertedItems.reduce(
      (sum, it) => sum + (it.amount * (it.taxRate || 0)) / 100,
      0
    );
    const total = subtotal + taxTotal;

    const randomNum = Math.floor(100 + Math.random() * 900);
    const newDraft: Invoice = {
      id: `inv_${Date.now()}`,
      invoiceNumber: `${branding.invoicePrefix || 'INV'}-2025-${randomNum}`,
      clientId: matchedClient ? matchedClient.id : 'cli_direct',
      clientName: matchedClient ? matchedClient.name : parsedData.detectedClientName || 'Client Contact',
      clientCompany: matchedClient ? matchedClient.company : parsedData.detectedClientName || 'Client Company',
      clientEmail: matchedClient ? matchedClient.email : 'client@example.com',
      clientAddress: matchedClient ? matchedClient.address : 'Corporate HQ',
      clientTaxId: matchedClient?.taxId,
      issueDate: today,
      dueDate: due.toISOString().split('T')[0],
      status: 'Draft',
      items: convertedItems,
      subtotal,
      discountTotal: 0,
      taxTotal,
      total,
      amountPaid: 0,
      currency: parsedData.currency || 'USD',
      notes: parsedData.summary,
      terms: branding.terms,
      paymentTerms: parsedData.detectedPaymentTerms || 'Net 30',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    setEditingInvoice(newDraft);
    setIsInvoiceModalOpen(true);
  };

  const handleOpenEdit = (invoice: Invoice) => {
    setEditingInvoice(invoice);
    setIsInvoiceModalOpen(true);
  };

  const handleOpenPreview = (invoice: Invoice) => {
    setPreviewingInvoice(invoice);
    setIsPdfPreviewModalOpen(true);
  };

  const handleSaveBranding = (updated: AgencyBranding) => {
    setBranding(updated);
    saveStoredBranding(updated);
  };

  const handleSaveClient = (client: Client) => {
    const updated = [client, ...clients];
    setClients(updated);
    saveStoredClients(updated);
  };

  const handleDeleteClient = (clientId: string) => {
    const updated = clients.filter((c) => c.id !== clientId);
    setClients(updated);
    saveStoredClients(updated);
  };

  return (
    <main style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Top Brand Navigation */}
      <Navbar
        branding={branding}
        onOpenNewInvoice={() => {
          setEditingInvoice(null);
          setIsInvoiceModalOpen(true);
        }}
        onOpenAiParser={() => setIsAiParserModalOpen(true)}
        onOpenBranding={() => setIsBrandingModalOpen(true)}
        onOpenClients={() => setIsClientsModalOpen(true)}
        onOpenSupabase={() => setIsSupabaseModalOpen(true)}
        onResetData={resetDemoData}
      />

      {/* Main Content Area */}
      <div style={{ maxWidth: 1400, width: '100%', margin: '0 auto', padding: '28px 24px', flex: 1 }}>
        {/* Hero Banner Header */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-end',
          flexWrap: 'wrap',
          gap: 16,
          marginBottom: 28,
        }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
              <span style={{
                fontSize: '0.75rem',
                fontWeight: 700,
                color: 'var(--brand-primary)',
                textTransform: 'uppercase',
                letterSpacing: '0.06em',
              }}>
                Commercial Revenue OS
              </span>
              <span style={{ color: 'var(--text-dim)' }}>•</span>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                Master Services & Retainer Billing
              </span>
            </div>
            <h2 style={{ fontSize: '1.9rem', fontWeight: 800, color: '#ffffff', letterSpacing: '-0.03em' }}>
              Agency Billing & Accounts Receivable
            </h2>
            <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginTop: 4 }}>
              Manage ledger lifecycles, stream server-rendered PDFs with custom branding, and parse messy chats via Zod.
            </p>
          </div>

          {/* Quick Banner Action CTAs */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <button
              onClick={() => setIsAiParserModalOpen(true)}
              id="btn-hero-ai-parser"
              className="btn-ai-magic"
              style={{ fontSize: '0.85rem' }}
            >
              <Sparkles size={16} />
              AI Chat-to-Invoice
            </button>
            <button
              onClick={() => {
                setEditingInvoice(null);
                setIsInvoiceModalOpen(true);
              }}
              id="btn-hero-new-invoice"
              className="btn-primary"
              style={{ fontSize: '0.85rem' }}
            >
              <Plus size={16} />
              Create Invoice
            </button>
          </div>
        </div>

        {/* 4 KPIs & Aging Breakdown Bar */}
        <StatsCards metrics={metrics} currency={branding.currency || 'USD'} />

        {/* Billing Ledger Registry Table */}
        <LedgerTable
          invoices={invoices}
          branding={branding}
          onSelectInvoice={handleOpenPreview}
          onEditInvoice={handleOpenEdit}
          onPreviewPdf={handleOpenPreview}
          onStatusChange={handleStatusChange}
          onDeleteInvoice={handleDeleteInvoice}
          onDuplicateInvoice={handleDuplicateInvoice}
        />
      </div>

      {/* Footer */}
      <footer style={{
        borderTop: '1px solid var(--border-subtle)',
        padding: '20px 24px',
        textAlign: 'center',
        fontSize: '0.8rem',
        color: 'var(--text-muted)',
        marginTop: 40,
        backgroundColor: 'rgba(7, 9, 14, 0.7)',
      }}>
        <div style={{ maxWidth: 1400, margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
          <div>
            <strong>ApexLedger</strong> • Built for Digital Studios, Dev Agencies & Retainer Service Teams
          </div>
          <div style={{ display: 'flex', gap: 16 }}>
            <span>Next.js App Router</span>
            <span>Supabase RLS</span>
            <span>@react-pdf/renderer</span>
            <span>Zod Structured Outputs</span>
          </div>
        </div>
      </footer>

      {/* MODALS */}
      {/* 1. Invoice Editor Modal */}
      <InvoiceModal
        isOpen={isInvoiceModalOpen}
        onClose={() => setIsInvoiceModalOpen(false)}
        onSave={handleSaveInvoice}
        initialInvoice={editingInvoice}
        clients={clients}
        branding={branding}
        onOpenAiParser={() => setIsAiParserModalOpen(true)}
      />

      {/* 2. AI Chat-to-Invoice Parser Modal */}
      <AIParserModal
        isOpen={isAiParserModalOpen}
        onClose={() => setIsAiParserModalOpen(false)}
        onApplyExtractedInvoice={handleApplyExtractedInvoice}
      />

      {/* 3. Live Client-Ready PDF Preview & Download Pipeline */}
      <PdfPreviewModal
        isOpen={isPdfPreviewModalOpen}
        onClose={() => setIsPdfPreviewModalOpen(false)}
        invoice={previewingInvoice}
        branding={branding}
        onUpdateBrandingColor={(color) => handleSaveBranding({ ...branding, primaryColor: color })}
      />

      {/* 4. Agency Branding Settings Modal */}
      <BrandingSettingsModal
        isOpen={isBrandingModalOpen}
        onClose={() => setIsBrandingModalOpen(false)}
        branding={branding}
        onSave={handleSaveBranding}
      />

      {/* 5. Client Directory / CRM Modal */}
      <ClientManagerModal
        isOpen={isClientsModalOpen}
        onClose={() => setIsClientsModalOpen(false)}
        clients={clients}
        invoices={invoices}
        onSaveClient={handleSaveClient}
        onDeleteClient={handleDeleteClient}
      />

      {/* 6. Supabase Cloud Database & SQL Modal */}
      <SupabaseModal
        isOpen={isSupabaseModalOpen}
        onClose={() => setIsSupabaseModalOpen(false)}
      />
    </main>
  );
}
