import React, { useState } from 'react';
import { Calendar, MapPin, Ticket, Users, Zap, Mail, Phone, ExternalLink, Power, MessageCircle, Camera, Heart, Star, Sparkles, Flame, Play, Pause, Menu, X } from 'lucide-react';
import useScrollReveal from '../../../../hooks/useScrollReveal';

const WhatsAppIcon = ({ size = 24, className = "" }: { size?: number, className?: string }) => (
  <svg width={size} height={size} className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path>
  </svg>
);

const InstagramIcon = ({ size = 24, className = "" }: { size?: number, className?: string }) => (
  <svg width={size} height={size} className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
  </svg>
);

interface TechFestClassicLayoutProps {
  content?: any;
  website?: any;
  updateContent?: (content: any) => void;
  isEditor?: boolean;
}

export default function TechFestClassicLayout({ content, website, updateContent, isEditor }: TechFestClassicLayoutProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [likeCount, setLikeCount] = useState(2453);
  const [hasLiked, setHasLiked] = useState(false);
  const [clickAnim, setClickAnim] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const audioRef = React.useRef<HTMLAudioElement>(null);
  useScrollReveal();

  const toggleMusic = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play().catch(err => console.log(err));
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleLike = (e: React.MouseEvent) => {
    e.stopPropagation();
    setLikeCount(prev => prev + 1);
    setHasLiked(true);
    setClickAnim(true);
    setTimeout(() => setClickAnim(false), 200);
  };

  const handleTextChange = (field: string, value: string) => {
    if (isEditor && updateContent) {
      updateContent({ ...content, [field]: value });
    }
  };

  const isEditable = isEditor ? { contentEditable: true, suppressContentEditableWarning: true } : {};

  const heroBg = content?.hero_bg || 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&w=1920&q=80';
  
  const sectionOrder = content?.settings_json?.section_order || ['hero', 'about', 'services', 'gallery', 'contact'];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-serif selection:bg-blue-600 selection:text-white">
      
      {/* Navbar */}
      <nav className="sticky top-0 z-[100] bg-white/95 backdrop-blur-sm border-b border-slate-200 shadow-sm">
        <div className="container mx-auto px-6 h-20 flex items-center justify-between">
          <div className="font-sans font-bold text-2xl tracking-tighter text-blue-900 uppercase">
            {content?.settings_json?.website_name || website?.slug || 'Tech Fest'}
          </div>
          
          <div className="hidden md:flex items-center gap-8 font-sans text-sm font-semibold text-slate-600">
            {sectionOrder.map((section: string) => {
              if (section === 'hero') return null;
              const isHidden = content?.settings_json?.hidden_sections?.includes(section);
              if (isHidden) return null;
              
              const label = section === 'about' ? 'About' : 
                            section === 'services' ? 'Events' : 
                            section === 'gallery' ? 'Gallery' : 'Contact';
              return (
                <button 
                  key={section}
                  onClick={() => document.getElementById(`${section}-section`)?.scrollIntoView({ behavior: 'smooth' })}
                  className="hover:text-blue-600 transition-colors uppercase tracking-wide"
                >
                  {label}
                </button>
              );
            })}
            <button 
              onClick={() => document.getElementById('contact-section')?.scrollIntoView({ behavior: 'smooth' })}
              className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition-colors shadow-sm"
            >
              REGISTER
            </button>
          </div>
          
          <button className="md:hidden text-slate-800" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            {mobileMenuOpen ? <X /> : <Menu />}
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 top-20 z-50 bg-white border-t border-slate-100 flex flex-col items-center justify-center gap-8 font-sans text-lg font-bold">
            {sectionOrder.map((section: string) => {
              if (section === 'hero') return null;
              const isHidden = content?.settings_json?.hidden_sections?.includes(section);
              if (isHidden) return null;
              
              const label = section === 'about' ? 'About' : 
                            section === 'services' ? 'Events' : 
                            section === 'gallery' ? 'Gallery' : 'Contact';
              return (
                <button 
                  key={section}
                  onClick={() => {
                    document.getElementById(`${section}-section`)?.scrollIntoView({ behavior: 'smooth' });
                    setMobileMenuOpen(false);
                  }}
                  className="hover:text-blue-600 transition-colors uppercase tracking-wide"
                >
                  {label}
                </button>
              );
            })}
            <button 
              onClick={() => {
                document.getElementById('contact-section')?.scrollIntoView({ behavior: 'smooth' });
                setMobileMenuOpen(false);
              }}
              className="bg-blue-600 text-white px-8 py-3 rounded-md hover:bg-blue-700 transition-colors shadow-md mt-4"
            >
              REGISTER NOW
            </button>
        </div>
      )}

      {sectionOrder.map((sectionName: string) => {
        const isHidden = content?.settings_json?.hidden_sections?.includes(sectionName);
        if (isHidden && sectionName !== 'hero' && !isEditor) return null;
        
        return (
          <React.Fragment key={sectionName}>
            {sectionName === 'hero' && (
              <section id="hero-section" className={`relative min-h-[85vh] flex items-center justify-center ${isHidden ? 'opacity-50' : ''}`}>
                <div className="absolute inset-0 z-0">
                  <img src={heroBg} alt="University" className="w-full h-full object-cover opacity-10 grayscale" />
                  <div className="absolute inset-0 bg-blue-900/5 mix-blend-multiply" />
                </div>

                <div className="container mx-auto px-6 relative z-10 text-center max-w-4xl py-20">
                  <div className="reveal">
                    <span 
                      className="inline-block py-1 px-4 border border-blue-200 text-blue-800 text-xs font-sans font-bold tracking-widest uppercase mb-8 bg-white/50 backdrop-blur-sm shadow-sm"
                      {...isEditable}
                      onBlur={(e) => handleTextChange('hero_subtitle', e.currentTarget.textContent || '')}
                    >
                      {content?.hero_subtitle || website?.business_type || 'Annual Symposium'}
                    </span>
                  </div>

                  <h1 
                    className="reveal text-5xl md:text-7xl font-bold mb-6 text-slate-900 tracking-tight leading-tight"
                    {...isEditable}
                    onBlur={(e) => handleTextChange('hero_title', e.currentTarget.textContent || '')}
                  >
                    {content?.hero_title || 'The Academic Innovation Summit'}
                  </h1>

                  <p 
                    className="reveal text-lg md:text-2xl text-slate-600 font-sans mb-12 max-w-3xl mx-auto leading-relaxed"
                    {...isEditable}
                    onBlur={(e) => handleTextChange('hero_description', e.currentTarget.textContent || '')}
                  >
                    {content?.hero_description || content?.hero_text || 'Join leading minds and innovators for three days of rigorous academic discourse and technological exploration.'}
                  </p>

                  <div className="reveal flex flex-wrap justify-center gap-8 text-sm font-sans font-semibold text-slate-700 mb-12">
                    <div className="flex items-center gap-3 bg-white px-6 py-4 rounded-lg shadow-sm border border-slate-100">
                      <Calendar className="text-blue-600" size={20} />
                      <span 
                        {...isEditable} 
                        onBlur={(e) => handleTextChange('date', e.currentTarget.textContent || '')}
                      >
                        {content?.date || 'October 15 - 17, 2026'}
                      </span>
                    </div>
                    <div className="flex items-center gap-3 bg-white px-6 py-4 rounded-lg shadow-sm border border-slate-100">
                      <MapPin className="text-blue-600" size={20} />
                      <span 
                        {...isEditable} 
                        onBlur={(e) => {
                          if (isEditor && updateContent) {
                            updateContent({ ...content, contact_info: { ...(content.contact_info || {}), address: e.currentTarget.textContent || '' } });
                          }
                        }}
                      >
                        {content?.contact_info?.address || 'Main Campus Auditorium'}
                      </span>
                    </div>
                  </div>

                  <div className="reveal">
                    <button 
                      onClick={() => document.getElementById('contact-section')?.scrollIntoView({ behavior: 'smooth' })}
                      className="bg-blue-600 text-white font-sans font-bold uppercase tracking-widest py-4 px-12 rounded-md hover:bg-blue-700 hover:shadow-lg transition-all flex items-center gap-3 mx-auto"
                    >
                      <Ticket size={20} />
                      Register Now
                    </button>
                  </div>
                </div>
              </section>
            )}

            {sectionName === 'about' && (content?.about_title || content?.about_text || content?.settings_json?.about_title || content?.settings_json?.about_description || isEditor) && (
              <section id="about-section" className={`py-24 px-6 bg-white border-t border-slate-100 ${isHidden ? 'opacity-50' : ''}`}>
                <div className="container mx-auto max-w-4xl">
                  <div className="text-center mb-16 reveal">
                    <h2 
                      className="text-3xl md:text-4xl font-bold mb-6 text-slate-900"
                      {...isEditable}
                      onBlur={(e) => {
                        if (isEditor && updateContent) {
                          updateContent({ ...content, settings_json: { ...(content.settings_json || {}), about_title: e.currentTarget.textContent || '' } });
                        }
                      }}
                    >
                      {content?.settings_json?.about_title || content?.about_title || 'About The Symposium'}
                    </h2>
                    <div className="w-16 h-1 bg-blue-600 mx-auto" />
                  </div>
                  
                  <div className="prose prose-lg mx-auto text-slate-600 font-sans leading-relaxed text-center reveal">
                    <p
                      {...isEditable}
                      onBlur={(e) => {
                        if (isEditor && updateContent) {
                          updateContent({ ...content, settings_json: { ...(content.settings_json || {}), about_description: e.currentTarget.textContent || '' } });
                        }
                      }}
                    >
                      {content?.settings_json?.about_description || content?.about_text || 'Add your detailed description here. Discuss the history, purpose, and impact of the event.'}
                    </p>
                  </div>
                  
                  <div className="grid md:grid-cols-3 gap-8 mt-20 text-center font-sans">
                    <div className="reveal bg-slate-50 p-8 rounded-xl border border-slate-100 hover:shadow-md transition-shadow">
                      <div className="w-12 h-12 bg-blue-100 text-blue-600 flex items-center justify-center rounded-full mx-auto mb-4">
                        <Users size={24} />
                      </div>
                      <h4 className="font-bold text-xl mb-2 text-slate-900">5,000+</h4>
                      <p className="text-sm text-slate-500 uppercase tracking-widest font-semibold">Attendees</p>
                    </div>
                    <div className="reveal bg-slate-50 p-8 rounded-xl border border-slate-100 hover:shadow-md transition-shadow delay-100">
                      <div className="w-12 h-12 bg-blue-100 text-blue-600 flex items-center justify-center rounded-full mx-auto mb-4">
                        <MessageCircle size={24} />
                      </div>
                      <h4 className="font-bold text-xl mb-2 text-slate-900">50+</h4>
                      <p className="text-sm text-slate-500 uppercase tracking-widest font-semibold">Speakers</p>
                    </div>
                    <div className="reveal bg-slate-50 p-8 rounded-xl border border-slate-100 hover:shadow-md transition-shadow delay-200">
                      <div className="w-12 h-12 bg-blue-100 text-blue-600 flex items-center justify-center rounded-full mx-auto mb-4">
                        <Ticket size={24} />
                      </div>
                      <h4 className="font-bold text-xl mb-2 text-slate-900">3 Days</h4>
                      <p className="text-sm text-slate-500 uppercase tracking-widest font-semibold">Of Excellence</p>
                    </div>
                  </div>
                </div>
              </section>
            )}

            {sectionName === 'services' && (content?.services_json?.length > 0 || isEditor) && (
              <section id="services-section" className={`py-24 px-6 bg-slate-50 border-t border-slate-200 ${isHidden ? 'opacity-50' : ''}`}>
                <div className="container mx-auto max-w-6xl">
                  <div className="text-center mb-16 reveal">
                    <h2 className="text-3xl md:text-4xl font-bold mb-6 text-slate-900">Featured Events</h2>
                    <div className="w-16 h-1 bg-blue-600 mx-auto" />
                  </div>
                  
                  {(!content?.services_json || content?.services_json?.length === 0) && isEditor ? (
                    <div className="text-center text-slate-500 p-12 bg-white rounded-xl border border-dashed border-slate-300">
                      <p className="font-sans font-medium">No events added yet. Add some events in the "Events" tab.</p>
                    </div>
                  ) : (
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                      {content.services_json?.map((service: any, index: number) => (
                        <div key={index} className="reveal bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-all border border-slate-100 group">
                          {service.image_url && (
                            <div className="h-48 overflow-hidden bg-slate-100">
                              <img src={service.image_url} alt={service.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                            </div>
                          )}
                          <div className="p-8">
                            <h3 className="font-bold text-xl mb-3 text-slate-900">{service.name}</h3>
                            <p className="text-slate-600 font-sans text-sm leading-relaxed mb-6">{service.description}</p>
                            
                            {(service.time || service.location) && (
                              <div className="pt-4 border-t border-slate-100 font-sans text-sm font-medium text-slate-500 space-y-2">
                                {service.time && (
                                  <div className="flex items-center gap-2">
                                    <Calendar size={14} className="text-blue-500" /> {service.time}
                                  </div>
                                )}
                                {service.location && (
                                  <div className="flex items-center gap-2">
                                    <MapPin size={14} className="text-blue-500" /> {service.location}
                                  </div>
                                )}
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </section>
            )}

            {sectionName === 'gallery' && (content?.gallery_json?.length > 0 || isEditor) && (
              <section id="gallery-section" className={`py-24 px-6 bg-white border-t border-slate-200 ${isHidden ? 'opacity-50' : ''}`}>
                <div className="container mx-auto max-w-7xl">
                  <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 reveal gap-6">
                    <div>
                      <h2 className="text-3xl md:text-4xl font-bold mb-6 text-slate-900">Past Glimpses</h2>
                      <div className="w-16 h-1 bg-blue-600" />
                    </div>
                    <div className="flex items-center gap-2 text-blue-600 font-sans font-bold text-sm tracking-wide uppercase hover:text-blue-800 transition-colors cursor-pointer group">
                      View All Gallery <ExternalLink size={16} className="group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                  
                  {(!content?.gallery_json || content?.gallery_json?.length === 0) && isEditor ? (
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 opacity-40">
                      {[1,2,3,4].map(i => (
                        <div key={i} className="aspect-square bg-slate-100 rounded-lg flex items-center justify-center">
                          <Camera className="text-slate-300" size={32} />
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="columns-1 sm:columns-2 lg:columns-3 gap-6 space-y-6">
                      {content.gallery_json?.map((img: string, index: number) => (
                        <div key={index} className="reveal overflow-hidden rounded-xl bg-slate-100 group break-inside-avoid">
                          <img 
                            src={img} 
                            alt={`Gallery ${index}`} 
                            className="w-full h-auto object-cover group-hover:scale-105 transition-transform duration-700 shadow-sm"
                          />
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </section>
            )}

            {sectionName === 'contact' && (
              <div id="contact-section">
                {(content?.settings_json?.sponsors || isEditor) && (
                  <section className={`py-24 px-6 bg-slate-50 border-t border-slate-200 ${isHidden ? 'opacity-50' : ''}`}>
                    <div className="container mx-auto max-w-5xl text-center">
                      <h2 className="text-2xl md:text-3xl font-bold mb-12 text-slate-900">Official Partners & Sponsors</h2>
                      <div className="flex flex-wrap justify-center gap-6 md:gap-10">
                        {(content?.settings_json?.sponsors ? content.settings_json.sponsors.split(',') : ['University Press', 'Tech Innovators Inc', 'Global Research Institute', 'Academic Books']).map((sponsor: string, idx: number) => (
                          <div key={idx} className="font-sans font-bold text-lg md:text-xl text-slate-400 uppercase tracking-wider hover:text-blue-600 transition-colors cursor-default">
                            {sponsor.trim()}
                          </div>
                        ))}
                      </div>
                    </div>
                  </section>
                )}

                <section className={`py-24 px-6 bg-white border-t border-slate-200 ${isHidden ? 'opacity-50' : ''}`}>
                  <div className="container mx-auto max-w-5xl">
                    <div className="text-center mb-16 reveal">
                      <h2 className="text-3xl md:text-4xl font-bold mb-6 text-slate-900">Contact & Registration</h2>
                      <div className="w-16 h-1 bg-blue-600 mx-auto" />
                    </div>
                    
                    <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto font-sans">
                      <div className="reveal bg-slate-50 p-10 rounded-xl border border-slate-100 text-center">
                        <div className="w-16 h-16 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center mx-auto mb-6">
                          <Phone size={28} />
                        </div>
                        <h3 className="font-bold text-xl mb-2 text-slate-900">Call Us</h3>
                        <p className="text-slate-600 text-lg">{content?.contact_info?.phone || '+1 234 567 8900'}</p>
                      </div>
                      
                      <div className="reveal bg-slate-50 p-10 rounded-xl border border-slate-100 text-center delay-100">
                        <div className="w-16 h-16 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center mx-auto mb-6">
                          <Mail size={28} />
                        </div>
                        <h3 className="font-bold text-xl mb-2 text-slate-900">Email Us</h3>
                        <p className="text-slate-600 text-lg">{content?.contact_info?.email || 'inquiries@symposium.edu'}</p>
                      </div>
                    </div>

                    {(content?.contact_info?.whatsapp || content?.contact_info?.instagram || isEditor) && (
                      <div className="flex justify-center gap-6 mt-12 font-sans">
                        {(content?.contact_info?.whatsapp || isEditor) && (
                          <a 
                            href={content?.contact_info?.whatsapp || '#'} 
                            target="_blank" 
                            rel="noreferrer"
                            className="flex items-center gap-3 px-8 py-4 rounded-md border border-slate-200 bg-white hover:border-green-500 hover:text-green-600 transition-colors shadow-sm font-bold text-slate-700"
                          >
                            <WhatsAppIcon size={20} />
                            <span>WhatsApp</span>
                          </a>
                        )}
                        {(content?.contact_info?.instagram || isEditor) && (
                          <a 
                            href={content?.contact_info?.instagram || '#'} 
                            target="_blank" 
                            rel="noreferrer"
                            className="flex items-center gap-3 px-8 py-4 rounded-md border border-slate-200 bg-white hover:border-pink-500 hover:text-pink-600 transition-colors shadow-sm font-bold text-slate-700"
                          >
                            <InstagramIcon size={20} />
                            <span>Instagram</span>
                          </a>
                        )}
                      </div>
                    )}
                  </div>
                </section>
              </div>
            )}
          </React.Fragment>
        );
      })}

      <footer className="py-12 text-center text-slate-500 bg-slate-900 font-sans text-sm border-t border-slate-800">
        <div className="container mx-auto px-6">
          <p>&copy; {new Date().getFullYear()} {website?.slug || 'Tech Fest'}. All rights reserved.</p>
        </div>
      </footer>

      {/* Floating Like Button */}
      {(() => {
        const ClickIcon = content?.settings_json?.click_icon === 'star' ? Star :
                          content?.settings_json?.click_icon === 'sparkles' ? Sparkles :
                          content?.settings_json?.click_icon === 'zap' ? Zap :
                          content?.settings_json?.click_icon === 'flame' ? Flame : Heart;
        return (
          <button 
            onClick={handleLike}
            className={`fixed right-6 bottom-6 z-[200] px-5 py-3 rounded-full border transition-all flex items-center justify-center shadow-lg gap-3 font-sans ${hasLiked ? 'bg-blue-600 text-white border-blue-500' : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'} ${clickAnim ? 'scale-90' : 'scale-100 hover:scale-105'}`}
          >
            <ClickIcon size={24} className={`${hasLiked ? 'fill-current' : ''} ${clickAnim ? 'animate-ping' : ''}`} />
            <span className="font-bold text-lg tracking-wide">{likeCount.toLocaleString()}</span>
          </button>
        );
      })()}

      {/* Background Music */}
      <audio ref={audioRef} src={content?.settings_json?.music_url || "https://cdn.pixabay.com/audio/2022/01/18/audio_d0a13f69d2.mp3"} loop />

      {/* Floating Music Toggle Button */}
      <button 
        onClick={toggleMusic}
        className="music-toggle-btn fixed left-0 top-1/2 -translate-y-1/2 z-[200] bg-white p-3 rounded-r-xl border border-slate-200 border-l-0 text-slate-700 hover:bg-slate-50 transition-all flex items-center justify-center shadow-md"
        title={isPlaying ? "Pause Music" : "Play Music"}
      >
        {isPlaying ? <Pause size={20} /> : <Play size={20} className="ml-1" />}
      </button>
    </div>
  );
}
