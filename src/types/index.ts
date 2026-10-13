export type InvoiceStatus = 'Draft' | 'Sent' | 'Paid' | 'Overdue';

export type PaymentTerms = 'Due on Receipt' | 'Net 15' | 'Net 30' | 'Net 45' | 'Net 60';

export interface InvoiceItem {
  id: string;
  description: string;
  category: 'Development' | 'Design' | 'Strategy' | 'Infrastructure' | 'Retainer' | 'Expenses' | 'General';
  quantity: number;
  unitPrice: number;
  taxRate: number; // e.g. 10 for 10%
  discount?: number; // percentage
  amount: number;
  notes?: string;
}

export interface Client {
  id: string;
  name: string;
  company: string;
  email: string;
  phone?: string;
  address: string;
  taxId?: string; // VAT or EIN
  currency: string;
  paymentTerms: PaymentTerms;
  avatarColor?: string;
  createdAt: string;
}

export interface AgencyBranding {
  agencyName: string;
  tagline: string;
  email: string;
  phone: string;
  website: string;
  address: string;
  taxId: string;
  currency: string;
  primaryColor: string; // Hex color
  logoUrl?: string;
  paymentInstructions: string;
  bankName: string;
  accountNumber: string;
  routingNumber: string;
  swiftBic?: string;
  notes: string;
  terms: string;
  invoicePrefix: string;
}

export interface Invoice {
  id: string;
  invoiceNumber: string; // e.g. INV-2025-001
  clientId: string;
  clientName: string;
  clientCompany: string;
  clientEmail: string;
  clientAddress: string;
  clientTaxId?: string;
  issueDate: string; // YYYY-MM-DD
  dueDate: string; // YYYY-MM-DD
  status: InvoiceStatus;
  items: InvoiceItem[];
  subtotal: number;
  taxTotal: number;
  discountTotal: number;
  total: number;
  amountPaid: number;
  currency: string;
  notes?: string;
  terms?: string;
  paymentTerms: PaymentTerms;
  createdAt: string;
  updatedAt: string;
  paidAt?: string;
}

export interface LedgerMetrics {
  totalRevenue: number;
  outstandingBalance: number;
  overdueAmount: number;
  draftAmount: number;
  paidThisMonth: number;
  averageDaysToPay: number;
  aging: {
    current: number; // 0-30 days
    bucket31_60: number; // 31-60 days
    bucket61_90: number; // 61-90 days
    bucket90Plus: number; // >90 days
  };
}
