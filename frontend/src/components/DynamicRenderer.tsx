import React from 'react';
import { Sparkles, Star, Zap, Image as ImageIcon } from 'lucide-react';

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

  return (
    <div className={`w-full min-h-screen ${themeFont} ${isDark ? 'bg-slate-950 text-white' : 'bg-white text-slate-900'}`}>
      {blocks.map((block: any, idx: number) => {
        const bgClass = block.bg_color || (isDark ? 'bg-slate-900' : 'bg-white');
        const textClass = block.text_color || (isDark ? 'text-white' : 'text-slate-900');
        
        switch (block.type) {
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
                        <div className="p-3 rounded-xl mb-4 text-white shadow-md" style={{ backgroundColor: primaryColor }}>
                          {renderIcon(item.icon)}
                        </div>
                        <h3 className="text-xl font-bold mb-2">{item.title}</h3>
                        <p className="opacity-70 leading-relaxed">{item.desc}</p>
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
                      <img src={`https://source.unsplash.com/800x600/?${encodeURIComponent(block.title)}`} alt="Content" className="w-full h-full object-cover" />
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
                      <div key={i} className="w-full h-64 rounded-2xl overflow-hidden group cursor-pointer">
                        <img src={`https://source.unsplash.com/600x400/?${encodeURIComponent(term)}`} alt={term} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
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
