import React, { useState } from 'react';
import AllProductsModal from '../../shared/AllProductsModal';
import ProductModal from '../../shared/ProductModal';
import { MapPin, Phone, Mail, X, Menu, ArrowUpRight, Palette, Code, Megaphone } from 'lucide-react';
import { Facebook, Instagram, Twitter, Youtube, WhatsApp } from '../scrap/SocialIcons';

export default function CreativeAgencyTheme({ website, content }: any) {
  const [showAllProducts, setShowAllProducts] = useState(false);
  const [selectedProduct, setSelectedProduct] = React.useState<any>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [selectedGalleryImage, setSelectedGalleryImage] = React.useState<string | null>(null);
  
  const sectionOrder: string[] = content?.settings_json?.section_order || ['hero', 'about', 'services', 'menu', 'gallery', 'contact', 'custom'];
  const hiddenSections: string[] = content?.settings_json?.hidden_sections || [];
  const siteName = content.settings_json?.website_name || website.slug || 'Creative Studio';

  const services = content.products_json?.length > 0 ? content.products_json : [
    { name: 'Brand Identity', price: 'Custom', image: 'https://images.unsplash.com/photo-1626785774573-4b799315345d?auto=format&fit=crop&w=800&q=80', description: 'Crafting cohesive and impactful brand identities from scratch.' },
    { name: 'UI/UX Design', price: 'Custom', image: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?auto=format&fit=crop&w=800&q=80', description: 'Designing intuitive and beautiful digital experiences.' },
    { name: 'Digital Marketing', price: 'Custom', image: 'https://images.unsplash.com/photo-1533750516457-a7f992034fec?auto=format&fit=crop&w=800&q=80', description: 'Data-driven marketing campaigns that convert.' }
  ];

  const defaultServices = [
    { title: 'Bold Ideas', description: 'We push boundaries to create work that stands out.' },
    { title: 'Pixel Perfect', description: 'Meticulous attention to every detail.' },
    { title: 'Human Centric', description: 'Designing for real people, solving real problems.' }
  ];

  return (
    <div className="min-h-screen theme-root flex flex-col bg-[#FDFBF7] text-[#1A1A1A] font-sans overflow-hidden">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,400;import ProductBuyButton from '../../payments/ProductBuyButton';
0,9..40,500;0,9..40,700;1,9..40,400&family=Poppins:wght@400;600;800;900&display=swap');
        .font-creative-title { font-family: 'Poppins', sans-serif; }
        .font-creative-body { font-family: 'DM Sans', sans-serif; }
      
        /* Dynamic Layout Ordering */
        .theme-root { display: flex; flex-direction: column; }
        .theme-root > header, .theme-root > nav { order: 0; }
        .theme-root > section:nth-of-type(1) { order: ${sectionOrder.indexOf('hero') + 1}; display: ${hiddenSections.includes('hero') ? 'none' : 'block'} }
        .theme-root > section:nth-of-type(2) { order: ${sectionOrder.indexOf('menu') + 1 > 0 ? sectionOrder.indexOf('menu') + 1 : sectionOrder.indexOf('products') + 1}; display: ${hiddenSections.includes('menu') ? 'none' : 'block'} }
        .theme-root > footer { order: 999; }
      `}</style>

      {/* Header */}
      <header className="bg-transparent absolute top-0 w-full z-50">
        <div className="container mx-auto px-6 py-6 flex justify-between items-center">
          <div className="flex items-center gap-2">
            {content?.settings_json?.logo_image ? (
              <img loading="lazy" src={content.settings_json.logo_image} alt={siteName} className="h-10 w-auto object-contain" />
            ) : (
              <div className="w-10 h-10 bg-gradient-to-tr from-[#FF0055] to-[#7000FF] rounded-xl flex items-center justify-center">
                <span className="font-creative-title font-black text-white text-xl">{siteName.charAt(0)}</span>
              </div>
            )}
            <span className="font-creative-title font-black text-2xl tracking-tight mix-blend-difference text-white">{siteName}</span>
          </div>
          <nav className="hidden md:flex items-center gap-8 font-creative-title text-sm font-semibold tracking-wide mix-blend-difference text-white">
            <a href="#work" className="hover:text-[#FF0055] transition-colors uppercase">Our Work</a>
            <a href="#about" className="hover:text-[#FF0055] transition-colors uppercase">Studio</a>
            <a href="#contact" className="hover:text-[#FF0055] transition-colors uppercase">Let's Talk</a>
          </nav>
          <button className="md:hidden mix-blend-difference text-white" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
            {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden absolute top-full left-0 w-full bg-[#1A1A1A] text-white py-8 px-6 flex flex-col gap-6 font-creative-title text-xl font-bold uppercase shadow-2xl">
            <a href="#work" onClick={() => setIsMobileMenuOpen(false)} className="hover:text-[#FF0055] transition-colors">Our Work</a>
            <a href="#about" onClick={() => setIsMobileMenuOpen(false)} className="hover:text-[#FF0055] transition-colors">Studio</a>
            <a href="#contact" onClick={() => setIsMobileMenuOpen(false)} className="hover:text-[#FF0055] transition-colors">Let's Talk</a>
          </div>
        )}
      </header>

      {/* Hero */}
      <section style={{ order: sectionOrder.indexOf('hero') + 1 }} className="relative min-h-[90vh] flex items-center justify-center pt-24 pb-16 px-6 bg-[#1A1A1A]">
        {/* Background Gradients */}
        <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] bg-[#7000FF] rounded-full mix-blend-screen filter blur-[120px] opacity-60 animate-pulse"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-[#FF0055] rounded-full mix-blend-screen filter blur-[100px] opacity-50"></div>
        <div className="absolute top-[30%] right-[20%] w-[300px] h-[300px] bg-[#FFB800] rounded-full mix-blend-screen filter blur-[80px] opacity-40"></div>

        <div className="container mx-auto relative z-10 text-center">
          <h1 className="font-creative-title text-6xl md:text-8xl lg:text-[120px] font-black text-white leading-[0.9] tracking-tighter mb-8">
            <span className="block">{content.hero_title || 'WE BUILD'}</span>
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-[#FF0055] to-[#7000FF]">BRANDS</span>
          </h1>
          <p className="font-creative-body text-xl md:text-2xl text-white/80 max-w-2xl mx-auto mb-12 font-medium">
            {content.hero_text || 'A full-service creative agency combining strategy, design, and technology to craft unforgettable experiences.'}
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
             <a href="#contact" className="px-8 py-4 bg-white text-[#1A1A1A] font-creative-title font-bold uppercase tracking-wider rounded-full hover:bg-transparent hover:text-white border-2 border-white transition-all duration-300 w-full sm:w-auto">
                Start a Project
             </a>
             <a href="#work" className="px-8 py-4 bg-transparent text-white border-2 border-white/20 font-creative-title font-bold uppercase tracking-wider rounded-full hover:border-white transition-all duration-300 flex items-center justify-center gap-2 w-full sm:w-auto">
                View Work <ArrowUpRight size={20} />
             </a>
          </div>
        </div>
      </section>

      {/* Injected Value Proposition (Services) Section */}
      {sectionOrder.includes('services') && !hiddenSections.includes('services') && (
        <section style={{ order: sectionOrder.indexOf('services') + 1 }} className="py-24 px-6 bg-[#FDFBF7]">
          <div className="container mx-auto max-w-7xl">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12 lg:gap-20">
              {(content.services_json?.length ? content.services_json : defaultServices).map((srv: any, i: number) => {
                 const icons = [<Palette size={40} className="text-[#FF0055]" />, <Code size={40} className="text-[#7000FF]" />, <Megaphone size={40} className="text-[#FFB800]" />];
                 return (
                  <div key={i} className="flex flex-col">
                    <div className="mb-6">
                      {srv.image ? <img loading="lazy" src={srv.image} alt={srv.title} className="w-12 h-12 object-contain" /> : icons[i % icons.length]}
                    </div>
                    <h3 className="font-creative-title text-3xl font-bold mb-4 text-[#1A1A1A]">{srv.title}</h3>
                    <p className="font-creative-body text-lg text-gray-600 leading-relaxed">{srv.description}</p>
                  </div>
                )
              })}
            </div>
          </div>
        </section>
      )}

      {/* Services/Expertise (Menu) - "Our Work" */}
      <section style={{ order: sectionOrder.indexOf('menu') + 1 || sectionOrder.indexOf('services') + 1 }} id="work" className="py-24 px-6 bg-[#1A1A1A] text-white">
        <div className="container mx-auto max-w-7xl">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-16 gap-6">
             <h2 className="font-creative-title text-5xl md:text-7xl font-black tracking-tighter">SELECTED<br/><span className="text-[#FF0055]">WORK</span></h2>
             <p className="font-creative-body text-lg text-white/60 max-w-sm">
                A showcase of our best projects, highlighting our approach to design and strategy.
             </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.slice(0, 6).map((service: any, i: number) => (
              <div key={i} className="group cursor-pointer rounded-3xl bg-[#2A2A2A] overflow-hidden" onClick={() => setSelectedProduct(service)}>
                <div className="aspect-[4/5] overflow-hidden relative">
                   <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent z-10"></div>
                   <img loading="lazy" src={service.image} alt={service.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                   
                   <div className="absolute bottom-0 left-0 p-8 z-20 w-full transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                      <div className="inline-block px-3 py-1 bg-white/10 backdrop-blur-md rounded-full text-xs font-creative-title uppercase tracking-wider mb-3">
                         {service.price}
                      </div>
<div className="mt-2 w-full" onClick={(e) => e.stopPropagation()}><ProductBuyButton product={service} content={content} /></div>
                      <h3 className="font-creative-title text-3xl font-bold text-white mb-2">{service.name}</h3>
                      <div className="w-12 h-1 bg-gradient-to-r from-[#FF0055] to-[#7000FF] rounded-full transform origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-500"></div>
                   </div>
                </div>
              </div>
            ))}
          </div>
          
          <div className="mt-16 text-center">
             <button onClick={() => setShowAllProducts(true)} className="px-8 py-4 bg-transparent text-white border-2 border-white/20 font-creative-title font-bold uppercase tracking-wider rounded-full hover:border-white transition-all duration-300 flex items-center justify-center gap-2 mx-auto">
                View All Work <ArrowUpRight size={20} />
             </button>
          </div>
        </div>
      </section>

      {/* Injected About Section */}
      {sectionOrder.includes('about') && !hiddenSections.includes('about') && (
        <section style={{ order: sectionOrder.indexOf('about') + 1 }} id="about" className="py-32 px-6 bg-[#FDFBF7]">
          <div className="container mx-auto max-w-5xl text-center">
            <h2 className="font-creative-title text-4xl md:text-6xl font-black tracking-tighter mb-8 text-[#1A1A1A]">
              {content.settings_json?.about_title || content.about_title || 'WE ARE A CREATIVE COLLECTIVE'}
            </h2>
            <p className="font-creative-body text-2xl md:text-3xl text-gray-600 leading-tight md:leading-snug font-medium">
              {content.about_text || 'Born from a desire to do things differently. We blend strategic thinking with fearless creativity to build brands that matter and experiences that resonate.'}
            </p>
          </div>
        </section>
      )}

      {/* Gallery Section */}
      {sectionOrder.includes('gallery') && !hiddenSections.includes('gallery') && (
        <section style={{ order: sectionOrder.indexOf('gallery') + 1 }} id="gallery" className="py-24 px-6 bg-white overflow-hidden">
          <div className="container mx-auto max-w-7xl">
            <h2 className="font-creative-title text-4xl md:text-5xl font-black tracking-tighter mb-12 text-[#1A1A1A]">BEHIND THE SCENES</h2>
            <div className="flex flex-wrap gap-4 justify-center">
              {(content.gallery_json?.length > 0 ? content.gallery_json : [
                'https://images.unsplash.com/photo-1600880292203-757bb62b4baf?auto=format&fit=crop&w=800&q=80',
                'https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=800&q=80',
                'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?auto=format&fit=crop&w=800&q=80',
                'https://images.unsplash.com/photo-1531973576160-7125cd663d86?auto=format&fit=crop&w=800&q=80'
              ]).map((img: string, i: number) => (
                <div key={i} className={`flex-grow h-[300px] cursor-pointer overflow-hidden rounded-3xl ${i % 3 === 0 ? 'w-full md:w-[60%]' : 'w-full md:w-[35%]'}`} onClick={() => setSelectedGalleryImage(img)}>
                  <img loading="lazy" src={img} alt="Gallery item" className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" />
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Dynamic Custom Section */}
      {sectionOrder.includes('custom') && !hiddenSections.includes('custom') && content?.custom_blocks_json?.length > 0 && (
        <section style={{ order: sectionOrder.indexOf('custom') + 1 }} className="py-24 px-6 bg-[#FDFBF7]">
          <div className="container mx-auto max-w-4xl space-y-12">
            {content.custom_blocks_json.map((block: any) => {
              if (block.type === 'heading') return <h2 key={block.id} className="font-creative-title text-4xl md:text-5xl font-black tracking-tighter text-[#1A1A1A]">{block.content}</h2>;
              if (block.type === 'paragraph') return <p key={block.id} className="font-creative-body text-xl text-gray-600 leading-relaxed">{block.content}</p>;
              if (block.type === 'image' && block.url) return <img loading="lazy" key={block.id} src={block.url} alt="Custom" className="w-full rounded-3xl shadow-xl" />;
              if (block.type === 'divider') return <hr key={block.id} className="border-t-2 border-black/10 my-16" />;
              return null;
            })}
          </div>
        </section>
      )}

      {/* Contact Section */}
      {sectionOrder.includes('contact') && !hiddenSections.includes('contact') && (
        <section style={{ order: sectionOrder.indexOf('contact') + 1 }} id="contact" className="py-24 px-6 bg-[#7000FF] text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-[#FF0055] rounded-full mix-blend-multiply filter blur-[150px] opacity-70 translate-x-1/2 -translate-y-1/4"></div>
          
          <div className="container mx-auto max-w-7xl relative z-10">
            <div className="grid lg:grid-cols-2 gap-16 items-center">
              <div>
                <h2 className="font-creative-title text-6xl md:text-8xl font-black tracking-tighter mb-8 leading-[0.9]">
                  LET'S BUILD<br/>SOMETHING<br/>GREAT.
                </h2>
                <div className="space-y-6 font-creative-title text-xl font-medium">
                  <div className="flex items-center gap-4">
                    <Phone className="text-[#FFB800]" size={28} />
                    <p>{content.contact_info?.phone || '+1 (555) 987-6543'}</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <Mail className="text-[#FFB800]" size={28} />
                    <p>{content.contact_info?.email || 'hello@creativestudio.com'}</p>
                  </div>
                  <div className="flex items-start gap-4">
                    <MapPin className="text-[#FFB800] mt-1 shrink-0" size={28} />
                    <p>{content.contact_info?.address || '456 Innovation Blvd, Design District, NY'}</p>
                  </div>
                </div>
              </div>
              <div className="bg-white/10 backdrop-blur-xl rounded-[3rem] p-10 md:p-14 border border-white/20">
                <h3 className="font-creative-title text-3xl font-bold mb-8">Follow Our Journey</h3>
                {(content.contact_info?.facebook || content.contact_info?.instagram || content.contact_info?.twitter || content.contact_info?.youtube || content.contact_info?.whatsapp) ? (
                  <div className="flex flex-wrap gap-6">
                    {content.contact_info?.facebook && (
                      <a href={content.contact_info.facebook} target="_blank" rel="noreferrer" className="w-16 h-16 rounded-full bg-white text-[#7000FF] flex items-center justify-center hover:bg-[#FF0055] hover:text-white transition-all hover:scale-110">
                        <Facebook size={28} />
                      </a>
                    )}
                    {content.contact_info?.instagram && (
                      <a href={content.contact_info.instagram} target="_blank" rel="noreferrer" className="w-16 h-16 rounded-full bg-white text-[#7000FF] flex items-center justify-center hover:bg-[#FF0055] hover:text-white transition-all hover:scale-110">
                        <Instagram size={28} />
                      </a>
                    )}
                    {content.contact_info?.twitter && (
                      <a href={content.contact_info.twitter} target="_blank" rel="noreferrer" className="w-16 h-16 rounded-full bg-white text-[#7000FF] flex items-center justify-center hover:bg-[#FF0055] hover:text-white transition-all hover:scale-110">
                        <Twitter size={28} />
                      </a>
                    )}
                    {content.contact_info?.youtube && (
                      <a href={content.contact_info.youtube} target="_blank" rel="noreferrer" className="w-16 h-16 rounded-full bg-white text-[#7000FF] flex items-center justify-center hover:bg-[#FF0055] hover:text-white transition-all hover:scale-110">
                        <Youtube size={28} />
                      </a>
                    )}
                    {content.contact_info?.whatsapp && (
                      <a href={content.contact_info.whatsapp} target="_blank" rel="noreferrer" className="w-16 h-16 rounded-full bg-white text-[#7000FF] flex items-center justify-center hover:bg-[#FF0055] hover:text-white transition-all hover:scale-110">
                        <WhatsApp size={28} />
                      </a>
                    )}
                  </div>
                ) : (
                  <p className="text-white/70 font-creative-body text-lg">Social media links will appear here once added in the editor.</p>
                )}
              </div>
            </div>
            
            <div className="mt-16 w-full h-[400px] rounded-[3rem] overflow-hidden border-2 border-white/20">
              <iframe
                title="Office Location Map"
                src={`https://maps.google.com/maps?q=${encodeURIComponent(content.contact_info?.address || '77 Innovation Way, San Francisco, CA')}&t=&z=13&ie=UTF8&iwloc=&output=embed`}
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
      <footer className="bg-[#1A1A1A] text-white/50 py-12 px-6 font-creative-body text-center border-t border-white/10">
        <div className="container mx-auto flex flex-col items-center justify-center gap-6">
           <span className="font-creative-title font-black text-3xl tracking-tight text-white">{siteName}</span>
          <p className="font-medium text-sm tracking-wide uppercase">© {new Date().getFullYear()} {siteName}. All rights reserved.</p>
        </div>
      </footer>

      {/* Modals */}
      <AllProductsModal isOpen={showAllProducts} onClose={() => setShowAllProducts(false)} products={services} onProductSelect={setSelectedProduct} />
      <ProductModal product={selectedProduct} onClose={() => setSelectedProduct(null)} contactInfo={content.contact_info} />

      {/* Gallery Modal */}
      {selectedGalleryImage && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-[#1A1A1A]/95 backdrop-blur-xl" onClick={() => setSelectedGalleryImage(null)}>
          <button className="absolute top-6 right-6 text-white/50 hover:text-white transition-colors bg-white/10 rounded-full p-2">
            <X size={24} />
          </button>
          <img loading="lazy" src={selectedGalleryImage} alt="Gallery view" className="max-w-full max-h-[90vh] object-contain rounded-2xl shadow-2xl" onClick={(e) => e.stopPropagation()} />
        </div>
      )}
    </div>
  );
}
