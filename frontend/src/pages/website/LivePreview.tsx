import { useEffect, useState } from 'react';

import { ThemeRenderer } from '../../components/themes/registry';
import { invitationCategories } from '../../utils/templateData';
import useScrollReveal from '../../hooks/useScrollReveal';
import useSmoothScroll from '../../hooks/useSmoothScroll';
import Chatbot from '../../components/shared/Chatbot';
import { AmbientAfterTap } from '../../components/themes/invitation-modern/ambient';
import FloatingContactButtons from '../../components/shared/FloatingContactButtons';
import LanguageTranslator from '../../components/shared/LanguageTranslator';
import FloatingAddToCalendar from '../../components/shared/AddToCalendar';
import { invitationStyleFor } from '../../components/themes/invitation-modern/routing';
import useHideBranding from '../../hooks/useHideBranding';
import useTextOverrides from '../../hooks/useTextOverrides';
import { SiteContext } from '../../components/themes/shared/siteContext';
import InlineTextEditor from '../../components/editor/InlineTextEditor';
import { applyInlineEdits, type InlineEdit } from '../../utils/contentPatch';


function LivePreviewContent() {
  const [data, setData] = useState<any>(null);
  useScrollReveal([data?.website?.theme, data?.website?.business_type]);
  useSmoothScroll();
  useHideBranding(data?.website?.show_branding === false);
  useTextOverrides(data?.content?.settings_json, data?.content);

  useEffect(() => {
    // Language widget is off unless enabled: drop any leftover translation once the site has loaded
    if (data && data.content?.settings_json?.show_language_widget !== true) {
      if (document.cookie.includes('googtrans')) {
        document.cookie = 'googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
        document.cookie = `googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; domain=${window.location.hostname}; path=/;`;
        window.location.reload();
      }
    }
  }, [data, data?.content?.settings_json?.show_language_widget]);

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

  // Click-to-edit for every theme, but only in the website editors (not template previews)
  let inEditor = false;
  try {
    inEditor = inEditorFrame && /^\/([a-z-]+-)?editor\//.test(window.parent.location.pathname);
  } catch { /* parent on another origin */ }
  const applyInline = (edits: InlineEdit[]) => {
    setData((prev: any) => ({ ...prev, content: applyInlineEdits(prev.content, edits) }));
    window.parent.postMessage({ type: 'INLINE_EDIT', edits }, window.location.origin);
  };

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
      {/* The editor's phone/desktop frame: scrolls without showing a scrollbar */}
      <style>{'html, body, * { scrollbar-width: none; } html::-webkit-scrollbar, body::-webkit-scrollbar, *::-webkit-scrollbar { display: none; }'}</style>
      <SiteContext.Provider value={{ slug: data.website?.slug, preview: true }}>
        <ThemeRenderer website={data.website} content={data.content} fallback={renderFallback()} editProps={editProps} />
      </SiteContext.Provider>
      {inEditor && <InlineTextEditor content={data.content} onEdit={applyInline} />}
      {/* Invitation layouts without a built-in calendar button get a floating one */}
      {invitationCategories.includes(data.website?.business_type) && !invitationStyleFor(data.website?.theme, data.website?.business_type) && (
        <FloatingAddToCalendar content={data.content} website={data.website} />
      )}
      {/* Falling petals / gold dust once the guest opens the cover (modern themes run their own) */}
      {invitationCategories.includes(data.website?.business_type) && !invitationStyleFor(data.website?.theme, data.website?.business_type) && (
        <AmbientAfterTap category={data.website.business_type} theme={data.website.theme} />
      )}
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
          {(data.content?.settings_json?.show_language_widget ?? false) && (
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
