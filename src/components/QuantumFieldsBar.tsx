import React from "react";
import { Atom, Sparkles } from "lucide-react";
import { QUANTUM_FIELDS_DATA } from "../data/jarvisCatalog";
import { JarvisInterfaceThemeId } from "../types";
import { soundEffects } from "../services/soundEffects";

interface QuantumFieldsBarProps {
  activeThemeId?: JarvisInterfaceThemeId;
  onSelectTheme: (themeId: JarvisInterfaceThemeId) => void;
  compact?: boolean;
}

// Places all 7 theme names on glowing interactive Quantum Fields & displays the synced 3D Logo for each field
export const QuantumFieldsBar: React.FC<QuantumFieldsBarProps> = ({
  activeThemeId = "quantum_cockpit",
  onSelectTheme,
  compact = false,
}) => {
  return (
    <div className="relative z-20 w-full px-2 py-1.5 rounded-2xl bg-slate-950/80 border border-cyan-500/30 backdrop-blur-xl flex flex-wrap items-center justify-between gap-2">
      <div className="flex items-center gap-2 shrink-0 px-2">
        <Atom className="w-4 h-4 text-cyan-400 animate-spin" style={{ animationDuration: "8s" }} />
        <div className="leading-tight">
          <div className="text-[10px] font-orbitron font-bold text-cyan-300 tracking-wider">
            7 QUANTUM FIELDS
          </div>
          <div className="text-[8px] font-mono text-slate-400">
            THEMES + 3D FIELD LOGOS
          </div>
        </div>
      </div>

      <div className="flex-1 flex flex-wrap items-center gap-1.5 justify-start md:justify-end">
        {QUANTUM_FIELDS_DATA.map((field) => {
          const isActive = activeThemeId === field.themeId;
          return (
            <button
              key={field.themeId}
              type="button"
              onClick={() => {
                soundEffects.playBeepConfirm();
                onSelectTheme(field.themeId);
              }}
              title={`${field.fieldName} • 3D Logo: ${field.logo3DName} (${field.frequencyHz})`}
              className={`group relative px-2.5 py-1 rounded-xl border text-left transition-all cursor-pointer flex items-center gap-2 ${
                isActive
                  ? "bg-slate-900 text-white scale-[1.03]"
                  : "bg-slate-950/70 border-slate-800 text-slate-400 hover:text-slate-100 hover:border-slate-600"
              }`}
              style={{
                borderColor: isActive ? field.hex : undefined,
                boxShadow: isActive ? `0 0 18px ${field.hex}55` : undefined,
              }}
            >
              {/* Glowing Quantum Field Orb */}
              <span
                className={`w-2.5 h-2.5 rounded-full shrink-0 ${isActive ? "animate-ping" : ""}`}
                style={{
                  backgroundColor: field.hex,
                  boxShadow: `0 0 10px ${field.hex}`,
                }}
              />
              <div className="leading-tight">
                <div className="text-[10px] font-orbitron font-bold flex items-center gap-1">
                  <span>{field.shortName}</span>
                  {isActive && <Sparkles className="w-2.5 h-2.5" style={{ color: field.hex }} />}
                </div>
                {!compact && (
                  <div className="text-[8px] font-mono text-slate-400 truncate max-w-[130px]">
                    3D: {field.logo3DName} • {field.frequencyHz}
                  </div>
                )}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
