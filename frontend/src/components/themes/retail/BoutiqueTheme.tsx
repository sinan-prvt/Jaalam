import React, { useState, useEffect } from 'react';
import AllProductsModal from '../../shared/AllProductsModal';
import ProductModal from '../../shared/ProductModal';
import { ShoppingBag, Star, MapPin, Phone, Mail, ArrowRight, X, Menu, Search, Clock, MessageCircle } from 'lucide-react';

const Instagram = ({ size = 18, className = "" }: any) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/></svg>
);

export default function BoutiqueTheme({ website, content }: any) {
  const sectionOrder: string[] = content?.settings_json?.section_order || ['hero', 'about', 'services', 'menu', 'gallery', 'contact', 'custom'];
  const hiddenSections: string[] = content?.settings_json?.hidden_sections || [];
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [showAllProducts, setShowAllProducts] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const siteName = content.settings_json?.website_name || website.slug || 'LUMEN BOUTIQUE';
  
  const defaultProducts = [
    { name: 'Silk Midi Dress', price: '?245', image: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&w=600&q=80', description: 'Elegant silk slip dress with delicate straps.' },
    { name: 'Tailored Linen Blazer', price: '?310', image: 'https://images.unsplash.com/photo-1591369822096-ffd140ec948f?auto=format&fit=crop&w=600&q=80', description: 'Perfectly structured linen blend blazer for any occasion.' },
    { name: 'Woven Leather Tote', price: '?185', image: 'https://images.unsplash.com/photo-1584916201218-f4242ceb4809?auto=format&fit=crop&w=600&q=80', description: 'Hand-woven Italian leather tote bag.' },
    { name: 'Pearl Drop Earrings', price: '?95', image: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=600&q=80', description: 'Freshwater pearls on 14k gold-filled hoops.' },
    { name: 'Cashmere Wrap Sweater', price: '?220', image: 'https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?auto=format&fit=crop&w=600&q=80', description: 'Luxurious cashmere blend wrap sweater.' }
  ];

  const products = content.products_json?.length > 0 ? content.products_json : defaultProducts;

  const defaultGallery = [
    'https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1607083206869-4c7672e72a8a?auto=format&fit=crop&w=800&q=80',
  ];
  const galleryImages = content.gallery_json?.length > 0 ? content.gallery_json : defaultGallery;

  const defaultServices = [
    { title: 'Personal Styling', description: 'One-on-one sessions with our expert stylists to curate your perfect wardrobe.' },
    { title: 'Tailoring & Alterations', description: 'Custom fit adjustments to ensure every piece drapes flawlessly on you.' },
    { title: 'Private Appointments', description: 'Exclusive after-hours access to our boutique for a true VIP shopping experience.' }
  ];
  const services = content.services_json?.length > 0 ? content.services_json : defaultServices;

  return (
    <div className="min-h-screen theme-root flex flex-col bg-[#FAF8F5] text-[#2C2C2C] selection:bg-[#D4AF37] selection:text-white flex flex-col font-serif">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;1,400&family=Lato:wght@300;400&display=swap');
        .bt-serif { font-family: 'Playfair Display', serif; }
        .bt-sans { font-family: 'Lato', sans-serif; }
        .bt-fade-in { animation: fadeIn 1.5s ease-out; }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
      
        /* Dynamic Layout Ordering */
        .theme-root { display: flex; flex-direction: column; }
        .theme-root > header, .theme-root > nav { order: 0; }
        .theme-root > section:nth-of-type(1) { order: ${sectionOrder.indexOf('hero') + 1}; display: ${hiddenSections.includes('hero') ? 'none' : 'block'} }
        .theme-root > section:nth-of-type(2) { order: ${sectionOrder.indexOf('menu') + 1 > 0 ? sectionOrder.indexOf('menu') + 1 : sectionOrder.indexOf('products') + 1}; display: ${hiddenSections.includes('menu') ? 'none' : 'block'} }
        .theme-root > footer { order: 999; }
    
      `}</style>

      {/* Header */}
      <header className={`fixed top-0 w-full z-50 transition-all duration-500 ${scrolled ? 'bg-white/95 backdrop-blur-sm shadow-sm py-4' : 'bg-transparent py-6'}`}>
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
          <button className="md:hidden" onClick={() => setIsMenuOpen(true)}>
            <Menu size={24} className="text-[#2C2C2C]" />
          </button>
          
          <div className="bt-serif text-3xl tracking-wider uppercase flex-1 text-center md:text-left">
            {siteName}
          </div>

          <nav className="hidden md:flex gap-8 bt-sans text-sm tracking-widest uppercase">
            <a href="#collections" className="hover:text-[#D4AF37] transition-colors">Collections</a>
            <a href="#about" className="hover:text-[#D4AF37] transition-colors">Our Story</a>
            {services.length > 0 && <a href="#services" className="hover:text-[#D4AF37] transition-colors">Services</a>}
            <a href="#gallery" className="hover:text-[#D4AF37] transition-colors">Lookbook</a>
          </nav>

          <div className="flex-1 flex justify-end">
            {content.settings_json?.logo_image ? (
              <img src={content.settings_json.logo_image} alt="Logo" className="h-8 w-8 md:h-10 md:w-10 rounded-full object-cover" />
            ) : (
              <div className="h-8 w-8 md:h-10 md:w-10 rounded-full bg-[#D4AF37] flex items-center justify-center text-white bt-serif font-bold text-lg shadow-sm">
                {siteName.charAt(0).toUpperCase()}
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Mobile Menu */}
      

      {/* Hero */}
      {!hiddenSections.includes('hero') && (
        <section className="relative h-screen flex items-center justify-center pt-20">
          <div className="absolute inset-0 z-0">
            <img 
              src={content.settings_json?.hero_image || 'https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=2000&q=80'} 
              alt="Hero" 
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black/20"></div>
          </div>
          <div className="relative z-10 text-center text-white px-6 bt-fade-in max-w-3xl w-full">
            <h1 className="bt-serif text-5xl md:text-7xl mb-6 break-words whitespace-pre-wrap leading-snug">{content.hero_title || 'Redefining Elegance'}</h1>
            <p className="bt-sans text-lg tracking-widest uppercase mb-10 break-words whitespace-pre-wrap leading-relaxed">{content.about_text || 'Curated fashion for the modern muse'}</p>
            <a href="#collections" className="inline-block border border-white px-10 py-4 bt-sans tracking-widest uppercase text-sm hover:bg-white hover:text-black transition-colors">
              Shop the Collection
            </a>
          </div>
        </section>
      )}


      {/* About Split */}
      {!hiddenSections.includes('about') && (
        <section id="about" className="py-24 bg-white">
          <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
            <div className="order-2 md:order-1">
              <h2 className="bt-serif text-4xl mb-8 leading-snug break-words whitespace-pre-wrap">{content.settings_json?.about_title || 'Crafted with intention and grace.'}</h2>
              <p className="bt-sans text-gray-500 leading-relaxed mb-8 break-words whitespace-pre-wrap">
                {content.settings_json?.about_description || 'Every piece in our collection is carefully selected to embody timeless elegance. We believe in sustainable practices, ethical sourcing, and creating a wardrobe that lasts a lifetime.'}
              </p>
              <a href="#contact" className="inline-flex items-center gap-2 bt-sans tracking-widest uppercase text-sm border-b border-black pb-1 hover:text-[#D4AF37] hover:border-[#D4AF37] transition-colors">
                Visit our store <ArrowRight size={16} />
              </a>
            </div>
            <div className="order-1 md:order-2 relative aspect-[4/5]">
              <img src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=800&q=80" alt="About" className="w-full h-full object-cover" />
            </div>
          </div>
        </section>
      )}

      {/* Services */}
      {!hiddenSections.includes('services') && services.length > 0 && (
        <section id="services" className="py-24 px-6 max-w-7xl mx-auto w-full">
          <div className="text-center mb-16">
            <h2 className="bt-serif text-4xl mb-4 leading-snug">Our Services</h2>
            <div className="w-12 h-px bg-[#D4AF37] mx-auto"></div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {services.map((service: any, i: number) => (
              <div key={i} className="bg-white border border-[#EAE6DF] text-center hover:border-[#D4AF37] transition-colors group overflow-hidden flex flex-col">
                {service.image ? (
                  <div className="w-full h-48 md:h-56 overflow-hidden">
                    <img src={service.image} alt={service.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                  </div>
                ) : (
                  <div className="pt-10">
                    <div className="w-12 h-12 bg-[#FAF8F5] text-[#D4AF37] rounded-full flex items-center justify-center mx-auto mb-0 group-hover:bg-[#D4AF37] group-hover:text-white transition-colors bt-serif text-xl border border-[#EAE6DF] group-hover:border-[#D4AF37]">
                      {i + 1}
                    </div>
                  </div>
                )}
                <div className={`px-10 pb-10 flex-1 flex flex-col items-center justify-center ${service.image ? 'pt-8' : 'pt-6'}`}>
                  <h3 className="bt-serif text-2xl mb-4 break-all leading-snug">{service.title || service.name || 'Service'}</h3>
                  <p className="bt-sans text-gray-500 text-sm leading-relaxed break-all whitespace-pre-wrap">
                    {service.description || 'Experience bespoke luxury tailored specifically to your individual needs.'}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Products (Menu) */}
      {!hiddenSections.includes('menu') && (
        <section id="collections" className="py-24 px-6 max-w-7xl mx-auto w-full">
          <div className="text-center mb-16 bt-fade-in">
            <h2 className="bt-serif text-4xl mb-4 leading-snug">Latest Arrivals</h2>
            <div className="w-12 h-px bg-[#D4AF37] mx-auto"></div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {products.slice(0, 4).map((p: any, i: number) => (
              <div key={i} className="group cursor-pointer flex flex-col" onClick={() => setSelectedProduct(p)}>
                <div className="relative aspect-[3/4] overflow-hidden mb-6">
                  <img src={p.image} alt={p.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                  <div className="absolute bottom-0 left-0 w-full p-4 opacity-0 group-hover:opacity-100 transition-opacity bg-gradient-to-t from-black/50 to-transparent flex justify-center">
                    <span className="text-white bt-sans text-xs tracking-widest uppercase border-b border-white pb-1">Quick View</span>
                  </div>
                </div>
                <h3 className="bt-serif text-xl mb-2 flex-1 break-words leading-snug">{p.name}</h3>
                <p className="bt-sans text-[#D4AF37] tracking-wider">{p.price}</p>
              </div>
            ))}
          </div>

          {products.length > 4 && (
            <div className="mt-16 text-center bt-fade-in">
              <button 
                onClick={() => setShowAllProducts(true)}
                className="inline-block border border-[#2C2C2C] px-10 py-4 bt-sans tracking-widest uppercase text-sm hover:bg-[#2C2C2C] hover:text-white transition-colors"
              >
                View More
              </button>
            </div>
          )}
        </section>
      )}

      {/* Lookbook / Gallery */}
      {!hiddenSections.includes('gallery') && (
        <section id="gallery" className="py-24 px-6 max-w-7xl mx-auto w-full">
          <div className="text-center mb-16">
            <h2 className="bt-serif text-4xl mb-4">The Lookbook</h2>
            <div className="w-12 h-px bg-[#D4AF37] mx-auto"></div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {galleryImages.map((img: string, i: number) => (
              <div key={i} className="aspect-[4/5] overflow-hidden cursor-pointer group" onClick={() => setSelectedImage(img)}>
                <img src={img} alt="Lookbook" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Contact Section */}
      {!hiddenSections.includes('contact') && (
        <section id="contact" className="py-24 lg:py-32 px-6 bg-[#1A1A1A] text-white">
          <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">
            <div className="flex flex-col w-full">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-8 h-px bg-[#D4AF37]"></div>
                <span className="uppercase tracking-[0.2em] text-sm font-bold text-[#D4AF37]">Get In Touch</span>
              </div>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl text-white mb-8 break-words hyphens-auto bt-serif leading-snug">Contact & Store Info</h2>
              <p className="text-gray-400 leading-relaxed font-light mb-10 text-lg bt-sans">
                We would love to hear from you. Whether you have a question about our collections, want to book a personal styling appointment, or simply wish to visit our flagship store.
              </p>
              <div className="space-y-6 bt-sans">
                <div className="flex items-center gap-6">
                  <div className="w-12 h-12 rounded-full bg-[#D4AF37] flex items-center justify-center shrink-0 shadow-lg">
                    <MapPin className="text-white" size={20} />
                  </div>
                  <div>
                    <h4 className="font-bold text-lg mb-1">Location</h4>
                    <p className="text-gray-400 font-light break-words">{content.contact_info?.address || '123 Fashion Ave, NY 10012'}</p>
                  </div>
                </div>
                <div className="flex items-center gap-6">
                  <div className="w-12 h-12 rounded-full bg-[#D4AF37] flex items-center justify-center shrink-0 shadow-lg">
                    <Phone className="text-white" size={20} />
                  </div>
                  <div>
                    <h4 className="font-bold text-lg mb-1">Phone</h4>
                    <p className="text-gray-400 font-light">{content.contact_info?.phone || '+1 (555) 123-4567'}</p>
                  </div>
                </div>
                <div className="flex items-center gap-6">
                  <div className="w-12 h-12 rounded-full bg-[#D4AF37] flex items-center justify-center shrink-0 shadow-lg">
                    <Clock className="text-white" size={20} />
                  </div>
                  <div>
                    <h4 className="font-bold text-lg mb-1">Hours</h4>
                    <p className="text-gray-400 font-light whitespace-pre-wrap">{content.contact_info?.hours || 'Mon-Sat: 10:00 AM - 8:00 PM\nSun: 11:00 AM - 6:00 PM'}</p>
                  </div>
                </div>

                {/* Social Links */}
                <div className="pt-8 flex gap-6">
                  <a href={content.contact_info?.facebook || '#'} target="_blank" rel="noopener noreferrer" className="w-12 h-12 rounded-full border border-gray-600 flex items-center justify-center hover:bg-[#D4AF37] hover:border-[#D4AF37] hover:text-white transition-colors group">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="group-hover:scale-110 transition-transform"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg>
                  </a>
                  <a href={content.contact_info?.whatsapp || '#'} target="_blank" rel="noopener noreferrer" className="w-12 h-12 rounded-full border border-gray-600 flex items-center justify-center hover:bg-[#D4AF37] hover:border-[#D4AF37] hover:text-white transition-colors group">
                    <MessageCircle size={20} className="group-hover:scale-110 transition-transform" />
                  </a>
                  <a href={content.contact_info?.instagram || '#'} target="_blank" rel="noopener noreferrer" className="w-12 h-12 rounded-full border border-gray-600 flex items-center justify-center hover:bg-[#D4AF37] hover:border-[#D4AF37] hover:text-white transition-colors group">
                    <Instagram size={20} className="group-hover:scale-110 transition-transform" />
                  </a>
                </div>
              </div>
            </div>
            
            <div className="w-full h-[500px] grayscale hover:grayscale-0 transition-all duration-700 bg-black/20">
              <iframe 
                src={content.contact_info?.map_embed_url || (content.contact_info?.address ? `https://www.google.com/maps?q=${encodeURIComponent(content.contact_info.address)}&output=embed` : "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d193595.2528000654!2d-74.14448744489344!3d40.69766374865766!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89c24fa5d33f083b%3A0xc80b8f06e177fe62!2sNew%20York%2C%20NY%2C%20USA!5e0!3m2!1sen!2s!4v1715000000000!5m2!1sen!2s")} 
                width="100%" 
                height="100%" 
                style={{ border: 0 }} 
                allowFullScreen 
                loading="lazy" 
                referrerPolicy="no-referrer-when-downgrade"
              ></iframe>
            </div>
          </div>
        </section>
      )}

      {/* Custom Section */}
      {!hiddenSections.includes('custom') && content.custom_blocks_json?.length > 0 && (
        <section id="custom" className="py-24 px-6 max-w-7xl mx-auto w-full">
          <div className="max-w-4xl mx-auto space-y-8">
            {content.custom_blocks_json.map((block: any) => {
              if (block.type === 'heading') {
                return <h2 key={block.id} className="bt-serif text-4xl leading-snug text-center break-words">{block.content}</h2>;
              }
              if (block.type === 'paragraph') {
                return <p key={block.id} className="bt-sans text-[#2C2C2C] leading-relaxed prose prose-lg mx-auto break-words whitespace-pre-wrap">{block.content}</p>;
              }
              if (block.type === 'image') {
                return block.url ? <img key={block.id} src={block.url} alt="Custom block" className="w-full h-auto rounded-none object-cover" /> : null;
              }
              if (block.type === 'divider') {
                return <div key={block.id} className="w-12 h-px bg-[#D4AF37] mx-auto my-12"></div>;
              }
              return null;
            })}
          </div>
        </section>
      )}

      
      {/* Dynamic Custom Section */}
      {sectionOrder.includes('custom') && !hiddenSections.includes('custom') && content?.custom_blocks_json?.length > 0 && (
        <section style={{ order: sectionOrder.indexOf('custom') + 1 }} className="py-16 px-4 bg-white/5 border-t border-black/10">
          <div className="container mx-auto max-w-4xl space-y-8">
            {content.custom_blocks_json.map((block: any) => {
              if (block.type === 'heading') return <h2 key={block.id} className="text-4xl md:text-5xl font-black uppercase break-words w-full">{block.content}</h2>;
              if (block.type === 'paragraph') return <p key={block.id} className="text-lg opacity-80 break-words whitespace-pre-wrap w-full">{block.content}</p>;
              if (block.type === 'image' && block.url) return <img key={block.id} src={block.url} alt="Custom" className="w-full rounded-2xl shadow-xl" />;
              if (block.type === 'divider') return <hr key={block.id} className="my-12 opacity-20" />;
              return null;
            })}
          </div>
        </section>
      )}

      {/* Footer */}
      <footer className="bg-[#1A1A1A] text-white pt-12 pb-12 px-6 border-t border-white/10">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-12 mb-16">
          <div>
            <h3 className="bt-serif text-2xl mb-6 tracking-widest uppercase">{siteName}</h3>
            <p className="bt-sans text-gray-400 text-sm leading-relaxed max-w-xs break-words">
              Elevating everyday fashion through curated collections and timeless pieces.
            </p>
          </div>
          <div>
            <h4 className="bt-sans tracking-widest uppercase text-sm mb-6 text-[#D4AF37]">Contact</h4>
            <div className="space-y-4 bt-sans text-gray-400 text-sm">
              <div className="flex items-start gap-3">
                <MapPin size={16} className="mt-1" />
                <p className="flex-1 min-w-0 break-words">{content.contact_info?.address || '123 Fashion Ave, NY 10012'}</p>
              </div>
              <div className="flex items-center gap-3">
                <Phone size={16} />
                <p className="flex-1 min-w-0 break-words">{content.contact_info?.phone || '+1 (555) 123-4567'}</p>
              </div>
              <div className="flex items-center gap-3">
                <Mail size={16} />
                <p className="flex-1 min-w-0 break-words">{content.contact_info?.email || 'hello@lumen.com'}</p>
              </div>
            </div>
          </div>
          <div>
            <h4 className="bt-sans tracking-widest uppercase text-sm mb-6 text-[#D4AF37]">Newsletter</h4>
            <p className="bt-sans text-gray-400 text-sm mb-4">Join our list for exclusive early access to new arrivals.</p>
            <div className="flex border-b border-gray-600 pb-2">
              <input type="email" placeholder="Email Address" className="bg-transparent flex-1 outline-none bt-sans text-sm" />
              <ArrowRight size={16} className="text-gray-400 cursor-pointer hover:text-white" />
            </div>
          </div>
        </div>
        <div className="max-w-7xl mx-auto text-center border-t border-gray-800 pt-8 bt-sans text-xs text-gray-500 flex flex-col md:flex-row justify-between items-center gap-4">
          <p>&copy; {new Date().getFullYear()} {siteName}. All rights reserved.</p>
          <div className="flex flex-wrap gap-4">
            {content.settings_json?.social_links?.length > 0 ? (
              content.settings_json.social_links.map((link: any, i: number) => (
                <a key={i} href={link.url} target="_blank" rel="noopener noreferrer" className="hover:text-white cursor-pointer bt-sans text-xs tracking-widest uppercase text-gray-400">
                  {link.platform}
                </a>
              ))
            ) : (
              <>
                <Instagram size={16} className="text-gray-400 hover:text-white cursor-pointer" />
                <span className="text-gray-400 hover:text-white cursor-pointer bt-sans text-xs tracking-widest uppercase">Pinterest</span>
              </>
            )}
          </div>
        </div>
      </footer>

      {/* Product Modal */}
      {selectedProduct && (
        <div className="fixed inset-0 z-[100] bg-black/80 flex items-center justify-center p-4" onClick={() => setSelectedProduct(null)}>
          <div className="bg-white max-w-4xl w-full grid grid-cols-1 md:grid-cols-2 max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <div className="aspect-[3/4] w-full">
              <img src={selectedProduct.image} alt={selectedProduct.name} className="w-full h-full object-cover" />
            </div>
            <div className="p-8 md:p-12 flex flex-col justify-center relative">
              <button className="absolute top-6 right-6 text-gray-400 hover:text-black" onClick={() => setSelectedProduct(null)}>
                <X size={24} />
              </button>
              <h2 className="bt-serif text-3xl mb-4 break-words">{selectedProduct.name}</h2>
              <p className="bt-sans text-xl text-[#D4AF37] mb-8">{selectedProduct.price}</p>
              <p className="bt-sans text-gray-600 leading-relaxed mb-8 break-words">{selectedProduct.description}</p>
              <button className="w-full bg-black text-white py-4 bt-sans tracking-widest uppercase text-sm hover:bg-[#D4AF37] transition-colors" onClick={() => setSelectedProduct(null)}>
                Add to Bag
              </button>
            </div>
          </div>
        </div>
      )}

      {/* All Products Modal */}

      {/* Image Modal */}
      {selectedImage && (
        <div className="fixed inset-0 z-[100] bg-black/90 flex items-center justify-center p-4" onClick={() => setSelectedImage(null)}>
          <img src={selectedImage} alt="Fullscreen" className="max-w-full max-h-[90vh] object-contain" />
        </div>
      )}
    
      
      <AllProductsModal isOpen={showAllProducts} onClose={() => setShowAllProducts(false)} products={products || []} onProductSelect={setSelectedProduct} />
      <ProductModal product={selectedProduct} onClose={() => setSelectedProduct(null)} contactInfo={content.contact_info} />
    </div>
  );
}

