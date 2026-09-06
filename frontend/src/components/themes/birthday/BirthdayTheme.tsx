import React from 'react';

import { KidsPlayfulLayout, KidsMagicLayout } from './layouts/kids';

interface BirthdayThemeProps {
  content?: any;
  website?: any;
  updateContent?: (content: any) => void;
  isEditor?: boolean;
}

export default function BirthdayTheme({ content, website, updateContent, isEditor }: BirthdayThemeProps) {
  const theme = website?.theme || 'Playful';
  const category = website?.business_type || 'Kids Birthday';

  const t = theme.toLowerCase();

  let baseTheme = 'KidsPlayful';

  // Routing logic based on category and theme
  if (category === 'Kids Birthday' && t === 'magic') {
    baseTheme = 'KidsMagic';
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
    case 'KidsMagic':
      return <KidsMagicLayout {...layoutProps} />;
    case 'KidsPlayful':
      return <KidsPlayfulLayout {...layoutProps} />;
    default:
      return <KidsPlayfulLayout {...layoutProps} />;
  }
}
