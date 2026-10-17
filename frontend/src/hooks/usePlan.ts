import { useSelector } from 'react-redux';
import type { RootState } from '../store';
import { FALLBACK_PREMIUM_THEMES, FEATURE_PLAN, type PlanFeature, type PlanSummary } from '../utils/plan';

/** The signed-in user's plan, with helpers for showing locks and upgrade prompts. */
export default function usePlan() {
  const user = useSelector((state: RootState) => state.auth.user);
  const plan: PlanSummary | undefined = user?.plan;
  const unrestricted = !!(plan?.unrestricted || user?.is_superuser || user?.is_test_user);

  const can = (feature: PlanFeature) => unrestricted || !!plan?.features.includes(feature);
  const premiumThemes = plan?.premium_themes || FALLBACK_PREMIUM_THEMES;
  // Clients edit sites under the owner's plan, which the backend checks; don't guess here.
  const isLockedTheme = (theme: string) => user?.role !== 'CLIENT' && premiumThemes.includes(theme) && !can('premium_templates');
  const websiteLimit = unrestricted ? null : plan ? plan.limits.websites : 1;
  const aiLimit = unrestricted ? null : plan?.limits.ai_generations ?? 0;

  return {
    plan,
    unrestricted,
    can,
    isLockedTheme,
    requiredPlan: (feature: PlanFeature) => FEATURE_PLAN[feature],
    websiteLimit,
    aiLimit,
    aiUsed: plan?.usage.ai_generations ?? 0,
    // Show a renewal banner when a paid plan is close to (or past) its end.
    needsRenewal: !!plan && !unrestricted && (plan.expired || plan.in_grace || (plan.is_paid && plan.days_left !== null && plan.days_left <= 7)),
  };
}
