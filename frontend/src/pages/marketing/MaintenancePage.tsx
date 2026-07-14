import React from 'react';
import { Hammer, Wrench, ShieldCheck } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function MaintenancePage() {
  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col items-center justify-center p-6 text-slate-800 font-sans relative overflow-hidden">

      {/* Decorative background elements */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-gradient-to-r from-violet-200 to-fuchsia-200 mix-blend-multiply filter blur-[100px] opacity-40 animate-[spin_20s_linear_infinite]"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-gradient-to-l from-indigo-200 to-sky-200 mix-blend-multiply filter blur-[120px] opacity-40 animate-[spin_30s_linear_infinite_reverse]"></div>

      <div className="bg-white/80 backdrop-blur-2xl border border-white/60 p-10 md:p-16 rounded-[2rem] shadow-xl shadow-indigo-100/50 max-w-2xl w-full text-center relative z-10 flex flex-col items-center">

        <div className="w-24 h-24 bg-gradient-to-br from-indigo-500 to-violet-500 rounded-3xl flex items-center justify-center text-white mb-8 shadow-lg shadow-indigo-500/30 animate-bounce">
          <Wrench size={48} strokeWidth={2.5} />
        </div>

        <h1 className="text-4xl md:text-5xl font-black text-slate-900 mb-6 tracking-tight">
          Under <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-violet-500">Maintenance</span>
        </h1>

        <p className="text-lg md:text-xl text-slate-600 font-medium mb-10 leading-relaxed max-w-lg">
          We're currently performing some scheduled maintenance to make Jaalam even better. We'll be back online shortly!
        </p>

        <div className="flex items-center gap-3 bg-slate-50 px-6 py-4 rounded-2xl border border-slate-100 mb-12">
          <Hammer className="text-amber-500" size={24} />
          <span className="font-bold text-slate-700 text-sm md:text-base">Please check back in a few minutes.</span>
        </div>

      </div>
    </div>
  );
}
