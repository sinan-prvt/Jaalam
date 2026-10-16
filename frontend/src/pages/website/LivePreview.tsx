import { useEffect, useState } from 'react';

import { ThemeRenderer } from '../../components/themes/registry';
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



  const renderFallback = () => {
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
      <ThemeRenderer website={data.website} content={data.content} fallback={renderFallback()} />
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
  );
}

export default function LivePreview() {
  return (
    <LivePreviewContent />
  );
}
