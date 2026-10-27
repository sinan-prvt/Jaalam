// Loyalty stamp cards ("buy 9, get the 10th free"). Matches backend/loyalty.

export type LoyaltyIconName =
  | 'coffee' | 'food' | 'pizza' | 'cake' | 'icecream' | 'scissors' | 'sparkles' | 'dumbbell' | 'shopping' | 'shirt'
  | 'gem' | 'book' | 'pill' | 'car' | 'wrench' | 'paw' | 'flower' | 'gift' | 'heart' | 'star';

export interface LoyaltySettings {
  reward: string;
  stamps_required: number;
  icon: LoyaltyIconName;
  color: string;
  max_stamps_per_day: number;
  terms: string;
  is_active: boolean;
  stamp_mode: StampMode;
  latitude: number | null;
  longitude: number | null;
  radius_m: number;
}

/**
 * How a visit earns a stamp:
 * CODE    – the customer scans the printed QR and types today's 4-digit code, which the
 *           cashier says after payment (new every day)
 * SCREEN  – the customer scans a QR on a counter phone/tablet that changes every 30 seconds
 * PRINTED – the customer scans the printed QR; their phone's location must be at the shop
 * STAFF   – staff scan the customer's card and tap "Add stamp"
 */
export type StampMode = 'CODE' | 'SCREEN' | 'PRINTED' | 'STAFF';

export interface PublicProgram extends Omit<LoyaltySettings, 'latitude' | 'longitude' | 'radius_m'> {
  business: string;
  slug: string;
}

export interface CounterScreen extends PublicProgram {
  token: string;
  refresh_in: number;
}

export interface LoyaltyStats {
  members: number;
  rewards_given: number;
  ready_now: number;
  active_30_days: number;
  stamps_this_month: number;
  joined_this_month: number;
}

export interface SiteProgram {
  business: string;
  slug: string;
  business_type: string;
  client: string | null;
  allowed: boolean;
  is_owner: boolean;
  required_plan: string;
  exists: boolean;
  counter_key: string | null;
  today_code: string | null;
  program: LoyaltySettings;
  stats: LoyaltyStats | null;
}

export interface CardView {
  code: string;
  name: string;
  stamps: number;
  stamps_required: number;
  reward_ready: boolean;
  rewards_redeemed: number;
  joined: string;
  last_stamp_at: string | null;
  program: PublicProgram;
  active: boolean;
  can_manage: boolean;
  // Only for the shop's own staff
  phone?: string;
  customer_id?: number;
  stamps_today?: number;
  events?: { kind: 'STAMP' | 'REDEEM' | 'UNDO'; at: string; by: string | null }[];
}

/** One row of the agency's "all shops" page. */
export interface SiteOverview {
  slug: string;
  business: string;
  business_type: string;
  client: string | null;
  allowed: boolean;
  program: Pick<LoyaltySettings, 'reward' | 'stamps_required' | 'stamp_mode' | 'is_active' | 'icon' | 'color'> | null;
  stats: LoyaltyStats | null;
}

export const STAMP_MODE_LABEL: Record<StampMode, string> = {
  CODE: "Today's code",
  SCREEN: 'Counter screen',
  PRINTED: 'Printed QR + location',
  STAFF: 'Staff scan',
};

export interface LoyaltyMember {
  code: string;
  name: string;
  phone: string;
  customer_id: number;
  stamps: number;
  reward_ready: boolean;
  rewards_redeemed: number;
  last_stamp_at: string | null;
  joined: string;
}

export const LOYALTY_ICONS: { value: LoyaltyIconName; label: string }[] = [
  { value: 'coffee', label: 'Coffee' },
  { value: 'food', label: 'Food' },
  { value: 'pizza', label: 'Pizza' },
  { value: 'cake', label: 'Cake' },
  { value: 'icecream', label: 'Ice cream' },
  { value: 'scissors', label: 'Salon' },
  { value: 'sparkles', label: 'Beauty' },
  { value: 'dumbbell', label: 'Fitness' },
  { value: 'shopping', label: 'Shopping' },
  { value: 'shirt', label: 'Clothing' },
  { value: 'gem', label: 'Jewellery' },
  { value: 'book', label: 'Books' },
  { value: 'pill', label: 'Pharmacy' },
  { value: 'car', label: 'Car' },
  { value: 'wrench', label: 'Repairs' },
  { value: 'paw', label: 'Pets' },
  { value: 'flower', label: 'Flowers' },
  { value: 'gift', label: 'Gift' },
  { value: 'heart', label: 'Heart' },
  { value: 'star', label: 'Star' },
];

