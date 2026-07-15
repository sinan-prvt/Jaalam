import { useState } from 'react';
import { ShoppingBag, Loader2 } from 'lucide-react';
import UPIPaymentModal from './UPIPaymentModal';

interface ProductBuyButtonProps {
  product: any;
  content: any; // Entire website content to access settings
}

export default function ProductBuyButton({ product, content }: ProductBuyButtonProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const upiId = content?.settings_json?.upi_id;
  const enableProductPayments = content?.settings_json?.enable_product_payments ?? true;

  // If product payments disabled, don't show the button
  if (!enableProductPayments || !product?.price) return null;

  const hasValidUpi = upiId && upiId.length >= 5;

  const handleBuyClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!hasValidUpi) return;
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setIsModalOpen(true);
    }, 2000);
  };

  return (
    <>
      <button 
        onClick={handleBuyClick}
        disabled={isLoading || !hasValidUpi}
        title={!hasValidUpi ? "Please configure a valid UPI ID to enable payments" : ""}
        className={`mt-3 w-full py-3 rounded-lg text-sm font-bold transition-all flex items-center justify-center gap-2 shadow-sm ${!hasValidUpi ? 'bg-slate-300 text-slate-500 cursor-not-allowed opacity-80' : 'bg-indigo-600 hover:bg-indigo-700 text-white hover:shadow active:scale-95 disabled:opacity-80 disabled:cursor-not-allowed'}`}
      >
        {isLoading ? <Loader2 size={16} className="animate-spin" /> : <ShoppingBag size={16} />}
        {isLoading ? 'Processing...' : 'Buy Now'}
      </button>

      <UPIPaymentModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        upiId={upiId}
        websiteName={content?.settings_json?.website_name || 'Business'}
        amount={product.price}
        productName={product.name}
        whatsappNumber={content?.contact_info?.whatsapp || content?.contact_info?.phone}
      />
    </>
  );
}
