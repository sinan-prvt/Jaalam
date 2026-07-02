import React, { useEffect } from 'react';
import { X } from 'lucide-react';

interface ProductModalProps {
  product: any;
  onClose: () => void;
  contactInfo: any;
}

export default function ProductModal({ product, onClose, contactInfo }: ProductModalProps) {
  // Close on Escape key
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [onClose]);

  if (!product) return null;

  const handleOrder = () => {
    const phone = contactInfo?.phone?.replace(/\D/g, '') || '1234567890';
    const message = encodeURIComponent(`Hi, I'm interested in ordering ${product.name}`);
    window.open(`https://wa.me/${phone}?text=${message}`, '_blank');
  };

  return (
    <div 
      className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm transition-opacity" 
      onClick={onClose}
    >
      <div 
        className="bg-white rounded-2xl max-w-md w-full overflow-hidden shadow-2xl transform transition-all flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="relative aspect-video bg-gray-100 flex-shrink-0">
          <img 
            src={product.image || 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=800&q=80'} 
            alt={product.name} 
            className="w-full h-full object-cover" 
          />
          <button 
            onClick={onClose} 
            className="absolute top-3 right-3 p-2 bg-black/50 hover:bg-black/80 text-white rounded-full transition-colors backdrop-blur-sm"
          >
            <X size={20} />
          </button>
        </div>
        <div className="p-6 md:p-8 overflow-y-auto">
          <div className="flex justify-between items-start gap-4 mb-4">
            <h3 className="text-2xl font-bold text-gray-900 leading-tight">{product.name}</h3>
            <span className="text-xl font-black text-emerald-600 whitespace-nowrap">{product.price}</span>
          </div>
          {product.originalPrice && (
            <div className="text-sm text-gray-500 line-through mb-4 -mt-2">
              {product.originalPrice}
            </div>
          )}
          <p className="text-gray-600 leading-relaxed mb-8">
            {product.description || 'Experience the best quality with this carefully selected product, guaranteed to meet your expectations.'}
          </p>
          <button 
            onClick={handleOrder}
            className="w-full bg-[#25D366] hover:bg-[#128C7E] text-white font-bold py-4 rounded-xl transition-colors shadow-lg shadow-green-500/30 flex items-center justify-center gap-2"
          >
            <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
              <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path>
            </svg>
            Order on WhatsApp
          </button>
        </div>
      </div>
    </div>
  );
}
