import React, { useState, useEffect } from "react";
import { ShieldAlert, Eye, Droplet, Activity, Clock, Lock, Sparkles, Volume2 } from "lucide-react";
import { soundEffects } from "../services/soundEffects";
import { speechService } from "../services/speechService";
import { LanguageCode, VoiceGender } from "../types";

interface MandatoryHealthLockdownProps {
  isOpen: boolean;
  onRestCompleted: () => void;
  language: LanguageCode;
  voiceGender: VoiceGender;
  durationMinutes?: number;
}

export const MandatoryHealthLockdown: React.FC<MandatoryHealthLockdownProps> = ({
  isOpen,
  onRestCompleted,
  language,
  voiceGender,
  durationMinutes = 5,
}) => {
  const [secondsLeft, setSecondsLeft] = useState(durationMinutes * 60);
  const [activeStep, setActiveStep] = useState(0);

  const steps = [
    { title: "20-20-20 Optic Nerve Recovery", desc: "Look away from any screen towards an object at least 20 feet away.", icon: Eye },
    { title: "Cervical & Spine Posture Decompression", desc: "Stand up, gently roll your shoulders back and tilt neck side-to-side.", icon: Activity },
    { title: "Hydration Flush", desc: "Drink 1 full glass of fresh water to restore cellular energy.", icon: Droplet },
  ];

  useEffect(() => {
    if (!isOpen) {
      setSecondsLeft(durationMinutes * 60);
      return;
    }

    soundEffects.playAlert();

    const announce =
      language === "pa"
        ? "Wasi paji! Tussi continuous PC use kar rahe o. Tuhadi sehat layi 5 minute da mandatory rest shuru ho chukeya ae. Hun PC use karna band karo te rest karo."
        : "Wasi Sahab! Aap musalsal PC use kar rahe hain. Aapki sehat, kamar aur aankhon ki hifazat ke liye Quantum Mandatory Rest shuru ho chuka hai. Rest complete hone tak screen locked rahegi.";

    speechService.speak(announce, { lang: language, gender: voiceGender });

    const timer = setInterval(() => {
      setSecondsLeft((prev) => (prev <= 0 ? 0 : prev - 1));
    }, 1000);

    const stepInterval = setInterval(() => {
      setActiveStep((prev) => (prev + 1) % steps.length);
    }, 7000);

    return () => {
      clearInterval(timer);
      clearInterval(stepInterval);
    };
  }, [isOpen, durationMinutes, language, voiceGender]);

  useEffect(() => {
    if (!isOpen || secondsLeft !== 0) return;
    soundEffects.playQuantumStartup();
    const doneGreet =
      language === "pa"
        ? "Rest complete ho gaya Wasi paji! Tussi fresh ho ke dobara kaam shuru kar sakde o."
        : "Shabash Wasi Sahab! Rest complete ho chuka hai. Ab aap fresh mind ke sath wapas kaam continue kar sakte hain.";
    speechService.speak(doneGreet, { lang: language, gender: voiceGender });
    onRestCompleted();
  }, [isOpen, secondsLeft, language, voiceGender, onRestCompleted]);

  if (!isOpen) return null;

  const m = Math.floor(secondsLeft / 60);
  const s = secondsLeft % 60;
  const timerStr = `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;

  return (
    <div className="fixed inset-0 z-50 bg-[#02040b]/95 backdrop-blur-2xl text-slate-100 flex flex-col items-center justify-center p-6 select-none font-rajdhani">
      {/* Quantum Lockdown Shield Perimeter */}
      <div className="absolute inset-4 rounded-3xl border-2 border-red-500/30 pointer-events-none animate-pulse"></div>
      <div className="absolute inset-8 rounded-3xl border border-dashed border-cyan-400/20 pointer-events-none"></div>

      <div className="relative z-10 max-w-xl w-full text-center space-y-6">
        {/* Shield Icon */}
        <div className="relative w-24 h-24 mx-auto flex items-center justify-center">
          <div className="absolute inset-0 rounded-full border-2 border-red-500/40 border-t-red-400 animate-spin" style={{ animationDuration: "12s" }}></div>
          <div className="absolute inset-2 rounded-full border border-cyan-400/40 animate-spin" style={{ animationDirection: "reverse", animationDuration: "8s" }}></div>
          <ShieldAlert className="w-12 h-12 text-red-400 animate-bounce" />
        </div>

        <div>
          <span className="px-3 py-1 rounded-full bg-red-950/80 border border-red-500/40 text-red-300 text-xs font-mono tracking-widest uppercase">
            MANDATORY ERGONOMIC HEALTH LOCKDOWN
          </span>
          <h1 className="text-3xl md:text-4xl font-orbitron font-extrabold text-slate-100 mt-2 tracking-wider">
            PC WORKSTATION LOCKED
          </h1>
          <p className="text-xs md:text-sm font-mono text-slate-400 mt-2 leading-relaxed">
            {language === "pa"
              ? "Wasi paji, tuhadi sehat sub to pehlan ae! Screen time limit mukammal ho gayi ae. Rest time khatam hon tak PC access block ae."
              : "Commander Wasi, prolonged screen exposure detected. For your optic, spinal, and neurological recovery, this system is in mandatory rest mode."}
          </p>
        </div>

        {/* Big Countdown Timer */}
        <div className="p-6 rounded-2xl bg-slate-950/80 border border-red-500/30 shadow-2xl shadow-red-950/50">
          <div className="text-6xl md:text-7xl font-orbitron font-bold text-red-400 tracking-wider">
            {timerStr}
          </div>
          <div className="text-xs font-mono text-slate-400 mt-2 flex items-center justify-center gap-2">
            <Lock className="w-3.5 h-3.5 text-red-400" />
            <span>SYSTEM ENCRYPTION RESTRICTS PC ACCESS UNTIL 00:00</span>
          </div>
        </div>

        {/* Guided Eye & Neck Exercises Slider */}
        <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 text-left space-y-2">
          <div className="text-[11px] font-mono text-cyan-400 flex items-center gap-1.5 uppercase font-bold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>MANDATORY RECOVERY PROTOCOL [Step {activeStep + 1}/3]:</span>
          </div>
          <div className="text-sm font-bold text-slate-200">
            {steps[activeStep].title}
          </div>
          <div className="text-xs font-mono text-slate-400">
            {steps[activeStep].desc}
          </div>
        </div>

        {/* Fazool Kaam Warning Note */}
        <div className="text-[11px] font-mono text-slate-500">
          🚫 Fazool kharchi, late-night strain aur bina maqsad scrolling strictly blocked by Quantum Jarvis Core.
        </div>
      </div>
    </div>
  );
};
