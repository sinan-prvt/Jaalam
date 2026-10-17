import React from 'react';
import TechFestModernLayout from './layouts/TechFestModernLayout';
import TechFestClassicLayout from './layouts/TechFestClassicLayout';
import { ModernInvitationTheme, getModernInvitationStyle } from '../invitation-modern';

export interface FestColors {
  bgClass: string;
  sectionBg: string;
  accentText: string;
  accentBg: string;
  accentHover: string;
  borderClass: string;
  heroOpacity: string;
  heroBg: string;
}

export interface FestCopy {
  intro: string;
  cta: string;
  hero: string;
  about: string;
  events: string[];
}

const img = (id: string) => `https://images.unsplash.com/${id}?auto=format&fit=crop&w=1920&q=80`;

interface CollegeFestThemeProps {
  content?: any;
  website?: any;
  updateContent?: (content: any) => void;
  isEditor?: boolean;
}

export default function CollegeFestTheme({ content, website, updateContent, isEditor }: CollegeFestThemeProps) {
    const hiddenFields: string[] = content?.settings_json?.hidden_elements || [];
  const theme = website?.theme || 'Modern';
  const category = website?.business_type || 'Tech Fest';

  const modernStyle = getModernInvitationStyle(theme);
  if (modernStyle) {
    return <ModernInvitationTheme family="collegeFest" style={modernStyle} website={website} content={content} isEditor={isEditor} updateContent={updateContent} />;
  }

  // Palettes per theme name. The Modern layout is built on a dark canvas, so every
  // palette keeps a dark background and changes accent, mood and imagery.
  const palettes: Record<string, FestColors> = {
    modern: { bgClass: 'bg-black', sectionBg: 'bg-slate-900', accentText: 'text-cyan-400', accentBg: 'bg-cyan-500', accentHover: 'hover:bg-cyan-400', borderClass: 'border-cyan-500/30', heroOpacity: 'opacity-40', heroBg: img('photo-1504384308090-c894fdcc538d') },
    minimal: { bgClass: 'bg-zinc-950', sectionBg: 'bg-zinc-900', accentText: 'text-zinc-100', accentBg: 'bg-white', accentHover: 'hover:bg-zinc-200', borderClass: 'border-white/15', heroOpacity: 'opacity-25 grayscale', heroBg: img('photo-1518770660439-4636190af475') },
    pop: { bgClass: 'bg-fuchsia-950', sectionBg: 'bg-[#2a0a33]', accentText: 'text-yellow-300', accentBg: 'bg-yellow-400', accentHover: 'hover:bg-yellow-300', borderClass: 'border-yellow-400/30', heroOpacity: 'opacity-50 saturate-200', heroBg: img('photo-1550751827-4bd374c3f58b') },
    corporate: { bgClass: 'bg-[#071226]', sectionBg: 'bg-[#0c1b36]', accentText: 'text-blue-400', accentBg: 'bg-blue-500', accentHover: 'hover:bg-blue-400', borderClass: 'border-blue-400/25', heroOpacity: 'opacity-30', heroBg: img('photo-1451187580459-43490279c0fa') },
    noir: { bgClass: 'bg-zinc-950', sectionBg: 'bg-black', accentText: 'text-white', accentBg: 'bg-zinc-200', accentHover: 'hover:bg-white', borderClass: 'border-zinc-700', heroOpacity: 'opacity-30 grayscale contrast-125', heroBg: img('photo-1550684848-fac1c5b4e853') },
    floral: { bgClass: 'bg-[#1d0b1a]', sectionBg: 'bg-[#2a1026]', accentText: 'text-pink-300', accentBg: 'bg-pink-400', accentHover: 'hover:bg-pink-300', borderClass: 'border-pink-300/25', heroOpacity: 'opacity-40', heroBg: img('photo-1492684223066-81342ee5ff30') },
    playful: { bgClass: 'bg-[#120f3a]', sectionBg: 'bg-[#1b1650]', accentText: 'text-amber-300', accentBg: 'bg-amber-400', accentHover: 'hover:bg-amber-300', borderClass: 'border-amber-300/30', heroOpacity: 'opacity-45 saturate-150', heroBg: img('photo-1492684223066-81342ee5ff30') },
    traditional: { bgClass: 'bg-[#1f0a07]', sectionBg: 'bg-[#2c100b]', accentText: 'text-amber-400', accentBg: 'bg-amber-500', accentHover: 'hover:bg-amber-400', borderClass: 'border-amber-500/30', heroOpacity: 'opacity-40 sepia', heroBg: img('photo-1492684223066-81342ee5ff30') },
  };

  const t = theme.toLowerCase();
  const colors = palettes[t] || palettes.modern;

  // Wording and imagery that match the kind of fest
  const copy: FestCopy = category === 'Cultural Fest'
    ? { intro: 'The Stage Awaits', cta: 'Enter the Festival', hero: 'Music, dance, drama and art. Celebrate culture with us at the most colourful festival of the year.', about: 'A celebration of talent and tradition, bringing together performers, artists and audiences for days of unforgettable shows and competitions.', events: ['Dance Battle', 'Battle of Bands', 'Drama & Theatre'] }
    : category === 'Sports Meet'
    ? { intro: 'On Your Marks', cta: 'Enter the Arena', hero: 'Compete, cheer and celebrate the spirit of sport at our annual sports meet.', about: 'Teams and athletes from across campus come together for fierce competition, fair play and a whole lot of team spirit.', events: ['Athletics', 'Football', 'Basketball'] }
    : { intro: 'System Ready', cta: 'Click to Initialize', hero: 'Join the biggest technology and innovation festival of the year. Experience the future today.', about: 'Welcome to the ultimate gathering of tech enthusiasts and innovators. Join us to experience cutting-edge technologies, thrilling competitions, and insightful sessions.', events: ['Hackathon', 'Robo Wars', 'Guest Lectures'] };

  if (category !== 'Tech Fest' && !palettes[t]) {
    colors.heroBg = category === 'Sports Meet' ? img('photo-1534438327276-14e5300c3a48') : img('photo-1492684223066-81342ee5ff30');
  }

  const layoutProps = { content, website, updateContent, isEditor, colors, copy };

  if (t === 'classic') {
    return <TechFestClassicLayout {...layoutProps} />;
  }

  return <TechFestModernLayout {...layoutProps} />;
}
