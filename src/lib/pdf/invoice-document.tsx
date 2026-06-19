import React from "react";
import {
  Document,
  Image,
  Page,
  StyleSheet,
  Text,
  View,
} from "@react-pdf/renderer";

export type Currency = "USD" | "INR";

export interface LineItem {
  description: string;
  amount: number;
}

export interface InvoiceDocumentProps {
  invoiceNumber: string;
  issuedDate: string;
  dueDate: string;
  customerName: string;
  customerEmail: string;
  lineItems: LineItem[];
  total: number;
  currency: Currency;
  notes?: string;
  logoPath: string;
}

const CURRENCY_SYMBOL: Record<Currency, string> = { USD: "$", INR: "₹" };
const CURRENCY_LABEL: Record<Currency, string> = {
  USD: "United States Dollar (USD)",
  INR: "Indian Rupee (INR)",
};

function fmt(amount: number, currency: Currency): string {
  return new Intl.NumberFormat(currency === "INR" ? "en-IN" : "en-US", {
    style: "currency",
    currency,
    minimumFractionDigits: 2,
  }).format(amount);
}

const C = {
  black:     "#000000",
  white:     "#ffffff",
  surface:   "#f7f9fb",
  container: "#eceef0",
  containerLow: "#f2f4f6",
  onSurface: "#191c1e",
  onVariant: "#45464d",
  outline:   "#c6c6cd",
  accent:    "#07006c",
  accentFg:  "#ffffff",
  green:     "#1e6b3a",
  greenBg:   "#e6f4ea",
};

const s = StyleSheet.create({
  page: {
    fontFamily: "Helvetica",
    backgroundColor: C.white,
    paddingHorizontal: 48,
    paddingTop: 44,
    paddingBottom: 80,
    fontSize: 10,
    color: C.onSurface,
  },

  // ─ Header ─
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 32,
    paddingBottom: 24,
    borderBottomWidth: 1,
    borderBottomColor: C.outline,
  },
  logo: { width: 140, height: 24, objectFit: "contain" },
  headerRight: { alignItems: "flex-end" },
  invoiceLabel: {
    fontSize: 26,
    fontFamily: "Helvetica-Bold",
    color: C.black,
    letterSpacing: -1,
    marginBottom: 4,
  },
  invoiceNum: { fontSize: 10, color: C.onVariant },
  badge: {
    marginTop: 6,
    backgroundColor: C.greenBg,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 4,
  },
  badgeText: {
    fontSize: 8,
    fontFamily: "Helvetica-Bold",
    color: C.green,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },

  // ─ Meta row ─
  metaRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 28,
    gap: 20,
  },
  metaBlock: { flex: 1 },
  metaLabel: {
    fontSize: 7.5,
    fontFamily: "Helvetica-Bold",
    color: C.onVariant,
    textTransform: "uppercase",
    letterSpacing: 0.8,
    marginBottom: 5,
  },
  metaName: { fontSize: 11, fontFamily: "Helvetica-Bold", color: C.onSurface },
  metaText: { fontSize: 10, color: C.onSurface, lineHeight: 1.5 },

  // ─ Table ─
  tableHead: {
    flexDirection: "row",
    backgroundColor: C.accent,
    paddingHorizontal: 12,
    paddingVertical: 9,
    borderRadius: 5,
    marginBottom: 2,
  },
  tableHeadText: {
    fontSize: 8.5,
    fontFamily: "Helvetica-Bold",
    color: C.accentFg,
    textTransform: "uppercase",
    letterSpacing: 0.4,
  },
  tableRow: {
    flexDirection: "row",
    paddingHorizontal: 12,
    paddingVertical: 11,
    borderRadius: 4,
    marginBottom: 2,
  },
  rowEven: { backgroundColor: C.containerLow },
  rowOdd:  { backgroundColor: C.container },
  colDesc:   { flex: 3 },
  colQty:    { flex: 0.6, textAlign: "center" },
  colUnit:   { flex: 1.4, textAlign: "right" },
  colTotal:  { flex: 1.4, textAlign: "right" },
  cell:      { fontSize: 10, color: C.onSurface, lineHeight: 1.5 },
  cellBold:  { fontSize: 10, fontFamily: "Helvetica-Bold", color: C.onSurface },

  // ─ Totals ─
  totalsWrap: { marginTop: 14, alignItems: "flex-end" },
  totalsBox:  { width: 260 },
  totalsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 6,
    borderBottomWidth: 1,
    borderBottomColor: C.outline,
  },
  totalsLabel: { fontSize: 10, color: C.onVariant },
  totalsVal:   { fontSize: 10, fontFamily: "Helvetica-Bold", color: C.onSurface },
  totalsDue: {
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: C.accent,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 5,
    marginTop: 4,
  },
  totalsDueLabel: { fontSize: 12, fontFamily: "Helvetica-Bold", color: C.white },
  totalsDueVal:   { fontSize: 12, fontFamily: "Helvetica-Bold", color: C.white },
  currencyNote: {
    fontSize: 7.5,
    color: C.onVariant,
    marginTop: 5,
    textAlign: "right",
  },

  // ─ Notes / payment ─
  notesBox: {
    marginTop: 24,
    padding: 14,
    backgroundColor: C.container,
    borderRadius: 5,
  },
  paymentBox: {
    marginTop: 8,
    padding: 14,
    backgroundColor: C.containerLow,
    borderRadius: 5,
  },
  boxLabel: {
    fontSize: 7.5,
    fontFamily: "Helvetica-Bold",
    color: C.onVariant,
    textTransform: "uppercase",
    letterSpacing: 0.8,
    marginBottom: 5,
  },
  boxText: { fontSize: 10, color: C.onSurface, lineHeight: 1.6 },

  // ─ Footer ─
  footer: {
    position: "absolute",
    bottom: 28,
    left: 48,
    right: 48,
    borderTopWidth: 1,
    borderTopColor: C.outline,
    paddingTop: 10,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  footerText:  { fontSize: 8, color: C.onVariant },
  footerBrand: { fontSize: 8, fontFamily: "Helvetica-Bold", color: C.onSurface },
});

