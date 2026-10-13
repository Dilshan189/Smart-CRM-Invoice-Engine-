import {
  Invoice,
  Client,
  AgencyBranding,
  InvoiceStatus,
  LedgerMetrics,
} from '@/types';

const STORAGE_KEY_INVOICES = 'apexledger_invoices_v1';
const STORAGE_KEY_CLIENTS = 'apexledger_clients_v1';
const STORAGE_KEY_BRANDING = 'apexledger_branding_v1';

export const DEFAULT_BRANDING: AgencyBranding = {
  agencyName: 'Apex Digital Studio',
  tagline: 'High-Velocity Product Engineering & Growth Systems',
  email: 'billing@apexstudio.io',
  phone: '+1 (415) 890-4211',
  website: 'https://apexstudio.io',
  address: '550 Montgomery St, Suite 700, San Francisco, CA 94111',
  taxId: 'US-EIN-93-8401928',
  currency: 'USD',
  primaryColor: '#4f46e5', // Deep Indigo
  paymentInstructions: 'ACH or Federal Fedwire Transfer. Please reference invoice number in payment description.',
  bankName: 'J.P. Morgan Chase / Commercial Banking',
  accountNumber: '••••••••8392',
  routingNumber: '••••0210',
  swiftBic: 'CHASUS33',
  notes: 'All software deliverables governed by our Master Services Agreement & Intellectual Property Assignment clause.',
  terms: 'Payment is due within designated terms. Accounts past 30 days overdue are subject to a 1.5% compounding finance charge.',
  invoicePrefix: 'INV',
};

export const INITIAL_CLIENTS: Client[] = [
  {
    id: 'cli_novapay',
    name: 'Elena Rostova',
    company: 'NovaPay Global',
    email: 'finance@novapay.io',
    phone: '+1 (415) 302-8921',
    address: '100 Bush Street, Floor 18, San Francisco, CA 94104',
    taxId: 'US-EIN-12-894721',
    currency: 'USD',
    paymentTerms: 'Net 30',
    avatarColor: '#6366f1',
    createdAt: '2025-01-10T09:00:00Z',
  },
  {
    id: 'cli_starlight',
    name: 'Marcus Vance',
    company: 'Starlight Ventures',
    email: 'ops@starlightvc.com',
    phone: '+1 (212) 880-1492',
    address: '350 5th Avenue, Suite 4400, New York, NY 10118',
    taxId: 'US-EIN-45-901823',
    currency: 'USD',
    paymentTerms: 'Net 15',
    avatarColor: '#ec4899',
    createdAt: '2025-01-14T11:30:00Z',
  },
  {
    id: 'cli_beacon',
    name: 'Dr. Arthur Pendelton',
    company: 'Beacon Health Systems',
    email: 'billing@beaconhealth.org',
    phone: '+1 (617) 492-7710',
    address: '75 Cambridge Center, Cambridge, MA 02142',
    taxId: 'US-EIN-04-332910',
    currency: 'USD',
    paymentTerms: 'Due on Receipt',
    avatarColor: '#0ea5e9',
    createdAt: '2025-02-01T14:15:00Z',
  },
  {
    id: 'cli_hyperion',
    name: 'Aisha Al-Mansoor',
    company: 'Hyperion Robotics',
    email: 'accounting@hyperionbot.com',
    phone: '+1 (512) 400-3391',
    address: '800 Brazos St, Suite 900, Austin, TX 78701',
    taxId: 'US-EIN-74-883920',
    currency: 'USD',
    paymentTerms: 'Net 30',
    avatarColor: '#10b981',
    createdAt: '2025-02-12T16:00:00Z',
  },
  {
    id: 'cli_vanguard',
    name: 'Julian Sterling',
    company: 'Vanguard Logistics',
    email: 'invoicing@vanguardlog.net',
    phone: '+1 (312) 773-1900',
    address: '222 W Adams St, Chicago, IL 60606',
    taxId: 'US-EIN-36-778192',
    currency: 'USD',
    paymentTerms: 'Net 45',
    avatarColor: '#f59e0b',
    createdAt: '2025-02-18T10:00:00Z',
  },
];

