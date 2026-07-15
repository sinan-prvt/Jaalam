import React, { useState } from 'react';
import { Facebook, Instagram, Twitter, Youtube, WhatsApp } from '../scrap/SocialIcons';

export default function MinimalOtherTheme({ website, content }: any) {
  const [selectedGalleryImage, setSelectedGalleryImage] = useState<string | null>(null);

  const sectionOrder: string[] = content?.settings_json?.section_order || ['hero', 'about', 'services', 'menu', 'gallery', 'contact', 'custom'];
  const hiddenSections: string[] = content?.settings_json?.hidden_sections || [];
  const siteName = content.settings_json?.website_name || website.slug || 'Minimal';

  const services = content.services_json?.length > 0 ? content.services_json : [
    { title: 'Simplicity', description: 'Focusing only on what truly matters.' },
    { title: 'Clarity', description: 'Communicating clearly and effectively.' },
    { title: 'Function', description: 'Designed to work perfectly, every time.' }
  ];

  const menuItems = content.products_json?.length > 0 ? content.products_json : [
    { name: 'Core', price: '$50', description: 'The absolute essentials.' },
    { name: 'Extended', price: '$150', description: 'More capabilities, same simplicity.' },
    { name: 'Complete', price: '$300', description: 'Everything you need, nothing you don\'t.' }
  ];

  return (
    <div className="min-h-screen theme-root flex flex-col bg-white text-black font-sans selection:bg-black selection:text-white">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');
        .font-minimal { font-family: 'Inter', sans-serif; }
      
        /* Dynamic Layout Ordering */
        .theme-root { display: flex; flex-direction: column; }
        .theme-root > header, .theme-root > nav { order: 0; }
        .theme-root > footer { order: 999; }
      `}</style>

      {/* Header */}
      <header className="bg-white sticky top-0 z-50 mix-blend-difference text-white">
        <div className="container mx-auto px-8 py-8 flex justify-between items-center">
          <div className="flex items-center gap-4">
            {content?.settings_json?.logo_image ? (
              <img loading="lazy" src={content.settings_json.logo_image} alt={siteName} className="h-8 w-auto object-contain invert" />
            ) : (
              <div className="font-minimal font-bold text-lg tracking-tight uppercase">
                {siteName}
              </div>
            )}
          </div>
          <nav className="hidden md:flex gap-8 font-minimal text-sm uppercase tracking-widest font-medium">
            <a href="#about" className="hover:opacity-50 transition-opacity">About</a>
            <a href="#services" className="hover:opacity-50 transition-opacity">Services</a>
            <a href="#contact" className="hover:opacity-50 transition-opacity">Contact</a>
          </nav>
        </div>
      </header>

      {/* Hero */}
      <section style={{ order: sectionOrder.indexOf('hero') + 1, display: hiddenSections.includes('hero') ? 'none' : 'flex' }} className="min-h-[85vh] flex items-center pt-10 pb-24 px-8 bg-white">
        <div className="container mx-auto max-w-5xl">
          <h1 className="font-minimal text-6xl md:text-8xl font-medium tracking-tighter mb-10 leading-[0.9]">
            {content.hero_title || 'Less is more.'}
          </h1>
          <div className="w-full h-px bg-black mb-10 max-w-sm"></div>
          <p className="font-minimal text-xl md:text-2xl text-gray-500 mb-16 max-w-2xl font-light">
            {content.hero_text || 'We strip away the unnecessary to reveal the essential. Discover clarity in our offerings.'}
          </p>
          <a href="#contact" className="inline-block border border-black text-black font-minimal text-sm uppercase tracking-widest py-4 px-12 hover:bg-black hover:text-white transition-colors">
            Connect
          </a>
        </div>
      </section>

      {/* About */}
      {sectionOrder.includes('about') && !hiddenSections.includes('about') && (
        <section style={{ order: sectionOrder.indexOf('about') + 1 }} id="about" className="py-32 px-8 bg-black text-white">
          <div className="container mx-auto max-w-5xl">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-16 md:gap-32">
              <div>
                <h2 className="font-minimal text-3xl font-medium mb-12 tracking-tight">
                  {content.settings_json?.about_title || content.about_title || 'About'}
                </h2>
                <div className="w-8 h-px bg-white mb-8"></div>
                <p className="font-minimal text-lg text-gray-400 font-light leading-relaxed">
                  {content.about_text || 'Our philosophy is rooted in minimalism. We believe that by removing the excess, we can focus on what truly adds value to your life and business.'}
                </p>
              </div>
              <div className="relative">
                <img loading="lazy" src="https://images.unsplash.com/photo-1507090960745-b32f65d3113a?auto=format&fit=crop&w=800&q=80" alt="About" className="w-full h-full object-cover grayscale" />
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Services */}
      {sectionOrder.includes('services') && !hiddenSections.includes('services') && (
        <section style={{ order: sectionOrder.indexOf('services') + 1 }} id="services" className="py-32 px-8 bg-white">
          <div className="container mx-auto max-w-5xl">
            <h2 className="font-minimal text-3xl font-medium mb-24 tracking-tight">Services</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-y-16 gap-x-8">
              {services.map((srv: any, i: number) => (
                <div key={i}>
                  <div className="font-minimal text-xs font-bold text-gray-300 mb-4 tracking-widest">0{i + 1}</div>
                  <h3 className="font-minimal text-xl font-medium mb-4">{srv.title}</h3>
                  <p className="font-minimal text-gray-500 font-light leading-relaxed">{srv.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Menu / Pricing */}
      {sectionOrder.includes('menu') && !hiddenSections.includes('menu') && (
        <section style={{ order: sectionOrder.indexOf('menu') + 1 }} id="menu" className="py-32 px-8 bg-gray-50">
          <div className="container mx-auto max-w-4xl">
            <h2 className="font-minimal text-3xl font-medium mb-24 tracking-tight">Pricing</h2>
            <div className="space-y-12">
              {menuItems.map((item: any, i: number) => (
                <div key={i} className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 group">
                  <div className="flex-1">
                    <h3 className="font-minimal text-2xl font-medium">{item.name}</h3>
                    <p className="font-minimal text-gray-500 font-light mt-2">{item.description}</p>
                  </div>
                  <div className="w-full md:w-auto h-px md:h-12 w-px bg-gray-300 hidden md:block"></div>
                  <div className="font-minimal text-2xl md:text-3xl font-light">
                    {item.price}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Gallery */}
      {sectionOrder.includes('gallery') && !hiddenSections.includes('gallery') && (
        <section style={{ order: sectionOrder.indexOf('gallery') + 1 }} id="gallery" className="py-32 px-8 bg-white">
          <div className="container mx-auto max-w-6xl">
            <h2 className="font-minimal text-3xl font-medium mb-16 tracking-tight">Gallery</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {(content.gallery_json?.length > 0 ? content.gallery_json : [
                "https://images.unsplash.com/photo-1494438639946-1ebd1d20bf85?auto=format&fit=crop&w=800&q=80",
                "https://images.unsplash.com/photo-1507090960745-b32f65d3113a?auto=format&fit=crop&w=800&q=80",
                "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=800&q=80",
                "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?auto=format&fit=crop&w=800&q=80"
              ]).map((img: string, i: number) => (
                <div key={i} className="aspect-[4/3] overflow-hidden cursor-pointer" onClick={() => setSelectedGalleryImage(img)}>
                  <img loading="lazy" src={img} alt={`Gallery ${i}`} className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-700" />
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Custom Blocks */}
      {sectionOrder.includes('custom') && !hiddenSections.includes('custom') && content.custom_blocks_json?.length > 0 && (
        <section style={{ order: sectionOrder.indexOf('custom') + 1 }} className="py-32 px-8 bg-black text-white">
          <div className="container mx-auto max-w-4xl space-y-32">
            {content.custom_blocks_json.map((block: any, i: number) => (
              <div key={i}>
                <h2 className="font-minimal text-3xl font-medium mb-12 tracking-tight">{block.title}</h2>
                <div className="prose prose-invert prose-lg max-w-none font-minimal font-light text-gray-400" dangerouslySetInnerHTML={{ __html: block.content }} />
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Contact */}
      {sectionOrder.includes('contact') && !hiddenSections.includes('contact') && (
        <section style={{ order: sectionOrder.indexOf('contact') + 1 }} id="contact" className="py-32 px-8 bg-white border-t border-black">
          <div className="container mx-auto max-w-5xl">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-24">
              <div>
                <h2 className="font-minimal text-5xl font-medium mb-12 tracking-tight">Let's talk.</h2>
                <div className="space-y-8 font-minimal font-light text-lg">
                  <div>
                    <div className="text-xs font-bold tracking-widest text-gray-400 uppercase mb-2">Address</div>
                    <div>{content.contact_info?.address || '123 Minimal St, City'}</div>
                  </div>
                  <div>
                    <div className="text-xs font-bold tracking-widest text-gray-400 uppercase mb-2">Email</div>
                    <div>{content.contact_info?.email || 'hello@example.com'}</div>
                  </div>
                  <div>
                    <div className="text-xs font-bold tracking-widest text-gray-400 uppercase mb-2">Phone</div>
                    <div>{content.contact_info?.phone || '+1 234 567 8900'}</div>
                  </div>
                  {content.contact_info?.hours && (
                    <div>
                      <div className="text-xs font-bold tracking-widest text-gray-400 uppercase mb-2">Hours</div>
                      <div>{content.contact_info.hours}</div>
                    </div>
                  )}
                </div>
              </div>
              
              <div className="flex flex-col justify-between">
                <div>
                   <div className="text-xs font-bold tracking-widest text-gray-400 uppercase mb-6 font-minimal">Follow</div>
                   <div className="flex flex-wrap gap-8">
                     {content.contact_info?.facebook && <a href={content.contact_info.facebook} target="_blank" rel="noreferrer" className="text-black hover:text-gray-500 transition-colors"><Facebook size={24} strokeWidth={1.5} /></a>}
                     {content.contact_info?.instagram && <a href={content.contact_info.instagram} target="_blank" rel="noreferrer" className="text-black hover:text-gray-500 transition-colors"><Instagram size={24} strokeWidth={1.5} /></a>}
                     {content.contact_info?.twitter && <a href={content.contact_info.twitter} target="_blank" rel="noreferrer" className="text-black hover:text-gray-500 transition-colors"><Twitter size={24} strokeWidth={1.5} /></a>}
                     {content.contact_info?.youtube && <a href={content.contact_info.youtube} target="_blank" rel="noreferrer" className="text-black hover:text-gray-500 transition-colors"><Youtube size={24} strokeWidth={1.5} /></a>}
                     {content.contact_info?.whatsapp && <a href={content.contact_info.whatsapp} target="_blank" rel="noreferrer" className="text-black hover:text-gray-500 transition-colors"><WhatsApp size={24} strokeWidth={1.5} /></a>}
                   </div>
                </div>
                
                {/* Google Maps iframe */}
                <div className="h-48 mt-12 grayscale opacity-80 hover:grayscale-0 hover:opacity-100 transition-all duration-500">
                   <iframe
                      title="Google Maps"
                      width="100%"
                      height="100%"
                      frameBorder="0"
                      style={{ border: 0 }}
                      src={`https://www.google.com/maps?q=${encodeURIComponent(content.contact_info?.address || 'New York')}&output=embed`}
                      allowFullScreen
                    ></iframe>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Footer */}
      <footer className="py-12 text-center bg-black text-white font-minimal text-sm">
        <p className="opacity-50">&copy; {new Date().getFullYear()} {siteName}. All rights reserved.</p>
      </footer>

      {/* Gallery Modal */}
      {selectedGalleryImage && (
        <div className="fixed inset-0 z-[100] bg-white flex items-center justify-center p-4 cursor-pointer" onClick={() => setSelectedGalleryImage(null)}>
          <img loading="lazy" src={selectedGalleryImage} alt="Fullscreen" className="max-w-full max-h-full object-contain" />
        </div>
      )}
    </div>
  );
}
