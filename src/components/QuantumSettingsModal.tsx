import React, { useState, useRef, useEffect } from "react";
import { Settings, X, Palette, Volume2, Mic, MicOff, Image, Shield, Clock, Upload, Check, RefreshCw, Sparkles, Sliders, Globe, Radio, Play, Zap } from "lucide-react";
import { soundEffects } from "../services/soundEffects";
import { speechService } from "../services/speechService";
import { storageService, defaultAvatarConfig } from "../services/storage";
import { DashboardCustomization, CustomVoiceProfile, AccentTheme, LanguageCode, VoiceGender } from "../types";
import { ALL_JARVIS_THEMES } from "./themes/themesData";
import { ELEVENLABS_VOICE_PRESETS, PERSONALITY_MODES, WAKE_WORDS_100_PLUS } from "../data/jarvisCatalog";

interface QuantumSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  customization: DashboardCustomization;
  onUpdateCustomization: (updated: DashboardCustomization) => void;
  language: LanguageCode;
  onLanguageChange: (lang: LanguageCode) => void;
  isWakeWordActive: boolean;
  onToggleWakeWord: () => void;
  onExportBackup: () => void;
  onImportBackup: () => void;
}

export const QuantumSettingsModal: React.FC<QuantumSettingsModalProps> = ({
  isOpen,
  onClose,
  customization,
  onUpdateCustomization,
  language,
  onLanguageChange,
  isWakeWordActive,
  onToggleWakeWord,
  onExportBackup,
  onImportBackup,
}) => {
  const [activeTab, setActiveTab] = useState<"appearance" | "voice" | "screensaver" | "health" | "data">("appearance");

  // Custom Voice Recording State
  const [isRecordingVoice, setIsRecordingVoice] = useState(false);
  const [recordedAudioUrl, setRecordedAudioUrl] = useState<string | null>(null);
  const [newVoiceName, setNewVoiceName] = useState("");
  const [newVoiceGender, setNewVoiceGender] = useState<"male" | "female">("female");
  const [newVoicePitch, setNewVoicePitch] = useState(1.15);
  const [newVoiceRate, setNewVoiceRate] = useState(1.0);
  const [micBannerError, setMicBannerError] = useState<string | null>(null);
  const [elevenServerConfigured, setElevenServerConfigured] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  const avatarCfg = customization.avatarConfig || defaultAvatarConfig;

  useEffect(() => {
    if (!isOpen) return;
    fetch("/api/tts/elevenlabs/status")
      .then((r) => r.json())
      .then((d) => setElevenServerConfigured(Boolean(d.configured)))
      .catch(() => {});
  }, [isOpen]);

  if (!isOpen) return null;

  // Preset themes
  const colorPresets: { theme: AccentTheme; label: string; hex: string; desc: string }[] = [
    { theme: "cyan", label: "Quantum Cyan", hex: "#06b6d4", desc: "Tachyon Coherence Default" },
    { theme: "purple", label: "Quantum Amethyst", hex: "#a855f7", desc: "Deep Violet Entanglement" },
    { theme: "emerald", label: "Matrix Emerald", hex: "#10b981", desc: "Bio-Plasma Resonance" },
    { theme: "amber", label: "Solar Gold", hex: "#f59e0b", desc: "Fusion Reactor Glow" },
    { theme: "rose", label: "Tachyon Rose", hex: "#f43f5e", desc: "Supernova Red Shift" },
    { theme: "blue", label: "Electric Cobalt", hex: "#3b82f6", desc: "Cybernetic High Voltage" },
  ];

  const handleSelectTheme = (theme: AccentTheme, hex: string) => {
    soundEffects.playClick();
    onUpdateCustomization({
      ...customization,
      accentTheme: theme,
      customAccentHex: hex,
    });
  };

  // Custom Logo upload handler
  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const url = event.target?.result as string;
      onUpdateCustomization({
        ...customization,
        customLogoUrl: url,
      });
      soundEffects.playBeepConfirm();
    };
    reader.readAsDataURL(file);
  };

  // Custom Wallpaper upload handler
  const handleBgUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const url = event.target?.result as string;
      onUpdateCustomization({
        ...customization,
        customBgUrl: url,
      });
      soundEffects.playBeepConfirm();
    };
    reader.readAsDataURL(file);
  };

  // Voice Recording Functionality (Microphone)
  const startRecordingVoice = async () => {
    try {
      soundEffects.playClick();
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      audioChunksRef.current = [];
      const recorder = new MediaRecorder(stream);
      mediaRecorderRef.current = recorder;

      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) audioChunksRef.current.push(event.data);
      };

      recorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: "audio/webm" });
        const url = URL.createObjectURL(audioBlob);
        setRecordedAudioUrl(url);
        stream.getTracks().forEach((track) => track.stop());
      };

      recorder.start();
      setMicBannerError(null);
      setIsRecordingVoice(true);
    } catch {
      setMicBannerError("Microphone permission denied or unavailable. Pitch & rate sliders still work cleanly.");
    }
  };

  const stopRecordingVoice = () => {
    soundEffects.playBeepConfirm();
    if (mediaRecorderRef.current && isRecordingVoice) {
      mediaRecorderRef.current.stop();
      setIsRecordingVoice(false);
    }
  };

  // Save new custom voice profile
  const handleSaveCustomVoice = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newVoiceName.trim()) return;

    soundEffects.playQuantumStartup();

    const newProfile: CustomVoiceProfile = {
      id: "voice-" + Date.now(),
      name: newVoiceName.trim(),
      gender: newVoiceGender,
      pitch: Number(newVoicePitch),
      rate: Number(newVoiceRate),
      audioBlobUrl: recordedAudioUrl || undefined,
      description: `Custom ${newVoiceGender} voice profile customized by Commander Wasi`,
      dateAdded: new Date().toLocaleDateString(),
    };

    const updatedVoices = [...customization.customVoices, newProfile];
    onUpdateCustomization({
      ...customization,
      customVoices: updatedVoices,
      activeVoiceMode: "custom",
      activeCustomVoiceId: newProfile.id,
    });

    setNewVoiceName("");
    setRecordedAudioUrl(null);

    // Speak demo in new voice
    const demo =
      language === "pa"
        ? `Nava voice profile "${newProfile.name}" add ho gaya Wasi paji! Main hun is awaaz ch gal karaan ga.`
        : `Wasi Sahab, naya voice profile "${newProfile.name}" activate kar diya gaya hai. Main ab is voice mein baat karoonga.`;

    speechService.speak(demo, {
      lang: language,
      gender: newVoiceGender,
      pitch: newVoicePitch,
      rate: newVoiceRate,
    });
  };

  const handleTestVoice = (pitch: number, rate: number, gender: "male" | "female") => {
    soundEffects.playClick();
    const demo =
      language === "pa"
        ? "Sat Sri Akal Wasi paji! Eh tuhada custom voice test sample ae."
        : "Khush Amdeed Wasi Sahab! Yeh aapka custom voice sample test hai.";

    speechService.speak(demo, {
      lang: language,
      gender,
      pitch,
      rate,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 md:p-6 bg-black/85 backdrop-blur-xl animate-fadeIn font-rajdhani">
      <div className="relative w-full max-w-4xl max-h-[90vh] bg-slate-950/95 border border-cyan-500/40 rounded-3xl shadow-2xl shadow-cyan-950/80 flex flex-col overflow-hidden text-slate-100">
        {/* Glow Header */}
        <div className="px-6 py-4 bg-slate-900/90 border-b border-cyan-500/30 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/20 border border-cyan-400 flex items-center justify-center text-cyan-300">
              <Settings className="w-5 h-5 animate-spin" style={{ animationDuration: "14s" }} />
            </div>
            <div>
              <h2 className="font-orbitron font-bold text-base md:text-lg text-cyan-300 glow-text-cyan uppercase">
                QUANTUM SYSTEM & HUD CUSTOMIZATION
              </h2>
              <p className="text-xs font-mono text-slate-400">
                Personalize dashboard aesthetics, voice cloning, language, screensaver, and health limits
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-slate-800 text-slate-400 hover:text-white transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-slate-800 bg-slate-900/60 px-6 pt-3 gap-2 overflow-x-auto text-xs font-mono">
          <button
            onClick={() => {
              soundEffects.playClick();
              setActiveTab("appearance");
            }}
            className={`px-4 py-2 rounded-t-lg transition cursor-pointer flex items-center gap-2 ${
              activeTab === "appearance"
                ? "bg-slate-950 text-cyan-400 font-bold border-t-2 border-cyan-400"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            <Palette className="w-3.5 h-3.5" />
            <span>Theme & Colors</span>
          </button>

          <button
            onClick={() => {
              soundEffects.playClick();
              setActiveTab("voice");
            }}
            className={`px-4 py-2 rounded-t-lg transition cursor-pointer flex items-center gap-2 ${
              activeTab === "voice"
                ? "bg-slate-950 text-cyan-400 font-bold border-t-2 border-cyan-400"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            <Mic className="w-3.5 h-3.5" />
            <span>Voice & Custom Cloning</span>
          </button>

          <button
            onClick={() => {
              soundEffects.playClick();
              setActiveTab("screensaver");
            }}
            className={`px-4 py-2 rounded-t-lg transition cursor-pointer flex items-center gap-2 ${
              activeTab === "screensaver"
                ? "bg-slate-950 text-cyan-400 font-bold border-t-2 border-cyan-400"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            <Shield className="w-3.5 h-3.5" />
            <span>Screensaver & Away</span>
          </button>

          <button
            onClick={() => {
              soundEffects.playClick();
              setActiveTab("health");
            }}
            className={`px-4 py-2 rounded-t-lg transition cursor-pointer flex items-center gap-2 ${
              activeTab === "health"
                ? "bg-slate-950 text-cyan-400 font-bold border-t-2 border-cyan-400"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            <Clock className="w-3.5 h-3.5" />
            <span>Health & Rest Timer</span>
          </button>

          <button
            onClick={() => {
              soundEffects.playClick();
              setActiveTab("data");
            }}
            className={`px-4 py-2 rounded-t-lg transition cursor-pointer flex items-center gap-2 ${
              activeTab === "data"
                ? "bg-slate-950 text-cyan-400 font-bold border-t-2 border-cyan-400"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            <Sliders className="w-3.5 h-3.5" />
            <span>Backup & Sync</span>
          </button>
        </div>

        {/* Tab Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 text-xs font-mono">
          {/* 1. APPEARANCE & THEME */}
          {activeTab === "appearance" && (
            <div className="space-y-6">
              {/* SCI-FI HUD INTERFACES (ALL 7 USER DESIGNS MATCHING EXACT IMAGES) */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-orbitron font-bold text-sm text-cyan-300 uppercase flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-cyan-400" />
                    <span>Sci-Fi Cockpit & HUD Interfaces (7 Iconic Themes)</span>
                  </h3>
                  <span className="text-[10px] text-emerald-400 font-bold px-2 py-0.5 rounded bg-emerald-950/80 border border-emerald-500/40">
                    7 THEMES LOADED
                  </span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {ALL_JARVIS_THEMES.map((theme) => {
                    const isSelected = (customization.activeInterfaceTheme || "quantum_cockpit") === theme.id;
                    return (
                      <div
                        key={theme.id}
                        onClick={() => {
                          soundEffects.playBeepConfirm();
                          onUpdateCustomization({
                            ...customization,
                            activeInterfaceTheme: theme.id,
                            customAccentHex: theme.accentHex,
                          });
                        }}
                        className={`p-3 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between group overflow-hidden relative ${
                          isSelected
                            ? "bg-slate-900 border-2 border-cyan-400 shadow-xl shadow-cyan-950/80 ring-2 ring-cyan-500/40"
                            : "bg-slate-950/90 border-slate-800 hover:border-slate-700 hover:bg-slate-900/60"
                        }`}
                      >
                        {/* Thumbnail image matching user attachment */}
                        <div className="relative w-full h-32 rounded-xl overflow-hidden mb-2 border border-slate-800 group-hover:border-cyan-500/40 transition">
                          <img
                            src={theme.imagePath}
                            alt={theme.name}
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                          />
                          <span className="absolute top-2 left-2 text-[9px] font-mono px-2 py-0.5 rounded bg-black/80 text-cyan-300 border border-cyan-500/30">
                            {theme.category}
                          </span>
                          {isSelected && (
                            <span className="absolute top-2 right-2 flex items-center gap-1 text-[9px] font-mono px-2 py-0.5 rounded-full bg-cyan-400 text-black font-bold shadow-lg">
                              <Check className="w-3 h-3" /> ACTIVE
                            </span>
                          )}
                        </div>

                        <div>
                          <div className="font-orbitron font-bold text-xs text-white flex items-center justify-between">
                            <span>{theme.name}</span>
                            <span
                              className="w-2.5 h-2.5 rounded-full"
                              style={{ backgroundColor: theme.accentHex, boxShadow: `0 0 8px ${theme.accentHex}` }}
                            />
                          </div>
                          <p className="text-[10px] text-slate-400 line-clamp-2 mt-1 font-mono">
                            {theme.tagline}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Color Presets */}
              <div>
                <h3 className="font-orbitron font-bold text-sm text-cyan-300 uppercase mb-3 flex items-center gap-2">
                  <Palette className="w-4 h-4 text-cyan-400" />
                  <span>Quantum Color Presets</span>
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {colorPresets.map((preset) => (
                    <button
                      key={preset.theme}
                      onClick={() => handleSelectTheme(preset.theme, preset.hex)}
                      className={`p-3 rounded-2xl border text-left transition flex items-center justify-between cursor-pointer ${
                        customization.accentTheme === preset.theme
                          ? "bg-slate-900 border-cyan-400 shadow-md shadow-cyan-950 text-slate-100"
                          : "bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-200"
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <span
                          className="w-4 h-4 rounded-full shadow-sm"
                          style={{ backgroundColor: preset.hex }}
                        ></span>
                        <div>
                          <div className="font-semibold text-xs text-slate-200">{preset.label}</div>
                          <div className="text-[10px] text-slate-500">{preset.desc}</div>
                        </div>
                      </div>
                      {customization.accentTheme === preset.theme && (
                        <Check className="w-4 h-4 text-cyan-400" />
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* Custom Hex Color */}
              <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 flex items-center justify-between gap-4">
                <div>
                  <div className="font-semibold text-slate-200 text-xs">Custom Hex Accent Color</div>
                  <div className="text-[10px] text-slate-400">Pick any color code for your personalized holographic HUD</div>
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={customization.customAccentHex}
                    onChange={(e) => handleSelectTheme("custom", e.target.value)}
                    className="w-8 h-8 rounded-lg border border-slate-700 bg-transparent cursor-pointer"
                  />
                  <span className="font-mono text-cyan-400 font-bold">{customization.customAccentHex}</span>
                </div>
              </div>

              {/* Custom Logo & Wallpaper */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Custom Logo */}
                <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-slate-200 text-xs">Custom Brand Logo</span>
                    {customization.customLogoUrl && (
                      <button
                        onClick={() => onUpdateCustomization({ ...customization, customLogoUrl: "" })}
                        className="text-red-400 hover:text-red-300 text-[10px]"
                      >
                        Reset Default
                      </button>
                    )}
                  </div>
                  <p className="text-[11px] text-slate-400">
                    Upload your own custom image or avatar to replace the top OS emblem.
                  </p>
                  <label className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-slate-950 border border-dashed border-slate-700 hover:border-cyan-400 text-slate-300 cursor-pointer transition">
                    <Upload className="w-4 h-4 text-cyan-400" />
                    <span>Upload Logo Image</span>
                    <input type="file" accept="image/*" onChange={handleLogoUpload} className="hidden" />
                  </label>
                </div>

                {/* Custom Wallpaper */}
                <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-slate-200 text-xs">Custom Background Wallpaper</span>
                    {customization.customBgUrl && (
                      <button
                        onClick={() => onUpdateCustomization({ ...customization, customBgUrl: "" })}
                        className="text-red-400 hover:text-red-300 text-[10px]"
                      >
                        Reset Default
                      </button>
                    )}
                  </div>
                  <p className="text-[11px] text-slate-400">
                    Set a custom image wallpaper behind the holographic HUD.
                  </p>
                  <label className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-slate-950 border border-dashed border-slate-700 hover:border-cyan-400 text-slate-300 cursor-pointer transition">
                    <Upload className="w-4 h-4 text-cyan-400" />
                    <span>Upload Wallpaper</span>
                    <input type="file" accept="image/*" onChange={handleBgUpload} className="hidden" />
                  </label>
                </div>
              </div>

              {/* 3D Background & Scanlines Toggle */}
              <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-semibold text-slate-200 text-xs">3D Dynamic Moving Quantum Logos</div>
                    <div className="text-[10px] text-slate-400">Renders animated rotating Tachyon Torus, Qubit and particles</div>
                  </div>
                  <input
                    type="checkbox"
                    checked={customization.show3DBackground}
                    onChange={(e) =>
                      onUpdateCustomization({ ...customization, show3DBackground: e.target.checked })
                    }
                    className="w-4 h-4 accent-cyan-400 rounded cursor-pointer"
                  />
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-slate-800">
                  <div>
                    <div className="font-semibold text-slate-200 text-xs">Cybernetic CRT Scanlines</div>
                    <div className="text-[10px] text-slate-400">Adds subtle retro-futuristic holographic raster lines</div>
                  </div>
                  <input
                    type="checkbox"
                    checked={customization.scanlines}
                    onChange={(e) =>
                      onUpdateCustomization({ ...customization, scanlines: e.target.checked })
                    }
                    className="w-4 h-4 accent-cyan-400 rounded cursor-pointer"
                  />
                </div>
              </div>
            </div>
          )}

          {/* 2. VOICE & CUSTOM CLONING */}
          {activeTab === "voice" && (
            <div className="space-y-6">
              {/* Language Selection */}
              <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-3">
                <h3 className="font-orbitron font-bold text-sm text-cyan-300 uppercase flex items-center gap-2">
                  <Globe className="w-4 h-4 text-cyan-400" />
                  <span>Language & Regional Accent</span>
                </h3>
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { id: "ur" as const, name: "اردو (Urdu)", desc: "Pakistani National Clear Accent" },
                    { id: "pa" as const, name: "ਪੰਜਾਬੀ (Punjabi)", desc: "Lahori Crisp Regional Accent" },
                    { id: "en" as const, name: "English (EN)", desc: "Jarvis Neural Cyber Accent" },
                  ].map((item) => (
                    <button
                      key={item.id}
                      onClick={() => onLanguageChange(item.id)}
                      className={`p-3 rounded-xl border text-left transition cursor-pointer ${
                        language === item.id
                          ? "bg-cyan-950 border-cyan-400 text-cyan-300 shadow-md shadow-cyan-950"
                          : "bg-slate-950 border-slate-800 text-slate-400 hover:text-white"
                      }`}
                    >
                      <div className="font-bold text-xs">{item.name}</div>
                      <div className="text-[10px] text-slate-500 mt-1">{item.desc}</div>
                    </button>
                  ))}
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-slate-800">
                  <div>
                    <div className="font-semibold text-slate-200 text-xs">
                      116+ Wake Words Engine ("Hi Nexus", "Hey Jarvis", "Oye Zoya"...)
                    </div>
                    <div className="text-[10px] text-slate-400">
                      {WAKE_WORDS_100_PLUS.length + avatarCfg.customWakeWords.length} active wake triggers loaded across Urdu, Punjabi, English & Companion
                    </div>
                  </div>
                  <input
                    type="checkbox"
                    checked={isWakeWordActive}
                    onChange={onToggleWakeWord}
                    className="w-4 h-4 accent-cyan-400 rounded cursor-pointer"
                  />
                </div>
              </div>

              {/* ElevenLabs + Fast Talking + Personality Selector */}
              <div className="p-4 rounded-2xl bg-slate-900/60 border border-cyan-500/30 space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="font-orbitron font-bold text-sm text-cyan-300 uppercase flex items-center gap-2">
                    <Zap className="w-4 h-4 text-amber-400" />
                    <span>ElevenLabs Neural Voice & Fast Talk</span>
                  </h3>
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] ${
                      elevenServerConfigured
                        ? "bg-emerald-950 text-emerald-300 border border-emerald-500/40"
                        : "bg-slate-950 text-slate-400 border border-slate-700"
                    }`}
                  >
                    {elevenServerConfigured ? "ELEVENLABS ONLINE" : "NEURAL FALLBACK READY"}
                  </span>
                </div>

                {micBannerError && (
                  <div className="p-2 rounded-lg bg-amber-950/60 border border-amber-500/40 text-amber-300 text-xs">
                    {micBannerError}
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <label className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between cursor-pointer">
                    <div>
                      <div className="font-bold text-slate-200">Connect ElevenLabs TTS</div>
                      <div className="text-[10px] text-slate-400">Ultra-realistic neural synthesis</div>
                    </div>
                    <input
                      type="checkbox"
                      checked={avatarCfg.useElevenLabs}
                      onChange={(e) =>
                        onUpdateCustomization({
                          ...customization,
                          avatarConfig: { ...avatarCfg, useElevenLabs: e.target.checked },
                        })
                      }
                      className="w-4 h-4 accent-cyan-400 cursor-pointer"
                    />
                  </label>

                  <label className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between cursor-pointer">
                    <div>
                      <div className="font-bold text-slate-200">Real-Time Fast Talking</div>
                      <div className="text-[10px] text-slate-400">Instant low-latency response & speech</div>
                    </div>
                    <input
                      type="checkbox"
                      checked={avatarCfg.fastTalkingMode}
                      onChange={(e) =>
                        onUpdateCustomization({
                          ...customization,
                          avatarConfig: { ...avatarCfg, fastTalkingMode: e.target.checked },
                        })
                      }
                      className="w-4 h-4 accent-emerald-400 cursor-pointer"
                    />
                  </label>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[10px] text-slate-400 mb-1">ElevenLabs Voice Preset</label>
                    <select
                      value={avatarCfg.elevenLabsVoiceId}
                      onChange={(e) =>
                        onUpdateCustomization({
                          ...customization,
                          avatarConfig: { ...avatarCfg, elevenLabsVoiceId: e.target.value },
                        })
                      }
                      className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-slate-200"
                    >
                      {ELEVENLABS_VOICE_PRESETS.map((v) => (
                        <option key={v.id} value={v.id}>
                          {v.name} ({v.style})
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-[10px] text-slate-400 mb-1">AI Personality (24 Modes)</label>
                    <select
                      value={avatarCfg.personalityId}
                      onChange={(e) =>
                        onUpdateCustomization({
                          ...customization,
                          avatarConfig: { ...avatarCfg, personalityId: e.target.value },
                        })
                      }
                      className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-slate-200"
                    >
                      {PERSONALITY_MODES.map((p) => (
                        <option key={p.id} value={p.id}>
                          {p.emoji} {p.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* Active Voice Persona */}
              <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-3">
                <h3 className="font-orbitron font-bold text-sm text-purple-300 uppercase flex items-center gap-2">
                  <Volume2 className="w-4 h-4 text-purple-400" />
                  <span>Voice Persona Selection</span>
                </h3>

                <div className="grid grid-cols-3 gap-3">
                  <button
                    onClick={() => {
                      soundEffects.playClick();
                      onUpdateCustomization({ ...customization, activeVoiceMode: "male" });
                      speechService.speak("Male quantum voice profile selected.", { lang: language, gender: "male" });
                    }}
                    className={`p-3 rounded-xl border text-left transition cursor-pointer ${
                      customization.activeVoiceMode === "male"
                        ? "bg-purple-950 border-purple-400 text-purple-300"
                        : "bg-slate-950 border-slate-800 text-slate-400"
                    }`}
                  >
                    <div className="font-bold text-xs">MALE PERSONA</div>
                    <div className="text-[10px] text-slate-500">Deep Resonant AI Jarvis</div>
                  </button>

                  <button
                    onClick={() => {
                      soundEffects.playClick();
                      onUpdateCustomization({ ...customization, activeVoiceMode: "female" });
                      speechService.speak("Female quantum voice profile selected.", { lang: language, gender: "female" });
                    }}
                    className={`p-3 rounded-xl border text-left transition cursor-pointer ${
                      customization.activeVoiceMode === "female"
                        ? "bg-purple-950 border-purple-400 text-purple-300"
                        : "bg-slate-950 border-slate-800 text-slate-400"
                    }`}
                  >
                    <div className="font-bold text-xs">FEMALE PERSONA</div>
                    <div className="text-[10px] text-slate-500">Smooth Crisp Quantum Voice</div>
                  </button>

                  <button
                    onClick={() => {
                      soundEffects.playClick();
                      onUpdateCustomization({ ...customization, activeVoiceMode: "custom" });
                    }}
                    className={`p-3 rounded-xl border text-left transition cursor-pointer ${
                      customization.activeVoiceMode === "custom"
                        ? "bg-purple-950 border-purple-400 text-purple-300"
                        : "bg-slate-950 border-slate-800 text-slate-400"
                    }`}
                  >
                    <div className="font-bold text-xs">CUSTOM CLONED VOICE</div>
                    <div className="text-[10px] text-slate-500">User or Friend Voice Sample</div>
                  </button>
                </div>
              </div>

              {/* Custom Voice Studio (Record or Clone Friend's Voice) */}
              <div className="p-5 rounded-2xl bg-slate-900 border border-purple-500/30 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-orbitron font-bold text-sm text-purple-300 uppercase flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-purple-400" />
                    <span>Custom Voice Studio & Cloner</span>
                  </h3>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-purple-950 text-purple-300 border border-purple-500/30">
                    VOICE PROFILE BUILDER
                  </span>
                </div>

                <p className="text-xs text-slate-300 leading-relaxed">
                  Apni ya apni female friend ki voice add karein! Aap microphone se direct voice record kar sakte hain ya custom pitch aur rate adjust kar ke naya profile save kar sakte hain.
                </p>

                {/* Form to create custom voice */}
                <form onSubmit={handleSaveCustomVoice} className="space-y-3 bg-slate-950 p-4 rounded-xl border border-slate-800">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-mono text-slate-400 mb-1">Voice Profile Name</label>
                      <input
                        type="text"
                        value={newVoiceName}
                        onChange={(e) => setNewVoiceName(e.target.value)}
                        placeholder="e.g. My Friend Ayesha or Commander Voice"
                        required
                        className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-slate-200 text-xs font-mono"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-mono text-slate-400 mb-1">Base Vocal Persona</label>
                      <select
                        value={newVoiceGender}
                        onChange={(e) => setNewVoiceGender(e.target.value as any)}
                        className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-slate-200 text-xs font-mono"
                      >
                        <option value="female">Female (Soft / Crisp Tone)</option>
                        <option value="male">Male (Deep / Authoritative Tone)</option>
                      </select>
                    </div>
                  </div>

                  {/* Pitch & Speed Sliders */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
                    <div>
                      <div className="flex justify-between text-[11px] font-mono text-slate-400 mb-1">
                        <span>Vocal Pitch (Pitch Frequency)</span>
                        <span className="text-cyan-400 font-bold">{newVoicePitch.toFixed(2)}x</span>
                      </div>
                      <input
                        type="range"
                        min="0.6"
                        max="1.7"
                        step="0.05"
                        value={newVoicePitch}
                        onChange={(e) => setNewVoicePitch(parseFloat(e.target.value))}
                        className="w-full accent-cyan-400 cursor-pointer"
                      />
                    </div>

                    <div>
                      <div className="flex justify-between text-[11px] font-mono text-slate-400 mb-1">
                        <span>Speech Rate (Speed)</span>
                        <span className="text-purple-400 font-bold">{newVoiceRate.toFixed(2)}x</span>
                      </div>
                      <input
                        type="range"
                        min="0.7"
                        max="1.4"
                        step="0.05"
                        value={newVoiceRate}
                        onChange={(e) => setNewVoiceRate(parseFloat(e.target.value))}
                        className="w-full accent-purple-400 cursor-pointer"
                      />
                    </div>
                  </div>

                  {/* Microphone Record Sample */}
                  <div className="pt-2 flex flex-wrap items-center justify-between gap-3 border-t border-slate-800">
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={isRecordingVoice ? stopRecordingVoice : startRecordingVoice}
                        className={`px-3 py-2 rounded-xl text-xs font-mono transition flex items-center gap-1.5 cursor-pointer ${
                          isRecordingVoice
                            ? "bg-red-500 text-white animate-pulse"
                            : "bg-slate-900 border border-slate-700 hover:border-purple-400 text-slate-300"
                        }`}
                      >
                        {isRecordingVoice ? <MicOff className="w-3.5 h-3.5" /> : <Mic className="w-3.5 h-3.5 text-purple-400" />}
                        <span>{isRecordingVoice ? "STOP RECORDING" : "RECORD 5-SEC VOICE SAMPLE"}</span>
                      </button>

                      {recordedAudioUrl && (
                        <audio src={recordedAudioUrl} controls className="h-7 max-w-[180px]" />
                      )}
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => handleTestVoice(newVoicePitch, newVoiceRate, newVoiceGender)}
                        className="px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 hover:border-cyan-400 text-cyan-300 font-mono text-xs flex items-center gap-1 cursor-pointer"
                      >
                        <Play className="w-3 h-3" />
                        <span>TEST VOICE</span>
                      </button>

                      <button
                        type="submit"
                        className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold font-mono text-xs cursor-pointer shadow-lg shadow-purple-900/50"
                      >
                        SAVE VOICE CLONE
                      </button>
                    </div>
                  </div>
                </form>

                {/* Saved Profiles List */}
                <div className="space-y-2">
                  <span className="text-[11px] font-mono text-slate-400">SAVED CUSTOM VOICES:</span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {customization.customVoices.map((v) => (
                      <div
                        key={v.id}
                        className={`p-3 rounded-xl border flex items-center justify-between ${
                          customization.activeCustomVoiceId === v.id && customization.activeVoiceMode === "custom"
                            ? "bg-purple-950/40 border-purple-400 text-purple-200"
                            : "bg-slate-950 border-slate-800 text-slate-300"
                        }`}
                      >
                        <div>
                          <div className="font-bold text-xs text-slate-100">{v.name}</div>
                          <div className="text-[10px] text-slate-500">
                            Pitch: {v.pitch}x • Speed: {v.rate}x • {v.gender.toUpperCase()}
                          </div>
                        </div>

                        <div className="flex items-center gap-1.5">
                          <button
                            onClick={() => handleTestVoice(v.pitch, v.rate, v.gender)}
                            className="p-1 rounded bg-slate-900 hover:text-cyan-300 text-slate-400"
                            title="Test Speech"
                          >
                            <Play className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => {
                              onUpdateCustomization({
                                ...customization,
                                activeVoiceMode: "custom",
                                activeCustomVoiceId: v.id,
                              });
                              soundEffects.playBeepConfirm();
                            }}
                            className={`px-2 py-1 rounded text-[10px] font-bold ${
                              customization.activeCustomVoiceId === v.id && customization.activeVoiceMode === "custom"
                                ? "bg-purple-600 text-white"
                                : "bg-slate-900 text-slate-400 hover:text-white"
                            }`}
                          >
                            {customization.activeCustomVoiceId === v.id && customization.activeVoiceMode === "custom" ? "ACTIVE" : "USE"}
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* 3. SCREENSAVER & AWAY */}
          {activeTab === "screensaver" && (
            <div className="space-y-4">
              <h3 className="font-orbitron font-bold text-sm text-cyan-300 uppercase mb-2 flex items-center gap-2">
                <Shield className="w-4 h-4 text-cyan-400" />
                <span>Screensaver & Away Auto-Pilot Customizer</span>
              </h3>

              <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-3">
                <div>
                  <label className="block text-[11px] font-mono text-slate-400 mb-1">Screensaver Theme</label>
                  <select
                    value={customization.screensaverType}
                    onChange={(e) =>
                      onUpdateCustomization({
                        ...customization,
                        screensaverType: e.target.value as any,
                      })
                    }
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-slate-200 text-xs font-mono"
                  >
                    <option value="sentry">Quantum Sentry Radar & Task Patrol</option>
                    <option value="vortex">Tachyon Vortex & Particle Core</option>
                    <option value="nebula">Deep Space Nebula Starfield</option>
                    <option value="matrix">Matrix Code Rain Cyber Stream</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-mono text-slate-400 mb-1">Screensaver Banner Message</label>
                  <input
                    type="text"
                    value={customization.screensaverMessage}
                    onChange={(e) =>
                      onUpdateCustomization({
                        ...customization,
                        screensaverMessage: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-slate-200 text-xs font-mono"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-mono text-slate-400 mb-1">Inactivity Timeout (Auto-engage screensaver)</label>
                  <select
                    value={customization.screensaverTimeoutMinutes}
                    onChange={(e) =>
                      onUpdateCustomization({
                        ...customization,
                        screensaverTimeoutMinutes: Number(e.target.value),
                      })
                    }
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-slate-200 text-xs font-mono"
                  >
                    <option value="2">2 Minutes of inactivity</option>
                    <option value="5">5 Minutes (Recommended)</option>
                    <option value="10">10 Minutes</option>
                    <option value="0">Never auto-engage</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* 4. HEALTH & REST TIMER */}
          {activeTab === "health" && (
            <div className="space-y-4">
              <h3 className="font-orbitron font-bold text-sm text-cyan-300 uppercase mb-2 flex items-center gap-2">
                <Clock className="w-4 h-4 text-cyan-400" />
                <span>Mandatory Screen-Time Health Lockdown Limits</span>
              </h3>

              <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-3">
                <div>
                  <label className="block text-[11px] font-mono text-slate-400 mb-1">
                    Continuous Screen Work Limit (Triggers Forced Rest)
                  </label>
                  <select
                    value={customization.continuousWorkLimitMinutes}
                    onChange={(e) =>
                      onUpdateCustomization({
                        ...customization,
                        continuousWorkLimitMinutes: Number(e.target.value),
                      })
                    }
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-slate-200 text-xs font-mono"
                  >
                    <option value="30">30 Minutes (High protection for eyes)</option>
                    <option value="45">45 Minutes (Recommended ergonomic balance)</option>
                    <option value="60">60 Minutes</option>
                    <option value="90">90 Minutes (Intensive editing sessions)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-mono text-slate-400 mb-1">
                    Mandatory Rest Lockdown Duration (Screen Block Time)
                  </label>
                  <select
                    value={customization.mandatoryRestMinutes}
                    onChange={(e) =>
                      onUpdateCustomization({
                        ...customization,
                        mandatoryRestMinutes: Number(e.target.value),
                      })
                    }
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-slate-200 text-xs font-mono"
                  >
                    <option value="3">3 Minutes rest</option>
                    <option value="5">5 Minutes rest (Recommended)</option>
                    <option value="10">10 Minutes rest</option>
                  </select>
                </div>

                <div className="p-3 rounded-xl bg-amber-950/20 border border-amber-500/30 text-amber-300 text-[11px]">
                  🛡️ Jab yeh timer poora hoga to Jarvis poore PC ko mandatory rest mode mein daal dega taake aapki aankhon aur kamar ko sakoon mil sake.
                </div>
              </div>
            </div>
          )}

          {/* 5. BACKUP & SYNC */}
          {activeTab === "data" && (
            <div className="space-y-4">
              <h3 className="font-orbitron font-bold text-sm text-cyan-300 uppercase mb-2 flex items-center gap-2">
                <Sliders className="w-4 h-4 text-cyan-400" />
                <span>Quantum Data Backup & Cloud Synchronization</span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-3">
                  <div className="font-semibold text-slate-200 text-xs">Export Encrypted Backup</div>
                  <p className="text-[11px] text-slate-400">
                    Saves all customizations, tasks, study records, custom voices, and financial memories to a JSON snapshot.
                  </p>
                  <button
                    onClick={onExportBackup}
                    className="w-full py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold font-mono text-xs transition cursor-pointer flex items-center justify-center gap-2"
                  >
                    <Upload className="w-4 h-4" />
                    <span>DOWNLOAD BACKUP JSON</span>
                  </button>
                </div>

                <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-3">
                  <div className="font-semibold text-slate-200 text-xs">Restore Backup Snapshot</div>
                  <p className="text-[11px] text-slate-400">
                    Upload your previously saved Quantum Jarvis backup file to restore all settings on this or another PC.
                  </p>
                  <button
                    onClick={onImportBackup}
                    className="w-full py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold font-mono text-xs transition cursor-pointer flex items-center justify-center gap-2"
                  >
                    <Upload className="w-4 h-4" />
                    <span>RESTORE BACKUP FILE</span>
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 bg-slate-900 border-t border-slate-800 flex items-center justify-between">
          <div className="text-[11px] font-mono text-slate-400">
            Current Theme: <span className="text-cyan-400 font-bold uppercase">{customization.accentTheme}</span> • Voice: <span className="text-purple-400 uppercase font-bold">{customization.activeVoiceMode}</span>
          </div>
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold font-mono text-xs cursor-pointer shadow-md shadow-cyan-500/20"
          >
            APPLY & CLOSE SETTINGS
          </button>
        </div>
      </div>
    </div>
  );
};
