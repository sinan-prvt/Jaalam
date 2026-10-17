import { useEffect, useState, Suspense } from 'react';
import { RestaurantTheme, CafeTheme, SalonTheme, SalonTheme2, ModernSaloonTheme, VintageBarberTheme, RoyalSaloonTheme, HardcoreIronTheme, ZenYogaTheme, CrossFitTheme, LuxuryClubTheme, CombatGymTheme, BoutiqueTheme, MinimalistTheme, StreetwearTheme, TechGadgetTheme, OrganicStoreTheme, ModernStationeryTheme, ClassicStationeryTheme, PlayfulStationeryTheme, MinimalStationeryTheme, EtherealStationeryTheme, ModernFancyTheme, BoutiqueFancyTheme, MinimalFancyTheme, LuxuryFancyTheme, PlayfulFancyTheme, ClassicFancyTheme, NoirFancyTheme, PopFancyTheme, ModernMeatTheme, ClassicMeatTheme, PremiumMeatTheme, MinimalMeatTheme, RusticMeatTheme, PlayfulMeatTheme, ModernScrapTheme, ClassicScrapTheme, MinimalScrapTheme, CorporateScrapTheme, EcoScrapTheme, PlayfulScrapTheme, ModernGroceryTheme, ClassicGroceryTheme, PremiumGroceryTheme, MinimalGroceryTheme, OrganicGroceryTheme, PlayfulGroceryTheme, NoirGroceryTheme, PopGroceryTheme, ModernTextilesTheme, BoutiqueTextilesTheme, MinimalTextilesTheme, LuxuryTextilesTheme, VintageTextilesTheme, PlayfulTextilesTheme, LuxuryVillasTheme, UrbanApartmentsTheme, CommercialTheme, ModernRealEstateTheme, MinimalRealEstateTheme, ClassicRealEstateTheme, CorporateConsultingTheme, CreativeAgencyTheme, TechStartupTheme, ManagementConsultingTheme, MinimalConsultingTheme, LegalFirmTheme, ModernOtherTheme, ClassicOtherTheme, MinimalOtherTheme, NoirOtherTheme, PopOtherTheme, CorporateOtherTheme, ClassicWeddingTheme, BirthdayTheme, HousewarmingTheme, CollegeFestTheme, ReligiousEventTheme } from '../../components/themes/lazyThemes';

import { weddingCategories, birthdayCategories, housewarmingCategories, collegeFestCategories, religiousEventCategories, invitationCategories } from '../../utils/templateData';
import useScrollReveal from '../../hooks/useScrollReveal';
import useSmoothScroll from '../../hooks/useSmoothScroll';
import Chatbot from '../../components/shared/Chatbot';
import FloatingContactButtons from '../../components/shared/FloatingContactButtons';
import LanguageTranslator from '../../components/shared/LanguageTranslator';


