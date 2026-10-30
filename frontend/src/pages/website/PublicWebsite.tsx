import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { Phone, Mail, MapPin, CreditCard } from 'lucide-react';

import { ThemeRenderer } from '../../components/themes/registry';
import { resolveHost } from '../../utils/host';
import { invitationCategories } from '../../utils/templateData';
import useScrollReveal from '../../hooks/useScrollReveal';
import useSmoothScroll from '../../hooks/useSmoothScroll';
import SEOHead from '../../components/seo/SEOHead';
import UPIPaymentModal from '../../components/payments/UPIPaymentModal';
import Chatbot from '../../components/shared/Chatbot';
import { AmbientAfterTap } from '../../components/themes/invitation-modern/ambient';
import FloatingContactButtons from '../../components/shared/FloatingContactButtons';
import LanguageTranslator from '../../components/shared/LanguageTranslator';
import FloatingAddToCalendar from '../../components/shared/AddToCalendar';
import { invitationStyleFor } from '../../components/themes/invitation-modern/routing';
import useHideBranding from '../../hooks/useHideBranding';
import useTextOverrides from '../../hooks/useTextOverrides';
import { SiteContext } from '../../components/themes/shared/siteContext';

import { safeHtml } from '../../utils/safeHtml';
interface PublicWebsiteProps {
  /** Set when the site is opened on its own domain (e.g. mybakery.com). */
  customHost?: string;
  /** Called when customHost is not a connected domain, so the app can fall back. */
  onDomainMissing?: () => void;
}

// Backup copies of live sites in file storage (backend websites/snapshots.py), shown when the
// API is down so customers' websites stay up. Production: the public storage address, e.g.
// VITE_SNAPSHOT_URL=https://media.jaalam.app/snapshots
const SNAPSHOT_URL = ((import.meta.env.VITE_SNAPSHOT_URL as string | undefined) || '/media/snapshots').replace(/\/$/, '');

/** The API couldn't answer at all (down, crashed, unreachable), as opposed to a real "no such site". */
const serverDown = (err: any) => !err.response || err.response.status >= 500
  // Our own 404s are JSON; a host with no server running behind it answers with text or HTML
  || (err.response.status === 404 && (typeof err.response.data !== 'object' || err.response.data === null));

async function loadBackup(kind: 'sites' | 'domains', name: string) {
  try {
    const res = await fetch(`${SNAPSHOT_URL}/${kind}/${encodeURIComponent(name)}.json?t=${Date.now()}`, { cache: 'no-store' });
    if (!res.ok) return null;
    const data = await res.json();
    return data && typeof data === 'object' && data.slug ? data : null;
  } catch {
    return null;  // no copy, or the storage address isn't set (it serves the app's HTML)
  }
}