export const LOYALTY_COLORS = ['#ea580c', '#7c2d12', '#be123c', '#db2777', '#7c3aed', '#1d4ed8', '#0f766e', '#15803d', '#0f172a'];

export interface LoyaltyPreset {
  id: string;
  label: string;
  reward: string;
  stamps_required: number;
  icon: LoyaltyIconName;
  color: string;
  terms: string;
}

// Ready-made cards, so a salon or a grocery doesn't start from "Free coffee".
export const LOYALTY_PRESETS: LoyaltyPreset[] = [
  { id: 'cafe', label: 'Cafe', reward: 'a free coffee', stamps_required: 9, icon: 'coffee', color: '#7c2d12', terms: 'One stamp per drink. Reward is any regular coffee.' },
  { id: 'bakery', label: 'Bakery', reward: 'a free pastry', stamps_required: 8, icon: 'cake', color: '#db2777', terms: 'One stamp per purchase of ₹150 or more.' },
  { id: 'restaurant', label: 'Restaurant', reward: 'a free meal (up to ₹300)', stamps_required: 10, icon: 'food', color: '#be123c', terms: 'One stamp per bill of ₹300 or more. Dine-in and takeaway.' },
  { id: 'dessert', label: 'Free dessert', reward: 'a free dessert', stamps_required: 6, icon: 'icecream', color: '#db2777', terms: 'One stamp per visit.' },
  { id: 'pizza', label: 'Pizza / fast food', reward: 'a free medium pizza', stamps_required: 8, icon: 'pizza', color: '#ea580c', terms: 'One stamp per order of ₹250 or more.' },
  { id: 'salon', label: 'Salon / barber', reward: 'a free haircut', stamps_required: 6, icon: 'scissors', color: '#0f172a', terms: 'One stamp per paid service.' },
  { id: 'spa', label: 'Spa / beauty', reward: '50% off any facial', stamps_required: 5, icon: 'sparkles', color: '#7c3aed', terms: 'One stamp per service of ₹500 or more.' },
  { id: 'gym-session', label: 'Gym visits', reward: 'a free personal training session', stamps_required: 12, icon: 'dumbbell', color: '#1d4ed8', terms: 'One stamp per workout day.' },
  { id: 'gym-month', label: 'Gym renewals', reward: '1 month free membership', stamps_required: 11, icon: 'dumbbell', color: '#0f172a', terms: 'One stamp per monthly fee paid on time.' },
  { id: 'grocery', label: 'Grocery', reward: '₹100 off your bill', stamps_required: 10, icon: 'shopping', color: '#15803d', terms: 'One stamp per bill of ₹1,000 or more.' },
  { id: 'retail', label: 'Retail store', reward: '₹200 off your next bill', stamps_required: 8, icon: 'shopping', color: '#0f766e', terms: 'One stamp per bill of ₹500 or more.' },
  { id: 'clothing', label: 'Clothing', reward: '15% off your next purchase', stamps_required: 5, icon: 'shirt', color: '#7c3aed', terms: 'One stamp per bill of ₹1,000 or more.' },
  { id: 'fancy', label: 'Fancy / gifts', reward: 'a free surprise gift', stamps_required: 6, icon: 'gem', color: '#db2777', terms: 'One stamp per bill of ₹300 or more.' },
  { id: 'books', label: 'Books / stationery', reward: 'a free notebook and pen set', stamps_required: 8, icon: 'book', color: '#1d4ed8', terms: 'One stamp per bill of ₹200 or more.' },
  { id: 'meat', label: 'Chicken / meat', reward: '1 kg chicken free', stamps_required: 10, icon: 'food', color: '#b91c1c', terms: 'One stamp per purchase of 1 kg or more.' },
  { id: 'pharmacy', label: 'Pharmacy', reward: '₹100 off your next bill', stamps_required: 10, icon: 'pill', color: '#0f766e', terms: 'One stamp per bill of ₹500 or more.' },
  { id: 'carwash', label: 'Car wash', reward: 'a free car wash', stamps_required: 5, icon: 'car', color: '#1d4ed8', terms: 'One stamp per wash.' },
  { id: 'repair', label: 'Repairs / service', reward: 'a free service check-up', stamps_required: 5, icon: 'wrench', color: '#0f172a', terms: 'One stamp per paid repair or service.' },
  { id: 'pets', label: 'Pet shop / grooming', reward: 'a free grooming session', stamps_required: 6, icon: 'paw', color: '#ea580c', terms: 'One stamp per visit.' },
  { id: 'florist', label: 'Florist', reward: 'a free bouquet', stamps_required: 8, icon: 'flower', color: '#be123c', terms: 'One stamp per order of ₹300 or more.' },
  { id: 'general', label: 'Any business', reward: 'a free gift', stamps_required: 8, icon: 'gift', color: '#ea580c', terms: 'One stamp per visit.' },
];

