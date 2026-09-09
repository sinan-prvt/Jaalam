import React, { Suspense } from 'react';
import { Loader2 } from 'lucide-react';

const TraditionalLayout = React.lazy(() => import('./layouts/traditional'));

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
          case 'Modern':
            return <TraditionalLayout content={content} />; // Fallback to Traditional for now
          default:
            return <TraditionalLayout content={content} />;
        }
      })()}
    </Suspense>
  );
}
