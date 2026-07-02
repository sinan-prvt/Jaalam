import React, { useState } from 'react';
import AllProductsModal from '../../shared/AllProductsModal';
import ProductModal from '../../shared/ProductModal';
import { ShoppingCart, Search, Menu, User, MapPin, Clock, Phone, ChevronRight, X, Mail } from 'lucide-react';
import { Facebook, Instagram, Twitter, WhatsApp } from '../scrap/SocialIcons';

export default function ModernGroceryTheme({ website, content }: any) {
  const sectionOrder: string[] = content?.settings_json?.section_order || ['hero', 'about', 'services', 'menu', 'gallery', 'contact', 'custom'];
  const hiddenSections: string[] = content?.settings_json?.hidden_sections || [];
  const siteName = content.settings_json?.website_name || website.slug || 'FreshMart';
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [showAllProducts, setShowAllProducts] = useState(false);
  
  const products = content.products_json?.length > 0 ? content.products_json : [
    { name: 'Fresh Hass Avocado', price: '₹120/pc', image: 'https://images.unsplash.com/photo-1523049673857-eb18f1d7b578?auto=format&fit=crop&w=600&q=80', category: 'Fruits' },
    { name: 'Organic Bananas', price: '₹60/kg', image: 'https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?auto=format&fit=crop&w=600&q=80', category: 'Fruits' },
    { name: 'Whole Wheat Bread', price: '₹50/pack', image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=600&q=80', category: 'Bakery' },
    { name: 'Farm Fresh Milk', price: '₹35/500ml', image: 'https://images.unsplash.com/photo-1550583724-b2692b85b150?auto=format&fit=crop&w=600&q=80', category: 'Dairy' }
  ];

  if (showAllProducts) {
    return (
      <div className="min-h-screen theme-root flex flex-col bg-slate-50 text-slate-800 font-sans pb-20">
        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
          .font-modern { font-family: 'Inter', sans-serif; }
        
        /* Dynamic Layout Ordering */
        .theme-root { display: flex; flex-direction: column; }
        .theme-root > header, .theme-root > nav { order: 0; }
        .theme-root > section:nth-of-type(1) { order: ${sectionOrder.indexOf('hero') + 1}; display: ${hiddenSections.includes('hero') ? 'none' : 'block'} }
        .theme-root > section:nth-of-type(2) { order: ${sectionOrder.indexOf('menu') + 1 > 0 ? sectionOrder.indexOf('menu') + 1 : sectionOrder.indexOf('products') + 1}; display: ${hiddenSections.includes('menu') ? 'none' : 'block'} }
        .theme-root > footer { order: 999; }
    
      `}</style>
        <header className="bg-white border-b border-slate-200 sticky top-0 z-50 py-4 px-6 flex items-center shadow-sm">
          <button onClick={() => setShowAllProducts(false)} className="mr-4 p-2 hover:bg-slate-100 rounded-full transition-colors">
             <ChevronRight size={24} className="rotate-180" />
          </button>
          <span className="font-modern text-xl font-bold text-slate-900">All Products</span>
        </header>
        <div className="container mx-auto px-6 py-8">
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6">
            {products.map((p: any, i: number) => (
              <div key={i} onClick={() => setSelectedProduct(p)} className="bg-white border border-slate-200 rounded-xl overflow-hidden hover:shadow-lg transition-shadow group cursor-pointer">
                <div className="aspect-square bg-slate-50 relative p-4">
                   <img src={p.image} alt={p.name} className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300 mix-blend-multiply" />
                </div>
                <div className="p-4">
                  <div className="text-xs text-slate-400 mb-1">{p.category}</div>
                  <h3 className="font-modern font-semibold text-slate-800 text-sm md:text-base mb-3 line-clamp-2 h-10">{p.name}</h3>
                  <div className="font-modern font-bold text-slate-900">{p.price}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
        {/* Product Modal */}
        
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
        .font-modern { font-family: 'Inter', sans-serif; }
      `}</style>

      {/* Top Banner */}
      <div className="bg-emerald-600 text-white py-2 px-6 text-xs font-medium flex justify-between items-center">
        <div className="flex gap-4">
           <span className="hidden md:inline">{content.settings_json?.promo_message || 'Special deals and free delivery on qualifying orders!'}</span>
        </div>
        <div className="flex gap-4">
           <span className="flex items-center gap-1"><MapPin size={14} /> Deliver to: {content.settings_json?.delivery_location || 'Select Location'}</span>
           <span className="flex items-center gap-1"><Clock size={14} /> {content.settings_json?.delivery_time || 'Fast Delivery'}</span>
        </div>
      </div>

      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50 py-4 px-6">
        <div className="container mx-auto flex items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <Menu 
              className="text-slate-500 cursor-pointer md:hidden" 
              onClick={() => setIsMenuOpen(!isMenuOpen)} 
            />
            <span className="font-modern text-2xl font-bold text-emerald-600 tracking-tight">{content?.settings_json?.logo_image ? <img src={content.settings_json.logo_image} alt={siteName} className="h-8 md:h-10 w-auto object-contain" /> : siteName}</span>
          </div>
          
          <div className="hidden md:flex flex-1 max-w-2xl relative">
            <input 
              type="text" 
              placeholder="Search for groceries, staples, and more..." 
              className="w-full bg-slate-100 border border-slate-200 rounded-lg py-3 pl-12 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-shadow"
            />
            <Search className="absolute left-4 top-3 text-slate-400" size={20} />
          </div>


        </div>
        
        {/* Mobile Menu Dropdown */}
        {isMenuOpen && (
          <div className="md:hidden mt-4 pt-4 border-t border-slate-200">
            <div className="relative mb-4">
              <input 
                type="text" 
                placeholder="Search for groceries..." 
                className="w-full bg-slate-100 border border-slate-200 rounded-lg py-3 pl-12 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
              />
              <Search className="absolute left-4 top-3 text-slate-400" size={20} />
            </div>
            <div className="flex flex-col gap-4 pb-2">
              <span className="font-medium text-slate-700 cursor-pointer hover:text-emerald-600">Categories</span>
              <span className="font-medium text-slate-700 cursor-pointer hover:text-emerald-600">Offers</span>
              <span className="font-medium text-slate-700 cursor-pointer hover:text-emerald-600">Help Center</span>
            </div>
          </div>
        )}
      </header>

      {/* Hero */}
      <section className="py-8 px-6">
        <div className="container mx-auto bg-emerald-50 rounded-2xl overflow-hidden flex flex-col md:flex-row items-center">
          <div className="w-full md:w-1/2 p-8 md:p-12">
            <span className="bg-emerald-200 text-emerald-800 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider mb-4 inline-block">100% Fresh Guarantee</span>
            <h1 className="font-modern text-4xl md:text-5xl font-extrabold text-slate-900 mb-4 leading-tight">
              {content.hero_title || 'Groceries delivered in minutes.'}
            </h1>
            <p className="font-modern text-slate-600 mb-8 max-w-md">
              {content.hero_description || content.hero_text || 'Shop from 5000+ daily essentials, fresh fruits, vegetables, and more.'}
            </p>
            <a href="#products" className="bg-emerald-600 hover:bg-emerald-700 text-white font-medium py-3 px-8 rounded-lg inline-flex items-center gap-2 transition-colors w-fit">
              Shop Now <ChevronRight size={18} />
            </a>
          </div>
          <div className="w-full md:w-1/2 h-64 md:h-96 bg-[url('https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=800&q=80')] bg-cover bg-center">
          </div>
        </div>
      </section>

      {/* About */}
      <section className="py-16 px-6 bg-white" id="about">
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="font-modern text-3xl font-bold text-slate-900 mb-6">{content.settings_json?.about_title || content.about_title || 'About Us'}</h2>
          <p className="text-slate-600 text-lg leading-relaxed">
            {content.about_text || 'We are your neighborhood grocery store committed to providing the freshest produce and daily essentials right to your doorstep. With over 10 years of experience sourcing from local farms, quality is our top priority.'}
          </p>
        </div>
      </section>

      {/* Services */}
      <section className="py-16 px-6 bg-slate-50 border-y border-slate-200" id="services">
        <div className="container mx-auto">
          <h2 className="font-modern text-3xl font-bold text-slate-900 mb-10 text-center">Our Services</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {(content.services_json?.length ? content.services_json : [
              { title: 'Express Delivery', description: 'Get your groceries delivered within 30 minutes in select areas.' },
              { title: 'Store Pickup', description: 'Order online and pick up fresh from your nearest store.' },
              { title: 'Bulk Orders', description: 'Special discounts available for wholesale and event purchases.' }
            ]).map((srv: any, i: number) => (
              <div key={i} className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 text-center flex flex-col items-center">
                <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mb-4 overflow-hidden">
                  {srv.image ? <img src={srv.image} alt={srv.title} className="w-full h-full object-cover" /> : <Clock size={24} />}
                </div>
                <h3 className="font-bold text-lg mb-2">{srv.title}</h3>
                <p className="text-slate-600 text-sm">{srv.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories (Mock) */}
      <section className="py-8 px-6 border-b border-slate-200 bg-white">
        <div className="container mx-auto flex gap-4 overflow-x-auto pb-4 hide-scrollbar">
          {['Fruits', 'Vegetables', 'Dairy', 'Bakery', 'Meat', 'Snacks', 'Beverages'].map((cat, i) => (
            <div key={i} className="flex-shrink-0 bg-slate-50 border border-slate-200 px-6 py-3 rounded-full text-sm font-medium hover:border-emerald-500 hover:text-emerald-600 cursor-pointer transition-colors">
              {cat}
            </div>
          ))}
        </div>
      </section>

      {/* Products Grid */}
      <section className="py-12 px-6 container mx-auto" id="products">
        <div className="flex justify-between items-end mb-8">
          <h2 className="font-modern text-2xl font-bold text-slate-900">Trending Today</h2>
          <span onClick={() => setShowAllProducts(true)} className="text-emerald-600 font-medium text-sm cursor-pointer hover:underline">View All</span>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {products.map((p: any, i: number) => (
            <div key={i} onClick={() => setSelectedProduct(p)} className="bg-white border border-slate-200 rounded-xl overflow-hidden hover:shadow-lg transition-shadow group cursor-pointer">
              <div className="aspect-square bg-slate-50 relative p-4">
                 <img src={p.image} alt={p.name} className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300 mix-blend-multiply" />
              </div>
              <div className="p-4">
                <div className="text-xs text-slate-400 mb-1">{p.category}</div>
                <h3 className="font-modern font-semibold text-slate-800 text-sm md:text-base mb-3 line-clamp-2 h-10">{p.name}</h3>
                <div className="flex justify-between items-center">
                  <div className="font-modern font-bold text-slate-900">{p.price}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Gallery */}
      <section className="py-16 px-6 bg-slate-50 border-t border-slate-200" id="gallery">
        <div className="container mx-auto">
          <h2 className="font-modern text-3xl font-bold text-slate-900 mb-10 text-center">Our Store</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {(content.gallery_json?.length ? content.gallery_json : [
              'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=400&q=80',
              'https://images.unsplash.com/photo-1578916171728-46686eac8d58?auto=format&fit=crop&w=400&q=80',
              'https://images.unsplash.com/photo-1583258292688-d0213dc5a3a8?auto=format&fit=crop&w=400&q=80',
              'https://images.unsplash.com/photo-1604719312566-8912e9227c6a?auto=format&fit=crop&w=400&q=80'
            ]).map((img: string, i: number) => (
              <div key={i} className="aspect-square rounded-xl overflow-hidden bg-slate-200">
                <img src={img} alt="Store Gallery" className="w-full h-full object-cover hover:scale-110 transition-transform duration-500" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact */}
      <section className="py-16 px-6 bg-white border-t border-slate-200" id="contact">
        <div className="container mx-auto max-w-4xl bg-emerald-50 rounded-2xl p-8 md:p-12 text-center">
          <h2 className="font-modern text-3xl font-bold text-slate-900 mb-6">Get in Touch</h2>
          <p className="text-slate-600 mb-8 max-w-lg mx-auto">Have questions about an order or want to request a product? Reach out to our friendly support team.</p>
          <div className="flex flex-wrap justify-center gap-4 mb-8">
            <div className="flex items-center justify-center gap-3 bg-white px-6 py-4 rounded-xl shadow-sm border border-emerald-100 w-full sm:w-auto">
              <Phone className="text-emerald-600 shrink-0" />
              <span className="font-bold text-slate-800">{content.contact_info?.phone || '1800 123 4567'}</span>
            </div>
            <div className="flex items-center justify-center gap-3 bg-white px-6 py-4 rounded-xl shadow-sm border border-emerald-100 w-full sm:w-auto">
              <Mail className="text-emerald-600 shrink-0" />
              <span className="font-bold text-slate-800 break-all">{content.contact_info?.email || 'hello@example.com'}</span>
            </div>
            <div className="flex items-center justify-center gap-3 bg-white px-6 py-4 rounded-xl shadow-sm border border-emerald-100 w-full sm:w-auto">
              <MapPin className="text-emerald-600 shrink-0" />
              <span className="font-bold text-slate-800 text-sm max-w-[200px] truncate">{content.contact_info?.address || '123 Market Street'}</span>
            </div>
          </div>

          <div className="flex justify-center gap-4 mb-8">
            {content.social_links?.facebook && (
              <a href={content.social_links.facebook} target="_blank" rel="noreferrer" className="w-12 h-12 rounded-full bg-white text-emerald-600 flex items-center justify-center shadow-sm hover:bg-emerald-600 hover:text-white transition-colors border border-emerald-100">
                <Facebook size={20} />
              </a>
            )}
            {content.social_links?.instagram && (
              <a href={content.social_links.instagram} target="_blank" rel="noreferrer" className="w-12 h-12 rounded-full bg-white text-emerald-600 flex items-center justify-center shadow-sm hover:bg-emerald-600 hover:text-white transition-colors border border-emerald-100">
                <Instagram size={20} />
              </a>
            )}
            {content.social_links?.twitter && (
              <a href={content.social_links.twitter} target="_blank" rel="noreferrer" className="w-12 h-12 rounded-full bg-white text-emerald-600 flex items-center justify-center shadow-sm hover:bg-emerald-600 hover:text-white transition-colors border border-emerald-100">
                <Twitter size={20} />
              </a>
            )}
            {content.social_links?.whatsapp && (
              <a href={content.social_links.whatsapp} target="_blank" rel="noreferrer" className="w-12 h-12 rounded-full bg-white text-emerald-600 flex items-center justify-center shadow-sm hover:bg-emerald-600 hover:text-white transition-colors border border-emerald-100">
                <WhatsApp size={20} />
              </a>
            )}
            {(!content.social_links?.facebook && !content.social_links?.instagram && !content.social_links?.twitter && !content.social_links?.whatsapp) && (
              <>
                <a href="#" className="w-12 h-12 rounded-full bg-white text-emerald-600 flex items-center justify-center shadow-sm hover:bg-emerald-600 hover:text-white transition-colors border border-emerald-100">
                  <Facebook size={20} />
                </a>
                <a href="#" className="w-12 h-12 rounded-full bg-white text-emerald-600 flex items-center justify-center shadow-sm hover:bg-emerald-600 hover:text-white transition-colors border border-emerald-100">
                  <Instagram size={20} />
                </a>
                <a href="#" className="w-12 h-12 rounded-full bg-white text-emerald-600 flex items-center justify-center shadow-sm hover:bg-emerald-600 hover:text-white transition-colors border border-emerald-100">
                  <WhatsApp size={20} />
                </a>
              </>
            )}
          </div>

          <div className="w-full h-64 md:h-80 rounded-2xl overflow-hidden border-4 border-white shadow-md relative">
            <iframe 
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d387190.2798902705!2d-74.25986548248684!3d40.697670067823786!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89c24fa5d33f083b%3A0xc80b8f06e177fe62!2sNew%20York%2C%20NY%2C%20USA!5e0!3m2!1sen!2sin!4v1689264426578!5m2!1sen!2sin" 
              width="100%" 
              height="100%" 
              style={{ border: 0 }} 
              allowFullScreen={true} 
              loading="lazy" 
              referrerPolicy="no-referrer-when-downgrade"
              className="absolute inset-0 grayscale hover:grayscale-0 transition-all duration-700"
            ></iframe>
          </div>
        </div>
      </section>

      {/* Custom Blocks Section */}
      {content.custom_blocks_json && content.custom_blocks_json.length > 0 && (
        <section className="py-16 px-6 bg-slate-50 border-t border-slate-200">
          <div className="container mx-auto max-w-4xl space-y-6">
            {content.custom_blocks_json.map((block: any) => {
              if (block.type === 'heading') return <h2 key={block.id} className="font-modern text-3xl font-bold text-slate-900">{block.content}</h2>;
              if (block.type === 'paragraph') return <p key={block.id} className="text-slate-600 leading-relaxed whitespace-pre-wrap">{block.content}</p>;
              if (block.type === 'image' && block.url) return <img key={block.id} src={block.url} alt="Custom Content" className="w-full rounded-2xl shadow-sm" />;
              if (block.type === 'divider') return <hr key={block.id} className="border-slate-200 my-8" />;
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
      <footer className="bg-slate-900 text-slate-300 py-12 px-6">
        <div className="container mx-auto grid md:grid-cols-4 gap-8">
           <div className="md:col-span-2">
             <h4 className="font-modern font-bold text-xl text-white mb-4">{siteName}</h4>
             <p className="text-sm max-w-sm leading-relaxed mb-6">
               {content.about_text || "Your trusted neighborhood supermarket, now online. Quality products delivered fast."}
             </p>
           </div>
           <div>
             <h4 className="font-modern font-semibold text-white mb-4">Customer Support</h4>
             <ul className="space-y-2 text-sm">
               <li className="flex items-center gap-2"><Phone size={14} /> {content.contact_info?.phone || '1800 123 4567'}</li>
               <li>Help Center</li>
               <li>Returns & Refunds</li>
             </ul>
           </div>
           <div>
             <h4 className="font-modern font-semibold text-white mb-4">Our Store</h4>
             <p className="text-sm leading-relaxed">
               <MapPin size={14} className="inline mr-1" /> {content.contact_info?.address || '123 Market Street, Kerala'}
             </p>
           </div>
        </div>
      </footer>

      {/* Product Modal */}
      {selectedProduct && (
        <div className="fixed inset-0 bg-slate-900/60 z-[100] flex items-center justify-center p-4 backdrop-blur-sm" onClick={() => setSelectedProduct(null)}>
          <div className="bg-white rounded-3xl max-w-sm w-full overflow-hidden relative shadow-2xl" onClick={e => e.stopPropagation()}>
            <button onClick={() => setSelectedProduct(null)} className="absolute top-4 right-4 bg-slate-100 p-2 rounded-full hover:bg-slate-200 transition-colors z-10 text-slate-600">
              <X size={20} />
            </button>
            <div className="h-48 bg-slate-50 relative p-6 flex items-center justify-center border-b border-slate-100">
              {selectedProduct.image ? (
                <img src={selectedProduct.image} alt={selectedProduct.name} className="max-w-full max-h-full object-contain mix-blend-multiply" />
              ) : (
                <ShoppingCart size={48} className="text-slate-300" />
              )}
            </div>
            <div className="p-5 md:p-6 text-center">
              <div className="text-xs font-bold text-emerald-600 mb-1 uppercase tracking-wide">{selectedProduct.category || 'Product'}</div>
              <h3 className="font-modern text-xl md:text-2xl font-bold text-slate-900 mb-2 leading-tight">{selectedProduct.name}</h3>
              <div className="font-modern text-xl font-black text-slate-800 mb-4">{selectedProduct.price}</div>
              <p className="text-slate-600 text-sm leading-relaxed">
                {selectedProduct.description || 'Enjoy this high-quality product, sourced carefully to ensure the best experience.'}
              </p>
            </div>
          </div>
        </div>
      )}
    
      
      <AllProductsModal isOpen={showAllProducts} onClose={() => setShowAllProducts(false)} products={products || []} onProductSelect={setSelectedProduct} />
      <ProductModal product={selectedProduct} onClose={() => setSelectedProduct(null)} contactInfo={content.contact_info} />
    </div>
  );
}

