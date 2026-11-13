import React, { useState, useEffect } from "react";
import {
  Heart,
  Sparkles,
  Volume2,
  Zap,
  Send,
  Mic,
  MicOff,
  X,
  Eye,
  Radio,
  Activity,
} from "lucide-react";
import { CyberGirlFullBodyAvatar } from "./CyberGirlFullBodyAvatar";
import {
  AvatarBodyMovement,
  AvatarStudioConfig,
  HologramDisplayMode,
  LanguageCode,
  StandbyAnimationType,
} from "../types";
import { PERSONALITY_MODES, ELEVENLABS_VOICE_PRESETS } from "../data/jarvisCatalog";
import {
  BODY_MOVEMENT_COMMANDS,
  detectBodyMovementFromText,
  detectHologramModeFromText,
} from "../utils/bodyMovementParser";
import { soundEffects } from "../services/soundEffects";
import { speechService } from "../services/speechService";

interface HumanoidCommandStageProps {
  isOpen?: boolean;
  onClose?: () => void;
  avatarConfig: AvatarStudioConfig;
  onUpdateAvatarConfig: (next: AvatarStudioConfig) => void;
  language: LanguageCode;
  isSpeaking: boolean;
  isListening: boolean;
  bodyMovement: AvatarBodyMovement;
  onTriggerBodyMovement: (move: AvatarBodyMovement) => void;
  hologramMode: HologramDisplayMode;
  cinematicTrigger: number;
  onChangeHologramMode: (mode: HologramDisplayMode, triggerCinematic?: boolean) => void;
  embedded?: boolean;
}

