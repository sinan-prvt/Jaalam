import React, { useState, useEffect } from 'react';
import { Calendar, MapPin, Heart, Clock, Gift, Music, Navigation, Users } from 'lucide-react';
import type { WeddingLayoutProps } from './types';

const Toran = () => (
  <>
    {/* Inner Page Toran - Desktop */}
    <div className="absolute top-0 left-0 w-full flex justify-between pointer-events-none z-10 hidden md:flex">
      <img src="/media/toran_royal.png" alt="Toran Left" className="w-[45%] lg:w-[35%] h-auto object-contain object-left-top mix-blend-multiply contrast-125" />
      <img src="/media/toran_royal.png" alt="Toran Right" className="w-[45%] lg:w-[35%] h-auto object-contain object-right-top transform scale-x-[-1] mix-blend-multiply contrast-125" />
    </div>
    {/* Inner Page Toran - Mobile */}
    <div className="absolute top-0 left-0 w-full flex justify-center pointer-events-none z-10 md:hidden">
      <img src="/media/toran_royal.png" alt="Toran" className="w-full h-auto object-contain object-top mix-blend-multiply contrast-125" />
    </div>
  </>
);

export default function SouthIndianRoyalLayout({ content, website }: WeddingLayoutProps) {
  const caricatureUrl = "/media/south_indian_couple.png";
  const displayImage = content?.hero?.image || caricatureUrl;

  const coupleNames = content?.hero_title || "Rahul & Harinya";
  const story = content?.about_text || "“Two hearts united, one beautiful journey begins. Wishing you a lifetime of togetherness.”";
  const date = content?.settings_json?.wedding?.date || "27 November 2025";
  const location = content?.contact_info?.address || "Financial District, Hyderabad, Telangana, India";

  const schedule = content?.settings_json?.wedding?.schedule || [
    { time: "10:30 AM", event: "Muhurtham", date: "Saturday, 12 January", venue: "Venue Name, City", mapLink: "https://maps.google.com" },
    { time: "12:30 PM", event: "Haldi", date: "Tuesday, 3 March", venue: "Hyderabad, Telangana", mapLink: "https://maps.google.com" },
    { time: "9:00 PM Onwards", event: "Mehendi", date: "Wednesday, 4 March", venue: "Kukatpally, Hyderabad", mapLink: "https://maps.google.com" }
  ];

  const groomParents = content?.settings_json?.wedding?.groomParents || "Shankar & Laxmi";
  const brideParents = content?.settings_json?.wedding?.brideParents || "Ramesh & Lakshmi";
  const mapUrl = content?.settings_json?.wedding?.mapUrl || "";
  const contactNumbers = content?.settings_json?.wedding?.contactNumbers || "";
  const gallery = content?.settings_json?.wedding?.gallery || [];
  const countdownDate = content?.settings_json?.wedding?.countdownDate || "";
  const musicUrl = content?.settings_json?.wedding?.musicUrl || "";

  const [timeLeft, setTimeLeft] = useState<{ d: number, h: number, m: number, s: number } | null>(null);

  const [isOpened, setIsOpened] = useState(false);

  useEffect(() => {
    if (!countdownDate) return;
    const target = new Date(countdownDate).getTime();
    const interval = setInterval(() => {
      const now = new Date().getTime();
      const distance = target - now;
      if (distance < 0) {
        setTimeLeft(null);
        clearInterval(interval);
        return;
      }
      setTimeLeft({
        d: Math.floor(distance / (1000 * 60 * 60 * 24)),
        h: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        m: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
        s: Math.floor((distance % (1000 * 60)) / 1000)
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [countdownDate]);

  const names = coupleNames.split(/\s*&\s*|\s+and\s+/i);
  const person1Name = names[0] || "Rahul";
  const person2Name = names[1] || "Harinya";

  const defaultSections = [
    { id: 'hero', label: 'Cover / Hero', visible: true, locked: true },
    { id: 'about', label: 'About the Couple', visible: true },
    { id: 'schedule', label: 'Wedding Events', visible: true },
    { id: 'countdown', label: 'Counting Down To', visible: true },
    { id: 'gallery', label: 'Captured Moments', visible: true },
    { id: 'story', label: 'Our Story', visible: true },
    { id: 'venue', label: 'When & Where', visible: true },
    { id: 'rsvp', label: 'Will You Join Us?', visible: true }
  ];
  const sections = content?.settings_json?.wedding?.sections || defaultSections;

  const sectionMap: Record<string, React.ReactNode> = {
    hero: (
      <section key="hero" className="relative min-h-screen pt-20 pb-16 flex flex-col items-center text-center px-4 md:px-8">
        <div className="mb-4 flex justify-center">
          <img src="/media/ganesha_icon.png" alt="Ganesha" className="w-20 h-20 md:w-24 md:h-24 object-contain" />
        </div>

        <h3 className="text-2xl md:text-3xl font-script text-rose-800 mb-6">
          || Sri Ganeshaya Namah ||
        </h3>

        <p className="text-base md:text-lg text-slate-700 italic mb-6 font-serif">
          You are invited to the wedding of
        </p>

        <h1 className="text-6xl md:text-7xl lg:text-8xl font-bold text-rose-800 mb-6 drop-shadow-sm font-script">
          {coupleNames}
        </h1>

        <div className="relative mb-10 mt-4 max-w-[280px] md:max-w-[320px] w-full mx-auto">
          <div className="aspect-[4/5] overflow-hidden rounded-[100px] border-[8px] border-amber-200 shadow-2xl relative bg-transparent p-2">
            <div className="w-full h-full rounded-[90px] overflow-hidden">
              <img
                src={displayImage}
                alt="Couple"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>

        <p className="text-md md:text-lg text-slate-600 italic mb-8 max-w-xl mx-auto leading-relaxed">
          {story}
        </p>

        <p className="text-md text-amber-700 font-semibold tracking-wide uppercase mb-6">
          Together with the blessings of their families
        </p>

        <div className="flex flex-col items-center mb-8">
          <h2 className="text-6xl font-bold text-rose-800 font-script">{person1Name}</h2>
          <span className="text-3xl text-amber-500 my-2 font-script">&amp;</span>
          <h2 className="text-6xl font-bold text-rose-800 font-script">{person2Name}</h2>
        </div>

        <p className="text-md md:text-lg text-slate-700 italic mb-6">
          cordially invite you to celebrate their wedding
        </p>

        <div className="bg-white/80 backdrop-blur-md rounded-2xl py-6 px-10 shadow-lg border border-amber-200/50">
          <p className="text-2xl font-bold text-rose-800 mb-2 font-serif">{date}</p>
          <p className="text-sm font-medium text-slate-600 uppercase tracking-wider">{location}</p>
        </div>
      </section>
    ),
    about: (
      <section key="about" className="py-16 px-6 relative z-10 bg-gradient-to-b from-transparent to-amber-50/50">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-rose-800 mb-10 font-script">About the Couple</h2>

          <div className="grid md:grid-cols-2 gap-10">
            <div className="bg-white/60 p-8 rounded-3xl shadow-sm border border-amber-100">
              <h3 className="text-4xl font-bold text-rose-700 mb-3 font-script">{person1Name}</h3>
              <p className="text-sm text-slate-500 uppercase tracking-widest mb-1">Son of</p>
              <p className="text-lg font-medium text-slate-800">{groomParents}</p>
            </div>

            <div className="bg-white/60 p-8 rounded-3xl shadow-sm border border-amber-100">
              <h3 className="text-4xl font-bold text-rose-700 mb-3 font-script">{person2Name}</h3>
              <p className="text-sm text-slate-500 uppercase tracking-widest mb-1">Daughter of</p>
              <p className="text-lg font-medium text-slate-800">{brideParents}</p>
            </div>
          </div>
        </div>
      </section>
    ),
    schedule: (
      <section key="schedule" className="py-20 px-6 relative z-10">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-rose-800 mb-4" style={{ fontFamily: "'Playfair Display', serif" }}>Wedding Events</h2>
            <div className="w-20 h-1 bg-amber-400 mx-auto rounded-full"></div>
          </div>

          <div className="space-y-8">
            {schedule.map((item: any, index: number) => (
              <div key={index} className="bg-white/80 backdrop-blur-md rounded-3xl p-8 shadow-xl border-l-4 border-amber-500 relative flex flex-col md:flex-row items-center md:items-start justify-between text-center md:text-left hover:-translate-y-1 transition-transform">
                <div className="flex-1 mb-6 md:mb-0">
                  <h3 className="text-2xl font-bold text-rose-800 mb-2 font-serif">{item.event}</h3>
                  <p className="text-lg font-semibold text-slate-700 mb-1">{item.date}</p>
                  <p className="text-md text-amber-600 font-medium mb-3">{item.time}</p>
                  <p className="text-sm text-slate-500 flex items-center justify-center md:justify-start gap-2">
                    <MapPin size={16} className="text-rose-600" />
                    {item.venue || "Venue Details"}
                  </p>
                </div>
                <div>
                  <a
                    href={item.mapLink || mapUrl || "https://maps.google.com"}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 bg-amber-100 hover:bg-amber-200 text-amber-900 font-bold tracking-wide uppercase text-xs px-6 py-3 rounded-full transition-colors"
                  >
                    <Navigation size={14} />
                    Get Directions
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    ),
    countdown: timeLeft ? (
      <section key="countdown" className="py-20 px-6 relative z-10 bg-rose-800 text-white rounded-[3rem] mx-4 md:mx-12 shadow-2xl overflow-hidden my-10">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-amber-200 to-transparent"></div>
        <div className="max-w-3xl mx-auto text-center relative z-10">
          <h2 className="text-3xl md:text-4xl font-bold mb-2 font-serif text-amber-300">Counting Down To</h2>
          <p className="text-xl italic mb-12 text-rose-200">Our Special Day</p>

          <div className="flex gap-4 md:gap-8 justify-center">
            {[
              { label: 'Days', value: timeLeft.d },
              { label: 'Hours', value: timeLeft.h },
              { label: 'Mins', value: timeLeft.m },
              { label: 'Secs', value: timeLeft.s }
            ].map((item, idx) => (
              <div key={idx} className="flex flex-col items-center">
                <div className={`w-16 h-16 md:w-24 md:h-24 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center mb-3 shadow-inner border border-white/20`}>
                  <span className="text-2xl md:text-4xl font-bold text-white font-serif">{item.value}</span>
                </div>
                <span className="text-[10px] md:text-xs tracking-widest uppercase font-bold text-amber-200">{item.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>
    ) : null,
    gallery: gallery.length > 0 ? (
      <section key="gallery" className="py-20 px-6 relative z-10">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-rose-800 mb-12" style={{ fontFamily: "'Playfair Display', serif" }}>Captured Moments</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
            {gallery.map((url: string, index: number) => (
              <div key={index} className="aspect-[4/5] rounded-3xl overflow-hidden shadow-lg group relative">
                <div className="absolute inset-0 bg-rose-900/20 opacity-0 group-hover:opacity-100 transition-opacity z-10"></div>
                <img src={url} alt={`Moment ${index + 1}`} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
              </div>
            ))}
          </div>
        </div>
      </section>
    ) : null,
    venue: mapUrl ? (
      <section key="venue" className="py-20 px-6 relative z-10">
        <div className="max-w-4xl mx-auto text-center bg-white/70 backdrop-blur-md rounded-[3rem] p-8 md:p-12 shadow-xl border border-amber-100">
          <h2 className="text-3xl md:text-4xl font-bold text-rose-800 mb-4" style={{ fontFamily: "'Playfair Display', serif" }}>When & Where</h2>
          <div className="w-16 h-1 bg-amber-400 mx-auto mb-8 rounded-full"></div>

          <div className="mb-10">
            <h3 className="text-xl font-bold text-slate-800 mb-2">{location}</h3>
          </div>

          <div className="w-full aspect-video md:aspect-[21/9] rounded-2xl overflow-hidden shadow-inner border border-slate-200">
            <iframe
              src={mapUrl && !mapUrl.includes('embed') ? `https://maps.google.com/maps?q=${encodeURIComponent(location)}&t=&z=13&ie=UTF8&iwloc=&output=embed` : mapUrl}
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen={true}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="pointer-events-none md:pointer-events-auto"
            ></iframe>
          </div>

          <div className="mt-8">
            <a
              href={mapUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 bg-rose-800 hover:bg-rose-900 text-white font-bold tracking-wide uppercase text-sm px-8 py-4 rounded-full transition-colors shadow-lg shadow-rose-900/30"
            >
              <Navigation size={18} />
              Get Full Directions
            </a>
          </div>

          {contactNumbers && (
            <div className="mt-10 border-t border-slate-200/50 pt-8">
              <p className="text-[10px] tracking-widest uppercase font-bold text-slate-400 mb-2">RSVP / Contact</p>
              <p className="text-lg font-medium text-slate-800">{contactNumbers}</p>
            </div>
          )}
        </div>
      </section>
    ) : null,
    rsvp: (
      <section key="rsvp" className="py-20 px-6 relative z-10">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-rose-800 mb-4" style={{ fontFamily: "'Playfair Display', serif" }}>Will You Join Us?</h2>
          <p className="text-slate-500 mb-10 tracking-widest uppercase text-sm">Please let us know if you can make it</p>

          <div className="bg-white rounded-[2rem] p-8 md:p-10 shadow-2xl border border-amber-100 text-left">
            <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-bold tracking-widest uppercase text-slate-500 mb-2">First Name</label>
                  <input type="text" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 outline-none focus:border-rose-500 focus:ring-1 focus:ring-rose-500 transition-all font-serif" placeholder="Your Name" />
                </div>
                <div>
                  <label className="block text-xs font-bold tracking-widest uppercase text-slate-500 mb-2">Last Name</label>
                  <input type="text" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 outline-none focus:border-rose-500 focus:ring-1 focus:ring-rose-500 transition-all font-serif" placeholder="Your Last Name" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold tracking-widest uppercase text-slate-500 mb-3">Will you be attending?</label>
                <div className="flex flex-col sm:flex-row gap-4">
                  <label className="flex items-center gap-3 cursor-pointer p-4 border-2 border-slate-100 hover:border-rose-200 bg-slate-50 rounded-xl flex-1 transition-colors">
                    <input type="radio" name="attending" className="w-4 h-4 accent-rose-800" />
                    <span className="text-slate-800 font-bold uppercase tracking-widest text-xs">Joyfully Accepts</span>
                  </label>
                  <label className="flex items-center gap-3 cursor-pointer p-4 border-2 border-slate-100 hover:border-rose-200 bg-slate-50 rounded-xl flex-1 transition-colors">
                    <input type="radio" name="attending" className="w-4 h-4 accent-rose-800" />
                    <span className="text-slate-800 font-bold uppercase tracking-widest text-xs">Declines</span>
                  </label>
                </div>
              </div>

              <div className="pt-6 text-center">
                <button type="button" className="w-full sm:w-auto bg-amber-600 hover:bg-amber-700 text-white font-bold tracking-widest uppercase text-sm px-12 py-4 rounded-full shadow-lg transition-colors">
                  Submit RSVP
                </button>
              </div>
            </form>
          </div>
        </div>
      </section>
    )
  };

  return (
    <div className={`min-h-screen font-sans bg-[#FDFBF7] relative text-slate-800 ${!isOpened ? 'max-h-screen overflow-hidden' : ''}`}>

      <style>
        {`
          @import url('https://fonts.googleapis.com/css2?family=Great+Vibes&display=swap');
          .font-script {
            font-family: 'Great Vibes', cursive;
          }
          .mandala-bg {
            background-image: radial-gradient(circle at 100% 0%, rgba(212, 175, 55, 0.1) 0%, transparent 40%),
                              radial-gradient(circle at 0% 100%, rgba(212, 175, 55, 0.1) 0%, transparent 40%);
          }
        `}
      </style>

      {/* Welcome Screen / Envelope Overlay */}
      <div className={`fixed inset-0 z-[100] flex flex-col items-center justify-center bg-[#FDFBF7] mandala-bg transition-transform duration-1000 ease-[cubic-bezier(0.7,0,0.3,1)] ${isOpened ? '-translate-y-full' : 'translate-y-0'}`}>

        {/* DESKTOP BACKGROUND: Custom generated wide landscape image */}
        <div className="absolute inset-0 z-0 hidden md:block overflow-hidden pointer-events-none opacity-80">
          <img src="/media/laptop_royal_bg.png" alt="Desktop Royal Background" className="w-full h-full object-cover object-center" />
        </div>

        {/* MOBILE GRAPHICS: Fixed aspect ratio images */}
        <div className="absolute top-0 left-0 w-full flex justify-center pointer-events-none z-10 md:hidden">
          <img src="/media/toran_royal.png" alt="Toran" className="w-full h-auto object-contain object-top mix-blend-multiply contrast-125" />
        </div>

        <div className="absolute bottom-0 left-0 w-full flex justify-center pointer-events-none z-0 md:hidden">
          <img src="/media/temple_royal.png" alt="Temple" className="w-full h-auto max-h-[60vh] object-contain object-bottom opacity-90" />
        </div>

        {/* Center Content */}
        <div className="relative z-10 text-center px-6 py-10 flex flex-col items-center justify-center w-full max-w-2xl mx-auto h-auto mt-12 md:mt-0 md:-translate-y-[12vh]">
          <div className="mb-2">
            <img src="/media/ganesha_icon.png" alt="Ganesha" className="w-16 h-16 md:w-20 md:h-20 object-contain mx-auto" />
          </div>

          <h3 className="text-2xl md:text-3xl font-script text-amber-600 mb-3">
            || Sri Ganeshaya Namah ||
          </h3>

          <div className="flex items-center justify-center gap-2 mb-6 opacity-40">
            <div className="w-12 h-[1px] bg-amber-700"></div>
            <div className="w-1.5 h-1.5 rounded-full border border-amber-700"></div>
            <div className="w-12 h-[1px] bg-amber-700"></div>
          </div>

          <p className="mb-2 tracking-widest uppercase text-[9px] md:text-xs font-bold text-slate-500">
            You are invited to the wedding of
          </p>

          <h1 className="text-5xl md:text-7xl font-bold mb-6 text-[#7f1d1d] font-script drop-shadow-sm px-4">
            {coupleNames}
          </h1>

          <button
            onClick={() => setIsOpened(true)}
            className="group relative overflow-hidden bg-[#7f1d1d] hover:bg-rose-900 text-white font-bold tracking-widest uppercase text-xs md:text-sm px-10 py-3 md:px-12 md:py-4 rounded-full shadow-lg transition-all hover:scale-105 active:scale-95 z-20 mt-4 border border-rose-950/50 flex-shrink-0"
          >
            <span className="relative z-10 flex items-center gap-2">
              Open Invitation
            </span>
            <div className="absolute inset-0 h-full w-0 bg-white/20 transition-[width] group-hover:w-full ease-out duration-300"></div>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <Toran />

      <div className="relative z-10 pb-16 pt-8 max-w-7xl mx-auto mandala-bg min-h-screen">
        {sections.filter((s: any) => s.visible).map((s: any) => sectionMap[s.id])}
      </div>

      {/* Footer */}
      <footer className="py-12 relative z-10 text-center bg-slate-900 text-white rounded-t-[3rem] mx-4 md:mx-12">
        <h2 className="text-2xl font-script mb-2">{coupleNames}</h2>
        <p className="text-slate-400 text-xs tracking-widest uppercase mb-6">Made with love by Jaalam</p>
      </footer>

      {/* Background Music */}
      {musicUrl && isOpened && (
        <audio autoPlay loop className="hidden">
          <source src={musicUrl} type="audio/mpeg" />
        </audio>
      )}
    </div>
  );
}