export const INITIAL_INVOICES: Invoice[] = [
  {
    id: 'inv_001',
    invoiceNumber: 'INV-2025-001',
    clientId: 'cli_novapay',
    clientName: 'Elena Rostova',
    clientCompany: 'NovaPay Global',
    clientEmail: 'finance@novapay.io',
    clientAddress: '100 Bush Street, Floor 18, San Francisco, CA 94104',
    clientTaxId: 'US-EIN-12-894721',
    issueDate: '2025-01-15',
    dueDate: '2025-02-14',
    status: 'Paid',
    items: [
      {
        id: 'item_101',
        description: 'Next.js 15 Checkout Redesign & Microfrontend Architecture',
        category: 'Development',
        quantity: 40,
        unitPrice: 150,
        taxRate: 0,
        amount: 6000,
        notes: 'Two full 20-hr sprint blocks',
      },
      {
        id: 'item_102',
        description: 'Stripe Idempotent Webhook Engine & Dispute Triage',
        category: 'Infrastructure',
        quantity: 15,
        unitPrice: 150,
        taxRate: 0,
        amount: 2250,
        notes: 'PCI-DSS tier 1 compliance test passed',
      },
      {
        id: 'item_103',
        description: 'Design Token System & High-Fidelity Figma Sync',
        category: 'Design',
        quantity: 1,
        unitPrice: 500,
        taxRate: 0,
        amount: 500,
      },
    ],
    subtotal: 8750,
    taxTotal: 0,
    discountTotal: 0,
    total: 8750,
    amountPaid: 8750,
    currency: 'USD',
    notes: 'Paid in full via ACH transfer Ref #JPM938201',
    paymentTerms: 'Net 30',
    createdAt: '2025-01-15T10:00:00Z',
    updatedAt: '2025-02-10T14:30:00Z',
    paidAt: '2025-02-10T14:30:00Z',
  },
  {
    id: 'inv_002',
    invoiceNumber: 'INV-2025-002',
    clientId: 'cli_starlight',
    clientName: 'Marcus Vance',
    clientCompany: 'Starlight Ventures',
    clientEmail: 'ops@starlightvc.com',
    clientAddress: '350 5th Avenue, Suite 4400, New York, NY 10118',
    clientTaxId: 'US-EIN-45-901823',
    issueDate: '2025-02-01',
    dueDate: '2025-02-16',
    status: 'Sent',
    items: [
      {
        id: 'item_201',
        description: 'Series B Investor Deck Interactive Web Prototype',
        category: 'Design',
        quantity: 1,
        unitPrice: 4200,
        taxRate: 8.5,
        amount: 4200,
        notes: 'Framermotion animations + 3D canvas',
      },
      {
        id: 'item_202',
        description: 'Executive Presentation Alignment & Revisions',
        category: 'Strategy',
        quantity: 8,
        unitPrice: 175,
        taxRate: 8.5,
        amount: 1400,
      },
    ],
    subtotal: 5600,
    taxTotal: 476,
    discountTotal: 0,
    total: 6076,
    amountPaid: 0,
    currency: 'USD',
    notes: 'Client reviewed on Feb 3, awaiting batch treasury run.',
    paymentTerms: 'Net 15',
    createdAt: '2025-02-01T11:00:00Z',
    updatedAt: '2025-02-01T11:00:00Z',
  },
  {
    id: 'inv_003',
    invoiceNumber: 'INV-2025-003',
    clientId: 'cli_beacon',
    clientName: 'Dr. Arthur Pendelton',
    clientCompany: 'Beacon Health Systems',
    clientEmail: 'billing@beaconhealth.org',
    clientAddress: '75 Cambridge Center, Cambridge, MA 02142',
    clientTaxId: 'US-EIN-04-332910',
    issueDate: '2025-01-05',
    dueDate: '2025-01-20',
    status: 'Overdue',
    items: [
      {
        id: 'item_301',
        description: 'HIPAA Compliant Patient Telehealth Portal Core API',
        category: 'Development',
        quantity: 45,
        unitPrice: 160,
        taxRate: 0,
        amount: 7200,
      },
      {
        id: 'item_302',
        description: 'Zero-Knowledge Health Records Encryption Module',
        category: 'Infrastructure',
        quantity: 12,
        unitPrice: 175,
        taxRate: 0,
        amount: 2100,
      },
      {
        id: 'item_303',
        description: 'SOC2 Type II Evidence Preparation Support',
        category: 'Strategy',
        quantity: 6,
        unitPrice: 150,
        taxRate: 0,
        amount: 900,
      },
    ],
    subtotal: 10200,
    taxTotal: 0,
    discountTotal: 400,
    total: 9800,
    amountPaid: 0,
    currency: 'USD',
    notes: 'Reminder notice dispatched. Awaiting final authorization from hospital CFO.',
    paymentTerms: 'Due on Receipt',
    createdAt: '2025-01-05T08:30:00Z',
    updatedAt: '2025-01-28T09:00:00Z',
  },
  {
    id: 'inv_004',
    invoiceNumber: 'INV-2025-004',
    clientId: 'cli_hyperion',
    clientName: 'Aisha Al-Mansoor',
    clientCompany: 'Hyperion Robotics',
    clientEmail: 'accounting@hyperionbot.com',
    clientAddress: '800 Brazos St, Suite 900, Austin, TX 78701',
    clientTaxId: 'US-EIN-74-883920',
    issueDate: '2025-02-10',
    dueDate: '2025-03-12',
    status: 'Draft',
    items: [
      {
        id: 'item_401',
        description: 'Autonomous Fleet Telemetry WebSocket Pipeline',
        category: 'Development',
        quantity: 36,
        unitPrice: 165,
        taxRate: 0,
        amount: 5940,
      },
      {
        id: 'item_402',
        description: 'Kafka Streaming Cluster Provisioning & Monitoring',
        category: 'Infrastructure',
        quantity: 1,
        unitPrice: 1850,
        taxRate: 0,
        amount: 1850,
      },
    ],
    subtotal: 7790,
    taxTotal: 0,
    discountTotal: 0,
    total: 7790,
    amountPaid: 0,
    currency: 'USD',
    notes: 'Draft stage. Pending final review with lead robotics architect.',
    paymentTerms: 'Net 30',
    createdAt: '2025-02-10T15:20:00Z',
    updatedAt: '2025-02-10T15:20:00Z',
  },
  {
    id: 'inv_005',
    invoiceNumber: 'INV-2025-005',
    clientId: 'cli_vanguard',
    clientName: 'Julian Sterling',
    clientCompany: 'Vanguard Logistics',
    clientEmail: 'invoicing@vanguardlog.net',
    clientAddress: '222 W Adams St, Chicago, IL 60606',
    clientTaxId: 'US-EIN-36-778192',
    issueDate: '2025-01-20',
    dueDate: '2025-03-06',
    status: 'Sent',
    items: [
      {
        id: 'item_501',
        description: 'Real-Time Freight Routing Algorithm & Google Maps Sync',
        category: 'Development',
        quantity: 28,
        unitPrice: 145,
        taxRate: 6.25,
        amount: 4060,
      },
      {
        id: 'item_502',
        description: 'Driver Mobile PWA Offline Synchronization',
        category: 'Development',
        quantity: 18,
        unitPrice: 145,
        taxRate: 6.25,
        amount: 2610,
      },
    ],
    subtotal: 6670,
    taxTotal: 416.88,
    discountTotal: 0,
    total: 7086.88,
    amountPaid: 0,
    currency: 'USD',
    notes: 'Net 45 terms per enterprise vendor agreement.',
    paymentTerms: 'Net 45',
    createdAt: '2025-01-20T12:00:00Z',
    updatedAt: '2025-01-20T12:00:00Z',
  },
];

