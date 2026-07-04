import React, { useState } from 'react';
import AllProductsModal from '../../shared/AllProductsModal';
import ProductModal from '../../shared/ProductModal';
import { Briefcase, MapPin, Phone, Mail, Clock, X, Menu, ChevronRight, BarChart3, TrendingUp, Building2 } from 'lucide-react';
import { Facebook, Instagram, Twitter, Youtube, WhatsApp } from '../scrap/SocialIcons';

export default function CorporateConsultingTheme({ website, content }: any) {
  const [showAllProducts, setShowAllProducts] = useState(false);
  const [selectedProduct, setSelectedProduct] = React.useState<any>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [selectedGalleryImage, setSelectedGalleryImage] = React.useState<string | null>(null);
  
  const sectionOrder: string[] = content?.settings_json?.section_order || ['hero', 'about', 'services', 'menu', 'gallery', 'contact', 'custom'];
  const hiddenSections: string[] = content?.settings_json?.hidden_sections || [];
  const siteName = content.settings_json?.website_name || website.slug || 'Corporate Consulting';

  const services = content.products_json?.length > 0 ? content.products_json : [
    { name: 'Strategic Planning', price: 'Consultation', image: 'https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=800&q=80', description: 'Comprehensive strategic planning for enterprise growth.' },
    { name: 'Financial Advisory', price: 'Consultation', image: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=800&q=80', description: 'Expert financial guidance and risk management.' },
    { name: 'Operations Excellence', price: 'Consultation', image: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=800&q=80', description: 'Optimizing business operations for maximum efficiency.' }
  ];

  const defaultServices = [
    { title: 'Global Reach', description: 'Operating across international markets.' },
    { title: 'Data Driven', description: 'Decisions backed by comprehensive analytics.' },
    { title: 'Proven Results', description: 'A track record of sustainable growth.' }
  ];

  return (
    <div className="min-h-screen theme-root flex flex-col bg-[#F8F9FA] text-[#212529] font-sans">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,400&family=Inter:wght@300;400;500;600;700&display=swap');
        .font-serif-title { font-family: 'Playfair Display', serif; }
        .font-sans-body { font-family: 'Inter', sans-serif; }
      
        /* Dynamic Layout Ordering */
        .theme-root { display: flex; flex-direction: column; }
        .theme-root > header, .theme-root > nav { order: 0; }
        .theme-root > section:nth-of-type(1) { order: ${sectionOrder.indexOf('hero') + 1}; display: ${hiddenSections.includes('hero') ? 'none' : 'block'} }
        .theme-root > section:nth-of-type(2) { order: ${sectionOrder.indexOf('menu') + 1 > 0 ? sectionOrder.indexOf('menu') + 1 : sectionOrder.indexOf('products') + 1}; display: ${hiddenSections.includes('menu') ? 'none' : 'block'} }
        .theme-root > footer { order: 999; }
      `}</style>

      {/* Header */}
      <header className="bg-[#0B1D3A] text-white sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            {content?.settings_json?.logo_image ? (
              <img src={content.settings_json.logo_image} alt={siteName} className="h-8 md:h-10 w-auto object-contain" />
            ) : (
              <Briefcase className="text-[#C49A3C]" size={28} />
            )}
            <span className="font-serif-title font-bold text-2xl tracking-wide">{siteName}</span>
          </div>
          <nav className="hidden md:flex gap-8 font-sans-body text-sm font-medium tracking-wide uppercase">
            <a href="#services" className="hover:text-[#C49A3C] transition-colors">Expertise</a>
            <a href="#about" className="hover:text-[#C49A3C] transition-colors">Firm</a>
            <a href="#contact" className="hover:text-[#C49A3C] transition-colors">Contact</a>
          </nav>
          <button className="md:hidden text-white" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden absolute top-full left-0 w-full bg-[#0B1D3A] border-t border-white/10 shadow-xl py-6 px-6 flex flex-col gap-6 font-sans-body text-sm font-medium tracking-wide uppercase">
            <a href="#services" onClick={() => setIsMobileMenuOpen(false)} className="hover:text-[#C49A3C] transition-colors">Expertise</a>
            <a href="#about" onClick={() => setIsMobileMenuOpen(false)} className="hover:text-[#C49A3C] transition-colors">Firm</a>
            <a href="#contact" onClick={() => setIsMobileMenuOpen(false)} className="hover:text-[#C49A3C] transition-colors">Contact</a>
          </div>
        )}
      </header>

      {/* Hero */}
      <section style={{ order: sectionOrder.indexOf('hero') + 1 }} className="relative bg-[#0B1D3A] text-white py-24 md:py-32 px-6">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1600&q=80')] bg-cover bg-center opacity-10"></div>
        <div className="container mx-auto max-w-5xl relative z-10 flex flex-col md:flex-row items-center gap-12">
          <div className="w-full md:w-3/5">
            <div className="inline-block border border-[#C49A3C] text-[#C49A3C] font-sans-body text-xs font-bold tracking-[0.2em] uppercase py-1 px-3 mb-6">
              Premier Consulting
            </div>
            <h1 className="font-serif-title text-4xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
              {content.hero_title || 'Navigating Complexity with Confidence.'}
            </h1>
            <p className="font-sans-body text-lg md:text-xl text-gray-300 mb-10 max-w-xl leading-relaxed">
              {content.hero_text || 'We partner with visionary leaders to tackle their most important challenges and capture their greatest opportunities.'}
            </p>
            <a href="#contact" className="inline-flex items-center gap-2 bg-[#C49A3C] text-[#0B1D3A] font-sans-body font-bold text-sm uppercase tracking-wider py-4 px-8 hover:bg-white transition-colors group">
              Partner With Us
              <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </a>
          </div>
          <div className="w-full md:w-2/5 hidden md:block">
            <div className="border-4 border-[#C49A3C] p-2 relative">
                <div className="absolute -top-4 -left-4 w-8 h-8 border-t-4 border-l-4 border-white"></div>
                <div className="absolute -bottom-4 -right-4 w-8 h-8 border-b-4 border-r-4 border-white"></div>
                <img src="https://images.unsplash.com/photo-1560179707-f14e90ef3623?auto=format&fit=crop&w=600&q=80" alt="Corporate Boardroom" className="w-full aspect-[3/4] object-cover grayscale contrast-125" />
            </div>
          </div>
        </div>
      </section>

      {/* Services/Expertise (Menu) */}
      <section style={{ order: sectionOrder.indexOf('menu') + 1 || sectionOrder.indexOf('services') + 1 }} id="services" className="py-24 px-6 bg-white">
        <div className="container mx-auto max-w-6xl">
          <div className="mb-16 md:flex justify-between items-end">
             <div>
                <h2 className="font-serif-title text-3xl md:text-5xl font-bold text-[#0B1D3A] mb-4">Our Expertise</h2>
                <div className="w-20 h-1 bg-[#C49A3C]"></div>
             </div>
             <p className="font-sans-body text-gray-500 max-w-md mt-6 md:mt-0">
                Delivering tailored solutions and profound insights across key business domains.
             </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {services.slice(0, 6).map((service: any, i: number) => (
              <div key={i} className="group cursor-pointer border border-gray-100 bg-[#F8F9FA] hover:bg-white hover:shadow-xl transition-all duration-300" onClick={() => setSelectedProduct(service)}>
                <div className="aspect-[16/9] overflow-hidden relative">
                   <div className="absolute inset-0 bg-[#0B1D3A]/20 group-hover:bg-transparent transition-colors z-10"></div>
                   <img src={service.image} alt={service.name} className="w-full h-full object-cover grayscale group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700" />
                </div>
                <div className="p-8">
                  <h3 className="font-serif-title text-2xl font-bold mb-3 text-[#0B1D3A] group-hover:text-[#C49A3C] transition-colors">{service.name}</h3>
                  <p className="font-sans-body text-sm text-gray-600 line-clamp-2">{service.description}</p>
                  <div className="mt-6 flex items-center gap-2 text-sm font-bold text-[#0B1D3A] uppercase tracking-wider group-hover:text-[#C49A3C] transition-colors">
                     Learn More <ChevronRight size={16} />
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          <div className="mt-16 text-center">
             <button onClick={() => setShowAllProducts(true)} className="inline-flex items-center gap-2 font-sans-body font-bold text-sm uppercase tracking-wider text-[#0B1D3A] hover:text-[#C49A3C] transition-colors border-b-2 border-transparent hover:border-[#C49A3C] pb-1">
                View All Expertise <ChevronRight size={16} />
             </button>
          </div>
        </div>
      </section>

      {/* Injected About Section */}
      {sectionOrder.includes('about') && !hiddenSections.includes('about') && (
        <section style={{ order: sectionOrder.indexOf('about') + 1 }} id="about" className="py-24 px-6 bg-[#0B1D3A] text-white">
          <div className="container mx-auto max-w-4xl text-center">
            <h2 className="font-serif-title text-3xl md:text-5xl font-bold mb-6">{content.settings_json?.about_title || content.about_title || 'About The Firm'}</h2>
            <div className="w-20 h-1 bg-[#C49A3C] mx-auto mb-10"></div>
            <p className="font-sans-body text-lg md:text-xl text-gray-300 leading-relaxed max-w-3xl mx-auto">
              {content.about_text || 'Founded on the principles of integrity, excellence, and profound insight, we are a leading management consulting firm dedicated to helping organizations achieve their most critical objectives.'}
            </p>
          </div>
        </section>
      )}

      {/* Injected Value Proposition (Services) Section */}
      {sectionOrder.includes('services') && !hiddenSections.includes('services') && (
        <section style={{ order: sectionOrder.indexOf('services') + 1 }} className="py-20 px-6 bg-[#F8F9FA]">
          <div className="container mx-auto max-w-6xl">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
              {(content.services_json?.length ? content.services_json : defaultServices).map((srv: any, i: number) => {
                 const icons = [<BarChart3 size={32} />, <TrendingUp size={32} />, <Building2 size={32} />];
                 return (
                  <div key={i} className="text-center md:text-left flex flex-col items-center md:items-start">
                    <div className="w-16 h-16 bg-[#0B1D3A] text-[#C49A3C] flex items-center justify-center rounded-sm mb-6">
                      {srv.image ? <img src={srv.image} alt={srv.title} className="w-8 h-8 object-contain" /> : icons[i % icons.length]}
                    </div>
                    <h3 className="font-serif-title text-2xl font-bold mb-3 text-[#0B1D3A]">{srv.title}</h3>
                    <p className="font-sans-body text-gray-600 leading-relaxed">{srv.description}</p>
                  </div>
                )
              })}
            </div>
          </div>
        </section>
      )}

      {/* Gallery Section */}
      {sectionOrder.includes('gallery') && !hiddenSections.includes('gallery') && (
        <section style={{ order: sectionOrder.indexOf('gallery') + 1 }} id="gallery" className="py-24 px-6 bg-white">
          <div className="container mx-auto max-w-6xl">
            <div className="text-center mb-16">
              <h2 className="font-serif-title text-3xl md:text-4xl font-bold text-[#0B1D3A] mb-4">Firm Gallery</h2>
              <div className="w-16 h-1 bg-[#C49A3C] mx-auto"></div>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {(content.gallery_json?.length > 0 ? content.gallery_json : [
                'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=800&q=80',
                'https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=800&q=80',
                'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=800&q=80',
                'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=800&q=80'
              ]).map((img: string, i: number) => (
                <div key={i} className="aspect-square bg-gray-100 cursor-pointer overflow-hidden group" onClick={() => setSelectedGalleryImage(img)}>
                  <img src={img} alt="Gallery item" className="w-full h-full object-cover grayscale group-hover:grayscale-0 group-hover:scale-110 transition-all duration-500" />
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Dynamic Custom Section */}
      {sectionOrder.includes('custom') && !hiddenSections.includes('custom') && content?.custom_blocks_json?.length > 0 && (
        <section style={{ order: sectionOrder.indexOf('custom') + 1 }} className="py-20 px-6 bg-white border-t border-gray-100">
          <div className="container mx-auto max-w-4xl space-y-12">
            {content.custom_blocks_json.map((block: any) => {
              if (block.type === 'heading') return <h2 key={block.id} className="font-serif-title text-3xl md:text-4xl font-bold text-[#0B1D3A] text-center">{block.content}</h2>;
              if (block.type === 'paragraph') return <p key={block.id} className="font-sans-body text-lg text-gray-600 leading-relaxed text-center">{block.content}</p>;
              if (block.type === 'image' && block.url) return <img key={block.id} src={block.url} alt="Custom" className="w-full h-auto object-cover border border-gray-200" />;
              if (block.type === 'divider') return <hr key={block.id} className="border-t border-gray-200" />;
              return null;
            })}
          </div>
        </section>
      )}

      {/* Contact Section */}
      {sectionOrder.includes('contact') && !hiddenSections.includes('contact') && (
        <section style={{ order: sectionOrder.indexOf('contact') + 1 }} id="contact" className="py-24 px-6 bg-[#0B1D3A] text-white">
          <div className="container mx-auto max-w-5xl">
            <div className="grid md:grid-cols-2 gap-16">
              <div>
                <h2 className="font-serif-title text-3xl md:text-5xl font-bold mb-6">Connect With Us</h2>
                <div className="w-16 h-1 bg-[#C49A3C] mb-10"></div>
                <p className="font-sans-body text-gray-300 mb-12">
                  Reach out to schedule a consultation with our experts. We are ready to assist you in achieving your strategic goals.
                </p>
                <div className="space-y-8 font-sans-body">
                  <div className="flex items-start gap-4">
                    <Phone className="text-[#C49A3C] mt-1 shrink-0" size={24} />
                    <div>
                      <h4 className="font-bold text-sm uppercase tracking-wider mb-1">Phone</h4>
                      <p className="text-lg text-gray-300">{content.contact_info?.phone || '+1 (555) 123-4567'}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <Mail className="text-[#C49A3C] mt-1 shrink-0" size={24} />
                    <div>
                      <h4 className="font-bold text-sm uppercase tracking-wider mb-1">Email</h4>
                      <p className="text-lg text-gray-300">{content.contact_info?.email || 'inquiries@corporateconsulting.com'}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <MapPin className="text-[#C49A3C] mt-1 shrink-0" size={24} />
                    <div>
                      <h4 className="font-bold text-sm uppercase tracking-wider mb-1">Headquarters</h4>
                      <p className="text-lg text-gray-300">{content.contact_info?.address || '100 Financial District, Suite 400, New York, NY'}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <Clock className="text-[#C49A3C] mt-1 shrink-0" size={24} />
                    <div>
                      <h4 className="font-bold text-sm uppercase tracking-wider mb-1">Office Hours</h4>
                      <p className="text-lg text-gray-300 whitespace-pre-wrap">{content.contact_info?.hours || 'Mon-Fri: 8:00 AM - 6:00 PM'}</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-white p-8 md:p-12 text-[#0B1D3A]">
                <h3 className="font-serif-title text-2xl font-bold mb-8">Social Presence</h3>
                {(content.contact_info?.facebook || content.contact_info?.instagram || content.contact_info?.twitter || content.contact_info?.youtube || content.contact_info?.whatsapp) ? (
                  <div className="flex flex-wrap gap-6">
                    {content.contact_info?.facebook && (
                      <a href={content.contact_info.facebook} target="_blank" rel="noreferrer" className="text-[#0B1D3A] hover:text-[#C49A3C] transition-colors">
                        <Facebook size={32} />
                      </a>
                    )}
                    {content.contact_info?.instagram && (
                      <a href={content.contact_info.instagram} target="_blank" rel="noreferrer" className="text-[#0B1D3A] hover:text-[#C49A3C] transition-colors">
                        <Instagram size={32} />
                      </a>
                    )}
                    {content.contact_info?.twitter && (
                      <a href={content.contact_info.twitter} target="_blank" rel="noreferrer" className="text-[#0B1D3A] hover:text-[#C49A3C] transition-colors">
                        <Twitter size={32} />
                      </a>
                    )}
                    {content.contact_info?.youtube && (
                      <a href={content.contact_info.youtube} target="_blank" rel="noreferrer" className="text-[#0B1D3A] hover:text-[#C49A3C] transition-colors">
                        <Youtube size={32} />
                      </a>
                    )}
                    {content.contact_info?.whatsapp && (
                      <a href={content.contact_info.whatsapp} target="_blank" rel="noreferrer" className="text-[#0B1D3A] hover:text-[#C49A3C] transition-colors">
                        <WhatsApp size={32} />
                      </a>
                    )}
                  </div>
                ) : (
                  <p className="text-gray-500 font-sans-body">Social media links will appear here once added in the editor.</p>
                )}
              </div>
            </div>
            <div className="mt-16 w-full h-[400px] bg-white p-2">
              <iframe
                title="Office Location Map"
                src={`https://maps.google.com/maps?q=${encodeURIComponent(content.contact_info?.address || '100 Financial District, Suite 400, New York, NY')}&t=&z=13&ie=UTF8&iwloc=&output=embed`}
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
      <footer className="bg-[#050E1F] text-gray-400 py-12 px-6 font-sans-body text-sm text-center">
        <div className="container mx-auto">
          <div className="flex justify-center items-center gap-3 mb-6">
            {content?.settings_json?.logo_image ? (
              <img src={content.settings_json.logo_image} alt={siteName} className="h-6 w-auto object-contain grayscale opacity-50" />
            ) : (
              <Briefcase className="text-gray-500" size={20} />
            )}
            <span className="font-serif-title font-bold text-xl text-gray-300 tracking-wide">{siteName}</span>
          </div>
          <p>© {new Date().getFullYear()} {siteName}. All rights reserved.</p>
        </div>
      </footer>

      {/* Modals */}
      <AllProductsModal isOpen={showAllProducts} onClose={() => setShowAllProducts(false)} products={services} onProductSelect={setSelectedProduct} />
      <ProductModal product={selectedProduct} onClose={() => setSelectedProduct(null)} contactInfo={content.contact_info} />

      {/* Gallery Modal */}
      {selectedGalleryImage && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-[#0B1D3A]/95 backdrop-blur-sm" onClick={() => setSelectedGalleryImage(null)}>
          <button className="absolute top-6 right-6 text-white/50 hover:text-white transition-colors">
            <X size={32} />
          </button>
          <img src={selectedGalleryImage} alt="Gallery view" className="max-w-full max-h-[90vh] object-contain shadow-2xl" onClick={(e) => e.stopPropagation()} />
        </div>
      )}
    </div>
  );
}
