import path from "path";
import { NextRequest, NextResponse } from "next/server";
import { renderToBuffer } from "@react-pdf/renderer";
import { InvoiceDocument } from "@/lib/pdf/invoice-document";
import type { Currency, LineItem } from "@/lib/pdf/invoice-document";

interface InvoicePayload {
  customerName: string;
  customerEmail: string;
  currency: Currency;
  lineItems: LineItem[];
  invoiceNumber?: string;
  dueDate?: string;
  notes?: string;
}

function generateInvoiceNumber(): string {
  const d = new Date();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const rand = Math.floor(1000 + Math.random() * 9000);
  return `KT-${d.getFullYear()}${mm}-${rand}`;
}

function fmtDate(date: Date): string {
  return date.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
}

export async function POST(req: NextRequest) {
  // ── Auth ────────────────────────────────────────────────────────────────
  if (!process.env.INVOICE_SECRET) {
    console.error("INVOICE_SECRET env var is not set");
    return NextResponse.json({ error: "Server configuration error." }, { status: 500 });
  }

  const auth = req.headers.get("authorization");
  if (auth !== `Bearer ${process.env.INVOICE_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  // ── Parse ───────────────────────────────────────────────────────────────
  let payload: InvoicePayload;
  try {
    payload = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON." }, { status: 400 });
  }

  const { customerName, customerEmail, currency, lineItems } = payload;

  if (!customerName?.trim() || !customerEmail?.trim() || !currency) {
    return NextResponse.json(
      { error: "customerName, customerEmail and currency are required." },
      { status: 400 },
    );
  }

  if (!["USD", "INR"].includes(currency)) {
    return NextResponse.json({ error: "currency must be USD or INR." }, { status: 400 });
  }

  if (!Array.isArray(lineItems) || lineItems.length === 0) {
    return NextResponse.json({ error: "lineItems must be a non-empty array." }, { status: 400 });
  }

  for (let i = 0; i < lineItems.length; i++) {
    const item = lineItems[i];
    if (!item.description?.trim()) {
      return NextResponse.json({ error: `lineItems[${i}].description is required.` }, { status: 400 });
    }
    if (!item.amount || item.amount <= 0) {
      return NextResponse.json({ error: `lineItems[${i}].amount must be > 0.` }, { status: 400 });
    }
  }

  // ── Build props ─────────────────────────────────────────────────────────
  const invoiceNumber = payload.invoiceNumber?.trim() || generateInvoiceNumber();
  const issuedDate = fmtDate(new Date());
  const dueDate = payload.dueDate
    ? fmtDate(new Date(payload.dueDate))
    : fmtDate(new Date(Date.now() + 14 * 24 * 60 * 60 * 1000));
  const total = lineItems.reduce((sum, item) => sum + item.amount, 0);

  // Logo — absolute path so @react-pdf can read it from disk
  const logoPath = path.join(process.cwd(), "public", "images", "klikktek-logo-horizontal.svg");

  // ── Generate PDF ────────────────────────────────────────────────────────
  let pdfBuffer: Buffer;
  try {
    pdfBuffer = await renderToBuffer(
      InvoiceDocument({
        invoiceNumber,
        issuedDate,
        dueDate,
        customerName,
        customerEmail,
        lineItems,
        total,
        currency,
        notes: payload.notes,
        logoPath,
      }),
    );
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error("PDF render error:", msg);
    return NextResponse.json({ error: "Failed to generate PDF." }, { status: 500 });
  }

  return new NextResponse(new Uint8Array(pdfBuffer), {
    status: 200,
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="Invoice-${invoiceNumber}.pdf"`,
      "Content-Length": String(pdfBuffer.length),
    },
  });
}
