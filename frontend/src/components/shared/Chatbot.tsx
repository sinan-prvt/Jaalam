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
    
    if (lowerQuery.includes('phone') || lowerQuery.includes('call') || lowerQuery.includes('contact')) {
      if (content.contact_info?.phone) return `You can reach us at: ${content.contact_info.phone}`;
    }
    if (lowerQuery.includes('email') || lowerQuery.includes('contact')) {
      if (content.contact_info?.email) return `Our email address is: ${content.contact_info.email}`;
    }
    if (lowerQuery.includes('address') || lowerQuery.includes('location') || lowerQuery.includes('where')) {
      if (content.contact_info?.address) return `We are located at: ${content.contact_info.address}`;
    }
    if (lowerQuery.includes('hours') || lowerQuery.includes('open') || lowerQuery.includes('time')) {
      if (content.contact_info?.hours) return `Our operating hours are: ${content.contact_info.hours}`;
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
    }
    if (lowerQuery.includes('about') || lowerQuery.includes('who are you') || lowerQuery.includes('story')) {
      if (content.about_text) return content.about_text;
    }
    if (lowerQuery.includes('price') || lowerQuery.includes('cost') || lowerQuery.includes('menu')) {
      if (content.products_json && content.products_json.length > 0) {
        const itemNames = content.products_json.map((p: any) => p.name || p.title).filter(Boolean).join(', ');
        return `We have various offerings including: ${itemNames}.`;
      }
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
    <div className="fixed bottom-6 left-6 z-[99990] flex flex-col items-start font-sans">
      {/* Chat Window */}
      {isOpen && (
        <div className="bg-white w-80 sm:w-96 rounded-2xl shadow-2xl border border-gray-200 mb-4 overflow-hidden flex flex-col h-[500px] max-h-[80vh] transition-all animate-in fade-in slide-in-from-bottom-4">
          {/* Header */}
          <div className="bg-slate-900 text-white p-4 flex justify-between items-center">
            <div className="flex items-center gap-2">
              <div className="bg-white/20 p-2 rounded-full">
                <Bot size={20} />
              </div>
              <div>
                <h3 className="font-bold text-sm leading-tight">AI Assistant</h3>
                <p className="text-xs text-slate-300">Typically replies instantly</p>
              </div>
            </div>
            <button 
              onClick={() => setIsOpen(false)}
              className="text-slate-300 hover:text-white hover:bg-white/10 p-2 rounded-full transition-colors"
            >
              <X size={20} />
            </button>
          </div>

          {/* Message History */}
          <div className="flex-1 overflow-y-auto p-4 bg-slate-50 space-y-4">
            {messages.map(msg => (
              <div key={msg.id} className={`flex gap-3 ${msg.sender === 'user' ? 'flex-row-reverse' : ''}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${msg.sender === 'user' ? 'bg-indigo-100 text-indigo-700' : 'bg-slate-200 text-slate-700'}`}>
                  {msg.sender === 'user' ? <User size={16} /> : <Bot size={16} />}
                </div>
                <div className={`p-3 rounded-2xl max-w-[75%] text-sm ${msg.sender === 'user' ? 'bg-indigo-600 text-white rounded-tr-none' : 'bg-white border border-gray-100 text-slate-800 rounded-tl-none shadow-sm'}`}>
                  {msg.text}
                </div>
              </div>
            ))}
            
            {isTyping && (
              <div className="flex gap-3">
                <div className="w-8 h-8 rounded-full bg-slate-200 text-slate-700 flex items-center justify-center shrink-0">
                  <Bot size={16} />
                </div>
                <div className="p-4 rounded-2xl bg-white border border-gray-100 rounded-tl-none shadow-sm flex gap-1 items-center">
                  <div className="w-2 h-2 bg-slate-300 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-slate-300 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  <div className="w-2 h-2 bg-slate-300 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="p-4 bg-white border-t border-gray-100">
            <form onSubmit={handleSendMessage} className="flex gap-2">
              <input 
                type="text" 
                placeholder="Ask me anything..." 
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                className="flex-1 bg-slate-100 text-sm text-slate-900 px-4 py-2.5 rounded-full focus:outline-none focus:ring-2 focus:ring-slate-400 border border-transparent transition-all"
              />
              <button 
                type="submit" 
                disabled={!inputValue.trim() || isTyping}
                className="bg-slate-900 hover:bg-slate-800 disabled:bg-slate-300 disabled:cursor-not-allowed text-white p-2.5 rounded-full transition-colors shrink-0 flex items-center justify-center"
              >
                <Send size={18} className="ml-1" />
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Toggle Button */}
      {!isOpen && (
        <button 
          onClick={() => setIsOpen(true)}
          className="bg-slate-900 hover:bg-slate-800 text-white p-4 rounded-full shadow-2xl shadow-slate-900/30 transition-transform hover:scale-110 active:scale-95 flex items-center justify-center"
          aria-label="Open Chat"
        >
          <MessageCircle size={28} />
        </button>
      )}
    </div>
  );
}