// Helper to check if in browser
const isClient = typeof window !== 'undefined';

export function getStoredClients(): Client[] {
  if (!isClient) return INITIAL_CLIENTS;
  const raw = localStorage.getItem(STORAGE_KEY_CLIENTS);
  if (!raw) {
    localStorage.setItem(STORAGE_KEY_CLIENTS, JSON.stringify(INITIAL_CLIENTS));
    return INITIAL_CLIENTS;
  }
  try {
    return JSON.parse(raw);
  } catch {
    return INITIAL_CLIENTS;
  }
}

export function saveStoredClients(clients: Client[]): void {
  if (!isClient) return;
  localStorage.setItem(STORAGE_KEY_CLIENTS, JSON.stringify(clients));
  window.dispatchEvent(new Event('apexledger_data_updated'));
}

export function getStoredInvoices(): Invoice[] {
  if (!isClient) return INITIAL_INVOICES;
  const raw = localStorage.getItem(STORAGE_KEY_INVOICES);
  if (!raw) {
    localStorage.setItem(STORAGE_KEY_INVOICES, JSON.stringify(INITIAL_INVOICES));
    return INITIAL_INVOICES;
  }
  try {
    return JSON.parse(raw);
  } catch {
    return INITIAL_INVOICES;
  }
}

export function saveStoredInvoices(invoices: Invoice[]): void {
  if (!isClient) return;
  localStorage.setItem(STORAGE_KEY_INVOICES, JSON.stringify(invoices));
  window.dispatchEvent(new Event('apexledger_data_updated'));
}

