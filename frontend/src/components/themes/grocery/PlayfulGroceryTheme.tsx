import React, { useState } from 'react';
import AllProductsModal from '../../shared/AllProductsModal';
import ProductModal from '../../shared/ProductModal';
import { ShoppingCart, Star, MapPin, Phone, Smile, Menu, X } from 'lucide-react';

export default function PlayfulGroceryTheme({ website, content }: any) {
  const [showAllProducts, setShowAllProducts] = useState(false);
  const [selectedProduct, setSelectedProduct] = React.useState<any>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [selectedGalleryImage, setSelectedGalleryImage] = useState<string | null>(null);
  const sectionOrder: string[] = content?.settings_json?.section_order || ['hero', 'about', 'services', 'menu', 'gallery', 'contact', 'custom'];
  const hiddenSections: string[] = content?.settings_json?.hidden_sections || [];
  const siteName = content.settings_json?.website_name || website.slug || 'Super Yummy Mart!';

  const products = content.products_json?.length > 0 ? content.products_json : [
    { name: 'Rainbow Cereal', price: '₹250', image: 'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?auto=format&fit=crop&w=600&q=80', tag: 'Kids Favorite!' },
    { name: 'Juicy Apples', price: '₹120/kg', image: 'https://images.unsplash.com/photo-1610832958506-aa56368176cf?auto=format&fit=crop&w=600&q=80', tag: 'Super Fresh!' },
    { name: 'Choco Chip Cookies', price: '₹80', image: 'https://images.unsplash.com/photo-1499636136210-6f4ee915583e?auto=format&fit=crop&w=600&q=80', tag: 'Yum!' },
    { name: 'Orange Juice', price: '₹95', image: 'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?auto=format&fit=crop&w=600&q=80', tag: 'Healthy!' }
  ];

  return (
    <div className="min-h-screen theme-root flex flex-col bg-[#E0F7FA] text-[#006064] font-sans overflow-hidden">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fredoka+One&family=Quicksand:wght@500;700;900&display=swap');
        .font-fun { font-family: 'Fredoka One', cursive; }
        .font-body { font-family: 'Quicksand', sans-serif; }
      
        /* Dynamic Layout Ordering */
        .theme-root { display: flex; flex-direction: column; }
        .theme-root > header, .theme-root > nav { order: 0; }
        .theme-root > section:nth-of-type(1) { order: ${sectionOrder.indexOf('hero') + 1}; display: ${hiddenSections.includes('hero') ? 'none' : 'block'} }
        .theme-root > section:nth-of-type(2) { order: ${sectionOrder.indexOf('menu') + 1 > 0 ? sectionOrder.indexOf('menu') + 1 : sectionOrder.indexOf('products') + 1}; display: ${hiddenSections.includes('menu') ? 'none' : 'block'} }
        .theme-root > footer { order: 999; }
    
      `}</style>

      {/* Header */}
      <header className="bg-white p-4 mx-4 mt-4 rounded-full border-4 border-[#FF4081] shadow-[4px_4px_0_#FF4081] sticky top-4 z-50">
        <div className="container mx-auto flex justify-between items-center px-4">
          <div className="flex items-center gap-2 min-w-0 pr-4">
            {content?.settings_json?.logo_image ? (
              <img loading="lazy" src={content.settings_json.logo_image} alt={siteName} className="h-6 md:h-10 w-auto object-contain shrink-0" />
            ) : (
              <Smile className="text-[#FFB300] shrink-0 h-7 w-7 md:h-8 md:w-8" />
            )}
            <span className="font-fun text-xl md:text-2xl text-[#FF4081] truncate block">{siteName}</span>
          </div>
          <button className="md:hidden text-[#FF4081]" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
          <nav className="hidden md:flex gap-6 font-fun text-[#00ACC1] text-lg">
            <a href="#aisles" className="hover:text-[#FFB300] transition-colors">Products</a>
            <a href="#contact" className="hover:text-[#FFB300] transition-colors">Contact</a>
          </nav>
        </div>
        
        {isMenuOpen && (
          <div className="md:hidden mt-4 pt-4 border-t-4 border-[#FF4081]/10 flex flex-col gap-4 font-fun text-[#00ACC1] text-lg">
            <a href="#aisles" onClick={() => setIsMenuOpen(false)} className="hover:text-[#FFB300] py-2 transition-colors">Products</a>
            <a href="#contact" onClick={() => setIsMenuOpen(false)} className="hover:text-[#FFB300] py-2 transition-colors">Contact</a>
          </div>
        )}
      </header>

      {/* Hero */}
      <section className="py-16 px-6 text-center relative">
        <div className="absolute top-10 left-10 text-[#FF4081] animate-bounce"><Star size={40} /></div>
        <div className="absolute top-20 right-20 text-[#FFB300] animate-bounce" style={{ animationDelay: '0.5s' }}><Star size={60} /></div>

        <div className="container mx-auto max-w-3xl relative z-10">
          <h1 className="font-fun text-5xl md:text-7xl text-[#00ACC1] mb-6 drop-shadow-sm leading-tight">
            {content.hero_title || 'Grocery shopping made super fun!'}
          </h1>
          <p className="font-body font-bold text-2xl text-[#FF4081] mb-10 bg-white inline-block px-6 py-2 rounded-2xl border-4 border-[#FFB300] transform rotate-1">
            {content.hero_text || 'Everything your family needs, delivered with a big smile! 😊'}
          </p>
          <div className="flex justify-center">
            <a href="#aisles" className="bg-[#FF4081] hover:bg-[#F50057] text-white font-fun text-3xl py-4 px-10 rounded-full border-4 border-[#00ACC1] shadow-[6px_6px_0_#00ACC1] active:translate-y-2 active:shadow-none transition-all flex items-center gap-3 inline-block">
              <ShoppingCart size={28} /> Start Shopping!
            </a>
          </div>
        </div>
      </section>

      {/* Products Grid */}
      <section id="aisles" className="py-16 px-6">
        <div className="container mx-auto max-w-6xl">
          <h2 className="font-fun text-4xl text-center text-[#FFB300] mb-12 bg-white inline-block px-8 py-3 rounded-full border-4 border-[#00ACC1] transform -rotate-2 mx-auto flex items-center justify-center w-fit">
            Yummy Picks!
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            {products.map((p: any, i: number) => (
              <div key={i} onClick={() => setSelectedProduct(p)} className="cursor-pointer bg-white rounded-3xl p-4 border-4 border-[#00ACC1] hover:-translate-y-3 transition-transform shadow-[6px_6px_0_#FFB300] relative">
                <div className="absolute -top-4 -right-4 bg-[#FF4081] text-white font-fun text-sm px-3 py-1 rounded-full border-2 border-white transform rotate-12 z-10">
                  {p.tag}
                </div>
                <div className="aspect-square rounded-2xl overflow-hidden mb-4 border-4 border-[#E0F7FA]">
                  <img loading="lazy" src={p.image} alt={p.name} className="w-full h-full object-cover" />
                </div>
                <h3 className="font-fun text-xl text-[#006064] mb-2">{p.name}</h3>
                <div className="flex justify-between items-center mt-4">
                  <span className="font-fun text-2xl text-[#FF4081]">{p.price}</span>
                  <button className="bg-[#00ACC1] text-white p-3 rounded-full hover:bg-[#0097A7] transition-colors border-2 border-[#006064]">
                    <ShoppingCart size={20} />
                  </button>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-10 mb-4 text-center w-full flex justify-center col-span-full">
            <button
              onClick={() => setShowAllProducts(true)}
              className="px-8 py-3 bg-gray-900 text-white rounded hover:bg-gray-800 transition-colors font-bold tracking-wide shadow-md flex items-center justify-center gap-2 mx-auto"
            >
              View All Products
            </button>
          </div>

        </div>
      </section>



      {/* Injected About Section */}
      {sectionOrder.includes('about') && !hiddenSections.includes('about') && (
        <section style={{ order: sectionOrder.indexOf('about') + 1 }} id="about" className="py-16 px-6 bg-white border-b border-black/5">
          <div className="container mx-auto max-w-4xl text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-black">{content.settings_json?.about_title || content.about_title || 'About Us'}</h2>
            <p className="text-lg opacity-80 leading-relaxed max-w-2xl mx-auto text-black">
              {content.about_text || 'Welcome to our store! We are dedicated to bringing you the best quality products and services. Our team works hard to ensure customer satisfaction and continuous improvement.'}
            </p>
          </div>
        </section>
      )}

      {/* Injected Services Section */}
      {sectionOrder.includes('services') && !hiddenSections.includes('services') && (
        <section style={{ order: sectionOrder.indexOf('services') + 1 }} id="services" className="py-16 px-6 bg-black/5 border-b border-black/5">
          <div className="container mx-auto max-w-5xl">
            <h2 className="text-3xl md:text-4xl font-bold mb-10 text-center text-black">Our Services</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {(content.services_json?.length ? content.services_json : [
                { title: 'Quality Assurance', description: 'We guarantee the highest quality in all our offerings.' },
                { title: 'Fast Delivery', description: 'Quick and reliable delivery to your doorstep.' },
                { title: 'Customer Support', description: '24/7 dedicated support for all your needs.' }
              ]).map((srv: any, i: number) => (
                <div key={i} className="bg-white p-6 rounded-xl shadow-sm text-center">
                  <div className="w-16 h-16 mx-auto bg-black/5 rounded-full flex items-center justify-center mb-4 overflow-hidden">
                    {srv.image ? <img loading="lazy" src={srv.image} alt={srv.title} className="w-full h-full object-cover" /> : <span className="text-2xl">✨</span>}
                  </div>
                  <h3 className="font-bold text-xl mb-2 text-black">{srv.title}</h3>
                  <p className="opacity-75 text-black">{srv.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Injected Gallery Section */}
      {sectionOrder.includes('gallery') && !hiddenSections.includes('gallery') && (
        <section style={{ order: sectionOrder.indexOf('gallery') + 1 }} id="gallery" className="py-16 px-6 bg-white border-b border-black/5">
          <div className="container mx-auto max-w-6xl">
            <h2 className="text-3xl md:text-4xl font-bold mb-10 text-center text-black">Gallery</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {(content.gallery_json?.length ? content.gallery_json : [
                'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=400&q=80',
                'https://images.unsplash.com/photo-1578916171728-46686eac8d58?auto=format&fit=crop&w=400&q=80',
                'https://images.unsplash.com/photo-1583258292688-d0213dc5a3a8?auto=format&fit=crop&w=400&q=80',
                'https://images.unsplash.com/photo-1604719312566-8912e9227c6a?auto=format&fit=crop&w=400&q=80'
              ]).map((img: string, i: number) => (
                <div key={i} onClick={() => setSelectedGalleryImage(img)} className="aspect-square rounded-xl overflow-hidden bg-black/5 cursor-pointer group relative">
                  <img loading="lazy" src={img} alt="Gallery item" className="w-full h-full object-cover hover:scale-110 transition-transform duration-500" />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                    <span className="bg-white text-black px-6 py-2 rounded-full font-bold shadow-lg transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                      View
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Injected Contact Section */}
      {sectionOrder.includes('contact') && !hiddenSections.includes('contact') && (
        <section style={{ order: sectionOrder.indexOf('contact') + 1 }} id="contact" className="py-16 px-6 bg-black/5">
          <div className="container mx-auto max-w-4xl bg-white rounded-2xl p-8 md:p-12 shadow-sm text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-black">Contact Us</h2>
            <p className="opacity-80 mb-8 max-w-lg mx-auto text-black">Get in touch with us for any inquiries or support.</p>
            <div className="flex flex-col md:flex-row gap-8 text-left">
              <div className="flex-1 space-y-6">
                <div className="bg-white rounded-3xl p-6 border-4 border-[#FF4081] shadow-[4px_4px_0_#FFB300] flex items-center gap-4 transform rotate-1">
                  <span className="text-3xl">📞</span>
                  <div>
                    <span className="font-fun text-sm text-[#FF4081] block mb-1">Phone</span>
                    <span className="font-fun text-[#006064] text-xl">{content.contact_info?.phone || '1800 123 4567'}</span>
                  </div>
                </div>
                <div className="bg-white rounded-3xl p-6 border-4 border-[#00ACC1] shadow-[4px_4px_0_#FF4081] flex items-center gap-4 transform -rotate-1">
                  <span className="text-3xl">✉️</span>
                  <div>
                    <span className="font-fun text-sm text-[#00ACC1] block mb-1">Email</span>
                    <span className="font-fun text-[#006064] text-lg break-all">{content.contact_info?.email || 'hello@example.com'}</span>
                  </div>
                </div>
                <div className="bg-white rounded-3xl p-6 border-4 border-[#FFB300] shadow-[4px_4px_0_#00ACC1] flex items-center gap-4 transform rotate-1">
                  <span className="text-3xl">📍</span>
                  <div>
                    <span className="font-fun text-sm text-[#FFB300] block mb-1">Location</span>
                    <span className="font-fun text-[#006064] text-lg">{content.contact_info?.address || '123 Market Street'}</span>
                  </div>
                </div>

                {/* Social Links */}
                {(content.contact_info?.facebook || content.contact_info?.instagram || content.contact_info?.twitter) && (
                  <div className="bg-white rounded-3xl p-6 border-4 border-[#00ACC1] text-center transform -rotate-1">
                    <span className="font-fun text-sm text-[#00ACC1] block mb-4">Let's be Friends!</span>
                    <div className="flex justify-center gap-4">
                      {content.contact_info?.facebook && <a href={content.contact_info.facebook} target="_blank" rel="noreferrer" className="w-12 h-12 bg-[#FF4081] text-white rounded-full flex items-center justify-center hover:scale-110 transition-transform border-4 border-[#FFB300] font-fun text-sm">FB</a>}
                      {content.contact_info?.instagram && <a href={content.contact_info.instagram} target="_blank" rel="noreferrer" className="w-12 h-12 bg-[#00ACC1] text-white rounded-full flex items-center justify-center hover:scale-110 transition-transform border-4 border-[#FF4081] font-fun text-sm">IG</a>}
                      {content.contact_info?.twitter && <a href={content.contact_info.twitter} target="_blank" rel="noreferrer" className="w-12 h-12 bg-[#FFB300] text-white rounded-full flex items-center justify-center hover:scale-110 transition-transform border-4 border-[#00ACC1] font-fun text-sm">TW</a>}
                    </div>
                  </div>
                )}
              </div>

              <div className="flex-1 flex flex-col gap-6">
                <div className="bg-white rounded-3xl p-6 border-4 border-[#FFB300] shadow-[4px_4px_0_#00ACC1]">
                  <h3 className="font-fun text-2xl mb-4 text-[#FF4081] flex items-center gap-2"><span>🕒</span> Opening Hours</h3>
                  <ul className="space-y-3 font-body font-bold text-[#006064]">
                    {content.contact_info?.hours ? (
                      <li className="whitespace-pre-wrap">{content.contact_info.hours}</li>
                    ) : (
                      <>
                        <li className="flex justify-between border-b-2 border-dashed border-[#00ACC1]/30 pb-2"><span>Mon - Fri</span> <span>9:00 AM - 8:00 PM</span></li>
                        <li className="flex justify-between border-b-2 border-dashed border-[#00ACC1]/30 pb-2"><span>Saturday</span> <span>10:00 AM - 6:00 PM</span></li>
                        <li className="flex justify-between"><span>Sunday</span> <span className="text-[#FF4081]">Closed</span></li>
                      </>
                    )}
                  </ul>
                </div>

                {/* Embedded Map */}
                <div className="bg-white p-2 rounded-3xl border-4 border-[#FF4081] shadow-[4px_4px_0_#FFB300] flex-1 min-h-[250px]">
                  <iframe
                    src={`https://maps.google.com/maps?q=${encodeURIComponent(content.contact_info?.address || '123 Market Street')}&t=&z=13&ie=UTF8&iwloc=&output=embed`}
                    width="100%"
                    height="100%"
                    style={{ border: 0, borderRadius: '1rem' }}
                    allowFullScreen={false}
                    loading="lazy"
                    title="Store Location"
                    className="min-h-[250px]"
                  ></iframe>
                </div>
              </div>
            </div>
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
              if (block.type === 'image' && block.url) return <img loading="lazy" key={block.id} src={block.url} alt="Custom" className="w-full rounded-2xl shadow-xl" />;
              if (block.type === 'divider') return <hr key={block.id} className="my-12 opacity-20" />;
              return null;
            })}
          </div>
        </section>
      )}

      {/* Footer */}
      <footer id="hello" className="bg-[#00ACC1] text-white py-16 mt-10 rounded-t-[4rem] border-t-8 border-[#FFB300]">
        <div className="container mx-auto px-6 max-w-4xl text-center">
          <h3 className="font-fun text-4xl mb-6 text-white drop-shadow-md">{siteName}</h3>
          <p className="font-body font-bold text-xl mb-10 max-w-md mx-auto">
            {content.about_text || "The happiest supermarket in town!"}
          </p>

          <div className="flex flex-col md:flex-row justify-center gap-6 font-fun text-xl">
            <div className="bg-white text-[#00ACC1] p-4 rounded-2xl border-4 border-[#FF4081] flex items-center gap-2 shadow-[4px_4px_0_#FFB300]">
              <Phone size={24} /> {content.contact_info?.phone || '98765 43210'}
            </div>
            <div className="bg-white text-[#00ACC1] p-4 rounded-2xl border-4 border-[#FF4081] flex items-center gap-2 shadow-[4px_4px_0_#FFB300]">
              <MapPin size={24} /> {content.contact_info?.address || 'Happy Lane, Kerala'}
            </div>
          </div>
        </div>
      </footer>


      <AllProductsModal isOpen={showAllProducts} onClose={() => setShowAllProducts(false)} products={products || []} onProductSelect={setSelectedProduct} />
      <ProductModal product={selectedProduct} onClose={() => setSelectedProduct(null)} contactInfo={content.contact_info} />

      {/* Gallery Lightbox */}
      {selectedGalleryImage && (
        <div className="fixed inset-0 z-[9999] bg-black/90 flex items-center justify-center p-4 backdrop-blur-sm" onClick={() => setSelectedGalleryImage(null)}>
          <button
            className="absolute top-6 right-6 text-white bg-white/20 hover:bg-white/40 rounded-full w-12 h-12 flex items-center justify-center transition-colors border border-white/30"
            onClick={(e) => { e.stopPropagation(); setSelectedGalleryImage(null); }}
          >
            <span className="text-2xl font-bold">×</span>
          </button>
          <img loading="lazy" src={selectedGalleryImage} alt="Gallery full size" className="max-w-full max-h-[90vh] object-contain rounded-xl shadow-2xl" />
        </div>
      )}
    </div>
  );
}

