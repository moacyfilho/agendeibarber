'use client';
import { useState, useEffect } from 'react';
import { Download, X, Smartphone } from 'lucide-react';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export function PWAProvider() {
  const [installPrompt, setInstallPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showBanner, setShowBanner] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);

  useEffect(() => {
    // Registra service worker
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker
        .register('/sw.js', { scope: '/' })
        .catch(() => {}); // silencia erros de registro
    }

    // Detecta se já está instalado (modo standalone)
    const standalone =
      window.matchMedia('(display-mode: standalone)').matches ||
      (navigator as any).standalone === true;
    if (standalone) {
      setIsInstalled(true);
      return;
    }

    // Detecta iOS para mostrar instrução manual
    const ios = /iphone|ipad|ipod/i.test(navigator.userAgent);
    setIsIOS(ios);

    // Captura evento de instalação (Android/Chrome)
    const handler = (e: Event) => {
      e.preventDefault();
      setInstallPrompt(e as BeforeInstallPromptEvent);
    };
    window.addEventListener('beforeinstallprompt', handler);

    // Mostra banner após 3s se não dispensou antes
    const dismissed = sessionStorage.getItem('pwa-banner-dismissed');
    if (!dismissed) {
      setTimeout(() => setShowBanner(true), 3000);
    }

    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  function dismiss() {
    setShowBanner(false);
    sessionStorage.setItem('pwa-banner-dismissed', '1');
  }

  async function install() {
    if (!installPrompt) return;
    await installPrompt.prompt();
    const { outcome } = await installPrompt.userChoice;
    if (outcome === 'accepted') setIsInstalled(true);
    setShowBanner(false);
    setInstallPrompt(null);
  }

  if (isInstalled || !showBanner) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-[9999] px-4 pb-4 animate-in slide-in-from-bottom-4 duration-400">
      <div className="bg-zinc-900 border border-zinc-700 rounded-2xl shadow-2xl shadow-black/60 p-4 flex items-center gap-4 max-w-sm mx-auto">
        {/* Ícone */}
        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-orange-500 to-orange-700 flex items-center justify-center flex-shrink-0 shadow-lg shadow-orange-500/20">
          <span className="text-2xl">✂️</span>
        </div>

        {/* Texto */}
        <div className="flex-1 min-w-0">
          <p className="text-white font-bold text-sm">Instalar Agendei Barber</p>
          {isIOS ? (
            <p className="text-zinc-500 text-xs mt-0.5 leading-snug">
              Toque em <span className="text-zinc-300">Compartilhar</span> →{' '}
              <span className="text-zinc-300">Tela de Início</span>
            </p>
          ) : (
            <p className="text-zinc-500 text-xs mt-0.5">Acesso rápido como app nativo</p>
          )}
        </div>

        {/* Ações */}
        <div className="flex items-center gap-2 flex-shrink-0">
          {!isIOS && installPrompt && (
            <button
              onClick={install}
              className="flex items-center gap-1.5 px-3 py-2 bg-orange-500 hover:bg-orange-400 text-black font-bold text-xs rounded-xl transition-all active:scale-95"
            >
              <Download className="w-3.5 h-3.5" />
              Instalar
            </button>
          )}
          <button
            onClick={dismiss}
            className="w-8 h-8 flex items-center justify-center rounded-xl text-zinc-600 hover:text-zinc-400 hover:bg-zinc-800 transition-all"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
