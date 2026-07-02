import React from 'react';

interface SectionLayoutProps {
  content: any;
  components: Record<string, React.ReactNode>;
}

export default function SectionLayout({ content, components }: SectionLayoutProps) {
  // Default section order if none is set in settings
  const defaultOrder = ['hero', 'about', 'services', 'menu', 'gallery', 'contact', 'custom'];
  const order = content?.settings_json?.section_order || defaultOrder;
  const hidden = content?.settings_json?.hidden_sections || [];

  return (
    <>
      {order.map((section: string) => {
        // Hero is never hidden
        if (section !== 'hero' && hidden.includes(section)) return null;
        
        const Component = components[section];
        if (!Component) return null;
        
        return <React.Fragment key={section}>{Component}</React.Fragment>;
      })}
    </>
  );
}
