import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Bot, User } from 'lucide-react';

interface ChatbotProps {
  content?: any;
}

interface Message {
  id: string;
  sender: 'bot' | 'user';
  text: string;
}

export default function Chatbot({ content }: ChatbotProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { id: '1', sender: 'bot', text: 'Hi there! I can help answer questions about our business. What would you like to know?' }
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

    return "I'm still learning! If you need more specific details, please check our website content or contact us directly using the information provided on our site.";
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
    }, 1000 + Math.random() * 1000);
  };

  return (
    <>
      {/* Toggle Button - always positioned at bottom right/left relative to viewport */}
      {!isOpen && (
        <div className="fixed bottom-6 left-6 sm:bottom-8 sm:left-8 z-[99990]">
          <button 
            onClick={() => setIsOpen(true)}
            className="bg-slate-900 hover:bg-slate-800 text-white p-4 sm:p-5 rounded-full shadow-[0_10px_40px_-10px_rgba(0,0,0,0.5)] transition-transform hover:scale-110 active:scale-95 flex items-center justify-center group"
            aria-label="Open Chat"
          >
            <MessageCircle size={28} className="group-hover:rotate-12 transition-transform duration-300" />
          </button>
        </div>
      )}

      {/* Chat Window - Bottom sheet on mobile, absolute floating on desktop */}
      {isOpen && (
        <div className="fixed bottom-0 left-0 right-0 sm:inset-auto sm:bottom-8 sm:left-8 z-[99995] font-sans flex flex-col sm:w-96 h-[85vh] sm:h-[600px] sm:max-h-[80vh] bg-white rounded-t-3xl sm:rounded-3xl shadow-[0_-10px_40px_rgba(0,0,0,0.15)] sm:shadow-[0_20px_60px_-15px_rgba(0,0,0,0.3)] sm:border sm:border-slate-200 overflow-hidden transition-all animate-in fade-in slide-in-from-bottom-8 duration-300">
          
          {/* Header */}
          <div className="bg-slate-900 text-white p-4 sm:p-5 flex justify-between items-center shadow-sm z-10 shrink-0">
            <div className="flex items-center gap-3">
              <div className="bg-white/10 p-2.5 rounded-xl backdrop-blur-sm">
                <Bot size={22} className="drop-shadow-sm" />
              </div>
              <div>
                <h3 className="font-bold text-base leading-tight tracking-wide">AI Assistant</h3>
                <p className="text-xs text-slate-300 font-medium">Typically replies instantly</p>
              </div>
            </div>
            <button 
              onClick={() => setIsOpen(false)}
              className="text-slate-300 hover:text-white hover:bg-white/10 p-2 rounded-full transition-colors"
            >
              <X size={24} />
            </button>
          </div>

          {/* Message History */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-5 bg-slate-50 space-y-5">
            {messages.map(msg => (
              <div key={msg.id} className={`flex gap-3 ${msg.sender === 'user' ? 'flex-row-reverse' : ''}`}>
                <div className={`w-8 h-8 sm:w-9 sm:h-9 rounded-full flex items-center justify-center shrink-0 shadow-sm ${msg.sender === 'user' ? 'bg-slate-800 text-white' : 'bg-white border border-slate-200 text-slate-700'}`}>
                  {msg.sender === 'user' ? <User size={16} /> : <Bot size={16} />}
                </div>
                <div className={`p-3.5 rounded-2xl max-w-[82%] sm:max-w-[78%] text-[15px] leading-relaxed shadow-sm ${msg.sender === 'user' ? 'bg-slate-800 text-white rounded-tr-none' : 'bg-white border border-slate-100 text-slate-800 rounded-tl-none'}`}>
                  {msg.text}
                </div>
              </div>
            ))}
            
            {isTyping && (
              <div className="flex gap-3">
                <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-white border border-slate-200 text-slate-700 flex items-center justify-center shrink-0 shadow-sm">
                  <Bot size={16} />
                </div>
                <div className="p-4 rounded-2xl bg-white border border-slate-100 rounded-tl-none shadow-sm flex gap-1.5 items-center">
                  <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} className="h-2" />
          </div>

          {/* Input Area */}
          <div className="p-4 bg-white border-t border-slate-100 z-10 shrink-0">
            <form onSubmit={handleSendMessage} className="flex gap-2">
              <input 
                type="text" 
                placeholder="Ask me anything..." 
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                className="flex-1 bg-slate-100/80 hover:bg-slate-100 text-[15px] text-slate-900 px-5 py-3.5 rounded-full focus:outline-none focus:ring-2 focus:ring-slate-400 border border-transparent transition-all"
              />
              <button 
                type="submit" 
                disabled={!inputValue.trim() || isTyping}
                className="bg-slate-900 hover:bg-slate-800 disabled:bg-slate-300 disabled:cursor-not-allowed text-white p-3.5 rounded-full transition-colors shrink-0 flex items-center justify-center shadow-md"
              >
                <Send size={20} className="ml-0.5" />
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
