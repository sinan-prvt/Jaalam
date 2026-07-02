import React from 'react';

export default function MinimalGroceryTheme({ website, content }: any) {
  const sectionOrder: string[] = content?.settings_json?.section_order || ['hero', 'about', 'services', 'menu', 'gallery', 'contact', 'custom'];
  const hiddenSections: string[] = content?.settings_json?.hidden_sections || [];
  const siteName = content.settings_json?.website_name || website.slug || 'essential.';
  
  const products = content.products_json?.length > 0 ? content.products_json : [
    { name: 'Oat Milk', price: '₹250', size: '1L', image: 'https://images.unsplash.com/photo-1563636619-e9143da7973b?auto=format&fit=crop&w=600&q=80' },
    { name: 'Coffee Beans', price: '₹450', size: '250g', image: 'https://images.unsplash.com/photo-1559525839-b184a4d698c7?auto=format&fit=crop&w=600&q=80' },
    { name: 'Sea Salt', price: '₹120', size: '500g', image: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&w=600&q=80' },
    { name: 'Olive Oil', price: '₹850', size: '500ml', image: 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?auto=format&fit=crop&w=600&q=80' }
  ];

  return (
    <div className="min-h-screen theme-root flex flex-col bg-white text-black font-sans">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;700&display=swap');
        .font-min { font-family: 'DM Sans', sans-serif; }
      
        /* Dynamic Layout Ordering */
        .theme-root { display: flex; flex-direction: column; }
        .theme-root > header, .theme-root > nav { order: 0; }
        .theme-root > section:nth-of-type(1) { order: ${sectionOrder.indexOf('hero') + 1}; display: ${hiddenSections.includes('hero') ? 'none' : 'block'} }
        .theme-root > section:nth-of-type(2) { order: ${sectionOrder.indexOf('menu') + 1 > 0 ? sectionOrder.indexOf('menu') + 1 : sectionOrder.indexOf('products') + 1}; display: ${hiddenSections.includes('menu') ? 'none' : 'block'} }
        .theme-root > footer { order: 999; }
    
      `}</style>

      {/* Navigation */}
      <nav className="p-8 md:p-12 flex justify-between items-center fixed w-full top-0 bg-white/90 backdrop-blur z-50">
        <span className="font-min font-bold text-2xl tracking-tighter">{siteName}</span>
        <div className="flex gap-8 text-sm font-medium">
          <a href="#shop" className="hover:opacity-50 transition-opacity">shop</a>
          <a href="#about" className="hover:opacity-50 transition-opacity">about</a>
          <span>cart(0)</span>
        </div>
      </nav>

      {/* Hero */}
      <section className="pt-48 pb-32 px-8 md:px-12 max-w-5xl mx-auto">
        <h1 className="font-min text-5xl md:text-7xl font-bold tracking-tight mb-8 leading-tight">
          {content.hero_title || 'just the good stuff.'}
        </h1>
        <p className="font-min text-xl text-gray-500 max-w-xl leading-relaxed mb-12">
          {content.hero_text || 'curated daily essentials. no clutter, no overwhelming choices. just quality products.'}
        </p>
      </section>

      {/* Products */}
      <section id="shop" className="px-8 md:px-12 pb-32">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-16">
          {products.map((p: any, i: number) => (
            <div key={i} className="group cursor-pointer flex flex-col">
              <div className="aspect-[4/5] bg-gray-50 mb-6 overflow-hidden">
                <img src={p.image} alt={p.name} className="w-full h-full object-cover mix-blend-multiply group-hover:scale-105 transition-transform duration-500" />
              </div>
              <div className="flex justify-between items-start mb-2">
                 <h3 className="font-min font-medium text-lg">{p.name}</h3>
                 <span className="font-min font-bold">{p.price}</span>
              </div>
              <div className="text-gray-400 text-sm mb-4">{p.size}</div>
              <button className="mt-auto border border-black hover:bg-black hover:text-white py-3 px-4 font-min text-sm transition-colors text-center">
                add to cart
              </button>
            </div>
          ))}
        </div>
      </section>

      
      {/* Dynamic Custom Section */}
      {sectionOrder.includes('custom') && !hiddenSections.includes('custom') && content?.custom_blocks_json?.length > 0 && (
        <section style={{ order: sectionOrder.indexOf('custom') + 1 }} className="py-16 px-4 bg-white/5 border-t border-black/10">
          <div className="container mx-auto max-w-4xl space-y-8">
            {content.custom_blocks_json.map((block: any) => {
              if (block.type === 'heading') return <h2 key={block.id} className="text-4xl md:text-5xl font-black uppercase break-words w-full">{block.content}</h2>;
              if (block.type === 'paragraph') return <p key={block.id} className="text-lg opacity-80 break-words whitespace-pre-wrap w-full">{block.content}</p>;
              if (block.type === 'image' && block.url) return <img key={block.id} src={block.url} alt="Custom" className="w-full rounded-2xl shadow-xl" />;
              if (block.type === 'divider') return <hr key={block.id} className="my-12 opacity-20" />;
              return null;
            })}
          </div>
        </section>
      )}

      {/* Footer */}
      <footer id="about" className="bg-gray-50 py-24 px-8 md:px-12">
        <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-16 font-min">
          <div>
            <span className="font-bold text-xl block mb-6">{siteName}</span>
            <p className="text-gray-500 leading-relaxed max-w-sm">
              {content.about_text || "rethinking the supermarket experience through thoughtful curation and minimal design."}
            </p>
          </div>
          <div className="grid grid-cols-2 gap-8 text-sm">
            <div>
               <div className="font-medium mb-4">contact</div>
               <div className="text-gray-500 space-y-2">
                 <div>{content.contact_info?.email || 'hello@essential.com'}</div>
                 <div>{content.contact_info?.phone || '98765 43210'}</div>
               </div>
            </div>
            <div>
               <div className="font-medium mb-4">visit</div>
               <div className="text-gray-500">
                 {content.contact_info?.address || 'studio 4, quiet lane, kerala'}
               </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