// Which presets to suggest first for each website category.
const SUGGESTED: Record<string, string[]> = {
  'Restaurant': ['restaurant', 'dessert', 'pizza'],
  'Cafe / Bakery': ['cafe', 'bakery', 'dessert'],
  'Salon / Spa': ['salon', 'spa'],
  'Gym / Fitness': ['gym-session', 'gym-month'],
  'Retail Store': ['retail', 'clothing', 'fancy'],
  'Stationery / Books': ['books', 'retail'],
  'Fancy Store': ['fancy', 'retail'],
  'Chicken / Meat Stall': ['meat', 'grocery'],
  'Supermarket / Grocery': ['grocery', 'retail'],
  'Textiles / Garments': ['clothing', 'retail'],
};

/** Presets for a business: its suggestions first, then the rest. */
export function presetsFor(businessType: string): { suggested: LoyaltyPreset[]; others: LoyaltyPreset[] } {
  const ids = SUGGESTED[businessType] || ['general', 'retail', 'repair'];
  const suggested = ids.map((id) => LOYALTY_PRESETS.find((p) => p.id === id)!).filter(Boolean);
  return { suggested, others: LOYALTY_PRESETS.filter((p) => !ids.includes(p.id)) };
}

export const DEFAULT_LOYALTY: LoyaltySettings = {
  reward: 'a free gift',
  stamps_required: 8,
  icon: 'gift',
  color: '#ea580c',
  max_stamps_per_day: 1,
  terms: '',
  is_active: true,
  stamp_mode: 'CODE',
  latitude: null,
  longitude: null,
  radius_m: 150,
};

/** A new card for this business, starting from its best preset. */
export function defaultFor(businessType: string): LoyaltySettings {
  const p = presetsFor(businessType).suggested[0];
  return p ? { ...DEFAULT_LOYALTY, reward: p.reward, stamps_required: p.stamps_required, icon: p.icon, color: p.color, terms: p.terms } : { ...DEFAULT_LOYALTY };
}

export const joinLink = (slug: string) => `${window.location.origin}/${slug}/rewards`;
export const cardLink = (code: string) => `${window.location.origin}/card/${code}`;
/** The secret link that turns a shop phone/tablet into the counter screen. */
export const counterLink = (key: string) => `${window.location.origin}/counter/${key}`;
/** What the counter screen's QR opens: join (if new) and stamp with this 30-second code. */
export const screenStampLink = (slug: string, token: string) => `${window.location.origin}/${slug}/rewards?t=${token}`;
/** The printed QR in "code" and "printed" modes: join (if new) and stamp, checked by today's code or location. */
export const printedStampLink = (slug: string) => `${window.location.origin}/${slug}/rewards?stamp=1`;

/** The phone's position, for the printed-QR mode. */
export function currentPosition(): Promise<{ latitude: number; longitude: number }> {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) return reject(new Error('unsupported'));
    navigator.geolocation.getCurrentPosition(
      (pos) => resolve({ latitude: pos.coords.latitude, longitude: pos.coords.longitude }),
      reject,
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 60000 },
    );
  });
}

export function forgetSavedCard(slug: string) {
  try { localStorage.removeItem(savedCardKey(slug)); } catch { /* nothing saved */ }
}

// The customer's browser remembers their card, so the counter QR opens it straight away.
export const savedCardKey = (slug: string) => `jaalam-card-${slug}`;

export function readSavedCard(slug: string): string | null {
  try { return localStorage.getItem(savedCardKey(slug)); } catch { return null; }
}

export function saveCard(slug: string, code: string) {
  try { localStorage.setItem(savedCardKey(slug), code); } catch { /* private mode: they keep the link */ }
}

/** The card code from a scanned QR: our /card/<code> link, or a bare code. */
export function codeFromScan(text: string): string | null {
  const value = text.trim();
  const match = value.match(/\/card\/([A-Za-z0-9_-]{6,24})/);
  if (match) return match[1];
  return /^[A-Za-z0-9_-]{6,24}$/.test(value) ? value : null;
}

/** "Collect 9 stamps, get a Free coffee" style line. */
export const rewardLine = (p: Pick<LoyaltySettings, 'stamps_required' | 'reward'>) =>
  `Collect ${p.stamps_required} stamps, get ${p.reward}`;
