import React, { useEffect, useState } from "react";
import {
  AVATAR_PRESETS_100,
  OUTFIT_CATALOG,
  HAIRSTYLE_CATALOG,
} from "../data/avatarCatalog";
import { StandbyAnimationType } from "../types";

interface AvatarRenderer2DProps {
  avatarIndex: number;
  outfitIndex: number;
  hairstyleIndex: number;
  hairColor: string;
  accessories: string[];
  standbyAnimation?: StandbyAnimationType;
  isSpeaking?: boolean;
  isListening?: boolean;
  outfitChangingBurst?: boolean;
  size?: "sm" | "md" | "lg";
}

export const AvatarRenderer2D: React.FC<AvatarRenderer2DProps> = ({
  avatarIndex,
  outfitIndex,
  hairstyleIndex,
  hairColor,
  accessories,
  standbyAnimation = "breathe",
  isSpeaking = false,
  isListening = false,
  outfitChangingBurst = false,
  size = "lg",
}) => {
  const avatar = AVATAR_PRESETS_100[avatarIndex % AVATAR_PRESETS_100.length];
  const outfit = OUTFIT_CATALOG[outfitIndex % OUTFIT_CATALOG.length];
  const hair = HAIRSTYLE_CATALOG[hairstyleIndex % HAIRSTYLE_CATALOG.length];

  const [isBlinking, setIsBlinking] = useState(false);
  const [mouthFrame, setMouthFrame] = useState(0);

  // Natural eye blink timer
  useEffect(() => {
    const blinkLoop = setInterval(() => {
      setIsBlinking(true);
      setTimeout(() => setIsBlinking(false), 150);
    }, 3400);
    return () => clearInterval(blinkLoop);
  }, []);

  // Multi-viseme speech lip-sync when talking
  useEffect(() => {
    if (!isSpeaking) {
      setMouthFrame(0);
      return;
    }
    const talkLoop = setInterval(() => {
      setMouthFrame((prev) => (prev + 1 + Math.floor(Math.random() * 2)) % 4);
    }, 110);
    return () => clearInterval(talkLoop);
  }, [isSpeaking]);

  const effectiveHairColor = hairColor || avatar.defaultHairColor;

  const standbyClass =
    standbyAnimation === "float"
      ? "animate-[bounce_4s_ease-in-out_infinite]"
      : standbyAnimation === "pulse"
      ? "animate-pulse"
      : standbyAnimation === "sway"
      ? "animate-[pulse_3.2s_ease-in-out_infinite]"
      : "transition-transform duration-700";

  const sizeClass =
    size === "sm" ? "w-24 h-28" : size === "md" ? "w-44 h-52" : "w-64 h-72 md:w-72 md:h-80";

  const hasAcc = (id: string) => accessories.includes(id);

  return (
    <div className={`relative flex items-center justify-center select-none ${sizeClass}`}>
      {/* Back Energy Aura Accessories */}
      {hasAcc("quantum_aura") && (
        <div
          className="absolute inset-2 rounded-full blur-2xl opacity-50 animate-pulse pointer-events-none"
          style={{ background: `radial-gradient(circle, ${avatar.auraColor}, transparent 70%)` }}
        />
      )}
      {hasAcc("rose_petals") && (
        <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-full">
          <span className="absolute top-3 left-5 text-rose-400 text-xs animate-ping">🌸</span>
          <span className="absolute bottom-6 right-5 text-pink-400 text-xs animate-bounce">✿</span>
        </div>
      )}
      {hasAcc("star_orbit") && (
        <div className="absolute inset-1 rounded-full border border-amber-300/40 border-dashed animate-spin pointer-events-none" style={{ animationDuration: "9s" }} />
      )}

      {/* Holographic Outfit Change Burst Animation */}
      {outfitChangingBurst && (
        <div className="absolute inset-0 z-30 pointer-events-none flex items-center justify-center">
          <div className="w-full h-full rounded-full border-4 border-cyan-300 animate-ping opacity-80" />
          <div className="absolute inset-x-0 h-1.5 bg-gradient-to-r from-transparent via-cyan-300 to-transparent shadow-[0_0_20px_#00f5ff] animate-bounce" />
        </div>
      )}

      {/* Layered High-Detail SVG Character */}
      <svg
        viewBox="0 0 240 280"
        className={`w-full h-full drop-shadow-[0_12px_25px_rgba(0,0,0,0.75)] ${standbyClass}`}
      >
        <defs>
          <linearGradient id={`bgGrad-${avatar.id}`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={avatar.auraColor} stopOpacity="0.22" />
            <stop offset="100%" stopColor={outfit.secondaryColor} stopOpacity="0.1" />
          </linearGradient>
          <linearGradient id={`hairGrad-${avatar.id}`} x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor={effectiveHairColor} />
            <stop offset="100%" stopColor={hair.accentStreak ? avatar.auraColor : effectiveHairColor} stopOpacity="0.92" />
          </linearGradient>
        </defs>

        {/* Ambient Halo Ring */}
        <circle cx="120" cy="135" r="105" fill={`url(#bgGrad-${avatar.id})`} />
        <circle
          cx="120"
          cy="135"
          r="98"
          fill="none"
          stroke={isSpeaking ? "#22d3ee" : isListening ? "#f59e0b" : avatar.auraColor}
          strokeOpacity={isSpeaking ? "0.85" : "0.35"}
          strokeWidth={isSpeaking ? "2.5" : "1.2"}
          strokeDasharray="8 6"
        />

        {/* BACK ACCESSORIES: Wings / Shoulder Drones */}
        {hasAcc("angel_wings") && (
          <g fill="#e0f2fe" fillOpacity="0.72" stroke="#38bdf8" strokeWidth="1.5">
            <path d="M 70 160 Q 15 110 22 65 Q 52 95 76 135 Z" />
            <path d="M 170 160 Q 225 110 218 65 Q 188 95 164 135 Z" />
          </g>
        )}
        {hasAcc("cyber_wings") && (
          <g fill="#06b6d4" fillOpacity="0.55" stroke="#22d3ee" strokeWidth="2">
            <polygon points="72,155 18,98 30,85 82,135" />
            <polygon points="68,175 12,145 25,132 76,158" />
            <polygon points="168,155 222,98 210,85 158,135" />
            <polygon points="172,175 228,145 215,132 164,158" />
          </g>
        )}
        {hasAcc("demon_wings") && (
          <g fill="#be123c" fillOpacity="0.75" stroke="#fb7185" strokeWidth="1.5">
            <path d="M 72 160 L 18 88 L 48 112 L 32 142 L 75 170 Z" />
            <path d="M 168 160 L 222 88 L 192 112 L 208 142 L 165 170 Z" />
          </g>
        )}
        {hasAcc("shoulder_drones") && (
          <g>
            <circle cx="38" cy="128" r="9" fill="#0f172a" stroke="#a855f7" strokeWidth="2" />
            <circle cx="38" cy="128" r="3" fill="#22d3ee" />
            <circle cx="202" cy="128" r="9" fill="#0f172a" stroke="#a855f7" strokeWidth="2" />
            <circle cx="202" cy="128" r="3" fill="#22d3ee" />
          </g>
        )}

        {/* BACK HAIR LAYER (56 Hairstyles) */}
        {(hair.backShape === "long_wave" || hair.backShape === "long_straight") && (
          <path
            d={
              hair.backShape === "long_wave"
                ? "M 64 95 Q 50 155 58 215 Q 120 232 182 215 Q 190 155 176 95 Q 150 45 120 45 Q 90 45 64 95 Z"
                : "M 68 92 L 58 218 L 182 218 L 172 92 Q 150 46 120 46 Q 90 46 68 92 Z"
            }
            fill={`url(#hairGrad-${avatar.id})`}
          />
        )}
        {hair.backShape === "twintails" && (
          <g fill={`url(#hairGrad-${avatar.id})`}>
            <path d="M 66 86 Q 32 120 26 205 Q 48 215 62 160 Z" />
            <path d="M 174 86 Q 208 120 214 205 Q 192 215 178 160 Z" />
            <circle cx="120" cy="96" r="54" />
          </g>
        )}
        {hair.backShape === "high_ponytail" && (
          <g fill={`url(#hairGrad-${avatar.id})`}>
            <path d="M 135 55 Q 188 50 198 165 Q 172 175 162 105 Z" />
            <circle cx="120" cy="96" r="53" />
          </g>
        )}
        {hair.backShape === "buns" && (
          <g fill={`url(#hairGrad-${avatar.id})`}>
            <circle cx="72" cy="60" r="22" />
            <circle cx="168" cy="60" r="22" />
            <circle cx="120" cy="98" r="52" />
          </g>
        )}
        {hair.backShape === "afro_puff" && (
          <g fill={`url(#hairGrad-${avatar.id})`}>
            <circle cx="76" cy="82" r="32" />
            <circle cx="164" cy="82" r="32" />
            <circle cx="120" cy="68" r="44" />
          </g>
        )}
        {hair.backShape === "bob" && (
          <path d="M 65 92 Q 58 148 72 162 L 168 162 Q 182 148 175 92 Q 152 46 120 46 Q 88 46 65 92 Z" fill={`url(#hairGrad-${avatar.id})`} />
        )}
        {hair.backShape === "braids" && (
          <g fill={`url(#hairGrad-${avatar.id})`}>
            <circle cx="120" cy="94" r="52" />
            <rect x="64" y="128" width="14" height="82" rx="7" />
            <rect x="162" y="128" width="14" height="82" rx="7" />
          </g>
        )}
        {(hair.backShape === "pixie" || hair.backShape === "spiky") && (
          <g fill={`url(#hairGrad-${avatar.id})`}>
            <circle cx="120" cy="94" r="52" />
            {hair.backShape === "spiky" && (
              <polygon points="75,65 88,30 105,52 122,22 140,52 162,32 168,68" />
            )}
          </g>
        )}

        {/* TORSO & OUTFIT SILHOUETTE (108+ Outfits) */}
        <g>
          {/* Base outfit torso */}
          <path
            d={
              outfit.silhouette === "dress"
                ? "M 64 268 L 78 186 Q 120 174 162 186 L 176 268 Z"
                : outfit.silhouette === "armor"
                ? "M 50 268 L 62 178 L 95 168 L 120 176 L 145 168 L 178 178 L 190 268 Z"
                : outfit.silhouette === "kurta"
                ? "M 60 268 L 70 176 Q 120 166 170 176 L 180 268 Z"
                : "M 56 268 L 68 178 Q 120 168 172 178 L 184 268 Z"
            }
            fill={outfit.primaryColor}
            stroke={outfit.trimColor}
            strokeWidth="2.2"
          />

          {/* Outfit trim & signature details */}
          {outfit.silhouette === "jacket" || outfit.silhouette === "trench" ? (
            <>
              <path d="M 88 176 L 114 266 L 126 266 L 152 176 Z" fill={outfit.secondaryColor} />
              <line x1="88" y1="176" x2="104" y2="266" stroke={outfit.trimColor} strokeWidth="2.5" />
              <line x1="152" y1="176" x2="136" y2="266" stroke={outfit.trimColor} strokeWidth="2.5" />
            </>
          ) : outfit.silhouette === "armor" ? (
            <>
              <polygon points="102,190 138,190 130,225 110,225" fill={outfit.secondaryColor} stroke={outfit.trimColor} strokeWidth="2" />
              <circle cx="120" cy="206" r="9" fill={outfit.trimColor} />
              <circle cx="120" cy="206" r="4" fill="#ffffff" />
            </>
          ) : outfit.silhouette === "hoodie" ? (
            <>
              <path d="M 84 176 Q 120 202 156 176" fill="none" stroke={outfit.trimColor} strokeWidth="5" />
              <line x1="108" y1="194" x2="108" y2="225" stroke="#ffffff" strokeWidth="2.2" />
              <line x1="132" y1="194" x2="132" y2="225" stroke="#ffffff" strokeWidth="2.2" />
            </>
          ) : outfit.silhouette === "kurta" ? (
            <>
              <rect x="115" y="182" width="10" height="58" rx="4" fill={outfit.secondaryColor} stroke={outfit.trimColor} strokeWidth="1.5" />
              <path d="M 74 266 L 96 178" stroke={outfit.trimColor} strokeWidth="3" strokeOpacity="0.65" />
            </>
          ) : (
            <path d="M 90 180 L 120 220 L 150 180" fill="none" stroke={outfit.trimColor} strokeWidth="3" />
          )}
        </g>

        {/* NECK & NECKLACE ACCESSORIES */}
        <rect x="108" y="150" width="24" height="34" rx="8" fill={avatar.skinShadow} />
        {hasAcc("velvet_choker") && (
          <g>
            <rect x="106" y="162" width="28" height="7" rx="3" fill="#0f172a" stroke="#a855f7" strokeWidth="1.4" />
            <circle cx="120" cy="165.5" r="2.8" fill="#fde047" />
          </g>
        )}
        {hasAcc("arc_pendant") && (
          <g>
            <path d="M 104 178 Q 120 198 136 178" fill="none" stroke="#94a3b8" strokeWidth="1.5" />
            <circle cx="120" cy="192" r="6" fill="#0f172a" stroke="#38bdf8" strokeWidth="2" />
            <circle cx="120" cy="192" r="2.5" fill="#e0f2fe" />
          </g>
        )}

        {/* EARS & EAR ACCESSORIES */}
        <ellipse cx="75" cy="116" rx="7" ry="12" fill={avatar.skinShadow} />
        <ellipse cx="165" cy="116" rx="7" ry="12" fill={avatar.skinShadow} />
        {hasAcc("gold_jhumka") && (
          <g fill="#fbbf24" stroke="#f59e0b" strokeWidth="1">
            <circle cx="74" cy="130" r="4" />
            <polygon points="69,134 79,134 81,142 67,142" />
            <circle cx="166" cy="130" r="4" />
            <polygon points="161,134 171,134 173,142 159,142" />
          </g>
        )}
        {hasAcc("neon_drops") && (
          <g fill="#00f5ff">
            <polygon points="74,126 70,136 74,145 78,136" />
            <polygon points="166,126 162,136 166,145 170,136" />
          </g>
        )}
        {hasAcc("tactical_mic") && (
          <g>
            <rect x="163" y="108" width="6" height="16" rx="3" fill="#0f172a" stroke="#10b981" strokeWidth="1.5" />
            <path d="M 164 122 Q 152 142 132 144" fill="none" stroke="#334155" strokeWidth="2.5" />
            <circle cx="131" cy="144" r="3" fill="#10b981" />
          </g>
        )}

        {/* HEAD / FACE SILHOUETTE */}
        <path
          d={
            avatar.faceShape === "square"
              ? "M 78 88 Q 78 60 120 60 Q 162 60 162 88 L 160 132 Q 155 158 120 162 Q 85 158 80 132 Z"
              : avatar.faceShape === "heart"
              ? "M 77 92 Q 78 58 120 58 Q 162 58 163 92 Q 160 138 120 162 Q 80 138 77 92 Z"
              : "M 78 96 Q 78 58 120 58 Q 162 58 162 96 Q 162 144 120 161 Q 78 144 78 96 Z"
          }
          fill={avatar.skinTone}
        />

        {/* CHEEK MARKS (blush / cyber / freckles / star / hud) */}
        {avatar.cheekMark === "blush" && (
          <g fill="#fb7185" fillOpacity="0.34">
            <ellipse cx="92" cy="128" rx="9" ry="5" />
            <ellipse cx="148" cy="128" rx="9" ry="5" />
          </g>
        )}
        {avatar.cheekMark === "cyber_lines" && (
          <g stroke={avatar.eyeColor} strokeWidth="1.6" strokeOpacity="0.75">
            <line x1="85" y1="126" x2="96" y2="128" />
            <line x1="85" y1="131" x2="94" y2="133" />
            <line x1="155" y1="126" x2="144" y2="128" />
            <line x1="155" y1="131" x2="146" y2="133" />
          </g>
        )}
        {avatar.cheekMark === "hud_dot" && (
          <g fill={avatar.eyeColor}>
            <circle cx="90" cy="128" r="2" />
            <circle cx="150" cy="128" r="2" />
          </g>
        )}

        {/* EXPRESSIVE EYES + BLINK */}
        {isBlinking ? (
          <g stroke="#1e293b" strokeWidth="2.8" strokeLinecap="round" fill="none">
            <path d="M 90 112 Q 100 117 110 112" />
            <path d="M 130 112 Q 140 117 150 112" />
          </g>
        ) : (
          <g>
            {/* Left & Right Sclera */}
            <ellipse cx="100" cy="112" rx="10" ry={avatar.eyeShape === "wide" ? "8" : "6.5"} fill="#ffffff" />
            <ellipse cx="140" cy="112" rx="10" ry={avatar.eyeShape === "wide" ? "8" : "6.5"} fill="#ffffff" />
            {/* Irises */}
            <circle cx="100" cy="112" r="5.5" fill={avatar.eyeColor} />
            <circle cx="140" cy="112" r="5.5" fill={avatar.eyeColor} />
            {/* Pupils */}
            <circle cx="100" cy="112" r="2.6" fill="#0f172a" />
            <circle cx="140" cy="112" r="2.6" fill="#0f172a" />
            {/* Eye Specular Sparkle */}
            <circle cx="98" cy="110" r="1.7" fill="#ffffff" />
            <circle cx="138" cy="110" r="1.7" fill="#ffffff" />
            {/* Eyelashes / Brows */}
            <path d="M 88 107 Q 100 102 111 107" fill="none" stroke="#0f172a" strokeWidth="2.2" />
            <path d="M 129 107 Q 140 102 152 107" fill="none" stroke="#0f172a" strokeWidth="2.2" />
          </g>
        )}

        {/* Eyebrows */}
        <path d="M 88 99 Q 100 94 111 98" fill="none" stroke={effectiveHairColor} strokeWidth="2.5" strokeLinecap="round" />
        <path d="M 129 98 Q 140 94 152 99" fill="none" stroke={effectiveHairColor} strokeWidth="2.5" strokeLinecap="round" />

        {/* Subtle Nose */}
        <path d="M 120 116 L 118 127 Q 120 130 123 128" fill="none" stroke={avatar.skinShadow} strokeWidth="1.8" strokeLinecap="round" />

        {/* MOUTH WITH LIVE LIP-SYNC */}
        {!isSpeaking || mouthFrame === 0 ? (
          <path
            d="M 110 140 Q 120 146 130 140"
            fill="none"
            stroke={avatar.lipColor}
            strokeWidth="3"
            strokeLinecap="round"
          />
        ) : mouthFrame === 1 ? (
          <ellipse cx="120" cy="142" rx="8" ry="3.5" fill="#7f1d1d" stroke={avatar.lipColor} strokeWidth="2" />
        ) : mouthFrame === 2 ? (
          <ellipse cx="120" cy="143" rx="7" ry="6" fill="#7f1d1d" stroke={avatar.lipColor} strokeWidth="2" />
        ) : (
          <path d="M 109 140 Q 120 150 131 140 Z" fill="#ffffff" stroke={avatar.lipColor} strokeWidth="2" />
        )}

        {/* EYEWEAR ACCESSORIES */}
        {hasAcc("ar_visor") && (
          <g>
            <rect x="82" y="102" width="76" height="20" rx="6" fill="#00f5ff" fillOpacity="0.24" stroke="#00f5ff" strokeWidth="2" />
            <line x1="88" y1="112" x2="104" y2="112" stroke="#ffffff" strokeOpacity="0.7" strokeWidth="1.2" />
          </g>
        )}
        {hasAcc("round_glasses") && (
          <g fill="none" stroke="#fbbf24" strokeWidth="2">
            <circle cx="100" cy="112" r="13" />
            <circle cx="140" cy="112" r="13" />
            <line x1="113" y1="112" x2="127" y2="112" />
          </g>
        )}
        {hasAcc("sunglasses") && (
          <g fill="#020617" fillOpacity="0.88" stroke="#94a3b8" strokeWidth="1.8">
            <rect x="85" y="104" width="28" height="16" rx="4" />
            <rect x="127" y="104" width="28" height="16" rx="4" />
            <line x1="113" y1="109" x2="127" y2="109" />
          </g>
        )}
        {hasAcc("monocle_hud") && (
          <g>
            <circle cx="140" cy="112" r="14" fill="#22d3ee" fillOpacity="0.2" stroke="#22d3ee" strokeWidth="2" strokeDasharray="4 2" />
          </g>
        )}

        {/* FRONT HAIR / BANGS LAYER */}
        <path
          d={
            hair.bangsShape === "blunt"
              ? "M 74 96 Q 76 50 120 50 Q 164 50 166 96 Q 145 84 120 86 Q 95 84 74 96 Z"
              : hair.bangsShape === "side_sweep"
              ? "M 74 98 Q 76 50 120 50 Q 166 50 166 102 Q 130 68 74 98 Z"
              : hair.bangsShape === "mohawk"
              ? "M 102 68 L 120 28 L 138 68 Q 120 82 102 68 Z"
              : "M 74 102 Q 76 50 120 50 Q 164 50 166 102 Q 146 72 124 88 Q 120 68 116 88 Q 94 72 74 102 Z"
          }
          fill={`url(#hairGrad-${avatar.id})`}
        />

        {/* HEADWEAR ACCESSORIES */}
        {hasAcc("cat_headset") && (
          <g stroke="#ec4899" strokeWidth="2">
            <path d="M 72 105 Q 72 44 120 44 Q 168 44 168 105" fill="none" strokeWidth="4" />
            <polygon points="75,65 82,36 98,54" fill="#0f172a" />
            <polygon points="165,65 158,36 142,54" fill="#0f172a" />
            <rect x="66" y="100" width="10" height="22" rx="4" fill="#0f172a" />
            <rect x="164" y="100" width="10" height="22" rx="4" fill="#0f172a" />
          </g>
        )}
        {hasAcc("queen_tiara") && (
          <polygon
            points="92,58 100,38 112,50 120,30 128,50 140,38 148,58"
            fill="#fbbf24"
            stroke="#fef08a"
            strokeWidth="1.5"
          />
        )}
        {hasAcc("quantum_halo") && (
          <ellipse cx="120" cy="36" rx="34" ry="8" fill="none" stroke="#00f5ff" strokeWidth="3.5" />
        )}
        {hasAcc("bunny_ears") && (
          <g fill="#f472b6" stroke="#fbcfe8" strokeWidth="1.5">
            <ellipse cx="96" cy="35" rx="8" ry="22" transform="rotate(-12 96 35)" />
            <ellipse cx="144" cy="35" rx="8" ry="22" transform="rotate(12 144 35)" />
          </g>
        )}
        {hasAcc("cyber_horns") && (
          <g fill="#f43f5e" stroke="#fda4af" strokeWidth="1.5">
            <path d="M 88 64 Q 68 42 74 26 Q 88 42 98 58 Z" />
            <path d="M 152 64 Q 172 42 166 26 Q 152 42 142 58 Z" />
          </g>
        )}
        {hasAcc("flower_crown") && (
          <g>
            <circle cx="92" cy="58" r="7" fill="#34d399" />
            <circle cx="110" cy="53" r="8" fill="#fb7185" />
            <circle cx="130" cy="53" r="8" fill="#fde047" />
            <circle cx="148" cy="58" r="7" fill="#38bdf8" />
          </g>
        )}
        {hasAcc("beret") && (
          <ellipse cx="116" cy="52" rx="44" ry="15" transform="rotate(-10 116 52)" fill="#dc2626" stroke="#fca5a5" strokeWidth="1.5" />
        )}
        {hasAcc("fox_mask") && (
          <g transform="translate(132,36) rotate(18)">
            <polygon points="0,12 12,0 24,12 18,30 6,30" fill="#f8fafc" stroke="#f43f5e" strokeWidth="1.5" />
            <line x1="6" y1="16" x2="10" y2="16" stroke="#f43f5e" strokeWidth="2" />
            <line x1="14" y1="16" x2="18" y2="16" stroke="#f43f5e" strokeWidth="2" />
          </g>
        )}
      </svg>
    </div>
  );
};
