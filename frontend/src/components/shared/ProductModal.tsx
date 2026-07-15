import React, { useEffect } from 'react';
import { X } from 'lucide-react';
import ProductBuyButton from '../payments/ProductBuyButton';

interface ProductModalProps {
  product: any;
  onClose: () => void;
  contactInfo: any;
  content?: any;
}

export default function ProductModal({ product, onClose, contactInfo, content }: ProductModalProps) {
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
      className="fixed inset-0 z-[9999] flex items-center justify-center p-4 md:p-6 bg-black/60 backdrop-blur-sm transition-opacity" 
      onClick={onClose}
    >
      <div 
        className="bg-white rounded-2xl max-w-4xl w-full overflow-hidden shadow-2xl transform transition-all flex flex-col md:flex-row max-h-[95vh] md:max-h-[80vh] relative"
        onClick={(e) => e.stopPropagation()}
      >
        <button 
          onClick={onClose} 
          className="absolute top-4 right-4 z-20 p-2 bg-white/50 hover:bg-white text-black rounded-full transition-colors backdrop-blur-md shadow-sm"
        >
          <X size={20} />
        </button>

        {/* Image Section */}
        <div className="w-full md:w-1/2 bg-gray-100 flex-shrink-0 h-40 sm:h-56 md:h-auto relative">
          <img loading="lazy" src={product.image || 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=800&q=80'} 
            alt={product.name} 
            className="w-full h-full object-cover absolute inset-0" 
          />
        </div>

        {/* Details Section */}
        <div className="w-full md:w-1/2 p-4 md:p-10 lg:p-12 overflow-y-auto flex flex-col">
          <div className="mt-auto md:mt-0 flex-1">
            <h3 className="text-xl md:text-4xl font-bold text-gray-900 leading-tight mb-2">{product.name}</h3>
            
            <div className="mb-3 md:mb-4 flex items-baseline gap-2">
              <span className="text-lg md:text-2xl font-black text-emerald-600">{product.price}</span>
              {product.originalPrice && (
                <span className="text-sm md:text-lg text-gray-400 line-through">
                  {product.originalPrice}
                </span>
              )}
            </div>
            
            <div className="w-8 md:w-12 h-1 bg-black mb-4 md:mb-8"></div>
            
            <h4 className="text-[10px] md:text-sm font-bold text-gray-900 uppercase tracking-wider mb-2 md:mb-3">Details</h4>
            <p className="text-gray-600 leading-relaxed mb-4 md:mb-10 text-xs md:text-lg">
              {product.description || 'Experience the best quality with this carefully selected product, guaranteed to meet your expectations. Crafted with precision and care to bring you the finest experience possible.'}
            </p>
          </div>

          <div className="mt-auto pt-4 md:pt-6 border-t border-gray-100">
            {content && content.settings_json?.upi_id && content.settings_json?.enable_product_payments !== false && (
              <div>
                <ProductBuyButton product={product} content={content} />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
