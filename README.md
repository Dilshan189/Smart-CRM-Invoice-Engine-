<div align="center">

# ⚡ Smart CRM & Invoice Engine (ApexLedger)

**A high-velocity Commercial Billing Platform & Revenue Operating System for digital agencies, engineering consultancies, and creative service teams.**

[![Next.js](https://img.shields.io/badge/Next.js-15.1-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19.0-blue?style=for-the-badge&logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7-3178C6?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![Supabase](https://img.shields.io/badge/Supabase-PostgreSQL-3ECF8E?style=for-the-badge&logo=supabase)](https://supabase.com/)
[![Zod](https://img.shields.io/badge/Zod-Structured%20Outputs-3E67B1?style=for-the-badge&logo=zod)](https://zod.dev/)
[![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)](#license)

[Features](#-key-features) • [Architecture](#-system-architecture) • [Tech Stack](#-tech-stack) • [Quick Start](#-getting-started) • [API Routes](#-api-endpoints) • [Supabase Setup](#-database-setup-supabase)

</div>

---

## 🌟 Executive Summary

**Smart CRM & Invoice Engine** is a modern B2B SaaS platform engineered to solve real-world agency billing bottlenecks. Traditional billing tools lack deep integration between informal client communications (Slack, WhatsApp voice notes, email threads) and formal accounts receivable workflows.

This platform bridges that gap by combining:
1. **Zod-validated AI extraction** to parse unstructured chat logs into tabular deliverables.
2. An **interactive accounts receivable ledger** tracking GAAP-standard aging schedules.
3. A **dynamic PDF rendering pipeline** powered by `@react-pdf/renderer` for client-ready, server-streamed invoices with agency branding.

---

## 🚀 Key Features

### 1. 📊 Client & Ledger Management (Accounts Receivable OS)
- **Full Lifecycle Registry**: Real-time status tracking across `Draft`, `Sent`, `Paid`, and `Overdue`.
- **Instant Status Workflows**: Dropdown status transitions with celebratory particle physics (confetti) upon settlement.
- **Financial Intelligence KPIs**:
  - **Realized Revenue**: Collected capital with average settlement velocity metrics.
  - **Outstanding Balance**: Active invoices within designated Net terms.
  - **Overdue Balances**: Actionable aging alerts requiring chase reminders.
  - **Draft Pipeline**: Unissued work-in-progress capital.
  - **Receivables Aging Schedule**: Visual distribution bar tracking **Current (0–30d)**, **31–60d**, and **61–90+ days** aging buckets.
- **Client Directory**: Manage corporate client accounts, tax/VAT identifiers, default payment terms (`Due on Receipt`, `Net 15`, `Net 30`, `Net 45`, `Net 60`), and lifetime revenue.

### 2. ⚡ AI Text-to-Invoice Parser (Zod Structured Outputs)
- **Unstructured Chat Extraction**: Automatically processes unstructured client logs into structured billing items:
  - *Slack Dev Sprints*: Extracts billable hours, rates, cloud infrastructure fees, and milestones.
  - *WhatsApp Voice Transcripts*: Parses design deliverables, prototyping flows, and revision hours.
  - *Email Summaries*: Detects monthly engineering retainers, emergency overages, and pass-through software expenses.
- **Strict Zod Schema Enforcement**: Validates every parsed item against `AIParsedInvoiceExtractionSchema` for guaranteed type safety.
- **Interactive Workbench**:
  - 1-click realistic demo presets.
  - Live Zod validation badge (`✓ Schema Validated: Strict Zod Structured Output`).
  - Tabular editable review grid before transferring items into a new invoice.

### 3. 📄 Dynamic PDF Render Pipeline (`@react-pdf/renderer`)
- **Server-Side Render (`POST /api/invoices/render-pdf`)**: Renders and streams production-ready PDF binaries directly from Node.js runtime.
- **Client-Side Live Preview**: Interactive browser modal previewing exact A4 dimensions, typography, and styling before sending.
- **Dynamic Agency Branding Engine**:
  - **Live Palette Switcher**: Instant theme adaptation across *Indigo Luxe*, *Emerald Vault*, *Royal Violet*, *Obsidian Slate*, *Amber Gold*, and *Crimson Rose*.
  - **Treasury & Wire Destination**: Automatically prints bank wire instructions, routing numbers, and international SWIFT/BIC codes on invoices.
  - **Terms & Notes**: Customizable MSA clauses, finance charges, and client-specific project notes.

### 4. 🗄️ Supabase Cloud Architecture & Local Sync
- **Production PostgreSQL Migration** (`supabase/schema.sql`):
  - Tables: `clients`, `invoices`, `invoice_items`, `agency_branding`.
  - Row Level Security (RLS) policies for multi-tenant isolation.
  - Performance B-Tree indexes on invoice statuses, due dates, and foreign keys.
- **Hybrid Storage Layer**: Built-in reactive browser storage with instant sync and Supabase connection readiness.

---

## 📐 System Architecture

```mermaid
graph TD
    A[Unstructured Client Chat / Voice Log] -->|Raw Text| B[AI Text-to-Invoice Parser]
    B -->|Schema Parse| C{Zod Structured Output}
    C -->|Validated Items| D[Interactive Review & Editor]
    D -->|Persist| E[Accounts Receivable Ledger]
    
    E --> F[Status Engine: Draft / Sent / Paid / Overdue]
    E --> G[Aging Schedule Analytics 0-30 / 31-60 / 61-90+]
    
    E --> H[@react-pdf/renderer Engine]
    I[Agency Branding: Accent, Wire, Logo] --> H
    H -->|Server Stream| J[Official Downloadable PDF]
    H -->|Client React| K[Live Preview Canvas]
```

---

## 🛠️ Tech Stack

| Layer | Technology | Purpose |
|---|---|---|
| **Framework** | **Next.js 15 (App Router)** | Modern React server & client architecture |
| **Language** | **TypeScript 5.7** | End-to-end type safety |
| **PDF Engine** | **@react-pdf/renderer 4.2** | Server and client PDF document compilation |
| **Data Validation** | **Zod 3.24** | Strict structured schema parsing for AI & API |
| **Database** | **Supabase (@supabase/supabase-js)** | Cloud PostgreSQL with RLS and schema migrations |
| **Styling** | **Vanilla CSS (Design Tokens)** | High-performance obsidian dark theme & glassmorphism |
| **Icons** | **Lucide React** | Consistent commercial design iconography |
| **FX** | **Canvas Confetti** | Micro-interaction celebratory particle feedback |

---

## 📁 Project Structure

```
Smart-CRM-Invoice-Engine/
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   ├── ai/parse-invoice/route.ts      # REST endpoint for AI parsing
│   │   │   └── invoices/render-pdf/route.ts   # Server-side PDF binary generation
│   │   ├── globals.css                        # Obsidian Luxe design tokens & glassmorphism
│   │   ├── layout.tsx                         # SEO metadata & root HTML layout
│   │   └── page.tsx                           # Main dashboard & ledger view
│   ├── components/
│   │   ├── AIParserModal.tsx                  # Interactive chat log parser modal
│   │   ├── BrandingSettingsModal.tsx          # Agency identity & bank wire settings
│   │   ├── ClientManagerModal.tsx             # Client directory & lifetime CRM metrics
│   │   ├── InvoiceModal.tsx                   # Full invoice builder & line items editor
│   │   ├── LedgerTable.tsx                    # Billing registry & quick actions table
│   │   ├── Navbar.tsx                         # Header navigation & system indicators
│   │   ├── PdfDocument.tsx                    # @react-pdf/renderer document template
│   │   ├── PdfPreviewModal.tsx                # Client-ready PDF preview & theme picker
│   │   ├── StatsCards.tsx                     # Realized revenue & aging schedule
│   │   └── SupabaseModal.tsx                  # Cloud database connection guide & SQL
│   ├── lib/
│   │   ├── ai-parser.ts                       # Semantic extractor with strict Zod parsing
│   │   ├── formatters.ts                      # Currency, dates, aging diff calculations
│   │   ├── schemas.ts                         # Zod schemas for invoices, items, and AI
│   │   ├── storage.ts                         # Reactive data layer with sample fixtures
│   │   └── supabase.ts                        # Supabase client initializer
│   └── types/
│       └── index.ts                           # TypeScript domain models
├── supabase/
│   └── schema.sql                             # Full PostgreSQL migration schema with RLS
├── package.json
├── tsconfig.json
└── next.config.mjs
```

---

## 🚀 Getting Started

### Prerequisites
- **Node.js** >= 18.18.0 (Tested on Node 20 / 24)
- **npm** or **pnpm**

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/Dilshan189/Smart-CRM-Invoice-Engine-.git
   cd Smart-CRM-Invoice-Engine-
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the development server:**
   ```bash
   npm run dev
   ```

4. **Open the platform:**
   Navigate to [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🔌 API Endpoints

### 1. `POST /api/ai/parse-invoice`
Converts unstructured chat text into Zod-validated invoice items.

- **Request Body:**
  ```json
  {
    "text": "Billed 25 hours on Next.js checkout redesign at $130/hr for Acme Corp. Terms Net 30."
  }
  ```
- **Response:**
  ```json
  {
    "success": true,
    "data": {
      "detectedClientName": "Acme Corp",
      "currency": "USD",
      "detectedPaymentTerms": "Net 30",
      "confidenceScore": 0.95,
      "items": [
        {
          "description": "Next.js checkout redesign",
          "category": "Development",
          "quantity": 25,
          "unitPrice": 130,
          "taxRate": 0,
          "discount": 0
        }
      ]
    },
    "metadata": {
      "zodSchemaValidated": true
    }
  }
  ```

### 2. `POST /api/invoices/render-pdf`
Generates a downloadable binary PDF using `@react-pdf/renderer`.

- **Headers:** `Content-Type: application/json`
- **Response:** Binary stream with `Content-Type: application/pdf` and `Content-Disposition: attachment`.

---

## 🗄️ Database Setup (Supabase)

To link with a remote Supabase instance:

1. Create a free project at [supabase.com](https://supabase.com).
2. Open the **SQL Editor** in your Supabase dashboard and run the script in [`supabase/schema.sql`](supabase/schema.sql).
3. Create a `.env.local` file in the project root:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
   ```

---

## 💼 Portfolio Highlights (For Technical Recruiters)

- **GAAP-Standard Accounts Receivable Aging**: Demonstrates real domain modeling beyond basic CRUD apps.
- **Robust Zod Structured Outputs**: Showcases modern AI engineering patterns using typed schemas instead of brittle raw string processing.
- **Dual PDF Rendering Architecture**: Solves complex client vs. server rendering constraints with `@react-pdf/renderer`.
- **Zero Third-Party CSS Bloat**: Pure vanilla CSS design tokens for maximum performance, bespoke dark aesthetics, and glassmorphism.

---

## 📄 License

This project is licensed under the **MIT License** — feel free to use and adapt it for commercial or educational purposes.

---

<div align="center">
  <sub>Built with ❤️ by Dilshan • Next.js 15 App Router & Supabase</sub>
</div>