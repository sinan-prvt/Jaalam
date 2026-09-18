import React, { useState } from 'react';
import { Calendar, MapPin, Ticket, Users, Zap, Mail, Phone, ExternalLink, Power, MessageCircle, Camera, Heart, Star, Sparkles, Flame, Play, Pause } from 'lucide-react';
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

interface TechFestModernLayoutProps {
  content?: any;
  website?: any;
  updateContent?: (content: any) => void;
  isEditor?: boolean;
  colors?: {
    bgClass: string;
    sectionBg: string;
    accentText: string;
    accentBg: string;
    accentHover: string;
    borderClass: string;
    heroOpacity: string;
    heroBg: string;
  };
}

export default function TechFestModernLayout({ content, website, updateContent, isEditor, colors }: TechFestModernLayoutProps) {
  const [isOpened, setIsOpened] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [likeCount, setLikeCount] = useState(2453);
  const [hasLiked, setHasLiked] = useState(false);
  const [clickAnim, setClickAnim] = useState(false);
  const audioRef = React.useRef<HTMLAudioElement>(null);
  useScrollReveal();

  const handleInit = () => {
    setIsOpened(true);
    if (audioRef.current) {
      audioRef.current.volume = 0.5;
      audioRef.current.play().then(() => setIsPlaying(true)).catch(e => console.log('Audio play failed:', e));
    }
  };

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

  const c = colors || {
    bgClass: 'bg-black',
    sectionBg: 'bg-slate-900',
    accentText: 'text-cyan-400',
    accentBg: 'bg-cyan-500',
    accentHover: 'hover:bg-cyan-400',
    borderClass: 'border-cyan-500/30',
    heroOpacity: 'opacity-40',
    heroBg: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=1920&q=80'
  };

  const isEditable = isEditor ? { contentEditable: true, suppressContentEditableWarning: true } : {};

  return (
    <div
      className={`min-h-screen ${c.bgClass} text-white font-sans selection:${c.accentBg} selection:text-black ${!isOpened ? 'h-screen overflow-hidden' : ''}`}
    >

      {/* Intro Overlay */}
      <div
        className={`fixed inset-0 z-50 flex flex-col items-center justify-center transition-all duration-1000 ease-in-out cursor-pointer ${isOpened ? '-translate-y-full opacity-0 pointer-events-none' : 'translate-y-0 opacity-100 bg-black'}`}
        onClick={handleInit}
      >
        <div className="absolute inset-0">
          <img src={c.heroBg} alt="Background" className="w-full h-full object-cover opacity-20" />
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
        </div>

        <div className="relative z-10 text-center flex flex-col items-center">
          <div className={`w-32 h-32 mb-8 rounded-full border-2 border-dashed ${c.borderClass} flex items-center justify-center animate-[spin_10s_linear_infinite]`}>
            <div className="animate-[spin_5s_linear_infinite_reverse]">
              <Power className={c.accentText} size={48} />
            </div>
          </div>
          <h2 className={`text-3xl md:text-5xl font-black mb-4 tracking-[0.2em] uppercase ${c.accentText} animate-pulse`}>
            {content?.hero_subtitle || website?.business_type || 'Tech Fest'}
          </h2>
          <p className="text-gray-400 tracking-[0.4em] text-sm md:text-base mb-12 uppercase font-bold animate-pulse">
            System Ready
          </p>
          <button className={`px-8 py-4 rounded-full border border-white/20 bg-white/5 backdrop-blur-md font-bold tracking-[0.2em] hover:${c.accentBg} hover:text-black transition-all flex items-center gap-3 group`}>
            CLICK TO INITIALIZE
            <Zap size={18} className={`group-hover:text-black ${c.accentText}`} />
          </button>
        </div>
      </div>

      {(content?.settings_json?.section_order || ['hero', 'about', 'services', 'gallery', 'contact']).map((sectionName: string) => {
        const isHidden = content?.settings_json?.hidden_sections?.includes(sectionName);
        if (isHidden && sectionName !== 'hero' && !isEditor) return null;

        return (
          <React.Fragment key={sectionName}>
            {sectionName === 'hero' && (
              <section className={`relative min-h-[90vh] flex items-center justify-center overflow-hidden ${isHidden ? 'opacity-50' : ''}`}>
                <div className={`absolute inset-0 z-0`}>
                  <img src={c.heroBg} alt="Tech Fest" className={`w-full h-full object-cover ${c.heroOpacity} scale-105 animate-[pulse_10s_ease-in-out_infinite_alternate]`} />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
                  <div className={`absolute inset-0 bg-gradient-to-r from-black via-transparent to-black opacity-80`} />
                </div>

                <div className="container mx-auto px-6 relative z-10 text-center max-w-5xl">
                  <div className="reveal">
                    <span
                      className={`inline-block py-2 px-6 rounded-full border ${c.borderClass} ${c.accentText} uppercase tracking-[0.3em] text-xs font-black mb-8 backdrop-blur-sm bg-black/50`}
                      {...isEditable}
                      onBlur={(e) => handleTextChange('hero_subtitle', e.currentTarget.textContent || '')}
                    >
                      {content?.hero_subtitle || website?.business_type || 'Tech Fest'}
                    </span>
                  </div>

                  <h1
                    className="reveal text-5xl md:text-8xl font-black mb-6 tracking-tight leading-none"
                    style={{ textShadow: '0 10px 30px rgba(0,0,0,0.5)' }}
                    {...isEditable}
                    onBlur={(e) => handleTextChange('hero_title', e.currentTarget.textContent || '')}
                  >
                    {content?.hero_title || 'INNOVATION SUMMIT'}
                  </h1>

                  <p
                    className="reveal text-xl md:text-3xl text-gray-300 font-light mb-12 max-w-3xl mx-auto"
                    {...isEditable}
                    onBlur={(e) => handleTextChange('hero_description', e.currentTarget.textContent || '')}
                  >
                    {content?.hero_description || content?.hero_text || 'Join the biggest technology and innovation festival of the year. Experience the future today.'}
                  </p>

                  <div className="reveal flex flex-wrap justify-center gap-6 text-sm font-medium">
                    <div className={`flex items-center gap-2 bg-white/5 backdrop-blur-md px-6 py-3 rounded-xl border ${c.borderClass}`}>
                      <Calendar className={c.accentText} size={20} />
                      <span
                        {...isEditable}
                        onBlur={(e) => handleTextChange('date', e.currentTarget.textContent || '')}
                      >
                        {content?.date || 'Oct 15 - 17, 2026'}
                      </span>
                    </div>
                    <div className={`flex items-center gap-2 bg-white/5 backdrop-blur-md px-6 py-3 rounded-xl border ${c.borderClass}`}>
                      <MapPin className={c.accentText} size={20} />
                      <span
                        {...isEditable}
                        onBlur={(e) => {
                          if (isEditor && updateContent) {
                            updateContent({ ...content, contact_info: { ...(content.contact_info || {}), address: e.currentTarget.textContent || '' } });
                          }
                        }}
                      >
                        {content?.contact_info?.address || 'Main Campus Arena'}
                      </span>
                    </div>
                  </div>

                  <div className="reveal mt-12">
                    <button
                      onClick={() => document.getElementById('contact-section')?.scrollIntoView({ behavior: 'smooth' })}
                      className={`${c.accentBg} text-black font-black uppercase tracking-wider py-4 px-12 rounded-full hover:scale-105 transition-all shadow-[0_0_40px_rgba(34,211,238,0.3)] hover:shadow-[0_0_60px_rgba(34,211,238,0.5)] flex items-center gap-3 mx-auto`}
                    >
                      <Ticket size={24} />
                      Register Now
                    </button>
                  </div>
                </div>

                {/* Abstract decorative elements */}
                <div className={`absolute top-1/4 left-10 w-32 h-32 ${c.accentBg} rounded-full blur-[100px] opacity-20`} />
                <div className={`absolute bottom-1/4 right-10 w-64 h-64 ${c.accentBg} rounded-full blur-[150px] opacity-20`} />
              </section>
            )}

            {sectionName === 'about' && (content?.about_title || content?.about_text || content?.settings_json?.about_title || content?.settings_json?.about_description || isEditor) && (
              <section className={`py-24 px-6 bg-black relative ${isHidden ? 'opacity-50' : ''}`}>
                <div className="container mx-auto max-w-4xl relative z-10">
                  <div className="text-center mb-12 reveal">
                    <h2
                      className="text-3xl md:text-5xl font-black mb-6"
                      {...isEditable}
                      onBlur={(e) => {
                        if (isEditor && updateContent) {
                          updateContent({
                            ...content,
                            about_title: e.currentTarget.textContent || '',
                            settings_json: { ...(content.settings_json || {}), about_title: e.currentTarget.textContent || '' }
                          });
                        }
                      }}
                    >
                      {content?.settings_json?.about_title || content?.about_title || 'About The Fest'}
                    </h2>
                    <div className={`w-16 h-1 ${c.accentBg} mx-auto rounded-full`} />
                  </div>
                  <div className="text-center reveal">
                    <p
                      className="text-lg md:text-xl text-gray-400 leading-relaxed font-light"
                      {...isEditable}
                      onBlur={(e) => {
                        if (isEditor && updateContent) {
                          updateContent({
                            ...content,
                            about_text: e.currentTarget.textContent || '',
                            settings_json: { ...(content.settings_json || {}), about_description: e.currentTarget.textContent || '' }
                          });
                        }
                      }}
                    >
                      {content?.settings_json?.about_description || content?.about_text || 'Welcome to the ultimate gathering of tech enthusiasts and innovators. Join us to experience cutting-edge technologies, thrilling competitions, and insightful sessions.'}
                    </p>
                  </div>
                </div>
              </section>
            )}
            {sectionName === 'services' && (content?.services_json?.length > 0 || isEditor) && (
              <section className={`py-32 px-6 ${c.sectionBg} relative ${isHidden ? 'opacity-50' : ''}`}>
                <div className="container mx-auto max-w-6xl relative z-10">
                  <div className="text-center mb-20 reveal">
                    <h2 className="text-4xl md:text-5xl font-black mb-6">Featured <span className={c.accentText}>Events</span></h2>
                    <div className={`w-24 h-1 ${c.accentBg} mx-auto rounded-full`} />
                  </div>

                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {(content?.services_json?.length > 0 ? content.services_json : ['Hackathon', 'Robo Wars', 'Guest Lectures']).map((service: any, index: number) => {
                      const title = typeof service === 'string' ? service : (service.title || 'New Event');
                      const description = typeof service === 'string' ? 'Participate in our flagship event and win exciting prizes. Compete with the best minds.' : (service.description || 'Event details and schedule will be announced soon.');

                      ads
                      dsa
                      ds
                      ddadadsa
                      dsa
                      dsd
                      sd
                      sa
                      ds
                      dsa
                      dasd
                      ad
                      da
                      sdsad
                      sdsa
                      dsa
                      TextDecoderStreamdasd
                      sd
                      adsa
                      das
                      da
                      d
                      return (
                        <div key={index} className={`reveal group bg-black/40 backdrop-blur-sm p-8 rounded-2xl border border-white/5 hover:${c.borderClass} transition-all hover:-translate-y-2`}>
                          <div className={`w-14 h-14 rounded-xl bg-white/5 flex items-center justify-center mb-6 group-hover:${c.accentBg} group-hover:text-black transition-colors`}>
                            <Zap size={28} className={c.accentText + " group-hover:text-black transition-colors"} />
                          </div>
                          <h3 className="text-2xl font-bold mb-4">{title}</h3>
                          <p className="text-gray-400 leading-relaxed">
                            {description}
                          </p>
                          <button className={`mt-6 text-sm font-bold flex items-center gap-2 ${c.accentText} group-hover:gap-4 transition-all`}>
                            View Details <ExternalLink size={16} />
                          </button>
                        </div>
                      )
                    })}
                  </div>
                </div>
              </section>
            )}

            {sectionName === 'gallery' && (content?.gallery_json?.length > 0 || isEditor) && (
              <section className={`py-32 px-6 bg-black relative ${isHidden ? 'opacity-50' : ''}`}>
                <div className="container mx-auto max-w-7xl">
                  <div className="flex justify-between items-end mb-16 reveal">
                    <div>
                      <h2 className="text-4xl md:text-5xl font-black mb-6">Past <span className={c.accentText}>Glimpses</span></h2>
                      <p className="text-gray-400 max-w-md">Experience the energy and excitement from our previous editions.</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {(content?.gallery_json?.length > 0 ? content.gallery_json : [
                      'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=800&q=80',
                      'https://images.unsplash.com/photo-1505373877841-8d25f7d46678?auto=format&fit=crop&w=800&q=80',
                      'https://images.unsplash.com/photo-1475721025505-23126fbb6b4f?auto=format&fit=crop&w=800&q=80',
                      'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=800&q=80'
                    ]).map((img: string, index: number) => (
                      <div key={index} className={`reveal ${index === 0 || index === 3 ? 'md:col-span-2 md:row-span-2' : ''} aspect-square md:aspect-auto rounded-2xl overflow-hidden group`}>
                        <img
                          src={img}
                          alt={`Gallery ${index}`}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 opacity-80 group-hover:opacity-100"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </section>
            )}

            {sectionName === 'contact' && (
              <div id="contact-section">
                {(content?.settings_json?.sponsors || isEditor) && (
                  <section className={`py-24 px-6 bg-black relative ${isHidden ? 'opacity-50' : ''}`}>
                    <div className="container mx-auto max-w-5xl text-center relative z-10">
                      <h2 className="text-3xl md:text-4xl font-black mb-12">Our <span className={c.accentText}>Sponsors</span></h2>
                      <div className="flex flex-wrap justify-center gap-4 md:gap-6">
                        {(content?.settings_json?.sponsors ? content.settings_json.sponsors.split(',') : ['Google', 'Microsoft', 'Amazon', 'Meta']).map((sponsor: string, idx: number) => (
                          <div key={idx} className={`px-6 py-3 md:px-8 md:py-4 rounded-full border border-white/10 bg-white/5 backdrop-blur-sm hover:${c.borderClass} transition-colors font-bold tracking-widest uppercase text-xs md:text-sm text-gray-300 hover:text-white`}>
                            {sponsor.trim()}
                          </div>
                        ))}
                      </div>
                    </div>
                  </section>
                )}

                <section className={`py-32 px-6 ${c.sectionBg} relative overflow-hidden ${isHidden ? 'opacity-50' : ''}`}>
                  <div className={`absolute top-0 right-0 w-full h-px bg-gradient-to-r from-transparent via-${c.accentText} to-transparent opacity-20`} />

                  <div className="container mx-auto max-w-5xl text-center relative z-10">
                    <h2 className="reveal text-4xl md:text-5xl font-black mb-16">Get in <span className={c.accentText}>Touch</span></h2>

                    <div className="grid md:grid-cols-2 gap-8 mb-12 max-w-3xl mx-auto">
                      <div className={`reveal bg-black/50 p-8 rounded-3xl border border-white/5 hover:${c.borderClass} transition-colors`}>
                        <div className={`w-16 h-16 rounded-2xl ${c.accentBg} text-black flex items-center justify-center mx-auto mb-6`}>
                          <Phone size={32} />
                        </div>
                        <h3 className="font-bold text-xl mb-2">Call Us</h3>
                        <p className="text-gray-400">{content?.contact_info?.phone || '+1 234 567 8900'}</p>
                      </div>

                      <div className={`reveal bg-black/50 p-8 rounded-3xl border border-white/5 hover:${c.borderClass} transition-colors delay-100`}>
                        <div className={`w-16 h-16 rounded-2xl ${c.accentBg} text-black flex items-center justify-center mx-auto mb-6`}>
                          <Mail size={32} />
                        </div>
                        <h3 className="font-bold text-xl mb-2">Email Us</h3>
                        <p className="text-gray-400">{content?.contact_info?.email || 'hello@techfest.com'}</p>
                      </div>
                    </div>

                    {(content?.contact_info?.whatsapp || content?.contact_info?.instagram || isEditor) && (
                      <div className="flex justify-center gap-4 md:gap-6">
                        {(content?.contact_info?.whatsapp || isEditor) && (
                          <a
                            href={content?.contact_info?.whatsapp || '#'}
                            target="_blank"
                            rel="noreferrer"
                            className={`flex items-center gap-2 px-6 py-3 rounded-full border border-white/10 hover:${c.borderClass} ${c.accentHover} hover:text-black transition-all bg-white/5 whitespace-nowrap`}
                          >
                            <WhatsAppIcon size={18} />
                            <span className="font-bold uppercase tracking-widest text-xs hidden sm:inline">WhatsApp</span>
                          </a>
                        )}
                        {(content?.contact_info?.instagram || isEditor) && (
                          <a
                            href={content?.contact_info?.instagram || '#'}
                            target="_blank"
                            rel="noreferrer"
                            className={`flex items-center gap-2 px-6 py-3 rounded-full border border-white/10 hover:${c.borderClass} ${c.accentHover} hover:text-black transition-all bg-white/5 whitespace-nowrap`}
                          >
                            <InstagramIcon size={18} />
                            <span className="font-bold uppercase tracking-widest text-xs hidden sm:inline">Instagram</span>
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

      <footer className="py-8 text-center text-gray-600 border-t border-white/10 bg-black text-sm">
        <p>&copy; {new Date().getFullYear()} {website?.slug || 'Tech Fest'}. All rights reserved.</p>
      </footer>

      {/* Floating Like Button */}
      {isOpened && (() => {
        const ClickIcon = content?.settings_json?.click_icon === 'star' ? Star :
          content?.settings_json?.click_icon === 'sparkles' ? Sparkles :
            content?.settings_json?.click_icon === 'zap' ? Zap :
              content?.settings_json?.click_icon === 'flame' ? Flame : Heart;
        return (
          <button
            onClick={handleLike}
            className={`fixed right-6 bottom-6 z-[200] backdrop-blur-md px-5 py-3 rounded-full border border-white/20 transition-all flex items-center justify-center shadow-2xl gap-3 ${hasLiked ? 'bg-pink-600/90 text-white border-pink-400' : 'bg-black/60 text-white hover:bg-black/80'} ${clickAnim ? 'scale-90' : 'scale-100 hover:scale-105'}`}
          >
            <ClickIcon size={24} className={`${hasLiked ? 'fill-current' : ''} ${clickAnim ? 'animate-ping' : ''}`} />
            <span className="font-black text-lg tracking-wide">{likeCount.toLocaleString()}</span>
          </button>
        );
      })()}

      {/* Background Music */}
      <audio ref={audioRef} src={content?.settings_json?.music_url || "https://cdn.pixabay.com/audio/2022/01/18/audio_d0a13f69d2.mp3"} loop />

      {/* Floating Music Toggle Button */}
      {isOpened && (
        <button
          onClick={toggleMusic}
          className="music-toggle-btn fixed left-0 top-1/2 -translate-y-1/2 z-[200] bg-white/10 backdrop-blur-md p-3 rounded-r-full border border-white/20 border-l-0 text-white hover:bg-white/20 transition-all flex items-center justify-center shadow-lg"
          title={isPlaying ? "Pause Music" : "Play Music"}
        >
          {isPlaying ? <Pause size={20} /> : <Play size={20} className="ml-1" />}
        </button>
      )}
    </div>
  );
}
