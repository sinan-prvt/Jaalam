import React, { useState, useRef } from 'react';
import { X, UploadCloud, FileJson, CheckCircle2, Upload } from 'lucide-react';
import { categoryThemes } from '../../utils/templateData';
import toast from 'react-hot-toast';

interface TemplateBuilderModalProps {
  onClose: () => void;
}

export default function TemplateBuilderModal({ onClose }: TemplateBuilderModalProps) {
  const [category, setCategory] = useState(Object.keys(categoryThemes)[0]);
  const [themeName, setThemeName] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFile(e.target.files[0]);
    }
  };

  const handleFile = (file: File) => {
    // We can check file type here if needed
    if (!file.name.endsWith('.json') && !file.name.endsWith('.zip')) {
      toast.error('Please upload a .json or .zip template file');
      return;
    }
    setSelectedFile(file);
    if (!themeName) {
      // Auto-fill template name from file name
      setThemeName(file.name.replace(/\.(json|zip)$/i, '').replace(/[-_]/g, ' '));
    }
  };

  const handleUpload = () => {
    if (!selectedFile) return;
    setIsUploading(true);
    
    // Simulate upload delay
    setTimeout(() => {
      setIsUploading(false);
      toast.success('Template uploaded successfully!');
      onClose();
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/90 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-xl max-h-[90vh] flex flex-col relative overflow-hidden animate-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="flex items-center justify-between p-6 lg:p-8 border-b border-slate-100 bg-slate-50 shrink-0">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-indigo-100 flex items-center justify-center text-indigo-600 shadow-inner">
              <UploadCloud size={28} />
            </div>
            <div>
              <h2 className="text-2xl font-black text-slate-800 tracking-tight">Upload Template</h2>
              <p className="text-sm text-slate-500 font-medium mt-0.5">Add a new template to the system</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-slate-200 rounded-full transition-colors text-slate-400 hover:text-slate-600"
          >
            <X size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 lg:p-8 overflow-y-auto flex-1 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Template Name</label>
              <input 
                type="text" 
                value={themeName}
                onChange={(e) => setThemeName(e.target.value)}
                placeholder="e.g. Dark Minimalist"
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-shadow"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Category</label>
              <select 
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-shadow"
              >
                {Object.keys(categoryThemes).map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Template File (.json or .zip)</label>
            <div 
              onDragOver={handleDragOver}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`border-2 border-dashed rounded-2xl p-8 flex flex-col items-center justify-center text-center cursor-pointer transition-all ${
                selectedFile 
                  ? 'border-indigo-500 bg-indigo-50/50' 
                  : 'border-slate-300 hover:border-indigo-400 hover:bg-slate-50 bg-white'
              }`}
            >
              <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handleFileChange} 
                className="hidden" 
                accept=".json,.zip"
              />
              
              {selectedFile ? (
                <div className="flex flex-col items-center animate-in zoom-in-95 duration-300">
                  <div className="w-16 h-16 bg-indigo-100 text-indigo-600 rounded-2xl flex items-center justify-center mb-3 shadow-inner">
                    <FileJson size={32} />
                  </div>
                  <div className="font-bold text-slate-800">{selectedFile.name}</div>
                  <div className="text-xs text-slate-500 mt-1">
                    {(selectedFile.size / 1024).toFixed(2)} KB • Ready to upload
                  </div>
                  <button 
                    onClick={(e) => { e.stopPropagation(); setSelectedFile(null); }}
                    className="mt-4 text-xs font-bold text-rose-500 hover:text-rose-700 bg-rose-50 px-3 py-1.5 rounded-lg transition-colors"
                  >
                    Remove File
                  </button>
                </div>
              ) : (
                <>
                  <div className="w-16 h-16 bg-slate-100 text-slate-400 rounded-2xl flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                    <Upload size={32} />
                  </div>
                  <div className="font-bold text-slate-700 mb-1">Click or drag file to this area to upload</div>
                  <div className="text-xs font-medium text-slate-500">Support for a single JSON template or ZIP package.</div>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 lg:p-8 border-t border-slate-100 bg-white shrink-0 flex flex-col sm:flex-row justify-end gap-3">
          <button 
            onClick={onClose}
            className="px-6 py-3 rounded-xl font-bold text-sm text-slate-600 hover:bg-slate-100 transition-colors w-full sm:w-auto"
          >
            Cancel
          </button>
          <button 
            onClick={handleUpload}
            disabled={!themeName.trim() || !selectedFile || isUploading}
            className="flex items-center justify-center gap-2 px-8 py-3 rounded-xl font-bold text-sm bg-indigo-600 text-white hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg shadow-indigo-600/30 w-full sm:w-auto"
          >
            {isUploading ? (
              <span className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Uploading...
              </span>
            ) : (
              <span className="flex items-center gap-2">
                <UploadCloud size={18} />
                Upload Template
              </span>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
