import React, { useState } from 'react';
import { MapPin, Phone, Mail, Clock, Check } from 'lucide-react';
import { Facebook, Instagram, Twitter, Youtube, WhatsApp } from '../scrap/SocialIcons';

export default function ClassicOtherTheme({ website, content }: any) {
  const [selectedGalleryImage, setSelectedGalleryImage] = useState<string | null>(null);

  const sectionOrder: string[] = content?.settings_json?.section_order || ['hero', 'about', 'services', 'menu', 'gallery', 'contact', 'custom'];
  const hiddenSections: string[] = content?.settings_json?.hidden_sections || [];
  const siteName = content.settings_json?.website_name || website.slug || 'Our Establishment';

  const services = content.services_json?.length > 0 ? content.services_json : [
    { title: 'Trusted Quality', description: 'Decades of experience delivering uncompromising quality.' },
    { title: 'Professional Staff', description: 'Dedicated professionals at your service.' },
    { title: 'Time-Honored', description: 'Traditions and methods that stand the test of time.' }
  ];

  const menuItems = content.products_json?.length > 0 ? content.products_json : [
    { name: 'Standard Offering', price: '$100', description: 'Our traditional and most popular selection.' },
    { name: 'Premium Offering', price: '$250', description: 'An elevated experience for discerning clients.' },
    { name: 'Custom Selection', price: 'Varies', description: 'Tailored specifically to your unique requirements.' }
  ];

  return (
    <div className="min-h-screen theme-root flex flex-col bg-[#F9F7F1] text-[#2C2C2C] font-sans">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,400&family=Lato:wght@300;400;700&display=swap');
        .font-classic-title { font-family: 'Playfair Display', serif; }
        .font-classic-body { font-family: 'Lato', sans-serif; }
      
        /* Dynamic Layout Ordering */
        .theme-root { display: flex; flex-direction: column; }
        .theme-root > header, .theme-root > nav { order: 0; }
        .theme-root > footer { order: 999; }
      `}</style>

      {/* Header */}
      <header className="bg-white border-b border-[#E8E1D5] sticky top-0 z-50">
        <div className="container mx-auto px-6 py-5 flex justify-between items-center">
          <div className="flex items-center gap-4">
            {content?.settings_json?.logo_image ? (
              <img src={content.settings_json.logo_image} alt={siteName} className="h-12 w-auto object-contain" />
            ) : (
              <div className="font-classic-title font-bold text-2xl tracking-wide text-[#2C2C2C] uppercase border-y border-[#2C2C2C] py-1">
                {siteName}
              </div>
            )}
          </div>
          <nav className="hidden md:flex gap-8 font-classic-body text-sm font-semibold tracking-widest uppercase text-[#555]">
            <a href="#about" className="hover:text-[#8C1C13] transition-colors">About Us</a>
            <a href="#services" className="hover:text-[#8C1C13] transition-colors">Services</a>
            <a href="#contact" className="hover:text-[#8C1C13] transition-colors">Contact</a>
          </nav>
        </div>
      </header>

      {/* Hero */}
      <section style={{ order: sectionOrder.indexOf('hero') + 1, display: hiddenSections.includes('hero') ? 'none' : 'block' }} className="relative bg-[#2C2C2C] text-[#F9F7F1]">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1497366811353-6870744d04b2?auto=format&fit=crop&w=1600&q=80')] bg-cover bg-center opacity-30"></div>
        <div className="container mx-auto max-w-5xl relative z-10 py-32 px-6 text-center">
          <h1 className="font-classic-title text-5xl md:text-7xl font-bold mb-6 leading-tight">
            {content.hero_title || 'Excellence & Tradition.'}
          </h1>
          <div className="w-24 h-1 bg-[#8C1C13] mx-auto mb-8"></div>
          <p className="font-classic-body text-lg md:text-xl text-[#E8E1D5] mb-12 max-w-2xl mx-auto leading-relaxed">
            {content.hero_text || 'Providing exceptional service and uncompromising quality to our valued clients for years to come.'}
          </p>
          <a href="#contact" className="inline-block border-2 border-[#F9F7F1] text-[#F9F7F1] font-classic-body font-bold text-sm uppercase tracking-widest py-4 px-10 hover:bg-[#F9F7F1] hover:text-[#2C2C2C] transition-colors">
            Contact Us Today
          </a>
        </div>
      </section>

      {/* About */}
      {sectionOrder.includes('about') && !hiddenSections.includes('about') && (
        <section style={{ order: sectionOrder.indexOf('about') + 1 }} id="about" className="py-24 px-6 bg-[#F9F7F1]">
          <div className="container mx-auto max-w-5xl">
            <div className="flex flex-col md:flex-row gap-16 items-center">
              <div className="w-full md:w-1/2">
                <img src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=800&q=80" alt="About" className="w-full h-auto rounded shadow-2xl border-4 border-white" />
              </div>
              <div className="w-full md:w-1/2">
                <h2 className="font-classic-title text-4xl font-bold mb-6 text-[#2C2C2C]">
                  {content.settings_json?.about_title || content.about_title || 'Our Heritage'}
                </h2>
                <div className="w-16 h-1 bg-[#8C1C13] mb-6"></div>
                <p className="font-classic-body text-lg text-[#555] leading-relaxed mb-6">
                  {content.about_text || 'Rooted in a commitment to quality and classic values, we strive to offer nothing but the best. Our approach combines time-tested methods with a dedication to complete customer satisfaction.'}
                </p>
                <div className="flex items-center gap-4">
                   <div className="w-12 h-12 rounded-full border border-[#E8E1D5] flex items-center justify-center">
                      <Check className="text-[#8C1C13]" size={20} />
                   </div>
                   <span className="font-classic-title text-xl font-bold italic">Dedicated to Excellence</span>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Services */}
      {sectionOrder.includes('services') && !hiddenSections.includes('services') && (
        <section style={{ order: sectionOrder.indexOf('services') + 1 }} id="services" className="py-24 px-6 bg-white border-y border-[#E8E1D5]">
          <div className="container mx-auto max-w-6xl">
            <div className="text-center mb-16">
              <h2 className="font-classic-title text-4xl font-bold mb-4 text-[#2C2C2C]">Our Services</h2>
              <div className="w-16 h-1 bg-[#8C1C13] mx-auto mb-6"></div>
              <p className="font-classic-body text-[#777] max-w-2xl mx-auto">What distinguishes us from the rest.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
              {services.map((srv: any, i: number) => (
                <div key={i} className="text-center group">
                  {srv.image ? (
                    <img src={srv.image} alt={srv.title} className="w-24 h-24 object-cover mx-auto rounded-full mb-6 border-4 border-[#F9F7F1] shadow-md group-hover:border-[#8C1C13] transition-colors" />
                  ) : (
                    <div className="w-20 h-20 mx-auto rounded-full border-2 border-[#E8E1D5] flex items-center justify-center mb-6 group-hover:border-[#8C1C13] transition-colors text-[#8C1C13]">
                       <span className="font-classic-title text-2xl font-bold">{i + 1}</span>
                    </div>
                  )}
                  <h3 className="font-classic-title text-2xl font-bold mb-4 text-[#2C2C2C]">{srv.title}</h3>
                  <p className="font-classic-body text-[#555] leading-relaxed">{srv.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Menu / Pricing */}
      {sectionOrder.includes('menu') && !hiddenSections.includes('menu') && (
        <section style={{ order: sectionOrder.indexOf('menu') + 1 }} id="menu" className="py-24 px-6 bg-[#F9F7F1]">
          <div className="container mx-auto max-w-4xl">
            <div className="text-center mb-16">
              <h2 className="font-classic-title text-4xl font-bold mb-4 text-[#2C2C2C]">Our Offerings</h2>
              <div className="w-16 h-1 bg-[#8C1C13] mx-auto mb-6"></div>
            </div>
            <div className="space-y-8">
              {menuItems.map((item: any, i: number) => (
                <div key={i} className="flex flex-col sm:flex-row justify-between items-baseline gap-4 border-b border-[#E8E1D5] pb-6">
                  <div className="flex-1">
                    <h3 className="font-classic-title text-2xl font-bold text-[#2C2C2C]">{item.name}</h3>
                    <p className="font-classic-body text-[#777] mt-2 italic">{item.description}</p>
                  </div>
                  <div className="font-classic-title text-2xl font-bold text-[#8C1C13]">
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
        <section style={{ order: sectionOrder.indexOf('gallery') + 1 }} id="gallery" className="py-24 px-6 bg-white border-y border-[#E8E1D5]">
          <div className="container mx-auto max-w-6xl">
            <div className="text-center mb-16">
              <h2 className="font-classic-title text-4xl font-bold mb-4 text-[#2C2C2C]">Gallery</h2>
              <div className="w-16 h-1 bg-[#8C1C13] mx-auto"></div>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {(content.gallery_json?.length > 0 ? content.gallery_json : [
                "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?auto=format&fit=crop&w=800&q=80",
                "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=800&q=80",
                "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=800&q=80",
                "https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=800&q=80"
              ]).map((img: string, i: number) => (
                <div key={i} className="aspect-[4/5] overflow-hidden cursor-pointer group" onClick={() => setSelectedGalleryImage(img)}>
                  <img src={img} alt={`Gallery ${i}`} className="w-full h-full object-cover grayscale opacity-80 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-500" />
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Custom Blocks */}
      {sectionOrder.includes('custom') && !hiddenSections.includes('custom') && content.custom_blocks_json?.length > 0 && (
        <section style={{ order: sectionOrder.indexOf('custom') + 1 }} className="py-24 px-6 bg-[#F9F7F1]">
          <div className="container mx-auto max-w-4xl space-y-16">
            {content.custom_blocks_json.map((block: any, i: number) => (
              <div key={i} className="bg-white p-12 border border-[#E8E1D5] shadow-sm text-center">
                <h2 className="font-classic-title text-3xl font-bold mb-6 text-[#2C2C2C]">{block.title}</h2>
                <div className="w-12 h-px bg-[#8C1C13] mx-auto mb-8"></div>
                <div className="prose prose-stone prose-lg max-w-none font-classic-body text-[#555] leading-relaxed" dangerouslySetInnerHTML={{ __html: block.content }} />
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Contact */}
      {sectionOrder.includes('contact') && !hiddenSections.includes('contact') && (
        <section style={{ order: sectionOrder.indexOf('contact') + 1 }} id="contact" className="py-24 px-6 bg-[#2C2C2C] text-[#F9F7F1]">
          <div className="container mx-auto max-w-6xl">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
              <div>
                <h2 className="font-classic-title text-4xl font-bold mb-6">Contact Us</h2>
                <div className="w-16 h-1 bg-[#8C1C13] mb-10"></div>
                
                <div className="space-y-8 font-classic-body">
                  <div className="flex items-start gap-4">
                    <MapPin className="text-[#8C1C13] mt-1" size={24} />
                    <div>
                      <div className="font-bold text-lg mb-1 uppercase tracking-widest text-[#E8E1D5] text-sm">Location</div>
                      <div className="text-[#bbb]">{content.contact_info?.address || '123 Heritage Lane, City'}</div>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <Phone className="text-[#8C1C13] mt-1" size={24} />
                    <div>
                      <div className="font-bold text-lg mb-1 uppercase tracking-widest text-[#E8E1D5] text-sm">Phone</div>
                      <div className="text-[#bbb]">{content.contact_info?.phone || '(555) 123-4567'}</div>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <Mail className="text-[#8C1C13] mt-1" size={24} />
                    <div>
                      <div className="font-bold text-lg mb-1 uppercase tracking-widest text-[#E8E1D5] text-sm">Email</div>
                      <div className="text-[#bbb]">{content.contact_info?.email || 'contact@example.com'}</div>
                    </div>
                  </div>
                  {content.contact_info?.hours && (
                    <div className="flex items-start gap-4">
                      <Clock className="text-[#8C1C13] mt-1" size={24} />
                      <div>
                        <div className="font-bold text-lg mb-1 uppercase tracking-widest text-[#E8E1D5] text-sm">Hours</div>
                        <div className="text-[#bbb]">{content.contact_info.hours}</div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
              
              <div>
                <h3 className="font-classic-title text-2xl font-bold mb-6">Connect</h3>
                <div className="flex gap-4 mb-10">
                  {content.contact_info?.facebook && <a href={content.contact_info.facebook} target="_blank" rel="noreferrer" className="w-10 h-10 border border-[#555] flex items-center justify-center hover:bg-[#8C1C13] hover:border-[#8C1C13] transition-colors"><Facebook size={18} /></a>}
                  {content.contact_info?.instagram && <a href={content.contact_info.instagram} target="_blank" rel="noreferrer" className="w-10 h-10 border border-[#555] flex items-center justify-center hover:bg-[#8C1C13] hover:border-[#8C1C13] transition-colors"><Instagram size={18} /></a>}
                  {content.contact_info?.twitter && <a href={content.contact_info.twitter} target="_blank" rel="noreferrer" className="w-10 h-10 border border-[#555] flex items-center justify-center hover:bg-[#8C1C13] hover:border-[#8C1C13] transition-colors"><Twitter size={18} /></a>}
                  {content.contact_info?.youtube && <a href={content.contact_info.youtube} target="_blank" rel="noreferrer" className="w-10 h-10 border border-[#555] flex items-center justify-center hover:bg-[#8C1C13] hover:border-[#8C1C13] transition-colors"><Youtube size={18} /></a>}
                  {content.contact_info?.whatsapp && <a href={content.contact_info.whatsapp} target="_blank" rel="noreferrer" className="w-10 h-10 border border-[#555] flex items-center justify-center hover:bg-[#8C1C13] hover:border-[#8C1C13] transition-colors"><WhatsApp size={18} /></a>}
                </div>
                
                {/* Google Maps iframe */}
                <div className="h-64 bg-[#1A1A1A] border border-[#555]">
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
      <footer className="py-10 text-center bg-[#1A1A1A] text-[#777] font-classic-body border-t border-[#333]">
        <div className="font-classic-title text-xl mb-4 text-[#E8E1D5]">{siteName}</div>
        <p>&copy; {new Date().getFullYear()} {siteName}. All rights reserved.</p>
      </footer>

      {/* Gallery Modal */}
      {selectedGalleryImage && (
        <div className="fixed inset-0 z-[100] bg-black/95 flex items-center justify-center p-4 cursor-pointer" onClick={() => setSelectedGalleryImage(null)}>
          <img src={selectedGalleryImage} alt="Fullscreen" className="max-w-full max-h-[90vh] object-contain border-4 border-white" />
        </div>
      )}
    </div>
  );
}
