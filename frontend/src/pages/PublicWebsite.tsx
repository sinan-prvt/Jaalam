import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { Phone, Mail, MapPin } from 'lucide-react';
import RestaurantTheme from '../components/themes/restaurant/RestaurantTheme';
import CafeTheme from '../components/themes/restaurant/CafeTheme';
import SalonTheme from '../components/themes/salon/SalonTheme';
import SalonTheme2 from '../components/themes/salon/SalonTheme2';
import ModernSaloonTheme from '../components/themes/salon/ModernSaloonTheme';
import VintageBarberTheme from '../components/themes/salon/VintageBarberTheme';
import RoyalSaloonTheme from '../components/themes/salon/RoyalSaloonTheme';
import HardcoreIronTheme from '../components/themes/gym/HardcoreIronTheme';
import ZenYogaTheme from '../components/themes/gym/ZenYogaTheme';
import CrossFitTheme from '../components/themes/gym/CrossFitTheme';
import LuxuryClubTheme from '../components/themes/gym/LuxuryClubTheme';
import CombatGymTheme from '../components/themes/gym/CombatGymTheme';
import BoutiqueTheme from '../components/themes/retail/BoutiqueTheme';
import MinimalistTheme from '../components/themes/retail/MinimalistTheme';
import StreetwearTheme from '../components/themes/retail/StreetwearTheme';
import TechGadgetTheme from '../components/themes/retail/TechGadgetTheme';
import OrganicStoreTheme from '../components/themes/retail/OrganicStoreTheme';
import ModernStationeryTheme from '../components/themes/stationery/ModernStationeryTheme';
import ClassicStationeryTheme from '../components/themes/stationery/ClassicStationeryTheme';
import PlayfulStationeryTheme from '../components/themes/stationery/PlayfulStationeryTheme';
import MinimalStationeryTheme from '../components/themes/stationery/MinimalStationeryTheme';
import EtherealStationeryTheme from '../components/themes/stationery/EtherealStationeryTheme';
import ModernFancyTheme from '../components/themes/fancy/ModernFancyTheme';
import BoutiqueFancyTheme from '../components/themes/fancy/BoutiqueFancyTheme';
import MinimalFancyTheme from '../components/themes/fancy/MinimalFancyTheme';
import LuxuryFancyTheme from '../components/themes/fancy/LuxuryFancyTheme';
import PlayfulFancyTheme from '../components/themes/fancy/PlayfulFancyTheme';
import ClassicFancyTheme from '../components/themes/fancy/ClassicFancyTheme';
import NoirFancyTheme from '../components/themes/fancy/NoirFancyTheme';
import PopFancyTheme from '../components/themes/fancy/PopFancyTheme';
import ModernMeatTheme from '../components/themes/meat/ModernMeatTheme';
import ClassicMeatTheme from '../components/themes/meat/ClassicMeatTheme';
import PremiumMeatTheme from '../components/themes/meat/PremiumMeatTheme';
import MinimalMeatTheme from '../components/themes/meat/MinimalMeatTheme';
import RusticMeatTheme from '../components/themes/meat/RusticMeatTheme';
import PlayfulMeatTheme from '../components/themes/meat/PlayfulMeatTheme';
import ModernScrapTheme from '../components/themes/scrap/ModernScrapTheme';
import ClassicScrapTheme from '../components/themes/scrap/ClassicScrapTheme';
import MinimalScrapTheme from '../components/themes/scrap/MinimalScrapTheme';
import CorporateScrapTheme from '../components/themes/scrap/CorporateScrapTheme';
import EcoScrapTheme from '../components/themes/scrap/EcoScrapTheme';
import PlayfulScrapTheme from '../components/themes/scrap/PlayfulScrapTheme';
import ModernGroceryTheme from '../components/themes/grocery/ModernGroceryTheme';
import ClassicGroceryTheme from '../components/themes/grocery/ClassicGroceryTheme';
import PremiumGroceryTheme from '../components/themes/grocery/PremiumGroceryTheme';
import MinimalGroceryTheme from '../components/themes/grocery/MinimalGroceryTheme';
import OrganicGroceryTheme from '../components/themes/grocery/OrganicGroceryTheme';
import PlayfulGroceryTheme from '../components/themes/grocery/PlayfulGroceryTheme';
import ModernTextilesTheme from '../components/themes/textiles/ModernTextilesTheme';
import BoutiqueTextilesTheme from '../components/themes/textiles/BoutiqueTextilesTheme';
import MinimalTextilesTheme from '../components/themes/textiles/MinimalTextilesTheme';
import LuxuryTextilesTheme from '../components/themes/textiles/LuxuryTextilesTheme';
import VintageTextilesTheme from '../components/themes/textiles/VintageTextilesTheme';
import PlayfulTextilesTheme from '../components/themes/textiles/PlayfulTextilesTheme';
import LuxuryVillasTheme from '../components/themes/realestate/LuxuryVillasTheme';
import UrbanApartmentsTheme from '../components/themes/realestate/UrbanApartmentsTheme';
import CommercialTheme from '../components/themes/realestate/CommercialTheme';
import ModernRealEstateTheme from '../components/themes/realestate/ModernRealEstateTheme';
import MinimalRealEstateTheme from '../components/themes/realestate/MinimalRealEstateTheme';
import ClassicRealEstateTheme from '../components/themes/realestate/ClassicRealEstateTheme';
import DynamicRenderer from '../components/DynamicRenderer';

