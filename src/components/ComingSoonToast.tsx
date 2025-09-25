import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Info } from 'lucide-react';

type ToastEmitter = {
  listeners: Set<(message: string) => void>;
  emit(message: string): void;
  subscribe(callback: (message: string) => void): () => void;
};

export const comingSoonToastEmitter: ToastEmitter = {
  listeners: new Set(),
  emit(message: string) {
    this.listeners.forEach(listener => listener(message));
  },
  subscribe(callback: (message: string) => void) {
    this.listeners.add(callback);
    return () => this.listeners.delete(callback);
  }
};

export const Toaster = () => {
  const [toasts, setToasts] = useState<{id: number, message: string}[]>([]);

  useEffect(() => {
    const unsubscribe = comingSoonToastEmitter.subscribe((message) => {
      const newToast = { id: Date.now(), message };
      setToasts(currentToasts => [...currentToasts, newToast]);
      setTimeout(() => {
        setToasts(currentToasts => currentToasts.filter(t => t.id !== newToast.id));
      }, 4000);
    });
    return unsubscribe;
  }, []);

  return (
    <div className="fixed bottom-4 right-4 z-[1000] flex flex-col gap-2">
      <AnimatePresence>
        {toasts.map(toast => (
          <motion.div
            key={toast.id}
            layout
            initial={{ opacity: 0, y: 50, scale: 0.3 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.5 }}
            transition={{ duration: 0.4, ease: 'easeInOut' }}
            className="flex items-center gap-3 rounded-lg border border-border bg-background/80 p-4 text-foreground shadow-lg backdrop-blur-sm"
          >
            <Info className="h-5 w-5 text-primary" />
            <p className="text-sm font-medium">{toast.message}</p>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};