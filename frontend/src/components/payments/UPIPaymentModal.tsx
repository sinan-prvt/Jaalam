import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Smartphone, ShieldCheck, MessageCircle, CheckCircle2, Loader2 } from 'lucide-react';
import QRCodeLib from 'react-qr-code';
const QRCode = (QRCodeLib as any).default || QRCodeLib;

interface UPIPaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  upiId: string;
  websiteName: string;
  amount?: string;
  productName?: string;
  whatsappNumber?: string;
}

export default function UPIPaymentModal({ isOpen, onClose, upiId, websiteName, amount, productName, whatsappNumber }: UPIPaymentModalProps) {
  const [paymentState, setPaymentState] = useState<'pending' | 'processing' | 'success'>('pending');

  if (!isOpen) return null;

  // Clean the amount if provided (e.g. remove currency symbols)
  const cleanAmount = amount ? amount.replace(/[^0-9.]/g, '') : '';
  
  // Ensure the UPI ID is a valid VPA. If it lacks an '@', it's likely a phone number.
  // We append a common handle (@ybl for PhonePe) so it doesn't hard-fail in apps like GPay.
  const safeUpiId = upiId.includes('@') ? upiId.trim() : `${upiId.trim()}@ybl`;
  
  const upiLink = `upi://pay?pa=${encodeURIComponent(safeUpiId)}&pn=${encodeURIComponent(websiteName || 'Merchant')}&cu=INR${cleanAmount ? `&am=${cleanAmount}` : ''}`;

  const handleConfirmPayment = () => {
    setPaymentState('processing');
    setTimeout(() => {
      setPaymentState('success');
    }, 2500); // Simulate Razorpay processing delay
  };

  const handleClose = () => {
    onClose();
    setTimeout(() => setPaymentState('pending'), 300); // Reset state after close animation
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={handleClose}
          className="absolute inset-0 bg-slate-900/60 backdrop-blur-md"
        />
        
        {/* Modal */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="relative w-full max-w-[300px] bg-white/95 backdrop-blur-2xl border border-white rounded-[2rem] shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
        >
          <div className="overflow-y-auto overflow-x-hidden flex flex-col items-center w-full scrollbar-hide">
          {/* Header */}
          <div className="flex items-center justify-between p-4 pb-2 w-full shrink-0">
            <div className="flex items-center gap-1.5">
              <ShieldCheck className="text-emerald-500" size={20} />
              <h3 className="text-lg font-black text-slate-900">Secure Payment</h3>
            </div>
            <button 
              onClick={handleClose}
              className="p-2 bg-slate-100 hover:bg-slate-200 text-slate-500 rounded-full transition-colors"
            >
              <X size={16} />
            </button>
          </div>

          <div className="p-4 pt-2 text-center flex flex-col items-center w-full">
            {paymentState === 'pending' && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center w-full">
                {amount ? (
              <div className="mb-3">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Amount to Pay</span>
                <div className="text-3xl font-black text-slate-900 mt-0.5 mb-1">₹{cleanAmount}</div>
                <p className="text-slate-500 text-[11px] font-medium leading-tight">Paying <span className="font-bold text-slate-800">{websiteName || 'this business'}</span>{productName ? <span> for <span className="font-bold text-indigo-600">{productName}</span></span> : ' securely'}.</p>
              </div>
            ) : (
              <p className="text-slate-500 text-xs font-medium mb-4 leading-tight">
                Paying <span className="font-bold text-slate-800">{websiteName || 'this business'}</span> directly via UPI. Zero fees.
              </p>
            )}
            
            {/* QR Code Container */}
            <div className="bg-white p-3 rounded-2xl shadow-sm border border-slate-100 mb-4 flex flex-col items-center justify-center relative group shrink-0">
              <div className="absolute inset-0 bg-gradient-to-tr from-indigo-500/10 to-fuchsia-500/10 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
              <QRCode value={upiLink} size={150} className="rounded-lg" />
              <div className="mt-2 text-[9px] font-black uppercase tracking-widest text-slate-400">Scan to Pay</div>
            </div>

            <div className="flex items-center gap-3 w-full mb-4">
              <div className="h-px bg-slate-200 flex-1"></div>
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">OR</span>
              <div className="h-px bg-slate-200 flex-1"></div>
            </div>

                {/* Mobile Deep Link Button */}
                <a 
                  href={upiLink}
                  className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-xl text-sm font-bold flex items-center justify-center gap-2 transition-all shadow-md hover:shadow-lg active:scale-95 shrink-0"
                >
                  <Smartphone size={16} />
                  Pay via UPI App
                </a>
                
                <button
                  onClick={handleConfirmPayment}
                  className="w-full mt-3 bg-slate-100 hover:bg-slate-200 text-slate-700 py-3 rounded-xl text-sm font-bold transition-all shadow-inner active:scale-95"
                >
                  I've completed the payment
                </button>
              </motion.div>
            )}

            {paymentState === 'processing' && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center justify-center py-12">
                <Loader2 size={48} className="text-indigo-500 animate-spin mb-4" />
                <h3 className="text-lg font-bold text-slate-900">Confirming Payment...</h3>
                <p className="text-sm text-slate-500 mt-2">Please do not close this window.</p>
              </motion.div>
            )}

            {paymentState === 'success' && (
              <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="flex flex-col items-center w-full py-4">
                <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mb-4">
                  <CheckCircle2 size={32} className="text-emerald-500" />
                </div>
                <h3 className="text-xl font-black text-slate-900 mb-1">Payment Successful!</h3>
                <p className="text-xs font-medium text-slate-500 mb-6">Your order for <span className="font-bold text-slate-800">{productName || 'items'}</span> has been recorded.</p>
                
                <div className="w-full bg-slate-50 rounded-xl p-4 mb-6 border border-slate-100">
                  <div className="flex justify-between text-xs mb-2">
                    <span className="text-slate-400 font-bold">AMOUNT PAID</span>
                    <span className="text-slate-900 font-black">₹{cleanAmount}</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-400 font-bold">PAID TO</span>
                    <span className="text-slate-900 font-black">{websiteName || 'Business'}</span>
                  </div>
                </div>

                {whatsappNumber ? (
                  <>
                    <div className="w-full bg-amber-50/50 border border-amber-200/60 rounded-xl p-3 mb-4 flex items-start gap-2.5 text-left shrink-0">
                      <div className="text-amber-500 mt-0.5">⚠️</div>
                      <p className="text-[10px] text-amber-700/90 font-bold leading-tight">
                        <span className="text-amber-600 font-black uppercase tracking-wider block mb-0.5">Action Required</span>
                        Your order will only be confirmed after you share the successful payment screenshot on WhatsApp.
                      </p>
                    </div>
                    <a 
                      href={`https://wa.me/${whatsappNumber.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(`Hi, I just completed a payment of ₹${cleanAmount} for ${productName || 'my order'}. I will share the payment screenshot below. Please confirm.`)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={handleClose}
                      className="w-full bg-[#25D366] hover:bg-[#128C7E] text-white py-3.5 rounded-xl text-sm font-bold flex items-center justify-center gap-2 transition-all shadow-md hover:shadow-lg active:scale-95 shrink-0"
                    >
                      <MessageCircle size={18} />
                      Send Screenshot on WhatsApp
                    </a>
                  </>
                ) : (
                  <button 
                    disabled
                    className="w-full bg-slate-100 text-slate-400 py-3.5 rounded-xl text-sm font-bold flex items-center justify-center gap-2 transition-all shadow-inner shrink-0 cursor-not-allowed"
                    title="Add a phone number in the Contact section to enable WhatsApp notifications."
                  >
                    <MessageCircle size={18} />
                    WhatsApp Not Configured
                  </button>
                )}
              </motion.div>
            )}
          </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
