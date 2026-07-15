import { useState } from 'react';
import { ShoppingBag } from 'lucide-react';
import UPIPaymentModal from './UPIPaymentModal';

interface ProductBuyButtonProps {
  product: any;
  content: any; // Entire website content to access settings
}

export default function ProductBuyButton({ product, content }: ProductBuyButtonProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const upiId = content?.settings_json?.upi_id;
  const enableProductPayments = content?.settings_json?.enable_product_payments ?? true;

  // If no UPI ID is configured or product payments are disabled, don't show the button
  if (!upiId || !enableProductPayments || !product?.price) return null;

  return (
    <>
      <button 
        onClick={(e) => { e.stopPropagation(); setIsModalOpen(true); }}
        className="mt-3 w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-2 shadow-sm hover:shadow active:scale-95"
      >
        <ShoppingBag size={14} /> Buy Now
      </button>

      <UPIPaymentModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        upiId={upiId}
        websiteName={content?.settings_json?.website_name || 'Business'}
        amount={product.price}
      />
    </>
  );
}
