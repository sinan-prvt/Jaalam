import React from 'react';
import { Phone, MessageCircle } from 'lucide-react';

interface FloatingContactButtonsProps {
  phone?: string;
  whatsapp?: string;
  showWhatsapp?: boolean;
  showPhone?: boolean;
  style?: string; // 'style1', 'style2', 'style3', 'style4', 'style5'
}

export default function FloatingContactButtons({ phone, whatsapp, showWhatsapp = true, showPhone = true, style = 'style1' }: FloatingContactButtonsProps) {
  if (!phone && !whatsapp) return null;
  if (!showWhatsapp && !showPhone) return null;

  const waLink = whatsapp ? `https://wa.me/${whatsapp.replace(/[^0-9]/g, '')}` : '#';
  const phLink = phone ? `tel:${phone.replace(/[^0-9+]/g, '')}` : '#';

  const WhatsAppIcon = () => (
    <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
    </svg>
  );

  // Style 2: Neon Glow Effect
  if (style === 'style2') {
    return (
      <div className="fixed bottom-6 right-4 md:right-6 md:bottom-8 z-[99980] flex flex-col gap-5">
        {whatsapp && showWhatsapp && (
          <a href={waLink} target="_blank" rel="noopener noreferrer" aria-label="WhatsApp" className="relative group flex items-center justify-center p-3.5 rounded-2xl bg-black text-[#25D366] border border-[#25D366]/50 shadow-[0_0_20px_-5px_#25D366] hover:shadow-[0_0_30px_-5px_#25D366] transition-all hover:scale-110 active:scale-95">
            <WhatsAppIcon />
          </a>
        )}
        {phone && showPhone && (
          <a href={phLink} aria-label="Call Phone" className="relative group flex items-center justify-center p-3.5 rounded-2xl bg-black text-[#3B82F6] border border-[#3B82F6]/50 shadow-[0_0_20px_-5px_#3B82F6] hover:shadow-[0_0_30px_-5px_#3B82F6] transition-all hover:scale-110 active:scale-95">
            <Phone size={24} />
          </a>
        )}
      </div>
    );
  }

  // Style 3: Glassmorphism Card
  if (style === 'style3') {
    return (
      <div className="fixed bottom-6 right-4 md:right-6 md:bottom-8 z-[99980] flex flex-col gap-3 p-2 bg-white/20 backdrop-blur-xl border border-white/40 rounded-[2rem] shadow-xl">
        {whatsapp && showWhatsapp && (
          <a href={waLink} target="_blank" rel="noopener noreferrer" aria-label="WhatsApp" className="p-3 rounded-full bg-white/80 text-[#128C7E] hover:bg-white transition-all hover:scale-110 active:scale-95 flex items-center justify-center shadow-sm">
            <WhatsAppIcon />
          </a>
        )}
        {phone && showPhone && (
          <a href={phLink} aria-label="Call Phone" className="p-3 rounded-full bg-white/80 text-blue-600 hover:bg-white transition-all hover:scale-110 active:scale-95 flex items-center justify-center shadow-sm">
            <Phone size={24} />
          </a>
        )}
      </div>
    );
  }

  // Style 4: Floating Pill with Text
  if (style === 'style4') {
    return (
      <div className="fixed bottom-6 right-4 md:right-6 md:bottom-8 z-[99980] flex flex-col gap-3 items-end">
        {whatsapp && showWhatsapp && (
          <a href={waLink} target="_blank" rel="noopener noreferrer" aria-label="WhatsApp" className="flex items-center gap-3 px-5 py-3 rounded-full bg-[#25D366] text-white shadow-[0_8px_20px_-6px_rgba(37,211,102,0.6)] hover:bg-[#1fbd59] transition-all hover:-translate-y-1 active:translate-y-0 group">
            <span className="font-bold text-sm tracking-wide group-hover:pr-1 transition-all">Chat</span>
            <WhatsAppIcon />
          </a>
        )}
        {phone && showPhone && (
          <a href={phLink} aria-label="Call Phone" className="flex items-center gap-3 px-5 py-3 rounded-full bg-blue-600 text-white shadow-[0_8px_20px_-6px_rgba(37,130,246,0.6)] hover:bg-blue-700 transition-all hover:-translate-y-1 active:translate-y-0 group">
            <span className="font-bold text-sm tracking-wide group-hover:pr-1 transition-all">Call</span>
            <Phone size={24} />
          </a>
        )}
      </div>
    );
  }

  // Style 5: Minimal Outlined
  if (style === 'style5') {
    return (
      <div className="fixed bottom-6 right-4 md:right-6 md:bottom-8 z-[99980] flex flex-col gap-4">
        {whatsapp && showWhatsapp && (
          <a href={waLink} target="_blank" rel="noopener noreferrer" aria-label="WhatsApp" className="flex items-center justify-center p-3.5 rounded-full bg-white text-[#25D366] border-2 border-[#25D366] hover:bg-[#25D366] hover:text-white transition-colors shadow-lg active:scale-95">
            <WhatsAppIcon />
          </a>
        )}
        {phone && showPhone && (
          <a href={phLink} aria-label="Call Phone" className="flex items-center justify-center p-3.5 rounded-full bg-white text-slate-800 border-2 border-slate-800 hover:bg-slate-800 hover:text-white transition-colors shadow-lg active:scale-95">
            <Phone size={24} />
          </a>
        )}
      </div>
    );
  }

  // Style 6: Soft Shadows (Neumorphism)
  if (style === 'style6') {
    return (
      <div className="fixed bottom-6 right-4 md:right-6 md:bottom-8 z-[99980] flex flex-col gap-4">
        {whatsapp && showWhatsapp && (
          <a href={waLink} target="_blank" rel="noopener noreferrer" aria-label="WhatsApp" className="flex items-center justify-center p-3.5 rounded-full bg-[#f0f0f3] text-[#25D366] shadow-[8px_8px_16px_#d1d1d4,-8px_-8px_16px_#ffffff] hover:shadow-[inset_8px_8px_16px_#d1d1d4,inset_-8px_-8px_16px_#ffffff] transition-all">
            <WhatsAppIcon />
          </a>
        )}
        {phone && showPhone && (
          <a href={phLink} aria-label="Call Phone" className="flex items-center justify-center p-3.5 rounded-full bg-[#f0f0f3] text-blue-600 shadow-[8px_8px_16px_#d1d1d4,-8px_-8px_16px_#ffffff] hover:shadow-[inset_8px_8px_16px_#d1d1d4,inset_-8px_-8px_16px_#ffffff] transition-all">
            <Phone size={24} />
          </a>
        )}
      </div>
    );
  }

  // Style 7: Dynamic Expanding
  if (style === 'style7') {
    return (
      <div className="fixed bottom-6 right-4 md:right-6 md:bottom-8 z-[99980] flex flex-col gap-4 items-end">
        {whatsapp && showWhatsapp && (
          <a href={waLink} target="_blank" rel="noopener noreferrer" aria-label="WhatsApp" className="group flex items-center justify-center gap-0 overflow-hidden bg-white hover:bg-[#25D366] text-[#25D366] hover:text-white p-3.5 rounded-full shadow-[0_10px_25px_-5px_rgba(0,0,0,0.1)] transition-all hover:pr-5">
            <WhatsAppIcon />
            <span className="max-w-0 opacity-0 group-hover:max-w-xs group-hover:opacity-100 group-hover:pl-3 whitespace-nowrap font-bold text-sm transition-all duration-300">WhatsApp</span>
          </a>
        )}
        {phone && showPhone && (
          <a href={phLink} aria-label="Call Phone" className="group flex items-center justify-center gap-0 overflow-hidden bg-white hover:bg-slate-900 text-slate-900 hover:text-white p-3.5 rounded-full shadow-[0_10px_25px_-5px_rgba(0,0,0,0.1)] transition-all hover:pr-5">
            <Phone size={24} />
            <span className="max-w-0 opacity-0 group-hover:max-w-xs group-hover:opacity-100 group-hover:pl-3 whitespace-nowrap font-bold text-sm transition-all duration-300">Call Us</span>
          </a>
        )}
      </div>
    );
  }

  // Style 8: Monotone B&W
  if (style === 'style8') {
    return (
      <div className="fixed bottom-6 right-4 md:right-6 md:bottom-8 z-[99980] flex flex-col gap-3">
        {whatsapp && showWhatsapp && (
          <a href={waLink} target="_blank" rel="noopener noreferrer" aria-label="WhatsApp" className="flex items-center justify-center p-4 rounded-xl bg-black text-white hover:bg-white hover:text-black border-2 border-black transition-colors shadow-xl">
            <WhatsAppIcon />
          </a>
        )}
        {phone && showPhone && (
          <a href={phLink} aria-label="Call Phone" className="flex items-center justify-center p-4 rounded-xl bg-white text-black hover:bg-black hover:text-white border-2 border-black transition-colors shadow-xl">
            <Phone size={24} />
          </a>
        )}
      </div>
    );
  }

  // Style 9: Gradient Bubble
  if (style === 'style9') {
    return (
      <div className="fixed bottom-6 right-4 md:right-6 md:bottom-8 z-[99980] flex flex-col gap-4">
        {whatsapp && showWhatsapp && (
          <a href={waLink} target="_blank" rel="noopener noreferrer" aria-label="WhatsApp" className="flex items-center justify-center p-4 rounded-full bg-gradient-to-tr from-[#25D366] to-[#128C7E] text-white shadow-[0_10px_20px_-10px_#25D366] hover:scale-110 active:scale-95 transition-all">
            <WhatsAppIcon />
          </a>
        )}
        {phone && showPhone && (
          <a href={phLink} aria-label="Call Phone" className="flex items-center justify-center p-4 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 text-white shadow-[0_10px_20px_-10px_rgba(37,130,246,1)] hover:scale-110 active:scale-95 transition-all">
            <Phone size={24} />
          </a>
        )}
      </div>
    );
  }

  // Style 1: Classic Rounded (Default)
  return (
    <div className="fixed bottom-6 right-4 md:right-6 md:bottom-8 z-[99980] flex flex-col gap-4">
      {whatsapp && showWhatsapp && (
        <a href={waLink} target="_blank" rel="noopener noreferrer" aria-label="WhatsApp" className="bg-[#25D366] hover:bg-[#128C7E] text-white p-3.5 rounded-full shadow-[0_4px_14px_0_rgba(37,211,102,0.39)] transition-transform hover:scale-110 active:scale-95 flex items-center justify-center">
          <WhatsAppIcon />
        </a>
      )}
      {phone && showPhone && (
        <a href={phLink} aria-label="Call Phone" className="bg-blue-500 hover:bg-blue-600 text-white p-3.5 rounded-full shadow-[0_4px_14px_0_rgba(59,130,246,0.39)] transition-transform hover:scale-110 active:scale-95 flex items-center justify-center">
          <Phone size={24} />
        </a>
      )}
    </div>
  );
}
