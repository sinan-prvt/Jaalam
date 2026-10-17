import React, { lazy } from 'react';

import { ModernInvitationTheme, getModernInvitationStyle } from '../invitation-modern';

// Layouts load on demand so a site only downloads the one it renders.
const KidsPlayfulLayout = lazy(() => import('./layouts/kids/KidsPlayfulLayout'));
const KidsMagicLayout = lazy(() => import('./layouts/kids/KidsMagicLayout'));
const KidsSuperheroLayout = lazy(() => import('./layouts/kids/KidsSuperheroLayout'));
const KidsClassicLayout = lazy(() => import('./layouts/kids/KidsClassicLayout'));
const KidsFunLayout = lazy(() => import('./layouts/kids/KidsFunLayout'));
const FirstPlayfulLayout = lazy(() => import('./layouts/first-birthday/FirstPlayfulLayout'));
const FirstSoftLayout = lazy(() => import('./layouts/first-birthday/FirstSoftLayout'));
const FirstMinimalLayout = lazy(() => import('./layouts/first-birthday/FirstMinimalLayout'));
const FirstClassicLayout = lazy(() => import('./layouts/first-birthday/FirstClassicLayout'));
const FirstFloralLayout = lazy(() => import('./layouts/first-birthday/FirstFloralLayout'));
const Sweet16ElegantLayout = lazy(() => import('./layouts/sweet-16/Sweet16ElegantLayout').then((m) => ({ default: m.Sweet16ElegantLayout })));
const Sweet16PopLayout = lazy(() => import('./layouts/sweet-16/Sweet16PopLayout').then((m) => ({ default: m.Sweet16PopLayout })));
const Sweet16ModernLayout = lazy(() => import('./layouts/sweet-16/Sweet16ModernLayout').then((m) => ({ default: m.Sweet16ModernLayout })));
const Sweet16ClassicLayout = lazy(() => import('./layouts/sweet-16/Sweet16ClassicLayout').then((m) => ({ default: m.Sweet16ClassicLayout })));
const Sweet16FloralLayout = lazy(() => import('./layouts/sweet-16/Sweet16FloralLayout').then((m) => ({ default: m.Sweet16FloralLayout })));
const AdultNoirLayout = lazy(() => import('./layouts/adult/AdultNoirLayout').then((m) => ({ default: m.AdultNoirLayout })));
const AdultClassicLayout = lazy(() => import('./layouts/adult/AdultClassicLayout').then((m) => ({ default: m.AdultClassicLayout })));
const AdultModernLayout = lazy(() => import('./layouts/adult/AdultModernLayout').then((m) => ({ default: m.AdultModernLayout })));
const AdultMinimalLayout = lazy(() => import('./layouts/adult/AdultMinimalLayout').then((m) => ({ default: m.AdultMinimalLayout })));
const AdultElegantLayout = lazy(() => import('./layouts/adult/AdultElegantLayout').then((m) => ({ default: m.AdultElegantLayout })));

interface BirthdayThemeProps {
  content?: Record<string, unknown>;
  website?: Record<string, unknown>;
  updateContent?: (content: Record<string, unknown>) => void;
  isEditor?: boolean;
}

