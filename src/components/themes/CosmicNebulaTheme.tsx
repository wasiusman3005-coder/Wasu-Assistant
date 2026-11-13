import React, { useState, useEffect } from "react";
import {
  Layers,
  Settings,
  Lock,
  Sparkles,
  Zap,
  MapPin,
  Smartphone,
  Eye,
  EyeOff,
  FileText,
  Music,
  Video,
  Image,
  FolderDown,
  Terminal,
  Search,
  Mic,
  Shield,
} from "lucide-react";
import { soundEffects } from "../../services/soundEffects";
import { speechService } from "../../services/speechService";
import { UserProfile, DashboardCustomization, LanguageCode, VoiceGender, JarvisInterfaceThemeId } from "../../types";
import { ALL_JARVIS_THEMES } from "./themesData";
import { QuantumFieldsBar } from "../QuantumFieldsBar";

interface CosmicNebulaThemeProps {
  userProfile: UserProfile;
  customization: DashboardCustomization;
  coherence: number;
  screenWorkMinutes: number;
  onOpenVoiceModal: () => void;
  onOpenAppsMatrix: () => void;
  onOpenModule?: (moduleId: any) => void;
  onOpenSettings: () => void;
  onTriggerHealthLockdown: () => void;
  onLockScreen?: () => void;
  onToggleAwayMode?: () => void;
  onSelectTheme: (themeId: JarvisInterfaceThemeId) => void;
  language: LanguageCode;
  voiceGender: VoiceGender;
}

