import { lazy, Suspense, type ComponentType, type LazyExoticComponent } from 'react';
import {
  categoryThemes, weddingCategories, birthdayCategories, housewarmingCategories, collegeFestCategories, religiousEventCategories,
} from '../../utils/templateData';

/**
 * Single source of truth for business themes.
 *
 * Every business type maps its theme names (exactly as stored in `website.theme`)
 * to a lazily loaded component. The first entry is the default used when the
 * stored theme is missing or unknown. PublicWebsite and LivePreview both render
 * through ThemeRenderer; the picker lists live in utils/templateData.
 */
type ThemeComponent = LazyExoticComponent<ComponentType<any>>;
type ThemeMap = Record<string, ThemeComponent>;

const L = (loader: () => Promise<{ default: ComponentType<any> }>) => lazy(loader);

const restaurant = L(() => import('./restaurant/RestaurantTheme'));
const cafe = L(() => import('./restaurant/CafeTheme'));

export const businessThemes: Record<string, ThemeMap> = {
  // Restaurant and Cafe themes switch variants internally on website.theme
  'Restaurant': {
    'Fine Dining': restaurant,
    'Casual Eats': restaurant,
    'Bistro': restaurant,
    'Vegan Cafe': restaurant,
    'Seafood Grill': restaurant,
  },
  'Cafe / Bakery': {
    'Cozy Cafe': cafe,
    'Modern Bakery': cafe,
    'Artisan': cafe,
    'App Style': cafe,
    'Boutique': cafe,
  },
  'Salon / Spa': {
    'Classic Barbershop': L(() => import('./salon/SalonTheme')),
    'Modern Saloon': L(() => import('./salon/ModernSaloonTheme')),
    'Vintage Barber': L(() => import('./salon/VintageBarberTheme')),
    'Royal Saloon': L(() => import('./salon/RoyalSaloonTheme')),
    'Glamour Beauty': L(() => import('./salon/SalonTheme2')),
  },
  'Gym / Fitness': {
    'Hardcore Iron': L(() => import('./gym/HardcoreIronTheme')),
    'Zen Yoga Studio': L(() => import('./gym/ZenYogaTheme')),
    'CrossFit Box': L(() => import('./gym/CrossFitTheme')),
    'Luxury Health Club': L(() => import('./gym/LuxuryClubTheme')),
    'Combat & MMA Gym': L(() => import('./gym/CombatGymTheme')),
  },
  'Retail Store': {
    'Boutique': L(() => import('./retail/BoutiqueTheme')),
    'Minimalist': L(() => import('./retail/MinimalistTheme')),
    'Streetwear': L(() => import('./retail/StreetwearTheme')),
    'Tech Gadget': L(() => import('./retail/TechGadgetTheme')),
    'Organic Store': L(() => import('./retail/OrganicStoreTheme')),
  },
  'Stationery / Books': {
    'Modern': L(() => import('./stationery/ModernStationeryTheme')),
    'Classic': L(() => import('./stationery/ClassicStationeryTheme')),
    'Playful': L(() => import('./stationery/PlayfulStationeryTheme')),
    'Minimal': L(() => import('./stationery/MinimalStationeryTheme')),
    'Ethereal': L(() => import('./stationery/EtherealStationeryTheme')),
    'Premium': L(() => import('./stationery/PremiumStationeryTheme')),
    'Vintage': L(() => import('./stationery/VintageStationeryTheme')),
  },
  'Fancy Store': {
    'Modern': L(() => import('./fancy/ModernFancyTheme')),
    'Boutique': L(() => import('./fancy/BoutiqueFancyTheme')),
    'Minimal': L(() => import('./fancy/MinimalFancyTheme')),
    'Luxury': L(() => import('./fancy/LuxuryFancyTheme')),
    'Playful': L(() => import('./fancy/PlayfulFancyTheme')),
    'Classic': L(() => import('./fancy/ClassicFancyTheme')),
    'Noir': L(() => import('./fancy/NoirFancyTheme')),
    'Pop': L(() => import('./fancy/PopFancyTheme')),
  },
  'Chicken / Meat Stall': {
    'Modern': L(() => import('./meat/ModernMeatTheme')),
    'Classic': L(() => import('./meat/ClassicMeatTheme')),
    'Premium': L(() => import('./meat/PremiumMeatTheme')),
    'Minimal': L(() => import('./meat/MinimalMeatTheme')),
    'Playful': L(() => import('./meat/PlayfulMeatTheme')),
    'Rustic': L(() => import('./meat/RusticMeatTheme')),
  },
  'Scrap Dealer': {
    'Modern': L(() => import('./scrap/ModernScrapTheme')),
    'Classic': L(() => import('./scrap/ClassicScrapTheme')),
    'Minimal': L(() => import('./scrap/MinimalScrapTheme')),
    'Corporate': L(() => import('./scrap/CorporateScrapTheme')),
    'Eco': L(() => import('./scrap/EcoScrapTheme')),
    'Playful': L(() => import('./scrap/PlayfulScrapTheme')),
  },
  'Supermarket / Grocery': {
    'Modern': L(() => import('./grocery/ModernGroceryTheme')),
    'Classic': L(() => import('./grocery/ClassicGroceryTheme')),
    'Premium': L(() => import('./grocery/PremiumGroceryTheme')),
    'Minimal': L(() => import('./grocery/MinimalGroceryTheme')),
    'Organic': L(() => import('./grocery/OrganicGroceryTheme')),
    'Playful': L(() => import('./grocery/PlayfulGroceryTheme')),
    'Noir': L(() => import('./grocery/NoirGroceryTheme')),
    'Pop': L(() => import('./grocery/PopGroceryTheme')),
  },
  'Textiles / Garments': {
    'Modern': L(() => import('./textiles/ModernTextilesTheme')),
    'Boutique': L(() => import('./textiles/BoutiqueTextilesTheme')),
    'Minimal': L(() => import('./textiles/MinimalTextilesTheme')),
    'Luxury': L(() => import('./textiles/LuxuryTextilesTheme')),
    'Vintage': L(() => import('./textiles/VintageTextilesTheme')),
    'Playful': L(() => import('./textiles/PlayfulTextilesTheme')),
  },
  'Real Estate': {
    'Luxury Villas': L(() => import('./realestate/LuxuryVillasTheme')),
    'Urban Apartments': L(() => import('./realestate/UrbanApartmentsTheme')),
    'Commercial': L(() => import('./realestate/CommercialTheme')),
    'Modern': L(() => import('./realestate/ModernRealEstateTheme')),
    'Minimal': L(() => import('./realestate/MinimalRealEstateTheme')),
    'Classic': L(() => import('./realestate/ClassicRealEstateTheme')),
  },
  'Consulting': {
    'Corporate': L(() => import('./consulting/CorporateConsultingTheme')),
    'Creative Agency': L(() => import('./consulting/CreativeAgencyTheme')),
    'Tech Startup': L(() => import('./consulting/TechStartupTheme')),
    'Management': L(() => import('./consulting/ManagementConsultingTheme')),
    'Minimal': L(() => import('./consulting/MinimalConsultingTheme')),
    'Legal Firm': L(() => import('./consulting/LegalFirmTheme')),
  },
  'Other': {
    'Modern': L(() => import('./other/ModernOtherTheme')),
    'Classic': L(() => import('./other/ClassicOtherTheme')),
    'Minimal': L(() => import('./other/MinimalOtherTheme')),
    'Noir': L(() => import('./other/NoirOtherTheme')),
    'Pop': L(() => import('./other/PopOtherTheme')),
    'Corporate': L(() => import('./other/CorporateOtherTheme')),
  },
};

