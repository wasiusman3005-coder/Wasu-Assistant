import React, { useEffect, useState } from "react";
import { Cpu, Shield, Sparkles, Volume2, Radio, Zap } from "lucide-react";
import { soundEffects } from "../services/soundEffects";
import { QUANTUM_FIELDS_DATA } from "../data/jarvisCatalog";

interface QuantumLoadingScreenProps {
  isOpen: boolean;
  onComplete: () => void;
  commanderName?: string;
}

const BOOT_PHASES = [
  "CALIBRATING 7 QUANTUM RESONANCE FIELDS...",
  "MOUNTING 100 HUMANOID AVATARS & 108 OUTFITS MATRIX...",
  "SYNCHRONIZING 116+ WAKE WORD NEURAL TRIGGERS...",
  "CONNECTING ELEVENLABS & GEMINI FAST-TALK ENGINE...",
  "ARMING AES-4096 ZERO-LEAK PRIVACY CLOAK...",
  "ALL QUANTUM SYSTEMS 100% OPERATIONAL — WELCOME COMMANDER",
];

export const QuantumLoadingScreen: React.FC<QuantumLoadingScreenProps> = ({
  isOpen,
  onComplete,
  commanderName = "Wasi",
}) => {
  const [progress, setProgress] = useState(0);
  const [phaseIdx, setPhaseIdx] = useState(0);
  const [activeFieldIdx, setActiveFieldIdx] = useState(0);

  useEffect(() => {
    if (!isOpen) return;
    setProgress(0);
    setPhaseIdx(0);
    soundEffects.playQuantumStartup();

    const progressTimer = setInterval(() => {
      setProgress((prev) => (prev >= 100 ? 100 : Math.min(100, prev + 3.5)));
    }, 65);

    return () => clearInterval(progressTimer);
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    const targetPhase = Math.min(
      BOOT_PHASES.length - 1,
      Math.floor((progress / 100) * BOOT_PHASES.length)
    );
    setPhaseIdx(targetPhase);
    setActiveFieldIdx(Math.floor(progress / 15) % QUANTUM_FIELDS_DATA.length);

    if (progress >= 100) {
      const doneTimer = setTimeout(() => {
        soundEffects.playBeepConfirm();
        onComplete();
      }, 320);
      return () => clearTimeout(doneTimer);
    }
  }, [isOpen, progress, onComplete]);

  if (!isOpen) return null;

  const activeField = QUANTUM_FIELDS_DATA[activeFieldIdx];

  return (
    <div className="fixed inset-0 z-[100] bg-[#01030a] text-slate-100 flex flex-col items-center justify-center p-6 overflow-hidden select-none font-rajdhani">
      {/* Radial Quantum Field Aura */}
      <div
        className="absolute inset-0 pointer-events-none transition-all duration-500"
        style={{
          background: `radial-gradient(circle at 50% 45%, ${activeField.hex}28 0%, #01030a 68%)`,
        }}
      />

      {/* Orbital Energy Rings */}
      <div className="relative flex flex-col items-center justify-center max-w-xl w-full z-10">
        <div className="relative w-56 h-56 flex items-center justify-center mb-6">
          <div
            className="absolute inset-0 rounded-full border-2 border-dashed animate-spin"
            style={{ borderColor: `${activeField.hex}80`, animationDuration: "8s" }}
          />
          <div
            className="absolute inset-4 rounded-full border-2 animate-spin-reverse"
            style={{ borderColor: activeField.hex, boxShadow: `0 0 35px ${activeField.hex}66` }}
          />
          <div
            className="absolute inset-9 rounded-full border border-dotted animate-spin"
            style={{ borderColor: "#ffffff66", animationDuration: "5s" }}
          />

          <div
            className="w-28 h-28 rounded-full flex flex-col items-center justify-center border-2 backdrop-blur-xl transition-all duration-300"
            style={{
              backgroundColor: `${activeField.hex}20`,
              borderColor: activeField.hex,
              boxShadow: `0 0 50px ${activeField.hex}90, inset 0 0 25px ${activeField.hex}70`,
            }}
          >
            <Sparkles className="w-8 h-8 text-white animate-pulse mb-1" />
            <span className="font-orbitron font-black text-2xl text-white tracking-wider">
              {Math.round(progress)}%
            </span>
          </div>
        </div>

        <div className="text-center space-y-2 mb-5">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900/90 border border-cyan-500/40 text-[10px] font-mono text-cyan-300 tracking-widest uppercase">
            <Radio className="w-3 h-3 animate-ping text-emerald-400" />
            <span>Q-NEXUS TACHYON OS // INITIALIZING FOR {commanderName.toUpperCase()}</span>
          </div>
          <h1 className="font-orbitron font-extrabold text-2xl md:text-3xl tracking-widest text-white">
            QUANTUM CORE <span style={{ color: activeField.hex }}>BOOTING</span>
          </h1>
          <p className="text-xs md:text-sm font-mono text-cyan-200 min-h-[20px]">
            {BOOT_PHASES[phaseIdx]}
          </p>
        </div>

        {/* Glowing Linear Progress Bar */}
        <div className="w-full h-3 rounded-full bg-slate-950 border border-slate-800 p-0.5 overflow-hidden mb-5">
          <div
            className="h-full rounded-full transition-all duration-100"
            style={{
              width: `${progress}%`,
              background: `linear-gradient(90deg, #06b6d4, ${activeField.hex}, #a855f7)`,
              boxShadow: `0 0 20px ${activeField.hex}`,
            }}
          />
        </div>

        {/* 7 Quantum Fields Calibration Grid */}
        <div className="w-full grid grid-cols-2 sm:grid-cols-4 gap-2 mb-6">
          {QUANTUM_FIELDS_DATA.map((field, idx) => {
            const calibrated = progress >= ((idx + 1) / QUANTUM_FIELDS_DATA.length) * 90;
            return (
              <div
                key={field.themeId}
                className={`p-2 rounded-xl border text-[10px] font-mono transition-all ${
                  calibrated
                    ? "bg-slate-900/90 border-cyan-400/70 text-white"
                    : "bg-slate-950/70 border-slate-800 text-slate-500"
                }`}
              >
                <div className="flex items-center justify-between mb-0.5">
                  <span
                    className="w-2 h-2 rounded-full"
                    style={{
                      backgroundColor: calibrated ? field.hex : "#334155",
                      boxShadow: calibrated ? `0 0 8px ${field.hex}` : undefined,
                    }}
                  />
                  <span className="text-[8px] opacity-75">{field.frequencyHz}</span>
                </div>
                <div className="font-bold truncate">{field.shortName}</div>
                <div className="text-[8px] truncate text-cyan-300/80">{field.logo3DName}</div>
              </div>
            );
          })}

          <div className="p-2 rounded-xl border border-emerald-500/40 bg-emerald-950/30 text-[10px] font-mono flex flex-col justify-center">
            <div className="flex items-center gap-1 text-emerald-400 font-bold">
              <Shield className="w-3 h-3" />
              <span>ZERO-LEAK</span>
            </div>
            <div className="text-[9px] text-slate-300 mt-0.5">100 Avatars Ready</div>
          </div>
        </div>

        {/* Subsystem Icons & Skip Button */}
        <div className="w-full flex items-center justify-between text-[11px] font-mono text-slate-400">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1 text-cyan-300">
              <Cpu className="w-3.5 h-3.5" /> 3D Humanoid
            </span>
            <span className="flex items-center gap-1 text-purple-300">
              <Volume2 className="w-3.5 h-3.5" /> ElevenLabs
            </span>
            <span className="flex items-center gap-1 text-amber-300">
              <Zap className="w-3.5 h-3.5" /> Fast Talk
            </span>
          </div>
          <button
            type="button"
            onClick={() => {
              soundEffects.playBeepConfirm();
              onComplete();
            }}
            className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-cyan-950 border border-cyan-500/40 text-cyan-300 font-bold transition cursor-pointer"
          >
            ENTER COCKPIT →
          </button>
        </div>
      </div>
    </div>
  );
};
