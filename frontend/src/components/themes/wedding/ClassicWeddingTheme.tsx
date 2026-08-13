import React from 'react';

import ClassicLayout from './layouts/ClassicLayout';
import ModernLayout from './layouts/ModernLayout';
import FloralLayout from './layouts/FloralLayout';
import MinimalLayout from './layouts/MinimalLayout';
import ElegantLayout from './layouts/ElegantLayout';
import SouthIndianLayout from './layouts/SouthIndianLayout';

interface ClassicWeddingThemeProps {
  content?: any;
  website?: any;
  updateContent?: (content: any) => void;
  isEditor?: boolean;
}

export default function ClassicWeddingTheme({ content, website, updateContent, isEditor }: ClassicWeddingThemeProps) {
  const theme = website?.theme || 'Classic';
  const category = website?.business_type || 'Wedding Invitation';

  // 1. Set base colors and background based on Category (business_type)
  let bgClass = "bg-[#fdfbf7]";
  let sectionBg = "bg-[#f9f7f1]";
  let accentText = "text-[#d4af37]";
  let accentBg = "bg-[#d4af37]";
  let accentHover = "hover:bg-[#b5952f]";
  let borderClass = "border-[#d4af37]";
  let heroOpacity = "opacity-40";
  let heroBg = "https://images.unsplash.com/photo-1519225421980-715cb0215aed?auto=format&fit=crop&w=1920&q=80";

  if (category === 'Islamic Invitation') {
    bgClass = "bg-emerald-50/30";
    sectionBg = "bg-white";
    accentText = "text-emerald-700";
    accentBg = "bg-emerald-700";
    accentHover = "hover:bg-emerald-800";
    borderClass = "border-emerald-200";
    heroOpacity = "opacity-30";
    heroBg = "https://images.unsplash.com/photo-1584551246679-0daf3d275d0f?auto=format&fit=crop&w=1920&q=80";
  } else if (category === 'South Indian Wedding') {
    bgClass = "bg-amber-50/40";
    sectionBg = "bg-white";
    accentText = "text-red-700";
    accentBg = "bg-red-700";
    accentHover = "hover:bg-red-800";
    borderClass = "border-amber-200";
    heroOpacity = "opacity-30";
    heroBg = "https://images.unsplash.com/photo-1583939000185-1bf2df2cbf54?auto=format&fit=crop&w=1920&q=80";
  } else if (category === 'Kerala Traditional') {
    bgClass = "bg-[#Fdfaf4]";
    sectionBg = "bg-white";
    accentText = "text-[#8C1C13]";
    accentBg = "bg-[#8C1C13]";
    accentHover = "hover:bg-[#73150F]";
    borderClass = "border-[#d4af37]";
    heroOpacity = "opacity-20";
    heroBg = "https://images.unsplash.com/photo-1629813589433-2ba920ee9b5e?auto=format&fit=crop&w=1920&q=80";
  } else if (category === 'Punjabi Traditional') {
    bgClass = "bg-fuchsia-50/50";
    sectionBg = "bg-white";
    accentText = "text-fuchsia-600";
    accentBg = "bg-fuchsia-600";
    accentHover = "hover:bg-fuchsia-700";
    borderClass = "border-fuchsia-200";
    heroOpacity = "opacity-40";
    heroBg = "https://images.unsplash.com/photo-1579227114347-15d08fc37cae?auto=format&fit=crop&w=1920&q=80";
  } else if (category === 'Bengali Wedding') {
    bgClass = "bg-rose-50/40";
    sectionBg = "bg-white";
    accentText = "text-rose-700";
    accentBg = "bg-rose-700";
    accentHover = "hover:bg-rose-800";
    borderClass = "border-red-200";
    heroOpacity = "opacity-30";
    heroBg = "https://images.unsplash.com/photo-1601296200639-89349ce767cb?auto=format&fit=crop&w=1920&q=80";
  } else if (category === 'Christian Invitation') {
    bgClass = "bg-white";
    sectionBg = "bg-slate-50";
    accentText = "text-slate-500";
    accentBg = "bg-slate-800";
    accentHover = "hover:bg-slate-900";
    borderClass = "border-slate-200";
    heroOpacity = "opacity-50 grayscale";
    heroBg = "https://images.unsplash.com/photo-1532712938730-4e36c457b9c7?auto=format&fit=crop&w=1920&q=80";
  } else if (category === 'Engagement Invitation') {
    bgClass = "bg-indigo-50/40";
    sectionBg = "bg-white";
    accentText = "text-indigo-500";
    accentBg = "bg-indigo-500";
    accentHover = "hover:bg-indigo-600";
    borderClass = "border-indigo-100";
    heroOpacity = "opacity-40";
    heroBg = "https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?auto=format&fit=crop&w=1920&q=80";
  }

  const colors = {
    bgClass,
    sectionBg,
    accentText,
    accentBg,
    accentHover,
    borderClass,
    heroOpacity,
    heroBg
  };

  const layoutProps = { content, website, updateContent, isEditor, colors };

  let baseTheme = 'Classic';
  const t = (theme || 'Classic').toLowerCase();
  
  if (t.includes('modern')) {
    baseTheme = 'Modern';
  } else if (t.includes('floral') || t.includes('emerald') || t.includes('lotus') || t.includes('rose') || t.includes('backwater')) {
    baseTheme = 'Floral';
  } else if (t.includes('minimal')) {
    baseTheme = 'Minimal';
  } else if (t.includes('elegant') || t.includes('royal')) {
    baseTheme = 'Elegant';
  } else if (t.includes('south indian') || category === 'South Indian Wedding') {
    baseTheme = 'SouthIndian';
  }

  switch (baseTheme) {
    case 'Modern':
      return <ModernLayout {...layoutProps} />;
    case 'Floral':
      return <FloralLayout {...layoutProps} />;
    case 'Minimal':
      return <MinimalLayout {...layoutProps} />;
    case 'Elegant':
      return <ElegantLayout {...layoutProps} />;
    case 'SouthIndian':
      return <SouthIndianLayout {...layoutProps} />;
    case 'Classic':
    default:
      return <ClassicLayout {...layoutProps} />;
  }
}