export function InvoiceDocument(p: InvoiceDocumentProps) {
  const subtotal = p.lineItems.reduce((s, i) => s + i.amount, 0);

  return (
    <Document
      title={`Invoice ${p.invoiceNumber} — Klikktek`}
      author="Klikktek"
      subject={`Invoice for ${p.customerName}`}
    >
      <Page size="A4" style={s.page}>

        {/* Header */}
        <View style={s.header}>
          <Image style={s.logo} src={p.logoPath} />
          <View style={s.headerRight}>
            <Text style={s.invoiceLabel}>INVOICE</Text>
            <Text style={s.invoiceNum}>{p.invoiceNumber}</Text>
            <View style={s.badge}>
              <Text style={s.badgeText}>Due</Text>
            </View>
          </View>
        </View>

        {/* Meta */}
        <View style={s.metaRow}>
          <View style={s.metaBlock}>
            <Text style={s.metaLabel}>From</Text>
            <Text style={s.metaName}>Klikktek</Text>
            <Text style={s.metaText}>contact@klikktek.com</Text>
            <Text style={s.metaText}>+1 312 477 6452</Text>
          </View>
          <View style={s.metaBlock}>
            <Text style={s.metaLabel}>Bill To</Text>
            <Text style={s.metaName}>{p.customerName}</Text>
            <Text style={s.metaText}>{p.customerEmail}</Text>
          </View>
          <View style={s.metaBlock}>
            <Text style={s.metaLabel}>Issue Date</Text>
            <Text style={[s.metaText, { marginBottom: 8 }]}>{p.issuedDate}</Text>
            <Text style={s.metaLabel}>Due Date</Text>
            <Text style={s.metaText}>{p.dueDate}</Text>
          </View>
        </View>

        {/* Table */}
        <View>
          <View style={s.tableHead}>
            <Text style={[s.tableHeadText, s.colDesc]}>Description</Text>
            <Text style={[s.tableHeadText, s.colQty, { textAlign: "center" }]}>Qty</Text>
            <Text style={[s.tableHeadText, s.colUnit, { textAlign: "right" }]}>
              Unit ({CURRENCY_SYMBOL[p.currency]})
            </Text>
            <Text style={[s.tableHeadText, s.colTotal, { textAlign: "right" }]}>Total</Text>
          </View>

          {p.lineItems.map((item, i) => (
            <View key={i} style={[s.tableRow, i % 2 === 0 ? s.rowEven : s.rowOdd]}>
              <Text style={[s.cell, s.colDesc]}>{item.description}</Text>
              <Text style={[s.cell, s.colQty, { textAlign: "center" }]}>1</Text>
              <Text style={[s.cell, s.colUnit, { textAlign: "right" }]}>
                {fmt(item.amount, p.currency)}
              </Text>
              <Text style={[s.cellBold, s.colTotal, { textAlign: "right" }]}>
                {fmt(item.amount, p.currency)}
              </Text>
            </View>
          ))}
        </View>

        {/* Totals */}
        <View style={s.totalsWrap}>
          <View style={s.totalsBox}>
            {p.lineItems.length > 1 && (
              <View style={s.totalsRow}>
                <Text style={s.totalsLabel}>Subtotal</Text>
                <Text style={s.totalsVal}>{fmt(subtotal, p.currency)}</Text>
              </View>
            )}
            <View style={s.totalsRow}>
              <Text style={s.totalsLabel}>Tax</Text>
              <Text style={s.totalsVal}>—</Text>
            </View>
            <View style={s.totalsDue}>
              <Text style={s.totalsDueLabel}>Total Due</Text>
              <Text style={s.totalsDueVal}>{fmt(p.total, p.currency)}</Text>
            </View>
            <Text style={s.currencyNote}>{CURRENCY_LABEL[p.currency]}</Text>
          </View>
        </View>

        {/* Notes */}
        {p.notes && (
          <View style={s.notesBox}>
            <Text style={s.boxLabel}>Notes</Text>
            <Text style={s.boxText}>{p.notes}</Text>
          </View>
        )}

        {/* Payment info */}
        <View style={s.paymentBox}>
          <Text style={s.boxLabel}>Payment Information</Text>
          <Text style={s.boxText}>
            Please make payment within 14 days of the invoice date.
            For payment queries contact us at contact@klikktek.com.
          </Text>
        </View>

        {/* Footer */}
        <View style={s.footer} fixed>
          <Text style={s.footerText}>Invoice {p.invoiceNumber} · Klikktek</Text>
          <Text style={s.footerBrand}>klikktek.com</Text>
        </View>

      </Page>
    </Document>
  );
}
