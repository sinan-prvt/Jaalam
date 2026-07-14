import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, LayoutDashboard, PlusCircle, Settings, BarChart2, Inbox, Globe, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function CommandPalette() {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const navigate = useNavigate();
  const inputRef = useRef<HTMLInputElement>(null);

  const actions = [
    { id: 'dashboard', name: 'Go to Dashboard', icon: <LayoutDashboard size={18} />, route: '/dashboard' },
    { id: 'new-project', name: 'Create New Project', icon: <PlusCircle size={18} />, route: '/dashboard', state: { tab: 'Projects', creating: true } },
    { id: 'my-sites', name: 'View My Sites', icon: <Globe size={18} />, route: '/dashboard', state: { tab: 'Projects' } },
    { id: 'analytics', name: 'View Analytics', icon: <BarChart2 size={18} />, route: '/dashboard', state: { tab: 'Analytics' } },
    { id: 'inbox', name: 'Check Inbox', icon: <Inbox size={18} />, route: '/dashboard', state: { tab: 'Inbox' } },
    { id: 'settings', name: 'Account Settings', icon: <Settings size={18} />, route: '/dashboard', state: { tab: 'Settings' } },
  ];

  const filteredActions = actions.filter(action => 
    action.name.toLowerCase().includes(query.toLowerCase())
  );

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const isK = e.key.toLowerCase() === 'k' || e.code === 'KeyK';
      const isSlash = e.key === '/' || e.code === 'Slash';
      
      if ((e.metaKey || e.ctrlKey) && (isK || isSlash)) {
        e.preventDefault();
        e.stopPropagation();
        setIsOpen((open) => !open);
      }
      
      if (e.key === 'Escape') {
        setIsOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown, { capture: true });
    return () => window.removeEventListener('keydown', handleKeyDown, { capture: true });
  }, []);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
      setQuery('');
      setSelectedIndex(0);
    }
  }, [isOpen]);

  useEffect(() => {
    const handleNavigation = (e: KeyboardEvent) => {
      if (!isOpen) return;
      
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex((prev) => (prev + 1) % filteredActions.length);
      }
      
      if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex((prev) => (prev - 1 + filteredActions.length) % filteredActions.length);
      }
      
      if (e.key === 'Enter') {
        e.preventDefault();
        const action = filteredActions[selectedIndex];
        if (action) {
          setIsOpen(false);
          navigate(action.route, { state: action.state });
        }
      }
    };

    document.addEventListener('keydown', handleNavigation);
    return () => document.removeEventListener('keydown', handleNavigation);
  }, [isOpen, selectedIndex, filteredActions, navigate]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[10000] flex items-start justify-center pt-[15vh]">
          {/* Backdrop */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
            className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
          />
          
          {/* Modal */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="relative w-full max-w-xl bg-white/70 backdrop-blur-2xl border border-white rounded-3xl shadow-2xl overflow-hidden flex flex-col mx-4"
          >
            <div className="flex items-center px-6 py-4 border-b border-slate-200/50">
              <Search className="text-slate-400 mr-3" size={24} />
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  setSelectedIndex(0);
                }}
                placeholder="What do you want to do? (Ctrl+K or Ctrl+/)"
                className="flex-1 bg-transparent border-none outline-none text-slate-800 text-lg font-bold placeholder-slate-400"
              />
              <button onClick={() => setIsOpen(false)} className="bg-slate-100 hover:bg-slate-200 text-slate-500 p-1.5 rounded-lg transition-colors ml-2">
                <X size={16} />
              </button>
            </div>
            
            <div className="max-h-[60vh] overflow-y-auto p-3">
              {filteredActions.length === 0 ? (
                <div className="py-14 text-center text-slate-500 font-medium">
                  No actions found for "{query}"
                </div>
              ) : (
                <div className="space-y-1">
                  <div className="px-3 pb-2 pt-1 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                    Quick Actions
                  </div>
                  {filteredActions.map((action, index) => (
                    <button
                      key={action.id}
                      onClick={() => {
                        setIsOpen(false);
                        navigate(action.route, { state: action.state });
                      }}
                      onMouseEnter={() => setSelectedIndex(index)}
                      className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl transition-all text-left ${
                        index === selectedIndex 
                          ? 'bg-indigo-600 text-white shadow-md' 
                          : 'text-slate-700 hover:bg-white/50'
                      }`}
                    >
                      <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${index === selectedIndex ? 'bg-indigo-500 border border-indigo-400/50 text-white' : 'bg-slate-100 text-slate-500'}`}>
                        {action.icon}
                      </div>
                      <span className="font-bold">{action.name}</span>
                      {index === selectedIndex && (
                        <span className="ml-auto text-[10px] uppercase tracking-widest opacity-60 font-black">
                          Jump
                        </span>
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>
            
            <div className="px-6 py-3 border-t border-slate-200/50 bg-slate-50/50 text-[10px] font-bold text-slate-400 flex items-center justify-between">
              <div>
                <span className="bg-slate-200 text-slate-600 px-1.5 py-0.5 rounded mr-1">↑↓</span> to navigate
              </div>
              <div>
                <span className="bg-slate-200 text-slate-600 px-1.5 py-0.5 rounded mr-1">Enter</span> to select
              </div>
              <div>
                <span className="bg-slate-200 text-slate-600 px-1.5 py-0.5 rounded mr-1">Esc</span> to dismiss
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
