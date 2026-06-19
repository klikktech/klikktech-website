"use client";

import { useState, useCallback } from "react";
import { Plus, Trash2, Copy, FileDown, Loader2 } from "lucide-react";

type Currency = "USD" | "INR";
interface LineItem { description: string; amount: string; }

const SYMBOL: Record<Currency, string> = { USD: "$", INR: "₹" };

const inputCls = (err?: boolean) =>
  `w-full rounded-lg border ${err ? "border-red-500" : "border-gray-200"} bg-white px-3 py-2 text-sm text-gray-900 placeholder:text-gray-400 focus:border-indigo-900 focus:outline-none focus:ring-2 focus:ring-indigo-900/20`;

function Field({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-xs font-semibold uppercase tracking-wide text-gray-500">{label}</label>
      {children}
      {error && <p className="text-xs text-red-600">{error}</p>}
    </div>
  );
}

export default function InvoiceGeneratorPage() {
  const [customerName, setCustomerName]   = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [currency, setCurrency]           = useState<Currency>("USD");
  const [invoiceNumber, setInvoiceNumber] = useState("");
  const [dueDate, setDueDate]             = useState("");
  const [notes, setNotes]                 = useState("");
  const [lineItems, setLineItems]         = useState<LineItem[]>([{ description: "", amount: "" }]);
  const [errors, setErrors]               = useState<Record<string, string>>({});
  const [isGenerating, setIsGenerating]   = useState(false);
  const [serverError, setServerError]     = useState<string | null>(null);

  const setLine = (i: number, field: keyof LineItem) =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setLineItems((prev) => prev.map((item, idx) => idx === i ? { ...item, [field]: e.target.value } : item));
      setErrors((prev) => { const n = { ...prev }; delete n[`line_${i}_${field}`]; return n; });
    };

  const addLine       = useCallback(() => setLineItems((p) => [...p, { description: "", amount: "" }]), []);
  const removeLine    = useCallback((i: number) => setLineItems((p) => p.filter((_, idx) => idx !== i)), []);
  const duplicateLine = useCallback((i: number) => setLineItems((p) => {
    const copy = [...p];
    copy.splice(i + 1, 0, { ...p[i] });
    return copy;
  }), []);

  const total = lineItems.reduce((s, l) => s + (parseFloat(l.amount) || 0), 0);

  const formatTotal = (n: number) =>
    new Intl.NumberFormat(currency === "INR" ? "en-IN" : "en-US", {
      style: "currency", currency, minimumFractionDigits: 2,
    }).format(n);

  function validate() {
    const e: Record<string, string> = {};
    if (!customerName.trim())  e.customerName  = "Required";
    if (!customerEmail.trim()) e.customerEmail = "Required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(customerEmail)) e.customerEmail = "Invalid email";
    lineItems.forEach((l, i) => {
      if (!l.description.trim()) e[`line_${i}_description`] = "Required";
      const n = parseFloat(l.amount);
      if (!l.amount) e[`line_${i}_amount`] = "Required";
      else if (isNaN(n) || n <= 0) e[`line_${i}_amount`] = "Must be > 0";
    });
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  async function handleGenerate() {
    setServerError(null);
    if (!validate()) return;
    setIsGenerating(true);

    try {
      const res = await fetch("/api/generate-invoice", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.NEXT_PUBLIC_INVOICE_SECRET}`,
        },
        body: JSON.stringify({
          customerName,
          customerEmail,
          currency,
          lineItems: lineItems.map((l) => ({ description: l.description, amount: parseFloat(l.amount) })),
          ...(invoiceNumber && { invoiceNumber }),
          ...(dueDate && { dueDate }),
          ...(notes && { notes }),
        }),
      });

      if (!res.ok) {
        const d = await res.json();
        setServerError(d.error ?? "Failed to generate invoice.");
        return;
      }

      const blob = await res.blob();
      const url  = URL.createObjectURL(blob);
      const a    = document.createElement("a");
      a.href     = url;
      a.download = `Invoice-${invoiceNumber || "Klikktek"}-${customerName.replace(/\s+/g, "-")}.pdf`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
    } catch {
      setServerError("Network error — please try again.");
    } finally {
      setIsGenerating(false);
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-12">
      <div className="mx-auto w-full max-w-3xl space-y-6">

        {/* Header */}
        <div className="flex items-center gap-3">
          <div className="flex size-10 items-center justify-center rounded-lg bg-indigo-900 text-white">
            <FileDown className="size-5" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900">Invoice Generator</h1>
            <p className="text-sm text-gray-500">Klikktek · Internal Tool</p>
          </div>
        </div>

        {/* Customer */}
        <div className="rounded-xl border border-gray-200 bg-white p-6 space-y-4">
          <h2 className="font-semibold text-gray-900">Customer Details</h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Field label="Customer Name *" error={errors.customerName}>
              <input placeholder="Jane Doe" value={customerName}
                onChange={(e) => { setCustomerName(e.target.value); setErrors((p) => { const n={...p}; delete n.customerName; return n; }); }}
                className={inputCls(!!errors.customerName)} />
            </Field>
            <Field label="Customer Email *" error={errors.customerEmail}>
              <input type="email" placeholder="jane@company.com" value={customerEmail}
                onChange={(e) => { setCustomerEmail(e.target.value); setErrors((p) => { const n={...p}; delete n.customerEmail; return n; }); }}
                className={inputCls(!!errors.customerEmail)} />
            </Field>
            <Field label="Currency *">
              <select value={currency} onChange={(e) => setCurrency(e.target.value as Currency)}
                className={inputCls()}>
                <option value="USD">USD — US Dollar</option>
                <option value="INR">INR — Indian Rupee</option>
              </select>
            </Field>
            <Field label="Invoice Number (optional)">
              <input placeholder="Auto-generated if blank" value={invoiceNumber}
                onChange={(e) => setInvoiceNumber(e.target.value)} className={inputCls()} />
            </Field>
            <Field label="Due Date (optional)">
              <input type="date" value={dueDate}
                onChange={(e) => setDueDate(e.target.value)} className={inputCls()} />
            </Field>
          </div>
        </div>

        {/* Line items */}
        <div className="rounded-xl border border-gray-200 bg-white p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-semibold text-gray-900">Line Items</h2>
            <button onClick={addLine}
              className="inline-flex items-center gap-1.5 rounded-lg border border-gray-200 px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
              <Plus className="size-4" /> Add Item
            </button>
          </div>

          {/* Column labels */}
          <div className="hidden grid-cols-[1fr_180px_36px_36px] gap-3 sm:grid">
            <span className="text-xs font-semibold uppercase tracking-wide text-gray-400">Description</span>
            <span className="text-xs font-semibold uppercase tracking-wide text-gray-400">Amount ({SYMBOL[currency]})</span>
            <span />
            <span />
          </div>

          {lineItems.map((item, i) => (
            <div key={i} className="grid grid-cols-1 gap-3 sm:grid-cols-[1fr_180px_36px_36px] sm:items-start">
              <div className="flex flex-col gap-1">
                <span className="text-xs font-semibold uppercase tracking-wide text-gray-400 sm:hidden">Description</span>
                <input placeholder={`Item ${i + 1}`} value={item.description}
                  onChange={setLine(i, "description")}
                  className={inputCls(!!errors[`line_${i}_description`])} />
                {errors[`line_${i}_description`] && (
                  <p className="text-xs text-red-600">{errors[`line_${i}_description`]}</p>
                )}
              </div>

              <div className="flex flex-col gap-1">
                <span className="text-xs font-semibold uppercase tracking-wide text-gray-400 sm:hidden">
                  Amount ({SYMBOL[currency]})
                </span>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-gray-400">
                    {SYMBOL[currency]}
                  </span>
                  <input type="number" min="0" step="0.01" placeholder="0.00"
                    value={item.amount} onChange={setLine(i, "amount")}
                    className={`${inputCls(!!errors[`line_${i}_amount`])} pl-7`} />
                </div>
                {errors[`line_${i}_amount`] && (
                  <p className="text-xs text-red-600">{errors[`line_${i}_amount`]}</p>
                )}
              </div>

              <button onClick={() => removeLine(i)} disabled={lineItems.length === 1}
                aria-label={`Remove item ${i + 1}`}
                className="mt-0 inline-flex size-9 items-center justify-center rounded-lg border border-gray-200 text-gray-400 hover:border-red-200 hover:text-red-500 disabled:cursor-not-allowed disabled:opacity-30 transition-colors sm:mt-0">
                <Trash2 className="size-4" />
              </button>

              <button onClick={() => duplicateLine(i)}
                aria-label={`Duplicate item ${i + 1}`}
                className="mt-0 inline-flex size-9 items-center justify-center rounded-lg border border-gray-200 text-gray-400 hover:border-indigo-300 hover:text-indigo-700 transition-colors sm:mt-0">
                <Copy className="size-4" />
              </button>
            </div>
          ))}

          {/* Total */}
          <div className="flex justify-end border-t border-gray-100 pt-4">
            <div className="text-right">
              <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">Total</p>
              <p className="text-2xl font-bold text-gray-900">{formatTotal(total)}</p>
            </div>
          </div>
        </div>

        {/* Notes */}
        <div className="rounded-xl border border-gray-200 bg-white p-6 space-y-3">
          <h2 className="font-semibold text-gray-900">Notes <span className="font-normal text-gray-400">(optional)</span></h2>
          <textarea rows={3} placeholder="Payment terms, project references, thank-you note…"
            value={notes} onChange={(e) => setNotes(e.target.value)}
            className={`${inputCls()} resize-y`} />
        </div>

        {/* Error */}
        {serverError && (
          <div className="rounded-lg bg-red-50 border border-red-200 px-4 py-3">
            <p className="text-sm text-red-700">{serverError}</p>
          </div>
        )}

        {/* Generate */}
        <button onClick={handleGenerate} disabled={isGenerating}
          className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-900 px-6 py-3.5 text-sm font-semibold text-white transition-colors hover:bg-indigo-800 disabled:cursor-not-allowed disabled:opacity-50">
          {isGenerating ? (
            <><Loader2 className="size-4 animate-spin" /> Generating PDF…</>
          ) : (
            <><FileDown className="size-4" /> Generate &amp; Download Invoice</>
          )}
        </button>

      </div>
    </div>
  );
}