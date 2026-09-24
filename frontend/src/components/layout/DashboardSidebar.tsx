import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Grid, Globe, BarChart3, Settings, Zap, LogOut, Plus, ShieldCheck, Bell, LayoutTemplate, Users, Receipt, Megaphone, ChevronLeft } from 'lucide-react';
import NotificationBell from '../ui/NotificationBell';

interface User {
  username?: string;
  is_superuser?: boolean;
  has_completed_onboarding?: boolean;
  membership?: string;
  is_test_user?: boolean;
  role?: string;
}

interface DashboardSidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  user: User | null;
  handleLogout: () => void;
  setIsCreating: (val: boolean) => void;
}

export default function DashboardSidebar({ activeTab, setActiveTab, user, handleLogout, setIsCreating }: DashboardSidebarProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const toggleSidebar = () => setIsCollapsed(!isCollapsed);

  const navItems = [
    { tab: 'Dashboard', icon: <Grid size={20} />, label: 'Overview', roles: ['ADMIN', 'AGENT', 'CLIENT'] },
    { tab: 'Projects', icon: <Globe size={20} />, label: 'My Sites', roles: ['ADMIN', 'AGENT', 'CLIENT'] },
    { tab: 'Templates', icon: <LayoutTemplate size={20} />, label: 'Templates', roles: ['ADMIN', 'AGENT'] },
    { tab: 'Customers', icon: <Users size={20} />, label: 'Customers', roles: ['ADMIN', 'AGENT', 'CLIENT'] },
    { tab: 'Clients', icon: <Users size={20} />, label: 'Clients', roles: ['ADMIN', 'AGENT'] },
    { tab: 'Marketing', icon: <Megaphone size={20} />, label: 'Marketing', roles: ['ADMIN', 'AGENT'] },
    { tab: 'Notifications', icon: <Bell size={20} />, label: 'Inbox', roles: ['ADMIN', 'AGENT', 'CLIENT'] },
    { tab: 'Analytics', icon: <BarChart3 size={20} />, label: 'Analytics', roles: ['ADMIN', 'AGENT', 'CLIENT'] },
    { tab: 'Billing', icon: <Receipt size={20} />, label: 'Invoices', roles: ['CLIENT'] },
    { tab: 'Settings', icon: <Settings size={20} />, label: 'Settings', roles: ['ADMIN', 'AGENT', 'CLIENT'] }
  ].filter(item => {
    if (user?.is_test_user && item.tab === 'Billing') return false;
    const userRole = user?.role || 'AGENT';
    return item.roles.includes(userRole) || user?.is_superuser;
  });

  // Neumorphic shadows
  const neuShadow = "shadow-[10px_10px_22px_var(--neu-shadow-dark),-10px_-10px_22px_var(--neu-shadow-light)]";
  const neuInner = "shadow-[inset_3px_3px_6px_var(--neu-shadow-dark),inset_-3px_-3px_6px_var(--neu-shadow-light)]";
  const neuBtn = "shadow-[6px_7px_13px_rgba(212,206,199,0.72),-6px_-7px_13px_rgba(255,255,255,0.98)]";

  return (
    <>
      {/* DESKTOP SIDEBAR - NEUMORPHIC */}
      <aside 
        className={`hidden md:flex flex-col z-30 shrink-0 bg-[var(--neu-bg)] rounded-[26px] my-[16px] ml-[16px] h-[calc(100vh-32px)] transition-all duration-300 ease-in-out overflow-hidden ${neuShadow} ${
          isCollapsed ? 'w-[88px] px-3 py-[22px]' : 'w-[260px] px-[18px] py-[22px]'
        }`}
      >
        {/* Top Row: Brand & Expand Toggle */}
        <div className={`flex items-center mb-6 transition-all duration-300 ease-in-out ${isCollapsed ? 'justify-center gap-0' : 'justify-between gap-2'}`}>
          <div 
            onClick={toggleSidebar}
            className={`flex items-center cursor-pointer min-w-0 transition-all duration-300 ease-in-out ${isCollapsed ? 'gap-0' : 'gap-3 px-1'}`}
          >
            <div className={`w-10 h-10 rounded-[13px] flex items-center justify-center font-black text-[17px] text-[#d08757] bg-[var(--neu-bg)] shrink-0 transition-all duration-300 ${neuBtn} hover:text-[#e49b6b]`}>
              J
            </div>
            {!isCollapsed && (
              <div className="min-w-0 overflow-hidden whitespace-nowrap transition-all duration-300 ease-in-out max-w-[160px] opacity-100">
                <h2 className="font-bold text-[16px] text-slate-800 tracking-tight leading-[1.2] m-0">Jaalam</h2>
                <p className="text-[10px] font-medium text-slate-500 tracking-[0.6px] uppercase mt-[1px]">Website Builder</p>
              </div>
            )}
          </div>
          
          <div 
            onClick={toggleSidebar}
            className={`w-[30px] h-[30px] rounded-[10px] flex items-center justify-center text-slate-500 cursor-pointer shrink-0 transition-all duration-300 ease-in-out hover:text-[#d08757] active:scale-95 ${isCollapsed ? 'opacity-0 max-w-0 pointer-events-none' : 'opacity-100 max-w-[30px] hover:shadow-[4px_4px_8px_var(--neu-shadow-dark),-4px_-4px_8px_var(--neu-shadow-light)]'}`}
          >
            <ChevronLeft size={20} />
          </div>
        </div>

        {/* Scrollable Menu Area */}
        <div className="flex-1 overflow-y-auto overflow-x-hidden scrollbar-hide pt-1 pb-4">
          {!isCollapsed && (
            <div className="text-[10px] font-bold tracking-[1.5px] text-slate-500 whitespace-nowrap overflow-hidden uppercase transition-all duration-300 ease-in-out opacity-100 h-4 mx-2 mb-2 mt-1">
              Menu
            </div>
          )}

          <div className="flex flex-col gap-1.5">
            {navItems.map((item) => {
              const isLocked = Boolean(user && user.has_completed_onboarding === false && item.tab !== 'Settings' && !user.is_superuser && !user.is_test_user && user.role !== 'CLIENT');
              const isActive = activeTab === item.tab;
              
              return (
                <div 
                  key={item.tab}
                  onClick={() => !isLocked && setActiveTab(item.tab)}
                  className={`flex items-center rounded-xl cursor-pointer text-[14px] font-medium transition-all duration-200 ease-in-out ${
                    isCollapsed ? 'justify-center w-12 h-12 mx-auto gap-0' : 'p-[11px_14px] gap-[14px]'
                  } ${
                    isLocked ? 'opacity-40 cursor-not-allowed text-slate-500' : 
                    isActive ? 'text-white bg-gradient-to-br from-[#e49b6b] to-[#d08757] shadow-md active:scale-[0.98]' : 
                    `text-slate-500 hover:text-slate-800 bg-[var(--neu-bg)] hover:${neuInner} active:scale-[0.98]`
                  }`}
                >
                  <div className={`shrink-0 flex items-center justify-center w-5 h-5 transition-colors duration-200 ${isActive ? 'text-white' : ''}`}>
                    {item.icon}
                  </div>
                  
                  <span className={`flex-1 whitespace-nowrap overflow-hidden transition-all duration-300 ease-in-out ${isCollapsed ? 'max-w-0 opacity-0' : 'max-w-[160px] opacity-100'}`}>
                    {item.label}
                  </span>

                  {isLocked && !isCollapsed && (
                    <span className="shrink-0 bg-slate-400 text-white text-[9px] font-bold px-1.5 py-0.5 rounded uppercase">Locked</span>
                  )}
                </div>
              );
            })}
          </div>

          {user?.is_superuser && (
            <>
              <div className={`h-[1px] bg-[#d1d5db] transition-all duration-300 ease-in-out ${isCollapsed ? 'my-2 mx-2' : 'my-[16px] mx-1'}`}></div>
              
              {!isCollapsed && (
                <div className="text-[10px] font-bold tracking-[1.5px] text-slate-500 whitespace-nowrap overflow-hidden uppercase transition-all duration-300 ease-in-out opacity-100 h-4 mx-2 mb-2 mt-1">
                  Administration
                </div>
              )}
              <Link 
                to="/admin"
                className={`flex items-center rounded-xl cursor-pointer text-[14px] font-medium transition-all duration-200 ease-in-out text-slate-500 bg-[var(--neu-bg)] hover:text-[#d08757] hover:${neuInner} active:scale-[0.98] ${
                  isCollapsed ? 'justify-center w-12 h-12 mx-auto gap-0 mt-1.5' : 'p-[11px_14px] gap-[14px]'
                }`}
              >
                <div className="shrink-0 flex items-center justify-center w-5 h-5 transition-colors duration-200">
                  <ShieldCheck size={20} />
                </div>
                {!isCollapsed && (
                  <span className="flex-1 whitespace-nowrap overflow-hidden transition-all duration-300 ease-in-out max-w-[160px] opacity-100">
                    Admin Portal
                  </span>
                )}
              </Link>
            </>
          )}

        </div>

        {/* Bottom Section */}
        <div className="mt-auto flex flex-col shrink-0">
          <div className={`h-[1px] bg-[#d1d5db] transition-all duration-300 ease-in-out ${isCollapsed ? 'my-2 mx-2' : 'my-4 mx-1'}`}></div>
          
          {user?.membership !== 'PREMIUM' && !user?.is_superuser && !user?.is_test_user && user?.role !== 'CLIENT' && (
            <div 
              onClick={() => setActiveTab('Pricing')}
              className={`flex items-center rounded-xl mb-3 cursor-pointer text-[14px] font-medium transition-all duration-200 ease-in-out text-white bg-gradient-to-r from-amber-500 to-orange-500 active:scale-[0.98] shadow-md hover:shadow-lg ${
                isCollapsed ? 'justify-center w-12 h-12 mx-auto gap-0' : 'p-[11px_14px] gap-[14px]'
              }`}
            >
              <div className="shrink-0 flex items-center justify-center w-5 h-5 transition-colors duration-200">
                <Zap size={20} className="fill-white/80" />
              </div>
              {!isCollapsed && (
                <span className="flex-1 whitespace-nowrap overflow-hidden transition-all duration-300 ease-in-out max-w-[160px] opacity-100 font-bold uppercase tracking-wider text-xs">
                  Upgrade Plan
                </span>
              )}
            </div>
          )}

          <div className={`flex items-center transition-all duration-300 ease-in-out ${isCollapsed ? 'flex-col gap-3 pb-2' : 'justify-between gap-3 mx-1 pb-1'}`}>
            <div className="flex items-center gap-2">
              <div className={`w-[34px] h-[34px] rounded-[10px] flex items-center justify-center text-[#d08757] bg-[var(--neu-bg)] font-black shrink-0 text-sm ${neuBtn}`}>
                {user?.username?.[0]?.toUpperCase() || 'U'}
              </div>
              <div className={`flex flex-col overflow-hidden transition-all duration-300 ease-in-out ${isCollapsed ? 'max-w-0 opacity-0 hidden' : 'max-w-[100px] opacity-100'}`}>
                <span className="text-[13px] font-bold text-slate-800 truncate">{user?.username}</span>
                <span className="text-[9px] text-[#d08757] font-bold uppercase tracking-wider truncate">
                  {user?.is_superuser ? 'SYSTEM ADMIN' : user?.is_test_user ? 'TEST USER' : user?.membership ? `${user.membership} PLAN` : 'FREE TIER'}
                </span>
              </div>
            </div>
            
            <div className={`flex items-center shrink-0 ${isCollapsed ? 'flex-col gap-3' : 'gap-1'}`}>
              <div className="text-slate-500 hover:text-[#d08757] cursor-pointer transition-colors p-1.5">
                <NotificationBell isSidebar={true} />
              </div>
              <button onClick={handleLogout} className={`text-slate-500 hover:text-rose-500 transition-all p-2 rounded-xl bg-[var(--neu-bg)] hover:${neuInner}`} title="Log out">
                <LogOut size={16} />
              </button>
            </div>
          </div>
        </div>
      </aside>

      {/* MOBILE BOTTOM NAVIGATION */}
      <div className="md:hidden fixed bottom-4 left-4 right-4 bg-white/80 backdrop-blur-xl border border-white/80 rounded-2xl z-50 shadow-[0_8px_32px_0_rgba(31,38,135,0.1)]">
        <div className="flex justify-around items-center p-2 relative">
          <button 
            onClick={() => (!user || user.has_completed_onboarding !== false || user.is_test_user || user.is_superuser || user.role === 'CLIENT') && setActiveTab('Dashboard')} 
            className={`flex flex-col items-center p-2 rounded-xl transition-all ${user?.has_completed_onboarding === false && !user?.is_test_user && !user?.is_superuser && user?.role !== 'CLIENT' ? 'opacity-40' : activeTab === 'Dashboard' ? 'bg-white shadow-sm text-[#d08757]' : 'text-slate-400'}`}
          >
            <Grid size={20} />
          </button>
          <button 
            onClick={() => (!user || user.has_completed_onboarding !== false || user.is_test_user || user.is_superuser || user.role === 'CLIENT') && setActiveTab('Projects')} 
            className={`flex flex-col items-center p-2 rounded-xl transition-all ${user?.has_completed_onboarding === false && !user?.is_test_user && !user?.is_superuser && user?.role !== 'CLIENT' ? 'opacity-40' : activeTab === 'Projects' ? 'bg-white shadow-sm text-[#d08757]' : 'text-slate-400'}`}
          >
            <Globe size={20} />
          </button>
          
          <div className={`relative -top-6 px-1 ${user?.has_completed_onboarding === false && !user?.is_test_user && !user?.is_superuser && user?.role !== 'CLIENT' ? 'opacity-40 pointer-events-none' : ''}`}>
             <button onClick={() => setIsCreating(true)} className="bg-gradient-to-br from-[#e49b6b] to-[#d08757] text-white p-3 rounded-xl shadow-lg transform hover:scale-105 transition-all border-4 border-[#fbf6f0]">
                <Plus size={22} strokeWidth={3} />
             </button>
          </div>

          {user?.is_superuser ? (
            <Link to="/admin" className={`flex flex-col items-center p-2 rounded-xl transition-all text-slate-400 hover:text-[#d08757] hover:bg-white shadow-sm ${user?.has_completed_onboarding === false && !user?.is_test_user && !user?.is_superuser && user?.role !== 'CLIENT' ? 'opacity-40 pointer-events-none' : ''}`}>
              <ShieldCheck size={20} />
            </Link>
          ) : (
            <button 
              onClick={() => (!user || user.has_completed_onboarding !== false || user.is_test_user || user.role === 'CLIENT') && setActiveTab('Notifications')} 
              className={`flex flex-col items-center p-2 rounded-xl transition-all ${user?.has_completed_onboarding === false && !user?.is_test_user && user?.role !== 'CLIENT' ? 'opacity-40' : activeTab === 'Notifications' ? 'bg-white shadow-sm text-[#d08757]' : 'text-slate-400'}`}
            >
              <Bell size={20} />
            </button>
          )}
          <button 
            onClick={() => (!user || user.has_completed_onboarding !== false || user.is_test_user || user.is_superuser || user.role === 'CLIENT') && setActiveTab('Analytics')} 
            className={`flex flex-col items-center p-2 rounded-xl transition-all ${user?.has_completed_onboarding === false && !user?.is_test_user && !user?.is_superuser && user?.role !== 'CLIENT' ? 'opacity-40' : activeTab === 'Analytics' ? 'bg-white shadow-sm text-indigo-600' : 'text-slate-400'}`}
          >
            <BarChart3 size={20} />
          </button>
        </div>
      </div>
    </>
  );
}
