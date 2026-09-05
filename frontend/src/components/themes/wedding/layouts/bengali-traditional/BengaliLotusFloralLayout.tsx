import React, { useState, useEffect, useRef } from 'react';
import { Heart, Calendar, MapPin, Clock, Music, Gift, Sparkles, Send, Volume2, VolumeX, Navigation } from 'lucide-react';
import type { WeddingLayoutProps } from '../types';
import { triggerConfettiPopper } from '../../../../../utils/confettiPopper';

export default function BengaliLotusFloralLayout({ content, website, colors }: WeddingLayoutProps) {
  const [isOpening, setIsOpening] = useState(false);
  const [isOpened, setIsOpened] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  // Global Live Multi-Click Heart Wish State
  const initialCountFromProp = content?.settings_json?.wedding?.wish_count || 48;
  const [wishCount, setWishCount] = useState<number>(initialCountFromProp);
  const [isCounterPopping, setIsCounterPopping] = useState(false);
  const [pulseRing, setPulseRing] = useState(false);

  // Poll global wish count every 4s for real-time live sync
  useEffect(() => {
    if (!website?.slug) return;
    const fetchGlobalWishes = async () => {
      try {
        const res = await fetch(`/api/websites/${website.slug}/wish/`);
        if (res.ok) {
          const data = await res.json();
          if (typeof data.wish_count === 'number') {
            setWishCount(data.wish_count);
          }
        }
      } catch (err) {
        // Silent fallback
      }
    };

    fetchGlobalWishes();
    const interval = setInterval(fetchGlobalWishes, 4000);
    return () => clearInterval(interval);
  }, [website?.slug]);

  const handleTapWish = async (e?: React.MouseEvent) => {
    const newCount = wishCount + 1;
    setWishCount(newCount);

    setIsCounterPopping(true);
    setPulseRing(true);
    setTimeout(() => setIsCounterPopping(false), 300);
    setTimeout(() => setPulseRing(false), 600);

    triggerConfettiPopper(e);

    if (website?.slug) {
      try {
        await fetch(`/api/websites/${website.slug}/wish/`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ increment: 1 })
        });
      } catch (err) {
        // Silent catch
      }
    }
  };

  const handleOpen = () => {
    if (isOpening || isOpened) return;
    setIsOpening(true);
    if (audioRef.current && musicUrl) {
      audioRef.current.play().catch(console.error);
    }
    setTimeout(() => {
      setIsOpened(true);
    }, 1200);
  };

  const rawCoupleNames = content?.hero_title || "Priyanka & Anirban";
  const parts = rawCoupleNames.split(/\s*&\s*|\s+and\s+/i);
  const groomFullName = (parts[0]?.trim() || "Priyanka").toUpperCase();
  const brideFullName = (parts[1]?.trim() || "Anirban").toUpperCase();

  const groomWords = groomFullName.split(/\s+/);
  const brideWords = brideFullName.split(/\s+/);

  const story = content?.about_text || "Like a lotus blooming in the morning sun, our love has blossomed. We invite you to share our joy as we begin our new life together.";
  const storyTitle = content?.about_title || content?.settings_json?.wedding?.story_title || "Our Journey";

  const rawDateStr = content?.settings_json?.wedding?.date || content?.date || "Sunday, February 14, 2027";
  const dateObj = new Date(rawDateStr);
  const isDateValid = !isNaN(dateObj.getTime());

  const monthStr = content?.settings_json?.wedding?.dateMonth || (isDateValid ? dateObj.toLocaleString('en-US', { month: 'long' }).toUpperCase() : 'FEBRUARY');
  const dayNum = content?.settings_json?.wedding?.dateDay || (isDateValid ? String(dateObj.getDate()) : '14');
  const dayName = content?.settings_json?.wedding?.dateWeekday || (isDateValid ? dateObj.toLocaleString('en-US', { weekday: 'long' }).toUpperCase() : 'SUNDAY');
  const yearStr = content?.settings_json?.wedding?.dateYear || (isDateValid ? String(dateObj.getFullYear()) : '2027');
  const timeStr = content?.settings_json?.wedding?.time || content?.time || '5:00 PM';

  const location = content?.contact_info?.address || content?.venue?.address || content?.venue?.name || content?.settings_json?.wedding?.venue || "The Vedic Village, Kolkata";

  const rawSchedule = content?.settings_json?.wedding?.schedule;
  const schedule = (Array.isArray(rawSchedule) && rawSchedule.length > 0)
    ? rawSchedule
    : [
      { time: "10:00 AM", event: "Gaye Holud & Mehendi", date: rawDateStr, venue: location },
      { time: "5:00 PM", event: "Wedding Ceremony (Biye)", date: rawDateStr, venue: location },
      { time: "8:00 PM", event: "Grand Reception", date: rawDateStr, venue: location }
    ];

  const groomParents = content?.settings_json?.wedding?.groomParents || "Mr. & Mrs. Das";
  const brideParents = content?.settings_json?.wedding?.brideParents || "Mr. & Mrs. Sengupta";

  const groomPhoto = content?.settings_json?.wedding?.groomPhoto;
  const bridePhoto = content?.settings_json?.wedding?.bridePhoto;
  const mapUrl = content?.settings_json?.wedding?.mapUrl || content?.venue?.mapUrl || "";
  const venuePhoto = content?.settings_json?.wedding?.venuePhoto || content?.venue?.image || "";
  const contactNumbers = content?.settings_json?.wedding?.contactNumbers || "RSVP: 123-456-7890";

  const gallery = content?.settings_json?.wedding?.gallery || [];
  const validGallery = Array.isArray(gallery) ? gallery.filter((url: string) => url && url.trim() !== "") : [];

  const registryUrl = content?.settings_json?.wedding?.registryUrl || "";
  const registryMessage = content?.settings_json?.wedding?.registryMessage || "Your presence and blessings are the most wonderful gifts we could ask for. If you wish to give a gift, please consider our registry.";

  const countdownDate = content?.settings_json?.wedding?.countdownDate || "2027-02-14T17:00";
  const musicUrl = content?.settings_json?.wedding?.musicUrl || "";

  const quoteText = content?.quote || content?.hero_subtitle || content?.tagline || content?.settings_json?.wedding?.quote || "WITH JOYFUL HEARTS, WE INVITE YOU TO OUR WEDDING";

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
    { id: 'about', label: 'Key People & Family', visible: true },
    { id: 'story', label: 'Our Story', visible: true },
    { id: 'schedule', label: 'Schedule', visible: true },
    { id: 'venue', label: 'Venue & Map', visible: true },
    { id: 'gallery', label: 'Gallery', visible: true },
    { id: 'countdown', label: 'Countdown', visible: true },
    { id: 'wishes', label: 'Wishes & Blessings', visible: true },
    { id: 'registry', label: 'Registry', visible: true },
    { id: 'rsvp', label: 'RSVP', visible: true }
  ];

  let rawSections = content?.settings_json?.wedding?.sections || defaultSections;
  if (!rawSections.some((s: any) => s.id === 'wishes')) {
    const rsvpIdx = rawSections.findIndex((s: any) => s.id === 'rsvp');
    if (rsvpIdx !== -1) {
      rawSections = [
        ...rawSections.slice(0, rsvpIdx),
        { id: 'wishes', label: 'Wishes & Blessings', visible: true },
        ...rawSections.slice(rsvpIdx)
      ];
    } else {
      rawSections = [...rawSections, { id: 'wishes', label: 'Wishes & Blessings', visible: true }];
    }
  }
  const sections = rawSections;

  const sectionMap: Record<string, React.ReactNode> = {
    hero: (
      <section
        key="hero"
        className="relative w-full flex flex-col justify-center items-center text-center bg-[#FDF2F8] text-[#064E3B] p-0 overflow-hidden py-16 sm:py-20 min-h-[95vh]"
      >
        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;0,700;1,400;1,600&family=Montserrat:wght@300;400;500;600&family=Pinyon+Script&display=swap');
          .font-cormorant { font-family: 'Cormorant Garamond', serif; }
          .font-montserrat { font-family: 'Montserrat', sans-serif; }
          .font-pinyon { font-family: 'Pinyon Script', cursive; }
          
          .lotus-bg {
            background-image: url('https://images.unsplash.com/photo-1596706990425-a131b7829774?q=80&w=2070&auto=format&fit=crop');
            background-size: cover;
            background-position: center;
          }
          
          .scalloped-edge {
            mask-image: radial-gradient(circle at 10px 10px, transparent 10px, black 11px);
            mask-size: 20px 20px;
            mask-position: -10px -10px;
          }
        `}</style>
        
        {/* Soft Watercolor Lotus Background */}
        <div className="absolute inset-0 lotus-bg opacity-[0.08]" />
        
        {/* Soft Gradients */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#FDF2F8]/90 via-[#FDF2F8]/70 to-[#FDF2F8]/95 pointer-events-none" />
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#FCE7F3] rounded-full blur-[100px] opacity-70" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#D1FAE5] rounded-full blur-[100px] opacity-50" />

        {/* Hero Card Content */}
        <div className="relative z-30 max-w-lg mx-auto flex flex-col items-center px-6 py-12 bg-white/60 backdrop-blur-sm rounded-[2rem] border border-[#FBCFE8] shadow-[0_20px_50px_-12px_rgba(251,207,232,0.5)]">
          
          <div className="mb-6 flex items-center justify-center gap-3">
             <div className="h-[1px] w-12 bg-gradient-to-r from-transparent to-[#B76E79]" />
             <Sparkles className="w-4 h-4 text-[#B76E79]" />
             <div className="h-[1px] w-12 bg-gradient-to-l from-transparent to-[#B76E79]" />
          </div>

          <p className="text-[#064E3B] text-[9px] sm:text-[10px] font-semibold tracking-[0.4em] uppercase mb-8 font-montserrat opacity-80">
            TOGETHER WITH THEIR FAMILIES
          </p>

          <div className="flex flex-col items-center leading-none">
             <h1 className="text-5xl sm:text-7xl font-semibold font-cormorant tracking-widest text-[#064E3B] uppercase mb-2">
                {groomFullName}
             </h1>
          </div>

          <span className="text-4xl sm:text-5xl text-[#B76E79] font-pinyon my-4 opacity-90">
            and
          </span>

          <div className="flex flex-col items-center leading-none">
             <h1 className="text-5xl sm:text-7xl font-semibold font-cormorant tracking-widest text-[#064E3B] uppercase mt-2">
                {brideFullName}
             </h1>
          </div>

          <div className="my-10 text-center text-[#064E3B] font-montserrat text-[9px] sm:text-[10px] tracking-[0.25em] uppercase leading-relaxed max-w-xs opacity-70 font-medium">
            {quoteText}
          </div>

          {/* Minimalist Date Block */}
          <div className="flex flex-col items-center gap-2 border-y border-[#FBCFE8] py-6 w-full mb-6">
             <span className="text-[#B76E79] font-montserrat font-bold tracking-[0.2em] text-xs uppercase">{monthStr} {yearStr}</span>
             <span className="text-5xl sm:text-6xl font-cormorant text-[#064E3B]">{dayNum}</span>
             <span className="text-[#B76E79] font-montserrat font-bold tracking-[0.2em] text-[10px] uppercase">{dayName} | {timeStr}</span>
          </div>

          <span className="font-semibold text-[#064E3B] font-montserrat tracking-[0.1em] text-xs uppercase opacity-80 mt-2">{location}</span>

        </div>
      </section>
    ),
    about: (
      <section key="about" className="py-20 sm:py-28 px-4 sm:px-6 relative z-10 text-center max-w-5xl mx-auto bg-[#FDF2F8] text-[#064E3B]">
        <div className="flex flex-col items-center mb-16">
           <div className="text-[#B76E79] text-xs font-montserrat italic mb-4 opacity-80">The Families</div>
           <h2 className="text-3xl sm:text-5xl font-semibold text-[#064E3B] tracking-wider font-cormorant uppercase">Key People</h2>
        </div>

        <div className="grid md:grid-cols-2 gap-10 lg:gap-16 relative z-20">
          {/* Groom Card */}
          <div className="bg-white p-10 rounded-t-full rounded-b-[3rem] border border-[#FCE7F3] shadow-lg flex flex-col items-center hover:-translate-y-2 hover:shadow-2xl hover:border-[#FBCFE8] transition-all duration-500">
            {groomPhoto ? (
              <div className="w-36 h-36 sm:w-44 sm:h-44 rounded-full overflow-hidden border-4 border-[#FDF2F8] shadow-md mb-8">
                <img src={groomPhoto} alt="Groom" className="w-full h-full object-cover" />
              </div>
            ) : (
              <div className="w-36 h-36 sm:w-44 sm:h-44 rounded-full bg-[#FDF2F8] border-2 border-[#FCE7F3] flex items-center justify-center mb-8 text-[#B76E79]">
                <span className="text-6xl font-cormorant font-semibold">{groomFullName.charAt(0)}</span>
              </div>
            )}
            <h3 className="text-2xl sm:text-3xl font-semibold text-[#064E3B] mb-2 font-cormorant tracking-wide uppercase">{groomFullName}</h3>
            <p className="text-[10px] text-[#B76E79] font-semibold uppercase tracking-[0.25em] mb-4 font-montserrat">The Groom</p>
            {groomParents && <p className="text-sm text-[#064E3B]/70 font-cormorant italic">Son of {groomParents}</p>}
          </div>

          {/* Bride Card */}
          <div className="bg-white p-10 rounded-t-full rounded-b-[3rem] border border-[#FCE7F3] shadow-lg flex flex-col items-center hover:-translate-y-2 hover:shadow-2xl hover:border-[#FBCFE8] transition-all duration-500">
            {bridePhoto ? (
              <div className="w-36 h-36 sm:w-44 sm:h-44 rounded-full overflow-hidden border-4 border-[#FDF2F8] shadow-md mb-8">
                <img src={bridePhoto} alt="Bride" className="w-full h-full object-cover" />
              </div>
            ) : (
              <div className="w-36 h-36 sm:w-44 sm:h-44 rounded-full bg-[#FDF2F8] border-2 border-[#FCE7F3] flex items-center justify-center mb-8 text-[#B76E79]">
                <span className="text-6xl font-cormorant font-semibold">{brideFullName.charAt(0)}</span>
              </div>
            )}
            <h3 className="text-2xl sm:text-3xl font-semibold text-[#064E3B] mb-2 font-cormorant tracking-wide uppercase">{brideFullName}</h3>
            <p className="text-[10px] text-[#B76E79] font-semibold uppercase tracking-[0.25em] mb-4 font-montserrat">The Bride</p>
            {brideParents && <p className="text-sm text-[#064E3B]/70 font-cormorant italic">Daughter of {brideParents}</p>}
          </div>
        </div>
      </section>
    ),
    story: (
      <section key="story" className="py-20 sm:py-28 px-4 sm:px-6 relative z-10 text-center bg-white text-[#064E3B] border-y border-[#FCE7F3]">
        <div className="max-w-3xl mx-auto flex flex-col items-center">
           <Heart className="w-8 h-8 text-[#B76E79] mb-8 animate-pulse" />
           <h2 className="text-3xl sm:text-5xl font-semibold text-[#064E3B] mb-10 font-cormorant tracking-widest uppercase">
             {storyTitle}
           </h2>
           <p className="text-lg sm:text-2xl text-[#064E3B]/80 italic leading-loose font-cormorant px-4">
             "{story}"
           </p>
        </div>
      </section>
    ),
    schedule: (
      <section key="schedule" className="py-20 sm:py-28 px-4 sm:px-6 relative z-10 text-center max-w-5xl mx-auto bg-[#FDF2F8] text-[#064E3B]">
        <div className="flex flex-col items-center mb-16">
          <div className="text-[#B76E79] text-xs font-montserrat italic mb-4 opacity-80">Celebrations</div>
          <h2 className="text-3xl sm:text-5xl font-semibold text-[#064E3B] font-cormorant tracking-widest uppercase">Itinerary</h2>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {schedule.map((item: any, idx: number) => (
            <div key={idx} className="bg-white rounded-[2rem] p-10 shadow-sm border border-[#FCE7F3] flex flex-col items-center text-center hover:-translate-y-2 hover:shadow-xl hover:border-[#FBCFE8] transition-all duration-300">
              <Clock className="w-8 h-8 text-[#B76E79] mb-4" />
              <div className="text-[#B76E79] font-bold font-montserrat tracking-[0.15em] text-xs mb-4 uppercase">
                 {item.time}
              </div>
              <h3 className="text-xl font-semibold text-[#064E3B] mb-3 font-cormorant uppercase tracking-wider">{item.event}</h3>
              <p className="text-[#064E3B]/60 text-sm font-cormorant italic">{item.venue || location}</p>
            </div>
          ))}
        </div>
      </section>
    ),
    venue: (
      <section key="venue" className="py-20 sm:py-28 px-4 sm:px-6 relative z-10 max-w-5xl mx-auto bg-[#FDF2F8] text-[#064E3B]">
        <div className="bg-white rounded-[3rem] p-10 sm:p-16 text-center shadow-lg border border-[#FCE7F3] relative overflow-hidden">
          <div className="relative z-20">
            <div className="w-16 h-16 bg-[#FDF2F8] rounded-full flex items-center justify-center mx-auto mb-8 shadow-sm border border-[#FCE7F3] text-[#B76E79]">
              <MapPin className="w-7 h-7" />
            </div>
            <h3 className="text-3xl sm:text-5xl font-semibold text-[#064E3B] mb-4 font-cormorant tracking-widest uppercase">Venue & Location</h3>
            <p className="text-lg font-semibold text-[#B76E79] mb-4 font-montserrat uppercase tracking-wider">{location}</p>
            <p className="text-base text-[#064E3B]/70 max-w-md mx-auto mb-10 font-cormorant italic">We look forward to celebrating our special day with you.</p>

            {venuePhoto && (
              <div className="w-full h-64 sm:h-96 rounded-[2rem] overflow-hidden shadow-md mb-10 relative border-4 border-[#FDF2F8]">
                <img src={venuePhoto} alt="Venue" className="w-full h-full object-cover hover:scale-105 transition-transform duration-700" />
              </div>
            )}

            <div className="w-full aspect-video md:aspect-[21/9] rounded-[2rem] overflow-hidden shadow-inner border-2 border-[#FDF2F8] mb-10 bg-gray-50">
              <iframe
                src={mapUrl && mapUrl.includes('embed') ? mapUrl : `https://maps.google.com/maps?q=${encodeURIComponent(location)}&t=&z=14&ie=UTF8&iwloc=&output=embed`}
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen={true}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="pointer-events-none md:pointer-events-auto filter saturate-50 opacity-90 hover:saturate-100 hover:opacity-100 transition-all duration-500"
              ></iframe>
            </div>

            {mapUrl && (
              <a
                href={mapUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-3 bg-[#064E3B] hover:bg-[#043327] text-white px-8 py-4 rounded-full font-semibold tracking-[0.15em] uppercase transition-all shadow-md text-xs mb-8 hover:-translate-y-1 font-montserrat"
              >
                <Navigation size={16} />
                Get Driving Directions
              </a>
            )}

            {contactNumbers && (
              <div className="border-t border-[#FCE7F3] pt-8 mt-4">
                <p className="text-[9px] tracking-[0.25em] uppercase font-semibold text-[#B76E79] mb-3 font-montserrat">RSVP / Contact Info</p>
                <p className="text-lg sm:text-xl font-semibold text-[#064E3B] font-cormorant">{contactNumbers}</p>
              </div>
            )}
          </div>
        </div>
      </section>
    ),
    gallery: validGallery.length > 0 ? (
      <section key="gallery" className="py-20 sm:py-28 px-4 sm:px-6 relative z-10 text-center max-w-6xl mx-auto bg-white text-[#064E3B] border-y border-[#FCE7F3]">
        <div className="flex flex-col items-center mb-16">
          <div className="text-[#B76E79] text-xs font-montserrat italic mb-4 opacity-80">Memories</div>
          <h2 className="text-3xl sm:text-5xl font-semibold text-[#064E3B] font-cormorant tracking-widest uppercase">Photo Gallery</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {validGallery.map((url: string, index: number) => (
            <div key={index} className="aspect-square rounded-[2rem] overflow-hidden shadow-sm border border-[#FCE7F3] hover:shadow-xl hover:-translate-y-1 transition-all duration-500 relative bg-[#FDF2F8] p-2">
              <div className="w-full h-full rounded-[1.5rem] overflow-hidden">
                 <img src={url} alt={`Gallery ${index}`} className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" />
              </div>
            </div>
          ))}
        </div>
      </section>
    ) : null,
    countdown: (
      <section key="countdown" className="py-20 sm:py-28 px-4 sm:px-6 relative z-10 bg-[#064E3B] text-white my-10 mx-4 sm:mx-8 rounded-[3rem] overflow-hidden shadow-2xl">
        <div className="absolute inset-0 lotus-bg opacity-20 mix-blend-soft-light" />
        <div className="absolute inset-0 bg-gradient-to-b from-[#064E3B]/80 to-[#064E3B]/95 pointer-events-none" />
        
        <div className="max-w-4xl mx-auto relative z-20 text-center">
          <h2 className="text-3xl sm:text-5xl font-semibold mb-4 text-white font-cormorant tracking-widest uppercase">Counting Down</h2>
          <p className="text-sm sm:text-base mb-12 text-[#A7F3D0] font-montserrat tracking-widest uppercase opacity-80">To Our New Beginning</p>

          <div className="flex gap-4 sm:gap-8 justify-center flex-wrap">
            {[
              { label: 'Days', value: timeLeft?.d ?? 30 },
              { label: 'Hours', value: timeLeft?.h ?? 12 },
              { label: 'Mins', value: timeLeft?.m ?? 45 },
              { label: 'Secs', value: timeLeft?.s ?? 0 }
            ].map((item, idx) => (
              <div key={idx} className="flex flex-col items-center">
                <div className="w-20 h-20 sm:w-28 sm:h-28 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center mb-4 shadow-lg border border-white/20">
                  <span className="text-4xl sm:text-5xl font-semibold text-white font-cormorant">{item.value}</span>
                </div>
                <span className="text-[9px] sm:text-[10px] tracking-[0.25em] uppercase font-semibold text-[#A7F3D0] font-montserrat">{item.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>
    ),
    wishes: (
      <section key="wishes" className="py-20 sm:py-28 px-4 sm:px-6 relative z-10 max-w-4xl mx-auto bg-[#FDF2F8] text-[#064E3B]">
        <div className="text-center relative z-20">

          <div className="flex flex-col items-center mb-12">
            <h2 className="text-3xl sm:text-5xl font-semibold text-[#064E3B] font-cormorant tracking-widest uppercase mb-4">Send Blessings</h2>
            <p className="text-[#B76E79] tracking-[0.15em] uppercase text-xs font-semibold font-montserrat">Tap the heart to send warm wishes</p>
          </div>

          <div className="bg-white rounded-[3rem] p-12 md:p-16 shadow-lg border border-[#FCE7F3] relative overflow-hidden flex flex-col items-center justify-center group hover:border-[#FBCFE8] transition-colors">

            {pulseRing && (
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
                <div className="w-64 h-64 rounded-full border border-[#B76E79]/40 animate-ping"></div>
              </div>
            )}

            <button
              type="button"
              onClick={handleTapWish}
              className={`w-32 h-32 rounded-full bg-gradient-to-tr from-[#FCE7F3] to-[#FDF2F8] border-2 border-[#FBCFE8] flex items-center justify-center shadow-md transition-all duration-300 cursor-pointer mb-10 relative z-20 ${pulseRing ? 'scale-110' : 'hover:scale-105 active:scale-95 hover:shadow-xl hover:border-[#B76E79]/50'}`}
              title="Tap to send a wish!"
            >
              <Heart className={`w-14 h-14 fill-[#B76E79] text-[#B76E79] transition-transform duration-300 ${pulseRing ? 'scale-125' : 'group-hover:scale-110'}`} />
            </button>

            <div className="flex flex-col items-center mb-10 relative z-20">
              <span className={`text-6xl sm:text-7xl font-semibold text-[#064E3B] font-cormorant block transition-transform duration-200 ${isCounterPopping ? 'scale-125 text-[#B76E79]' : 'scale-100'}`}>
                {wishCount}
              </span>
              <span className="text-[10px] font-semibold text-[#B76E79] uppercase tracking-[0.25em] font-montserrat mt-3">Wishes Received</span>
            </div>

            <button
              type="button"
              onClick={handleTapWish}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-3 px-12 py-5 rounded-full font-semibold text-[10px] uppercase tracking-[0.2em] bg-[#064E3B] hover:bg-[#043327] text-white shadow-lg transition-all hover:-translate-y-1 active:scale-95 cursor-pointer font-montserrat relative z-20"
            >
              <Sparkles className="w-4 h-4" />
              Tap to Send Wish ❤️
            </button>

          </div>
        </div>
      </section>
    ),
    registry: (
      <section key="registry" className="py-20 sm:py-28 px-4 sm:px-6 relative z-10 max-w-4xl mx-auto bg-white text-[#064E3B] border-y border-[#FCE7F3]">
        <div className="bg-[#FDF2F8] rounded-[3rem] p-12 md:p-16 shadow-sm border border-[#FCE7F3] text-center relative overflow-hidden">
          <Gift size={40} className="text-[#B76E79] mx-auto mb-6" />
          <h2 className="text-3xl sm:text-4xl font-semibold text-[#064E3B] font-cormorant tracking-widest uppercase mb-6">Gift Registry</h2>
          <p className="text-base text-[#064E3B]/70 leading-relaxed max-w-lg mx-auto mb-10 font-cormorant italic">{registryMessage}</p>
          {registryUrl && (
            <a
              href={registryUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 bg-[#B76E79] hover:bg-[#9D5D68] text-white px-10 py-4 rounded-full font-semibold tracking-[0.15em] uppercase text-xs transition-all shadow-md hover:-translate-y-1 cursor-pointer font-montserrat"
            >
              View Gift Registry
            </a>
          )}
        </div>
      </section>
    ),
    rsvp: (
      <section key="rsvp" className="py-20 sm:py-28 px-4 sm:px-6 relative z-10 max-w-4xl mx-auto bg-[#FDF2F8] text-[#064E3B]">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-5xl font-semibold text-[#064E3B] font-cormorant tracking-widest uppercase mb-4">Join Us</h2>
          <p className="text-[#B76E79] tracking-[0.15em] uppercase text-xs font-semibold font-montserrat">Please RSVP</p>
        </div>

        <div className="bg-white rounded-[3rem] p-10 md:p-16 shadow-lg border border-[#FCE7F3] text-left relative overflow-hidden">
          <form className="space-y-8 relative z-20" onSubmit={(e) => e.preventDefault()}>
            <div className="space-y-8">
              <div>
                <label className="block text-[10px] font-semibold tracking-[0.2em] uppercase text-[#B76E79] mb-3 font-montserrat">Name</label>
                <input type="text" className="w-full bg-[#FDF2F8] border border-[#FCE7F3] rounded-2xl px-6 py-4 outline-none focus:border-[#B76E79] transition-all font-cormorant text-xl text-[#064E3B] placeholder-[#B76E79]/50" placeholder="Your Full Name" />
              </div>

              <div>
                <label className="block text-[10px] font-semibold tracking-[0.2em] uppercase text-[#B76E79] mb-3 font-montserrat">Warm Wishes & Message</label>
                <textarea rows={4} className="w-full bg-[#FDF2F8] border border-[#FCE7F3] rounded-2xl px-6 py-4 outline-none focus:border-[#B76E79] transition-all font-cormorant text-xl text-[#064E3B] placeholder-[#B76E79]/50 resize-none" placeholder="Share your warm wishes..."></textarea>
              </div>

              <div>
                <label className="block text-[10px] font-semibold tracking-[0.2em] uppercase text-[#B76E79] mb-4 font-montserrat">Will you be attending?</label>
                <div className="flex flex-col sm:flex-row gap-4">
                  <label className="flex items-center gap-4 cursor-pointer p-6 border border-[#FCE7F3] hover:border-[#B76E79] bg-[#FDF2F8] rounded-2xl flex-1 transition-colors group">
                    <input type="radio" name="attending" className="w-5 h-5 accent-[#B76E79]" />
                    <span className="text-[#064E3B] font-semibold uppercase tracking-[0.15em] text-xs font-montserrat group-hover:text-[#B76E79] transition-colors">Joyfully Accepts</span>
                  </label>
                  <label className="flex items-center gap-4 cursor-pointer p-6 border border-[#FCE7F3] hover:border-[#B76E79] bg-[#FDF2F8] rounded-2xl flex-1 transition-colors group">
                    <input type="radio" name="attending" className="w-5 h-5 accent-[#B76E79]" />
                    <span className="text-[#064E3B] font-semibold uppercase tracking-[0.15em] text-xs font-montserrat group-hover:text-[#B76E79] transition-colors">Regretfully Declines</span>
                  </label>
                </div>
              </div>
            </div>

            <div className="pt-8 text-center">
              <button type="button" className="w-full sm:w-auto inline-flex items-center justify-center gap-3 bg-[#064E3B] hover:bg-[#043327] text-white font-semibold tracking-[0.15em] uppercase text-xs px-12 py-5 rounded-full shadow-md transition-all hover:-translate-y-1 cursor-pointer font-montserrat">
                <Send size={16} />
                Submit RSVP
              </button>
            </div>
          </form>
        </div>
      </section>
    )
  };

  return (
    <div className={`min-h-screen bg-[#FDF2F8] relative flex flex-col items-center overflow-hidden w-full ${!isOpened ? 'max-h-screen overflow-hidden' : ''}`}>

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
          className="fixed bottom-6 right-6 z-50 p-4 rounded-full bg-white text-[#B76E79] shadow-lg border border-[#FCE7F3] hover:scale-110 active:scale-95 transition-all"
        >
          {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
        </button>
      )}

      {/* Welcome Screen: Elegant Lotus Bloom */}
      <div
        onClick={handleOpen}
        className={`fixed inset-0 z-[100] flex items-center justify-center bg-[#FDF2F8] transition-all duration-[1200ms] ease-in-out ${isOpened ? 'opacity-0 scale-110 pointer-events-none' : 'opacity-100'} overflow-hidden cursor-pointer`}
      >
        <div className="absolute inset-0 lotus-bg opacity-[0.15]" />
        
        {/* Soft radial glow */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_transparent_0%,_#FDF2F8_70%)]" />

        {/* Central Lotus Medallion */}
        <div className={`relative z-40 flex flex-col items-center justify-center transition-all duration-[1500ms] ease-[cubic-bezier(0.22,1,0.36,1)] ${isOpening ? 'scale-[2.5] opacity-0 blur-md rotate-12' : 'scale-100 opacity-100'}`}>
          
          <div className="w-80 h-80 sm:w-96 sm:h-96 bg-white/70 backdrop-blur-md rounded-full shadow-[0_20px_50px_-12px_rgba(251,207,232,0.6)] flex flex-col items-center justify-center text-center relative border border-[#FCE7F3] group transition-all">
            
            {/* Inner Ring */}
            <div className={`absolute inset-4 rounded-full border border-[#B76E79]/20 transition-all duration-[2000ms] ${isOpening ? 'scale-150 opacity-0 rotate-180' : 'scale-100'}`} />
            
            <Heart className="w-8 h-8 text-[#B76E79] mb-4 fill-[#B76E79]/20 animate-pulse" />
            
            <span className="text-[10px] text-[#B76E79] font-montserrat font-bold tracking-[0.3em] uppercase mb-4">
              Lotus Blossom
            </span>
            
            <h1 className="text-4xl sm:text-5xl font-semibold text-[#064E3B] font-cormorant tracking-widest uppercase leading-none px-8">
              {groomFullName}
              <span className="block text-[#B76E79] text-3xl my-3 font-pinyon lowercase">&</span>
              {brideFullName}
            </h1>

            <div className="mt-8 text-[9px] text-[#064E3B]/70 uppercase tracking-[0.3em] font-montserrat font-semibold group-hover:text-[#B76E79] transition-colors border-b border-transparent group-hover:border-[#B76E79] pb-1">
               Tap To Bloom
            </div>

          </div>
        </div>
      </div>

      {/* Main Content Sections */}
      <div className="relative z-30 w-full bg-[#FDF2F8]">
        {sections.filter((s: any) => s.visible).map((s: any) => sectionMap[s.id])}
      </div>

      {/* Footer */}
      <footer className="py-16 relative z-10 text-center bg-white text-[#064E3B] w-full border-t border-[#FCE7F3]">
        <h2 className="text-3xl font-cormorant font-semibold mb-4 tracking-widest uppercase">{rawCoupleNames}</h2>
        <p className="text-[#B76E79] text-[9px] tracking-[0.3em] uppercase font-montserrat font-bold">Crafted with love by Jaalam</p>
      </footer>

    </div>
  );
}
