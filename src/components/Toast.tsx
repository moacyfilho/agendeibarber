'use client';
import { useState, useCallback, createContext, useContext, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { CheckCircle2, XCircle, Info, X } from 'lucide-react';

type ToastType = 'success' | 'error' | 'info';
type Toast = { id: string; message: string; type: ToastType };

const ToastContext = createContext<{ toast: (msg: string, type?: ToastType) => void }>({ toast: () => {} });

export function useToast() { return useContext(ToastContext); }

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  const toast = useCallback((message: string, type: ToastType = 'success') => {
    const id = Math.random().toString(36).slice(2);
    setToasts(p => [...p, { id, message, type }]);
    setTimeout(() => setToasts(p => p.filter(t => t.id !== id)), 4500);
  }, []);

  const dismiss = (id: string) => setToasts(p => p.filter(t => t.id !== id));

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}
      {mounted && createPortal(
        <div className="fixed bottom-6 right-6 z-[999] flex flex-col gap-2.5 pointer-events-none">
          {toasts.map(t => (
            <div
              key={t.id}
              className={`flex items-center gap-3 pl-4 pr-3 py-3 rounded-2xl border shadow-2xl pointer-events-auto text-sm font-bold backdrop-blur-xl min-w-[280px] max-w-sm
                animate-in slide-in-from-right-4 fade-in duration-300
                ${t.type === 'success' ? 'bg-emerald-950/95 border-emerald-500/25 text-emerald-200' :
                  t.type === 'error'   ? 'bg-red-950/95 border-red-500/25 text-red-200' :
                                         'bg-zinc-900/95 border-zinc-700/30 text-zinc-200'}`}
            >
              {t.type === 'success' ? <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" /> :
               t.type === 'error'   ? <XCircle className="w-4 h-4 text-red-400 flex-shrink-0" /> :
                                      <Info className="w-4 h-4 text-zinc-400 flex-shrink-0" />}
              <span className="flex-1 leading-snug">{t.message}</span>
              <button onClick={() => dismiss(t.id)} className="p-1 opacity-50 hover:opacity-100 transition-opacity flex-shrink-0">
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>,
        document.body
      )}
    </ToastContext.Provider>
  );
}
