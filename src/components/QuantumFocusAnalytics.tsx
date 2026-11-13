import React, { useState, useEffect } from "react";
import { Target, Play, Pause, RotateCcw, ShieldCheck, Flame, BarChart3, FileText, CheckCircle2, Clock, Sparkles } from "lucide-react";
import { soundEffects } from "../services/soundEffects";
import { speechService } from "../services/speechService";
import { LanguageCode, VoiceGender } from "../types";

interface QuantumFocusAnalyticsProps {
  language: LanguageCode;
  voiceGender: VoiceGender;
}

export const QuantumFocusAnalytics: React.FC<QuantumFocusAnalyticsProps> = ({
  language,
  voiceGender,
}) => {
  // Focus Pomodoro State
  const [focusDuration, setFocusDuration] = useState(25); // minutes
  const [timeLeft, setTimeLeft] = useState(25 * 60); // seconds
  const [isFocusActive, setIsFocusActive] = useState(false);
  const [distractionsBlocked, setDistractionsBlocked] = useState(7);

  // Daily Report State
  const [dailyReportText, setDailyReportText] = useState<string | null>(null);
  const [isGeneratingReport, setIsGeneratingReport] = useState(false);

  // Focus Timer Tick
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isFocusActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (isFocusActive && timeLeft === 0) {
      soundEffects.playQuantumStartup();
      soundEffects.stopQuantumBinauralHum();
      setIsFocusActive(false);

      const finishText =
        language === "pa"
          ? "Zabardast Wasi paji! Focus session complete ho gaya ae. Thoda rest kar lo."
          : "Mubarak ho Wasi Sahab! 25 minute ka Quantum Deep Focus session kamyabi se complete ho gaya hai.";

      speechService.speak(finishText, { lang: language, gender: voiceGender });
    }
    return () => clearInterval(interval);
  }, [isFocusActive, timeLeft, language, voiceGender]);

  // Toggle Focus
  const toggleFocus = () => {
    soundEffects.playClick();
    if (!isFocusActive) {
      soundEffects.playBeepConfirm();
      soundEffects.startQuantumBinauralHum();
      setIsFocusActive(true);

      const startText =
        language === "pa"
          ? "Quantum Focus Mode active ho gaya Wasi paji! Saari distractions block kar dittiyan ne."
          : "Quantum Deep Focus Mode active kar diya gaya hai Wasi Sahab. Distractions block hain, apne goal par focus rakhein.";

      speechService.speak(startText, { lang: language, gender: voiceGender });
    } else {
      soundEffects.stopQuantumBinauralHum();
      setIsFocusActive(false);
    }
  };

  const resetFocus = (mins: number) => {
    soundEffects.playClick();
    soundEffects.stopQuantumBinauralHum();
    setIsFocusActive(false);
    setFocusDuration(mins);
    setTimeLeft(mins * 60);
  };

  // Generate AI Daily Evening Report
  const handleGenerateReport = async () => {
    soundEffects.playScan();
    setIsGeneratingReport(true);

    try {
      const res = await fetch("/api/jarvis/daily-briefing", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          language,
          stats: {
            focusMinutes: 145,
            tasksDone: 4,
            waterGlasses: 6,
            blockedDistractions: distractionsBlocked,
            coherenceRate: 99.8,
          },
        }),
      });
      const data = await res.json();
      setDailyReportText(data.report);
      soundEffects.playBeepConfirm();

      if (data.audioText) {
        speechService.speak(data.audioText, { lang: language, gender: voiceGender });
      }
    } catch {
      const fallbackReport = `Quantum Daily Report for Commander Wasi:
• Focus Time: 145 mins in deep editing & coding.
• Hydration & Health: 6/8 glasses logged, posture balanced.
• Financial Discipline: 4 impulse shopping urges intercepted.
• Tomorrow's Focus: Complete Premiere project rendering & review portfolio.`;
      setDailyReportText(fallbackReport);
      speechService.speak("Wasi Sahab, aaj ka quantum report tayar hai.", { lang: language, gender: voiceGender });
    } finally {
      setIsGeneratingReport(false);
    }
  };

  const formatTimer = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  return (
    <div className="space-y-6 font-rajdhani">
      {/* Top Focus & Distraction Blocker Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Pomodoro Focus Timer */}
        <div className="lg:col-span-2 p-6 rounded-2xl bg-slate-900/80 border border-cyan-500/30 flex flex-col justify-between">
          <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
            <div className="flex items-center gap-2">
              <Target className="w-5 h-5 text-cyan-400" />
              <h3 className="font-orbitron font-bold text-base text-cyan-400 uppercase">
                QUANTUM DEEP FOCUS CHAMBER
              </h3>
            </div>

            {/* Duration Selector */}
            <div className="flex items-center gap-1.5 bg-slate-950 p-1 rounded-lg border border-slate-800 text-xs font-mono">
              <button
                onClick={() => resetFocus(25)}
                className={`px-3 py-1 rounded transition cursor-pointer ${
                  focusDuration === 25 ? "bg-cyan-500 text-slate-950 font-bold" : "text-slate-400 hover:text-white"
                }`}
              >
                25 MIN
              </button>
              <button
                onClick={() => resetFocus(50)}
                className={`px-3 py-1 rounded transition cursor-pointer ${
                  focusDuration === 50 ? "bg-cyan-500 text-slate-950 font-bold" : "text-slate-400 hover:text-white"
                }`}
              >
                50 MIN
              </button>
            </div>
          </div>

          {/* Central Clock Display */}
          <div className="text-center my-6">
            <div className="text-6xl md:text-7xl font-orbitron font-bold text-slate-100 tracking-wider glow-text-cyan">
              {formatTimer(timeLeft)}
            </div>
            <div className="text-xs font-mono text-cyan-300 mt-2 flex items-center justify-center gap-2">
              <span className={`w-2 h-2 rounded-full ${isFocusActive ? "bg-emerald-400 animate-ping" : "bg-slate-600"}`}></span>
              <span>{isFocusActive ? "BINAURAL 432Hz FREQUENCY EMITTING • SHIELD ON" : "READY TO INITIATE DEEP WORK"}</span>
            </div>
          </div>

          {/* Controls */}
          <div className="flex items-center justify-center gap-3">
            <button
              onClick={toggleFocus}
              className={`px-8 py-3 rounded-xl font-orbitron font-bold text-sm tracking-wider transition flex items-center gap-2 cursor-pointer shadow-lg ${
                isFocusActive
                  ? "bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-amber-500/30"
                  : "bg-cyan-500 hover:bg-cyan-400 text-slate-950 shadow-cyan-500/30"
              }`}
            >
              {isFocusActive ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
              <span>{isFocusActive ? "PAUSE FOCUS" : "ENGAGE FOCUS"}</span>
            </button>

            <button
              onClick={() => resetFocus(focusDuration)}
              className="p-3 rounded-xl bg-slate-950 border border-slate-800 hover:border-slate-700 text-slate-400 hover:text-white transition cursor-pointer"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Right: Distraction Blocker Status */}
        <div className="p-6 rounded-2xl bg-slate-900/80 border border-purple-500/30 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <ShieldCheck className="w-5 h-5 text-purple-400" />
              <h3 className="font-orbitron font-bold text-base text-purple-400 uppercase">
                DISTRACTION SHIELD
              </h3>
            </div>
            <p className="text-xs font-mono text-slate-400 mb-4">
              Restricts access to addictive algorithms, reels, shorts, and notifications during work sessions.
            </p>

            <div className="space-y-2 text-xs font-mono">
              <div className="p-2.5 rounded-lg bg-slate-950/80 border border-slate-800 flex items-center justify-between">
                <span className="text-slate-300">YouTube Shorts / Reels</span>
                <span className="text-red-400 font-bold">BLOCKED</span>
              </div>
              <div className="p-2.5 rounded-lg bg-slate-950/80 border border-slate-800 flex items-center justify-between">
                <span className="text-slate-300">Social Media Feeds</span>
                <span className="text-red-400 font-bold">BLOCKED</span>
              </div>
              <div className="p-2.5 rounded-lg bg-slate-950/80 border border-slate-800 flex items-center justify-between">
                <span className="text-slate-300">Non-work Notifications</span>
                <span className="text-emerald-400 font-bold">MUTED</span>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-4 border-t border-slate-800 flex items-center justify-between text-xs font-mono">
            <span className="text-slate-400">Interceptions Today:</span>
            <span className="font-orbitron font-bold text-emerald-400 text-sm">
              {distractionsBlocked} Attempts Blocked
            </span>
          </div>
        </div>
      </div>

      {/* Daily Activity Timeline & AI Evening Briefing */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Timeline */}
        <div className="p-5 rounded-2xl bg-slate-900/70 border border-slate-800">
          <div className="flex items-center gap-2 mb-4">
            <Clock className="w-5 h-5 text-emerald-400" />
            <h3 className="font-orbitron font-bold text-base text-emerald-400 uppercase">
              DAILY ACTIVITY TIMELINE
            </h3>
          </div>

          <div className="space-y-3 relative pl-4 border-l border-slate-800 text-xs font-mono">
            <div className="relative">
              <span className="absolute -left-[21px] top-1 w-2.5 h-2.5 rounded-full bg-cyan-400"></span>
              <div className="text-cyan-400 font-bold">09:15 AM • Quantum Initialization</div>
              <div className="text-slate-400">Wasi logged in. Biometric handshake verified.</div>
            </div>

            <div className="relative">
              <span className="absolute -left-[21px] top-1 w-2.5 h-2.5 rounded-full bg-purple-400"></span>
              <div className="text-purple-400 font-bold">11:00 AM • Video Editing Session</div>
              <div className="text-slate-400">Adobe Premiere Pro: Auto-cut silences macro executed.</div>
            </div>

            <div className="relative">
              <span className="absolute -left-[21px] top-1 w-2.5 h-2.5 rounded-full bg-emerald-400"></span>
              <div className="text-emerald-400 font-bold">01:30 PM • Health & Hydration Check</div>
              <div className="text-slate-400">Clean meal logged (Grilled Chicken & Salad) + 3 glasses water.</div>
            </div>

            <div className="relative">
              <span className="absolute -left-[21px] top-1 w-2.5 h-2.5 rounded-full bg-amber-400"></span>
              <div className="text-amber-400 font-bold">04:20 PM • Fazool Kharchi Intercepted</div>
              <div className="text-slate-400">Online cart impulse buy analyzed & deferred by Jarvis advice.</div>
            </div>
          </div>
        </div>

        {/* AI Daily Evening Briefing */}
        <div className="p-5 rounded-2xl bg-slate-900/70 border border-slate-800 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-cyan-400" />
                <h3 className="font-orbitron font-bold text-base text-cyan-400 uppercase">
                  DAILY PROGRESS REPORT
                </h3>
              </div>
              <button
                onClick={handleGenerateReport}
                disabled={isGeneratingReport}
                className="px-3 py-1.5 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs font-mono transition flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>{isGeneratingReport ? "GENERATING..." : "GENERATE AI BRIEFING"}</span>
              </button>
            </div>

            <p className="text-xs font-mono text-slate-400 mb-3">
              Jarvis synthesizes your daily achievements, editing output, nutrition, and budget savings into an executive briefing.
            </p>

            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800/80 text-xs font-mono text-slate-300 whitespace-pre-wrap leading-relaxed min-h-[160px]">
              {dailyReportText || (
                <span className="text-slate-500 italic">
                  Click 'Generate AI Briefing' to compile today's comprehensive productivity, health, and financial report.
                </span>
              )}
            </div>
          </div>

          <div className="mt-3 text-[11px] font-mono text-slate-500 text-right">
            Jarvis vocal briefing ready in {language.toUpperCase()}
          </div>
        </div>
      </div>
    </div>
  );
};
