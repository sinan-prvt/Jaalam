import { useEffect, useRef, useState } from 'react';
import { InvitationHeroPreview } from './ModernInvitationTheme';
import { inviteFamilyFor, invitationStyleFor } from './routing';
import { getThemeThumbnail } from '../../../utils/templateData';

interface ThemeThumbnailProps {
  theme: string;
  category: string;
  className?: string;
}

// Theme card image. Modern invitation themes get a live, scaled-down render of their hero
// (mounted only once the card scrolls into view); every other theme uses its photo thumbnail.
export default function ThemeThumbnail({ theme, category, className }: ThemeThumbnailProps) {
  const family = inviteFamilyFor(category);
  const style = family ? invitationStyleFor(theme, category) : null;
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
