import { NextRequest, NextResponse } from 'next/server';
import React from 'react';
import { renderToBuffer } from '@react-pdf/renderer';
import { InvoicePdfDocument } from '@/components/PdfDocument';
import { Invoice, AgencyBranding } from '@/types';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const { invoice, branding }: { invoice: Invoice; branding: AgencyBranding } = await req.json();

    if (!invoice || !invoice.invoiceNumber) {
      return NextResponse.json(
        { error: 'Valid invoice payload is required' },
        { status: 400 }
      );
    }

    // Render the React PDF Document into a Node buffer
    const pdfBuffer = await renderToBuffer(
      React.createElement(InvoicePdfDocument, {
        invoice,
        branding: branding || {
          agencyName: 'Apex Digital Studio',
          tagline: 'High-Velocity Product Engineering',
          email: 'billing@apexstudio.io',
          phone: '+1 (555) 234-8901',
          website: 'https://apexstudio.io',
          address: '742 Evergreen Terrace, Suite 400, San Francisco, CA 94107',
          taxId: 'US-EIN-93821034',
          currency: 'USD',
          primaryColor: '#4f46e5',
          paymentInstructions: 'Wire transfer / ACH preferred. Include Invoice # in memo.',
          bankName: 'Silicon Valley Bank / First Republic',
          accountNumber: '••••••••4892',
          routingNumber: '••••1209',
          notes: 'Work was delivered under Master Services Agreement.',
          terms: 'Payment is due within designated terms.',
          invoicePrefix: 'INV',
        },
      }) as any
    );

    const safeFilename = `${invoice.invoiceNumber || 'Invoice'}_${invoice.clientCompany?.replace(/[^a-zA-Z0-9]/g, '_') || 'Client'}.pdf`;

    return new NextResponse(pdfBuffer as any, {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="${safeFilename}"`,
        'Cache-Control': 'no-cache, no-store, must-revalidate',
      },
    });
  } catch (error: any) {
    console.error('Server PDF generation error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to generate PDF document' },
      { status: 500 }
    );
  }
}
