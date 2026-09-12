import React from 'react';
import { Calendar, MapPin, Ticket, Users, Zap, Mail, Phone, ExternalLink } from 'lucide-react';
import useScrollReveal from '../../../../hooks/useScrollReveal';

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
  useScrollReveal();

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
    <div className={`min-h-screen ${c.bgClass} text-white font-sans selection:${c.accentBg} selection:text-black`}>
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
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
            <button className={`${c.accentBg} text-black font-black uppercase tracking-wider py-4 px-12 rounded-full hover:scale-105 transition-all shadow-[0_0_40px_rgba(34,211,238,0.3)] hover:shadow-[0_0_60px_rgba(34,211,238,0.5)] flex items-center gap-3 mx-auto`}>
              <Ticket size={24} />
              Register Now
            </button>
          </div>
        </div>
        
        {/* Abstract decorative elements */}
        <div className={`absolute top-1/4 left-10 w-32 h-32 ${c.accentBg} rounded-full blur-[100px] opacity-20`} />
        <div className={`absolute bottom-1/4 right-10 w-64 h-64 ${c.accentBg} rounded-full blur-[150px] opacity-20`} />
      </section>

      {/* Events / Services */}
      {(content?.services_json?.length > 0 || isEditor) && (
        <section className={`py-32 px-6 ${c.sectionBg} relative`}>
          <div className="container mx-auto max-w-6xl relative z-10">
            <div className="text-center mb-20 reveal">
              <h2 className="text-4xl md:text-5xl font-black mb-6">Featured <span className={c.accentText}>Events</span></h2>
              <div className={`w-24 h-1 ${c.accentBg} mx-auto rounded-full`} />
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {(content?.services_json?.length > 0 ? content.services_json : ['Hackathon', 'Robo Wars', 'Guest Lectures']).map((service: string, index: number) => (
                <div key={index} className={`reveal group bg-black/40 backdrop-blur-sm p-8 rounded-2xl border border-white/5 hover:${c.borderClass} transition-all hover:-translate-y-2`}>
                  <div className={`w-14 h-14 rounded-xl bg-white/5 flex items-center justify-center mb-6 group-hover:${c.accentBg} group-hover:text-black transition-colors`}>
                    <Zap size={28} className={c.accentText + " group-hover:text-black transition-colors"} />
                  </div>
                  <h3 className="text-2xl font-bold mb-4">{service}</h3>
                  <p className="text-gray-400 leading-relaxed">
                    Participate in our flagship event and win exciting prizes. Compete with the best minds.
                  </p>
                  <button className={`mt-6 text-sm font-bold flex items-center gap-2 ${c.accentText} group-hover:gap-4 transition-all`}>
                    View Details <ExternalLink size={16} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Gallery */}
      {content?.gallery_json?.length > 0 && (
        <section className="py-32 px-6 bg-black relative">
          <div className="container mx-auto max-w-7xl">
            <div className="flex justify-between items-end mb-16 reveal">
              <div>
                <h2 className="text-4xl md:text-5xl font-black mb-6">Past <span className={c.accentText}>Glimpses</span></h2>
                <p className="text-gray-400 max-w-md">Experience the energy and excitement from our previous editions.</p>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {content.gallery_json.map((img: string, index: number) => (
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

      {/* Contact */}
      <section className={`py-32 px-6 ${c.sectionBg} relative overflow-hidden`}>
        <div className={`absolute top-0 right-0 w-full h-px bg-gradient-to-r from-transparent via-${c.accentText} to-transparent opacity-20`} />
        
        <div className="container mx-auto max-w-5xl text-center relative z-10">
          <h2 className="reveal text-4xl md:text-5xl font-black mb-16">Get in <span className={c.accentText}>Touch</span></h2>
          
          <div className="grid md:grid-cols-3 gap-8">
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

            <div className={`reveal bg-black/50 p-8 rounded-3xl border border-white/5 hover:${c.borderClass} transition-colors delay-200`}>
              <div className={`w-16 h-16 rounded-2xl ${c.accentBg} text-black flex items-center justify-center mx-auto mb-6`}>
                <Users size={32} />
              </div>
              <h3 className="font-bold text-xl mb-2">Sponsorships</h3>
              <p className="text-gray-400">sponsor@techfest.com</p>
            </div>
          </div>
        </div>
      </section>

      <footer className="py-8 text-center text-gray-600 border-t border-white/10 bg-black text-sm">
        <p>&copy; {new Date().getFullYear()} {website?.slug || 'Tech Fest'}. All rights reserved.</p>
      </footer>
    </div>
  );
}
