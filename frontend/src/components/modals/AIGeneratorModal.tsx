import React, { useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { Sparkles, X, Loader2 } from 'lucide-react';

interface AIGeneratorModalProps {
  isOpen: boolean;
  onClose: () => void;
  category: string;
  onSuccess: (data: any) => void;
}

export default function AIGeneratorModal({ isOpen, onClose, category, onSuccess }: AIGeneratorModalProps) {
  const [businessName, setBusinessName] = useState('');
  const [description, setDescription] = useState('');
  const [contactInfo, setContactInfo] = useState('');
  const [vibe, setVibe] = useState('Modern & Professional');
  const [isGenerating, setIsGenerating] = useState(false);

  if (!isOpen) return null;

  const handleGenerate = async () => {
    if (!description.trim() || !businessName.trim()) {
      toast.error('Please enter a business name and description.');
      return;
    }
    
    setIsGenerating(true);
    try {
      const payload = {
        name: businessName,
        description,
        contact: contactInfo,
        vibe,
        category: 'Dynamic'
      };
      const res = await axios.post('http://localhost:8000/api/websites/generate/', payload);
      toast.success('Website generated successfully!');
      onSuccess({ ...res.data, _input: payload });
      onClose();
    } catch (err: any) {
      console.error(err);
      toast.error(err.response?.data?.error || 'Failed to generate website with AI.');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[99999] flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4">
      <div className="bg-white rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden relative animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="bg-indigo-600 p-6 text-white relative">
          <button 
            onClick={onClose} 
            disabled={isGenerating}
            className="absolute top-4 right-4 bg-white/20 hover:bg-white/30 text-white p-1.5 rounded-full transition-colors disabled:opacity-50"
          >
            <X size={18} />
          </button>
          <div className="flex items-center gap-3 mb-2">
            <div className="bg-white/20 p-2 rounded-xl">
              <Sparkles size={24} className="text-indigo-100" />
            </div>
            <h2 className="text-xl font-black">AI Website Generator</h2>
          </div>
          <p className="text-indigo-100 text-sm font-medium">
            Describe your business and let AI instantly design your website.
          </p>
        </div>

        {/* Body */}
        <div className="p-6 h-[400px] overflow-y-auto custom-scrollbar">
          
          <div className="mb-4">
            <label className="block text-xs font-black uppercase tracking-wider text-slate-500 mb-2">
              Business Name *
            </label>
            <input
              type="text"
              value={businessName}
              onChange={(e) => setBusinessName(e.target.value)}
              disabled={isGenerating}
              placeholder="e.g. Acme Corp"
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500 transition-all text-sm font-medium disabled:opacity-50"
            />
          </div>

          <div className="mb-4">
            <label className="block text-xs font-black uppercase tracking-wider text-slate-500 mb-2">
              Vibe / Tone
            </label>
            <select
              value={vibe}
              onChange={(e) => setVibe(e.target.value)}
              disabled={isGenerating}
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500 transition-all text-sm font-medium disabled:opacity-50"
            >
              <option value="Modern & Professional">Modern & Professional</option>
              <option value="Fun & Playful">Fun & Playful</option>
              <option value="Elegant & Premium">Elegant & Premium</option>
              <option value="Minimalist & Clean">Minimalist & Clean</option>
              <option value="Bold & Edgy">Bold & Edgy</option>
            </select>
          </div>

          <div className="mb-4">
            <label className="block text-xs font-black uppercase tracking-wider text-slate-500 mb-2">
              Contact Info (Optional)
            </label>
            <input
              type="text"
              value={contactInfo}
              onChange={(e) => setContactInfo(e.target.value)}
              disabled={isGenerating}
              placeholder="e.g. 123 Main St, hello@acme.com, (555) 123-4567"
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500 transition-all text-sm font-medium disabled:opacity-50"
            />
          </div>

          <div className="mb-6">
            <label className="block text-xs font-black uppercase tracking-wider text-slate-500 mb-2">
              Website Description *
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              disabled={isGenerating}
              placeholder="Detail your services, target audience, and what makes your business unique..."
              className="w-full h-32 px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500 resize-none transition-all text-sm font-medium disabled:opacity-50"
            />
          </div>

          <button
            onClick={handleGenerate}
            disabled={isGenerating || !description.trim() || !businessName.trim()}
            className="w-full bg-slate-900 hover:bg-black text-white font-black py-4 rounded-xl shadow-lg shadow-slate-900/20 transition-all active:scale-95 disabled:opacity-70 flex flex-col items-center justify-center gap-1"
          >
            {isGenerating ? (
              <>
                <div className="flex items-center gap-2">
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Designing your website...</span>
                </div>
                <span className="text-[10px] text-slate-400 font-medium">This may take up to 5 minutes. Please wait!</span>
              </>
            ) : (
              <>
                <Sparkles className="w-5 h-5 text-indigo-400" />
                Generate Now
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
