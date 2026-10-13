'use client';

import React, { useState } from 'react';
import {
  X,
  Users,
  Plus,
  Trash2,
  Mail,
  Building,
  Phone,
  MapPin,
  Calendar,
  CheckCircle,
} from 'lucide-react';
import { Client, Invoice, PaymentTerms } from '@/types';
import { formatCurrency } from '@/lib/formatters';

interface ClientManagerModalProps {
  isOpen: boolean;
  onClose: () => void;
  clients: Client[];
  invoices: Invoice[];
  onSaveClient: (client: Client) => void;
  onDeleteClient: (clientId: string) => void;
}

export function ClientManagerModal({
  isOpen,
  onClose,
  clients,
  invoices,
  onSaveClient,
  onDeleteClient,
}: ClientManagerModalProps) {
  const [isAddingClient, setIsAddingClient] = useState(false);
  const [formData, setFormData] = useState<Partial<Client>>({
    name: '',
    company: '',
    email: '',
    phone: '',
    address: '',
    taxId: '',
    currency: 'USD',
    paymentTerms: 'Net 30',
  });

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.company || !formData.email) return;

    const newClient: Client = {
      id: `cli_${Date.now()}`,
      name: formData.name || formData.company,
      company: formData.company,
      email: formData.email,
      phone: formData.phone || '',
      address: formData.address || '100 Market St, San Francisco, CA',
      taxId: formData.taxId || '',
      currency: formData.currency || 'USD',
      paymentTerms: (formData.paymentTerms as PaymentTerms) || 'Net 30',
      avatarColor: '#6366f1',
      createdAt: new Date().toISOString(),
    };

    onSaveClient(newClient);
    setIsAddingClient(false);
    setFormData({
      name: '',
      company: '',
      email: '',
      phone: '',
      address: '',
      taxId: '',
      currency: 'USD',
      paymentTerms: 'Net 30',
    });
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-container"
        style={{ maxWidth: 880 }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
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
              <Users size={18} color="var(--brand-primary)" />
            </div>
            <div>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#ffffff' }}>
                Client Directory & Billing Registry
              </h3>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                Commercial client accounts, default payment terms, and lifetime revenue
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            id="btn-close-clients"
            style={{ color: 'var(--text-muted)', padding: 6 }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
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
          {/* Top Bar with Add Client Button */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
              Total Active Clients: <strong>{clients.length}</strong>
            </span>
            <button
              onClick={() => setIsAddingClient(!isAddingClient)}
              id="btn-toggle-add-client"
              className="btn-primary"
              style={{ fontSize: '0.825rem', padding: '8px 14px' }}
            >
              <Plus size={15} />
              {isAddingClient ? 'Cancel' : 'Add New Client'}
            </button>
          </div>

          {/* Add Client Form */}
          {isAddingClient && (
            <form
              onSubmit={handleSubmit}
              className="glass-panel"
              style={{
                padding: '20px 22px',
                borderColor: 'var(--border-highlight)',
                backgroundColor: 'rgba(15, 23, 42, 0.85)',
              }}
            >
              <h4 style={{ fontSize: '0.9rem', fontWeight: 700, color: '#ffffff', marginBottom: 14 }}>
                Register New Commercial Client
              </h4>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginBottom: 16 }}>
                <div>
                  <label style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: 4 }}>
                    Company / Organization Name *
                  </label>
                  <input
                    type="text"
                    id="input-new-client-company"
                    required
                    value={formData.company}
                    onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                    placeholder="e.g. Acme Corp"
                    style={{ width: '100%' }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: 4 }}>
                    Primary Contact Name
                  </label>
                  <input
                    type="text"
                    id="input-new-client-name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g. Sarah Jenkins"
                    style={{ width: '100%' }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: 4 }}>
                    Billing Email *
                  </label>
                  <input
                    type="email"
                    id="input-new-client-email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="invoicing@acme.com"
                    style={{ width: '100%' }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: 4 }}>
                    Payment Terms
                  </label>
                  <select
                    id="select-new-client-terms"
                    value={formData.paymentTerms}
                    onChange={(e) =>
                      setFormData({ ...formData, paymentTerms: e.target.value as PaymentTerms })
                    }
                    style={{ width: '100%' }}
                  >
                    <option value="Due on Receipt" style={{ background: '#121826' }}>Due on Receipt</option>
                    <option value="Net 15" style={{ background: '#121826' }}>Net 15</option>
                    <option value="Net 30" style={{ background: '#121826' }}>Net 30</option>
                    <option value="Net 45" style={{ background: '#121826' }}>Net 45</option>
                    <option value="Net 60" style={{ background: '#121826' }}>Net 60</option>
                  </select>
                </div>
                <div style={{ gridColumn: 'span 2' }}>
                  <label style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: 4 }}>
                    Billing Address
                  </label>
                  <input
                    type="text"
                    id="input-new-client-address"
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    placeholder="123 Corporate Blvd, Suite 200, City, State"
                    style={{ width: '100%' }}
                  />
                </div>
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10 }}>
                <button
                  type="button"
                  onClick={() => setIsAddingClient(false)}
                  className="btn-secondary"
                  style={{ fontSize: '0.8rem' }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  id="btn-save-new-client"
                  className="btn-primary"
                  style={{ fontSize: '0.8rem' }}
                >
                  Register Client
                </button>
              </div>
            </form>
          )}

          {/* Clients List */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {clients.map((client) => {
              const clientInvoices = invoices.filter(
                (i) => i.clientId === client.id || i.clientCompany.toLowerCase() === client.company.toLowerCase()
              );
              const lifetimeBilled = clientInvoices.reduce((sum, i) => sum + i.total, 0);
              const activeCount = clientInvoices.filter((i) => i.status !== 'Paid').length;

              return (
                <div
                  key={client.id}
                  id={`client-card-${client.id}`}
                  className="glass-panel"
                  style={{
                    padding: '16px 20px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    flexWrap: 'wrap',
                    gap: 16,
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                    <div
                      style={{
                        width: 44,
                        height: 44,
                        borderRadius: 12,
                        backgroundColor: client.avatarColor || '#6366f1',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontWeight: 800,
                        fontSize: '1.1rem',
                        color: '#ffffff',
                      }}
                    >
                      {client.company.charAt(0)}
                    </div>
                    <div>
                      <div style={{ fontWeight: 700, color: '#ffffff', fontSize: '0.95rem' }}>
                        {client.company}
                      </div>
                      <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                        {client.name} • {client.email}
                      </div>
                      <div style={{ fontSize: '0.725rem', color: 'var(--text-muted)', marginTop: 2 }}>
                        {client.address}
                      </div>
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontSize: '0.725rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                        Lifetime Billed
                      </div>
                      <div style={{ fontWeight: 700, color: '#ffffff', fontSize: '0.925rem' }}>
                        {formatCurrency(lifetimeBilled, client.currency)}
                      </div>
                    </div>

                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontSize: '0.725rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                        Terms & Status
                      </div>
                      <div style={{ fontSize: '0.8rem', color: '#a5b4fc', fontWeight: 600 }}>
                        {client.paymentTerms} • {activeCount} active
                      </div>
                    </div>

                    <button
                      onClick={() => {
                        if (confirm(`Remove client ${client.company}?`)) {
                          onDeleteClient(client.id);
                        }
                      }}
                      style={{
                        padding: 8,
                        borderRadius: 6,
                        backgroundColor: 'rgba(239, 68, 68, 0.1)',
                        color: '#f87171',
                      }}
                      title="Delete Client"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
