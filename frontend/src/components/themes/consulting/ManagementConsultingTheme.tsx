import React, { useState } from 'react';
import AllProductsModal from '../../shared/AllProductsModal';
import ProductModal from '../../shared/ProductModal';
import { Briefcase, MapPin, Phone, Mail, X, Menu, ArrowRight, BookOpen, Lightbulb, TrendingUp } from 'lucide-react';
import { Facebook, Instagram, Twitter, Youtube, WhatsApp } from '../scrap/SocialIcons';

export default function ManagementConsultingTheme({ website, content }: any) {
  const [showAllProducts, setShowAllProducts] = useState(false);
  const [selectedProduct, setSelectedProduct] = React.useState<any>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [selectedGalleryImage, setSelectedGalleryImage] = React.useState<string | null>(null);
  
  const sectionOrder: string[] = content?.settings_json?.section_order || ['hero', 'services', 'about', 'menu', 'gallery', 'contact', 'custom'];
  const hiddenSections: string[] = content?.settings_json?.hidden_sections || [];
  const siteName = content.settings_json?.website_name || website.slug || 'Management Consulting';

  const services = content.products_json?.length > 0 ? content.products_json : [
    { name: 'Organizational Design', price: 'Consultation', image: 'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?auto=format&fit=crop&w=800&q=80', description: 'Restructuring organizations for optimal performance and agility.' },
    { name: 'Change Management', price: 'Consultation', image: 'https://images.unsplash.com/photo-1553877522-43269d4ea984?auto=format&fit=crop&w=800&q=80', description: 'Guiding teams through critical transitions and transformations.' },
    { name: 'Leadership Development', price: 'Consultation', image: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=800&q=80', description: 'Cultivating the next generation of executive leadership.' }
  ];

  const defaultServices = [
    { title: 'Insightful Analysis', description: 'Deep qualitative and quantitative research.' },
    { title: 'Strategic Alignment', description: 'Ensuring all levels of the organization share a unified vision.' },
    { title: 'Sustainable Outcomes', description: 'Implementing changes that endure.' }
  ];

  return (
    <div className="min-h-screen theme-root flex flex-col bg-[#F7F3ED] text-[#2D2D2D] font-sans">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,600;0,700;1,400&family=Lato:wght@300;400;700&display=swap');
        .font-management-title { font-family: 'Cormorant Garamond', serif; }
        .font-management-body { font-family: 'Lato', sans-serif; }
      
        /* Dynamic Layout Ordering */
        .theme-root { display: flex; flex-direction: column; }
        .theme-root > header, .theme-root > nav { order: 0; }
        .theme-root > section:nth-of-type(1) { order: ${sectionOrder.indexOf('hero') + 1}; display: ${hiddenSections.includes('hero') ? 'none' : 'block'} }
        .theme-root > section:nth-of-type(2) { order: ${sectionOrder.indexOf('menu') + 1 > 0 ? sectionOrder.indexOf('menu') + 1 : sectionOrder.indexOf('products') + 1}; display: ${hiddenSections.includes('menu') ? 'none' : 'block'} }
        .theme-root > footer { order: 999; }
      `}</style>

      {/* Header */}
      <header className="bg-transparent absolute top-0 w-full z-50 py-6">
        <div className="container mx-auto px-8 md:px-12 flex justify-between items-center border-b border-[#2D2D2D]/10 pb-6">
          <div className="flex items-center gap-4">
            {content?.settings_json?.logo_image ? (
              <img loading="lazy" src={content.settings_json.logo_image} alt={siteName} className="h-10 md:h-12 w-auto object-contain" />
            ) : (
              <Briefcase className="text-[#8B1A1A]" size={32} />
            )}
            <span className="font-management-title font-bold text-2xl tracking-wide uppercase text-[#2D2D2D]">{siteName}</span>
          </div>
          <nav className="hidden md:flex gap-10 font-management-title text-lg tracking-wider text-[#2D2D2D]">
            <a href="#services" className="hover:text-[#8B1A1A] transition-colors italic">Capabilities</a>
            <a href="#about" className="hover:text-[#8B1A1A] transition-colors italic">The Firm</a>
            <a href="#contact" className="hover:text-[#8B1A1A] transition-colors italic">Connect</a>
          </nav>
          <button className="md:hidden text-[#2D2D2D]" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
            {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden absolute top-full left-0 w-full bg-[#F7F3ED] border-b border-[#2D2D2D]/10 shadow-lg py-8 px-8 flex flex-col gap-6 font-management-title text-xl tracking-wider text-[#2D2D2D]">
            <a href="#services" onClick={() => setIsMobileMenuOpen(false)} className="hover:text-[#8B1A1A] transition-colors italic">Capabilities</a>
            <a href="#about" onClick={() => setIsMobileMenuOpen(false)} className="hover:text-[#8B1A1A] transition-colors italic">The Firm</a>
            <a href="#contact" onClick={() => setIsMobileMenuOpen(false)} className="hover:text-[#8B1A1A] transition-colors italic">Connect</a>
          </div>
        )}
      </header>

      {/* Hero */}
      <section style={{ order: sectionOrder.indexOf('hero') + 1 }} className="relative min-h-[90vh] pt-32 md:pt-48 pb-20 px-8 md:px-12 flex items-center bg-[#F7F3ED]">
        <div className="container mx-auto flex flex-col md:flex-row items-center gap-16 relative z-10">
          <div className="w-full md:w-1/2">
            <h1 className="font-management-title text-5xl md:text-7xl font-bold mb-8 leading-[1.1] text-[#2D2D2D]">
              {content.hero_title || 'Elevating organizational performance.'}
            </h1>
            <p className="font-management-body text-xl md:text-2xl text-[#2D2D2D]/70 mb-12 max-w-lg leading-relaxed font-light">
              {content.hero_text || 'We provide the clarity, strategy, and execution needed to navigate periods of profound change.'}
            </p>
            <a href="#contact" className="inline-flex items-center gap-3 bg-[#2D2D2D] text-[#F7F3ED] font-management-body font-bold text-sm uppercase tracking-widest py-4 px-10 hover:bg-[#8B1A1A] transition-colors group">
              Schedule Consultation
              <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </a>
          </div>
          <div className="w-full md:w-1/2">
             <img loading="lazy" src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=800&q=80" alt="Consulting" className="w-full h-auto object-cover rounded-tl-[100px] rounded-br-[100px] shadow-2xl filter sepia-[0.2]" />
          </div>
        </div>
      </section>

      {/* Injected Value Proposition (Services) Section */}
      {sectionOrder.includes('services') && !hiddenSections.includes('services') && (
        <section style={{ order: sectionOrder.indexOf('services') + 1 }} className="py-24 px-8 md:px-12 bg-white">
          <div className="container mx-auto max-w-7xl">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-16">
              {(content.services_json?.length ? content.services_json : defaultServices).map((srv: any, i: number) => {
                 const icons = [<Lightbulb size={40} className="text-[#8B1A1A]" strokeWidth={1} />, <BookOpen size={40} className="text-[#8B1A1A]" strokeWidth={1} />, <TrendingUp size={40} className="text-[#8B1A1A]" strokeWidth={1} />];
                 return (
                  <div key={i} className="text-center flex flex-col items-center">
                    <div className="mb-8">
                      {srv.image ? <img loading="lazy" src={srv.image} alt={srv.title} className="w-10 h-10 object-contain" /> : icons[i % icons.length]}
                    </div>
                    <h3 className="font-management-title text-2xl font-bold mb-4 text-[#2D2D2D]">{srv.title}</h3>
                    <p className="font-management-body text-[#2D2D2D]/70 leading-relaxed text-lg font-light">{srv.description}</p>
                  </div>
                )
              })}
            </div>
          </div>
        </section>
      )}

      {/* Services/Expertise (Menu) - "Capabilities" */}
      <section style={{ order: sectionOrder.indexOf('menu') + 1 || sectionOrder.indexOf('services') + 1 }} id="services" className="py-32 px-8 md:px-12 bg-[#2D2D2D] text-[#F7F3ED]">
        <div className="container mx-auto max-w-7xl">
          <div className="text-center mb-20">
             <span className="font-management-body text-sm font-bold uppercase tracking-widest text-[#8B1A1A] mb-4 block">Our Practice Areas</span>
             <h2 className="font-management-title text-4xl md:text-6xl font-bold">Capabilities & Offerings</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {services.slice(0, 6).map((service: any, i: number) => (
              <div key={i} className="group cursor-pointer flex flex-col" onClick={() => setSelectedProduct(service)}>
                <div className="aspect-[4/3] overflow-hidden mb-8">
                   <img loading="lazy" src={service.image} alt={service.name} className="w-full h-full object-cover filter grayscale group-hover:grayscale-0 transition-all duration-700 group-hover:scale-105" />
                </div>
                <div>
                  <h3 className="font-management-title text-2xl md:text-3xl font-bold mb-4 group-hover:text-[#8B1A1A] transition-colors">{service.name}</h3>
                  <p className="font-management-body text-lg text-[#F7F3ED]/70 mb-6 font-light">{service.description}</p>
                  <div className="flex items-center gap-2 text-[#8B1A1A] font-management-title italic text-xl">
                     Discover <ArrowRight size={20} />
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          <div className="mt-16 text-center">
             <button onClick={() => setShowAllProducts(true)} className="inline-flex items-center gap-2 font-management-title text-xl italic text-[#F7F3ED] hover:text-[#8B1A1A] transition-colors border-b border-transparent hover:border-[#8B1A1A] pb-1">
                View All Capabilities <ArrowRight size={20} />
             </button>
          </div>
        </div>
      </section>

      {/* Injected About Section */}
      {sectionOrder.includes('about') && !hiddenSections.includes('about') && (
        <section style={{ order: sectionOrder.indexOf('about') + 1 }} id="about" className="py-32 px-8 md:px-12 bg-[#F7F3ED]">
          <div className="container mx-auto max-w-4xl text-center">
            <h2 className="font-management-title text-4xl md:text-6xl font-bold mb-10 text-[#2D2D2D]">
              {content.settings_json?.about_title || content.about_title || 'A tradition of excellence.'}
            </h2>
            <div className="w-24 h-[1px] bg-[#8B1A1A] mx-auto mb-10"></div>
            <p className="font-management-body text-xl md:text-2xl text-[#2D2D2D]/80 leading-loose font-light">
              {content.about_text || 'We believe that the best management consulting combines rigorous analytical methodology with a deep understanding of organizational dynamics and human behavior.'}
            </p>
          </div>
        </section>
      )}

      {/* Gallery Section */}
      {sectionOrder.includes('gallery') && !hiddenSections.includes('gallery') && (
        <section style={{ order: sectionOrder.indexOf('gallery') + 1 }} id="gallery" className="py-24 px-8 md:px-12 bg-white">
          <div className="container mx-auto max-w-7xl">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {(content.gallery_json?.length > 0 ? content.gallery_json : [
                'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=800&q=80',
                'https://images.unsplash.com/photo-1556761175-4b46a572b786?auto=format&fit=crop&w=800&q=80',
                'https://images.unsplash.com/photo-1572021335469-31706a17aaef?auto=format&fit=crop&w=800&q=80',
                'https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=800&q=80'
              ]).map((img: string, i: number) => (
                <div key={i} className={`aspect-square overflow-hidden cursor-pointer ${i % 3 === 0 ? 'md:col-span-2 md:row-span-2' : ''}`} onClick={() => setSelectedGalleryImage(img)}>
                  <img loading="lazy" src={img} alt="Gallery item" className="w-full h-full object-cover filter grayscale hover:grayscale-0 transition-all duration-500 hover:scale-105" />
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Dynamic Custom Section */}
      {sectionOrder.includes('custom') && !hiddenSections.includes('custom') && content?.custom_blocks_json?.length > 0 && (
        <section style={{ order: sectionOrder.indexOf('custom') + 1 }} className="py-24 px-8 md:px-12 bg-[#F7F3ED] border-t border-[#2D2D2D]/10">
          <div className="container mx-auto max-w-4xl space-y-12">
            {content.custom_blocks_json.map((block: any) => {
              if (block.type === 'heading') return <h2 key={block.id} className="font-management-title text-3xl md:text-5xl font-bold text-[#2D2D2D] text-center">{block.content}</h2>;
              if (block.type === 'paragraph') return <p key={block.id} className="font-management-body text-xl text-[#2D2D2D]/80 leading-relaxed font-light">{block.content}</p>;
              if (block.type === 'image' && block.url) return <img loading="lazy" key={block.id} src={block.url} alt="Custom" className="w-full rounded-sm" />;
              if (block.type === 'divider') return <div key={block.id} className="w-24 h-[1px] bg-[#8B1A1A] mx-auto my-16"></div>;
              return null;
            })}
          </div>
        </section>
      )}

      {/* Contact Section */}
      {sectionOrder.includes('contact') && !hiddenSections.includes('contact') && (
        <section style={{ order: sectionOrder.indexOf('contact') + 1 }} id="contact" className="py-32 px-8 md:px-12 bg-[#2D2D2D] text-[#F7F3ED]">
          <div className="container mx-auto max-w-7xl">
            <div className="grid lg:grid-cols-2 gap-20">
              <div>
                <span className="font-management-body text-sm font-bold uppercase tracking-widest text-[#8B1A1A] mb-4 block">Connect</span>
                <h2 className="font-management-title text-4xl md:text-6xl font-bold mb-10">Start the conversation.</h2>
                <div className="space-y-8 font-management-body text-lg font-light text-[#F7F3ED]/80">
                  <div className="flex items-center gap-6">
                    <Phone className="text-[#8B1A1A]" size={24} strokeWidth={1.5} />
                    <p>{content.contact_info?.phone || '+1 (555) 123-4567'}</p>
                  </div>
                  <div className="flex items-center gap-6">
                    <Mail className="text-[#8B1A1A]" size={24} strokeWidth={1.5} />
                    <p>{content.contact_info?.email || 'contact@managementfirm.com'}</p>
                  </div>
                  <div className="flex items-start gap-6">
                    <MapPin className="text-[#8B1A1A] mt-1 shrink-0" size={24} strokeWidth={1.5} />
                    <p>{content.contact_info?.address || '123 Executive Plaza, Suite 800, Boston, MA'}</p>
                  </div>
                </div>
              </div>
              <div className="bg-[#F7F3ED] text-[#2D2D2D] p-12 md:p-16">
                <h3 className="font-management-title text-3xl font-bold mb-10">Follow Our Insights</h3>
                {(content.contact_info?.facebook || content.contact_info?.instagram || content.contact_info?.twitter || content.contact_info?.youtube || content.contact_info?.whatsapp) ? (
                  <div className="flex flex-wrap gap-8">
                    {content.contact_info?.facebook && (
                      <a href={content.contact_info.facebook} target="_blank" rel="noreferrer" className="text-[#2D2D2D] hover:text-[#8B1A1A] transition-colors">
                        <Facebook size={32} strokeWidth={1.5} />
                      </a>
                    )}
                    {content.contact_info?.instagram && (
                      <a href={content.contact_info.instagram} target="_blank" rel="noreferrer" className="text-[#2D2D2D] hover:text-[#8B1A1A] transition-colors">
                        <Instagram size={32} strokeWidth={1.5} />
                      </a>
                    )}
                    {content.contact_info?.twitter && (
                      <a href={content.contact_info.twitter} target="_blank" rel="noreferrer" className="text-[#2D2D2D] hover:text-[#8B1A1A] transition-colors">
                        <Twitter size={32} strokeWidth={1.5} />
                      </a>
                    )}
                    {content.contact_info?.youtube && (
                      <a href={content.contact_info.youtube} target="_blank" rel="noreferrer" className="text-[#2D2D2D] hover:text-[#8B1A1A] transition-colors">
                        <Youtube size={32} strokeWidth={1.5} />
                      </a>
                    )}
                    {content.contact_info?.whatsapp && (
                      <a href={content.contact_info.whatsapp} target="_blank" rel="noreferrer" className="text-[#2D2D2D] hover:text-[#8B1A1A] transition-colors">
                        <WhatsApp size={32} strokeWidth={1.5} />
                      </a>
                    )}
                  </div>
                ) : (
                  <p className="text-[#2D2D2D]/60 font-management-body text-lg font-light">Social media links will appear here once added.</p>
                )}
              </div>
            </div>
            
            <div className="mt-20 w-full h-[450px] bg-white border border-[#2D2D2D]/10 p-2 shadow-sm">
              <iframe
                title="Office Location Map"
                src={`https://maps.google.com/maps?q=${encodeURIComponent(content.contact_info?.address || '123 Executive Plaza, Suite 800, Boston, MA')}&t=&z=13&ie=UTF8&iwloc=&output=embed`}
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
      <footer className="bg-[#1A1A1A] text-[#F7F3ED]/50 py-12 px-8 md:px-12 font-management-body text-sm font-light border-t border-[#F7F3ED]/10">
        <div className="container mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-3">
             <Briefcase size={20} />
             <span className="font-management-title font-bold text-xl uppercase tracking-widest text-[#F7F3ED]">{siteName}</span>
          </div>
          <p>© {new Date().getFullYear()} {siteName}. All rights reserved.</p>
        </div>
      </footer>

      {/* Modals */}
      <AllProductsModal isOpen={showAllProducts} onClose={() => setShowAllProducts(false)} products={services} onProductSelect={setSelectedProduct} />
      <ProductModal product={selectedProduct} onClose={() => setSelectedProduct(null)} contactInfo={content.contact_info} content={content} />

      {/* Gallery Modal */}
      {selectedGalleryImage && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-[#2D2D2D]/95 backdrop-blur-sm" onClick={() => setSelectedGalleryImage(null)}>
          <button className="absolute top-6 right-6 text-[#F7F3ED]/50 hover:text-[#F7F3ED] transition-colors">
            <X size={32} strokeWidth={1} />
          </button>
          <img loading="lazy" src={selectedGalleryImage} alt="Gallery view" className="max-w-full max-h-[90vh] object-contain shadow-2xl" onClick={(e) => e.stopPropagation()} />
        </div>
      )}
    </div>
  );
}