export const CosmicNebulaTheme: React.FC<CosmicNebulaThemeProps> = ({
  customization,
  coherence,
  onOpenVoiceModal,
  onOpenAppsMatrix,
  onOpenModule,
  onOpenSettings,
  onLockScreen,
  onToggleAwayMode,
  onSelectTheme,
  language,
  voiceGender,
}) => {
  const [hackingProgress1, setHackingProgress1] = useState(52);
  const [hackingProgress2, setHackingProgress2] = useState(44);
  const [coreDegree, setCoreDegree] = useState(0);
  const [isPrivacyCloak, setIsPrivacyCloak] = useState(false);
  const [isThemePickerOpen, setIsThemePickerOpen] = useState(false);
  const [searchInput, setSearchInput] = useState("");

  useEffect(() => {
    const timer = setInterval(() => {
      setCoreDegree((prev) => (prev + 1.5) % 360);
      setHackingProgress1((prev) => (prev >= 100 ? 15 : prev + 2));
      setHackingProgress2((prev) => (prev >= 100 ? 10 : prev + 3));
    }, 140);
    return () => clearInterval(timer);
  }, []);

  const leftBranchNodes = [
    { label: "Images", icon: Image, id: "records" },
    { label: "Documents", icon: FileText, id: "records" },
    { label: "Downloads", icon: FolderDown, id: "records" },
    { label: "Videos", icon: Video, id: "desktop" },
    { label: "Music", icon: Music, id: "desktop" },
    { label: "Automation", icon: Terminal, id: "automation" },
  ];

  const rightBranchNodes = [
    { label: "Comm Hub", icon: Zap, id: "communication" },
    { label: "Study Hub", icon: FileText, id: "study" },
    { label: "Health", icon: Shield, id: "health" },
    { label: "Finance", icon: Zap, id: "finance" },
    { label: "Maps Radar", icon: MapPin, id: "maps" },
    { label: "Device Link", icon: Smartphone, id: "devices" },
  ];

  return (
    <div className="relative w-full min-h-screen bg-[#01050c] text-slate-100 font-mono select-none overflow-x-hidden flex flex-col justify-between p-3 md:p-5">
      {/* Diagonal Luminous Cosmic Blue Nebula Wave Rift (Exact match to images__4__27575c52.jpg) */}
      <div
        className="fixed inset-0 pointer-events-none z-0"
        style={{
          background: `
            radial-gradient(ellipse 85% 45% at 50% 45%, rgba(14, 165, 233, 0.35) 0%, rgba(2, 132, 199, 0.14) 45%, transparent 75%),
            radial-gradient(ellipse 60% 25% at 25% 80%, rgba(56, 189, 248, 0.25) 0%, transparent 70%),
            radial-gradient(ellipse 70% 28% at 78% 68%, rgba(6, 182, 212, 0.32) 0%, transparent 70%)
          `,
        }}
      />

      {/* TOP BAR: Glowing White Google Search Pill + Controls */}
      <header className="relative z-20 flex flex-wrap items-center justify-between gap-3 pb-2 border-b border-sky-500/20">
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-orbitron font-bold text-sky-400 tracking-widest uppercase">
            COSMIC NEBULA // JARVIS
          </span>
        </div>

        {/* White Glowing Google Quick Bar (Exact center-top of images__4__27575c52.jpg) */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            soundEffects.playBeepConfirm();
            onOpenVoiceModal();
          }}
          className="hidden md:flex items-center gap-2 px-3 py-1 rounded-full bg-white text-slate-900 shadow-[0_0_20px_rgba(255,255,255,0.65)] w-64"
        >
          <Search className="w-3.5 h-3.5 text-sky-600" />
          <input
            type="text"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="Google / Neural Query..."
            className="flex-1 bg-transparent text-xs text-slate-900 placeholder-slate-500 focus:outline-none font-sans font-semibold"
          />
        </form>

        {/* Header Right Controls */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="relative">
            <button
              type="button"
              onClick={() => {
                soundEffects.playClick();
                setIsThemePickerOpen(!isThemePickerOpen);
              }}
              className="px-3 py-1.5 rounded-xl bg-sky-950/90 hover:bg-sky-900 border border-sky-400/60 text-sky-200 text-xs flex items-center gap-1.5 cursor-pointer shadow-[0_0_15px_rgba(56,189,248,0.3)]"
            >
              <Sparkles className="w-3.5 h-3.5 text-sky-300" />
              <span>THEMES (7)</span>
            </button>

            {isThemePickerOpen && (
              <div className="absolute right-0 top-10 w-72 bg-[#02040f]/95 border-2 border-sky-400 rounded-2xl p-2 shadow-2xl z-50 flex flex-col gap-1.5 backdrop-blur-2xl">
                <div className="text-[10px] font-bold text-sky-400 px-2 py-1 border-b border-slate-800">
                  SWITCH INTERFACE THEME
                </div>
                {ALL_JARVIS_THEMES.map((t) => (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => {
                      soundEffects.playBeepConfirm();
                      onSelectTheme(t.id);
                      setIsThemePickerOpen(false);
                    }}
                    className={`flex items-center gap-2 p-1.5 rounded-xl text-left text-xs transition cursor-pointer ${
                      t.id === (customization.activeInterfaceTheme || "cosmic_nebula")
                        ? "bg-sky-950 text-sky-300 border border-sky-400 font-bold"
                        : "hover:bg-slate-900 text-slate-300"
                    }`}
                  >
                    <img src={t.imagePath} alt={t.name} className="w-8 h-8 rounded-lg object-cover border border-slate-700" />
                    <div>
                      <div className="font-bold text-[11px]">{t.name}</div>
                      <div className="text-[9px] text-slate-400 truncate max-w-[170px]">{t.tagline}</div>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>

          <button
            type="button"
            onClick={() => {
              soundEffects.playClick();
              setIsPrivacyCloak(!isPrivacyCloak);
            }}
            className={`px-2.5 py-1.5 rounded-xl text-xs flex items-center gap-1 cursor-pointer ${
              isPrivacyCloak ? "bg-red-500 text-black font-bold" : "bg-slate-900 border border-slate-800 text-slate-300"
            }`}
          >
            {isPrivacyCloak ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5 text-sky-400" />}
            <span className="hidden sm:inline">{isPrivacyCloak ? "CLOAK ON" : "CLOAK"}</span>
          </button>

          <button
            type="button"
            onClick={() => {
              soundEffects.playClick();
              onOpenVoiceModal();
            }}
            className="px-2.5 py-1.5 rounded-xl bg-slate-900 hover:bg-sky-950 border border-sky-500/40 text-sky-300 text-xs flex items-center gap-1 cursor-pointer"
          >
            <Mic className="w-3.5 h-3.5 text-sky-400" />
            <span className="hidden sm:inline">VOICE</span>
          </button>

          <button
            type="button"
            onClick={() => {
              soundEffects.playClick();
              onOpenAppsMatrix();
            }}
            className="px-2.5 py-1.5 rounded-xl bg-slate-900 hover:bg-sky-950 border border-sky-500/40 text-sky-300 text-xs flex items-center gap-1 cursor-pointer"
          >
            <Layers className="w-3.5 h-3.5 text-sky-400" />
            <span className="hidden sm:inline">APPS</span>
          </button>

          <button
            type="button"
            onClick={() => {
              soundEffects.playClick();
              onOpenSettings();
            }}
            className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-300 cursor-pointer"
          >
            <Settings className="w-4 h-4" />
          </button>

          {onToggleAwayMode && (
            <button
              type="button"
              onClick={() => {
                soundEffects.playClick();
                onToggleAwayMode();
              }}
              className="p-2 rounded-xl bg-slate-900 hover:bg-amber-950 border border-slate-700 text-amber-300 cursor-pointer"
              title="Away Mode"
            >
              <Shield className="w-4 h-4" />
            </button>
          )}

          {onLockScreen && (
            <button
              type="button"
              onClick={() => {
                soundEffects.playAlert();
                onLockScreen();
              }}
              className="px-2.5 py-1.5 rounded-xl bg-red-950/80 hover:bg-red-900 border border-red-500/60 text-red-300 text-xs font-bold flex items-center gap-1 cursor-pointer"
            >
              <Lock className="w-3.5 h-3.5 text-red-400" />
              <span>LOCK</span>
            </button>
          )}
        </div>
      </header>
      <div className="my-1.5 relative z-20">
        <QuantumFieldsBar
          activeThemeId={customization.activeInterfaceTheme || "cosmic_nebula"}
          onSelectTheme={onSelectTheme}
        />
      </div>

      {/* MAIN WORKSPACE */}
      <main className="relative z-10 flex-1 grid grid-cols-1 lg:grid-cols-12 gap-5 my-3 items-center">
        {/* LEFT COLUMN: MARCH 31 DIAL, 100% AC LINE, BOTTOM-LEFT ARC RING */}
        <div className="lg:col-span-3 flex flex-col gap-4 border-l-2 border-cyan-400/70 pl-3">
          {/* March 31 Circular Ring (Exact from top-left of images__4__27575c52.jpg) */}
          <div className="flex items-center gap-3">
            <div className="relative w-24 h-24 rounded-full border-4 border-cyan-400 flex flex-col items-center justify-center shadow-[0_0_25px_#00f5ff] shrink-0">
              <span className="text-[9px] text-cyan-300 font-bold uppercase">march</span>
              <span className="text-3xl font-orbitron font-extrabold text-white">31</span>
            </div>
            <div className="text-[10px] space-y-1">
              <div className="text-cyan-300 font-bold">Saturday</div>
              <div className="text-slate-300">Full Capacity: 590 GB</div>
              <div className="text-emerald-400 font-bold">Free Capacity: 412 GB</div>
            </div>
          </div>

          {/* 100% AC Line Gauge */}
          <div className="flex items-center gap-3">
            <div className="relative w-16 h-16 rounded-full border-2 border-cyan-400 flex flex-col items-center justify-center shadow-[0_0_15px_#00f5ff]">
              <span className="text-xs font-bold text-white">100%</span>
              <span className="text-[7px] text-cyan-300">AC Line</span>
            </div>
            <div className="text-[10px] text-slate-300">
              <div className="text-cyan-300 font-bold">Power Matrix</div>
              <div>Waste Status: Clean</div>
            </div>
          </div>

          {/* Bottom-Left Segmented Arc (00.00.4.30) */}
          <div className="flex items-center gap-3">
            <div className="relative w-20 h-20 flex items-center justify-center">
              <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="42" fill="none" stroke="#00f5ff" strokeWidth="8" strokeDasharray="190 265" />
                <circle cx="50" cy="50" r="30" fill="none" stroke="#38bdf8" strokeWidth="4" strokeDasharray="120 200" />
              </svg>
              <div className="absolute text-center text-[8px] font-bold text-cyan-200">
                <div>0.0K</div>
                <div>0.0K</div>
              </div>
            </div>
            <div className="text-[10px] font-bold text-cyan-300">
              {isPrivacyCloak ? "00.00.X.XX" : "00.00.4.30"}
            </div>
          </div>
        </div>

        {/* CENTER COLUMN: WHITE-HOT ARC REACTOR + 6° FAIR DIAL + ORTHOGONAL BRANCH NODE TREE */}
        <div className="lg:col-span-6 flex flex-col items-center justify-center">
          <div className="flex items-center justify-center gap-6 mb-4">
            {/* Glowing White-Hot Arc Reactor Circle */}
            <div
              onClick={() => {
                soundEffects.playShockwave();
                speechService.speak("Cosmic nebula arc node matrix active.", {
                  lang: language,
                  gender: voiceGender,
                });
              }}
              className="relative w-44 h-44 md:w-52 md:h-52 rounded-full flex items-center justify-center cursor-pointer"
            >
              <div
                className="absolute inset-0 rounded-full border-[6px] border-cyan-400 shadow-[0_0_45px_#00f5ff]"
                style={{ transform: `rotate(${coreDegree}deg)` }}
              />
              <div className="relative w-28 h-28 md:w-32 md:h-32 rounded-full bg-gradient-to-tr from-sky-900 via-white to-cyan-200 border-4 border-cyan-300 flex flex-col items-center justify-center shadow-[0_0_50px_#ffffff]">
                <Zap className="w-9 h-9 text-sky-950 animate-pulse" />
                <span className="text-[9px] font-orbitron font-extrabold text-sky-950">
                  {coherence.toFixed(1)}%
                </span>
              </div>
            </div>

            {/* 6° Fair Weather Circular Gauge (Exact match to top-right of central core in images__4__27575c52.jpg) */}
            <div className="relative w-20 h-20 rounded-full border-4 border-cyan-400 flex flex-col items-center justify-center shadow-[0_0_20px_#00f5ff] bg-slate-950/60">
              <span className="text-[9px] text-cyan-300 font-bold">Fair</span>
              <span className="text-2xl font-orbitron font-extrabold text-white">6°</span>
            </div>
          </div>

          {/* Branching Node Tree Columns (Matches Images/Documents/Videos left & Wikipedia/Sublime/Discord right) */}
          <div className="grid grid-cols-2 gap-4 w-full max-w-lg">
            <div className="space-y-1.5 border-r border-cyan-400/50 pr-3">
              {leftBranchNodes.map((n, idx) => {
                const Icon = n.icon;
                return (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => {
                      soundEffects.playClick();
                      onOpenModule?.(n.id);
                    }}
                    className="w-full px-2.5 py-1 rounded bg-slate-950/80 hover:bg-sky-950 border border-cyan-500/40 text-right text-[10px] text-cyan-200 hover:text-white flex items-center justify-end gap-2 cursor-pointer"
                  >
                    <span>{n.label}</span>
                    <Icon className="w-3 h-3 text-cyan-400" />
                  </button>
                );
              })}
            </div>

            <div className="space-y-1.5 border-l border-cyan-400/50 pl-3">
              {rightBranchNodes.map((n, idx) => {
                const Icon = n.icon;
                return (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => {
                      soundEffects.playClick();
                      onOpenModule?.(n.id);
                    }}
                    className="w-full px-2.5 py-1 rounded bg-slate-950/80 hover:bg-sky-950 border border-cyan-500/40 text-left text-[10px] text-cyan-200 hover:text-white flex items-center gap-2 cursor-pointer"
                  >
                    <Icon className="w-3 h-3 text-cyan-400" />
                    <span>{n.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: MINI SYSTEM MONITOR, BLACK CMD CONSOLE & NASA HACKING PROGRESS WINDOW */}
        <div className="lg:col-span-3 flex flex-col gap-3">
          {/* Mini Top-Right Network Telemetry Graph */}
          <div className="p-2.5 rounded-xl bg-slate-950/85 border border-sky-500/40 text-[9px]">
            <div className="flex justify-between text-sky-300 font-bold mb-1">
              <span>SYSTEM MONITOR</span>
              <span className="text-emerald-400">ONLINE</span>
            </div>
            <div className="grid grid-cols-3 gap-1 text-center text-slate-300">
              <div className="p-1 rounded bg-slate-900 border border-slate-800">CPU 22%</div>
              <div className="p-1 rounded bg-slate-900 border border-slate-800">RAM 38%</div>
              <div className="p-1 rounded bg-slate-900 border border-slate-800">NET 1Gb</div>
            </div>
          </div>

          {/* Black CMD Prompt Window (Exact from middle-right of images__4__27575c52.jpg) */}
          <div
            onClick={() => onOpenModule?.("automation")}
            className="p-2.5 rounded-lg bg-black border border-slate-600 text-[10px] font-mono text-slate-200 h-20 cursor-pointer hover:border-cyan-400 transition"
          >
            <div>C:\Users\Wasi&gt; quantum-status --verify</div>
            <div className="text-emerald-400 mt-1">
              {isPrivacyCloak ? "[TERMINAL BUFFER REDACTED]" : ">> Tachyon Coherence 99.98% [OK]"}
            </div>
          </div>

          {/* Crisp White/Green "HACKING... Hacking NASA..." Window (Exact from bottom-right of images__4__27575c52.jpg) */}
          <div className="p-3 rounded-lg bg-slate-100 text-slate-900 border-2 border-slate-400 shadow-2xl space-y-2">
            <div className="text-center text-[10px] font-sans font-bold text-slate-700 border-b border-slate-300 pb-1">
              HACKING...
            </div>
            <div>
              <div className="text-[9px] font-sans font-semibold text-slate-700 mb-0.5">Hacking NASA...</div>
              <div className="w-full h-3.5 bg-slate-300 border border-slate-400 overflow-hidden">
                <div
                  className="h-full bg-emerald-500 transition-all duration-150"
                  style={{ width: `${hackingProgress1}%` }}
                />
              </div>
            </div>
            <div>
              <div className="text-[9px] font-sans font-semibold text-slate-700 mb-0.5">Receiving datas...</div>
              <div className="w-full h-3.5 bg-slate-300 border border-slate-400 overflow-hidden">
                <div
                  className="h-full bg-emerald-500 transition-all duration-150"
                  style={{ width: `${hackingProgress2}%` }}
                />
              </div>
            </div>
          </div>
        </div>
      </main>

      <footer className="relative z-20 pt-2 border-t border-sky-500/20 flex items-center justify-between text-[10px] text-sky-400">
        <span>JARVIS COSMIC NEBULA ASTROPHYSICS</span>
        <span>COHERENCE: {coherence.toFixed(2)}%</span>
      </footer>
    </div>
  );
};
