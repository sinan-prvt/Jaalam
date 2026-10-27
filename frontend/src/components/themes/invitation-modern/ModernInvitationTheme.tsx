import React, { createContext, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Heart, Gem, Gift, Cake, Home, Zap, Palette, Trophy, Moon, Church, Flame,
  Calendar, Clock, MapPin, Navigation, Phone, Mail, MessageCircle, Volume2, VolumeX, User, ArrowDown,
} from 'lucide-react';
import { triggerConfettiPopper } from '../../../utils/confettiPopper';
import { AddToCalendarButton } from '../../shared/AddToCalendar';
import { getInvitationEvent, type CalendarEvent } from '../../../utils/calendar';
import { applyEdit, buildInviteData, type EditableField, type InviteData, type InviteFamily } from './adapters';
import { getInvitePalette, type InviteIcon, type InvitationStyle } from './palettes';
import { ambientFor, findInviteTheme, greetingFor, motifFor, type Motif } from './inviteThemes';
import { AmbientParticles } from './ambient';
import { MotifBand, MotifGlyph, MotifMedallion } from './motifs';
import { motifTile } from './motifTiles';
import { InviteOpening } from './openings';

interface ModernInvitationThemeProps {
  family: InviteFamily;
  style: InvitationStyle;
  content?: any;
  website?: any;
  isEditor?: boolean;
  updateContent?: (content: any) => void;
}

interface Skin {
  dark: boolean;
  root: string;
  section: string;
  card: string;
  heading: string;
  eyebrow: string;
  muted: string;
  button: string;
  chip: string;
  accentText: string;
  align: 'center' | 'left';
}

const SKINS: Record<InvitationStyle, Skin> = {
  Glassmorphism: {
    dark: true,
    root: 'bg-[#07070c] text-white font-sans',
    section: 'relative py-20 md:py-28 px-5 md:px-8',
    card: 'rounded-3xl bg-white/[0.07] backdrop-blur-xl border border-white/15 shadow-[0_8px_40px_rgba(0,0,0,0.35)]',
    heading: "font-['Outfit'] text-4xl md:text-5xl font-semibold tracking-tight",
    eyebrow: 'text-[11px] font-semibold uppercase tracking-[0.35em] text-(--acc)',
    muted: 'text-white/65',
    button: 'rounded-full bg-white/15 backdrop-blur-md border border-white/25 hover:bg-white/25 text-white',
    chip: 'rounded-full bg-white/10 border border-white/15',
    accentText: 'text-(--acc)',
    align: 'center',
  },
  'Aurora Gradient': {
    dark: false,
    root: 'bg-[#fbfaff] text-slate-900 font-sans',
    section: 'relative py-20 md:py-28 px-5 md:px-8',
    card: 'rounded-[2rem] bg-white shadow-[0_20px_60px_-24px_rgba(15,23,42,0.25)] border border-slate-100',
    heading: "font-['Outfit'] text-4xl md:text-6xl font-extrabold tracking-tight",
    eyebrow: 'text-[11px] font-bold uppercase tracking-[0.3em] text-(--acc)',
    muted: 'text-slate-500',
    button: 'rounded-full text-white bg-linear-to-r from-(--acc) to-(--acc2) shadow-lg hover:brightness-110',
    chip: 'rounded-full bg-(--acc)/10 text-(--acc)',
    accentText: 'text-(--acc)',
    align: 'center',
  },
  'Bento Grid': {
    dark: false,
    root: 'bg-[#f2f2f4] text-zinc-900 font-sans',
    section: 'relative py-6 md:py-8 px-3 md:px-6',
    card: 'rounded-[1.75rem] bg-white',
    heading: "font-['Outfit'] text-3xl md:text-5xl font-bold tracking-tight",
    eyebrow: 'text-[11px] font-semibold uppercase tracking-[0.25em] text-zinc-400',
    muted: 'text-zinc-500',
    button: 'rounded-full bg-zinc-900 text-white hover:bg-(--acc)',
    chip: 'rounded-full bg-zinc-100',
    accentText: 'text-(--acc)',
    align: 'left',
  },
  Editorial: {
    dark: false,
    root: 'bg-[#f6f1e9] text-[#1b1813] font-sans',
    section: 'relative py-20 md:py-28 px-5 md:px-12',
    card: 'border-t border-[#1b1813]/80 pt-6',
    heading: "font-['Playfair_Display'] text-5xl md:text-7xl italic leading-[0.95]",
    eyebrow: 'text-[11px] font-semibold uppercase tracking-[0.4em] text-(--acc)',
    muted: 'text-[#1b1813]/60',
    button: 'border border-[#1b1813] hover:bg-[#1b1813] hover:text-[#f6f1e9] uppercase tracking-[0.3em] text-xs',
    chip: 'border border-[#1b1813]/30',
    accentText: 'text-(--acc)',
    align: 'left',
  },
  Heritage: {
    dark: false,
    root: 'bg-[#fbf3e4] text-[#3b0d0c] font-sans',
    section: 'relative py-20 md:py-28 px-5 md:px-8',
    card: 'rounded-2xl bg-white/70 border border-(--acc2)/50 shadow-[0_10px_30px_-15px_rgba(127,29,29,0.35)]',
    heading: "font-['Playfair_Display'] text-4xl md:text-6xl text-(--acc)",
    eyebrow: 'text-[11px] font-semibold uppercase tracking-[0.4em] text-(--acc3)',
    muted: 'text-[#3b0d0c]/65',
    button: 'rounded-full bg-(--acc) text-white hover:bg-(--acc3)',
    chip: 'rounded-full border border-(--acc2)/60 bg-white/60',
    accentText: 'text-(--acc)',
    align: 'center',
  },
  'Midnight Luxe': {
    dark: true,
    root: 'bg-[#0a0a0d] text-[#f3eee6] font-sans',
    section: 'relative py-20 md:py-28 px-5 md:px-8',
    card: 'border border-(--acc)/30 bg-white/[0.02]',
    heading: "font-['Playfair_Display'] text-4xl md:text-6xl font-light",
    eyebrow: 'text-[11px] uppercase tracking-[0.5em] text-(--acc)',
    muted: 'text-[#f3eee6]/55',
    button: 'border border-(--acc) text-(--acc) hover:bg-(--acc) hover:text-black uppercase tracking-[0.3em] text-xs',
    chip: 'border border-(--acc)/40',
    accentText: 'text-(--acc)',
    align: 'center',
  },
};

const ICONS: Record<InviteIcon, React.ComponentType<{ size?: number; className?: string; strokeWidth?: number }>> = {
  heart: Heart, ring: Gem, gift: Gift, cake: Cake, home: Home, zap: Zap, palette: Palette, trophy: Trophy, moon: Moon, church: Church, flame: Flame,
};

const isSerif = (style: InvitationStyle) => style === 'Editorial' || style === 'Midnight Luxe' || style === 'Heritage';

const digits = (s: string) => (s || '').replace(/[^\d]/g, '');

function useCountdown(target: number | null) {
  const [left, setLeft] = useState<{ d: number; h: number; m: number; s: number } | null>(null);
  useEffect(() => {
    if (!target) return;
    const tick = () => {
      const diff = target - Date.now();
      if (diff <= 0) {
        setLeft(null);
        return false;
      }
      setLeft({
        d: Math.floor(diff / 86400000),
        h: Math.floor((diff / 3600000) % 24),
        m: Math.floor((diff / 60000) % 60),
        s: Math.floor((diff / 1000) % 60),
      });
      return true;
    };
    if (!tick()) return;
    const id = setInterval(() => {
      if (!tick()) clearInterval(id);
    }, 1000);
    return () => clearInterval(id);
  }, [target]);
  return left;
}

