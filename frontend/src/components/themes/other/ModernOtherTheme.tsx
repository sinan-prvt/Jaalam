import React, { useState } from 'react';
import { MapPin, Phone, Mail, Clock } from 'lucide-react';
import { Facebook, Instagram, Twitter, Youtube, WhatsApp } from '../scrap/SocialIcons';

export default function ModernOtherTheme({ website, content }: any) {
  const [selectedGalleryImage, setSelectedGalleryImage] = useState<string | null>(null);

  const sectionOrder: string[] = content?.settings_json?.section_order || ['hero', 'about', 'services', 'menu', 'gallery', 'contact', 'custom'];
  const hiddenSections: string[] = content?.settings_json?.hidden_sections || [];
  const siteName = content.settings_json?.website_name || website.slug || 'My Business';

  const services = content.services_json?.length > 0 ? content.services_json : [
    { title: 'Quality Service', description: 'We provide top-notch quality that exceeds expectations.' },
    { title: 'Expert Team', description: 'Our professionals are highly trained and experienced.' },
    { title: 'Customer First', description: 'Your satisfaction is our primary goal and motivation.' }
  ];

  const menuItems = content.products_json?.length > 0 ? content.products_json : [
    { name: 'Standard Package', price: '$99', description: 'Perfect for getting started with all essential features.' },
    { name: 'Premium Package', price: '$199', description: 'Advanced features for growing your business.' },
    { name: 'Enterprise Solution', price: 'Custom', description: 'Tailored solutions for large scale operations.' }
  ];

  return (
    <div className="min-h-screen theme-root flex flex-col bg-slate-50 text-slate-800 font-sans">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;import ProductBuyButton from '../../payments/ProductBuyButton';
400;500;600;700;800&display=swap');
        .font-modern { font-family: 'Outfit', sans-serif; }
      
        /* Dynamic Layout Ordering */
        .theme-root { display: flex; flex-direction: column; }
        .theme-root > header, .theme-root > nav { order: 0; }
        .theme-root > footer { order: 999; }
      `}</style>

      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md sticky top-0 z-50 border-b border-slate-200">
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            {content?.settings_json?.logo_image ? (
              <img loading="lazy" src={content.settings_json.logo_image} alt={siteName} className="h-10 w-auto object-contain" />
            ) : (
              <div className="w-10 h-10 bg-gradient-to-tr from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center text-white font-modern font-bold text-xl">
                {siteName.charAt(0)}
              </div>
            )}
            <span className="font-modern font-bold text-xl tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-slate-700">{siteName}</span>
          </div>
          <nav className="hidden md:flex gap-6 font-modern font-medium text-sm text-slate-600">
            <a href="#about" className="hover:text-blue-600 transition-colors">About</a>
            <a href="#services" className="hover:text-blue-600 transition-colors">Services</a>
            <a href="#contact" className="hover:text-blue-600 transition-colors">Contact</a>
          </nav>
        </div>
      </header>

      {/* Hero */}
      <section style={{ order: sectionOrder.indexOf('hero') + 1, display: hiddenSections.includes('hero') ? 'none' : 'flex' }} className="relative min-h-[85vh] flex items-center pt-10 pb-24 px-6 overflow-hidden bg-white">
        <div className="absolute top-[-20%] left-[-10%] w-[50vw] h-[50vw] bg-blue-100 rounded-full mix-blend-multiply filter blur-[100px] opacity-70"></div>
        <div className="absolute bottom-[-20%] right-[-10%] w-[40vw] h-[40vw] bg-indigo-100 rounded-full mix-blend-multiply filter blur-[100px] opacity-70"></div>
        
        <div className="container mx-auto max-w-6xl relative z-10 flex flex-col lg:flex-row items-center gap-12">
          <div className="w-full lg:w-1/2 text-center lg:text-left">
            <h1 className="font-modern text-5xl md:text-7xl font-extrabold mb-6 leading-[1.1] tracking-tight text-slate-900">
              {content.hero_title || 'Welcome to our business'}
            </h1>
            <p className="font-modern text-lg md:text-xl text-slate-600 mb-10 max-w-lg mx-auto lg:mx-0 leading-relaxed">
              {content.hero_text || 'We provide exceptional products and services designed to help you succeed.'}
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
              <a href="#contact" className="w-full sm:w-auto bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-modern font-semibold py-4 px-8 rounded-full shadow-lg shadow-blue-600/30 hover:shadow-xl hover:shadow-blue-600/40 hover:-translate-y-1 transition-all">
                Get Started
              </a>
              <a href="#about" className="w-full sm:w-auto bg-white border border-slate-200 text-slate-700 font-modern font-semibold py-4 px-8 rounded-full hover:bg-slate-50 transition-all">
                Learn More
              </a>
            </div>
          </div>
          <div className="w-full lg:w-1/2">
            <div className="relative rounded-3xl overflow-hidden shadow-2xl border border-slate-100 bg-white">
              <img loading="lazy" src="https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=800&q=80" alt="Hero" className="w-full aspect-video object-cover" />
            </div>
          </div>
        </div>
      </section>

      {/* About */}
      {sectionOrder.includes('about') && !hiddenSections.includes('about') && (
        <section style={{ order: sectionOrder.indexOf('about') + 1 }} id="about" className="py-24 px-6 bg-slate-50">
          <div className="container mx-auto max-w-5xl">
            <div className="flex flex-col md:flex-row gap-12 items-center">
              <div className="w-full md:w-1/2">
                <h2 className="font-modern text-4xl font-bold mb-6 text-slate-900 tracking-tight">
                  {content.settings_json?.about_title || content.about_title || 'About Us'}
                </h2>
                <div className="w-16 h-1.5 bg-blue-600 rounded-full mb-8"></div>
                <p className="font-modern text-lg text-slate-600 leading-relaxed">
                  {content.about_text || 'We are dedicated to delivering the best experience for our customers. Our journey started with a simple idea and has grown into a passion for excellence. We believe in innovation, quality, and putting our clients first in everything we do.'}
                </p>
              </div>
              <div className="w-full md:w-1/2 grid grid-cols-2 gap-4">
                <img loading="lazy" src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=600&q=80" alt="About 1" className="rounded-2xl h-48 w-full object-cover shadow-md" />
                <img loading="lazy" src="https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=600&q=80" alt="About 2" className="rounded-2xl h-48 w-full object-cover shadow-md mt-8" />
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Services */}
      {sectionOrder.includes('services') && !hiddenSections.includes('services') && (
        <section style={{ order: sectionOrder.indexOf('services') + 1 }} id="services" className="py-24 px-6 bg-white">
          <div className="container mx-auto max-w-6xl">
            <div className="text-center mb-16">
              <h2 className="font-modern text-4xl font-bold mb-4 text-slate-900 tracking-tight">Our Services</h2>
              <p className="font-modern text-slate-500 max-w-2xl mx-auto text-lg">What we bring to the table</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {services.map((srv: any, i: number) => (
                <div key={i} className="bg-slate-50 rounded-3xl p-8 border border-slate-100 hover:border-blue-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                  {srv.image && <img loading="lazy" src={srv.image} alt={srv.title} className="w-16 h-16 object-cover rounded-xl mb-6 shadow-sm" />}
                  <h3 className="font-modern text-2xl font-bold mb-4 text-slate-800">{srv.title}</h3>
                  <p className="font-modern text-slate-600 leading-relaxed">{srv.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Menu / Pricing / Products */}
      {sectionOrder.includes('menu') && !hiddenSections.includes('menu') && (
        <section style={{ order: sectionOrder.indexOf('menu') + 1 }} id="menu" className="py-24 px-6 bg-slate-50">
          <div className="container mx-auto max-w-5xl">
            <div className="text-center mb-16">
              <h2 className="font-modern text-4xl font-bold mb-4 text-slate-900 tracking-tight">Offerings</h2>
              <p className="font-modern text-slate-500 max-w-2xl mx-auto text-lg">Choose what works best for you</p>
            </div>
            <div className="space-y-4">
              {menuItems.map((item: any, i: number) => (
                <div key={i} className="bg-white p-6 md:p-8 rounded-3xl border border-slate-100 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 shadow-sm hover:shadow-md transition-shadow">
                  {item.image && <img loading="lazy" src={item.image} alt={item.name} className="w-24 h-24 object-cover rounded-2xl" />}
                  <div className="flex-1">
                    <h3 className="font-modern text-xl font-bold text-slate-900 mb-2">{item.name}</h3>
                    <p className="font-modern text-slate-600">{item.description}</p>
                  </div>
                  <div className="font-modern text-2xl font-black text-blue-600 bg-blue-50 px-6 py-2 rounded-full">
                    {item.price}
                  </div>
<div className="mt-2 w-full" onClick={(e) => e.stopPropagation()}><ProductBuyButton product={item} content={content} /></div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Gallery */}
      {sectionOrder.includes('gallery') && !hiddenSections.includes('gallery') && (
        <section style={{ order: sectionOrder.indexOf('gallery') + 1 }} id="gallery" className="py-24 px-6 bg-white">
          <div className="container mx-auto max-w-6xl">
            <h2 className="font-modern text-4xl font-bold mb-12 text-center text-slate-900 tracking-tight">Gallery</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {(content.gallery_json?.length > 0 ? content.gallery_json : [
                "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?auto=format&fit=crop&w=800&q=80",
                "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=800&q=80",
                "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=800&q=80",
                "https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=800&q=80"
              ]).map((img: string, i: number) => (
                <div key={i} className="aspect-square rounded-3xl overflow-hidden cursor-pointer group" onClick={() => setSelectedGalleryImage(img)}>
                  <img loading="lazy" src={img} alt={`Gallery ${i}`} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Custom Blocks */}
      {sectionOrder.includes('custom') && !hiddenSections.includes('custom') && content.custom_blocks_json?.length > 0 && (
        <section style={{ order: sectionOrder.indexOf('custom') + 1 }} className="py-24 px-6 bg-slate-50">
          <div className="container mx-auto max-w-4xl space-y-16">
            {content.custom_blocks_json.map((block: any, i: number) => (
              <div key={i} className="bg-white p-8 md:p-12 rounded-3xl shadow-sm border border-slate-100 text-center">
                <h2 className="font-modern text-3xl font-bold mb-6 text-slate-900 tracking-tight">{block.title}</h2>
                <div className="prose prose-slate prose-lg max-w-none font-modern text-slate-600 leading-relaxed" dangerouslySetInnerHTML={{ __html: block.content }} />
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Contact */}
      {sectionOrder.includes('contact') && !hiddenSections.includes('contact') && (
        <section style={{ order: sectionOrder.indexOf('contact') + 1 }} id="contact" className="py-24 px-6 bg-slate-900 text-white">
          <div className="container mx-auto max-w-6xl">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
              <div>
                <h2 className="font-modern text-4xl md:text-5xl font-bold mb-6 tracking-tight">Get in Touch</h2>
                <p className="font-modern text-slate-400 text-lg mb-10 leading-relaxed">
                  Have questions or want to work together? We'd love to hear from you. Reach out to us using the contact details below.
                </p>
                <div className="space-y-6 font-modern">
                  <div className="flex items-center gap-4 text-slate-300">
                    <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center text-blue-400">
                      <Phone size={20} />
                    </div>
                    <div>
                      <div className="text-sm text-slate-500 uppercase tracking-wider font-semibold mb-1">Phone</div>
                      <div className="text-lg">{content.contact_info?.phone || '+1 (555) 123-4567'}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 text-slate-300">
                    <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center text-blue-400">
                      <Mail size={20} />
                    </div>
                    <div>
                      <div className="text-sm text-slate-500 uppercase tracking-wider font-semibold mb-1">Email</div>
                      <div className="text-lg">{content.contact_info?.email || 'hello@example.com'}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 text-slate-300">
                    <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center text-blue-400">
                      <MapPin size={20} />
                    </div>
                    <div>
                      <div className="text-sm text-slate-500 uppercase tracking-wider font-semibold mb-1">Location</div>
                      <div className="text-lg">{content.contact_info?.address || '123 Business Ave, Suite 100'}</div>
                    </div>
                  </div>
                  {content.contact_info?.hours && (
                    <div className="flex items-center gap-4 text-slate-300">
                      <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center text-blue-400">
                        <Clock size={20} />
                      </div>
                      <div>
                        <div className="text-sm text-slate-500 uppercase tracking-wider font-semibold mb-1">Hours</div>
                        <div className="text-lg">{content.contact_info.hours}</div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
              <div>
                <div className="bg-white/5 p-8 rounded-3xl border border-white/10">
                  <h3 className="font-modern text-2xl font-bold mb-6">Social Presence</h3>
                  <div className="flex gap-4">
                    {content.contact_info?.facebook && <a href={content.contact_info.facebook} target="_blank" rel="noreferrer" className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center hover:bg-blue-600 transition-colors"><Facebook size={20} /></a>}
                    {content.contact_info?.instagram && <a href={content.contact_info.instagram} target="_blank" rel="noreferrer" className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center hover:bg-pink-600 transition-colors"><Instagram size={20} /></a>}
                    {content.contact_info?.twitter && <a href={content.contact_info.twitter} target="_blank" rel="noreferrer" className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center hover:bg-sky-500 transition-colors"><Twitter size={20} /></a>}
                    {content.contact_info?.youtube && <a href={content.contact_info.youtube} target="_blank" rel="noreferrer" className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center hover:bg-red-600 transition-colors"><Youtube size={20} /></a>}
                    {content.contact_info?.whatsapp && <a href={content.contact_info.whatsapp} target="_blank" rel="noreferrer" className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center hover:bg-green-500 transition-colors"><WhatsApp size={20} /></a>}
                    
                    {/* Fallback if no socials */}
                    {!content.contact_info?.facebook && !content.contact_info?.instagram && !content.contact_info?.twitter && !content.contact_info?.youtube && !content.contact_info?.whatsapp && (
                      <div className="text-slate-400 font-modern">Connect with us on our social platforms to stay updated!</div>
                    )}
                  </div>
                  
                  {/* Google Maps iframe if address exists */}
                  <div className="mt-8 rounded-2xl overflow-hidden h-48 bg-white/10 relative">
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
          </div>
        </section>
      )}

      {/* Footer */}
      <footer className="py-8 text-center bg-slate-950 text-slate-500 font-modern border-t border-white/5">
        <p>&copy; {new Date().getFullYear()} {siteName}. All rights reserved.</p>
      </footer>

      {/* Gallery Modal */}
      {selectedGalleryImage && (
        <div className="fixed inset-0 z-[100] bg-black/90 flex items-center justify-center p-4 cursor-pointer" onClick={() => setSelectedGalleryImage(null)}>
          <img loading="lazy" src={selectedGalleryImage} alt="Fullscreen" className="max-w-full max-h-full rounded-lg" />
        </div>
      )}
    </div>
  );
}