export const HumanoidCommandStage: React.FC<HumanoidCommandStageProps> = ({
  isOpen = true,
  onClose,
  avatarConfig,
  onUpdateAvatarConfig,
  language,
  isSpeaking,
  isListening,
  bodyMovement,
  onTriggerBodyMovement,
  hologramMode,
  cinematicTrigger,
  onChangeHologramMode,
  embedded = false,
}) => {
  const [commandInput, setCommandInput] = useState("");
  const [lastGirlReply, setLastGirlReply] = useState(
    "Jaan Wasi! Dekhein mera 3D Face Hologram aapke samnay hai. Jab aap bolenge 'mjy humanoid model dikhao' ya koi move select karenge, main poora model cinematic andaz mein dikhaoongi!"
  );
  const [isTalkingLoading, setIsTalkingLoading] = useState(false);
  const [elevenStatus, setElevenStatus] = useState<{ configured: boolean }>({
    configured: false,
  });

  const activePersonality =
    PERSONALITY_MODES.find((p) => p.id === avatarConfig.personalityId) ||
    PERSONALITY_MODES[0];

  useEffect(() => {
    fetch("/api/tts/elevenlabs/status")
      .then((r) => r.json())
      .then((d) => setElevenStatus({ configured: Boolean(d.configured) }))
      .catch(() => {});
  }, []);

  if (!isOpen) return null;

  const updateCfg = (patch: Partial<AvatarStudioConfig>) => {
    onUpdateAvatarConfig({ ...avatarConfig, ...patch });
  };

  const speakAsPakistaniGirlfriend = (text: string) => {
    speechService.speak(text, {
      lang: language === "pa" ? "pa" : language === "en" ? "en" : "ur",
      gender: "female",
      pitch: 1.12,
      rate: avatarConfig.fastTalkingMode ? 1.04 : 0.98,
      fast: avatarConfig.fastTalkingMode,
      useElevenLabs: avatarConfig.useElevenLabs,
      elevenLabsVoiceId: avatarConfig.elevenLabsVoiceId,
    });
  };

  const handleSelectBodyMove = (moveId: AvatarBodyMovement) => {
    soundEffects.playBeepConfirm();
    if (moveId === "showcase") {
      onChangeHologramMode("fullbody", true);
    } else if (moveId !== "idle") {
      onChangeHologramMode("fullbody", hologramMode === "face");
    }
    onTriggerBodyMovement(moveId);
    const meta = BODY_MOVEMENT_COMMANDS.find((m) => m.id === moveId);
    if (meta) {
      const reply = language === "en" ? meta.replyEn : meta.replyUr;
      setLastGirlReply(reply);
      speakAsPakistaniGirlfriend(reply);
    }
  };

  const handleToggleDisplayMode = (mode: HologramDisplayMode) => {
    soundEffects.playBeepConfirm();
    onChangeHologramMode(mode, mode === "fullbody");
    if (mode === "fullbody") {
      onTriggerBodyMovement("showcase");
      const reply =
        language === "en"
          ? "Materializing my full 3D holographic humanoid form in cinematic view!"
          : "Dekho Jaan! Ab poora 3D Hologram Humanoid model cinematic view mein represent ho raha hai!";
      setLastGirlReply(reply);
      speakAsPakistaniGirlfriend(reply);
    } else {
      onTriggerBodyMovement("idle");
      const reply =
        language === "en"
          ? "Switching back to close-up 3D Face Hologram."
          : "Ji Jaan! Ab sirf mera HD 3D Face Hologram aapke samnay glow kar raha hai.";
      setLastGirlReply(reply);
      speakAsPakistaniGirlfriend(reply);
    }
  };

  const handleSendCommand = async (e: React.FormEvent) => {
    e.preventDefault();
    const raw = commandInput.trim();
    if (!raw || isTalkingLoading) return;
    setCommandInput("");
    soundEffects.playClick();

    // Check explicit Face-Only or Full Humanoid reveal commands first
    const detectedMode = detectHologramModeFromText(raw);
    const detectedMove = detectBodyMovementFromText(raw);
    if (detectedMode === "face" && (!detectedMove || detectedMove === "idle")) {
      handleToggleDisplayMode("face");
      return;
    }
    if (detectedMove) {
      handleSelectBodyMove(detectedMove);
      return;
    }
    if (detectedMode === "fullbody") {
      handleToggleDisplayMode("fullbody");
      return;
    }

    setIsTalkingLoading(true);
    try {
      const res = await fetch("/api/jarvis/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: raw,
          language,
          personalityName: activePersonality.name,
          personalityPrompt: activePersonality.systemPromptModifier,
          fastMode: avatarConfig.fastTalkingMode,
        }),
      });
      const data = await res.json();
      if (data.actionPayload?.hologramMode === "face") {
        onChangeHologramMode("face");
      } else if (data.actionPayload?.hologramMode === "fullbody") {
        onChangeHologramMode("fullbody", Boolean(data.actionPayload?.cinematic));
      }
      if (data.action === "AVATAR_MOVE" && data.actionPayload?.movement) {
        onTriggerBodyMovement(data.actionPayload.movement as AvatarBodyMovement);
      } else if (data.action === "OPEN_HUMANOID" && data.actionPayload?.movement) {
        onTriggerBodyMovement(data.actionPayload.movement as AvatarBodyMovement);
      }
      const reply =
        data.reply ||
        "Jaan Wasi, main bilkul aapke sath hoon! Aap jo chahein mujhse karwa sakte ho.";
      setLastGirlReply(reply);
      speakAsPakistaniGirlfriend(reply);
    } finally {
      setIsTalkingLoading(false);
    }
  };

  const handleToggleVoiceCommandMic = () => {
    soundEffects.playClick();
    if (speechService.getListeningState()) {
      speechService.stopListening();
      return;
    }
    speechService.setCallbacks({
      onResult: (transcript, isFinal) => {
        setCommandInput(transcript);
        const instantMode = detectHologramModeFromText(transcript);
        const instantMove = detectBodyMovementFromText(transcript);
        if (instantMode) {
          onChangeHologramMode(instantMode, instantMode === "fullbody");
        }
        if (instantMove) {
          onTriggerBodyMovement(instantMove);
        }
        if (isFinal) {
          const finalMode = detectHologramModeFromText(transcript);
          const finalMove = detectBodyMovementFromText(transcript);
          if (finalMode === "face" && (!finalMove || finalMove === "idle")) {
            handleToggleDisplayMode("face");
          } else if (finalMove) {
            handleSelectBodyMove(finalMove);
          } else if (finalMode === "fullbody") {
            handleToggleDisplayMode("fullbody");
          } else {
            fetch("/api/jarvis/chat", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                message: transcript,
                language,
                personalityName: activePersonality.name,
                personalityPrompt: activePersonality.systemPromptModifier,
                fastMode: avatarConfig.fastTalkingMode,
              }),
            })
              .then((r) => r.json())
              .then((data) => {
                if (data.actionPayload?.hologramMode === "face") {
                  onChangeHologramMode("face");
                } else if (data.actionPayload?.hologramMode === "fullbody") {
                  onChangeHologramMode("fullbody", true);
                }
                if (data.actionPayload?.movement) {
                  onTriggerBodyMovement(data.actionPayload.movement as AvatarBodyMovement);
                }
                const reply = data.reply || "Ji Jaan!";
                setLastGirlReply(reply);
                speakAsPakistaniGirlfriend(reply);
              })
              .catch(() => {});
          }
        }
      },
    });
    speechService.startListening(language);
  };

  const content = (
    <div className="flex flex-col h-full text-slate-100 font-rajdhani bg-[#02050f]">
      {/* UHD Studio Header */}
      <div className="px-5 py-3.5 bg-slate-900/95 border-b border-cyan-500/35 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500/30 to-rose-500/30 border border-cyan-400 flex items-center justify-center text-cyan-300 shadow-[0_0_20px_rgba(0,245,255,0.4)]">
            <Heart className="w-5 h-5 text-rose-400 fill-rose-400/50" />
          </div>
          <div>
            <h2 className="font-orbitron font-bold text-sm md:text-base text-cyan-300 tracking-wide">
              ZOYA — 3D HOLOGRAM HUMANOID PROJECTION
            </h2>
            <p className="text-[11px] font-mono text-slate-400">
              Volumetric WebGL 3D Hologram • 20 Voice-Controlled Motions • Pakistani Urdu Girlfriend AI
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 text-xs font-mono">
          <span className="text-cyan-300 font-semibold tracking-wider">
            3D HOLOGRAM ACTIVE
          </span>
          {onClose && !embedded && (
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>

      {/* Main Split Stage */}
      <div className="flex-1 overflow-y-auto p-4 md:p-6 grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* LEFT COLUMN: FULL-BODY UHD HOLOGRAPHIC STAGE */}
        <div className="lg:col-span-6 flex flex-col items-center justify-between p-4 rounded-2xl bg-gradient-to-b from-[#02050d] via-[#040917] to-[#02050d] border border-cyan-500/35 relative overflow-hidden">
          <div className="w-full flex items-center justify-between text-[11px] font-mono z-10 border-b border-slate-800/80 pb-2">
            <span className="text-rose-300 flex items-center gap-1.5 font-medium">
              <Heart className="w-3.5 h-3.5 text-rose-400 fill-rose-400" />
              <span>{activePersonality.name}</span>
            </span>
            <span className="text-cyan-300 flex items-center gap-1.5 tabular-nums">
              <Activity className="w-3.5 h-3.5 text-cyan-400" />
              <span>POSE: {bodyMovement.toUpperCase()}</span>
            </span>
          </div>

          {/* Hologram Viewport (Face-Only by Default -> Cinematic Full Humanoid on Command) */}
          <div className="my-2 flex items-center justify-center z-10 w-full">
            <CyberGirlFullBodyAvatar
              isSpeaking={isSpeaking}
              isListening={isListening}
              bodyMovement={bodyMovement}
              standbyAnimation={avatarConfig.standbyAnimation}
              hologramMode={hologramMode}
              cinematicTrigger={cinematicTrigger}
              onToggleHologramMode={handleToggleDisplayMode}
              personalityName={activePersonality.name}
              size="uhd"
            />
          </div>

          {/* Live Dialogue Bubble from Your Girlfriend */}
          <div className="w-full p-3.5 rounded-2xl bg-slate-900/95 border border-cyan-500/40 text-xs font-mono text-slate-100 space-y-2 z-10">
            <div className="flex items-center justify-between text-[10px] text-cyan-300">
              <span className="flex items-center gap-1 font-bold">
                <Radio className="w-3 h-3 text-emerald-400" />
                <span>ZOYA (PAKISTANI URDU VOICE):</span>
              </span>
              <button
                type="button"
                onClick={() => speakAsPakistaniGirlfriend(lastGirlReply)}
                className="px-2 py-0.5 rounded bg-cyan-500/20 hover:bg-cyan-500 text-cyan-300 hover:text-slate-950 border border-cyan-400/50 flex items-center gap-1 cursor-pointer"
              >
                <Volume2 className="w-3 h-3" />
                <span>SPEAK AGAIN</span>
              </button>
            </div>
            <p className="text-sm font-rajdhani text-white leading-snug">{lastGirlReply}</p>
          </div>
        </div>

        {/* RIGHT COLUMN: VOICE COMMANDS, FULL-BODY MOVEMENTS & GIRLFRIEND CONTROLS */}
        <div className="lg:col-span-6 flex flex-col justify-between space-y-4">
          {/* Body Movement Command Grid */}
          <div className="p-4 rounded-3xl bg-slate-900/80 border border-cyan-500/30 space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-orbitron font-bold text-sm text-cyan-300 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-cyan-400" />
                  <span>FULL-BODY 3D MOVEMENT COMMANDS (20 MODES)</span>
                </h3>
                <p className="text-[11px] font-mono text-slate-400">
                  Jo bolein gi wohi 3D mein karegi: "hero pose", "kick karo", "dance karo", "run", "punch", "flying kiss", "kuch bhi dikhao"
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5 max-h-[265px] overflow-y-auto pr-1">
              {BODY_MOVEMENT_COMMANDS.map((move) => {
                const active = bodyMovement === move.id;
                return (
                  <button
                    key={move.id}
                    type="button"
                    onClick={() => handleSelectBodyMove(move.id)}
                    className={`p-2.5 rounded-2xl border text-left transition cursor-pointer flex items-center gap-2.5 ${
                      active
                        ? "bg-gradient-to-r from-cyan-500/30 to-rose-500/25 border-cyan-400 text-white shadow-[0_0_20px_rgba(0,245,255,0.35)] scale-[1.02]"
                        : "bg-slate-950/85 border-slate-800 hover:border-cyan-500/60 text-slate-300"
                    }`}
                  >
                    <span className="text-lg">{move.emoji}</span>
                    <div className="leading-tight">
                      <div className="text-xs font-bold">{move.label}</div>
                      <div className="text-[10px] font-mono text-cyan-300">
                        {move.urduLabel}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Pakistani Urdu Female Voice + Girlfriend Personality Settings */}
          <div className="p-4 rounded-3xl bg-slate-900/80 border border-rose-500/35 space-y-3 text-xs font-mono">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="font-orbitron font-bold text-sm text-rose-300 flex items-center gap-2">
                <Zap className="w-4 h-4 text-amber-400" />
                <span>PAKISTANI URDU FEMALE VOICE & GIRLFRIEND MODE</span>
              </div>
              <span className="px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-500/40 text-[10px]">
                {elevenStatus.configured
                  ? "ELEVENLABS + GEMINI URDU HD"
                  : "GEMINI PAKISTANI URDU HD"}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              <label className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between cursor-pointer">
                <span>Floating Full-Body Girl</span>
                <input
                  type="checkbox"
                  checked={avatarConfig.floatingAvatarEnabled}
                  onChange={(e) =>
                    updateCfg({ floatingAvatarEnabled: e.target.checked })
                  }
                  className="accent-cyan-400 w-4 h-4"
                />
              </label>

              <label className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between cursor-pointer">
                <span>Connect ElevenLabs Voice</span>
                <input
                  type="checkbox"
                  checked={avatarConfig.useElevenLabs}
                  onChange={(e) => updateCfg({ useElevenLabs: e.target.checked })}
                  className="accent-purple-400 w-4 h-4"
                />
              </label>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
              <span className="text-slate-400">Standby Breathing:</span>
              <div className="flex gap-1.5">
                {(["breathe", "float", "pulse", "sway"] as StandbyAnimationType[]).map(
                  (anim) => (
                    <button
                      key={anim}
                      type="button"
                      onClick={() => updateCfg({ standbyAnimation: anim })}
                      className={`px-2.5 py-1 rounded-lg border capitalize cursor-pointer ${
                        avatarConfig.standbyAnimation === anim
                          ? "bg-cyan-500 text-slate-950 font-bold border-cyan-300"
                          : "bg-slate-950 text-slate-400 border-slate-700"
                      }`}
                    >
                      {anim}
                    </button>
                  )
                )}
              </div>
            </div>

            {avatarConfig.useElevenLabs && (
              <select
                value={avatarConfig.elevenLabsVoiceId}
                onChange={(e) =>
                  updateCfg({ elevenLabsVoiceId: e.target.value })
                }
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-slate-100"
              >
                {ELEVENLABS_VOICE_PRESETS.filter((v) => v.gender === "female").map(
                  (v) => (
                    <option key={v.id} value={v.id}>
                      {v.name} — {v.style}
                    </option>
                  )
                )}
              </select>
            )}
          </div>

          {/* Direct Voice / Text Girlfriend & Body Command Console */}
          <form
            onSubmit={handleSendCommand}
            className="p-3.5 rounded-2xl bg-slate-900/95 border border-cyan-400/40 flex items-center gap-2"
          >
            <button
              type="button"
              onClick={handleToggleVoiceCommandMic}
              className="p-2.5 rounded-xl bg-rose-500/20 hover:bg-rose-500 border border-rose-400 text-rose-300 hover:text-slate-950 transition cursor-pointer"
              title="Bolein (Voice Command in Pakistani Urdu / English)"
            >
              {isListening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
            </button>
            <input
              type="text"
              value={commandInput}
              onChange={(e) => setCommandInput(e.target.value)}
              placeholder="Bolo Jaan: 'dance karo', 'haath hilao', 'flying kiss do', ya pyaar se baat karo..."
              className="flex-1 px-3 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-slate-100 text-xs md:text-sm font-mono focus:outline-none focus:border-cyan-400"
            />
            <button
              type="submit"
              disabled={isTalkingLoading || !commandInput.trim()}
              className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-rose-500 text-slate-950 font-bold text-xs font-mono flex items-center gap-1.5 cursor-pointer disabled:opacity-40"
            >
              <Send className="w-4 h-4" />
              <span>COMMAND</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );

  if (embedded) return content;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 md:p-5 bg-black/90">
      <div className="w-full max-w-6xl h-[92vh] bg-[#02050f] border border-cyan-400/50 rounded-3xl shadow-[0_0_80px_rgba(0,245,255,0.28)] overflow-hidden flex flex-col">
        {content}
      </div>
    </div>
  );
};
