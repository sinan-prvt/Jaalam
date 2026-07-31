import React, { useState } from 'react';
import { Plus, Trash2, Save, Download, CreditCard, ChevronLeft, Image as ImageIcon } from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { QRCodeSVG } from 'qrcode.react';

interface InvoiceItem {
  id?: number;
  description: string;
  quantity: number;
  price: number;
  total: number;
}

interface InvoiceBuilderProps {
  onBack: () => void;
  websiteId: number | string;
  initialBusinessName?: string;
  onSuccess: () => void;
}

export default function InvoiceBuilder({ onBack, websiteId, initialBusinessName, onSuccess }: InvoiceBuilderProps) {
  const [customerName, setCustomerName] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [businessName, setBusinessName] = useState(initialBusinessName || 'My Business');
  const [logoUrl, setLogoUrl] = useState<string | null>(null);
  const [upiId, setUpiId] = useState('');
  const [items, setItems] = useState<InvoiceItem[]>([]);
  const [gstPercentage, setGstPercentage] = useState(18);
  const [loading, setLoading] = useState(false);
  const [invoiceId, setInvoiceId] = useState<number | null>(null);

  const addItem = () => {
    setItems([...items, { description: '', quantity: 1, price: 0, total: 0 }]);
  };

  const updateItem = (index: number, field: keyof InvoiceItem, value: string | number) => {
    const newItems = [...items];
    const item = { ...newItems[index] };
    
    if (field === 'description') {
      item.description = value as string;
    } else {
      item[field] = Number(value);
      if (field === 'quantity' || field === 'price') {
        item.total = item.quantity * item.price;
      }
    }
    
    newItems[index] = item;
    setItems(newItems);
  };

  const removeItem = (index: number) => {
    setItems(items.filter((_, i) => i !== index));
  };

  const subtotal = items.reduce((sum, item) => sum + item.total, 0);
  const gstAmount = (subtotal * gstPercentage) / 100;
  const totalAmount = subtotal + gstAmount;

  const handleSave = async () => {
    if (!customerName || items.length === 0) {
      toast.error('Customer name and at least one item are required');
      return;
    }

    setLoading(true);
    try {
      const payload = {
        website: websiteId,
        customer_name: customerName,
        customer_email: customerEmail,
        customer_phone: customerPhone,
        status: 'UNPAID',
        subtotal,
        gst_percentage: gstPercentage,
        gst_amount: gstAmount,
        total_amount: totalAmount,
        items: items.map(({ description, quantity, price, total }) => ({
          description, quantity, price, total
        }))
      };

      const res = await axios.post('/api/billing/invoices/', payload, { withCredentials: true });
      toast.success('Invoice created successfully');
      setInvoiceId(res.data.id);
      onSuccess();
    } catch (err) {
      console.error(err);
      toast.error('Failed to create invoice');
    } finally {
      setLoading(false);
    }
  };

  const generatePDF = async () => {
    toast.loading('Generating PDF...', { id: 'pdf' });
    try {
      const { jsPDF } = await import('jspdf');
      const html2canvas = (await import('html2canvas')).default;
      
      const element = document.getElementById('invoice-preview-container');
      if (!element) throw new Error('Invoice container not found');

      // Temporarily ensure it's visible if it was hidden
      const canvas = await html2canvas(element, { scale: 2 });
      const imgData = canvas.toDataURL('image/png');
      
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
      
      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save(`Invoice_${customerName.replace(/\s+/g, '_')}_${invoiceId || 'Draft'}.pdf`);
      
      toast.success('PDF Downloaded!', { id: 'pdf' });
    } catch (err) {
      console.error(err);
      toast.error('Failed to generate PDF', { id: 'pdf' });
    }
  };

  // UPI Link format: upi://pay?pa=UPI_ID&pn=NAME&am=AMOUNT&cu=INR
  const upiLink = upiId 
    ? `upi://pay?pa=${encodeURIComponent(upiId)}&pn=${encodeURIComponent(businessName)}&am=${totalAmount.toFixed(2)}&cu=INR`
    : `upi://pay?pa=shop@upi&pn=${encodeURIComponent(businessName)}&am=${totalAmount.toFixed(2)}&cu=INR`;

  return (
    <div className="flex flex-col h-full bg-slate-50 relative">
      <div className="p-6 border-b border-slate-200 bg-white flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button onClick={onBack} className="p-2 hover:bg-slate-100 rounded-lg text-slate-500 transition-colors">
            <ChevronLeft size={20} />
          </button>
          <h2 className="text-xl font-black text-slate-900">New Invoice</h2>
        </div>
        <div className="flex gap-3">
          {invoiceId && (
            <button onClick={generatePDF} className="bg-indigo-50 text-indigo-600 px-4 py-2 rounded-xl font-bold flex items-center gap-2 hover:bg-indigo-100 transition-colors">
              <Download size={16} /> PDF
            </button>
          )}
          <button 
            onClick={handleSave} 
            disabled={loading || invoiceId !== null} 
            className="bg-indigo-600 text-white px-6 py-2 rounded-xl font-bold flex items-center gap-2 hover:bg-indigo-700 transition-colors disabled:opacity-50"
          >
            <Save size={16} /> {invoiceId ? 'Saved' : 'Save Invoice'}
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-6 flex flex-col lg:flex-row gap-6">
        
        {/* Editor Form */}
        <div className="flex-1 space-y-6">
          {/* Business Details Form */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 space-y-4">
            <h3 className="font-bold text-slate-900 mb-4">Your Business Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Business Logo (Optional)</label>
                <div className="flex items-center gap-4">
                  {logoUrl ? (
                    <div className="relative w-16 h-16 rounded-xl border border-slate-200 overflow-hidden bg-slate-50 flex items-center justify-center shrink-0">
                      <img src={logoUrl} alt="Logo" className="max-w-full max-h-full object-contain" />
                      <button onClick={() => setLogoUrl(null)} className="absolute -top-1 -right-1 bg-rose-500 text-white p-1 rounded-full shadow-sm hover:scale-110 transition-transform">
                        <Trash2 size={12} />
                      </button>
                    </div>
                  ) : (
                    <div className="w-16 h-16 rounded-xl border-2 border-dashed border-slate-200 bg-slate-50 flex items-center justify-center text-slate-400 shrink-0">
                      <ImageIcon size={24} />
                    </div>
                  )}
                  <div className="flex-1">
                    <input 
                      type="file" 
                      accept="image/*" 
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          const reader = new FileReader();
                          reader.onloadend = () => setLogoUrl(reader.result as string);
                          reader.readAsDataURL(file);
                        }
                      }}
                      className="text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-bold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100 transition-colors"
                    />
                    <p className="text-[10px] text-slate-400 mt-1">Upload a small square logo (PNG or JPG)</p>
                  </div>
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Business Name</label>
                <input type="text" value={businessName} onChange={e => setBusinessName(e.target.value)} className="w-full border border-slate-200 rounded-xl px-4 py-2 focus:ring-2 focus:ring-indigo-500/20 outline-none" placeholder="Your Shop Name" />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-2">UPI ID (For QR Code)</label>
                <input type="text" value={upiId} onChange={e => setUpiId(e.target.value)} className="w-full border border-slate-200 rounded-xl px-4 py-2 focus:ring-2 focus:ring-indigo-500/20 outline-none" placeholder="e.g. shop@okicici" />
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 space-y-4">
            <h3 className="font-bold text-slate-900 mb-4">Customer Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Customer Name</label>
                <input type="text" value={customerName} onChange={e => setCustomerName(e.target.value)} className="w-full border border-slate-200 rounded-xl px-4 py-2 focus:ring-2 focus:ring-indigo-500/20 outline-none" placeholder="John Doe" />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Phone</label>
                <input type="tel" value={customerPhone} onChange={e => setCustomerPhone(e.target.value)} className="w-full border border-slate-200 rounded-xl px-4 py-2 focus:ring-2 focus:ring-indigo-500/20 outline-none" placeholder="+91 9876543210" />
              </div>
              <div className="md:col-span-2">
                <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Email (Optional)</label>
                <input type="email" value={customerEmail} onChange={e => setCustomerEmail(e.target.value)} className="w-full border border-slate-200 rounded-xl px-4 py-2 focus:ring-2 focus:ring-indigo-500/20 outline-none" placeholder="john@example.com" />
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-slate-900">Items</h3>
              <button onClick={addItem} className="text-indigo-600 bg-indigo-50 px-3 py-1.5 rounded-lg text-sm font-bold flex items-center gap-1 hover:bg-indigo-100">
                <Plus size={14} /> Add Item
              </button>
            </div>
            
            <div className="space-y-3">
              {items.map((item, index) => (
                <div key={index} className="flex flex-col md:flex-row gap-3 items-start md:items-center bg-slate-50 p-3 rounded-xl border border-slate-100">
                  <div className="flex-1 w-full">
                    <input type="text" value={item.description} onChange={e => updateItem(index, 'description', e.target.value)} placeholder="Item Description" className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-sm outline-none" />
                  </div>
                  <div className="w-24 shrink-0">
                    <input type="number" min="1" value={item.quantity} onChange={e => updateItem(index, 'quantity', e.target.value)} placeholder="Qty" className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-sm outline-none" />
                  </div>
                  <div className="w-32 shrink-0">
                    <input type="number" min="0" value={item.price} onChange={e => updateItem(index, 'price', e.target.value)} placeholder="Price (₹)" className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-sm outline-none" />
                  </div>
                  <div className="w-32 shrink-0 font-bold text-right text-slate-700">
                    ₹{item.total.toFixed(2)}
                  </div>
                  <button onClick={() => removeItem(index)} className="p-2 text-rose-500 hover:bg-rose-50 rounded-lg transition-colors">
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
              {items.length === 0 && (
                <div className="text-center py-8 text-slate-400 text-sm">No items added yet.</div>
              )}
            </div>

            <div className="mt-8 border-t border-slate-100 pt-6 flex flex-col items-end space-y-3">
              <div className="flex justify-between w-full md:w-64 text-sm font-medium text-slate-600">
                <span>Subtotal</span>
                <span>₹{subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between items-center w-full md:w-64 text-sm font-medium text-slate-600">
                <span className="flex items-center gap-2">
                  GST 
                  <input type="number" value={gstPercentage} onChange={e => setGstPercentage(Number(e.target.value))} className="w-16 border border-slate-200 rounded px-2 py-1 text-xs" />%
                </span>
                <span>₹{gstAmount.toFixed(2)}</span>
              </div>
              <div className="flex justify-between w-full md:w-64 text-lg font-black text-slate-900 border-t border-slate-200 pt-3">
                <span>Total</span>
                <span>₹{totalAmount.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Live Preview / PDF Container */}
        <div className="w-full lg:w-[400px] shrink-0">
          <div className="bg-slate-200 p-4 rounded-3xl h-full flex flex-col shadow-inner">
            <h3 className="text-sm font-bold text-slate-500 uppercase tracking-widest text-center mb-4">Receipt Preview</h3>
            
            <div id="invoice-preview-container" className="bg-white p-8 shadow-sm rounded-2xl flex-1 max-h-[850px] relative overflow-hidden text-slate-800">
              {/* Receipt Content */}
              <div className="text-center mb-8 border-b border-dashed border-slate-300 pb-6">
                {logoUrl ? (
                  <div className="w-16 h-16 mx-auto mb-3 flex items-center justify-center">
                    <img src={logoUrl} alt="Business Logo" className="max-w-full max-h-full object-contain" />
                  </div>
                ) : (
                  <div className="w-12 h-12 bg-indigo-600 text-white rounded-full flex items-center justify-center mx-auto mb-3 font-black text-xl shadow-md">
                    {businessName.charAt(0).toUpperCase()}
                  </div>
                )}
                <h2 className="text-xl font-black text-slate-900 mb-2">{businessName}</h2>
                <h1 className="text-lg font-bold tracking-widest text-slate-400 uppercase">TAX INVOICE</h1>
                <p className="text-xs text-slate-500 mt-1">Invoice #{invoiceId || 'DRAFT'}</p>
                <p className="text-xs text-slate-500">{new Date().toLocaleDateString()}</p>
              </div>

              <div className="mb-6 space-y-1">
                <p className="text-xs font-bold text-slate-500 uppercase">Bill To:</p>
                <p className="font-bold">{customerName || 'Customer Name'}</p>
                {customerPhone && <p className="text-sm">{customerPhone}</p>}
                {customerEmail && <p className="text-sm">{customerEmail}</p>}
              </div>

              <table className="w-full text-sm mb-6">
                <thead>
                  <tr className="border-b border-slate-200 text-left">
                    <th className="py-2 text-xs text-slate-500 font-bold uppercase">Item</th>
                    <th className="py-2 text-xs text-slate-500 font-bold uppercase text-right">Qty</th>
                    <th className="py-2 text-xs text-slate-500 font-bold uppercase text-right">Amt</th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((item, i) => (
                    <tr key={i} className="border-b border-slate-100 last:border-0">
                      <td className="py-3 font-medium">{item.description || '-'}</td>
                      <td className="py-3 text-right">{item.quantity}</td>
                      <td className="py-3 text-right">₹{item.total.toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <div className="border-t border-slate-200 pt-4 space-y-2 mb-8">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500">Subtotal</span>
                  <span className="font-medium">₹{subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500">GST ({gstPercentage}%)</span>
                  <span className="font-medium">₹{gstAmount.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-lg font-black border-t-2 border-slate-900 pt-2 mt-2">
                  <span>TOTAL</span>
                  <span>₹{totalAmount.toFixed(2)}</span>
                </div>
              </div>

              {/* UPI QR Code Section */}
              <div className="flex flex-col items-center justify-center p-4 bg-slate-50 rounded-xl border border-slate-200 mt-auto">
                <p className="text-xs font-bold text-slate-500 uppercase mb-3">Scan to Pay via UPI</p>
                <div className="bg-white p-2 rounded-xl shadow-sm border border-slate-100">
                  <QRCodeSVG value={upiLink} size={100} level="H" />
                </div>
                <p className="text-xs font-mono text-slate-400 mt-2">{upiId || 'Configure UPI ID'}</p>
              </div>
              
              <div className="text-center mt-6 pt-4 border-t border-dashed border-slate-300">
                <p className="text-xs font-bold text-slate-400">Thank you for your business!</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