// Motion family: five modern video/motion layouts, added to every business category.
// Each layout reads category-specific copy and imagery from motion/presets.ts.
const motionThemes: ThemeMap = {
  'Cinematic': L(() => import('./motion/CinematicTheme')),
  'Aurora': L(() => import('./motion/AuroraTheme')),
  'Editorial': L(() => import('./motion/EditorialTheme')),
  'Neon Pulse': L(() => import('./motion/NeonTheme')),
  'Luxe Motion': L(() => import('./motion/LuxeTheme')),
};
for (const map of Object.values(businessThemes)) Object.assign(map, motionThemes);

/** Legacy / alternate business type names stored on older websites. */
const businessTypeAliases: Record<string, string> = {
  'Salon': 'Salon / Spa',
  'Saloon': 'Salon / Spa',
  'Gym': 'Gym / Fitness',
  'Textiles': 'Textiles / Garments',
  'Grocery': 'Supermarket / Grocery',
};

export const resolveBusinessType = (businessType?: string) =>
  (businessType && businessTypeAliases[businessType]) || businessType || 'Other';

if (import.meta.env.DEV) {
  // Keep picker lists (templateData) and renderable themes in sync
  for (const [type, map] of Object.entries(businessThemes)) {
    const listed = categoryThemes[type] || [];
    const missing = listed.filter(t => !map[t]);
    const unlisted = Object.keys(map).filter(t => !listed.includes(t));
    if (missing.length || unlisted.length) {
      console.warn(`[themes] ${type}: listed without component: ${missing.join(', ') || '-'}; component not listed: ${unlisted.join(', ') || '-'}`);
    }
  }
}

const WeddingTheme = L(() => import('./wedding/ClassicWeddingTheme'));
const BirthdayTheme = L(() => import('./birthday/BirthdayTheme'));
const HousewarmingTheme = lazy(() => import('./housewarming/HousewarmingTheme').then(m => ({ default: m.HousewarmingTheme })));
const CollegeFestTheme = L(() => import('./college-fest/CollegeFestTheme'));
const ReligiousEventTheme = L(() => import('./religious/ReligiousEventTheme'));

function ThemeFallback() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="w-10 h-10 rounded-full border-2 border-slate-200 border-t-slate-800 animate-spin" />
    </div>
  );
}

interface ThemeRendererProps {
  website: any;
  content: any;
  /** Rendered when the business type has no registered themes. */
  fallback?: React.ReactNode;
}

/** Picks and renders the right theme for a website. */
export function ThemeRenderer({ website, content, fallback = null }: ThemeRendererProps) {
  const type: string = website?.business_type;
  let element: React.ReactNode;

  if (weddingCategories.includes(type)) {
    element = <WeddingTheme website={website} content={content} />;
  } else if (birthdayCategories.includes(type)) {
    element = <BirthdayTheme website={website} content={content} />;
  } else if (housewarmingCategories.includes(type)) {
    element = <HousewarmingTheme theme={website.theme} content={content} businessType={type} />;
  } else if (collegeFestCategories.includes(type)) {
    element = <CollegeFestTheme website={website} content={content} />;
  } else if (religiousEventCategories.includes(type)) {
    element = <ReligiousEventTheme website={website} content={content} />;
  } else {
    const map = businessThemes[resolveBusinessType(type)];
    if (!map) return <>{fallback}</>;
    const names = Object.keys(map);
    const themeName = map[website.theme] ? website.theme : names[0];
    const Theme = map[themeName];
    // Variant-switching themes (Restaurant, Cafe) read website.theme, so pass the resolved name
    const themedWebsite = website.theme === themeName ? website : { ...website, theme: themeName };
    element = <Theme key={themeName} website={themedWebsite} content={content} />;
  }

  return <Suspense fallback={<ThemeFallback />}>{element}</Suspense>;
}
