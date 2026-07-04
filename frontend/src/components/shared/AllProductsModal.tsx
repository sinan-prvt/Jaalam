import React from 'react';
import { X } from 'lucide-react';

export default function AllProductsModal({ 
  isOpen, 
  onClose, 
  products, 
  onProductSelect 
}: { 
  isOpen: boolean; 
  onClose: () => void; 
  products: any[]; 
  onProductSelect: (p: any) => void; 
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[90] bg-white overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
      <div className="max-w-7xl mx-auto px-6 py-20 relative">
        <button 
          className="fixed top-8 right-8 text-black hover:text-gray-600 z-[100] bg-gray-100 rounded-full p-2 shadow-md transition-colors" 
          onClick={onClose}
        >
          <X size={24} />
        </button>
        <div className="text-center mb-16 fade-in">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-gray-900 tracking-tight">All Products</h2>
          <div className="w-16 h-1 bg-black mx-auto"></div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {products.map((p, i) => (
            <div 
              key={i} 
              className="group cursor-pointer flex flex-col bg-gray-50 rounded-2xl overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border border-gray-100" 
              onClick={() => {
                onProductSelect(p);
              }}
            >
              <div className="relative aspect-[4/5] overflow-hidden bg-white p-4">
                <img 
                  src={p.image || 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=600&q=80'} 
                  onError={(e) => { e.currentTarget.src = 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=600&q=80'; }}
                  alt={p.name} 
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
                />
              </div>
              <div className="p-6 flex-1 flex flex-col">
                <h3 className="font-bold text-lg mb-2 text-gray-900 line-clamp-2">{p.name}</h3>
                <p className="text-gray-900 font-semibold text-lg mt-auto">{p.price}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
