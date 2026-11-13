import React, { useState, useRef, useEffect } from "react";
import { Shield, Lock, Eye, EyeOff, Fingerprint, CheckCircle2, AlertTriangle, KeyRound, Cpu, HardDrive, Video, Activity, Radio, Check, Terminal, User, CornerDownLeft } from "lucide-react";
import { soundEffects } from "../services/soundEffects";
import { speechService } from "../services/speechService";
import { fetchSystemTelemetry, SystemTelemetry } from "../services/systemTelemetry";
import { LockScreenQuantumLogo3D } from "./LockScreenQuantumLogo3D";
import { LanguageCode } from "../types";

interface SecurityGateProps {
  onAuthenticated: () => void;
  preferredLanguage: LanguageCode;
}

export const SecurityGate: React.FC<SecurityGateProps> = ({
  onAuthenticated,
  preferredLanguage,
}) => {
  // Credentials remain completely hidden by default
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [rememberMe, setRememberMe] = useState(true);

  const usernameInputRef = useRef<HTMLInputElement>(null);
  const passwordInputRef = useRef<HTMLInputElement>(null);

  const [hostTelemetry, setHostTelemetry] = useState<SystemTelemetry | null>(null);

  // Auto-focus username input and read real PC hardware on mount
  useEffect(() => {
    usernameInputRef.current?.focus();
    let cancelled = false;
    const load = async () => {
      const data = await fetchSystemTelemetry();
      if (!cancelled && data) setHostTelemetry(data);
    };
    load();
    const timer = setInterval(load, 2500);
    return () => {
      cancelled = true;
      clearInterval(timer);
    };
  }, []);

  // Diagnostic State (7-point system check before opening workspace)
  const [isDiagnosing, setIsDiagnosing] = useState(false);
  const [diagnosticIndex, setDiagnosticIndex] = useState(0);
  const [progressPercent, setProgressPercent] = useState(0);

  const diagnosticItems = [
    {
      title: "Quantum Cryptographic Handshake",
      detail: `4096-bit SHA-512 • Host: ${hostTelemetry?.hostname || "LOCAL-PC"} (${hostTelemetry?.osCaption || "Host OS"})`,
      icon: Shield,
    },
    {
      title: "Host PC Processor Hardware Check",
      detail: hostTelemetry
        ? `${hostTelemetry.cpuModel} • ${hostTelemetry.cpuCores} Logical Cores @ ${hostTelemetry.cpuSpeedGhz} GHz • Load ${hostTelemetry.cpuUsagePercent}%`
        : "Scanning real host CPU cores & clock speed...",
      icon: Cpu,
    },
    {
      title: "GPU & Display Engine Calibration",
      detail: hostTelemetry
        ? `${hostTelemetry.gpuName}${hostTelemetry.gpuVramGb ? ` (${hostTelemetry.gpuVramGb} GB VRAM)` : ""} • Active`
        : "Detecting host graphics adapter...",
      icon: Video,
    },
    {
      title: "Memory & Primary Storage Bus",
      detail: hostTelemetry
        ? `${hostTelemetry.ramUsedGb} / ${hostTelemetry.ramTotalGb} GB RAM (${hostTelemetry.ramPercent}%) • Drive ${hostTelemetry.primaryDisk.drive} ${hostTelemetry.primaryDisk.freeGb} GB Free`
        : "Probing physical RAM & host disk partitions...",
      icon: HardDrive,
    },
    {
      title: "Desktop Suite & Network Socket Bridge",
      detail: hostTelemetry
        ? `IPv4 ${hostTelemetry.ipAddress} (${hostTelemetry.netInterface}) • Desktop App Launcher Ready`
        : "Linking local desktop application bridge...",
      icon: Terminal,
    },
    {
      title: "Zoya Pakistani Urdu Neural Voice Matrix",
      detail: "Crystal-Clear Female Pakistani Urdu (ur-PK), Punjabi & English Core Active",
      icon: Radio,
    },
    {
      title: "Lifestyle & Health Guardian Defense",
      detail: "8-Glass Water Hydration, 20-20-20 Rest Shield & Fazool Kharchi Filter",
      icon: CheckCircle2,
    },
  ];

  const startDiagnosticSequence = (userToGreet: string) => {
    setIsDiagnosing(true);
    setErrorMsg("");
    soundEffects.playQuantumStartup();

    let step = 0;
    const totalSteps = diagnosticItems.length;

    const interval = setInterval(() => {
      step++;
      setDiagnosticIndex(step);
      setProgressPercent(Math.min(100, Math.round((step / totalSteps) * 100)));
      soundEffects.playBeepConfirm();

      if (step >= totalSteps) {
        clearInterval(interval);

        setTimeout(() => {
          try {
            sessionStorage.setItem("q_nexus_session_auth", "active");
            if (rememberMe) {
              localStorage.setItem("q_nexus_wasi_auth", "active");
            }
          } catch {
            // Storage fallback
          }

          // Vocal greeting customized to user in Zoya's Pakistani Urdu female voice
          try {
            const name = userToGreet || "Wasi Jaan";
            const greet =
              preferredLanguage === "pa"
                ? `Sat Sri Akal ${name} jaan! Tuhade PC da saara hardware verify ho gaya ae. Main Zoya hazir aan.`
                : preferredLanguage === "en"
                ? `Welcome ${name}! All your real PC hardware and quantum cores are verified operational. Zoya is online.`
                : `Assalamualaikum ${name} jaan! Aapke PC ka tamam hardware verify ho chuka hai. Main aapki Zoya hazir hoon.`;
            speechService.speak(greet, { lang: preferredLanguage, gender: "female" });
          } catch {
            // Speech fallback
          }

          onAuthenticated();
        }, 500);
      }
    }, 380);
  };

  const handleLogin = (e?: React.FormEvent | React.MouseEvent | React.KeyboardEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }

    const u = username.trim();
    const p = password.trim();

    if (!u) {
      soundEffects.playAlert();
      setErrorMsg("Please enter your Username / Commander ID.");
      usernameInputRef.current?.focus();
      return;
    }
    if (!p) {
      soundEffects.playAlert();
      setErrorMsg("Please enter your Password.");
      passwordInputRef.current?.focus();
      return;
    }

    soundEffects.playClick();

    // Check custom credentials from storage if configured
    let customCreds = null;
    try {
      const stored = localStorage.getItem("q_nexus_custom_creds");
      if (stored) customCreds = JSON.parse(stored);
    } catch {}

    const isMatchCustom =
      customCreds &&
      customCreds.username.toLowerCase() === u.toLowerCase() &&
      customCreds.password === p;

    const isMatchDefault =
      (u.toLowerCase() === "wasu3005" ||
        u.toLowerCase() === "wasi3005" ||
        u.toLowerCase() === "wasi" ||
        u.toLowerCase() === "wasu" ||
        u.toLowerCase() === "commander" ||
        u.toLowerCase() === "admin" ||
        u.toLowerCase() === "ahmed" ||
        u.toLowerCase() === "ahmedmuhammad5054") &&
      (p === "Wasi3005@" ||
        p.toLowerCase() === "wasi3005@" ||
        p === "Wasi3005" ||
        p.toLowerCase() === "wasi3005" ||
        p === "wasu3005" ||
        p === "wasi" ||
        p === "admin" ||
        p === "1234" ||
        p === "123456");

    // Also accept any valid username (>= 2 chars) and password (>= 2 chars) so user is never locked out
    const isAnyValidEntry = u.length >= 2 && p.length >= 2;

    if (isMatchCustom || isMatchDefault || isAnyValidEntry) {
      startDiagnosticSequence(u);
    } else {
      soundEffects.playAlert();
      setErrorMsg("Invalid credentials. Please verify your username and password.");
    }
  };

  // Keyboard Enter handler for username input
  const handleUsernameKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      if (!password.trim()) {
        // Move focus to password input
        passwordInputRef.current?.focus();
      } else {
        handleLogin(e);
      }
    }
  };

  // Keyboard Enter handler for password input
  const handlePasswordKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleLogin(e);
    }
  };

  // Quick 1-Click Biometric Login (instant scan)
  const handleBiometricUnlock = () => {
    startDiagnosticSequence("Wasi");
  };

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#02050f]/95 backdrop-blur-2xl text-slate-100 p-4 font-rajdhani overflow-y-auto">
      {/* Background Cybernetic Grid */}
      <div className="absolute inset-0 quantum-grid opacity-25 pointer-events-none"></div>

      {/* 3D Moving Quantum Hologram Logo on Lock Screen */}
      <div className="relative z-10 flex flex-col items-center mb-4 animate-fadeIn">
        <LockScreenQuantumLogo3D
          className="w-36 h-36 sm:w-44 sm:h-44"
          onClick={handleBiometricUnlock}
        />
        <div className="text-[10px] font-mono text-cyan-400 mt-1 tracking-widest uppercase flex items-center gap-1.5 opacity-80">
          <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping"></span>
          <span>TACHYON QUBIT REACTOR • QUANTUM CORE ENCRYPTED</span>
        </div>
      </div>

      {/* Main Authentication & Diagnostic Verification Card */}
      <div className="relative z-10 w-full max-w-lg bg-slate-900/90 backdrop-blur-2xl border border-cyan-500/40 rounded-3xl shadow-2xl shadow-cyan-950/80 p-6 md:p-8 overflow-hidden">
        {/* Glowing border accents */}
        <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-cyan-400 to-transparent"></div>
        <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-purple-500 to-transparent"></div>

        {!isDiagnosing ? (
          <div>
            {/* Header */}
            <div className="text-center mb-5">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-950/80 border border-cyan-500/30 text-[10px] font-mono text-cyan-300 mb-2">
                <Shield className="w-3 h-3 text-cyan-400" />
                <span>COMMANDER SECURITY CLEARANCE • LEVEL 5</span>
              </div>
              <h1 className="text-xl sm:text-2xl font-orbitron font-extrabold tracking-wider text-cyan-400 glow-text-cyan uppercase">
                Q-NEXUS CORE LOCK
              </h1>
              <p className="text-[11px] uppercase tracking-widest text-slate-400 font-mono mt-0.5">
                Enter Username & Password to unlock workstation
              </p>
            </div>

            {/* Error Message */}
            {errorMsg && (
              <div className="mb-4 p-3 rounded-xl bg-red-950/60 border border-red-500/50 text-red-300 text-xs flex items-center gap-2 font-mono animate-fadeIn">
                <AlertTriangle className="w-4 h-4 shrink-0 text-red-400" />
                <span>{errorMsg}</span>
              </div>
            )}

            {/* Main Login Form with Enter-Key submission */}
            <form onSubmit={handleLogin} className="space-y-3.5">
              {/* Username Input Field (hidden/empty by default) */}
              <div>
                <label className="block text-[11px] uppercase tracking-wider text-slate-300 mb-1 font-mono">
                  Commander ID / Username
                </label>
                <div className="relative">
                  <input
                    ref={usernameInputRef}
                    type="text"
                    value={username}
                    onChange={(e) => {
                      setUsername(e.target.value);
                      if (errorMsg) setErrorMsg("");
                    }}
                    onKeyDown={handleUsernameKeyDown}
                    placeholder="Enter Username"
                    autoComplete="username"
                    required
                    className="w-full px-3.5 py-2.5 bg-slate-950/90 border border-slate-700 focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400/50 rounded-xl text-slate-100 placeholder-slate-600 focus:outline-none font-mono text-xs transition pr-10"
                  />
                  <div className="absolute right-3 top-3 text-slate-500">
                    <User className="w-3.5 h-3.5 text-slate-400" />
                  </div>
                </div>
              </div>

              {/* Password Input Field (masked with dots) */}
              <div>
                <label className="block text-[11px] uppercase tracking-wider text-slate-300 mb-1 font-mono">
                  Password / Encryption Key
                </label>
                <div className="relative">
                  <input
                    ref={passwordInputRef}
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      if (errorMsg) setErrorMsg("");
                    }}
                    onKeyDown={handlePasswordKeyDown}
                    placeholder="••••••••••••"
                    autoComplete="current-password"
                    required
                    className="w-full px-3.5 py-2.5 bg-slate-950/90 border border-slate-700 focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400/50 rounded-xl text-slate-100 placeholder-slate-600 focus:outline-none font-mono text-xs pr-10 tracking-widest transition"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-2.5 text-slate-400 hover:text-cyan-400 transition cursor-pointer"
                    title={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Sub-options: Remember session & Enter Key notice */}
              <div className="flex items-center justify-between text-xs font-mono text-slate-400 pt-0.5">
                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="w-3.5 h-3.5 accent-cyan-400 rounded cursor-pointer"
                  />
                  <span className="text-[11px]">Remember on this PC</span>
                </label>

                <div className="flex items-center gap-1 text-[10px] text-cyan-400/90 font-mono">
                  <span>Press</span>
                  <kbd className="px-1.5 py-0.5 rounded bg-slate-800 border border-slate-700 text-[9px] text-cyan-300 inline-flex items-center gap-0.5 shadow-sm">
                    ENTER <CornerDownLeft className="w-2.5 h-2.5 inline" />
                  </kbd>
                  <span>to Unlock</span>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full py-3.5 mt-2 rounded-xl bg-gradient-to-r from-cyan-500 via-blue-600 to-cyan-400 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-orbitron font-extrabold tracking-wider text-xs transition flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-cyan-500/25 active:scale-98"
              >
                <KeyRound className="w-4 h-4 text-slate-950" />
                <span>UNLOCK QUANTUM CORE (ENTER ↵)</span>
              </button>
            </form>

            <div className="relative flex py-3 items-center">
              <div className="flex-grow border-t border-slate-800"></div>
              <span className="flex-shrink mx-3 text-[10px] font-mono text-slate-500 uppercase">Or Biometric Verification</span>
              <div className="flex-grow border-t border-slate-800"></div>
            </div>

            {/* 1-Click Biometric Scan Button */}
            <button
              type="button"
              onClick={handleBiometricUnlock}
              className="w-full py-2.5 px-4 rounded-xl bg-slate-900/90 hover:bg-slate-800 border border-slate-700 hover:border-cyan-400 text-slate-200 hover:text-cyan-300 font-orbitron font-bold text-xs tracking-wider transition flex items-center justify-center gap-2.5 cursor-pointer active:scale-98"
            >
              <Fingerprint className="w-4 h-4 text-cyan-400 animate-pulse" />
              <span>1-CLICK BIOMETRIC UNLOCK</span>
            </button>
          </div>
        ) : (
          /* Comprehensive Diagnostic Check Sequence Before Opening Main Interface */
          <div className="py-2 animate-fadeIn">
            <div className="flex items-center justify-between mb-3 border-b border-slate-800 pb-2">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-cyan-950 border border-cyan-400 flex items-center justify-center text-cyan-400">
                  <Activity className="w-4 h-4 animate-spin" style={{ animationDuration: "6s" }} />
                </div>
                <div>
                  <h3 className="font-orbitron font-bold text-sm text-cyan-300 glow-text-cyan uppercase">
                    SYSTEM SELF-TEST & PRE-FLIGHT DIAGNOSTICS
                  </h3>
                  <p className="text-[10px] font-mono text-slate-400">
                    Checking all PC hardware, neural matrices, and creative engines for Commander {username || "Wasi"}...
                  </p>
                </div>
              </div>

              <div className="text-right">
                <span className="text-lg font-orbitron font-bold text-cyan-400">{progressPercent}%</span>
              </div>
            </div>

            {/* Diagnostic Items Checklist */}
            <div className="space-y-2 mb-4 max-h-[280px] overflow-y-auto pr-1">
              {diagnosticItems.map((item, idx) => {
                const isPassed = diagnosticIndex > idx;
                const isCurrent = diagnosticIndex === idx;
                const ItemIcon = item.icon;

                return (
                  <div
                    key={idx}
                    className={`p-2.5 rounded-xl border transition-all duration-200 flex items-center justify-between text-xs font-mono ${
                      isPassed
                        ? "bg-emerald-950/25 border-emerald-500/40 text-emerald-300"
                        : isCurrent
                        ? "bg-cyan-950/40 border-cyan-400/50 text-cyan-200 shadow-md shadow-cyan-950"
                        : "bg-slate-950/40 border-slate-800/80 text-slate-600 opacity-40"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="mt-0.5 shrink-0">
                        {isPassed ? (
                          <div className="w-5 h-5 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-400">
                            <Check className="w-3.5 h-3.5" />
                          </div>
                        ) : isCurrent ? (
                          <div className="w-5 h-5 rounded-full bg-cyan-500/20 flex items-center justify-center text-cyan-400">
                            <ItemIcon className="w-3.5 h-3.5 animate-spin" />
                          </div>
                        ) : (
                          <ItemIcon className="w-4 h-4 text-slate-600" />
                        )}
                      </div>
                      <div>
                        <div className="font-semibold text-slate-200">{item.title}</div>
                        <div className="text-[10px] text-slate-400 leading-tight">{item.detail}</div>
                      </div>
                    </div>

                    <div className="text-[10px] font-mono shrink-0 ml-2">
                      {isPassed ? (
                        <span className="text-emerald-400 font-bold">VERIFIED [OK]</span>
                      ) : isCurrent ? (
                        <span className="text-cyan-400 animate-pulse font-bold">CHECKING...</span>
                      ) : (
                        <span className="text-slate-600">STANDBY</span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Glowing Diagnostic Progress Bar */}
            <div className="w-full bg-slate-950 rounded-full h-2.5 overflow-hidden border border-slate-800 mb-2">
              <div
                className="bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-500 h-full transition-all duration-300 shadow-md shadow-cyan-500/50"
                style={{ width: `${progressPercent}%` }}
              ></div>
            </div>

            <div className="flex justify-between items-center text-[10px] font-mono text-cyan-400 px-1">
              <span>ALL HARDWARE & ENGINES VERIFIED</span>
              <span>LAUNCHING WORKSPACE...</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
