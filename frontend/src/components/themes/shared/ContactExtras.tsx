import { Clock } from 'lucide-react';
import { Facebook, Instagram } from '../scrap/SocialIcons';

interface ContactExtrasProps {
  content: any;
  /** Show the opening-hours line (only rendered when the owner filled it in). */
  showHours?: boolean;
  /** Show Instagram / Facebook links (only rendered when the owner filled them in). */
  showSocial?: boolean;
  align?: 'center' | 'left';
  className?: string;
  /** Optional accent colour for the clock icon and icon hover ring. Inherits text colour otherwise. */
  accent?: string;
}

/**
 * Hours + Instagram/Facebook strip for themes whose own layout has no slot for them.
 * Colours inherit from the surrounding section (currentColor), so it fits light and dark footers.
 * Respects the editor's per-field hide toggles (contact_hours, contact_instagram, contact_facebook).
 */
export default function ContactExtras({
  content,
  showHours = true,
  showSocial = true,
  align = 'center',
  className = '',
  accent,
}: ContactExtrasProps) {
  const info = content?.contact_info || {};
  const hidden: string[] = content?.settings_json?.hidden_elements || [];

  const hours = showHours && !hidden.includes('contact_hours') ? String(info.hours || '').trim() : '';
  const instagram = showSocial && !hidden.includes('contact_instagram') ? String(info.instagram || '').trim() : '';
  const facebook = showSocial && !hidden.includes('contact_facebook') ? String(info.facebook || '').trim() : '';

  if (!hours && !instagram && !facebook) return null;

  const justify = align === 'center' ? 'justify-center text-center' : 'justify-start text-left';
  const iconClass =
    'w-10 h-10 rounded-full border flex items-center justify-center opacity-80 hover:opacity-100 hover:scale-105 transition-all';

  return (
    <div className={`mt-8 flex flex-col gap-5 ${align === 'center' ? 'items-center' : 'items-start'} ${className}`}>
      {hours && (
        <div className={`flex items-start gap-2.5 text-sm max-w-md ${justify}`}>
          <Clock size={16} className="shrink-0 mt-0.5" style={accent ? { color: accent } : undefined} />
          <span className="whitespace-pre-line leading-relaxed">{hours}</span>
        </div>
      )}
      {(instagram || facebook) && (
        <div className={`flex gap-3 ${justify}`}>
          {instagram && (
            <a
              href={instagram}
              target="_blank"
              rel="noreferrer"
              aria-label="Instagram"
              className={iconClass}
              style={{ borderColor: accent || 'currentColor' }}
            >
              <Instagram size={18} />
            </a>
          )}
          {facebook && (
            <a
              href={facebook}
              target="_blank"
              rel="noreferrer"
              aria-label="Facebook"
              className={iconClass}
              style={{ borderColor: accent || 'currentColor' }}
            >
              <Facebook size={18} />
            </a>
          )}
        </div>
      )}
    </div>
  );
}
