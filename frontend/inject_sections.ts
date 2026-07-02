import * as fs from 'fs';
import * as path from 'path';

function walkDir(dir: string, callback: (filepath: string) => void) {
    fs.readdirSync(dir).forEach(f => {
        const dirPath = path.join(dir, f);
        if (fs.statSync(dirPath).isDirectory()) walkDir(dirPath, callback);
        else if (f.endsWith('Theme.tsx')) callback(dirPath);
    });
}

const aboutBlock = `
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
`;

const servicesBlock = `
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
                    {srv.image ? <img src={srv.image} alt={srv.title} className="w-full h-full object-cover" /> : <span className="text-2xl">✨</span>}
                  </div>
                  <h3 className="font-bold text-xl mb-2 text-black">{srv.title}</h3>
                  <p className="opacity-75 text-black">{srv.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}
`;

const menuBlock = `
      {/* Injected Menu Section */}
      {sectionOrder.includes('menu') && !hiddenSections.includes('menu') && (
        <section style={{ order: sectionOrder.indexOf('menu') + 1 }} id="menu" className="py-16 px-6 bg-white border-b border-black/5">
          <div className="container mx-auto max-w-6xl">
            <h2 className="text-3xl md:text-4xl font-bold mb-10 text-center text-black">Our Menu & Products</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {(content.products_json?.length ? content.products_json : [
                { name: 'Featured Item 1', price: '$19.99', description: 'Delicious and freshly prepared for you.' },
                { name: 'Featured Item 2', price: '$24.99', description: 'Our signature classic dish.' },
                { name: 'Featured Item 3', price: '$14.99', description: 'A light and healthy option.' }
              ]).map((prod: any, i: number) => (
                <div key={i} className="bg-black/5 p-6 rounded-xl text-center">
                  {prod.image && (
                    <div className="w-full aspect-video bg-white mb-4 rounded-lg overflow-hidden">
                      <img src={prod.image} alt={prod.name} className="w-full h-full object-cover" />
                    </div>
                  )}
                  <h3 className="font-bold text-xl mb-2 text-black">{prod.name}</h3>
                  <p className="opacity-75 mb-4 text-black">{prod.description}</p>
                  <p className="font-bold text-xl text-black">{prod.price}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}
`;

const galleryBlock = `
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
                <div key={i} className="aspect-square rounded-xl overflow-hidden bg-black/5">
                  <img src={img} alt="Gallery item" className="w-full h-full object-cover hover:scale-110 transition-transform duration-500" />
                </div>
              ))}
            </div>
          </div>
        </section>
      )}
`;

const contactBlock = `
      {/* Injected Contact Section */}
      {sectionOrder.includes('contact') && !hiddenSections.includes('contact') && (
        <section style={{ order: sectionOrder.indexOf('contact') + 1 }} id="contact" className="py-16 px-6 bg-black/5">
          <div className="container mx-auto max-w-4xl bg-white rounded-2xl p-8 md:p-12 shadow-sm text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-black">Contact Us</h2>
            <p className="opacity-80 mb-8 max-w-lg mx-auto text-black">Get in touch with us for any inquiries or support.</p>
            <div className="flex flex-col md:flex-row justify-center gap-4 md:gap-8 mb-8">
              <div className="flex flex-col items-center p-4 bg-black/5 rounded-xl flex-1">
                <span className="text-2xl mb-2">📞</span>
                <span className="font-bold text-black">{content.contact_info?.phone || '1800 123 4567'}</span>
              </div>
              <div className="flex flex-col items-center p-4 bg-black/5 rounded-xl flex-1">
                <span className="text-2xl mb-2">✉️</span>
                <span className="font-bold break-all text-black">{content.contact_info?.email || 'hello@example.com'}</span>
              </div>
              <div className="flex flex-col items-center p-4 bg-black/5 rounded-xl flex-1">
                <span className="text-2xl mb-2">📍</span>
                <span className="font-bold text-black">{content.contact_info?.address || '123 Market Street'}</span>
              </div>
            </div>
          </div>
        </section>
      )}
`;

walkDir('src/components/themes', (filepath) => {
    let content = fs.readFileSync(filepath, 'utf8');
    let original = content;

    // Check what is missing
    const hasAbout = /\{\/\*\s*About\s*\*\/\}/i.test(content) || /id=["']about["']/i.test(content) || /id=["']about-us["']/i.test(content);
    const hasServices = /\{\/\*\s*Services\s*\*\/\}/i.test(content) || /id=["']services["']/i.test(content);
    const hasMenu = /\{\/\*\s*(Menu|Products)\s*\*\/\}/i.test(content) || /id=["'](menu|products)["']/i.test(content) || /id=["']offers["']/i.test(content) || content.includes('content.products_json');
    const hasGallery = /\{\/\*\s*(Gallery|Lookbook|Portfolio)\s*\*\/\}/i.test(content) || /id=["'](gallery|lookbook|portfolio)["']/i.test(content);
    const hasContact = /\{\/\*\s*Contact\s*\*\/\}/i.test(content) || /id=["']contact["']/i.test(content) || /id=["']visit["']/i.test(content);

    let injection = "";
    if (!hasAbout) injection += aboutBlock;
    if (!hasServices) injection += servicesBlock;
    if (!hasMenu) injection += menuBlock;
    if (!hasGallery) injection += galleryBlock;
    if (!hasContact) injection += contactBlock;

    if (injection.length > 0) {
        // Inject before "Dynamic Custom Section" or "Footer" or last closing div
        if (content.includes('{/* Dynamic Custom Section */}')) {
            content = content.replace('{/* Dynamic Custom Section */}', injection + '\n      {/* Dynamic Custom Section */}');
        } else if (content.includes('{/* Footer */}')) {
            content = content.replace('{/* Footer */}', injection + '\n      {/* Footer */}');
        } else {
            // Find last </div>
            const lastDivIdx = content.lastIndexOf('</div>');
            if (lastDivIdx !== -1) {
                content = content.slice(0, lastDivIdx) + injection + content.slice(lastDivIdx);
            }
        }

        if (content !== original) {
            fs.writeFileSync(filepath, content);
            console.log('Injected sections into', filepath);
        }
    }
});
