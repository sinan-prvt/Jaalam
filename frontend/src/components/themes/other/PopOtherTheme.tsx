import React, { useState } from 'react';
import { MapPin, Phone, Mail, Clock, Star, Sparkles } from 'lucide-react';
import { Facebook, Instagram, Twitter, Youtube, WhatsApp } from '../scrap/SocialIcons';

export default function PopOtherTheme({ website, content }: any) {
  const [selectedGalleryImage, setSelectedGalleryImage] = useState<string | null>(null);

  const sectionOrder: string[] = content?.settings_json?.section_order || ['hero', 'about', 'services', 'menu', 'gallery', 'contact', 'custom'];
  const hiddenSections: string[] = content?.settings_json?.hidden_sections || [];
  const siteName = content.settings_json?.website_name || website.slug || 'Pop!';

  const services = content.services_json?.length > 0 ? content.services_json : [
    { title: 'Super Fun', description: 'Everything we do is designed to bring a smile to your face.' },
    { title: 'Bold Ideas', description: 'We don\'t do boring. We do exciting, fresh, and new.' },
    { title: 'Happy Clients', description: 'Our number one goal is making sure you are absolutely thrilled.' }
  ];

  const menuItems = content.products_json?.length > 0 ? content.products_json : [
    { name: 'The Cool Option', price: '$20', description: 'A great place to start your journey with us.' },
    { name: 'The Awesome Option', price: '$50', description: 'Step it up with more features and more fun.' },
    { name: 'The Epic Option', price: '$100', description: 'Go all out. You deserve the absolute best.' }
  ];

  return (
    <div className="min-h-screen theme-root flex flex-col bg-[#FFF5F5] text-[#2D3748] font-sans selection:bg-[#FF4D4D] selection:text-white">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fredoka:wght@400;500;600;700&family=Nunito:wght@400;600;700;800&display=swap');
        .font-pop-title { font-family: 'Fredoka', sans-serif; }
        .font-pop-body { font-family: 'Nunito', sans-serif; }
      
        /* Dynamic Layout Ordering */
        .theme-root { display: flex; flex-direction: column; }
        .theme-root > header, .theme-root > nav { order: 0; }
        .theme-root > footer { order: 999; }
      `}</style>

      {/* Header */}
      <header className="bg-white border-b-4 border-[#2D3748] sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-4">
            {content?.settings_json?.logo_image ? (
              <img loading="lazy" src={content.settings_json.logo_image} alt={siteName} className="h-12 w-auto object-contain" />
            ) : (
              <div className="font-pop-title font-bold text-3xl tracking-tight text-[#FF4D4D] drop-shadow-sm">
                {siteName}
              </div>
            )}
          </div>
          <nav className="hidden md:flex gap-6 font-pop-title text-lg font-semibold text-[#2D3748]">
            <a href="#about" className="hover:text-[#FF4D4D] hover:-translate-y-1 transition-transform">About</a>
            <a href="#services" className="hover:text-[#FF4D4D] hover:-translate-y-1 transition-transform">Services</a>
            <a href="#contact" className="hover:text-[#FF4D4D] hover:-translate-y-1 transition-transform">Contact</a>
          </nav>
        </div>
      </header>

      {/* Hero */}
      <section style={{ order: sectionOrder.indexOf('hero') + 1, display: hiddenSections.includes('hero') ? 'none' : 'flex' }} className="relative min-h-[85vh] flex items-center py-20 px-6 overflow-hidden bg-[#FF4D4D]">
        {/* Playful background shapes */}
        <div className="absolute top-10 left-10 w-32 h-32 bg-[#FFD700] rounded-full mix-blend-multiply opacity-50 animate-bounce"></div>
        <div className="absolute bottom-20 right-20 w-48 h-48 bg-[#4DB8FF] rounded-full mix-blend-multiply opacity-50 animate-pulse"></div>
        <div className="absolute top-40 right-1/4 w-24 h-24 bg-white rounded-full opacity-20"></div>
        
        <div className="container mx-auto max-w-6xl relative z-10 flex flex-col md:flex-row items-center gap-12">
          <div className="w-full md:w-1/2 text-center md:text-left">
            <div className="inline-flex items-center gap-2 bg-white px-4 py-2 rounded-full font-pop-title text-sm font-bold text-[#FF4D4D] mb-6 shadow-sm border-2 border-[#2D3748]">
              <Sparkles size={16} /> Welcome to the fun side!
            </div>
            <h1 className="font-pop-title text-5xl md:text-7xl font-bold mb-6 leading-tight text-white drop-shadow-md">
              {content.hero_title || 'Make it pop.'}
            </h1>
            <p className="font-pop-body text-xl text-white/90 mb-10 max-w-lg mx-auto md:mx-0 font-semibold">
              {content.hero_text || 'Bold, vibrant, and always exciting. Discover a new way to experience our amazing services.'}
            </p>
            <a href="#contact" className="inline-block bg-[#FFD700] text-[#2D3748] font-pop-title font-bold text-xl py-4 px-10 rounded-full border-4 border-[#2D3748] shadow-[8px_8px_0px_0px_rgba(45,55,72,1)] hover:shadow-[4px_4px_0px_0px_rgba(45,55,72,1)] hover:translate-x-1 hover:translate-y-1 transition-all">
              Let's Go!
            </a>
          </div>
          <div className="w-full md:w-1/2">
            <div className="relative rounded-3xl overflow-hidden border-8 border-white shadow-[12px_12px_0px_0px_rgba(45,55,72,1)] bg-white rotate-3 hover:rotate-0 transition-transform duration-300">
              <img loading="lazy" src="https://images.unsplash.com/photo-1518005020951-eccb494ad742?auto=format&fit=crop&w=800&q=80" alt="Hero" className="w-full aspect-square md:aspect-[4/3] object-cover" />
            </div>
          </div>
        </div>
      </section>

      {/* About */}
      {sectionOrder.includes('about') && !hiddenSections.includes('about') && (
        <section style={{ order: sectionOrder.indexOf('about') + 1 }} id="about" className="py-24 px-6 bg-[#4DB8FF] relative overflow-hidden border-y-4 border-[#2D3748]">
           {/* Decorative zigzags */}
           <div className="absolute -left-10 top-1/2 text-white/20 font-pop-title text-9xl font-black rotate-90">~~~</div>
           
          <div className="container mx-auto max-w-5xl relative z-10">
            <div className="bg-white rounded-[3rem] border-4 border-[#2D3748] shadow-[16px_16px_0px_0px_rgba(45,55,72,1)] p-8 md:p-16 text-center">
              <h2 className="font-pop-title text-5xl font-bold mb-8 text-[#FF4D4D]">
                {content.settings_json?.about_title || content.about_title || 'Who Are We?'}
              </h2>
              <p className="font-pop-body text-xl text-[#2D3748] leading-relaxed max-w-3xl mx-auto font-semibold">
                {content.about_text || 'We are a team of dreamers, creators, and fun-lovers. We believe that business doesn\'t have to be boring. Every interaction should be memorable, and every product should bring joy.'}
              </p>
            </div>
          </div>
        </section>
      )}

      {/* Services */}
      {sectionOrder.includes('services') && !hiddenSections.includes('services') && (
        <section style={{ order: sectionOrder.indexOf('services') + 1 }} id="services" className="py-24 px-6 bg-[#FFF5F5]">
          <div className="container mx-auto max-w-6xl">
            <div className="text-center mb-16">
              <h2 className="font-pop-title text-5xl font-bold mb-4 text-[#2D3748]">What We Do</h2>
              <p className="font-pop-body text-xl font-bold text-[#FF4D4D]">Our awesome services</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {services.map((srv: any, i: number) => {
                const colors = ['bg-[#FFD700]', 'bg-[#4DB8FF]', 'bg-[#FF4D4D]'];
                const textColors = ['text-[#2D3748]', 'text-white', 'text-white'];
                const color = colors[i % colors.length];
                const textColor = textColors[i % textColors.length];
                return (
                  <div key={i} className={`${color} ${textColor} rounded-3xl p-8 border-4 border-[#2D3748] shadow-[8px_8px_0px_0px_rgba(45,55,72,1)] hover:-translate-y-2 transition-transform duration-300`}>
                    <div className="w-16 h-16 bg-white border-2 border-[#2D3748] rounded-full flex items-center justify-center mb-6 shadow-sm">
                      <Star className="text-[#FFD700]" size={32} fill="#FFD700" />
                    </div>
                    <h3 className="font-pop-title text-3xl font-bold mb-4">{srv.title}</h3>
                    <p className="font-pop-body text-lg font-semibold">{srv.description}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* Menu / Pricing */}
      {sectionOrder.includes('menu') && !hiddenSections.includes('menu') && (
        <section style={{ order: sectionOrder.indexOf('menu') + 1 }} id="menu" className="py-24 px-6 bg-[#2D3748] text-white border-y-4 border-white">
          <div className="container mx-auto max-w-5xl">
            <div className="text-center mb-16">
              <h2 className="font-pop-title text-5xl font-bold mb-4 text-[#FFD700]">Pick Your Flavor</h2>
              <p className="font-pop-body text-xl font-bold text-white/80">Options for everyone</p>
            </div>
            <div className="space-y-6">
              {menuItems.map((item: any, i: number) => (
                <div key={i} className="bg-white text-[#2D3748] p-6 md:p-8 rounded-3xl flex flex-col md:flex-row justify-between items-center gap-6 border-4 border-[#FFD700] hover:scale-[1.02] transition-transform">
                  <div className="flex-1 text-center md:text-left">
                    <h3 className="font-pop-title text-2xl font-bold text-[#FF4D4D] mb-2">{item.name}</h3>
                    <p className="font-pop-body text-lg font-semibold text-gray-600">{item.description}</p>
                  </div>
                  <div className="font-pop-title text-4xl font-black text-[#2D3748] bg-[#FFD700] px-8 py-3 rounded-full border-4 border-[#2D3748] shadow-[4px_4px_0px_0px_rgba(45,55,72,1)] rotate-2">
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
        <section style={{ order: sectionOrder.indexOf('gallery') + 1 }} id="gallery" className="py-24 px-6 bg-[#FFF5F5]">
          <div className="container mx-auto max-w-6xl">
            <h2 className="font-pop-title text-5xl font-bold mb-12 text-center text-[#2D3748]">Peek Inside!</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {(content.gallery_json?.length > 0 ? content.gallery_json : [
                "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=800&q=80",
                "https://images.unsplash.com/photo-1518005020951-eccb494ad742?auto=format&fit=crop&w=800&q=80",
                "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?auto=format&fit=crop&w=800&q=80",
                "https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=800&q=80"
              ]).map((img: string, i: number) => {
                const rotations = ['-rotate-3', 'rotate-2', '-rotate-2', 'rotate-3'];
                const rot = rotations[i % rotations.length];
                return (
                  <div key={i} className={`aspect-square overflow-hidden cursor-pointer rounded-2xl border-4 border-[#2D3748] shadow-[6px_6px_0px_0px_rgba(45,55,72,1)] ${rot} hover:rotate-0 hover:z-10 transition-transform`} onClick={() => setSelectedGalleryImage(img)}>
                    <img loading="lazy" src={img} alt={`Gallery ${i}`} className="w-full h-full object-cover" />
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* Custom Blocks */}
      {sectionOrder.includes('custom') && !hiddenSections.includes('custom') && content.custom_blocks_json?.length > 0 && (
        <section style={{ order: sectionOrder.indexOf('custom') + 1 }} className="py-24 px-6 bg-[#FFD700] border-y-4 border-[#2D3748]">
          <div className="container mx-auto max-w-4xl space-y-12">
            {content.custom_blocks_json.map((block: any, i: number) => (
              <div key={i} className="bg-white p-8 md:p-12 rounded-3xl border-4 border-[#2D3748] shadow-[10px_10px_0px_0px_rgba(45,55,72,1)] text-center">
                <h2 className="font-pop-title text-4xl font-bold mb-6 text-[#FF4D4D]">{block.title}</h2>
                <div className="prose prose-lg max-w-none font-pop-body font-semibold text-[#2D3748]" dangerouslySetInnerHTML={{ __html: block.content }} />
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Contact */}
      {sectionOrder.includes('contact') && !hiddenSections.includes('contact') && (
        <section style={{ order: sectionOrder.indexOf('contact') + 1 }} id="contact" className="py-24 px-6 bg-white border-t-4 border-[#2D3748]">
          <div className="container mx-auto max-w-6xl">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-16 bg-[#FFF5F5] rounded-[3rem] border-4 border-[#2D3748] shadow-[16px_16px_0px_0px_rgba(45,55,72,1)] overflow-hidden">
              <div className="p-10 md:p-16">
                <h2 className="font-pop-title text-5xl font-bold mb-8 text-[#FF4D4D]">Holla at us!</h2>
                
                <div className="space-y-6 font-pop-body font-bold text-lg text-[#2D3748]">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-[#4DB8FF] rounded-xl border-2 border-[#2D3748] flex items-center justify-center text-white -rotate-3">
                      <MapPin size={24} />
                    </div>
                    <div>{content.contact_info?.address || '123 Fun Street, Play City'}</div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-[#FFD700] rounded-xl border-2 border-[#2D3748] flex items-center justify-center text-[#2D3748] rotate-2">
                      <Phone size={24} />
                    </div>
                    <div>{content.contact_info?.phone || '1-800-AWESOME'}</div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-[#FF4D4D] rounded-xl border-2 border-[#2D3748] flex items-center justify-center text-white -rotate-2">
                      <Mail size={24} />
                    </div>
                    <div>{content.contact_info?.email || 'hello@awesome.com'}</div>
                  </div>
                  {content.contact_info?.hours && (
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-white rounded-xl border-2 border-[#2D3748] flex items-center justify-center text-[#2D3748] rotate-3">
                        <Clock size={24} />
                      </div>
                      <div>{content.contact_info.hours}</div>
                    </div>
                  )}
                </div>

                <div className="mt-12">
                   <h3 className="font-pop-title text-2xl font-bold mb-4 text-[#2D3748]">Find us on the interwebs</h3>
                   <div className="flex gap-4">
                     {content.contact_info?.facebook && <a href={content.contact_info.facebook} target="_blank" rel="noreferrer" className="w-12 h-12 bg-[#1877F2] text-white rounded-xl border-2 border-[#2D3748] flex items-center justify-center hover:-translate-y-2 transition-transform"><Facebook size={24} /></a>}
                     {content.contact_info?.instagram && <a href={content.contact_info.instagram} target="_blank" rel="noreferrer" className="w-12 h-12 bg-[#E4405F] text-white rounded-xl border-2 border-[#2D3748] flex items-center justify-center hover:-translate-y-2 transition-transform"><Instagram size={24} /></a>}
                     {content.contact_info?.twitter && <a href={content.contact_info.twitter} target="_blank" rel="noreferrer" className="w-12 h-12 bg-[#1DA1F2] text-white rounded-xl border-2 border-[#2D3748] flex items-center justify-center hover:-translate-y-2 transition-transform"><Twitter size={24} /></a>}
                     {content.contact_info?.youtube && <a href={content.contact_info.youtube} target="_blank" rel="noreferrer" className="w-12 h-12 bg-[#FF0000] text-white rounded-xl border-2 border-[#2D3748] flex items-center justify-center hover:-translate-y-2 transition-transform"><Youtube size={24} /></a>}
                     {content.contact_info?.whatsapp && <a href={content.contact_info.whatsapp} target="_blank" rel="noreferrer" className="w-12 h-12 bg-[#25D366] text-white rounded-xl border-2 border-[#2D3748] flex items-center justify-center hover:-translate-y-2 transition-transform"><WhatsApp size={24} /></a>}
                   </div>
                </div>
              </div>
              
              <div className="h-full min-h-[300px] border-l-4 border-[#2D3748]">
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
        </section>
      )}

      {/* Footer */}
      <footer className="py-10 text-center bg-[#2D3748] text-white font-pop-title text-lg border-t-4 border-[#FF4D4D]">
        <p>Made with ❤️ and lots of coffee.</p>
        <p className="mt-2 text-sm opacity-80">&copy; {new Date().getFullYear()} {siteName}. All rights reserved.</p>
      </footer>

      {/* Gallery Modal */}
      {selectedGalleryImage && (
        <div className="fixed inset-0 z-[100] bg-[#2D3748]/90 backdrop-blur-sm flex items-center justify-center p-4 cursor-pointer" onClick={() => setSelectedGalleryImage(null)}>
          <img loading="lazy" src={selectedGalleryImage} alt="Fullscreen" className="max-w-full max-h-[90vh] rounded-3xl border-8 border-white shadow-[12px_12px_0px_0px_rgba(255,77,77,1)]" />
        </div>
      )}
    </div>
  );
}
