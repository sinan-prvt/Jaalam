import React, { useState } from 'react';
import { MapPin, Phone, Mail, Clock } from 'lucide-react';
import { Facebook, Instagram, Twitter, Youtube, WhatsApp } from '../scrap/SocialIcons';

export default function NoirOtherTheme({ website, content }: any) {
  const [selectedGalleryImage, setSelectedGalleryImage] = useState<string | null>(null);

  const sectionOrder: string[] = content?.settings_json?.section_order || ['hero', 'about', 'services', 'menu', 'gallery', 'contact', 'custom'];
  const hiddenSections: string[] = content?.settings_json?.hidden_sections || [];
  const siteName = content.settings_json?.website_name || website.slug || 'Noir';

  const services = content.services_json?.length > 0 ? content.services_json : [
    { title: 'Exclusive', description: 'Curated experiences for those who expect the best.' },
    { title: 'Refined', description: 'Attention to detail in every aspect of our work.' },
    { title: 'Discreet', description: 'Privacy and professionalism guaranteed.' }
  ];

  const menuItems = content.products_json?.length > 0 ? content.products_json : [
    { name: 'Signature', price: '$200', description: 'Our defining offering.' },
    { name: 'Bespoke', price: '$500', description: 'Customized to your exact preferences.' },
    { name: 'Reserve', price: '$1000', description: 'The pinnacle of our collection.' }
  ];

  return (
    <div className="min-h-screen theme-root flex flex-col bg-[#0a0a0a] text-[#e5e5e5] font-sans selection:bg-[#333] selection:text-white">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@400;500;600;700&family=Montserrat:wght@300;400;500&display=swap');
        .font-noir-title { font-family: 'Cinzel', serif; }
        .font-noir-body { font-family: 'Montserrat', sans-serif; }
      
        /* Dynamic Layout Ordering */
        .theme-root { display: flex; flex-direction: column; }
        .theme-root > header, .theme-root > nav { order: 0; }
        .theme-root > footer { order: 999; }
      `}</style>

      {/* Header */}
      <header className="bg-[#0a0a0a]/90 backdrop-blur-md sticky top-0 z-50 border-b border-[#222]">
        <div className="container mx-auto px-6 py-6 flex justify-between items-center">
          <div className="flex items-center gap-4">
            {content?.settings_json?.logo_image ? (
              <img src={content.settings_json.logo_image} alt={siteName} className="h-10 w-auto object-contain" />
            ) : (
              <div className="font-noir-title font-bold text-2xl tracking-[0.2em] uppercase text-white">
                {siteName}
              </div>
            )}
          </div>
          <nav className="hidden md:flex gap-10 font-noir-body text-xs uppercase tracking-[0.3em] text-[#a0a0a0]">
            <a href="#about" className="hover:text-white transition-colors">The Story</a>
            <a href="#services" className="hover:text-white transition-colors">Expertise</a>
            <a href="#contact" className="hover:text-white transition-colors">Inquiries</a>
          </nav>
        </div>
      </header>

      {/* Hero */}
      <section style={{ order: sectionOrder.indexOf('hero') + 1, display: hiddenSections.includes('hero') ? 'none' : 'flex' }} className="relative min-h-[90vh] flex items-center pt-10 pb-24 px-6 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-r from-[#0a0a0a] via-[#0a0a0a]/80 to-transparent z-10"></div>
          <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-transparent to-[#0a0a0a] z-10"></div>
          <img src="https://images.unsplash.com/photo-1550684848-fac1c5b4e853?auto=format&fit=crop&w=1600&q=80" alt="Hero Background" className="w-full h-full object-cover opacity-40 grayscale" />
        </div>
        
        <div className="container mx-auto max-w-6xl relative z-20">
          <div className="max-w-3xl">
            <h1 className="font-noir-title text-5xl md:text-7xl font-bold mb-8 leading-[1.2] tracking-wide text-white">
              {content.hero_title || 'Elegance in the Shadows.'}
            </h1>
            <p className="font-noir-body text-lg md:text-xl text-[#a0a0a0] mb-12 max-w-xl leading-relaxed font-light">
              {content.hero_text || 'Discover a world of refined taste and unparalleled exclusivity.'}
            </p>
            <a href="#contact" className="inline-block bg-white text-black font-noir-body text-xs font-semibold uppercase tracking-[0.2em] py-4 px-10 hover:bg-[#ccc] transition-colors">
              Explore
            </a>
          </div>
        </div>
      </section>

      {/* About */}
      {sectionOrder.includes('about') && !hiddenSections.includes('about') && (
        <section style={{ order: sectionOrder.indexOf('about') + 1 }} id="about" className="py-32 px-6 bg-[#0a0a0a] relative">
          <div className="absolute top-0 right-0 w-1/3 h-full bg-[#111] z-0"></div>
          <div className="container mx-auto max-w-5xl relative z-10">
            <div className="flex flex-col md:flex-row gap-16 items-center">
              <div className="w-full md:w-1/2">
                <div className="font-noir-body text-xs text-[#666] tracking-[0.3em] uppercase mb-4">Origins</div>
                <h2 className="font-noir-title text-4xl mb-8 text-white">
                  {content.settings_json?.about_title || content.about_title || 'The Story'}
                </h2>
                <div className="w-12 h-px bg-[#444] mb-8"></div>
                <p className="font-noir-body text-[15px] text-[#a0a0a0] leading-[2] font-light">
                  {content.about_text || 'Founded on the principles of discretion and excellence, we cater to a discerning clientele who appreciate the finer things in life. Our commitment to unparalleled quality is matched only by our dedication to personalized service.'}
                </p>
              </div>
              <div className="w-full md:w-1/2 p-8 md:p-12 bg-[#111] border border-[#222]">
                <img src="https://images.unsplash.com/photo-1584984260275-01e4a3c10aeb?auto=format&fit=crop&w=800&q=80" alt="About" className="w-full h-auto grayscale opacity-80" />
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Services */}
      {sectionOrder.includes('services') && !hiddenSections.includes('services') && (
        <section style={{ order: sectionOrder.indexOf('services') + 1 }} id="services" className="py-32 px-6 bg-[#111]">
          <div className="container mx-auto max-w-6xl">
            <div className="text-center mb-24">
              <div className="font-noir-body text-xs text-[#666] tracking-[0.3em] uppercase mb-4">What We Do</div>
              <h2 className="font-noir-title text-4xl text-white">Our Expertise</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-[#222]">
              {services.map((srv: any, i: number) => (
                <div key={i} className="bg-[#111] p-12 hover:bg-[#161616] transition-colors group">
                  <div className="font-noir-title text-5xl text-[#333] mb-8 group-hover:text-white transition-colors">0{i + 1}</div>
                  <h3 className="font-noir-title text-2xl mb-4 text-white">{srv.title}</h3>
                  <p className="font-noir-body text-[15px] text-[#888] leading-[1.8] font-light">{srv.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Menu / Pricing */}
      {sectionOrder.includes('menu') && !hiddenSections.includes('menu') && (
        <section style={{ order: sectionOrder.indexOf('menu') + 1 }} id="menu" className="py-32 px-6 bg-[#0a0a0a]">
          <div className="container mx-auto max-w-4xl">
             <div className="text-center mb-24">
              <div className="font-noir-body text-xs text-[#666] tracking-[0.3em] uppercase mb-4">Selections</div>
              <h2 className="font-noir-title text-4xl text-white">Offerings</h2>
            </div>
            <div className="space-y-12">
              {menuItems.map((item: any, i: number) => (
                <div key={i} className="flex justify-between items-end gap-4 group">
                  <div className="flex-1">
                    <h3 className="font-noir-title text-2xl text-white mb-2">{item.name}</h3>
                    <p className="font-noir-body text-sm text-[#888] italic">{item.description}</p>
                  </div>
                  <div className="flex-1 border-b border-dashed border-[#333] mb-2 mx-4 hidden sm:block"></div>
                  <div className="font-noir-body text-xl font-light text-white tracking-widest">
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
        <section style={{ order: sectionOrder.indexOf('gallery') + 1 }} id="gallery" className="py-32 px-6 bg-[#111]">
          <div className="container mx-auto max-w-6xl">
            <div className="flex justify-between items-end mb-16">
               <h2 className="font-noir-title text-4xl text-white">Gallery</h2>
               <div className="font-noir-body text-xs text-[#666] tracking-[0.3em] uppercase hidden md:block">Visuals</div>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              {(content.gallery_json?.length > 0 ? content.gallery_json : [
                "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?auto=format&fit=crop&w=800&q=80",
                "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=800&q=80",
                "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=800&q=80",
                "https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=800&q=80"
              ]).map((img: string, i: number) => (
                <div key={i} className={`overflow-hidden cursor-pointer ${i === 0 ? 'col-span-2 row-span-2' : ''}`} onClick={() => setSelectedGalleryImage(img)}>
                  <img src={img} alt={`Gallery ${i}`} className="w-full h-full object-cover min-h-[200px] grayscale opacity-60 hover:grayscale-0 hover:opacity-100 transition-all duration-700" />
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Custom Blocks */}
      {sectionOrder.includes('custom') && !hiddenSections.includes('custom') && content.custom_blocks_json?.length > 0 && (
        <section style={{ order: sectionOrder.indexOf('custom') + 1 }} className="py-32 px-6 bg-[#0a0a0a]">
          <div className="container mx-auto max-w-4xl space-y-24">
            {content.custom_blocks_json.map((block: any, i: number) => (
              <div key={i} className="border-l border-[#333] pl-10 md:pl-16 py-8">
                <h2 className="font-noir-title text-3xl mb-8 text-white">{block.title}</h2>
                <div className="prose prose-invert prose-lg max-w-none font-noir-body font-light text-[#999] leading-[1.8]" dangerouslySetInnerHTML={{ __html: block.content }} />
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Contact */}
      {sectionOrder.includes('contact') && !hiddenSections.includes('contact') && (
        <section style={{ order: sectionOrder.indexOf('contact') + 1 }} id="contact" className="py-32 px-6 bg-[#111]">
          <div className="container mx-auto max-w-5xl">
             <div className="grid grid-cols-1 md:grid-cols-2 gap-20">
              <div>
                <h2 className="font-noir-title text-4xl mb-12 text-white">Inquiries</h2>
                
                <div className="space-y-10 font-noir-body font-light">
                  <div className="flex items-start gap-6">
                    <MapPin className="text-[#666] mt-1" size={20} strokeWidth={1} />
                    <div>
                      <div className="text-[10px] tracking-[0.2em] text-[#555] uppercase mb-2">Location</div>
                      <div className="text-[#ccc] text-sm">{content.contact_info?.address || '123 Exclusive Ave, City'}</div>
                    </div>
                  </div>
                  <div className="flex items-start gap-6">
                    <Phone className="text-[#666] mt-1" size={20} strokeWidth={1} />
                    <div>
                      <div className="text-[10px] tracking-[0.2em] text-[#555] uppercase mb-2">Phone</div>
                      <div className="text-[#ccc] text-sm">{content.contact_info?.phone || '(555) 000-0000'}</div>
                    </div>
                  </div>
                  <div className="flex items-start gap-6">
                    <Mail className="text-[#666] mt-1" size={20} strokeWidth={1} />
                    <div>
                      <div className="text-[10px] tracking-[0.2em] text-[#555] uppercase mb-2">Email</div>
                      <div className="text-[#ccc] text-sm">{content.contact_info?.email || 'inquiries@example.com'}</div>
                    </div>
                  </div>
                  {content.contact_info?.hours && (
                    <div className="flex items-start gap-6">
                      <Clock className="text-[#666] mt-1" size={20} strokeWidth={1} />
                      <div>
                        <div className="text-[10px] tracking-[0.2em] text-[#555] uppercase mb-2">Hours</div>
                        <div className="text-[#ccc] text-sm">{content.contact_info.hours}</div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
              
              <div className="flex flex-col justify-end">
                <div className="mb-10">
                   <div className="text-[10px] tracking-[0.2em] text-[#555] uppercase mb-6 font-noir-body">Social</div>
                   <div className="flex gap-6">
                     {content.contact_info?.facebook && <a href={content.contact_info.facebook} target="_blank" rel="noreferrer" className="text-[#666] hover:text-white transition-colors"><Facebook size={20} strokeWidth={1.5} /></a>}
                     {content.contact_info?.instagram && <a href={content.contact_info.instagram} target="_blank" rel="noreferrer" className="text-[#666] hover:text-white transition-colors"><Instagram size={20} strokeWidth={1.5} /></a>}
                     {content.contact_info?.twitter && <a href={content.contact_info.twitter} target="_blank" rel="noreferrer" className="text-[#666] hover:text-white transition-colors"><Twitter size={20} strokeWidth={1.5} /></a>}
                     {content.contact_info?.youtube && <a href={content.contact_info.youtube} target="_blank" rel="noreferrer" className="text-[#666] hover:text-white transition-colors"><Youtube size={20} strokeWidth={1.5} /></a>}
                     {content.contact_info?.whatsapp && <a href={content.contact_info.whatsapp} target="_blank" rel="noreferrer" className="text-[#666] hover:text-white transition-colors"><WhatsApp size={20} strokeWidth={1.5} /></a>}
                   </div>
                </div>
                
                {/* Google Maps iframe */}
                <div className="h-64 border border-[#222] grayscale opacity-50 hover:opacity-80 transition-opacity">
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
      <footer className="py-8 text-center bg-[#050505] text-[#555] font-noir-body text-[10px] tracking-[0.2em] uppercase">
        <p>&copy; {new Date().getFullYear()} {siteName}. All rights reserved.</p>
      </footer>

      {/* Gallery Modal */}
      {selectedGalleryImage && (
        <div className="fixed inset-0 z-[100] bg-[#0a0a0a]/95 backdrop-blur-sm flex items-center justify-center p-4 cursor-pointer" onClick={() => setSelectedGalleryImage(null)}>
          <img src={selectedGalleryImage} alt="Fullscreen" className="max-w-full max-h-[90vh] object-contain border border-[#333]" />
        </div>
      )}
    </div>
  );
}
