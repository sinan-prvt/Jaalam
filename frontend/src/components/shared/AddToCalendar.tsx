import { useEffect, useRef, useState } from 'react';
import { CalendarPlus, X } from 'lucide-react';
import { getInvitationEvent, googleCalendarUrl, icsDataUrl, type CalendarEvent } from '../../utils/calendar';

interface AddToCalendarButtonProps {
  event: CalendarEvent;
  className?: string;
  menuClassName?: string;
  label?: string;
  menuPlacement?: 'top' | 'bottom';
  menuAlign?: 'center' | 'start';
}

/** "Add to Calendar" button with a Google / Apple-Outlook (.ics) menu. */
export function AddToCalendarButton({ event, className = '', menuClassName = '', label = 'Add to Calendar', menuPlacement = 'bottom', menuAlign = 'center' }: AddToCalendarButtonProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const close = (e: MouseEvent) => {
      if (!ref.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', close);
    return () => document.removeEventListener('mousedown', close);
  }, [open]);

  const fileName = `${event.title.replace(/[^a-z0-9]+/gi, '-').replace(/^-|-$/g, '').toLowerCase() || 'invitation'}.ics`;
  const item = 'block w-full px-4 py-3 text-left text-sm font-semibold text-slate-800 hover:bg-slate-100 transition-colors';

  return (
    <div ref={ref} className="relative inline-block">
      <button type="button" onClick={() => setOpen((o) => !o)} aria-expanded={open} aria-haspopup="menu" className={`inline-flex items-center gap-2 whitespace-nowrap ${className}`}>
        <CalendarPlus size={16} /> {label}
      </button>
      {open && (
        <div
          role="menu"
          className={`absolute ${menuAlign === 'start' ? 'left-0' : 'left-1/2 -translate-x-1/2'} z-50 min-w-[220px] overflow-hidden rounded-2xl bg-white shadow-2xl ring-1 ring-black/5 ${menuPlacement === 'top' ? 'bottom-full mb-2' : 'top-full mt-2'} ${menuClassName}`}
        >
          <a role="menuitem" href={googleCalendarUrl(event)} target="_blank" rel="noopener noreferrer" className={item} onClick={() => setOpen(false)}>
            Google Calendar
          </a>
          <a role="menuitem" href={icsDataUrl(event)} download={fileName} className={`${item} border-t border-slate-100`} onClick={() => setOpen(false)}>
            Apple / Outlook (.ics)
          </a>
        </div>
      )}
    </div>
  );
}

/**
 * Floating "Add to Calendar" pill for invitation layouts that don't have one built in.
 * It appears once the guest has scrolled past the opening screen, and can be dismissed.
 */
export default function FloatingAddToCalendar({ content, website }: { content: any; website: any }) {
  const event = getInvitationEvent(content, website);
  const [visible, setVisible] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > window.innerHeight * 0.6);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  if (!event || dismissed) return null;
  return (
    <div
      className={`fixed bottom-5 left-1/2 -translate-x-1/2 z-[80] flex items-center gap-1 rounded-full bg-white/95 p-1 pl-1 shadow-[0_10px_40px_-10px_rgba(0,0,0,0.35)] ring-1 ring-black/5 backdrop-blur transition-all duration-500 ${visible ? 'translate-y-0 opacity-100' : 'pointer-events-none translate-y-6 opacity-0'}`}
    >
      <AddToCalendarButton event={event} menuPlacement="top" className="rounded-full bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white hover:bg-slate-700 transition-colors" />
      <button type="button" aria-label="Hide" onClick={() => setDismissed(true)} className="flex h-9 w-9 items-center justify-center rounded-full text-slate-500 hover:bg-slate-100">
        <X size={16} />
      </button>
    </div>
  );
}