function LivePreviewContent() {
  const [data, setData] = useState<any>(null);
  useScrollReveal([data?.website?.theme, data?.website?.business_type]);
  useSmoothScroll();

  useEffect(() => {
    if (data?.content?.settings_json?.show_language_widget === false) {
      if (document.cookie.includes('googtrans')) {
        document.cookie = 'googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
        document.cookie = `googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; domain=${window.location.hostname}; path=/;`;
        window.location.reload();
      }
    }
  }, [data?.content?.settings_json?.show_language_widget]);

  useEffect(() => {
    const handleMessage = (e: MessageEvent) => {
      if (e.data?.type === 'UPDATE_PREVIEW') {
        const newData = { ...e.data };
        if (newData.content?.contact_info?.address && typeof newData.content.contact_info.address === 'object') {
          const addr = newData.content.contact_info.address;
          newData.content.contact_info.address = Object.values(addr).filter(Boolean).join(', ');
        }
        setData(newData);
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



  // Inside the editor's iframe, invitation themes allow click-to-edit text. Edits are applied
  // locally and sent to the editor, which stores them in its form state like any other change.
  const inEditorFrame = window.parent !== window;
  const editProps = inEditorFrame
    ? {
        isEditor: true,
        updateContent: (nextContent: any) => {
          setData((prev: any) => ({ ...prev, content: nextContent }));
          window.parent.postMessage({ type: 'CONTENT_EDIT', content: nextContent }, window.location.origin);
        },
      }
    : {};

  const renderTheme = () => {
    if (weddingCategories.includes(data.website.business_type)) {
      return <ClassicWeddingTheme website={data.website} content={data.content} {...editProps} />;
    }

    if (birthdayCategories.includes(data.website.business_type)) {
      return <BirthdayTheme website={data.website} content={data.content} {...editProps} />;
    }

    if (housewarmingCategories.includes(data.website.business_type)) {
      return <HousewarmingTheme theme={data.website.theme} content={data.content} businessType={data.website.business_type} website={data.website} {...editProps} />;
    }

    if (collegeFestCategories.includes(data.website.business_type)) {
      return <CollegeFestTheme website={data.website} content={data.content} {...editProps} />;
    }

    if (religiousEventCategories.includes(data.website.business_type)) {
      return <ReligiousEventTheme website={data.website} content={data.content} {...editProps} />;
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
      if (data.website.theme === 'Noir') return <NoirGroceryTheme website={data.website} content={data.content} />;
      if (data.website.theme === 'Pop') return <PopGroceryTheme website={data.website} content={data.content} />;
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

    if (data.website.business_type === 'Consulting') {
      if (data.website.theme === 'Corporate') return <CorporateConsultingTheme website={data.website} content={data.content} />;
      if (data.website.theme === 'Creative Agency') return <CreativeAgencyTheme website={data.website} content={data.content} />;
      if (data.website.theme === 'Tech Startup') return <TechStartupTheme website={data.website} content={data.content} />;
      if (data.website.theme === 'Management') return <ManagementConsultingTheme website={data.website} content={data.content} />;
      if (data.website.theme === 'Minimal') return <MinimalConsultingTheme website={data.website} content={data.content} />;
      if (data.website.theme === 'Legal Firm') return <LegalFirmTheme website={data.website} content={data.content} />;
      return <CorporateConsultingTheme website={data.website} content={data.content} />;
    }

    if (data.website.business_type === 'Other') {
      if (data.website.theme === 'Classic') return <ClassicOtherTheme website={data.website} content={data.content} />;
      if (data.website.theme === 'Minimal') return <MinimalOtherTheme website={data.website} content={data.content} />;
      if (data.website.theme === 'Noir') return <NoirOtherTheme website={data.website} content={data.content} />;
      if (data.website.theme === 'Pop') return <PopOtherTheme website={data.website} content={data.content} />;
      if (data.website.theme === 'Corporate') return <CorporateOtherTheme website={data.website} content={data.content} />;
      return <ModernOtherTheme website={data.website} content={data.content} />;
    }

    return (
      <div className="p-8 font-sans">
        <h1>{data.website.slug}</h1>
        <pre className="mt-4 p-4 bg-slate-100 rounded text-xs overflow-auto">
          {JSON.stringify(data, null, 2)}
        </pre>
      </div>
    );
  };

  return (
    <>
      <Suspense fallback={<div className="min-h-screen" />}>
        {renderTheme()}
      </Suspense>
      {/* Business-site extras; invitations (weddings, birthdays and other events) don't use them */}
      {!invitationCategories.includes(data.website?.business_type) && (
        <>
          <Chatbot content={data.content} />
          <FloatingContactButtons 
            phone={data.content?.settings_json?.cta_phone_number || data.content?.contact_info?.phone} 
            whatsapp={data.content?.settings_json?.cta_whatsapp_number || data.content?.contact_info?.whatsapp} 
            showWhatsapp={data.content?.settings_json?.show_whatsapp_float ?? true}
            showPhone={data.content?.settings_json?.show_phone_float ?? true}
            style={data.content?.settings_json?.cta_style}
          />
          {(data.content?.settings_json?.show_language_widget ?? true) && (
            <LanguageTranslator 
              languages={data.content?.settings_json?.languages}
              widgetStyle={data.content?.settings_json?.language_widget_style}
              widgetAppearance={data.content?.settings_json?.language_widget_appearance}
            />
          )}
        </>
      )}
    </>
  );
}

export default function LivePreview() {
  return (
    <LivePreviewContent />
  );
}
