import React from 'react';
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
} from '@react-pdf/renderer';
import { Invoice, AgencyBranding } from '@/types';

// PDF Styles
const createStyles = (primaryColor: string) =>
  StyleSheet.create({
    page: {
      padding: 40,
      backgroundColor: '#ffffff',
      fontFamily: 'Helvetica',
      fontSize: 10,
      color: '#1e293b',
    },
    accentBar: {
      height: 6,
      backgroundColor: primaryColor,
      marginBottom: 24,
      borderRadius: 3,
    },
    header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      marginBottom: 30,
    },
    agencyDetails: {
      maxWidth: 280,
    },
    agencyName: {
      fontSize: 20,
      fontFamily: 'Helvetica-Bold',
      color: '#0f172a',
      marginBottom: 4,
    },
    agencyTagline: {
      fontSize: 9,
      color: '#64748b',
      marginBottom: 8,
    },
    agencyMeta: {
      fontSize: 8.5,
      color: '#475569',
      lineHeight: 1.4,
    },
    invoiceMeta: {
      alignItems: 'flex-end',
      minWidth: 160,
    },
    invoiceTitle: {
      fontSize: 24,
      fontFamily: 'Helvetica-Bold',
      color: primaryColor,
      letterSpacing: 1,
    },
    invoiceNumber: {
      fontSize: 12,
      fontFamily: 'Helvetica-Bold',
      color: '#334155',
      marginTop: 4,
      marginBottom: 8,
    },
    statusBadge: {
      paddingVertical: 4,
      paddingHorizontal: 10,
      borderRadius: 4,
      fontSize: 9,
      fontFamily: 'Helvetica-Bold',
      textTransform: 'uppercase',
      marginBottom: 10,
    },
    statusPaid: {
      backgroundColor: '#dcfce7',
      color: '#15803d',
    },
    statusSent: {
      backgroundColor: '#dbeafe',
      color: '#1d4ed8',
    },
    statusOverdue: {
      backgroundColor: '#fee2e2',
      color: '#b91c1c',
    },
    statusDraft: {
      backgroundColor: '#f1f5f9',
      color: '#475569',
    },
    dateRow: {
      flexDirection: 'row',
      justifyContent: 'flex-end',
      marginTop: 2,
    },
    dateLabel: {
      fontSize: 8.5,
      color: '#64748b',
      marginRight: 6,
    },
    dateValue: {
      fontSize: 8.5,
      fontFamily: 'Helvetica-Bold',
      color: '#1e293b',
    },
    billToSection: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      backgroundColor: '#f8fafc',
      padding: 16,
      borderRadius: 6,
      marginBottom: 24,
      borderWidth: 1,
      borderColor: '#e2e8f0',
    },
    billColumn: {
      width: '48%',
    },
    sectionHeading: {
      fontSize: 8,
      fontFamily: 'Helvetica-Bold',
      color: '#64748b',
      textTransform: 'uppercase',
      letterSpacing: 0.8,
      marginBottom: 6,
    },
    clientCompanyName: {
      fontSize: 12,
      fontFamily: 'Helvetica-Bold',
      color: '#0f172a',
      marginBottom: 2,
    },
    clientText: {
      fontSize: 9,
      color: '#475569',
      lineHeight: 1.4,
    },
    table: {
      marginBottom: 20,
    },
    tableHeader: {
      flexDirection: 'row',
      backgroundColor: '#f1f5f9',
      borderTopWidth: 1,
      borderBottomWidth: 1,
      borderColor: '#cbd5e1',
      paddingVertical: 7,
      paddingHorizontal: 8,
    },
    tableHeaderCell: {
      fontSize: 8.5,
      fontFamily: 'Helvetica-Bold',
      color: '#334155',
      textTransform: 'uppercase',
    },
    tableRow: {
      flexDirection: 'row',
      borderBottomWidth: 1,
      borderColor: '#e2e8f0',
      paddingVertical: 9,
      paddingHorizontal: 8,
    },
    tableRowEven: {
      backgroundColor: '#fafafa',
    },
    colDesc: {
      flex: 5,
    },
    colCategory: {
      flex: 2,
    },
    colQty: {
      flex: 1.2,
      textAlign: 'right',
    },
    colPrice: {
      flex: 1.8,
      textAlign: 'right',
    },
    colTax: {
      flex: 1.2,
      textAlign: 'right',
    },
    colTotal: {
      flex: 2,
      textAlign: 'right',
    },
    itemTitle: {
      fontSize: 9.5,
      fontFamily: 'Helvetica-Bold',
      color: '#1e293b',
      marginBottom: 2,
    },
    itemNotes: {
      fontSize: 8,
      color: '#64748b',
    },
    categoryPill: {
      fontSize: 7.5,
      color: '#475569',
      backgroundColor: '#f1f5f9',
      paddingHorizontal: 5,
      paddingVertical: 2,
      borderRadius: 3,
      alignSelf: 'flex-start',
    },
    summarySection: {
      flexDirection: 'row',
      justifyContent: 'flex-end',
      marginBottom: 24,
    },
    summaryBox: {
      width: 240,
    },
    summaryRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      paddingVertical: 4,
    },
    summaryLabel: {
      fontSize: 9,
      color: '#64748b',
    },
    summaryValue: {
      fontSize: 9,
      fontFamily: 'Helvetica-Bold',
      color: '#334155',
    },
    totalRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      backgroundColor: primaryColor,
      paddingVertical: 8,
      paddingHorizontal: 12,
      borderRadius: 4,
      marginTop: 6,
    },
    totalLabel: {
      fontSize: 11,
      fontFamily: 'Helvetica-Bold',
      color: '#ffffff',
    },
    totalValue: {
      fontSize: 12,
      fontFamily: 'Helvetica-Bold',
      color: '#ffffff',
    },
    notesSection: {
      borderTopWidth: 1,
      borderColor: '#e2e8f0',
      paddingTop: 16,
      flexDirection: 'row',
      justifyContent: 'space-between',
    },
    notesCol: {
      width: '48%',
    },
    notesHeading: {
      fontSize: 8,
      fontFamily: 'Helvetica-Bold',
      color: '#64748b',
      textTransform: 'uppercase',
      marginBottom: 4,
    },
    notesText: {
      fontSize: 8,
      color: '#475569',
      lineHeight: 1.4,
    },
    bankDetails: {
      backgroundColor: '#f8fafc',
      padding: 10,
      borderRadius: 4,
      borderWidth: 1,
      borderColor: '#e2e8f0',
      marginTop: 4,
    },
    bankText: {
      fontSize: 8,
      color: '#334155',
      lineHeight: 1.35,
    },
    footer: {
      position: 'absolute',
      bottom: 25,
      left: 40,
      right: 40,
      textAlign: 'center',
      borderTopWidth: 1,
      borderColor: '#f1f5f9',
      paddingTop: 8,
    },
    footerText: {
      fontSize: 7.5,
      color: '#94a3b8',
    },
  });

