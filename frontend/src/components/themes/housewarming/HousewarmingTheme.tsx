import React, { Suspense } from 'react';
import { Loader2 } from 'lucide-react';

const TraditionalLayout = React.lazy(() => import('./layouts/traditional'));
const ClassicLayout = React.lazy(() => import('./layouts/classic'));
const FloralLayout = React.lazy(() => import('./layouts/floral'));
const MinimalLayout = React.lazy(() => import('./layouts/minimal'));
const ElegantLayout = React.lazy(() => import('./layouts/elegant'));
const ModernLayout = React.lazy(() => import('./layouts/modern'));
const ModernClassicLayout = React.lazy(() => import('./layouts/modern-classic'));
const ModernMinimalLayout = React.lazy(() => import('./layouts/modern-minimal'));
const ModernElegantLayout = React.lazy(() => import('./layouts/modern-elegant'));
const ModernFloralLayout = React.lazy(() => import('./layouts/modern-floral'));

interface HousewarmingThemeProps {
  theme: string;
  content: any;
  businessType?: string;
}

export function HousewarmingTheme({ theme, content, businessType }: HousewarmingThemeProps) {
  const FallbackLoader = () => (
    <div className="flex items-center justify-center min-h-screen bg-[#FFFAF0]">
      <Loader2 className="w-8 h-8 animate-spin text-[#D4AF37]" />
    </div>
  );

  return (
    <Suspense fallback={<FallbackLoader />}>
      {(() => {
        switch (theme) {
          case 'Traditional':
            return <TraditionalLayout content={content} />;
          case 'Classic':
            if (businessType === 'Modern Housewarming') {
              return <ModernClassicLayout content={content} />;
            }
            return <ClassicLayout content={content} />;
          case 'Floral':
            if (businessType === 'Modern Housewarming') {
              return <ModernFloralLayout content={content} />;
            }
            return <FloralLayout content={content} />;
          case 'Minimal':
            if (businessType === 'Modern Housewarming') {
              return <ModernMinimalLayout content={content} />;
            }
            return <MinimalLayout content={content} />;
          case 'Elegant':
            if (businessType === 'Modern Housewarming') {
              return <ModernElegantLayout content={content} />;
            }
            return <ElegantLayout content={content} />;
          case 'Modern':
            return <ModernLayout content={content} />;
          default:
            return <TraditionalLayout content={content} />;
        }
      })()}
    </Suspense>
  );
}
