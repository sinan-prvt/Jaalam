import React, { lazy } from 'react';

import { ModernInvitationTheme, getModernInvitationStyle } from '../invitation-modern';

// Layouts load on demand so a site only downloads the one it renders.
const ClassicLayout = lazy(() => import('./layouts/general/ClassicLayout'));
const ModernLayout = lazy(() => import('./layouts/general/ModernLayout'));
const FloralLayout = lazy(() => import('./layouts/general/FloralLayout'));
const MinimalLayout = lazy(() => import('./layouts/general/MinimalLayout'));
const ElegantLayout = lazy(() => import('./layouts/general/ElegantLayout'));
const VibrantElegantLayout = lazy(() => import('./layouts/general/VibrantElegantLayout'));
const ChristianRoseFloralLayout = lazy(() => import('./layouts/christian/ChristianRoseFloralLayout'));
const ChristianClassicLayout = lazy(() => import('./layouts/christian/ChristianClassicLayout'));
const ChristianModernChapelLayout = lazy(() => import('./layouts/christian/ChristianModernChapelLayout'));
const ChristianMinimalistCrossLayout = lazy(() => import('./layouts/christian/ChristianMinimalistCrossLayout'));
const ChristianElegantLaceLayout = lazy(() => import('./layouts/christian/ChristianElegantLaceLayout'));
const EngagementClassicLayout = lazy(() => import('./layouts/engagement/EngagementClassicLayout'));
const EngagementModernLayout = lazy(() => import('./layouts/engagement/EngagementModernLayout'));
const EngagementFloralLayout = lazy(() => import('./layouts/engagement/EngagementFloralLayout'));
const EngagementMinimalLayout = lazy(() => import('./layouts/engagement/EngagementMinimalLayout'));
const EngagementElegantLayout = lazy(() => import('./layouts/engagement/EngagementElegantLayout'));
const SouthIndianLayout = lazy(() => import('./layouts/south-indian/SouthIndianLayout'));
const TempleMinimalLayout = lazy(() => import('./layouts/south-indian/TempleMinimalLayout'));
const SouthIndianRoyalLayout = lazy(() => import('./layouts/south-indian/SouthIndianRoyalLayout'));
const SouthIndianMintLayout = lazy(() => import('./layouts/south-indian/SouthIndianMintLayout'));
const SilkTraditionalLayout = lazy(() => import('./layouts/south-indian/SilkTraditionalLayout'));
const KeralaTraditionalLayout = lazy(() => import('./layouts/kerala-traditional/KeralaTraditionalLayout'));
const KeralaModernLayout = lazy(() => import('./layouts/kerala-traditional/KeralaModernLayout'));
const BackwaterFloralLayout = lazy(() => import('./layouts/kerala-traditional/BackwaterFloralLayout'));
const GodsOwnMinimalLayout = lazy(() => import('./layouts/kerala-traditional/GodsOwnMinimalLayout'));
const TraditionalElegantLayout = lazy(() => import('./layouts/kerala-traditional/TraditionalElegantLayout'));
const RoyalNikkahLayout = lazy(() => import('./layouts/islamic/RoyalNikkahLayout'));
const ModernIslamicLayout = lazy(() => import('./layouts/islamic/ModernIslamicLayout'));
const EmeraldFloralLayout = lazy(() => import('./layouts/islamic/EmeraldFloralLayout'));
const MinimalistArabesqueLayout = lazy(() => import('./layouts/islamic/MinimalistArabesqueLayout'));
const ElegantGoldenLayout = lazy(() => import('./layouts/islamic/ElegantGoldenLayout'));
const PunjabiRoyalLayout = lazy(() => import('./layouts/punjabi-traditional/PunjabiRoyalLayout'));
const PunjabiVibrantModernLayout = lazy(() => import('./layouts/punjabi-traditional/PunjabiVibrantModernLayout'));
const PunjabiBhangraFloralLayout = lazy(() => import('./layouts/punjabi-traditional/PunjabiBhangraFloralLayout'));
const PunjabiSikhMinimalLayout = lazy(() => import('./layouts/punjabi-traditional/PunjabiSikhMinimalLayout'));
const PunjabiGoldenElegantLayout = lazy(() => import('./layouts/punjabi-traditional/PunjabiGoldenElegantLayout'));
const BengaliClassicLayout = lazy(() => import('./layouts/bengali-traditional/BengaliClassicLayout'));
const BengaliRedGoldModernLayout = lazy(() => import('./layouts/bengali-traditional/BengaliRedGoldModernLayout'));
const BengaliLotusFloralLayout = lazy(() => import('./layouts/bengali-traditional/BengaliLotusFloralLayout'));
const BengaliMinimalistSindoorLayout = lazy(() => import('./layouts/bengali-traditional/BengaliMinimalistSindoorLayout'));
const ClassicEngagementLayout = lazy(() => import('./layouts/classic-engagement/ClassicEngagementLayout'));
const FloralEngagementLayout = lazy(() => import('./layouts/classic-engagement/FloralEngagementLayout'));
const MinimalEngagementLayout = lazy(() => import('./layouts/classic-engagement/MinimalEngagementLayout'));
const ElegantEngagementLayout = lazy(() => import('./layouts/classic-engagement/ElegantEngagementLayout'));
const TraditionalEngagementLayout = lazy(() => import('./layouts/classic-engagement/TraditionalEngagementLayout'));
const ModernEngagementLayout = lazy(() => import('./layouts/modern-engagement/ModernEngagementLayout'));
const MinimalModernEngagementLayout = lazy(() => import('./layouts/modern-engagement/MinimalModernEngagementLayout'));
const PopModernEngagementLayout = lazy(() => import('./layouts/modern-engagement/PopModernEngagementLayout'));
const ClassicModernEngagementLayout = lazy(() => import('./layouts/modern-engagement/ClassicModernEngagementLayout'));
const ElegantModernEngagementLayout = lazy(() => import('./layouts/modern-engagement/ElegantModernEngagementLayout'));

