import React, { useState } from 'react';
import { X, LayoutTemplate, Download, Plus, Check } from 'lucide-react';
import { categoryThemes } from '../../utils/templateData';

interface TemplateBuilderModalProps {
  onClose: () => void;
}

const AVAILABLE_BLOCKS = [
  { id: 'hero', name: 'Hero Section', description: 'Main banner with headline and CTA' },
  { id: 'features', name: 'Features Grid', description: 'Grid of features with icons' },
  { id: 'services', name: 'Services List', description: 'Detailed list of services' },
  { id: 'gallery', name: 'Image Gallery', description: 'Masonry or grid image gallery' },
  { id: 'testimonials', name: 'Testimonials', description: 'Customer reviews' },
  { id: 'pricing', name: 'Pricing Tables', description: 'Subscription or product pricing' },
  { id: 'contact', name: 'Contact Form', description: 'Form with address and map' },
  { id: 'footer', name: 'Footer', description: 'Site footer with links' }
];

export default function TemplateBuilderModal({ onClose }: TemplateBuilderModalProps) {
  const [category, setCategory] = useState(Object.keys(categoryThemes)[0]);
  const [themeName, setThemeName] = useState('');
  const [selectedBlocks, setSelectedBlocks] = useState<string[]>(['hero', 'footer']);
  const [isGenerating, setIsGenerating] = useState(false);

  const toggleBlock = (blockId: string) => {
    if (selectedBlocks.includes(blockId)) {
      setSelectedBlocks(selectedBlocks.filter(id => id !== blockId));
    } else {
      setSelectedBlocks([...selectedBlocks, blockId]);
    }
  };

  const handleDownload = () => {
    setIsGenerating(true);
    
    // Generate dummy blocks based on selection
    const blocks = selectedBlocks.map(blockId => ({
      id: `${blockId}-${Math.random().toString(36).substring(7)}`,
      type: blockId,
      content: {
        title: `Default ${blockId} title`,
        description: `This is a generic description for the ${blockId} block.`
      },
      style: {
        backgroundColor: '#ffffff',
        textColor: '#000000'
      }
    }));

    const templateData = {
      theme: themeName || 'New Custom Theme',
      category: category,
      version: '1.0',
      settings_json: {
        website_name: `My ${themeName || 'Custom'} Site`,
        blocks: blocks
      },
      custom_blocks_json: [],
      services_json: [],
      gallery_json: [],
      products_json: []
    };

    const blob = new Blob([JSON.stringify(templateData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = `${(themeName || 'custom').toLowerCase().replace(/\s+/g, '_')}_template.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    setTimeout(() => {
      setIsGenerating(false);
      onClose();
    }, 1000);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/90 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col relative overflow-hidden animate-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-100 bg-slate-50 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-100 flex items-center justify-center text-indigo-600">
              <LayoutTemplate size={24} />
            </div>
            <div>
              <h2 className="text-xl font-black text-slate-800 tracking-tight">Template Builder</h2>
              <p className="text-xs text-slate-500 font-medium mt-0.5">Visually construct a dynamic JSON template</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-slate-200 rounded-full transition-colors text-slate-400 hover:text-slate-600"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Template Name</label>
              <input 
                type="text" 
                value={themeName}
                onChange={(e) => setThemeName(e.target.value)}
                placeholder="e.g. Dark Minimalist"
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-shadow"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Category</label>
              <select 
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-shadow"
              >
                {Object.keys(categoryThemes).map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="space-y-4">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Include Blocks</label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {AVAILABLE_BLOCKS.map(block => (
                <button
                  key={block.id}
                  onClick={() => toggleBlock(block.id)}
                  className={`flex items-start p-3 rounded-xl border text-left transition-all ${
                    selectedBlocks.includes(block.id) 
                      ? 'border-indigo-500 bg-indigo-50 ring-1 ring-indigo-500' 
                      : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50'
                  }`}
                >
                  <div className={`mt-0.5 shrink-0 w-4 h-4 rounded flex items-center justify-center mr-3 border ${
                    selectedBlocks.includes(block.id) 
                      ? 'bg-indigo-500 border-indigo-500 text-white' 
                      : 'border-slate-300 bg-white text-transparent'
                  }`}>
                    <Check size={12} strokeWidth={4} />
                  </div>
                  <div>
                    <div className={`text-sm font-bold ${selectedBlocks.includes(block.id) ? 'text-indigo-900' : 'text-slate-700'}`}>
                      {block.name}
                    </div>
                    <div className={`text-[10px] mt-0.5 ${selectedBlocks.includes(block.id) ? 'text-indigo-600/70' : 'text-slate-500'}`}>
                      {block.description}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-slate-100 bg-white shrink-0 flex justify-end gap-3">
          <button 
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl font-bold text-sm text-slate-600 hover:bg-slate-100 transition-colors"
          >
            Cancel
          </button>
          <button 
            onClick={handleDownload}
            disabled={!themeName.trim() || selectedBlocks.length === 0 || isGenerating}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm bg-indigo-600 text-white hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-md shadow-indigo-200"
          >
            {isGenerating ? (
              <span className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Generating...
              </span>
            ) : (
              <span className="flex items-center gap-2">
                <Download size={18} />
                Download JSON Template
              </span>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
