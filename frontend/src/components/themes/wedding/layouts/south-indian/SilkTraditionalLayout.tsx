import React, { useState, useEffect, useRef } from 'react';
import { Calendar, MapPin, Volume2, VolumeX, Navigation, Heart, Sparkles, Send } from 'lucide-react';
import type { WeddingLayoutProps } from '../types';

export default function SilkTraditionalLayout({ content, website }: WeddingLayoutProps) {
  const [isOpened, setIsOpened] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  const musicUrl = content?.settings_json?.wedding?.musicUrl || "";

  const coupleNamesStr = content?.hero_title || 'Chiranjeev & Aarohi';
  const nameParts = coupleNamesStr.split(/&| and /i);
  const groomName = nameParts[0]?.trim() || 'Chiranjeev';
  const brideName = nameParts[1]?.trim() || 'Aarohi';

  const date = content?.settings_json?.wedding?.date || content?.date || 'July 13, 2026 AT 1:30 PM';
  const location = content?.contact_info?.address || content?.venue?.address || content?.venue?.name || content?.settings_json?.wedding?.venue || "Grand Venue, Kerala";

  const groomParents = content?.settings_json?.wedding?.groomParents || 'Father & Mother';
  const brideParents = content?.settings_json?.wedding?.brideParents || 'Father & Mother';

  const rawSchedule = content?.settings_json?.wedding?.schedule;
  const schedule = (Array.isArray(rawSchedule) && rawSchedule.length > 0)
    ? rawSchedule
    : [
      { time: "9:00 AM Onwards", event: "Muhurtham", date: date, venue: location },
      { time: "7:00 PM Onwards", event: "Grand Reception", date: date, venue: location }
    ];

  const groomPhoto = content?.settings_json?.wedding?.groomPhoto;
  const bridePhoto = content?.settings_json?.wedding?.bridePhoto;
  const mapUrl = content?.settings_json?.wedding?.mapUrl || content?.venue?.mapUrl || "";
  const contactNumbers = content?.settings_json?.wedding?.contactNumbers || "";

  const gallery = content?.settings_json?.wedding?.gallery || [];
  const validGallery = Array.isArray(gallery) ? gallery.filter((url: string) => url && url.trim() !== "") : [];

  const story = content?.about_text || "We met along the serene backwaters of Kerala and found a timeless love. We joyfully invite you to celebrate our new beginning.";
  const storyTitle = content?.about_title || content?.settings_json?.wedding?.story_title || "Our Love Story";

  const countdownDate = content?.settings_json?.wedding?.countdownDate || "2026-07-13T13:30";
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
      <section key="hero" className="relative w-full min-h-screen flex flex-col justify-between text-center bg-cover bg-center bg-no-repeat p-6 sm:p-10" style={{ backgroundImage: "url('/media/kerala_couple_boat_bg.png')" }}>
        
        {/* Top Invitation Text in Open Sky Area */}
        <div className="relative z-20 pt-8 sm:pt-14 max-w-lg mx-auto">
          <p className="text-[#1D4B57] text-[11px] sm:text-xs font-semibold tracking-[0.22em] uppercase mb-2 leading-tight font-serif drop-shadow-sm" style={{ fontFamily: "'Playfair Display', serif" }}>
            WE INVITE YOU<br />TO CELEBRATE OUR WEDDING
          </p>

          <h1 className="text-4xl sm:text-6xl md:text-7xl font-bold text-[#132B36] my-2 sm:my-4 font-script whitespace-nowrap drop-shadow-sm px-1" style={{ fontFamily: "'Great Vibes', cursive, serif" }}>
            {coupleNamesStr}
          </h1>

          {/* Decorative Line Flourish */}
          <div className="flex items-center justify-center gap-2 my-2 opacity-90">
            <div className="w-12 sm:w-20 h-[1.5px] bg-[#1D4B57]"></div>
            <div className="w-1.5 h-1.5 rounded-full bg-[#C59B27]"></div>
            <div className="w-12 sm:w-20 h-[1.5px] bg-[#1D4B57]"></div>
          </div>

          <p className="text-[#1D4B57] text-sm sm:text-lg font-bold tracking-wider my-1 font-serif" style={{ fontFamily: "'Playfair Display', serif" }}>
            {date}
          </p>

          <div className="flex items-center justify-center gap-2 my-2 opacity-90">
            <div className="w-12 sm:w-20 h-[1.5px] bg-[#1D4B57]"></div>
            <div className="w-1.5 h-1.5 rounded-full bg-[#C59B27]"></div>
            <div className="w-12 sm:w-20 h-[1.5px] bg-[#1D4B57]"></div>
          </div>
        </div>

      </section>
    ),
    about: (
      <section key="about" className="py-20 px-6 relative z-10 text-center max-w-4xl mx-auto bg-[#EBF9FD] text-[#132B36]">
        <div className="max-w-2xl mx-auto bg-white/90 backdrop-blur-md rounded-3xl p-8 sm:p-12 shadow-xl border border-teal-200">
          <p className="text-[#1D4B57] text-xs sm:text-sm font-bold tracking-[0.18em] uppercase mb-2 leading-relaxed font-serif" style={{ fontFamily: "'Playfair Display', serif" }}>
            {groomParents || brideParents ? `${groomParents}` : 'PARENTS & FAMILY'}
          </p>

          <p className="text-[#2C6270] text-[11px] sm:text-xs italic leading-relaxed max-w-xs sm:max-w-sm mx-auto mb-6 font-serif" style={{ fontFamily: "'Playfair Display', serif" }}>
            solicit your blessings & request the honour of your presence to grace the auspicious occasion of the wedding celebrations of their son
          </p>

          <div className="grid md:grid-cols-2 gap-6 my-4">
            <div className="bg-cyan-50/60 p-6 rounded-2xl border border-teal-200 flex flex-col items-center">
              {groomPhoto ? (
                <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-amber-400 mb-3 shadow-md">
                  <img src={groomPhoto} alt="Groom" className="w-full h-full object-cover" />
                </div>
              ) : (
                <div className="w-16 h-16 rounded-full bg-amber-100/60 border border-amber-300 flex items-center justify-center mb-3 text-amber-700">
                  <Heart className="w-7 h-7 fill-amber-300" />
                </div>
              )}
              <h3 className="text-3xl font-bold text-[#132B36] mb-1 font-script" style={{ fontFamily: "'Great Vibes', cursive" }}>{groomName}</h3>
              <p className="text-xs text-emerald-800 uppercase tracking-widest mb-1 font-bold font-serif">Groom</p>
              <p className="text-xs text-slate-600">Son of {groomParents}</p>
            </div>

            <div className="bg-cyan-50/60 p-6 rounded-2xl border border-teal-200 flex flex-col items-center">
              {bridePhoto ? (
                <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-amber-400 mb-3 shadow-md">
                  <img src={bridePhoto} alt="Bride" className="w-full h-full object-cover" />
                </div>
              ) : (
                <div className="w-16 h-16 rounded-full bg-amber-100/60 border border-amber-300 flex items-center justify-center mb-3 text-amber-700">
                  <Heart className="w-7 h-7 fill-amber-300" />
                </div>
              )}
              <h3 className="text-3xl font-bold text-[#132B36] mb-1 font-script" style={{ fontFamily: "'Great Vibes', cursive" }}>{brideName}</h3>
              <p className="text-xs text-emerald-800 uppercase tracking-widest mb-1 font-bold font-serif">Bride</p>
              <p className="text-xs text-slate-600">Daughter of {brideParents}</p>
            </div>
          </div>
        </div>
      </section>
    ),
    story: (
      <section key="story" className="py-20 px-6 relative z-10 text-center max-w-4xl mx-auto bg-[#D6F2FB]">
        <div className="max-w-2xl mx-auto bg-white/90 backdrop-blur-md rounded-3xl p-8 sm:p-12 shadow-xl border border-teal-200">
          <Sparkles className="w-8 h-8 text-amber-500 mx-auto mb-3" />
          <h2 className="text-3xl md:text-5xl font-bold text-[#132B36] mb-6 font-script" style={{ fontFamily: "'Great Vibes', cursive" }}>
            {storyTitle}
          </h2>
          <p className="text-base sm:text-lg text-slate-700 italic leading-relaxed font-serif">
            "{story}"
          </p>
        </div>
      </section>
    ),
    schedule: (
      <section key="schedule" className="py-20 px-6 relative z-10 text-center max-w-4xl mx-auto bg-[#EBF9FD]">
        <h2 className="text-3xl md:text-5xl font-bold text-[#132B36] mb-10 font-script" style={{ fontFamily: "'Great Vibes', cursive" }}>Schedule & Events</h2>
        <div className="grid md:grid-cols-2 gap-8">
          {schedule.map((item: any, idx: number) => (
            <div key={idx} className="bg-white/95 backdrop-blur rounded-3xl p-8 shadow-xl border-l-4 border-amber-500 text-center hover:shadow-2xl transition-shadow">
              <h3 className="text-2xl font-bold text-[#132B36] mb-3 font-serif">{item.event}</h3>
              <div className="flex items-center justify-center gap-2 mb-2 text-teal-900">
                <Calendar className="w-5 h-5 text-amber-600" />
                <span className="font-semibold">{item.date || date}</span>
              </div>
              <p className="text-amber-700 font-bold text-lg mb-2">{item.time}</p>
              <p className="text-slate-600 text-sm">{item.venue || location}</p>
            </div>
          ))}
        </div>
      </section>
    ),
    venue: (
      <section key="venue" className="py-20 px-6 relative z-10 max-w-4xl mx-auto bg-[#D6F2FB]">
        <div className="bg-white/90 backdrop-blur-md rounded-[3rem] p-8 sm:p-10 text-center shadow-xl border border-amber-200 relative overflow-hidden">
          <div className="relative z-10">
            <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm text-teal-800">
              <MapPin className="w-8 h-8 text-amber-600" />
            </div>
            <h3 className="text-3xl font-bold text-[#132B36] mb-3 font-script" style={{ fontFamily: "'Great Vibes', cursive" }}>Venue & Map</h3>
            <p className="text-xl font-semibold text-slate-800 mb-2 font-serif">{location}</p>
            <p className="text-md text-slate-500 max-w-md mx-auto mb-6 font-sans">We look forward to welcoming you to our joyous celebration.</p>

            {/* Google Maps Embed Iframe */}
            <div className="w-full aspect-video md:aspect-[21/9] rounded-2xl overflow-hidden shadow-inner border border-slate-200 mb-6 bg-white">
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

            {mapUrl && (
              <a
                href={mapUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-[#132B36] hover:bg-[#0C1D25] text-amber-300 px-8 py-3.5 rounded-full font-bold tracking-wide transition-all shadow-lg text-sm mb-6"
              >
                <Navigation size={16} />
                Get Directions
              </a>
            )}

            {contactNumbers && contactNumbers.trim() !== "" && (
              <div className="border-t border-slate-200 pt-6 mt-2">
                <p className="text-[10px] tracking-widest uppercase font-bold text-slate-400 mb-1">RSVP / Contact Numbers</p>
                <p className="text-base sm:text-lg font-bold text-slate-800 font-serif">{contactNumbers}</p>
              </div>
            )}
          </div>
        </div>
      </section>
    ),
    gallery: validGallery.length > 0 ? (
      <section key="gallery" className="py-20 px-6 relative z-10 text-center max-w-4xl mx-auto bg-[#EBF9FD]">
        <h2 className="text-3xl md:text-5xl font-bold text-[#132B36] mb-10 font-script" style={{ fontFamily: "'Great Vibes', cursive" }}>Gallery</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {validGallery.map((url: string, index: number) => (
            <div key={index} className="aspect-square rounded-3xl overflow-hidden shadow-lg border-4 border-white hover:scale-105 transition-transform duration-500">
              <img src={url} alt={`Gallery ${index}`} className="w-full h-full object-cover" />
            </div>
          ))}
        </div>
      </section>
    ) : null,
    countdown: (
      <section key="countdown" className="py-16 px-6 relative z-10 bg-[#132B36] text-white rounded-[2.5rem] mx-4 max-w-4xl md:mx-auto shadow-2xl overflow-hidden my-8 text-center border-2 border-amber-400/40">
        <div className="max-w-3xl mx-auto relative z-10">
          <h2 className="text-3xl md:text-5xl font-bold mb-2 text-amber-300 font-script" style={{ fontFamily: "'Great Vibes', cursive" }}>Counting Down To</h2>
          <p className="text-base sm:text-lg italic mb-8 text-teal-200 font-serif">Our Wedding Day</p>

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
                <span className="text-[10px] sm:text-xs tracking-widest uppercase font-bold text-teal-200">{item.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>
    ),
    rsvp: (
      <section key="rsvp" className="py-16 px-6 relative z-10 max-w-2xl mx-auto bg-[#D6F2FB]">
        <div className="text-center">
          <h2 className="text-3xl md:text-5xl font-bold text-[#132B36] mb-3 font-script" style={{ fontFamily: "'Great Vibes', cursive" }}>Will You Join Us?</h2>
          <p className="text-teal-900 mb-8 tracking-widest uppercase text-xs font-semibold">Please let us know if you can attend</p>

          <div className="bg-white/95 backdrop-blur rounded-[2rem] p-8 md:p-10 shadow-xl border border-amber-200 text-left">
            <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
              <div className="space-y-5">
                <div>
                  <label className="block text-xs font-bold tracking-widest uppercase text-slate-500 mb-2">Name</label>
                  <input type="text" className="w-full bg-cyan-50/50 border border-cyan-200 rounded-xl px-4 py-3 outline-none focus:border-[#132B36] transition-all font-serif" placeholder="Your Full Name" />
                </div>

                <div>
                  <label className="block text-xs font-bold tracking-widest uppercase text-slate-500 mb-2">Message / Warm Wishes</label>
                  <textarea rows={4} className="w-full bg-cyan-50/50 border border-cyan-200 rounded-xl px-4 py-3 outline-none focus:border-[#132B36] transition-all font-serif resize-none" placeholder="Share your warm wishes for the couple..."></textarea>
                </div>

                <div>
                  <label className="block text-xs font-bold tracking-widest uppercase text-slate-500 mb-3">Will you be attending?</label>
                  <div className="flex flex-col sm:flex-row gap-4">
                    <label className="flex items-center gap-3 cursor-pointer p-4 border border-cyan-200 hover:border-[#132B36] bg-cyan-50/30 rounded-xl flex-1 transition-colors">
                      <input type="radio" name="attending" className="w-4 h-4 accent-[#132B36]" />
                      <span className="text-slate-800 font-bold uppercase tracking-widest text-xs">Joyfully Accepts</span>
                    </label>
                    <label className="flex items-center gap-3 cursor-pointer p-4 border border-cyan-200 hover:border-[#132B36] bg-cyan-50/30 rounded-xl flex-1 transition-colors">
                      <input type="radio" name="attending" className="w-4 h-4 accent-[#132B36]" />
                      <span className="text-slate-800 font-bold uppercase tracking-widest text-xs">Regretfully Declines</span>
                    </label>
                  </div>
                </div>
              </div>

              <div className="pt-4 text-center">
                <button type="button" className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-[#132B36] hover:bg-[#0C1D25] text-amber-300 font-bold tracking-widest uppercase text-xs px-10 py-4 rounded-full shadow-lg transition-all hover:scale-105 cursor-pointer">
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
    <div className={`min-h-screen bg-[#D6F2FB] relative font-sans flex flex-col items-center overflow-hidden w-full ${!isOpened ? 'max-h-screen overflow-hidden' : ''}`}>

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
          className="fixed bottom-6 right-6 z-50 p-4 rounded-full bg-[#132B36] text-amber-300 shadow-2xl border border-amber-400/40 hover:scale-110 active:scale-95 transition-all"
        >
          {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
        </button>
      )}

      {/* Welcome Screen Overlay Envelope */}
      <div className={`fixed inset-0 z-[100] flex flex-col justify-between text-center bg-cover bg-center bg-no-repeat transition-transform duration-1000 ease-[cubic-bezier(0.7,0,0.3,1)] ${isOpened ? '-translate-y-full' : 'translate-y-0'} overflow-hidden p-6 sm:p-10`} style={{ backgroundImage: "url('/media/kerala_couple_boat_bg.png')" }}>
        
        {/* Top Invitation Text in Open Sky Area */}
        <div className="relative z-20 pt-8 sm:pt-14 max-w-lg mx-auto">
          <p className="text-[#1D4B57] text-[11px] sm:text-xs font-semibold tracking-[0.22em] uppercase mb-2 leading-tight font-serif drop-shadow-sm" style={{ fontFamily: "'Playfair Display', serif" }}>
            WE INVITE YOU<br />TO CELEBRATE OUR WEDDING
          </p>

          <h1 className="text-4xl sm:text-6xl md:text-7xl font-bold text-[#132B36] my-2 sm:my-4 font-script whitespace-nowrap drop-shadow-sm px-1" style={{ fontFamily: "'Great Vibes', cursive, serif" }}>
            {coupleNamesStr}
          </h1>

          <div className="flex items-center justify-center gap-2 my-2 opacity-90">
            <div className="w-12 sm:w-20 h-[1.5px] bg-[#1D4B57]"></div>
            <div className="w-1.5 h-1.5 rounded-full bg-[#C59B27]"></div>
            <div className="w-12 sm:w-20 h-[1.5px] bg-[#1D4B57]"></div>
          </div>

          <p className="text-[#1D4B57] text-sm sm:text-lg font-bold tracking-wider my-1 font-serif" style={{ fontFamily: "'Playfair Display', serif" }}>
            {date}
          </p>

          <div className="flex items-center justify-center gap-2 my-2 opacity-90">
            <div className="w-12 sm:w-20 h-[1.5px] bg-[#1D4B57]"></div>
            <div className="w-1.5 h-1.5 rounded-full bg-[#C59B27]"></div>
            <div className="w-12 sm:w-20 h-[1.5px] bg-[#1D4B57]"></div>
          </div>
        </div>

        {/* OPEN INVITATION BUTTON Floating near bottom */}
        <div className="relative z-30 mb-6 sm:mb-10">
          <button
            onClick={() => {
              setIsOpened(true);
              if (audioRef.current && musicUrl) {
                audioRef.current.play().catch(console.error);
              }
            }}
            className="group relative overflow-hidden bg-[#132B36] hover:bg-[#0C1D25] text-amber-300 font-bold tracking-widest uppercase text-xs sm:text-sm px-10 py-4 rounded-full shadow-2xl transition-all hover:scale-105 active:scale-95 border-2 border-amber-300/60 cursor-pointer mx-auto"
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
        {sections.filter((s: any) => s.visible).map((s: any) => sectionMap[s.id])}
      </div>

      {/* Footer */}
      <footer className="py-12 relative z-10 text-center bg-[#0C1D25] text-white rounded-t-[2.5rem] w-full max-w-4xl mx-auto mt-16 border-t-2 border-amber-400/30">
        <h2 className="text-3xl font-script mb-2 text-amber-300" style={{ fontFamily: "'Great Vibes', cursive" }}>{coupleNamesStr}</h2>
        <p className="text-teal-200/70 text-xs tracking-widest uppercase mb-2 font-serif">Made with love by Jaalam</p>
      </footer>

    </div>
  );
}