export default function PublicWebsite() {
  const { businessSlug } = useParams();
  const [website, setWebsite] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchWebsite = async () => {
      try {
        const res = await axios.get(`http://localhost:8000/api/websites/${businessSlug}/public/`);
        setWebsite(res.data);
      } catch (err: any) {
        console.error(err);
        if (err.response && err.response.status === 403) {
          setError('unpublished');
        } else {
          setError('not_found');
        }
      } finally {
        setLoading(false);
      }
    };
    fetchWebsite();
  }, [businessSlug]);

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

  // If this is a dynamic AI-generated site, use the new DynamicRenderer
  if (content?.settings_json?.blocks) {
    return <DynamicRenderer website={website} content={content} />;
  }

  if (website.business_type === 'Restaurant') {
    return <RestaurantTheme website={website} content={content} />;
  }

  if (website.business_type === 'Cafe / Bakery') {
    return <CafeTheme website={website} content={content} />;
  }

  if (website.business_type === 'Salon' || website.business_type === 'Salon / Spa' || website.business_type === 'Saloon') {
    if (website.theme === 'Glamour Beauty') {
      return <SalonTheme2 website={website} content={content} />;
    }
    if (website.theme === 'Modern Saloon') {
      return <ModernSaloonTheme website={website} content={content} />;
    }
    if (website.theme === 'Vintage Barber') {
      return <VintageBarberTheme website={website} content={content} />;
    }
    if (website.theme === 'Royal Saloon') {
      return <RoyalSaloonTheme website={website} content={content} />;
    }
    return <SalonTheme website={website} content={content} />;
  }

  if (website.business_type === 'Gym / Fitness' || website.business_type === 'Gym') {
    if (website.theme === 'Hardcore Iron') {
      return <HardcoreIronTheme website={website} content={content} />;
    }
    if (website.theme === 'Zen Yoga Studio') {
      return <ZenYogaTheme website={website} content={content} />;
    }
    if (website.theme === 'CrossFit Box') {
      return <CrossFitTheme website={website} content={content} />;
    }
    if (website.theme === 'Luxury Health Club') {
      return <LuxuryClubTheme website={website} content={content} />;
    }
    if (website.theme === 'Combat & MMA Gym') {
      return <CombatGymTheme website={website} content={content} />;
    }
    return <HardcoreIronTheme website={website} content={content} />;
  }

  if (website.business_type === 'Real Estate') {
    if (website.theme === 'Luxury Villas') return <LuxuryVillasTheme website={website} content={content} />;
    if (website.theme === 'Urban Apartments') return <UrbanApartmentsTheme website={website} content={content} />;
    if (website.theme === 'Commercial') return <CommercialTheme website={website} content={content} />;
    if (website.theme === 'Minimal') return <MinimalRealEstateTheme website={website} content={content} />;
    if (website.theme === 'Classic') return <ClassicRealEstateTheme website={website} content={content} />;
    return <ModernRealEstateTheme website={website} content={content} />;
  }

  if (website.business_type === 'Retail Store') {
    if (website.theme === 'Boutique') {
      return <BoutiqueTheme website={website} content={content} />;
    }
    if (website.theme === 'Minimalist') {
      return <MinimalistTheme website={website} content={content} />;
    }
    if (website.theme === 'Streetwear') {
      return <StreetwearTheme website={website} content={content} />;
    }
    if (website.theme === 'Tech Gadget') {
      return <TechGadgetTheme website={website} content={content} />;
    }
    if (website.theme === 'Organic Store') {
      return <OrganicStoreTheme website={website} content={content} />;
    }
    return <BoutiqueTheme website={website} content={content} />;
  }

  if (website.business_type === 'Stationery / Books') {
    if (website.theme === 'Classic') return <ClassicStationeryTheme website={website} content={content} />;
    if (website.theme === 'Playful') return <PlayfulStationeryTheme website={website} content={content} />;
    if (website.theme === 'Minimal') return <MinimalStationeryTheme website={website} content={content} />;
    if (website.theme === 'Ethereal') return <EtherealStationeryTheme website={website} content={content} />;
    return <ModernStationeryTheme website={website} content={content} />;
  }

  if (website.business_type === 'Fancy Store') {
    if (website.theme === 'Boutique') return <BoutiqueFancyTheme website={website} content={content} />;
    if (website.theme === 'Minimal') return <MinimalFancyTheme website={website} content={content} />;
    if (website.theme === 'Luxury') return <LuxuryFancyTheme website={website} content={content} />;
    if (website.theme === 'Playful') return <PlayfulFancyTheme website={website} content={content} />;
    if (website.theme === 'Classic') return <ClassicFancyTheme website={website} content={content} />;
    if (website.theme === 'Noir') return <NoirFancyTheme website={website} content={content} />;
    if (website.theme === 'Pop') return <PopFancyTheme website={website} content={content} />;
    return <ModernFancyTheme website={website} content={content} />;
  }

  if (website.business_type === 'Chicken / Meat Stall') {
    if (website.theme === 'Classic') return <ClassicMeatTheme website={website} content={content} />;
    if (website.theme === 'Premium') return <PremiumMeatTheme website={website} content={content} />;
    if (website.theme === 'Minimal') return <MinimalMeatTheme website={website} content={content} />;
    if (website.theme === 'Rustic') return <RusticMeatTheme website={website} content={content} />;
    if (website.theme === 'Playful') return <PlayfulMeatTheme website={website} content={content} />;
    return <ModernMeatTheme website={website} content={content} />;
  }

  if (website.business_type === 'Scrap Dealer') {
    if (website.theme === 'Classic') return <ClassicScrapTheme website={website} content={content} />;
    if (website.theme === 'Minimal') return <MinimalScrapTheme website={website} content={content} />;
    if (website.theme === 'Corporate') return <CorporateScrapTheme website={website} content={content} />;
    if (website.theme === 'Eco') return <EcoScrapTheme website={website} content={content} />;
    if (website.theme === 'Playful') return <PlayfulScrapTheme website={website} content={content} />;
    return <ModernScrapTheme website={website} content={content} />;
  }

  if (website.business_type === 'Supermarket / Grocery') {
    if (website.theme === 'Classic') return <ClassicGroceryTheme website={website} content={content} />;
    if (website.theme === 'Premium') return <PremiumGroceryTheme website={website} content={content} />;
    if (website.theme === 'Minimal') return <MinimalGroceryTheme website={website} content={content} />;
    if (website.theme === 'Organic') return <OrganicGroceryTheme website={website} content={content} />;
    if (website.theme === 'Playful') return <PlayfulGroceryTheme website={website} content={content} />;
    return <ModernGroceryTheme website={website} content={content} />;
  }

  if (website.business_type === 'Textiles / Garments') {
    if (website.theme === 'Boutique') return <BoutiqueTextilesTheme website={website} content={content} />;
    if (website.theme === 'Minimal') return <MinimalTextilesTheme website={website} content={content} />;
    if (website.theme === 'Luxury') return <LuxuryTextilesTheme website={website} content={content} />;
    if (website.theme === 'Vintage') return <VintageTextilesTheme website={website} content={content} />;
    if (website.theme === 'Playful') return <PlayfulTextilesTheme website={website} content={content} />;
    return <ModernTextilesTheme website={website} content={content} />;
  }

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
                  <img src={img} alt={`Gallery ${index}`} className="w-full h-full object-cover hover:scale-110 transition-transform duration-700" />
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
              <div dangerouslySetInnerHTML={{ __html: content.custom_html }} />
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
}