export default function PublicWebsite({ customHost, onDomainMissing }: PublicWebsiteProps = {}) {
  const { businessSlug: paramSlug } = useParams();
  const hostMode = resolveHost();

  const businessSlug = paramSlug || (hostMode.mode === 'site' ? hostMode.slug : null);
  const [website, setWebsite] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  // Bumped to load the site again while the server is unreachable
  const [attempt, setAttempt] = useState(0);

  useScrollReveal([website?.theme, website?.business_type]);
  useSmoothScroll();
  useHideBranding(website?.show_branding === false);
  // The site's own wording and pictures in place of the theme's, set by clicking them in the editor
  useTextOverrides(website?.content?.settings_json, website?.content);

  useEffect(() => {
    const fetchWebsite = async () => {
      try {
        // Where the visitor came from, for the owner's Analytics page (?src=qr on printed QR codes)
        const visit = { ref: document.referrer || undefined, src: new URLSearchParams(window.location.search).get('src') || undefined };
        const [res] = await Promise.all([
          customHost
            ? axios.get('/api/websites/by-domain/', { params: { host: customHost, ...visit } })
            : axios.get(`/api/websites/${businessSlug}/public/`, { params: visit }),
          new Promise(resolve => setTimeout(resolve, customHost ? 0 : 1500)) // Artificial delay to showcase skeleton
        ]);
        setWebsite(res.data);
        setError('');
      } catch (err: any) {
        if (serverDown(err)) {
          // Show the latest backup copy instead; only the forms wait for the server
          const slug = customHost ? (hostMode.mode === 'custom' ? hostMode.fallbackSlug : null) : businessSlug;
          const backup = (customHost && await loadBackup('domains', customHost)) || (slug && await loadBackup('sites', slug));
          if (backup) {
            setWebsite(backup);
            setError('');
          } else {
            setError('unavailable');
          }
          return;
        }
        if (customHost && err.response?.status === 404 && onDomainMissing) {
          onDomainMissing();
          return;
        }
        console.error(err);
        if (err.response?.status === 403 && err.response?.data?.error === 'paused') {
          setError('paused');
        } else if (err.response && err.response.status === 403) {
          setError('unpublished');
        } else {
          setError('not_found');
        }
      } finally {
        setLoading(false);
      }
    };
    fetchWebsite();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [businessSlug, customHost, attempt]);

  // While the server is unreachable, try again every 30 seconds
  useEffect(() => {
    if (error !== 'unavailable') return;
    const id = window.setInterval(() => setAttempt((n) => n + 1), 30000);
    return () => window.clearInterval(id);
  }, [error]);

  useEffect(() => {
    // Language widget is off unless enabled: drop any leftover translation once the site has loaded
    if (website && website.content?.settings_json?.show_language_widget !== true) {
      if (document.cookie.includes('googtrans')) {
        document.cookie = 'googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
        document.cookie = `googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; domain=${window.location.hostname}; path=/;`;
        window.location.reload();
      }
    }
  }, [website, website?.content?.settings_json?.show_language_widget]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FAF9F6] flex flex-col">
        <div className="h-[80px] bg-slate-900 w-full flex items-center px-6 lg:px-16 justify-between border-b border-slate-800">
          <div className="w-32 h-8 bg-slate-800 rounded-md animate-pulse"></div>
          <div className="hidden lg:flex gap-8">
            <div className="w-20 h-4 bg-slate-800 rounded-full animate-pulse"></div>
            <div className="w-20 h-4 bg-slate-800 rounded-full animate-pulse"></div>
            <div className="w-20 h-4 bg-slate-800 rounded-full animate-pulse"></div>
            <div className="w-20 h-4 bg-slate-800 rounded-full animate-pulse"></div>
          </div>
        </div>
        <div className="flex-1 w-full bg-slate-200 animate-pulse flex flex-col items-center justify-center py-32 relative">
          <div className="absolute inset-0 bg-slate-800/10"></div>
          <div className="flex flex-col items-center gap-8 w-full max-w-3xl px-6 relative z-10">
            <div className="w-1/4 h-3 bg-slate-300 rounded-full"></div>
            <div className="w-full h-16 sm:h-24 bg-slate-300 rounded-2xl"></div>
            <div className="w-3/4 h-16 sm:h-24 bg-slate-300 rounded-2xl"></div>
            <div className="w-2/3 h-6 bg-slate-300 rounded-full mt-4"></div>
            <div className="w-1/2 h-6 bg-slate-300 rounded-full"></div>
            <div className="flex gap-4 mt-8">
              <div className="w-40 h-14 bg-slate-300 rounded-full"></div>
              <div className="w-40 h-14 bg-slate-300 rounded-full"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error === 'unavailable') {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 text-center p-6">
        <div className="bg-white p-10 rounded-[2rem] shadow-xl border border-slate-100 max-w-md w-full">
          <h1 className="text-2xl font-black text-slate-900 mb-2">Be right back</h1>
          <p className="text-slate-500 font-medium">This website is temporarily unavailable. Please try again in a few minutes.</p>
          <button onClick={() => setAttempt((n) => n + 1)} className="mt-6 rounded-xl bg-slate-900 px-6 py-3 font-bold text-white hover:bg-slate-800">
            Try again
          </button>
        </div>
      </div>
    );
  }

  if (error === 'paused') {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 text-center p-6">
        <div className="bg-white p-10 rounded-[2rem] shadow-xl border border-slate-100 max-w-md w-full">
          <h1 className="text-2xl font-black text-slate-900 mb-2">Temporarily unavailable</h1>
          <p className="text-slate-500 font-medium">This website is paused. If it's yours, renew your plan in the Jaalam dashboard to bring it back online.</p>
        </div>
      </div>
    );
  }

  if (error === 'unpublished') {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 text-center p-6">
        <div className="bg-white p-10 rounded-[2rem] shadow-xl border border-slate-100 max-w-md w-full">
          <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-slate-400"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>
          </div>
          <h1 className="text-2xl font-black text-slate-900 mb-2">Site Offline</h1>
          <p className="text-slate-500 font-medium">This website is currently unpublished and not visible to the public.</p>
        </div>
      </div>
    );
  }

  if (error || !website) return <div className="min-h-screen flex items-center justify-center bg-slate-50 text-slate-400 font-bold">Website not found</div>;

  const content = website.content;

  if (content?.contact_info?.address && typeof content.contact_info.address === 'object') {
    const addr = content.contact_info.address;
    content.contact_info.address = Object.values(addr).filter(Boolean).join(', ');
  }

  // Determine theme thumbnail for OG image fallback
  const getThemeThumbnail = (theme: string) => {
    switch (theme) {
      case 'Restaurant': return 'https://images.unsplash.com/photo-1514933651103-005eec06c04b?auto=format&fit=crop&w=1200&q=80';
      case 'Cafe / Bakery': return 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&w=1200&q=80';
      case 'Salon': return 'https://images.unsplash.com/photo-1521590832167-7bfcbaa6362d?auto=format&fit=crop&w=1200&q=80';
      case 'Gym': return 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=1200&q=80';
      case 'Real Estate': return 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=1200&q=80';
      default: return undefined;
    }
  };

  const seoTitle = website?.content?.settings_json?.website_name || `${website?.business_type || 'Website'} - ${website?.slug || 'Live'}`;
  const seoDesc = website?.content?.about_text || `Welcome to our ${website?.business_type || 'business'}.`;

  const renderFallback = () => {
    const contact = content?.contact_info || {};

    return (
      <div className={`min-h-screen ${website.theme === 'Modern' ? 'font-sans' : website.theme === 'Classic' ? 'font-serif' : website.theme === 'Minimal' ? 'font-mono' : 'font-sans'}`}>

        {/* Inject Custom CSS globally for this page view */}
        {content.custom_css && (
          <style dangerouslySetInnerHTML={{ __html: content.custom_css }} />
        )}

        {/* Header */}
        <header className="bg-slate-900 text-white sticky top-0 z-50 shadow-md">
          <div className="container mx-auto px-6 py-4 flex justify-between items-center">
            <div className="text-xl font-bold">{website.slug}</div>
            <nav className="hidden md:flex gap-6 text-sm font-medium">
              <a href="#about" className="hover:text-indigo-400 transition-colors">About</a>
              {content.services_json?.length > 0 && <a href="#services" className="hover:text-indigo-400 transition-colors">Services</a>}
              {content.gallery_json?.length > 0 && <a href="#gallery" className="hover:text-indigo-400 transition-colors">Gallery</a>}
              <a href="#contact" className="hover:text-indigo-400 transition-colors">Contact</a>
            </nav>
          </div>
        </header>

        {/* Hero Section */}
        <section className={`relative pt-32 pb-40 px-6 overflow-hidden ${website.theme === 'Vibrant' ? 'bg-gradient-to-br from-indigo-50 to-fuchsia-50' : 'bg-slate-50'}`}>
          <div className="absolute top-0 right-0 w-1/2 h-full bg-indigo-100 rounded-bl-[100px] -z-10 opacity-50" />
          <div className="container mx-auto max-w-4xl text-center relative z-10">
            <span className="inline-block py-1.5 px-4 rounded-full bg-indigo-100 text-indigo-700 font-bold text-sm mb-6 shadow-sm border border-indigo-200 uppercase tracking-wider">
              {website.business_type}
            </span>
            <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-8 text-slate-900">
              {content.hero_title || 'Welcome to our business'}
            </h1>
            <div className="flex justify-center gap-4 mt-12">
              <a href="#contact" className="bg-indigo-600 hover:bg-indigo-700 text-white px-10 py-4 rounded-full font-bold transition-all shadow-lg shadow-indigo-500/25 hover:scale-105 active:scale-95">
                Contact Us
              </a>
            </div>
          </div>
        </section>

        {/* About Section */}
        <section id="about" className="py-24 px-6 bg-white">
          <div className="container mx-auto max-w-3xl text-center">
            <h2 className="text-sm font-black text-slate-400 uppercase tracking-widest mb-8">About Us</h2>
            <p className="text-xl text-slate-600 leading-relaxed font-medium">
              {content.about_text || 'Information about this business will appear here.'}
            </p>
          </div>
        </section>

        {/* Services Section */}
        {content.services_json && content.services_json.length > 0 && (
          <section id="services" className="py-24 px-6 bg-slate-50 border-y border-slate-100">
            <div className="container mx-auto max-w-5xl">
              <h2 className="text-sm font-black text-slate-400 uppercase tracking-widest mb-12 text-center">Our Services</h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {content.services_json.map((service: string, index: number) => (
                  <div key={index} className="bg-white p-8 rounded-[2rem] shadow-sm border border-slate-200 hover:shadow-lg transition-all hover:-translate-y-1">
                    <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center font-black mb-6">
                      {index + 1}
                    </div>
                    <h3 className="text-xl font-bold text-slate-900">{service}</h3>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Gallery Section */}
        {content.gallery_json && content.gallery_json.length > 0 && (
          <section id="gallery" className="py-24 px-6 bg-white">
            <div className="container mx-auto max-w-6xl">
              <h2 className="text-sm font-black text-slate-400 uppercase tracking-widest mb-12 text-center">Gallery</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                {content.gallery_json.map((img: string, index: number) => (
                  <div key={index} className="aspect-square rounded-[2rem] overflow-hidden bg-slate-100 shadow-md">
                    <img loading="lazy" src={img} alt={`Gallery ${index}`} className="w-full h-full object-cover hover:scale-110 transition-transform duration-700" />
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Custom HTML Injection */}
        {content.custom_html && (
          <section className="py-24 px-6 bg-slate-50 border-t border-slate-100">
            <div className="container mx-auto max-w-6xl">
              <div dangerouslySetInnerHTML={{ __html: safeHtml(content.custom_html) }} />
            </div>
          </section>
        )}

        {/* Contact Section */}
        <section id="contact" className="py-24 px-6 bg-slate-900 text-white rounded-t-[3rem] mt-10 shadow-2xl">
          <div className="container mx-auto max-w-4xl">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold mb-4">Get In Touch</h2>
              <p className="text-slate-400 text-lg">We'd love to hear from you.</p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {contact.phone && (
                <div className="bg-white/5 backdrop-blur-md p-8 rounded-[2rem] text-center border border-white/10 hover:bg-white/10 transition-colors">
                  <div className="w-14 h-14 bg-indigo-500 text-white rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg shadow-indigo-500/20">
                    <Phone size={24} />
                  </div>
                  <h3 className="font-bold mb-2 text-lg">Phone</h3>
                  <p className="text-slate-300">{contact.phone}</p>
                </div>
              )}

              {contact.email && (
                <div className="bg-white/5 backdrop-blur-md p-8 rounded-[2rem] text-center border border-white/10 hover:bg-white/10 transition-colors">
                  <div className="w-14 h-14 bg-emerald-500 text-white rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg shadow-emerald-500/20">
                    <Mail size={24} />
                  </div>
                  <h3 className="font-bold mb-2 text-lg">Email</h3>
                  <p className="text-slate-300">{contact.email}</p>
                </div>
              )}

              {contact.address && (
                <div className="bg-white/5 backdrop-blur-md p-8 rounded-[2rem] text-center border border-white/10 hover:bg-white/10 transition-colors">
                  <div className="w-14 h-14 bg-rose-500 text-white rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg shadow-rose-500/20">
                    <MapPin size={24} />
                  </div>
                  <h3 className="font-bold mb-2 text-lg">Location</h3>
                  <p className="text-slate-300">{contact.address}</p>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="bg-slate-950 text-slate-500 py-10 text-center text-sm font-medium">
          <p>&copy; {new Date().getFullYear()} {website.slug}. Created with <span className="font-bold text-white">Jaalam</span>.</p>
        </footer>
      </div>
    );
  };

  const upiId = website?.content?.settings_json?.upi_id;
  // Same rule FloatingContactButtons uses to render; the pay button moves left of them so they don't overlap
  const floatPhone = content?.settings_json?.cta_phone_number || content?.contact_info?.phone;
  const floatWhatsapp = content?.settings_json?.cta_whatsapp_number || content?.contact_info?.whatsapp;
  const hasFloatingContact = !invitationCategories.includes(website?.business_type)
    && !!(floatPhone || floatWhatsapp)
    && ((content?.settings_json?.show_whatsapp_float ?? true) || (content?.settings_json?.show_phone_float ?? true));

  return (
    <>
      <SEOHead title={seoTitle} description={seoDesc} imageUrl={getThemeThumbnail(website.business_type)} />
      <SiteContext.Provider value={{ slug: website?.slug }}>
        <ThemeRenderer website={website} content={content} fallback={renderFallback()} />
      </SiteContext.Provider>

      {/* Invitation layouts without a built-in calendar button get a floating one */}
      {invitationCategories.includes(website?.business_type) && !invitationStyleFor(website?.theme, website?.business_type) && (
        <FloatingAddToCalendar content={content} website={website} />
      )}
      {/* Falling petals / gold dust once the guest opens the cover (modern themes run their own) */}
      {invitationCategories.includes(website?.business_type) && !invitationStyleFor(website?.theme, website?.business_type) && (
        <AmbientAfterTap category={website.business_type} theme={website.theme} />
      )}
      {/* Business-site extras; invitations (weddings, birthdays and other events) don't use them */}
      {!invitationCategories.includes(website?.business_type) && (
        <>
          <Chatbot content={content} />

          <FloatingContactButtons 
            phone={content?.settings_json?.cta_phone_number || content?.contact_info?.phone} 
            whatsapp={content?.settings_json?.cta_whatsapp_number || content?.contact_info?.whatsapp} 
            showWhatsapp={content?.settings_json?.show_whatsapp_float ?? true}
            showPhone={content?.settings_json?.show_phone_float ?? true}
            style={content?.settings_json?.cta_style}
          />
          {(content?.settings_json?.show_language_widget ?? false) && (
            <LanguageTranslator 
              languages={content?.settings_json?.languages}
              widgetStyle={content?.settings_json?.language_widget_style}
              widgetAppearance={content?.settings_json?.language_widget_appearance}
            />
          )}
        </>
      )}

      {upiId && (
        <>
          <button
            onClick={() => setIsPaymentModalOpen(true)}
            className={`fixed bottom-6 ${hasFloatingContact ? 'right-24 md:right-28' : 'right-6'} z-[99990] bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-4 rounded-full font-black shadow-[0_10px_40px_-10px_rgba(79,70,229,0.5)] transition-all hover:scale-105 active:scale-95 flex items-center gap-2 group`}
          >
            <CreditCard size={20} className="group-hover:rotate-12 transition-transform" />
            <span className="hidden sm:inline">Make a Payment</span>
            <span className="sm:hidden">Pay</span>
          </button>
          <UPIPaymentModal
            isOpen={isPaymentModalOpen}
            onClose={() => setIsPaymentModalOpen(false)}
            upiId={upiId}
            websiteName={website?.content?.settings_json?.website_name || website.business_type || 'Website'}
          />
        </>
      )}
    </>
  );
}
