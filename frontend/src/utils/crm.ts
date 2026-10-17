export interface Lead {
  id: number;
  website: number;
  name: string;
  email: string | null;
  phone: string | null;
  whatsapp: string | null;
  status: string;
  source: string;
  message: string;
  notes: string | null;
  value: string | null;
  follow_up_at: string | null;
  follow_up_note: string;
  last_contact_date: string;
  created_at: string;
}

export const LEAD_STATUSES = [
  { value: 'NEW', label: 'New', style: 'bg-amber-50 text-amber-700 border-amber-200' },
  { value: 'CONTACTED', label: 'Contacted', style: 'bg-sky-50 text-sky-700 border-sky-200' },
  { value: 'IN_PROGRESS', label: 'In progress', style: 'bg-indigo-50 text-indigo-700 border-indigo-200' },
  { value: 'COMPLETED', label: 'Won', style: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
  { value: 'LOST', label: 'Lost', style: 'bg-slate-100 text-slate-500 border-slate-200' },
];

export const LEAD_SOURCES = [
  { value: 'WEBSITE', label: 'Website form' },
  { value: 'WHATSAPP', label: 'WhatsApp' },
  { value: 'CALL', label: 'Phone call' },
  { value: 'WALK_IN', label: 'Walk-in' },
  { value: 'REFERRAL', label: 'Referral' },
  { value: 'SOCIAL', label: 'Social media' },
  { value: 'OTHER', label: 'Other' },
];

export const isOpen = (lead: Lead) => lead.status !== 'COMPLETED' && lead.status !== 'LOST';

/** 'overdue' (before today), 'today', 'upcoming', or null when there's nothing to do. */
export function followUpState(lead: Lead): 'overdue' | 'today' | 'upcoming' | null {
  if (!lead.follow_up_at || !isOpen(lead)) return null;
  const due = new Date(lead.follow_up_at);
  const start = new Date();
  start.setHours(0, 0, 0, 0);
  const end = new Date(start);
  end.setDate(end.getDate() + 1);
  if (due < start) return 'overdue';
  if (due < end) return 'today';
  return 'upcoming';
}

/** Digits for wa.me; Indian 10-digit numbers get the 91 country code. */
export function waNumber(phone: string | null | undefined): string {
  let digits = (phone || '').replace(/\D/g, '');
  if (digits.length === 11 && digits.startsWith('0')) digits = digits.slice(1);
  if (digits.length === 10) digits = `91${digits}`;
  return digits.length >= 11 ? digits : '';
}