export default function BirthdayTheme({ content, website, updateContent, isEditor }: BirthdayThemeProps) {
  const hiddenFields: string[] = (content as any)?.settings_json?.hidden_elements || [];
  const theme = website?.theme || 'Playful';
  const category = website?.business_type || 'Kids Birthday';

  const t = ((theme as string) || '').toLowerCase().trim();

  const modernStyle = getModernInvitationStyle(theme as string);
  if (modernStyle) {
    return <ModernInvitationTheme family="birthday" style={modernStyle} website={website} content={content} isEditor={isEditor} updateContent={updateContent} />;
  }

  let baseTheme = 'KidsPlayful';

  // Routing logic based on category and theme
  if (category === '1st Birthday') {
    if (t === 'soft') {
      baseTheme = 'FirstSoft';
    } else if (t === 'playful') {
      baseTheme = 'FirstPlayful';
    } else if (t === 'minimal') {
      baseTheme = 'FirstMinimal';
    } else if (t === 'classic') {
      baseTheme = 'FirstClassic';
    } else if (t === 'floral') {
      baseTheme = 'FirstFloral';
    } else {
      baseTheme = 'FirstPlayful'; // Fallback for 1st Birthday
    }
  } else if (category === 'Sweet 16 Birthday') {
    if (t === 'elegant') {
      baseTheme = 'Sweet16Elegant';
    } else if (t === 'pop') {
      baseTheme = 'Sweet16Pop';
    } else if (t === 'modern') {
      baseTheme = 'Sweet16Modern';
    } else if (t === 'classic') {
      baseTheme = 'Sweet16Classic';
    } else if (t === 'floral') {
      baseTheme = 'Sweet16Floral';
    } else {
      baseTheme = 'Sweet16Elegant'; // Fallback for Sweet 16
    }
  } else if (category === 'Adult Birthday') {
    if (t === 'noir') {
      baseTheme = 'AdultNoir';
    } else if (t === 'classic') {
      baseTheme = 'AdultClassic';
    } else if (t === 'modern') {
      baseTheme = 'AdultModern';
    } else if (t === 'minimal') {
      baseTheme = 'AdultMinimal';
    } else if (t === 'elegant') {
      baseTheme = 'AdultElegant';
    } else {
      baseTheme = 'AdultNoir'; // Fallback for Adult Birthday
    }
  } else if (category === 'Kids Birthday' && t === 'magic') {
    baseTheme = 'KidsMagic';
  } else if (category === 'Kids Birthday' && t === 'superhero') {
    baseTheme = 'KidsSuperhero';
  } else if (category === 'Kids Birthday' && t === 'classic') {
    baseTheme = 'KidsClassic';
  } else if (category === 'Kids Birthday' && t === 'fun') {
    baseTheme = 'KidsFun';
  } else if (category === 'Kids Birthday' && t === 'playful') {
    baseTheme = 'KidsPlayful';
  } else if (category === 'Kids Birthday') {
    baseTheme = 'KidsPlayful'; // Fallback for Kids Birthday
  }

  const layoutProps = {
    content,
    website,
    updateContent,
    isEditor
  };

  switch (baseTheme) {
    case 'FirstSoft':
      return <FirstSoftLayout {...layoutProps} />;
    case 'FirstMinimal':
      return <FirstMinimalLayout {...layoutProps} />;
    case 'FirstPlayful':
      return <FirstPlayfulLayout {...layoutProps} />;
    case 'FirstClassic':
      return <FirstClassicLayout {...layoutProps} />;
    case 'FirstFloral':
      return <FirstFloralLayout {...layoutProps} />;
    case 'Sweet16Elegant':
      return <Sweet16ElegantLayout {...layoutProps} />;
    case 'Sweet16Pop':
      return <Sweet16PopLayout {...layoutProps} />;
    case 'Sweet16Modern':
      return <Sweet16ModernLayout {...layoutProps} />;
    case 'Sweet16Classic':
      return <Sweet16ClassicLayout {...layoutProps} />;
    case 'Sweet16Floral':
      return <Sweet16FloralLayout {...layoutProps} />;
    case 'AdultNoir':
      return <AdultNoirLayout {...layoutProps} />;
    case 'AdultClassic':
      return <AdultClassicLayout {...layoutProps} />;
    case 'AdultModern':
      return <AdultModernLayout {...layoutProps} />;
    case 'AdultMinimal':
      return <AdultMinimalLayout {...layoutProps} />;
    case 'AdultElegant':
      return <AdultElegantLayout {...layoutProps} />;
    case 'KidsMagic':
      return <KidsMagicLayout {...layoutProps} />;
    case 'KidsSuperhero':
      return <KidsSuperheroLayout {...layoutProps} />;
    case 'KidsClassic':
      return <KidsClassicLayout {...layoutProps} />;
    case 'KidsFun':
      return <KidsFunLayout {...layoutProps} />;
    case 'KidsPlayful':
      return <KidsPlayfulLayout {...layoutProps} />;
    default:
      return <KidsPlayfulLayout {...layoutProps} />;
  }
}
