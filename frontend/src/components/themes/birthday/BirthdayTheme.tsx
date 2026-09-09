import React from 'react';

import { KidsPlayfulLayout, KidsMagicLayout, KidsSuperheroLayout, KidsClassicLayout, KidsFunLayout } from './layouts/kids';
import { FirstPlayfulLayout, FirstSoftLayout, FirstMinimalLayout, FirstClassicLayout, FirstFloralLayout } from './layouts/first-birthday';

interface BirthdayThemeProps {
  content?: Record<string, unknown>;
  website?: Record<string, unknown>;
  updateContent?: (content: Record<string, unknown>) => void;
  isEditor?: boolean;
}

export default function BirthdayTheme({ content, website, updateContent, isEditor }: BirthdayThemeProps) {
  const theme = website?.theme || 'Playful';
  const category = website?.business_type || 'Kids Birthday';

  const t = ((theme as string) || '').toLowerCase().trim();

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
