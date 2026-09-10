import React, { Suspense } from 'react';
import { Loader2 } from 'lucide-react';

const TraditionalLayout = React.lazy(() => import('./layouts/traditional'));
const ClassicLayout = React.lazy(() => import('./layouts/classic'));
const FloralLayout = React.lazy(() => import('./layouts/floral'));
const MinimalLayout = React.lazy(() => import('./layouts/minimal'));
const ElegantLayout = React.lazy(() => import('./layouts/elegant'));

interface HousewarmingThemeProps {
  theme: string;
  content: any;
}

export function HousewarmingTheme({ theme, content }: HousewarmingThemeProps) {
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
            return <ClassicLayout content={content} />;
          case 'Floral':
            return <FloralLayout content={content} />;
          case 'Minimal':
            return <MinimalLayout content={content} />;
          case 'Elegant':
            return <ElegantLayout content={content} />;
          case 'Modern':
            return <TraditionalLayout content={content} />; // Fallback to Traditional for now
          default:
            return <TraditionalLayout content={content} />;
        }
      })()}
    </Suspense>
  );
}
