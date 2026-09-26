import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Bot, User, Sparkles } from 'lucide-react';

interface ChatbotProps {
  content?: any;
}

interface Message {
  id: string;
  sender: 'bot' | 'user';
  text: string;
}

export default function Chatbot({ content }: ChatbotProps) {
  if (content?.settings_json?.show_chatbot === false) return null;
  const iconStyle = content?.settings_json?.chatbot_icon_style || 'modern';
  const modalStyle = content?.settings_json?.chatbot_modal_style || 'professional';
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { id: '1', sender: 'bot', text: 'Hi there! 👋 I can help answer questions about our business. What would you like to know?' }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping, isOpen]);

  const generateMockResponse = (query: string): string => {
    if (!content) return "I'm sorry, I don't have enough information about this business right now.";

    const lowerQuery = query.toLowerCase();

    if (lowerQuery.includes('phone') || lowerQuery.includes('call') || lowerQuery.includes('contact') || lowerQuery.includes('number')) {
      if (content.contact_info?.phone) return `You can reach us at: ${content.contact_info.phone}`;
      return "You can reach us at our main line: +1 (555) 123-4567.";
    }
    if (lowerQuery.includes('email') || lowerQuery.includes('contact')) {
      if (content.contact_info?.email) return `Our email address is: ${content.contact_info.email}`;
      return "Feel free to email us at: hello@ourwebsite.com.";
    }
    if (lowerQuery.includes('address') || lowerQuery.includes('location') || lowerQuery.includes('where')) {
      if (content.contact_info?.address) return `We are located at: ${content.contact_info.address}`;
      return "We are located at 123 Main Street, City Center.";
    }
    if (lowerQuery.includes('hours') || lowerQuery.includes('open') || lowerQuery.includes('time')) {
      if (content.contact_info?.hours) return `Our operating hours are: ${content.contact_info.hours}`;
      return "We are open Monday through Saturday, from 9:00 AM to 10:00 PM.";
    }
    if (lowerQuery.includes('service') || lowerQuery.includes('what do you do') || lowerQuery.includes('offer')) {
      if (content.services_json && content.services_json.length > 0) {
        if (typeof content.services_json[0] === 'string') {
          return `We offer the following services: ${content.services_json.join(', ')}.`;
        } else if (content.services_json[0].title) {
          const serviceTitles = content.services_json.map((s: any) => s.title).join(', ');
          return `Here are some of our services: ${serviceTitles}.`;
        }
      }
      return "We offer a wide variety of premium services tailored to your needs. Check out our Services section for more details!";
    }
    if (lowerQuery.includes('about') || lowerQuery.includes('who are you') || lowerQuery.includes('story')) {
      if (content.about_text) return content.about_text;
      return "We are passionate professionals dedicated to delivering the best experience for our customers. Every detail is crafted with care!";
    }
    if (lowerQuery.includes('social') || lowerQuery.includes('insta') || lowerQuery.includes('facebook') || lowerQuery.includes('fb') || lowerQuery.includes('twitter') || lowerQuery.includes('tweet')) {
      return "You can follow us on Instagram, Facebook, and Twitter to stay updated with our latest news and offerings! Links are in the footer.";
    }
    if (lowerQuery.includes('price') || lowerQuery.includes('cost') || lowerQuery.includes('menu') || lowerQuery.includes('product') || lowerQuery.includes('item') || lowerQuery.includes('food') || lowerQuery.includes('dish')) {
      if (content.products_json && content.products_json.length > 0) {
        const itemNames = content.products_json.map((p: any) => {
          const name = p.name || p.title;
          const price = p.price ? ` (${p.price})` : '';
          return `${name}${price}`;
        }).filter(Boolean).join(', ');
        return `We have various offerings including: ${itemNames}.`;
      } else {
        return "Our top offerings include Truffle Risotto (₹28), Pan-Seared Scallops (₹32), Wagyu Ribeye (₹65), and Lobster Ravioli (₹34). You can view the full menu on our website!";
      }
    }
    if (lowerQuery.includes('book') || lowerQuery.includes('reservation') || lowerQuery.includes('table') || lowerQuery.includes('appointment')) {
      return "You can easily book or contact us directly using the forms provided on our website.";
    }
    if (lowerQuery.includes('refund') || lowerQuery.includes('return')) {
      return "We offer a 30-day return policy for most items. For full details on refunds and returns, please visit our policy page.";
    }
    if (lowerQuery.includes('shipping') || lowerQuery.includes('delivery')) {
      return "We offer standard and expedited shipping options. Delivery times may vary depending on your location.";
    }
    if (lowerQuery.includes('payment') || lowerQuery.includes('card') || lowerQuery.includes('cash')) {
      return "We accept all major credit cards, debit cards, and popular digital wallets.";
    }
    if (lowerQuery.includes('discount') || lowerQuery.includes('offer') || lowerQuery.includes('promo')) {
      return "We often run seasonal promotions! Keep an eye on our website or follow us on social media for the latest discounts.";
    }

    return "I'm still learning! ✨ If you need more specific details, please check our website content or contact us directly.";
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      sender: 'user',
      text: inputValue.trim()
    };

    setMessages(prev => [...prev, userMsg]);
    setInputValue('');
    setIsTyping(true);

    // Mock network delay and AI processing
    setTimeout(() => {
      const responseText = generateMockResponse(userMsg.text);
      const botMsg: Message = {
        id: (Date.now() + 1).toString(),
        sender: 'bot',
        text: responseText
      };
      setMessages(prev => [...prev, botMsg]);
      setIsTyping(false);
    }, 1200 + Math.random() * 800);
  };

  // 1. DEFAULT (Professional, Elegant, Neumorphic)
  const renderDefault = () => {
    let containerClass = "bg-white rounded-3xl shadow-[0_12px_40px_-12px_rgba(0,0,0,0.15)] border border-slate-200";
    let headerClass = "bg-white p-4 sm:p-5 flex justify-between items-center border-b border-slate-100 z-10 shrink-0";
    let textClass = "text-slate-900";
    let subTextClass = "text-slate-500";
    let bodyClass = "flex-1 overflow-y-auto p-4 sm:p-5 bg-slate-50/50 space-y-6";
    let userBubbleClass = "bg-slate-900 text-white rounded-2xl rounded-tr-sm shadow-sm";
    let botBubbleClass = "bg-white border border-slate-200/60 text-slate-800 rounded-2xl rounded-tl-sm shadow-sm";
    let inputAreaClass = "p-4 bg-white border-t border-slate-100 z-10 shrink-0";
    let inputClass = "bg-slate-50 hover:bg-slate-100/80 focus:bg-white text-slate-800 border-slate-200 focus:ring-slate-900/10";
    let sendBtnClass = "bg-slate-900 text-white hover:bg-slate-800 shadow-sm";

    if (modalStyle === 'elegant') {
      containerClass = "bg-zinc-950 rounded-xl shadow-2xl border border-amber-900/30";
      headerClass = "bg-zinc-900 p-5 flex justify-between items-center border-b border-amber-900/30 z-10 shrink-0";
      textClass = "text-amber-100 font-serif";
      subTextClass = "text-amber-900/60";
      bodyClass = "flex-1 overflow-y-auto p-5 bg-zinc-950 space-y-6";
      userBubbleClass = "bg-amber-900/40 text-amber-50 rounded-lg rounded-tr-none border border-amber-800/50";
      botBubbleClass = "bg-zinc-900 text-zinc-300 rounded-lg rounded-tl-none border border-zinc-800";
      inputAreaClass = "p-4 bg-zinc-900 border-t border-amber-900/30 z-10 shrink-0";
      inputClass = "bg-zinc-950 focus:bg-zinc-950 text-zinc-100 border-zinc-800 focus:border-amber-900/50 rounded-lg focus:ring-amber-900/20";
      sendBtnClass = "bg-amber-800 text-amber-50 rounded-lg hover:bg-amber-700";
    } else if (modalStyle === 'neumorphic') {
      containerClass = "bg-gray-100 rounded-[2rem] shadow-[20px_20px_60px_#bebebe,-20px_-20px_60px_#ffffff] border border-gray-200";
      headerClass = "bg-transparent p-5 flex justify-between items-center z-10 shrink-0";
      textClass = "text-gray-700";
      bodyClass = "flex-1 overflow-y-auto p-5 bg-gray-100 shadow-[inset_10px_10px_20px_#bebebe,inset_-10px_-10px_20px_#ffffff] mx-4 mb-4 rounded-3xl space-y-6";
      userBubbleClass = "bg-gray-100 text-gray-800 rounded-2xl rounded-tr-sm shadow-[5px_5px_10px_#bebebe,-5px_-5px_10px_#ffffff]";
      botBubbleClass = "bg-gray-100 text-gray-600 rounded-2xl rounded-tl-sm shadow-[5px_5px_10px_#bebebe,-5px_-5px_10px_#ffffff]";
      inputAreaClass = "p-4 bg-transparent z-10 shrink-0";
      inputClass = "bg-gray-100 text-gray-700 border-none rounded-xl shadow-[inset_5px_5px_10px_#bebebe,inset_-5px_-5px_10px_#ffffff] focus:ring-0";
      sendBtnClass = "bg-gray-100 text-gray-700 shadow-[5px_5px_10px_#bebebe,-5px_-5px_10px_#ffffff] rounded-xl hover:text-gray-900";
    }

    return (
      <div className={`fixed bottom-4 left-4 right-4 sm:right-auto sm:bottom-8 sm:left-8 z-[99995] font-sans flex flex-col sm:w-[380px] h-[80vh] sm:h-[600px] sm:max-h-[85vh] overflow-hidden transition-all animate-in zoom-in-95 slide-in-from-bottom-4 duration-300 origin-bottom-left ${containerClass}`}>
        <div className={headerClass}>
          <div className="flex items-center gap-3 overflow-hidden">
            <div className={`p-2.5 rounded-xl shrink-0 ${modalStyle === 'elegant' ? 'bg-zinc-800 text-amber-200' : 'bg-slate-100 text-slate-700'}`}>
              <Bot size={22} />
            </div>
            <div className="min-w-0">
              <h3 className={`font-bold text-[15px] ${textClass} leading-tight truncate flex items-center gap-2`}>
                Support Assistant
              </h3>
              <p className={`text-[11px] ${subTextClass} font-medium mt-0.5 truncate`}>Typically replies instantly</p>
            </div>
          </div>
          <button onClick={() => setIsOpen(false)} className={`p-2 rounded-full transition-colors shrink-0 ml-2 ${modalStyle === 'elegant' ? 'text-amber-700 hover:bg-zinc-800' : 'text-slate-400 hover:text-slate-700 hover:bg-slate-100'}`}>
            <X size={20} />
          </button>
        </div>
        <div className={bodyClass}>
          {messages.map((msg) => (
            <div key={msg.id} className={`flex gap-3 ${msg.sender === 'user' ? 'flex-row-reverse' : ''} animate-in fade-in duration-300`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${msg.sender === 'user' ? (modalStyle === 'elegant' ? 'bg-amber-900/40 text-amber-200 border border-amber-800/50' : 'bg-slate-900 text-white') : (modalStyle === 'elegant' ? 'bg-zinc-800 text-zinc-400 border border-zinc-700' : 'bg-white border border-slate-200 text-slate-600 shadow-sm')}`}>
                {msg.sender === 'user' ? <User size={14} /> : <Bot size={14} />}
              </div>
              <div className={`px-4 py-3 max-w-[75%] text-[14px] leading-relaxed ${msg.sender === 'user' ? userBubbleClass : botBubbleClass}`}>
                {msg.text}
              </div>
            </div>
          ))}
          {isTyping && (
            <div className="flex gap-3 animate-in fade-in duration-300">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${modalStyle === 'elegant' ? 'bg-zinc-800 text-zinc-400 border border-zinc-700' : 'bg-white border border-slate-200 text-slate-600 shadow-sm'}`}>
                <Bot size={14} />
              </div>
              <div className={`px-4 py-4 flex gap-1.5 items-center ${botBubbleClass}`}>
                <div className={`w-1.5 h-1.5 rounded-full animate-bounce ${modalStyle === 'elegant' ? 'bg-amber-700' : 'bg-slate-400'}`}></div>
                <div className={`w-1.5 h-1.5 rounded-full animate-bounce ${modalStyle === 'elegant' ? 'bg-amber-700' : 'bg-slate-400'}`} style={{ animationDelay: '0.15s' }}></div>
                <div className={`w-1.5 h-1.5 rounded-full animate-bounce ${modalStyle === 'elegant' ? 'bg-amber-700' : 'bg-slate-400'}`} style={{ animationDelay: '0.3s' }}></div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} className="h-1" />
        </div>
        <div className={inputAreaClass}>
          <form onSubmit={handleSendMessage} className="flex gap-2 items-end">
            <textarea rows={1} placeholder="Type your message..." value={inputValue} onChange={(e) => setInputValue(e.target.value)} onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSendMessage(e); } }} className={`flex-1 max-h-32 min-h-[44px] text-[14px] px-4 py-3 focus:outline-none focus:ring-2 border transition-colors resize-none scrollbar-hide ${inputClass}`} />
            <button type="submit" disabled={!inputValue.trim() || isTyping} className={`h-[44px] w-[44px] rounded-2xl transition-all shrink-0 flex items-center justify-center active:scale-95 disabled:cursor-not-allowed disabled:opacity-50 ${sendBtnClass}`}>
              <Send size={18} className="ml-0.5" />
            </button>
          </form>
        </div>
      </div>
    );
  };

  // 2. PLAYFUL / PASTEL
  const renderPlayful = () => {
    const isPastel = modalStyle === 'pastel';
    const container = isPastel ? "bg-rose-50 border-2 border-rose-100" : "bg-indigo-50 border-4 border-white";
    const headBg = isPastel ? "bg-rose-100/50 text-rose-900 border-b border-rose-200/50" : "bg-indigo-50 text-indigo-900";
    const userBg = isPastel ? "bg-rose-400 text-white rounded-2xl rounded-tr-sm" : "bg-pink-500 text-white rounded-tr-xl font-medium";
    const botBg = isPastel ? "bg-white text-rose-900 rounded-2xl rounded-tl-sm" : "bg-white text-indigo-900 rounded-tl-xl border-2 border-indigo-50";
    const ring = isPastel ? "focus:ring-rose-400/20" : "focus:ring-pink-500/20";
    const btn = isPastel ? "bg-rose-400 text-white hover:bg-rose-500 rounded-2xl" : "bg-pink-500 text-white rounded-full";

    return (
      <div className={`fixed bottom-4 left-4 right-4 sm:right-auto sm:bottom-8 sm:left-8 z-[99995] font-sans flex flex-col sm:w-[380px] h-[80vh] sm:h-[600px] sm:max-h-[85vh] overflow-hidden transition-all animate-in zoom-in-95 slide-in-from-bottom-4 duration-300 origin-bottom-left rounded-[2.5rem] shadow-xl ${container}`}>
        <div className={`p-6 flex flex-col items-center justify-center relative z-10 shrink-0 ${headBg}`}>
          <div className="w-16 h-16 bg-white rounded-full shadow-sm flex items-center justify-center mb-3">
            <Bot size={32} className={isPastel ? "text-rose-400" : "text-indigo-500"} />
          </div>
          <h3 className="font-bold text-[18px] leading-tight text-center">Hello there! 👋</h3>
          <p className="text-[12px] opacity-70 font-medium mt-1 text-center">Ask us anything.</p>
          <button onClick={() => setIsOpen(false)} className="absolute top-4 right-4 p-2 rounded-full hover:bg-black/5 transition-colors">
            <X size={20} />
          </button>
        </div>
        <div className={`flex-1 overflow-y-auto p-4 sm:p-5 space-y-6 ${!isPastel && 'bg-white/60 rounded-3xl mx-2 mb-2 shadow-inner'}`}>
          {messages.map((msg) => (
            <div key={msg.id} className={`flex gap-3 ${msg.sender === 'user' ? 'flex-row-reverse' : ''} animate-in fade-in duration-300`}>
              <div className={`px-5 py-3.5 max-w-[85%] text-[14px] leading-relaxed shadow-sm ${msg.sender === 'user' ? userBg : botBg}`}>
                {msg.text}
              </div>
            </div>
          ))}
          {isTyping && (
            <div className="flex gap-3 animate-in fade-in duration-300">
              <div className={`px-5 py-4 flex gap-1.5 items-center shadow-sm ${botBg}`}>
                <div className={`w-2 h-2 rounded-full animate-bounce ${isPastel ? 'bg-rose-400' : 'bg-indigo-400'}`}></div>
                <div className={`w-2 h-2 rounded-full animate-bounce ${isPastel ? 'bg-rose-400' : 'bg-indigo-400'}`} style={{ animationDelay: '0.15s' }}></div>
                <div className={`w-2 h-2 rounded-full animate-bounce ${isPastel ? 'bg-rose-400' : 'bg-indigo-400'}`} style={{ animationDelay: '0.3s' }}></div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} className="h-1" />
        </div>
        <div className={`p-4 z-10 shrink-0 ${isPastel ? 'bg-white/50 border-t border-rose-100' : 'bg-transparent pb-5'}`}>
          <form onSubmit={handleSendMessage} className="flex gap-2 items-end relative">
            <textarea rows={1} placeholder="Type your message..." value={inputValue} onChange={(e) => setInputValue(e.target.value)} onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSendMessage(e); } }} className={`flex-1 max-h-32 min-h-[50px] text-[14px] pl-5 pr-14 py-3.5 focus:outline-none focus:ring-2 border transition-colors resize-none scrollbar-hide shadow-sm ${isPastel ? 'bg-white text-rose-900 border-rose-100 rounded-2xl' : 'bg-white text-indigo-900 border-white rounded-full'} ${ring}`} />
            <button type="submit" disabled={!inputValue.trim() || isTyping} className={`absolute right-1.5 bottom-1.5 h-[38px] w-[38px] transition-all shrink-0 flex items-center justify-center active:scale-95 disabled:cursor-not-allowed disabled:opacity-50 ${btn}`}>
              <Send size={16} className="ml-0.5" />
            </button>
          </form>
        </div>
      </div>
    );
  };

  // 3. MINIMALIST
  const renderMinimalist = () => {
    return (
      <div className="fixed bottom-4 left-4 right-4 sm:right-auto sm:bottom-8 sm:left-8 z-[99995] font-sans flex flex-col sm:w-[380px] h-[80vh] sm:h-[600px] sm:max-h-[85vh] overflow-hidden transition-all animate-in zoom-in-95 slide-in-from-bottom-4 duration-300 origin-bottom-left bg-white rounded-2xl shadow-[0_30px_60px_-15px_rgba(0,0,0,0.3)] border border-slate-100">
        <div className="p-4 flex justify-end shrink-0 absolute top-0 right-0 z-20">
          <button onClick={() => setIsOpen(false)} className="p-2 text-slate-400 hover:text-black hover:bg-slate-50 rounded-full transition-colors">
            <X size={20} />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto p-6 pt-12 space-y-8 bg-white">
          {messages.map((msg) => (
            <div key={msg.id} className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'} animate-in fade-in duration-300`}>
              <span className="text-[10px] font-bold tracking-widest uppercase text-slate-300 mb-1">{msg.sender === 'user' ? 'You' : 'Assistant'}</span>
              <div className={`text-[15px] leading-relaxed max-w-[85%] ${msg.sender === 'user' ? 'text-right text-black' : 'text-left text-slate-600'}`}>
                {msg.text}
              </div>
            </div>
          ))}
          {isTyping && (
             <div className="flex flex-col items-start animate-in fade-in duration-300">
               <span className="text-[10px] font-bold tracking-widest uppercase text-slate-300 mb-1">Assistant</span>
               <div className="flex gap-1.5 mt-2">
                 <div className="w-1.5 h-1.5 bg-black rounded-full animate-bounce"></div>
                 <div className="w-1.5 h-1.5 bg-black rounded-full animate-bounce" style={{ animationDelay: '0.15s' }}></div>
                 <div className="w-1.5 h-1.5 bg-black rounded-full animate-bounce" style={{ animationDelay: '0.3s' }}></div>
               </div>
             </div>
          )}
          <div ref={messagesEndRef} className="h-1" />
        </div>
        <div className="p-6 pt-0 bg-white shrink-0">
          <form onSubmit={handleSendMessage} className="border-b-2 border-slate-200 focus-within:border-black transition-colors flex items-center">
            <textarea rows={1} placeholder="Message..." value={inputValue} onChange={(e) => setInputValue(e.target.value)} onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSendMessage(e); } }} className="flex-1 max-h-32 min-h-[40px] py-2 text-[15px] text-black bg-transparent border-none focus:ring-0 resize-none scrollbar-hide placeholder:text-slate-300" />
            <button type="submit" disabled={!inputValue.trim() || isTyping} className="p-2 text-black disabled:text-slate-300 transition-colors">
              <Send size={18} />
            </button>
          </form>
        </div>
      </div>
    );
  };

  // 4. CYBERPUNK (Terminal)
  const renderCyberpunk = () => {
    return (
      <div className="fixed bottom-4 left-4 right-4 sm:right-auto sm:bottom-8 sm:left-8 z-[99995] font-mono flex flex-col sm:w-[420px] h-[80vh] sm:h-[600px] sm:max-h-[85vh] overflow-hidden transition-all animate-in zoom-in-95 slide-in-from-bottom-4 duration-300 origin-bottom-left bg-slate-950 rounded-lg shadow-[0_0_40px_rgba(16,185,129,0.15)] border border-emerald-500/30">
        <div className="bg-slate-900 p-2 sm:p-3 flex justify-between items-center border-b border-emerald-500/30 shrink-0">
          <div className="flex gap-2 items-center text-emerald-500 text-xs">
            <Bot size={14} /> <span>TERMINAL_AI_V1.0</span>
          </div>
          <button onClick={() => setIsOpen(false)} className="text-emerald-500/60 hover:text-emerald-400 hover:bg-slate-800 p-1 transition-colors">
            <X size={16} />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 bg-slate-950 space-y-4">
          <div className="text-emerald-500/50 text-xs mb-4">
            Welcome to system. Type your query.<br/>
            Initialize connection... OK.
          </div>
          {messages.map((msg) => (
            <div key={msg.id} className="animate-in fade-in duration-300 flex">
              <span className={`mr-2 shrink-0 ${msg.sender === 'user' ? 'text-emerald-300' : 'text-emerald-600'}`}>{msg.sender === 'user' ? 'USR&gt;' : 'SYS&gt;'}</span>
              <div className={`text-[13px] leading-relaxed ${msg.sender === 'user' ? 'text-emerald-100' : 'text-emerald-400'}`}>
                {msg.text}
              </div>
            </div>
          ))}
          {isTyping && (
            <div className="animate-in fade-in duration-300 flex text-emerald-500">
              <span className="mr-2 shrink-0">SYS&gt;</span>
              <div className="flex items-center gap-1">
                <span className="w-2 h-4 bg-emerald-500 animate-pulse"></span> processing...
              </div>
            </div>
          )}
          <div ref={messagesEndRef} className="h-1" />
        </div>
        <div className="p-4 bg-slate-900 border-t border-emerald-500/30 shrink-0">
          <form onSubmit={handleSendMessage} className="flex gap-2 items-start">
            <span className="text-emerald-500 mt-2">USR&gt;</span>
            <textarea rows={1} value={inputValue} onChange={(e) => setInputValue(e.target.value)} onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSendMessage(e); } }} className="flex-1 max-h-32 min-h-[30px] py-2 text-[13px] text-emerald-400 bg-transparent border-none focus:ring-0 resize-none scrollbar-hide focus:outline-none" autoFocus />
            <button type="submit" disabled={!inputValue.trim() || isTyping} className="hidden">Send</button>
          </form>
        </div>
      </div>
    );
  };

  // 5. GLASSMORPHIC (Floating Input)
  const renderGlassmorphic = () => {
    return (
      <div className="fixed bottom-4 left-4 right-4 sm:right-auto sm:bottom-8 sm:left-8 z-[99995] font-sans flex flex-col sm:w-[380px] h-[80vh] sm:h-[600px] sm:max-h-[85vh] transition-all animate-in zoom-in-95 slide-in-from-bottom-4 duration-300 origin-bottom-left">
        
        <div className="flex-1 flex flex-col overflow-hidden bg-white/70 backdrop-blur-3xl rounded-[2rem] shadow-[0_20px_60px_-15px_rgba(0,0,0,0.3)] border border-white/60 mb-4">
          <div className="bg-white/40 backdrop-blur-md p-4 sm:p-5 flex justify-between items-center border-b border-white/50 shrink-0">
            <div className="flex items-center gap-3">
              <div className="bg-indigo-600/10 p-2.5 rounded-full text-indigo-600 backdrop-blur-sm">
                <Sparkles size={20} />
              </div>
              <div>
                <h3 className="font-semibold text-[15px] text-slate-900 leading-tight">AI Assistant</h3>
                <p className="text-[11px] text-indigo-600/80 font-medium">Always here to help</p>
              </div>
            </div>
            <button onClick={() => setIsOpen(false)} className="text-slate-500 hover:text-slate-900 bg-white/50 hover:bg-white p-2 rounded-full transition-colors">
              <X size={20} />
            </button>
          </div>
          
          <div className="flex-1 overflow-y-auto p-5 space-y-5">
            {messages.map((msg) => (
              <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'} animate-in fade-in duration-300`}>
                <div className={`px-5 py-3.5 max-w-[85%] text-[14px] leading-relaxed shadow-sm ${msg.sender === 'user' ? 'bg-indigo-600 text-white rounded-3xl rounded-br-sm' : 'bg-white/80 backdrop-blur-md text-slate-800 rounded-3xl rounded-bl-sm border border-white'}`}>
                  {msg.text}
                </div>
              </div>
            ))}
            {isTyping && (
              <div className="flex justify-start animate-in fade-in duration-300">
                <div className="px-5 py-4 bg-white/80 backdrop-blur-md rounded-3xl rounded-bl-sm border border-white flex gap-1.5 items-center shadow-sm">
                  <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: '0.15s' }}></div>
                  <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: '0.3s' }}></div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} className="h-1" />
          </div>
        </div>

        <div className="shrink-0 bg-white/80 backdrop-blur-3xl rounded-3xl shadow-lg border border-white/60 p-2 relative">
          <form onSubmit={handleSendMessage} className="flex gap-2 items-center">
            <textarea rows={1} placeholder="Ask a question..." value={inputValue} onChange={(e) => setInputValue(e.target.value)} onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSendMessage(e); } }} className="flex-1 max-h-32 min-h-[44px] text-[14px] px-4 py-3 bg-transparent focus:outline-none border-none resize-none scrollbar-hide text-slate-800 placeholder-slate-400" />
            <button type="submit" disabled={!inputValue.trim() || isTyping} className="bg-indigo-600 text-white h-[44px] w-[44px] rounded-full transition-all shrink-0 flex items-center justify-center shadow-md hover:shadow-lg active:scale-95 disabled:cursor-not-allowed disabled:opacity-50 mr-1">
              <Send size={18} className="ml-0.5" />
            </button>
          </form>
        </div>
      </div>
    );
  };

  return (
    <>
      <div className={`fixed bottom-6 left-6 sm:bottom-8 sm:left-8 z-[99990] transition-all duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)] ${isOpen ? 'scale-0 opacity-0 pointer-events-none' : 'scale-100 opacity-100'}`}>
        <button
          onClick={() => setIsOpen(true)}
          className={`rounded-full hover:-translate-y-1 active:scale-95 flex items-center justify-center relative transition-all ${iconStyle.startsWith('custom') ? 'p-0 bg-transparent shadow-lg hover:shadow-xl' :
              iconStyle === 'gradient' ? 'p-4 sm:p-5 bg-gradient-to-tr from-violet-600 via-indigo-600 to-purple-500 text-white shadow-[0_8px_30px_rgb(99,102,241,0.4)] hover:shadow-[0_12px_40px_rgb(99,102,241,0.6)]' :
                iconStyle === 'light' ? 'p-4 sm:p-5 bg-white text-slate-900 shadow-lg hover:shadow-xl border border-slate-100' :
                  'p-4 sm:p-5 bg-slate-900 text-white shadow-lg hover:shadow-xl hover:bg-slate-800'
            }`}
          aria-label="Open Chat"
        >
          {iconStyle === 'gradient' && <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 rounded-full" />}

          {iconStyle.startsWith('custom') ? (
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full overflow-hidden bg-white relative z-10 border-4 border-white flex items-center justify-center shadow-md">
              <img src={`/assets/bots/bot${iconStyle.replace('custom', '')}.png`} alt="Chatbot" className="w-full h-full object-cover" />
            </div>
          ) : (
            <MessageCircle size={28} className="relative z-10" />
          )}

          <div className="absolute top-0 right-0 p-1 -mt-1 -mr-1 z-20">
            <span className="relative flex h-3.5 w-3.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-emerald-500 border-2 border-current"></span>
            </span>
          </div>
        </button>
      </div>

      {isOpen && (
        modalStyle === 'cyberpunk' ? renderCyberpunk() :
        modalStyle === 'minimalist' ? renderMinimalist() :
        (modalStyle === 'playful' || modalStyle === 'pastel') ? renderPlayful() :
        modalStyle === 'glassmorphic' ? renderGlassmorphic() :
        renderDefault()
      )}
    </>
  );
}
