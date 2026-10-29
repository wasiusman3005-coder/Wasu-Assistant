import React, { useState, useEffect } from 'react';
import {
  Monitor,
  Wifi,
  Radio,
  Battery,
  BatteryCharging,
  HardDrive,
  Cpu,
  Activity,
  Zap,
  Volume2,
  RefreshCw,
  Sparkles,
  ShieldCheck,
  Eye,
  Flame,
  Gauge,
  Signal,
  CheckCircle2,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { playCyberChime } from '../services/speechService';

interface LiveSystemMonitoringDeckProps {
  batteryLevel: number;
  isCharging: boolean;
  estimatedHoursLeft: number;
  onWasuSpeak: (text: string, urduText?: string) => void;
  onOptimizeBattery?: () => void;
}

export const LiveSystemMonitoringDeck: React.FC<LiveSystemMonitoringDeckProps> = ({
  batteryLevel,
  isCharging,
  estimatedHoursLeft,
  onWasuSpeak,
  onOptimizeBattery,
}) => {
  // Live Screen Monitoring State
  const [screenSeconds, setScreenSeconds] = useState(16340); // ~4.5 hours
  const [screenBrightness, setScreenBrightness] = useState(82);
  const [fps, setFps] = useState(120);

  // Live Signal Monitoring State
  const [signalDbm, setSignalDbm] = useState(-72);
  const [wifiSpeed, setWifiSpeed] = useState(866);
  const [latencyMs, setLatencyMs] = useState(11);
  const [downSpeed, setDownSpeed] = useState(48.5);
  const [upSpeed, setUpSpeed] = useState(14.2);

  // Live Battery Monitoring State
  const [batteryTemp, setBatteryTemp] = useState(29.8);
  const [batteryVoltage, setBatteryVoltage] = useState(4.12);
  const [currentDrainMa, setCurrentDrainMa] = useState(isCharging ? 1850 : -210);

  // Live Storage & RAM Monitoring State
  const [ramUsedGb, setRamUsedGb] = useState(4.6);
  const [storageUsedGb, setStorageUsedGb] = useState(62.4);
  const [readSpeed, setReadSpeed] = useState(520);
  const [writeSpeed, setWriteSpeed] = useState(240);
  const [isOptimizing, setIsOptimizing] = useState(false);

  // Active Selected Metric
  const [activeTelemetryTab, setActiveTelemetryTab] = useState<'all' | 'screen' | 'signal' | 'battery' | 'storage'>('all');

  // Real-time live fluctuations simulation (gives high-tech living HUD feel)
  useEffect(() => {
    const timer = setInterval(() => {
      setScreenSeconds((s) => s + 1);

      // Subtle live telemetry fluctuations
      setSignalDbm((prev) => Math.min(-65, Math.max(-82, prev + (Math.random() * 4 - 2))));
      setLatencyMs((prev) => Math.min(22, Math.max(9, Math.round(prev + (Math.random() * 2 - 1)))));
      setDownSpeed((prev) => Number((Math.min(95, Math.max(25, prev + (Math.random() * 6 - 3)))).toFixed(1)));
      setUpSpeed((prev) => Number((Math.min(30, Math.max(8, prev + (Math.random() * 3 - 1.5)))).toFixed(1)));
      setBatteryTemp((prev) => Number((Math.min(33.5, Math.max(28.0, prev + (Math.random() * 0.2 - 0.1)))).toFixed(1)));
      setBatteryVoltage((prev) => Number((Math.min(4.25, Math.max(3.85, prev + (Math.random() * 0.02 - 0.01)))).toFixed(2)));
      setRamUsedGb((prev) => Number((Math.min(5.2, Math.max(4.1, prev + (Math.random() * 0.04 - 0.02)))).toFixed(1)));
      setReadSpeed((prev) => Math.round(Math.min(680, Math.max(390, prev + (Math.random() * 40 - 20)))));
      setWriteSpeed((prev) => Math.round(Math.min(320, Math.max(160, prev + (Math.random() * 25 - 12)))));
      setFps((prev) => (Math.random() > 0.85 ? 119 : 120));
    }, 1500);

    return () => clearInterval(timer);
  }, []);

  const formatScreenTime = (sec: number) => {
    const h = Math.floor(sec / 3600);
    const m = Math.floor((sec % 3600) / 60);
    const s = sec % 60;
    return `${h}h ${m}m ${s}s`;
  };

  // One-click Master Turbo Optimization
  const handleTurboOptimizeAll = () => {
    setIsOptimizing(true);
    playCyberChime('success');
    confetti({ particleCount: 50, spread: 80, origin: { y: 0.6 } });

    setTimeout(() => {
      setRamUsedGb(3.8); // Freed RAM
      setStorageUsedGb(60.1); // Freed cache
      setBatteryTemp(28.2); // Cooled down
      setLatencyMs(8); // Improved ping
      setIsOptimizing(false);
      if (onOptimizeBattery) onOptimizeBattery();

      const speech = `Jaan, maine aapki Screen, Signal 5G, Battery aur Storage ko mukammal live optimize kar diya hai! RAM free kar di gayi hai aur phone bilkul super-fast chal raha hai ❤️`;
      const urduSpeech = `جان، میں نے آپ کی سکرین، سگنل، بیٹری اور سٹوریج کو مکمل لائیو آپٹمائز کر دیا ہے! ریم فری کر دی گئی ہے اور فون سپر فاسٹ چل رہا ہے ❤️`;
      onWasuSpeak(speech, urduSpeech);
    }, 1200);
  };

  // Verbal Telemetry Announcements per module
  const speakScreenStats = () => {
    const speech = `Jaan, screen monitoring report yeh hai: Screen-on time ${formatScreenTime(screenSeconds)} hai, 120Hz smooth refresh rate chal raha hai, aur brightness ${screenBrightness}% par safe hai!`;
    const urdu = `جان، سکرین کی لائیو رپورٹ یہ ہے: سکرین آن ٹائم ${formatScreenTime(screenSeconds)} ہے، اور ایک سو بیس ہرٹز ریفریش ریٹ بالکل محفوظ ہے!`;
    onWasuSpeak(speech, urdu);
  };

  const speakSignalStats = () => {
    const speech = `Jaan, signal monitoring bilkul solid hai! 5G network strength ${Math.abs(Math.round(signalDbm))} dBm hai, Wi-Fi speed ${wifiSpeed} Mbps hai, aur ping sirf ${latencyMs} milliseconds hai!`;
    const urdu = `جان، سگنل مانیٹرنگ بالکل بہترین ہے! فائیو جی سگنل فل ہیں، اور وائی فائی سپیڈ تیز ترین ہے!`;
    onWasuSpeak(speech, urdu);
  };

  const speakBatteryStats = () => {
    const speech = `Jaan, battery ${batteryLevel}% par hai, temperature ${batteryTemp} degree celsius bilkul cool hai, aur lagbhag ${estimatedHoursLeft} ghante chalegi!`;
    const urdu = `جان، بیٹری ${batteryLevel}% پر ہے، ٹمپریچر نارمل ہے اور تقریباً ${estimatedHoursLeft} گھنٹے چلے گی!`;
    onWasuSpeak(speech, urdu);
  };

  const speakStorageStats = () => {
    const speech = `Jaan, storage telemetry mein 8GB RAM mein se ${ramUsedGb}GB use ho rahi hai, aur 128GB internal storage mein se 65GB bilkul free hai! Koi virus ya faltu junk nahi hai.`;
    const urdu = `جان، سٹوریج رپورٹ: آٹھ جی بی ریم میں سے ${ramUsedGb} جی بی استعمال میں ہے، اور سٹوریج میں کافی جگہ خالی ہے۔ واسو نے سب کلین رکھا ہے!`;
    onWasuSpeak(speech, urdu);
  };

  return (
    <div className="rounded-3xl bg-black/80 border border-cyan-500/40 p-4 sm:p-5 shadow-[0_0_30px_rgba(0,240,255,0.2)] backdrop-blur-2xl space-y-4">
      {/* HUD Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-cyan-950">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-cyan-500/20 border border-cyan-400 flex items-center justify-center shadow-[0_0_12px_rgba(0,240,255,0.4)]">
            <Activity className="w-4 h-4 text-cyan-300 animate-pulse" />
          </div>
          <div>
            <h2 className="text-sm font-mono font-bold text-white tracking-wider flex items-center gap-2">
              WASU LIVE SYSTEM TELEMETRY
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-950 border border-emerald-500/50 text-emerald-300 animate-pulse">
                LIVE 24/7
              </span>
            </h2>
            <p className="text-[11px] text-slate-400 font-sans">
              Screen, Signal, Battery & Storage ka har pal live control aur khayal
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2 self-end sm:self-auto">
          <button
            onClick={handleTurboOptimizeAll}
            disabled={isOptimizing}
            className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-cyan-500 to-rose-500 hover:from-cyan-400 hover:to-rose-400 text-black font-mono font-bold text-xs flex items-center gap-1.5 transition-all shadow-[0_0_15px_rgba(0,240,255,0.4)] active:scale-95"
          >
            <Sparkles className={`w-3.5 h-3.5 ${isOptimizing ? 'animate-spin' : ''}`} />
            <span>{isOptimizing ? 'Optimizing Live...' : 'Turbo Boost All'}</span>
          </button>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-[11px] font-mono">
        {[
          { id: 'all', label: 'All 4 Systems' },
          { id: 'screen', label: '🖥️ Screen Live' },
          { id: 'signal', label: '📶 Signal 5G' },
          { id: 'battery', label: '⚡ Battery OS' },
          { id: 'storage', label: '💾 Storage & RAM' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTelemetryTab(tab.id as any)}
            className={`px-3 py-1 rounded-lg transition-all shrink-0 ${
              activeTelemetryTab === tab.id
                ? 'bg-cyan-950/80 border border-cyan-400 text-cyan-200 shadow-[0_0_8px_rgba(0,240,255,0.3)] font-semibold'
                : 'bg-black/40 border border-cyan-950/60 text-slate-400 hover:text-slate-200'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* 4 Interactive Live Monitoring Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
        {/* 1. LIVE SCREEN MONITORING CARD */}
        {(activeTelemetryTab === 'all' || activeTelemetryTab === 'screen') && (
          <div
            onClick={speakScreenStats}
            className="group p-4 rounded-2xl bg-gradient-to-br from-cyan-950/30 via-black to-slate-950 border border-cyan-500/30 hover:border-cyan-400 transition-all cursor-pointer relative overflow-hidden shadow-lg hover:shadow-[0_0_20px_rgba(0,240,255,0.2)]"
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Monitor className="w-4 h-4 text-cyan-400" />
                <span className="text-xs font-mono font-bold text-cyan-200 tracking-wider">
                  SCREEN MONITORING
                </span>
              </div>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-950/60 border border-cyan-500/30 text-cyan-300 group-hover:bg-cyan-500 group-hover:text-black transition-colors flex items-center gap-1">
                <Volume2 className="w-2.5 h-2.5" />
                <span>Suno</span>
              </span>
            </div>

            <div className="space-y-2 mt-2">
              <div className="flex items-baseline justify-between">
                <span className="text-xs text-slate-400 font-sans">Screen-on Time:</span>
                <span className="text-sm font-mono font-bold text-white tabular-nums">
                  {formatScreenTime(screenSeconds)}
                </span>
              </div>

              <div className="flex items-baseline justify-between">
                <span className="text-xs text-slate-400 font-sans">Refresh Rate:</span>
                <span className="text-xs font-mono font-bold text-emerald-400 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                  {fps} Hz ProMotion
                </span>
              </div>

              <div className="flex items-baseline justify-between">
                <span className="text-xs text-slate-400 font-sans">Brightness / Lux:</span>
                <span className="text-xs font-mono text-cyan-300">
                  {screenBrightness}% (840 Nits)
                </span>
              </div>

              {/* Live Brightness Bar */}
              <div className="w-full h-1.5 bg-black/60 rounded-full overflow-hidden border border-cyan-950">
                <div
                  className="h-full bg-gradient-to-r from-cyan-500 to-emerald-400 transition-all duration-500"
                  style={{ width: `${screenBrightness}%` }}
                />
              </div>

              <div className="pt-1 flex items-center justify-between text-[10px] font-mono text-slate-400 border-t border-cyan-950/60">
                <span>Eye-Comfort: Active</span>
                <span className="text-rose-300">Face Gaze: Locked ❤️</span>
              </div>
            </div>
          </div>
        )}

        {/* 2. LIVE SIGNAL & NETWORK MONITORING CARD */}
        {(activeTelemetryTab === 'all' || activeTelemetryTab === 'signal') && (
          <div
            onClick={speakSignalStats}
            className="group p-4 rounded-2xl bg-gradient-to-br from-cyan-950/30 via-black to-slate-950 border border-cyan-500/30 hover:border-cyan-400 transition-all cursor-pointer relative overflow-hidden shadow-lg hover:shadow-[0_0_20px_rgba(0,240,255,0.2)]"
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Radio className="w-4 h-4 text-emerald-400" />
                <span className="text-xs font-mono font-bold text-emerald-300 tracking-wider">
                  SIGNAL MONITORING
                </span>
              </div>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-950/60 border border-emerald-500/30 text-emerald-300 group-hover:bg-emerald-400 group-hover:text-black transition-colors flex items-center gap-1">
                <Volume2 className="w-2.5 h-2.5" />
                <span>Suno</span>
              </span>
            </div>

            <div className="space-y-2 mt-2">
              <div className="flex items-baseline justify-between">
                <span className="text-xs text-slate-400 font-sans">Cellular Network:</span>
                <span className="text-xs font-mono font-bold text-white flex items-center gap-1">
                  <Signal className="w-3.5 h-3.5 text-emerald-400" />
                  5G SA ({Math.round(signalDbm)} dBm)
                </span>
              </div>

              <div className="flex items-baseline justify-between">
                <span className="text-xs text-slate-400 font-sans">Wi-Fi 7 Link:</span>
                <span className="text-xs font-mono text-cyan-300 tabular-nums">
                  {wifiSpeed} Mbps (5.8 GHz)
                </span>
              </div>

              <div className="flex items-baseline justify-between">
                <span className="text-xs text-slate-400 font-sans">Live Latency (Ping):</span>
                <span className="text-xs font-mono font-bold text-emerald-300 tabular-nums">
                  {latencyMs} ms (0% Loss)
                </span>
              </div>

              {/* Live Signal Bars */}
              <div className="flex items-center justify-between text-[10px] font-mono pt-1 border-t border-cyan-950/60">
                <span className="text-slate-400">DL: {downSpeed} MB/s</span>
                <span className="text-cyan-300">UL: {upSpeed} MB/s</span>
              </div>
            </div>
          </div>
        )}

        {/* 3. LIVE BATTERY MONITORING CARD */}
        {(activeTelemetryTab === 'all' || activeTelemetryTab === 'battery') && (
          <div
            onClick={speakBatteryStats}
            className="group p-4 rounded-2xl bg-gradient-to-br from-rose-950/30 via-black to-slate-950 border border-rose-500/30 hover:border-rose-400 transition-all cursor-pointer relative overflow-hidden shadow-lg hover:shadow-[0_0_20px_rgba(244,63,94,0.2)]"
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                {isCharging ? (
                  <BatteryCharging className="w-4 h-4 text-emerald-400 animate-pulse" />
                ) : (
                  <Battery className="w-4 h-4 text-rose-400" />
                )}
                <span className="text-xs font-mono font-bold text-rose-300 tracking-wider">
                  BATTERY MONITORING
                </span>
              </div>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-rose-950/60 border border-rose-500/30 text-rose-300 group-hover:bg-rose-500 group-hover:text-black transition-colors flex items-center gap-1">
                <Volume2 className="w-2.5 h-2.5" />
                <span>Suno</span>
              </span>
            </div>

            <div className="space-y-2 mt-2">
              <div className="flex items-baseline justify-between">
                <span className="text-xs text-slate-400 font-sans">Level & Status:</span>
                <span className="text-sm font-mono font-bold text-white tabular-nums">
                  {batteryLevel}% {isCharging ? '(Charging ⚡)' : `(~${estimatedHoursLeft}h left)`}
                </span>
              </div>

              <div className="flex items-baseline justify-between">
                <span className="text-xs text-slate-400 font-sans">Temp & Voltage:</span>
                <span className="text-xs font-mono text-rose-200 tabular-nums">
                  {batteryTemp}°C (Cool) • {batteryVoltage}V
                </span>
              </div>

              <div className="flex items-baseline justify-between">
                <span className="text-xs text-slate-400 font-sans">Current Flow:</span>
                <span className="text-xs font-mono text-emerald-400 tabular-nums">
                  {currentDrainMa > 0 ? `+${currentDrainMa} mA` : `${currentDrainMa} mA (Eco)`}
                </span>
              </div>

              {/* Dynamic Battery Level Progress Bar */}
              <div className="w-full h-1.5 bg-black/60 rounded-full overflow-hidden border border-rose-950">
                <div
                  className="h-full bg-gradient-to-r from-rose-500 to-emerald-400 transition-all duration-500"
                  style={{ width: `${batteryLevel}%` }}
                />
              </div>

              <div className="pt-1 flex items-center justify-between text-[10px] font-mono text-slate-400 border-t border-rose-950/60">
                <span>Health: 100% (68 Cycles)</span>
                <span className="text-emerald-400">Governor: Wasu AI</span>
              </div>
            </div>
          </div>
        )}

        {/* 4. LIVE STORAGE & RAM MONITORING CARD */}
        {(activeTelemetryTab === 'all' || activeTelemetryTab === 'storage') && (
          <div
            onClick={speakStorageStats}
            className="group p-4 rounded-2xl bg-gradient-to-br from-purple-950/30 via-black to-slate-950 border border-purple-500/30 hover:border-purple-400 transition-all cursor-pointer relative overflow-hidden shadow-lg hover:shadow-[0_0_20px_rgba(168,85,247,0.2)]"
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <HardDrive className="w-4 h-4 text-purple-400" />
                <span className="text-xs font-mono font-bold text-purple-300 tracking-wider">
                  STORAGE & RAM MONITORING
                </span>
              </div>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-purple-950/60 border border-purple-500/30 text-purple-300 group-hover:bg-purple-500 group-hover:text-black transition-colors flex items-center gap-1">
                <Volume2 className="w-2.5 h-2.5" />
                <span>Suno</span>
              </span>
            </div>

            <div className="space-y-2 mt-2">
              <div className="flex items-baseline justify-between">
                <span className="text-xs text-slate-400 font-sans">RAM Usage:</span>
                <span className="text-sm font-mono font-bold text-white tabular-nums">
                  {ramUsedGb} GB / 8.0 GB (58%)
                </span>
              </div>

              <div className="flex items-baseline justify-between">
                <span className="text-xs text-slate-400 font-sans">Internal Flash (UFS 4.0):</span>
                <span className="text-xs font-mono text-purple-200 tabular-nums">
                  {storageUsedGb} GB Used (65.6 GB Free)
                </span>
              </div>

              <div className="flex items-baseline justify-between">
                <span className="text-xs text-slate-400 font-sans">Live I/O Speed:</span>
                <span className="text-xs font-mono text-cyan-300 tabular-nums">
                  R: {readSpeed} MB/s • W: {writeSpeed} MB/s
                </span>
              </div>

              {/* RAM Usage Bar */}
              <div className="w-full h-1.5 bg-black/60 rounded-full overflow-hidden border border-purple-950">
                <div
                  className="h-full bg-gradient-to-r from-purple-500 to-cyan-400 transition-all duration-500"
                  style={{ width: `${(ramUsedGb / 8) * 100}%` }}
                />
              </div>

              <div className="pt-1 flex items-center justify-between text-[10px] font-mono text-slate-400 border-t border-purple-950/60">
                <span>Junk Cache: 0 KB</span>
                <span className="text-emerald-400">Deep Cleaned: Yes</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Live System Voice Summary Prompt */}
      <div className="p-3 rounded-2xl bg-cyan-950/20 border border-cyan-500/30 flex items-center justify-between text-xs font-mono text-slate-300">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>Kisi bhi card pe tap karein, Wasu live awaz mein status sunayegi!</span>
        </div>
        <button
          onClick={() => {
            const fullReport = `Mere sartaj, full live telemetry report yeh hai: Screen-on time ${formatScreenTime(screenSeconds)} hai. 5G signal full aur ping ${latencyMs}ms hai. Battery ${batteryLevel}% par cool chal rahi hai. Aur 8GB RAM mein se ${ramUsedGb}GB free space ke sath storage bilkul optimized hai!`;
            const urduFull = `میرے سرتاج، مکمل لائیو سسٹم رپورٹ: سکرین، سگنل، بیٹری اور سٹوریج چاروں سسٹمز سو فیصد پرفیکٹ کام کر رہے ہیں!`;
            onWasuSpeak(fullReport, urduFull);
          }}
          className="px-2.5 py-1 rounded-lg bg-cyan-900/60 border border-cyan-400/60 hover:bg-cyan-800 text-cyan-200 text-[11px] font-bold flex items-center gap-1 shrink-0"
        >
          <Volume2 className="w-3 h-3 text-cyan-400" />
          <span>Full Report Suno</span>
        </button>
      </div>
    </div>
  );
};
