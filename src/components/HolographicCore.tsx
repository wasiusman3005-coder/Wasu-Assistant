import React from 'react';
import { Heart, Sparkles, Mic, Volume2 } from 'lucide-react';
import { MoodMode } from '../types';
import { playHeartbeatBeep } from '../services/speechService';

interface HolographicCoreProps {
  mood: MoodMode;
  isSpeaking: boolean;
  isListening: boolean;
  lovePercentage: number;
  onCoreClick?: () => void;
}

export const HolographicCore: React.FC<HolographicCoreProps> = ({
  mood,
  isSpeaking,
  isListening,
  lovePercentage,
  onCoreClick,
}) => {
  const handleHeartClick = () => {
    playHeartbeatBeep();
    onCoreClick?.();
  };

  const getMoodAura = () => {
    switch (mood) {
      case 'Bepanah Mohabbat':
        return 'from-rose-500/30 via-pink-600/20 to-red-950/40 border-rose-500/40 shadow-rose-500/25';
      case 'Pyari Shona':
        return 'from-pink-400/30 via-rose-400/20 to-purple-950/40 border-pink-400/40 shadow-pink-500/25';
      case 'Careful Caretaker':
        return 'from-amber-400/30 via-rose-500/20 to-orange-950/40 border-amber-400/40 shadow-amber-500/25';
      case 'Cyber Jarvis':
        return 'from-cyan-400/30 via-indigo-500/20 to-rose-950/40 border-cyan-400/40 shadow-cyan-500/25';
      default:
        return 'from-rose-500/30 via-pink-600/20 to-purple-950/40 border-rose-500/40 shadow-rose-500/25';
    }
  };

  return (
    <div className="relative flex flex-col items-center justify-center py-6 select-none">
      {/* Background radial glow */}
      <div
        className={`absolute w-64 h-64 rounded-full bg-gradient-to-tr ${getMoodAura()} blur-3xl pointer-events-none transition-all duration-700 ${
          isSpeaking ? 'scale-125 opacity-90' : isListening ? 'scale-110 opacity-80' : 'opacity-60'
        }`}
      />

      {/* Orbiting particles and outer ring */}
      <div className="relative w-44 h-44 flex items-center justify-center">
        {/* Outer futuristic ring */}
        <div
          className={`absolute inset-0 rounded-full border border-dashed border-rose-500/30 transition-transform duration-1000 ${
            isSpeaking ? 'animate-spin' : 'animate-[spin_20s_linear_infinite]'
          }`}
          style={{ animationDuration: isSpeaking ? '4s' : '18s' }}
        />

        {/* Second pulsing ring */}
        <div
          className={`absolute inset-2 rounded-full border border-rose-400/40 transition-all duration-500 ${
            isSpeaking
              ? 'animate-ping opacity-30'
              : isListening
              ? 'scale-105 border-cyan-400/50'
              : 'scale-100 opacity-60'
          }`}
        />

        {/* Third inner decorative ring */}
        <div className="absolute inset-4 rounded-full border border-rose-500/20 backdrop-blur-sm bg-black/40" />

        {/* Central Holographic Heart Core */}
        <button
          onClick={handleHeartClick}
          title="Click to feel Wasu's heartbeat"
          className="relative z-10 w-28 h-28 rounded-full bg-gradient-to-b from-rose-900/60 to-black/90 border border-rose-400/50 shadow-lg shadow-rose-950/80 flex flex-col items-center justify-center p-3 cursor-pointer hover:scale-105 active:scale-95 transition-all group"
        >
          {/* Animated Heart Icon */}
          <div className="relative flex items-center justify-center">
            <Heart
              className={`w-12 h-12 text-rose-400 transition-all duration-300 drop-shadow-[0_0_12px_rgba(244,63,94,0.8)] ${
                isSpeaking
                  ? 'scale-115 text-rose-300 fill-rose-500 animate-pulse'
                  : isListening
                  ? 'scale-110 text-cyan-300 fill-cyan-500'
                  : 'fill-rose-500/80 group-hover:scale-110'
              }`}
            />
            {/* Ambient spark indicator */}
            <Sparkles className="absolute -top-1 -right-1 w-4 h-4 text-amber-300 animate-bounce" />
          </div>

          {/* Micro Status Label */}
          <span className="text-[10px] font-semibold tracking-wider text-rose-200 mt-1 uppercase flex items-center gap-1">
            {isSpeaking ? (
              <>
                <Volume2 className="w-3 h-3 text-rose-300 animate-pulse" />
                Speaking
              </>
            ) : isListening ? (
              <>
                <Mic className="w-3 h-3 text-cyan-300 animate-pulse" />
                Listening
              </>
            ) : (
              <>WASU LOVE</>
            )}
          </span>
        </button>

        {/* Soundwave equalizer bars when speaking */}
        {isSpeaking && (
          <div className="absolute -bottom-3 flex items-center gap-1 z-20 bg-black/80 px-3 py-1 rounded-full border border-rose-500/40 shadow-sm">
            <div className="w-1 h-3 bg-rose-400 rounded-full animate-[bounce_0.6s_ease-in-out_infinite]" />
            <div className="w-1 h-5 bg-rose-300 rounded-full animate-[bounce_0.5s_ease-in-out_infinite_0.1s]" />
            <div className="w-1 h-4 bg-pink-400 rounded-full animate-[bounce_0.7s_ease-in-out_infinite_0.2s]" />
            <div className="w-1 h-2 bg-rose-400 rounded-full animate-[bounce_0.6s_ease-in-out_infinite_0.15s]" />
          </div>
        )}
      </div>

      {/* Love Meter & Sub-status */}
      <div className="mt-3 flex items-center gap-2 text-xs">
        <span className="text-rose-300/80 font-medium">Mohabbat Level</span>
        <span className="text-rose-400 font-bold tabular-nums">{lovePercentage}%</span>
        <span className="text-slate-600">·</span>
        <span className="text-rose-200/90 font-medium">{mood}</span>
      </div>
    </div>
  );
};
