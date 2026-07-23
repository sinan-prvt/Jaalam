import React, { useState, useRef } from 'react';
import axios from 'axios';
import { Upload, FileJson, CheckCircle2, AlertCircle, Loader2, Download } from 'lucide-react';
import toast from 'react-hot-toast';

interface TemplateUploaderProps {
  websiteSlug: string;
  onSuccess: (newContent: any) => void;
  currentContent?: any;
}

export default function TemplateUploader({ websiteSlug, onSuccess, currentContent }: TemplateUploaderProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      handleFile(file);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      handleFile(file);
    }
  };

  const handleFile = async (file: File) => {
    if (!file.name.endsWith('.json')) {
      toast.error('Only .json template files are supported.');
      return;
    }

    setUploading(true);
    const formData = new FormData();
    formData.append('template', file);

    try {
      const res = await axios.post(`/api/websites/${websiteSlug}/upload_template/`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      toast.success('Template applied successfully!');
      onSuccess(res.data.content);
    } catch (err: any) {
      console.error(err);
      toast.error(err.response?.data?.error || 'Failed to upload template.');
    } finally {
      setUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleExport = () => {
    if (!currentContent) {
      toast.error('No content to export');
      return;
    }
    
    const exportData = {
      settings_json: currentContent.settings_json,
      custom_blocks_json: currentContent.custom_blocks_json,
      custom_css: currentContent.custom_css,
      custom_html: currentContent.custom_html,
      hero_title: currentContent.hero_title,
      about_text: currentContent.about_text,
      services_json: currentContent.services_json,
      gallery_json: currentContent.gallery_json,
      products_json: currentContent.products_json,
      contact_info: currentContent.contact_info
    };
    
    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${websiteSlug}-template.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success('Template exported!');
  };

  return (
    <div className="space-y-4">
      <div 
        className={`relative border-2 border-dashed rounded-2xl p-8 text-center transition-all ${
          isDragging ? 'border-indigo-500 bg-indigo-50' : 'border-slate-200 bg-white/50 hover:bg-slate-50'
        } ${uploading ? 'opacity-50 pointer-events-none' : ''}`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <input 
          type="file" 
          accept=".json" 
          className="hidden" 
          ref={fileInputRef} 
          onChange={handleFileSelect} 
        />
        
        <div className="flex flex-col items-center justify-center gap-4">
          {uploading ? (
            <Loader2 className="w-12 h-12 text-indigo-500 animate-spin" />
          ) : (
            <div className="w-16 h-16 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center mb-2">
              <FileJson className="w-8 h-8" />
            </div>
          )}
          
          <div>
            <h3 className="text-lg font-bold text-slate-900 mb-1">Upload JSON Template</h3>
            <p className="text-sm text-slate-500 max-w-xs mx-auto">
              Drag and drop your <span className="font-semibold">.json</span> template file here, or click to browse.
            </p>
          </div>

          <button 
            onClick={() => fileInputRef.current?.click()}
            className="mt-2 bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2.5 rounded-xl font-bold transition-all shadow-sm flex items-center gap-2"
          >
            <Upload size={18} /> Select File
          </button>
        </div>
      </div>
      
      {currentContent && (
        <div className="flex items-center justify-between p-4 bg-slate-100 rounded-xl border border-slate-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center shadow-sm">
              <Download size={20} className="text-slate-600" />
            </div>
            <div>
              <p className="text-sm font-bold text-slate-900">Export Current Template</p>
              <p className="text-xs text-slate-500">Download your design as a .json file</p>
            </div>
          </div>
          <button 
            onClick={handleExport}
            className="px-4 py-2 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 font-bold text-sm rounded-lg shadow-sm transition-colors"
          >
            Export
          </button>
        </div>
      )}
    </div>
  );
}
