import React, { useState } from 'react';
import AllProductsModal from '../../shared/AllProductsModal';
import ProductModal from '../../shared/ProductModal';
import { MapPin, Phone, Mail, X, Menu, ArrowRight, Activity, Cpu, Cloud, Zap } from 'lucide-react';
import { Facebook, Instagram, Twitter, Youtube, WhatsApp } from '../scrap/SocialIcons';

export default function TechStartupTheme({ website, content }: any) {
  const [showAllProducts, setShowAllProducts] = useState(false);
  const [selectedProduct, setSelectedProduct] = React.useState<any>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [selectedGalleryImage, setSelectedGalleryImage] = React.useState<string | null>(null);
  
  const sectionOrder: string[] = content?.settings_json?.section_order || ['hero', 'services', 'about', 'menu', 'gallery', 'contact', 'custom'];
  const hiddenSections: string[] = content?.settings_json?.hidden_sections || [];
  const siteName = content.settings_json?.website_name || website.slug || 'Tech Startup';

  const services = content.products_json?.length > 0 ? content.products_json : [
    { name: 'SaaS Platform', price: 'Enterprise', image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80', description: 'Scalable cloud infrastructure for modern applications.' },
    { name: 'Data Analytics', price: 'Pro', image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80', description: 'Real-time insights and predictive modeling.' },
    { name: 'Cyber Security', price: 'Custom', image: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=800&q=80', description: 'Advanced threat protection and monitoring.' }
  ];

  const defaultServices = [
    { title: 'Lightning Fast', description: 'Optimized performance for zero latency.' },
    { title: 'Highly Scalable', description: 'Architecture that grows with your business.' },
    { title: 'Secure by Design', description: 'Enterprise-grade security at every layer.' }
  ];

  return (
    <div className="min-h-screen theme-root flex flex-col bg-[#0A0A0F] text-[#E0E0E0] font-sans selection:bg-[#00D4FF] selection:text-[#0A0A0F]">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;700;800&family=Inter:wght@300;400;500;600;700&display=swap');
        .font-tech-title { font-family: 'JetBrains Mono', monospace; }
        .font-tech-body { font-family: 'Inter', sans-serif; }
      
        /* Dynamic Layout Ordering */
        .theme-root { display: flex; flex-direction: column; }
        .theme-root > header, .theme-root > nav { order: 0; }
        .theme-root > section:nth-of-type(1) { order: ${sectionOrder.indexOf('hero') + 1}; display: ${hiddenSections.includes('hero') ? 'none' : 'block'} }
        .theme-root > section:nth-of-type(2) { order: ${sectionOrder.indexOf('menu') + 1 > 0 ? sectionOrder.indexOf('menu') + 1 : sectionOrder.indexOf('products') + 1}; display: ${hiddenSections.includes('menu') ? 'none' : 'block'} }
        .theme-root > footer { order: 999; }
      `}</style>

      {/* Header */}
      <header className="bg-[#0A0A0F]/80 backdrop-blur-xl border-b border-white/5 sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3 group">
            {content?.settings_json?.logo_image ? (
              <img src={content.settings_json.logo_image} alt={siteName} className="h-8 md:h-10 w-auto object-contain" />
            ) : (
              <Activity className="text-[#00D4FF] group-hover:rotate-90 transition-transform duration-500" size={28} />
            )}
            <span className="font-tech-title font-bold text-xl tracking-tight text-white">{siteName}</span>
          </div>
          <nav className="hidden md:flex gap-8 font-tech-title text-sm font-bold text-gray-400 uppercase tracking-widest">
            <a href="#features" className="hover:text-[#00D4FF] transition-colors">Features</a>
            <a href="#about" className="hover:text-[#00D4FF] transition-colors">Mission</a>
            <a href="#solutions" className="hover:text-[#00D4FF] transition-colors">Solutions</a>
          </nav>
          <div className="hidden md:block">
             <a href="#contact" className="bg-[#00D4FF]/10 text-[#00D4FF] hover:bg-[#00D4FF] hover:text-[#0A0A0F] border border-[#00D4FF] font-tech-title font-bold text-xs uppercase px-6 py-2.5 transition-all duration-300 rounded-sm">
               Get Started
             </a>
          </div>
          <button className="md:hidden text-white" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden absolute top-full left-0 w-full bg-[#0A0A0F] border-b border-white/5 shadow-2xl py-6 px-6 flex flex-col gap-6 font-tech-title text-sm font-bold text-gray-400 uppercase tracking-widest">
            <a href="#features" onClick={() => setIsMobileMenuOpen(false)} className="hover:text-[#00D4FF] transition-colors">Features</a>
            <a href="#about" onClick={() => setIsMobileMenuOpen(false)} className="hover:text-[#00D4FF] transition-colors">Mission</a>
            <a href="#solutions" onClick={() => setIsMobileMenuOpen(false)} className="hover:text-[#00D4FF] transition-colors">Solutions</a>
            <a href="#contact" onClick={() => setIsMobileMenuOpen(false)} className="bg-[#00D4FF]/10 text-[#00D4FF] border border-[#00D4FF] px-6 py-3 text-center transition-all duration-300 mt-4 rounded-sm">
               Get Started
            </a>
          </div>
        )}
      </header>

      {/* Hero */}
      <section style={{ order: sectionOrder.indexOf('hero') + 1 }} className="relative pt-32 pb-24 px-6 overflow-hidden">
        {/* Tech Grid Background */}
        <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'linear-gradient(#00D4FF 1px, transparent 1px), linear-gradient(90deg, #00D4FF 1px, transparent 1px)', backgroundSize: '40px 40px' }}></div>
        
        {/* Glowing Orb */}
        <div className="absolute top-1/4 right-1/4 w-[40vw] h-[40vw] max-w-[500px] max-h-[500px] bg-[#00D4FF] rounded-full mix-blend-screen filter blur-[120px] opacity-20"></div>

        <div className="container mx-auto max-w-5xl relative z-10 text-center">
          <div className="inline-flex items-center gap-2 bg-[#00D4FF]/10 border border-[#00D4FF]/30 text-[#00D4FF] rounded-full px-4 py-1.5 font-tech-title text-xs font-bold uppercase tracking-wider mb-8">
             <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#00D4FF] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#00D4FF]"></span>
            </span>
             System Online v2.4
          </div>
          <h1 className="font-tech-title text-5xl md:text-7xl font-extrabold text-white mb-8 leading-tight tracking-tighter">
            {content.hero_title || 'Building the future of digital infrastructure.'}
          </h1>
          <p className="font-tech-body text-xl text-gray-400 mb-12 max-w-2xl mx-auto leading-relaxed">
            {content.hero_text || 'Empowering teams with next-generation tools, seamless integration, and unprecedented performance.'}
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
             <a href="#contact" className="w-full sm:w-auto bg-[#00D4FF] text-[#0A0A0F] font-tech-title font-bold uppercase tracking-wider py-4 px-10 hover:bg-white hover:shadow-[0_0_30px_rgba(0,212,255,0.4)] transition-all duration-300 rounded-sm">
                Request Demo
             </a>
             <a href="#features" className="w-full sm:w-auto bg-transparent border border-white/20 text-white font-tech-title font-bold uppercase tracking-wider py-4 px-10 hover:bg-white/5 transition-all duration-300 rounded-sm">
                Explore API
             </a>
          </div>
        </div>
      </section>

      {/* Injected Value Proposition (Services) Section */}
      {sectionOrder.includes('services') && !hiddenSections.includes('services') && (
        <section style={{ order: sectionOrder.indexOf('services') + 1 }} id="features" className="py-24 px-6 border-y border-white/5 bg-gradient-to-b from-[#0A0A0F] to-[#12121A]">
          <div className="container mx-auto max-w-6xl">
             <div className="text-center mb-16">
               <h2 className="font-tech-title text-sm font-bold text-[#00D4FF] uppercase tracking-widest mb-2">Core Capabilities</h2>
               <p className="font-tech-body text-3xl font-bold text-white">Engineered for Scale</p>
             </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {(content.services_json?.length ? content.services_json : defaultServices).map((srv: any, i: number) => {
                 const icons = [<Zap size={24} className="text-[#00D4FF]" />, <Cpu size={24} className="text-[#00D4FF]" />, <Cloud size={24} className="text-[#00D4FF]" />];
                 return (
                  <div key={i} className="bg-[#181824] border border-white/5 p-8 hover:border-[#00D4FF]/30 transition-colors group rounded-lg relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-24 h-24 bg-[#00D4FF]/5 rounded-bl-full group-hover:scale-150 transition-transform duration-500"></div>
                    <div className="w-12 h-12 bg-[#00D4FF]/10 rounded-md flex items-center justify-center mb-6 relative z-10">
                      {srv.image ? <img src={srv.image} alt={srv.title} className="w-6 h-6 object-contain" /> : icons[i % icons.length]}
                    </div>
                    <h3 className="font-tech-title text-xl font-bold mb-3 text-white relative z-10">{srv.title}</h3>
                    <p className="font-tech-body text-gray-400 leading-relaxed relative z-10">{srv.description}</p>
                  </div>
                )
              })}
            </div>
          </div>
        </section>
      )}

      {/* Services/Expertise (Menu) - "Solutions" */}
      <section style={{ order: sectionOrder.indexOf('menu') + 1 || sectionOrder.indexOf('services') + 1 }} id="solutions" className="py-24 px-6">
        <div className="container mx-auto max-w-6xl">
          <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6 border-b border-white/10 pb-8">
             <div>
                <h2 className="font-tech-title text-sm font-bold text-[#00D4FF] uppercase tracking-widest mb-2">Product Suite</h2>
                <h3 className="font-tech-body text-4xl font-bold text-white tracking-tight">Ecosystem Solutions</h3>
             </div>
             <p className="font-tech-body text-gray-400 max-w-md">
                Modular components designed to seamlessly integrate and accelerate your development cycle.
             </p>
          </div>
          
          <div className="space-y-6">
            {services.slice(0, 6).map((service: any, i: number) => (
              <div key={i} className="group cursor-pointer bg-[#12121A] border border-white/5 hover:border-[#00D4FF]/50 p-6 md:p-8 flex flex-col md:flex-row items-center gap-8 transition-all duration-300 rounded-lg" onClick={() => setSelectedProduct(service)}>
                <div className="w-full md:w-1/3 aspect-video bg-[#181824] overflow-hidden rounded-md">
                   <img src={service.image} alt={service.name} className="w-full h-full object-cover mix-blend-luminosity opacity-60 group-hover:mix-blend-normal group-hover:opacity-100 transition-all duration-500" />
                </div>
                <div className="w-full md:w-2/3">
                  <div className="flex justify-between items-start mb-4">
                     <h3 className="font-tech-title text-2xl font-bold text-white">{service.name}</h3>
                     <span className="font-tech-title text-xs font-bold bg-white/10 text-white px-3 py-1 rounded-sm uppercase">{service.price}</span>
                  </div>
                  <p className="font-tech-body text-gray-400 mb-6 max-w-xl line-clamp-2">{service.description}</p>
                  <div className="inline-flex items-center gap-2 text-[#00D4FF] font-tech-title text-sm font-bold uppercase tracking-wider group-hover:translate-x-2 transition-transform">
                     View Details <ArrowRight size={16} />
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          <div className="mt-12 text-center">
             <button onClick={() => setShowAllProducts(true)} className="inline-flex items-center gap-2 bg-white/5 hover:bg-[#00D4FF]/10 text-white hover:text-[#00D4FF] border border-white/10 hover:border-[#00D4FF]/50 font-tech-title font-bold uppercase tracking-wider py-3 px-8 transition-all duration-300 rounded-sm">
                View All Solutions <ArrowRight size={18} />
             </button>
          </div>
        </div>
      </section>

      {/* Injected About Section */}
      {sectionOrder.includes('about') && !hiddenSections.includes('about') && (
        <section style={{ order: sectionOrder.indexOf('about') + 1 }} id="about" className="py-24 px-6 bg-[#00D4FF] text-[#0A0A0F]">
          <div className="container mx-auto max-w-4xl text-center">
            <h2 className="font-tech-title text-3xl md:text-5xl font-extrabold mb-8 uppercase tracking-tighter">
              {content.settings_json?.about_title || content.about_title || 'Redefining the standard.'}
            </h2>
            <p className="font-tech-body text-xl md:text-2xl font-medium leading-relaxed max-w-3xl mx-auto">
              {content.about_text || 'We are a team of engineers, designers, and innovators obsessed with pushing the boundaries of what is possible in the digital realm.'}
            </p>
          </div>
        </section>
      )}

      {/* Gallery Section */}
      {sectionOrder.includes('gallery') && !hiddenSections.includes('gallery') && (
        <section style={{ order: sectionOrder.indexOf('gallery') + 1 }} id="gallery" className="py-24 px-6 bg-[#0A0A0F]">
          <div className="container mx-auto max-w-7xl">
            <h2 className="font-tech-title text-sm font-bold text-[#00D4FF] uppercase tracking-widest mb-12 text-center">Interface Preview</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {(content.gallery_json?.length > 0 ? content.gallery_json : [
                'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80',
                'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=800&q=80',
                'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=800&q=80',
                'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=800&q=80'
              ]).map((img: string, i: number) => (
                <div key={i} className="aspect-video bg-[#181824] rounded-md overflow-hidden cursor-pointer group" onClick={() => setSelectedGalleryImage(img)}>
                  <img src={img} alt="Gallery item" className="w-full h-full object-cover opacity-60 group-hover:opacity-100 transition-opacity duration-300" />
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Dynamic Custom Section */}
      {sectionOrder.includes('custom') && !hiddenSections.includes('custom') && content?.custom_blocks_json?.length > 0 && (
        <section style={{ order: sectionOrder.indexOf('custom') + 1 }} className="py-24 px-6 bg-[#12121A] border-y border-white/5">
          <div className="container mx-auto max-w-4xl space-y-12">
            {content.custom_blocks_json.map((block: any) => {
              if (block.type === 'heading') return <h2 key={block.id} className="font-tech-title text-3xl md:text-4xl font-bold text-white">{`// ${block.content}`}</h2>;
              if (block.type === 'paragraph') return <p key={block.id} className="font-tech-body text-lg text-gray-400 leading-relaxed">{block.content}</p>;
              if (block.type === 'image' && block.url) return <img key={block.id} src={block.url} alt="Custom" className="w-full rounded-lg border border-white/10" />;
              if (block.type === 'divider') return <hr key={block.id} className="border-t border-white/10" />;
              return null;
            })}
          </div>
        </section>
      )}

      {/* Contact Section */}
      {sectionOrder.includes('contact') && !hiddenSections.includes('contact') && (
        <section style={{ order: sectionOrder.indexOf('contact') + 1 }} id="contact" className="py-24 px-6 relative overflow-hidden">
          {/* Tech Grid Background */}
          <div className="absolute inset-0 opacity-[0.02]" style={{ backgroundImage: 'linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)', backgroundSize: '40px 40px' }}></div>
          
          <div className="container mx-auto max-w-4xl relative z-10">
            <div className="bg-[#181824] border border-white/10 rounded-2xl p-10 md:p-16 flex flex-col md:flex-row gap-12 justify-between items-center relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#00D4FF] to-transparent"></div>
              
              <div className="w-full md:w-1/2">
                <h2 className="font-tech-title text-4xl font-extrabold text-white mb-4 tracking-tighter">Ready to deploy?</h2>
                <p className="font-tech-body text-gray-400 mb-8">Get in touch with our team to discuss integration options.</p>
                
                <div className="space-y-6 font-tech-title text-sm text-gray-300">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-white/5 rounded-full flex items-center justify-center">
                       <Phone className="text-[#00D4FF]" size={18} />
                    </div>
                    <p>{content.contact_info?.phone || '1-800-STARTUP'}</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-white/5 rounded-full flex items-center justify-center">
                       <Mail className="text-[#00D4FF]" size={18} />
                    </div>
                    <p>{content.contact_info?.email || 'hello@techstartup.io'}</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-white/5 rounded-full flex items-center justify-center">
                       <MapPin className="text-[#00D4FF]" size={18} />
                    </div>
                    <p>{content.contact_info?.address || 'Silicon Valley, CA'}</p>
                  </div>
                </div>
              </div>

              <div className="w-full md:w-auto">
                 <h3 className="font-tech-title text-sm font-bold text-[#00D4FF] uppercase tracking-widest mb-6 md:text-right">Social Network</h3>
                {(content.contact_info?.facebook || content.contact_info?.instagram || content.contact_info?.twitter || content.contact_info?.youtube || content.contact_info?.whatsapp) ? (
                  <div className="flex gap-4 md:justify-end flex-wrap">
                    {content.contact_info?.facebook && (
                      <a href={content.contact_info.facebook} target="_blank" rel="noreferrer" className="w-12 h-12 bg-[#0A0A0F] border border-white/10 rounded-md flex items-center justify-center hover:border-[#00D4FF] hover:text-[#00D4FF] transition-all">
                        <Facebook size={20} />
                      </a>
                    )}
                    {content.contact_info?.instagram && (
                      <a href={content.contact_info.instagram} target="_blank" rel="noreferrer" className="w-12 h-12 bg-[#0A0A0F] border border-white/10 rounded-md flex items-center justify-center hover:border-[#00D4FF] hover:text-[#00D4FF] transition-all">
                        <Instagram size={20} />
                      </a>
                    )}
                    {content.contact_info?.twitter && (
                      <a href={content.contact_info.twitter} target="_blank" rel="noreferrer" className="w-12 h-12 bg-[#0A0A0F] border border-white/10 rounded-md flex items-center justify-center hover:border-[#00D4FF] hover:text-[#00D4FF] transition-all">
                        <Twitter size={20} />
                      </a>
                    )}
                    {content.contact_info?.youtube && (
                      <a href={content.contact_info.youtube} target="_blank" rel="noreferrer" className="w-12 h-12 bg-[#0A0A0F] border border-white/10 rounded-md flex items-center justify-center hover:border-[#00D4FF] hover:text-[#00D4FF] transition-all">
                        <Youtube size={20} />
                      </a>
                    )}
                    {content.contact_info?.whatsapp && (
                      <a href={content.contact_info.whatsapp} target="_blank" rel="noreferrer" className="w-12 h-12 bg-[#0A0A0F] border border-white/10 rounded-md flex items-center justify-center hover:border-[#00D4FF] hover:text-[#00D4FF] transition-all">
                        <WhatsApp size={20} />
                      </a>
                    )}
                  </div>
                ) : (
                  <p className="text-gray-500 font-tech-body text-sm md:text-right">Social links will appear here.</p>
                )}
              </div>
            </div>
            
            <div className="mt-16 w-full h-[400px] border border-white/10 rounded-md p-1 bg-[#0A0A0F]">
              <iframe
                title="Office Location Map"
                src={`https://maps.google.com/maps?q=${encodeURIComponent(content.contact_info?.address || 'Silicon Valley, CA')}&t=&z=13&ie=UTF8&iwloc=&output=embed`}
                width="100%"
                height="100%"
                style={{ border: 0, borderRadius: '4px' }}
                allowFullScreen={false}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              ></iframe>
            </div>
          </div>
        </section>
      )}

      {/* Footer */}
      <footer className="bg-[#050508] py-8 px-6 font-tech-title text-xs text-gray-500 text-center border-t border-white/5">
        <div className="container mx-auto">
          <p>SYSTEM_ID: {siteName.toUpperCase().replace(/\s+/g, '_')} // © {new Date().getFullYear()} ALL RIGHTS RESERVED.</p>
        </div>
      </footer>

      {/* Modals */}
      <AllProductsModal isOpen={showAllProducts} onClose={() => setShowAllProducts(false)} products={services} onProductSelect={setSelectedProduct} />
      <ProductModal product={selectedProduct} onClose={() => setSelectedProduct(null)} contactInfo={content.contact_info} />

      {/* Gallery Modal */}
      {selectedGalleryImage && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-[#0A0A0F]/95 backdrop-blur-md" onClick={() => setSelectedGalleryImage(null)}>
          <button className="absolute top-6 right-6 text-gray-400 hover:text-white transition-colors">
            <X size={32} />
          </button>
          <img src={selectedGalleryImage} alt="Gallery view" className="max-w-full max-h-[90vh] object-contain rounded-lg border border-white/10" onClick={(e) => e.stopPropagation()} />
        </div>
      )}
    </div>
  );
}
