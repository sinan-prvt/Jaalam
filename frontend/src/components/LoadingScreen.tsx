import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function LoadingScreen({ children }: { children: React.ReactNode }) {
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // Simulate loading progress
    const startTime = Date.now();
    const duration = 2000;
    
    const updateProgress = () => {
      const elapsed = Date.now() - startTime;
      const newProgress = Math.min((elapsed / duration) * 100, 100);
      setProgress(newProgress);
      
      if (elapsed < duration) {
        requestAnimationFrame(updateProgress);
      } else {
        setTimeout(() => setLoading(false), 400); // delay after 100%
      }
    };
    
    requestAnimationFrame(updateProgress);
  }, []);

  return (
    <>
      <AnimatePresence>
        {loading && (
          <motion.div
            initial={{ opacity: 1 }}
            exit={{ opacity: 0, transition: { duration: 0.8, ease: "easeInOut" } }}
            className="fixed inset-0 z-[9999] bg-[#FAFCFF] overflow-hidden flex flex-col items-center justify-center font-sans"
          >
            {/* Subtle background grid pattern */}
            <div className="absolute inset-0 bg-[linear-gradient(rgba(0,33,71,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(0,33,71,0.03)_1px,transparent_1px)] bg-[size:3rem_3rem] [mask-image:radial-gradient(ellipse_60%_60%_at_50%_50%,#000_30%,transparent_100%)] pointer-events-none" />

            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              transition={{
                duration: 0.8,
                ease: [0.22, 1, 0.36, 1]
              }}
              className="relative flex flex-col items-center justify-center w-full max-w-md px-10"
            >
              <div className="relative mb-14 flex justify-center w-full">
                {/* Modern glow effect */}
                <motion.div
                  animate={{
                    scale: [1, 1.15, 1],
                    opacity: [0.3, 0.6, 0.3]
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                  className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] rounded-full bg-gradient-to-tr from-teal-200/40 to-blue-200/40 blur-3xl pointer-events-none"
                />

                <motion.img
                  initial={{ opacity: 0, scale: 0.85 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.8, delay: 0.1, ease: "easeOut" }}
                  src="/jaalam1.png"
                  className="w-48 h-48 md:w-64 md:h-64 object-contain relative z-10 drop-shadow-xl"
                  alt="Jaalam Logo"
                />
              </div>

              {/* Progress Bar Container */}
              <div className="w-full relative z-10">
                <div className="flex justify-between items-end mb-3">
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                    className="flex flex-col"
                  >
                    <span className="text-[10px] font-bold text-teal-600 tracking-[0.2em] uppercase mb-1">
                      System Status
                    </span>
                    <span className="text-sm font-medium text-slate-700 flex items-center">
                      Loading Workspace
                      <motion.span
                        animate={{ opacity: [0, 1, 0] }}
                        transition={{ duration: 1.5, repeat: Infinity, ease: "linear", times: [0, 0.5, 1] }}
                        className="inline-block w-3 text-left ml-0.5"
                      >
                        ...
                      </motion.span>
                    </span>
                  </motion.div>
                  <motion.span 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                    className="text-lg font-bold text-slate-800 tabular-nums tracking-tight"
                  >
                    {Math.round(progress)}%
                  </motion.span>
                </div>
                
                <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden shadow-inner border border-slate-200/60">
                  <motion.div
                    className="h-full bg-gradient-to-r from-teal-400 to-blue-500 rounded-full shadow-[0_0_10px_rgba(45,212,191,0.5)] relative"
                    style={{ width: `${progress}%` }}
                  >
                     <motion.div 
                       animate={{ x: ["-100%", "200%"] }}
                       transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                       className="absolute inset-0 w-1/2 bg-gradient-to-r from-transparent via-white/40 to-transparent skew-x-[-20deg]"
                     />
                  </motion.div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      {children}
    </>
  );
}
