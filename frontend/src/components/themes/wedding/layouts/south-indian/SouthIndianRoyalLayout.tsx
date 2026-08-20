import React, { useState, useEffect, useRef } from 'react';
import { Calendar, MapPin, Heart, Clock, Gift, Music, Navigation, Users, Volume2, VolumeX } from 'lucide-react';
import type { WeddingLayoutProps } from '../types';

const Toran = () => (
  <>
    {/* Inner Page Toran - Desktop */}
    <div className="absolute top-0 left-0 w-full hidden md:block pointer-events-none z-10 mix-blend-darken -mt-2 lg:-mt-2">
      <div
        className="w-full h-[15vh] lg:h-[42vh]"
        style={{
          backgroundImage: "url('/media/toran_royal.png')",
          backgroundRepeat: "repeat-x",
          backgroundSize: "contain",
          backgroundPosition: "top left"
        }}
      />
    </div>

    {/* Inner Page Toran - Mobile */}
    <div className="absolute top-0 left-0 w-full flex justify-center pointer-events-none z-10 md:hidden mix-blend-darken -mt-12">
      <img src="/media/toran_royal.png" alt="Toran" className="w-full h-auto object-contain object-top" />
    </div>
  </>
);

export default function SouthIndianRoyalLayout({ content, website }: WeddingLayoutProps) {
  const caricatureUrl = "/media/south_indian_couple.png";
  const displayImage = content?.hero?.image || caricatureUrl;

  const coupleNames = content?.hero_title || "Rahul & Harinya";
  const story = content?.about_text || "We met at a coffee shop and found a love that lasts forever. Join us as we celebrate our journey together.";
  const storyTitle = content?.about_title || content?.settings_json?.wedding?.story_title || "Our Story";
  const quote = content?.settings_json?.wedding?.quote || content?.quote || "Two hearts united in love, starting a beautiful journey together.";
  const date = content?.settings_json?.wedding?.date || content?.date || "27 November 2025";
  const location = content?.contact_info?.address || content?.venue?.address || content?.venue?.name || content?.settings_json?.wedding?.venue || "Grand Venue, City";

  const rawSchedule = content?.settings_json?.wedding?.schedule;
  const schedule = (Array.isArray(rawSchedule) && rawSchedule.length > 0)
    ? rawSchedule
    : [
        { time: "9:00 AM Onwards", event: "Muhurtham", date: date, venue: location },
        { time: "7:00 PM Onwards", event: "Reception", date: date, venue: location }
      ];

  const groomParents = content?.settings_json?.wedding?.groomParents || "Father & Mother";
  const brideParents = content?.settings_json?.wedding?.brideParents || "Father & Mother";
  const groomPhoto = content?.settings_json?.wedding?.groomPhoto;
  const bridePhoto = content?.settings_json?.wedding?.bridePhoto;
  const mapUrl = content?.settings_json?.wedding?.mapUrl || content?.venue?.mapUrl || "";
  const contactNumbers = content?.settings_json?.wedding?.contactNumbers || "";

  const gallery = content?.settings_json?.wedding?.gallery || [];
  const validGallery = Array.isArray(gallery) ? gallery.filter((url: string) => url && url.trim() !== "") : [];

  const countdownDate = content?.settings_json?.wedding?.countdownDate || "2026-03-15T09:00";
  const musicUrl = content?.settings_json?.wedding?.musicUrl || "";

  const [timeLeft, setTimeLeft] = useState<{ d: number, h: number, m: number, s: number } | null>(null);

  const [isOpened, setIsOpened] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

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
    { id: 'about', label: 'Family Details', visible: true },
    { id: 'story', label: 'Our Story', visible: true },
    { id: 'schedule', label: 'Schedule & Events', visible: true },
    { id: 'venue', label: 'Venue & Map', visible: true },
    { id: 'gallery', label: 'Gallery', visible: true },
    { id: 'countdown', label: 'Countdown', visible: true },
    { id: 'rsvp', label: 'RSVP', visible: true }
  ];
  const sections = content?.settings_json?.wedding?.sections || defaultSections;

  const sectionMap: Record<string, React.ReactNode> = {
    hero: (
      <section key="hero" className="relative min-h-screen pt-20 pb-16 flex flex-col items-center text-center px-4 md:px-8">
        <div className="mb-4 flex justify-center">
          <img src="/media/ganesha_icon.png" alt="Ganesha" className="w-20 h-20 md:w-24 md:h-24 object-contain" />
        </div>

        <h3 className="text-2xl md:text-3xl font-script text-rose-800 mb-4">
          || Sri Ganeshaya Namah ||
        </h3>

        <p className="text-base md:text-lg text-slate-700 italic mb-4 font-serif">
          You are invited to the wedding of
        </p>

        <h1 className="text-6xl md:text-7xl lg:text-8xl font-bold text-rose-800 mb-6 drop-shadow-sm font-script">
          {coupleNames}
        </h1>

        <div className="relative mb-8 mt-2 max-w-[280px] md:max-w-[320px] w-full mx-auto">
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

        {quote && (
          <p className="text-md md:text-lg text-slate-600 italic mb-8 max-w-xl mx-auto leading-relaxed font-serif">
            "{quote}"
          </p>
        )}

        <div className="bg-white/80 backdrop-blur-md rounded-2xl py-6 px-10 shadow-lg border border-amber-200/50">
          <p className="text-2xl font-bold text-rose-800 mb-2 font-serif">{date}</p>
          <p className="text-sm font-medium text-slate-600 uppercase tracking-wider">{location}</p>
        </div>
      </section>
    ),
    about: (
      <section key="about" className="py-20 px-6 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-rose-800 mb-10 font-script">Family Details</h2>

          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="bg-white/60 p-8 rounded-3xl shadow-sm border border-amber-100 flex flex-col items-center">
              {groomPhoto && (
                <div className="w-32 h-32 md:w-40 md:h-40 rounded-full overflow-hidden border-4 border-amber-200 shadow-lg mb-6 mx-auto">
                  <img src={groomPhoto} alt={person1Name} className="w-full h-full object-cover" />
                </div>
              )}
              <h3 className="text-4xl font-bold text-rose-700 mb-3 font-script">{person1Name}</h3>
              <p className="text-sm text-slate-500 uppercase tracking-widest mb-1">Son of</p>
              <p className="text-lg font-medium text-slate-800">{groomParents}</p>
            </div>

            <div className="bg-white/60 p-8 rounded-3xl shadow-sm border border-amber-100 flex flex-col items-center">
              {bridePhoto && (
                <div className="w-32 h-32 md:w-40 md:h-40 rounded-full overflow-hidden border-4 border-amber-200 shadow-lg mb-6 mx-auto">
                  <img src={bridePhoto} alt={person2Name} className="w-full h-full object-cover" />
                </div>
              )}
              <h3 className="text-4xl font-bold text-rose-700 mb-3 font-script">{person2Name}</h3>
              <p className="text-sm text-slate-500 uppercase tracking-widest mb-1">Daughter of</p>
              <p className="text-lg font-medium text-slate-800">{brideParents}</p>
            </div>
          </div>
        </div>
      </section>
    ),
    story: (
      <section key="story" className="py-20 px-6 relative z-10 text-center">
        <div className="max-w-3xl mx-auto bg-white/80 backdrop-blur-md rounded-[2.5rem] p-10 shadow-xl border border-amber-100">
          <h2 className="text-3xl md:text-5xl font-bold text-rose-800 mb-6 font-script">{storyTitle}</h2>
          <p className="text-md md:text-lg text-slate-700 italic leading-relaxed">
            "{story}"
          </p>
        </div>
      </section>
    ),
    schedule: (
      <section key="schedule" className="py-20 px-6 relative z-10">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-rose-800 mb-4" style={{ fontFamily: "'Playfair Display', serif" }}>Schedule & Events</h2>
            <div className="w-20 h-1 bg-amber-400 mx-auto rounded-full"></div>
          </div>

          <div className="space-y-8">
            {schedule.map((item: any, index: number) => (
              <div key={index} className="bg-white/80 backdrop-blur-md rounded-3xl p-8 shadow-xl border-l-4 border-amber-500 relative flex flex-col md:flex-row items-center md:items-start justify-between text-center md:text-left hover:-translate-y-1 transition-transform">
                <div className="flex-1 mb-6 md:mb-0">
                  <h3 className="text-2xl font-bold text-rose-800 mb-2 font-serif">{item.event}</h3>
                  <p className="text-lg font-semibold text-slate-700 mb-1">{item.date || date}</p>
                  <p className="text-md text-amber-600 font-medium mb-3">{item.time}</p>
                  <p className="text-sm text-slate-500 flex items-center justify-center md:justify-start gap-2">
                    <MapPin size={16} className="text-rose-600" />
                    {item.venue || location}
                  </p>
                </div>
                <div>
                  <a
                    href={item.mapLink || mapUrl}
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
    countdown: (
      <section key="countdown" className="py-20 px-6 relative z-10 bg-rose-800 text-white rounded-[3rem] mx-4 md:mx-12 shadow-2xl overflow-hidden my-10">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-amber-200 to-transparent"></div>
        <div className="max-w-3xl mx-auto text-center relative z-10">
          <h2 className="text-2xl md:text-4xl font-bold mb-2 font-serif text-amber-300">Counting Down To</h2>
          <p className="text-xl italic mb-12 text-rose-200">Our Special Day</p>

          <div className="flex gap-2 sm:gap-4 md:gap-8 justify-center">
            {[
              { label: 'Days', value: timeLeft?.d ?? 30 },
              { label: 'Hours', value: timeLeft?.h ?? 12 },
              { label: 'Mins', value: timeLeft?.m ?? 45 },
              { label: 'Secs', value: timeLeft?.s ?? 0 }
            ].map((item, idx) => (
              <div key={idx} className="flex flex-col items-center">
                <div className={`w-14 h-14 sm:w-16 sm:h-16 md:w-24 md:h-24 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center mb-3 shadow-inner border border-white/20`}>
                  <span className="text-xl sm:text-2xl md:text-4xl font-bold text-white font-serif">{item.value}</span>
                </div>
                <span className="text-[10px] md:text-xs tracking-widest uppercase font-bold text-amber-200">{item.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>
    ),
    gallery: validGallery.length > 0 ? (
      <section key="gallery" className="py-20 px-6 relative z-10">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-rose-800 mb-12" style={{ fontFamily: "'Playfair Display', serif" }}>Gallery</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
            {validGallery.map((url: string, index: number) => (
              <div key={index} className="aspect-[4/5] rounded-3xl overflow-hidden shadow-lg group relative">
                <div className="absolute inset-0 bg-rose-900/20 opacity-0 group-hover:opacity-100 transition-opacity z-10"></div>
                <img src={url} alt={`Moment ${index + 1}`} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
              </div>
            ))}
          </div>
        </div>
      </section>
    ) : null,
    venue: (
      <section key="venue" className="py-20 px-6 relative z-10">
        <div className="max-w-4xl mx-auto text-center bg-white/70 backdrop-blur-md rounded-[3rem] p-8 md:p-12 shadow-xl border border-amber-100">
          <h2 className="text-3xl md:text-4xl font-bold text-rose-800 mb-4" style={{ fontFamily: "'Playfair Display', serif" }}>Venue & Map</h2>
          <div className="w-16 h-1 bg-amber-400 mx-auto mb-8 rounded-full"></div>

          <div className="mb-10">
            <h3 className="text-xl font-bold text-slate-800 mb-2">{location}</h3>
          </div>

          <div className="w-full aspect-video md:aspect-[21/9] rounded-2xl overflow-hidden shadow-inner border border-slate-200">
            <iframe
              src={mapUrl && mapUrl.includes('embed') ? mapUrl : `https://maps.google.com/maps?q=${encodeURIComponent(location)}&t=&z=14&ie=UTF8&iwloc=&output=embed`}
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

          {contactNumbers && contactNumbers.trim() !== "" && (
            <div className="mt-10 border-t border-slate-200/50 pt-8">
              <p className="text-[10px] tracking-widest uppercase font-bold text-slate-400 mb-2">RSVP / Contact Numbers</p>
              <p className="text-lg font-medium text-slate-800">{contactNumbers}</p>
            </div>
          )}
        </div>
      </section>
    ),
    rsvp: (
      <section key="rsvp" className="py-20 px-6 relative z-10">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-rose-800 mb-4" style={{ fontFamily: "'Playfair Display', serif" }}>Will You Join Us?</h2>
          <p className="text-slate-500 mb-10 tracking-widest uppercase text-sm">Please let us know if you can make it</p>

          <div className="bg-white rounded-[2rem] p-8 md:p-10 shadow-2xl border border-amber-100 text-left">
            <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
              <div className="space-y-6">
                <div>
                  <label className="block text-xs font-bold tracking-widest uppercase text-slate-500 mb-2">Name</label>
                  <input type="text" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 outline-none focus:border-rose-500 focus:ring-1 focus:ring-rose-500 transition-all font-serif" placeholder="Your Name" />
                </div>

                <div>
                  <label className="block text-xs font-bold tracking-widest uppercase text-slate-500 mb-2">Message</label>
                  <textarea rows={4} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 outline-none focus:border-rose-500 focus:ring-1 focus:ring-rose-500 transition-all font-serif resize-none" placeholder="Your wishes for the couple..."></textarea>
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
    <div className={`min-h-screen font-sans bg-[#F8F4E6] relative text-slate-800 ${!isOpened ? 'max-h-screen overflow-hidden' : ''}`}>

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

      {/* Audio Element */}
      {musicUrl && (
        <audio ref={audioRef} src={musicUrl} loop preload="auto" />
      )}

      {/* Floating Audio Control */}
      {musicUrl && isOpened && (
        <button
          onClick={() => {
            if (audioRef.current) {
              if (isMuted) {
                audioRef.current.play();
              } else {
                audioRef.current.pause();
              }
              setIsMuted(!isMuted);
            }
          }}
          className="fixed bottom-6 right-6 z-50 p-4 rounded-full bg-rose-800 text-amber-200 shadow-2xl border border-amber-300/40 hover:scale-110 active:scale-95 transition-all"
        >
          {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
        </button>
      )}

      {/* Toran Header */}
      <Toran />

      {/* Welcome Screen / Envelope Overlay */}
      <div className={`fixed inset-0 z-[100] flex flex-col items-center justify-center bg-[#FDF9EE] transition-transform duration-1000 ease-[cubic-bezier(0.7,0,0.3,1)] ${isOpened ? '-translate-y-full' : 'translate-y-0'}`}>

        {/* Arch / Decor Background */}
        <div className="absolute inset-0 w-full h-full pointer-events-none z-0">
          <img src="/media/south_indian_arch.png" alt="Arch Decoration" className="w-full h-full object-cover object-top opacity-90 mix-blend-multiply" />
        </div>

        {/* Center Content */}
        <div className="relative z-10 text-center px-6 py-10 flex flex-col items-center justify-center w-full max-w-2xl mx-auto h-auto mt-28 md:mt-36">
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
            onClick={() => {
              setIsOpened(true);
              if (audioRef.current && musicUrl) {
                audioRef.current.play().catch(console.error);
              }
            }}
            className="group relative overflow-hidden bg-rose-900 hover:bg-rose-950 text-amber-200 font-bold tracking-widest uppercase text-xs md:text-sm px-10 py-3 md:px-12 md:py-4 rounded-full shadow-lg transition-all hover:scale-105 active:scale-95 z-20 border border-amber-300/30 flex-shrink-0"
          >
            <span className="relative z-10 flex items-center gap-2">
              Open Invitation
            </span>
            <div className="absolute inset-0 h-full w-0 bg-white/20 transition-[width] group-hover:w-full ease-out duration-300"></div>
          </button>
        </div>
      </div>

      {/* Main Content Sections */}
      <div className="relative z-30 max-w-4xl mx-auto space-y-16 w-full pt-12">
        {sections.filter((s: any) => s.visible).map((s: any) => sectionMap[s.id])}
      </div>

      {/* Footer */}
      <footer className="py-12 relative z-10 text-center bg-rose-950 text-white rounded-t-[2.5rem] w-full max-w-4xl mx-auto mt-16">
        <h2 className="text-2xl font-script mb-2 text-amber-300">{coupleNames}</h2>
        <p className="text-amber-200/70 text-xs tracking-widest uppercase mb-2">Made with love by Jaalam</p>
      </footer>

    </div>
  );
}
