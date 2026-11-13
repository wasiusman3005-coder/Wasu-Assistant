import React, { useState, useEffect } from "react";
import {
  Shield,
  Layers,
  Settings,
  Lock,
  Sparkles,
  Zap,
  Eye,
  EyeOff,
  Flame,
  Mic,
} from "lucide-react";
import { soundEffects } from "../../services/soundEffects";
import { speechService } from "../../services/speechService";
import { UserProfile, DashboardCustomization, LanguageCode, VoiceGender, JarvisInterfaceThemeId } from "../../types";
import { ALL_JARVIS_THEMES } from "./themesData";
import { QuantumFieldsBar } from "../QuantumFieldsBar";

interface IronManShieldThemeProps {
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

export const IronManShieldTheme: React.FC<IronManShieldThemeProps> = ({
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
  const [speedVal, setSpeedVal] = useState(84);
  const [speedSubVal, setSpeedSubVal] = useState(62);
  const [teethDegree, setTeethDegree] = useState(0);
  const [isPrivacyCloak, setIsPrivacyCloak] = useState(false);
  const [isThemePickerOpen, setIsThemePickerOpen] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setTeethDegree((prev) => (prev + 1.8) % 360);
      setSpeedVal((prev) => Math.min(120, Math.max(55, prev + (Math.random() * 8 - 4))));
      setSpeedSubVal((prev) => Math.min(95, Math.max(35, prev + (Math.random() * 6 - 3))));
    }, 110);
    return () => clearInterval(timer);
  }, []);

  const now = new Date();
  const dayName = now.toLocaleDateString("en-US", { weekday: "long" }).toLowerCase();
  const monthName = now.toLocaleDateString("en-US", { month: "long" }).toUpperCase();
  const dayNum = now.getDate();
  const timeHoursMins = now.toLocaleTimeString("en-US", { hour12: false, hour: "2-digit", minute: "2-digit" });

  const dockApps = [
    { name: "PC & Video", id: "desktop", accent: "border-cyan-400 text-cyan-300" },
    { name: "Workflow Bot", id: "automation", accent: "border-amber-400 text-amber-300" },
    { name: "Comm & Code", id: "communication", accent: "border-purple-400 text-purple-300" },
    { name: "Maps Radar", id: "maps", accent: "border-blue-400 text-blue-300" },
    { name: "Device Link", id: "devices", accent: "border-emerald-400 text-emerald-300" },
    { name: "Life Vault", id: "records", accent: "border-sky-400 text-sky-300" },
  ];

  return (
    <div className="relative w-full min-h-screen bg-[#000000] text-slate-100 font-mono select-none overflow-x-hidden flex flex-col justify-between p-3 md:p-5">
      {/* Subtle cyan radial glow behind center */}
      <div
        className="fixed inset-0 pointer-events-none z-0 opacity-40"
        style={{
          background:
            "radial-gradient(circle at 50% 52%, rgba(6,182,212,0.18) 0%, transparent 45%), radial-gradient(circle at 88% 45%, rgba(220,38,38,0.12) 0%, transparent 35%)",
        }}
      />

      {/* TOP BAR: Digital Clock + S.H.I.E.L.D. OS Crest Badge + Action Buttons */}
      <header className="relative z-20 flex flex-wrap items-center justify-between gap-3 pb-2 border-b border-cyan-500/20">
        <div className="flex items-center gap-3">
          {/* Clock (Exact 20:53 Monday layout from images__1__d271a28a.jpg) */}
          <div className="flex items-center gap-2 px-3 py-1 rounded-xl bg-slate-950/90 border border-slate-800">
            <span className="font-orbitron font-extrabold text-xl text-white tracking-wider">{timeHoursMins}</span>
            <div className="text-[9px] text-slate-400 leading-tight">
              <div className="capitalize text-cyan-300 font-bold">{dayName}</div>
              <div>{monthName} {dayNum}</div>
            </div>
          </div>

          {/* S.H.I.E.L.D. OS Emblem Crest */}
          <div className="flex items-center gap-2.5 px-3 py-1 rounded-full bg-gradient-to-r from-slate-900 to-slate-950 border border-cyan-400/60 shadow-[0_0_20px_rgba(6,182,212,0.4)]">
            <div className="w-8 h-8 rounded-full bg-cyan-950 border-2 border-cyan-300 flex items-center justify-center shadow-[0_0_12px_#00f5ff]">
              <Shield className="w-4 h-4 text-cyan-200" />
            </div>
            <div>
              <div className="text-[11px] font-orbitron font-extrabold text-white tracking-wider">S.H.I.E.L.D OS</div>
              <div className="text-[8px] text-cyan-300 font-bold">VER 1.2.0 • MEDIA MANAGE</div>
            </div>
          </div>
        </div>

        {/* Right Controls */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="relative">
            <button
              type="button"
              onClick={() => {
                soundEffects.playClick();
                setIsThemePickerOpen(!isThemePickerOpen);
              }}
              className="px-3 py-1.5 rounded-xl bg-cyan-950/90 hover:bg-cyan-900 border border-cyan-400/60 text-cyan-200 text-xs flex items-center gap-1.5 cursor-pointer shadow-[0_0_15px_rgba(6,182,212,0.35)]"
            >
              <Sparkles className="w-3.5 h-3.5 text-cyan-300" />
              <span>THEMES (7)</span>
            </button>

            {isThemePickerOpen && (
              <div className="absolute right-0 top-10 w-72 bg-[#02040f]/95 border-2 border-cyan-400 rounded-2xl p-2 shadow-2xl z-50 flex flex-col gap-1.5 backdrop-blur-2xl">
                <div className="text-[10px] font-bold text-cyan-400 px-2 py-1 border-b border-slate-800">
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
                      t.id === (customization.activeInterfaceTheme || "ironman_shield")
                        ? "bg-cyan-950 text-cyan-300 border border-cyan-400 font-bold"
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
            {isPrivacyCloak ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5 text-cyan-400" />}
            <span className="hidden sm:inline">{isPrivacyCloak ? "CLOAK ON" : "CLOAK"}</span>
          </button>

          <button
            type="button"
            onClick={() => {
              soundEffects.playClick();
              onOpenVoiceModal();
            }}
            className="px-2.5 py-1.5 rounded-xl bg-slate-900 hover:bg-cyan-950 border border-cyan-500/40 text-cyan-300 text-xs flex items-center gap-1 cursor-pointer"
          >
            <Mic className="w-3.5 h-3.5 text-cyan-400" />
            <span className="hidden sm:inline">VOICE</span>
          </button>

          <button
            type="button"
            onClick={() => {
              soundEffects.playClick();
              onOpenAppsMatrix();
            }}
            className="px-2.5 py-1.5 rounded-xl bg-slate-900 hover:bg-cyan-950 border border-cyan-500/40 text-cyan-300 text-xs flex items-center gap-1 cursor-pointer"
          >
            <Layers className="w-3.5 h-3.5 text-cyan-400" />
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
          activeThemeId={customization.activeInterfaceTheme || "ironman_shield"}
          onSelectTheme={onSelectTheme}
        />
      </div>

      {/* MAIN HUD DECK */}
      <main className="relative z-10 flex-1 grid grid-cols-1 lg:grid-cols-12 gap-4 my-3 items-center">
        {/* LEFT VERTICAL CYAN HUD STACK (Exact match to images__1__d271a28a.jpg) */}
        <div className="lg:col-span-4 flex flex-col gap-3 border-l-2 border-cyan-400/60 pl-3">
          {/* Giant Glowing Cyan Circular Calendar Ring + Atmospheric Analysis */}
          <div className="flex items-center gap-4">
            <div className="relative w-28 h-28 rounded-full flex flex-col items-center justify-center shrink-0">
              <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="44" fill="none" stroke="rgba(6,182,212,0.2)" strokeWidth="6" />
                <circle
                  cx="50"
                  cy="50"
                  r="44"
                  fill="none"
                  stroke="#00f5ff"
                  strokeWidth="6"
                  strokeDasharray="215 280"
                />
                <circle cx="50" cy="50" r="34" fill="none" stroke="#00f5ff" strokeWidth="2.5" strokeDasharray="160 220" />
              </svg>
              <span className="text-[10px] font-bold text-cyan-300 tracking-widest">{monthName}</span>
              <span className="text-3xl font-orbitron font-extrabold text-white leading-none">{dayNum}</span>
            </div>

            <div className="space-y-1 text-[10px]">
              <div className="text-cyan-400 font-bold">ATMOSPHERIC ANALYSIS</div>
              <div className="text-slate-300">FullCapacity: <span className="text-cyan-300 font-bold">90 G</span></div>
              <div className="w-28 h-1 bg-slate-900 rounded-full overflow-hidden">
                <div className="h-full bg-cyan-400 w-[90%]" />
              </div>
              <div className="text-slate-300">FreeCapacity: <span className="text-emerald-300 font-bold">82 G</span></div>
              <div className="w-28 h-1 bg-slate-900 rounded-full overflow-hidden">
                <div className="h-full bg-emerald-400 w-[82%]" />
              </div>
            </div>
          </div>

          {/* 100% High Power Gauge & Mini Concentric Ring */}
          <div className="flex items-center gap-4">
            <div className="relative w-20 h-20 rounded-full border-2 border-cyan-400/70 flex flex-col items-center justify-center shadow-[0_0_20px_rgba(6,182,212,0.4)]">
              <span className="text-xs font-orbitron font-bold text-cyan-200">100%</span>
              <span className="text-[8px] text-emerald-400 font-bold">HIGH</span>
            </div>
            <div className="space-y-1 text-[10px] flex-1">
              <div className="text-cyan-300 font-bold">Voice Status: Active</div>
              <div className="text-slate-400">
                {isPrivacyCloak ? "[REDACTED IP :: 0.0.0.0]" : "Host IP: 101.62.240.8"}
              </div>
              <div className="flex gap-2 pt-1">
                <span className="px-2 py-0.5 rounded bg-cyan-950 border border-cyan-500/40 text-cyan-300 text-[9px]">
                  Communication
                </span>
                <span className="px-2 py-0.5 rounded bg-slate-900 border border-slate-700 text-slate-300 text-[9px]">
                  Shutdown / Reboot
                </span>
              </div>
            </div>
          </div>

          {/* Bottom-Left Segmented Arc Gauge (Exact from images__1__d271a28a.jpg bottom-left) */}
          <div className="flex items-center gap-4 pt-1">
            <div className="relative w-20 h-20 flex items-center justify-center">
              <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="42" fill="none" stroke="#00f5ff" strokeWidth="7" strokeDasharray="175 260" />
                <circle cx="50" cy="50" r="30" fill="none" stroke="#06b6d4" strokeWidth="4" strokeDasharray="110 200" strokeDashoffset="-30" />
              </svg>
              <div className="absolute text-center text-[8px] font-bold text-cyan-200">
                <div>0.0K</div>
                <div>0.0K</div>
              </div>
            </div>
            <div className="text-[10px] text-slate-400">
              <div className="text-cyan-300 font-bold">S.H.I.E.L.D. LINK</div>
              <div>Coherence: {coherence.toFixed(2)}%</div>
            </div>
          </div>
        </div>

        {/* CENTER COLUMN: GIANT SAWTOOTH CYAN RING + DUAL ANALOG BLUE SPEEDOMETERS */}
        <div className="lg:col-span-4 flex flex-col items-center justify-center">
          <div
            onClick={() => {
              soundEffects.playShockwave();
              speechService.speak("S.H.I.E.L.D. Mark 7 Arc Core and twin thrust dials calibrated.", {
                lang: language,
                gender: voiceGender,
              });
            }}
            className="relative w-72 h-72 md:w-84 md:h-84 rounded-full flex items-center justify-center cursor-pointer group"
            title="Click to Ping Dual Thrust Core"
          >
            {/* Outer Sawtooth Gear Ring (Exact look from images__1__d271a28a.jpg center) */}
            <svg
              className="absolute inset-0 w-full h-full pointer-events-none drop-shadow-[0_0_20px_rgba(0,245,255,0.8)]"
              viewBox="0 0 200 200"
              style={{ transform: `rotate(${teethDegree}deg)` }}
            >
              <circle
                cx="100"
                cy="100"
                r="92"
                fill="none"
                stroke="#00f5ff"
                strokeWidth="10"
                strokeDasharray="3 3.5"
              />
              <circle cx="100" cy="100" r="82" fill="none" stroke="#38bdf8" strokeWidth="2" />
            </svg>

            {/* Inner Dual Blue Speedometers */}
            <div className="relative w-52 h-52 md:w-60 md:h-60 rounded-full bg-gradient-to-b from-[#031226] to-black border-2 border-cyan-400/70 flex items-center justify-center gap-2 p-2 shadow-[inset_0_0_30px_rgba(0,245,255,0.4)]">
              {/* Left Larger Speedometer */}
              <div className="relative w-28 h-28 rounded-full border-2 border-blue-400 bg-gradient-to-b from-blue-950/90 to-black flex flex-col items-center justify-center shadow-[0_0_20px_rgba(59,130,246,0.7)]">
                <div className="w-16 h-16 rounded-full border border-dashed border-cyan-400/50 flex items-end justify-center pb-2">
                  <div
                    className="w-1 h-10 bg-white origin-bottom rounded-full shadow-[0_0_8px_#fff] transition-transform duration-100"
                    style={{ transform: `rotate(${speedVal * 2 - 120}deg)` }}
                  />
                </div>
                <span className="text-[9px] font-orbitron font-bold text-cyan-200 -mt-1">
                  {Math.round(speedVal)}
                </span>
              </div>

              {/* Right Smaller Speedometer */}
              <div className="relative w-20 h-20 rounded-full border-2 border-blue-400 bg-gradient-to-b from-blue-950/90 to-black flex flex-col items-center justify-center shadow-[0_0_15px_rgba(59,130,246,0.6)]">
                <div className="w-12 h-12 rounded-full border border-dashed border-cyan-400/50 flex items-end justify-center pb-1">
                  <div
                    className="w-0.5 h-7 bg-cyan-300 origin-bottom rounded-full transition-transform duration-100"
                    style={{ transform: `rotate(${speedSubVal * 2.2 - 120}deg)` }}
                  />
                </div>
                <span className="text-[8px] font-orbitron font-bold text-blue-200 -mt-1">
                  {Math.round(speedSubVal)}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: IRON MAN HELMET SILHOUETTE + GOLDEN UNIBEAM RETICLE + CALLOUT LINES */}
        <div className="lg:col-span-4 flex flex-col items-center lg:items-end relative">
          <div className="relative w-full max-w-[350px] p-3 rounded-3xl bg-gradient-to-br from-red-950/40 via-black to-amber-950/20 border border-amber-500/30 overflow-hidden">
            {/* Stylized Metallic Crimson/Gold Mark VII Helmet + Glowing Cyan Eyes (Top Right) */}
            <div className="flex items-center justify-between mb-3">
              <div className="text-[10px] font-orbitron font-bold text-amber-300">
                MARK VII // ARMOR HUD
              </div>
              {/* Stylized Helmet Crest Icon SVG */}
              <svg className="w-16 h-16 drop-shadow-[0_0_15px_rgba(245,158,11,0.5)]" viewBox="0 0 80 80">
                {/* Crimson Helmet Shell */}
                <path d="M18 14 Q40 4 62 14 L66 48 L52 72 L28 72 L14 48 Z" fill="#991b1b" stroke="#fbbf24" strokeWidth="1.5" />
                {/* Golden Faceplate */}
                <path d="M24 20 L56 20 L54 58 L46 66 L34 66 L26 58 Z" fill="#d97706" stroke="#fde68a" strokeWidth="1" />
                {/* Glowing Blue Eye Slits */}
                <polygon points="27,36 37,39 36,42 26,40" fill="#00f5ff" />
                <polygon points="53,36 43,39 44,42 54,40" fill="#00f5ff" />
                {/* Chin Plate */}
                <rect x="34" y="60" width="12" height="5" rx="1" fill="#7f1d1d" />
              </svg>
            </div>

            {/* Golden Concentric Unibeam Reticle + Yellow Telemetry Callout Lines (value23..28) */}
            <div className="flex items-center gap-3">
              <div className="relative w-28 h-28 rounded-full border-4 border-amber-400/90 flex items-center justify-center shadow-[0_0_30px_rgba(245,158,11,0.75)] bg-amber-950/20 shrink-0">
                <div className="w-20 h-20 rounded-full border-2 border-yellow-300/80 flex items-center justify-center">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-amber-300 to-white shadow-[0_0_25px_#fbbf24] flex items-center justify-center">
                    <Flame className="w-5 h-5 text-amber-900 animate-pulse" />
                  </div>
                </div>
              </div>

              <div className="flex-1 space-y-1 text-[9px] font-mono">
                {[
                  { k: "value23", v: "THRUST 1.42x" },
                  { k: "value24", v: "FLUX 84.6%" },
                  { k: "value25", v: `CORE ${coherence.toFixed(1)}%` },
                  { k: "value26", v: "SHIELD 100%" },
                  { k: "value27", v: "CRYO OPTIMAL" },
                  { k: "value28", v: "UNIBEAM ARMED" },
                ].map((row, idx) => (
                  <div key={idx} className="flex items-center justify-between border-b border-amber-500/20 pb-0.5">
                    <span className="text-amber-400 font-bold">{row.k}</span>
                    <span className="text-slate-200">{isPrivacyCloak ? "REDACTED" : row.v}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* BOTTOM 6 TRAPEZOIDAL CYBER DOCK TABS (Exact match to images__1__d271a28a.jpg bottom bar) */}
      <footer className="relative z-20 pt-2 flex flex-wrap items-center justify-center gap-2">
        {dockApps.map((app, idx) => (
          <button
            key={idx}
            type="button"
            onClick={() => {
              soundEffects.playBeepConfirm();
              onOpenModule?.(app.id);
            }}
            className={`px-4 py-1.5 bg-gradient-to-b from-slate-800 to-slate-950 border-t-2 border-x ${app.accent} hover:brightness-125 text-xs font-orbitron font-bold tracking-wider transition cursor-pointer transform -skew-x-12 shadow-[0_0_15px_rgba(0,0,0,0.9)]`}
          >
            <span className="inline-block skew-x-12 flex items-center gap-1.5">
              <Zap className="w-3 h-3" />
              <span>{app.name}</span>
            </span>
          </button>
        ))}
      </footer>
    </div>
  );
};
