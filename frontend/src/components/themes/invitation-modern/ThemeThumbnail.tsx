import { useEffect, useRef, useState } from 'react';
import { InvitationHeroPreview } from './ModernInvitationTheme';
import { getModernInvitationStyle, type InvitationStyle } from './palettes';
import type { InviteFamily } from './adapters';
import {
  getThemeThumbnail, weddingCategories, birthdayCategories, housewarmingCategories, collegeFestCategories, religiousEventCategories,
} from '../../../utils/templateData';

const familyFor = (category: string): InviteFamily | null => {
  if (weddingCategories.includes(category)) return 'wedding';
  if (birthdayCategories.includes(category)) return 'birthday';
  if (housewarmingCategories.includes(category)) return 'housewarming';
  if (collegeFestCategories.includes(category)) return 'collegeFest';
  if (religiousEventCategories.includes(category)) return 'religious';
  return null;
};

const previewStyleFor = (theme: string, category: string): InvitationStyle | null => {
  if (category === 'Bengali Wedding' && theme.toLowerCase().includes('elegant traditional')) return 'Heritage';
  return getModernInvitationStyle(theme);
};

interface ThemeThumbnailProps {
  theme: string;
  category: string;
  className?: string;
}

// Theme card image. Modern invitation themes get a live, scaled-down render of their hero
// (mounted only once the card scrolls into view); every other theme uses its photo thumbnail.
export default function ThemeThumbnail({ theme, category, className }: ThemeThumbnailProps) {
  const family = familyFor(category);
  const style = family ? previewStyleFor(theme, category) : null;
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!style || !ref.current) return;
    const io = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setVisible(true);
        io.disconnect();
      }
    }, { rootMargin: '200px' });
    io.observe(ref.current);
    return () => io.disconnect();
  }, [style]);

  if (!family || !style) {
    return <img loading="lazy" src={getThemeThumbnail(theme, category)} alt={theme} className={className} />;
  }

  return (
    <div ref={ref} className={`relative ${className || ''}`}>
      {visible && <InvitationHeroPreview family={family} style={style} category={category} />}
    </div>
  );
}
