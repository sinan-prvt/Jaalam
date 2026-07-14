import React from 'react';
import { Sparkles, Star, Zap } from 'lucide-react';

export default function DynamicRenderer({ website, content }: { website: any, content: any }) {
  const blocks = content.settings_json?.blocks || [];
  const themeFont = content.settings_json?.font === 'serif' ? 'font-serif' : content.settings_json?.font === 'mono' ? 'font-mono' : 'font-sans';
  const primaryColor = content.settings_json?.primary_color || 'indigo-600';
  const isDark = content.settings_json?.theme === 'dark';

  const renderIcon = (name: string) => {
    switch (name?.toLowerCase()) {
      case 'star': return <Star className="w-6 h-6" />;
      case 'zap': return <Zap className="w-6 h-6" />;
      default: return <Sparkles className="w-6 h-6" />;
    }
  };

  const renderMedia = (url: string, className: string = "", alt: string = "Media") => {
    if (!url) return null;
    if (url.match(/\.(mp4|webm|ogg)$/i) || url.startsWith('data:video')) {
      return <video src={url} className={className} autoPlay loop muted playsInline />;
    }
    return <img loading="lazy" src={url} alt={alt} className={className} />;
  };

  const sortedBlocks = [...blocks].sort((a: any, b: any) => {
    const aType = a.type ? a.type.toLowerCase() : '';
    const bType = b.type ? b.type.toLowerCase() : '';
    if (aType === 'navbar' && bType !== 'navbar') return -1;
    if (bType === 'navbar' && aType !== 'navbar') return 1;
    return 0;
  });

  return (
    <div className={`w-full min-h-screen flex flex-col ${themeFont} ${isDark ? 'bg-slate-950 text-white' : 'bg-white text-slate-900'}`}>
      {sortedBlocks.map((block: any, idx: number) => {
        const bgClass = block.bg_color || (isDark ? 'bg-slate-900' : 'bg-white');
        const textClass = block.text_color || (isDark ? 'text-white' : 'text-slate-900');
        
        const typeStr = block.type ? block.type.charAt(0).toUpperCase() + block.type.slice(1) : '';
        switch (typeStr) {
          case 'Navbar':
            return (
              <nav key={idx} className={`w-full py-6 px-8 flex justify-between items-center shadow-sm ${bgClass} ${textClass}`}>
                <div className="text-2xl font-black tracking-tighter">
                  {(() => {
                    const globalLogo = content.settings_json?.logo_image;
                    const urlRegex = /(https?:\/\/[^\s]+|data:image[^\s]+|data:video[^\s]+|\/[^\s]+)/;
                    const blockLogoMatch = block.logo_text ? block.logo_text.match(urlRegex) : null;
                    const logoUrl = globalLogo || (blockLogoMatch ? blockLogoMatch[0] : null);

                    if (logoUrl) {
                      return renderMedia(logoUrl, "max-h-12 object-contain inline-block", "Logo");
                    }
                    return block.logo_text || 'Logo';
                  })()}
                </div>
                <div className="hidden md:flex gap-8 font-semibold">
                  {Array.isArray(block.links) && block.links.map((link: any, i: number) => {
                    const linkText = typeof link === 'string' ? link : (link.name || link.title || link.text || 'Link');
                    return (
                      <a key={i} href="#" className="hover:opacity-70 transition-opacity">{linkText}</a>
                    );
                  })}
                </div>
              </nav>
            );

          case 'Hero':
            return (
              <section key={idx} className={`w-full py-24 px-6 flex flex-col items-center text-center ${bgClass} ${textClass}`}>
                <h1 className="text-5xl font-black mb-6 tracking-tight leading-tight max-w-4xl">{block.title}</h1>
                <p className="text-xl opacity-80 max-w-2xl mb-10">{block.subtitle}</p>
                {block.cta_text && (
                  <button className={`px-8 py-4 rounded-full font-bold text-white shadow-lg transition-transform hover:scale-105`} style={{ backgroundColor: primaryColor }}>
                    {block.cta_text}
                  </button>
                )}
              </section>
            );
          
          case 'Features':
            return (
              <section key={idx} className={`w-full py-20 px-6 ${bgClass} ${textClass}`}>
                <div className="max-w-6xl mx-auto">
                  <h2 className="text-3xl font-black mb-12 text-center">{block.title}</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {block.items?.map((item: any, i: number) => (
                      <div key={i} className="p-6 rounded-2xl bg-black/5 dark:bg-white/5 backdrop-blur-sm border border-black/10 dark:border-white/10 flex flex-col items-start">
                        { (item.image_url || item.image) ? (
                          <div className="w-full h-40 mb-4 rounded-xl overflow-hidden shadow-sm">
                            {renderMedia(item.image_url || item.image, "w-full h-full object-cover")}
                          </div>
                        ) : (
                          <div className="p-3 rounded-xl mb-4 text-white shadow-md" style={{ backgroundColor: primaryColor }}>
                            {renderIcon(item.icon)}
                          </div>
                        )}
                        <h3 className="text-xl font-bold mb-2">{item.title || item.name}</h3>
                        <p className="opacity-70 leading-relaxed">{item.desc || item.description}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </section>
            );

          case 'Content':
            const isLeft = block.layout === 'image-left';
            const isCenter = block.layout === 'center';
            return (
              <section key={idx} className={`w-full py-20 px-6 ${bgClass} ${textClass}`}>
                <div className={`max-w-6xl mx-auto flex flex-col ${isCenter ? 'items-center text-center' : (isLeft ? 'md:flex-row-reverse' : 'md:flex-row')} gap-12 items-center`}>
                  <div className="flex-1 space-y-6">
                    <h2 className="text-4xl font-black">{block.title}</h2>
                    <p className="text-lg opacity-80 leading-relaxed">{block.content}</p>
                  </div>
                  {!isCenter && (
                    <div className="flex-1 w-full h-80 rounded-3xl overflow-hidden shadow-2xl relative">
                      {block.image_url ? (
                        renderMedia(block.image_url, "w-full h-full object-cover")
                      ) : (
                        <img loading="lazy" src={`https://source.unsplash.com/800x600/?${encodeURIComponent(block.title)}`} alt="Content" className="w-full h-full object-cover" />
                      )}
                    </div>
                  )}
                </div>
              </section>
            );

          case 'Gallery':
            return (
              <section key={idx} className={`w-full py-20 px-6 ${bgClass} ${textClass}`}>
                <div className="max-w-6xl mx-auto">
                  <h2 className="text-3xl font-black mb-10 text-center">{block.title}</h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                    {block.search_terms?.map((term: string, i: number) => (
                      <div key={i} className="w-full h-64 rounded-2xl overflow-hidden group cursor-pointer relative bg-black/5">
                        {term.startsWith('http') || term.startsWith('/') || term.startsWith('data:') ? (
                          renderMedia(term, "w-full h-full object-cover group-hover:scale-110 transition-transform duration-500", `Gallery Item ${i}`)
                        ) : (
                          <img loading="lazy" src={`https://source.unsplash.com/600x400/?${encodeURIComponent(term)}`} alt={term} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </section>
            );

          case 'Contact':
            return (
              <section key={idx} className={`w-full py-20 px-6 ${bgClass} ${textClass}`}>
                <div className="max-w-4xl mx-auto text-center space-y-8">
                  <h2 className="text-4xl font-black mb-4">{block.title}</h2>
                  <div className="flex flex-col md:flex-row justify-center gap-12 opacity-80 text-lg">
                    {block.address && <p><strong>Address:</strong><br/>{typeof block.address === 'object' ? Object.values(block.address).filter(Boolean).join(', ') : block.address}</p>}
                    {block.email && <p><strong>Email:</strong><br/>{block.email}</p>}
                    {block.phone && <p><strong>Phone:</strong><br/>{block.phone}</p>}
                  </div>
                </div>
              </section>
            );

          default:
            return null;
        }
      })}
    </div>
  );
}
