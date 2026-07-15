import React, { useState } from 'react';
import AllProductsModal from '../../shared/AllProductsModal';
import ProductModal from '../../shared/ProductModal';
import { Leaf, Truck, MapPin, Mail, Phone, Sun, ShieldCheck } from 'lucide-react';

export default function RusticMeatTheme({ website, content }: any) {
  const [showAllProducts, setShowAllProducts] = useState(false);
  const [selectedProduct, setSelectedProduct] = React.useState<any>(null);
  const sectionOrder: string[] = content?.settings_json?.section_order || ['hero', 'about', 'services', 'menu', 'gallery', 'contact', 'custom'];
  const hiddenSections: string[] = content?.settings_json?.hidden_sections || [];
  const siteName = content.settings_json?.website_name || website.slug || 'The Honest Farm';
  const products = content.products_json?.length > 0 ? content.products_json : [
    { name: 'Pasture Raised Chicken', price: '₹420/kg', image: 'https://images.unsplash.com/photo-1587593810167-a84920ea0781?auto=format&fit=crop&w=600&q=80', description: 'Raised without antibiotics on green pastures.' },
    { name: 'Grass-Fed Lamb', price: '₹1200/kg', image: 'https://images.unsplash.com/photo-1604503468506-a8da13d82791?auto=format&fit=crop&w=600&q=80', description: 'Tender cuts from naturally raised lamb.' },
    { name: 'Farm Fresh Eggs', price: '₹120/dozen', image: 'https://images.unsplash.com/photo-1598514982205-f36b96d1e8d4?auto=format&fit=crop&w=600&q=80', description: 'Free-range brown eggs.' },
    { name: 'Heritage Mutton', price: '₹950/kg', image: 'https://images.unsplash.com/photo-1588168333986-5078d3ae3976?auto=format&fit=crop&w=600&q=80', description: 'Rich flavor from heritage breeds.' }
  ];

  const services = content.services_json?.length > 0 ? content.services_json : [
    { title: 'Ethical Farming', description: 'All our animals roam free and forage naturally.' },
    { title: 'Farm to Door', description: 'Direct delivery from our pastures to your kitchen.' },
    { title: 'No Antibiotics', description: '100% natural, hormone-free and organic feed.' }
  ];

  const gallery = content.gallery_json?.length > 0 ? content.gallery_json : [
    'https://images.unsplash.com/photo-1500595046743-cd271d694d30?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1516467508483-a7212febe31a?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1473215286419-f53e6b567b14?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1518994603110-1912b3272afd?auto=format&fit=crop&w=800&q=80'
  ];

  return (
    <div className="min-h-screen theme-root flex flex-col bg-[#F4F1EA] text-[#4A5D23] font-sans overflow-x-hidden">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Zilla+Slab:ital,wght@0,400;0,600;0,700;1,400&family=Karla:wght@400;700&display=swap');
        .font-rustic { font-family: 'Zilla Slab', serif; }
        .font-body { font-family: 'Karla', sans-serif; }
      
        /* Dynamic Layout Ordering */
        .theme-root { display: flex; flex-direction: column; }
        .theme-root > header, .theme-root > nav { order: 0; }
        .theme-root > section:nth-of-type(1) { order: ${sectionOrder.indexOf('hero') + 1}; display: ${hiddenSections.includes('hero') ? 'none' : 'block'} }
        .theme-root > section:nth-of-type(2) { order: ${sectionOrder.indexOf('menu') + 1 > 0 ? sectionOrder.indexOf('menu') + 1 : sectionOrder.indexOf('products') + 1}; display: ${hiddenSections.includes('menu') ? 'none' : 'block'} }
        .theme-root > footer { order: 999; }
    
      `}</style>

      {/* Top Banner */}
      <div className="bg-[#4A5D23] text-[#F4F1EA] text-center py-2 font-body text-sm font-bold tracking-widest uppercase">
        Organic • Pasture Raised • Local
      </div>

      {/* Header */}
      <header className="py-8 px-6 bg-[#F4F1EA] sticky top-0 z-50 shadow-sm">
        <div className="container mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2 text-[#4A5D23]">
            {content.settings_json?.logo_image ? (
              <img loading="lazy" src={content.settings_json.logo_image} alt="Logo" className="h-12 object-contain" />
            ) : (
              <>
                <Sun size={32} className="fill-[#D4AF37]" />
                <span className="font-rustic text-3xl font-bold tracking-tight">{siteName}</span>
              </>
            )}
          </div>
          <nav className="flex gap-8 font-body font-bold text-sm tracking-widest uppercase text-[#5C6B3E]">
            <a href="#about" className="hover:text-[#2A3614] transition-colors">Our Farm</a>
            <a href="#shop" className="hover:text-[#2A3614] transition-colors">Shop Meat</a>
          </nav>
        </div>
      </header>

      <main>
        {(content.settings_json?.section_order || ['hero', 'about', 'services', 'menu', 'gallery', 'contact', 'custom']).map((sectionId: string) => {
          if (hiddenSections.includes(sectionId)) return null;

          if (sectionId === 'hero') return (
            <section key="hero" id="hero" className="py-16 px-6 bg-[#F4F1EA] border-b-2 border-[#8F9779]/20">
              <div className="container mx-auto max-w-6xl flex flex-col md:flex-row gap-16 items-center">
                <div className="w-full md:w-1/2">
                  <h1 className="font-rustic text-5xl md:text-7xl font-bold mb-6 text-[#2A3614] leading-tight">
                    {content.hero_title || 'Meat you can feel good about.'}
                  </h1>
                  <p className="font-body text-lg text-[#5C6B3E] mb-10 leading-relaxed">
                    {content.about_text || content.hero_text || 'We believe in ethical farming. Our animals roam free on green pastures, resulting in healthier, tastier meat for your family.'}
                  </p>
                  <a href="#shop" className="inline-flex items-center gap-2 bg-[#8F9779] hover:bg-[#4A5D23] text-[#F4F1EA] font-body font-bold py-4 px-8 rounded-full transition-colors text-sm uppercase tracking-widest">
                    <Truck size={18} /> Shop Local
                  </a>
                </div>
                <div className="w-full md:w-1/2 relative">
                   <div className="absolute inset-0 bg-[#8F9779] rounded-t-full translate-x-4 translate-y-4 opacity-20"></div>
                   <div className="relative rounded-t-full overflow-hidden border-8 border-white shadow-xl aspect-[3/4]">
                     <img loading="lazy" src={content.settings_json?.hero_image || "https://images.unsplash.com/photo-1500595046743-cd271d694d30?auto=format&fit=crop&w=800&q=80"} alt="Farm" className="w-full h-full object-cover" />
                   </div>
                </div>
              </div>
            </section>
          );

          if (sectionId === 'about') return (
            <section key="about" id="about" className="py-24 px-6 bg-[#EBE7DF]">
              <div className="container mx-auto max-w-5xl flex flex-col md:flex-row-reverse gap-16 items-center">
                <div className="w-full md:w-1/2">
                  <div className="flex items-center gap-2 text-[#8F9779] mb-4">
                    <Leaf size={24} />
                    <span className="font-body font-bold tracking-widest uppercase text-sm">Our Roots</span>
                  </div>
                  <h2 className="font-rustic text-4xl md:text-5xl font-bold text-[#2A3614] mb-6">
                    {content.settings_json?.about_title || content.about_title || 'Sustainable Agriculture'}
                  </h2>
                  <p className="font-body text-[#5C6B3E] leading-relaxed text-lg mb-6">
                    {content.settings_json?.about_description || content.about_description || 'We are stewards of the land, committed to regenerative agriculture. By rotating our animals across open pastures, we improve soil health while raising incredibly healthy livestock. No cages, no hormones, just nature working as intended.'}
                  </p>
                </div>
                <div className="w-full md:w-1/2">
                  <div className="rounded-2xl overflow-hidden border-4 border-white shadow-lg">
                     <img loading="lazy" src={content.settings_json?.about_image || content.about_image || "https://images.unsplash.com/photo-1516467508483-a7212febe31a?auto=format&fit=crop&w=800&q=80"} alt="About Farm" className="w-full h-full object-cover aspect-[4/3]" />
                  </div>
                </div>
              </div>
            </section>
          );

          if (sectionId === 'services') return (
            <section key="services" id="services" className="py-24 px-6 bg-[#4A5D23] text-[#F4F1EA]">
              <div className="container mx-auto max-w-6xl">
                <div className="text-center mb-16">
                  <h2 className="font-rustic text-4xl font-bold mb-4">Our Farm Promises</h2>
                  <div className="w-16 h-1 bg-[#8F9779] mx-auto"></div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                  {services.map((srv: any, idx: number) => {
                    const title = typeof srv === 'string' ? srv : srv.title;
                    const desc = typeof srv === 'string' ? '' : srv.description;
                    return (
                      <div key={idx} className="bg-[#2A3614] p-8 rounded-3xl border border-[#5C6B3E] text-center hover:-translate-y-2 transition-transform overflow-hidden">
                        {srv.image ? (
                          <img loading="lazy" src={srv.image} alt={title} className="w-full h-40 object-cover rounded-2xl mb-6" />
                        ) : (
                          <ShieldCheck size={40} className="text-[#8F9779] mx-auto mb-6" />
                        )}
                        <h3 className="font-rustic text-2xl font-bold mb-4 text-white">{title}</h3>
                        <p className="font-body text-[#A3AC8D] leading-relaxed">{desc}</p>
                      </div>
                    );
                  })}
                </div>
              </div>
            </section>
          );

          if (sectionId === 'menu' || sectionId === 'products') return (
            <section key="menu" id="shop" className="py-24 px-6 bg-[#F4F1EA]">
              <div className="container mx-auto max-w-6xl">
                <div className="text-center mb-16">
                  <Leaf size={32} className="mx-auto text-[#8F9779] mb-4" />
                  <h2 className="font-rustic text-4xl font-bold text-[#2A3614]">Fresh From The Farm</h2>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
                  {products.map((p: any, i: number) => (
                    <div key={i} onClick={() => setSelectedProduct(p)} className="cursor-pointer bg-white rounded-2xl p-4 shadow-sm hover:shadow-md transition-shadow group flex flex-col">
                      <div className="aspect-[4/3] rounded-xl overflow-hidden mb-4 relative">
                        <img loading="lazy" src={p.image} alt={p.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                        <div className="absolute top-2 left-2 bg-[#8F9779] text-white font-body text-xs font-bold px-2 py-1 rounded uppercase">Farm Fresh</div>
                      </div>
                      <h3 className="font-rustic text-xl font-bold text-[#2A3614] mb-2">{p.name}</h3>
                      <p className="font-body text-sm text-[#5C6B3E] mb-6 flex-1">{p.description}</p>
                      <div className="flex justify-between items-center border-t border-[#F4F1EA] pt-4 mt-auto">
                        <span className="font-body font-bold text-lg text-[#8F9779]">{p.price}</span>
                      </div>
                    </div>
                  ))}
                </div>
          <div className="mt-10 mb-4 text-center w-full flex justify-center col-span-full">
            <button 
              onClick={() => setShowAllProducts(true)} 
              className="px-8 py-3 bg-gray-900 text-white rounded hover:bg-gray-800 transition-colors font-bold tracking-wide shadow-md flex items-center justify-center gap-2 mx-auto"
            >
              View All Products
            </button>
          </div>

              </div>
            </section>
          );

          if (sectionId === 'gallery') return (
            <section key="gallery" id="gallery" className="py-24 px-6 bg-[#EBE7DF]">
              <div className="container mx-auto max-w-6xl">
                <h2 className="font-rustic text-4xl font-bold text-[#2A3614] text-center mb-16">Life on the Farm</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                  {gallery.map((img: any, idx: number) => {
                    const imgUrl = typeof img === 'string' ? img : img.url;
                    return (
                      <div key={idx} className={`rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all ${idx % 2 === 0 ? 'aspect-[4/5]' : 'aspect-square'}`}>
                        <img loading="lazy" src={imgUrl} alt="Gallery" className="w-full h-full object-cover hover:scale-110 transition-transform duration-700" />
                      </div>
                    );
                  })}
                </div>
              </div>
            </section>
          );

          if (sectionId === 'contact') return (
            <section key="contact" id="contact" className="py-24 px-6 bg-[#F4F1EA]">
              <div className="container mx-auto max-w-5xl">
                <div className="bg-white rounded-[2.5rem] shadow-lg overflow-hidden flex flex-col md:flex-row">
                  <div className="md:w-1/2 p-12 bg-[#4A5D23] text-[#F4F1EA]">
                    <h2 className="font-rustic text-4xl font-bold mb-8">Come Visit!</h2>
                    <p className="font-body text-[#A3AC8D] mb-10 leading-relaxed">
                      We love showing people where their food comes from. Farm tours are available by appointment on weekends.
                    </p>
                    <div className="space-y-6 font-body">
                      {content.contact_info?.phone && (
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 bg-[#2A3614] rounded-full flex items-center justify-center shrink-0"><Phone size={20} className="text-[#8F9779]" /></div>
                          <div>
                            <div className="text-xs tracking-widest uppercase text-[#8F9779] font-bold mb-1">Call Us</div>
                            <div>{content.contact_info.phone}</div>
                          </div>
                        </div>
                      )}
                      {content.contact_info?.email && (
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 bg-[#2A3614] rounded-full flex items-center justify-center shrink-0"><Mail size={20} className="text-[#8F9779]" /></div>
                          <div>
                            <div className="text-xs tracking-widest uppercase text-[#8F9779] font-bold mb-1">Email</div>
                            <div>{content.contact_info.email}</div>
                          </div>
                        </div>
                      )}
                      {content.contact_info?.address && (
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 bg-[#2A3614] rounded-full flex items-center justify-center shrink-0"><MapPin size={20} className="text-[#8F9779]" /></div>
                          <div>
                            <div className="text-xs tracking-widest uppercase text-[#8F9779] font-bold mb-1">Location</div>
                            <div className="leading-relaxed">{content.contact_info.address}</div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                  {content.contact_info?.address && (
                    <div className="md:w-1/2 min-h-[400px]">
                      <iframe 
                        src={`https://maps.google.com/maps?q=${encodeURIComponent(content.contact_info.address)}&t=&z=14&ie=UTF8&iwloc=&output=embed`}
                        width="100%" height="100%" style={{ border: 0 }} allowFullScreen={false} loading="lazy"
                        className="filter sepia brightness-90"
                      ></iframe>
                    </div>
                  )}
                </div>
              </div>
            </section>
          );

          if (sectionId === 'custom' && content.custom_blocks_json?.length > 0) return (
            <section key="custom" id="custom" className="py-24 px-6 bg-[#F4F1EA]">
              <div className="container mx-auto max-w-3xl space-y-12">
                {content.custom_blocks_json.map((block: any, idx: number) => {
                  if (block.type === 'heading') return <h2 key={idx} className="font-rustic text-4xl font-bold text-center text-[#2A3614]">{block.content}</h2>;
                  if (block.type === 'paragraph' || block.type === 'text') return <p key={idx} className="font-body text-[#5C6B3E] text-lg text-center leading-relaxed">{block.content}</p>;
                  if (block.type === 'image' && block.url) return <div key={idx} className="rounded-3xl overflow-hidden shadow-lg border-4 border-white"><img loading="lazy" src={block.url} alt="Custom" className="w-full h-auto" /></div>;
                  if (block.type === 'divider') return <div key={idx} className="w-16 h-1 bg-[#8F9779] mx-auto"></div>;
                  return null;
                })}
              </div>
            </section>
          );

          return null;
        })}
      </main>

      
      {/* Dynamic Custom Section */}
      {sectionOrder.includes('custom') && !hiddenSections.includes('custom') && content?.custom_blocks_json?.length > 0 && (
        <section style={{ order: sectionOrder.indexOf('custom') + 1 }} className="py-16 px-4 bg-white/5 border-t border-black/10">
          <div className="container mx-auto max-w-4xl space-y-8">
            {content.custom_blocks_json.map((block: any) => {
              if (block.type === 'heading') return <h2 key={block.id} className="text-4xl md:text-5xl font-black uppercase break-words w-full">{block.content}</h2>;
              if (block.type === 'paragraph') return <p key={block.id} className="text-lg opacity-80 break-words whitespace-pre-wrap w-full">{block.content}</p>;
              if (block.type === 'image' && block.url) return <img loading="lazy" key={block.id} src={block.url} alt="Custom" className="w-full rounded-2xl shadow-xl" />;
              if (block.type === 'divider') return <hr key={block.id} className="my-12 opacity-20" />;
              return null;
            })}
          </div>
        </section>
      )}

      {/* Footer */}
      <footer className="bg-[#2A3614] text-[#F4F1EA] py-16 px-6 border-t-8 border-[#4A5D23]">
        <div className="container mx-auto max-w-4xl text-center">
          <Sun size={48} className="mx-auto mb-6 text-[#8F9779] opacity-50" />
          <h3 className="font-rustic text-3xl font-bold mb-6">{siteName}</h3>
          <p className="font-body text-sm max-w-md mx-auto mb-10 opacity-80 leading-relaxed">
            {content.about_text || "Supporting sustainable agriculture and local food systems. Know your farmer, know your food."}
          </p>
          <div className="font-body text-sm text-[#8F9779] uppercase tracking-widest font-bold">
            © {new Date().getFullYear()} {siteName}. All Rights Reserved.
          </div>
        </div>
      </footer>
    
      
      <AllProductsModal isOpen={showAllProducts} onClose={() => setShowAllProducts(false)} products={products || []} onProductSelect={setSelectedProduct} />
      <ProductModal product={selectedProduct} onClose={() => setSelectedProduct(null)} contactInfo={content.contact_info} content={content} />
    </div>
  );
}
