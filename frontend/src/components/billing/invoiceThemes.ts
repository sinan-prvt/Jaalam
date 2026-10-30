/**
 * Invoice designs. Each one is a set of class names for the parts of InvoiceDocument, so all
 * designs share the same content, GST rules and print behaviour. Ids are stored on the invoice
 * (billing.models.INVOICE_THEMES); keep both lists in step.
 */
export interface InvoiceTheme {
  id: string;
  name: string;
  // Swatch for the picker
  swatch: string;
  root: string;
  // 'band' puts the seller and invoice title on a full-width coloured header;
  // 'centered' is a narrow, centred till-receipt layout
  layout: 'standard' | 'band' | 'centered';
  header: string;
  sellerName: string;
  muted: string;
  logoFallback: string;
  title: string;
  number: string;
  label: string;
  tableHead: string;
  row: string;
  total: string;
  footer: string;
}

export const INVOICE_THEMES: InvoiceTheme[] = [
  {
    id: 'classic', name: 'Classic', swatch: 'bg-slate-900',
    root: 'bg-white text-slate-800', layout: 'standard',
    header: 'border-b-2 border-slate-900', sellerName: 'text-slate-900', muted: 'text-slate-600',
    logoFallback: 'rounded-xl bg-slate-900 text-white', title: 'font-black tracking-widest uppercase text-slate-900', number: 'font-mono font-bold',
    label: 'font-black uppercase tracking-widest text-slate-400', tableHead: 'bg-slate-100 text-slate-500', row: 'border-b border-slate-100',
    total: 'border-t-2 border-slate-900 text-slate-900', footer: 'border-t border-dashed border-slate-200 text-slate-400',
  },
  {
    id: 'modern', name: 'Modern', swatch: 'bg-indigo-600',
    root: 'bg-white text-slate-800', layout: 'band',
    header: 'bg-indigo-600 text-white', sellerName: 'text-white', muted: 'text-indigo-100',
    logoFallback: 'rounded-full bg-white text-indigo-600', title: 'font-black tracking-wide uppercase text-white', number: 'font-mono font-bold text-indigo-100',
    label: 'font-bold uppercase tracking-widest text-indigo-500', tableHead: 'bg-indigo-50 text-indigo-700', row: 'border-b border-indigo-50',
    total: 'bg-indigo-600 text-white rounded-lg px-3 py-2', footer: 'text-indigo-400',
  },
  {
    id: 'minimal', name: 'Minimal', swatch: 'bg-slate-200',
    root: 'bg-white text-slate-700', layout: 'standard',
    header: 'border-b border-slate-200', sellerName: 'text-slate-900 font-semibold', muted: 'text-slate-500',
    logoFallback: 'rounded-md border border-slate-300 text-slate-700', title: 'font-light tracking-[0.3em] uppercase text-slate-400', number: 'font-mono text-slate-600',
    label: 'font-medium uppercase tracking-[0.2em] text-slate-400', tableHead: 'border-b border-slate-300 text-slate-400', row: 'border-b border-slate-100',
    total: 'border-t border-slate-300 text-slate-900', footer: 'text-slate-300',
  },
  {
    id: 'bold', name: 'Bold', swatch: 'bg-amber-400',
    root: 'bg-white text-slate-800', layout: 'band',
    header: 'bg-slate-950 text-white', sellerName: 'text-white', muted: 'text-slate-300',
    logoFallback: 'rounded-xl bg-amber-400 text-slate-950', title: 'font-black tracking-widest uppercase text-amber-400', number: 'font-mono font-bold text-white',
    label: 'font-black uppercase tracking-widest text-slate-900', tableHead: 'bg-slate-950 text-amber-400', row: 'border-b-2 border-slate-100',
    total: 'bg-amber-400 text-slate-950 rounded-lg px-3 py-2', footer: 'text-slate-500 font-bold',
  },
  {
    id: 'elegant', name: 'Elegant', swatch: 'bg-amber-700',
    root: 'bg-[#fdfaf3] text-stone-700 font-serif', layout: 'standard',
    header: 'border-b-4 border-double border-amber-700', sellerName: 'text-stone-900 italic', muted: 'text-stone-500',
    logoFallback: 'rounded-full border-2 border-amber-700 text-amber-800', title: 'tracking-[0.25em] uppercase text-amber-800', number: 'text-stone-600',
    label: 'uppercase tracking-[0.2em] text-amber-700', tableHead: 'border-y border-amber-700/40 text-amber-800', row: 'border-b border-amber-700/15',
    total: 'border-t-4 border-double border-amber-700 text-stone-900', footer: 'border-t border-amber-700/30 text-amber-700 italic',
  },
  {
    id: 'fresh', name: 'Fresh', swatch: 'bg-emerald-500',
    root: 'bg-white text-slate-700 border-l-8 border-emerald-500', layout: 'standard',
    header: 'border-b-2 border-emerald-500', sellerName: 'text-emerald-900', muted: 'text-slate-500',
    logoFallback: 'rounded-2xl bg-emerald-500 text-white', title: 'font-extrabold uppercase text-emerald-600', number: 'font-mono font-bold text-slate-700',
    label: 'font-bold uppercase tracking-wider text-emerald-600', tableHead: 'bg-emerald-500 text-white', row: 'border-b border-emerald-50',
    total: 'bg-emerald-50 text-emerald-900 rounded-lg px-3 py-2', footer: 'text-emerald-500 font-semibold',
  },
  {
    id: 'receipt', name: 'Receipt', swatch: 'bg-stone-300',
    root: 'bg-white text-slate-900 font-mono max-w-sm mx-auto', layout: 'centered',
    header: 'border-b border-dashed border-slate-400', sellerName: 'text-slate-900 uppercase', muted: 'text-slate-600',
    logoFallback: 'rounded-none border-2 border-slate-900 text-slate-900', title: 'font-bold uppercase tracking-widest text-slate-900', number: 'font-bold',
    label: 'font-bold uppercase text-slate-500', tableHead: 'border-y border-dashed border-slate-400 text-slate-600', row: 'border-b border-dotted border-slate-300',
    total: 'border-y-2 border-double border-slate-900 text-slate-900', footer: 'border-t border-dashed border-slate-400 text-slate-500',
  },
];

export const invoiceTheme = (id?: string | null): InvoiceTheme =>
  INVOICE_THEMES.find((t) => t.id === id) || INVOICE_THEMES[0];
