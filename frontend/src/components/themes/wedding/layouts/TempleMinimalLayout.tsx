import React, { useState, useEffect, useRef } from 'react';
import { Calendar, MapPin, Volume2, VolumeX, Navigation, Heart, Sparkles, Send } from 'lucide-react';
import type { WeddingLayoutProps } from './types';

export default function TempleMinimalLayout({ content, website }: WeddingLayoutProps) {
  const [isOpened, setIsOpened] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  const musicUrl = content?.settings_json?.wedding?.musicUrl || "";

  const coupleNamesStr = content?.hero_title || 'Anjali & Rahul';
  const nameParts = coupleNamesStr.split(/&| and /i);
  const groomName = nameParts[0]?.trim() || 'Rahul';
  const brideName = nameParts[1]?.trim() || 'Anjali';

  const date = content?.settings_json?.wedding?.date || content?.date || 'Thursday, July 13, 2026';
  const location = content?.contact_info?.address || content?.venue?.address || content?.venue?.name || content?.settings_json?.wedding?.venue || "Grand Palace Venue";

  const groomParents = content?.settings_json?.wedding?.groomParents || 'Father & Mother';
  const brideParents = content?.settings_json?.wedding?.brideParents || 'Father & Mother';

  const rawSchedule = content?.settings_json?.wedding?.schedule;
  const schedule = (Array.isArray(rawSchedule) && rawSchedule.length > 0)
    ? rawSchedule
    : [
      { time: "7:00 PM Onwards", event: "Sangeeth & Cocktail Night", date: date, venue: location },
      { time: "11:00 AM Onwards", event: "Grand Wedding Ceremony", date: date, venue: location }
    ];

  const groomPhoto = content?.settings_json?.wedding?.groomPhoto;
  const bridePhoto = content?.settings_json?.wedding?.bridePhoto;
  const mapUrl = content?.settings_json?.wedding?.mapUrl || content?.venue?.mapUrl || "";
  const contactNumbers = content?.settings_json?.wedding?.contactNumbers || "";

  const gallery = content?.settings_json?.wedding?.gallery || [];
  const validGallery = Array.isArray(gallery) ? gallery.filter((url: string) => url && url.trim() !== "") : [];

  const story = content?.about_text || "Under a canopy of twinkling stars, two hearts found their forever beat. Join us as we celebrate love, laughter, and a marvelous new chapter.";
  const storyTitle = content?.about_title || content?.settings_json?.wedding?.story_title || "Our Starlight Story";

  const countdownDate = content?.settings_json?.wedding?.countdownDate || "2026-07-13T19:00";
  const [timeLeft, setTimeLeft] = useState<{ d: number, h: number, m: number, s: number } | null>(null);

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
      <section key="hero" className="relative w-full min-h-screen flex flex-col justify-between text-center bg-cover bg-center bg-no-repeat p-4 sm:p-8" style={{ backgroundImage: "url('/media/starlight_couple_bg.png')" }}>
        
        {/* Transparent Text Area directly in Starlight Sky */}
        <div className="relative z-20 pt-6 sm:pt-10 max-w-lg mx-auto px-4">
          
          <p className="text-white text-xs sm:text-sm font-semibold italic mb-1.5 tracking-wide font-serif" style={{ fontFamily: "'Playfair Display', serif", textShadow: "0 2px 10px rgba(0,0,0,0.9)" }}>
            Join us in celebrating love, laughter<br />& a marvelous new chapter of
          </p>

          <h1 className="text-4xl sm:text-6xl md:text-7xl font-bold text-white my-2 sm:my-3 font-script whitespace-nowrap px-2" style={{ fontFamily: "'Great Vibes', cursive, serif", textShadow: "0 3px 12px rgba(0,0,0,0.95)" }}>
            {coupleNamesStr}
          </h1>

          <div className="my-2">
            <span className="inline-block bg-black/40 backdrop-blur-xs text-amber-300 border border-amber-300/70 text-[10px] sm:text-xs font-bold tracking-widest uppercase px-4 py-1 rounded-full shadow-md" style={{ textShadow: "0 1px 4px rgba(0,0,0,0.8)" }}>
              #KuchKuchHotaHai
            </span>
          </div>

          {/* Line Flourish */}
          <div className="flex items-center justify-center gap-2 my-2 opacity-90">
            <div className="w-10 sm:w-16 h-[1.5px] bg-amber-300"></div>
            <div className="w-1.5 h-1.5 rounded-full bg-amber-300"></div>
            <div className="w-10 sm:w-16 h-[1.5px] bg-amber-300"></div>
          </div>

          <p className="text-white text-sm sm:text-lg font-bold tracking-wider my-1 font-serif" style={{ fontFamily: "'Playfair Display', serif", textShadow: "0 2px 10px rgba(0,0,0,0.9)" }}>
            {date}
          </p>

          <p className="text-amber-200 font-semibold text-xs sm:text-sm tracking-wide my-1 font-serif" style={{ textShadow: "0 2px 8px rgba(0,0,0,0.9)" }}>
            Venue: {location}, 7:00 PM onwards
          </p>

        </div>

      </section>
    ),
    about: (
      <section key="about" className="py-20 px-6 relative z-10 text-center max-w-4xl mx-auto bg-[#0F2231] text-white">
        <div className="max-w-2xl mx-auto bg-white/10 backdrop-blur-md rounded-3xl p-8 sm:p-12 shadow-2xl border border-amber-300/30">
          <p className="text-amber-300 text-xs sm:text-sm font-bold tracking-[0.2em] uppercase mb-2 leading-relaxed font-serif" style={{ fontFamily: "'Playfair Display', serif" }}>
            {groomParents || brideParents ? `${groomParents}` : 'PARENTS & FAMILY'}
          </p>
          <p className="text-amber-100/90 text-[11px] sm:text-xs italic leading-relaxed max-w-xs sm:max-w-sm mx-auto mb-8 font-serif" style={{ fontFamily: "'Playfair Display', serif" }}>
            solicit your blessings & request the honour of your presence to grace the auspicious occasion of the wedding celebrations of their son
          </p>

          <div className="grid md:grid-cols-2 gap-6 my-4">
            {/* Groom Card */}
            <div className="bg-white/10 p-6 rounded-2xl border border-amber-300/20 flex flex-col items-center">
              {groomPhoto ? (
                <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-amber-300 mb-3 shadow-md">
                  <img src={groomPhoto} alt="Groom" className="w-full h-full object-cover" />
                </div>
              ) : (
                <div className="w-16 h-16 rounded-full bg-amber-400/20 border border-amber-300/40 flex items-center justify-center mb-3 text-amber-300">
                  <Heart className="w-7 h-7 fill-amber-300/40" />
                </div>
              )}
              <h3 className="text-3xl font-bold text-amber-300 mb-1 font-script" style={{ fontFamily: "'Great Vibes', cursive" }}>{groomName}</h3>
              <p className="text-xs text-amber-200 font-bold uppercase tracking-widest mb-1 font-serif">Groom</p>
              <p className="text-xs text-slate-300">Son of {groomParents}</p>
            </div>

            {/* Bride Card */}
            <div className="bg-white/10 p-6 rounded-2xl border border-amber-300/20 flex flex-col items-center">
              {bridePhoto ? (
                <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-amber-300 mb-3 shadow-md">
                  <img src={bridePhoto} alt="Bride" className="w-full h-full object-cover" />
                </div>
              ) : (
                <div className="w-16 h-16 rounded-full bg-amber-400/20 border border-amber-300/40 flex items-center justify-center mb-3 text-amber-300">
                  <Heart className="w-7 h-7 fill-amber-300/40" />
                </div>
              )}
              <h3 className="text-3xl font-bold text-amber-300 mb-1 font-script" style={{ fontFamily: "'Great Vibes', cursive" }}>{brideName}</h3>
              <p className="text-xs text-amber-200 font-bold uppercase tracking-widest mb-1 font-serif">Bride</p>
              <p className="text-xs text-slate-300">Daughter of {brideParents}</p>
            </div>
          </div>
        </div>
      </section>
    ),
    story: (
      <section key="story" className="py-20 px-6 relative z-10 text-center max-w-4xl mx-auto bg-[#0F2231]">
        <div className="max-w-2xl mx-auto bg-white/10 backdrop-blur-md rounded-3xl p-8 sm:p-12 shadow-2xl border border-amber-300/30 text-white">
          <Sparkles className="w-8 h-8 text-amber-300 mx-auto mb-3" />
          <h2 className="text-3xl md:text-5xl font-bold text-amber-300 mb-6 font-script" style={{ fontFamily: "'Great Vibes', cursive" }}>
            {storyTitle}
          </h2>
          <p className="text-base sm:text-lg text-amber-100 italic leading-relaxed font-serif">
            "{story}"
          </p>
        </div>
      </section>
    ),
    schedule: (
      <section key="schedule" className="py-20 px-6 relative z-10 text-center max-w-4xl mx-auto bg-[#132B3D]">
        <h2 className="text-3xl md:text-5xl font-bold text-amber-300 mb-10 font-script" style={{ fontFamily: "'Great Vibes', cursive" }}>Schedule & Events</h2>
        <div className="grid md:grid-cols-2 gap-8">
          {schedule.map((item: any, idx: number) => (
            <div key={idx} className="bg-white/10 backdrop-blur-md rounded-3xl p-8 shadow-xl border-l-4 border-amber-400 text-center hover:bg-white/15 transition-all text-white">
              <h3 className="text-2xl font-bold text-amber-300 mb-3 font-serif">{item.event}</h3>
              <div className="flex items-center justify-center gap-2 mb-2 text-amber-100">
                <Calendar className="w-5 h-5 text-amber-400" />
                <span className="font-semibold">{item.date || date}</span>
              </div>
              <p className="text-amber-300 font-bold text-lg mb-2">{item.time}</p>
              <p className="text-slate-300 text-sm">{item.venue || location}</p>
            </div>
          ))}
        </div>
      </section>
    ),
    venue: (
      <section key="venue" className="py-20 px-6 relative z-10 max-w-4xl mx-auto bg-[#0F2231]">
        <div className="bg-white/10 backdrop-blur-md rounded-[3rem] p-8 sm:p-10 text-center shadow-2xl border border-amber-300/30 text-white relative overflow-hidden">
          <div className="relative z-10">
            <div className="w-16 h-16 bg-amber-400/20 rounded-full flex items-center justify-center mx-auto mb-4 shadow-inner text-amber-300 border border-amber-300/40">
              <MapPin className="w-8 h-8 text-amber-300" />
            </div>
            <h3 className="text-3xl font-bold text-amber-300 mb-3 font-script" style={{ fontFamily: "'Great Vibes', cursive" }}>Venue & Map</h3>
            <p className="text-xl font-semibold text-white mb-2 font-serif">{location}</p>
            <p className="text-md text-amber-100 max-w-md mx-auto mb-6 font-sans">Join us under the starlight to celebrate our wedding.</p>

            {/* Google Maps Embed Iframe */}
            <div className="w-full aspect-video md:aspect-[21/9] rounded-2xl overflow-hidden shadow-inner border border-white/20 mb-6 bg-slate-900">
              <iframe
                src={mapUrl && mapUrl.includes('embed') ? mapUrl : `https://maps.google.com/maps?q=${encodeURIComponent(location)}&t=&z=14&ie=UTF8&iwloc=&output=embed`}
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen={true}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="pointer-events-none md:pointer-events-auto filter grayscale invert opacity-80"
              ></iframe>
            </div>

            {mapUrl && (
              <a
                href={mapUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-amber-400 hover:bg-amber-500 text-slate-950 px-8 py-3.5 rounded-full font-bold tracking-wide transition-all shadow-lg text-sm mb-6"
              >
                <Navigation size={16} />
                Get Directions
              </a>
            )}

            {contactNumbers && contactNumbers.trim() !== "" && (
              <div className="border-t border-white/20 pt-6 mt-2">
                <p className="text-[10px] tracking-widest uppercase font-bold text-amber-200/70 mb-1">RSVP / Contact Numbers</p>
                <p className="text-base sm:text-lg font-bold text-amber-300 font-serif">{contactNumbers}</p>
              </div>
            )}
          </div>
        </div>
      </section>
    ),
    gallery: validGallery.length > 0 ? (
      <section key="gallery" className="py-20 px-6 relative z-10 text-center max-w-4xl mx-auto bg-[#132B3D]">
        <h2 className="text-3xl md:text-5xl font-bold text-amber-300 mb-10 font-script" style={{ fontFamily: "'Great Vibes', cursive" }}>Gallery</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {validGallery.map((url: string, index: number) => (
            <div key={index} className="aspect-square rounded-3xl overflow-hidden shadow-lg border-2 border-amber-300/40 hover:scale-105 transition-transform duration-500">
              <img src={url} alt={`Gallery ${index}`} className="w-full h-full object-cover" />
            </div>
          ))}
        </div>
      </section>
    ) : null,
    countdown: (
      <section key="countdown" className="py-16 px-6 relative z-10 bg-[#0A1621] text-white rounded-[2.5rem] mx-4 max-w-4xl md:mx-auto shadow-2xl overflow-hidden my-8 text-center border-2 border-amber-400/40">
        <div className="max-w-3xl mx-auto relative z-10">
          <h2 className="text-3xl md:text-5xl font-bold mb-2 text-amber-300 font-script" style={{ fontFamily: "'Great Vibes', cursive" }}>Counting Down To</h2>
          <p className="text-base sm:text-lg italic mb-8 text-amber-100 font-serif">Our Starlight Celebration</p>

          <div className="flex gap-3 sm:gap-6 justify-center">
            {[
              { label: 'Days', value: timeLeft?.d ?? 30 },
              { label: 'Hours', value: timeLeft?.h ?? 12 },
              { label: 'Mins', value: timeLeft?.m ?? 45 },
              { label: 'Secs', value: timeLeft?.s ?? 0 }
            ].map((item, idx) => (
              <div key={idx} className="flex flex-col items-center">
                <div className="w-14 h-14 sm:w-20 sm:h-20 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center mb-2 shadow-inner border border-white/20">
                  <span className="text-xl sm:text-3xl font-bold text-amber-300 font-serif">{item.value}</span>
                </div>
                <span className="text-[10px] sm:text-xs tracking-widest uppercase font-bold text-amber-200">{item.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>
    ),
    rsvp: (
      <section key="rsvp" className="py-16 px-6 relative z-10 max-w-2xl mx-auto bg-[#0F2231]">
        <div className="text-center">
          <h2 className="text-3xl md:text-5xl font-bold text-amber-300 mb-3 font-script" style={{ fontFamily: "'Great Vibes', cursive" }}>Will You Join Us?</h2>
          <p className="text-amber-200/80 mb-8 tracking-widest uppercase text-xs font-semibold">Please let us know if you can attend</p>

          <div className="bg-white/10 backdrop-blur-md rounded-[2rem] p-8 md:p-10 shadow-2xl border border-amber-300/30 text-left text-white">
            <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
              <div className="space-y-5">
                <div>
                  <label className="block text-xs font-bold tracking-widest uppercase text-amber-200/80 mb-2">Name</label>
                  <input type="text" className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 outline-none focus:border-amber-300 transition-all font-serif text-white placeholder-slate-400" placeholder="Your Full Name" />
                </div>

                <div>
                  <label className="block text-xs font-bold tracking-widest uppercase text-amber-200/80 mb-2">Message / Warm Wishes</label>
                  <textarea rows={4} className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 outline-none focus:border-amber-300 transition-all font-serif resize-none text-white placeholder-slate-400" placeholder="Share your warm wishes for the couple..."></textarea>
                </div>

                <div>
                  <label className="block text-xs font-bold tracking-widest uppercase text-amber-200/80 mb-3">Will you be attending?</label>
                  <div className="flex flex-col sm:flex-row gap-4">
                    <label className="flex items-center gap-3 cursor-pointer p-4 border border-white/20 hover:border-amber-300 bg-white/5 rounded-xl flex-1 transition-colors">
                      <input type="radio" name="attending" className="w-4 h-4 accent-amber-300" />
                      <span className="text-amber-100 font-bold uppercase tracking-widest text-xs">Joyfully Accepts</span>
                    </label>
                    <label className="flex items-center gap-3 cursor-pointer p-4 border border-white/20 hover:border-amber-300 bg-white/5 rounded-xl flex-1 transition-colors">
                      <input type="radio" name="attending" className="w-4 h-4 accent-amber-300" />
                      <span className="text-amber-100 font-bold uppercase tracking-widest text-xs">Regretfully Declines</span>
                    </label>
                  </div>
                </div>
              </div>

              <div className="pt-4 text-center">
                <button type="button" className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-amber-400 hover:bg-amber-500 text-slate-950 font-bold tracking-widest uppercase text-xs px-10 py-4 rounded-full shadow-lg transition-all hover:scale-105 cursor-pointer">
                  <Send size={14} />
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
    <div className={`min-h-screen bg-[#0F2231] relative font-sans flex flex-col items-center overflow-hidden w-full ${!isOpened ? 'max-h-screen overflow-hidden' : ''}`}>

      {/* Background Audio */}
      {musicUrl && (
        <audio ref={audioRef} src={musicUrl} loop preload="auto" />
      )}

      {/* Floating Audio Control Button */}
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
          className="fixed bottom-6 right-6 z-50 p-4 rounded-full bg-[#132B3D] text-amber-300 shadow-2xl border border-amber-400/40 hover:scale-110 active:scale-95 transition-all"
        >
          {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
        </button>
      )}

      {/* Welcome Screen Overlay Envelope */}
      <div className={`fixed inset-0 z-[100] flex flex-col justify-between text-center bg-cover bg-center bg-no-repeat transition-transform duration-1000 ease-[cubic-bezier(0.7,0,0.3,1)] ${isOpened ? '-translate-y-full' : 'translate-y-0'} overflow-hidden p-4 sm:p-8`} style={{ backgroundImage: "url('/media/starlight_couple_bg.png')" }}>
        
        {/* Transparent Text Area directly in Starlight Sky */}
        <div className="relative z-20 pt-6 sm:pt-10 max-w-lg mx-auto px-4">
          
          <p className="text-white text-xs sm:text-sm font-semibold italic mb-1.5 tracking-wide font-serif" style={{ fontFamily: "'Playfair Display', serif", textShadow: "0 2px 10px rgba(0,0,0,0.9)" }}>
            Join us in celebrating love, laughter<br />& a marvelous new chapter of
          </p>

          <h1 className="text-4xl sm:text-6xl md:text-7xl font-bold text-white my-2 sm:my-3 font-script whitespace-nowrap px-2" style={{ fontFamily: "'Great Vibes', cursive, serif", textShadow: "0 3px 12px rgba(0,0,0,0.95)" }}>
            {coupleNamesStr}
          </h1>

          <div className="my-2">
            <span className="inline-block bg-black/40 backdrop-blur-xs text-amber-300 border border-amber-300/70 text-[10px] sm:text-xs font-bold tracking-widest uppercase px-4 py-1 rounded-full shadow-md" style={{ textShadow: "0 1px 4px rgba(0,0,0,0.8)" }}>
              #KuchKuchHotaHai
            </span>
          </div>

          <div className="flex items-center justify-center gap-2 my-2 opacity-90">
            <div className="w-10 sm:w-16 h-[1.5px] bg-amber-300"></div>
            <div className="w-1.5 h-1.5 rounded-full bg-amber-300"></div>
            <div className="w-10 sm:w-16 h-[1.5px] bg-amber-300"></div>
          </div>

          <p className="text-white text-sm sm:text-lg font-bold tracking-wider my-1 font-serif" style={{ fontFamily: "'Playfair Display', serif", textShadow: "0 2px 10px rgba(0,0,0,0.9)" }}>
            {date}
          </p>

          <p className="text-amber-200 font-semibold text-xs sm:text-sm tracking-wide my-1 font-serif" style={{ textShadow: "0 2px 8px rgba(0,0,0,0.9)" }}>
            Venue: {location}, 7:00 PM onwards
          </p>

        </div>

        {/* OPEN INVITATION BUTTON Floating near bottom */}
        <div className="relative z-30 mb-6 sm:mb-8">
          <button
            onClick={() => {
              setIsOpened(true);
              if (audioRef.current && musicUrl) {
                audioRef.current.play().catch(console.error);
              }
            }}
            className="group relative overflow-hidden bg-[#132B3D] hover:bg-[#0A1621] text-amber-300 font-bold tracking-widest uppercase text-xs sm:text-sm px-10 py-4 rounded-full shadow-2xl transition-all hover:scale-105 active:scale-95 border-2 border-amber-300/60 cursor-pointer mx-auto"
          >
            <span className="relative z-10 flex items-center gap-2 font-serif">
              Open Invitation
            </span>
            <div className="absolute inset-0 h-full w-0 bg-white/20 transition-[width] group-hover:w-full ease-out duration-300"></div>
          </button>
        </div>

      </div>

      {/* Main Content Sections */}
      <div className="relative z-30 w-full">
        {sections.filter(s => s.visible).map(s => sectionMap[s.id])}
      </div>

      {/* Footer */}
      <footer className="py-12 relative z-10 text-center bg-[#0A1621] text-white rounded-t-[2.5rem] w-full max-w-4xl mx-auto mt-16 border-t-2 border-amber-400/30">
        <h2 className="text-3xl font-script mb-2 text-amber-300" style={{ fontFamily: "'Great Vibes', cursive" }}>{coupleNamesStr}</h2>
        <p className="text-amber-200/70 text-xs tracking-widest uppercase mb-2 font-serif">Made with love by Jaalam</p>
      </footer>

    </div>
  );
}
