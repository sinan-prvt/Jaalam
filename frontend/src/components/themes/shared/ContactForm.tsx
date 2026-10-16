import React, { useState } from 'react';
import axios from 'axios';
import { Send, CheckCircle } from 'lucide-react';

interface ContactFormProps {
  websiteId: number | string;
  primaryColor?: string;
  primaryColorHover?: string;
  buttonShape?: string;
  inputStyles?: string;
}

// Defaults inherit the surrounding text color, so the form is readable on light and dark sections alike
const ADAPTIVE_INPUT = 'bg-current/[0.04] border-current/15 text-inherit placeholder:text-current/40 focus:border-current/60 focus:bg-current/[0.07]';

export default function ContactForm({
  websiteId,
  primaryColor,
  primaryColorHover,
  buttonShape = 'rounded-lg',
  inputStyles = ADAPTIVE_INPUT
}: ContactFormProps) {
  const buttonColors = primaryColor
    ? `${primaryColor} ${primaryColorHover || 'hover:opacity-90'} text-white`
    : 'border border-current/70 text-inherit hover:bg-current/10';
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', message: '' });
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    try {
      await axios.post('/api/customers/', {
        website: websiteId,
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        notes: formData.message,
        status: 'NEW'
      });
      setStatus('success');
      setFormData({ name: '', email: '', phone: '', message: '' });
    } catch (err) {
      console.error(err);
      setStatus('error');
    }
  };

  if (status === 'success') {
    return (
      <div className="flex flex-col items-center justify-center p-8 text-center animate-in fade-in zoom-in duration-500 w-full max-w-2xl mx-auto">
        <div className={`w-16 h-16 rounded-full ${primaryColor || 'bg-emerald-500'} flex items-center justify-center mb-6`}>
          <CheckCircle size={32} className="text-white" />
        </div>
        <h4 className="text-2xl font-bold mb-2">Message Sent!</h4>
        <p className="opacity-80">Thank you for reaching out. We will get back to you shortly.</p>
        <button 
          onClick={() => setStatus('idle')}
          className="mt-6 text-sm underline hover:opacity-70 transition-opacity"
        >
          Send another message
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-2xl mx-auto space-y-4 text-left">
      <div>
        <label className="block text-[10px] font-bold uppercase tracking-wider mb-1.5 opacity-70">Name</label>
        <input 
          required
          type="text" 
          value={formData.name}
          onChange={(e) => setFormData({...formData, name: e.target.value})}
          className={`w-full px-4 py-3 border focus:outline-none transition-colors ${inputStyles} ${buttonShape}`}
          placeholder="Your Name"
        />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-[10px] font-bold uppercase tracking-wider mb-1.5 opacity-70">Email</label>
          <input 
            type="email" 
            value={formData.email}
            onChange={(e) => setFormData({...formData, email: e.target.value})}
            className={`w-full px-4 py-3 border focus:outline-none transition-colors ${inputStyles} ${buttonShape}`}
            placeholder="Your Email"
          />
        </div>
        <div>
          <label className="block text-[10px] font-bold uppercase tracking-wider mb-1.5 opacity-70">Phone</label>
          <input 
            type="tel" 
            value={formData.phone}
            onChange={(e) => setFormData({...formData, phone: e.target.value})}
            className={`w-full px-4 py-3 border focus:outline-none transition-colors ${inputStyles} ${buttonShape}`}
            placeholder="Your Phone"
          />
        </div>
      </div>
      <div>
        <label className="block text-[10px] font-bold uppercase tracking-wider mb-1.5 opacity-70">Message</label>
        <textarea 
          required
          rows={3}
          value={formData.message}
          onChange={(e) => setFormData({...formData, message: e.target.value})}
          className={`w-full px-4 py-3 border focus:outline-none transition-colors resize-none ${inputStyles} ${buttonShape}`}
          placeholder="How can we help you?"
        ></textarea>
      </div>
      
      {status === 'error' && (
        <div className="text-red-500 text-sm mt-2">Failed to send message. Please try again.</div>
      )}

      <button 
        type="submit" 
        disabled={status === 'loading'}
        className={`w-full mt-4 flex items-center justify-center gap-2 ${buttonColors} px-6 py-4 uppercase tracking-widest text-sm font-bold transition-all disabled:opacity-50 ${buttonShape}`}
      >
        {status === 'loading' ? 'Sending...' : 'Send Message'}
        {status !== 'loading' && <Send size={16} />}
      </button>
    </form>
  );
}
