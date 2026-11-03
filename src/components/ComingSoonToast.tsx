import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

type ToastEmitter = {
  listeners: Set<(message?: string) => void>;
  emit(message?: string): void;
  subscribe(callback: (message?: string) => void): () => void;
};

export const comingSoonToastEmitter: ToastEmitter = {
  listeners: new Set(),
  emit(message?: string) {
    this.listeners.forEach(listener => listener(message));
  },
  subscribe(callback: (message?: string) => void) {
    this.listeners.add(callback);
    return () => this.listeners.delete(callback);
  }
};

export const Toaster = () => {
  const [ticks, setTicks] = useState<number[]>([]);

  useEffect(() => {
    const unsubscribe = comingSoonToastEmitter.subscribe(() => {
      const id = Date.now();
      setTicks([id]);
      setTimeout(() => {
        setTicks(current => current.filter(t => t !== id));
      }, 1900);
    });
    return unsubscribe;
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-[1000] flex items-center justify-center">
      <AnimatePresence>
        {ticks.map(id => (
          <motion.div
            key={id}
            initial={{ opacity: 0, scale: 0.35 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ type: 'spring', stiffness: 400, damping: 25 }}
            className="w-[76px] h-[76px] rounded-full bg-[#040f0c]/90 border border-emerald-400/40 shadow-[0_0_35px_rgba(16,185,129,0.42),0_12px_30px_rgba(0,0,0,0.65),inset_0_0_16px_rgba(52,211,153,0.18)] backdrop-blur-xl flex items-center justify-center"
          >
            <svg
              className="w-12 h-12 stroke-emerald-400 drop-shadow-[0_0_8px_rgba(52,211,153,0.6)]"
              viewBox="0 0 52 52"
              fill="none"
              strokeWidth="3.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <motion.circle
                cx="26"
                cy="26"
                r="23"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 0.48, ease: [0.65, 0, 0.45, 1] }}
              />
              <motion.path
                d="M14.1 27.2l7.1 7.2 16.7-16.8"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 0.35, delay: 0.32, ease: [0.65, 0, 0.45, 1] }}
              />
            </svg>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};