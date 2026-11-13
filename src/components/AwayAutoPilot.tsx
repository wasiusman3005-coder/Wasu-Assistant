import React, { useState, useEffect } from "react";
import { Shield, Eye, Cpu, Terminal, CheckCircle2, Power, AlertCircle } from "lucide-react";
import { soundEffects } from "../services/soundEffects";
import { speechService } from "../services/speechService";
import { LanguageCode, VoiceGender } from "../types";

interface AwayAutoPilotProps {
  onReturn: () => void;
  language: LanguageCode;
  voiceGender: VoiceGender;
}

export const AwayAutoPilot: React.FC<AwayAutoPilotProps> = ({
  onReturn,
  language,
  voiceGender,
}) => {
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [backgroundTasks, setBackgroundTasks] = useState([
    { title: "Adobe Premiere 4K ProRes Proxy Render", progress: 68, status: "Rendering via CUDA" },
    { title: "After Effects Temp Disk Cache Cleanup", progress: 100, status: "Completed (42 GB freed)" },
    { title: "Quantum Telemetry & Sentry Intrusion Watch", progress: 100, status: "Monitoring 360° Perimeter" },
    { title: "Daily Cloud Encryption Backup", progress: 85, status: "Uploading Encrypted Snapshot" },
  ]);

  useEffect(() => {
    soundEffects.playQuantumStartup();
    const interval = setInterval(() => {
      setElapsedSeconds((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleWakeUp = () => {
    soundEffects.playBeepConfirm();
    const returnGreet =
      language === "pa"
        ? "Ji Aayan Nu Wasi paji! Tuhadi absence ch saare background tasks streamline ho gaye ne. System optimal ae."
        : language === "en"
        ? "Welcome back Commander Wasi. All pending renders and security checks were completed in your absence."
        : "Khush Amdeed wapsi par Wasi Sahab! Aapki ghair-mojoodgi mein background tasks aur security patrol kamyabi se chal rahi thi. System ready hai.";

    speechService.speak(returnGreet, { lang: language, gender: voiceGender });
    onReturn();
  };

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  return (
    <div
      onClick={handleWakeUp}
      className="fixed inset-0 z-50 bg-[#02050c] text-slate-100 flex flex-col items-center justify-between p-6 md:p-12 cursor-pointer font-rajdhani select-none overflow-hidden"
    >
      {/* Animated Radar Pulse Background */}
      <div className="absolute inset-0 quantum-grid opacity-20 pointer-events-none"></div>
      <div className="absolute w-[600px] h-[600px] rounded-full border border-cyan-500/10 pointer-events-none animate-ping" style={{ animationDuration: "6s" }}></div>
      <div className="absolute w-[400px] h-[400px] rounded-full border border-cyan-400/20 pointer-events-none animate-pulse"></div>

      {/* Top Header */}
      <div className="relative z-10 w-full flex items-center justify-between text-xs font-mono text-cyan-400">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-ping"></span>
          <span>AWAY AUTO-PILOT ENGAGED • COMMANDER: WASI</span>
        </div>
        <div>AWAY DURATION: {formatTime(elapsedSeconds)}</div>
      </div>

      {/* Center Sentry Core */}
      <div className="relative z-10 text-center max-w-lg">
        <div className="relative w-32 h-32 mx-auto mb-6 flex items-center justify-center">
          <div className="absolute inset-0 rounded-full border-2 border-dashed border-cyan-400 animate-spin" style={{ animationDuration: "20s" }}></div>
          <div className="absolute inset-3 rounded-full border-2 border-purple-500/40 animate-spin" style={{ animationDirection: "reverse", animationDuration: "15s" }}></div>
          <Eye className="w-12 h-12 text-cyan-400 animate-pulse" />
        </div>

        <h1 className="text-3xl font-orbitron font-bold tracking-wider text-cyan-400 glow-text-cyan mb-2">
          QUANTUM SENTRY ACTIVE
        </h1>
        <p className="text-xs font-mono text-slate-400 mb-6">
          Jarvis is executing all queued renders, background automations, and protecting your PC while you are away.
        </p>

        {/* Running Tasks in Background */}
        <div className="space-y-2.5 text-left bg-slate-950/80 p-4 rounded-2xl border border-slate-800 backdrop-blur-md">
          {backgroundTasks.map((t, idx) => (
            <div key={idx} className="p-2.5 rounded-xl bg-slate-900/60 border border-slate-800 text-xs font-mono">
              <div className="flex items-center justify-between mb-1">
                <span className="font-semibold text-slate-200">{t.title}</span>
                <span className="text-cyan-400 font-bold">{t.progress}%</span>
              </div>
              <div className="w-full bg-slate-950 rounded-full h-1 overflow-hidden mb-1">
                <div
                  className="bg-cyan-400 h-full transition-all duration-300"
                  style={{ width: `${t.progress}%` }}
                ></div>
              </div>
              <div className="text-[10px] text-slate-500">{t.status}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Wake Prompt */}
      <div className="relative z-10 text-center">
        <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-cyan-950/80 border border-cyan-400/50 text-cyan-300 font-mono text-xs tracking-wider shadow-lg shadow-cyan-950 animate-bounce">
          <Power className="w-4 h-4" />
          <span>CLICK ANYWHERE TO RESUME DESKTOP WORKSPACE</span>
        </div>
      </div>
    </div>
  );
};