interface ClassicWeddingThemeProps {
  content?: any;
  website?: any;
  updateContent?: (content: any) => void;
  isEditor?: boolean;
}

export default function ClassicWeddingTheme({ content, website, updateContent, isEditor }: ClassicWeddingThemeProps) {
    const hiddenFields: string[] = content?.settings_json?.hidden_elements || [];
  const theme = website?.theme || 'Classic';
  const category = website?.business_type || 'Wedding Invitation';

  const modernStyle = getModernInvitationStyle(theme);
  if (modernStyle) {
    return <ModernInvitationTheme family="wedding" style={modernStyle} website={website} content={content} isEditor={isEditor} updateContent={updateContent} />;
  }
  // Bengali "Elegant Traditional" has no dedicated layout file; it uses the Bengali Heritage style.
  if (category === 'Bengali Wedding' && theme.toLowerCase().includes('elegant traditional')) {
    return <ModernInvitationTheme family="wedding" style="Heritage" website={website} content={content} isEditor={isEditor} updateContent={updateContent} />;
  }

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
  } else if (category === 'Classic Engagement') {
    bgClass = "bg-[#FDFBF7]";
    sectionBg = "bg-white";
    accentText = "text-[#C5A880]";
    accentBg = "bg-[#C5A880]";
    accentHover = "hover:bg-[#B39369]";
    borderClass = "border-[#EAE5D9]";
    heroOpacity = "opacity-20";
    heroBg = "https://images.unsplash.com/photo-1616499615673-a621be9a9415?auto=format&fit=crop&w=1920&q=80";
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

  if (t.includes('golden elegant')) {
    baseTheme = 'PunjabiGoldenElegant';
  } else if (t.includes('emerald') || t.includes('emerald floral')) {
    baseTheme = 'EmeraldFloral';
  } else if (t.includes('modern islamic') || t.includes('modern_islamic')) {
    baseTheme = 'ModernIslamic';
  } else if ((t.includes('golden') || t.includes('elegant golden')) && category === 'Islamic Invitation') {
    baseTheme = 'ElegantGolden';
  } else if (t.includes('arabesque') || t.includes('minimalist arabesque')) {
    baseTheme = 'MinimalistArabesque';
  } else if (t.includes('nikkah') || t.includes('royal nikkah')) {
    baseTheme = 'RoyalNikkah';
  } else if (category === 'Islamic Invitation') {
    baseTheme = 'RoyalNikkah';
  } else if (t.includes('kerala modern')) {
    baseTheme = 'KeralaModern';
  } else if (t.includes('backwater')) {
    baseTheme = 'BackwaterFloral';
  } else if (t.includes('gods own')) {
    baseTheme = 'GodsOwnMinimal';
  } else if (t.includes('traditional') && category === 'Classic Engagement') {
    baseTheme = 'TraditionalEngagement';
  } else if (t.includes('traditional elegant')) {
    baseTheme = 'TraditionalElegant';
  } else if (category === 'Kerala Traditional' || t.includes('kasavu') || t.includes('kerala')) {
    baseTheme = 'KeralaTraditional';
  } else if (t.includes('mint') || t.includes('umbrella')) {
    baseTheme = 'SouthIndianMint';
  } else if (t.includes('silk')) {
    baseTheme = 'SilkTraditional';
  } else if (t.includes('temple minimal') || t.includes('starlight') || t.includes('romance')) {
    baseTheme = 'TempleMinimal';
  } else if (t.includes('sikh minimal')) {
    baseTheme = 'PunjabiSikhMinimal';
  } else if (t.includes('bhangra floral')) {
    baseTheme = 'PunjabiBhangraFloral';
  } else if (t.includes('bengali classic')) {
    baseTheme = 'BengaliClassic';
  } else if (t.includes('red & gold modern') || t.includes('red and gold modern')) {
    baseTheme = 'BengaliRedGoldModern';
  } else if (t.includes('lotus floral') && category === 'Bengali Wedding') {
    baseTheme = 'BengaliLotusFloral';
  } else if (t.includes('minimalist sindoor')) {
    baseTheme = 'BengaliMinimalistSindoor';
  } else if (t.includes('punjabi royal')) {
    baseTheme = 'PunjabiRoyal';
  } else if (t.includes('vibrant modern') && category === 'Punjabi Traditional') {
    baseTheme = 'PunjabiVibrantModern';
  } else if (t.includes('south indian royal')) {
    baseTheme = 'SouthIndianRoyal';
  } else if (category === 'South Indian Wedding') {
    baseTheme = 'SouthIndian';
  } else if (t.includes('modern chapel') && category === 'Christian Invitation') {
    baseTheme = 'ChristianModernChapel';
  } else if (t.includes('pop') && category === 'Modern Engagement') {
    baseTheme = 'PopModernEngagement';
  } else if (t.includes('modern') && category === 'Engagement Invitation') {
    baseTheme = 'EngagementModern';
  } else if (t.includes('modern') && category === 'Modern Engagement') {
    baseTheme = 'ModernEngagement';
  } else if (t.includes('modern')) {
    baseTheme = 'Modern';
  } else if (t.includes('minimalist cross') && category === 'Christian Invitation') {
    baseTheme = 'ChristianMinimalistCross';
  } else if ((t.includes('rose') || t.includes('floral')) && category === 'Christian Invitation') {
    baseTheme = 'ChristianRoseFloral';
  } else if (t.includes('floral') && category === 'Engagement Invitation') {
    baseTheme = 'EngagementFloral';
  } else if (t.includes('floral') && category === 'Classic Engagement') {
    baseTheme = 'FloralEngagement';
  } else if (t.includes('classic') && category === 'Engagement Invitation') {
    baseTheme = 'EngagementClassic';
  } else if (t.includes('classic') && category === 'Classic Engagement') {
    baseTheme = 'ClassicEngagement';
  } else if (t.includes('classic') && category === 'Modern Engagement') {
    baseTheme = 'ClassicModernEngagement';
  } else if (t.includes('floral') || t.includes('lotus') || t.includes('rose')) {
    baseTheme = 'Floral';
  } else if (t.includes('minimal') && category === 'Engagement Invitation') {
    baseTheme = 'EngagementMinimal';
  } else if (t.includes('minimal') && category === 'Classic Engagement') {
    baseTheme = 'MinimalEngagement';
  } else if (t.includes('minimal') && category === 'Modern Engagement') {
    baseTheme = 'MinimalModernEngagement';
  } else if (t.includes('minimal')) {
    baseTheme = 'Minimal';
  } else if ((t.includes('elegant') || t.includes('lace')) && category === 'Christian Invitation') {
    baseTheme = 'ChristianElegantLace';
  } else if (t.includes('elegant') && category === 'Engagement Invitation') {
    baseTheme = 'EngagementElegant';
  } else if (t.includes('elegant') && category === 'Classic Engagement') {
    baseTheme = 'ElegantEngagement';
  } else if (t.includes('elegant') && category === 'Modern Engagement') {
    baseTheme = 'ElegantModernEngagement';
  } else if (t.includes('elegant') || t.includes('royal')) {
    baseTheme = 'Elegant';
  } else if ((t === 'classic' || t.includes('white classic')) && category === 'Christian Invitation') {
    baseTheme = 'ChristianClassic';
  } else if (t === 'classic' && category === 'Classic Engagement') {
    baseTheme = 'ClassicEngagement';
  } else if (t === 'classic' && category === 'Engagement Invitation') {
    baseTheme = 'EngagementClassic';
  }

  switch (baseTheme) {
    case 'KeralaModern':
      return <KeralaModernLayout {...layoutProps} />;
    case 'KeralaTraditional':
      return <KeralaTraditionalLayout {...layoutProps} />;
    case 'GodsOwnMinimal':
      return <GodsOwnMinimalLayout {...layoutProps} />;
    case 'TraditionalElegant':
      return <TraditionalElegantLayout {...layoutProps} />;
    case 'BackwaterFloral':
      return <BackwaterFloralLayout {...layoutProps} />;
    case 'ElegantGolden':
      return <ElegantGoldenLayout {...layoutProps} />;
    case 'MinimalistArabesque':
      return <MinimalistArabesqueLayout {...layoutProps} />;
    case 'EmeraldFloral':
      return <EmeraldFloralLayout {...layoutProps} />;
    case 'ModernIslamic':
      return <ModernIslamicLayout {...layoutProps} />;
    case 'RoyalNikkah':
      return <RoyalNikkahLayout {...layoutProps} />;
    case 'VibrantElegant':
      return <VibrantElegantLayout {...layoutProps} />;
    case 'SilkTraditional':
      return <SilkTraditionalLayout {...layoutProps} />;
    case 'SouthIndianMint':
      return <SouthIndianMintLayout {...layoutProps} />;
    case 'ChristianModernChapel':
      return <ChristianModernChapelLayout {...layoutProps} />;
    case 'Modern':
      return <ModernLayout {...layoutProps} />;
    case 'ChristianRoseFloral':
      return <ChristianRoseFloralLayout {...layoutProps} />;
    case 'Floral':
      return <FloralLayout {...layoutProps} />;
    case 'Minimal':
      return <MinimalLayout {...layoutProps} />;
    case 'Elegant':
      return <ElegantLayout {...layoutProps} />;
    case 'TempleMinimal':
      return <TempleMinimalLayout {...layoutProps} />;
    case 'SouthIndianRoyal':
      return <SouthIndianRoyalLayout {...layoutProps} />;
    case 'SouthIndian':
      return <SouthIndianLayout {...layoutProps} />;
    case 'PunjabiRoyal':
      return <PunjabiRoyalLayout {...layoutProps} />;
    case 'PunjabiVibrantModern':
      return <PunjabiVibrantModernLayout {...layoutProps} />;
    case 'PunjabiBhangraFloral':
      return <PunjabiBhangraFloralLayout {...layoutProps} />;
    case 'PunjabiSikhMinimal':
      return <PunjabiSikhMinimalLayout {...layoutProps} />;
    case 'PunjabiGoldenElegant':
      return <PunjabiGoldenElegantLayout {...layoutProps} />;
    case 'BengaliClassic':
      return <BengaliClassicLayout {...layoutProps} />;
    case 'BengaliRedGoldModern':
      return <BengaliRedGoldModernLayout {...layoutProps} />;
    case 'BengaliLotusFloral':
      return <BengaliLotusFloralLayout {...layoutProps} />;
    case 'BengaliMinimalistSindoor':
      return <BengaliMinimalistSindoorLayout {...layoutProps} />;
    case 'ChristianMinimalistCross':
      return <ChristianMinimalistCrossLayout {...layoutProps} />;
    case 'ChristianElegantLace':
      return <ChristianElegantLaceLayout {...layoutProps} />;
    case 'ChristianClassic':
      return <ChristianClassicLayout {...layoutProps} />;
    case 'ClassicEngagement':
      return <ClassicEngagementLayout {...layoutProps} />;
    case 'FloralEngagement':
      return <FloralEngagementLayout {...layoutProps} />;
    case 'MinimalEngagement':
      return <MinimalEngagementLayout {...layoutProps} />;
    case 'ElegantEngagement':
      return <ElegantEngagementLayout {...layoutProps} />;
    case 'TraditionalEngagement':
      return <TraditionalEngagementLayout {...layoutProps} />;
    case 'ModernEngagement':
      return <ModernEngagementLayout {...layoutProps} />;
    case 'MinimalModernEngagement':
      return <MinimalModernEngagementLayout {...layoutProps} />;
    case 'PopModernEngagement':
      return <PopModernEngagementLayout {...layoutProps} />;
    case 'ClassicModernEngagement':
      return <ClassicModernEngagementLayout {...layoutProps} />;
    case 'ElegantModernEngagement':
      return <ElegantModernEngagementLayout {...layoutProps} />;
    case 'EngagementClassic':
      return <EngagementClassicLayout {...layoutProps} />;
    case 'EngagementModern':
      return <EngagementModernLayout {...layoutProps} />;
    case 'EngagementFloral':
      return <EngagementFloralLayout {...layoutProps} />;
    case 'EngagementMinimal':
      return <EngagementMinimalLayout {...layoutProps} />;
    case 'EngagementElegant':
      return <EngagementElegantLayout {...layoutProps} />;
    case 'Classic':
    default:
      return <ClassicLayout {...layoutProps} />;
  }
}
