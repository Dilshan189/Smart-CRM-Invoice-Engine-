import { z } from 'zod';

export const CategoryEnum = z.enum([
  'Development',
  'Design',
  'Strategy',
  'Infrastructure',
  'Retainer',
  'Expenses',
  'General',
]);

export const InvoiceStatusEnum = z.enum(['Draft', 'Sent', 'Paid', 'Overdue']);

export const PaymentTermsEnum = z.enum([
  'Due on Receipt',
  'Net 15',
  'Net 30',
  'Net 45',
  'Net 60',
]);

// Single line item schema
export const InvoiceItemSchema = z.object({
  id: z.string().default(() => `item_${Math.random().toString(36).substring(2, 9)}`),
  description: z.string().min(1, 'Description is required'),
  category: CategoryEnum.default('Development'),
  quantity: z.number().positive('Quantity must be greater than 0'),
  unitPrice: z.number().nonnegative('Unit price cannot be negative'),
  taxRate: z.number().min(0).max(100).default(0),
  discount: z.number().min(0).max(100).optional().default(0),
  amount: z.number().nonnegative(),
  notes: z.string().optional(),
});

// AI Chat Log / Free Text Parser Structured Output Schema
export const AIParsedItemSchema = z.object({
  description: z.string().describe('Clear deliverable or service description extracted from the chat log'),
  category: CategoryEnum.describe('Service category best matching the deliverable'),
  quantity: z.number().positive().describe('Hours, units, sprints, or deliverables count'),
  unitPrice: z.number().positive().describe('Hourly rate or unit price in currency'),
  taxRate: z.number().min(0).max(100).default(0).describe('Applicable tax or VAT percentage'),
  discount: z.number().min(0).max(100).optional().default(0).describe('Discount percentage if mentioned'),
  notes: z.string().optional().describe('Contextual detail, timestamp or client reference found in chat'),
});

export const AIParsedInvoiceExtractionSchema = z.object({
  detectedClientName: z.string().optional().describe('Client or company name inferred from chat text'),
  currency: z.string().default('USD').describe('Currency ISO symbol (e.g. USD, EUR, GBP)'),
  detectedPaymentTerms: PaymentTermsEnum.optional().describe('Payment terms mentioned in discussion'),
  confidenceScore: z.number().min(0).max(1).describe('Extraction confidence rating from 0.0 to 1.0'),
  summary: z.string().describe('Brief high-level summary of the billing conversation'),
  items: z.array(AIParsedItemSchema).min(1, 'At least one line item must be extracted'),
});

// Client schema
export const ClientSchema = z.object({
  id: z.string(),
  name: z.string().min(1, 'Name is required'),
  company: z.string().min(1, 'Company is required'),
  email: z.string().email('Invalid email address'),
  phone: z.string().optional(),
  address: z.string().min(1, 'Address is required'),
  taxId: z.string().optional(),
  currency: z.string().default('USD'),
  paymentTerms: PaymentTermsEnum.default('Net 30'),
  avatarColor: z.string().optional(),
  createdAt: z.string(),
});

// Full Invoice schema
export const InvoiceSchema = z.object({
  id: z.string(),
  invoiceNumber: z.string().regex(/^INV-\d{4}-\d{3,}$/, 'Format should be INV-YYYY-XXX'),
  clientId: z.string().min(1, 'Client is required'),
  clientName: z.string().min(1),
  clientCompany: z.string().min(1),
  clientEmail: z.string().email(),
  clientAddress: z.string(),
  clientTaxId: z.string().optional(),
  issueDate: z.string(),
  dueDate: z.string(),
  status: InvoiceStatusEnum.default('Draft'),
  items: z.array(InvoiceItemSchema).min(1, 'Invoice must have at least one item'),
  subtotal: z.number(),
  taxTotal: z.number(),
  discountTotal: z.number(),
  total: z.number(),
  amountPaid: z.number().default(0),
  currency: z.string().default('USD'),
  notes: z.string().optional(),
  terms: z.string().optional(),
  paymentTerms: PaymentTermsEnum.default('Net 30'),
  createdAt: z.string(),
  updatedAt: z.string(),
  paidAt: z.string().optional(),
});

// Agency Settings schema
export const AgencyBrandingSchema = z.object({
  agencyName: z.string().min(1, 'Agency name is required'),
  tagline: z.string().default('Digital Engineering & Product Studio'),
  email: z.string().email(),
  phone: z.string(),
  website: z.string().url().or(z.string()),
  address: z.string(),
  taxId: z.string(),
  currency: z.string().default('USD'),
  primaryColor: z.string().regex(/^#([0-9A-F]{3}){1,2}$/i, 'Must be a valid hex color'),
  logoUrl: z.string().optional(),
  paymentInstructions: z.string(),
  bankName: z.string(),
  accountNumber: z.string(),
  routingNumber: z.string(),
  swiftBic: z.string().optional(),
  notes: z.string(),
  terms: z.string(),
  invoicePrefix: z.string().default('INV'),
});

export type AIParsedInvoiceExtraction = z.infer<typeof AIParsedInvoiceExtractionSchema>;
export type AIParsedItem = z.infer<typeof AIParsedItemSchema>;