function useWishes(slug: string | undefined, initial: number) {
  const [count, setCount] = useState(initial);
  useEffect(() => {
    if (!slug) return;
    let cancelled = false;
    const load = async () => {
      try {
        const res = await fetch(`/api/websites/${slug}/wish/`);
        if (!res.ok) return;
        const data = await res.json();
        if (!cancelled && typeof data.wish_count === 'number') setCount(data.wish_count);
      } catch {
        // offline / preview: keep the local count
      }
    };
    load();
    const id = setInterval(load, 8000);
    return () => {
      cancelled = true;
      clearInterval(id);
    };
  }, [slug]);

  const send = (e?: React.MouseEvent) => {
    setCount((c) => c + 1);
    triggerConfettiPopper(e);
    if (!slug) return;
    fetch(`/api/websites/${slug}/wish/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ increment: 1 }),
    }).catch(() => undefined);
  };
  return [count, send] as const;
}

/* ------------------------------------------------------------------ */
/* Shared building blocks                                              */
/* ------------------------------------------------------------------ */

interface InlineEditor {
  can: (field: EditableField) => boolean;
  save: (field: EditableField, value: string) => void;
}

const EditContext = createContext<InlineEditor | null>(null);

// Text that becomes click-to-edit inside the editor preview; plain text everywhere else.
function Editable({ as = 'span', field, value, className, multiline }: { as?: 'span' | 'p' | 'h1' | 'h2'; field: EditableField; value: string; className?: string; multiline?: boolean }) {
  const editor = useContext(EditContext);
  const Tag = as;
  if (!editor?.can(field)) return <Tag className={className}>{value}</Tag>;
  return (
    <Tag
      key={value}
      contentEditable
      suppressContentEditableWarning
      title="Click to edit"
      className={`${className || ''} ${multiline ? 'whitespace-pre-line' : ''} cursor-text rounded-md outline-2 outline-dashed outline-transparent outline-offset-4 hover:outline-(--acc)/60 focus:outline-(--acc)`}
      onKeyDown={(e: React.KeyboardEvent<HTMLElement>) => {
        if (e.key === 'Enter' && !multiline) {
          e.preventDefault();
          e.currentTarget.blur();
        }
      }}
      onBlur={(e: React.FocusEvent<HTMLElement>) => {
        const next = e.currentTarget.innerText.trim();
        if (next && next !== value) editor.save(field, next);
      }}
    >
      {value}
    </Tag>
  );
}

function SectionHeading({ skin, style, eyebrow, title, index, field, motif }: { skin: Skin; style: InvitationStyle; eyebrow: string; title: string; index: number; field?: EditableField; motif: Motif }) {
  const heading = (
    field ? <Editable as="h2" field={field} value={title} className={`${skin.heading} mt-3`} /> : <h2 className={`${skin.heading} mt-3`}>{title}</h2>
  );
  const centered = skin.align === 'center';
  if (style === 'Editorial') {
    return (
      <div className="mb-12 md:mb-16 grid grid-cols-[minmax(0,1fr)] md:grid-cols-12 gap-4 items-end">
        <span className="md:col-span-2 font-['Playfair_Display'] text-6xl md:text-8xl text-(--acc) leading-none flex items-start gap-2">{String(index).padStart(2, '0')}<MotifGlyph motif={motif} className="w-5 h-5 mt-2" /></span>
        <div className="md:col-span-10">
          <p className={skin.eyebrow}>{eyebrow}</p>
          {heading}
        </div>
      </div>
    );
  }
  return (
    <div className={`mb-10 md:mb-14 ${centered ? 'text-center' : ''}`}>
      <p className={`${skin.eyebrow} ${style === 'Bento Grid' ? 'flex items-center gap-2' : ''}`}>
        {style === 'Bento Grid' && <MotifGlyph motif={motif} className="w-4 h-4 text-(--acc)" />}
        {eyebrow}
      </p>
      {heading}
      {(style === 'Midnight Luxe' || style === 'Glassmorphism') && (
        <div className="mt-6 flex items-center justify-center gap-3 text-(--acc)">
          <span className="h-px w-16 bg-(--acc)/50" />
          <MotifGlyph motif={motif} className="w-4 h-4" />
          <span className="h-px w-16 bg-(--acc)/50" />
        </div>
      )}
      {style === 'Aurora Gradient' && (
        <div className="mt-5 flex items-center justify-center gap-3 text-(--acc)">
          <span className="h-1.5 w-12 rounded-full bg-linear-to-r from-(--acc) to-(--acc2)" />
          <MotifGlyph motif={motif} className="w-5 h-5" />
          <span className="h-1.5 w-12 rounded-full bg-linear-to-r from-(--acc2) to-(--acc)" />
        </div>
      )}
      {style === 'Heritage' && (
        <div className="mt-6 flex items-center justify-center gap-3 text-(--acc2)">
          <span className="h-px w-16 bg-(--acc2)" />
          {motif === 'alpana' ? <Alpona className="w-7 h-7 text-(--acc)" /> : <MotifGlyph motif={motif} className="w-6 h-6 text-(--acc)" />}
          <span className="h-px w-16 bg-(--acc2)" />
        </div>
      )}
    </div>
  );
}

// Alpona-style (Bengali floor art) motif used by the Heritage style.
function Alpona({ className }: { className?: string }) {
  const petals = Array.from({ length: 12 }, (_, i) => i * 30);
  return (
    <svg viewBox="0 0 200 200" fill="none" stroke="currentColor" strokeWidth="1.4" className={className} aria-hidden="true">
      <circle cx="100" cy="100" r="96" />
      <circle cx="100" cy="100" r="84" strokeDasharray="2 6" strokeLinecap="round" />
      {petals.map((deg) => (
        <path key={deg} transform={`rotate(${deg} 100 100)`} d="M100 22 C112 44 112 62 100 76 C88 62 88 44 100 22 Z" />
      ))}
      <circle cx="100" cy="100" r="22" />
      <circle cx="100" cy="100" r="8" fill="currentColor" />
    </svg>
  );
}

// Red-and-gold band in the style of a Bengali saree border.
const sareeBorder = 'h-4 w-full bg-[repeating-linear-gradient(90deg,var(--acc)_0_14px,var(--acc2)_14px_18px,var(--acc)_18px_32px,transparent_32px_36px)] border-y-2 border-(--acc2)';

function Countdown({ left, skin, style }: { left: NonNullable<ReturnType<typeof useCountdown>>; skin: Skin; style: InvitationStyle }) {
  const units: [string, number][] = [['Days', left.d], ['Hours', left.h], ['Minutes', left.m], ['Seconds', left.s]];
  return (
    <div className="grid grid-cols-4 gap-2 md:gap-4 max-w-2xl mx-auto">
      {units.map(([label, value]) => (
        <div
          key={label}
          className={`${skin.card} py-5 md:py-7 text-center ${style === 'Bento Grid' ? 'bg-zinc-900! text-white' : ''} ${style === 'Editorial' ? 'pt-4!' : ''}`}
        >
          <div className={`text-3xl md:text-5xl font-bold tabular-nums ${isSerif(style) ? "font-['Playfair_Display'] font-normal" : "font-['Outfit']"}`}>
            {String(value).padStart(2, '0')}
          </div>
          <div className={`mt-1 text-[10px] md:text-xs uppercase tracking-[0.25em] ${style === 'Bento Grid' ? 'text-white/60' : skin.muted}`}>{label}</div>
        </div>
      ))}
    </div>
  );
}

function Photo({ src, alt, className }: { src: string; alt: string; className?: string }) {
  const [failed, setFailed] = useState(false);
  if (!src || failed) {
    return (
      <div className={`flex items-center justify-center bg-linear-to-br from-(--acc)/40 to-(--acc2)/40 ${className || ''}`}>
        <User size={48} className="opacity-50" />
      </div>
    );
  }
  return <img src={src} alt={alt} loading="lazy" onError={() => setFailed(true)} className={`object-cover ${className || ''}`} />;
}

// Cover photo that degrades to the palette gradient if the image can't load.
function Cover({ src, alt, className }: { src: string; alt: string; className: string }) {
  const [failed, setFailed] = useState(false);
  useEffect(() => setFailed(false), [src]);
  if (failed) return <div role="img" aria-label={alt} className={`${className} bg-linear-to-br from-(--acc) via-(--acc2) to-(--acc3)`} />;
  return <img src={src} alt={alt} onError={() => setFailed(true)} className={className} />;
}

const hideOnError = (e: React.SyntheticEvent<HTMLImageElement>) => {
  (e.currentTarget.parentElement?.dataset.galleryItem ? e.currentTarget.parentElement : e.currentTarget).style.display = 'none';
};

/* ------------------------------------------------------------------ */
/* Heroes                                                              */
/* ------------------------------------------------------------------ */

interface HeroProps {
  d: InviteData;
  skin: Skin;
  eyebrow: string;
  image: string;
  Icon: React.ComponentType<{ size?: number; className?: string; strokeWidth?: number }>;
  left: ReturnType<typeof useCountdown>;
  calendarEvent?: CalendarEvent | null;
  /** Category motif and greeting (traditional heroes). */
  motif?: Motif;
  greeting?: string;
  colors?: { a: string; b: string };
}

function TitleLines({ d, className, joinerClass }: { d: InviteData; className: string; joinerClass: string }) {
  const editor = useContext(EditContext);
  // While editing, show the title as one editable line so "A & B" can be changed freely.
  if (editor?.can('title')) return <Editable as="h1" field="title" value={d.title} className={className} />;
  if (d.titleParts.length > 1) {
    return (
      <h1 className={className}>
        {d.titleParts.map((part, i) => (
          <React.Fragment key={i}>
            {i > 0 && <span className={`block ${joinerClass}`}>&amp;</span>}
            <span className="block">{part}</span>
          </React.Fragment>
        ))}
      </h1>
    );
  }
  return <h1 className={className}>{d.title}</h1>;
}

function GlassHero({ d, skin, eyebrow, image, Icon }: HeroProps) {
  return (
    <section id="hero" className="relative min-h-[100svh] flex items-center justify-center px-5 py-24 overflow-hidden">
      <Cover src={image} alt="" className="absolute inset-0 w-full h-full object-cover scale-110 blur-[2px]" />
      <div className="absolute inset-0 bg-linear-to-b from-black/50 via-black/30 to-[#07070c]" />
      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.9, ease: 'easeOut' }}
        className={`${skin.card} relative z-10 w-full max-w-xl px-6 py-12 md:px-12 md:py-16 text-center`}
      >
        <div className="mx-auto mb-6 w-14 h-14 rounded-2xl bg-white/15 border border-white/25 flex items-center justify-center">
          <Icon size={26} className="text-(--acc)" />
        </div>
        <p className={skin.eyebrow}>{eyebrow}</p>
        <TitleLines d={d} className="mt-5 font-['Outfit'] text-5xl md:text-7xl font-semibold tracking-tight leading-[1.05]" joinerClass="text-(--acc) font-['Great_Vibes'] font-normal text-4xl md:text-5xl my-1" />
        <Editable as="p" field="subtitle" value={d.subtitle} className="mt-5 text-sm md:text-base uppercase tracking-[0.3em] text-white/80" />
        {(d.dateText || d.timeText) && (
          <div className="mt-8 inline-flex flex-wrap items-center justify-center gap-2">
            {d.dateText && <span className={`${skin.chip} px-4 py-2 text-xs md:text-sm flex items-center gap-2`}><Calendar size={14} />{d.dateText}</span>}
            {d.timeText && <span className={`${skin.chip} px-4 py-2 text-xs md:text-sm flex items-center gap-2`}><Clock size={14} />{d.timeText}</span>}
          </div>
        )}
      </motion.div>
      <a href="#details" aria-label="Scroll down" className="absolute bottom-8 left-1/2 -translate-x-1/2 text-white/70 animate-bounce"><ArrowDown size={22} /></a>
    </section>
  );
}

function AuroraHero({ d, skin, eyebrow, image, Icon }: HeroProps) {
  return (
    <section id="hero" className="relative min-h-[100svh] flex items-center px-5 md:px-10 py-24 overflow-hidden">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-40 -left-40 w-[38rem] h-[38rem] rounded-full bg-(--acc) opacity-40 blur-[120px] animate-[pulse_7s_ease-in-out_infinite]" />
        <div className="absolute top-1/3 -right-40 w-[34rem] h-[34rem] rounded-full bg-(--acc2) opacity-40 blur-[120px] animate-[pulse_9s_ease-in-out_infinite]" />
        <div className="absolute -bottom-40 left-1/3 w-[30rem] h-[30rem] rounded-full bg-(--acc3) opacity-25 blur-[120px] animate-[pulse_11s_ease-in-out_infinite]" />
      </div>
      <div className="relative z-10 mx-auto w-full max-w-6xl grid grid-cols-[minmax(0,1fr)] lg:grid-cols-[1.2fr_1fr] gap-12 items-center">
        <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8 }}>
          <span className={`${skin.chip} inline-flex items-center gap-2 px-4 py-2 text-xs font-bold uppercase tracking-[0.25em]`}>
            <Icon size={14} /> {eyebrow}
          </span>
          <TitleLines
            d={d}
            className="mt-6 font-['Outfit'] text-6xl md:text-8xl font-black tracking-tighter leading-[0.9] bg-linear-to-br from-slate-900 via-(--acc3) to-(--acc) bg-clip-text text-transparent pb-2"
            joinerClass="text-4xl md:text-6xl font-['Great_Vibes'] font-normal text-(--acc) my-2"
          />
          <Editable as="p" field="subtitle" value={d.subtitle} className="mt-6 text-lg md:text-2xl font-semibold text-slate-700" />
          <Editable as="p" field="quote" value={d.quote} className={`mt-3 max-w-lg ${skin.muted}`} />
          <div className="mt-8 flex flex-wrap gap-3">
            {d.dateText && <span className="rounded-2xl bg-white/80 backdrop-blur px-5 py-3 shadow-sm border border-white text-sm font-semibold flex items-center gap-2"><Calendar size={16} className="text-(--acc)" />{d.dateText}</span>}
            {d.timeText && <span className="rounded-2xl bg-white/80 backdrop-blur px-5 py-3 shadow-sm border border-white text-sm font-semibold flex items-center gap-2"><Clock size={16} className="text-(--acc)" />{d.timeText}</span>}
          </div>
        </motion.div>
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.9, delay: 0.15 }} className="relative mx-auto w-full max-w-sm">
          <div className="absolute -inset-3 rounded-[999px] bg-linear-to-br from-(--acc) via-(--acc2) to-(--acc3) opacity-70 blur-md" />
          <Cover src={image} alt={d.title} className="relative w-full aspect-[3/4] object-cover rounded-[999px] border-8 border-white shadow-2xl" />
        </motion.div>
      </div>
    </section>
  );
}

function BentoHero({ d, skin, eyebrow, image, Icon, left, calendarEvent }: HeroProps) {
  return (
    <section id="hero" className="px-3 md:px-6 pt-3 md:pt-6 pb-3">
      <div className="mx-auto max-w-6xl grid grid-cols-2 md:grid-cols-4 auto-rows-[minmax(150px,auto)] gap-3 md:gap-4">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className={`${skin.card} col-span-2 md:row-span-2 p-7 md:p-10 flex flex-col justify-between min-h-[320px]`}>
          <div className="flex items-center justify-between">
            <span className={skin.eyebrow}>{eyebrow}</span>
            <span className="w-11 h-11 rounded-full bg-(--acc) text-white flex items-center justify-center"><Icon size={20} /></span>
          </div>
          <div>
            <TitleLines d={d} className="font-['Outfit'] text-5xl md:text-7xl font-bold tracking-tighter leading-[0.95]" joinerClass="text-(--acc) text-4xl md:text-5xl" />
            <Editable as="p" field="subtitle" value={d.subtitle} className={`mt-4 text-lg ${skin.muted}`} />
          </div>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.1 }} className="col-span-2 md:row-span-2 rounded-[1.75rem] overflow-hidden min-h-[320px] relative">
          <Cover src={image} alt={d.title} className="absolute inset-0 w-full h-full object-cover" />
          <Editable as="p" field="quote" value={d.quote} className="absolute inset-x-4 bottom-4 rounded-2xl bg-white/80 backdrop-blur-md px-5 py-4 text-sm font-medium text-zinc-700 line-clamp-3" />
        </motion.div>
        {d.dateText && (
          <div className="rounded-[1.75rem] bg-(--acc) text-white p-6 flex flex-col justify-between">
            <Calendar size={22} className="opacity-80" />
            <div>
              <div className="font-['Outfit'] text-5xl font-bold leading-none">{d.dateParts.day || '—'}</div>
              <div className="mt-1 text-sm font-semibold uppercase tracking-widest opacity-90">{d.dateParts.month} {d.dateParts.year}</div>
              {calendarEvent && (
                <AddToCalendarButton event={calendarEvent} label="Add" menuPlacement="top" menuAlign="start" className="mt-4 rounded-full bg-white/20 hover:bg-white/30 px-3 py-1.5 text-xs font-semibold transition" />
              )}
            </div>
          </div>
        )}
        {(d.timeText || d.dateParts.weekday) && (
          <div className={`${skin.card} p-6 flex flex-col justify-between`}>
            <Clock size={22} className="text-(--acc)" />
            <div>
              <div className="font-['Outfit'] text-2xl md:text-3xl font-bold break-words">{d.timeText || d.dateParts.weekday}</div>
              {d.timeText && d.dateParts.weekday && <div className={`text-sm ${skin.muted}`}>{d.dateParts.weekday}</div>}
            </div>
          </div>
        )}
        {(d.venueName || d.address) && !d.hiddenFields.includes('contact_address') && (
          <a href="#venue" className={`${skin.card} p-6 flex flex-col justify-between hover:ring-2 hover:ring-(--acc) transition ${!left ? 'md:col-span-2' : ''}`}>
            <MapPin size={22} className="text-(--acc)" />
            <div>
              <div className="font-semibold leading-snug line-clamp-2">{d.venueName || d.address}</div>
              <div className={`text-sm ${skin.muted}`}>View location →</div>
            </div>
          </a>
        )}
        {left && (
          <div className="rounded-[1.75rem] bg-zinc-900 text-white p-6 flex flex-col justify-between">
            <span className="text-[11px] uppercase tracking-[0.25em] text-white/50">Countdown</span>
            <div className="font-['Outfit'] text-4xl font-bold tabular-nums">{left.d}<span className="text-lg text-white/50">d</span> {String(left.h).padStart(2, '0')}<span className="text-lg text-white/50">h</span></div>
          </div>
        )}
      </div>
    </section>
  );
}

function EditorialHero({ d, skin, eyebrow, image }: HeroProps) {
  return (
    <section id="hero" className="relative min-h-[100svh] grid grid-cols-[minmax(0,1fr)] md:grid-cols-2">
      <div className="flex flex-col justify-between px-5 md:px-12 py-10 md:py-14 order-2 md:order-1">
        <div className="flex items-center justify-between border-b border-[#1b1813] pb-4 text-[11px] uppercase tracking-[0.4em]">
          <span>{eyebrow}</span>
          <span>{d.dateParts.year || 'Vol. I'}</span>
        </div>
        <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9 }} className="py-14">
          <TitleLines d={d} className="font-['Playfair_Display'] text-6xl md:text-[6.5rem] leading-[0.88] tracking-tight" joinerClass="italic text-(--acc) text-5xl md:text-7xl my-2" />
          <Editable as="p" field="subtitle" value={d.subtitle} className="mt-8 font-['Playfair_Display'] italic text-2xl md:text-3xl" />
          <Editable as="p" field="quote" value={d.quote} className={`mt-6 max-w-md text-base leading-relaxed ${skin.muted}`} />
        </motion.div>
        <div className="grid grid-cols-2 gap-6 border-t border-[#1b1813] pt-5 text-sm">
          <div>
            <p className="text-[10px] uppercase tracking-[0.35em] opacity-60">When</p>
            <p className="mt-1 font-semibold">{d.dateText || 'To be announced'}{d.timeText ? ` · ${d.timeText}` : ''}</p>
          </div>
          <div>
            <p className="text-[10px] uppercase tracking-[0.35em] opacity-60">Where</p>
            <p className="mt-1 font-semibold line-clamp-2">{d.venueName || d.address || 'Venue details below'}</p>
          </div>
        </div>
      </div>
      <div className="relative min-h-[55vh] order-1 md:order-2">
        <Cover src={image} alt={d.title} className="absolute inset-0 w-full h-full object-cover grayscale-[30%]" />
        <div className="absolute bottom-6 left-6 bg-[#f6f1e9] px-4 py-2 text-[10px] uppercase tracking-[0.4em]">{d.family === 'religious' ? 'Est. with faith' : 'An invitation'}</div>
      </div>
    </section>
  );
}

function LuxeHero({ d, skin, eyebrow, image, Icon }: HeroProps) {
  return (
    <section id="hero" className="relative min-h-[100svh] flex flex-col items-center justify-center px-5 py-24 text-center overflow-hidden">
      <div className="absolute inset-0 opacity-[0.07] bg-[radial-gradient(circle_at_center,var(--acc)_1px,transparent_1px)] bg-[size:22px_22px]" />
      <div className="absolute inset-6 md:inset-10 border border-(--acc)/25 pointer-events-none" />
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1.2 }} className="relative z-10 flex flex-col items-center">
        <Icon size={28} strokeWidth={1.2} className="text-(--acc)" />
        <p className={`${skin.eyebrow} mt-6`}>{eyebrow}</p>
        <div className="relative mt-10 w-56 md:w-64 aspect-[3/4] rounded-t-full overflow-hidden border border-(--acc)/60 p-2">
          <Cover src={image} alt={d.title} className="w-full h-full object-cover rounded-t-full" />
        </div>
        <TitleLines d={d} className="mt-10 font-['Playfair_Display'] text-5xl md:text-7xl font-light tracking-wide" joinerClass="font-['Great_Vibes'] text-(--acc) text-4xl md:text-5xl my-1" />
        <Editable as="p" field="subtitle" value={d.subtitle} className={`mt-6 text-xs md:text-sm uppercase tracking-[0.45em] ${skin.muted}`} />
        {(d.dateText || d.timeText) && (
          <div className="mt-10 flex items-center gap-4 text-sm tracking-[0.2em] uppercase">
            <span className="h-px w-10 bg-(--acc)" />
            <span>{[d.dateText, d.timeText].filter(Boolean).join(' · ')}</span>
            <span className="h-px w-10 bg-(--acc)" />
          </div>
        )}
      </motion.div>
    </section>
  );
}

function HeroOrnament({ motif, className }: { motif: Motif; className: string }) {
  return motif === 'alpana' ? <Alpona className={className} /> : <MotifMedallion motif={motif} className={className} />;
}

function HeritageHero({ d, skin, eyebrow, image, motif = 'alpana', greeting = 'শুভ বিবাহ', colors }: HeroProps) {
  // Bengali keeps its saree border and alpona; other categories use their own motif
  const bengali = motif === 'alpana';
  const border = bengali || !colors ? <div className={sareeBorder} /> : <MotifBand motif={motif} a={colors.a} b={colors.b} />;
  return (
    <section id="hero" className="relative min-h-[100svh] flex flex-col overflow-hidden">
      {border}
      <div className="relative flex-1 flex flex-col items-center justify-center px-5 py-16 text-center">
        <HeroOrnament motif={motif} className="pointer-events-none absolute w-[46rem] max-w-none text-(--acc2) opacity-25 animate-[spin_120s_linear_infinite]" />
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9 }} className="relative z-10 flex flex-col items-center">
          {greeting && <p className="font-['Playfair_Display'] text-2xl md:text-3xl text-(--acc)">{greeting}</p>}
          <p className={`${skin.eyebrow} mt-3`}>{eyebrow}</p>
          <div className="relative mt-8 w-48 h-48 md:w-60 md:h-60">
            <HeroOrnament motif={motif} className="absolute -inset-6 w-[calc(100%+3rem)] h-[calc(100%+3rem)] text-(--acc)" />
            <Cover src={image} alt={d.title} className="relative w-full h-full rounded-full object-cover border-4 border-(--acc2) shadow-xl" />
          </div>
          <TitleLines d={d} className="mt-12 font-['Playfair_Display'] text-5xl md:text-7xl text-(--acc) leading-tight" joinerClass="font-['Great_Vibes'] text-(--acc2) text-4xl md:text-5xl my-1" />
          <Editable as="p" field="subtitle" value={d.subtitle} className={`mt-4 text-xs md:text-sm uppercase tracking-[0.4em] ${skin.muted}`} />
          {(d.dateText || d.timeText) && (
            <div className={`${skin.chip} mt-8 px-6 py-3 text-sm font-semibold flex flex-wrap items-center justify-center gap-x-4 gap-y-1`}>
              {d.dateText && <span className="flex items-center gap-2"><Calendar size={15} className="text-(--acc)" />{d.dateText}</span>}
              {d.timeText && <span className="flex items-center gap-2"><Clock size={15} className="text-(--acc)" />{d.timeText}</span>}
            </div>
          )}
        </motion.div>
      </div>
      {border}
    </section>
  );
}

const HEROES: Record<InvitationStyle, React.ComponentType<HeroProps>> = {
  Glassmorphism: GlassHero,
  'Aurora Gradient': AuroraHero,
  'Bento Grid': BentoHero,
  Editorial: EditorialHero,
  'Midnight Luxe': LuxeHero,
  Heritage: HeritageHero,
};

/* ------------------------------------------------------------------ */
/* Theme                                                               */
/* ------------------------------------------------------------------ */

export default function ModernInvitationTheme({ family, style, content, website, isEditor, updateContent }: ModernInvitationThemeProps) {
  const d = useMemo(() => buildInviteData(family, content, website), [family, content, website]);
  const calendarEvent = useMemo(() => getInvitationEvent(content, website), [content, website]);
  const editor = useMemo<InlineEditor | null>(
    () =>
      isEditor && updateContent
        ? {
            can: (field) => !!d.editPaths[field]?.length,
            save: (field, value) => updateContent(applyEdit(content, d.editPaths[field] || [], value)),
          }
        : null,
    [isEditor, updateContent, content, d],
  );
  const palette = getInvitePalette(website?.business_type);
  const themeDef = findInviteTheme(website?.theme, family);
  const motif = motifFor(website?.business_type);
  const greeting = greetingFor(website?.business_type);
  const motifColors = { a: palette.accent, b: palette.accent2 };
  const skin = SKINS[style];
  const Icon = ICONS[palette.icon];
  const Hero = HEROES[style];
  const image = d.heroImage || palette.image;
  const left = useCountdown(d.countdownTarget);
  const [wishes, sendWish] = useWishes(d.slug, d.wishCount);
  const [opened, setOpened] = useState(false);
  const [muted, setMuted] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  // Dark styles lift the accent so it stays readable on near-black backgrounds.
  const lift = (c: string) => (skin.dark ? `color-mix(in srgb, ${c} 70%, white)` : c);
  const cssVars = {
    '--acc': lift(palette.accent),
    '--acc2': lift(palette.accent2),
    '--acc3': palette.accent3,
  } as React.CSSProperties;

  const open = () => {
    setOpened(true);
    if (audioRef.current && d.musicUrl) audioRef.current.play().catch(() => undefined);
  };

  const toggleMute = () => {
    const a = audioRef.current;
    if (!a) return;
    if (a.paused) a.play().catch(() => undefined);
    a.muted = !muted;
    setMuted(!muted);
  };

  const isBento = style === 'Bento Grid';
  const wrap = isBento ? 'mx-auto max-w-6xl' : 'mx-auto max-w-5xl';
  const sectionCard = isBento ? `${skin.card} p-6 md:p-10` : '';
  const showAddress = !d.hiddenFields.includes('contact_address');
  const location = d.address || d.venueName;
  const mapLink = d.mapUrl || (location ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(location)}` : '');
  const whatsapp = digits(d.whatsapp || d.phone);
  const altBg = (i: number) => {
    if (isBento) return '';
    if (style === 'Glassmorphism' || style === 'Midnight Luxe') return i % 2 ? 'bg-white/[0.02]' : '';
    if (style === 'Aurora Gradient') return i % 2 ? 'bg-white' : '';
    if (style === 'Heritage') return i % 2 ? 'bg-[#f6e7cf]' : '';
    return i % 2 ? 'bg-[#efe8dc]' : '';
  };

  type Block = { id: string; eyebrow: string; title: string; titleField?: EditableField; body: React.ReactNode };
  const blocks: Block[] = [];

  if (!isBento && (d.dateText || d.timeText)) {
    blocks.push({
      id: 'details',
      eyebrow: 'Save The Date',
      title: 'The Details',
      body: (
        <>
        <div className="grid sm:grid-cols-3 gap-4 md:gap-6">
          {[
            { icon: Calendar, label: 'Date', value: d.dateText || 'To be announced' },
            { icon: Clock, label: 'Time', value: d.timeText || d.dateParts.weekday || 'To be announced' },
            { icon: MapPin, label: 'Venue', value: showAddress ? d.venueName || d.address || 'To be announced' : d.venueName || 'Shared with guests' },
          ].map(({ icon: I, label, value }) => (
            <div key={label} className={`${skin.card} p-6 md:p-8 ${skin.align === 'center' ? 'text-center' : ''}`}>
              <I size={22} className={`${skin.accentText} ${skin.align === 'center' ? 'mx-auto' : ''}`} />
              <p className={`mt-4 text-[11px] uppercase tracking-[0.3em] ${skin.muted}`}>{label}</p>
              <p className="mt-2 text-lg font-semibold leading-snug">{value}</p>
            </div>
          ))}
        </div>
        {calendarEvent && (
          <div className={`mt-8 flex ${skin.align === 'center' ? 'justify-center' : ''}`}>
            <AddToCalendarButton event={calendarEvent} menuPlacement="top" className={`${skin.button} px-6 py-3 font-semibold transition`} />
          </div>
        )}
        </>
      ),
    });
  }

  if (d.aboutText && !d.hidden('about')) {
    blocks.push({
      id: 'about',
      eyebrow: d.family === 'religious' ? 'Who We Are' : 'A Few Words',
      title: d.aboutTitle,
      titleField: 'aboutTitle',
      body: (
        <div className={`${style === 'Editorial' ? 'md:pl-[16.66%]' : 'max-w-3xl mx-auto'} ${skin.align === 'center' ? 'text-center' : ''}`}>
          {editor?.can('aboutText') ? (
            <Editable as="p" field="aboutText" multiline value={d.aboutText} className={`text-lg md:text-xl leading-relaxed ${skin.muted}`} />
          ) : d.aboutText.split(/\n{2,}/).map((para, i) => (
            <p key={i} className={`text-lg md:text-xl leading-relaxed ${i ? 'mt-6' : ''} ${style === 'Editorial' && i === 0 ? "first-letter:font-['Playfair_Display'] first-letter:text-7xl first-letter:float-left first-letter:mr-3 first-letter:leading-[0.8] first-letter:text-(--acc)" : ''} ${skin.muted}`}>
              {para}
            </p>
          ))}
        </div>
      ),
    });
  }

  if (d.people.length > 0 && !d.hidden('people')) {
    blocks.push({
      id: 'people',
      eyebrow: d.family === 'religious' ? 'Guidance' : 'With Love',
      title: d.peopleTitle,
      body: (
        <div className={`grid gap-6 md:gap-8 ${d.people.length === 1 ? 'max-w-sm mx-auto' : d.people.length === 2 ? 'sm:grid-cols-2 max-w-3xl mx-auto' : 'sm:grid-cols-2 lg:grid-cols-3'}`}>
          {d.people.map((p, i) => (
            <div key={i} className={`${skin.card} overflow-hidden text-center ${style === 'Editorial' ? '' : 'p-5 md:p-6'}`}>
              <Photo
                src={p.photo || ''}
                alt={p.name}
                className={`w-full aspect-[4/5] ${style === 'Glassmorphism' || style === 'Aurora Gradient' ? 'rounded-2xl' : style === 'Bento Grid' ? 'rounded-[1.25rem]' : style === 'Midnight Luxe' ? 'rounded-t-full' : style === 'Heritage' ? 'rounded-t-full border-2 border-(--acc2)' : ''}`}
              />
              <h3 className={`mt-5 text-2xl ${isSerif(style) ? "font-['Playfair_Display']" : "font-['Outfit'] font-bold"}`}>{p.name}</h3>
              {p.role && <p className={`mt-1 text-sm ${skin.muted}`}>{p.role}</p>}
            </div>
          ))}
        </div>
      ),
    });
  }

  if (left && !isBento && !d.hidden('countdown')) {
    blocks.push({ id: 'countdown', eyebrow: 'Counting Down', title: 'Until The Big Day', body: <Countdown left={left} skin={skin} style={style} /> });
  }

  if (d.schedule.length > 0 && !d.hidden('schedule')) {
    blocks.push({
      id: 'schedule',
      eyebrow: 'Programme',
      title: d.scheduleTitle,
      body: (
        <div className="max-w-3xl mx-auto relative">
          {style !== 'Editorial' && <div className={`absolute top-2 bottom-2 left-[1.15rem] w-px ${skin.dark ? 'bg-white/15' : 'bg-zinc-300'}`} />}
          <ol className="space-y-4 md:space-y-5">
            {d.schedule.map((s, i) => (
              <li key={i} className={`relative ${style === 'Editorial' ? `${skin.card} grid grid-cols-[6rem_1fr] gap-4` : 'pl-12'}`}>
                {style !== 'Editorial' && (
                  <span className="absolute left-0 top-4 w-9 h-9 rounded-full bg-(--acc) text-white text-xs font-bold flex items-center justify-center ring-4 ring-(--acc)/20">{i + 1}</span>
                )}
                {style === 'Editorial' && <span className="font-['Playfair_Display'] italic text-2xl text-(--acc)">{s.time || `No. ${i + 1}`}</span>}
                <div className={style === 'Editorial' ? '' : `${skin.card} p-5 md:p-6`}>
                  <div className="flex flex-wrap items-baseline justify-between gap-2">
                    <h3 className={`text-xl ${style === 'Midnight Luxe' ? "font-['Playfair_Display']" : 'font-semibold'}`}>{s.title}</h3>
                    {s.time && style !== 'Editorial' && <span className={`${skin.chip} px-3 py-1 text-xs font-semibold ${skin.accentText}`}>{s.time}</span>}
                  </div>
                  {(s.description || s.date || s.venue) && (
                    <p className={`mt-2 text-sm leading-relaxed ${skin.muted}`}>{[s.description, s.date, s.venue].filter(Boolean).join(' · ')}</p>
                  )}
                </div>
              </li>
            ))}
          </ol>
        </div>
      ),
    });
  }

  if (d.cards.length > 0 && !d.hidden('cards')) {
    blocks.push({
      id: 'events',
      eyebrow: d.family === 'religious' ? 'Get Involved' : "What's On",
      title: d.cardsTitle,
      body: (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {d.cards.map((c, i) => (
            <div key={i} className={`${skin.card} p-6 md:p-7 flex flex-col group ${isBento ? 'bg-zinc-50!' : ''}`}>
              <span className={`w-11 h-11 flex items-center justify-center text-sm font-bold ${isSerif(style) ? 'border border-(--acc) text-(--acc)' : 'rounded-2xl bg-(--acc)/15 text-(--acc)'}`}>
                {String(i + 1).padStart(2, '0')}
              </span>
              <h3 className={`mt-5 text-xl ${isSerif(style) ? "font-['Playfair_Display']" : "font-['Outfit'] font-bold"}`}>{c.title}</h3>
              {c.description && <p className={`mt-2 text-sm leading-relaxed flex-1 ${skin.muted}`}>{c.description}</p>}
              {c.meta && <span className={`mt-5 self-start ${skin.chip} px-3 py-1 text-xs font-semibold ${skin.accentText}`}>{c.meta}</span>}
            </div>
          ))}
        </div>
      ),
    });
  }

  if (location && showAddress && !d.hidden('venue')) {
    blocks.push({
      id: 'venue',
      eyebrow: 'Find Your Way',
      title: d.family === 'religious' ? 'Visit Us' : 'The Venue',
      body: (
        <div className="grid grid-cols-[minmax(0,1fr)] md:grid-cols-2 gap-4 md:gap-6 items-stretch">
          <div className={`${skin.card} p-6 md:p-10 flex flex-col justify-center`}>
            {d.venuePhoto && <img src={d.venuePhoto} alt={d.venueName || 'Venue'} loading="lazy" onError={hideOnError} className={`w-full aspect-video object-cover mb-6 ${skin.dark || style === 'Editorial' ? '' : 'rounded-2xl'}`} />}
            <MapPin size={24} className={skin.accentText} />
            {d.venueName && <h3 className={`mt-4 text-2xl ${isSerif(style) ? "font-['Playfair_Display']" : "font-['Outfit'] font-bold"}`}>{d.venueName}</h3>}
            {d.address && d.address !== d.venueName && <p className={`mt-2 leading-relaxed ${skin.muted}`}>{d.address}</p>}
            {mapLink && (
              <a href={mapLink} target="_blank" rel="noopener noreferrer" className={`${skin.button} mt-8 self-start inline-flex items-center gap-2 px-6 py-3 font-semibold transition`}>
                <Navigation size={16} /> Get Directions
              </a>
            )}
          </div>
          <div className={`${skin.card} overflow-hidden min-h-[300px] ${style === 'Editorial' ? 'pt-0!' : ''}`}>
            <iframe
              title="Venue map"
              className={`w-full h-full min-h-[300px] ${skin.dark ? 'grayscale invert-[0.9] contrast-[0.9]' : ''}`}
              style={{ border: 0 }}
              loading="lazy"
              src={`https://maps.google.com/maps?q=${encodeURIComponent(location)}&z=14&output=embed`}
            />
          </div>
        </div>
      ),
    });
  }

  if (d.gallery.length > 0 && !d.hidden('gallery')) {
    blocks.push({
      id: 'gallery',
      eyebrow: 'Moments',
      title: 'Gallery',
      body: (
        <div className={isBento ? 'grid grid-cols-2 md:grid-cols-4 auto-rows-[160px] md:auto-rows-[200px] gap-3' : 'columns-2 md:columns-3 gap-3 md:gap-4 [&>*]:mb-3 md:[&>*]:mb-4'}>
          {d.gallery.map((url, i) => (
            <div
              key={i}
              data-gallery-item="true"
              className={`overflow-hidden break-inside-avoid group ${isBento ? `rounded-[1.25rem] ${i % 5 === 0 ? 'col-span-2 row-span-2' : ''}` : style === 'Glassmorphism' || style === 'Aurora Gradient' ? 'rounded-2xl' : ''}`}
            >
              <img src={url} alt={`Gallery ${i + 1}`} loading="lazy" onError={hideOnError} className={`w-full ${isBento ? 'h-full object-cover' : 'h-auto'} group-hover:scale-105 transition-transform duration-700`} />
            </div>
          ))}
        </div>
      ),
    });
  }

  if (d.tags.length > 0 && !d.hidden('tags') && d.family === 'collegeFest') {
    blocks.push({
      id: 'sponsors',
      eyebrow: 'Powered By',
      title: d.tagsTitle,
      body: (
        <div className="flex flex-wrap justify-center gap-3">
          {d.tags.map((t, i) => (
            <span key={i} className={`${skin.chip} px-6 py-3 text-sm font-bold uppercase tracking-widest`}>{t}</span>
          ))}
        </div>
      ),
    });
  }

  if (!d.hidden('wishes')) {
    blocks.push({
      id: 'wishes',
      eyebrow: d.family === 'religious' ? 'Prayers' : d.family === 'collegeFest' ? 'Hype Meter' : 'Blessings',
      title: d.family === 'religious' ? 'Send Your Prayers' : d.family === 'collegeFest' ? 'Show Some Love' : 'Send Your Wishes',
      body: (
        <div className="flex flex-col items-center text-center">
          <motion.button
            whileTap={{ scale: 0.85 }}
            whileHover={{ scale: 1.05 }}
            onClick={sendWish}
            aria-label="Send a wish"
            className={`w-28 h-28 md:w-32 md:h-32 flex items-center justify-center ${isSerif(style) ? 'border border-(--acc) text-(--acc) rounded-full' : 'rounded-full bg-linear-to-br from-(--acc) to-(--acc2) text-white shadow-[0_20px_50px_-10px_var(--acc)]'}`}
          >
            <Heart size={44} className="fill-current" />
          </motion.button>
          <p className="mt-6 font-['Outfit'] text-4xl font-bold tabular-nums">{wishes.toLocaleString()}</p>
          <p className={`mt-1 text-sm ${skin.muted}`}>Tap the heart to send your love</p>
        </div>
      ),
    });
  }

  const hasContact = d.contactText || d.phone || whatsapp || d.email;
  if (hasContact && !d.hidden('rsvp') && !d.hidden('contact')) {
    blocks.push({
      id: 'rsvp',
      eyebrow: d.family === 'religious' || d.family === 'collegeFest' ? 'Get In Touch' : 'Kindly Respond',
      title: d.family === 'religious' || d.family === 'collegeFest' ? 'Contact Us' : 'RSVP',
      body: (
        <div className={`${skin.card} max-w-2xl mx-auto p-8 md:p-12 text-center`}>
          {d.contactText && <p className="text-lg whitespace-pre-line">{d.contactText}</p>}
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            {whatsapp && (
              <a href={`https://wa.me/${whatsapp}`} target="_blank" rel="noopener noreferrer" className={`${skin.button} inline-flex items-center gap-2 px-6 py-3 font-semibold transition`}>
                <MessageCircle size={16} /> WhatsApp
              </a>
            )}
            {d.phone && (
              <a href={`tel:${d.phone}`} className={`${skin.button} inline-flex items-center gap-2 px-6 py-3 font-semibold transition`}>
                <Phone size={16} /> Call
              </a>
            )}
            {d.email && (
              <a href={`mailto:${d.email}`} className={`${skin.button} inline-flex items-center gap-2 px-6 py-3 font-semibold transition`}>
                <Mail size={16} /> Email
              </a>
            )}
          </div>
        </div>
      ),
    });
  }

  return (
    <EditContext.Provider value={editor}>
    <div className={`${skin.root} ${themeDef?.font.page || ''} min-h-screen overflow-x-hidden antialiased ${!opened ? 'max-h-screen overflow-hidden' : ''}`} style={cssVars}>
      {d.musicUrl && <audio ref={audioRef} src={d.musicUrl} loop preload="auto" />}

      <AnimatePresence>
        {!opened && themeDef && (
          <motion.div key="opening" exit={{ opacity: 0 }} transition={{ duration: 0.5 }}>
            <InviteOpening
              kind={themeDef.opening}
              variant={themeDef.variant}
              title={d.title}
              eyebrow={palette.eyebrow}
              greeting={greeting}
              date={d.dateText}
              motif={motif}
              colors={{ a: palette.accent, b: palette.accent2, c: palette.accent3 }}
              titleFont={themeDef.font.raw}
              Icon={Icon}
              onOpen={open}
            />
          </motion.div>
        )}
        {!opened && !themeDef && (
          <motion.div
            key="intro"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0, y: '-100%' }}
            transition={{ duration: 0.9, ease: [0.76, 0, 0.24, 1] }}
            onClick={open}
            className={`fixed inset-0 z-[60] flex flex-col items-center justify-center cursor-pointer px-6 text-center ${skin.dark ? 'bg-[#07070c] text-white' : style === 'Editorial' ? 'bg-[#f6f1e9]' : style === 'Bento Grid' ? 'bg-[#f2f2f4]' : style === 'Heritage' ? 'bg-[#fbf3e4] text-[#3b0d0c]' : 'bg-[#fbfaff]'}`}
          >
            {style === 'Aurora Gradient' && (
              <div className="pointer-events-none absolute inset-0 overflow-hidden">
                <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-(--acc) opacity-40 blur-[110px]" />
                <div className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full bg-(--acc2) opacity-40 blur-[110px]" />
              </div>
            )}
            {style === 'Glassmorphism' && <Cover src={image} alt="" className="absolute inset-0 w-full h-full object-cover opacity-30 blur-md" />}
            <div className="relative z-10 flex flex-col items-center">
              <motion.div
                animate={{ scale: [1, 1.08, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
                className={`w-20 h-20 flex items-center justify-center ${isSerif(style) ? 'border border-(--acc) text-(--acc) rounded-full' : style === 'Bento Grid' ? 'rounded-[1.5rem] bg-(--acc) text-white' : 'rounded-full bg-white/15 border border-white/30 backdrop-blur-xl text-(--acc) shadow-xl'}`}
              >
                <Icon size={32} strokeWidth={1.5} />
              </motion.div>
              <p className={`${skin.eyebrow} mt-8`}>{palette.eyebrow}</p>
              <h2 className={`mt-4 text-4xl md:text-6xl ${isSerif(style) ? "font-['Playfair_Display']" : "font-['Outfit'] font-bold tracking-tight"}`}>{d.title}</h2>
              <p className={`mt-10 text-xs uppercase tracking-[0.4em] animate-pulse ${skin.dark ? 'text-white/60' : 'opacity-60'}`}>Tap to open invitation</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {opened && <AmbientParticles kind={ambientFor(website?.business_type, themeDef)} colors={[palette.accent, palette.accent2, palette.accent3]} />}

      {d.musicUrl && opened && (
        <button
          onClick={toggleMute}
          aria-label={muted ? 'Unmute music' : 'Mute music'}
          className="fixed bottom-6 left-6 z-50 w-12 h-12 rounded-full bg-(--acc) text-white shadow-xl flex items-center justify-center hover:scale-110 transition"
        >
          {muted ? <VolumeX size={20} /> : <Volume2 size={20} />}
        </button>
      )}

      <Hero d={d} skin={skin} eyebrow={palette.eyebrow} image={image} Icon={Icon} left={left} calendarEvent={calendarEvent} motif={motif} greeting={greeting} colors={motifColors} />
      {style !== 'Heritage' && <MotifBand motif={motif} a={palette.accent} b={palette.accent2} />}

      {blocks.map((b, i) => (
        <section key={b.id} id={b.id} className={`${skin.section} ${altBg(i)}`}>
          {!isBento && i % 2 === 1 && <div className="pointer-events-none absolute inset-0 opacity-[0.06]" style={motifTile(motif, palette.accent, palette.accent2, 44)} />}
          {style === 'Glassmorphism' && i % 3 === 0 && (
            <div className="pointer-events-none absolute inset-0 overflow-hidden">
              <div className={`absolute ${i % 2 ? 'right-[-10%]' : 'left-[-10%]'} top-10 w-[28rem] h-[28rem] rounded-full bg-(--acc) opacity-20 blur-[120px]`} />
            </div>
          )}
          <div className={`relative ${wrap} ${sectionCard}`}>
            <SectionHeading skin={skin} style={style} eyebrow={b.eyebrow} title={b.title} index={i + 1} field={b.titleField} motif={motif} />
            {b.body}
          </div>
        </section>
      ))}

      <MotifBand motif={motif} a={palette.accent} b={palette.accent2} />
      <footer className={`px-5 py-14 text-center ${isBento ? '' : skin.dark ? 'border-t border-white/10' : 'border-t border-black/10'}`}>
        <Icon size={20} className={`mx-auto ${skin.accentText}`} />
        <p className={`mt-4 ${isSerif(style) ? "font-['Playfair_Display'] italic text-2xl" : "font-['Outfit'] text-xl font-semibold"}`}>{d.title}</p>
        <p className={`mt-2 text-xs uppercase tracking-[0.3em] ${skin.muted}`}>{d.dateText || palette.eyebrow}</p>
      </footer>
    </div>
    </EditContext.Provider>
  );
}

/* ------------------------------------------------------------------ */
/* Thumbnail preview                                                   */
/* ------------------------------------------------------------------ */

const PREVIEW_W = 1280;
const PREVIEW_H = 800;

const previewContent = {
  date: '2026-12-12',
  settings_json: {
    wedding: { time: '10:30 AM', venue: 'The Grand Palace' },
    birthday: { time: '6:00 PM', venue: 'Skyline Hall' },
    housewarming: { time: '9:00 AM', venue: 'Green Villa' },
  },
};

// Renders the real hero of a style at desktop size, scaled down to fit its box,
// so dashboard cards show exactly what the theme looks like.
export function InvitationHeroPreview({ family, style, category, theme }: { family: InviteFamily; style: InvitationStyle; category: string; theme?: string }) {
  const boxRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(0);
  const website = useMemo(() => ({ business_type: category }), [category]);
  const d = useMemo(() => buildInviteData(family, previewContent, website), [family, website]);

  useEffect(() => {
    const el = boxRef.current;
    if (!el) return;
    const update = () => setScale(el.clientWidth / PREVIEW_W);
    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const palette = getInvitePalette(category);
  const themeDef = findInviteTheme(theme, family);
  const motif = motifFor(category);
  const skin = SKINS[style];
  const Hero = HEROES[style];
  const lift = (c: string) => (skin.dark ? `color-mix(in srgb, ${c} 70%, white)` : c);
  const cssVars = { '--acc': lift(palette.accent), '--acc2': lift(palette.accent2), '--acc3': palette.accent3 } as React.CSSProperties;

  return (
    <div ref={boxRef} className="absolute inset-0 overflow-hidden pointer-events-none select-none" aria-hidden="true">
      {scale > 0 && (
        <div
          className={`${skin.root} ${themeDef?.font.page || ''} relative [&_section]:min-h-0! [&_section]:h-[800px]`}
          style={{ ...cssVars, width: PREVIEW_W, height: PREVIEW_H, transform: `scale(${scale})`, transformOrigin: 'top left' }}
        >
          <Hero d={d} skin={skin} eyebrow={palette.eyebrow} image={d.heroImage || palette.image} Icon={ICONS[palette.icon]} left={null}
            motif={motif} greeting={greetingFor(category)} colors={{ a: palette.accent, b: palette.accent2 }} />
          {style !== 'Heritage' && <MotifBand motif={motif} a={palette.accent} b={palette.accent2} className="absolute left-0 right-0 bottom-0 h-10!" />}
        </div>
      )}
    </div>
  );
}
