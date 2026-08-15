import React, { useState, useEffect } from 'react';
import { Calendar, MapPin } from 'lucide-react';
import type { WeddingLayoutProps } from './types';

export default function SouthIndianLayout({ content, website }: WeddingLayoutProps) {
  const [isOpened, setIsOpened] = useState(false);

  const coupleNamesStr = content?.hero_title || 'Mahesh & Namrata';
  const nameParts = coupleNamesStr.split(/&| and /i);
  const groomName = nameParts[0]?.trim() || 'Mahesh';
  const brideName = nameParts[1]?.trim() || 'Namrata';

  const date = content?.settings_json?.wedding?.date || content?.date || '25/11/24';
  const location = content?.contact_info?.address || content?.venue?.address || content?.venue?.name || content?.settings_json?.wedding?.venue || "Grand Venue, City";
  const venue = location;

  const groomParents = content?.settings_json?.wedding?.groomParents || 'Father & Mother';
  const brideParents = content?.settings_json?.wedding?.brideParents || 'Father & Mother';
  const quote = content?.settings_json?.wedding?.quote || content?.quote || 'Two hearts united in love, starting a beautiful journey together.';

  const coupleImage = content?.hero?.image || "/media/south_indian_couple.png";

  const rawSchedule = content?.settings_json?.wedding?.schedule;
  const schedule = (Array.isArray(rawSchedule) && rawSchedule.length > 0)
    ? rawSchedule
    : [
        { time: "9:00 AM Onwards", event: "Muhurtham", date: date, venue: location },
        { time: "7:00 PM Onwards", event: "Reception", date: date, venue: location }
      ];

  const groomPhoto = content?.settings_json?.wedding?.groomPhoto;
  const bridePhoto = content?.settings_json?.wedding?.bridePhoto;
  const mapUrl = content?.settings_json?.wedding?.mapUrl || content?.venue?.mapUrl || "";
  const contactNumbers = content?.settings_json?.wedding?.contactNumbers || "";

  const gallery = content?.settings_json?.wedding?.gallery || [];
  const validGallery = Array.isArray(gallery) ? gallery.filter((url: string) => url && url.trim() !== "") : [];

  const story = content?.about_text || "We met at a coffee shop and found a love that lasts forever. Join us as we celebrate our journey together.";
  const storyTitle = content?.about_title || content?.settings_json?.wedding?.story_title || "Our Story";

  const countdownDate = content?.settings_json?.wedding?.countdownDate || "2026-03-15T09:00";
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
      <section key="hero" className="relative w-full min-h-screen flex flex-col items-center justify-between overflow-hidden bg-[#FDF9EE] text-center pt-20 sm:pt-24 pb-12">
        {/* Full Edge-to-Edge Temple Arch Graphic */}
        <div className="absolute inset-0 w-full h-full pointer-events-none z-0">
          <img src="/media/south_indian_arch.png" alt="Arch Decoration" className="w-full h-full object-cover object-top opacity-90 mix-blend-multiply" />
        </div>

        {/* Text Content - Positioned below marigold garlands */}
        <div className="relative z-10 max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg mx-auto text-center px-4 mt-32 sm:mt-44 md:mt-56 lg:mt-72 xl:mt-80">

          <p className="text-rose-900 font-bold mb-3 tracking-widest text-xs sm:text-sm" style={{ fontFamily: "'Playfair Display', serif" }}>
            || ॐ गणपतये नमः ||
          </p>

          {quote && (
            <p className="text-rose-900 text-[11px] sm:text-xs md:text-sm italic font-serif leading-relaxed mb-4 px-2 opacity-90">
              "{quote}"
            </p>
          )}

          <div className="flex flex-col sm:flex-row items-center justify-center sm:gap-2 mb-3">
            <h1 className="text-4xl sm:text-5xl font-script text-orange-500 font-bold whitespace-nowrap drop-shadow-sm" style={{ fontFamily: "'Great Vibes', cursive" }}>
              {groomName}
            </h1>
            <span className="text-rose-900 font-medium text-xs italic my-0.5 sm:mt-2 block sm:inline" style={{ fontFamily: "'Playfair Display', serif" }}>with</span>
            <h1 className="text-4xl sm:text-5xl font-script text-orange-500 font-bold whitespace-nowrap drop-shadow-sm" style={{ fontFamily: "'Great Vibes', cursive" }}>
              {brideName}
            </h1>
          </div>

          <p className="text-rose-900 text-base sm:text-xl font-bold mb-1 tracking-wider" style={{ fontFamily: "'Playfair Display', serif" }}>
            {date}
          </p>

          <p className="text-rose-800 text-[11px] sm:text-xs font-medium italic opacity-90 max-w-xs mx-auto" style={{ fontFamily: "'Playfair Display', serif" }}>
            {venue}
          </p>

        </div>

        {/* Couple Illustration at bottom */}
        <div className="relative w-full flex justify-center pointer-events-none z-10 mt-auto pt-4">
          <img
            src={coupleImage}
            alt="Couple Illustration"
            className="w-full max-w-[260px] sm:max-w-xs md:max-w-sm h-auto object-contain object-bottom mix-blend-multiply"
            onError={(e) => {
              (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1583939000185-1bf2df2cbf54?auto=format&fit=crop&w=800&q=80';
            }}
          />
        </div>
      </section>
    ),
    about: (
      <section key="about" className="py-20 px-6 relative z-10 max-w-4xl mx-auto">
        <div className="text-center">
          <h2 className="text-4xl font-bold text-red-800 mb-10" style={{ fontFamily: "'Playfair Display', serif" }}>Family Details</h2>
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div className="bg-white/80 p-8 rounded-2xl shadow-md border-2 border-amber-100 flex flex-col items-center">
              {groomPhoto && (
                <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-amber-200 mb-4">
                  <img src={groomPhoto} alt={groomName} className="w-full h-full object-cover" />
                </div>
              )}
              <h3 className="text-3xl font-bold text-orange-600 mb-2" style={{ fontFamily: "'Playfair Display', serif" }}>{groomName}</h3>
              <p className="text-sm text-amber-700 uppercase tracking-widest mb-1">Son of</p>
              <p className="text-md font-medium text-amber-900">{groomParents}</p>
            </div>
            <div className="bg-white/80 p-8 rounded-2xl shadow-md border-2 border-amber-100 flex flex-col items-center">
              {bridePhoto && (
                <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-amber-200 mb-4">
                  <img src={bridePhoto} alt={brideName} className="w-full h-full object-cover" />
                </div>
              )}
              <h3 className="text-3xl font-bold text-orange-600 mb-2" style={{ fontFamily: "'Playfair Display', serif" }}>{brideName}</h3>
              <p className="text-sm text-amber-700 uppercase tracking-widest mb-1">Daughter of</p>
              <p className="text-md font-medium text-amber-900">{brideParents}</p>
            </div>
          </div>
        </div>
      </section>
    ),
    story: (
      <section key="story" className="py-20 px-6 relative z-10 text-center max-w-4xl mx-auto">
        <div className="max-w-2xl mx-auto bg-white/80 backdrop-blur rounded-3xl p-10 shadow-md border-2 border-amber-100">
          <h2 className="text-3xl md:text-4xl font-bold text-red-800 mb-6" style={{ fontFamily: "'Playfair Display', serif" }}>
            {storyTitle}
          </h2>
          <p className="text-lg text-amber-900 font-medium italic leading-relaxed">
            "{story}"
          </p>
        </div>
      </section>
    ),
    schedule: (
      <section key="schedule" className="py-20 px-6 relative z-10 text-center max-w-4xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold text-red-800 mb-10" style={{ fontFamily: "'Playfair Display', serif" }}>Schedule & Events</h2>
        <div className="grid md:grid-cols-2 gap-8">
          {schedule.map((item: any, idx: number) => (
            <div key={idx} className="bg-white/80 backdrop-blur border-2 border-amber-100 rounded-2xl p-8 shadow-md">
              <h3 className="text-2xl font-bold text-orange-600 mb-4" style={{ fontFamily: "'Playfair Display', serif" }}>{item.event}</h3>
              <div className="flex items-center justify-center gap-2 mb-2 text-amber-800">
                <Calendar className="w-5 h-5 text-red-700" />
                <span className="font-semibold">{item.date}</span>
              </div>
              <p className="text-amber-700 font-medium">{item.time}</p>
              <p className="text-amber-600 text-sm mt-2">{item.venue}</p>
            </div>
          ))}
        </div>
      </section>
    ),
    venue: (
      <section key="venue" className="py-20 px-6 relative z-10 max-w-4xl mx-auto">
        <div className="bg-gradient-to-br from-amber-100/50 to-orange-50 rounded-3xl p-8 sm:p-10 text-center shadow-lg border border-amber-200 relative overflow-hidden">
          <div className="relative z-10">
            <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm text-red-700">
              <MapPin className="w-8 h-8" />
            </div>
            <h3 className="text-3xl font-bold text-red-800 mb-4" style={{ fontFamily: "'Playfair Display', serif" }}>Venue & Map</h3>
            <p className="text-xl font-medium text-amber-900 mb-2">{location}</p>
            <p className="text-md text-amber-700 max-w-md mx-auto mb-6">Join us to celebrate our joyous occasion.</p>

            {/* Google Maps Embed Iframe */}
            <div className="w-full aspect-video md:aspect-[21/9] rounded-2xl overflow-hidden shadow-inner border border-amber-200/80 mb-6 bg-white">
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

            <a
              href={mapUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block bg-red-700 text-white px-8 py-3 rounded-full font-bold tracking-wide hover:bg-red-800 transition-colors shadow-md text-sm mb-6"
            >
              Get Directions
            </a>

            {contactNumbers && contactNumbers.trim() !== "" && (
              <div className="border-t border-amber-200/80 pt-6 mt-2">
                <p className="text-[10px] tracking-widest uppercase font-bold text-amber-800 mb-1">RSVP / Contact Numbers</p>
                <p className="text-base sm:text-lg font-bold text-amber-950">{contactNumbers}</p>
              </div>
            )}
          </div>
        </div>
      </section>
    ),
    gallery: validGallery.length > 0 ? (
      <section key="gallery" className="py-20 px-6 relative z-10 text-center max-w-4xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold text-red-800 mb-10" style={{ fontFamily: "'Playfair Display', serif" }}>Gallery</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {validGallery.map((url: string, index: number) => (
            <div key={index} className="aspect-square rounded-3xl overflow-hidden shadow-md">
              <img src={url} alt={`Gallery ${index}`} className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" />
            </div>
          ))}
        </div>
      </section>
    ) : null,
    countdown: (
      <section key="countdown" className="py-16 px-6 relative z-10 bg-red-900 text-white rounded-[2.5rem] mx-4 max-w-4xl md:mx-auto shadow-2xl overflow-hidden my-6 text-center">
        <div className="max-w-3xl mx-auto relative z-10">
          <h2 className="text-2xl md:text-3xl font-bold mb-2 text-amber-300" style={{ fontFamily: "'Playfair Display', serif" }}>Counting Down To</h2>
          <p className="text-lg italic mb-8 text-rose-200" style={{ fontFamily: "'Playfair Display', serif" }}>Our Special Day</p>

          <div className="flex gap-3 sm:gap-6 justify-center">
            {[
              { label: 'Days', value: timeLeft?.d ?? 30 },
              { label: 'Hours', value: timeLeft?.h ?? 12 },
              { label: 'Mins', value: timeLeft?.m ?? 45 },
              { label: 'Secs', value: timeLeft?.s ?? 0 }
            ].map((item, idx) => (
              <div key={idx} className="flex flex-col items-center">
                <div className="w-14 h-14 sm:w-20 sm:h-20 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center mb-2 shadow-inner border border-white/20">
                  <span className="text-xl sm:text-3xl font-bold text-white" style={{ fontFamily: "'Playfair Display', serif" }}>{item.value}</span>
                </div>
                <span className="text-[10px] sm:text-xs tracking-widest uppercase font-bold text-amber-200">{item.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>
    ),
    rsvp: (
      <section key="rsvp" className="py-16 px-6 relative z-10 max-w-2xl mx-auto">
        <div className="text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-red-800 mb-3" style={{ fontFamily: "'Playfair Display', serif" }}>Will You Join Us?</h2>
          <p className="text-amber-800 mb-8 tracking-widest uppercase text-xs font-semibold">Please let us know if you can make it</p>

          <div className="bg-white/90 backdrop-blur rounded-[2rem] p-8 md:p-10 shadow-xl border-2 border-amber-100 text-left">
            <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
              <div className="space-y-5">
                <div>
                  <label className="block text-xs font-bold tracking-widest uppercase text-amber-900 mb-2">Name</label>
                  <input type="text" className="w-full bg-amber-50/50 border border-amber-200 rounded-xl px-4 py-3 outline-none focus:border-red-700 transition-all font-serif" placeholder="Your Name" />
                </div>

                <div>
                  <label className="block text-xs font-bold tracking-widest uppercase text-amber-900 mb-2">Message / Warm Wishes</label>
                  <textarea rows={4} className="w-full bg-amber-50/50 border border-amber-200 rounded-xl px-4 py-3 outline-none focus:border-red-700 transition-all font-serif resize-none" placeholder="Your wishes for the couple..."></textarea>
                </div>

                <div>
                  <label className="block text-xs font-bold tracking-widest uppercase text-amber-900 mb-3">Will you be attending?</label>
                  <div className="flex flex-col sm:flex-row gap-4">
                    <label className="flex items-center gap-3 cursor-pointer p-4 border border-amber-200 hover:border-red-700 bg-amber-50/30 rounded-xl flex-1 transition-colors">
                      <input type="radio" name="attending" className="w-4 h-4 accent-red-700" />
                      <span className="text-amber-950 font-bold uppercase tracking-widest text-xs">Joyfully Accepts</span>
                    </label>
                    <label className="flex items-center gap-3 cursor-pointer p-4 border border-amber-200 hover:border-red-700 bg-amber-50/30 rounded-xl flex-1 transition-colors">
                      <input type="radio" name="attending" className="w-4 h-4 accent-red-700" />
                      <span className="text-amber-950 font-bold uppercase tracking-widest text-xs">Declines</span>
                    </label>
                  </div>
                </div>
              </div>

              <div className="pt-4 text-center">
                <button type="button" className="w-full sm:w-auto bg-red-700 hover:bg-red-800 text-white font-bold tracking-widest uppercase text-xs px-10 py-4 rounded-full shadow-lg transition-colors">
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
    <div className="min-h-screen bg-[#FDF9EE] relative font-sans flex flex-col items-center overflow-hidden w-full">

      {/* Welcome Screen / Envelope Overlay */}
      <div className={`fixed inset-0 z-[100] flex flex-col items-center justify-center bg-[#FDF9EE] transition-transform duration-1000 ease-[cubic-bezier(0.7,0,0.3,1)] ${isOpened ? '-translate-y-full' : 'translate-y-0'}`}>

        {/* Arch / Decor Background */}
        <div className="absolute inset-0 w-full h-full pointer-events-none z-0">
          <img src="/media/south_indian_arch.png" alt="Arch Decoration" className="w-full h-full object-cover object-top opacity-90 mix-blend-multiply" />
        </div>

        <div className="relative z-10 text-center px-8 sm:px-12 py-10 mt-40 sm:mt-52 md:mt-64 flex flex-col items-center justify-center w-full max-w-lg mx-auto">
          <p className="text-rose-900 font-bold mb-6 tracking-[0.2em] text-sm md:text-base animate-pulse" style={{ fontFamily: "'Playfair Display', serif" }}>
            || ॐ गणपतये नमः ||
          </p>

          <p className="text-rose-900 text-xs md:text-sm font-semibold uppercase mb-6 tracking-widest opacity-90" style={{ fontFamily: "'Playfair Display', serif" }}>
            You are invited to the wedding of
          </p>

          <h1 className="text-5xl md:text-7xl font-script text-orange-500 font-bold mb-10 drop-shadow-sm whitespace-nowrap" style={{ fontFamily: "'Great Vibes', cursive" }}>
            {coupleNamesStr}
          </h1>

          <button
            onClick={() => setIsOpened(true)}
            className="group relative overflow-hidden bg-rose-900 hover:bg-rose-950 text-white font-bold tracking-widest uppercase text-xs md:text-sm px-10 py-3 md:px-12 md:py-4 rounded-full shadow-lg transition-all hover:scale-105 active:scale-95 z-20 border border-rose-950/50 flex-shrink-0"
          >
            <span className="relative z-10 flex items-center gap-2">
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
      <footer className="py-12 relative z-10 text-center bg-red-950 text-white rounded-t-[2.5rem] w-full max-w-4xl mx-auto mt-16">
        <h2 className="text-2xl font-script mb-2 text-amber-300" style={{ fontFamily: "'Great Vibes', cursive" }}>{coupleNamesStr}</h2>
        <p className="text-amber-200/70 text-xs tracking-widest uppercase mb-2">Made with love by Jaalam</p>
      </footer>

    </div>
  );
}
