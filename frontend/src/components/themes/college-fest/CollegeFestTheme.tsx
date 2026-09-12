import React from 'react';
import TechFestModernLayout from './layouts/TechFestModernLayout';

interface CollegeFestThemeProps {
  content?: any;
  website?: any;
  updateContent?: (content: any) => void;
  isEditor?: boolean;
}

export default function CollegeFestTheme({ content, website, updateContent, isEditor }: CollegeFestThemeProps) {
  const theme = website?.theme || 'Modern';
  const category = website?.business_type || 'Tech Fest';

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

  if (category === 'Tech Fest') {
    if (t === 'minimal') {
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
  }

  const layoutProps = { content, website, updateContent, isEditor, colors };

  // For now, all Tech Fest themes use the modern layout with injected colors
  // If we had more variations (e.g. CulturalFestLayout), we'd switch here.
  return <TechFestModernLayout {...layoutProps} />;
}