interface InvoicePdfDocumentProps {
  invoice: Invoice;
  branding: AgencyBranding;
}

export function InvoicePdfDocument({ invoice, branding }: InvoicePdfDocumentProps) {
  const primaryColor = branding?.primaryColor || '#4f46e5';
  const styles = createStyles(primaryColor);

  const getStatusBadgeStyle = (status: string) => {
    switch (status) {
      case 'Paid':
        return styles.statusPaid;
      case 'Sent':
        return styles.statusSent;
      case 'Overdue':
        return styles.statusOverdue;
      case 'Draft':
      default:
        return styles.statusDraft;
    }
  };

  const currency = invoice.currency || 'USD';
  const formatMoney = (val: number) => {
    return `${currency} ${val.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  return (
    <Document title={`Invoice ${invoice.invoiceNumber}`} author={branding.agencyName}>
      <Page size="A4" style={styles.page}>
        {/* Accent Bar */}
        <View style={styles.accentBar} />

        {/* Top Header */}
        <View style={styles.header}>
          <View style={styles.agencyDetails}>
            <Text style={styles.agencyName}>{branding.agencyName}</Text>
            <Text style={styles.agencyTagline}>{branding.tagline}</Text>
            <Text style={styles.agencyMeta}>{branding.address}</Text>
            <Text style={styles.agencyMeta}>
              {branding.email} • {branding.phone}
            </Text>
            {branding.taxId && (
              <Text style={styles.agencyMeta}>Tax ID / VAT: {branding.taxId}</Text>
            )}
          </View>

          <View style={styles.invoiceMeta}>
            <Text style={styles.invoiceTitle}>INVOICE</Text>
            <Text style={styles.invoiceNumber}>{invoice.invoiceNumber}</Text>
            <Text style={[styles.statusBadge, getStatusBadgeStyle(invoice.status)]}>
              ● {invoice.status.toUpperCase()}
            </Text>
            <View style={styles.dateRow}>
              <Text style={styles.dateLabel}>Issue Date:</Text>
              <Text style={styles.dateValue}>{invoice.issueDate}</Text>
            </View>
            <View style={styles.dateRow}>
              <Text style={styles.dateLabel}>Due Date:</Text>
              <Text style={styles.dateValue}>{invoice.dueDate}</Text>
            </View>
            <View style={styles.dateRow}>
              <Text style={styles.dateLabel}>Payment Terms:</Text>
              <Text style={styles.dateValue}>{invoice.paymentTerms}</Text>
            </View>
          </View>
        </View>

        {/* Billed To & Summary Row */}
        <View style={styles.billToSection}>
          <View style={styles.billColumn}>
            <Text style={styles.sectionHeading}>Billed To</Text>
            <Text style={styles.clientCompanyName}>{invoice.clientCompany}</Text>
            <Text style={styles.clientText}>Attn: {invoice.clientName}</Text>
            <Text style={styles.clientText}>{invoice.clientEmail}</Text>
            <Text style={styles.clientText}>{invoice.clientAddress}</Text>
            {invoice.clientTaxId && (
              <Text style={styles.clientText}>Tax ID: {invoice.clientTaxId}</Text>
            )}
          </View>
          <View style={styles.billColumn}>
            <Text style={styles.sectionHeading}>Payment Destination</Text>
            <Text style={styles.clientCompanyName}>{branding.agencyName}</Text>
            <Text style={styles.clientText}>Bank: {branding.bankName}</Text>
            <Text style={styles.clientText}>Account: {branding.accountNumber}</Text>
            <Text style={styles.clientText}>Routing: {branding.routingNumber}</Text>
            {branding.swiftBic && (
              <Text style={styles.clientText}>SWIFT / BIC: {branding.swiftBic}</Text>
            )}
          </View>
        </View>

        {/* Line Items Table */}
        <View style={styles.table}>
          {/* Header */}
          <View style={styles.tableHeader}>
            <Text style={[styles.tableHeaderCell, styles.colDesc]}>Description & Scope</Text>
            <Text style={[styles.tableHeaderCell, styles.colCategory]}>Category</Text>
            <Text style={[styles.tableHeaderCell, styles.colQty]}>Qty / Hrs</Text>
            <Text style={[styles.tableHeaderCell, styles.colPrice]}>Rate</Text>
            <Text style={[styles.tableHeaderCell, styles.colTax]}>Tax %</Text>
            <Text style={[styles.tableHeaderCell, styles.colTotal]}>Amount</Text>
          </View>

          {/* Rows */}
          {invoice.items.map((item, index) => (
            <View
              key={item.id || index}
              style={[styles.tableRow, index % 2 === 1 ? styles.tableRowEven : {}]}
            >
              <View style={styles.colDesc}>
                <Text style={styles.itemTitle}>{item.description}</Text>
                {item.notes && <Text style={styles.itemNotes}>{item.notes}</Text>}
              </View>
              <View style={styles.colCategory}>
                <Text style={styles.categoryPill}>{item.category}</Text>
              </View>
              <Text style={[styles.clientText, styles.colQty]}>{item.quantity}</Text>
              <Text style={[styles.clientText, styles.colPrice]}>
                {formatMoney(item.unitPrice)}
              </Text>
              <Text style={[styles.clientText, styles.colTax]}>
                {item.taxRate > 0 ? `${item.taxRate}%` : '0%'}
              </Text>
              <Text style={[styles.itemTitle, styles.colTotal]}>
                {formatMoney(item.amount)}
              </Text>
            </View>
          ))}
        </View>

        {/* Summary Totals */}
        <View style={styles.summarySection}>
          <View style={styles.summaryBox}>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Subtotal</Text>
              <Text style={styles.summaryValue}>{formatMoney(invoice.subtotal)}</Text>
            </View>
            {invoice.discountTotal > 0 && (
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Discount Applied</Text>
                <Text style={[styles.summaryValue, { color: '#16a34a' }]}>
                  -{formatMoney(invoice.discountTotal)}
                </Text>
              </View>
            )}
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Tax & VAT</Text>
              <Text style={styles.summaryValue}>{formatMoney(invoice.taxTotal)}</Text>
            </View>
            <View style={styles.totalRow}>
              <Text style={styles.totalLabel}>TOTAL AMOUNT DUE</Text>
              <Text style={styles.totalValue}>{formatMoney(invoice.total)}</Text>
            </View>
            {invoice.amountPaid > 0 && (
              <>
                <View style={[styles.summaryRow, { marginTop: 6 }]}>
                  <Text style={styles.summaryLabel}>Amount Paid</Text>
                  <Text style={[styles.summaryValue, { color: '#16a34a' }]}>
                    {formatMoney(invoice.amountPaid)}
                  </Text>
                </View>
                <View style={styles.summaryRow}>
                  <Text style={styles.summaryLabel}>Remaining Balance</Text>
                  <Text style={styles.summaryValue}>
                    {formatMoney(Math.max(0, invoice.total - invoice.amountPaid))}
                  </Text>
                </View>
              </>
            )}
          </View>
        </View>

        {/* Notes & Terms */}
        <View style={styles.notesSection}>
          <View style={styles.notesCol}>
            <Text style={styles.notesHeading}>Payment Instructions</Text>
            <Text style={styles.notesText}>{branding.paymentInstructions}</Text>
            <View style={styles.bankDetails}>
              <Text style={styles.bankText}>Wire Beneficiary: {branding.agencyName}</Text>
              <Text style={styles.bankText}>
                Account: {branding.accountNumber} | Routing: {branding.routingNumber}
              </Text>
              {branding.swiftBic && (
                <Text style={styles.bankText}>SWIFT/BIC: {branding.swiftBic}</Text>
              )}
            </View>
          </View>

          <View style={styles.notesCol}>
            <Text style={styles.notesHeading}>Terms & Conditions</Text>
            <Text style={styles.notesText}>
              {invoice.terms || branding.terms}
            </Text>
            {invoice.notes && (
              <View style={{ marginTop: 8 }}>
                <Text style={styles.notesHeading}>Invoice Notes</Text>
                <Text style={styles.notesText}>{invoice.notes}</Text>
              </View>
            )}
          </View>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>
            {branding.agencyName} • {branding.website} • Generated via Commercial Billing Engine
          </Text>
        </View>
      </Page>
    </Document>
  );
}
