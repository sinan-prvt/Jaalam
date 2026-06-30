import { Grid, Globe, BarChart3, Settings, Zap, LogOut, Plus } from 'lucide-react';

interface User {
  username?: string;
}

interface DashboardSidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  user: User | null;
  handleLogout: () => void;
  setIsCreating: (val: boolean) => void;
}

export default function DashboardSidebar({ activeTab, setActiveTab, user, handleLogout, setIsCreating }: DashboardSidebarProps) {
  return (
    <>
      {/* COMPACT FLOATING SIDEBAR (Desktop) */}
      <aside className="w-20 lg:w-[240px] h-[calc(100vh-32px)] my-[16px] ml-[16px] bg-white/70 backdrop-blur-xl border border-white/80 rounded-3xl shadow-[0_8px_32px_0_rgba(31,38,135,0.07)] flex-col justify-between hidden md:flex z-30 overflow-hidden shrink-0">
        <div>
          <div className="p-6 flex items-center justify-center lg:justify-start gap-3">
            <img src="/logo.png" className="w-10 h-10 object-contain relative z-10" alt="Jaalam Logo" />
            <span className="text-xl font-black tracking-tight text-slate-900 hidden lg:block">
              Jaalam
            </span>
          </div>
          
          <div className="px-4 lg:px-5 space-y-2 mt-2">
            {[
              { tab: 'Dashboard', icon: <Grid size={20} />, label: 'Overview' },
              { tab: 'Projects', icon: <Globe size={20} />, label: 'My Sites' },
              { tab: 'Analytics', icon: <BarChart3 size={20} />, label: 'Analytics' },
              { tab: 'Settings', icon: <Settings size={20} />, label: 'Settings' }
            ].map(item => (
              <button 
                key={item.tab}
                onClick={() => setActiveTab(item.tab)}
                className={`w-full flex items-center justify-center lg:justify-start gap-3 px-3 py-3 rounded-xl transition-all font-bold group relative ${activeTab === item.tab ? 'bg-white shadow-[0_4px_15px_rgb(0,0,0,0.05)] text-indigo-600 border border-white/50' : 'text-slate-500 hover:bg-white/40 hover:text-slate-900'}`}
              >
                <div className={`${activeTab === item.tab ? 'text-indigo-600 scale-110' : 'text-slate-400 group-hover:scale-110'} transition-transform duration-300`}>
                  {item.icon}
                </div>
                <span className="hidden lg:block text-sm">{item.label}</span>
                {activeTab === item.tab && (
                  <div className="absolute right-3 w-1 h-1 rounded-full bg-indigo-500 hidden lg:block shadow-[0_0_8px_rgba(99,102,241,0.8)]"></div>
                )}
              </button>
            ))}
          </div>
        </div>
        
        <div className="p-4 lg:p-5 border-t border-white/30 bg-white/30">
          <div className="flex flex-col lg:flex-row items-center lg:justify-between gap-3">
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-slate-100 to-slate-200 flex items-center justify-center text-slate-700 font-black shadow-inner border border-white shrink-0 text-sm">
                {user?.username?.[0]?.toUpperCase() || 'U'}
              </div>
              <div className="flex flex-col hidden lg:flex">
                <span className="text-xs font-black text-slate-900 truncate max-w-[100px]">{user?.username}</span>
                <span className="text-[10px] text-indigo-600 font-bold uppercase tracking-wider">Creator PRO</span>
              </div>
            </div>
            <button onClick={handleLogout} className="text-slate-400 hover:text-rose-500 transition-colors p-2 hover:bg-rose-50 rounded-xl bg-white/50 shadow-sm" title="Log out">
              <LogOut size={16} />
            </button>
          </div>
        </div>
      </aside>

      {/* MOBILE BOTTOM NAVIGATION */}
      <div className="md:hidden fixed bottom-4 left-4 right-4 bg-white/70 backdrop-blur-xl border border-white/80 rounded-2xl z-50 shadow-[0_8px_32px_0_rgba(31,38,135,0.1)]">
        <div className="flex justify-around items-center p-2 relative">
          <button onClick={() => setActiveTab('Dashboard')} className={`flex flex-col items-center p-2 rounded-xl transition-all ${activeTab === 'Dashboard' ? 'bg-white shadow-sm text-indigo-600' : 'text-slate-400'}`}>
            <Grid size={20} />
          </button>
          <button onClick={() => setActiveTab('Projects')} className={`flex flex-col items-center p-2 rounded-xl transition-all ${activeTab === 'Projects' ? 'bg-white shadow-sm text-indigo-600' : 'text-slate-400'}`}>
            <Globe size={20} />
          </button>
          
          <div className="relative -top-6 px-1">
             <button onClick={() => setIsCreating(true)} className="bg-gradient-to-br from-indigo-500 to-violet-500 text-white p-3 rounded-xl shadow-lg transform hover:scale-105 transition-all border-4 border-[#F4F6F9]">
                <Plus size={22} strokeWidth={3} />
             </button>
          </div>

          <button onClick={() => setActiveTab('Analytics')} className={`flex flex-col items-center p-2 rounded-xl transition-all ${activeTab === 'Analytics' ? 'bg-white shadow-sm text-indigo-600' : 'text-slate-400'}`}>
            <BarChart3 size={20} />
          </button>
          <button onClick={() => setActiveTab('Settings')} className={`flex flex-col items-center p-2 rounded-xl transition-all ${activeTab === 'Settings' ? 'bg-white shadow-sm text-indigo-600' : 'text-slate-400'}`}>
            <Settings size={20} />
          </button>
        </div>
      </div>
    </>
  );
}
