-- ============================================================================
-- ApexLedger / Commercial Billing Platform - Supabase PostgreSQL Schema
-- ============================================================================

-- Enable UUID extension
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

-- 3. INVOICE LINE ITEMS TABLE
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

-- 4. AGENCY BRANDING & SETTINGS TABLE
CREATE TABLE IF NOT EXISTS agency_branding (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    agency_name TEXT NOT NULL DEFAULT 'Apex Digital Studio',
    tagline TEXT DEFAULT 'High-Velocity Product Engineering & Growth Consulting',
    email TEXT DEFAULT 'billing@apexstudio.io',
    phone TEXT DEFAULT '+1 (555) 234-8901',
    website TEXT DEFAULT 'https://apexstudio.io',
    address TEXT DEFAULT '742 Evergreen Terrace, Suite 400, San Francisco, CA 94107',
    tax_id TEXT DEFAULT 'US-EIN-93821034',
    currency VARCHAR(10) DEFAULT 'USD',
    primary_color VARCHAR(10) DEFAULT '#4f46e5',
    logo_url TEXT,
    payment_instructions TEXT DEFAULT 'Wire transfer / ACH preferred. Include Invoice # in memo.',
    bank_name TEXT DEFAULT 'Silicon Valley Bank / First Republic',
    account_number TEXT DEFAULT '••••••••4892',
    routing_number TEXT DEFAULT '••••1209',
    swift_bic TEXT DEFAULT 'SVBKUS6S',
    notes TEXT DEFAULT 'Thank you for partnering with Apex Studio. Work was delivered under Master Services Agreement.',
    terms TEXT DEFAULT 'Payment is due within designated terms. Late balances accrue 1.5% interest per month.',
    invoice_prefix VARCHAR(10) DEFAULT 'INV',
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for blazing fast query performance on billing ledger
CREATE INDEX IF NOT EXISTS idx_invoices_status ON invoices(status);
CREATE INDEX IF NOT EXISTS idx_invoices_client_id ON invoices(client_id);
CREATE INDEX IF NOT EXISTS idx_invoices_due_date ON invoices(due_date);
CREATE INDEX IF NOT EXISTS idx_invoice_items_invoice_id ON invoice_items(invoice_id);

-- Row Level Security (RLS) setup
ALTER TABLE clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE invoice_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE agency_branding ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow authenticated read/write clients" ON clients FOR ALL USING (true);
CREATE POLICY "Allow authenticated read/write invoices" ON invoices FOR ALL USING (true);
CREATE POLICY "Allow authenticated read/write invoice_items" ON invoice_items FOR ALL USING (true);
CREATE POLICY "Allow authenticated read/write agency_branding" ON agency_branding FOR ALL USING (true);
