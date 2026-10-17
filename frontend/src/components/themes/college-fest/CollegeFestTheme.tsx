import React from 'react';
import TechFestModernLayout from './layouts/TechFestModernLayout';
import TechFestClassicLayout from './layouts/TechFestClassicLayout';
import { ModernInvitationTheme, getModernInvitationStyle } from '../invitation-modern';

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
    return <ModernInvitationTheme family="collegeFest" style={modernStyle} website={website} content={content} />;
  }

  // Base colors mapped by theme
  let colors = {
    bgClass: 'bg-black',
    sectionBg: 'bg-slate-900',
    accentText: 'text-cyan-400',
    accentBg: 'bg-cyan-500',
    accentHover: 'hover:bg-cyan-400',
    borderClass: 'border-cyan-500/30',
    heroOpacity: 'opacity-40',
    heroBg: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=1920&q=80'
  };

  const t = theme.toLowerCase();

  // Category tint for the default Modern layout
  if (category === 'Cultural Fest') {
    colors = { ...colors, bgClass: 'bg-[#1a0610]', sectionBg: 'bg-[#2a0a1a]', accentText: 'text-rose-400', accentBg: 'bg-rose-500', accentHover: 'hover:bg-rose-400', borderClass: 'border-rose-500/30', heroBg: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=1920&q=80' };
  } else if (category === 'Sports Meet') {
    colors = { ...colors, bgClass: 'bg-[#03140a]', sectionBg: 'bg-[#062312]', accentText: 'text-lime-400', accentBg: 'bg-lime-500', accentHover: 'hover:bg-lime-400', borderClass: 'border-lime-500/30', heroBg: 'https://images.unsplash.com/photo-1475721025505-23126fbb6b4f?auto=format&fit=crop&w=1920&q=80' };
  }

  // Theme palettes apply to every fest category (previously only Tech Fest got them)
  if (t === 'floral') {
    colors = { ...colors, bgClass: 'bg-[#1f0a14]', sectionBg: 'bg-[#2b0f1d]', accentText: 'text-pink-300', accentBg: 'bg-pink-400', accentHover: 'hover:bg-pink-300', borderClass: 'border-pink-300/30', heroOpacity: 'opacity-40' };
  } else if (t === 'playful') {
    colors = { ...colors, bgClass: 'bg-indigo-950', sectionBg: 'bg-indigo-900', accentText: 'text-amber-300', accentBg: 'bg-amber-400', accentHover: 'hover:bg-amber-300', borderClass: 'border-amber-300/30', heroOpacity: 'opacity-50 saturate-150' };
  } else if (t === 'traditional') {
    colors = { ...colors, bgClass: 'bg-[#1c0d02]', sectionBg: 'bg-[#2a1405]', accentText: 'text-amber-400', accentBg: 'bg-amber-500', accentHover: 'hover:bg-amber-400', borderClass: 'border-amber-500/30', heroOpacity: 'opacity-40 sepia' };
  } else if (t === 'minimal') {
    colors = {
      bgClass: 'bg-white',
      sectionBg: 'bg-gray-50',
      accentText: 'text-black',
      accentBg: 'bg-black',
      accentHover: 'hover:bg-gray-900',
      borderClass: 'border-gray-200',
      heroOpacity: 'opacity-20 grayscale',
      heroBg: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1920&q=80'
    };
  } else if (t === 'pop') {
    colors = {
      bgClass: 'bg-fuchsia-900',
      sectionBg: 'bg-fuchsia-950',
      accentText: 'text-yellow-400',
      accentBg: 'bg-yellow-400',
      accentHover: 'hover:bg-yellow-300',
      borderClass: 'border-yellow-400/30',
      heroOpacity: 'opacity-50 saturate-200',
      heroBg: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=1920&q=80'
    };
  } else if (t === 'corporate') {
    colors = {
      bgClass: 'bg-slate-50',
      sectionBg: 'bg-white',
      accentText: 'text-blue-600',
      accentBg: 'bg-blue-600',
      accentHover: 'hover:bg-blue-700',
      borderClass: 'border-blue-100',
      heroOpacity: 'opacity-30',
      heroBg: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1920&q=80'
    };
  } else if (t === 'noir') {
    colors = {
      bgClass: 'bg-zinc-950',
      sectionBg: 'bg-black',
      accentText: 'text-white',
      accentBg: 'bg-zinc-800',
      accentHover: 'hover:bg-zinc-700',
      borderClass: 'border-zinc-800',
      heroOpacity: 'opacity-30 grayscale contrast-125',
      heroBg: 'https://images.unsplash.com/photo-1550684848-fac1c5b4e853?auto=format&fit=crop&w=1920&q=80'
    };
  }

  const layoutProps = { content, website, updateContent, isEditor, colors };

  if (t === 'classic') {
    return <TechFestClassicLayout {...layoutProps} />;
  }

  return <TechFestModernLayout {...layoutProps} />;
}
