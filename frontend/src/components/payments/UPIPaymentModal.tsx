import { motion, AnimatePresence } from 'framer-motion';
import { X, Smartphone, ShieldCheck } from 'lucide-react';
import QRCodeLib from 'react-qr-code';
const QRCode = (QRCodeLib as any).default || QRCodeLib;

interface UPIPaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  upiId: string;
  websiteName: string;
}

export default function UPIPaymentModal({ isOpen, onClose, upiId, websiteName }: UPIPaymentModalProps) {
  if (!isOpen) return null;

  const upiLink = `upi://pay?pa=${encodeURIComponent(upiId)}&pn=${encodeURIComponent(websiteName || 'Merchant')}&cu=INR`;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-slate-900/60 backdrop-blur-md"
        />
        
        {/* Modal */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="relative w-full max-w-sm bg-white/90 backdrop-blur-2xl border border-white rounded-3xl shadow-2xl overflow-hidden flex flex-col"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 pb-2">
            <div className="flex items-center gap-2">
              <ShieldCheck className="text-emerald-500" size={24} />
              <h3 className="text-xl font-black text-slate-900">Secure Payment</h3>
            </div>
            <button 
              onClick={onClose}
              className="p-2 bg-slate-100 hover:bg-slate-200 text-slate-500 rounded-full transition-colors"
            >
              <X size={16} />
            </button>
          </div>

          <div className="p-6 pt-2 text-center flex flex-col items-center">
            <p className="text-slate-500 text-sm font-medium mb-6">
              Paying <span className="font-bold text-slate-800">{websiteName || 'this business'}</span> directly via UPI. Zero fees.
            </p>
            
            {/* QR Code Container */}
            <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 mb-6 flex flex-col items-center justify-center relative group">
              <div className="absolute inset-0 bg-gradient-to-tr from-indigo-500/10 to-fuchsia-500/10 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
              <QRCode value={upiLink} size={200} className="rounded-lg" />
              <div className="mt-3 text-[10px] font-black uppercase tracking-widest text-slate-400">Scan to Pay</div>
            </div>

            <div className="flex items-center gap-4 w-full mb-6">
              <div className="h-px bg-slate-200 flex-1"></div>
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">OR</span>
              <div className="h-px bg-slate-200 flex-1"></div>
            </div>

            {/* Mobile Deep Link Button */}
            <a 
              href={upiLink}
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3.5 rounded-xl font-bold flex items-center justify-center gap-2 transition-all shadow-md hover:shadow-lg active:scale-95"
            >
              <Smartphone size={18} />
              Pay via UPI App
            </a>
            <p className="text-xs text-slate-400 font-medium mt-3">
              (Works on mobile with GPay, PhonePe, Paytm, etc.)
            </p>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
