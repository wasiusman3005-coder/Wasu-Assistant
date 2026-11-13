import React, { useEffect, useState, useRef } from "react";
import { Heart, Volume2, Radio } from "lucide-react";
import { AvatarBodyMovement, StandbyAnimationType } from "../types";
import zoyaFullBodyPhotoreal from "../assets/images/zoya_fullbody_action_1794547190192.jpg";

export const CYBER_GIRL_PORTRAIT_URL = "/assets/aistudio/images__5__ddc17e2d.jpg";
export const ZOYA_TACTICAL_REF_URL = "/assets/aistudio/images_79a73411.jpg";

interface CyberGirlFullBodyAvatarProps {
  isSpeaking: boolean;
  isListening?: boolean;
  bodyMovement?: AvatarBodyMovement;
  standbyAnimation?: StandbyAnimationType;
  personalityName?: string;
  size?: "sm" | "md" | "lg" | "uhd";
  onClickAvatar?: () => void;
}

interface BodyMotionFrame {
  translateX: number;
  translateY: number;
  rotateX: number;
  rotateY: number;
  rotateZ: number;
  scale: number;
  scaleY: number;
}

const DEFAULT_MOTION: BodyMotionFrame = {
  translateX: 0,
  translateY: 0,
  rotateX: 0,
  rotateY: 0,
  rotateZ: 0,
  scale: 1,
  scaleY: 1,
};

