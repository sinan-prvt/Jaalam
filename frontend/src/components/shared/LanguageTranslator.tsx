import React, { useEffect, useState } from 'react';
import { Globe, ChevronDown, Check } from 'lucide-react';

declare global {
  interface Window {
    googleTranslateElementInit: () => void;
    google: any;
  }
}

interface LanguageTranslatorProps {
  languages?: string[];
  widgetStyle?: string;
  widgetAppearance?: string;
}

const languageMap: Record<string, string> = {
  'en': 'English',
  'ml': 'Malayalam',
  'hi': 'Hindi',
  'ar': 'Arabic'
};

export default function LanguageTranslator({ languages = ['en', 'ml'], widgetStyle = 'bottom-center', widgetAppearance = 'full' }: LanguageTranslatorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [currentLang, setCurrentLang] = useState('en');

  useEffect(() => {
    const match = document.cookie.match(/(?:^|;)\s*googtrans=([^;]*)/);
    if (match && match[1]) {
      const parts = decodeURIComponent(match[1]).split('/');
      if (parts.length > 2) {
        setCurrentLang(parts[2]);
      }
    }

    if (!document.getElementById('google-translate-script')) {
      window.googleTranslateElementInit = () => {
        if (window.google && window.google.translate) {
          new window.google.translate.TranslateElement(
            { 
              pageLanguage: 'en', 
              includedLanguages: languages.join(','), 
              autoDisplay: false
            },
            'google_translate_element'
          );
        }
      };

      const script = document.createElement('script');
      script.id = 'google-translate-script';
      script.src = '//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
      script.async = true;
      document.body.appendChild(script);
    }
  }, [languages.join(',')]);

  const changeLanguage = (langCode: string) => {
    setCurrentLang(langCode);
    
    if (langCode === 'en') {
      document.cookie = `googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
      document.cookie = `googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; domain=${window.location.hostname}; path=/;`;
    } else {
      const val = `/en/${langCode}`;
      document.cookie = `googtrans=${val}; path=/;`;
      document.cookie = `googtrans=${val}; domain=${window.location.hostname}; path=/;`;
    }
    
    // Trigger Google Translate instantly without reloading the page
    const select = document.querySelector('.goog-te-combo') as HTMLSelectElement;
    if (select) {
      select.value = langCode === 'en' ? 'en' : langCode;
      // Fallback if 'en' is not an option (sometimes it uses empty string for default)
      if (select.selectedIndex === -1) {
        select.value = '';
      }
      select.dispatchEvent(new Event('change', { bubbles: true }));
    } else {
      // Fallback if script hasn't loaded yet
      window.location.reload();
    }
  };

  const isVertical = widgetStyle === 'center-right' || widgetStyle === 'center-left';

  const getPositionClass = () => {
    switch (widgetStyle) {
      case 'center-right': return 'fixed top-1/2 right-0 -translate-y-1/2 z-[99999]';
      case 'center-left': return 'fixed top-1/2 left-0 -translate-y-1/2 z-[99999]';
      case 'bottom-center': 
      default: return 'fixed bottom-6 left-1/2 -translate-x-1/2 z-[99999]';
    }
  };

  const getDropdownClass = () => {
    if (widgetStyle === 'center-right') return 'absolute right-full mr-2 top-1/2 -translate-y-1/2';
    if (widgetStyle === 'center-left') return 'absolute left-full ml-2 top-1/2 -translate-y-1/2';
    return 'absolute bottom-full mb-2 left-1/2 -translate-x-1/2'; 
  };

  const getButtonClass = () => {
    if (widgetStyle === 'center-right') {
      return 'flex flex-col items-center gap-3 px-2 py-5 bg-white/95 backdrop-blur-xl border border-r-0 border-slate-200/60 rounded-l-2xl shadow-[-5px_0_20px_rgba(0,0,0,0.1)] text-slate-800 hover:bg-white hover:-translate-x-1 transition-all group';
    }
    if (widgetStyle === 'center-left') {
      return 'flex flex-col items-center gap-3 px-2 py-5 bg-white/95 backdrop-blur-xl border border-l-0 border-slate-200/60 rounded-r-2xl shadow-[5px_0_20px_rgba(0,0,0,0.1)] text-slate-800 hover:bg-white hover:translate-x-1 transition-all group';
    }
    return 'flex items-center gap-2 px-5 py-2.5 bg-white/95 backdrop-blur-xl border border-slate-200/60 rounded-full shadow-lg text-slate-800 hover:bg-white transition-all hover:scale-105 active:scale-95 group';
  };

  let displayLang = languageMap[currentLang] || currentLang;
  if (widgetAppearance === 'short') {
    displayLang = currentLang.toUpperCase();
  }

  const showText = widgetAppearance === 'full' || widgetAppearance === 'short';
  const showIcon = widgetAppearance === 'full' || widgetAppearance === 'icon';

  return (
    <div className={getPositionClass()}>
      <div id="google_translate_element" style={{ display: 'none' }}></div>
      <style>{`
        body { top: 0 !important; }
        .skiptranslate { display: none !important; visibility: hidden !important; }
        #goog-gt-tt { display: none !important; }
        .goog-te-spinner-pos { display: none !important; }
        font { background-color: transparent !important; box-shadow: none !important; }
      `}</style>

      <div className="relative flex items-center justify-center">
        <button onClick={() => setIsOpen(!isOpen)} className={getButtonClass()}>
          {showIcon && <Globe size={isVertical ? 20 : 18} className="text-indigo-600 group-hover:rotate-12 transition-transform shrink-0" />}
          {showText && (
            <span className={`font-bold text-xs uppercase ${widgetAppearance === 'short' ? '' : 'tracking-[0.2em]'} ${isVertical ? '[writing-mode:vertical-rl] leading-none py-1' : ''}`}>
              {displayLang}
            </span>
          )}
          <ChevronDown size={14} className={`text-slate-400 transition-transform shrink-0 ${isVertical && isOpen ? 'rotate-90' : isVertical ? '-rotate-90' : isOpen ? 'rotate-180' : ''}`} />
        </button>

        {isOpen && (
          <div className={`${getDropdownClass()} w-48 bg-white border border-slate-100 rounded-2xl shadow-2xl overflow-hidden py-2 animate-in fade-in zoom-in-95`}>
            <div className="px-4 py-2 text-[10px] font-black uppercase tracking-widest text-slate-400 border-b border-slate-50 mb-1">
              Select Language
            </div>
            {['en', ...languages.filter(l => l !== 'en')].map(lang => (
              <button
                key={lang}
                onClick={() => {
                  setIsOpen(false);
                  changeLanguage(lang);
                }}
                className={`w-full text-left px-4 py-2.5 text-sm font-bold flex items-center justify-between hover:bg-slate-50 transition-colors ${currentLang === lang ? 'text-indigo-600 bg-indigo-50/50' : 'text-slate-700'}`}
              >
                {languageMap[lang] || lang}
                {currentLang === lang && <Check size={16} />}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
