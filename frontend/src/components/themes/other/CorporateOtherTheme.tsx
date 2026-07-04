import React, { useState } from 'react';
import { MapPin, Phone, Mail, Clock, ArrowRight, CheckCircle, Briefcase, BarChart, Users } from 'lucide-react';
import { Facebook, Instagram, Twitter, Youtube, WhatsApp } from '../scrap/SocialIcons';

export default function CorporateOtherTheme({ website, content }: any) {
  const [selectedGalleryImage, setSelectedGalleryImage] = useState<string | null>(null);

  const sectionOrder: string[] = content?.settings_json?.section_order || ['hero', 'about', 'services', 'menu', 'gallery', 'contact', 'custom'];
  const hiddenSections: string[] = content?.settings_json?.hidden_sections || [];
  const siteName = content.settings_json?.website_name || website.slug || 'Corporate Solutions';

  const services = content.services_json?.length > 0 ? content.services_json : [
    { title: 'Strategic Planning', description: 'Comprehensive strategies to drive growth and efficiency.', icon: <BarChart className="w-10 h-10 text-[#0056b3]" /> },
    { title: 'Professional Consultation', description: 'Expert advice tailored to your specific industry needs.', icon: <Briefcase className="w-10 h-10 text-[#0056b3]" /> },
    { title: 'Team Development', description: 'Building cohesive, high-performing teams for success.', icon: <Users className="w-10 h-10 text-[#0056b3]" /> }
  ];

  const menuItems = content.products_json?.length > 0 ? content.products_json : [
    { name: 'Starter Tier', price: '$499/mo', description: 'Essential features for small teams.' },
    { name: 'Professional Tier', price: '$999/mo', description: 'Advanced tools for growing organizations.' },
    { name: 'Enterprise Tier', price: 'Custom', description: 'Comprehensive solutions for large corporations.' }
  ];

  return (
    <div className="min-h-screen theme-root flex flex-col bg-[#f4f7f6] text-[#333333] font-sans selection:bg-[#0056b3] selection:text-white">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;500;700&family=Merriweather:wght@300;400;700&display=swap');
        .font-corp-heading { font-family: 'Merriweather', serif; }
        .font-corp-body { font-family: 'Roboto', sans-serif; }
      
        /* Dynamic Layout Ordering */
        .theme-root { display: flex; flex-direction: column; }
        .theme-root > header, .theme-root > nav { order: 0; }
        .theme-root > footer { order: 999; }
      `}</style>

      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="bg-[#0056b3] text-white py-2 px-6 hidden md:block">
           <div className="container mx-auto flex justify-between items-center text-sm font-corp-body">
              <div className="flex gap-6">
                 <span className="flex items-center gap-2"><Phone size={14}/> {content.contact_info?.phone || '1-800-BUSINESS'}</span>
                 <span className="flex items-center gap-2"><Mail size={14}/> {content.contact_info?.email || 'info@corporate.com'}</span>
              </div>
              <div className="flex gap-4">
                 {content.contact_info?.linkedin && <a href={content.contact_info.linkedin} className="hover:text-gray-300">LinkedIn</a>}
                 {content.contact_info?.twitter && <a href={content.contact_info.twitter} className="hover:text-gray-300">Twitter</a>}
              </div>
           </div>
        </div>
        <div className="container mx-auto px-6 py-5 flex justify-between items-center">
          <div className="flex items-center gap-4">
            {content?.settings_json?.logo_image ? (
              <img src={content.settings_json.logo_image} alt={siteName} className="h-10 w-auto object-contain" />
            ) : (
              <div className="font-corp-heading font-bold text-2xl text-[#0056b3] flex items-center gap-2">
                <div className="w-8 h-8 bg-[#0056b3] text-white flex items-center justify-center rounded-sm text-lg">C</div>
                {siteName}
              </div>
            )}
          </div>
          <nav className="hidden md:flex gap-8 font-corp-body text-[15px] font-medium text-[#555]">
            <a href="#about" className="hover:text-[#0056b3] transition-colors">Company</a>
            <a href="#services" className="hover:text-[#0056b3] transition-colors">Services</a>
            <a href="#contact" className="hover:text-[#0056b3] transition-colors">Contact</a>
          </nav>
        </div>
      </header>

      {/* Hero */}
      <section style={{ order: sectionOrder.indexOf('hero') + 1, display: hiddenSections.includes('hero') ? 'none' : 'flex' }} className="relative bg-[#003366] text-white">
        <div className="absolute inset-0 z-0">
           <img src="https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1600&q=80" alt="Corporate" className="w-full h-full object-cover opacity-20" />
           <div className="absolute inset-0 bg-gradient-to-r from-[#003366] via-[#003366]/90 to-transparent"></div>
        </div>
        <div className="container mx-auto max-w-6xl relative z-10 py-32 px-6 flex items-center">
          <div className="max-w-2xl">
            <h1 className="font-corp-heading text-4xl md:text-6xl font-bold mb-6 leading-tight">
              {content.hero_title || 'Empowering Your Business For The Future.'}
            </h1>
            <p className="font-corp-body text-lg text-gray-300 mb-10 leading-relaxed max-w-xl">
              {content.hero_text || 'We provide robust, scalable solutions tailored to meet the complex demands of modern enterprises.'}
            </p>
            <div className="flex gap-4">
               <a href="#services" className="bg-[#0056b3] hover:bg-[#004494] text-white font-corp-body font-medium py-3 px-8 rounded transition-colors flex items-center gap-2">
                 Our Solutions <ArrowRight size={18} />
               </a>
               <a href="#contact" className="bg-transparent border border-white hover:bg-white hover:text-[#003366] text-white font-corp-body font-medium py-3 px-8 rounded transition-colors">
                 Get in Touch
               </a>
            </div>
          </div>
        </div>
      </section>

      {/* About */}
      {sectionOrder.includes('about') && !hiddenSections.includes('about') && (
        <section style={{ order: sectionOrder.indexOf('about') + 1 }} id="about" className="py-24 px-6 bg-white">
          <div className="container mx-auto max-w-6xl">
            <div className="flex flex-col md:flex-row gap-16 items-center">
              <div className="w-full md:w-1/2">
                <img src="https://images.unsplash.com/photo-1556761175-5973dc0f32e7?auto=format&fit=crop&w=800&q=80" alt="About Us" className="rounded-lg shadow-xl" />
              </div>
              <div className="w-full md:w-1/2">
                <div className="text-[#0056b3] font-corp-body font-bold text-sm tracking-wider uppercase mb-2">Company Overview</div>
                <h2 className="font-corp-heading text-3xl md:text-4xl font-bold mb-6 text-[#222]">
                  {content.settings_json?.about_title || content.about_title || 'Trusted Partner in Growth'}
                </h2>
                <div className="w-20 h-1 bg-[#0056b3] mb-8"></div>
                <p className="font-corp-body text-gray-600 leading-relaxed mb-8">
                  {content.about_text || 'With years of industry expertise, we deliver exceptional value to our clients through innovative strategies and dedicated execution. We understand the nuances of the corporate landscape and are committed to driving measurable results.'}
                </p>
                <ul className="space-y-4 font-corp-body text-gray-700">
                   <li className="flex items-start gap-3"><CheckCircle className="text-[#0056b3] mt-1 shrink-0" size={20} /> Proven Track Record of Success</li>
                   <li className="flex items-start gap-3"><CheckCircle className="text-[#0056b3] mt-1 shrink-0" size={20} /> Dedicated Team of Industry Experts</li>
                   <li className="flex items-start gap-3"><CheckCircle className="text-[#0056b3] mt-1 shrink-0" size={20} /> Commitment to Operational Excellence</li>
                </ul>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Services */}
      {sectionOrder.includes('services') && !hiddenSections.includes('services') && (
        <section style={{ order: sectionOrder.indexOf('services') + 1 }} id="services" className="py-24 px-6 bg-[#f4f7f6]">
          <div className="container mx-auto max-w-6xl">
            <div className="text-center mb-16">
              <div className="text-[#0056b3] font-corp-body font-bold text-sm tracking-wider uppercase mb-2">Capabilities</div>
              <h2 className="font-corp-heading text-3xl md:text-4xl font-bold mb-6 text-[#222]">Areas of Expertise</h2>
              <div className="w-20 h-1 bg-[#0056b3] mx-auto"></div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {services.map((srv: any, i: number) => (
                <div key={i} className="bg-white p-10 rounded-lg shadow-md hover:shadow-xl transition-shadow border-t-4 border-transparent hover:border-[#0056b3]">
                  <div className="mb-6 bg-[#f4f7f6] w-16 h-16 rounded-full flex items-center justify-center">
                     {srv.icon || <Briefcase className="w-8 h-8 text-[#0056b3]" />}
                  </div>
                  <h3 className="font-corp-heading text-xl font-bold mb-4 text-[#222]">{srv.title}</h3>
                  <p className="font-corp-body text-gray-600 leading-relaxed">{srv.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Menu / Pricing */}
      {sectionOrder.includes('menu') && !hiddenSections.includes('menu') && (
        <section style={{ order: sectionOrder.indexOf('menu') + 1 }} id="menu" className="py-24 px-6 bg-white border-y border-gray-200">
          <div className="container mx-auto max-w-5xl">
            <div className="text-center mb-16">
              <h2 className="font-corp-heading text-3xl md:text-4xl font-bold mb-6 text-[#222]">Service Tiers</h2>
              <div className="w-20 h-1 bg-[#0056b3] mx-auto"></div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {menuItems.map((item: any, i: number) => (
                <div key={i} className={`border ${i === 1 ? 'border-[#0056b3] shadow-lg relative' : 'border-gray-200 shadow-sm'} rounded-lg p-8 text-center flex flex-col`}>
                  {i === 1 && <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-[#0056b3] text-white text-xs font-bold uppercase tracking-wider py-1 px-4 rounded-full">Recommended</div>}
                  <h3 className="font-corp-heading text-xl font-bold mb-2 text-[#222]">{item.name}</h3>
                  <div className="font-corp-body text-3xl font-bold text-[#0056b3] mb-6">{item.price}</div>
                  <p className="font-corp-body text-gray-600 mb-8 flex-1">{item.description}</p>
                  <button className={`w-full py-3 rounded font-medium transition-colors ${i === 1 ? 'bg-[#0056b3] text-white hover:bg-[#004494]' : 'bg-gray-100 text-gray-800 hover:bg-gray-200'}`}>
                    Select Plan
                  </button>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Gallery */}
      {sectionOrder.includes('gallery') && !hiddenSections.includes('gallery') && (
        <section style={{ order: sectionOrder.indexOf('gallery') + 1 }} id="gallery" className="py-24 px-6 bg-[#f4f7f6]">
          <div className="container mx-auto max-w-6xl">
            <div className="mb-12 flex justify-between items-end">
               <div>
                  <h2 className="font-corp-heading text-3xl font-bold mb-4 text-[#222]">Corporate Gallery</h2>
                  <div className="w-20 h-1 bg-[#0056b3]"></div>
               </div>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {(content.gallery_json?.length > 0 ? content.gallery_json : [
                "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=800&q=80",
                "https://images.unsplash.com/photo-1556761175-5973dc0f32e7?auto=format&fit=crop&w=800&q=80",
                "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?auto=format&fit=crop&w=800&q=80",
                "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=800&q=80"
              ]).map((img: string, i: number) => (
                <div key={i} className="aspect-[4/3] overflow-hidden rounded group cursor-pointer" onClick={() => setSelectedGalleryImage(img)}>
                  <img src={img} alt={`Gallery ${i}`} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Custom Blocks */}
      {sectionOrder.includes('custom') && !hiddenSections.includes('custom') && content.custom_blocks_json?.length > 0 && (
        <section style={{ order: sectionOrder.indexOf('custom') + 1 }} className="py-24 px-6 bg-white">
          <div className="container mx-auto max-w-4xl space-y-16">
            {content.custom_blocks_json.map((block: any, i: number) => (
              <div key={i} className="bg-gray-50 p-10 rounded-lg border border-gray-200">
                <h2 className="font-corp-heading text-2xl font-bold mb-6 text-[#222]">{block.title}</h2>
                <div className="prose prose-blue max-w-none font-corp-body text-gray-700" dangerouslySetInnerHTML={{ __html: block.content }} />
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Contact */}
      {sectionOrder.includes('contact') && !hiddenSections.includes('contact') && (
        <section style={{ order: sectionOrder.indexOf('contact') + 1 }} id="contact" className="py-24 px-6 bg-[#003366] text-white">
          <div className="container mx-auto max-w-6xl">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
              <div>
                <h2 className="font-corp-heading text-3xl font-bold mb-6">Contact Us</h2>
                <div className="w-20 h-1 bg-[#4DA6FF] mb-10"></div>
                <p className="font-corp-body text-gray-300 mb-10 leading-relaxed">
                  Ready to elevate your business? Contact our team of experts today to discuss how we can help you achieve your corporate objectives.
                </p>
                
                <div className="space-y-6 font-corp-body">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-white/10 rounded flex items-center justify-center text-[#4DA6FF]">
                      <MapPin size={20} />
                    </div>
                    <div>
                      <div className="text-xs text-gray-400 uppercase tracking-wider mb-1">Headquarters</div>
                      <div>{content.contact_info?.address || '100 Corporate Parkway, Business District'}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-white/10 rounded flex items-center justify-center text-[#4DA6FF]">
                      <Phone size={20} />
                    </div>
                    <div>
                      <div className="text-xs text-gray-400 uppercase tracking-wider mb-1">Direct Line</div>
                      <div>{content.contact_info?.phone || '+1 (800) 123-4567'}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-white/10 rounded flex items-center justify-center text-[#4DA6FF]">
                      <Mail size={20} />
                    </div>
                    <div>
                      <div className="text-xs text-gray-400 uppercase tracking-wider mb-1">Email Inquiry</div>
                      <div>{content.contact_info?.email || 'contact@corporatesolutions.com'}</div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-lg overflow-hidden shadow-xl flex flex-col">
                 <div className="p-8 bg-gray-50 border-b border-gray-200">
                    <h3 className="font-corp-heading text-xl font-bold text-[#222] mb-2">Connect With Us</h3>
                    <p className="font-corp-body text-gray-600 text-sm">Follow our latest updates and industry insights.</p>
                 </div>
                 <div className="p-8 flex gap-4 justify-center bg-white flex-1 items-center border-b border-gray-200">
                     {content.contact_info?.facebook && <a href={content.contact_info.facebook} target="_blank" rel="noreferrer" className="w-12 h-12 bg-[#f4f7f6] text-[#0056b3] rounded-full flex items-center justify-center hover:bg-[#0056b3] hover:text-white transition-colors"><Facebook size={20} /></a>}
                     {content.contact_info?.twitter && <a href={content.contact_info.twitter} target="_blank" rel="noreferrer" className="w-12 h-12 bg-[#f4f7f6] text-[#0056b3] rounded-full flex items-center justify-center hover:bg-[#0056b3] hover:text-white transition-colors"><Twitter size={20} /></a>}
                     {/* Using instagram as a generic placeholder for LinkedIn if linkedin is not standard in SocialIcons */}
                     <a href="#" target="_blank" rel="noreferrer" className="w-12 h-12 bg-[#f4f7f6] text-[#0056b3] rounded-full flex items-center justify-center hover:bg-[#0056b3] hover:text-white transition-colors">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path><rect x="2" y="9" width="4" height="12"></rect><circle cx="4" cy="4" r="2"></circle></svg>
                     </a>
                 </div>
                 <div className="h-48 w-full relative">
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
      <footer className="py-8 text-center bg-[#001a33] text-gray-400 font-corp-body text-sm border-t border-[#002b5e]">
        <div className="container mx-auto">
           <div className="font-corp-heading font-bold text-white mb-2">{siteName}</div>
           <p>&copy; {new Date().getFullYear()} {siteName}. All rights reserved. | <a href="#" className="hover:text-white">Privacy Policy</a> | <a href="#" className="hover:text-white">Terms of Service</a></p>
        </div>
      </footer>

      {/* Gallery Modal */}
      {selectedGalleryImage && (
        <div className="fixed inset-0 z-[100] bg-black/90 flex items-center justify-center p-4 cursor-pointer" onClick={() => setSelectedGalleryImage(null)}>
          <img src={selectedGalleryImage} alt="Fullscreen" className="max-w-full max-h-[90vh] rounded shadow-2xl" />
        </div>
      )}
    </div>
  );
}
