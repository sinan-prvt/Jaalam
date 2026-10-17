// Mirrors backend/billing/gst.py. The backend recalculates every invoice; these helpers only
// drive the live preview and form hints.

export const GST_STATES: Record<string, string> = {
  '01': 'Jammu and Kashmir', '02': 'Himachal Pradesh', '03': 'Punjab', '04': 'Chandigarh',
  '05': 'Uttarakhand', '06': 'Haryana', '07': 'Delhi', '08': 'Rajasthan', '09': 'Uttar Pradesh',
  '10': 'Bihar', '11': 'Sikkim', '12': 'Arunachal Pradesh', '13': 'Nagaland', '14': 'Manipur',
  '15': 'Mizoram', '16': 'Tripura', '17': 'Meghalaya', '18': 'Assam', '19': 'West Bengal',
  '20': 'Jharkhand', '21': 'Odisha', '22': 'Chhattisgarh', '23': 'Madhya Pradesh', '24': 'Gujarat',
  '26': 'Dadra and Nagar Haveli and Daman and Diu', '27': 'Maharashtra', '29': 'Karnataka',
  '30': 'Goa', '31': 'Lakshadweep', '32': 'Kerala', '33': 'Tamil Nadu', '34': 'Puducherry',
  '35': 'Andaman and Nicobar Islands', '36': 'Telangana', '37': 'Andhra Pradesh', '38': 'Ladakh',
  '97': 'Other Territory',
};

export const GST_RATES = [0, 5, 12, 18, 28];

const CHARS = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';

export function gstinError(value: string): string | null {
  const g = value.trim().toUpperCase();
  if (!g) return null;
  if (g.length !== 15 || [...g].some((c) => !CHARS.includes(c))) return 'A GSTIN has 15 letters and digits.';
  if (!GST_STATES[g.slice(0, 2)]) return 'Unknown state code at the start.';
  let total = 0;
  for (let i = 0; i < 14; i++) {
    const product = CHARS.indexOf(g[i]) * (i % 2 ? 2 : 1);
    total += Math.floor(product / 36) + (product % 36);
  }
  if (CHARS[(36 - (total % 36)) % 36] !== g[14]) return 'Check digit is wrong — please check for a typo.';
  return null;
}

const round2 = (n: number) => Math.round((n + Number.EPSILON) * 100) / 100;

export interface DraftItem {
  description: string;
  hsn_sac: string;
  quantity: number;
  price: number;
  gst_rate: number | null;
}

export function computeTotals(items: DraftItem[], invoiceRate: number, sellerState: string, placeOfSupply: string) {
  let subtotal = 0;
  let tax = 0;
  for (const item of items) {
    const line = round2((item.quantity || 0) * (item.price || 0));
    subtotal += line;
    tax += round2((line * (item.gst_rate ?? invoiceRate)) / 100);
  }
  tax = round2(tax);
  const intra = !!sellerState && sellerState === placeOfSupply;
  const inter = !!sellerState && !!placeOfSupply && !intra;
  const cgst = intra ? round2(tax / 2) : 0;
  return {
    subtotal: round2(subtotal),
    tax,
    taxType: intra ? 'INTRA' : inter ? 'INTER' : '',
    cgst,
    sgst: intra ? round2(tax - cgst) : 0,
    igst: inter ? tax : 0,
    total: round2(subtotal + tax),
  };
}

export const inr = (n: number | string) =>
  `₹${Number(n || 0).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

export const upiLink = (upiId: string, payee: string, amount: number | string, note: string) =>
  `upi://pay?pa=${encodeURIComponent(upiId)}&pn=${encodeURIComponent(payee)}&am=${Number(amount).toFixed(2)}&cu=INR&tn=${encodeURIComponent(note)}`;

const ONES = ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine', 'Ten', 'Eleven', 'Twelve',
  'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen'];
const TENS = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];

function belowThousand(n: number): string {
  const words: string[] = [];
  if (n >= 100) words.push(`${ONES[Math.floor(n / 100)]} Hundred`);
  n %= 100;
  if (n >= 20) words.push(TENS[Math.floor(n / 10)] + (n % 10 ? ` ${ONES[n % 10]}` : ''));
  else if (n) words.push(ONES[n]);
  return words.join(' ');
}

/** Amount in words with Indian grouping, as printed on tax invoices: "Rupees One Lakh Twenty Only". */
export function amountInWords(value: number | string): string {
  const amount = Math.round(Number(value || 0) * 100);
  let rupees = Math.floor(amount / 100);
  const paise = amount % 100;
  const parts: string[] = [];
  for (const [size, label] of [[10000000, 'Crore'], [100000, 'Lakh'], [1000, 'Thousand']] as const) {
    if (rupees >= size) {
      parts.push(`${amountInWords(Math.floor(rupees / size)).replace(/^Rupees | Only$/g, '')} ${label}`);
      rupees %= size;
    }
  }
  if (rupees) parts.push(belowThousand(rupees));
  const words = parts.join(' ') || 'Zero';
  return `Rupees ${words}${paise ? ` and ${belowThousand(paise)} Paise` : ''} Only`;
}

export const invoiceLink = (token: string) => `${window.location.origin}/invoice/${token}`;

/** wa.me link to the customer's number (Indian 10-digit numbers get +91), or a plain share link. */
export function whatsappInvoiceLink(inv: {
  customer_name: string; customer_phone?: string | null; invoice_number: string; seller_name: string;
  total_amount: string | number; balance_due?: string | number; public_token: string;
}) {
  const due = Number(inv.balance_due ?? inv.total_amount);
  const text = `Hi ${inv.customer_name}, here is invoice ${inv.invoice_number} from ${inv.seller_name} for ${inr(inv.total_amount)}.`
    + `${due > 0 ? ` Amount due: ${inr(due)}.` : ''}\nView, download or pay: ${invoiceLink(inv.public_token)}`;
  let phone = (inv.customer_phone || '').replace(/\D/g, '');
  if (phone.length === 10) phone = `91${phone}`;
  if (phone.length === 11 && phone.startsWith('0')) phone = `91${phone.slice(1)}`;
  return `https://wa.me/${phone.length >= 11 ? phone : ''}?text=${encodeURIComponent(text)}`;
}
