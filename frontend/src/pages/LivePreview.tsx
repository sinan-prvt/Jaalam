import { useEffect, useState } from 'react';
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
import ModernStationeryTheme from '../components/themes/stationery/ModernStationeryTheme';
import ClassicStationeryTheme from '../components/themes/stationery/ClassicStationeryTheme';
import PlayfulStationeryTheme from '../components/themes/stationery/PlayfulStationeryTheme';
import MinimalStationeryTheme from '../components/themes/stationery/MinimalStationeryTheme';
import EtherealStationeryTheme from '../components/themes/stationery/EtherealStationeryTheme';
import OrganicStoreTheme from '../components/themes/retail/OrganicStoreTheme';
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

export default function LivePreview() {
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    const handleMessage = (e: MessageEvent) => {
      if (e.data?.type === 'UPDATE_PREVIEW') {
        setData(e.data);
      }
    };
    
    window.addEventListener('message', handleMessage);
    
    // Notify parent that the iframe is ready to receive data
    if (window.parent) {
      window.parent.postMessage({ type: 'PREVIEW_READY' }, '*');
    }
    
    return () => window.removeEventListener('message', handleMessage);
  }, []);

  if (!data) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 text-slate-400 font-bold text-sm">
        Initializing Live Preview...
      </div>
    );
  }

  if (data.website.business_type === 'Restaurant') {
    return <RestaurantTheme website={data.website} content={data.content} />;
  }
  
  if (data.website.business_type === 'Cafe / Bakery') {
    return <CafeTheme website={data.website} content={data.content} />;
  }

  if (data.website.business_type === 'Salon' || data.website.business_type === 'Salon / Spa' || data.website.business_type === 'Saloon') {
    if (data.website.theme === 'Glamour Beauty') {
      return <SalonTheme2 website={data.website} content={data.content} />;
    }
    if (data.website.theme === 'Modern Saloon') {
      return <ModernSaloonTheme website={data.website} content={data.content} />;
    }
    if (data.website.theme === 'Vintage Barber') {
      return <VintageBarberTheme website={data.website} content={data.content} />;
    }
    if (data.website.theme === 'Royal Saloon') {
      return <RoyalSaloonTheme website={data.website} content={data.content} />;
    }
    return <SalonTheme website={data.website} content={data.content} />;
  }

  if (data.website.business_type === 'Gym / Fitness' || data.website.business_type === 'Gym') {
    if (data.website.theme === 'Hardcore Iron') {
      return <HardcoreIronTheme website={data.website} content={data.content} />;
    }
    if (data.website.theme === 'Zen Yoga Studio') {
      return <ZenYogaTheme website={data.website} content={data.content} />;
    }
    if (data.website.theme === 'CrossFit Box') {
      return <CrossFitTheme website={data.website} content={data.content} />;
    }
    if (data.website.theme === 'Luxury Health Club') {
      return <LuxuryClubTheme website={data.website} content={data.content} />;
    }
    if (data.website.theme === 'Combat & MMA Gym') {
      return <CombatGymTheme website={data.website} content={data.content} />;
    }
    return <HardcoreIronTheme website={data.website} content={data.content} />;
  }

  if (data.website.business_type === 'Real Estate') {
    if (data.website.theme === 'Luxury Villas') return <LuxuryVillasTheme website={data.website} content={data.content} />;
    if (data.website.theme === 'Urban Apartments') return <UrbanApartmentsTheme website={data.website} content={data.content} />;
    if (data.website.theme === 'Commercial') return <CommercialTheme website={data.website} content={data.content} />;
    if (data.website.theme === 'Minimal') return <MinimalRealEstateTheme website={data.website} content={data.content} />;
    if (data.website.theme === 'Classic') return <ClassicRealEstateTheme website={data.website} content={data.content} />;
    return <ModernRealEstateTheme website={data.website} content={data.content} />;
  }

  if (data.website.business_type === 'Retail Store') {
    if (data.website.theme === 'Boutique') {
      return <BoutiqueTheme website={data.website} content={data.content} />;
    }
    if (data.website.theme === 'Minimalist') {
      return <MinimalistTheme website={data.website} content={data.content} />;
    }
    if (data.website.theme === 'Streetwear') {
      return <StreetwearTheme website={data.website} content={data.content} />;
    }
    if (data.website.theme === 'Tech Gadget') {
      return <TechGadgetTheme website={data.website} content={data.content} />;
    }
    if (data.website.theme === 'Organic Store') {
      return <OrganicStoreTheme website={data.website} content={data.content} />;
    }
    return <BoutiqueTheme website={data.website} content={data.content} />;
  }

  if (data.website.business_type === 'Stationery / Books') {
    if (data.website.theme === 'Classic') return <ClassicStationeryTheme website={data.website} content={data.content} />;
    if (data.website.theme === 'Playful') return <PlayfulStationeryTheme website={data.website} content={data.content} />;
    if (data.website.theme === 'Minimal') return <MinimalStationeryTheme website={data.website} content={data.content} />;
    if (data.website.theme === 'Ethereal') return <EtherealStationeryTheme website={data.website} content={data.content} />;
    return <ModernStationeryTheme website={data.website} content={data.content} />;
  }

  if (data.website.business_type === 'Fancy Store') {
    if (data.website.theme === 'Boutique') return <BoutiqueFancyTheme website={data.website} content={data.content} />;
    if (data.website.theme === 'Minimal') return <MinimalFancyTheme website={data.website} content={data.content} />;
    if (data.website.theme === 'Luxury') return <LuxuryFancyTheme website={data.website} content={data.content} />;
    if (data.website.theme === 'Playful') return <PlayfulFancyTheme website={data.website} content={data.content} />;
    if (data.website.theme === 'Classic') return <ClassicFancyTheme website={data.website} content={data.content} />;
    if (data.website.theme === 'Noir') return <NoirFancyTheme website={data.website} content={data.content} />;
    if (data.website.theme === 'Pop') return <PopFancyTheme website={data.website} content={data.content} />;
    return <ModernFancyTheme website={data.website} content={data.content} />;
  }

  if (data.website.business_type === 'Chicken / Meat Stall') {
    if (data.website.theme === 'Classic') return <ClassicMeatTheme website={data.website} content={data.content} />;
    if (data.website.theme === 'Premium') return <PremiumMeatTheme website={data.website} content={data.content} />;
    if (data.website.theme === 'Minimal') return <MinimalMeatTheme website={data.website} content={data.content} />;
    if (data.website.theme === 'Rustic') return <RusticMeatTheme website={data.website} content={data.content} />;
    if (data.website.theme === 'Playful') return <PlayfulMeatTheme website={data.website} content={data.content} />;
    return <ModernMeatTheme website={data.website} content={data.content} />;
  }

  if (data.website.business_type === 'Scrap Dealer') {
    if (data.website.theme === 'Classic') return <ClassicScrapTheme website={data.website} content={data.content} />;
    if (data.website.theme === 'Minimal') return <MinimalScrapTheme website={data.website} content={data.content} />;
    if (data.website.theme === 'Corporate') return <CorporateScrapTheme website={data.website} content={data.content} />;
    if (data.website.theme === 'Eco') return <EcoScrapTheme website={data.website} content={data.content} />;
    if (data.website.theme === 'Playful') return <PlayfulScrapTheme website={data.website} content={data.content} />;
    return <ModernScrapTheme website={data.website} content={data.content} />;
  }

  if (data.website.business_type === 'Supermarket / Grocery') {
    if (data.website.theme === 'Classic') return <ClassicGroceryTheme website={data.website} content={data.content} />;
    if (data.website.theme === 'Premium') return <PremiumGroceryTheme website={data.website} content={data.content} />;
    if (data.website.theme === 'Minimal') return <MinimalGroceryTheme website={data.website} content={data.content} />;
    if (data.website.theme === 'Organic') return <OrganicGroceryTheme website={data.website} content={data.content} />;
    if (data.website.theme === 'Playful') return <PlayfulGroceryTheme website={data.website} content={data.content} />;
    return <ModernGroceryTheme website={data.website} content={data.content} />;
  }

  if (data.website.business_type === 'Textiles / Garments') {
    if (data.website.theme === 'Boutique') return <BoutiqueTextilesTheme website={data.website} content={data.content} />;
    if (data.website.theme === 'Minimal') return <MinimalTextilesTheme website={data.website} content={data.content} />;
    if (data.website.theme === 'Luxury') return <LuxuryTextilesTheme website={data.website} content={data.content} />;
    if (data.website.theme === 'Vintage') return <VintageTextilesTheme website={data.website} content={data.content} />;
    if (data.website.theme === 'Playful') return <PlayfulTextilesTheme website={data.website} content={data.content} />;
    return <ModernTextilesTheme website={data.website} content={data.content} />;
  }

  // Fallback for others
  return (
    <div className="p-8 font-sans">
      <h1>{data.website.slug}</h1>
      <pre className="mt-4 p-4 bg-slate-100 rounded text-xs overflow-auto">
        {JSON.stringify(data, null, 2)}
      </pre>
    </div>
  );
}
