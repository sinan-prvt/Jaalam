import React, { useState } from 'react';
import AllProductsModal from '../../shared/AllProductsModal';
import ProductModal from '../../shared/ProductModal';
import { Briefcase, X, Menu, ArrowRight } from 'lucide-react';
import { Facebook, Instagram, Twitter, Youtube, WhatsApp } from '../scrap/SocialIcons';

export default function MinimalConsultingTheme({ website, content }: any) {
  const [showAllProducts, setShowAllProducts] = useState(false);
  const [selectedProduct, setSelectedProduct] = React.useState<any>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [selectedGalleryImage, setSelectedGalleryImage] = React.useState<string | null>(null);
  
  const sectionOrder: string[] = content?.settings_json?.section_order || ['hero', 'about', 'services', 'menu', 'gallery', 'contact', 'custom'];
  const hiddenSections: string[] = content?.settings_json?.hidden_sections || [];
  const siteName = content.settings_json?.website_name || website.slug || 'Minimal Consulting';

  const services = content.products_json?.length > 0 ? content.products_json : [
    { name: 'Strategy', price: 'Inquire', image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=800&q=80', description: 'Clear, actionable strategies for modern businesses.' },
    { name: 'Operations', price: 'Inquire', image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=800&q=80', description: 'Streamlining processes and maximizing efficiency.' },
    { name: 'Advisory', price: 'Inquire', image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=800&q=80', description: 'Expert guidance on critical business decisions.' }
  ];

  const defaultServices = [
    { title: 'Clarity', description: 'Cutting through the noise to find what matters.' },
    { title: 'Focus', description: 'Concentrating resources on high-impact initiatives.' },
    { title: 'Results', description: 'Delivering measurable and sustainable value.' }
  ];

  return (
    <div className="min-h-screen theme-root flex flex-col bg-white text-black font-sans selection:bg-black selection:text-white">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');
        .font-minimal { font-family: 'Inter', sans-serif; }
      
        /* Dynamic Layout Ordering */
        .theme-root { display: flex; flex-direction: column; }
        .theme-root > header, .theme-root > nav { order: 0; }
        .theme-root > section:nth-of-type(1) { order: ${sectionOrder.indexOf('hero') + 1}; display: ${hiddenSections.includes('hero') ? 'none' : 'block'} }
        .theme-root > section:nth-of-type(2) { order: ${sectionOrder.indexOf('menu') + 1 > 0 ? sectionOrder.indexOf('menu') + 1 : sectionOrder.indexOf('products') + 1}; display: ${hiddenSections.includes('menu') ? 'none' : 'block'} }
        .theme-root > footer { order: 999; }
      `}</style>

      {/* Header */}
      <header className="bg-white sticky top-0 z-50">
        <div className="container mx-auto px-8 py-8 flex justify-between items-center">
          <div className="flex items-center gap-4">
            {content?.settings_json?.logo_image ? (
              <img src={content.settings_json.logo_image} alt={siteName} className="h-6 md:h-8 w-auto object-contain grayscale" />
            ) : (
              <div className="w-8 h-8 bg-black flex items-center justify-center">
                 <Briefcase className="text-white" size={16} />
              </div>
            )}
            <span className="font-minimal font-bold text-xl tracking-tighter uppercase">{siteName}</span>
          </div>
          <nav className="hidden md:flex gap-12 font-minimal text-xs font-semibold tracking-[0.2em] uppercase">
            <a href="#about" className="hover:opacity-50 transition-opacity">About</a>
            <a href="#services" className="hover:opacity-50 transition-opacity">Practice</a>
            <a href="#contact" className="hover:opacity-50 transition-opacity">Contact</a>
          </nav>
          <button className="md:hidden text-black" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden absolute top-full left-0 w-full bg-white border-t border-black/10 py-8 px-8 flex flex-col gap-6 font-minimal text-xs font-semibold tracking-[0.2em] uppercase shadow-xl">
            <a href="#about" onClick={() => setIsMobileMenuOpen(false)} className="hover:opacity-50 transition-opacity">About</a>
            <a href="#services" onClick={() => setIsMobileMenuOpen(false)} className="hover:opacity-50 transition-opacity">Practice</a>
            <a href="#contact" onClick={() => setIsMobileMenuOpen(false)} className="hover:opacity-50 transition-opacity">Contact</a>
          </div>
        )}
      </header>

      {/* Hero */}
      <section style={{ order: sectionOrder.indexOf('hero') + 1 }} className="relative pt-24 pb-32 px-8">
        <div className="container mx-auto max-w-5xl text-center">
          <h1 className="font-minimal text-5xl md:text-7xl lg:text-[100px] font-bold mb-10 leading-[0.9] tracking-tighter">
            {content.hero_title || 'Less noise. More signal.'}
          </h1>
          <p className="font-minimal text-xl md:text-2xl text-gray-500 mb-16 max-w-2xl mx-auto leading-relaxed font-light">
            {content.hero_text || 'We provide minimalist, high-impact consulting for the modern enterprise. We strip away the unnecessary to reveal the essential.'}
          </p>
          <a href="#contact" className="inline-block bg-black text-white font-minimal font-bold text-xs uppercase tracking-[0.2em] py-5 px-12 hover:bg-black/80 transition-colors">
            Engage Us
          </a>
        </div>
      </section>

      {/* Injected About Section */}
      {sectionOrder.includes('about') && !hiddenSections.includes('about') && (
        <section style={{ order: sectionOrder.indexOf('about') + 1 }} id="about" className="py-32 px-8 bg-gray-50">
          <div className="container mx-auto max-w-4xl">
             <div className="mb-12">
                <span className="font-minimal text-xs font-bold tracking-[0.2em] uppercase text-gray-400">01 / The Firm</span>
             </div>
            <h2 className="font-minimal text-3xl md:text-5xl font-bold mb-10 tracking-tight leading-tight">
              {content.settings_json?.about_title || content.about_title || 'Simplicity is the ultimate sophistication.'}
            </h2>
            <p className="font-minimal text-lg md:text-xl text-gray-500 leading-relaxed font-light">
              {content.about_text || 'Our philosophy is rooted in essentialism. We believe that organizations thrive when they eliminate the superfluous and focus relentlessly on their core strengths. We guide leaders through this process of simplification and strategic alignment.'}
            </p>
          </div>
        </section>
      )}

      {/* Services/Expertise (Menu) - "Practice" */}
      <section style={{ order: sectionOrder.indexOf('menu') + 1 || sectionOrder.indexOf('services') + 1 }} id="services" className="py-32 px-8">
        <div className="container mx-auto max-w-7xl">
          <div className="mb-20">
             <span className="font-minimal text-xs font-bold tracking-[0.2em] uppercase text-gray-400 block mb-4">02 / Practice Areas</span>
             <h2 className="font-minimal text-4xl md:text-6xl font-bold tracking-tighter">What we do.</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-y-16 gap-x-12">
            {services.slice(0, 6).map((service: any, i: number) => (
              <div key={i} className="group cursor-pointer" onClick={() => setSelectedProduct(service)}>
                <div className="aspect-[3/4] overflow-hidden mb-6 bg-gray-100">
                   <img src={service.image} alt={service.name} className="w-full h-full object-cover grayscale opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700" />
                </div>
                <h3 className="font-minimal text-2xl font-bold mb-3 tracking-tight">{service.name}</h3>
                <p className="font-minimal text-gray-500 mb-6 font-light">{service.description}</p>
                <span className="inline-flex items-center gap-2 font-minimal text-xs font-bold tracking-[0.2em] uppercase text-black/50 group-hover:text-black transition-colors">
                   Details <ArrowRight size={14} />
                </span>
              </div>
            ))}
          </div>
          
          <div className="mt-20 text-center">
             <button onClick={() => setShowAllProducts(true)} className="inline-flex items-center gap-4 font-minimal text-xs font-bold tracking-[0.2em] uppercase text-black hover:opacity-50 transition-opacity">
                View All Areas <ArrowRight size={16} />
             </button>
          </div>
        </div>
      </section>

      {/* Injected Value Proposition (Services) Section */}
      {sectionOrder.includes('services') && !hiddenSections.includes('services') && (
        <section style={{ order: sectionOrder.indexOf('services') + 1 }} className="py-32 px-8 bg-black text-white">
          <div className="container mx-auto max-w-6xl">
             <div className="mb-20">
                <span className="font-minimal text-xs font-bold tracking-[0.2em] uppercase text-gray-500 block mb-4">03 / Philosophy</span>
                <h2 className="font-minimal text-4xl md:text-6xl font-bold tracking-tighter">Our approach.</h2>
             </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-16">
              {(content.services_json?.length ? content.services_json : defaultServices).map((srv: any, i: number) => (
                <div key={i} className="border-t border-white/20 pt-8">
                  <h3 className="font-minimal text-2xl font-bold mb-4">{srv.title}</h3>
                  <p className="font-minimal text-gray-400 font-light leading-relaxed">{srv.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Gallery Section */}
      {sectionOrder.includes('gallery') && !hiddenSections.includes('gallery') && (
        <section style={{ order: sectionOrder.indexOf('gallery') + 1 }} id="gallery" className="py-32 px-8">
          <div className="container mx-auto max-w-7xl">
            <div className="mb-16">
               <span className="font-minimal text-xs font-bold tracking-[0.2em] uppercase text-gray-400 block">04 / Environment</span>
            </div>
            <div className="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6">
              {(content.gallery_json?.length > 0 ? content.gallery_json : [
                'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=800&q=80',
                'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?auto=format&fit=crop&w=800&q=80',
                'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=800&q=80'
              ]).map((img: string, i: number) => (
                <div key={i} className="break-inside-avoid cursor-pointer overflow-hidden bg-gray-50" onClick={() => setSelectedGalleryImage(img)}>
                  <img src={img} alt="Gallery item" className="w-full h-auto grayscale hover:grayscale-0 transition-all duration-700 hover:scale-105" />
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Dynamic Custom Section */}
      {sectionOrder.includes('custom') && !hiddenSections.includes('custom') && content?.custom_blocks_json?.length > 0 && (
        <section style={{ order: sectionOrder.indexOf('custom') + 1 }} className="py-32 px-8 bg-gray-50">
          <div className="container mx-auto max-w-4xl space-y-16">
            {content.custom_blocks_json.map((block: any) => {
              if (block.type === 'heading') return <h2 key={block.id} className="font-minimal text-4xl md:text-5xl font-bold tracking-tighter">{block.content}</h2>;
              if (block.type === 'paragraph') return <p key={block.id} className="font-minimal text-xl text-gray-500 font-light leading-relaxed">{block.content}</p>;
              if (block.type === 'image' && block.url) return <img key={block.id} src={block.url} alt="Custom" className="w-full grayscale" />;
              if (block.type === 'divider') return <hr key={block.id} className="border-t border-black/10" />;
              return null;
            })}
          </div>
        </section>
      )}

      {/* Contact Section */}
      {sectionOrder.includes('contact') && !hiddenSections.includes('contact') && (
        <section style={{ order: sectionOrder.indexOf('contact') + 1 }} id="contact" className="py-32 px-8">
          <div className="container mx-auto max-w-7xl">
            <div className="grid lg:grid-cols-2 gap-20">
              <div>
                <span className="font-minimal text-xs font-bold tracking-[0.2em] uppercase text-gray-400 block mb-4">05 / Contact</span>
                <h2 className="font-minimal text-5xl md:text-7xl font-bold tracking-tighter mb-12">Let's talk.</h2>
                <div className="space-y-10 font-minimal text-lg font-light text-gray-600">
                  <div className="flex flex-col gap-2">
                    <span className="text-xs font-bold tracking-[0.2em] uppercase text-black">Phone</span>
                    <p>{content.contact_info?.phone || '+1 800 000 0000'}</p>
                  </div>
                  <div className="flex flex-col gap-2">
                    <span className="text-xs font-bold tracking-[0.2em] uppercase text-black">Email</span>
                    <p>{content.contact_info?.email || 'hello@minimal.co'}</p>
                  </div>
                  <div className="flex flex-col gap-2">
                    <span className="text-xs font-bold tracking-[0.2em] uppercase text-black">Studio</span>
                    <p>{content.contact_info?.address || '100 Minimalist Way, City'}</p>
                  </div>
                </div>
              </div>
              <div className="border-l border-black/10 pl-8 md:pl-16 flex flex-col justify-between">
                <div>
                   <span className="font-minimal text-xs font-bold tracking-[0.2em] uppercase text-gray-400 block mb-8">Social</span>
                  {(content.contact_info?.facebook || content.contact_info?.instagram || content.contact_info?.twitter || content.contact_info?.youtube || content.contact_info?.whatsapp) ? (
                    <div className="flex flex-col gap-6">
                      {content.contact_info?.facebook && (
                        <a href={content.contact_info.facebook} target="_blank" rel="noreferrer" className="text-gray-500 hover:text-black transition-colors flex items-center gap-4">
                          <Facebook size={20} /> <span className="font-minimal text-sm uppercase tracking-widest font-semibold">Facebook</span>
                        </a>
                      )}
                      {content.contact_info?.instagram && (
                        <a href={content.contact_info.instagram} target="_blank" rel="noreferrer" className="text-gray-500 hover:text-black transition-colors flex items-center gap-4">
                          <Instagram size={20} /> <span className="font-minimal text-sm uppercase tracking-widest font-semibold">Instagram</span>
                        </a>
                      )}
                      {content.contact_info?.twitter && (
                        <a href={content.contact_info.twitter} target="_blank" rel="noreferrer" className="text-gray-500 hover:text-black transition-colors flex items-center gap-4">
                          <Twitter size={20} /> <span className="font-minimal text-sm uppercase tracking-widest font-semibold">Twitter</span>
                        </a>
                      )}
                      {content.contact_info?.youtube && (
                        <a href={content.contact_info.youtube} target="_blank" rel="noreferrer" className="text-gray-500 hover:text-black transition-colors flex items-center gap-4">
                          <Youtube size={20} /> <span className="font-minimal text-sm uppercase tracking-widest font-semibold">YouTube</span>
                        </a>
                      )}
                      {content.contact_info?.whatsapp && (
                        <a href={content.contact_info.whatsapp} target="_blank" rel="noreferrer" className="text-gray-500 hover:text-black transition-colors flex items-center gap-4">
                          <WhatsApp size={20} /> <span className="font-minimal text-sm uppercase tracking-widest font-semibold">WhatsApp</span>
                        </a>
                      )}
                    </div>
                  ) : (
                    <p className="text-gray-400 font-minimal text-sm">Social media links will appear here.</p>
                  )}
                </div>
              </div>
            </div>
            
            <div className="mt-20 w-full h-[400px] border border-black/10">
              <iframe
                title="Office Location Map"
                src={`https://maps.google.com/maps?q=${encodeURIComponent(content.contact_info?.address || '100 Minimalist Way, City')}&t=&z=13&ie=UTF8&iwloc=&output=embed`}
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
      <footer className="py-12 px-8 font-minimal border-t border-black/10">
        <div className="container mx-auto flex flex-col md:flex-row justify-between items-center gap-6 text-xs font-bold tracking-[0.2em] uppercase text-gray-400">
           <span>{siteName}</span>
           <span>© {new Date().getFullYear()}</span>
        </div>
      </footer>

      {/* Modals */}
      <AllProductsModal isOpen={showAllProducts} onClose={() => setShowAllProducts(false)} products={services} onProductSelect={setSelectedProduct} />
      <ProductModal product={selectedProduct} onClose={() => setSelectedProduct(null)} contactInfo={content.contact_info} />

      {/* Gallery Modal */}
      {selectedGalleryImage && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-white/95 backdrop-blur-sm" onClick={() => setSelectedGalleryImage(null)}>
          <button className="absolute top-6 right-6 text-black hover:opacity-50 transition-opacity">
            <X size={32} strokeWidth={1} />
          </button>
          <img src={selectedGalleryImage} alt="Gallery view" className="max-w-full max-h-[90vh] object-contain grayscale" onClick={(e) => e.stopPropagation()} />
        </div>
      )}
    </div>
  );
}
