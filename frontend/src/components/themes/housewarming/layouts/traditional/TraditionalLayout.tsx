import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, Phone, CalendarDays, Clock, Home, Heart } from 'lucide-react';

export interface HousewarmingLayoutProps {
  content: any;
}

export function TraditionalLayout({ content }: HousewarmingLayoutProps) {
  const [activeSection, setActiveSection] = useState('hero');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showOpening, setShowOpening] = useState(true);

  const housewarmingData = content?.settings_json?.housewarming || {};
  const sections = housewarmingData.sections || [];

  const isVisible = (id: string) => sections.find((s: any) => s.id === id)?.visible !== false;

  const getOrderedSections = () => {
    return sections.filter((s: any) => s.visible !== false);
  };

  const navItems = getOrderedSections().map((s: any) => ({
    id: s.id,
    label: s.label
  }));

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      const windowHeight = window.innerHeight;
      
      const sectionElements = navItems.map(item => ({
        id: item.id,
        element: document.getElementById(item.id)
      }));

      for (let i = sectionElements.length - 1; i >= 0; i--) {
        const { id, element } = sectionElements[i];
        if (element) {
          const { top } = element.getBoundingClientRect();
          if (top <= windowHeight * 0.4) {
            setActiveSection(id);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [navItems]);

  const scrollTo = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      const offset = 80;
      const bodyRect = document.body.getBoundingClientRect().top;
      const elementRect = element.getBoundingClientRect().top;
      const elementPosition = elementRect - bodyRect;
      const offsetPosition = elementPosition - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
    setIsMenuOpen(false);
  };

  // Opening Animation Component
  if (showOpening) {
    return (
      <AnimatePresence>
        <motion.div
          className="fixed inset-0 z-50 bg-[#FFFAF0] flex items-center justify-center overflow-hidden cursor-pointer"
          onClick={() => setShowOpening(false)}
          exit={{ opacity: 0, scale: 1.1, filter: "blur(10px)", transition: { duration: 1.2, ease: [0.4, 0, 0.2, 1] } }}
        >
          {/* Subtle floral/mandala background pattern */}
          <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'radial-gradient(#d97706 2px, transparent 2px)', backgroundSize: '30px 30px' }}></div>
          
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.5, ease: "easeOut" }}
            className="text-center z-10 p-8 border-[6px] border-[#D4AF37]/30 rounded-t-full rounded-b-lg max-w-sm w-full mx-4 relative bg-white/50 backdrop-blur-sm"
          >
            {/* Top motif */}
            <motion.div 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 1 }}
              className="absolute -top-10 left-1/2 -translate-x-1/2 text-[#D4AF37]"
            >
              <svg width="60" height="40" viewBox="0 0 60 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M30 0C30 0 45 20 60 20C45 20 30 40 30 40C30 40 15 20 0 20C15 20 30 0 30 0Z" fill="currentColor"/>
              </svg>
            </motion.div>

            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8, duration: 1 }}
              className="font-serif italic text-[#8B4513] mb-4 text-sm"
            >
              You're Invited
            </motion.p>
            <motion.h1
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1, duration: 1 }}
              className="font-serif text-3xl md:text-4xl text-[#B8860B] mb-2 leading-tight"
            >
              Grihapravesham
            </motion.h1>
            <motion.div
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ delay: 1.5, duration: 1 }}
              className="h-px w-24 bg-[#D4AF37] mx-auto my-4"
            />
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.8, duration: 1 }}
              className="font-serif text-[#8B4513] font-bold text-lg"
            >
              {housewarmingData.hostName}
            </motion.p>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1, y: [0, 5, 0] }}
              transition={{ delay: 2.2, duration: 2, repeat: Infinity }}
              className="text-[#D4AF37] text-xs font-bold uppercase tracking-[0.2em] mt-8"
            >
              Tap to Open
            </motion.p>
          </motion.div>
        </motion.div>
      </AnimatePresence>
    );
  }

  const parseDateTime = () => {
    try {
      if (!content.date) return { month: 'OCT', day: '25', year: '2026', weekday: 'SUNDAY', time: '9:00 AM' };
      const d = new Date(content.date);
      return {
        month: d.toLocaleString('en-US', { month: 'short' }).toUpperCase(),
        day: d.getDate().toString(),
        year: d.getFullYear().toString(),
        weekday: d.toLocaleString('en-US', { weekday: 'long' }).toUpperCase(),
        time: housewarmingData.time || '9:00 AM'
      };
    } catch {
      return { month: 'OCT', day: '25', year: '2026', weekday: 'SUNDAY', time: '9:00 AM' };
    }
  };
  const dateInfo = parseDateTime();

  return (
    <div className="font-serif bg-[#FFFAF0] text-[#4A3B32] min-h-screen selection:bg-[#F4A460] selection:text-white">
      {/* Background Texture */}
      <div className="fixed inset-0 pointer-events-none opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(#8B4513 1px, transparent 1px)', backgroundSize: '40px 40px' }}></div>
      <div className="fixed top-0 left-0 right-0 h-3 bg-gradient-to-r from-[#D4AF37] via-[#F4A460] to-[#D4AF37] z-50 shadow-[0_4px_15px_rgba(212,175,55,0.4)]"></div>

      {/* Navigation */}
      <nav className={`fixed top-3 left-0 right-0 z-40 transition-all duration-300 bg-[#FFFAF0]/90 backdrop-blur-md border-b border-[#F4A460]/20 shadow-sm`}>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex-shrink-0 flex items-center cursor-pointer" onClick={() => scrollTo('hero')}>
              <span className="font-serif text-[#B8860B] font-bold text-xl tracking-wider uppercase">{housewarmingData.hostName || 'Housewarming'}</span>
            </div>
            
            <div className="hidden md:flex space-x-8">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => scrollTo(item.id)}
                  className={`text-xs uppercase tracking-widest font-semibold transition-colors duration-300 ${
                    activeSection === item.id 
                      ? 'text-[#B8860B] border-b-2 border-[#B8860B]' 
                      : 'text-[#8B4513] hover:text-[#B8860B]'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>

            <div className="md:hidden flex items-center">
              <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="text-[#8B4513] focus:outline-none">
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  {isMenuOpen ? (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  ) : (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  )}
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden bg-[#FFFAF0] border-b border-[#F4A460]/20"
            >
              <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
                {navItems.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => scrollTo(item.id)}
                    className={`block w-full text-left px-3 py-2 text-sm uppercase tracking-widest font-semibold ${
                      activeSection === item.id 
                        ? 'text-[#B8860B] bg-[#FDF5E6]' 
                        : 'text-[#8B4513] hover:text-[#B8860B] hover:bg-[#FDF5E6]'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      <main className="pt-16">
        {getOrderedSections().map((section: any) => {
          switch (section.id) {
            case 'hero':
              return (
                <section key="hero" id="hero" className="relative min-h-[90vh] flex items-center justify-center overflow-hidden py-20 px-4">
                  {/* Ornate Background Frame */}
                  <div className="absolute inset-4 md:inset-8 border-2 border-[#D4AF37]/30 rounded-t-full pointer-events-none"></div>
                  <div className="absolute inset-6 md:inset-12 border border-[#F4A460]/20 rounded-t-full pointer-events-none"></div>
                  
                  <div className="relative z-10 max-w-4xl mx-auto text-center">
                    <motion.div
                      initial={{ opacity: 0, y: 30 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 1 }}
                    >
                      <div className="w-16 h-16 mx-auto mb-6 opacity-80 text-[#D4AF37]">
                        <Home size={64} strokeWidth={1} />
                      </div>
                      <h2 className="text-[#8B4513] text-sm md:text-base font-bold uppercase tracking-[0.3em] mb-4">
                        {housewarmingData.tagline || 'Please join us for'}
                      </h2>
                      <h1 className="font-serif text-5xl md:text-7xl text-[#B8860B] mb-6 leading-tight capitalize">
                        {content.hero_title || 'Our New Home'}
                      </h1>
                      <div className="flex items-center justify-center gap-4 my-8">
                        <div className="h-px w-16 bg-[#D4AF37]"></div>
                        <Heart className="text-[#F4A460] w-5 h-5 fill-current opacity-70" />
                        <div className="h-px w-16 bg-[#D4AF37]"></div>
                      </div>
                      
                      <div className="inline-flex flex-col items-center justify-center p-8 border border-[#D4AF37]/30 rounded-sm bg-white/50 backdrop-blur-sm">
                        <span className="text-[#8B4513] text-sm uppercase tracking-widest font-bold mb-2">{dateInfo.weekday}</span>
                        <div className="flex items-center gap-4 text-[#B8860B]">
                          <span className="text-3xl font-light">{dateInfo.month}</span>
                          <span className="text-6xl font-serif leading-none border-x border-[#D4AF37]/30 px-4">{dateInfo.day}</span>
                          <span className="text-3xl font-light">{dateInfo.year}</span>
                        </div>
                        <span className="text-[#8B4513] text-sm font-semibold tracking-widest mt-4">TIME: {dateInfo.time}</span>
                      </div>
                    </motion.div>
                  </div>
                </section>
              );

            case 'hosts':
              return (
                <section key="hosts" id="hosts" className="py-24 px-4 bg-[#FDF5E6] relative">
                  <div className="max-w-4xl mx-auto text-center relative z-10">
                    <motion.div
                      initial={{ opacity: 0, y: 30 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 1 }}
                    >
                      <h3 className="text-3xl md:text-4xl font-serif text-[#B8860B] mb-12 capitalize relative inline-block">
                        With Blessings Of
                        <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-12 h-0.5 bg-[#D4AF37]"></div>
                      </h3>
                      
                      {housewarmingData.hostPhoto && (
                        <div className="mb-10 relative inline-block">
                          <div className="absolute inset-[-10px] border border-[#D4AF37]/40 rounded-t-full rotate-3"></div>
                          <div className="w-48 h-56 md:w-56 md:h-64 mx-auto rounded-t-full overflow-hidden border-4 border-white shadow-xl relative z-10">
                            <img src={housewarmingData.hostPhoto} alt="Hosts" className="w-full h-full object-cover" />
                          </div>
                        </div>
                      )}
                      
                      <h4 className="text-2xl font-serif text-[#8B4513]">{housewarmingData.hostName}</h4>
                      <p className="mt-4 max-w-xl mx-auto text-[#6b503f] leading-relaxed">
                        We cordially invite you and your family to grace the occasion of our Grihapravesham. Your presence will add to our joy.
                      </p>
                    </motion.div>
                  </div>
                </section>
              );

            case 'story':
              return (
                <section key="story" id="story" className="py-24 px-4 relative">
                  <div className="max-w-3xl mx-auto text-center relative z-10">
                    <motion.div
                      initial={{ opacity: 0, y: 30 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 1 }}
                    >
                      <h3 className="text-3xl md:text-4xl font-serif text-[#B8860B] mb-8 capitalize relative inline-block">
                        {content.about_title || 'Welcome'}
                        <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-12 h-0.5 bg-[#D4AF37]"></div>
                      </h3>
                      <p className="text-[#6b503f] leading-loose text-lg md:text-xl font-serif italic max-w-2xl mx-auto">
                        "{content.about_text}"
                      </p>
                    </motion.div>
                  </div>
                </section>
              );

            case 'schedule':
              return (
                <section key="schedule" id="schedule" className="py-24 px-4 bg-[#FDF5E6]">
                  <div className="max-w-4xl mx-auto">
                    <motion.div
                      initial={{ opacity: 0, y: 30 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 1 }}
                      className="text-center mb-16"
                    >
                      <h3 className="text-3xl md:text-4xl font-serif text-[#B8860B] mb-4 capitalize relative inline-block">
                        Auspicious Timings
                        <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-12 h-0.5 bg-[#D4AF37]"></div>
                      </h3>
                    </motion.div>
                    
                    <div className="space-y-8">
                      {(housewarmingData.schedule || []).map((item: any, index: number) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, x: index % 2 === 0 ? -30 : 30 }}
                          whileInView={{ opacity: 1, x: 0 }}
                          viewport={{ once: true }}
                          transition={{ duration: 0.8, delay: index * 0.2 }}
                          className="flex flex-col md:flex-row items-center justify-between p-8 bg-white border border-[#F4A460]/20 rounded-sm shadow-sm relative overflow-hidden group"
                        >
                          <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-[#D4AF37] to-[#F4A460]"></div>
                          
                          <div className="text-center md:text-left mb-6 md:mb-0 md:flex-1">
                            <h4 className="text-2xl font-serif text-[#8B4513] mb-2">{item.event}</h4>
                            <div className="flex items-center justify-center md:justify-start gap-2 text-[#B8860B] text-sm">
                              <CalendarDays size={14} />
                              <span>{item.date}</span>
                            </div>
                          </div>
                          
                          <div className="text-center md:text-right md:flex-1">
                            <div className="inline-block p-4 border border-[#D4AF37]/30 rounded-sm bg-[#FFFAF0]">
                              <div className="text-[#8B4513] font-bold tracking-widest text-lg">{item.time}</div>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </section>
              );

            case 'venue':
              return (
                <section key="venue" id="venue" className="py-24 px-4 relative overflow-hidden">
                  <div className="max-w-5xl mx-auto relative z-10">
                    <motion.div
                      initial={{ opacity: 0, y: 30 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 1 }}
                      className="text-center mb-16"
                    >
                      <h3 className="text-3xl md:text-4xl font-serif text-[#B8860B] mb-4 capitalize relative inline-block">
                        The Venue
                        <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-12 h-0.5 bg-[#D4AF37]"></div>
                      </h3>
                    </motion.div>
                    
                    <div className="grid md:grid-cols-2 gap-12 items-center">
                      <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 1 }}
                        className="relative"
                      >
                        <div className="absolute inset-[-15px] border-2 border-[#D4AF37]/30 rounded-lg"></div>
                        {housewarmingData.venuePhoto ? (
                          <img src={housewarmingData.venuePhoto} alt="Venue" className="w-full h-80 object-cover rounded-lg shadow-lg relative z-10" />
                        ) : (
                          <div className="w-full h-80 bg-[#FDF5E6] rounded-lg shadow-lg relative z-10 flex items-center justify-center border border-[#F4A460]/20">
                            <Home size={64} className="text-[#D4AF37]/50" />
                          </div>
                        )}
                      </motion.div>
                      
                      <motion.div
                        initial={{ opacity: 0, x: 30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 1 }}
                        className="space-y-8 text-center md:text-left"
                      >
                        <div>
                          <h4 className="text-2xl font-serif text-[#8B4513] mb-4">Our New Home</h4>
                          <p className="text-[#6b503f] font-medium leading-relaxed">
                            {content.contact_info?.address || housewarmingData.venue}
                          </p>
                        </div>
                        
                        <a 
                          href={housewarmingData.mapUrl || '#'} 
                          target="_blank" 
                          rel="noreferrer"
                          className="inline-flex items-center gap-2 bg-[#8B4513] text-white px-8 py-4 text-sm tracking-widest font-bold hover:bg-[#A0522D] transition-colors shadow-lg"
                        >
                          <MapPin size={18} /> Get Directions
                        </a>
                      </motion.div>
                    </div>
                  </div>
                </section>
              );

            case 'gallery':
              const gallery = housewarmingData.gallery || [];
              if (gallery.length === 0) return null;
              return (
                <section key="gallery" id="gallery" className="py-24 px-4 bg-[#FDF5E6]">
                  <div className="max-w-6xl mx-auto">
                    <motion.div
                      initial={{ opacity: 0, y: 30 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 1 }}
                      className="text-center mb-16"
                    >
                      <h3 className="text-3xl md:text-4xl font-serif text-[#B8860B] mb-4 capitalize relative inline-block">
                        Glimpses
                        <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-12 h-0.5 bg-[#D4AF37]"></div>
                      </h3>
                    </motion.div>
                    
                    <div className="columns-1 sm:columns-2 lg:columns-3 gap-6 space-y-6">
                      {gallery.map((url: string, index: number) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, scale: 0.9 }}
                          whileInView={{ opacity: 1, scale: 1 }}
                          viewport={{ once: true }}
                          transition={{ duration: 0.6, delay: index * 0.1 }}
                          className="break-inside-avoid relative group"
                        >
                          <div className="absolute inset-0 bg-[#D4AF37] opacity-0 group-hover:opacity-20 transition-opacity duration-300 z-10 pointer-events-none rounded-sm"></div>
                          <img src={url} alt={`Gallery ${index}`} className="w-full h-auto object-cover rounded-sm border-4 border-white shadow-md" />
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </section>
              );

            case 'rsvp':
              return (
                <section key="rsvp" id="rsvp" className="py-24 px-4 relative overflow-hidden">
                  {/* Footer Background Pattern */}
                  <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(#8B4513 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>
                  
                  <div className="max-w-3xl mx-auto text-center relative z-10">
                    <motion.div
                      initial={{ opacity: 0, y: 30 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 1 }}
                      className="bg-white/80 backdrop-blur-sm p-12 border border-[#D4AF37]/30 rounded-sm shadow-xl"
                    >
                      <h3 className="text-3xl md:text-4xl font-serif text-[#B8860B] mb-6 capitalize relative inline-block">
                        Kindly Respond
                        <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-12 h-0.5 bg-[#D4AF37]"></div>
                      </h3>
                      <p className="text-[#6b503f] mb-10 font-serif italic">
                        Please confirm your presence to help us make better arrangements.
                      </p>
                      
                      <div className="flex flex-col md:flex-row items-center justify-center gap-6">
                        <div className="flex items-center gap-3 text-[#8B4513] font-bold text-lg">
                          <Phone className="text-[#D4AF37]" size={24} />
                          {housewarmingData.contactNumbers || content.contact_info?.phone}
                        </div>
                      </div>
                    </motion.div>
                  </div>
                </section>
              );
            default: return null;
          }
        })}
      </main>

      {/* Footer */}
      <footer className="bg-[#8B4513] text-[#FDF5E6] py-12 text-center relative">
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#D4AF37] via-[#F4A460] to-[#D4AF37]"></div>
        <p className="font-serif italic opacity-80 max-w-md mx-auto px-4">
          Looking forward to celebrating this special milestone with you.
        </p>
        <div className="mt-8 opacity-50 text-xs tracking-widest font-bold uppercase">
          Made with Jaalam
        </div>
      </footer>
    </div>
  );
}