export function getStoredBranding(): AgencyBranding {
  if (!isClient) return DEFAULT_BRANDING;
  const raw = localStorage.getItem(STORAGE_KEY_BRANDING);
  if (!raw) {
    localStorage.setItem(STORAGE_KEY_BRANDING, JSON.stringify(DEFAULT_BRANDING));
    return DEFAULT_BRANDING;
  }
  try {
    return JSON.parse(raw);
  } catch {
    return DEFAULT_BRANDING;
  }
}

export function saveStoredBranding(branding: AgencyBranding): void {
  if (!isClient) return;
  localStorage.setItem(STORAGE_KEY_BRANDING, JSON.stringify(branding));
  window.dispatchEvent(new Event('apexledger_data_updated'));
}

export function updateInvoiceStatus(id: string, newStatus: InvoiceStatus): Invoice[] {
  const invoices = getStoredInvoices();
  const now = new Date().toISOString();
  const updated = invoices.map((inv) => {
    if (inv.id === id) {
      return {
        ...inv,
        status: newStatus,
        updatedAt: now,
        amountPaid: newStatus === 'Paid' ? inv.total : newStatus === 'Draft' ? 0 : inv.amountPaid,
        paidAt: newStatus === 'Paid' ? now : undefined,
      };
    }
    return inv;
  });
  saveStoredInvoices(updated);
  return updated;
}

export function saveOrUpdateInvoice(invoice: Invoice): Invoice[] {
  const invoices = getStoredInvoices();
  const index = invoices.findIndex((i) => i.id === invoice.id);
  let updated: Invoice[];
  if (index >= 0) {
    updated = [...invoices];
    updated[index] = { ...invoice, updatedAt: new Date().toISOString() };
  } else {
    updated = [invoice, ...invoices];
  }
  saveStoredInvoices(updated);
  return updated;
}

export function deleteInvoice(id: string): Invoice[] {
  const invoices = getStoredInvoices();
  const updated = invoices.filter((i) => i.id !== id);
  saveStoredInvoices(updated);
  return updated;
}

export function calculateLedgerMetrics(invoices: Invoice[]): LedgerMetrics {
  let totalRevenue = 0;
  let outstandingBalance = 0;
  let overdueAmount = 0;
  let draftAmount = 0;
  let paidThisMonth = 0;

  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();

  const aging = {
    current: 0,
    bucket31_60: 0,
    bucket61_90: 0,
    bucket90Plus: 0,
  };

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  for (const inv of invoices) {
    if (inv.status === 'Paid') {
      totalRevenue += inv.total;
      if (inv.paidAt) {
        const pd = new Date(inv.paidAt);
        if (pd.getMonth() === currentMonth && pd.getFullYear() === currentYear) {
          paidThisMonth += inv.total;
        }
      } else {
        paidThisMonth += inv.total;
      }
    } else if (inv.status === 'Draft') {
      draftAmount += inv.total;
    } else if (inv.status === 'Sent' || inv.status === 'Overdue') {
      const remaining = Math.max(0, inv.total - (inv.amountPaid || 0));
      outstandingBalance += remaining;

      // Check aging based on due date
      const dueDate = new Date(inv.dueDate);
      dueDate.setHours(0, 0, 0, 0);
      const diffDays = Math.floor((today.getTime() - dueDate.getTime()) / (1000 * 60 * 60 * 24));

      if (diffDays > 0) {
        overdueAmount += remaining;
        if (diffDays <= 30) {
          aging.current += remaining;
        } else if (diffDays <= 60) {
          aging.bucket31_60 += remaining;
        } else if (diffDays <= 90) {
          aging.bucket61_90 += remaining;
        } else {
          aging.bucket90Plus += remaining;
        }
      } else {
        aging.current += remaining;
      }
    }
  }

  return {
    totalRevenue,
    outstandingBalance,
    overdueAmount,
    draftAmount,
    paidThisMonth,
    averageDaysToPay: 18.4,
    aging,
  };
}

export function resetDemoData(): void {
  if (!isClient) return;
  localStorage.setItem(STORAGE_KEY_INVOICES, JSON.stringify(INITIAL_INVOICES));
  localStorage.setItem(STORAGE_KEY_CLIENTS, JSON.stringify(INITIAL_CLIENTS));
  localStorage.setItem(STORAGE_KEY_BRANDING, JSON.stringify(DEFAULT_BRANDING));
  window.dispatchEvent(new Event('apexledger_data_updated'));
}
