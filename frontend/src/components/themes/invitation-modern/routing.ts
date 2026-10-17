import { getModernInvitationStyle, type InvitationStyle } from './palettes';
import type { InviteFamily } from './adapters';
import {
  weddingCategories, birthdayCategories, housewarmingCategories, collegeFestCategories, religiousEventCategories,
} from '../../../utils/templateData';

// Which invitation family a business_type belongs to (null for business sites).
export const inviteFamilyFor = (category?: string): InviteFamily | null => {
  if (!category) return null;
  if (weddingCategories.includes(category)) return 'wedding';
  if (birthdayCategories.includes(category)) return 'birthday';
  if (housewarmingCategories.includes(category)) return 'housewarming';
  if (collegeFestCategories.includes(category)) return 'collegeFest';
  if (religiousEventCategories.includes(category)) return 'religious';
  return null;
};

// The modern-engine style a theme renders with, if any (Bengali "Elegant Traditional" uses Heritage).
export const invitationStyleFor = (theme = '', category = ''): InvitationStyle | null => {
  if (category === 'Bengali Wedding' && theme.toLowerCase().includes('elegant traditional')) return 'Heritage';
  return getModernInvitationStyle(theme);
};
