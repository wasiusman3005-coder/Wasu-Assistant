import React, { useState } from 'react';
import { usePWAInstall } from '../hooks/usePWAInstall';
import { Download, Smartphone, X, CheckCircle, Share2, PlusSquare } from 'lucide-react';

export const PWAInstallButton: React.FC = () => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [showIOSGuide, setShowIOSGuide] = useState(false);
  const [justInstalled, setJustInstalled] = useState(false);

  // If already running in standalone mode, show subtle green verified badge or hide
  if (isInstalled || justInstalled) {
    return (
      <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-950/60 border border-emerald-500/40 text-emerald-300 text-[11px] font-mono">
        <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
        <span>INSTALLED APP</span>
      </div>
    );
  }

  const handleInstallClick = async () => {
    const success = await install();
    if (success) {
      setJustInstalled(true);
    }
  };

  // Chromium / Android / Desktop flow
  if (isInstallable) {
    return (
      <button
        onClick={handleInstallClick}
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gradient-to-r from-cyan-600 via-cyan-500 to-rose-600 hover:from-cyan-500 hover:to-rose-500 text-black font-bold text-xs font-mono shadow-[0_0_15px_rgba(0,245,212,0.4)] transition-all transform active:scale-95 cursor-pointer"
        title="Install WASU LOVE on your phone or desktop"
      >
        <Download className="w-3.5 h-3.5" />
        <span>INSTALL APP</span>
      </button>
    );
  }

  // iOS Safari flow
  if (isIOS) {
    return (
      <>
        <button
          onClick={() => setShowIOSGuide(true)}
          className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-rose-950/50 border border-rose-500/40 text-rose-200 hover:text-white text-xs font-mono transition-all"
        >
          <Smartphone className="w-3.5 h-3.5 text-rose-400" />
          <span>INSTALL ON IPHONE</span>
        </button>

        {showIOSGuide && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-in fade-in">
            <div className="w-full max-w-sm rounded-2xl bg-[#090514] border border-cyan-500/50 p-6 shadow-2xl text-slate-100">
              <div className="flex items-center justify-between pb-3 border-b border-cyan-900/40">
                <div className="flex items-center gap-2">
                  <Smartphone className="w-5 h-5 text-cyan-400" />
                  <h3 className="font-bold font-mono text-sm text-cyan-300">INSTALL ON IPHONE / IPAD</h3>
                </div>
                <button
                  onClick={() => setShowIOSGuide(false)}
                  className="text-slate-400 hover:text-white p-1"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="mt-4 space-y-3 text-xs text-slate-300 font-sans">
                <div className="flex items-start gap-3 p-2.5 rounded-xl bg-black/40 border border-cyan-950">
                  <div className="w-6 h-6 rounded-full bg-cyan-500/20 text-cyan-400 flex items-center justify-center font-mono font-bold shrink-0">
                    1
                  </div>
                  <div>
                    <span className="font-semibold text-white">Share Button:</span>
                    <p className="text-slate-400 mt-0.5 flex items-center gap-1">
                      Safari toolbar mein <Share2 className="w-3.5 h-3.5 inline text-cyan-400" /> icon dabayein.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-2.5 rounded-xl bg-black/40 border border-cyan-950">
                  <div className="w-6 h-6 rounded-full bg-rose-500/20 text-rose-400 flex items-center justify-center font-mono font-bold shrink-0">
                    2
                  </div>
                  <div>
                    <span className="font-semibold text-white">Add to Home Screen:</span>
                    <p className="text-slate-400 mt-0.5 flex items-center gap-1">
                      Neeche scroll karein aur <PlusSquare className="w-3.5 h-3.5 inline text-rose-400" /> <strong>"Add to Home Screen"</strong> par tap karein.
                    </p>
                  </div>
                </div>
              </div>

              <button
                onClick={() => setShowIOSGuide(false)}
                className="mt-5 w-full py-2.5 rounded-xl bg-cyan-500 text-black font-bold font-mono text-xs hover:bg-cyan-400 transition"
              >
                THEEK HAI (DONE)
              </button>
            </div>
          </div>
        )}
      </>
    );
  }

  // Fallback trigger button allowing user to click and get guidance or native prompt
  return (
    <button
      onClick={() => {
        alert('App Installation: Chrome ya Edge menu (3 dots) par click kar ke "Install WASU LOVE" select karein, ya Android phone par browser menu se "Add to Home screen" karein!');
      }}
      className="hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-cyan-950/40 border border-cyan-500/30 text-cyan-300 hover:text-white text-xs font-mono transition-all"
      title="Install as Progressive Web App"
    >
      <Download className="w-3.5 h-3.5 text-cyan-400" />
      <span>INSTALL PWA</span>
    </button>
  );
};
