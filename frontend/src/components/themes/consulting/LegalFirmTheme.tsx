import React, { useState } from 'react';
import AllProductsModal from '../../shared/AllProductsModal';
import ProductModal from '../../shared/ProductModal';
import { Briefcase, MapPin, Phone, Mail, Clock, X, Menu, Scale, Shield, Landmark, ArrowRight } from 'lucide-react';
import { Facebook, Instagram, Twitter, Youtube, WhatsApp } from '../scrap/SocialIcons';

export default function LegalFirmTheme({ website, content }: any) {
  const [showAllProducts, setShowAllProducts] = useState(false);
  const [selectedProduct, setSelectedProduct] = React.useState<any>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [selectedGalleryImage, setSelectedGalleryImage] = React.useState<string | null>(null);
  
  const sectionOrder: string[] = content?.settings_json?.section_order || ['hero', 'services', 'about', 'menu', 'gallery', 'contact', 'custom'];
  const hiddenSections: string[] = content?.settings_json?.hidden_sections || [];
  const siteName = content.settings_json?.website_name || website.slug || 'Legal Firm';

  const services = content.products_json?.length > 0 ? content.products_json : [
    { name: 'Corporate Law', price: 'Consultation', image: 'https://images.unsplash.com/photo-1589829085413-56de8ae18c73?auto=format&fit=crop&w=800&q=80', description: 'Comprehensive legal representation for businesses.' },
    { name: 'Intellectual Property', price: 'Consultation', image: 'https://images.unsplash.com/photo-1589391886645-d51941baf7fb?auto=format&fit=crop&w=800&q=80', description: 'Protecting your innovations and creative works.' },
    { name: 'Litigation', price: 'Consultation', image: 'https://images.unsplash.com/photo-1521587760476-6c12a4b040da?auto=format&fit=crop&w=800&q=80', description: 'Fierce advocacy in state and federal courts.' }
  ];

  const defaultServices = [
    { title: 'Steadfast Counsel', description: 'Unwavering support through complex legal challenges.' },
    { title: 'Strategic Defense', description: 'Anticipating risks and protecting your interests.' },
    { title: 'Proven Advocacy', description: 'A legacy of successful outcomes for our clients.' }
  ];

  return (
    <div className="min-h-screen theme-root flex flex-col bg-[#F5F0E8] text-[#1B3D2E] font-sans">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Merriweather:ital,wght@0,300;0,400;0,700;1,400&family=Source+Sans+Pro:wght@400;600;700&display=swap');
        .font-legal-title { font-family: 'Merriweather', serif; }
        .font-legal-body { font-family: 'Source Sans Pro', sans-serif; }
      
        /* Dynamic Layout Ordering */
        .theme-root { display: flex; flex-direction: column; }
        .theme-root > header, .theme-root > nav { order: 0; }
        .theme-root > section:nth-of-type(1) { order: ${sectionOrder.indexOf('hero') + 1}; display: ${hiddenSections.includes('hero') ? 'none' : 'block'} }
        .theme-root > section:nth-of-type(2) { order: ${sectionOrder.indexOf('menu') + 1 > 0 ? sectionOrder.indexOf('menu') + 1 : sectionOrder.indexOf('products') + 1}; display: ${hiddenSections.includes('menu') ? 'none' : 'block'} }
        .theme-root > footer { order: 999; }
      `}</style>

      {/* Header */}
      <header className="bg-[#1B3D2E] text-[#F5F0E8] border-b-4 border-[#C4A962] sticky top-0 z-50">
        <div className="container mx-auto px-6 py-5 flex justify-between items-center">
          <div className="flex items-center gap-4">
            {content?.settings_json?.logo_image ? (
              <img src={content.settings_json.logo_image} alt={siteName} className="h-10 md:h-12 w-auto object-contain" />
            ) : (
              <Scale className="text-[#C4A962]" size={32} />
            )}
            <span className="font-legal-title font-bold text-2xl tracking-wide uppercase">{siteName}</span>
          </div>
          <nav className="hidden md:flex gap-8 font-legal-body font-semibold text-sm tracking-widest uppercase">
            <a href="#services" className="hover:text-[#C4A962] transition-colors">Practice Areas</a>
            <a href="#about" className="hover:text-[#C4A962] transition-colors">The Firm</a>
            <a href="#contact" className="hover:text-[#C4A962] transition-colors">Contact</a>
          </nav>
          <button className="md:hidden text-[#C4A962]" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
            {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden absolute top-full left-0 w-full bg-[#1B3D2E] border-b-4 border-[#C4A962] shadow-xl py-6 px-6 flex flex-col gap-6 font-legal-body font-semibold text-sm tracking-widest uppercase">
            <a href="#services" onClick={() => setIsMobileMenuOpen(false)} className="hover:text-[#C4A962] transition-colors">Practice Areas</a>
            <a href="#about" onClick={() => setIsMobileMenuOpen(false)} className="hover:text-[#C4A962] transition-colors">The Firm</a>
            <a href="#contact" onClick={() => setIsMobileMenuOpen(false)} className="hover:text-[#C4A962] transition-colors">Contact</a>
          </div>
        )}
      </header>

      {/* Hero */}
      <section style={{ order: sectionOrder.indexOf('hero') + 1 }} className="relative pt-32 pb-40 px-6 bg-[#1B3D2E] text-[#F5F0E8] overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1589829085413-56de8ae18c73?auto=format&fit=crop&w=1600&q=80')] bg-cover bg-center opacity-10"></div>
        <div className="container mx-auto max-w-5xl relative z-10 text-center">
          <div className="w-16 h-1 bg-[#C4A962] mx-auto mb-10"></div>
          <h1 className="font-legal-title text-5xl md:text-7xl font-bold mb-8 leading-tight">
            {content.hero_title || 'Principled advocacy. Proven results.'}
          </h1>
          <p className="font-legal-body text-xl md:text-2xl text-[#F5F0E8]/80 mb-12 max-w-2xl mx-auto leading-relaxed">
            {content.hero_text || 'Providing exceptional legal counsel and unwavering representation for businesses and individuals.'}
          </p>
          <a href="#contact" className="inline-flex items-center gap-3 bg-[#C4A962] text-[#1B3D2E] font-legal-body font-bold text-sm uppercase tracking-widest py-4 px-10 hover:bg-[#F5F0E8] transition-colors">
            Request a Consultation <ArrowRight size={18} />
          </a>
        </div>
      </section>

      {/* Injected Value Proposition (Services) Section */}
      {sectionOrder.includes('services') && !hiddenSections.includes('services') && (
        <section style={{ order: sectionOrder.indexOf('services') + 1 }} className="py-24 px-6 bg-[#F5F0E8] relative -mt-16 z-20">
          <div className="container mx-auto max-w-6xl bg-white shadow-2xl p-10 md:p-16 border-t-4 border-[#1B3D2E]">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
              {(content.services_json?.length ? content.services_json : defaultServices).map((srv: any, i: number) => {
                 const icons = [<Scale size={48} className="text-[#1B3D2E]" strokeWidth={1} />, <Shield size={48} className="text-[#1B3D2E]" strokeWidth={1} />, <Landmark size={48} className="text-[#1B3D2E]" strokeWidth={1} />];
                 return (
                  <div key={i} className="text-center flex flex-col items-center">
                    <div className="mb-6">
                      {srv.image ? <img src={srv.image} alt={srv.title} className="w-12 h-12 object-contain" /> : icons[i % icons.length]}
                    </div>
                    <h3 className="font-legal-title text-2xl font-bold mb-4 text-[#1B3D2E]">{srv.title}</h3>
                    <p className="font-legal-body text-[#1B3D2E]/70 leading-relaxed text-lg">{srv.description}</p>
                  </div>
                )
              })}
            </div>
          </div>
        </section>
      )}

      {/* Services/Expertise (Menu) - "Practice Areas" */}
      <section style={{ order: sectionOrder.indexOf('menu') + 1 || sectionOrder.indexOf('services') + 1 }} id="services" className="py-24 px-6 bg-white">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
             <h2 className="font-legal-title text-4xl md:text-5xl font-bold text-[#1B3D2E] mb-6">Our Practice Areas</h2>
             <div className="w-16 h-1 bg-[#C4A962] mx-auto"></div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {services.slice(0, 6).map((service: any, i: number) => (
              <div key={i} className="group cursor-pointer border border-[#E5E0D8] bg-[#F5F0E8] hover:shadow-xl transition-all duration-300" onClick={() => setSelectedProduct(service)}>
                <div className="aspect-[4/3] overflow-hidden">
                   <img src={service.image} alt={service.name} className="w-full h-full object-cover filter grayscale group-hover:grayscale-0 group-hover:scale-105 transition-all duration-500" />
                </div>
                <div className="p-8">
                  <h3 className="font-legal-title text-2xl font-bold mb-3 text-[#1B3D2E]">{service.name}</h3>
                  <p className="font-legal-body text-[#1B3D2E]/70 line-clamp-2">{service.description}</p>
                  <div className="mt-6 font-legal-body font-bold text-[#C4A962] uppercase tracking-widest text-sm flex items-center gap-2">
                     Learn More <ArrowRight size={16} className="group-hover:translate-x-2 transition-transform" />
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          <div className="mt-16 text-center">
             <button onClick={() => setShowAllProducts(true)} className="inline-flex items-center gap-2 font-legal-body font-bold text-sm uppercase tracking-widest text-[#1B3D2E] hover:text-[#C4A962] transition-colors border-b-2 border-transparent hover:border-[#C4A962] pb-1">
                View All Practice Areas <ArrowRight size={16} />
             </button>
          </div>
        </div>
      </section>

      {/* Injected About Section */}
      {sectionOrder.includes('about') && !hiddenSections.includes('about') && (
        <section style={{ order: sectionOrder.indexOf('about') + 1 }} id="about" className="py-32 px-6 bg-[#1B3D2E] text-[#F5F0E8]">
          <div className="container mx-auto max-w-4xl text-center">
            <h2 className="font-legal-title text-4xl md:text-5xl font-bold mb-8">
              {content.settings_json?.about_title || content.about_title || 'A legacy of legal excellence.'}
            </h2>
            <div className="w-16 h-1 bg-[#C4A962] mx-auto mb-10"></div>
            <p className="font-legal-body text-xl md:text-2xl text-[#F5F0E8]/80 leading-relaxed max-w-3xl mx-auto">
              {content.about_text || 'Our firm was founded on the principle that every client deserves uncompromising advocacy and deeply personalized counsel. We navigate the complexities of the law so you can focus on the future.'}
            </p>
          </div>
        </section>
      )}

      {/* Gallery Section */}
      {sectionOrder.includes('gallery') && !hiddenSections.includes('gallery') && (
        <section style={{ order: sectionOrder.indexOf('gallery') + 1 }} id="gallery" className="py-24 px-6 bg-white">
          <div className="container mx-auto max-w-7xl">
            <div className="text-center mb-16">
              <h2 className="font-legal-title text-3xl md:text-4xl font-bold text-[#1B3D2E] mb-6">Inside The Firm</h2>
              <div className="w-16 h-1 bg-[#C4A962] mx-auto"></div>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {(content.gallery_json?.length > 0 ? content.gallery_json : [
                'https://images.unsplash.com/photo-1589829085413-56de8ae18c73?auto=format&fit=crop&w=800&q=80',
                'https://images.unsplash.com/photo-1589391886645-d51941baf7fb?auto=format&fit=crop&w=800&q=80',
                'https://images.unsplash.com/photo-1521587760476-6c12a4b040da?auto=format&fit=crop&w=800&q=80',
                'https://images.unsplash.com/photo-1505664194779-8beaceb93744?auto=format&fit=crop&w=800&q=80'
              ]).map((img: string, i: number) => (
                <div key={i} className="aspect-square bg-gray-100 cursor-pointer overflow-hidden group" onClick={() => setSelectedGalleryImage(img)}>
                  <img src={img} alt="Gallery item" className="w-full h-full object-cover grayscale opacity-80 group-hover:grayscale-0 group-hover:opacity-100 group-hover:scale-110 transition-all duration-500" />
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Dynamic Custom Section */}
      {sectionOrder.includes('custom') && !hiddenSections.includes('custom') && content?.custom_blocks_json?.length > 0 && (
        <section style={{ order: sectionOrder.indexOf('custom') + 1 }} className="py-24 px-6 bg-[#F5F0E8] border-t border-[#E5E0D8]">
          <div className="container mx-auto max-w-4xl space-y-12">
            {content.custom_blocks_json.map((block: any) => {
              if (block.type === 'heading') return <h2 key={block.id} className="font-legal-title text-3xl md:text-4xl font-bold text-[#1B3D2E] text-center">{block.content}</h2>;
              if (block.type === 'paragraph') return <p key={block.id} className="font-legal-body text-lg text-[#1B3D2E]/80 leading-relaxed text-center">{block.content}</p>;
              if (block.type === 'image' && block.url) return <img key={block.id} src={block.url} alt="Custom" className="w-full border-4 border-white shadow-lg" />;
              if (block.type === 'divider') return <hr key={block.id} className="border-t border-[#1B3D2E]/10" />;
              return null;
            })}
          </div>
        </section>
      )}

      {/* Contact Section */}
      {sectionOrder.includes('contact') && !hiddenSections.includes('contact') && (
        <section style={{ order: sectionOrder.indexOf('contact') + 1 }} id="contact" className="py-24 px-6 bg-[#1B3D2E] text-[#F5F0E8]">
          <div className="container mx-auto max-w-6xl">
            <div className="flex flex-col md:flex-row gap-16 justify-between border-t-4 border-[#C4A962] pt-16">
              <div className="w-full md:w-1/2">
                <h2 className="font-legal-title text-4xl md:text-5xl font-bold mb-6">Contact Our Office</h2>
                <p className="font-legal-body text-[#F5F0E8]/70 text-lg mb-10">
                  Confidential consultations available upon request. Reach out to discuss your legal needs.
                </p>
                <div className="space-y-6 font-legal-body text-lg">
                  <div className="flex items-start gap-4">
                    <Phone className="text-[#C4A962] mt-1 shrink-0" size={24} />
                    <p>{content.contact_info?.phone || '+1 (555) 000-0000'}</p>
                  </div>
                  <div className="flex items-start gap-4">
                    <Mail className="text-[#C4A962] mt-1 shrink-0" size={24} />
                    <p>{content.contact_info?.email || 'inquiries@legalfirm.com'}</p>
                  </div>
                  <div className="flex items-start gap-4">
                    <MapPin className="text-[#C4A962] mt-1 shrink-0" size={24} />
                    <p>{content.contact_info?.address || '100 Justice Avenue, Suite 500, Washington DC'}</p>
                  </div>
                  <div className="flex items-start gap-4">
                    <Clock className="text-[#C4A962] mt-1 shrink-0" size={24} />
                    <p className="whitespace-pre-wrap">{content.contact_info?.hours || 'Mon-Fri: 9:00 AM - 5:00 PM\nSat-Sun: Closed'}</p>
                  </div>
                </div>
              </div>
              <div className="w-full md:w-1/3">
                 <h3 className="font-legal-title text-2xl font-bold mb-6 text-[#C4A962]">Connect</h3>
                 <p className="font-legal-body text-[#F5F0E8]/70 mb-8">Follow us for updates and insights.</p>
                {(content.contact_info?.facebook || content.contact_info?.instagram || content.contact_info?.twitter || content.contact_info?.youtube || content.contact_info?.whatsapp) ? (
                  <div className="flex flex-wrap gap-6">
                    {content.contact_info?.facebook && (
                      <a href={content.contact_info.facebook} target="_blank" rel="noreferrer" className="text-[#F5F0E8] hover:text-[#C4A962] transition-colors">
                        <Facebook size={32} />
                      </a>
                    )}
                    {content.contact_info?.instagram && (
                      <a href={content.contact_info.instagram} target="_blank" rel="noreferrer" className="text-[#F5F0E8] hover:text-[#C4A962] transition-colors">
                        <Instagram size={32} />
                      </a>
                    )}
                    {content.contact_info?.twitter && (
                      <a href={content.contact_info.twitter} target="_blank" rel="noreferrer" className="text-[#F5F0E8] hover:text-[#C4A962] transition-colors">
                        <Twitter size={32} />
                      </a>
                    )}
                    {content.contact_info?.youtube && (
                      <a href={content.contact_info.youtube} target="_blank" rel="noreferrer" className="text-[#F5F0E8] hover:text-[#C4A962] transition-colors">
                        <Youtube size={32} />
                      </a>
                    )}
                    {content.contact_info?.whatsapp && (
                      <a href={content.contact_info.whatsapp} target="_blank" rel="noreferrer" className="text-[#F5F0E8] hover:text-[#C4A962] transition-colors">
                        <WhatsApp size={32} />
                      </a>
                    )}
                  </div>
                ) : (
                  <p className="text-[#F5F0E8]/50 font-legal-body italic">No social media links provided.</p>
                )}
              </div>
            </div>
            
            <div className="mt-16 w-full h-[400px] border-4 border-[#C4A962] p-1 bg-[#1B3D2E]">
              <iframe
                title="Office Location Map"
                src={`https://maps.google.com/maps?q=${encodeURIComponent(content.contact_info?.address || '100 Justice Avenue, Suite 500, Washington DC')}&t=&z=13&ie=UTF8&iwloc=&output=embed`}
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen={false}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              ></iframe>
            </div>
          </div>
        </section>
      )}

      {/* Footer */}
      <footer className="bg-[#122A1F] text-[#F5F0E8]/50 py-10 px-6 font-legal-body text-sm text-center">
        <div className="container mx-auto">
          <p className="mb-2">The information on this website is for general information purposes only. Nothing on this site should be taken as legal advice for any individual case or situation.</p>
          <p>© {new Date().getFullYear()} {siteName}. All rights reserved.</p>
        </div>
      </footer>

      {/* Modals */}
      <AllProductsModal isOpen={showAllProducts} onClose={() => setShowAllProducts(false)} products={services} onProductSelect={setSelectedProduct} />
      <ProductModal product={selectedProduct} onClose={() => setSelectedProduct(null)} contactInfo={content.contact_info} />

      {/* Gallery Modal */}
      {selectedGalleryImage && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-[#1B3D2E]/95 backdrop-blur-sm" onClick={() => setSelectedGalleryImage(null)}>
          <button className="absolute top-6 right-6 text-[#C4A962] hover:text-white transition-colors">
            <X size={32} />
          </button>
          <img src={selectedGalleryImage} alt="Gallery view" className="max-w-full max-h-[90vh] object-contain shadow-2xl border-4 border-[#F5F0E8]" onClick={(e) => e.stopPropagation()} />
        </div>
      )}
    </div>
  );
}