export const CyberGirlFullBodyAvatar: React.FC<CyberGirlFullBodyAvatarProps> = ({
  isSpeaking,
  isListening = false,
  bodyMovement = "idle",
  standbyAnimation = "breathe",
  personalityName = "Zoya (Your Cyber Girlfriend)",
  size = "uhd",
  onClickAvatar,
}) => {
  const [motion, setMotion] = useState<BodyMotionFrame>(DEFAULT_MOTION);
  const [mouthPulse, setMouthPulse] = useState(0);
  const [activeImgSrc, setActiveImgSrc] = useState<string>(zoyaFullBodyPhotoreal);
  const [imgFailed, setImgFailed] = useState(false);

  const rafRef = useRef<number | null>(null);
  const startTimeRef = useRef<number>(performance.now());

  useEffect(() => {
    startTimeRef.current = performance.now();
  }, [bodyMovement]);

  // Real-time speech cadence pulse
  useEffect(() => {
    if (!isSpeaking) {
      setMouthPulse(0);
      return;
    }
    const timer = setInterval(() => {
      setMouthPulse(Math.random() * 0.85 + 0.15);
    }, 80);
    return () => clearInterval(timer);
  }, [isSpeaking]);

  // 60FPS 3D Perspective Full-Body Choreography Engine (Zero-Cartoon Live Photorealistic Motion)
  useEffect(() => {
    const prefersReducedMotion =
      typeof window !== "undefined" &&
      window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

    if (prefersReducedMotion) {
      setMotion(DEFAULT_MOTION);
      return;
    }

    const tick = (now: number) => {
      const t = (now - startTimeRef.current) / 1000;
      const breath = Math.sin(t * 2.1);
      const speakEnergy = isSpeaking ? Math.sin(t * 8.5) : 0;

      const next: BodyMotionFrame = { ...DEFAULT_MOTION };
      next.translateY = standbyAnimation === "float" ? Math.sin(t * 2.5) * 6 : breath * 2.2;
      next.scaleY = 1 + breath * 0.008;
      next.rotateY = Math.sin(t * 0.85) * 3.5;
      next.rotateZ = speakEnergy * 1.1;

      switch (bodyMovement) {
        case "wave": {
          next.rotateZ = -3.5 + Math.sin(t * 6.5) * 4.2;
          next.rotateY = 8 + Math.sin(t * 3.2) * 5;
          next.translateY = -4 + Math.sin(t * 6.5) * 3;
          next.scale = 1.02;
          break;
        }
        case "dance": {
          next.translateX = Math.sin(t * 3.2) * 14;
          next.translateY = -Math.abs(Math.sin(t * 6.4)) * 12;
          next.rotateZ = Math.sin(t * 3.2) * 5.5;
          next.rotateY = Math.cos(t * 3.2) * 14;
          next.scale = 1.02 + Math.sin(t * 6.4) * 0.025;
          break;
        }
        case "walk": {
          const stride = Math.sin(t * 4.8);
          next.translateY = -Math.abs(stride) * 7;
          next.translateX = Math.sin(t * 2.4) * 6;
          next.rotateY = stride * 10;
          next.rotateZ = stride * 2.8;
          next.scale = 1.01 + Math.abs(stride) * 0.02;
          break;
        }
        case "spin": {
          next.rotateY = (t * 165) % 360;
          next.translateY = -4 + Math.sin(t * 3.5) * 3;
          next.scale = 1.02;
          break;
        }
        case "heart": {
          next.scale = 1.045 + Math.sin(t * 3.4) * 0.015;
          next.rotateX = 4;
          next.rotateZ = Math.sin(t * 2.5) * 2.5;
          next.translateY = -3 + breath * 2;
          break;
        }
        case "hug": {
          next.scale = 1.075 + Math.sin(t * 3.2) * 0.02;
          next.translateY = -6 + breath * 2.5;
          next.rotateX = 5;
          break;
        }
        case "salute": {
          next.translateY = -8;
          next.rotateZ = 0;
          next.rotateY = -3;
          next.scale = 1.03;
          break;
        }
        case "sit": {
          next.translateY = 14 + breath * 1.6;
          next.scaleY = 0.94;
          next.rotateX = 7;
          break;
        }
        case "jump": {
          const hop = Math.abs(Math.sin(t * 5.2));
          next.translateY = -hop * 28;
          next.scale = 1 + hop * 0.04;
          next.rotateZ = Math.sin(t * 5.2) * 2.5;
          break;
        }
        case "nod": {
          next.rotateX = Math.sin(t * 9.5) * 6;
          next.translateY = Math.sin(t * 9.5) * 3.5;
          break;
        }
        default: {
          next.translateY += speakEnergy * 1.4;
          break;
        }
      }

      setMotion(next);
      rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [bodyMovement, standbyAnimation, isSpeaking]);

  const frameDimensions =
    size === "sm"
      ? "w-36 h-48"
      : size === "md"
      ? "w-56 h-72"
      : size === "lg"
      ? "w-72 h-[380px]"
      : "w-80 sm:w-[370px] h-[420px] sm:h-[490px]";

  const moveLabelMap: Record<AvatarBodyMovement, string> = {
    idle: "TACTICAL STANDBY",
    wave: "WAVING AT WASI",
    dance: "DANCING GROOVE",
    walk: "TACTICAL STRIDE",
    spin: "360° TURNAROUND",
    heart: "FLYING KISS & LOVE",
    hug: "WARM EMBRACE",
    salute: "COMMANDER SALUTE",
    sit: "TACTICAL CROUCH",
    jump: "THRUSTER LEAP",
    nod: "ATTENTIVE NOD",
  };

  const handleImageError = () => {
    if (activeImgSrc === zoyaFullBodyPhotoreal) {
      setActiveImgSrc(ZOYA_TACTICAL_REF_URL);
    } else if (activeImgSrc === ZOYA_TACTICAL_REF_URL) {
      setActiveImgSrc(CYBER_GIRL_PORTRAIT_URL);
    } else {
      setImgFailed(true);
    }
  };

  return (
    <div
      onClick={onClickAvatar}
      className={`relative flex flex-col items-center justify-end select-none ${frameDimensions} ${
        onClickAvatar ? "cursor-pointer" : ""
      }`}
    >
      {/* Subtle Holographic Studio Rim Light Backdrop */}
      <div
        className={`pointer-events-none absolute inset-x-8 top-6 bottom-12 rounded-full blur-3xl transition-opacity duration-300 ${
          isSpeaking
            ? "bg-cyan-400/25 opacity-100"
            : isListening
            ? "bg-amber-400/20 opacity-90"
            : bodyMovement === "heart" || bodyMovement === "hug"
            ? "bg-rose-400/20 opacity-95"
            : "bg-sky-500/15 opacity-75"
        }`}
      />

      {/* Affectionate Floating Hearts for Girlfriend Heart / Hug Gestures */}
      {(bodyMovement === "heart" || bodyMovement === "hug") && (
        <div className="pointer-events-none absolute inset-0 z-20 overflow-hidden">
          {[0, 1, 2, 3].map((i) => (
            <Heart
              key={i}
              className="absolute w-5 h-5 text-rose-400 fill-rose-500/80 animate-bounce"
              style={{
                left: `${22 + i * 18}%`,
                top: `${14 + (i % 2) * 14}%`,
                animationDelay: `${i * 160}ms`,
              }}
            />
          ))}
        </div>
      )}

      {/* Photorealistic Full-Body Female Humanoid Stage */}
      <div
        className="relative z-10 w-full h-full flex items-end justify-center overflow-visible"
        style={{ perspective: "1200px" }}
      >
        {/* Floor Holographic Pedestal Rings */}
        <div className="pointer-events-none absolute bottom-5 inset-x-6 flex items-center justify-center">
          <div
            className={`w-full h-9 rounded-[100%] border transition-colors duration-300 ${
              isSpeaking
                ? "border-cyan-400/80 bg-cyan-500/15 shadow-[0_0_28px_rgba(34,211,238,0.45)]"
                : bodyMovement === "jump"
                ? "border-cyan-300 bg-cyan-400/25 shadow-[0_0_36px_rgba(34,211,238,0.65)]"
                : "border-cyan-500/45 bg-cyan-950/20 shadow-[0_0_18px_rgba(6,182,212,0.25)]"
            }`}
          />
          <div className="absolute w-3/4 h-5 rounded-[100%] border border-sky-200/35" />
        </div>

        {/* Dynamic Articulated Photorealistic Humanoid Figure */}
        <div
          className="relative w-full h-full flex items-end justify-center will-change-transform"
          style={{
            transformStyle: "preserve-3d",
            transform: `translate3d(${motion.translateX.toFixed(2)}px, ${motion.translateY.toFixed(
              2
            )}px, 0) rotateX(${motion.rotateX.toFixed(2)}deg) rotateY(${motion.rotateY.toFixed(
              2
            )}deg) rotateZ(${motion.rotateZ.toFixed(2)}deg) scale(${motion.scale.toFixed(
              3
            )}, ${(motion.scale * motion.scaleY).toFixed(3)})`,
          }}
        >
          {!imgFailed ? (
            <div className="relative w-full h-full flex items-end justify-center">
              <img
                src={activeImgSrc}
                alt={`${personalityName} — Full-Body Photorealistic Tactical Humanoid`}
                referrerPolicy="no-referrer"
                onError={handleImageError}
                className="w-full h-full object-contain object-bottom rounded-xl mix-blend-lighten select-none"
                style={{
                  imageRendering: "high-quality" as React.CSSProperties["imageRendering"],
                  filter: isSpeaking
                    ? "contrast(1.06) brightness(1.04) drop-shadow(0 0 22px rgba(34,211,238,0.38))"
                    : "contrast(1.04) brightness(1.02) drop-shadow(0 0 14px rgba(56,189,248,0.22))",
                  maskImage:
                    "radial-gradient(ellipse 88% 92% at 50% 48%, black 72%, transparent 100%)",
                  WebkitMaskImage:
                    "radial-gradient(ellipse 88% 92% at 50% 48%, black 72%, transparent 100%)",
                }}
              />

              {/* Subtle Voice Lip Resonance Shimmer Positioned on Face When Speaking */}
              {isSpeaking && activeImgSrc === zoyaFullBodyPhotoreal && (
                <div
                  className="pointer-events-none absolute rounded-full bg-cyan-300/35 blur-[4px]"
                  style={{
                    left: "56%",
                    top: "25.5%",
                    width: `${10 + mouthPulse * 8}px`,
                    height: `${4 + mouthPulse * 4}px`,
                    opacity: 0.25 + mouthPulse * 0.45,
                  }}
                />
              )}
            </div>
          ) : (
            <div className="w-full h-full rounded-xl border border-cyan-500/30 bg-slate-950/80 flex flex-col items-center justify-center p-4 text-center">
              <Radio className="w-8 h-8 text-cyan-400 mb-2" />
              <span className="text-xs font-mono text-cyan-200">{personalityName}</span>
            </div>
          )}
        </div>
      </div>

      {/* Bottom Clean Telemetry Status Strip */}
      <div className="relative z-20 -mt-3 flex items-center gap-2 px-3 py-1 rounded-md bg-slate-950/90 border border-cyan-500/40 shadow-lg pointer-events-none">
        {isSpeaking ? (
          <>
            <div className="flex items-end gap-0.5 h-3.5">
              {[0.45, 0.9, 0.7, 1, 0.6, 0.85, 0.5].map((m, i) => (
                <span
                  key={i}
                  className="w-0.5 rounded-sm bg-cyan-300 transition-all duration-75"
                  style={{ height: `${Math.max(3, Math.round(mouthPulse * m * 14))}px` }}
                />
              ))}
            </div>
            <Volume2 className="w-3.5 h-3.5 text-cyan-300" />
            <span className="text-[10px] font-mono font-semibold text-cyan-200 whitespace-nowrap">
              {size === "sm" ? "Talking" : "Zoya Speaking"}
            </span>
          </>
        ) : (
          <>
            <Radio className="w-3 h-3 text-emerald-400 shrink-0" />
            <span className="text-[10px] font-mono font-semibold text-cyan-100 whitespace-nowrap">
              {moveLabelMap[bodyMovement]}
            </span>
          </>
        )}
      </div>
    </div>
  );
};
