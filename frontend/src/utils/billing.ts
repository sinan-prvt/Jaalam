// Invoices: the shop's business details, saved products and the monthly report.
// Matches backend/billing. Everything is per shop: pass the website id as ?website=<id>.
import { gstinError } from './gst';

export interface BusinessProfile {
  legal_name: string;
  gstin: string;
  address: string;
  state_code: string;
  phone: string;
  email: string;
  upi_id: string;
  logo_url: string;
  invoice_prefix: string;
  terms: string;
  invoice_theme?: string;  // design for new invoices (the last one used)
}

export const EMPTY_PROFILE: BusinessProfile = {
  legal_name: '', gstin: '', address: '', state_code: '', phone: '', email: '',
  upi_id: '', logo_url: '', invoice_prefix: 'INV', terms: '',
};

export interface Product {
  id: number;
  name: string;
  price: string;
  gst_rate: string | null;
  hsn_sac: string;
  is_active: boolean;
}

/** How an invoice names its customer: a walk-in sale has no name. */
export const customerLabel = (name?: string | null) => name?.trim() || 'Walk-in customer';

export interface MonthlyReport {
  month: string;
  label: string;
  business: (BusinessProfile & { state_name?: string }) | null;
  invoices: {
    id: number; invoice_number: string; issue_date: string; customer_name: string; status: string;
    subtotal: string; gst_amount: string; total_amount: string; amount_paid: string; balance_due: string;
  }[];
  totals: {
    count: number; cancelled: number; taxable: string; gst: string; cgst: string; sgst: string; igst: string;
    total: string; received: string; due: string;
  };
  by_day: { date: string; count: number; total: string }[];
  top_items: { description: string; quantity: number; amount: string }[];
}

/** What's wrong with these business details before saving, or null. */
export function businessProblem(p: BusinessProfile): string | null {
  if (!p.legal_name.trim()) return 'Add your business name';
  const gst = gstinError(p.gstin);
  if (p.gstin && gst) return `GSTIN: ${gst}`;
  if (p.gstin && !p.state_code) return 'Choose your state';
  return null;
}

export const profileUrl =(websiteId: number) => `/api/billing/invoices/profile/?website=${websiteId}`;
export const productsUrl = (websiteId: number) => `/api/billing/products/?website=${websiteId}`;

/** "2026-10" for a date. */
export const monthKey = (d = new Date()) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;

/** The printable monthly report page (Save as PDF). */
export const reportLink = (month: string, websiteId: number) => `/dashboard/invoice-report?month=${month}&website=${websiteId}`;
