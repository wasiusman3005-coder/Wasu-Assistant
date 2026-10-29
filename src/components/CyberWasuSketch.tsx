import React, { useState } from 'react';
import { Sparkles, Zap, Heart, Eye } from 'lucide-react';
import { playHeartbeatBeep, playCyberChime } from '../services/speechService';

interface CyberWasuSketchProps {
  isSpeaking: boolean;
  isListening: boolean;
  isWakeWordActive: boolean;
  mood: string;
  onSketchClick?: () => void;
}

export const CyberWasuSketch: React.FC<CyberWasuSketchProps> = ({
  isSpeaking,
  isListening,
  isWakeWordActive,
  mood,
  onSketchClick,
}) => {
  const [isWinking, setIsWinking] = useState(false);

  const handleClick = () => {
    setIsWinking(true);
    playHeartbeatBeep();
    playCyberChime('success');
    setTimeout(() => setIsWinking(false), 900);
    onSketchClick?.();
  };

  return (
    <div className="relative flex flex-col items-center select-none py-2">
      {/* Outer Cyber Reticle & Hologram Projection Frame */}
      <div className="relative w-56 h-56 flex items-center justify-center">
        {/* Cyberpunk rotating outer HUD ring */}
        <div
          className={`absolute inset-0 rounded-full border border-dashed transition-all duration-1000 ${
            isSpeaking
              ? 'border-cyan-400 shadow-[0_0_20px_#00f5d4] animate-[spin_6s_linear_infinite]'
              : isListening
              ? 'border-rose-400 shadow-[0_0_20px_#f43f5e] animate-[spin_10s_linear_infinite]'
              : 'border-rose-500/30 animate-[spin_25s_linear_infinite]'
          }`}
        />

        {/* Cyber Crosshair Brackets */}
        <div className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-cyan-400" />
        <div className="absolute top-0 right-0 w-3 h-3 border-t-2 border-r-2 border-cyan-400" />
        <div className="absolute bottom-0 left-0 w-3 h-3 border-b-2 border-l-2 border-cyan-400" />
        <div className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 border-cyan-400" />

        {/* Holographic Scanline Overlay */}
        <div className="absolute inset-2 rounded-full overflow-hidden pointer-events-none opacity-40">
          <div className="w-full h-1 bg-gradient-to-r from-transparent via-cyan-400/80 to-transparent animate-[bounce_3s_ease-in-out_infinite]" />
        </div>

        {/* Central Cybernetic Avatar Sketch Container */}
        <div
          onClick={handleClick}
          title="Click to interact with Wasu Love Cyber Sketch"
          className="relative z-10 w-44 h-44 rounded-full bg-gradient-to-b from-slate-950 via-[#100918] to-black border-2 border-rose-500/50 shadow-2xl shadow-rose-950/80 flex items-center justify-center cursor-pointer hover:border-cyan-400 hover:shadow-[0_0_25px_rgba(0,245,212,0.4)] transition-all group overflow-hidden"
        >
          {/* Cybernetic Geometric Portrait Sketch SVG */}
          <svg
            viewBox="0 0 200 200"
            className="w-36 h-36 drop-shadow-[0_0_12px_rgba(244,63,94,0.6)]"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* Background cyber grid lines */}
            <path d="M20 100 H180" stroke="#f43f5e" strokeWidth="0.5" strokeOpacity="0.3" strokeDasharray="2 3" />
            <path d="M100 20 V180" stroke="#00f5d4" strokeWidth="0.5" strokeOpacity="0.3" strokeDasharray="2 3" />
            <circle cx="100" cy="100" r="75" stroke="#f43f5e" strokeWidth="0.8" strokeOpacity="0.4" />

            {/* Futuristic Headpiece / Neural Crown */}
            <path
              d="M70 42 C85 32, 115 32, 130 42 L138 52 L125 56 L75 56 L62 52 Z"
              fill="#f43f5e"
              fillOpacity="0.25"
              stroke="#fb7185"
              strokeWidth="1.5"
            />
            {/* Crown Jewel Hologram */}
            <circle cx="100" cy="44" r="3.5" fill="#00f5d4" className="animate-pulse" />

            {/* Hair Outline - Flowing Cyber Locks */}
            <path
              d="M62 52 C50 65, 45 95, 52 140 C55 155, 62 165, 70 172"
              stroke="#fb7185"
              strokeWidth="1.8"
              strokeLinecap="round"
            />
            <path
              d="M138 52 C150 65, 155 95, 148 140 C145 155, 138 165, 130 172"
              stroke="#fb7185"
              strokeWidth="1.8"
              strokeLinecap="round"
            />
            <path
              d="M72 45 C80 65, 82 85, 78 115"
              stroke="#fda4af"
              strokeWidth="1"
              strokeOpacity="0.7"
            />
            <path
              d="M128 45 C120 65, 118 85, 122 115"
              stroke="#fda4af"
              strokeWidth="1"
              strokeOpacity="0.7"
            />

            {/* Face Oval & Elegant Jawline (Pakistani Kashmiri aesthetic) */}
            <path
              d="M70 75 C70 120, 85 148, 100 156 C115 148, 130 120, 130 75"
              stroke="#fecdd3"
              strokeWidth="1.8"
              strokeLinecap="round"
            />

            {/* Cybernetic Neural Visor / Headset on ear */}
            <path d="M128 85 L144 80 L146 100 L130 102 Z" fill="#00f5d4" fillOpacity="0.3" stroke="#00f5d4" strokeWidth="1.2" />
            <circle cx="140" cy="90" r="2.5" fill="#ffffff" />
            <path d="M142 93 L126 122" stroke="#00f5d4" strokeWidth="1" strokeDasharray="1 2" />

            {/* Elegant Eyes */}
            {/* Left Eye */}
            <path d="M80 92 Q88 86 96 92" stroke="#f43f5e" strokeWidth="1.5" strokeLinecap="round" />
            <circle cx="88" cy="93" r="2.8" fill={isSpeaking ? '#00f5d4' : '#fb7185'} />
            <circle cx="89" cy="92" r="0.9" fill="#ffffff" />

            {/* Right Eye (binks or winks on click) */}
            {isWinking ? (
              <path d="M104 93 Q112 96 120 93" stroke="#00f5d4" strokeWidth="2" strokeLinecap="round" />
            ) : (
              <>
                <path d="M104 92 Q112 86 120 92" stroke="#f43f5e" strokeWidth="1.5" strokeLinecap="round" />
                <circle cx="112" cy="93" r="2.8" fill={isSpeaking ? '#00f5d4' : '#fb7185'} />
                <circle cx="113" cy="92" r="0.9" fill="#ffffff" />
              </>
            )}

            {/* Slender Nose & Cute Pakistani Piercing / Nath Sparkle */}
            <path d="M99 92 L98 112 L103 114" stroke="#fecdd3" strokeWidth="1.2" strokeLinecap="round" />
            <circle cx="95" cy="112" r="1.2" fill="#00f5d4" className="animate-ping" />

            {/* Soft Smiling Lips */}
            <path
              d="M90 128 Q100 135 110 128"
              stroke={isSpeaking ? '#00f5d4' : '#f43f5e'}
              strokeWidth="1.8"
              strokeLinecap="round"
            />
            <path d="M94 128 Q100 131 106 128" stroke="#fb7185" strokeWidth="1" />

            {/* Cybernetic Circuit Traces on Cheeks */}
            <path d="M72 108 L80 114 L78 124" stroke="#00f5d4" strokeWidth="0.8" strokeOpacity="0.8" />
            <circle cx="78" cy="124" r="1.5" fill="#00f5d4" />

            {/* Collar & Cyber Armor */}
            <path d="M88 152 L84 175 M112 152 L116 175" stroke="#fecdd3" strokeWidth="1.2" />
            <path
              d="M74 172 C85 166, 115 166, 126 172 L138 185 L62 185 Z"
              fill="#881337"
              fillOpacity="0.4"
              stroke="#f43f5e"
              strokeWidth="1.4"
            />
          </svg>

          {/* Hologram speaking audio glow overlay */}
          {isSpeaking && (
            <div className="absolute inset-0 bg-cyan-400/10 pointer-events-none animate-pulse" />
          )}
        </div>

        {/* Ambient status indicators */}
        <div className="absolute -bottom-2.5 z-20 flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-black/90 border border-cyan-400/60 shadow-[0_0_10px_rgba(0,245,212,0.4)]">
          <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping" />
          <span className="text-[10px] font-mono font-bold tracking-wider text-cyan-300 uppercase">
            WASU CYBER OS
          </span>
        </div>
      </div>

      {/* Cyber Sub-Telemetry HUD */}
      <div className="mt-3 flex items-center gap-3 text-[11px] font-mono text-rose-300/80">
        <span className="flex items-center gap-1 text-cyan-300">
          <Zap className="w-3 h-3 text-cyan-400" />
          <span>SYNC 99.9%</span>
        </span>
        <span className="text-slate-600">|</span>
        <span className="flex items-center gap-1 text-rose-300">
          <Heart className="w-3 h-3 text-rose-400 fill-rose-500 animate-pulse" />
          <span>ROMANCE CORE: MAX</span>
        </span>
      </div>
    </div>
  );
};
