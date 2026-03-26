'use client';
import { useState } from 'react';
import { Copy, Check, ExternalLink, QrCode, X } from 'lucide-react';

interface Props {
  url: string;
  label: string;
}

export function LinkCopiavel({ url, label }: Props) {
  const [copied, setCopied] = useState(false);
  const [showQR, setShowQR] = useState(false);

  async function copy() {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      // fallback para navegadores sem clipboard API
      const ta = document.createElement('textarea');
      ta.value = url;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      document.body.removeChild(ta);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  }

  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=240x240&data=${encodeURIComponent(url)}&bgcolor=0d0d0d&color=f97316&qzone=2`;

  return (
    <div className="flex flex-col gap-3">
      <p className="text-xs text-zinc-500 font-medium">{label}</p>

      {/* URL bar */}
      <div className="flex items-center gap-2 bg-zinc-900 border border-zinc-700 rounded-2xl px-4 py-3 group">
        <span className="flex-1 text-sm text-zinc-300 font-mono truncate select-all">{url}</span>

        {/* Copiar */}
        <button
          onClick={copy}
          title="Copiar link"
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex-shrink-0 ${
            copied
              ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/20'
              : 'bg-zinc-800 text-zinc-400 hover:text-white hover:bg-zinc-700 border border-zinc-700'
          }`}
        >
          {copied ? (
            <><Check className="w-3.5 h-3.5" /> Copiado!</>
          ) : (
            <><Copy className="w-3.5 h-3.5" /> Copiar</>
          )}
        </button>

        {/* Abrir */}
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          title="Abrir em nova aba"
          className="w-8 h-8 flex items-center justify-center rounded-xl text-zinc-600 hover:text-zinc-300 hover:bg-zinc-800 transition-all flex-shrink-0"
        >
          <ExternalLink className="w-3.5 h-3.5" />
        </a>

        {/* QR Code */}
        <button
          onClick={() => setShowQR(true)}
          title="Ver QR Code"
          className="w-8 h-8 flex items-center justify-center rounded-xl text-zinc-600 hover:text-orange-400 hover:bg-orange-500/10 transition-all flex-shrink-0"
        >
          <QrCode className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Modal QR Code */}
      {showQR && (
        <div
          className="fixed inset-0 z-[300] flex items-center justify-center bg-black/80 backdrop-blur-md p-6"
          onClick={() => setShowQR(false)}
        >
          <div
            className="bg-[#0d0d0d] border border-zinc-800 rounded-3xl p-8 flex flex-col items-center gap-5 shadow-2xl max-w-xs w-full"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-center justify-between w-full">
              <h3 className="text-white font-black text-base">QR Code de Agendamento</h3>
              <button
                onClick={() => setShowQR(false)}
                className="w-8 h-8 rounded-xl flex items-center justify-center text-zinc-500 hover:text-white hover:bg-zinc-800 transition-all"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* QR Code gerado via API pública */}
            <div className="bg-[#0d0d0d] rounded-2xl p-3 border border-zinc-800">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={qrUrl}
                alt="QR Code de agendamento"
                width={200}
                height={200}
                className="rounded-xl"
              />
            </div>

            <p className="text-zinc-500 text-xs text-center leading-relaxed">
              Imprima ou exiba na barbearia para que os clientes agendem diretamente pelo celular.
            </p>

            <a
              href={qrUrl}
              download="qrcode-agendamento.png"
              className="w-full text-center py-3 rounded-2xl bg-orange-500 hover:bg-orange-600 text-black font-bold text-sm transition-all active:scale-95"
            >
              Baixar QR Code
            </a>
          </div>
        </div>
      )}
    </div>
  );
}
