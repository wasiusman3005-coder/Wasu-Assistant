import React, { useState, useRef } from "react";
import { Sparkles, Mic, Maximize2, Minimize2, X, Zap, Heart } from "lucide-react";
import { AvatarBodyMovement, AvatarStudioConfig } from "../types";
import { PERSONALITY_MODES } from "../data/jarvisCatalog";
import { CyberGirlFullBodyAvatar } from "./CyberGirlFullBodyAvatar";
import { soundEffects } from "../services/soundEffects";

interface FloatingAvatarWidgetProps {
  avatarConfig: AvatarStudioConfig;
  isSpeaking: boolean;
  isListening: boolean;
  bodyMovement: AvatarBodyMovement;
  onTriggerBodyMovement: (move: AvatarBodyMovement) => void;
  onOpenHumanoidStage: () => void;
  onOpenVoiceModal: () => void;
  onHideFloating: () => void;
}

export const FloatingAvatarWidget: React.FC<FloatingAvatarWidgetProps> = ({
  avatarConfig,
  isSpeaking,
  isListening,
  bodyMovement,
  onTriggerBodyMovement,
  onOpenHumanoidStage,
  onOpenVoiceModal,
  onHideFloating,
}) => {
  const [pos, setPos] = useState({ x: 20, y: 88 });
  const [isMinimized, setIsMinimized] = useState(false);
  const draggingRef = useRef<{ active: boolean; offsetX: number; offsetY: number }>({
    active: false,
    offsetX: 0,
    offsetY: 0,
  });

  if (!avatarConfig.floatingAvatarEnabled) return null;

  const personality =
    PERSONALITY_MODES.find((p) => p.id === avatarConfig.personalityId) || PERSONALITY_MODES[0];

  const handlePointerDown = (e: React.PointerEvent) => {
    if ((e.target as HTMLElement).closest("button")) return;
    draggingRef.current = {
      active: true,
      offsetX: e.clientX - pos.x,
      offsetY: e.clientY - pos.y,
    };
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!draggingRef.current.active) return;
    const maxX = Math.max(20, window.innerWidth - 180);
    const maxY = Math.max(20, window.innerHeight - 250);
    setPos({
      x: Math.min(maxX, Math.max(8, e.clientX - draggingRef.current.offsetX)),
      y: Math.min(maxY, Math.max(8, e.clientY - draggingRef.current.offsetY)),
    });
  };

  const handlePointerUp = () => {
    draggingRef.current.active = false;
  };

  return (
    <div
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      style={{ left: `${pos.x}px`, top: `${pos.y}px` }}
      className="fixed z-40 select-none cursor-grab active:cursor-grabbing touch-none"
    >
      <div className="rounded-2xl bg-slate-950/92 border border-cyan-400/55 backdrop-blur-2xl shadow-[0_0_32px_rgba(6,182,212,0.45)] p-2.5 flex flex-col items-center gap-1.5 w-44">
        {/* Top Floating Bar */}
        <div className="w-full flex items-center justify-between text-[9px] font-mono text-cyan-300 px-1">
          <span className="truncate font-bold flex items-center gap-1">
            <span>{personality.emoji}</span>
            <span>ZOYA • FULL BODY</span>
          </span>
          <div className="flex items-center gap-0.5">
            <button
              type="button"
              onClick={() => setIsMinimized(!isMinimized)}
              className="p-0.5 rounded hover:bg-slate-800 text-slate-400 hover:text-white cursor-pointer"
              title={isMinimized ? "Expand Full-Body Girl" : "Minimize"}
            >
              {isMinimized ? <Maximize2 className="w-3 h-3" /> : <Minimize2 className="w-3 h-3" />}
            </button>
            <button
              type="button"
              onClick={onHideFloating}
              className="p-0.5 rounded hover:bg-slate-800 text-slate-400 hover:text-rose-400 cursor-pointer"
              title="Hide Floating Avatar"
            >
              <X className="w-3 h-3" />
            </button>
          </div>
        </div>

        {/* Full-Body Single Cyber Girl Avatar Stage */}
        {!isMinimized && (
          <>
            <div
              onClick={() => {
                soundEffects.playBeepConfirm();
                onOpenHumanoidStage();
              }}
              className="cursor-pointer flex items-center justify-center py-0.5"
              title="Click to open Full-Body UHD Girlfriend Stage"
            >
              <CyberGirlFullBodyAvatar
                isSpeaking={isSpeaking}
                isListening={isListening}
                bodyMovement={bodyMovement}
                standbyAnimation={avatarConfig.standbyAnimation}
                personalityName={personality.name}
                size="sm"
              />
            </div>

            {/* Quick Movement & Talk Controls */}
            <div className="w-full grid grid-cols-3 gap-1 pt-0.5">
              <button
                type="button"
                onClick={() => {
                  soundEffects.playClick();
                  onTriggerBodyMovement(bodyMovement === "wave" ? "dance" : bodyMovement === "dance" ? "heart" : "wave");
                }}
                className="p-1.5 rounded-xl bg-slate-900 hover:bg-rose-950 border border-slate-700 hover:border-rose-400 text-rose-300 flex items-center justify-center cursor-pointer"
                title="Animate Body Move (Wave / Dance / Kiss)"
              >
                <Heart className="w-3 h-3" />
              </button>
              <button
                type="button"
                onClick={() => {
                  soundEffects.playClick();
                  onOpenVoiceModal();
                }}
                className="p-1.5 rounded-xl bg-cyan-500/20 hover:bg-cyan-500 border border-cyan-400 text-cyan-300 hover:text-slate-950 flex items-center justify-center cursor-pointer"
                title="Talk to Zoya (Pakistani Urdu Girlfriend)"
              >
                <Mic className="w-3 h-3" />
              </button>
              <button
                type="button"
                onClick={() => {
                  soundEffects.playBeepConfirm();
                  onOpenHumanoidStage();
                }}
                className="p-1.5 rounded-xl bg-slate-900 hover:bg-cyan-950 border border-slate-700 hover:border-cyan-400 text-cyan-300 flex items-center justify-center cursor-pointer"
                title="Open UHD Full-Body Stage"
              >
                <Sparkles className="w-3 h-3" />
              </button>
            </div>
          </>
        )}

        <div className="text-[8px] font-mono text-emerald-300 flex items-center gap-0.5">
          <Zap className="w-2.5 h-2.5" />
          <span>PAK URDU • DRAG ME</span>
        </div>
      </div>
    </div>
  );
};
