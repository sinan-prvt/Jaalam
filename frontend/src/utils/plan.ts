// Mirrors backend/users/plans.py: the backend is the source of truth and enforces every
// rule; these helpers only decide what to show (locks, usage, upgrade prompts).

export type PlanFeature =
  | 'crm' | 'invoices' | 'analytics' | 'custom_domain' | 'remove_branding'
  | 'ai_marketing' | 'client_accounts' | 'premium_templates' | 'priority_support';

export interface PlanSummary {
  code: string;
  name: string;
  paid_plan: string;
  is_paid: boolean;
  period: 'MONTHLY' | 'YEARLY' | 'LIFETIME' | null;
  expires_at: string | null;
  days_left: number | null;
  expired: boolean;
  in_grace: boolean;
  unrestricted: boolean;
  features: PlanFeature[];
  limits: { websites: number | null; ai_generations: number | null };
  usage: { websites: number; ai_generations: number };
  premium_themes: string[];
}

export interface CatalogPlan {
  code: string;
  name: string;
  monthly_price: number;
  yearly_price: number;
  limits: { websites: number | null; ai_generations: number | null };
  features: PlanFeature[];
  highlights: string[];
  badge?: string | null;
}

export const FEATURE_PLAN: Record<PlanFeature, string> = {
  crm: 'Free',
  invoices: 'Starter',
  analytics: 'Starter',
  custom_domain: 'Starter',
  remove_branding: 'Business',
  ai_marketing: 'Business',
  client_accounts: 'Business',
  premium_templates: 'Premium',
  priority_support: 'Business',
};

// Used until /api/users/me/ returns the plan (e.g. a user object cached before this update).
export const FALLBACK_PREMIUM_THEMES = ['Glassmorphism', 'Aurora Gradient', 'Bento Grid', 'Editorial', 'Midnight Luxe'];

export const formatLimit = (n: number | null | undefined) => (n === null || n === undefined ? 'Unlimited' : String(n));
