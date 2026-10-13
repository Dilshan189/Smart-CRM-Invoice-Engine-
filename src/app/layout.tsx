import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'ApexLedger | Commercial Billing Platform & Revenue Engine for Agencies',
  description:
    'High-velocity commercial billing platform for digital agencies and service teams. Features structured Zod data modeling, dynamic client-ready PDF generation with @react-pdf/renderer, and an AI chat-to-invoice parser.',
  keywords: [
    'commercial billing',
    'agency invoicing',
    'react-pdf',
    'supabase billing',
    'ai invoice parser',
    'zod structured outputs',
    'accounts receivable',
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link rel="icon" href="data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>⚡</text></svg>" />
      </head>
      <body>
        {children}
      </body>
    </html>
  );
}
