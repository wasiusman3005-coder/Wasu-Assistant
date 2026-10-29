import React, { useState } from 'react';
import { BatteryStatus } from '../types';
import {
  Battery,
  BatteryCharging,
  Zap,
  ShieldCheck,
  Wifi,
  Bluetooth,
  Moon,
  Sun,
  Camera,
  Music,
  MapPin,
  FolderOpen,
  Sliders,
  CheckCircle2,
  Trash2,
  Sparkles,
} from 'lucide-react';
import { playGeminiOrBrowserSpeech, playCyberChime } from '../services/speechService';
import confetti from 'canvas-confetti';

interface BatteryAndControlsProps {
  battery: BatteryStatus;
  onOptimizeBattery: () => void;
  onTogglePowerSaver: () => void;
  onWasuSpeak: (text: string) => void;
}

export const BatteryAndControls: React.FC<BatteryAndControlsProps> = ({
  battery,
  onOptimizeBattery,
  onTogglePowerSaver,
  onWasuSpeak,
}) => {
  const [wifiOn, setWifiOn] = useState(true);
  const [bluetoothOn, setBluetoothOn] = useState(true);
  const [dndOn, setDndOn] = useState(false);
  const [flashlightOn, setFlashlightOn] = useState(false);
  const [brightness, setBrightness] = useState(75);
  const [openedApp, setOpenedApp] = useState<string | null>(null);
  const [isCleaning, setIsCleaning] = useState(false);

  const handle1ClickOptimize = () => {
    setIsCleaning(true);
    playCyberChime('success');
    confetti({ particleCount: 35, spread: 50, origin: { y: 0.6 } });

    setTimeout(() => {
      setIsCleaning(false);
      onOptimizeBattery();
      const speech = `Jaan, maine aapke mobile ki battery optimize kardi hai! Background mein chalne wali 8 faltu apps close kardi hain aur battery life 4 ghante barh gayi hai ❤️`;
      onWasuSpeak(speech);
      playGeminiOrBrowserSpeech(speech);
    }, 900);
  };

  const handleLaunchApp = (appName: string) => {
    setOpenedApp(appName);
    playCyberChime('success');
    const speech = `Jaan, ${appName} open ho gaya hai. Aap hukum karein to main isme koi bhi task kar sakti hoon!`;
    onWasuSpeak(speech);
    playGeminiOrBrowserSpeech(speech);
  };

  return (
    <div className="space-y-5">
      {/* Top Header */}
      <div className="flex items-center justify-between pb-2 border-b border-rose-950/60">
        <div>
          <h2 className="text-base font-bold text-rose-100 flex items-center gap-2">
            <Sliders className="w-4 h-4 text-rose-400" />
            Mobile OS & Battery Optimization
          </h2>
          <p className="text-xs text-rose-300/70">
            Battery life booster, quick system toggles, aur app manager
          </p>
        </div>

        <button
          onClick={handle1ClickOptimize}
          disabled={isCleaning}
          className="px-3.5 py-1.5 text-xs font-bold bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-white rounded-lg flex items-center gap-1.5 transition-all shadow-md shadow-emerald-950/60 active:scale-95 disabled:opacity-50"
        >
          <Zap className={`w-3.5 h-3.5 text-amber-200 ${isCleaning ? 'animate-spin' : ''}`} />
          {isCleaning ? 'Optimizing...' : '1-Click Boost & Clean'}
        </button>
      </div>

      {/* Battery State Hero Card */}
      <div className="p-4 rounded-2xl bg-gradient-to-br from-black/80 via-rose-950/30 to-black/90 border border-rose-900/50 flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Left: Battery Percentage & Visual Ring */}
        <div className="flex items-center gap-4">
          <div className="relative w-16 h-16 rounded-full border-4 border-rose-500/20 flex items-center justify-center">
            <div
              className={`absolute inset-0 rounded-full border-4 transition-all duration-700 ${
                battery.level > 50
                  ? 'border-emerald-500 shadow-emerald-500/30'
                  : battery.level > 20
                  ? 'border-amber-500'
                  : 'border-red-500 animate-pulse'
              }`}
              style={{
                clipPath: `polygon(50% 50%, 50% 0%, 100% 0%, 100% 100%, 0% 100%, 0% 0%)`,
              }}
            />
            <div className="text-center">
              <span className="text-lg font-extrabold text-white font-mono tabular-nums">
                {battery.level}%
              </span>
            </div>
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold text-rose-100 flex items-center gap-1.5">
                {battery.isCharging ? (
                  <BatteryCharging className="w-4 h-4 text-emerald-400 animate-pulse" />
                ) : (
                  <Battery className="w-4 h-4 text-rose-400" />
                )}
                Battery Health: Optimal
              </h3>
              {battery.optimized && (
                <span className="text-[10px] bg-emerald-950 text-emerald-300 border border-emerald-500/40 px-1.5 py-0.5 rounded-full font-medium flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3" /> AI Protected
                </span>
              )}
            </div>
            <p className="text-xs text-rose-300/80 mt-1">
              Estimated Time: <span className="font-bold text-white">{battery.estimatedHoursLeft} ghante</span> mazeed chalegi
            </p>
            <p className="text-[11px] text-pink-300/70">
              Wasu ne background apps throttle kar ke heating kam kardi hai.
            </p>
          </div>
        </div>

        {/* Right: Power Saver Button */}
        <button
          onClick={onTogglePowerSaver}
          className={`px-4 py-2 text-xs font-semibold rounded-xl border transition-all flex items-center gap-2 ${
            battery.powerSaverMode
              ? 'bg-amber-950/80 border-amber-500 text-amber-200 shadow-md shadow-amber-950/50'
              : 'bg-black/50 border-rose-950 text-rose-300 hover:bg-rose-950/30'
          }`}
        >
          <Zap className="w-4 h-4 text-amber-400" />
          Ultra Power Saver: {battery.powerSaverMode ? 'ON' : 'OFF'}
        </button>
      </div>

      {/* Quick Mobile System Controls */}
      <div>
        <h3 className="text-xs font-bold text-rose-200 mb-2">Device Quick Switches:</h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
          {/* Wi-Fi */}
          <button
            onClick={() => setWifiOn(!wifiOn)}
            className={`p-3 rounded-xl border transition-all flex items-center gap-2.5 text-left ${
              wifiOn
                ? 'bg-rose-950/60 border-rose-500/50 text-rose-100 shadow-sm'
                : 'bg-black/40 border-rose-950 text-rose-400/50'
            }`}
          >
            <Wifi className="w-4 h-4" />
            <div>
              <div className="text-xs font-semibold">Wi-Fi</div>
              <div className="text-[10px] text-rose-300/70">{wifiOn ? 'Connected' : 'Turned Off'}</div>
            </div>
          </button>

          {/* Bluetooth */}
          <button
            onClick={() => setBluetoothOn(!bluetoothOn)}
            className={`p-3 rounded-xl border transition-all flex items-center gap-2.5 text-left ${
              bluetoothOn
                ? 'bg-blue-950/60 border-blue-500/50 text-blue-100 shadow-sm'
                : 'bg-black/40 border-rose-950 text-rose-400/50'
            }`}
          >
            <Bluetooth className="w-4 h-4" />
            <div>
              <div className="text-xs font-semibold">Bluetooth</div>
              <div className="text-[10px] text-rose-300/70">{bluetoothOn ? 'Active' : 'Turned Off'}</div>
            </div>
          </button>

          {/* Do Not Disturb (DND) */}
          <button
            onClick={() => setDndOn(!dndOn)}
            className={`p-3 rounded-xl border transition-all flex items-center gap-2.5 text-left ${
              dndOn
                ? 'bg-purple-950/60 border-purple-500/50 text-purple-100 shadow-sm'
                : 'bg-black/40 border-rose-950 text-rose-400/50'
            }`}
          >
            <Moon className="w-4 h-4" />
            <div>
              <div className="text-xs font-semibold">Do Not Disturb</div>
              <div className="text-[10px] text-rose-300/70">{dndOn ? 'Silent Mode' : 'Off'}</div>
            </div>
          </button>

          {/* Flashlight */}
          <button
            onClick={() => setFlashlightOn(!flashlightOn)}
            className={`p-3 rounded-xl border transition-all flex items-center gap-2.5 text-left ${
              flashlightOn
                ? 'bg-amber-950/60 border-amber-500/50 text-amber-100 shadow-sm'
                : 'bg-black/40 border-rose-950 text-rose-400/50'
            }`}
          >
            <Sun className="w-4 h-4" />
            <div>
              <div className="text-xs font-semibold">Flashlight</div>
              <div className="text-[10px] text-rose-300/70">{flashlightOn ? 'Glowing' : 'Off'}</div>
            </div>
          </button>
        </div>
      </div>

      {/* Screen Brightness Slider */}
      <div className="p-3.5 rounded-xl bg-black/40 border border-rose-950/70 flex items-center gap-4">
        <Sun className="w-4 h-4 text-amber-300 shrink-0" />
        <div className="flex-1">
          <div className="flex justify-between text-xs text-rose-200 mb-1">
            <span>Adaptive Screen Brightness (Wasu AI Eye Comfort)</span>
            <span className="font-mono tabular-nums">{brightness}%</span>
          </div>
          <input
            type="range"
            min="20"
            max="100"
            value={brightness}
            onChange={(e) => setBrightness(parseInt(e.target.value))}
            className="w-full accent-rose-500 cursor-pointer"
          />
        </div>
      </div>

      {/* Mobile App Launcher Drawer */}
      <div>
        <h3 className="text-xs font-bold text-rose-200 mb-2">Simulated Mobile Apps (Wasu Controlled):</h3>
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
          <button
            onClick={() => handleLaunchApp('Camera')}
            className="p-3 rounded-xl bg-black/40 border border-rose-950/60 hover:bg-rose-950/30 text-rose-200 flex flex-col items-center justify-center gap-1.5 transition-colors group"
          >
            <Camera className="w-5 h-5 text-rose-400 group-hover:scale-110 transition-transform" />
            <span className="text-[11px] font-medium">Camera</span>
          </button>

          <button
            onClick={() => handleLaunchApp('Romantic Music')}
            className="p-3 rounded-xl bg-black/40 border border-rose-950/60 hover:bg-rose-950/30 text-rose-200 flex flex-col items-center justify-center gap-1.5 transition-colors group"
          >
            <Music className="w-5 h-5 text-pink-400 group-hover:scale-110 transition-transform" />
            <span className="text-[11px] font-medium">Music Player</span>
          </button>

          <button
            onClick={() => handleLaunchApp('Google Maps GPS')}
            className="p-3 rounded-xl bg-black/40 border border-rose-950/60 hover:bg-rose-950/30 text-rose-200 flex flex-col items-center justify-center gap-1.5 transition-colors group"
          >
            <MapPin className="w-5 h-5 text-emerald-400 group-hover:scale-110 transition-transform" />
            <span className="text-[11px] font-medium">Maps & GPS</span>
          </button>

          <button
            onClick={() => handleLaunchApp('Personal Diary & Notes')}
            className="p-3 rounded-xl bg-black/40 border border-rose-950/60 hover:bg-rose-950/30 text-rose-200 flex flex-col items-center justify-center gap-1.5 transition-colors group"
          >
            <FolderOpen className="w-5 h-5 text-amber-400 group-hover:scale-110 transition-transform" />
            <span className="text-[11px] font-medium">Notes & Diary</span>
          </button>

          <button
            onClick={() => handleLaunchApp('Junk File Cleaner')}
            className="p-3 rounded-xl bg-black/40 border border-rose-950/60 hover:bg-rose-950/30 text-rose-200 flex flex-col items-center justify-center gap-1.5 transition-colors group"
          >
            <Trash2 className="w-5 h-5 text-cyan-400 group-hover:scale-110 transition-transform" />
            <span className="text-[11px] font-medium">Storage Cleaner</span>
          </button>
        </div>
      </div>

      {/* App Launch Feedback Modal */}
      {openedApp && (
        <div className="p-4 rounded-xl bg-rose-950/70 border border-rose-500/50 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span className="text-xs text-rose-100">
              <strong>{openedApp}</strong> is active and connected to Wasu Love Jarvis core!
            </span>
          </div>
          <button
            onClick={() => setOpenedApp(null)}
            className="text-xs text-rose-300 hover:text-white underline ml-2"
          >
            Close
          </button>
        </div>
      )}
    </div>
  );
};
